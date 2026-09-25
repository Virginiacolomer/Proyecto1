import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from './producto.service';
import { LineaService } from 'src/modules/gestion-productos/linea/application/services/linea.service';
import { MarcaService } from 'src/modules/gestion-productos/marca/application/services/marca.service';
import { ProveedorService } from 'src/modules/organizacion/proveedor/application/services/proveedor.service';
import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';
import { ProductoIntrinsicValidationService } from '../../domain/services/producto-intrinsic-validation.service.ts';
import { ProductoValidationService } from '../../domain/services/producto-validation.service.ts';
import { ProductoRelatedEntitiesValidator } from '../../infraestructure/validators/producto-related-entities.validator.ts';
import { ProductoUniquenessValidator } from '../../infraestructure/validators/producto-uniqueness.validator.ts';
import { UsuarioValidator } from 'src/modules/common/utils/validation/usuario-validator';
import { ProductoDeletePolicy } from '../policies/producto-delete.policy';

describe('ProductoService - Búsqueda Rápida', () => {
  let service: ProductoService;
  let mockProductoRepository: any;

  beforeEach(async () => {
    // Mock del repositorio para interceptar las llamadas
    mockProductoRepository = {
      findBy: jest.fn().mockResolvedValue({ data: [], total: 0 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductoService,
        { provide: 'IProductoRepository', useValue: mockProductoRepository },
        { provide: LineaService, useValue: {} },
        { provide: MarcaService, useValue: {} },
        { provide: ProveedorService, useValue: {} },
        { provide: UsuarioService, useValue: {} },
        { provide: ProductoIntrinsicValidationService, useValue: {} },
        { provide: ProductoValidationService, useValue: {} },
        { provide: ProductoRelatedEntitiesValidator, useValue: {} },
        { provide: ProductoUniquenessValidator, useValue: {} },
        { provide: UsuarioValidator, useValue: {} },
        { provide: ProductoDeletePolicy, useValue: {} },
      ],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
  });

  it('Debería invocar la búsqueda en el repositorio con los parámetros correctos', async () => {
    // Escenario: El usuario envía una consulta de búsqueda (ej: "coca")
    const denominacion = 'coca';
    const skip = 0;
    const take = 10;

    await service.findBy(
      denominacion,
      '',
      0, // marca_id
      0, // linea_id
      0, // superLineaId
      0, // proveedor_id
      false, // conStock default
      0, // skip default
      10, // take default
    );

    // Verificamos que el servicio delega correctamente al repositorio sin mutar el estado
    expect(mockProductoRepository.findBy).toHaveBeenCalledWith(
      denominacion,
      '',
      0,
      0,
      0, // superLineaId
      0,
      false,
      skip,
      take,
    );
  });

  it('Debería devolver un array vacío y total 0 si no hay coincidencias', async () => {
    // Simulamos que la base de datos no encontró resultados
    mockProductoRepository.findBy.mockResolvedValue({ data: [], total: 0 });

    const result = await service.findBy(
      'xyz123',
      '',
      0,
      0,
      0, // superLineaId
      0,
      false,
      0,
      10,
    );

    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });
});
