import { Test, TestingModule } from '@nestjs/testing';
import { PoliticaEliminacionPresentacion } from '../../src/modules/gestion-productos/presentacion/domain/services/politica-eliminacion-presentacion.service';
import { IProductoRepository } from '../../src/modules/gestion-productos/producto/domain/interfaces/producto.repository-interface';

describe('PoliticaEliminacionPresentacion', () => {
  let service: PoliticaEliminacionPresentacion;
  let productoRepository: jest.Mocked<IProductoRepository>;

  beforeEach(async () => {
    productoRepository = {
      existsProductosActivosByPresentacion: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoliticaEliminacionPresentacion,
        {
          provide: 'IProductoRepository',
          useValue: productoRepository,
        },
      ],
    }).compile();

    service = module.get<PoliticaEliminacionPresentacion>(
      PoliticaEliminacionPresentacion,
    );
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('tieneProductosActivosParaPresentacion', () => {
    it('debe retornar true si hay productos activos', async () => {
      productoRepository.existsProductosActivosByPresentacion.mockResolvedValue(true);

      const result = await service.tieneProductosActivosParaPresentacion(1);

      expect(result).toBe(true);
      expect(productoRepository.existsProductosActivosByPresentacion).toHaveBeenCalledWith(1);
    });

    it('debe retornar false si no hay productos activos', async () => {
      productoRepository.existsProductosActivosByPresentacion.mockResolvedValue(false);

      const result = await service.tieneProductosActivosParaPresentacion(1);

      expect(result).toBe(false);
      expect(productoRepository.existsProductosActivosByPresentacion).toHaveBeenCalledWith(1);
    });
  });
});
