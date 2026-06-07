"use client";

import React, { useState } from "react";
import { useSimulation } from "@/context/SimulationContext";
import { useRouter } from "next/navigation";
import { ChevronLeft, MoreVertical, Lock, ShieldCheck, PenSquare, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function BovedaChatPrivadoPage() {
  const { sellChatPrivado, chatPrivadoSelled } = useSimulation();
  const router = useRouter();

  const [inputVal, setInputVal] = useState("");

  const handleSellar = () => {
    sellChatPrivado();
    alert("Entrada encriptada y sellada en tu Bóveda Privada. La IA procesará las emociones de forma segura.");
    router.push("/boveda");
  };

  return (
    <div className="flex flex-col h-full bg-brand-bg select-none relative">
      
      {/* Green Header (screen.png) */}
      <div className="bg-[#163B30] text-white px-6 py-4 flex items-center justify-between border-b border-[#1d4c3f] shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/boveda")}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-brand-gold border border-white/10">
              <Lock size={16} />
            </div>
            
            <div className="flex flex-col">
              <h2 className="font-serif text-base font-bold text-white leading-none">
                Bóveda Privada
              </h2>
              <span className="text-[8px] text-brand-gold font-bold tracking-widest uppercase mt-1">
                SESIÓN ENCRIPTADA • EXTREMO A EXTREMO
              </span>
            </div>
          </div>
        </div>

        <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Chat scrollable container */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-6">
        
        {/* Date block (screen.png) */}
        <div className="flex justify-center">
          <div className="bg-[#EAEAE6]/80 border border-brand-border/60 px-4 py-1.5 rounded text-[10px] font-bold text-brand-muted tracking-wider uppercase font-sans">
            VIERNES, 24 DE OCTUBRE
          </div>
        </div>

        {/* Conversation flow */}
        <div className="flex flex-col gap-5">
          
          {/* Mediador IA Message 1 */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#163B30] flex items-center justify-center text-white shrink-0 border border-[#235848]">
              <span className="text-[10px] font-bold">🤖</span>
            </div>
            
            <div className="flex flex-col gap-1 max-w-[85%]">
              <span className="text-[8px] font-bold text-brand-muted uppercase tracking-wider pl-1">
                Mediador IA
              </span>
              <div className="bg-[#163B30] text-white rounded-2xl rounded-tl-none px-4 py-3.5 text-xs leading-relaxed border border-[#1d4c3f] shadow-sm">
                Entiendo que te sientes frustrada por el cambio repentino en el horario de las fiestas. Es natural sentirse así cuando los planes se alteran.
                <p className="mt-2">¿Hay algún arreglo específico que te daría más tranquilidad para la Nochebuena?</p>
              </div>
              <span className="text-[8px] text-brand-muted pl-1 mt-0.5">19:42</span>
            </div>
          </div>

          {/* User Marta Message */}
          <div className="flex items-start justify-end gap-3">
            <div className="flex flex-col gap-1 max-w-[80%] items-end">
              <div className="bg-[#EAEAE6] text-brand-text rounded-2xl rounded-tr-none px-4 py-3.5 text-xs leading-relaxed border border-brand-border/60 shadow-sm text-justify">
                Solo quiero tenerlos en Nochebuena. Él siempre se lleva ese día y dice que es &quot;justo&quot; porque yo tengo Año Nuevo, pero para mí la Navidad es más importante. No quiero pelear, pero estoy cansada de ceder siempre.
              </div>
              <span className="text-[8px] text-brand-muted pr-1 mt-0.5">19:45 • Leído</span>
            </div>
          </div>

          {/* Mediador IA Message 2 */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#163B30] flex items-center justify-center text-white shrink-0 border border-[#235848]">
              <span className="text-[10px] font-bold">🤖</span>
            </div>
            
            <div className="flex flex-col gap-1 max-w-[85%]">
              <span className="text-[8px] font-bold text-brand-muted uppercase tracking-wider pl-1">
                Mediador IA
              </span>
              <div className="bg-[#163B30] text-white rounded-2xl rounded-tl-none px-4 py-3.5 text-xs leading-relaxed border border-[#1d4c3f] shadow-sm">
                Esa es una petición muy razonable. Establecer una rotación o un acuerdo fijo para Nochebuena podría eliminar este conflicto en el futuro.
              </div>
              <span className="text-[8px] text-brand-muted pl-1 mt-0.5">19:45</span>
            </div>
          </div>

          {/* Suggested Action Card (screen.png) */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            onClick={() => {
              alert("Propuesta de Custodia de Navidad añadida a borradores. Se puede afinar en el Asistente.");
              router.push("/asistente-propuestas");
            }}
            className="bg-white border border-brand-gold rounded-xl p-3.5 shadow-sm flex items-center justify-between cursor-pointer max-w-[95%] ml-10 border-l-4 border-l-brand-gold mt-2 hover:bg-[#FDFDFD]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0">
                <PenSquare size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-brand-muted tracking-widest uppercase font-sans">
                  ACCIÓN SUGERIDA
                </span>
                <span className="font-serif font-bold text-xs text-brand-green leading-snug">
                  Redactar Propuesta: Custodia Navidad
                </span>
              </div>
            </div>
            <ArrowRight size={14} className="text-brand-gold" />
          </motion.div>

        </div>

      </div>

      {/* Bottom Message Input with Sellar Button (screen.png) */}
      <div className="p-4 bg-white border-t border-brand-border/60 shrink-0">
        <div className="flex items-center gap-3">
          
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Escribe libremente... (Encriptado)"
            className="flex-1 bg-[#F3F4F0] border border-brand-border focus:border-brand-gold focus:outline-none rounded-xl py-3.5 px-4 text-xs text-brand-text placeholder-brand-muted/70 transition"
          />

          {chatPrivadoSelled ? (
            <div className="bg-emerald-600 text-white rounded-xl py-3 px-3.5 flex items-center justify-center border border-emerald-700 shadow-sm shrink-0 text-xs font-bold gap-1">
              <Check size={14} strokeWidth={3} />
              <span>SELLADO</span>
            </div>
          ) : (
            <button
              onClick={handleSellar}
              className="bg-[#163B30] hover:bg-[#1d4c3f] text-brand-gold border border-brand-gold/40 rounded-xl py-3 px-3.5 flex flex-col items-center justify-center shadow-sm shrink-0 transition"
              title="Sellar y guardar encriptado en la bóveda"
            >
              <Lock size={14} className="text-brand-gold" />
              <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5 text-brand-gold">SELLAR</span>
            </button>
          )}

        </div>
      </div>
      
    </div>
  );
}
