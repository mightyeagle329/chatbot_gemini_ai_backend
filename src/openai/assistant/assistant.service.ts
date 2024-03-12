import { Injectable } from "@nestjs/common";
import { Assistant } from "./dto/models";
import Message from "openai";
import OpenAI from "openai";

const mm = "🍎🍎🍎 AssistantService : ";
import { ThreadCreateParams } from "openai/resources/beta/threads/threads";
import * as fs from "fs";

import * as path from "path";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log(`${mm} ... my key : ${process.env.OPENAI_API_KEY}`);
/**
 * AssistantService implements the OpenAI Assistant API
 */
@Injectable()
export class AssistantService {
  async createAssistant(
    assistant: Assistant
  ): Promise<Message.Beta.Assistants.Assistant> {
    console.log(
      `${mm} ... creating assistant : 🔵 ${JSON.stringify(assistant)}`
    );
    const fileIds = [];
    if (assistant.fileIds.length > 0) {
      assistant.fileIds.forEach((a) => {
        fileIds.push(a);
      });
    }
    const ass: Message.Beta.Assistants.AssistantCreateParams = {
      model: assistant.model,
      file_ids: fileIds,
      description: assistant.description,
      name: assistant.name,
      tools: [{ type: "retrieval" }],
      instructions: assistant.instructions,
    };
    //
    const assistantCreated = await openai.beta.assistants.create(ass);
    console.log(
      `${mm} assistant created: 🔵 ${JSON.stringify(assistantCreated)}`
    );

    return assistantCreated;
  }

  async createAssistantFile(
    assistantId: string,
    fileId: string
  ): Promise<Message.Beta.Assistants.Files.AssistantFile> {
    const myAssistantFile = await openai.beta.assistants.files.create(
      assistantId,
      {
        file_id: fileId,
      }
    );
    return myAssistantFile;
  }

  async getAssistantFiles(
    assistantId: string
  ): Promise<Message.Beta.Assistants.Files.AssistantFilesPage> {
    const myAssistantFiles =
      await openai.beta.assistants.files.list(assistantId);
    return myAssistantFiles;
  }

  async listAssistants(): Promise<Message.Beta.Assistants.AssistantsPage> {
    const params: Message.Beta.Assistants.AssistantListParams = {
      order: "desc",
      limit: 100,
    };
    const myAssistants = await openai.beta.assistants.list(params);
    console.log(
      `${mm} Assistants found: 🔵 🔵 🔵 ${myAssistants.data.length} 🔵`
    );
    myAssistants.data.forEach((ass) => {
      console.log(
        `${mm} Assistant: 🔵 ${ass.name} 🔵 model: ${ass.model} 🔵 ${ass.description}`
      );
    });

    return myAssistants;
  }

  async createMessage(
    threadId: string,
    content: string, fileId: string
  ): Promise<Message.Beta.Threads.Messages.ThreadMessage> {
    let msgCreateParams: Message.Beta.Threads.MessageCreateParams = {
      content: content,
      role: "user",
      file_ids: fileId == null? []: [fileId],
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
  ): Promise<Message.Beta.Threads.Runs.Run> {
    console.log(
      `${mm} ... runThread : assistantId: ${assistantId} threadId: ${threadId} `
    );
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    return run;
  }

  async checkRunStatus(
    threadId: string,
    runId: string
  ): Promise<Message.Beta.Threads.Runs.Run> {
    console.log(
      `${mm} getting thread run status ... threadId: ${threadId} runId: ${runId}`
    );
    const run = await openai.beta.threads.runs.retrieve(threadId, runId);
    return run;
  }
  async getAssistants(): Promise<Message.Beta.Assistants.AssistantsPage> {
    console.log(`${mm} getting assistants ...`);
    const assistants = await openai.beta.assistants.list();

    return assistants;
  }
  async getThread(threadId: string): Promise<Message.Beta.Threads.Thread> {
    console.log(`${mm} getThread ...`);
    const thread = await openai.beta.threads.retrieve(threadId);

    return thread;
  }
  async createThread(
    messages: any[]
  ): Promise<Message.Beta.Threads.Thread> {
    console.log(`${mm} creating thread with messages : ${messages.length}...`);

    const params: Message.Beta.Threads.ThreadCreateParams = {
      messages: messages,
    };
    const thread = await openai.beta.threads.create(params);

    console.log(`${mm} thread created: 🍎🍎🍎 ${JSON.stringify(thread)} ...`);

    return thread;
  }

  async uploadFile(
    path: string,
    name: string
  ): Promise<Message.Files.FileObject> {
    const mFile: File = new File([fs.readFileSync(path)], name);

    console.log(
      `${mm} assistant file to upload, name: 🍎 ${mFile.name} ${mFile.size} bytes 🍎`
    );
    try {
      const fileResult = await openai.files.create({
        file: mFile,
        purpose: "assistants",
      });

      console.log(
        `${mm} assistant file uploaded, status: 🍎 ${fileResult.status} 🍎`
      );

      return fileResult;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  async listModels(): Promise<Message.Models.ModelsPage> {
    const list = await openai.models.list();

    console.log(`${mm} OpenAI models found: 🔵 🔵 ${list.data.length} 🍎`);
    list.data.forEach((model) => {
      console.log(`${mm} OpenAI model: 🔵 🔵 🔵 ${JSON.stringify(model)} 🔵`);
    });
    return list;
  }

  async getThreadMessages(
    threadId: string
  ): Promise<Message.Beta.Threads.Messages.ThreadMessagesPage> {
    const messages = await openai.beta.threads.messages.list(threadId);
    console.log(
      `${mm} Thread result Messages: 🍎 ${JSON.stringify(messages)} 🍎 `
    );

    return messages;
  }
}
