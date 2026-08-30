import { Producto } from 'src/modules/gestion-productos/producto/domain/entities/producto.entity';
import { AuditoriaDto } from '../dto/auditoria.dto';
import { FechaUtils } from 'src/modules/common/utils/date/fecha-utils';
import { Marca } from 'src/modules/gestion-productos/marca/domain/entities/marca.entity';
import { Personal } from 'src/modules/organizacion/personal/domain/entities/personal.entity';
import { Cliente } from 'src/modules/organizacion/cliente/domain/entities/cliente.entity';
import { Proveedor } from 'src/modules/organizacion/proveedor/domain/entities/proveedor.entity';


export class AuditoriaMapper {

  static mapProductoToDto(entity: Producto): AuditoriaDto {
    const dto = new AuditoriaDto();
    dto.id = entity.id;
    dto.detalle = 'Producto ' + entity.denominacion;
    dto.createdAt = FechaUtils.formatFechaHora(entity.createdAt) ?? '';
    dto.updatedAt = FechaUtils.formatFechaHora(entity.updatedAt) ?? '';
    dto.deletedAt = entity.deletedAt
      ? FechaUtils.formatFechaHora(entity.deletedAt)
      : '';
    dto.usuarioCreated = entity.usuarioCreated.denominacion ?? '';
    dto.usuarioUpdated = entity.usuarioUpdated?.denominacion ?? '';
    dto.usuarioDeleted = entity.usuarioDeleted?.denominacion ?? '';

    return dto;
  }

  static mapClienteToDto(entity: Cliente) {
    const dto = new AuditoriaDto();
    dto.id = entity.id;
    dto.detalle = 'Cliente ' + entity.denominacion;
    dto.createdAt = FechaUtils.formatFechaHora(entity.createdAt) ?? '';
    dto.updatedAt = FechaUtils.formatFechaHora(entity.updatedAt) ?? '';
    dto.deletedAt = entity.deletedAt
      ? FechaUtils.formatFechaHora(entity.deletedAt)
      : '';
    dto.usuarioCreated = entity.usuarioCreated.denominacion ?? '';
    dto.usuarioUpdated = entity.usuarioUpdated?.denominacion ?? '';
    dto.usuarioDeleted = entity.usuarioDeleted?.denominacion ?? '';

    return dto;
  }

  static mapProveedorToDto(entity: Proveedor) {
    const dto = new AuditoriaDto();
    dto.id = entity.id;
    dto.detalle = 'Proveedor ' + entity.denominacion;
    dto.createdAt = FechaUtils.formatFechaHora(entity.createdAt) ?? '';
    dto.updatedAt = FechaUtils.formatFechaHora(entity.updatedAt) ?? '';
    dto.deletedAt = entity.deletedAt
      ? FechaUtils.formatFechaHora(entity.deletedAt)
      : '';
    dto.usuarioCreated = entity.usuarioCreated.denominacion ?? '';
    dto.usuarioUpdated = entity.usuarioUpdated?.denominacion ?? '';
    dto.usuarioDeleted = entity.usuarioDeleted?.denominacion ?? '';

    return dto;
  }

  static mapPersonalToDto(entity: Personal) {
     const dto = new AuditoriaDto();
    dto.id = entity.id;
    dto.detalle = 'Personal ' + entity.denominacion;
    dto.createdAt = FechaUtils.formatFechaHora(entity.createdAt) ?? '';
    dto.updatedAt = FechaUtils.formatFechaHora(entity.updatedAt) ?? '';
    dto.deletedAt = entity.deletedAt
      ? FechaUtils.formatFechaHora(entity.deletedAt)
      : '';
    dto.usuarioCreated = entity.usuarioCreated.denominacion ?? '';
    dto.usuarioUpdated = entity.usuarioUpdated?.denominacion ?? '';
    dto.usuarioDeleted = entity.usuarioDeleted?.denominacion ?? '';

    return dto;
  }

  static mapMarcaToDto(entity: Marca): AuditoriaDto {
    const dto = new AuditoriaDto();
    dto.id = entity.id;
    dto.detalle = 'MArca ' + entity.denominacion;
    dto.createdAt = FechaUtils.formatFechaHora(entity.createdAt) ?? '';
    dto.updatedAt = FechaUtils.formatFechaHora(entity.updatedAt) ?? '';
    dto.deletedAt = entity.deletedAt
      ? FechaUtils.formatFechaHora(entity.deletedAt)
      : '';
    dto.usuarioCreated ='';//"/ entity.usuarioCreated.denominacion ?? '';
    dto.usuarioUpdated ='';//entity.usuarioUpdated?.denominacion ?? '';
    dto.usuarioDeleted ='' ;//entity.usuarioDeleted?.denominacion ?? '';

    return dto;
  }


}
