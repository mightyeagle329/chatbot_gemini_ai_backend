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
import { ModelsModule } from './models/models.module';
import { FirestoreController } from './models/models.controller';
import { FirestoreService } from './models/models.service';
import { PaymentsModule } from './payments/payments.module';
import { PaypalModule } from './paypal/paypal.module';

@Module({
  imports: [ConfigModule.forRoot(), TextModule, TextImageModule, ChatsModule, ModelsModule, PaymentsModule, PaypalModule,],
  controllers: [
    AppController,
    TextController,
    ChatsController,
    TextImageController,
    FirestoreController,
  ],
  providers: [AppService, TextService, ChatsService, TextImageService, FirestoreService],
})
export class AppModule {}
