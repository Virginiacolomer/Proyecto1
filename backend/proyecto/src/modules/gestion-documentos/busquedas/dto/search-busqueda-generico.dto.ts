import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsDate, IsInt, IsNotEmpty, Min } from "class-validator";

export class SearchBusquedaGenericoDto {

     @ApiProperty({
       description: 'Fecha inicial del filtro (incluida)',
       example: '2024-01-01',
       type: String,
       format: 'date',
     })
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
   
     @ApiProperty({
       description: 'ID de la empresa. Si no se envía, toma el valor 0.',
       example: 1,
       required: false,
       default: 0,
     })
     @IsInt()
     @Type(() => Number)
     empresaId: number = 0;
   
     @ApiProperty({
       description: 'Cantidad de elementos a omitir (paginación)',
       example: 0,
       minimum: 0,
       default: 0,
     })
     @IsInt()
     @Min(0, { message: 'skip debe ser un número entero positivo o 0' })
     @Type(() => Number)
     skip: number = 0;
   
     @ApiProperty({
       description: 'Cantidad de elementos a retornar (paginación)',
       example: 10,
       minimum: 1,
       default: 10,
     })
     @IsInt()
     @Min(1, { message: 'take debe ser un número entero mayor que 0' })
     @Type(() => Number)
     take: number = 10;
   
     
     @ApiProperty({
       description: 'ID de la empresa. Si no se envía, toma el valor 0.',
       example: 1,
       required: false,
       default: 0,
     })
     @IsInt()
     @Type(() => Number)
     operadorId: number = 0;


      @ApiProperty({
       description: 'tipo documento .',
       example: 1,
     })
     @IsInt()
     @Type(() => Number)
     tipoDocumento: number;
}
