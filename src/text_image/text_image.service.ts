import { HttpException, HttpStatus, Injectable, UseFilters } from "@nestjs/common";
import {
  CountTokensResponse,
  GenerateContentResult,
  GoogleGenerativeAI,
  Part,
} from "@google/generative-ai";
import * as fs from "fs";
// import { FirestoreService } from "src/models/models.service";
import { AITransaction } from "src/models/transaction";
import { v4 as uuidv4 } from "uuid";
import { GeminiApiExceptionFilter } from "src/gemini.exception.filter";
import { FirestoreService } from "src/models/models.service";
const mm = "🍎 🍎 🍎 GeminiTextImageService 🍎";

@Injectable()
export class GeminiTextImageService {
  constructor(private firestoreService: FirestoreService) {}
  //
  async sendTextImagePrompt(
    path: string,
    mimeType: string,
    prompt: string,
    userId: number,
    organizationId: number,
    examLinkId: number
  ): Promise<any> {
    //
    console.log(`${mm} sending prompt with 1 image to Gemini AI: ${prompt}`);
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const imageParts = [this.fileToGenerativePart(path, mimeType)];
    const result: GenerateContentResult = await model.generateContent([
      ...imageParts,
      prompt,
    ]);

    const { totalTokens: promptTokens } = await model.countTokens(prompt);
    const tokensResponse = await model.countTokens(imageParts);
    const tokens = tokensResponse.totalTokens + promptTokens;

    console.log(
      `${mm} ... Gemini AI work done. prompt tokens: 🍎 ${promptTokens} 
        🍎 imageParts tokens: ${tokensResponse.totalTokens} total: ${tokens}`
    );
console.log(
  `${mm} ... Gemini AI work done. 
        🍎 response: ${JSON.stringify(result)} 🍎`
);
    //this.writeToFirestore(examLinkId, tokens, prompt, userId, organizationId);
    return {
      result: result,
      tokens: tokens,
    };
  }
  async countGeminiTokens(
    paths: string[],
    mimeType: string,
    prompt: string,

    modelName: string
  ): Promise<number> {
    //
    console.log(
      `${mm} countGeminiTokens: prompt: ${prompt} - mimeType: ${mimeType}`
    );
    if (!modelName) {
      return 9;
    }
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: modelName });

    const list: any[] = [];
    paths.forEach((path) => {
      list.push(this.fileToGenerativePart(path, mimeType));
    });

    const imageParts:Part[] = list;
  
    const promptTokens  = await model.countTokens(prompt);
    const imageTokensResponse = await model.countTokens(imageParts);
    const tokens = imageTokensResponse.totalTokens + promptTokens.totalTokens;

    console.log(
      `${mm} ... Gemini AI work done. prompt tokens: 🍎 ${promptTokens} 
        🍎 imageParts tokens: ${imageTokensResponse.totalTokens} 🍎 totalTokens: ${tokens}`
    );
    //
    return tokens;
  }

  async sendTextImagesPrompt(
    paths: string[],
    mimeType: string,
    prompt: string,
    userId: number,
    organizationId: number,
    examLinkId: number
  ): Promise<any> {
    //
    console.log(
      `${mm} sending prompt with ${paths.length} images to Gemini AI: ${prompt}`
    );
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const list: any[] = [];
    paths.forEach((path) => {
      list.push(this.fileToGenerativePart(path, mimeType));
    });

    const imageParts = list;
    const result: GenerateContentResult = await model.generateContent([
      prompt,
      ...imageParts,
    ]);
    const { totalTokens: promptTokens } = await model.countTokens(prompt);
    const imageTokensResponse = await model.countTokens(imageParts);
    const tokens = imageTokensResponse.totalTokens + promptTokens;

    console.log(
      `${mm} ... Gemini AI work done. prompt tokens: 🍎 ${promptTokens} 
        🍎 imageParts tokens: ${imageTokensResponse.totalTokens} 🍎 totalTokens: ${tokens}`
    );
    //
    //this.writeToFirestore(examLinkId, tokens, prompt, userId, organizationId);
    return {
      result: result,
      tokens: tokens,
    };
  }
  // private writeToFirestore(
  //   examLinkId: number,
  //   tokens: number,
  //   prompt: string,
  //   userId: number,
  //   organizationId: number
  // ) {
  //   if (examLinkId) {
  //     const uuid: string = uuidv4();
  //     const tx = new AITransaction(
  //       uuid,
  //       new Date().toISOString(),
  //       tokens,
  //       examLinkId,
  //       prompt,
  //       userId,
  //       organizationId
  //     );
  //     this.firestoreService.addAITransaction(tx);
  //   }
  // }

  // Converts local file information to a GoogleGenerativeAI.Part object.
  fileToGenerativePart(path: string, mimeType: string) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType,
      },
    };
  }
}
