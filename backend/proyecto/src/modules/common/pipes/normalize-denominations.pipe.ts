import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';


@Injectable()
export class NormalizeDenominacionPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value?.denominacion && typeof value.denominacion !== 'string') {
      throw new BadRequestException('La denominación debe ser una cadena.');
    }

    if (value?.denominacion) {
      const normalizedValue = value.denominacion.trim().toUpperCase();
      if (normalizedValue.length === 0) {
        throw new BadRequestException('La denominación no puede estar vacía.');
      }
      value.denominacion = normalizedValue;
    }
    return value;
  }
}