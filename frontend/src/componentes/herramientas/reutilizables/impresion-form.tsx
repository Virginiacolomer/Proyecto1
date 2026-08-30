import type React from "react";
import { useState } from "react";
import { Printer, FileText, Images as Pages, Check } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/Dialog";
import { Label } from "../../ui/Label";
import { Button } from "../../ui/Button";

interface ImpresionFormProps {
  entityName: string;
  onImprimirTodo: () => void;
  onImprimirPagina: () => void;
  triggerButton?: React.ReactNode;
  totalItems?: number;
  currentPage?: number;
}

export function ImpresionForm({
  entityName,
  onImprimirTodo,
  onImprimirPagina,
  triggerButton,
  totalItems,
  currentPage = 1,
}: ImpresionFormProps) {
  const [printOption, setPrintOption] = useState<"all" | "current">("current");
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePrint = async () => {
    setIsProcessing(true);

    try {
      if (printOption === "all") {
        await onImprimirTodo();
      } else {
        await onImprimirPagina();
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Error al imprimir:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const defaultTrigger = (
    <Button
      variant="outline"
      size="sm"
      className="bg-blue-500 hover:bg-blue-700 text-white flex items-center px-4 py-3"
    >
      <Printer className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-blue-50/50 rounded-t-lg -z-10" />

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            <Printer className="h-8 w-8 text-white relative z-10" />
          </div>

          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent justify-center flex items-center">
            Opciones de Impresión
          </DialogTitle>
          <DialogDescription className="text-balance text-gray-600 font-medium justify-center flex items-center">
            Selecciona qué deseas imprimir de {entityName.toLowerCase()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          <div
            onClick={() => setPrintOption("current")}
            className={`group relative flex items-start space-x-4 rounded-xl border-2 p-5 transition-all duration-300 cursor-pointer ${
              printOption === "current"
                ? "border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md"
                : "border-gray-200 bg-white hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-25 hover:to-indigo-25 hover:shadow-sm"
            }`}
          >
            <div className="flex-1 space-y-2">
              <Label
                htmlFor="current"
                className="flex items-center gap-3 font-semibold cursor-pointer text-gray-800 group-hover:text-blue-700 transition-colors"
              >
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    printOption === "current"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                </div>
                Página Actual
              </Label>
              <p className="text-sm text-gray-600 ml-11">
                Imprimir solamente {entityName.toLowerCase()} de la página{" "}
                <span className="font-semibold text-blue-600">#{currentPage}</span>
              </p>
            </div>
            {printOption === "current" && (
              <div className="absolute top-3 right-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
              </div>
            )}
          </div>

          <div
            onClick={() => setPrintOption("all")}
            className={`group relative flex items-start space-x-4 rounded-xl border-2 p-5 transition-all duration-300 cursor-pointer ${
              printOption === "all"
                ? "border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md"
                : "border-gray-200 bg-white hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-25 hover:to-indigo-25 hover:shadow-sm"
            }`}
          >
            <div className="flex-1 space-y-2">
              <Label
                htmlFor="all"
                className="flex items-center gap-3 font-semibold cursor-pointer text-gray-800 group-hover:text-blue-700 transition-colors"
              >
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    printOption === "all"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600"
                  }`}
                >
                  <Pages className="h-4 w-4" />
                </div>
                Todo lo Disponible
              </Label>
              <p className="text-sm text-gray-600 ml-11">
                Imprimir la totalidad de {entityName.toLowerCase()}
                {totalItems && (
                  <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {totalItems} elementos
                  </span>
                )}
              </p>
            </div>
            {printOption === "all" && (
              <div className="absolute top-3 right-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePrint}
              disabled={isProcessing}
              className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Procesando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Imprimir
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
