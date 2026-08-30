import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsDate, IsInt, Min } from "class-validator";


export class PaginationEmpresaFechasDto {
  @ApiProperty({ example: '2024-01-01', type: String, format: 'date' })
  @IsDate()
  @Type(() => Date)
  fechaDesde: Date;

  @ApiProperty({ example: '2024-12-31', type: String, format: 'date' })
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      date.setUTCHours(23, 59, 59, 999);
    }
    return date;
  })
  fechaHasta: Date;

  @ApiProperty({ default: 0 })
  @IsInt()
  @Type(() => Number)
  empresaId: number = 0;

  @ApiProperty({ default: 0 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  skip: number = 0;

  @ApiProperty({ default: 10 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  take: number = 10;
}

