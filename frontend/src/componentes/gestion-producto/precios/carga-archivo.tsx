import React, { useState } from "react";

export default function CargaArchivo({ onFile }: { onFile: (file: File) => void }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      setLoading(true);
      setMessage("");

      try {
        onFile(file);
      } catch (error) {
        console.error("Error al subir archivo:", error);
        setMessage("Error al subir el archivo.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-md bg-white w-full text-black mt-0">
      <div className="flex items-center gap-4 w-full">
        <input
          type="file"
          onChange={handleFileChange}
          className="flex-1 p-2 border border-gray-300 rounded-lg bg-white"
          disabled={loading}
        />
      </div>
      {message && <p className="mt-2 text-sm text-gray-700 text-center w-full text-red-600">{message}</p>}
    </div>
  );
}
