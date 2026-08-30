import { Test, TestingModule } from '@nestjs/testing';
import { EmpresaOperacionController } from './empresa-operacion.controller';
import { EmpresaOperacionService } from './empresa-operacion.service';

describe('EmpresaOperacionController', () => {
  let controller: EmpresaOperacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmpresaOperacionController],
      providers: [EmpresaOperacionService],
    }).compile();

    controller = module.get<EmpresaOperacionController>(EmpresaOperacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
