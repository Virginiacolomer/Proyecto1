"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { AlertTriangle, HelpCircle, Info, Trash2 } from "lucide-react";
import { cn } from "../../../utils/Utils";
import { Button } from "../../ui/Button";

export type ConfirmationType = "default" | "destructive" | "warning" | "info" | "warningError";

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  type?: ConfirmationType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  className?: string;
}

export const TipoAlertaConfirmacion = {
  DEFAULT: "default" as ConfirmationType,
  DESTRUCTIVE: "destructive" as ConfirmationType,
  WARNING: "warning" as ConfirmationType,
  INFO: "info" as ConfirmationType,
  WARNING_ERROR: "warningError" as ConfirmationType,
};

export const TituloAlertaConfirmacion = {
  DEFAULT: "Confirmación",
  DESTRUCTIVE: "Eliminar elemento",
  WARNING: "Advertencia",
  INFO: "Información",
  WARNING_ERROR: "Advertencia",
};

const confirmationStyles = {
  default: {
    icon: HelpCircle,
    iconColor: "text-blue-500 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    confirmButton: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  },
  destructive: {
    icon: Trash2,
    iconColor: "text-red-500 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-500 dark:text-yellow-400",
    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
    confirmButton: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-500 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    confirmButton: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  },
  warningError: {
    icon: AlertTriangle,
    iconColor: "text-red-500 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  },
};

export function AlertasConfirmacion({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  type = "default",
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
  className,
}: ConfirmationDialogProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const style = confirmationStyles[type];
  const Icon = style.icon;

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsExiting(false);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = "hidden";
    } else {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "unset";
      }, 200);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleCancel = () => {
    if (loading) return;
    onCancel?.();
    onClose();
  };

  const handleConfirm = () => {
    if (loading) return;
    onConfirm();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      handleCancel();
    }
  };

  // Manejar tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, loading]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "bg-black/50 backdrop-blur-sm transition-all duration-200",
        isExiting && "opacity-0",
        className,
      )}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation-message"
    >
      <div
        className={cn(
          "relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl",
          "transform transition-all duration-200",
          isExiting ? "scale-95 opacity-0" : "scale-100 opacity-100",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Icono y título */}
          <div className="flex items-start gap-4 mb-4">
            <div className={cn("flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center", style.iconBg)}>
              <Icon className={cn("w-6 h-6", style.iconColor)} />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                id="confirmation-title"
                className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-6"
              >
                {title}
              </h3>
            </div>
          </div>

          {/* Mensaje */}
          <div className="mb-6">
            <p
              id="confirmation-message"
              className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line"
            >
              {message}
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end">
            {type !== "warningError" && (
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
                className="min-w-[80px] bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                {cancelText}
              </Button>
            )}
            <Button
              onClick={handleConfirm}
              disabled={loading}
              className={cn("min-w-[80px] text-white", style.confirmButton, loading && "opacity-50 cursor-not-allowed")}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Procesando...</span>
                </div>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook para gestionar diálogos de confirmación
export function useConfirmation() {
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    props: Omit<ConfirmationDialogProps, "isOpen" | "onClose">;
  }>({
    isOpen: false,
    props: {
      onConfirm: () => {},
      title: "",
      message: "",
    },
  });

  const showConfirmation = (props: Omit<ConfirmationDialogProps, "isOpen" | "onClose">) => {
    return new Promise<boolean>((resolve) => {
      setDialog({
        isOpen: true,
        props: {
          ...props,
          onConfirm: () => {
            props.onConfirm();
            setDialog((prev) => ({ ...prev, isOpen: false }));
            resolve(true);
          },
          onCancel: () => {
            props.onCancel?.();
            setDialog((prev) => ({ ...prev, isOpen: false }));
            resolve(false);
          },
        },
      });
    });
  };

  const closeConfirmation = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    showConfirmation,
    closeConfirmation,
    AlertasConfirmacion: () => (
      <AlertasConfirmacion {...dialog.props} isOpen={dialog.isOpen} onClose={closeConfirmation} />
    ),
  };
}
