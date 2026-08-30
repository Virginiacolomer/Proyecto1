import { Logger } from '@nestjs/common';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { ConfiguracionSistema } from '../domain/entities/configuracion-sistema.entity';
import { ConfiguracionSistemaDto } from '../dto/configuracion-sistema.dto';

export class ConfiguracionSistemaMapper {
  private static readonly logger = new Logger(ConfiguracionSistemaMapper.name);

  static toDto(entity: ConfiguracionSistema): ConfiguracionSistemaDto {

     return {
      id: entity.id,
      empresaId: entity.empresa.id,
      
      caracteresParaBusqueda: entity.caracteresParaBusqueda,
      ocultarTotalesDocumento: entity.ocultarTotalesDocumento,
      
      visibleSubTotalNoGravado: entity.visibleSubTotalNoGravado,
      visibleSubTotal: entity.visibleSubTotal,
      visibleIva105: entity.visibleIva105,
      visibleIva21: entity.visibleIva21,   
      precioConIvaVisible: entity.precioConIvaVisible,
      libroCajaUnica: entity.libroCajaUnico,
      carteraChequeUnica: entity.carteraChequeUnico,
      take: entity.take,
      estadisticasProducto: entity.estadisticasProducto,
      busquedaInicial: entity.busquedaInicial,
      maximoDolar: entity.maximoDolar,
     
      porcentajeAumento: entity.porcentajeAumento,
      unidadMedida: entity.unidadMedida,
      precioOferta: entity.precioOferta,
      costoDolar : entity.costoDolar,
      clientePoseePersonal: entity.clientePoseePersonal,
      electronica: entity.facturaElectronica,
    };
  }


}
