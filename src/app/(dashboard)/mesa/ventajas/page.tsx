"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSimulation } from "@/context/SimulationContext";
import {
  ShieldCheck,
  Scale,
  ChevronLeft,
  Check,
  X,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VentajasLegalesPage() {
  const router = useRouter();
  const { partnerName, hijos, vivienda } = useSimulation();

  const hasChildren = hijos !== "no";
  const hasProperties = vivienda !== "alquiler";
  const totalCost = (hasChildren || hasProperties) ? 800 : 500;
  const halfCost = totalCost / 2;
  
  const [showWarningModal, setShowWarningModal] = useState(false);

  const handleSelectMedIAdor = () => {
    router.push("/mesa/pago");
  };

  const handleConfirmDownload = () => {
    setShowWarningModal(false);
    router.push("/mesa/descargas");
  };

  return (
    <div className="flex flex-col px-6 py-4 select-none bg-brand-bg min-h-full justify-between gap-5 animate-in fade-in duration-300">
      
      {/* Header bar */}
      <div className="w-full flex justify-between items-center py-2 border-b border-brand-border/30 bg-brand-bg shrink-0">
        <button
          onClick={() => router.push("/mesa/acuerdo-alcanzado")}
          className="w-8 h-8 rounded-full hover:bg-brand-border/40 flex items-center justify-center text-brand-green"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h2 className="font-serif text-base font-bold text-[#13382c]">
          Garantía Legal
        </h2>

        <div className="w-8 h-8 flex items-center justify-center text-brand-gold shrink-0">
          <ShieldCheck size={20} />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 py-2">
        
        {/* Title Section */}
        <div className="text-center flex flex-col gap-1 mt-1 shrink-0">
          <span className="text-[9px] font-bold text-brand-gold tracking-[0.25em] uppercase font-sans">
            ¿CÓMO FINALIZAR EL PROCESO?
          </span>
          <h3 className="font-serif text-2xl font-bold text-brand-green leading-snug">
            ¿Por qué tramitar con MedIAdor?
          </h3>
          <p className="text-[11px] text-brand-muted leading-relaxed font-light">
            En España, todo convenio regulador exige la representación obligatoria de Abogado y Procurador en el Juzgado (Art. 750 LEC).
          </p>
        </div>

        {/* Comparison Table Card */}
        <div className="bg-white border border-brand-border rounded-3xl p-5 shadow-sm flex flex-col gap-4">
          
          <div className="grid grid-cols-2 gap-2 text-center border-b border-brand-border pb-3">
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[9px] font-bold text-brand-gold font-sans uppercase">OPCIÓN A</span>
              <span className="text-[11.5px] font-bold text-brand-green font-serif leading-none">Vía MedIAdor</span>
              <span className="text-[9px] font-mono text-brand-gold font-semibold uppercase tracking-wider bg-brand-green/5 px-2 py-0.5 rounded">
                Todo Incluido
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 border-l border-brand-border">
              <span className="text-[9px] font-bold text-brand-muted font-sans uppercase">OPCIÓN B</span>
              <span className="text-[11.5px] font-bold text-brand-muted font-serif leading-none">Borrador por Libre</span>
              <span className="text-[9px] font-mono text-brand-muted/70 font-semibold uppercase tracking-wider bg-brand-bg px-2 py-0.5 rounded">
                Riesgo e Incertidumbre
              </span>
            </div>
          </div>

          {/* Comparison Items */}
          <div className="flex flex-col gap-3.5 text-[11px]">
            
            {/* Item 1: Abogado */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-2">
                <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <strong className="text-brand-green leading-tight">Abogado Colegiado</strong>
                  <span className="text-[9px] text-brand-muted">Asignado en 24h laborables</span>
                </div>
              </div>
              <div className="flex gap-2 border-l border-brand-border pl-2">
                <X size={14} className="text-red-500 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <strong className="text-brand-muted leading-tight">Buscar por libre</strong>
                  <span className="text-[9px] text-brand-muted/70">Buscar y negociar tarifas</span>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-brand-border/60" />

            {/* Item 2: Procurador */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-2">
                <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <strong className="text-brand-green leading-tight">Procurador Incluido</strong>
                  <span className="text-[9px] text-brand-muted">Tasas y representación cubiertas</span>
                </div>
              </div>
              <div className="flex gap-2 border-l border-brand-border pl-2">
                <X size={14} className="text-red-500 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <strong className="text-brand-muted leading-tight">Coste Adicional</strong>
                  <span className="text-[9px] text-brand-muted/70">Tasas variables del procurador</span>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-brand-border/60" />

            {/* Item 3: Precio */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-2">
                <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <strong className="text-brand-green leading-tight">Tarifa Plana Fija</strong>
                  <span className="text-[9.5px] text-brand-gold font-bold">{totalCost}€ total ({halfCost}€ c/u)</span>
                </div>
              </div>
              <div className="flex gap-2 border-l border-brand-border pl-2">
                <X size={14} className="text-red-500 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <strong className="text-brand-muted leading-tight">Coste Elevado</strong>
                  <span className="text-[9px] text-brand-muted/70">Media en España: ~1.200€</span>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-brand-border/60" />

            {/* Item 4: Garantías */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-2">
                <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <strong className="text-brand-green leading-tight">Garantía de Firma</strong>
                  <span className="text-[9px] text-brand-muted">Si el fiscal pide cambios, se adaptan</span>
                </div>
              </div>
              <div className="flex gap-2 border-l border-brand-border pl-2">
                <X size={14} className="text-red-500 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <strong className="text-brand-muted leading-tight">Riesgo de Rechazo</strong>
                  <span className="text-[9px] text-brand-muted/70">Reiniciar el proceso si hay errores</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Premium Associated Lawyer trust badge */}
        <div className="bg-[#163B30] text-white border border-[#1d4c3f] rounded-2xl p-4 flex gap-3 text-xs leading-relaxed">
          <Sparkles className="text-brand-gold shrink-0 mt-0.5 animate-pulse" size={16} />
          <div>
            <strong className="text-brand-gold font-semibold block mb-0.5">Firma 100% Homologada</strong>
            Nos encargamos de toda la burocracia. Tú y tu expareja ({partnerName}) firmaréis de manera digital desde el móvil. Sin visitas incómodas a despachos.
          </div>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex flex-col gap-3 w-full shrink-0">
        
        <button
          onClick={handleSelectMedIAdor}
          className="w-full bg-brand-gold hover:bg-brand-gold-hover text-[#0E1E1A] font-bold py-4 rounded-xl text-xs flex items-center justify-center gap-2 transition duration-200 shadow-md border border-brand-gold/30 hover:border-brand-gold cursor-pointer"
        >
          <span className="font-serif text-sm font-bold uppercase tracking-wider">Asegurar Trámite Completo ({halfCost}€)</span>
          <ArrowRight size={14} />
        </button>

        {/* Secondary download options with warnings */}
        <button
          onClick={() => setShowWarningModal(true)}
          className="w-full text-brand-muted hover:text-brand-green text-[10.5px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <span>Prefiero descargar el borrador sin garantías legales</span>
        </button>
      </div>

      {/* Custom Warning Modal Dialog */}
      <AnimatePresence>
        {showWarningModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0E1E1A]/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={() => setShowWarningModal(false)} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-bg rounded-3xl p-6 border border-brand-gold/30 z-10 flex flex-col gap-4 max-w-sm w-full relative text-center"
            >
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
                <AlertTriangle size={24} />
              </div>
              
              <div>
                <h4 className="font-serif text-lg font-bold text-brand-green">Atención: Validez Nula</h4>
                <p className="text-[11px] text-brand-muted mt-2 leading-relaxed">
                  El borrador PDF que vas a descargar <strong>carece de validez ante los tribunales</strong> sin la firma colegiada de un abogado y la representación de un procurador. 
                  <br /><br />
                  Si lo haces por tu cuenta, deberás buscar y pagar a ambos profesionales por separado (precio medio de 1.200€ en España).
                </p>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={handleConfirmDownload}
                  className="w-full bg-transparent hover:bg-neutral-100 text-brand-muted font-bold py-2.5 rounded-xl text-[10px] tracking-wider transition border border-brand-border cursor-pointer flex items-center justify-center gap-1"
                >
                  <Download size={11} className="text-brand-gold" />
                  Descargar sin abogados (asumir costes)
                </button>
                
                <button
                  onClick={() => setShowWarningModal(false)}
                  className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-bold py-3.5 rounded-xl text-[10.5px] tracking-wider transition cursor-pointer"
                >
                  Asegurar con MedIAdor (Recomendado)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
