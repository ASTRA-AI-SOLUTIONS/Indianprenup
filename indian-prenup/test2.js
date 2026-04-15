import { GoogleGenAI } from "@google/genai";
async function run() {
  try {
    const ai = new GoogleGenAI({ apiKey: undefined });
    await ai.models.generateContent({
      model: "gemini-3.1-flash-preview",
      contents: "hello"
    });
    console.log("Success");
  } catch (e) {
    console.log("ERROR:", e.message);
  }
}
run();
