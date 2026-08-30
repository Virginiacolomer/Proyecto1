import { ApiProperty } from "@nestjs/swagger";


export class MensajeDto<T = any> {
  @ApiProperty({ description: 'Mensaje para el front', required: false })
  mensaje?: string;
  total?: number;
  totalItem?: number
  item?: T
  items?: T
  estadoPedido?: number
}

