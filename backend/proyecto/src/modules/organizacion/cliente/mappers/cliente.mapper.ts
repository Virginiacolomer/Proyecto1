import { OperadorDto } from 'src/modules/gestion-documentos/operador.dto';
import { DomicilioMapper } from 'src/modules/gutil/domicilio/mappers/domicilio.mapper';
import { toReferenciaDtoOrEmpty } from 'src/modules/common/utils/mappers/referencia.mapper';
import { OperadorSearchDto } from 'src/modules/gestion-documentos/operador-search.dto';
import { CondicionIvaMapper } from 'src/modules/gutil/condicion-iva/mappers/condicion-iva.mapper';
import { Cliente } from '../domain/entities/cliente.entity';

export class ClienteMapper {
  static toOperadorDto(cliente: Cliente, empresaId: number): OperadorDto {
    const saldo = 0;

    return {
      id: cliente.id,
      denominacion: cliente.denominacion ?? '',
      denominacionAfip: cliente.denominacionAfip ?? '',
      observacion: cliente.observacion ?? '',
      cuit: cliente.cuit ?? '',
      dni: cliente.dni ?? '',
      condicionIva: CondicionIvaMapper.toDto(cliente.condicionIva),
      vendedor: toReferenciaDtoOrEmpty(cliente.personal),
      codigo: cliente.codigo ?? '0',
      domicilio: cliente.domicilio
        ? DomicilioMapper.toDto(cliente.domicilio)
        : undefined,
      domicilioString: DomicilioMapper.toString(cliente.domicilio) ?? ' ',
      saldo,
      letra: cliente.condicionIva.letra,
     mail: cliente.mail ?? '',
      sistema: cliente.sistema,
      

    };
  }

  static toOperadorSearchDto(
    cliente: Cliente,
    empresaId: number,

  ): OperadorSearchDto {
    const saldo =0;

   
    return {
      id: cliente.id,
      denominacion: cliente.denominacion ?? '',
      denominacionAfip: cliente.denominacionAfip ?? '',
      codigo: cliente.codigo ?? '-',
      observacion: cliente.observacion ?? '',
      cuit: cliente.cuit ?? '',
      dni: cliente.dni ?? '',
      condicionIva: cliente.condicionIva.denominacion,
      domicilioString: DomicilioMapper.toString(cliente.domicilio) ?? ' ',
      saldo,
      letra: cliente.condicionIva.letra,
      sistema: cliente.sistema,
      vendedor: toReferenciaDtoOrEmpty(cliente.personal),
    };
  }

 
}
