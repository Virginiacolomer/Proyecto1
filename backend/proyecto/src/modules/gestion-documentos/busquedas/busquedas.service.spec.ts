import { Test, TestingModule } from '@nestjs/testing';
import { BusquedasService } from './busquedas.service';

describe('BusquedasService', () => {
  let service: BusquedasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusquedasService],
    }).compile();

    service = module.get<BusquedasService>(BusquedasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
