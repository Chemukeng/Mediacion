"use client";

import React, { useState } from "react";
import { useSimulation } from "@/context/SimulationContext";
import { useRouter } from "next/navigation";
import { ChevronLeft, HelpCircle, Lock, ShieldCheck, Scale, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function PagoHonorariosPage() {
  const { paymentOption, setPaymentOption, completePayment, paymentCompleted, hijos, vivienda } = useSimulation();
  const router = useRouter();

  const hasChildren = hijos !== "no";
  const hasProperties = vivienda !== "alquiler";
  const totalCost = (hasChildren || hasProperties) ? 800 : 500;
  const halfCost = totalCost / 2;

  const handlePay = () => {
    completePayment();
    alert("Pago realizado con éxito. Expediente enviado al equipo legal.");
    router.push("/mesa/finalizado");
  };

  return (
    <div className="flex flex-col px-6 py-4 select-none bg-brand-bg min-h-full">
      
      {/* Header bar (screen copia 6.png) */}
      <div className="flex justify-between items-center py-2 border-b border-brand-border/30 bg-brand-bg shrink-0">
        <button
          onClick={() => router.push("/mesa/libro-mayor")}
          className="w-8 h-8 rounded-full hover:bg-brand-border/40 flex items-center justify-center text-brand-green"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="font-serif text-base font-bold flex items-center select-none">
          <span className="text-[#11372C]">Med</span>
          <span className="text-brand-gold">iA</span>
          <span className="text-[#11372C]">ción</span>
        </div>

        <div className="w-8 h-8 rounded-full border border-brand-border bg-neutral-200 overflow-hidden flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-neutral-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Center Icon & Main Titles (screen copia 6.png) */}
      <div className="flex flex-col items-center text-center gap-2.5 mt-6 shrink-0">
        <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold border border-brand-gold/20">
          <Scale size={20} />
        </div>
        
        <div className="flex flex-col">
          <h3 className="font-serif text-2xl font-bold text-brand-green">
            Pago de Honorarios
          </h3>
          <span className="text-[9px] text-brand-muted font-semibold tracking-wider mt-0.5">
            Ratificación Legal por Abogado Especialista
          </span>
        </div>
      </div>

      {/* Main Service Card */}
      <div className="bg-white border border-brand-border rounded-3xl p-5 shadow-sm mt-6 relative flex flex-col gap-4">
        {/* Accent gold bar */}
        <div className="absolute left-0 top-6 bottom-6 w-1 bg-brand-gold rounded-r" />
        
        <div className="flex flex-col gap-1 pl-1">
          <span className="text-[9px] font-bold text-brand-gold tracking-[0.2em] uppercase font-sans">
            SERVICIO LEGAL
          </span>
          <h4 className="font-serif text-lg font-bold text-brand-green">
            Ratificación y Trámite Judicial
          </h4>
          <p className="text-[11px] text-brand-muted leading-relaxed font-light mt-0.5">
            Gestión completa del procedimiento de mutuo acuerdo.
          </p>
        </div>

        <div className="h-[1px] bg-brand-border/60 pl-1" />

        <div className="flex flex-col pl-1">
          <span className="text-[10px] text-brand-muted uppercase tracking-wider font-semibold">Coste Total</span>
          <span className="font-serif text-3xl font-bold text-brand-green mt-0.5">{totalCost}€</span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-brand-green font-medium pl-1 mt-1 font-sans">
          <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <Check size={9} strokeWidth={3} />
          </div>
          <span>Proceso garantizado. Abogado colegiado asignado.</span>
        </div>

        <div className="h-[1px] bg-brand-border/60 pl-1 mt-1" />

        <button
          onClick={() => router.push("/mesa/ventajas")}
          className="text-[10px] text-brand-gold hover:text-brand-gold-hover font-semibold flex items-center justify-center gap-1.5 py-2 px-3 border border-dashed border-brand-gold/30 hover:border-brand-gold/60 rounded-xl bg-brand-gold/5 transition cursor-pointer mt-1"
        >
          <ShieldCheck size={12} className="text-brand-gold shrink-0" />
          <span>Ver todas las ventajas y garantías del servicio</span>
        </button>
      </div>

      {/* Options of payment section */}
      <div className="flex flex-col gap-3 mt-6">
        <span className="text-[9px] font-bold text-brand-gold tracking-[0.2em] uppercase font-sans pl-1">
          OPCIONES DE PAGO
        </span>

        {/* Option 1: 50% (Highly recommended and highlighted) */}
        <button
          onClick={() => setPaymentOption("50")}
          className={`border rounded-2xl p-5 flex flex-col gap-3 text-left transition duration-300 relative cursor-pointer hover:scale-[1.015] active:scale-[0.99] ${
            paymentOption === "50"
              ? "bg-gradient-to-br from-[#FCFAF6] via-[#FAF3E3] to-[#F5ECE2] border-brand-gold border-[2.5px] shadow-[0_12px_35px_rgba(181,148,78,0.35)] ring-1 ring-brand-gold/30"
              : "bg-[#FCFAF7] border-brand-gold/35 hover:border-brand-gold/60 shadow-sm"
          }`}
        >
          {/* Top highlight ribbon border if active */}
          {paymentOption === "50" && (
            <div className="absolute top-0 left-8 right-8 h-[3px] bg-gradient-to-r from-transparent via-[#C5A45E] to-transparent" />
          )}

          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-250 ${
                paymentOption === "50" ? "border-brand-gold bg-[#13382C]" : "border-brand-border bg-white"
              }`}>
                {paymentOption === "50" && <span className="w-1.5 h-1.5 bg-brand-gold rounded-full" />}
              </span>
              <span className="font-serif font-bold text-[13.5px] text-brand-green leading-snug flex items-center gap-1">
                Pago al 50% (Compartido)
                {paymentOption === "50" && <Sparkles size={11} className="text-brand-gold animate-pulse shrink-0" />}
              </span>
            </div>
            
            <span className="bg-gradient-to-r from-brand-gold to-amber-500 text-white font-extrabold px-2.5 py-1 rounded-full text-[7.5px] uppercase tracking-wider shadow-md flex items-center gap-1 animate-pulse border border-white/10 shrink-0">
              ★ RECOMENDADO
            </span>
          </div>

          <p className="text-[10px] text-brand-muted leading-relaxed font-light pl-6 -mt-1">
            Cada parte asume su mitad equitativamente. Enviaremos un enlace de pago al otro cónyuge para completar el trámite.
          </p>

          <div className="flex flex-col pl-6 mt-1 border-t border-brand-border/40 pt-2.5 text-[10px]">
            <span className="text-brand-muted font-semibold">Tú pagas hoy</span>
            <span className="font-serif text-2.5xl font-black text-brand-green mt-0.5">{halfCost}€</span>
          </div>
        </button>

        {/* Option 2: 100% */}
        <button
          onClick={() => setPaymentOption("100")}
          className={`border rounded-2xl p-4 flex flex-col gap-3 text-left shadow-sm transition duration-150 relative ${
            paymentOption === "100"
              ? "bg-[#FAF7EF] border-brand-gold border-2 ring-1 ring-brand-gold shadow-md"
              : "bg-white border-brand-border hover:border-brand-gold/40"
          }`}
        >
          <div className="flex justify-between items-baseline w-full">
            <div className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                paymentOption === "100" ? "border-brand-gold bg-[#13382C]" : "border-brand-border bg-white"
              }`}>
                {paymentOption === "100" && <span className="w-1.5 h-1.5 bg-brand-gold rounded-full" />}
              </span>
              <span className="font-serif font-bold text-xs text-brand-green leading-snug">
                Pago Único al 100%
              </span>
            </div>
          </div>

          <p className="text-[10px] text-brand-muted leading-relaxed font-light pl-6">
            Asumir el coste total del servicio legal para agilizar el inicio del trámite judicial de inmediato.
          </p>

          <div className="flex flex-col pl-6 mt-1 border-t border-brand-border/40 pt-2 text-[10px]">
            <span className="text-brand-muted">Tú pagas hoy</span>
            <span className="font-serif text-xl font-bold text-brand-green">{totalCost}€</span>
          </div>
        </button>
      </div>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-4 mt-6 text-brand-muted select-none">
        <span className="w-5 h-5 flex items-center justify-center border border-brand-border/60 rounded text-[9px] font-bold">💳</span>
        <Lock size={12} className="text-brand-gold" />
        <span className="text-[8px] font-mono tracking-wider bg-[#EAEAE6] px-1.5 py-0.5 rounded border border-brand-border/50 uppercase font-semibold">VISA</span>
        <span className="text-[8px] font-mono tracking-wider bg-[#EAEAE6] px-1.5 py-0.5 rounded border border-brand-border/50 uppercase font-semibold">GPAY</span>
      </div>

      {/* Safe Checkout Button */}
      <button
        onClick={handlePay}
        className="w-full bg-brand-green hover:bg-brand-green/95 text-white font-bold py-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition duration-200 mt-5 shadow-lg group shrink-0"
      >
        <Lock size={12} className="text-brand-gold" />
        <span className="font-serif text-brand-gold font-bold">Realizar Pago Seguro</span>
      </button>

      {/* Encryption notice footer */}
      <div className="text-center text-[9px] text-brand-muted mt-3 italic font-sans">
        Conexión cifrada de extremo a extremo. Sus datos están protegidos.
      </div>
      
    </div>
  );
}
