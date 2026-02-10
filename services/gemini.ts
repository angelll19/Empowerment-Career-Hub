
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  checkApiKey: async () => {
    if (window.aistudio?.hasSelectedApiKey) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }
    }
  },

  chat: async (message: string) => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: message,
      config: {
        systemInstruction: "You are an empowerment career coach. Use terms like 'Growth Circles' and 'Impact Projects'. Be supportive and professional.",
      }
    });
    return response.text;
  },

  stylizeAvatar: async (base64Image: string) => {
    const ai = getAI();
    try {
      // Robustly extract base64 data
      let data = base64Image;
      let mimeType = 'image/jpeg';
      
      if (base64Image.includes('base64,')) {
        const parts = base64Image.split('base64,');
        data = parts[1];
        mimeType = parts[0].split(':')[1].split(';')[0];
      }

      // Defensive check: API might fail on very large images
      // If we had a resizer utility, we'd use it here. 
      // For now, ensure we pass the data part correctly.
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: data, mimeType: mimeType } },
            { text: "Generate a stylized, highly professional 3D anime/Pixar-style 3D avatar headshot based on this person. The style should be clean, modern, and high-fidelity, like a character from a premium 3D networking platform. Maintain facial shape, hair color, and expression. The background should be a subtle, glowing gradient." }
          ]
        }
      });

      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
    } catch (error) {
      console.error("Gemini Stylization Error:", error);
      // Fallback to original if API fails
    }
    return base64Image;
  }
};
