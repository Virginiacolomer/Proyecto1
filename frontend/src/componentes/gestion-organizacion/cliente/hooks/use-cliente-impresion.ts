import { useCallback } from "react";
import ClienteService from "../services/cliente-service";


export const useClienteImpresion = () => {
  const handleImprimirTodo = useCallback(async () => {
    try {
      const pdfBlob = await ClienteService.imprimirTodo();
      
      // Crear una URL temporal del archivo
      const fileURL = URL.createObjectURL(
        new Blob([pdfBlob], { type: "application/pdf" })
      );
      
      // Abrir en nueva pestaña
      window.open(fileURL, "_blank");
      
      console.log("✅ PDF generado exitosamente");
      

    } catch (error) {
      console.error("❌ Error al generar el PDF:", error);
      
      // OPCIONAL: Mostrar alerta al usuario
      // addAlert({ 
      //   type: TipoAlerta.ERROR, 
      //   message: "No se pudo generar el PDF" 
      // });
    }
  }, []);

  const handleImprimirPagina = useCallback(async () => {
    try {
      console.log("🖨️ Generando PDF de la página actual...");
      
      
      const pdfBlob = await ClienteService.imprimirTodo();
      
      const fileURL = URL.createObjectURL(
        new Blob([pdfBlob], { type: "application/pdf" })
      );
      
      window.open(fileURL, "_blank");
      
      console.log("✅ PDF de página generado exitosamente");
      
    } catch (error) {
      console.error("❌ Error al generar el PDF de la página:", error);
    }
  }, []);


  return {
    handleImprimirTodo,
    handleImprimirPagina,
  };
};

