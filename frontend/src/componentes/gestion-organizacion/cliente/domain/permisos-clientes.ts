import { Rol } from "../../../../interfaces/generales/interfaces-generales";


export const puedeAgregar = (roles: number[]) =>
  roles.includes(Rol.ADMINISTRADOR) ||
  roles.includes(Rol.VENDEDOR);

export const puedeEditar = (roles: number[]) =>
  roles.includes(Rol.ADMINISTRADOR) ||
  roles.includes(Rol.VENDEDOR)||
  roles.includes(Rol.REPARTIDOR)||
  roles.includes(Rol.COBRADOR);

export const puedeEliminar = (roles: number[]) =>
  roles.includes(Rol.ADMINISTRADOR);