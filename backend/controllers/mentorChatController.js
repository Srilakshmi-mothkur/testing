// controllers/mentorChatController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Student = require("../models/Student");

class MentorAIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    this.chatSessions = {}; // key: mentorId, value: chat instance
  }

  async prepareStudentData(mentorId) {
    const students = await Student.find({ mentor: mentorId }).lean();
    return students.map((s) => ({
      name: s.name,
      age: s.age,
      gender: s.gender,
      skills: s.skillTags,
      progress: s.progress.map((p) => ({
        date: p.date,
        social: p.social.level,
        creative: p.creative.level,
        moral: p.moral.level,
        note: p.note,
      })),
    }));
  }

  async initializeChatSession(mentorId, studentData) {
    const introMessage = `
You are a smart mentor assistant. Here's the student data:

${JSON.stringify(studentData, null, 2)}

Answer mentor queries based only on this data.
Be precise, use examples from data where possible.
`;

    const chat = this.model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: introMessage }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
      },
    });

    this.chatSessions[mentorId] = chat;
    return chat;
  }

  async handleMessage(mentorId, userMessage) {
    let chat = this.chatSessions[mentorId];

    if (!chat) {
      const studentData = await this.prepareStudentData(mentorId);
      chat = await this.initializeChatSession(mentorId, studentData);
    }

    // Send user message
    const response = await chat.sendMessage(userMessage);

    return response.response.text();
  }

  resetSession(mentorId) {
    delete this.chatSessions[mentorId];
  }
}

const mentorAI = new MentorAIService();

const handleMentorChat = async (req, res) => {
  try {
    const mentorId = req.user._id.toString();
    const userMessage = req.body.message;

    const reply = await mentorAI.handleMessage(mentorId, userMessage);

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Mentor Chat Error:", err.message);
    res.status(500).json({ message: "Failed to respond to mentor query." });
  }
};

module.exports = { handleMentorChat };
