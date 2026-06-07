"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSimulation } from "@/context/SimulationContext";
import SimulationControls from "@/components/SimulationControls";
import { Home, Lock, Gavel, User, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, userBovedaFinished, partnerPhaseCompleted } = useSimulation();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-brand-bg py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white border border-brand-border rounded-2xl p-8 text-center shadow-xl flex flex-col items-center gap-4"
        >
          <div className="bg-brand-green/10 p-4 rounded-full text-brand-green">
            <ShieldAlert size={40} className="text-brand-gold animate-pulse" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-brand-green">Acceso Restringido</h2>
          <p className="text-sm text-brand-muted">
            Debes iniciar sesión para acceder al espacio seguro de mediación.
          </p>
          <Link
            href="/login"
            className="mt-2 w-full bg-brand-green hover:bg-brand-green/90 text-white font-medium py-3 px-6 rounded-xl transition duration-150"
          >
            Ir al Inicio de Sesión
          </Link>
        </motion.div>
      </div>
    );
  }

  // Navigation Items
  const navItems = [
    { label: "INICIO", path: "/vestibulo", icon: Home },
    { label: "BÓVEDA", path: "/boveda", icon: Lock, notify: true }, // gold dot on Bóveda
    { 
      label: "MEDIACIÓN", 
      path: "/mesa", 
      icon: Gavel, 
      isLocked: !userBovedaFinished || !partnerPhaseCompleted 
    },
    { label: "PERFIL", path: "/perfil", icon: User },
  ];

  return (
    <div className="min-h-[100dvh] bg-brand-bg lg:bg-[#0E1E1A] text-brand-text flex flex-col lg:flex-row items-stretch lg:items-center lg:justify-center p-0 lg:p-8 gap-8 overflow-x-hidden relative">
      {/* Background Ambience */}
      <div className="hidden lg:block absolute inset-0 bg-radial-[circle_at_50%_-20%] from-[#193F34] to-[#0E1E1A] opacity-80 pointer-events-none" />

      {/* Decorative Brand Text */}
      <div className="hidden lg:flex flex-col text-white max-w-sm gap-2.5 z-10 select-none">
        <span className="font-serif text-brand-gold text-sm tracking-[0.2em] font-semibold">MEDIACIÓN DIGITAL</span>
        
        {/* Brand Logo "MediAción" for Dark Background */}
        <div className="font-serif text-5xl font-bold leading-none tracking-tight flex items-center mt-1">
          <span className="text-white">Med</span>
          <span className="text-brand-gold">iA</span>
          <span className="text-white">ción</span>
        </div>
        <span className="font-sans text-[10px] font-bold text-brand-gold tracking-[0.3em] uppercase mt-1.5">
          ACUERDOS INTELIGENTES
        </span>

        <p className="text-brand-muted text-sm leading-relaxed mt-3">
          Mediación neutral e inteligente para alcanzar convenios reguladores de mutuo acuerdo mediante el uso de inteligencia artificial y soporte legal.
        </p>
        <div className="flex gap-4 mt-6">
          <div className="flex flex-col border-l-2 border-brand-gold/40 pl-3">
            <span className="text-brand-gold text-lg font-serif font-bold">100%</span>
            <span className="text-[10px] text-brand-muted uppercase">Privado y Seguro</span>
          </div>
          <div className="flex flex-col border-l-2 border-brand-gold/40 pl-3">
            <span className="text-brand-gold text-lg font-serif font-bold">IA</span>
            <span className="text-[10px] text-brand-muted uppercase">Validación Legal</span>
          </div>
        </div>
      </div>

      {/* Centered Phone Mockup Frame */}
      <div id="phone-mockup" className="relative w-full lg:max-w-[400px] h-[100dvh] lg:h-[820px] bg-brand-bg lg:rounded-[50px] lg:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] lg:border-[10px] lg:border-[#1C2A25] flex flex-col overflow-hidden z-10 transition-all duration-300">


        {/* Status Bar simulation */}
        <div className="hidden lg:flex h-9 px-8 pt-3 justify-between items-center text-[10px] font-semibold text-brand-green/60 select-none z-40 bg-brand-bg">
          <span>10:42</span>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <div className="w-5 h-2.5 border border-brand-green/40 rounded-sm p-0.5 flex items-center">
              <div className="h-full w-3 bg-brand-green/60 rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Main Route Content Screen */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col pb-[76px] bg-brand-bg">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname.startsWith("/mesa") ? "/mesa" : pathname.startsWith("/boveda") ? "/boveda" : pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex-1 flex flex-col"
            >
              {children}
              
              {/* Mobile Simulation Controls (Visible on mobile only, below child page contents) */}
              <div className="block lg:hidden mt-8 px-6 pb-8 border-t border-brand-border/60 pt-8 shrink-0">
                <SimulationControls />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Tab Navigation */}
        <div className="absolute bottom-0 inset-x-0 bg-[#FBFBFA]/90 backdrop-blur-md border-t border-brand-border h-[72px] px-6 py-2 flex items-center justify-between z-40">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path === "/boveda" && pathname.startsWith("/asistente-propuestas"));
            const Icon = item.icon;

            return (
              <Link key={item.path} href={item.path} className="flex-1 flex flex-col items-center justify-center relative py-1 focus:outline-none">
                <div className="relative">
                  <Icon
                    size={22}
                    className={`transition-colors duration-200 ${
                      isActive ? "text-brand-green" : "text-brand-muted"
                    }`}
                  />
                  {/* Padlock icon overlay when locked */}
                  {item.isLocked && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-gold border border-[#FBFBFA] rounded-full flex items-center justify-center shadow-sm">
                      <Lock size={7} strokeWidth={3.5} className="text-[#13382c]" />
                    </div>
                  )}
                  {/* Notification/Active gold dot */}
                  {!item.isLocked && item.notify && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-gold border-2 border-[#FBFBFA] rounded-full" />
                  )}
                  {isActive && !item.isLocked && !item.notify && (
                    <motion.span
                      layoutId="activeDot"
                      className="absolute -top-1 -right-1 w-2 h-2 bg-brand-gold rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
                <span
                  className={`text-[9px] font-bold mt-1 tracking-wider transition-colors duration-200 ${
                    isActive ? "text-brand-green" : "text-brand-muted"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Floating Simulation Controls (Desktop only) */}
      <div className="hidden lg:block z-10 w-full lg:w-auto shrink-0">
        <SimulationControls />
      </div>
    </div>
  );
}
