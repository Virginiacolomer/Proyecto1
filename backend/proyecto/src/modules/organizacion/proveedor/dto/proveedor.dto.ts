import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Matches,
  IsOptional,
  Length,
  IsInt,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { ReferenciaDto } from 'src/modules/common/dto/referencia.dto';
import { OperadorDto } from 'src/modules/gestion-documentos/operador.dto';
import { CreateDomicilioDto } from 'src/modules/gutil/domicilio/dto/create-domicilio.dto';

export class ProveedorDto extends OperadorDto {
 
  @ApiProperty({
    description: 'Indica si es proveevor materia prima',
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  esProveedorMateriaPrima: boolean;

  @ApiProperty({
    description: 'Indica si es proveedor de gastos',
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  esProveedorGastos: boolean;
}
