import { Test, TestingModule } from '@nestjs/testing';
import { ClienteOperacionService } from './cliente-operacion.service';

describe('ClienteOperacionService', () => {
  let service: ClienteOperacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClienteOperacionService],
    }).compile();

    service = module.get<ClienteOperacionService>(ClienteOperacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
