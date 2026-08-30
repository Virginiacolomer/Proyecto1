import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class UpdatePrecioDto {
  
  @ApiProperty({ example: 100.5, description: 'Costo en moneda local' })
  @IsNumber()
  @Min(0, { message: 'skip debe ser un número entero positivo o 0' })
  costo: number;

  @ApiProperty({ example: 50.25, description: 'Costo en dólares' })
  @IsNumber()
  @Min(0, { message: 'skip debe ser un número entero positivo o 0' })
  costoDolar: number;

  @ApiProperty({ example: 50.25, description: 'Costo en dólares' })
  @IsNumber()
  @Min(0, { message: 'skip debe ser un número entero positivo o 0' })
  cotizacionDolar: number;

  @ApiProperty({ example: 10, description: 'Porcentaje de aumento' })
  @IsNumber()
  @Min(0, { message: 'Porcentaje de aumento ' })
  porcentaje: number;


  @ApiProperty({ example: 3, description: 'ID del usuario que realiza la actualización' })
  @IsNumber()
  usuarioId: number;
}