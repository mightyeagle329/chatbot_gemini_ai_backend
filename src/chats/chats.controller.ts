import { Controller, Get, Query } from '@nestjs/common';
import { ChatsService } from './chats.service';

const mm = '🧡🧡🧡🧡🧡  ChatsController 🧡';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get('sendChatPrompt')
  async sendPrompt(@Query('prompt') prompt: string): Promise<string> {
    console.log(`${mm} calling service to handle prompt: ${prompt}`);
    return this.chatsService.sendChatPrompt(prompt);
  }
}
