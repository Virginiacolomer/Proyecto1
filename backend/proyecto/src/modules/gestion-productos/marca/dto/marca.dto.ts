import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";


export class MarcaDto  {
  @ApiProperty({ example: 123, description: 'ID del la marca' })
  @Type(() => Number)
  @IsInt()
  id: number;

  @ApiProperty({ example: 'IVECO', description: 'Denominación o nombre del producto. Esta formado por la linea y la marca' })
  @IsString()
  denominacion: string;

  @ApiProperty({ example: '', description: 'Observaciones varias sobre la marca' })
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
