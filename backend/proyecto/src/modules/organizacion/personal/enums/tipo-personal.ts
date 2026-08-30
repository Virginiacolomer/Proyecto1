export enum TipoPersonalN {
  ADMINISTRADOR = 1,
  EMPLEADO = 2,
  REPOSITOR = 3,
  VENDEDOR = 4,
  ROOT = 5,
  REPARTIDOR=6,
  COBRADOR=7 ,
}

export enum TipoPersonal {
  ADMINISTRADOR = 'ADMINISTRADOR',
  EMPLEADO  = 'EMPLEADO',
  REPOSITOR= 'REPOSITOR',
  VENDEDOR = 'VENDEDOR',
  ROOT = 'ROOT',
  REPARTIDOR='REPARTIDOR',
  COBRADOR= 'COBRADOR' ,
}


export function mapearPersonalANumero(tipo: TipoPersonal): TipoPersonalN {
  return TipoPersonalN[tipo as keyof typeof TipoPersonalN];
}