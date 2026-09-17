import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { SuperLineaService } from './super-linea.service';
import { ISuperLineaRepository } from '../../domain/interfaces/super-linea.repository.interface';
import { PoliticaEliminacionSuperLinea } from '../../domain/services/politica-eliminacion-super-linea.service';
import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';
import { CreateSuperLineaDto } from '../../dto/create-super-linea.dto';
import { UpdateSuperLineaDto } from '../../dto/update-super-linea.dto';
import { SuperLinea } from '../../domain/entities/super-linea.entity';

describe('SuperLineaService (In-module Unit Tests)', () => {
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

  it('debe crear una nueva SuperLínea si la denominación no existe', async () => {
    const dto: CreateSuperLineaDto = {
      denominacion: 'Bebidas',
      usuarioCreatedId: 1,
    };
    repository.findByDenominacionWith.mockResolvedValue(null);
    repository.create.mockResolvedValue(mockSuperLinea);

    const res = await service.create(dto);
    expect(res).toHaveProperty('mensaje');
  });

  it('debe lanzar ConflictException al intentar crear denominaciones duplicadas', async () => {
    const dto: CreateSuperLineaDto = {
      denominacion: 'Bebidas',
      usuarioCreatedId: 1,
    };
    repository.findByDenominacionWith.mockResolvedValue(mockSuperLinea);

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
  });
});
