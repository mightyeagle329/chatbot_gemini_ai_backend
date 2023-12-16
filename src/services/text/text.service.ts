import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

const mm = '🍐🍐🍐 TextService 🍐 ';
@Injectable()
export class TextService {
  async sendPrompt(prompt: string): Promise<any> {
    //
    console.log(`${mm} sending prompt to Gemini AI: ${prompt}`);

    const key = process.env.GEMINI_API_KEY;
    console.log(`${mm} Gemini AI API key: ${key}`);
    const genAI = new GoogleGenerativeAI(key);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const { totalTokens } = await model.countTokens(prompt);
    console.log(`${mm} Gemini AI tokens: 🍎 ${totalTokens} 🍎`);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log(
      `${mm} 🥬🥬🥬 Gemini AI response: 🥬 ${JSON.stringify(
        response,
        null,
        2,
      )} 🥬`,
    );
    return text;
  }
}
