import { Injectable } from '@nestjs/common';
import { CreateClienteOperacionDto } from './dto/create-cliente-operacion.dto';
import { UpdateClienteOperacionDto } from './dto/update-cliente-operacion.dto';

@Injectable()
export class ClienteOperacionService {
  create(createClienteOperacionDto: CreateClienteOperacionDto) {
    return 'This action adds a new clienteOperacion';
  }

  findAll() {
    return `This action returns all clienteOperacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clienteOperacion`;
  }

  update(id: number, updateClienteOperacionDto: UpdateClienteOperacionDto) {
    return `This action updates a #${id} clienteOperacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} clienteOperacion`;
  }
}
