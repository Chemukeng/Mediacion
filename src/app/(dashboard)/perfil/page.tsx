"use client";

import React from "react";
import { useSimulation } from "@/context/SimulationContext";
import { useRouter } from "next/navigation";
import {
  User,
  Heart,
  Shield,
  LogOut,
  Settings,
  Bell,
  HelpCircle,
  FileText,
  Lock,
  Mail
} from "lucide-react";

export default function PerfilPage() {
  const { userName, partnerName, inviteEmail, inviteSent, logout, resetSimulation, isIdentityVerified } = useSimulation();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    resetSimulation();
    router.push("/login");
  };

  return (
    <div className="flex flex-col px-6 py-6 select-none">
      
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-3 mt-4 text-center">
        <div className="w-20 h-20 rounded-full border-2 border-brand-gold bg-neutral-200 overflow-hidden shadow-md flex items-center justify-center">
          <svg className="w-16 h-16 text-neutral-400 mt-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        
        <div className="flex flex-col">
          <h3 className="font-serif text-2xl font-bold text-brand-green">{userName}</h3>
          <span className="text-[9px] text-brand-gold font-bold tracking-widest uppercase mt-0.5">
            CÓNYUGE SOLICITANTE
          </span>
        </div>
      </div>

      {/* Account / Mediation Details */}
      <div className="flex flex-col gap-4 mt-8">
        
        {/* Verification Status Card */}
        <div
          onClick={() => router.push("/perfil/verificacion")}
          className="bg-white border border-brand-border rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:border-brand-gold/60 transition duration-150 group"
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              isIdentityVerified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
            }`}>
              <Shield size={16} className={isIdentityVerified ? "text-emerald-600" : "text-amber-500 animate-pulse"} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-brand-green group-hover:text-brand-gold transition leading-tight">
                Verificación de Identidad (KYC)
              </span>
              <span className="text-[9.5px] text-brand-muted mt-0.5">
                {isIdentityVerified ? "Identidad Certificada y Homologada" : "Acción requerida: Identidad sin verificar"}
              </span>
            </div>
          </div>
          
          <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
            isIdentityVerified ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" : "bg-amber-50 text-amber-700 border border-amber-200/50"
          }`}>
            {isIdentityVerified ? "VERIFICADO" : "PENDIENTE"}
          </span>
        </div>

        <h4 className="text-[10px] font-bold text-brand-gold tracking-[0.2em] uppercase pl-1 mt-1">
          EXPEDIENTE DE MEDIACIÓN
        </h4>

        {/* Ex-spouse block */}
        <div className="bg-white border border-brand-border rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-xs text-brand-muted">Vincular con:</span>
            <span className="text-xs text-brand-green font-bold font-serif">{partnerName}</span>
          </div>
          
          <div className="h-[1px] bg-brand-border/60" />
          
          <div className="flex justify-between items-center text-xs">
            <span className="text-brand-muted">Correo vinculado:</span>
            <span className="text-brand-muted font-mono">{inviteSent ? inviteEmail : "david.martin@ejemplo.com"}</span>
          </div>

          <div className="h-[1px] bg-brand-border/60" />

          <div className="flex justify-between items-center text-xs">
            <span className="text-brand-muted">Tipo de Convenio:</span>
            <span className="text-brand-green font-semibold">Mutuo Acuerdo (España)</span>
          </div>
        </div>

        {/* Security / Privacy details */}
        <h4 className="text-[10px] font-bold text-brand-gold tracking-[0.2em] uppercase pl-1 mt-2">
          SEGURIDAD Y PRIVACIDAD
        </h4>

        <div className="bg-white border border-brand-border rounded-2xl p-4 flex flex-col gap-3 shadow-sm text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Shield size={16} />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-brand-green">Encriptación Extremo a Extremo</span>
              <span className="text-[10px] text-brand-muted">Protocolo SSL y AES-256</span>
            </div>
          </div>

          <div className="h-[1px] bg-brand-border/60" />

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Lock size={16} />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-brand-green">Control de Compartición</span>
              <span className="text-[10px] text-brand-muted">Solo se comparte el borrador final consensuado</span>
            </div>
          </div>
        </div>

        {/* Settings Buttons */}
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={() => alert("Configuración de notificaciones")}
            className="w-full bg-white hover:bg-neutral-50 border border-brand-border text-brand-green font-semibold py-3 px-4 rounded-xl text-xs flex items-center gap-2.5 shadow-sm transition"
          >
            <Bell size={14} className="text-brand-gold" />
            <span>Notificaciones del Caso</span>
          </button>

          <button
            onClick={() => alert("Soporte legal de MedIAdor")}
            className="w-full bg-white hover:bg-neutral-50 border border-brand-border text-brand-green font-semibold py-3 px-4 rounded-xl text-xs flex items-center gap-2.5 shadow-sm transition"
          >
            <HelpCircle size={14} className="text-brand-gold" />
            <span>Ayuda y Preguntas Frecuentes</span>
          </button>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition mt-4"
          >
            <LogOut size={14} />
            <span>Cerrar Sesión (Reiniciar Simulación)</span>
          </button>
        </div>

      </div>
      
    </div>
  );
}
