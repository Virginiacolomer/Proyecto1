import UsuarioService from "../componentes/gestion-usuario/usuario-service";

export const obtenerUsuarioId = async (id: number) => {
  const usuario = await UsuarioService.obtenerUsuarioId(id);
  if (!usuario) throw new Error("No se encontró el usuario");
  return usuario;
};