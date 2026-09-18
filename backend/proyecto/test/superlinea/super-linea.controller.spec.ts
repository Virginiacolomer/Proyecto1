import { Test, TestingModule } from '@nestjs/testing';
import { SuperLineaController } from 'src/modules/gestion-productos/superlinea/application/controllers/super-linea.controller';
import { SuperLineaService } from 'src/modules/gestion-productos/superlinea/application/services/super-linea.service';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { CreateSuperLineaDto } from 'src/modules/gestion-productos/superlinea/dto/create-super-linea.dto';
import { UpdateSuperLineaDto } from 'src/modules/gestion-productos/superlinea/dto/update-super-linea.dto';
import { PaginationWithDenominacionDto } from 'src/modules/common/dto/busquedas/pagination-with-denominacion.dto';

describe('SuperLineaController (Unit Tests)', () => {
  let controller: SuperLineaController;
  let service: any;

  const mockResponsePost = { mensaje: 'SuperLínea creada correctamente' };
  const mockSuperLineaDto: any = {
    id: 1,
    denominacion: 'BEBIDAS',
    observacion: 'Refrescos',
    sistema: 0,
    deletedAt: null,
  };

  beforeEach(async () => {
    const mockService = {
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

  describe('POST /superlinea (create)', () => {
    it('debe invocar al servicio create y devolver la respuesta', async () => {
      const dto: CreateSuperLineaDto = {
        denominacion: 'Bebidas',
        usuarioCreatedId: 1,
      };
      service.create.mockResolvedValue(mockResponsePost as any);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResponsePost);
    });
  });

  describe('GET /superlinea/search-by (findByDenominacionFiltered)', () => {
    it('debe invocar al servicio de búsqueda filtrada con paginación', async () => {
      const paginationDto: PaginationWithDenominacionDto = {
        denominacion: 'Bebidas',
        skip: 0,
        take: 10,
        incluirEliminados: false,
      };

      service.findByDenominacionFiltered.mockResolvedValue({
        data: [mockSuperLineaDto],
        total: 1,
      });

      const result = await controller.findByDenominacionFiltered(paginationDto);

      expect(service.findByDenominacionFiltered).toHaveBeenCalledWith(
        'Bebidas',
        0,
        10,
        false,
      );
      expect(result.data).toHaveLength(1);
    });
  });

  describe('GET /superlinea/listado (findAllListado)', () => {
    it('debe retornar el listado completo de SuperLíneas', async () => {
      service.findAllListado.mockResolvedValue([mockSuperLineaDto]);

      const result = await controller.findAllListado();

      expect(service.findAllListado).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe('GET /superlinea/:id (findOne)', () => {
    it('debe retornar un SuperLineaDto por ID', async () => {
      service.findDtoById.mockResolvedValue(mockSuperLineaDto);

      const result = await controller.findOne(1);

      expect(service.findDtoById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockSuperLineaDto);
    });
  });

  describe('PUT /superlinea/:id (update)', () => {
    it('debe actualizar una SuperLínea', async () => {
      const updateDto: UpdateSuperLineaDto = {
        denominacion: 'Bebidas Calientes',
        usuarioUpdatedId: 1,
      };

      service.update.mockResolvedValue({ mensaje: 'SuperLínea editada correctamente' } as any);

      const result = await controller.update(1, updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toHaveProperty('mensaje');
    });
  });

  describe('DELETE /superlinea/:id (remove)', () => {
    it('debe eliminar una SuperLínea indicando el usuario', async () => {
      service.remove.mockResolvedValue({ mensaje: 'SuperLínea eliminada correctamente' } as any);

      const result = await controller.remove(1, 1);

      expect(service.remove).toHaveBeenCalledWith(1, 1);
      expect(result).toHaveProperty('mensaje');
    });
  });
});
