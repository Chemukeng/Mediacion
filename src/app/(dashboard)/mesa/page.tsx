"use client";

import React, { useState } from "react";
import { useSimulation, AgreementItem } from "@/context/SimulationContext";
import { useRouter } from "next/navigation";
import {
  Menu,
  FileText,
  Sparkles,
  Mail,
  MessageSquare,
  CheckCircle2,
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MesaNegociacionPage() {
  const {
    agreements,
    mediatorProgress,
    setAgreementStatus,
    proposalAccepted,
    userBovedaFinished,
    partnerPhaseCompleted,
    userName,
    partnerName
  } = useSimulation();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"activas" | "acordadas" | "historial">("activas");

  // Filtering agreements based on tab selection
  const filteredAgreements = agreements.filter(item => {
    if (activeTab === "activas") {
      return item.status === "pendiente" || item.status === "discusion";
    } else if (activeTab === "acordadas") {
      return item.status === "acordado";
    } else {
      // Historical can be all or some historical log
      return true;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendiente":
        return (
          <span className="bg-brand-green text-brand-gold text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-sans">
            PENDIENTE
          </span>
        );
      case "discusion":
        return (
          <span className="bg-[#B5944E]/15 text-[#9D7C39] border border-[#B5944E]/30 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-sans">
            EN DISCUSIÓN
          </span>
        );
      case "acordado":
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-300/30 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-sans flex items-center gap-1 font-medium">
            ACORDADO
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pendiente":
        return <Mail size={16} className="text-brand-gold" />;
      case "discusion":
        return <MessageSquare size={16} className="text-brand-gold" />;
      case "acordado":
        return <CheckCircle2 size={16} className="text-emerald-600" />;
      default:
        return null;
    }
  };

  const isUnlocked = userBovedaFinished && partnerPhaseCompleted;

  return (
    <div className="flex flex-col px-6 py-4 select-none min-h-full">
      
      {/* Top Header bar (Screenshot 5) */}
      <div className="flex justify-between items-center py-2 border-b border-brand-border/30 bg-brand-bg shrink-0">
        <button
          onClick={() => alert("Menú lateral de mediación")}
          className="w-8 h-8 rounded-full hover:bg-brand-border/40 flex items-center justify-center text-brand-green"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <h2 className="font-serif text-base font-bold text-[#13382c]">
            Mesa de Negociación
          </h2>
          <span className="text-[8px] font-bold text-brand-gold tracking-widest uppercase">
            PROPUESTAS GENERADAS
          </span>
        </div>

        <button
          onClick={() => {
            if (isUnlocked) {
              router.push("/mesa/libro-mayor");
            }
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
            isUnlocked ? "hover:bg-brand-border/40 text-brand-green" : "text-neutral-300 cursor-not-allowed"
          }`}
          title="Ver borrador final del convenio"
          disabled={!isUnlocked}
        >
          <FileText size={18} />
        </button>
      </div>

      {!isUnlocked ? (
        <div className="flex-1 flex flex-col justify-center items-center text-center py-12 px-2 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-6 border border-brand-gold/20 shadow-inner">
            <Lock size={28} className="text-brand-gold animate-pulse" />
          </div>
          
          <span className="text-[10px] font-bold text-brand-gold tracking-[0.2em] uppercase mb-1 font-sans">
            MESA DE NEGOCIACIÓN DE SEGURIDAD
          </span>
          <h2 className="font-serif text-xl font-bold text-[#13382c] mb-3">
            Mesa de Negociación Protegida
          </h2>
          <p className="text-xs text-brand-muted leading-relaxed max-w-[290px] mb-8 font-light">
            El acceso a las propuestas finales comunes se abrirá una vez ambos cónyuges completen y sellen su fase de Bóveda.
          </p>

          {/* Status Tracker */}
          <div className="w-full bg-[#EAEAE6]/50 border border-brand-border/60 rounded-3xl p-5 mb-8 flex flex-col gap-4 text-left max-w-[320px]">
            <h4 className="font-serif text-xs font-bold text-brand-green tracking-wider uppercase border-b border-[#13382c]/10 pb-2">
              Estado de Preparación
            </h4>
            
            {/* User Status */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-brand-green">{userName} (Tú)</span>
              {userBovedaFinished ? (
                <span className="bg-emerald-100/80 text-emerald-800 border border-emerald-200 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 font-sans">
                  <CheckCircle2 size={10} className="text-emerald-700" /> Listo
                </span>
              ) : (
                <span className="bg-brand-gold/10 text-[#9D7C39] border border-brand-gold/25 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 font-sans">
                  Pendiente
                </span>
              )}
            </div>

            {/* Partner Status */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-brand-green">{partnerName}</span>
              {partnerPhaseCompleted ? (
                <span className="bg-emerald-100/80 text-emerald-800 border border-emerald-200 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 font-sans">
                  <CheckCircle2 size={10} className="text-emerald-700" /> Listo
                </span>
              ) : (
                <span className="bg-slate-100 text-slate-500 border border-slate-200 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 font-sans">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-gold"></span>
                  </span>
                  Preparándose...
                </span>
              )}
            </div>
          </div>

          {/* CTA */}
          {!userBovedaFinished ? (
            <button
              onClick={() => router.push("/boveda")}
              className="w-full max-w-[280px] bg-brand-green hover:bg-brand-green/95 text-brand-gold font-bold py-3.5 rounded-xl text-[10px] tracking-widest transition flex items-center justify-center gap-2 shadow-sm uppercase font-sans"
            >
              <span>Completar mi Bóveda</span>
              <ArrowRight size={12} />
            </button>
          ) : (
            <div className="text-[10px] text-brand-muted leading-relaxed text-center max-w-[260px] bg-brand-green/5 border border-brand-green/10 rounded-2xl p-4">
              Has sellado tu fase de preparación de acuerdos. La Mesa se activará automáticamente en cuanto <strong>{partnerName}</strong> finalice sus cuestionarios en su Bóveda.
            </div>
          )}

          {/* MASC / Incomparecencia Certificate Option */}
          <div className="mt-6 w-full max-w-[320px] bg-[#FAF9F5] border border-dashed border-brand-border rounded-3xl p-4 text-left flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-brand-green font-serif text-xs font-bold uppercase tracking-wide">
              <FileText size={14} className="text-brand-gold" />
              ¿{partnerName} no responde?
            </div>
            <p className="text-[9.5px] text-brand-muted leading-relaxed">
              Si transcurren 30 días de inactividad de tu cónyuge tras registrarse e identificarse biométricamente, puedes solicitar un **Certificado de Intento de Mediación sin Acuerdo (MASC)** para aportarlo en el Juzgado de Familia y evitar la condena en costas por mala fe procesal.
            </p>
            <button
              onClick={() => router.push("/mesa/certificado-masc")}
              className="mt-1 w-full bg-brand-green hover:bg-brand-green/90 text-brand-gold font-bold py-2.5 rounded-xl text-[9px] tracking-wider transition uppercase text-center font-sans"
            >
              Solicitar Certificado MASC
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Progress of mediation */}
          <div className="mt-4 bg-[#EAEAE6]/40 p-4 rounded-2xl border border-brand-border/50 flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px] font-bold tracking-wider text-brand-green/80">
              <span>PROGRESO DE LA MEDIACIÓN</span>
              <span className="font-serif text-sm font-bold text-[#13382c]">{mediatorProgress}%</span>
            </div>
            <div className="w-full bg-[#E3E3DE] h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${mediatorProgress}%` }}
                transition={{ duration: 0.5 }}
                className="bg-brand-gold h-full rounded-full"
              />
            </div>
          </div>

          {/* Tabs navigation list (Screenshot 5) */}
          <div className="flex border-b border-brand-border/50 mt-4 text-xs font-bold font-sans">
            {(["activas", "acordadas", "historial"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-center py-2.5 transition relative capitalize ${
                  activeTab === tab ? "text-brand-green font-bold" : "text-brand-muted"
                }`}
              >
                {tab === "activas" ? "ACTIVAS" : tab === "acordadas" ? "ACORDADAS" : "HISTORIAL"}
                {activeTab === tab && (
                  <motion.div
                    layoutId="mesaActiveTab"
                    className="absolute bottom-0 inset-x-0 h-[2px] bg-brand-green"
                    transition={{ type: "spring", stiffness: 350, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Sugerencias Title */}
          <div className="flex items-center gap-1.5 mt-5">
            <Sparkles size={12} className="text-brand-gold" />
            <span className="text-[9px] font-bold text-brand-gold tracking-[0.2em] uppercase font-sans">
              SUGERENCIAS DEL MEDIADOR IA
            </span>
          </div>

          {/* Agreements Cards List */}
          <div className="flex flex-col gap-4 mt-3">
            <AnimatePresence mode="popLayout">
              {filteredAgreements.length > 0 ? (
                filteredAgreements.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`bg-white border rounded-3xl p-5 shadow-sm relative overflow-hidden flex flex-col gap-4 border-brand-border ${
                      item.status === "acordado" ? "bg-emerald-50/10 border-emerald-200" : ""
                    }`}
                  >
                    {/* Visual marker bar on the left */}
                    <div
                      className={`absolute left-0 top-6 bottom-6 w-1 rounded-r ${
                        item.status === "acordado"
                          ? "bg-emerald-500"
                          : item.status === "discusion"
                          ? "bg-brand-gold"
                          : "bg-brand-green"
                      }`}
                    />

                    {/* Header row */}
                    <div className="flex justify-between items-center pl-1">
                      <div className="flex items-center gap-1.5 text-[9px] text-brand-muted font-sans font-medium">
                        {getStatusBadge(item.status)}
                        <span>•</span>
                        <span>{item.source}</span>
                      </div>
                      
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.status === "acordado" ? "bg-emerald-50" : "bg-brand-green/5"
                      }`}>
                        {getStatusIcon(item.status)}
                      </div>
                    </div>

                    {/* Title and quote */}
                    <div className="flex flex-col gap-2 pl-1">
                      <h4 className="font-serif text-base font-bold text-brand-green">
                        {item.title}
                      </h4>
                      <p className="text-xs text-brand-text leading-relaxed font-light italic bg-neutral-50 p-3 rounded-xl border border-brand-border/30">
                        &quot;{item.quote}&quot;
                      </p>
                    </div>

                    {/* Footer status/date/progress bar */}
                    <div className="flex justify-between items-center text-[10px] text-brand-muted border-t border-brand-border/40 pt-3 mt-1 px-1 font-medium font-sans">
                      
                      {item.status === "pendiente" && (
                        <>
                          <span className="flex items-center gap-1 text-[9px] uppercase"><Clock size={11} /> HACE 2 HORAS</span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 bg-neutral-200 h-1 rounded-full overflow-hidden">
                              <div className="bg-brand-green h-full w-1/3" />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-brand-green">FASE 1/3</span>
                          </div>
                        </>
                      )}

                      {item.status === "discusion" && (
                        <>
                          <span className="flex items-center gap-1 text-[9px] uppercase"><Clock size={11} /> ACTUALIZADO AYER</span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 bg-neutral-200 h-1 rounded-full overflow-hidden">
                              <div className="bg-brand-gold h-full w-[65%]" />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-brand-gold">65% ACORDADO</span>
                          </div>
                        </>
                      )}

                      {item.status === "acordado" && (
                        <>
                          <span className="flex items-center gap-1 text-[9px] uppercase text-emerald-700 font-bold"><Clock size={11} /> 14 OCT, 2023</span>
                          <span className="text-[9px] font-bold text-emerald-700 flex items-center gap-1 uppercase tracking-wider bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded">
                            <ShieldCheck size={11} strokeWidth={2.5} /> FINALIZADO
                          </span>
                        </>
                      )}

                    </div>

                    {/* Quick actions for testing / mock agreements */}
                    {item.status === "discusion" && (
                      <div className="mt-2 flex gap-2 pl-1">
                        <button
                          onClick={() => setAgreementStatus(item.id, "acordado")}
                          className="flex-1 bg-brand-green hover:bg-brand-green/90 text-brand-gold font-bold py-2 rounded-xl text-[9px] tracking-wider transition uppercase"
                        >
                          Aceptar Borrador
                        </button>
                        <button
                          onClick={() => router.push("/asistente-propuestas")}
                          className="bg-white hover:bg-neutral-50 border border-brand-border text-brand-green font-bold py-2 px-3 rounded-xl text-[9px] tracking-wider transition"
                        >
                          Ver con IA
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10 bg-white border border-brand-border rounded-3xl p-6 text-brand-muted text-xs leading-relaxed flex flex-col items-center gap-3">
                  <CheckCircle size={32} className="text-brand-gold animate-bounce" />
                  <span>No hay propuestas pendientes en esta sección. Todos los puntos han sido procesados.</span>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Mediador processing notice */}
          <div className="mt-6 mb-4 bg-brand-gold/5 border border-brand-gold/20 p-4 rounded-2xl text-[10px] text-brand-text leading-relaxed flex items-start gap-2.5 shadow-inner">
            <Sparkles size={14} className="text-brand-gold mt-0.5 shrink-0" />
            <p className="font-light italic text-[#5E5136]">
              El mediador IA continúa procesando sus conversaciones privadas en la Bóveda para generar propuestas neutrales adicionales.
            </p>
          </div>

          {/* Show Lawyer formalization option if mediation is 100% complete */}
          {mediatorProgress === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#163B30] text-white border border-brand-gold/30 p-5 rounded-3xl mt-2 flex flex-col gap-3 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-brand-gold" size={20} />
                <h5 className="font-serif font-bold text-sm text-brand-gold">¡Convenio Completado!</h5>
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-light">
                Habéis alcanzado consenso en todos los puntos obligatorios. El borrador ya está listo para ser formalizado y redactado jurídicamente por nuestros abogados.
              </p>
              <button
                onClick={() => router.push("/mesa/libro-mayor")}
                className="w-full bg-brand-gold hover:bg-brand-gold-hover text-brand-green font-bold py-3 rounded-xl text-[10px] tracking-widest transition flex items-center justify-center gap-1.5 shadow font-sans"
              >
                <span>PROCEDER A LA FIRMA Y ABOGADOS</span>
                <ArrowRight size={12} />
              </button>
            </motion.div>
          )}
        </>
      )}
      
    </div>
  );
}
