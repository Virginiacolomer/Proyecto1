import { ConsultarProveedor } from "../../../../interfaces/gestion-organizacion/proveedor/interfaces-proveedor";
import { ProveedorCard } from "./proveedor-card";



type Props = {
  proveedores: ConsultarProveedor[];
  onEditar: (id: number) => void;
  onMovimientos: (id: number) => void;
  onAuditoria: (id: number) => void;
  onEliminar: (id: number) => void;
};

export function ProveedoresCards({
  proveedores,
  onEditar,
  onMovimientos,
  onAuditoria,
  onEliminar,
}: Props) {
  return (
    <div className="space-y-4">
      {proveedores.map((proveedor) => (
        <ProveedorCard
          key={proveedor.id}
          proveedor={proveedor}
          onEditar={() => onEditar(proveedor.id)}
          onMovimientos={() => onMovimientos(proveedor.id)}
          onAuditoria={() => onAuditoria(proveedor.id)}
          onEliminar={() => onEliminar(proveedor.id)}
        />
      ))}
    </div>
  );
}
