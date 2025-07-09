const { GoogleGenAI } = require('@google/genai');
const Student = require('../models/Student');
const analyzeTrends = require('../utils/trendData');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getStudentWiseInsights = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const students = await Student.find({ mentor: mentorId });

    if (!students.length) {
      return res.status(404).json({ message: 'No assigned students found.' });
    }

    const studentInsights = [];

    for (let student of students) {
      if (!student.progress || student.progress.length === 0) {
        console.log(`⏭️ Skipping ${student.name}: No progress data`);
        continue;
      }

      const trend = analyzeTrends(student.progress);

      const prompt = `
You are an education expert analyzing a child's development based on mentor-submitted progress updates.

👦 Student: ${student.name} (${student.age} yrs)
✍️ Notes History: ${trend.notes.join(' | ')}
📆 Progress Dates: ${trend.dates.join(', ')}

📊 Scores over time:
- Social: [${trend.social.join(', ')}]
- Creative: [${trend.creative.join(', ')}]
- Moral: [${trend.moral.join(', ')}]

---

🧠 TASK:
Based on the above, analyze how this student is developing across all three areas.
- Identify strengths and weaknesses
- Describe improvement or decline trends
- Offer mentor feedback (in 2-3 lines)
- Format response as JSON only:

{
  "student": "${student.name}",
  "feedback": "Brief feedback for mentor",
  "trendSummary": "What’s improving or falling?",
  "recommendation": "1 action for mentor to focus next"
}
`;

      const result = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
      });

      const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      const cleaned = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '');

      try {
        const parsed = JSON.parse(cleaned);
        studentInsights.push(parsed);
      } catch (parseErr) {
        console.error(`❌ JSON parse failed for ${student.name}:`, cleaned);
        console.error(parseErr);
      }
    }

    res.status(200).json({ insights: studentInsights });
  } catch (err) {
    console.error('Student-wise AI Insights error:', err);
    res.status(500).json({ message: 'Failed to generate student insights' });
  }
};

const getTopAndLeastPerformerInsights = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const students = await Student.find({ mentor: mentorId });

    if (!students.length) {
      return res.status(404).json({ message: 'No assigned students found.' });
    }

    let topScore = -Infinity;
    let leastScore = Infinity;
    let topPerformer = null;
    let leastPerformer = null;

    for (let student of students) {
      if (!student.progress || student.progress.length === 0) continue;

      const trend = analyzeTrends(student.progress);

      const avgTotal = (
        trend.social.reduce((a, b) => a + b, 0) +
        trend.creative.reduce((a, b) => a + b, 0) +
        trend.moral.reduce((a, b) => a + b, 0)
      ) / (3 * trend.social.length);

      if (avgTotal > topScore) {
        topScore = avgTotal;
        topPerformer = { student, avg: avgTotal };
      }

      if (avgTotal < leastScore) {
        leastScore = avgTotal;
        leastPerformer = { student, avg: avgTotal };
      }
    }

    if (!topPerformer || !leastPerformer) {
      return res.status(400).json({ message: 'Insufficient progress data to compare performers.' });
    }

    const comparisonPrompt = `
You are reviewing two student performance summaries from a mentorship program.

🏆 Top Performer: ${topPerformer?.student.name}
- Avg Score: ${topPerformer?.avg.toFixed(2)}

😞 Least Performer: ${leastPerformer?.student.name}
- Avg Score: ${leastPerformer?.avg.toFixed(2)}

TASK:
Explain briefly why each is in their position, and suggest one action to help the least performer improve.

Respond as clean JSON only:
{
  "topPerformerReason": "Why top performer is succeeding",
  "leastPerformerIssue": "Main area of struggle",
  "mentorAdvice": "1 action to help the struggling student"
}
`;

    const compResult = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: comparisonPrompt,
    });

    const rawComp = compResult?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    const cleanedComp = rawComp.replace(/^```json\s*/, '').replace(/\s*```$/, '');

    let comparisonSummary = {};
    try {
      comparisonSummary = JSON.parse(cleanedComp);
    } catch (err) {
      console.error('❌ Failed to parse comparison summary:', cleanedComp);
      return res.status(500).json({ message: 'AI response parsing failed' });
    }

    res.status(200).json({
      topPerformer: topPerformer?.student.name,
      leastPerformer: leastPerformer?.student.name,
      comparisonSummary
    });
  } catch (err) {
    console.error('Top/Least Performer AI error:', err);
    res.status(500).json({ message: 'Failed to generate top/least performer comparison' });
  }
};

module.exports = {
  getStudentWiseInsights,
  getTopAndLeastPerformerInsights,
};
