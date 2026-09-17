import { Test, TestingModule } from '@nestjs/testing';
import { SuperLineaController } from './super-linea.controller';
import { SuperLineaService } from '../services/super-linea.service';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';

describe('SuperLineaController (In-module Unit Tests)', () => {
  let controller: SuperLineaController;
  let service: jest.Mocked<SuperLineaService>;

  beforeEach(async () => {
    const mockService: Partial<SuperLineaService> = {
      create: jest.fn(),
      update: jest.fn(),
      findByDenominacionFiltered: jest.fn(),
      findAllListado: jest.fn(),
      findDtoById: jest.fn(),
      remove: jest.fn(),
      findByIdConAuditoria: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuperLineaController],
      providers: [{ provide: SuperLineaService, useValue: mockService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<SuperLineaController>(SuperLineaController);
    service = module.get(SuperLineaService);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });
});
