import { BadRequestException } from "@nestjs/common";

export function validarFechaRango(fechaDocumento: Date, mesesAntes: number = 1) {
    const fechaActual = new Date();
  
    // Verificar si la fecha del documento es mayor a la fecha actual
    if (fechaDocumento > fechaActual) {
      throw new BadRequestException('La fecha del documento no puede ser mayor a la fecha actual');
    }
  
    // Verificar si la fecha del documento es inferior a 'mesesAntes' meses desde la fecha actual
    const fechaLimite = new Date(fechaActual);
    fechaLimite.setMonth(fechaActual.getMonth() - mesesAntes);
  
    if (fechaDocumento < fechaLimite) {
      throw new BadRequestException(`La fecha del documento no puede ser inferior a ${mesesAntes} mes(es) de la fecha actual`);
    }
  }
