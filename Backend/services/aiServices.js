const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const classifyComplaint = async (description) => {
  try {
    const prompt = `
You are an NLP complaint classification system.

Classify the following complaint and assign it to the correct department.

Complaint:
"${description}"

Allowed categories:
Water, Road, Electricity, Cleanliness, General

Allowed departments:
Water Department, Road Maintenance Department, Electricity Department, Sanitation Department, General Department

Return ONLY valid JSON in this format:
{
  "category": "Water",
  "department": "Water Department"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text.replace(/```json|```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.log("AI Classification Error:", error.message);

    return {
      category: "General",
      department: "General Department",
    };
  }
};

module.exports = { classifyComplaint };
// just for checking that the key is loaded perfectly or not
// console.log("Gemini Key Loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");
