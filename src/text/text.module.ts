import { Module } from '@nestjs/common';
import { TextController } from 'src/text/text.controller';
import { TextService } from 'src/text/text.service';

@Module({
  controllers: [TextController],
  providers: [TextService],
})
export class TextModule {}
