import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();
  });

  describe('GET Health', () => {
    it('should return "Healthy!"', () => {
      const helloController = app.get<HealthController>(HealthController);
      expect(helloController.getHealth()).toBe('Healthy!');
    });
  });
});
