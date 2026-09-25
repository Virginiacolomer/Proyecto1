import { Producto } from './producto.entity';
import { ProductoInvalidoException } from '../exceptions/producto-invalido.exception';

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
      producto.presentacion = { id: 1, denominacion: presentacion } as any;
    }
    return producto;
  };

  it('Escenario 1: Generación automática de la denominación (Camino feliz)', () => {
    const producto = crearProductoConAtributos('Circe', 'Aceites', '1L');
    const denominacion = producto.generarDenominacionAutomatica();

    expect(denominacion).toBe('Circe Aceites 1L');
  });

  it('Escenario 2: Edición manual y persistencia respetando el texto manual', () => {
    const producto = crearProductoConAtributos('Circe', 'Aceites', '1L');
    producto.asignarDenominacion('Circe Aceites 1L - Extra Virgen');

    expect(producto.denominacion).toBe('Circe Aceites 1L - Extra Virgen');
  });

  it('Escenario 3: Actualización reactiva al cambiar la presentación', () => {
    const producto = crearProductoConAtributos('Circe', 'Aceites', '1L');
    expect(producto.generarDenominacionAutomatica()).toBe('Circe Aceites 1L');

    // Cambia la presentación
    const nuevaDenominacion = producto.generarDenominacionAutomatica('2L');
    expect(nuevaDenominacion).toBe('Circe Aceites 2L');
  });

  it('Escenario 4: Autogeneración cuando no se pasa texto manual o viene vacío', () => {
    const producto = crearProductoConAtributos('Caroyense', 'Aceitunas', '1L');

    producto.asignarDenominacion('');
    expect(producto.denominacion).toBe('Caroyense Aceitunas 1L');

    producto.asignarDenominacion(null);
    expect(producto.denominacion).toBe('Caroyense Aceitunas 1L');

    producto.asignarDenominacion(undefined);
    expect(producto.denominacion).toBe('Caroyense Aceitunas 1L');
  });

  it('Escenario 5: Validación de longitud máxima (rechaza si supera 255 caracteres)', () => {
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

  it('Normalización: recorta espacios al inicio y final (trim) y elimina espacios dobles', () => {
    const producto = crearProductoConAtributos(
      '   Circe   ',
      '   Aceites  ',
      '   1L   ',
    );
    const denominacion = producto.generarDenominacionAutomatica();

    expect(denominacion).toBe('Circe Aceites 1L');
  });
});
