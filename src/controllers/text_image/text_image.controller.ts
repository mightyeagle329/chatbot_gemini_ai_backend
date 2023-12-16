import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  ArgumentMetadata,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { TextImageService } from './text_image.service';
import * as fs from 'fs';
import * as path from 'path';

const mm = '🧡 💛 💚 💙 TextImageController ';

@Controller('textImage')
export class TextImageController {
  constructor(private readonly textImageService: TextImageService) {}

  @Post('sendTextImagePrompt')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 4 * 1024 * 1024 } }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('prompt') prompt: string,
  ): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
      console.log(`${mm} directory created: ${uploadDir}`);
    }

    const filePath = path.join(uploadDir, file.originalname);
    fs.writeFileSync(filePath, file.buffer);
    console.log(`${mm} image file written to: ${filePath}`);

    console.log(
      `${mm} calling service to handle prompt: ${prompt} : with image attachment: ${file.originalname}`,
    );
    return this.textImageService.sendTextImagePrompt(
      filePath,
      file.mimetype,
      prompt,
    );
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
