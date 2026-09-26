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

  it('Escenario 2: Edición manual y persistencia', () => {
    const producto = crearProductoConAtributos('Circe', 'Aceites', '1L');
    producto.asignarDenominacion('Circe Aceites 1L - Extra Virgen');

    expect(producto.denominacion).toBe('Circe Aceites 1L - Extra Virgen');
  });

  it('Escenario 3: No sobreescritura ante la edición manual', () => {
    const producto = crearProductoConAtributos('Circe', 'Aceites', '1L');
    producto.asignarDenominacion('Circe Aceites 1L - Extra Virgen');

    // Cambia la línea en la entidad a "Aceitunas"
    producto.linea = { id: 2, denominacion: 'Aceitunas' } as any;

    // Al no invocar regeneración, la denominación previa se conserva intacta
    expect(producto.denominacion).toBe('Circe Aceites 1L - Extra Virgen');
  });

  it('Escenario 4: Regeneración mediante el botón', () => {
    const producto = crearProductoConAtributos('Caroyense', 'Aceitunas', '1L');
    const denominacionRegenerada = producto.generarDenominacionAutomatica();

    expect(denominacionRegenerada).toBe('Caroyense Aceitunas 1L');
  });

  it('Escenario 5: Validación de campos requeridos y longitud máxima', () => {
    const productoVacio = new Producto();
    expect(() => productoVacio.generarDenominacionAutomatica()).toThrow(
      ProductoInvalidoException,
    );

    const marcaLarga = 'A'.repeat(150);
    const lineaLarga = 'B'.repeat(150);
    const productoLargo = crearProductoConAtributos(marcaLarga, lineaLarga, '1L');

    expect(() => productoLargo.generarDenominacionAutomatica()).toThrow(
      ProductoInvalidoException,
    );
    expect(() => productoLargo.asignarDenominacion('C'.repeat(256))).toThrow(
      ProductoInvalidoException,
    );
  });
});
