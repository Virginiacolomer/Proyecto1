
import { BadRequestException } from '@nestjs/common';
import { NormalizeDenominacionSearchPipe } from './normalize-denominations-search.pipe';

describe('NormalizeDenominacionSearchPipe', () => {
  let pipe: NormalizeDenominacionSearchPipe;

  beforeEach(() => {
    pipe = new NormalizeDenominacionSearchPipe();
  });

  it('debería convertir a mayúsculas y eliminar espacios', () => {
    const input = { denominacion: '  prueba nombre  ' };
    const result = pipe.transform(input, { type: 'query' } as any);
    expect(result.denominacion).toBe('PRUEBA NOMBRE');
  });

  it('debería eliminar la propiedad si es string vacío', () => {
    const input = { denominacion: '' };
    const result = pipe.transform(input, { type: 'query' } as any);
    expect(result).not.toHaveProperty('denominacion');
  });

  it('debería eliminar la propiedad si son solo espacios', () => {
    const input = { denominacion: '     ' };
    const result = pipe.transform(input, { type: 'query' } as any);
    expect(result).not.toHaveProperty('denominacion');
  });

  it('debería mantener el objeto si no tiene denominacion', () => {
    const input = { otroCampo: 'algo' };
    const result = pipe.transform(input, { type: 'query' } as any);
    expect(result).toEqual({ otroCampo: 'algo' });
  });

  it('debería lanzar BadRequestException si denominacion no es string', () => {
    const input = { denominacion: 123 };
    expect(() => pipe.transform(input, { type: 'query' } as any)).toThrow(BadRequestException);
  });
});
