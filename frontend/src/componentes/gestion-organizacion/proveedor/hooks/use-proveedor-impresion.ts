import { useCallback } from "react";
import ProveedorService from "../services/proveedor-service";

export const useProveedorImpresion = () => {
  const handleImprimirTodo = useCallback(async () => {
    try {
      const pdfBlob = await ProveedorService.imprimirTodo();
      
      // Crear una URL temporal del archivo
      const fileURL = URL.createObjectURL(
        new Blob([pdfBlob], { type: "application/pdf" })
      );
      
      // Abrir en nueva pestaña
      window.open(fileURL, "_blank");
      
      console.log("✅ PDF generado exitosamente");
      

    } catch (error) {
      console.error("❌ Error al generar el PDF:", error);
      
    }
  }, []);

  const handleImprimirPagina = useCallback(async () => {
    try {
      console.log("🖨️ Generando PDF de la página actual...");
      
      
      const pdfBlob = await ProveedorService.imprimirTodo();
      
      const fileURL = URL.createObjectURL(
        new Blob([pdfBlob], { type: "application/pdf" })
      );
      
      window.open(fileURL, "_blank");
      
      console.log("✅ PDF de página generado exitosamente");
      
    } catch (error) {
      console.error("❌ Error al generar el PDF de la página:", error);
    }
  }, []);

  // ==========================================
  // 📤 RETORNO DEL HOOK
  // ==========================================
  
  return {
    handleImprimirTodo,
    handleImprimirPagina,
  };
};

