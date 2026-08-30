import { Logger } from '@nestjs/common';
import { Producto } from '../domain/entities/producto.entity';
import { GetProductoDto } from '../dto/get-producto.dto';
import { UpdatePrecioDto } from '../dto/update-precio.dto';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { ProductoDto } from '../dto/producto.dto';

import {
  toReferenciaDto,
} from 'src/modules/common/utils/mappers/referencia.mapper';

export class ProductoMapper {
 
  private static readonly logger = new Logger(ProductoMapper.name);

  static toBusquedaDto(entity: Producto): GetProductoDto {
    const precio = entity.precio ?? 0;
    const alicuota = entity.alicuotaIva ?? 0;

    return {
      id: entity.id,
      denominacion: entity.denominacion,
      observacion: entity.observacion ?? '',
      codigoProveedorDenominacion:
        entity.codigoProveedor + ' - ' + entity.denominacion,

      codigoProveedor: entity.codigoProveedor ?? '',

      proveedor: '',
      stock: entity.stock,
      alicuota: alicuota,
      costo: entity.costo ?? 0,


      precio: precio,
      precioConIva: +(precio * (1 + alicuota / 100)).toFixed(2),
      ubicacion: entity.ubicacion ?? '',

      utilizaStockMinimo: entity.utilizaStockMinimo,

      stockMinimo: entity.stockMinimo,
      utilizaPack: entity.utilizaPack,
      cantidadPorPack: entity.cantidadPorPack ?? 0,
      sistema: entity.sistema,
      codigoReferencia: entity.codigoReferencia ?? '',

    };
  }


  static mapPrecios(
    entity: Producto,
    dto: UpdatePrecioDto,
    usuario: Usuario,
  ): void {
    entity.costo = dto.costo;
    entity.costoDolar = dto.costoDolar;
    entity.cotizacionDolar = dto.cotizacionDolar;

    entity.fechaCostoDolar = new Date();
    entity.fechaCosto = new Date();

    entity.usuarioUpdated = usuario;
  }


  static toDto(entity: Producto): ProductoDto {
   
    const alicuota = entity.alicuotaIva ?? 0;
    const precio = entity.precio ?? 0;

    return {
      id: entity.id,
      denominacion: entity.denominacion,
      observacion: entity.observacion ?? '',
      codigoProveedor: entity.codigoProveedor ?? '',
      codigoBarra: entity.codigoBarra ?? '',
      stock: entity.stock ?? 0,
      costo: entity.costo ?? 0,
      precio: entity.precio ?? 0,
      porcentaje: entity.porcentaje ?? 0,
      costoEnDolar: entity.costoEnDolar ?? false,
      costoDolar: entity.costoDolar ?? 0,
      cotizacionDolar: entity.cotizacionDolar ?? 0,
      precioDolar: entity.precioDolar ?? 0,

      destacado: entity.destacado ?? false,

      envioGratis: entity.envioGratis ?? false,
      linea: toReferenciaDto(entity.linea),
      marca: toReferenciaDto(entity.marca),
      alicuotaIva: entity.alicuotaIva,
      ubicacion: entity.ubicacion ?? '',
      utilizaStockMinimo: entity.utilizaStockMinimo ?? false,
      stockMinimo: entity.stockMinimo ?? 0,
      utilizaPack: entity.utilizaPack ?? false,
      cantidadPorPack: entity.cantidadPorPack ?? 0,
      sistema: entity.sistema,
      codigoReferencia: entity.codigoReferencia ?? '',

    
      
    };
  }


   
}
