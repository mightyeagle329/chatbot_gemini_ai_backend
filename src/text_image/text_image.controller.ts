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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { TextImageService } from './text_image.service';
import * as fs from 'fs';
import * as path from 'path';
import { GeminiApiExceptionFilter } from 'src/gemini.exception.filter';

const mm = '🧡💛💚💙 TextImageController ';

@Controller("textImage")
export class TextImageController {
  constructor(private readonly textImageService: TextImageService) {}

  @UseFilters(GeminiApiExceptionFilter)
  @Post("sendTextImagePrompt")
  @UseInterceptors(
    FileInterceptor("file", { limits: { fileSize: 4 * 1024 * 1024 } })
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body("prompt") prompt: string,
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
              `${mm} ... calling service to handle prompt: 💙💙💙💙 ${prompt} : with image attachment: ${file.originalname}`
            );
            const result = this.textImageService.sendTextImagePrompt(
              filePath,
              mimeType,
              prompt,
              examLinkId
            );
            return result;
        } catch (err) {
            console.log(`We have a problem: ${err.message}`);
            return {
              statusCode: 501,
              message: err,
              date: new Date(),
            }
              // throw new HttpException(
              //   `Error fetching from Gemini API: ${err}`,
              //   HttpStatus.BAD_REQUEST
              // );

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
