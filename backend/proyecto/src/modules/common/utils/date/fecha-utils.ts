export const FechaUtils = {
  formatFechaHora(fecha: Date): string {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');

    return `${dia}/${mes}/${anio} ${hora}:${minutos}`;
  },


  formatFecha(fecha?: Date | string): string {
    if (!fecha) return '';

    const f = new Date(fecha);

    const dia = f.getDate().toString().padStart(2, '0');
    const mes = (f.getMonth() + 1).toString().padStart(2, '0');
    const anio = f.getFullYear();

    return `${dia}/${mes}/${anio}`;
  },

  formatearFechaUtC(fecha?: Date | string): string {
    if (!fecha) return '';

    const f = new Date(fecha);
    const dia = f.getUTCDate().toString().padStart(2, '0');
    const mes = (f.getUTCMonth() + 1).toString().padStart(2, '0');
    const anio = f.getUTCFullYear();

    return `${dia}/${mes}/${anio}`;
  },

  getFechaLocal(): Date {
    const ahora = new Date();
    // UTC-3 Argentina
    const offsetMs = 3 * 60 * 60 * 1000;
    return new Date(ahora.getTime() - offsetMs);
  },
};
