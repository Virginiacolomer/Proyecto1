import { motion, AnimatePresence } from "framer-motion";
import { TextSearch } from "lucide-react";
import { cn } from "../../utils/Utils";

interface BotonVerticalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const BotonVertical: React.FC<BotonVerticalProps> = ({ isOpen, onOpen, onClose }) => {
  return (
    <motion.button
      onClick={isOpen ? onClose : onOpen}
      title="Filtros de Busqueda"
      className={cn(
        "fixed z-50 top-[135px]",
        isOpen ? "right-[320px]" : "right-0",
        "flex flex-col items-center justify-between py-4 px-2 w-[25px] h-[50px]",
        "bg-blue-500 text-white rounded-l-3xl shadow-lg hover:bg-blue-800",
        "transition-all duration-200",
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TextSearch className="w-5 h-5 text-white" />
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TextSearch className="w-5 h-5 text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
