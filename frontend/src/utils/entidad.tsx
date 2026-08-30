import React, { useState } from "react";

interface EntidadProps {
  titulo: string;
  ComponenteConsulta: React.ElementType;
  ComponenteFormulario: React.ElementType;
}

const Entidad: React.FC<EntidadProps> = ({ titulo, ComponenteConsulta, ComponenteFormulario }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const closeModal = () => setIsModalOpen(false);

  const handleSuccess = () => {
    setRefresh((prev) => !prev);
    closeModal();
  };

  return (
    <div className="w-full p-4 bg-gray-200 text-black dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">{titulo}</h1>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg shadow-sm dark:bg-gray-800">
        <ComponenteConsulta key={refresh.toString()} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-6 sm:p-8 rounded-lg shadow-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
            <ComponenteFormulario onClose={closeModal} onSuccess={handleSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Entidad;
