import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UploadedFiles,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { AssistantService } from "./assistant.service";
import { Assistant } from "./dto/models";
import Message from "openai";
import { FileInterceptor } from "@nestjs/platform-express";
import { threadId } from "worker_threads";
import * as fs from "fs";
import * as path from "path";
const mm = "🧡 💛 💚 💙 AssistantController ";

/**
 * AssistantController fronts the OpenAI Assistant API
 */
@Controller("assistant")
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get("runThread")
  async runThread(
    @Param("threadId") threadId: string,
    @Param("assistantId") assistantId: string
  ): Promise<Message.Beta.Threads.Runs.Run> {
    try {
      const run = await this.assistantService.runThread(threadId, assistantId);
      return run;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get("checkRunStatus")
  async checkRunStatus(
    @Param("runId") runId: string,
    @Param("threadId") threadId: string
  ): Promise<Message.Beta.Threads.Runs.Run> {
    return this.assistantService.checkRunStatus(threadId, runId);
  }
  @Get("getThreadMessages")
  async getThreadMessages(
    @Param("threadId") threadId: string
  ): Promise<Message.Beta.Threads.Messages.ThreadMessagesPage> {
    return this.assistantService.getThreadMessages(threadId);
  }
  @Get("getAssistants")
  async getAssistants(): Promise<Message.Beta.Assistants.AssistantsPage> {
    return this.assistantService.getAssistants();
  }

  @Get("getThread")
  async getThread(@Param("threadId") threadId: string): Promise<any> {
    return this.assistantService.getThread(threadId);
  }

  @Get("createAssistantFile")
  async createAssistantFile(
    @Param("assistantId") assistantId: string,
    @Param("fileId") fileId: string
  ): Promise<Message.Beta.Assistants.Files.AssistantFile> {
    return this.assistantService.createAssistantFile(assistantId, fileId);
  }

  @Get("listModels")
  async listModels(): Promise<Message.Models.ModelsPage> {
    return this.assistantService.listModels();
  }

  @Get("listAssistants")
  async listAssistants(): Promise<Message.Beta.Assistants.AssistantsPage> {
    return this.assistantService.listAssistants();
  }

  @Post("uploadFile")
  @UseInterceptors(
    FileInterceptor("file", { limits: { fileSize: 5 * 1024 * 1024 } })
  )
  async uploadAssistantFile(
    @UploadedFile() file: Express.Multer.File
  ): Promise<any> {
    try {
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
        console.log(`${mm} directory created: ${uploadDir}`);
      }
      const filePath = path.join(uploadDir, `${file.originalname}`);
      fs.writeFileSync(filePath, file.buffer);
      console.log(
        `${mm} ...upload file written to: ${filePath} - size: ${file.size} bytes`
      );

      console.log(
        `${mm} ... calling service to upload for use in OpenAI Assistant: 💙 💙 `
      );

      //
      const result = await this.assistantService.uploadFile(
        filePath,
        file.originalname
      );
      return { statusCode: 200, result: result };
    } catch (err) {
      console.log(`sendTextImagePrompt: We have a problem: ${err.message}`);
      return {
        statusCode: 501,
        message: err,
        date: new Date(),
      };
    }
  }

  @Post("createAssistant")
  async createAssistant(
    @Body() assistant: Assistant
  ): Promise<Message.Beta.Assistants.Assistant> {
    return this.assistantService.createAssistant(assistant);
  }

  @Post("createMessage")
  async createMessage(
    @Param("threadId") threadId: string,
    @Param("content") content: string,
    @Param("content") fileId: string
  ): Promise<Message.Beta.Threads.Messages.ThreadMessage> {
    return this.assistantService.createMessage(threadId, content, fileId);
  }

  @Post("createThread")
  async createThread(
    @Body() messages: Message.Beta.Threads.ThreadCreateParams.Message[]
  ): Promise<Message.Beta.Threads.Thread> {
    return this.assistantService.createThread(messages);
  }
}
