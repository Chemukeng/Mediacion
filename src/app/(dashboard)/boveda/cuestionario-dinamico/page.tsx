"use client";

import React, { useState } from "react";
import { useSimulation } from "@/context/SimulationContext";
import { useRouter } from "next/navigation";
import { ChevronLeft, X, Lock, User, Users, Landmark, Info, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function CuestionarioDinamicoQuestionPage() {
  const { submitDynamicQuestion, dynamicSubmitted } = useSimulation();
  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState<string | null>("vender");

  const handleSend = () => {
    submitDynamicQuestion();
    alert("Respuesta guardada confidencialmente en tu Bóveda. Se comparará con la respuesta de tu expareja.");
    router.push("/boveda");
  };

  const options = [
    {
      id: "quedar",
      label: "Me lo quedo yo",
      sub: "Compensaré la mitad del valor",
      icon: User
    },
    {
      id: "pareja",
      label: "Para mi expareja",
      sub: "Recibiré la mitad del valor",
      icon: Users
    },
    {
      id: "vender",
      label: "Vender y dividir",
      sub: "Reparto 50% de beneficios",
      icon: Landmark
    }
  ];

  return (
    <div className="flex flex-col px-6 py-4 select-none relative bg-brand-bg h-full">
      
      {/* Header bar (screen copia 2.png) */}
      <div className="flex justify-between items-center py-2 border-b border-brand-border/30 bg-brand-bg shrink-0">
        <button
          onClick={() => router.push("/boveda")}
          className="w-8 h-8 rounded-full hover:bg-brand-border/40 flex items-center justify-center text-brand-green"
        >
          <ChevronLeft size={20} />
        </button>
        
        <span className="text-[10px] font-bold text-brand-muted tracking-[0.2em] uppercase font-sans">
          PREGUNTA 3 DE 8
        </span>

        <button
          onClick={() => router.push("/boveda")}
          className="w-8 h-8 rounded-full hover:bg-brand-border/40 flex items-center justify-center text-brand-muted"
        >
          <X size={18} />
        </button>
      </div>

      {/* Progress Bar under header */}
      <div className="w-full bg-[#E3E3DE] h-1.5 overflow-hidden shrink-0 mt-0.5 relative">
        <div className="bg-brand-gold h-full transition-all duration-300" style={{ width: dynamicSubmitted ? "100%" : "37.5%" }} />
      </div>

      {dynamicSubmitted && (
        <div className="mt-4 bg-emerald-500/10 border border-emerald-500/25 p-3.5 rounded-xl flex gap-2.5 text-[10px] leading-relaxed text-emerald-800 text-left animate-in fade-in shrink-0 mx-6">
          <Check className="text-emerald-600 shrink-0 mt-0.5" size={14} strokeWidth={3} />
          <div>
            <strong className="text-brand-green font-semibold block mb-0.5">Pregunta Respondida y Sellada</strong>
            Tu respuesta ha sido cifrada y enviada a la Bóveda Privada. No se puede modificar para asegurar el consenso.
          </div>
        </div>
      )}

      {/* Main Question & Notice Container */}
      <div className="mt-8 flex flex-col gap-4">
        
        <h2 className="font-serif text-3xl font-bold text-[#13382c] leading-tight text-center px-2">
          ¿Qué propones hacer con el coche familiar (SEAT León)?
        </h2>

        {/* Confidentiality Notice */}
        <div className="flex items-center gap-2.5 bg-brand-gold/5 border border-brand-gold/15 p-3 rounded-2xl text-[10px] text-brand-muted mt-2 justify-center max-w-[320px] mx-auto">
          <Lock size={12} className="text-brand-gold shrink-0" />
          <span className="leading-relaxed text-[#5E5136] italic">
            Tu respuesta es confidencial hasta que la otra parte responda.
          </span>
        </div>

      </div>

      {/* Options Cards List */}
      <div className="flex flex-col gap-3 mt-6">
        {options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              type="button"
              disabled={dynamicSubmitted}
              onClick={() => setSelectedOption(opt.id)}
              className={`w-full border rounded-2xl p-4 flex items-center gap-4 text-left shadow-sm transition duration-150 relative disabled:opacity-85 disabled:cursor-not-allowed ${
                isSelected
                  ? "bg-[#F3EFE6] border-brand-gold ring-1 ring-brand-gold"
                  : "bg-white border-brand-border hover:border-brand-gold/40"
              }`}
            >
              {/* Highlight selection check */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-4 h-4 bg-brand-gold rounded-full flex items-center justify-center text-brand-green">
                  <Check size={10} strokeWidth={3} />
                </div>
              )}

              {/* Round Icon */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isSelected ? "bg-brand-gold text-[#0E1E1A]" : "bg-brand-green/5 text-brand-green border border-brand-green/10"
              }`}>
                <Icon size={18} />
              </div>

              {/* Details */}
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xs text-brand-green leading-snug">
                  {opt.label}
                </span>
                <span className="text-[10px] text-brand-muted leading-relaxed font-light font-sans mt-0.5">
                  {opt.sub}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Market Value Note Card (screen copia 2.png) */}
      <div className="mt-5 bg-white border border-brand-border/70 p-4 rounded-xl text-[10px] text-brand-muted leading-relaxed flex items-start gap-2.5 shadow-sm">
        <Info size={14} className="text-brand-gold mt-0.5 shrink-0" />
        <p className="font-light font-sans text-brand-text/80">
          El valor medio de mercado para un SEAT León 2019 es aprox. <strong className="text-brand-green font-bold">13.200 €</strong>.
        </p>
      </div>

      {/* Submit Button */}
      {dynamicSubmitted ? (
        <button
          type="button"
          disabled
          className="w-full bg-[#1C2A25] text-white/30 border border-white/5 font-bold py-4 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-not-allowed mt-auto shadow-inner shrink-0"
        >
          <Lock size={12} className="text-white/25" />
          <span className="font-serif text-sm">Respuesta Sellada en Bóveda</span>
        </button>
      ) : (
        <button
          onClick={handleSend}
          className="w-full bg-brand-green hover:bg-brand-green/95 text-white font-bold py-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition duration-200 mt-auto shadow-md font-sans group cursor-pointer"
        >
          <Lock size={12} className="text-brand-gold" />
          <span className="font-serif text-brand-gold font-bold">Enviar confidencialmente</span>
        </button>
      )}
      
    </div>
  );
}
