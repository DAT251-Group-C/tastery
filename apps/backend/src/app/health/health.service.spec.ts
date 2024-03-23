import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let healthService: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [HealthService],
    }).compile();

    healthService = module.get<HealthService>(HealthService);
  });

  it('should be defined', async () => {
    expect(healthService).toBeDefined();
  });

  it("getHealth should return 'Healthy!'", () => {
    expect(healthService.getHealth()).toBe('Healthy!');
  });
});
