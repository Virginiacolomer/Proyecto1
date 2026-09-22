import ApiService from "../../../../utils/apiService";
import {
  ConsultarProductosCambioPreciosMasivo,
  FiltroAlcanceCambioPrecios,
  ResultadoAumentoMasivo,
  TipoAjustePrecio,
} from "../../../../interfaces/gestion-producto/producto/interfaces-producto";

export interface AumentoMasivoPayload extends FiltroAlcanceCambioPrecios {
  tipoAjuste: TipoAjustePrecio;
  valor: number;
}

export interface AplicarAumentoMasivoPayload extends AumentoMasivoPayload {
  motivo: string;
  usuarioCreatedId: number;
}

const CambioPreciosMasivoService = {
  // Previsualiza el aumento (no persiste nada) — POST /cambio-precios/simular
  simular: (
    payload: AumentoMasivoPayload
  ): Promise<ConsultarProductosCambioPreciosMasivo[]> =>
    ApiService.post("/cambio-precios/simular", payload),

  // Recalcula en el backend y confirma el aumento — POST /cambio-precios/aplicar
  aplicar: (
    payload: AplicarAumentoMasivoPayload
  ): Promise<ResultadoAumentoMasivo> =>
    ApiService.post("/cambio-precios/aplicar", payload),

  // Las líneas y marcas para los filtros se buscan en el endpoint real de
  // Producto (el de "cambio-precios" para esto nunca existió).
  buscarMarcas: (denominacion: string) =>
    ApiService.get("/producto/find-all-for-marcas/select", { denominacion }),

  buscarLineas: (denominacion: string) =>
    ApiService.get("/producto/find-all-for-lineas/select", { denominacion }),
};

export default CambioPreciosMasivoService;
