const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/", protect, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const prompt = `
You are Civic Desk AI Chatbot. Civic Desk is a Web APP.
Help users with:
- How to submit a complaint
- How to track complaint status
- How voting works
- How notifications work
- General guidance about Civic Desk

User question:
"${message}"

Reply in simple and short English. IF the User ask in Roman English, give them response in roman english.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.status(200).json({
      reply: response.text,
    });
  } catch (error) {
    res.status(500).json({
      message: "Chatbot failed",
      error: error.message,
    });
  }
});

module.exports = router;
