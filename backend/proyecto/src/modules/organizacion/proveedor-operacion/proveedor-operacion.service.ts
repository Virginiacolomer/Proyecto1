import { Injectable } from '@nestjs/common';
import { CreateProveedorOperacionDto } from './dto/create-proveedor-operacion.dto';
import { UpdateProveedorOperacionDto } from './dto/update-proveedor-operacion.dto';

@Injectable()
export class ProveedorOperacionService {
  create(createProveedorOperacionDto: CreateProveedorOperacionDto) {
    return 'This action adds a new proveedorOperacion';
  }

  findAll() {
    return `This action returns all proveedorOperacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} proveedorOperacion`;
  }

  update(id: number, updateProveedorOperacionDto: UpdateProveedorOperacionDto) {
    return `This action updates a #${id} proveedorOperacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} proveedorOperacion`;
  }
}
