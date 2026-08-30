import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ReferenciaDto } from 'src/modules/common/dto/referencia.dto';

export class LocalidadDto {
  @ApiProperty({ example: 123, description: 'ID de la localidad' })
  @Type(() => Number)
  @IsInt()
  id: number;

  @ApiProperty({
    example: 'Villa Maria',
    description: 'Denominación de la localidad',
  })
  @IsString()
  denominacion: string;

  @ApiProperty({
    example: '5900',
    description: 'codigo postal',
  })
  @IsString()
  codigoPostal: string;
  @ApiProperty({ example: 123, description: 'ID de la localidad' })
  @Type(() => Number)
  @IsInt()
  sistema: number;

  @ApiProperty({
    type: () => ReferenciaDto,
    description: 'Provincia de la localidad',
    required: true,
  })
  @ValidateNested()
  @Type(() => ReferenciaDto)
  provincia: ReferenciaDto;

  @ApiProperty({
    example: null,
    description: 'Fecha de eliminación (null si está activa)',
    nullable: true,
  })
  @IsOptional()
  deletedAt: string | null;
}
