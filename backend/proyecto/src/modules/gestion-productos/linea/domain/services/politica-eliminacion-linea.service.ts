import { Inject, Injectable } from '@nestjs/common';
import { IProductoRepository } from '../../../producto/domain/interfaces/producto.repository-interface';

@Injectable()
export class PoliticaEliminacionLinea {
  constructor(
     @Inject('IProductoRepository')
    private readonly productoRepository: IProductoRepository,
  ) {}

  async tieneProductosActivosParaLinea(lineaId: number): Promise<boolean> {
    return this.productoRepository.existsProductosActivosByLinea(lineaId);
  }
}