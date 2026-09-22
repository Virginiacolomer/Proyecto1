import { BadRequestException } from '@nestjs/common';
import { Producto } from './producto.entity';
import { ProductoInvalidoException } from '../exceptions/producto-invalido.exception';
import { TipoAjustePrecio } from '../../../cambio-precios/domain/enums/tipo-ajuste-precio.enum';

describe('Producto - establecerCostoMargenYStock', () => {
  const datosValidos = {
    costo: 100,
    margen: 30,
    stock: 10,
    stockMinimo: 2,
  };

  it('crear producto con costo = 0 lanza excepción de dominio', () => {
    const producto = new Producto();
    expect(() =>
      producto.establecerCostoMargenYStock({ ...datosValidos, costo: 0 }),
    ).toThrow(ProductoInvalidoException);
  });

  it('crear producto con costo negativo lanza excepción de dominio', () => {
    const producto = new Producto();
    expect(() =>
      producto.establecerCostoMargenYStock({ ...datosValidos, costo: -50 }),
    ).toThrow(ProductoInvalidoException);
  });

  it('crear producto con margen negativo lanza excepción de dominio', () => {
    const producto = new Producto();
    expect(() =>
      producto.establecerCostoMargenYStock({ ...datosValidos, margen: -1 }),
    ).toThrow(ProductoInvalidoException);
  });

  it('crear producto con stock actual negativo lanza excepción de dominio', () => {
    const producto = new Producto();
    expect(() =>
      producto.establecerCostoMargenYStock({ ...datosValidos, stock: -1 }),
    ).toThrow(ProductoInvalidoException);
  });

  it('crear producto con stock mínimo negativo lanza excepción de dominio', () => {
    const producto = new Producto();
    expect(() =>
      producto.establecerCostoMargenYStock({
        ...datosValidos,
        stockMinimo: -1,
      }),
    ).toThrow(ProductoInvalidoException);
  });

  it('crear producto con costo y margen inválidos simultáneamente reporta ambos errores', () => {
    const producto = new Producto();
    try {
      producto.establecerCostoMargenYStock({
        ...datosValidos,
        costo: 0,
        margen: -5,
      });
      fail('Se esperaba que lanzara ProductoInvalidoException');
    } catch (error) {
      expect(error).toBeInstanceOf(ProductoInvalidoException);
      const response = error.getResponse() as { message: string[] };
      expect(response.message).toEqual(
        expect.arrayContaining([
          'El costo debe ser mayor a cero',
          'El margen no puede ser negativo',
        ]),
      );
      expect(response.message).toHaveLength(2);
    }
  });

  it('crear producto válido calcula el precio como costo + (costo * margen / 100)', () => {
    const producto = new Producto();
    producto.establecerCostoMargenYStock(datosValidos);

    expect(producto.costo).toBe(100);
    expect(producto.porcentaje).toBe(30);
    expect(producto.stock).toBe(10);
    expect(producto.stockMinimo).toBe(2);
    expect(producto.precio).toBe(130);
  });

  it('editar un producto válido con un costo inválido no muta su estado interno', () => {
    const producto = new Producto();
    producto.establecerCostoMargenYStock(datosValidos);

    expect(() =>
      producto.establecerCostoMargenYStock({ costo: 0 }),
    ).toThrow(ProductoInvalidoException);

    // El estado previo se conserva intacto
    expect(producto.costo).toBe(100);
    expect(producto.porcentaje).toBe(30);
    expect(producto.stock).toBe(10);
    expect(producto.stockMinimo).toBe(2);
    expect(producto.precio).toBe(130);
  });
});

/**
 * Tests de la regla de negocio de CR-006 (Actualización masiva de precios)
 * a nivel de la entidad Producto, que es donde vive el cálculo
 * (Decisión de diseño #2).
 *
 * Como el precio siempre se deriva de costo + margen (HU-008), el aumento
 * se traduce en un costo nuevo: el margen no cambia y el precio resultante
 * sale de la misma fórmula que usa establecerCostoMargenYStock.
 */
describe('Producto - simularAumento / confirmarAumento (CR-006)', () => {
  // Producto con el costo y margen indicados; el precio se deriva solo.
  function crearProducto(
    costo: number,
    margen = 0,
    denominacion = 'Coca-Cola 2L',
  ): Producto {
    const producto = new Producto();
    producto.id = 1;
    producto.denominacion = denominacion;
    producto.establecerCostoMargenYStock({ costo, margen, stock: 0, stockMinimo: 0 });
    return producto;
  }

  // Producto con costo 0 (dato que HU-008 ya no deja crear, pero que puede
  // existir en la base por datos anteriores).
  function crearProductoConCostoCero(margen = 0): Producto {
    const producto = new Producto();
    producto.id = 1;
    producto.denominacion = 'Producto sin costo';
    producto.costo = 0;
    producto.porcentaje = margen;
    producto.precio = 0;
    return producto;
  }

  describe('simularAumento', () => {
    // Caso de prueba 1 (Aumento porcentual por línea): la parte "por línea"
    // se prueba a nivel del service (buscarProductosDelAlcance); acá se
    // valida el cálculo puro del 10% sobre cada precio del escenario.
    it('calcula un aumento por PORCENTAJE (10% sobre $1000 → $1100)', () => {
      const producto = crearProducto(1000);
      expect(producto.simularAumento(TipoAjustePrecio.PORCENTAJE, 10)).toBe(1100);
    });

    it('calcula un aumento por PORCENTAJE (10% sobre $2000 → $2200)', () => {
      const producto = crearProducto(2000);
      expect(producto.simularAumento(TipoAjustePrecio.PORCENTAJE, 10)).toBe(2200);
    });

    // Caso de prueba 2 (Monto fijo a todos los productos)
    it.each([
      [1000, 1050],
      [1500, 1550],
      [2000, 2050],
    ])('calcula un aumento por MONTO_FIJO de $50 sobre $%s → $%s', (precioActual, esperado) => {
      const producto = crearProducto(precioActual);
      expect(producto.simularAumento(TipoAjustePrecio.MONTO_FIJO, 50)).toBe(esperado);
    });

    it('con margen 15%: el precio sube el 10% pedido (costo $1000 → precio $1150 → $1265)', () => {
      const producto = crearProducto(1000, 15);
      expect(producto.precio).toBe(1150);
      expect(producto.simularAumento(TipoAjustePrecio.PORCENTAJE, 10)).toBe(1265);
    });

    it('con margen 15%: el monto fijo se suma al PRECIO ($1150 + $50 → $1200)', () => {
      const producto = crearProducto(1000, 15);
      expect(producto.simularAumento(TipoAjustePrecio.MONTO_FIJO, 50)).toBe(1200);
    });

    it('no modifica el producto (solo simula)', () => {
      const producto = crearProducto(1000, 15);
      producto.simularAumento(TipoAjustePrecio.PORCENTAJE, 10);
      expect(producto.costo).toBe(1000);
      expect(producto.precio).toBe(1150);
    });

    it('trata un precio undefined como $0', () => {
      const producto = new Producto();
      producto.denominacion = 'Sin precio';
      expect(producto.simularAumento(TipoAjustePrecio.MONTO_FIJO, 100)).toBe(100);
    });

    // Producto con costo 0: el monto fijo se suma y el costo pasa a ser
    // distinto de cero (decisión del equipo).
    it('con costo $0 y MONTO_FIJO de $100, el precio pasa a $100', () => {
      const producto = crearProductoConCostoCero();
      expect(producto.simularAumento(TipoAjustePrecio.MONTO_FIJO, 100)).toBe(100);
    });

    it('con costo $0 y PORCENTAJE no se puede salir de cero (se rechaza)', () => {
      const producto = crearProductoConCostoCero();
      expect(() => producto.simularAumento(TipoAjustePrecio.PORCENTAJE, 10)).toThrow(
        BadRequestException,
      );
    });

    // Caso de prueba 3 (Validación de precio resultante).
    // El DTO de la API exige valor > 0 (solo "aumentos"); para probar que
    // la regla "no puede quedar en cero o negativo" la garantiza el
    // dominio -y no solo el borde HTTP-, acá se llama al método con un
    // valor negativo, salteando esa validación a propósito.
    it('rechaza el ajuste si el precio resultante queda en $0 o menos', () => {
      const producto = crearProducto(100);
      expect(() => producto.simularAumento(TipoAjustePrecio.MONTO_FIJO, -150)).toThrow(
        BadRequestException,
      );
    });

    it('el mensaje de error incluye la denominación y el precio inválido calculado', () => {
      const producto = crearProducto(100, 0, 'Sprite 2L');
      expect(() => producto.simularAumento(TipoAjustePrecio.MONTO_FIJO, -150)).toThrow(
        /Sprite 2L.*-50/,
      );
    });

    it('rechaza el ajuste si el precio resultante da exactamente $0', () => {
      const producto = crearProducto(100);
      expect(() => producto.simularAumento(TipoAjustePrecio.MONTO_FIJO, -100)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('confirmarAumento', () => {
    it('devuelve el precio anterior y deja el precio nuevo derivado del costo', () => {
      const producto = crearProducto(1000);
      const precioAnterior = producto.confirmarAumento(TipoAjustePrecio.PORCENTAJE, 10);

      expect(precioAnterior).toBe(1000);
      expect(producto.precio).toBe(1100);
    });

    it('el aumento se aplica sobre el COSTO y el margen no cambia', () => {
      const producto = crearProducto(1000, 15);
      producto.confirmarAumento(TipoAjustePrecio.PORCENTAJE, 10);

      expect(producto.costo).toBe(1100);
      expect(producto.porcentaje).toBe(15);
      expect(producto.precio).toBe(1265);
    });

    it('el precio sigue siendo costo + margen tras el aumento (no queda un precio suelto)', () => {
      const producto = crearProducto(870, 15);
      producto.confirmarAumento(TipoAjustePrecio.MONTO_FIJO, 50);

      const esperado = Math.round((producto.costo! + producto.costo! * 0.15) * 100000) / 100000;
      expect(producto.precio).toBe(esperado);
    });

    it('con costo $0 y MONTO_FIJO: el costo pasa a ser distinto de cero', () => {
      const producto = crearProductoConCostoCero(20);
      producto.confirmarAumento(TipoAjustePrecio.MONTO_FIJO, 100);

      expect(producto.costo).toBeGreaterThan(0);
      expect(producto.precio).toBeCloseTo(100, 3);
    });

    it('si el aumento es inválido no modifica el producto', () => {
      const producto = crearProducto(100);
      expect(() => producto.confirmarAumento(TipoAjustePrecio.MONTO_FIJO, -150)).toThrow(
        BadRequestException,
      );
      expect(producto.costo).toBe(100);
      expect(producto.precio).toBe(100);
    });

    it('actualiza la fecha del costo', () => {
      const producto = crearProducto(1000);
      producto.confirmarAumento(TipoAjustePrecio.PORCENTAJE, 10);
      expect(producto.fechaCosto).toBeInstanceOf(Date);
    });
  });
});
