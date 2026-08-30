import { useCallback } from "react";
import UsuarioService from "../services/usuario-service";




export const useUsuarioImpresion = () => {
  const handleImprimirTodo = useCallback(async () => {
    try {
      const pdfBlob = await UsuarioService.imprimirTodo();
      
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
      
      
      const pdfBlob = await UsuarioService.imprimirTodo();
      
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

