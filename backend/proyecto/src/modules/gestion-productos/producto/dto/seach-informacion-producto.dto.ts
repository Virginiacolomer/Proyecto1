import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsDate, IsInt, IsOptional, Min } from "class-validator";


export class SearchInformacionProductoDto  {
  @Type(() => Number)
  @IsInt()
  productoId: number;

  @IsDate()
  @Type(() => Date)
  fechaDesde: Date;

  @ApiProperty({
      description: 'Fecha final del filtro (incluida)',
      example: '2024-12-31',
      type: String,
      format: 'date',
    })
    @IsDate()
    @Type(() => Date)
    @Transform(({ value }) => {
      const date = new Date(value);
      // Asegura que si la fecha es válida, la lleva al final del día en UTC
      if (!isNaN(date.getTime())) {
        date.setUTCHours(23, 59, 59, 999);
      }
      return date;
    })
    fechaHasta: Date;

  @IsInt()
  @Min(0, { message: 'skip debe ser un número entero positivo o 0' })
  @Type(() => Number)
  skip: number = 0;

  @IsInt()
  @Min(1, { message: 'take debe ser un número entero mayor que 0' })
  @Type(() => Number)
  take: number = 10;
}
