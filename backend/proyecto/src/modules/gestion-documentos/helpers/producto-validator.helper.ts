import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Producto } from 'src/modules/gestion-productos/producto/domain/entities/producto.entity';
import { ProductoService } from 'src/modules/gestion-productos/producto/application/services/producto.service';

@Injectable()
export class ProductoValidator {
  constructor(
    private readonly productoService: ProductoService,
    
  ) {}


  async validarProductosExisten(
    productosIds: number[],
  ): Promise<Map<number, Producto>> {
    if (productosIds.length === 0) {
      throw new BadRequestException('Debe incluir al menos un producto');
    }

    const productos = await this.productoService.findByIds(productosIds);
    const productosMap = new Map(productos.map((p) => [p.id, p]));

    // Validar que todos los productos existen
    const productosNoEncontrados = productosIds.filter(
      (id) => !productosMap.has(id),
    );

    if (productosNoEncontrados.length > 0) {
      throw new NotFoundException(
        `Productos no encontrados: ${productosNoEncontrados.join(', ')}`,
      );
    }

    return productosMap;
  }
}
