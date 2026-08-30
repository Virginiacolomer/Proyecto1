import { ReactNode } from "react";
import { X } from "lucide-react";

interface EncabezadoFormulariosProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onClose: () => void;
}

export default function EncabezadoFormularios({
  title,
  subtitle,
  icon,
  onClose,
}: EncabezadoFormulariosProps) {
  return (
    <div className="form-header">
      {/* Botón cerrar */}
      <button onClick={onClose} className="btn-onClose-title-form">
            &times;
        </button>

      {/* Título */}
      <h2 className="form-title">
        {icon} 
        <span>{title}</span>

        {/* Subtítulo */}
        {subtitle && (
            <p className="form-subtitle"> - {subtitle}</p>
        )}
      </h2>

      
    </div>
  );
}
