import { createCrudService } from "../../../utils/crudFactory";
import ApiService from "../../../utils/apiService";
import {
  CreateNotificacionUsuarioPayload,
  MotivoNotificacionUsuarioDto,
  UsuarioDto,
  ListadoConTotalDto,
} from "../interfaces/notificacion.types";

const baseService = createCrudService<CreateNotificacionUsuarioPayload>("notificacion-usuario");

const NotificacionUsuarioService = {
  ...baseService,

  obtenerMotivos: (tipo: number): Promise<ListadoConTotalDto<MotivoNotificacionUsuarioDto>> =>
    ApiService.get("/notificacion-usuario/find-all-for-motivos/select", { tipo }),

  obtenerUsuarios: (usuarioId: number): Promise<ListadoConTotalDto<UsuarioDto>> =>
    ApiService.get("/notificacion-usuario/find-all-for-usuarios/select", { usuarioId }),

  enviar: (payload: CreateNotificacionUsuarioPayload): Promise<void> =>
    ApiService.post("/notificacion-usuario", payload),
};

export default NotificacionUsuarioService;
