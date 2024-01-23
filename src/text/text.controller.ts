import { Controller, Get, Query } from '@nestjs/common';
import { TextService } from './text.service';
const mm = '🍎 🍎 🍎 TextController: 🍎 ';
@Controller('text')
export class TextController {
  constructor(private readonly textService: TextService) {}

  @Get('/prompt')
  async sendPrompt(@Query('prompt') prompt: string): Promise<any> {
    if (!prompt) {
      prompt = `${mm}Please enter a prompt`;
    }
    //
    console.log(`${mm} sending prompt: ${prompt}`);
    return this.textService.sendChatPrompt(prompt);
  }
}
