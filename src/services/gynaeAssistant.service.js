const { GoogleGenAI } = require("@google/genai");

const GEMINI_MODEL = "gemini-3.6-flash";

const generateGynaeResponse = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is not configured"
    );
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });

  return response.text || "";
};

module.exports = {
  generateGynaeResponse,
};