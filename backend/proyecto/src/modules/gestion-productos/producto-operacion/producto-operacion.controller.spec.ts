import { Test, TestingModule } from '@nestjs/testing';
import { ProductoOperacionController } from './producto-operacion.controller';
import { ProductoOperacionService } from './producto-operacion.service';

describe('ProductoOperacionController', () => {
  let controller: ProductoOperacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductoOperacionController],
      providers: [ProductoOperacionService],
    }).compile();

    controller = module.get<ProductoOperacionController>(ProductoOperacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
