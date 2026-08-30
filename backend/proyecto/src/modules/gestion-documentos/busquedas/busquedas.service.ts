import { Injectable } from '@nestjs/common';


@Injectable()
export class BusquedasService {
  private readonly estrategias: Record<number, Function>;
  constructor(

  ) {
   
  }

  async findByFiltered(
    tipoDocumento: number,
    fechaDesde: Date,
    fechaHasta: Date,
    empresaId: number,
    operadorId: number,
    skip: number,
    take: number,
  ) {
    const estrategia = this.estrategias[tipoDocumento];
    if (!estrategia) {
      throw new Error('Tipo de documento no soportado aún');
    }

    return estrategia(
      fechaDesde,
      fechaHasta,
      empresaId,
      operadorId,
      skip,
      take,
    );
  }
}
