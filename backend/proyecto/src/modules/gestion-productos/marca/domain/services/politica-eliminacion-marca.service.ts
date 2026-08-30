import { Inject, Injectable } from '@nestjs/common';
import { IProductoRepository } from '../../../producto/domain/interfaces/producto.repository-interface';

@Injectable()
export class PoliticaEliminacionMarca {
  constructor(
    @Inject('IProductoRepository')
    private readonly productoRepository: IProductoRepository,
  ) {}

  async tieneProductosActivosParaMarca(marcaId: number): Promise<boolean> {
    return this.productoRepository.existsProductosActivosByMarca(marcaId);
  }
}