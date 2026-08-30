import { jwtDecode } from "jwt-decode";
import { Auditoria } from "../../../interfaces/generales/interfaces-generales";
import { Card } from "../../ui/Card";
import { useEffect, useState } from "react";
import UsuarioService from "../../gestion-usuario/usuario-service";
import { Clock, Edit3, Info, Plus, Shield, Trash2, User } from "lucide-react";
import { Badge } from "../../ui/Badge";

interface InformacionAuditoriaProps {
  auditoria: Auditoria;
  onClose?: () => void;
}

export default function InformacionAuditoria({ auditoria, onClose }: InformacionAuditoriaProps) {
  const token = localStorage.getItem("Token");
  const rolId = token ? jwtDecode<{ rolId: number }>(token).rolId : 0;
  const [rol, setRol] = useState<string>("");

  const fetchData = async () => {
    try {
      const roleResponse = await UsuarioService.obtenerRol(rolId);

      const roleName = roleResponse?.data?.denominacion;

      setRol(roleName || "Desconocido");
    } catch (err: any) {
      console.error("Error al obtener productos:", err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const getActionBadge = (type: "created" | "updated" | "deleted") => {
    const configs = {
      created: {
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: Plus,
      },
      updated: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Edit3,
      },
      deleted: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: Trash2,
      },
    };

    const config = configs[type];
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={`${config.color} flex items-center gap-1 px-2 py-1`}>
        <Icon size={12} />
        {type === "created" ? "Creado" : type === "updated" ? "Actualizado" : "Eliminado"}
      </Badge>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto p-4">
      <Card className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-4 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            &times;
          </button>

          <div className="flex items-center gap-3 pr-12">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Detalles de Auditoría</h2>
              <p className="text-slate-300 text-sm mt-1">{auditoria.detalle}</p>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* ID para usuarios Root */}
          {rol === "Root" && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-amber-800">
                <Info size={16} />
                <span className="font-medium">ID del Registro:</span>
                <code className="bg-amber-100 px-2 py-1 rounded text-sm font-mono">{auditoria.id}</code>
              </div>
            </div>
          )}

          {/* Sección de Fechas */}
          <div className="space-y-4">
            <div className="grid gap-4">
              {/* Creación */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">{getActionBadge("created")}</div>
                  <span className="text-sm text-slate-600">{auditoria.createdAt}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <User size={14} />
                  <span className="text-sm font-medium">{auditoria.usuarioCreated}</span>
                </div>
              </div>

              {/* Actualización */}
              {auditoria.updatedAt && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">{getActionBadge("updated")}</div>
                    <span className="text-sm text-slate-600">{auditoria.updatedAt}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <User size={14} />
                    <span className="text-sm font-medium">{auditoria.usuarioUpdated || "No especificado"}</span>
                  </div>
                </div>
              )}

              {/* Eliminación */}
              {auditoria.deletedAt && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">{getActionBadge("deleted")}</div>
                    <span className="text-sm text-slate-600">{auditoria.deletedAt}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <User size={14} />
                    <span className="text-sm font-medium">{auditoria.usuarioDeleted || "No especificado"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Estados sin datos */}
          {!auditoria.updatedAt && !auditoria.deletedAt && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
              <Clock size={24} className="mx-auto text-slate-400 mb-2" />
              <p className="text-slate-600 text-sm">Este registro no ha sido modificado desde su creación</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
