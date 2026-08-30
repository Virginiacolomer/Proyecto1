import { useState } from "react";
import { Button } from "../../../ui/Button";
import { FileSpreadsheet, Upload } from "lucide-react";
import ImportacionPreciosNexProForm from "./importacion-precios-nex-pro-form";

export default function ConsultarImportacionPreciosNexPro() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen rounded-2xl w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>
      </div>

      <main className="relative container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <FileSpreadsheet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Importación de Productos NEXPRO</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Gestiona y actualiza los productos NEXPRO de manera eficiente
            </p>
          </div>

          {/* Action Section */}
          <div className="flex justify-center">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl max-w-md w-full">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mb-4">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Importar Archivo</h3>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={openModal}
              >
                <Upload className="mr-2 h-5 w-5" />
                Comenzar Importación
              </Button>
            </div>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="relative w-full max-w-2xl animate-in fade-in-0 zoom-in-95 duration-300">
                <ImportacionPreciosNexProForm onClose={closeModal} onSuccess={() => {}} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
