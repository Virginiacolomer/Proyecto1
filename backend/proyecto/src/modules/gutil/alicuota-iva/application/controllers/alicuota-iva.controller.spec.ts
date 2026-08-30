import { Test, TestingModule } from '@nestjs/testing';
import { AlicuotaIvaController } from './alicuota-iva.controller';
import { AlicuotaIvaService } from '../../alicuota-iva.service';

describe('AlicuotaIvaController', () => {
  let controller: AlicuotaIvaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlicuotaIvaController],
      providers: [AlicuotaIvaService],
    }).compile();

    controller = module.get<AlicuotaIvaController>(AlicuotaIvaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
