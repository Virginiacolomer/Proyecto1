import { ConsultarCliente } from "../../../../interfaces/gestion-organizacion/cliente/interfaces-cliente";
import { ClienteCard } from "./cliente-card";


type Props = {
  clientes: ConsultarCliente[];
  onEditar: (id: number) => void;
  onMovimientos: (id: number) => void;
  onAuditoria: (id: number) => void;
  onEliminar: (id: number) => void;
};

export function ClientesCards({
  clientes,
  onEditar,
  onMovimientos,
  onAuditoria,
  onEliminar,
}: Props) {
  return (
    <div className="space-y-4">
      {clientes.map((cliente) => (
        <ClienteCard
          key={cliente.id}
          cliente={cliente}
          onEditar={() => onEditar(cliente.id)}
          onMovimientos={() => onMovimientos(cliente.id)}
          onAuditoria={() => onAuditoria(cliente.id)}
          onEliminar={() => onEliminar(cliente.id)}
        />
      ))}
    </div>
  );
}
