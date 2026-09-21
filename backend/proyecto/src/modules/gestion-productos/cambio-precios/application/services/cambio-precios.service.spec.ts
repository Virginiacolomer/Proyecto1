import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { CambioPreciosService } from './cambio-precios.service';
import { Producto } from '../../../producto/domain/entities/producto.entity';
import { TipoAjustePrecio } from '../../domain/enums/tipo-ajuste-precio.enum';

/**
 * Tests de orquestación de CR-006 (Actualización masiva de precios),
 * sobre los 4 casos de prueba de la HU. Se mockean el repositorio de
 * Producto (IProductoRepository) y el DataSource/QueryRunner: no hace
 * falta una base de datos real para probar la regla de negocio.
 */
describe('CambioPreciosService (CR-006)', () => {
  let service: CambioPreciosService;
  let productoRepository: { findActivosPorLineaOMarca: jest.Mock };
  let queryRunner: {
    connect: jest.Mock;
    startTransaction: jest.Mock;
    commitTransaction: jest.Mock;
    rollbackTransaction: jest.Mock;
    release: jest.Mock;
    manager: { save: jest.Mock; create: jest.Mock };
  };
  let dataSource: { createQueryRunner: jest.Mock };

  // El precio se deriva de costo + margen (HU-008): con margen 0, el costo
  // es igual al precio.
  function crearProducto(id: number, denominacion: string, precio: number): Producto {
    const producto = new Producto();
    producto.id = id;
    producto.denominacion = denominacion;
    producto.establecerCostoMargenYStock({ costo: precio, margen: 0, stock: 0, stockMinimo: 0 });
    return producto;
  }

  beforeEach(async () => {
    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest.fn().mockImplementation((_entity, data) => Promise.resolve(data)),
        create: jest.fn().mockImplementation((_entity, data) => data),
      },
    };

    dataSource = {
      createQueryRunner: jest.fn().mockReturnValue(queryRunner),
    };

    productoRepository = {
      findActivosPorLineaOMarca: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CambioPreciosService,
        { provide: 'IProductoRepository', useValue: productoRepository },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<CambioPreciosService>(CambioPreciosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Caso de prueba 1: aumento porcentual por línea.
  it('Caso 1 - aplica un 10% a los productos de "Gaseosas" y no toca otras líneas', async () => {
    const GASEOSAS_ID = 7;
    productoRepository.findActivosPorLineaOMarca.mockResolvedValue([
      crearProducto(1, 'Coca-Cola 2L', 1000),
      crearProducto(2, 'Sprite 2L', 2000),
    ]);

    const resultado = await service.aplicar({
      tipoAjuste: TipoAjustePrecio.PORCENTAJE,
      valor: 10,
      lineaId: GASEOSAS_ID,
      motivo: 'Aumento de línea Gaseosas',
      usuarioCreatedId: 1,
    } as any);

    // Se le pidió al repositorio justo la línea "Gaseosas" -> es lo que
    // garantiza que no se toquen productos de otras líneas.
    expect(productoRepository.findActivosPorLineaOMarca).toHaveBeenCalledWith(
      GASEOSAS_ID,
      undefined,
    );

    expect(resultado.fallidos).toHaveLength(0);
    expect(resultado.actualizados).toEqual([
      expect.objectContaining({ productoId: 1, precioActual: 1000, precioNuevo: 1100 }),
      expect.objectContaining({ productoId: 2, precioActual: 2000, precioNuevo: 2200 }),
    ]);

    // Cada producto deja su registro en el historial (Escenario 2 de la HU)
    // con precio anterior, precio nuevo, motivo, tipo de ajuste y lote.
    expect(queryRunner.manager.create).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        precioAnterior: 1000,
        precioNuevo: 1100,
        tipoAjuste: TipoAjustePrecio.PORCENTAJE,
        valorAplicado: 10,
        motivo: 'Aumento de línea Gaseosas',
        loteId: resultado.loteId,
        usuarioCreatedId: 1,
      }),
    );
  });

  // El aumento se traduce en un COSTO nuevo (el precio siempre sale de
  // costo + margen, HU-008): el producto que se guarda tiene el costo
  // actualizado y el mismo margen.
  it('guarda el producto con el costo nuevo y el margen sin cambios', async () => {
    const producto = crearProducto(1, 'Coca-Cola 2L', 1000);
    producto.establecerCostoMargenYStock({ margen: 15 }); // precio $1150
    productoRepository.findActivosPorLineaOMarca.mockResolvedValue([producto]);

    const resultado = await service.aplicar({
      tipoAjuste: TipoAjustePrecio.PORCENTAJE,
      valor: 10,
      motivo: 'Aumento con margen',
      usuarioCreatedId: 1,
    } as any);

    expect(resultado.actualizados[0]).toEqual(
      expect.objectContaining({ precioActual: 1150, precioNuevo: 1265 }),
    );
    expect(queryRunner.manager.save).toHaveBeenCalledWith(
      Producto,
      expect.objectContaining({ costo: 1100, porcentaje: 15, precio: 1265 }),
    );
  });

  // Caso de prueba 2: monto fijo a todos los productos (sin línea/marca).
  it('Caso 2 - aplica +$50 a todos los productos cuando no se elige línea ni marca', async () => {
    productoRepository.findActivosPorLineaOMarca.mockResolvedValue([
      crearProducto(1, 'Producto A', 1000),
      crearProducto(2, 'Producto B', 1500),
      crearProducto(3, 'Producto C', 2000),
    ]);

    const resultado = await service.aplicar({
      tipoAjuste: TipoAjustePrecio.MONTO_FIJO,
      valor: 50,
      motivo: 'Aumento general de $50',
      usuarioCreatedId: 1,
    } as any);

    expect(productoRepository.findActivosPorLineaOMarca).toHaveBeenCalledWith(undefined, undefined);
    expect(resultado.fallidos).toHaveLength(0);
    expect(resultado.actualizados.map((p) => p.precioNuevo)).toEqual([1050, 1550, 2050]);
  });

  // Caso de prueba 3: validación de precio resultante.
  // Se manda un `valor` negativo a propósito (ver nota en producto.entity.spec.ts)
  // para forzar que el precio resultante quede en $0 o menos.
  it('Caso 3 - rechaza el producto cuyo precio resultante quedaría en $0 o menos', async () => {
    productoRepository.findActivosPorLineaOMarca.mockResolvedValue([
      crearProducto(1, 'Producto barato', 100),
    ]);

    const resultado = await service.aplicar({
      tipoAjuste: TipoAjustePrecio.MONTO_FIJO,
      valor: -150,
      motivo: 'Ajuste que rompe la regla de precio positivo',
      usuarioCreatedId: 1,
    } as any);

    expect(resultado.actualizados).toHaveLength(0);
    expect(resultado.fallidos).toEqual([
      expect.objectContaining({
        productoId: 1,
        denominacion: 'Producto barato',
        motivo: expect.stringContaining('no puede ser cero ni negativo'),
      }),
    ]);

    // No se confirma ni se persiste nada para ese producto: se hace
    // rollback y nunca se llega a guardar Producto/HistorialPrecio.
    expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
    expect(queryRunner.manager.save).not.toHaveBeenCalled();
  });

  // Caso de prueba 4: continuidad ante errores en el lote (Decisión #5:
  // "mejor esfuerzo", no todo-o-nada).
  it('Caso 4 - sigue con el resto del lote aunque un producto falle', async () => {
    productoRepository.findActivosPorLineaOMarca.mockResolvedValue([
      crearProducto(1, 'Producto inválido', 100), // 100 - 150 = -50 -> falla
      crearProducto(2, 'Producto válido A', 1000), // 1000 - 150 = 850 -> ok
      crearProducto(3, 'Producto válido B', 2000), // 2000 - 150 = 1850 -> ok
    ]);

    const resultado = await service.aplicar({
      tipoAjuste: TipoAjustePrecio.MONTO_FIJO,
      valor: -150,
      motivo: 'Lote con un producto inválido',
      usuarioCreatedId: 1,
    } as any);

    expect(resultado.fallidos).toEqual([
      expect.objectContaining({ productoId: 1, denominacion: 'Producto inválido' }),
    ]);
    expect(resultado.actualizados).toEqual([
      expect.objectContaining({ productoId: 2, precioActual: 1000, precioNuevo: 850 }),
      expect.objectContaining({ productoId: 3, precioActual: 2000, precioNuevo: 1850 }),
    ]);

    // Los dos productos válidos comparten el mismo loteId (Decisión #7).
    expect(resultado.actualizados[0]).not.toHaveProperty('loteId'); // el loteId va en el resultado, no por fila
    expect(resultado.loteId).toBeTruthy();

    // Se hizo commit para los 2 que sí se pudieron guardar, y rollback
    // solo para el que falló -> el error de uno no frena a los demás.
    expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(2);
    expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
  });
  // Decisión del equipo: un producto con costo $0 recibe el monto fijo y su
  // costo pasa a ser distinto de cero.
  it('un producto con costo $0 pasa a tener costo > 0 con un monto fijo', async () => {
    const sinCosto = new Producto();
    sinCosto.id = 9;
    sinCosto.denominacion = 'Producto sin costo';
    sinCosto.costo = 0;
    sinCosto.porcentaje = 0;
    sinCosto.precio = 0;
    productoRepository.findActivosPorLineaOMarca.mockResolvedValue([sinCosto]);

    const resultado = await service.aplicar({
      tipoAjuste: TipoAjustePrecio.MONTO_FIJO,
      valor: 100,
      motivo: 'Carga de costo faltante',
      usuarioCreatedId: 1,
    } as any);

    expect(resultado.fallidos).toHaveLength(0);
    expect(resultado.actualizados[0]).toEqual(
      expect.objectContaining({ precioActual: 0, precioNuevo: 100 }),
    );
    expect(sinCosto.costo).toBeGreaterThan(0);
  });
});
