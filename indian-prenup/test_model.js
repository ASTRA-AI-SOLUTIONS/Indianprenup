import { GoogleGenAI } from "@google/genai";
async function run() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: "hello"
    });
    console.log("Success gemini-3.1-pro-preview");
  } catch (e) {
    console.log("ERROR 3.1:", e.message);
  }
}
run();
