import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Shield, Search } from "lucide-react";
import { Alertas, useAlerts } from "../../herramientas/alertas/alertas";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Superlinea } from "../../../interfaces/gestion-producto/superlinea/interfaces-superlinea";
import SuperLineaService from "./services/superlinea-service";
import { SuperlineaModal, SuperlineaModalTipo } from "./modales/superlinea-modal";
import { getUsuarioId } from "../../../utils/auth";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../../herramientas/alertas/alertas-confirmacion";
import { parseApiError } from "../../../utils/errores";

export default function ConsultarSuperlinea() {
  const [superlineas, setSuperlineas] = useState<Superlinea[]>([]);
  const [loading, setLoading] = useState(false);
  const [denominacionSearch, setDenominacionSearch] = useState("");
  const [modalTipo, setModalTipo] = useState<SuperlineaModalTipo>(null);
  const [superlineaSeleccionada, setSuperlineaSeleccionada] = useState<Superlinea | null>(null);
  const [auditoria, setAuditoria] = useState<any>(null);

  const { addAlert, alerts, removeAlert } = useAlerts();
  const { showConfirmation, AlertasConfirmacion } = useConfirmation();
  const usuarioId = getUsuarioId();

  const cargarSuperlineas = async () => {
    setLoading(true);
    try {
      const data = await SuperLineaService.obtenerListado();
      setSuperlineas(data || []);
    } catch (err) {
      addAlert(parseApiError(err), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSuperlineas();
  }, []);

  const handleEliminar = async (superlinea: Superlinea) => {
    const confirmed = await showConfirmation({
      type: TipoAlertaConfirmacion.DANGER,
      title: TituloAlertaConfirmacion.ELIMINAR,
      message: `¿Estás seguro de que deseas eliminar la SuperLínea "${superlinea.denominacion}"?`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      onConfirm: () => {},
    });

    if (confirmed) {
      try {
        const res = await SuperLineaService.eliminar(superlinea.id, usuarioId);
        addAlert(res.mensaje || "SuperLínea eliminada correctamente", "success");
        cargarSuperlineas();
      } catch (err) {
        addAlert(parseApiError(err), "error");
      }
    }
  };

  const handleAuditoria = async (id: number) => {
    try {
      const data = await SuperLineaService.obtenerAuditoria(id);
      setAuditoria(data);
      setModalTipo("auditoria");
    } catch (err) {
      addAlert(parseApiError(err), "error");
    }
  };

  const superlineasFiltradas = superlineas.filter((sl) =>
    sl.denominacion.toLowerCase().includes(denominacionSearch.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <Alertas alerts={alerts} removeAlert={removeAlert} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Gestión de SuperLíneas
            </CardTitle>
            <p className="text-sm text-gray-500">
              Administra los niveles superiores para organizar las Líneas de productos.
            </p>
          </div>
          <Button
            onClick={() => {
              setSuperlineaSeleccionada(null);
              setModalTipo("alta");
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4" /> Nueva SuperLínea
          </Button>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar SuperLínea por denominación..."
                value={denominacionSearch}
                onChange={(e) => setDenominacionSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
                <tr>
                  <th className="px-6 py-3">Denominación</th>
                  <th className="px-6 py-3">Observación</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      Cargando SuperLíneas...
                    </td>
                  </tr>
                ) : superlineasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      No se encontraron SuperLíneas.
                    </td>
                  </tr>
                ) : (
                  superlineasFiltradas.map((sl) => (
                    <tr key={sl.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{sl.denominacion}</td>
                      <td className="px-6 py-4">{sl.observacion || "-"}</td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSuperlineaSeleccionada(sl);
                            setModalTipo("edicion");
                          }}
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAuditoria(sl.id)}
                          title="Auditoría"
                        >
                          <Shield className="w-4 h-4 text-purple-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEliminar(sl)}
                          disabled={sl.sistema === 1}
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <SuperlineaModal
        open={!!modalTipo}
        tipo={modalTipo}
        superlinea={superlineaSeleccionada}
        auditoria={auditoria}
        onClose={() => setModalTipo(null)}
        onSuccess={(msg) => {
          setModalTipo(null);
          addAlert(msg, "success");
          cargarSuperlineas();
        }}
      />

      <AlertasConfirmacion />
    </div>
  );
}
