import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly helloService: HealthService) {}

  @Get()
  @ApiOkResponse({ type: String })
  getHealth(): string {
    return this.helloService.getHealth();
  }
}
