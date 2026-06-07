"use client";

import React from "react";
import { useSimulation } from "@/context/SimulationContext";
import { useRouter, usePathname } from "next/navigation";
import {
  ToggleLeft,
  ToggleRight,
  RotateCcw,
  User,
  Link as LinkIcon,
  CheckCircle2,
  Lock,
  ArrowRight,
  FileText,
  CreditCard,
  MessageSquare,
  Bot
} from "lucide-react";

export default function SimulationControls() {
  const {
    isLoggedIn,
    inviteSent,
    inviteName,
    inviteEmail,
    partnerName,
    userName,
    partnerPhaseCompleted,
    basicCompleted,
    dynamicCompleted,
    proposalAccepted,
    basicSubmitted,
    dynamicSubmitted,
    chatPrivadoSelled,
    mariaSigned,
    paymentCompleted,
    mediatorProgress,
    togglePartnerPhase,
    resetSimulation,
    completeBasic,
    completeDynamic,
    login,
    isIdentityVerified,
    verifyIdentity,
    userBovedaFinished,
    finishUserBoveda,
    agreeAll
  } = useSimulation();

  const router = useRouter();
  const pathname = usePathname();

  const screens = [
    { label: "1. Login", path: "/login", guard: false },
    { label: "1.2. Invitación (Emisor)", path: "/invitacion", guard: true },
    { label: "1.3. Invitación Receptora", path: "/invitacion-receptora", guard: false },
    { label: "2. Vestíbulo (Dashboard)", path: "/vestibulo", guard: true },
    { label: "3. Bóveda (Preparación)", path: "/boveda", guard: true },
    { label: "4. Cuestionario Básico Form", path: "/boveda/cuestionario-basico", guard: true },
    { label: "5. Cuestionario Dinámico (SEAT)", path: "/boveda/cuestionario-dinamico", guard: true },
    { label: "6. Bóveda Chat Privado", path: "/boveda/chat-privado", guard: true },
    { label: "7. Asistente Propuestas Chat", path: "/asistente-propuestas", guard: true },
    { label: "8. Mesa de Negociación", path: "/mesa", guard: true },
    { label: "8.5. Certificado MASC (Intento)", path: "/mesa/certificado-masc", guard: true },
    { label: "9. Borrador y Firma", path: "/mesa/libro-mayor", guard: true },
    { label: "10. Acuerdo Alcanzado", path: "/mesa/acuerdo-alcanzado", guard: true },
    { label: "10.5. Ventajas Trámite Legal", path: "/mesa/ventajas", guard: true },
    { label: "10.8. Opciones de Descarga", path: "/mesa/descargas", guard: true },
    { label: "11. Pago de Honorarios", path: "/mesa/pago", guard: true },
    { label: "12. Confirmación y Abogado", path: "/mesa/finalizado", guard: true },
    { label: "13. Verificación Identidad", path: "/perfil/verificacion", guard: true }
  ];

  const handleNavigate = (path: string, guard: boolean) => {
    if (guard && !isLoggedIn) {
      login();
    }
    router.push(path);
  };

  return (
    <div className="w-full lg:w-80 bg-brand-green-card border border-brand-gold/30 rounded-2xl p-5 text-white shadow-2xl flex flex-col gap-4 lg:max-h-[800px] lg:overflow-y-auto overflow-visible no-scrollbar mx-auto">
      <div>
        <h2 className="font-serif text-lg text-brand-gold font-semibold flex items-center gap-2">
          <span>Panel de Simulación</span>
        </h2>
        <p className="text-[10px] text-brand-muted mt-1 leading-relaxed">
          Navega al instante por las 11 vistas del flujo y controla el estado global.
        </p>
      </div>

      <div className="h-[1px] bg-brand-gold/20" />

      {/* Quick Navigation Links */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[10px] font-bold text-brand-gold uppercase tracking-wider mb-1">Navegación Rápida</h3>
        <div className="flex flex-col gap-1 text-[11px]">
          {screens.map((scr) => {
            const isActive = pathname === scr.path;
            return (
              <button
                key={scr.path}
                onClick={() => handleNavigate(scr.path, scr.guard)}
                className={`w-full text-left py-1.5 px-3 rounded-lg transition flex items-center justify-between group ${
                  isActive
                    ? "bg-brand-gold text-brand-green font-bold"
                    : "bg-brand-green/20 hover:bg-brand-green/40 text-slate-200"
                }`}
              >
                <span>{scr.label}</span>
                <ArrowRight size={10} className={`opacity-40 group-hover:opacity-100 transition ${
                  isActive ? "text-brand-green" : "text-brand-gold"
                }`} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-[1px] bg-brand-gold/20" />

      {/* State Indicators */}
      <div className="flex flex-col gap-2">
        <h3 className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">Estado de Simulación</h3>
        
        {/* Toggle Partner Phase */}
        <div className="flex justify-between items-center text-xs bg-brand-green/10 p-2 rounded border border-brand-border/5">
          <span className="text-slate-200 flex items-center gap-1">
            <Lock size={12} className="text-brand-gold" />
            Ex completa fase:
          </span>
          <button
            onClick={togglePartnerPhase}
            className="focus:outline-none transition duration-150 transform active:scale-95"
            title="Desbloquea el Cuestionario Dinámico y la Mesa de Negociación."
          >
            {partnerPhaseCompleted ? (
              <ToggleRight className="text-brand-gold h-7 w-7" />
            ) : (
              <ToggleLeft className="text-brand-muted h-7 w-7" />
            )}
          </button>
        </div>

        {/* Check list of simulation steps */}
        <div className="text-[10px] space-y-1.5 text-slate-300">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isIdentityVerified ? "bg-emerald-400" : "bg-neutral-500"}`} />
            <span>Identidad Verificada (KYC): {isIdentityVerified ? "Verificado" : "Pendiente"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${basicSubmitted ? "bg-emerald-400" : "bg-neutral-500"}`} />
            <span>Cuestionario Básico: {basicSubmitted ? "Completado" : "Pendiente"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${dynamicSubmitted ? "bg-emerald-400" : "bg-neutral-500"}`} />
            <span>Cuestionario Dinámico: {dynamicSubmitted ? "Completado" : "Pendiente"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${chatPrivadoSelled ? "bg-emerald-400" : "bg-neutral-500"}`} />
            <span>Bóveda Chat Sellado: {chatPrivadoSelled ? "Sí" : "No"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${proposalAccepted ? "bg-emerald-400" : "bg-neutral-500"}`} />
            <span>Propuesta IA Aceptada: {proposalAccepted ? "Sí" : "No"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${mariaSigned ? "bg-emerald-400" : "bg-neutral-500"}`} />
            <span>Convenio Firmado por ti: {mariaSigned ? "Sí" : "No"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${userBovedaFinished ? "bg-emerald-400" : "bg-neutral-500"}`} />
            <span>Bóveda Finalizada por ti: {userBovedaFinished ? "Sí" : "No"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${paymentCompleted ? "bg-emerald-400" : "bg-neutral-500"}`} />
            <span>Pago de Honorarios: {paymentCompleted ? "Pagado" : "Pendiente"}</span>
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-brand-gold/20" />

      {/* Control Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={verifyIdentity}
          disabled={isIdentityVerified}
          className="w-full bg-brand-green hover:bg-brand-green/80 text-white font-medium py-1.5 px-3 rounded-lg text-[10px] transition border border-brand-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verificar Identidad (KYC)
        </button>

        <button
          onClick={completeBasic}
          disabled={basicCompleted}
          className="w-full bg-brand-green hover:bg-brand-green/80 text-white font-medium py-1.5 px-3 rounded-lg text-[10px] transition border border-brand-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Marcar Cuestionario Básico Listo
        </button>

        <button
          onClick={completeDynamic}
          disabled={dynamicCompleted}
          className="w-full bg-brand-green hover:bg-brand-green/80 text-white font-medium py-1.5 px-3 rounded-lg text-[10px] transition border border-brand-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Marcar Cuestionario Dinámico Listo
        </button>

        <button
          onClick={finishUserBoveda}
          disabled={userBovedaFinished}
          className="w-full bg-brand-green hover:bg-brand-green/80 text-white font-medium py-1.5 px-3 rounded-lg text-[10px] transition border border-brand-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Finalizar Bóveda (Marta)
        </button>

        <button
          onClick={agreeAll}
          className="w-full bg-brand-green hover:bg-brand-green/80 text-white font-medium py-1.5 px-3 rounded-lg text-[10px] transition border border-brand-gold/20"
        >
          Acordar Todo (100% Progreso)
        </button>

        <button
          onClick={resetSimulation}
          className="w-full bg-red-950/20 hover:bg-red-950/40 text-red-300 border border-red-500/20 py-2 rounded-lg text-[10px] font-medium transition"
        >
          <RotateCcw size={10} className="inline mr-1" />
          Reiniciar Estado Completo
        </button>
      </div>
    </div>
  );
}
