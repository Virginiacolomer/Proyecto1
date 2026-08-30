import { Test, TestingModule } from '@nestjs/testing';
import { CondicionIvaController } from './condicion-iva.controller';
import { CondicionIvaService } from '../services/condicion-iva.service';

describe('CondicionIvaController', () => {
  let controller: CondicionIvaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CondicionIvaController],
      providers: [CondicionIvaService],
    }).compile();

    controller = module.get<CondicionIvaController>(CondicionIvaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
