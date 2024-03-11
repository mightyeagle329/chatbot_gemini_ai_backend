import { Injectable } from "@nestjs/common";
import {
  ChatSession,
  GoogleGenerativeAI,
  StartChatParams,
} from "@google/generative-ai";
import { ChatRoleContext } from "./history_config";

const mm = "🍎🍎🍎 ChatsService 🍎";

@Injectable()
export class ChatsService {
  async sendChatPrompt(prompt: string, linkResponse: boolean): Promise<any> {
    //
    console.log(`${mm} sending prompt to Gemini AI: ${prompt}`);
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    console.log(`${mm} Gemini AI API key: ${key}`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { totalTokens } = await model.countTokens(prompt);
    console.log(`${mm} Gemini AI tokens: 🍎 ${totalTokens} 🍎`);

    let history: any[];
    if (linkResponse) {
      history = ChatRoleContext.getResponseWithLinks();
    } else {
      history = ChatRoleContext.getResponseWithText();
    }
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(prompt);

    const response = result.response.text();
    const candidates = result.response.candidates;
    const promptFeedback = result.response.promptFeedback;
    //
    if (candidates) {
      console.log(
        `${mm} 🥬🥬🥬 Gemini AI CANDIDATES 🥐 ${JSON.stringify(
          candidates,
          null,
          2
        )} `
      );
    }
    if (promptFeedback) {
      console.log(
        `${mm} 🥬🥬🥬 Gemini AI PROMPT FEEDBACK 🥐 ${JSON.stringify(
          promptFeedback,
          null,
          2
        )} `
      );
    }

    console.log(
      `${mm} 🥬🥬🥬 Gemini AI response, check tokens: 🥬 ${response} ... 🥬`
    );
    return result;
  }
}
