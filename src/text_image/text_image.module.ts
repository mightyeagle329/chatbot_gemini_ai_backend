import { Module } from '@nestjs/common';
import { TextImageService } from './text_image.service';
import { TextImageController } from './text_image.controller';

@Module({
  controllers: [TextImageController],
  providers: [TextImageService],
})
export class TextImageModule {}
