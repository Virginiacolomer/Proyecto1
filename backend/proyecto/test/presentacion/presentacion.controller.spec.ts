import { Test, TestingModule } from '@nestjs/testing';
import { PresentacionController } from '../../src/modules/gestion-productos/presentacion/application/controllers/presentacion.controller';
import { PresentacionService } from '../../src/modules/gestion-productos/presentacion/application/services/presentacion.service';
import { AuthGuard } from '../../src/modules/gestion-usuario/auth/auth.guard';

describe('PresentacionController', () => {
  let controller: PresentacionController;
  let service: jest.Mocked<PresentacionService>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findBy: jest.fn(),
      findDtoById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findByIdConAuditoria: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresentacionController],
      providers: [
        {
          provide: PresentacionService,
          useValue: service,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<PresentacionController>(PresentacionController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debe llamar a service.create con los datos correctos', async () => {
      const dto = { denominacion: 'Prueba', usuarioCreatedId: 1 };
      service.create.mockResolvedValue({ message: 'OK' } as any);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ message: 'OK' });
    });
  });

  describe('remove', () => {
    it('debe llamar a service.remove', async () => {
      service.remove.mockResolvedValue({ message: 'Eliminado' } as any);

      const result = await controller.remove(1, 2);

      expect(service.remove).toHaveBeenCalledWith(1, 2);
      expect(result).toEqual({ message: 'Eliminado' });
    });
  });
});
