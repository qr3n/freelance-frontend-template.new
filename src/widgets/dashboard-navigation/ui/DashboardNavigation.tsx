"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard, MdAnalytics, MdSettings, MdPerson } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  href: string;
  icon?: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/dashboard/business", icon: <MdDashboard size={20} />, label: "Главная" },
  {
    href: "/dashboard/analytics",
    icon: <MdAnalytics size={20} />,
    label: "Аналитика",
  },
  { href: "/dashboard/settings", icon: <MdSettings size={20} />, label: "Настройки" },
  { href: "/dashboard/profile", icon: <MdPerson size={20} />, label: "Профиль" },
];

export const DashboardNavigation = () => {
  const pathname = usePathname();
  const [clickedPath, setClickedPath] = useState<string | null>(null);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  useEffect(() => {
    setClickedPath(null);
  }, [pathname]);

  const isActive = (href: string) => {
    if (clickedPath) {
      return pathname?.includes(clickedPath);
    }
    return pathname?.includes(href);
  };

  const handleClick = (href: string) => {
    setClickedPath(href);
  };

  return (
    <div className="absolute z-20 bottom-4 h-min left-1/2 -translate-x-1/2 sm:translate-x-0 sm:top-1/2 sm:left-8 flex sm:flex-col items-center justify-center gap-3 sm:gap-5 sm:-translate-y-1/2 rounded-full bg-neutral-100 py-2 px-4 sm:py-8 sm:px-4 backdrop-blur-sm">
      {navItems.map((item) => (
        <div
          key={item.href}
          className="relative"
          onMouseEnter={() => setHoveredPath(item.href)}
          onMouseLeave={() => setHoveredPath(null)}
        >
          <Link
            href={item.href}
            onClick={() => handleClick(item.href)}
            className="block"
          >
            <motion.div
              className={`rounded-2xl w-[40px] sm:w-[50px] cursor-pointer ${
                isActive(item.href)
                  ? "bg-emerald-500 border-2 border-emerald-400 h-[40px] sm:h-[80px]"
                  : "bg-emerald-700/30 h-[40px] sm:h-[50px]"
              }`}
              animate={{
                scale:
                  hoveredPath === item.href && !isActive(item.href) ? 1.05 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-emerald-200">
                <span className="scale-100 sm:scale-125">
                  {item.icon}
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Label появляется при hover (десктоп) */}
          <AnimatePresence>
            {hoveredPath === item.href && (
              <motion.div
                initial={{ opacity: 0, x: -10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.9 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}
                className="absolute left-full ml-4 -mt-4 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none hidden sm:block"
              >
                <div className="bg-emerald-900/95 backdrop-blur-sm text-emerald-100 px-4 py-2 rounded-xl shadow-lg border border-emerald-700/50 font-medium text-sm">
                  {item.label}
                  {/* Стрелочка */}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-emerald-900/95" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Label для мобильной версии (снизу) */}
          <AnimatePresence>
            {hoveredPath === item.href && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}
                className="absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none block sm:hidden"
              >
                <div className="bg-emerald-900/95 backdrop-blur-sm text-emerald-100 px-3 py-1.5 rounded-lg shadow-lg border border-emerald-700/50 font-medium text-xs">
                  {item.label}
                  {/* Стрелочка */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-emerald-900/95" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};