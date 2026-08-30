import { Rol } from "../../../../interfaces/generales/interfaces-generales";

export const puedeAgregarProducto = (roles: number[]) =>
  roles.includes(Rol.ADMINISTRADOR);


export const puedeVerProductos = (roles: number[]) =>
  roles.includes(Rol.ADMINISTRADOR) ||
  roles.includes(Rol.VENDEDOR) ||
  roles.includes(Rol.REPARTIDOR);

export const puedeEditarProducto = (roles: number[]) =>
  roles.includes(Rol.ADMINISTRADOR);

export const puedeEliminarProducto = (roles: number[]) =>
  roles.includes(Rol.ADMINISTRADOR);

export const puedeVerPrecios = (roles: number[]) =>
  roles.includes(Rol.ADMINISTRADOR) ||
  roles.includes(Rol.VENDEDOR);

export const puedeHacerAcciones = (roles: number[]) =>
  roles.includes(Rol.ADMINISTRADOR);