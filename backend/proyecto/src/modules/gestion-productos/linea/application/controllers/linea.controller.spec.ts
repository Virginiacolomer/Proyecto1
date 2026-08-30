import { Test, TestingModule } from '@nestjs/testing';
import { LineaController } from './linea.controller';
import { LineaService } from '../services/linea.service';

describe('LineaController', () => {
  let controller: LineaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineaController],
      providers: [LineaService],
    }).compile();

    controller = module.get<LineaController>(LineaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
