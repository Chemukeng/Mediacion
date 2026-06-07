"use client";

import React from "react";
import { useSimulation } from "@/context/SimulationContext";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ShieldCheck,
  Edit2,
  Lock,
  Sparkles,
  Bot,
  Heart,
  ChevronRight,
  CheckCircle,
  HelpCircle,
  LockKeyhole,
  LockOpen
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BovedaPage() {
  const {
    basicCompleted,
    dynamicCompleted,
    partnerPhaseCompleted,
    chatPrivadoSelled,
    basicSubmitted,
    dynamicSubmitted,
    userBovedaFinished,
    finishUserBoveda,
    partnerName
  } = useSimulation();

  const router = useRouter();

  // Derive preparation status percent
  let prepPercent = 0;
  if (basicSubmitted) prepPercent += 33;
  if (userBovedaFinished) prepPercent += 33;
  if (partnerPhaseCompleted) prepPercent += 34;

  return (
    <div className="flex flex-col px-6 py-4 select-none relative">
      
      {/* Header bar (Screenshot 3) */}
      <div className="flex justify-between items-center py-2 border-b border-brand-border/30">
        <button
          onClick={() => router.push("/vestibulo")}
          className="w-8 h-8 rounded-full hover:bg-brand-border/40 flex items-center justify-center text-brand-green"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-bold text-brand-gold tracking-[0.2em] uppercase">
            MEDIACIÓN DIGITAL NEUTRAL
          </span>
          <h2 className="font-serif text-base font-bold text-[#13382c]">
            Bóveda Privada Unificada
          </h2>
        </div>

        <div className="w-8 h-8 flex items-center justify-center text-emerald-600">
          <ShieldCheck size={20} />
        </div>
      </div>

      {/* Main progress & explanation card */}
      <div className="mt-4 bg-[#163B30] text-white rounded-3xl p-5 shadow-sm border border-[#1d4c3f] relative overflow-hidden flex flex-col gap-4">
        <h3 className="font-serif text-xl font-bold italic tracking-wide">
          Tu Espacio de Preparación
        </h3>
        <p className="text-xs text-white/70 leading-relaxed font-light">
          Este entorno es 100% privado. Sus borradores y propuestas solo son visibles para usted.
        </p>
        
        <div className="flex flex-col gap-1.5 mt-2">
          <div className="flex justify-between text-[10px] text-brand-gold font-bold tracking-wider">
            <span>ESTADO DE PREPARACIÓN</span>
            <span>{prepPercent}% COMPLETADO</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${prepPercent}%` }}
              transition={{ duration: 0.5 }}
              className="bg-brand-gold h-full rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Cuestionarios Finalizados Banner */}
      {basicSubmitted && dynamicSubmitted && (
        <div className="mt-4 bg-emerald-500/10 border border-emerald-500/25 p-4 rounded-2xl flex gap-3 text-xs leading-relaxed text-emerald-800 text-left animate-in fade-in">
          <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={18} />
          <div>
            <strong className="text-brand-green font-semibold block mb-0.5">Cuestionarios Sellados en Bóveda</strong>
            Los cuestionarios Básico y Dinámico se han finalizado con éxito. Sus respuestas se han integrado de forma confidencial en la Mesa de Negociación.
          </div>
        </div>
      )}

      {/* SECCIÓN 1: PREPARACIÓN DEL CASO (PARA LA MESA) */}
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 px-1">
          <span className="w-1.5 h-4 bg-brand-gold rounded-full" />
          <h3 className="font-serif text-xs font-bold tracking-wider text-brand-green uppercase">
            1. Preparación del Caso (Para la Mesa)
          </h3>
        </div>
        <p className="text-[10px] text-brand-muted px-1 -mt-2 leading-relaxed">
          Rellene los cuestionarios y debata propuestas previas. Al finalizar este bloque se activará la negociación común.
        </p>

        {/* Item 1: Cuestionario Básico */}
        <div className="bg-white border border-brand-border rounded-3xl p-5 shadow-sm relative flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 pr-6">
              <h4 className="font-serif text-lg font-bold text-brand-green flex items-center gap-1.5">
                <span className="inline-flex w-2.5 h-2.5 rounded-full bg-brand-gold" />
                Cuestionario Básico
              </h4>
              <p className="text-[11px] text-brand-muted leading-relaxed font-light mt-1">
                Recopilación de información esencial para estructurar los pilares fundamentales de su caso.
              </p>
            </div>
            
            <Link
              href="/boveda/cuestionario-basico"
              className="w-9 h-9 rounded-full bg-[#FBFBFA] border border-brand-border flex items-center justify-center text-brand-gold shrink-0 hover:border-brand-gold"
            >
              {basicSubmitted ? <CheckCircle size={16} className="text-emerald-600" /> : basicCompleted ? <CheckCircle size={16} className="text-emerald-600/60" /> : <Edit2 size={14} />}
            </Link>
          </div>

          <Link
            href="/boveda/cuestionario-basico"
            className={`w-full font-bold text-[10px] tracking-wider py-3 rounded-xl transition duration-200 text-center block ${
              basicSubmitted
                ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 hover:bg-emerald-500/15"
                : basicCompleted
                ? "bg-brand-green/5 text-brand-green hover:bg-brand-green/10"
                : "bg-brand-green text-brand-gold hover:bg-brand-green/95"
            }`}
          >
            {basicSubmitted ? "VER RESPUESTAS (FINALIZADO)" : basicCompleted ? "EDITAR RESPUESTAS" : "CONTINUAR >"}
          </Link>
        </div>

        {/* Item 2: Cuestionario Dinámico IA */}
        <div className="bg-white border border-brand-border rounded-3xl p-5 shadow-sm relative flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 pr-6">
              <h4 className="font-serif text-lg font-bold text-brand-green flex items-center gap-1.5">
                <span className="inline-flex w-2.5 h-2.5 rounded-full bg-neutral-300" />
                Cuestionario Dinámico IA
              </h4>
              <p className="text-[11px] text-brand-muted leading-relaxed font-light mt-1">
                Preguntas personalizadas generadas tras el análisis de ambos perfiles.
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 shrink-0">
              {basicCompleted && partnerPhaseCompleted ? <LockOpen size={14} className="text-emerald-600" /> : <Lock size={14} />}
            </div>
          </div>

          {/* Locked/Unlocked logic based on simulation */}
          {!basicSubmitted ? (
            <button
              disabled
              className="w-full bg-[#F3F4F0] text-neutral-400 border border-brand-border font-bold text-[8.5px] tracking-wider py-3 rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5 uppercase font-sans"
            >
              <Lock size={10} /> BLOQUEADO (Se desbloquea al finalizar el Cuestionario Básico)
            </button>
          ) : !partnerPhaseCompleted ? (
            <button
              disabled
              className="w-full bg-[#F3F4F0] text-neutral-400 border border-brand-border font-bold text-[9px] tracking-widest py-3 rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5 uppercase font-sans"
            >
              <Lock size={10} className="mr-0.5" /> ESPERANDO A LA OTRA PARTE
            </button>
          ) : (
            <Link
              href="/boveda/cuestionario-dinamico"
              className={`w-full font-bold text-[10px] tracking-wider py-3 rounded-xl transition duration-200 text-center block ${
                dynamicSubmitted
                  ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 hover:bg-emerald-500/15"
                  : dynamicCompleted
                  ? "bg-brand-green/5 text-brand-green hover:bg-brand-green/10"
                  : "bg-brand-green text-brand-gold hover:bg-brand-green/95"
              }`}
            >
              {dynamicSubmitted ? "VER RESPUESTAS (FINALIZADO)" : dynamicCompleted ? "REVISAR RESPUESTAS DINÁMICAS" : "CONTINUAR IA >"}
            </Link>
          )}
        </div>

        {/* Item 4: Asistente de Propuestas */}
        <div className="bg-white border border-brand-border rounded-3xl p-5 shadow-sm relative flex flex-col gap-4">
          <div className="absolute left-0 top-6 bottom-6 w-1 bg-brand-gold rounded-r" />
          
          <div className="flex justify-between items-start pl-1">
            <div className="flex flex-col gap-1 pr-6">
              <h4 className="font-serif text-lg font-bold text-brand-green flex items-center gap-2">
                <Sparkles size={16} className="text-brand-gold" />
                Asistente de Propuestas
              </h4>
              <p className="text-[11px] text-brand-muted leading-relaxed font-light mt-1">
                Redacte borradores y ensaye sus argumentos con la guía de nuestra IA especializada.
              </p>
            </div>
            
            <div className="w-10 h-10 rounded-xl bg-brand-green/5 border border-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
              <Bot size={22} className="text-[#13382c]" />
            </div>
          </div>

          {!basicSubmitted || !dynamicSubmitted ? (
            <button
              disabled
              className="w-full bg-[#F3F4F0] text-neutral-400 border border-brand-border font-bold text-[8.5px] tracking-wider py-3 rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5 uppercase font-sans"
            >
              <Lock size={10} /> BLOQUEADO (Se desbloquea al terminar todos los cuestionarios)
            </button>
          ) : !partnerPhaseCompleted ? (
            <button
              disabled
              className="w-full bg-[#F3F4F0] text-neutral-400 border border-brand-border font-bold text-[8.5px] tracking-wider py-3 rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5 uppercase font-sans"
            >
              <Lock size={10} /> BLOQUEADO (Esperando vinculación activa de la otra parte)
            </button>
          ) : (
            <Link
              href="/asistente-propuestas"
              className="w-full bg-[#FDFDFD] hover:bg-brand-green/5 border border-brand-border text-brand-green text-center font-bold text-[10px] tracking-wider py-3 rounded-xl transition duration-200 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>ABRIR CHAT PROPUESTAS</span>
              <ChevronRight size={12} />
            </Link>
          )}
        </div>

        {/* BOTÓN DE CIERRE DE FASE DE PREPARACIÓN */}
        <div className="mt-2 bg-[#FBFBFA] border border-brand-border rounded-3xl p-4 flex flex-col gap-3 shadow-sm text-left">
          {!basicSubmitted || !dynamicSubmitted ? (
            <div className="flex flex-col gap-2">
              <button
                disabled
                className="w-full bg-slate-100 text-slate-400 font-bold text-[10px] tracking-wider py-3.5 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 border border-slate-200"
              >
                <Lock size={12} />
                COMPLETA AMBOS CUESTIONARIOS PARA FINALIZAR
              </button>
              <p className="text-[10px] text-brand-muted text-center leading-normal">
                Debes rellenar y enviar el Cuestionario Básico y el Cuestionario Dinámico antes de sellar tu preparación.
              </p>
            </div>
          ) : !userBovedaFinished ? (
            <div className="flex flex-col gap-2">
              <button
                onClick={finishUserBoveda}
                className="w-full bg-brand-gold hover:bg-brand-gold/90 text-[#13382c] font-bold text-[11px] tracking-widest py-3.5 rounded-xl transition duration-200 shadow-sm flex items-center justify-center gap-2 border border-brand-gold/20"
              >
                <ShieldCheck size={14} className="text-[#13382c]" />
                FINALIZAR FASE DE PREPARACIÓN
              </button>
              <p className="text-[10px] text-brand-green/80 text-center leading-normal px-2">
                Al pulsar este botón, confirmas que has finalizado tus propuestas y habilitarás el acceso a la Mesa de Negociación (se requiere que ambos cónyuges completen esta fase).
              </p>
            </div>
          ) : !partnerPhaseCompleted ? (
            <div className="flex flex-col gap-2">
              <div className="w-full bg-brand-green/10 border border-brand-green/20 text-brand-green font-semibold text-[10px] tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
                </span>
                ESPERANDO A QUE {partnerName.toUpperCase()} FINALICE...
              </div>
              <p className="text-[10px] text-brand-muted text-center leading-normal px-2">
                Has completado y sellado tu fase de preparación. La Mesa de Negociación se desbloqueará de forma automática cuando {partnerName} también selle su bóveda.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="w-full bg-emerald-600 text-white font-bold text-[10px] tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm">
                <CheckCircle size={14} />
                PREPARACIÓN CONJUNTA COMPLETADA
              </div>
              <p className="text-[10px] text-emerald-800 text-center font-medium leading-normal">
                ¡Mesa de Negociación Desbloqueada! Ya podéis contrastar vuestras posturas y formalizar el convenio.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN 2: INTIMIDAD Y DIARIO EMOCIONAL */}
      <div className="mt-8 flex flex-col gap-4">
        <div className="flex items-center gap-2 px-1">
          <span className="w-1.5 h-4 bg-brand-green rounded-full" />
          <h3 className="font-serif text-xs font-bold tracking-wider text-brand-green uppercase">
            2. Intimidad y Diario Emocional
          </h3>
        </div>
        <p className="text-[10px] text-brand-muted px-1 -mt-2 leading-relaxed">
          Tu espacio personal confidencial. Las notas aquí escritas no nutren borradores legales de manera directa ni son visibles para la otra parte.
        </p>

        {/* Item 3: Diario de Desahogo Privado */}
        <div className="bg-white border border-brand-border rounded-3xl p-5 shadow-sm relative flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 pr-6">
              <h4 className="font-serif text-lg font-bold text-brand-green flex items-center gap-2">
                <Bot size={16} className="text-brand-gold" />
                Diario de Desahogo Privado
              </h4>
              <p className="text-[11px] text-brand-muted leading-relaxed font-light mt-1">
                Escribe y procesa tus emociones con asistencia de la IA. Totalmente confidencial.
              </p>
            </div>
            
            <Link
              href="/boveda/chat-privado"
              className="w-9 h-9 rounded-full bg-[#FBFBFA] border border-brand-border flex items-center justify-center text-brand-gold shrink-0 hover:border-brand-gold"
            >
              {chatPrivadoSelled ? <CheckCircle size={16} className="text-emerald-600" /> : <Sparkles size={14} />}
            </Link>
          </div>

          <Link
            href="/boveda/chat-privado"
            className="w-full bg-[#FDFDFD] hover:bg-brand-green/5 border border-brand-border text-brand-green text-center font-bold text-[10px] tracking-wider py-3 rounded-xl transition duration-200 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>ABRIR DIARIO PRIVADO</span>
            <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      {/* Footer Safe Zone (Screenshot 3) */}
      <div className="mt-8 mb-4 flex flex-col items-center gap-2 text-center px-4">
        <div className="w-10 h-10 rounded-full border border-emerald-500/10 flex items-center justify-center text-emerald-600 bg-emerald-500/5">
          <Heart size={16} fill="currentColor" className="text-emerald-600/80" />
        </div>
        <span className="text-[10px] font-bold text-brand-green/80 tracking-widest uppercase">
          TU ZONA SIEMPRE SEGURA
        </span>
        <p className="text-[10px] text-brand-muted leading-relaxed max-w-[280px]">
          Tus borradores y pensamientos son estrictamente privados. Nada se comparte sin tu consentimiento.
        </p>
      </div>
      
    </div>
  );
}
