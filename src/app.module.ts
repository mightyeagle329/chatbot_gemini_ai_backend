import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TextModule } from './text/text.module';
import { GeminiTextImageController } from './text_image/text_image.controller';
import { ConfigModule } from '@nestjs/config';
import { TextImageModule } from './text_image/text_image.module';
import { GeminiTextImageService } from './text_image/text_image.service';
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
// import { OpenApiModule } from './open_api/open_api.module';
import { ConverterService } from './converter/converter.service';
import { ConverterController } from './converter/converter.controller';
import { MistralModule } from './mistral/mistral.module';
import { AssistantModule } from './openai/assistant/assistant.module';

@Module({
  imports: [ConfigModule.forRoot(), TextModule, TextImageModule, 
    ChatsModule, ModelsModule, PaymentsModule, PaypalModule, MistralModule, AssistantModule,],
  controllers: [
    AppController,
    TextController,
    ChatsController,
    GeminiTextImageController,
    FirestoreController,
    ConverterController,
  ],
  providers: [AppService, TextService, ChatsService, GeminiTextImageService, FirestoreService, ConverterService],
})
export class AppModule {}
