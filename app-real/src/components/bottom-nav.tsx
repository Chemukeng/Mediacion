"use client";

import { Home, Shield, Scale, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "INICIO", icon: Home, href: "/dashboard" },
    { name: "BÓVEDA", icon: Shield, href: "/dashboard/vault" },
    { name: "MEDIACIÓN", icon: Scale, href: "/dashboard/board" },
    { name: "PERFIL", icon: User, href: "/dashboard/profile" },
  ];

  return (
    <nav className="absolute bottom-0 w-full bg-white border-t border-slate-200 flex justify-around items-center h-20 px-2 pb-safe">
      {navItems.map((item) => {
        const isActive = pathname.includes(item.href) && (item.href !== "/dashboard" || pathname === "/dashboard");
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.name} 
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative ${isActive ? "text-brand-green font-bold" : "text-slate-400 font-medium hover:text-slate-600"}`}
          >
            <Icon className={`w-6 h-6 ${isActive ? "text-brand-green" : ""}`} />
            <span className="text-[10px] tracking-wider">{item.name}</span>
            {item.name === "BÓVEDA" && (
              <span className="absolute top-3 right-6 w-2 h-2 bg-brand-gold rounded-full border-2 border-white"></span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
