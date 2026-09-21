import { Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import { IProductoRepository } from '../../../producto/domain/interfaces/producto.repository-interface';
import { Producto } from '../../../producto/domain/entities/producto.entity';
import { HistorialPrecio } from '../../../producto/domain/entities/historial-precio.entity';
import { SimularAumentoMasivoDto } from '../../dto/simular-aumento-masivo.dto';
import { AplicarAumentoMasivoDto } from '../../dto/aplicar-aumento-masivo.dto';
import {
  ProductoAumentoFallidoDto,
  ProductoAumentoPreviewDto,
  ResultadoAumentoMasivoDto,
} from '../../dto/resultado-aumento-masivo.dto';

@Injectable()
export class CambioPreciosService {
  private readonly logger = new Logger(CambioPreciosService.name);

  constructor(
    @Inject('IProductoRepository')
    private readonly productoRepository: IProductoRepository,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Decisión de diseño #3: no persiste nada, solo calcula cómo quedaría
   * cada producto para que el usuario lo revise antes de confirmar.
   */
  async simular(
    dto: SimularAumentoMasivoDto,
  ): Promise<ProductoAumentoPreviewDto[]> {
    const productos = await this.buscarProductosDelAlcance(dto);

    return productos.map((producto) => ({
      productoId: producto.id,
      denominacion: producto.denominacion,
      precioActual: producto.precio ?? 0,
      precioNuevo: producto.simularAumento(dto.tipoAjuste, dto.valor),
    }));
  }

  /**
   * Decisión de diseño #4: vuelve a calcular todo en el backend (no confía
   * en precios que haya mandado el frontend).
   * Decisión de diseño #5: cada producto se actualiza en su propia
   * transacción — si uno falla, se sigue con el resto del lote.
   */
  async aplicar(
    dto: AplicarAumentoMasivoDto,
  ): Promise<ResultadoAumentoMasivoDto> {
    const productos = await this.buscarProductosDelAlcance(dto);
    const loteId = randomUUID();

    const actualizados: ProductoAumentoPreviewDto[] = [];
    const fallidos: ProductoAumentoFallidoDto[] = [];

    for (const producto of productos) {
      try {
        const resultado = await this.aplicarAUnProducto(producto, dto, loteId);
        actualizados.push(resultado);
      } catch (error) {
        this.logger.warn(
          `No se pudo aplicar el aumento al producto ${producto.id} (${producto.denominacion}): ${error.message}`,
        );
        fallidos.push({
          productoId: producto.id,
          denominacion: producto.denominacion,
          motivo: error.message,
        });
      }
    }

    this.logger.log(
      `Lote ${loteId}: ${actualizados.length} actualizados, ${fallidos.length} fallidos.`,
    );

    return { loteId, actualizados, fallidos };
  }

  private async aplicarAUnProducto(
    producto: Producto,
    dto: AplicarAumentoMasivoDto,
    loteId: string,
  ): Promise<ProductoAumentoPreviewDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // El aumento se traduce en un costo nuevo; el precio se recalcula con
      // la regla costo + margen (HU-008) dentro de la entidad.
      const precioAnterior = producto.confirmarAumento(dto.tipoAjuste, dto.valor);
      const precioNuevo = producto.precio ?? 0;

      await queryRunner.manager.save(Producto, producto);

      const historial = queryRunner.manager.create(HistorialPrecio, {
        producto,
        fecha: new Date(),
        loteId,
        precioAnterior,
        precioNuevo,
        tipoAjuste: dto.tipoAjuste,
        valorAplicado: dto.valor,
        motivo: dto.motivo,
        usuarioCreatedId: dto.usuarioCreatedId,
      });
      await queryRunner.manager.save(HistorialPrecio, historial);

      await queryRunner.commitTransaction();

      return {
        productoId: producto.id,
        denominacion: producto.denominacion,
        precioActual: precioAnterior,
        precioNuevo,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async buscarProductosDelAlcance(
    dto: SimularAumentoMasivoDto,
  ): Promise<Producto[]> {
    return this.productoRepository.findActivosPorLineaOMarca(
      dto.lineaId,
      dto.marcaId,
    );
  }
}
