import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { AssistantService } from "./assistant.service";
import { AssistantCreate } from "./dto/models";
import Message from "openai";
import { FileInterceptor } from "@nestjs/platform-express";
import { threadId } from "worker_threads";

/**
 * AssistantController fronts the OpenAI Assistant API
 */
@Controller("assistant")
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get("runThread")
  async runThread(
    @Param("threadId") threadId: string,
    @Param("assistantId") assistantId: string,
    @Param("statusIntervalInSeconds") statusIntervalInSeconds: number
  ): Promise<void> {
    try {
      const run = await this.assistantService.runThread(
        threadId,
        assistantId,
        statusIntervalInSeconds
      );
      return run;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get('checkRunStatus')
  async checkRunStatus(@Param('runId') runId: string, @Param('threadId') threadId: any): Promise<string> {
    return this.assistantService.checkRunStatus(threadId,runId);
  }

  @Post("uploadFiles")
  @UseInterceptors(
    FileInterceptor("files", { limits: { fileSize: 10 * 1024 * 1024 } })
  )
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.assistantService.uploadFiles(files);
  }

  @Post("createAssistant")
  createAssistant(@Body() assistantCreate: AssistantCreate) {
    return this.assistantService.createAssistant(assistantCreate);
  }

  @Post("createMessage")
  createMessage(
    @Param("threadId") threadId: string,
    @Param("content") content: string
  ): Promise<any> {
    return this.assistantService.createMessage(threadId, content);
  }

  @Post("createThread")
  createThread(
    @Body() messages: Message.Beta.Threads.ThreadCreateParams.Message[]
  ) {
    return this.assistantService.createThread(messages, {});
  }
}
