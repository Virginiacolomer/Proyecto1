import { Producto } from './producto.entity';
import { ProductoInvalidoException } from '../exceptions/producto-invalido.exception';

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

