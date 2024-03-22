import { OnModuleInit } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatCompletionMessageParam, ChatCompletionToolMessageParam } from 'openai/resources';
import { Server } from 'socket.io';
import { OpenAIService } from '../openai/openai.service';
import { getAvailableFunctionsByApiKey } from './mock-functions';

const messages = new Map<string, ChatCompletionMessageParam[]>();

@WebSocketGateway()
export class EventsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(private openAI: OpenAIService) {}

  onModuleInit() {
    this.server.on('connection', socket => {
      console.log('Client connected', socket.id);
      const apiKey = socket.handshake.auth.apiKey;

      if (!apiKey) {
        console.log('No API key provided');
        socket.disconnect();
      }

      messages.set(apiKey, [
        {
          role: 'system',
          content: `A user has connected to the chat. You are a helpful assistant that can do things for them.
            You have a happy attitude, and can use the available function creativly to achieve the desired outcome.
            Start by greeting them!`,
        },
      ]);

      this.generateChat(apiKey);
    });
  }

  @SubscribeMessage('chat')
  chat(@MessageBody() body: string, @ConnectedSocket() socket): void {
    const apiKey = socket.handshake.auth.apiKey;

    if (!apiKey) {
      console.log('No API key provided');
      socket.disconnect();
    }

    this.pushResponse(apiKey, {
      role: 'user',
      content: body,
    });

    this.generateChat(apiKey);
  }

  @SubscribeMessage('tools_response')
  toolsResponse(@MessageBody() responses: Omit<ChatCompletionToolMessageParam, 'role'>[], @ConnectedSocket() socket): void {
    const apiKey = socket.handshake.auth.apiKey;

    responses.forEach(response => {
      messages.get(apiKey).push({
        role: 'tool',
        content: response.content,
        tool_call_id: response.tool_call_id,
      });
    });
    this.generateChat(apiKey);
  }

  private async generateChat(apiKey: string): Promise<void> {
    const functions = await getAvailableFunctionsByApiKey(apiKey);

    const response = await this.openAI.get().chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: messages.get(apiKey) || [],
      tools: functions.map(f => ({
        type: 'function',
        function: f,
      })),
    });
    this.pushResponse(apiKey, response.choices[0].message);

    if (response.choices[0].finish_reason === 'tool_calls') {
      this.server.emit('tools_call', response.choices[0].message.tool_calls);
    } else if (response.choices[0].finish_reason === 'stop') {
      this.server.emit('response', response.choices[0].message.content);
    } else {
      console.log('unknown finish reason', response.choices[0].finish_reason);
    }

    return;
  }

  private pushResponse(apiKey: string, response: ChatCompletionMessageParam): void {
    const _messages = messages.get(apiKey);

    if (!_messages) {
      throw new Error('No messages found');
    }

    _messages.push(response);
  }
}
