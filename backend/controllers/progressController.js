const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require("@google/genai");
const Student = require("../models/Student");
const { sendSMS, sendWhatsApp } = require("../utils/sendNotification");
const getDistance = require("../utils/distance");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 🏅 Helper: Generate certificate PDF
const generateCertificate = (student, milestone) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const fileName = `${student._id}_${milestone.replace(/\s/g, '_')}_${Date.now()}.pdf`;
        const filePath = path.join(__dirname, '../certificates', fileName);

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        doc.fontSize(20).text('🏅 Certificate of Achievement', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Presented to: ${student.name}`, { align: 'center' });
        doc.text(`Age: ${student.age}`, { align: 'center' });
        doc.moveDown();
        doc.text(`For: ${milestone}`, { align: 'center' });
        doc.moveDown(2);
        doc.text(`Issued on: ${new Date().toLocaleDateString()}`, { align: 'center' });

        doc.end();
        stream.on('finish', () => resolve(`/certificates/${fileName}`));
        stream.on('error', reject);
    });
};

// 🧠 Helper: Check if student qualifies for certificates
const evaluateCertificateEligibility = async (student, existingCertificates) => {
    const categories = ['social', 'creative', 'moral'];
    const newCertificates = [];

    for (const category of categories) {
        const scores = student.progress.map(p => p[category]?.level).filter(Boolean);
        if (scores.length < 3) continue;

        // 1. Consistent Performance
        for (let i = 0; i <= scores.length - 3; i++) {
            if (scores[i] >= 4 && scores[i + 1] >= 4 && scores[i + 2] >= 4) {
                const milestone = `Consistent Performer in ${category}`;
                if (!existingCertificates.find(c => c.milestone === milestone)) {
                    newCertificates.push(milestone);
                }
                break;
            }
        }

        // 2. Category Mastery
        if (scores.length >= 5) {
            const avg = scores.slice(-5).reduce((a, b) => a + b, 0) / 5;
            if (avg >= 4.5) {
                const milestone = `Category Mastery in ${category}`;
                if (!existingCertificates.find(c => c.milestone === milestone)) {
                    newCertificates.push(milestone);
                }
            }
        }
    }

    return newCertificates;
};

// ✅ Add progress entry
const addProgressEntry = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { social, creative, moral, note, lat, lng } = req.body;
        const mentorId = req.user._id;
        const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const student = await Student.findById(studentId);
        if (!student || !student.coordinates) {
            return res.status(404).json({ message: "Student or location not found" });
        }

        const distance = getDistance(Number(lat), Number(lng), student.coordinates.lat, student.coordinates.lng);
        if (distance > 1.0) {
            return res.status(403).json({ message: `You must be near the student’s home to add progress. Distance: ${distance.toFixed(2)} km` });
        }

        const entry = {
            social: { level: Number(social), note },
            creative: { level: Number(creative), note },
            moral: { level: Number(moral), note },
            note,
            photoUrl,
            addedBy: mentorId,
            date: new Date(),
        };

        student.progress.push(entry);

        // 🏅 Evaluate for certificates
        const newMilestones = await evaluateCertificateEligibility(student, student.certificates);
        for (const milestone of newMilestones) {
            const fileUrl = await generateCertificate(student, milestone);  // get full path string directly

            // Save certificate entry in student model
            student.certificates.push({
                milestone,
                fileUrl,
                issuedAt: new Date(),
            });

            // Construct full URL for SMS download link
            const fullDownloadLink = `${req.protocol}://${req.get('host')}${fileUrl}`;

            const msg = `🎉 ${student.name} has earned a new certificate:\n🏅 ${milestone}\n📄 Download: ${fullDownloadLink}`;
            if (student.parentContact) {
                await sendSMS(student.parentContact, msg);
                await sendWhatsApp(student.parentContact, msg);
            }
        }



        await student.save();
        res.status(200).json({ message: "✅ Progress saved", student });
    } catch (error) {
        console.error("Progress entry error:", error);
        res.status(500).json({ message: "Failed to save progress" });
    }
};

// 2. Suggest activity via Gemini
const suggestActivity = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { weakDimension, social, creative, moral, note = "" } = req.query;
        const scores = { social, creative, moral };

        const student = await Student.findById(studentId).populate("mentor");
        if (!student) return res.status(404).json({ message: "Student not found" });

        const mentor = student.mentor;

        const prompt = `
You are an expert grassroots education mentor coach. A mentor just completed a visit and needs help recommending one specific activity for a child to improve their weakest developmental area: **${weakDimension}**.

⚠️ Do not improve all areas — focus only on the weakest domain. But keep in mind the suggested activity for weakest domain should be aligned with their interests and skillset

Before suggesting the activity, first write **brief constructive feedback (2-3 lines)** for the student based on:
- their current scores
- the mentor’s note: "${note}"

Your feedback should sound encouraging but honest, pointing out the area needing growth.

---

👦 Student Profile:
- Name: ${student.name}
- Age: ${student.age || "around 10"}
- Interests: ${student.skillTags?.join(", ") || "none specified"}
- Languages: ${student.languages?.join(", ") || "not mentioned"}

🧑‍🏫 Mentor Info: ${mentor?.bio || "Not provided"} (do NOT mention their name)

📊 Current Scores:
- Social: ${scores?.social}
- Creative: ${scores?.creative}
- Moral: ${scores?.moral}

---

🧠 TASK:
Suggest **1 specific, low-cost, realistic activity** that helps ${student.name} develop *${weakDimension}* skills. Be very focused and age-appropriate. Do NOT suggest generic or multipurpose activities.

Only include details related to this domain:
- If **moral**: use dilemmas, empathy-building, storytelling, or role-play situations.
- If **social**: emphasize cooperation, communication, sharing, or confidence-building.
- If **creative**: use imagination, innovation, drawing, roleplay, design, or movement.

🔒 Rules:
- Must require no electronic devices or expensive materials
- Must match age and interests
- Easy to explain in 3-4 lines
- Avoid repeating earlier formats like building skits/stages
- End with how this builds the specific skill domain

---
✏️ Format your answer ONLY as clean JSON:
{
  "area": "${weakDimension}",
  "feedback": "Constructive feedback here",
  "activity": "Describe the activity here"
}
    `;

        const result = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
        });

        const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
        const cleanedText = rawText.replace(/^```json\s*/, "").replace(/\s*```$/, "");

        let activity;
        try {
            activity = JSON.parse(cleanedText);
        } catch (err) {
            console.error("Activity parsing error:", err);
            return res.status(500).json({
                message: "Failed to parse Gemini activity",
                raw: rawText,
            });
        }

        const parentMsg = `Hi, here’s feedback and a suggested activity for ${student.name}:\n\n📣 Feedback: ${activity.feedback}\n🎯 Activity: ${activity.activity}\n\n- Team Diksha (${new Date().toLocaleDateString()})`;

        if (student.parentContact) {
            await sendSMS(student.parentContact, parentMsg);
            await sendWhatsApp(student.parentContact, parentMsg);
        }

        res.status(200).json({ suggestion: activity });
    } catch (error) {
        console.error("Gemini activity error:", error);
        res.status(500).json({ message: "Failed to generate activity" });
    }
};

module.exports = {
    addProgressEntry,
    suggestActivity,
};
