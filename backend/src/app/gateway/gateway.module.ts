import { Module } from '@nestjs/common';
import { OpenAIModule } from '../openai/openai.module';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [OpenAIModule],
  controllers: [],
  providers: [EventsGateway],
})
export class GatewayModule {}
