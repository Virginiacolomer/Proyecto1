import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";


export class GetProveedorDto  {
  @ApiProperty({ example: 123, description: 'ID del la proveedor' })
  @Type(() => Number)
  @IsInt()
  id: number;

  @ApiProperty({ example: 'Caja de tornillos', description: 'Denominación o nombre del producto. Esta formado por la linea y la marca' })
  @IsString()
  denominacion: string;

}
