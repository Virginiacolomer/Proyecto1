import { Injectable } from '@nestjs/common';
import { CreateProductoOperacionDto } from './dto/create-producto-operacion.dto';
import { UpdateProductoOperacionDto } from './dto/update-producto-operacion.dto';

@Injectable()
export class ProductoOperacionService {
  create(createProductoOperacionDto: CreateProductoOperacionDto) {
    return 'This action adds a new productoOperacion';
  }

  findAll() {
    return `This action returns all productoOperacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productoOperacion`;
  }

  update(id: number, updateProductoOperacionDto: UpdateProductoOperacionDto) {
    return `This action updates a #${id} productoOperacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} productoOperacion`;
  }
}
