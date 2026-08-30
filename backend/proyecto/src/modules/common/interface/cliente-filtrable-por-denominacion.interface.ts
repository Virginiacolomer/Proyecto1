export interface ClienteFiltrablePorDenominacion<TResponse> {
  findAllByClienteDenominacion(
    empresaId: number,
    denominacion: string,
  ): Promise<TResponse>;
}