import { Test, TestingModule } from '@nestjs/testing';
import { AlicuotaIvaService } from './alicuota-iva.service';

describe('AlicuotaIvaService', () => {
  let service: AlicuotaIvaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlicuotaIvaService],
    }).compile();

    service = module.get<AlicuotaIvaService>(AlicuotaIvaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
