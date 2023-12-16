import { Module } from '@nestjs/common';
import { ImageController } from 'src/controllers/image/image.controller';
import { ImageService } from 'src/services/image/image.service';

@Module({
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
