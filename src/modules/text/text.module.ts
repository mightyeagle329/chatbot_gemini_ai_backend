import { Module } from '@nestjs/common';
import { TextController } from 'src/controllers/text/text.controller';
import { TextService } from 'src/services/text/text.service';

@Module({
  controllers: [TextController],
  providers: [TextService],
})
export class TextModule {}
