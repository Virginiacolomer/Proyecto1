
import { ConsultarUsuario } from "../../../../interfaces/gestion-usuario/interfaces-usuario";
import { UsuarioCard } from "./usuario-card";




type Props = {
  usuarios: ConsultarUsuario[];
  onEditar: (id: number) => void;
  onAuditoria: (id: number) => void;
  onEliminar: (id: number) => void;
};

export function UsuariosCards({
  usuarios,
  onEditar,

  onAuditoria,
  onEliminar,
}: Props) {
  return (
    <div className="space-y-4">
      {usuarios.map((usuario) => (
        <UsuarioCard
          key={usuario.id}
          usuario={usuario}
          onEditar={() => onEditar(usuario.id)}

          onAuditoria={() => onAuditoria(usuario.id)}
          onEliminar={() => onEliminar(usuario.id)}
        />
      ))}
    </div>
  );
}
