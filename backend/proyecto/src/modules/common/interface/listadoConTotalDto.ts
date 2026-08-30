import { ApiProperty } from '@nestjs/swagger';

export class ListadoConTotalDto<T> {
  @ApiProperty({ description: 'Listado de resultados', isArray: true })
  data: T[];

  @ApiProperty({ description: 'Cantidad total de elementos' })
  total: number;
}