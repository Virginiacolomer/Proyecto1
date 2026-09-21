import { Inject, Injectable } from '@nestjs/common';
import { ISuperLineaRepository } from '../interfaces/super-linea.repository.interface';

@Injectable()
export class PoliticaEliminacionSuperLinea {
  constructor(
    @Inject('ISuperLineaRepository')
    private readonly superLineaRepository: ISuperLineaRepository,
  ) {}

  async tieneLineasActivasParaSuperLinea(superLineaId: number): Promise<boolean> {
    return this.superLineaRepository.existsLineasActivasBySuperLinea(superLineaId);
  }
}
