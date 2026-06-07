"use client";

import React, { useState } from "react";
import { useSimulation } from "@/context/SimulationContext";
import { useRouter } from "next/navigation";
import { Gavel, Landmark, ShieldCheck, Download, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AcuerdoAlcanzadoPage() {
  const router = useRouter();

  const handleStartRatification = () => {
    router.push("/mesa/ventajas");
  };

  return (
    <div className="flex flex-col px-6 py-4 select-none bg-brand-bg min-h-full items-center justify-between">
      
      {/* Header bar (Captura de pantalla 2026-06-03 a las 0.04.10.png) */}
      <div className="w-full flex justify-between items-center py-2 border-b border-brand-border/30 bg-brand-bg shrink-0">
        <button
          onClick={() => router.push("/mesa")}
          className="w-8 h-8 rounded-full hover:bg-brand-border/40 flex items-center justify-center text-brand-green"
          title="Mesa de Negociación"
        >
          <Gavel size={18} />
        </button>
        
        <div className="font-serif text-base font-bold flex items-center select-none">
          <span className="text-[#11372C]">Med</span>
          <span className="text-brand-gold">iA</span>
          <span className="text-[#11372C]">ción</span>
        </div>

        <button
          onClick={() => router.push("/vestibulo")}
          className="w-8 h-8 rounded-full hover:bg-brand-border/40 flex items-center justify-center text-brand-green"
          title="Vestíbulo"
        >
          <Landmark size={18} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-6 w-full gap-5">
        
        {/* Circular Gold Seal (Replicates the emblem in the screenshot) */}
        <div className="w-36 h-36 rounded-full bg-radial-[circle_at_center] from-[#1A3B32] to-[#0E1E1A] border-4 border-double border-brand-gold flex items-center justify-center shadow-lg relative shrink-0">
          {/* Inner Gold Borders */}
          <div className="absolute inset-1.5 border border-brand-gold/40 rounded-full" />
          <div className="absolute inset-3 border border-dashed border-brand-gold/30 rounded-full" />
          
          {/* Seal SVG contents */}
          <svg className="w-24 h-24 text-brand-gold" viewBox="0 0 100 100" fill="none">
            {/* Outer circular text path */}
            <path id="textPath" d="M22,50 a28,28 0 1,1 56,0 a28,28 0 1,1 -56,0" fill="none" />
            <text fontSize="7.5" fill="#CBA358" className="font-sans font-bold tracking-[0.1em]" letterSpacing="1.2">
              <textPath href="#textPath" startOffset="0%">
                MEDIACIÓN • ACUERDOS INTELIGENTES •
              </textPath>
            </text>
            
            {/* Central Scales & Handshake */}
            {/* Scale */}
            <path d="M50,26 L50,68 M34,38 L66,38 M34,38 L34,46 M66,38 L66,46 M34,46 A6,6 0 0,0 46,46 M54,46 A6,6 0 0,0 66,46" stroke="#CBA358" strokeWidth="1.5" strokeLinecap="round" />
            {/* Handshake silhouette */}
            <circle cx="50" cy="50" r="14" fill="#0E1E1A" className="opacity-80" />
            <path d="M42,50 C44,48 48,48 50,50 L58,50 M44,52 C46,50 50,50 52,52" stroke="#CBA358" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Titles & Message */}
        <div className="text-center flex flex-col gap-2.5">
          <h3 className="font-serif text-3xl font-bold text-[#13382c] tracking-wide">
            ¡Acuerdo Alcanzado!
          </h3>
          <p className="text-[11px] text-brand-muted leading-relaxed font-light px-2">
            Felicitaciones. Ambas partes han demostrado voluntad y compromiso para llegar a un consenso constructivo. El borrador de su acuerdo está listo.
          </p>
        </div>

        {/* Premium Associated Lawyer CTA Container */}
        <div className="bg-[#163B30] text-white border border-[#1d4c3f] rounded-3xl p-5 shadow-md flex flex-col gap-4 w-full relative overflow-hidden">
          {/* Background design */}
          <div className="absolute -right-16 -top-16 w-32 h-32 bg-brand-gold/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex flex-col items-center gap-3">
            {/* Shield check circle */}
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-brand-gold border border-white/10 shrink-0">
              <ShieldCheck size={18} />
            </div>
            
            <div className="text-center flex flex-col gap-1.5">
              <h4 className="font-serif text-base font-bold text-brand-gold leading-snug">
                Finalizar acuerdo con Abogado especialista
              </h4>
              <p className="text-[10px] text-white/70 leading-relaxed font-light px-1">
                Paso esencial para otorgar validez legal y ratificación judicial a su acuerdo. Asegure su futuro con revisión profesional experta.
              </p>
            </div>
          </div>

          {/* Iniciar Ratificación button */}
          <button
            onClick={handleStartRatification}
            className="w-full bg-brand-gold hover:bg-brand-gold-hover text-[#0E1E1A] font-bold py-3.5 rounded-xl text-[10px] tracking-wider transition duration-150 flex items-center justify-center gap-1 shadow-sm mt-1 cursor-pointer"
          >
            <span className="font-serif text-xs font-bold uppercase tracking-wider text-[#0E1E1A]">Iniciar Ratificación</span>
            <ChevronRight size={12} className="text-[#0E1E1A] mt-0.5" />
          </button>
        </div>

        {/* Download Draft Button Outline */}
        <button
          onClick={() => router.push("/mesa/ventajas")}
          className="w-full bg-transparent hover:bg-neutral-50 border border-brand-border text-brand-green font-bold py-3.5 rounded-xl text-[10px] tracking-wider transition duration-150 flex items-center justify-center gap-2 shadow-sm font-sans cursor-pointer"
        >
          <Download size={14} className="text-brand-gold" />
          <span>Descargar acuerdos alcanzados</span>
        </button>

        {/* Legal disclaimer */}
        <p className="text-[9px] text-brand-muted leading-relaxed font-light text-center max-w-[280px] -mt-1 italic">
          *El borrador descargable no tiene validez legal sin revisión profesional.
        </p>

      </div>
      
    </div>
  );
}
