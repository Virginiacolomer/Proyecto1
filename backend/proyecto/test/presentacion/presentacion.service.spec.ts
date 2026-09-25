import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PresentacionService } from '../../src/modules/gestion-productos/presentacion/application/services/presentacion.service';
import { PoliticaEliminacionPresentacion } from '../../src/modules/gestion-productos/presentacion/domain/services/politica-eliminacion-presentacion.service';
import { UsuarioService } from '../../src/modules/gestion-usuario/usuario/application/services/usuario.service';
import { IPresentacionRepository } from '../../src/modules/gestion-productos/presentacion/domain/interfaces/presentacion.repository.interface';
import { Presentacion } from '../../src/modules/gestion-productos/presentacion/domain/entities/presentacion.entity';
import { MessageFrontUtils } from '../../src/modules/common/utils/message/message-front.util';

describe('PresentacionService', () => {
  let service: PresentacionService;
  let repository: jest.Mocked<IPresentacionRepository>;
  let usuarioService: jest.Mocked<UsuarioService>;
  let politicaEliminacion: jest.Mocked<PoliticaEliminacionPresentacion>;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      update: jest.fn(),
      findAllFor: jest.fn(),
      findAllListado: jest.fn(),
      findAllSinSistemaFor: jest.fn(),
      findAllSistemaFor: jest.fn(),
      findBy: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      findByDenominacionWith: jest.fn(),
      findByIdConAuditoria: jest.fn(),
    } as any;

    usuarioService = {
      findOne: jest.fn(),
    } as any;

    politicaEliminacion = {
      tieneProductosActivosParaPresentacion: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PresentacionService,
        {
          provide: 'IPresentacionRepository',
          useValue: repository,
        },
        {
          provide: UsuarioService,
          useValue: usuarioService,
        },
        {
          provide: PoliticaEliminacionPresentacion,
          useValue: politicaEliminacion,
        },
      ],
    }).compile();

    service = module.get<PresentacionService>(PresentacionService);
  });

  describe('create', () => {
    it('debe crear una presentacion exitosamente', async () => {
      const dto = { denominacion: '500ml', usuarioCreatedId: 1 };
      repository.findByDenominacionWith.mockResolvedValue(null);
      repository.create.mockResolvedValue({ id: 1, denominacion: '500ml' } as Presentacion);

      const result = await service.create(dto);

      expect(repository.findByDenominacionWith).toHaveBeenCalledWith('500ml');
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(MessageFrontUtils.createSimple('Presentacion', '500ml', 'creada'));
    });

    it('debe lanzar ConflictException si la denominacion ya existe', async () => {
      const dto = { denominacion: '500ml', usuarioCreatedId: 1 };
      repository.findByDenominacionWith.mockResolvedValue({ id: 1, denominacion: '500ml' } as Presentacion);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('debe eliminar la presentacion si no tiene productos activos', async () => {
      const presentacion = { id: 1, denominacion: '500ml', sistema: 0 } as Presentacion;
      repository.findOne.mockResolvedValue(presentacion);
      politicaEliminacion.tieneProductosActivosParaPresentacion.mockResolvedValue(false);
      usuarioService.findOne.mockResolvedValue({ id: 1 } as any);

      const result = await service.remove(1, 1);

      expect(politicaEliminacion.tieneProductosActivosParaPresentacion).toHaveBeenCalledWith(1);
      expect(repository.remove).toHaveBeenCalledWith(presentacion, { id: 1 });
      expect(result).toEqual(MessageFrontUtils.createSimple('Presentacion', '500ml', 'eliminada'));
    });

    it('debe lanzar ConflictException si tiene productos activos', async () => {
      const presentacion = { id: 1, denominacion: '500ml', sistema: 0 } as Presentacion;
      repository.findOne.mockResolvedValue(presentacion);
      politicaEliminacion.tieneProductosActivosParaPresentacion.mockResolvedValue(true);

      await expect(service.remove(1, 1)).rejects.toThrow(ConflictException);
    });

    it('debe lanzar Error si se intenta eliminar una presentacion de sistema', async () => {
      const presentacion = { id: 1, denominacion: 'Sistema', sistema: 1 } as Presentacion;
      repository.findOne.mockResolvedValue(presentacion);

      await expect(service.remove(1, 1)).rejects.toThrow();
    });
  });
});
