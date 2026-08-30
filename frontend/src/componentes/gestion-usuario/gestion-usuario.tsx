import React, { useState } from "react";

import AuthForm from "./auth-form";

const GestionUsuario: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false); // Estado para forzar actualización

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    setRefresh((prev) => !prev); // Cambia el estado para refrescar ConsultarMarcas
    closeModal(); // Cierra el modal
  };

  return (
    <div className="w-full p-4 bg-gray-200 text-black dark:bg-gray-900 dark:text-white">
      {/* Título y botón para añadir marca */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">Gestión de Usuarios</h1>
      </div>

      {/* Sección de lista de marcas */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm dark:bg-gray-800">
       
      </div>

      {/* Modal para el formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-6 sm:p-8 rounded-lg shadow-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
            <AuthForm onClose={closeModal} onSuccess={handleSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};
export default GestionUsuario;
