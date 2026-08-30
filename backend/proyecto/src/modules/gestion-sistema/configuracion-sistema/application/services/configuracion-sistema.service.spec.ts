import { Test, TestingModule } from '@nestjs/testing';
import { ConfiguracionSistemaService } from './configuracion-sistema.service';

describe('ConfiguracionSistemaService', () => {
  let service: ConfiguracionSistemaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfiguracionSistemaService],
    }).compile();

    service = module.get<ConfiguracionSistemaService>(ConfiguracionSistemaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
