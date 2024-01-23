import { Injectable } from "@nestjs/common";
import {
  EnhancedGenerateContentResponse,
  GoogleGenerativeAI,
} from "@google/generative-ai";

const mm = "🍐🍐🍐 TextService 🍐 ";
@Injectable()
export class TextService {
  async sendChatPrompt(
    prompt: string
  ): Promise<EnhancedGenerateContentResponse> {
    //
    console.log(`${mm} sending prompt to Gemini AI: ${prompt}`);

    const key = process.env.GEMINI_API_KEY;
    console.log(`${mm} Gemini AI API key: ${key}`);
    const genAI = new GoogleGenerativeAI(key);
    //
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat();
    const result = await chat.sendMessageStream(prompt);
    const response = await result.response;
    const text = response.text;

    const tokenResponse = await model.countTokens(prompt);

    console.log(`${mm} Gemini AI tokens expended: 🍎 ${tokenResponse.totalTokens} 🍎`);
    console.log(`${mm} 🥬🥬🥬 ... Gemini AI response.text: 🥬 ${text} 🥬`);
    return response;
  }
}
