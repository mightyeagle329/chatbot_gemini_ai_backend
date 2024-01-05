import { Injectable } from "@nestjs/common";
import { GenerateContentResult, GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";

const mm = "🍎🍎🍎 TextImageService 🍎";

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

    console.log(
      `${mm} ... Gemini AI path: 🍎 ${path} 🍎 mimeType: ${mimeType}`
    );

    try {
      const imageParts = [this.fileToGenerativePart(path, mimeType)];

      let mPrompt: string;
      if (linkResponse === "true") {
        mPrompt = prompt + this.getPromptSuffixList();
      } else {
        mPrompt = prompt + this.getPromptSuffixText();
      }
      console.log(`${mm} ... Gemini AI imageParts: 🍎 ${imageParts.length} 🍎`);

      const result = await model.generateContent([mPrompt, ...imageParts]);
      const { totalTokens } = await model.countTokens(prompt);
      const tokensResponse = await model.countTokens(imageParts);

      const tokens = tokensResponse.totalTokens + totalTokens;

      console.log(
        `${mm} ... Gemini AI prompt tokens: 🍎 ${totalTokens} 
        🍎 imageParts tokens: ${tokensResponse.totalTokens} total: ${tokens}`
      );
      console.log(
        `${mm} 🥬🥬🥬 Gemini AI result ...: 🥬 🍎 🍎 ${JSON.stringify(
          result,
          null,
          2
        )} 🍎 🍎 🥬`
      );
      return {
        result: result,
        tokens: tokens,
      };
    } catch (err) {
      console.log(`${mm} ... Gemini AI ERROR: 🍎 ${err} 🍎`);
      throw err;
    }
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


