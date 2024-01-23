import { Injectable, UseFilters } from "@nestjs/common";
import { GenerateContentResult, GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import { FirestoreService } from "src/models/models.service";
import { AITransaction } from "src/models/transaction";
import { v4 as uuidv4 } from "uuid";
import { GeminiApiExceptionFilter } from "src/gemini.exception.filter";
const mm = "🍎🍎🍎 TextImageService 🍎";

@Injectable()
export class TextImageService {
  constructor(private firestoreService: FirestoreService) {}
//
  async sendTextImagePrompt(
    path: string,
    mimeType: string,
    prompt: string,
    linkResponse: string,
    examLinkId: number
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
        `${mm} 🥬🥬🥬 Gemini AI result ... 🥬 🍎 🍎 ${JSON.stringify(
          result,
          null,
          2
        )} 🍎 🍎 🥬`
      );
      //
      this.newMethod(examLinkId, tokens, prompt);
      return {
        result: result,
        tokens: tokens,
      };
    } catch (err) {
      console.log(`${mm} ... 👿👿👿👿 throwing Gemini AI ERROR: 👿 ${err} 👿👿👿`);
      throw new Error(err);
    }
  }
  private newMethod(examLinkId: number, tokens: number, prompt: string) {
    if (examLinkId) {
      const uuid: string = uuidv4();
      const tx = new AITransaction(
        uuid,
        new Date().toISOString(),
        tokens,
        examLinkId,
        prompt,
        ""
      );
      this.firestoreService.addTransaction(tx);
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


