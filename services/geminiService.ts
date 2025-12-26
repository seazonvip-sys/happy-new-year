
import { GoogleGenAI, Type } from "@google/genai";
import { CyberWish } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function generateCyberWish(prompt: string): Promise<CyberWish> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a futuristic digital poet in the year 2025. ${prompt}. Keep it short and impactful.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
          },
          required: ["title", "content"],
        },
      },
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      title: "系统异常",
      content: "数据流由于不可抗力中断，但愿你的新年依然如光纤般顺滑。"
    };
  }
}
