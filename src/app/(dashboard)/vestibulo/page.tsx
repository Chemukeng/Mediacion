"use client";

import React from "react";
import { useSimulation } from "@/context/SimulationContext";
import { Lock, Scale, BookOpen, ChevronRight, CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function VestibuloPage() {
  const {
    userName,
    partnerName,
    inviteSent,
    inviteName,
    partnerPhaseCompleted,
    basicCompleted,
    dynamicCompleted,
    proposalAccepted
  } = useSimulation();

  // The Mesa de Negociación is unlocked once:
  // 1. Basic Questionnaire is completed by the user
  // 2. The ex-partner has completed their phase (partnerPhaseCompleted is true in simulation)
  const isMesaUnlocked = basicCompleted && partnerPhaseCompleted;

  return (
    <div className="flex flex-col gap-6 px-6 py-6 select-none animate-in fade-in duration-300">
      
      {/* Header Profile Greeting */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-brand-gold tracking-[0.2em] uppercase font-sans">
            MEDIACIÓN DIGITAL NEUTRAL
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#13382c] mt-0.5">
            Buenas noches, {userName}
          </h2>
        </div>

        {/* Profile Avatar Frame (premium B&W style, simulated as portrait) */}
        <div className="w-12 h-12 rounded-full border border-brand-border bg-neutral-200 overflow-hidden shadow-sm flex items-center justify-center shrink-0">
          <svg className="w-10 h-10 text-neutral-400 mt-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Active Mediation Banner */}
      <Link href="/invitacion" className="block focus:outline-none hover:opacity-95 transition-all">
        {!inviteSent ? (
          <div className="bg-[#B5944E]/10 border border-[#B5944E]/30 rounded-full px-5 py-3 flex items-center justify-between text-xs shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#B5944E] rounded-full inline-block animate-pulse shadow-sm shadow-[#B5944E]/60" />
              <span className="font-bold text-[#B5944E] uppercase tracking-wider text-[10px] font-sans">
                VINCULACIÓN PENDIENTE
              </span>
            </div>
            <div className="h-4 w-[1px] bg-brand-border" />
            <span className="font-serif italic text-brand-muted hover:text-brand-green transition flex items-center gap-1">
              Invitar expareja para iniciar <ChevronRight size={12} className="text-[#B5944E] shrink-0" />
            </span>
          </div>
        ) : !partnerPhaseCompleted ? (
          <div className="bg-[#EAEAE6]/50 border border-brand-border/60 rounded-full px-5 py-3 flex items-center justify-between text-xs shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-brand-gold rounded-full inline-block animate-pulse shadow-sm shadow-brand-gold/60" />
              <span className="font-bold text-brand-green/80 uppercase tracking-wider text-[10px] font-sans">
                VINCULACIÓN EN PROCESO
              </span>
            </div>
            <div className="h-4 w-[1px] bg-brand-border" />
            <span className="font-serif italic text-brand-green/70 flex items-center gap-1">
              Pendiente: {inviteName || partnerName} <ChevronRight size={12} className="text-brand-gold shrink-0" />
            </span>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-full px-5 py-3 flex items-center justify-between text-xs shadow-sm text-emerald-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-full inline-block animate-pulse shadow-sm shadow-emerald-500/60" />
              <span className="font-bold text-emerald-700 uppercase tracking-wider text-[10px] font-sans">
                MEDIACIÓN ACTIVA
              </span>
            </div>
            <div className="h-4 w-[1px] bg-brand-border" />
            <span className="font-serif italic text-emerald-700/80 flex items-center gap-1">
              Expareja - {partnerName} <ChevronRight size={12} className="text-emerald-600 shrink-0" />
            </span>
          </div>
        )}
      </Link>

      {/* Main Feature Cards */}
      <div className="flex flex-col gap-4">
        
        {/* Card 1: Bóveda Privada */}
        <Link href="/boveda" className="focus:outline-none block group">
          <motion.div
            whileHover={{ y: -2 }}
            className="w-full bg-[#163B30] text-white rounded-3xl p-6 shadow-md border border-[#1d4c3f] relative overflow-hidden flex flex-col gap-6"
          >
            {/* Background pattern */}
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-brand-gold/5 rounded-full blur-xl pointer-events-none" />
            
            {/* Header row */}
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                <Lock className="text-brand-gold" size={20} strokeWidth={2} />
              </div>
              <span className="bg-brand-gold/10 text-brand-gold border border-brand-gold/30 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                ENCRIPTADO
              </span>
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-1.5 mt-2">
              <h3 className="font-serif text-2xl font-bold tracking-wide flex items-center gap-1.5 group-hover:text-brand-gold transition duration-200">
                Bóveda Privada
                <ChevronRight size={18} className="text-brand-gold/60 mt-0.5 group-hover:translate-x-0.5 transition" />
              </h3>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                Desahoga, redacta y procesa emociones de forma segura. Nada sale de aquí sin tu firma.
              </p>
            </div>
            
            {/* Completion status info */}
            <div className="flex items-center justify-between text-[10px] text-white/50 border-t border-white/5 pt-3.5 mt-1 font-medium">
              <span>ESTADO PREPARACIÓN</span>
              <span className="text-brand-gold">
                {basicCompleted ? (dynamicCompleted ? "66% COMPLETADO" : "33% COMPLETADO") : "INICIAR PROCESO"}
              </span>
            </div>
          </motion.div>
        </Link>

        {/* Card 2: Mesa de Negociación */}
        {isMesaUnlocked ? (
          <Link href="/mesa" className="focus:outline-none block group">
            <motion.div
              whileHover={{ y: -2 }}
              className="w-full bg-white text-brand-green border border-brand-border rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col gap-6"
            >
              {/* Header row */}
              <div className="flex justify-between items-center">
                <div className="w-12 h-12 bg-brand-green/5 rounded-xl flex items-center justify-center border border-brand-green/10">
                  <Scale className="text-brand-green" size={20} strokeWidth={2} />
                </div>
                <span className="bg-emerald-100 text-emerald-700 border border-emerald-300/30 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-ping" />
                  ACTIVO
                </span>
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-1.5 mt-2">
                <h3 className="font-serif text-2xl font-bold tracking-wide text-brand-green flex items-center gap-1.5 group-hover:text-brand-gold transition duration-200">
                  Mesa de Negociación
                  <ChevronRight size={18} className="text-brand-gold mt-0.5 group-hover:translate-x-0.5 transition" />
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed font-light">
                  Revisar propuestas neutrales y ofertas formales. Espacio libre de emociones.
                </p>
              </div>

              {/* Unlock Footer */}
              <div className="flex items-center justify-between text-[10px] text-emerald-700 border-t border-brand-border pt-3.5 mt-1 font-medium bg-emerald-500/5 -mx-6 -mb-6 px-6 py-3 rounded-b-3xl">
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  Mesa habilitada para mediación
                </span>
                <span className="font-bold">ACCEDER &gt;</span>
              </div>
            </motion.div>
          </Link>
        ) : (
          <div className="w-full bg-[#EAEAE6]/60 text-neutral-400 border border-brand-border/60 rounded-3xl p-6 shadow-sm relative flex flex-col gap-6">
            
            {/* Header row */}
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 bg-neutral-200/50 rounded-xl flex items-center justify-center border border-neutral-300/20 text-neutral-400">
                <Scale size={20} strokeWidth={2} />
              </div>
              <div className="flex items-center gap-1 bg-neutral-200 text-neutral-500 border border-neutral-300/30 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                <Lock size={9} />
                BLOQUEADO
              </div>
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-1.5 mt-2">
              <h3 className="font-serif text-2xl font-bold tracking-wide text-neutral-700 flex items-center gap-1.5">
                Mesa de Negociación
                <Lock size={16} className="text-neutral-400 mt-0.5" />
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">
                Revisar propuestas neutrales y ofertas formales. Espacio libre de emociones.
              </p>
            </div>

            {/* Unlock instruction */}
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 border-t border-neutral-200 pt-3.5 mt-1 font-medium italic">
              <ShieldAlert size={12} className="text-brand-gold" />
              <span>
                {!basicCompleted
                  ? "Completa el Cuestionario Básico en tu Bóveda"
                  : "Esperando que tu expareja complete su fase inicial"}
              </span>
            </div>
          </div>
        )}

        {/* El Libro Mayor (Archivo de solo lectura) */}
        <Link href="/mesa/libro-mayor" className="w-full bg-white border border-brand-border/80 rounded-2xl p-4 shadow-sm flex items-center justify-between hover:border-brand-gold transition duration-200 cursor-pointer group block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-green/5 rounded-lg flex items-center justify-center border border-brand-green/10 text-brand-green">
              <BookOpen size={16} />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-brand-green text-sm group-hover:text-brand-gold transition">
                El Libro Mayor
              </span>
              <span className="text-[10px] text-brand-muted">
                Archivo histórico de acuerdos
              </span>
            </div>
          </div>
          <span className="text-[9px] font-bold text-brand-muted uppercase bg-brand-bg px-2 py-1 rounded border border-brand-border">
            Solo Lectura
          </span>
        </Link>
      </div>
      
    </div>
  );
}
