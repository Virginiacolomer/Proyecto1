import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { SuperLineaService } from 'src/modules/gestion-productos/superlinea/application/services/super-linea.service';
import { ISuperLineaRepository } from 'src/modules/gestion-productos/superlinea/domain/interfaces/super-linea.repository.interface';
import { PoliticaEliminacionSuperLinea } from 'src/modules/gestion-productos/superlinea/domain/services/politica-eliminacion-super-linea.service';
import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';
import { CreateSuperLineaDto } from 'src/modules/gestion-productos/superlinea/dto/create-super-linea.dto';
import { UpdateSuperLineaDto } from 'src/modules/gestion-productos/superlinea/dto/update-super-linea.dto';
import { SuperLinea } from 'src/modules/gestion-productos/superlinea/domain/entities/super-linea.entity';

describe('SuperLineaService (Unit Tests)', () => {
  let service: SuperLineaService;
  let repository: jest.Mocked<ISuperLineaRepository>;
  let politicaEliminacion: jest.Mocked<PoliticaEliminacionSuperLinea>;
  let usuarioService: jest.Mocked<UsuarioService>;

  const mockSuperLinea: SuperLinea = {
    id: 1,
    denominacion: 'BEBIDAS',
    observacion: 'Refrescos y jugos',
    sistema: 0,
    lineas: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    usuarioCreatedId: 1,
  };

  beforeEach(async () => {
    const mockRepo: Partial<ISuperLineaRepository> = {
      create: jest.fn(),
      update: jest.fn(),
      findByDenominacionFiltered: jest.fn(),
      findAllListado: jest.fn(),
      findOne: jest.fn(),
      findByDenominacion: jest.fn(),
      findByDenominacionWith: jest.fn(),
      remove: jest.fn(),
      findByIdConAuditoria: jest.fn(),
      existsLineasActivasBySuperLinea: jest.fn(),
    };

    const mockPolitica: Partial<PoliticaEliminacionSuperLinea> = {
      tieneLineasActivasParaSuperLinea: jest.fn(),
    };

    const mockUsuarioService: Partial<UsuarioService> = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuperLineaService,
        { provide: 'ISuperLineaRepository', useValue: mockRepo },
        { provide: PoliticaEliminacionSuperLinea, useValue: mockPolitica },
        { provide: UsuarioService, useValue: mockUsuarioService },
      ],
    }).compile();

    service = module.get<SuperLineaService>(SuperLineaService);
    repository = module.get('ISuperLineaRepository');
    politicaEliminacion = module.get(PoliticaEliminacionSuperLinea);
    usuarioService = module.get(UsuarioService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('debe crear una nueva SuperLínea si la denominación está libre', async () => {
      const dto: CreateSuperLineaDto = {
        denominacion: 'Bebidas',
        observacion: 'Refrescos y jugos',
        usuarioCreatedId: 1,
      };

      repository.findByDenominacionWith.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockSuperLinea);

      const result = await service.create(dto);

      expect(repository.findByDenominacionWith).toHaveBeenCalledWith('BEBIDAS');
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty('mensaje');
    });

    it('debe lanzar ConflictException si la denominación ya existe', async () => {
      const dto: CreateSuperLineaDto = {
        denominacion: 'Bebidas',
        usuarioCreatedId: 1,
      };

      repository.findByDenominacionWith.mockResolvedValue(mockSuperLinea);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('update()', () => {
    it('debe actualizar una SuperLínea existente', async () => {
      const updateDto: UpdateSuperLineaDto = {
        denominacion: 'Bebidas Alcoholicas',
        usuarioUpdatedId: 1,
      };

      repository.findOne.mockResolvedValue(mockSuperLinea);
      repository.findByDenominacionWith.mockResolvedValue(null);
      repository.update.mockResolvedValue({
        ...mockSuperLinea,
        denominacion: 'BEBIDAS ALCOHOLICAS',
      });

      const result = await service.update(1, updateDto);

      expect(repository.findOne).toHaveBeenCalledWith(1);
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toHaveProperty('mensaje');
    });

    it('debe lanzar NotFoundException si la SuperLínea no existe', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.update(999, { denominacion: 'Prueba', usuarioUpdatedId: 1 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar ConflictException si intenta usar un nombre ya ocupado por otra entidad', async () => {
      const deOtra = { ...mockSuperLinea, id: 2, denominacion: 'GOLOSINAS' };
      repository.findOne.mockResolvedValue(mockSuperLinea);
      repository.findByDenominacionWith.mockResolvedValue(deOtra);

      await expect(
        service.update(1, { denominacion: 'Golosinas', usuarioUpdatedId: 1 }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove()', () => {
    it('debe eliminar la SuperLínea si el usuario existe y no tiene líneas activas', async () => {
      const mockUsuario = { id: 1, denominacion: 'Admin' } as any;

      repository.findOne.mockResolvedValue(mockSuperLinea);
      usuarioService.findOne.mockResolvedValue(mockUsuario);
      politicaEliminacion.tieneLineasActivasParaSuperLinea.mockResolvedValue(false);
      repository.remove.mockResolvedValue(mockSuperLinea);

      const result = await service.remove(1, 1);

      expect(repository.remove).toHaveBeenCalledWith(mockSuperLinea, mockUsuario);
      expect(result).toHaveProperty('mensaje');
    });

    it('debe lanzar ConflictException si la SuperLínea tiene líneas activas vinculadas', async () => {
      const mockUsuario = { id: 1, denominacion: 'Admin' } as any;

      repository.findOne.mockResolvedValue(mockSuperLinea);
      usuarioService.findOne.mockResolvedValue(mockUsuario);
      politicaEliminacion.tieneLineasActivasParaSuperLinea.mockResolvedValue(true);

      await expect(service.remove(1, 1)).rejects.toThrow(ConflictException);
      expect(repository.remove).not.toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si el usuario confirmador no existe', async () => {
      repository.findOne.mockResolvedValue(mockSuperLinea);
      usuarioService.findOne.mockResolvedValue(null as any);

      await expect(service.remove(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByDenominacionFiltered()', () => {
    it('debe mapear el resultado de la búsqueda paginada a DTOs', async () => {
      repository.findByDenominacionFiltered.mockResolvedValue({
        data: [mockSuperLinea],
        total: 1,
      });

      const result = await service.findByDenominacionFiltered('Bebidas', 0, 10, false);

      expect(repository.findByDenominacionFiltered).toHaveBeenCalledWith(
        'Bebidas',
        0,
        10,
        false,
      );
      expect(result.data).toHaveLength(1);
      expect(result.data[0].denominacion).toBe('BEBIDAS');
      expect(result.total).toBe(1);
    });
  });

  describe('findAllListado()', () => {
    it('debe retornar todas las SuperLíneas mapeadas a DTO', async () => {
      repository.findAllListado.mockResolvedValue([mockSuperLinea]);

      const result = await service.findAllListado();

      expect(repository.findAllListado).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });
});
