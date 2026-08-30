import { Test, TestingModule } from '@nestjs/testing';
import { EmpresaOperacionService } from './empresa-operacion.service';

describe('EmpresaOperacionService', () => {
  let service: EmpresaOperacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmpresaOperacionService],
    }).compile();

    service = module.get<EmpresaOperacionService>(EmpresaOperacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
