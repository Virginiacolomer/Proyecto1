import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class NormalizeDenominacionSearchPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value?.denominacion && typeof value.denominacion !== 'string') {
      throw new BadRequestException('La denominación debe ser una cadena.');
    }

    if (
      typeof value?.denominacion === 'string' &&
      value.denominacion.trim() !== ''
    ) {
      value.denominacion = value.denominacion.trim().toUpperCase();
    } else {
      // Si está vacía o solo espacios, la eliminamos
      delete value.denominacion;
    }

    return value;
  }
}
