import { OperadorDto } from 'src/modules/gestion-documentos/operador.dto';
import { GetProveedorDto } from '../dto/get-proveedor.dto';
import { DomicilioMapper } from 'src/modules/gutil/domicilio/mappers/domicilio.mapper';
import { OperadorSearchDto } from 'src/modules/gestion-documentos/operador-search.dto';
import { CondicionIvaMapper } from 'src/modules/gutil/condicion-iva/mappers/condicion-iva.mapper';
import { toReferenciaDtoOrEmpty } from 'src/modules/common/utils/mappers/referencia.mapper';
import { Proveedor } from '../domain/entities/proveedor.entity';
import { ProveedorDto } from '../dto/proveedor.dto';

export class ProveedorMapper {
  static toOperadorDto(proveedor: Proveedor, empresaId: number): OperadorDto {
    const saldo =0
      

    return {
      id: proveedor.id,
      denominacion: proveedor.denominacion ?? '',
      denominacionAfip: proveedor.denominacionAfip ?? '',
      observacion: proveedor.observacion ?? '',
      cuit: proveedor.cuit ?? '',
      dni: '',
      condicionIva: CondicionIvaMapper.toDto(proveedor.condicionIva),
      codigo: proveedor.codigoProveedor,
      domicilio: proveedor.domicilio
        ? DomicilioMapper.toDto(proveedor.domicilio)
        : undefined,
      domicilioString: 'aca va domicilio',
      saldo,
      letra: proveedor.condicionIva.letra,
      mail:  '',
      sistema: proveedor.sistema,
    };
  }

  static toDto2(proveedor: Proveedor, empresaId: number): ProveedorDto {
    const saldo =0;

    return {
      id: proveedor.id,
      denominacion: proveedor.denominacion ?? '',
      denominacionAfip: proveedor.denominacionAfip ?? '',
      observacion: proveedor.observacion ?? '',
      cuit: proveedor.cuit ?? '',
      dni: '',
      condicionIva: CondicionIvaMapper.toDto(proveedor.condicionIva),
      codigo: proveedor.codigoProveedor,
      domicilio: proveedor.domicilio
        ? DomicilioMapper.toDto(proveedor.domicilio)
        : undefined,
      domicilioString: DomicilioMapper.toString(proveedor.domicilio) ?? ' ',
      saldo,
      letra: proveedor.condicionIva.letra,
      sistema: proveedor.sistema,
      esProveedorMateriaPrima: proveedor.esProveedorMateriaPrima,
      esProveedorGastos: proveedor.esProveedorGastos,
      mail: '',
    };
  }


  static toDto(entity: Proveedor): GetProveedorDto {
    return {
      id: entity.id,
      denominacion: entity.denominacion,
    };
  }

  static toOperadorSearchDto(
    proveedor: Proveedor,
    empresaId: number,
  ): OperadorSearchDto {
    if (!proveedor.condicionIva) {
      console.error(`Proveedor ${proveedor.id} no tiene condición IVA`);
    }

    if (!proveedor.domicilio) {
      console.error(`Proveedor ${proveedor.id} no tiene domicilio`);
    }

    const saldo =0


    return {
      id: proveedor.id,
      denominacion: proveedor.denominacion ?? '',
      denominacionAfip: proveedor.denominacionAfip ?? '',
      codigo: proveedor.codigoProveedor,
      observacion: proveedor.observacion ?? '',
      cuit: proveedor.cuit ?? '',
      dni: '',
      condicionIva: proveedor.condicionIva.denominacion,
      domicilioString: DomicilioMapper.toString(proveedor.domicilio) ?? ' ',
      saldo,
      letra: proveedor.condicionIva.letra,
      sistema: proveedor.sistema,
      vendedor: toReferenciaDtoOrEmpty(null),
      esProveedorGastos: proveedor.esProveedorGastos,
      esProveedorMateriaPrima: proveedor.esProveedorMateriaPrima,
    };
  }


}
