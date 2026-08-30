import { PartialType } from '@nestjs/swagger';
import { CreateClienteOperacionDto } from './create-cliente-operacion.dto';

export class UpdateClienteOperacionDto extends PartialType(CreateClienteOperacionDto) {}
