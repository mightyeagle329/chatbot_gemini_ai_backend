import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TextModule } from './modules/text/text.module';
import { ImageModule } from './modules/image/image.module';
import { TextService } from './services/text/text.service';
import { ImageService } from './services/image/image.service';
import { TextController } from './controllers/text/text.controller';
import { ImageController } from './controllers/image/image.controller';
import { TextImageController } from './controllers/text_image/text_image.controller';
import { ConfigModule } from '@nestjs/config';
import { TextImageModule } from './controllers/text_image/text_image.module';
import { TextImageService } from './controllers/text_image/text_image.service';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [ConfigModule.forRoot(), TextModule, ImageModule, TextImageModule, ChatsModule],
  controllers: [
    AppController,
    TextController,
    ImageController,
    TextImageController,
  ],
  providers: [AppService, TextService, ImageService, TextImageService],
})
export class AppModule {}
