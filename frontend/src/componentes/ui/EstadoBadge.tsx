import React from "react";
import { EstadoPresupuestoS } from "../../interfaces/gestion-venta/presupuesto-venta/interfaces-presupuesto-venta";
import { EstadosPedidoVentaS } from "../../interfaces/gestion-venta/pedido-venta/interfaces-pedido-venta";

interface EstadoBadgeProps {
  estado?: string | null; // acepta undefined o null
}

const colorMap: Record<string, string> = {
  [EstadoPresupuestoS[0]]: "bg-yellow-100 text-yellow-800", // PENDIENTE DE CONFIRMACIÓN
  [EstadoPresupuestoS[1]]: "bg-green-100 text-green-800",   // CONFIRMADO
  [EstadoPresupuestoS[2]]: "bg-blue-100 text-blue-800",     // CONFIRMADO PARCIAL
  [EstadoPresupuestoS[3]]: "bg-red-100 text-red-800",       // NO CONFIRMADOS
  [EstadoPresupuestoS[4]]: "bg-gray-200 text-gray-800",     // REEMPLAZADO
  [EstadoPresupuestoS[5]]: "bg-orange-100 text-orange-800", // PERDIDA DE CONFIRMADO
  [EstadosPedidoVentaS[0]]: "bg-yellow-100 text-yellow-800", // NO CONFIRMADO
  [EstadosPedidoVentaS[1]]: "bg-blue-100 text-blue-800",     // PARA DESPACHO
  [EstadosPedidoVentaS[2]]: "bg-purple-100 text-purple-800", // DESPACHADO
  [EstadosPedidoVentaS[3]]: "bg-green-100 text-green-800",   // ENTREGADO
  [EstadosPedidoVentaS[4]]: "bg-indigo-100 text-indigo-800", // PARCIALMENTE FACTURADO
  [EstadosPedidoVentaS[5]]: "bg-gray-800 text-white",        // FACTURADO
};



export const EstadoBadge: React.FC<EstadoBadgeProps> = ({ estado }) => {
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
