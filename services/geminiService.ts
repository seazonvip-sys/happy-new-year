
import { GoogleGenAI, Type } from "@google/genai";
import { CyberWish } from "../types";

export async function generateCyberWish(prompt: string): Promise<CyberWish> {
  try {
    // Safely access process.env to avoid ReferenceError in browser
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
    
    if (!apiKey) {
      console.warn("API Key is missing. Using fallback content.");
      return {
        title: "新年快乐",
        content: "愿你在新的一年里，算力无限，系统永不宕机。"
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a futuristic digital poet in the year 2025. ${prompt}. Keep it short and impactful. Use Chinese.`,
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
      title: "数据流异常",
      content: "虽然连接被扰动，但祝福的比特流已穿越防火墙到达。"
    };
  }
}
