import React, { useEffect, useRef, useState } from "react";
import { menuItems } from "./menuItems-definicion";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRoles, getUsuarioId } from "../../utils/auth";
import { navigationGuard } from "../../utils/navigation-guard";

interface SidebarMenusProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export function SidebarMenus({ isOpen, onClose, onOpen }: SidebarMenusProps) {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0 });
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const userRoles: number[] = getUsuarioId() ? getRoles() : [];
  const subMenuRef = useRef<HTMLDivElement>(null);

  // Returns positioning style based on screen thirds:
  // top third → opens downward, middle third → centered on button, bottom third → opens upward
  const getMenuPositionStyle = (buttonTop: number): React.CSSProperties => {
    const vh = window.innerHeight;
    const third = vh / 3;
    if (buttonTop < third) {
      // Top third: open downward
      return { top: `${buttonTop}px` };
    } else if (buttonTop < third * 2) {
      // Middle third: center the menu on the button
      return { top: `${buttonTop}px`, transform: "translateY(-33%)" };
    } else {
      // Bottom third: open upward
      return { bottom: `${vh - buttonTop}px` };
    }
  };

  const toggleMenu = (label: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    setMenuPosition({ top: rect.top });
    setActiveMenu(activeMenu === label ? null : label);
    setActiveSubMenu(null);
  };

  const toggleSubMenu = (label: string) => {
    setActiveSubMenu(activeSubMenu === label ? null : label);
  };

  // 👉 Navegar con guard de cambios sin guardar
  const handleNavigate = (path?: string) => {
    if (!path) return;

    if (!navigationGuard.check()) return; // guard cancelled navigation

    navigate(path);
    setActiveMenu(null);
    setActiveSubMenu(null);

    if (isMobile) {
      onClose();
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Actualizar posición del menú al hacer scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (activeMenu) {
        const button = buttonRefs.current[activeMenu];
        if (button) {
          const rect = button.getBoundingClientRect();
          setMenuPosition({ top: rect.top });
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeMenu]);

  const canShow = (item: any) => {
    const visibleMobile = item.visibleOnMobile !== false || !isMobile;

    const hasRole =
      !item.roles || item.roles.some((role: number) => userRoles.includes(role));

    return visibleMobile && hasRole;
  };

  return (
    <div className="relative w-20 bg-[#0B1623] text-white flex flex-col items-center py-4">
      {/* Contenedor scrolleable */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto w-full px-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#4B5563 #1F2937",
        }}
      >
        <div className="flex flex-col gap-3 pb-4">
          {menuItems
            .filter(canShow)
            .map((item) => (
              <div key={item.label} className="relative flex justify-center">
                <button
                  ref={(el) => (buttonRefs.current[item.label] = el)}
                  onClick={(e) => {
                    if (item.subMenu) {
                      toggleMenu(item.label, e);
                    } else {
                      handleNavigate(item.path);
                    }
                  }}
                  className={`w-14 h-14 flex items-center justify-center bg-white rounded-xl shadow hover:scale-105 transition ${
                    activeMenu === item.label ? "ring-2 ring-blue-400" : ""
                  }`}
                >
                  <item.icon className="w-7 h-7 text-blue-500" />
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* SUBMENÚ NIVEL 1 */}
      {activeMenu &&
        menuItems.find((item) => item.label === activeMenu)?.subMenu && (
          <div
            ref={subMenuRef}
            className="fixed bg-white text-black rounded-xl shadow-2xl p-2 min-w-[190px] z-[9999] flex flex-col gap-1 border border-gray-200"
            style={{
              left: "5rem",
              ...getMenuPositionStyle(menuPosition.top),
            }}
          >
            {menuItems
              .find((item) => item.label === activeMenu)
              ?.subMenu
              ?.filter(canShow)
              .map((sub) => (
                <div key={sub.label} className="relative">
                  <button
                    onClick={() =>
                      sub.subMenu
                        ? toggleSubMenu(sub.label)
                        : handleNavigate(sub.path)
                    }
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-left transition-colors"
                  >
                    <sub.icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium flex-1">
                      {sub.label}
                    </span>

                    {sub.subMenu && (
                      <ChevronRight
                        className={`w-4 h-4 ml-auto transition-transform ${
                          activeSubMenu === sub.label ? "rotate-90" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* SUBMENÚ NIVEL 2 */}
                  {activeSubMenu === sub.label && sub.subMenu && (
                    <div
                      className="absolute left-full ml-1 bg-white text-black rounded-xl shadow-2xl p-2 min-w-[180px] z-[9999] flex flex-col gap-1 border border-gray-200"
                      style={(() => {
                        const vh = window.innerHeight;
                        const third = vh / 3;
                        if (menuPosition.top < third) return { top: 0 };
                        if (menuPosition.top < third * 2) return { top: "50%", transform: "translateY(-50%)" };
                        return { bottom: 0 };
                      })()}
                    >
                      {sub.subMenu
                        ?.filter(canShow)
                        .map((sub2) => (
                          <button
                            key={sub2.label}
                            onClick={() => handleNavigate(sub2.path)}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm transition-colors w-full text-left"
                          >
                            <sub2.icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            {sub2.label}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
    </div>
  );
}
