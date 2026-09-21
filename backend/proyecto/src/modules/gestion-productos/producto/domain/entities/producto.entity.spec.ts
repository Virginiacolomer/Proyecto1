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

describe('Producto - Denominación automática (CR-005)', () => {
  const crearProductoConAtributos = (
    marcaNombre: string,
    lineaNombre: string,
    presentacion?: string,
  ): Producto => {
    const producto = new Producto();
    producto.marca = { id: 1, denominacion: marcaNombre } as any;
    producto.linea = { id: 1, denominacion: lineaNombre } as any;
    if (presentacion !== undefined) {
      producto.presentacion = presentacion;
    }
    return producto;
  };

  it('Caso 1: autocompleta exitosamente con Marca, Línea y Presentación (Happy Path)', () => {
    const producto = crearProductoConAtributos('Quilmes', 'Cervezas', 'Pack x6');
    const denominacion = producto.generarDenominacionAutomatica();

    expect(denominacion).toBe('Quilmes Cervezas Pack x6');
  });

  it('Caso 2: asignarDenominacion respeta la edición manual personalizada del usuario', () => {
    const producto = crearProductoConAtributos('Quilmes', 'Cervezas', 'Pack x6');
    producto.asignarDenominacion('Quilmes Cervezas Pack x6 - Edición Especial');

    expect(producto.denominacion).toBe(
      'Quilmes Cervezas Pack x6 - Edición Especial',
    );
  });

  it('Caso 3: actualiza reactivamente la denominación si cambia la presentación', () => {
    const producto = crearProductoConAtributos('Coca-Cola', 'Gaseosas', '1.5L');
    expect(producto.generarDenominacionAutomatica()).toBe(
      'Coca-Cola Gaseosas 1.5L',
    );

    // Cambia la presentación
    const nuevaDenominacion = producto.generarDenominacionAutomatica('2.25L');
    expect(nuevaDenominacion).toBe('Coca-Cola Gaseosas 2.25L');
  });

  it('Caso 4: asignarDenominacion autogenera cuando no se pasa texto manual o viene vacío', () => {
    const producto = crearProductoConAtributos('Coca-Cola', 'Gaseosas', '1.5L');

    producto.asignarDenominacion('');
    expect(producto.denominacion).toBe('Coca-Cola Gaseosas 1.5L');

    producto.asignarDenominacion(null);
    expect(producto.denominacion).toBe('Coca-Cola Gaseosas 1.5L');

    producto.asignarDenominacion(undefined);
    expect(producto.denominacion).toBe('Coca-Cola Gaseosas 1.5L');
  });

  it('Caso 5: lanza excepción si la denominación supera los 255 caracteres', () => {
    const marcaLarga = 'A'.repeat(150);
    const lineaLarga = 'B'.repeat(150);
    const producto = crearProductoConAtributos(marcaLarga, lineaLarga, '1L');

    expect(() => producto.generarDenominacionAutomatica()).toThrow(
      ProductoInvalidoException,
    );
    expect(() => producto.asignarDenominacion('C'.repeat(256))).toThrow(
      ProductoInvalidoException,
    );
  });

  it('normaliza dobles espacios y recorta espacios al inicio y final (trim)', () => {
    const producto = crearProductoConAtributos(
      '  Coca-Cola   ',
      '   Gaseosas  ',
      '   1.5L   ',
    );
    const denominacion = producto.generarDenominacionAutomatica();

    expect(denominacion).toBe('Coca-Cola Gaseosas 1.5L');
  });
});

