interface InformacionBaseProps {
  entidad: any;
  usuarios?: Map<number, string>;
  children?: React.ReactNode; // Para información extra
}

export default function InformacionBase({ entidad, usuarios, children }: InformacionBaseProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No tiene";
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateString));
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Información</h2>
      <hr className="my-2 border-gray-300" />
      <p>
        <strong>Denominación:</strong> {entidad.denominacion || "No tiene"}
      </p>
      <p>
        <strong>Observación:</strong> {entidad.observacion || "No tiene"}
      </p>
      <p>
        <strong>Fecha Creación:</strong> {formatDate(entidad.createdAt)}
      </p>
      <p>
        <strong>Fecha Actualización:</strong> {formatDate(entidad.updatedAt)}
      </p>
      <p>
        <strong>Fecha Eliminacion:</strong> {formatDate(entidad.deletedAt)}
      </p>
      <p>
        <strong>Usuario Creador:</strong> {usuarios?.get(entidad.usuarioCreatedId) || "Desconocido"}
      </p>
      <p>
        <strong>Usuario Actualizador:</strong> {usuarios?.get(entidad.usuarioUpdatedId) || "Desconocido"}
      </p>

      {/* Aquí van los datos extra que no son comunes */}
      {children}
    </div>
  );
}
