import { Module } from '@nestjs/common';
import { MistralService } from './mistral.service';
import { MistralController } from './mistral.controller';

@Module({
  controllers: [MistralController],
  providers: [MistralService],
})
export class MistralModule {}
