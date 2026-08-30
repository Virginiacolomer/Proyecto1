import { Test, TestingModule } from '@nestjs/testing';
import { ClienteOperacionController } from './cliente-operacion.controller';
import { ClienteOperacionService } from './cliente-operacion.service';

describe('ClienteOperacionController', () => {
  let controller: ClienteOperacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClienteOperacionController],
      providers: [ClienteOperacionService],
    }).compile();

    controller = module.get<ClienteOperacionController>(ClienteOperacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
