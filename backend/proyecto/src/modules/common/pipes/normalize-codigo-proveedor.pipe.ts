import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';


@Injectable()
export class NormalizeCodigoProveedorPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const codigo = value?.codigoProveedor;

    // Si el campo está presente pero no es string → error
    if (codigo !== undefined && typeof codigo !== 'string') {
      throw new BadRequestException('El código del proveedor debe ser una cadena.');
    }

    // Si hay un string, lo normalizamos
    if (typeof codigo === 'string' && codigo.trim() !== '') {
      value.codigoProveedor = codigo.trim().toLowerCase();
    }

    return value;
  }
}