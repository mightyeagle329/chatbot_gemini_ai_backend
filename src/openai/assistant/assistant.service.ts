import { Injectable } from "@nestjs/common";
import { AssistantCreate } from "./dto/models";
import Message from "openai";
import OpenAI from "openai";

const mm = "🍎🍎🍎 AssistantService : ";
import { ThreadCreateParams } from "openai/resources/beta/threads/threads";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log(`${mm} ... my key : ${process.env.OPENAI_API_KEY}`);
/**
 * AssistantService implements the OpenAI Assistant API
 */
@Injectable()
export class AssistantService {
  async createAssistant(assistantCreate: AssistantCreate): Promise<any> {
    console.log(
      `${mm} ... creating assistant : ${JSON.stringify(assistantCreate)}`
    );
    const myAssistant = await openai.beta.assistants.create(
      JSON.parse(JSON.stringify(assistantCreate))
    );

    console.log(`${mm} assistant created: ${JSON.stringify(myAssistant)}`);
    return myAssistant;
  }

  async createMessage(
    threadId: string,
    content: string
  ): Promise<Message.Beta.Threads.Messages.ThreadMessage> {
    let msgCreateParams: Message.Beta.Threads.MessageCreateParams = {
      content: content,
      role: "user",
    };
    console.log(`${mm} ... creating message : ${threadId} - ${content}`);
    const threadMessage = await openai.beta.threads.messages.create(
      threadId,
      msgCreateParams
    );

    return threadMessage;
  }

  async runThread(
    threadId: string,
    assistantId: string,
    statusIntervalInSeconds: number
  ): Promise<any> {
    console.log(
      `${mm} ... runThread : assistantId: ${assistantId} threadId: ${threadId} statusIntervalInSeconds: ${statusIntervalInSeconds}`
    );
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    let interval = 5000;
    if (statusIntervalInSeconds) {
      interval = statusIntervalInSeconds;
    }

    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        const mRun = await this.checkRunStatus(threadId, run.id);
        switch (mRun.status) {
          case "queued":
            console.log(`${mm} Thread run: queued status`);
            break;
          case "in_progress":
            console.log(`${mm} Thread run: in_progress status`);
            break;
          case "requires_action":
            console.log(`${mm} Thread run: requires_action status`);
            break;
          case "cancelling":
            console.log(`${mm} Thread run: cancelling status`);
            break;
          case "cancelled":
            console.log(`${mm} Thread run: cancelled status`);
            break;
          case "failed":
            console.log(`${mm} Thread run: failed status`);
            clearInterval(intervalId);
            reject(new Error("Run failed"));
            break;
          case "completed":
            console.log(
              `${mm} Thread run: 🍎 completed status 🍎 completed at: ${run.completed_at}`
            );
            clearInterval(intervalId);
            resolve(run);
            break;
          case "expired":
            console.log(`${mm} Thread run: expired status`);
            clearInterval(intervalId);
            reject(new Error("Run expired"));
            break;
        }
      }, interval);
    });
  }

  async checkRunStatus(threadId: string, runId: string): Promise<any> {
    console.log(`${mm} checking run status ...`);
    const run = await openai.beta.threads.runs.retrieve(threadId, runId);
    return run;
  }

  async createThread(
    threadMessages: Message.Beta.Threads.ThreadCreateParams.Message[],
    metaData: any
  ): Promise<any> {
    let params: ThreadCreateParams;
    if (threadMessages && threadMessages.length > 0) {
      params = {
        messages: threadMessages,
      };
    }
    console.log(`${mm} creating thread ...`);

    let thread: Message.Beta.Threads.Thread;
    if (params) {
      thread = await openai.beta.threads.create(params);
    } else {
      thread = await openai.beta.threads.create();
    }
    console.log(`${mm} thread created: 🍎🍎🍎 ${JSON.stringify(thread)} ...`);

    return thread;
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<any> {
    let assistantFiles: Message.Files.FileObject[] = [];
    try {
      const convertedFiles: File[] = this.convertToFiles(files);

      for (const file of convertedFiles) {
        const fileResult = await openai.files.create({
          file: file,
          purpose: "assistants",
        });
        assistantFiles.push(fileResult);
      }
      console.log(
        `${mm} assistant files uploaded: 🍎 ${assistantFiles.length} 🍎`
      );

      return assistantFiles;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  }
  convertToFiles(files: Express.Multer.File[]): File[] {
    return files.map((file) => file as unknown as File);
  }
  async listModels(): Promise<any[]> {
    const list = await openai.models.list();
    const mList: any[] = [];

    for await (const model of list) {
      mList.push(model);
      console.log(`${mm} OpenAI model: ${model}`);
    }
    console.log(`${mm} OpenAI models found: 🍎 ${mList.length} 🍎`);
    mList.forEach((model) => {
      console.log(`${mm} OpenAI model: 🍎 ${JSON.stringify(model)} 🍎`);
    });
    return mList;
  }
}
