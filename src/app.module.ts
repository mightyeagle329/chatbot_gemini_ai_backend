import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TextModule } from './text/text.module';
import { TextImageController } from './text_image/text_image.controller';
import { ConfigModule } from '@nestjs/config';
import { TextImageModule } from './text_image/text_image.module';
import { TextImageService } from './text_image/text_image.service';
import { ChatsModule } from './chats/chats.module';
import { TextController } from './text/text.controller';
import { TextService } from './text/text.service';
import { ChatsService } from './chats/chats.service';
import { ChatsController } from './chats/chats.controller';

@Module({
  imports: [ConfigModule.forRoot(), TextModule, TextImageModule, ChatsModule,],
  controllers: [
    AppController,
    TextController,
    ChatsController,
    TextImageController,
  ],
  providers: [AppService, TextService, ChatsService, TextImageService],
})
export class AppModule {}
