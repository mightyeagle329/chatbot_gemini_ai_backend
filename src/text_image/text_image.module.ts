import { Module } from '@nestjs/common';
import { TextImageService } from './text_image.service';
import { TextImageController } from './text_image.controller';
import { FirestoreService } from 'src/models/models.service';

@Module({
  controllers: [TextImageController],
  providers: [TextImageService, FirestoreService],
})
export class TextImageModule {}
