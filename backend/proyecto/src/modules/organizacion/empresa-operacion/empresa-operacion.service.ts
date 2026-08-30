import { Injectable } from '@nestjs/common';
import { CreateEmpresaOperacionDto } from './dto/create-empresa-operacion.dto';
import { UpdateEmpresaOperacionDto } from './dto/update-empresa-operacion.dto';

@Injectable()
export class EmpresaOperacionService {
  create(createEmpresaOperacionDto: CreateEmpresaOperacionDto) {
    return 'This action adds a new empresaOperacion';
  }

  findAll() {
    return `This action returns all empresaOperacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} empresaOperacion`;
  }

  update(id: number, updateEmpresaOperacionDto: UpdateEmpresaOperacionDto) {
    return `This action updates a #${id} empresaOperacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} empresaOperacion`;
  }
}
