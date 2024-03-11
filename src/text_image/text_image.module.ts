import { Module } from '@nestjs/common';
import { GeminiTextImageService } from './text_image.service';
import { GeminiTextImageController } from './text_image.controller';
import { FirestoreService } from 'src/models/models.service';

@Module({
  controllers: [GeminiTextImageController],
  providers: [GeminiTextImageService, FirestoreService],
})
export class TextImageModule {}
