import React from "react";
import { EstadosChequesConfimacionS } from "../gestion-cobros-pagos/gestion-cobros/carteras/cartera-cheques/interfaces-validaciones-cartera-cheques";

interface EstadoBadgeProps {
  estado?: string | null; // acepta undefined o null
}

const colorMap: Record<string, string> = {
  [EstadosChequesConfimacionS[0]]: "bg-gray-200 text-gray-800", // SIN CONFIRMACION
  [EstadosChequesConfimacionS[1]]: "bg-green-100 text-green-800",   // CONFIRMADO
  [EstadosChequesConfimacionS[2]]: "bg-yellow-100 text-yellow-800",     // NO CONFIRMADO
};



export const EstadoBadgeChequeConfirmacion: React.FC<EstadoBadgeProps> = ({ estado }) => {
  // Si no hay estado, no renderiza nada (o podrías mostrar un badge "SIN ESTADO")
  if (!estado) {
    return (
      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-50 text-gray-400">
        Sin estado
      </span>
    );
  }

  const color = colorMap[estado] || "bg-gray-100 text-gray-800";

  return (
    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${color}`}>
      {estado}
    </span>
  );
};
