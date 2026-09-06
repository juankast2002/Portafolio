import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async generateChat(
    @Body('messages') messages,
    @Body('model') model?: string,
    @Body('apiKey') apiKey?: string,
  ) {
    if (!messages || !messages.length) {
      return { error: 'Messages array is required' };
    }
    console.log('Messages:', messages);

    try {
      const response = await this.chatService.generateResponse(
        messages,
        model,
        apiKey,
      );
      return {
        message: response.text,
        isCustomComponent: response.isCustomComponent,
      };
    } catch (error) {
      return { error: 'Failed to generate response', details: error.message };
    }
  }
}
