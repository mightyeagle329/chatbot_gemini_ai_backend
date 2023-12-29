import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';

const mm = '🍎🍎🍎 TextImageService 🍎';

@Injectable()
export class TextImageService {
  async sendTextImagePrompt(
    path: string,
    mimeType: string,
    prompt: string,
    linkResponse: string
  ): Promise<any> {
    //
    console.log(`${mm} sending prompt to Gemini AI: ${prompt}`);
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const { totalTokens } = await model.countTokens(prompt);
    console.log(`${mm} Gemini AI tokens: 🍎 ${totalTokens} 🍎`);

    const imageParts = [this.fileToGenerativePart(path, mimeType)];

    let mPrompt: string;
    if (linkResponse === 'true'){
      mPrompt = prompt + this.getPromptSuffixList();
    } else {
      mPrompt = prompt + this.getPromptSuffixText();
    }
    const result = await model.generateContent([mPrompt, ...imageParts]);
    const response = result.response;
    const text = response.text();
    console.log(
      `${mm} 🥬🥬🥬 Gemini AI response: 🥬 ${JSON.stringify(
        response,
        null,
        2
      )} 🥬`
    );
    return text;
  }
  // Converts local file information to a GoogleGenerativeAI.Part object.
  fileToGenerativePart(path: string, mimeType: string) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType,
      },
    };
  }

  getPromptSuffixList(): string {
    return "\nAlso, tell me what is in the picture. Return response as a list of json objects with title, description, link";
  }
  getPromptSuffixText(): string {
    return "\nAlso, tell me what is in the picture. Return response as a list of titled paragraphs";
  }
}
