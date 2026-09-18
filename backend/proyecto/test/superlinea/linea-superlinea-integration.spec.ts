import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { LineaService } from 'src/modules/gestion-productos/linea/application/services/linea.service';
import { ILineaRepository } from 'src/modules/gestion-productos/linea/domain/interfaces/linea.repository.interface';
import { PoliticaEliminacionLinea } from 'src/modules/gestion-productos/linea/domain/services/politica-eliminacion-linea.service';
import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';
import { CreateLineaDto } from 'src/modules/gestion-productos/linea/dto/create-linea.dto';

describe('Linea & SuperLinea Integration / Business Rules', () => {
  let lineaService: LineaService;
  let lineaRepo: jest.Mocked<ILineaRepository>;
  let politicaEliminacionLinea: jest.Mocked<PoliticaEliminacionLinea>;
  let usuarioService: jest.Mocked<UsuarioService>;

  beforeEach(async () => {
    const mockRepo: Partial<ILineaRepository> = {
      create: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
      findByDenominacionWith: jest.fn(),
      remove: jest.fn(),
    };

    const mockPolitica: Partial<PoliticaEliminacionLinea> = {
      tieneProductosActivosParaLinea: jest.fn(),
    };

    const mockUsuarioService: Partial<UsuarioService> = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LineaService,
        { provide: 'ILineaRepository', useValue: mockRepo },
        { provide: PoliticaEliminacionLinea, useValue: mockPolitica },
        { provide: UsuarioService, useValue: mockUsuarioService },
      ],
    }).compile();

    lineaService = module.get<LineaService>(LineaService);
    lineaRepo = module.get('ILineaRepository');
    politicaEliminacionLinea = module.get(PoliticaEliminacionLinea);
    usuarioService = module.get(UsuarioService);
  });

  it('debe permitir crear una Línea asociándole el id de una SuperLínea obligatoria', async () => {
    const dto: CreateLineaDto = {
      denominacion: 'Gaseosas',
      superLineaId: 1, // SuperLínea "Bebidas"
      utilizaStockMinimo: false,
      usuarioCreatedId: 1,
      deletedAt: null,
    };

    lineaRepo.findByDenominacionWith.mockResolvedValue(null);
    lineaRepo.create.mockResolvedValue({
      id: 10,
      denominacion: 'GASEOSAS',
      superLineaId: 1,
      utilizaStockMinimo: false,
      stockMinimo: 0,
      sistema: 0,
      lineas: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const result = await lineaService.create(dto);

    expect(lineaRepo.create).toHaveBeenCalledWith(dto);
    expect(result).toHaveProperty('mensaje');
  });

  it('debe lanzar la excepción refactorizada en LineaService.remove al intentar borrar línea con productos activos', async () => {
    const mockLinea = { id: 10, denominacion: 'GASEOSAS', sistema: 0 } as any;
    const mockUsuario = { id: 1, denominacion: 'Admin' } as any;

    lineaRepo.findOne.mockResolvedValue(mockLinea);
    usuarioService.findOne.mockResolvedValue(mockUsuario);
    politicaEliminacionLinea.tieneProductosActivosParaLinea.mockResolvedValue(true);

    await expect(lineaService.remove(10, 1)).rejects.toThrow(
      'No se puede eliminar la línea porque está asociada a productos activos.',
    );
  });
});
