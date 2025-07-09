const { GoogleGenAI } = require("@google/genai");
const Student = require("../models/Student");
const User = require("../models/User");
const { sendSMS, sendWhatsApp } = require('../utils/sendNotification');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const suggestMentorMatch = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { excludedMentors = [] } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });
    if (student.mentor) return res.status(400).json({ message: "Mentor already assigned" });

    const approvedMentors = await User.find({
      role: "mentor",
      isApproved: true,
      _id: { $nin: excludedMentors },
    });

    if (!approvedMentors.length) {
      return res.status(400).json({ message: "No approved mentors available" });
    }

    const prompt = `
You are an intelligent matching assistant for an NGO working with children and mentors.

Goal: Recommend ONE best mentor for the given student based on shared skills, language, and compatibility. Skip mentors who have already been excluded.

Student:
{
  "name": "${student.name}",
  "skills": ${JSON.stringify(student.skillTags || [])},
  "languages": ${JSON.stringify(student.languages || [])}
}

Mentor pool:
${approvedMentors
  .map((mentor) => {
    return `{
  "id": "${mentor._id}",
  "name": "${mentor.name}",
  "expertise": ${JSON.stringify(mentor.expertise || [])},
  "languages": ${JSON.stringify(mentor.languages || [])}
}`;
  })
  .join(",\n")}

Now choose the MOST suitable mentor.

Return ONLY a JSON like this:
{
  "mentorId": "MongoDB ObjectId of best match",
  "mentorName": "Name",
  "reason": "Why this mentor fits"
}

No extra text. Only JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    const cleanedText = rawText.replace(/^```json\s*/, "").replace(/\s*```$/, "");

    let match;
    try {
      match = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Gemini response parsing failed:", parseError);
      return res.status(500).json({
        message: "Failed to parse Gemini response",
        rawResponse: rawText,
      });
    }

    const matchedMentor = approvedMentors.find(
      (m) => m._id.toString() === match.mentorId
    );

    if (!matchedMentor) {
      return res.status(404).json({ message: "Mentor not found", match });
    }

    res.status(200).json({
      message: `Suggested match: ${matchedMentor.name}`,
      mentorId: matchedMentor._id,
      mentorName: matchedMentor.name,
      reason: match.reason,
    });
  } catch (error) {
    console.error("Gemini matching error:", error);
    res.status(500).json({ message: "Mentor matching failed" });
  }
};

const approveMatch = async (req, res) => {
  const { studentId, mentorId } = req.body;

  try {
    const student = await Student.findById(studentId).populate('parent');
    const mentor = await User.findById(mentorId);

    if (!student || !mentor) {
      return res.status(404).json({ message: "Student or Mentor not found" });
    }

    student.mentor = mentor._id;
    await student.save();

    const parentPhone = student.parentContact || student.parent?.phone;
    const mentorName = mentor.name;
    const mentorPhone = mentor.phone || mentor.contact || '';

    const message = `📢 Mentor Assigned!\n${mentorName} has been assigned as a mentor for your child ${student.name}.\nYou can contact them at ${mentorPhone}.`;

    if (parentPhone) {
      await sendSMS(parentPhone, message);
      await sendWhatsApp(parentPhone, message);
    } else {
      console.warn("⚠️ No parent phone number available to send notifications.");
    }

    res.status(200).json({ message: "✅ Mentor assigned", student });
  } catch (error) {
    console.error("Mentor assignment error:", error);
    res.status(500).json({ message: "Assignment failed" });
  }
};


module.exports = {
  suggestMentorMatch,
  approveMatch,
};
