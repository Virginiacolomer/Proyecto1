import { ApiProperty } from '@nestjs/swagger';

export class HistorialPrecioDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1000.5 })
  precioAnterior: number;

  @ApiProperty({ example: 1200 })
  precioNuevo: number;

  @ApiProperty({ example: 'Aumento de proveedor' })
  motivo: string;

  @ApiProperty({ example: '2023-10-01T12:00:00Z' })
  fecha: Date;
}
