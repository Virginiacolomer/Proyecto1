import { Test, TestingModule } from '@nestjs/testing';
import { ProveedorOperacionController } from './proveedor-operacion.controller';
import { ProveedorOperacionService } from './proveedor-operacion.service';

describe('ProveedorOperacionController', () => {
  let controller: ProveedorOperacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProveedorOperacionController],
      providers: [ProveedorOperacionService],
    }).compile();

    controller = module.get<ProveedorOperacionController>(ProveedorOperacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
