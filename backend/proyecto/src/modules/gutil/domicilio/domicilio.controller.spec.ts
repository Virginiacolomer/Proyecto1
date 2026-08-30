import { Test, TestingModule } from '@nestjs/testing';
import { DomicilioController } from './domicilio.controller';
import { DomicilioService } from './domicilio.service';

describe('DomicilioController', () => {
  let controller: DomicilioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DomicilioController],
      providers: [DomicilioService],
    }).compile();

    controller = module.get<DomicilioController>(DomicilioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
