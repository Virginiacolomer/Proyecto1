import { Test, TestingModule } from '@nestjs/testing';
import { DomicilioService } from './domicilio.service';

describe('DomicilioService', () => {
  let service: DomicilioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DomicilioService],
    }).compile();

    service = module.get<DomicilioService>(DomicilioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
