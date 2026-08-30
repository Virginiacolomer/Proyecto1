import React, { useState } from "react";
import ConsultarImportacionPreciosNexPro from "./consultar-importacion-precios-nex-pro";

const ImportacionPreciosNexPro: React.FC = () => {
  const [refresh] = useState(false); // Estado para forzar actualización

  return (
    <div className="w-full p-4 bg-gray-200 text-black dark:bg-gray-900 dark:text-white">
      {/* Título y botón para añadir marca */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">Importación de Productos NexPro</h1>
      </div>

      {/* Sección de lista de marcas */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm dark:bg-gray-800">
        <ConsultarImportacionPreciosNexPro key={refresh.toString()} />
      </div>
    </div>
  );
};

export default ImportacionPreciosNexPro;
