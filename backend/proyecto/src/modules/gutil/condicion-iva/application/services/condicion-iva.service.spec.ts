import { Test, TestingModule } from '@nestjs/testing';
import { CondicionIvaService } from './condicion-iva.service';

describe('CondicionIvaService', () => {
  let service: CondicionIvaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CondicionIvaService],
    }).compile();

    service = module.get<CondicionIvaService>(CondicionIvaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
