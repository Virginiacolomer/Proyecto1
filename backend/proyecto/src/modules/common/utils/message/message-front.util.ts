
import { MensajeDto } from './mensajeDto';

export class MessageFrontUtils {

  static create(mensaje: string): MensajeDto {
    return { mensaje };
  }

  static eliminarItem(
    mensaje: string,
    total: number,
  ): MensajeDto {
    return { mensaje, total };
  }

  static createdItem(
    mensaje: string,
    total: number,
  ): MensajeDto {
    return { mensaje, total };
  }

  static createSimple(
    nombre: string,
    denominacion: string,
    accion: 'creada' | 'editada' | 'eliminada' | 'cerrado',
  ): MensajeDto {
    return this.create(
      `${nombre} ${accion} con éxito con denominacion: ${denominacion}`,
    );
  }

    static createSimple2(
    nombre: string,
    numeroDocumento: string,
    cambioEstado : string,
  ): MensajeDto {
    return this.create(
      `${nombre} ${ numeroDocumento} a cambiado de ${cambioEstado} con éxito `,
    );
  }
 
  static createActualizacionPrecioMasiva(
    denominacion: string,
  ): MensajeDto {
    return this.create(
      ` La actualización de precios masiva se realizo : ${denominacion}`,
    );
  }
  
  static create2(nombre: string): MensajeDto {
    return this.create(`${nombre}  con éxito`);
  }




}
