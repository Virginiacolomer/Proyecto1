"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "../../../utils/Utils";

export type AlertType = "success" | "error" | "warning" | "info";

export interface AlertProps {
  id?: string;
  type: AlertType;
  title?: string;
  message: string;
  dismissible?: boolean;
  autoClose?: boolean;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

export const TipoAlerta = {
  SUCCESS: "success" as AlertType,
  ERROR: "error" as AlertType,
  WARNING: "warning" as AlertType,
  INFO: "info" as AlertType,
};

export const TituloAlerta = {
  SUCCESS: "Éxito",
  ERROR: "Error",
  WARNING: "Advertencia",
  INFO: "Información",
};

const alertStyles = {
  success: {
    container:
      "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200",
    icon: CheckCircle,
    iconColor: "text-green-500 dark:text-green-400",
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200",
    icon: AlertCircle,
    iconColor: "text-red-500 dark:text-red-400",
  },
  warning: {
    container:
      "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200",
    icon: AlertTriangle,
    iconColor: "text-yellow-500 dark:text-yellow-400",
  },
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200",
    icon: Info,
    iconColor: "text-blue-500 dark:text-blue-400",
  },
};

export function Alert({
  type,
  title,
  message,
  dismissible = true,
  autoClose = false,
  duration = 5000,
  onClose,
  className,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const style = alertStyles[type];
  const Icon = style.icon;

  useEffect(() => {
    if (autoClose && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 200);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 p-4 border rounded-lg shadow-sm transition-all duration-200",
        style.container,
        isExiting && "opacity-0 scale-95 transform",
        className,
      )}
      role="alert"
      aria-live="polite"
    >
      <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", style.iconColor)} />

      <div className="flex-1 min-w-0">
        {title && <h4 className="font-semibold text-sm mb-1">{title}</h4>}
        <p className="text-sm leading-relaxed">{message}</p>
      </div>

      {dismissible && (
        <button
          onClick={handleClose}
          className={cn(
            "flex-shrink-0 p-1 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/5",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent",
            type === "success" && "focus:ring-green-500",
            type === "error" && "focus:ring-red-500 bg-red-500 text-white",
            type === "warning" && "focus:ring-yellow-500",
            type === "info" && "focus:ring-blue-500",
          )}
          aria-label="Cerrar alerta"
        >
          <X className="h-4 w-4 opacity-60 hover:opacity-100" />
        </button>
      )}
    </div>
  );
}

// Hook para gestionar múltiples alertas
export function useAlerts() {
  const [alerts, setAlerts] = useState<(AlertProps & { id: string })[]>([]);

  const addAlert = (alert: Omit<AlertProps, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newAlert = { ...alert, id };

    setAlerts((prev) => [...prev, newAlert]);

    return id;
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  return {
    alerts,
    addAlert,
    removeAlert,
    clearAlerts,
  };
}

// Componente contenedor para múltiples alertas
export function Alertas({
  alerts,
  onRemove,
  className,
}: {
  alerts: (AlertProps & { id: string })[];
  onRemove: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("fixed top-4 right-4 z-50 space-y-2 max-w-md", className)}>
      {alerts.map((alert) => (
        <Alert key={alert.id} {...alert} onClose={() => onRemove(alert.id)} />
      ))}
    </div>
  );
}
