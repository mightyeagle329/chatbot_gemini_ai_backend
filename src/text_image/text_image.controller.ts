import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UseFilters,
  UploadedFiles,
  Get,
  Query,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { GeminiTextImageService } from "./text_image.service";
import * as fs from "fs";
import * as path from "path";
import { GeminiApiExceptionFilter } from "src/gemini.exception.filter";

const mm = "🧡 💛 💚 💙 GeminiTextImageController ";

@Controller("textImage")
export class GeminiTextImageController {
  constructor(
    private readonly geminiTextImageService: GeminiTextImageService
  ) {}

  @Get("/ping")
  ping(): string {
    console.log(
      `${mm} Heita! geminiTextImageServiceI have been pinged pinged!! .......`
    );
    return `${mm} Hello from AI backend 🌿🌿🌿 I have been fucking pinged! Date: ${new Date()}`;
  }
  //
  @UseFilters(GeminiApiExceptionFilter)
  @Post("getGeminiTokens")
  @UseInterceptors(
    FileInterceptor("files", { limits: { fileSize: 4 * 1024 * 1024 } })
  )
  async getGeminiTokens(
    // @UploadedFiles() files: Express.Multer.File[],
    prompt: string,
    mimeType: string,
    model: string
  ): Promise<any> {
    // if (files) {
    //    console.log(
    //      `${mm} ... count Gemini tokens for Daddy!: ${files.length} images files. 🌿🌿🌿 prompt: ${prompt}`
    //    );
    // }
   console.log(
     `${mm} ... count Gemini tokens for Daddy! model: ${model}  🌿🌿🌿 prompt: ${prompt} - mimeType: ${mimeType}`
   );
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
      console.log(`${mm} directory created: ${uploadDir}`);
    }
    const paths: string[] = [];

    // if (files) {
    //   for (const file of files) {
    //     const filePath = path.join(uploadDir, file.originalname);
    //     fs.writeFileSync(filePath, file.buffer);
    //     console.log(
    //       `${mm} ...image file written to: ${filePath} - size: ${file.size} bytes`
    //     );
    //     paths.push(filePath);
    //   }
    // }
   
    try {
      const tokens = this.geminiTextImageService.countGeminiTokens(
        paths,
        mimeType,
        prompt,
        model
      );
       console.log(`${mm} tokens counted: ${JSON.stringify(tokens)}`);
      return {
        tokens: tokens,
      };
    } catch (error) {
       console.log(`${mm} ERROR caught: : ${error}`);
        return {
          message: "Things are fucked up, Jack!",
        };
    }
   
  }
  //
  @UseFilters(GeminiApiExceptionFilter)
  @Post("sendTextImagePrompt")
  @UseInterceptors(
    FileInterceptor("file", { limits: { fileSize: 4 * 1024 * 1024 } })
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body("prompt") prompt: string,
    @Body("userId") userId: number,
    @Body("organizationId") organizationId: number,

    @Body("examLinkId") examLinkId: number,
    @Body("mimeType") mimeType: string
  ): Promise<any> {
    console.log(`${mm} image file coming in: ${file.buffer.length}`);
    console.log(`${mm} examLinkId coming in: ${examLinkId}`);

    try {
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
        console.log(`${mm} directory created: ${uploadDir}`);
      }
      const filePath = path.join(uploadDir, "file");
      fs.writeFileSync(filePath, file.buffer);
      console.log(
        `${mm} ...image file written to: ${filePath} - size: ${file.size} bytes`
      );

      console.log(
        `${mm} ... calling service to handle prompt: 💙 💙 💙 💙 ${prompt} : with 1 image attachment: ${file.originalname}`
      );
      const result = this.geminiTextImageService.sendTextImagePrompt(
        filePath,
        mimeType,
        prompt,
        userId,
        organizationId,
        examLinkId
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
  //
  @UseFilters(GeminiApiExceptionFilter)
  @Post("sendTextImagesPrompt")
  @UseInterceptors(
    FileInterceptor("files", { limits: { fileSize: 4 * 1024 * 1024 } })
  )
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body("prompt") prompt: string,
    @Body("userId") userId: number,
    @Body("organizationId") organizationId: number,
    @Body("examLinkId") examLinkId: number,
    @Body("mimeType") mimeType: string
  ): Promise<any> {
    console.log(`${mm} image files coming in: ${files.length}`);
    console.log(`${mm} examLinkId coming in: ${examLinkId}`);

    try {
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
        console.log(`${mm} directory created: ${uploadDir}`);
      }
      const paths: string[] = [];
      for (const file of files) {
        const filePath = path.join(uploadDir, file.originalname);
        fs.writeFileSync(filePath, file.buffer);
        console.log(
          `${mm} ...image file written to: ${filePath} - size: ${file.size} bytes`
        );
        paths.push(filePath);
      }
      //
      console.log(
        `${mm} ... calling service to handle prompt: 💙💙💙💙 ${prompt} : 
          with ${files.length} image attachments`
      );
      const result = await this.geminiTextImageService.sendTextImagesPrompt(
        paths,
        mimeType,
        prompt,
        userId,
        organizationId,
        examLinkId
      );
      console.log(result);
      return { statusCode: 200, result: result };
    } catch (err) {
      console.log(`sendTextImagesPrompt: We have a problem: ${err.message}`);
      return {
        statusCode: 501,
        message: err,
        date: new Date(),
      };
    }
  }
}

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    // "value" is an object containing the file's attributes and metadata
    const oneKb = 1000;
    return value.size < oneKb;
  }
}
