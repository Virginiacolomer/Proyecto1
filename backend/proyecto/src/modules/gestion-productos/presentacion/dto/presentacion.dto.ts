import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";


export class PresentacionDto  {
  @ApiProperty({ example: 123, description: 'ID del la presentacion' })
  @Type(() => Number)
  @IsInt()
  id: number;

  @ApiProperty({ example: 'IVECO', description: 'Denominación o nombre del producto. Esta formado por la linea y la presentacion' })
  @IsString()
  denominacion: string;

  @ApiProperty({ example: '', description: 'Observaciones varias sobre la presentacion' })
  @IsString()
  observacion: string;

  @ApiProperty({ example: 1, description: 'de sistema no se puede editar ni eliminar' })
  @Type(() => Number)
  @IsInt()
  sistema: number;

  @ApiProperty({ example: null, description: 'Fecha de eliminación (null si está activa)', nullable: true })
  @IsOptional()
  deletedAt: string | null;
}
