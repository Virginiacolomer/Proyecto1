import { Test, TestingModule } from '@nestjs/testing';
import { ProductoOperacionService } from './producto-operacion.service';

describe('ProductoOperacionService', () => {
  let service: ProductoOperacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductoOperacionService],
    }).compile();

    service = module.get<ProductoOperacionService>(ProductoOperacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
