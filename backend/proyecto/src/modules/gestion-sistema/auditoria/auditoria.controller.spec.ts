import { Test, TestingModule } from '@nestjs/testing';
import { AuditoriaController } from './auditoria.controller';
import { AuditoriaService } from './auditoria.service';

describe('AuditoriaController', () => {
  let controller: AuditoriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditoriaController],
      providers: [AuditoriaService],
    }).compile();

    controller = module.get<AuditoriaController>(AuditoriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
