import { Producto } from '../../src/modules/gestion-productos/producto/domain/entities/producto.entity';

describe('Producto Entity - HU-008', () => {
  let producto: Producto;

  beforeEach(() => {
    producto = new Producto();
  });

  describe('Escenario 1: Cálculo visual del precio en tiempo real (Capa Unitaria)', () => {
    it('debe calcular el precio automáticamente basado en el costo y porcentaje', () => {
      producto.establecerCostoMargenYStock({
        costo: 1000,
        margen: 21,
      });

      expect(producto.precio).toBe(1210);
      expect(producto.costo).toBe(1000);
      expect(producto.porcentaje).toBe(21);
    });

    it('no debe permitir sobreescribir el precio directamente por fuera de la regla matemática', () => {
      // Intentamos setear un precio externo de 5000 antes del cálculo
      producto.precio = 5000;
      
      producto.establecerCostoMargenYStock({
        costo: 1000,
        margen: 21,
      });

      // El cálculo interno prevalece e ignora el 5000
      expect(producto.precio).toBe(1210);
    });
  });
});
