"use client";

import React, { useState } from "react";
import { useSimulation } from "@/context/SimulationContext";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  MoreVertical,
  Sparkles,
  ArrowUp,
  Sliders,
  Check,
  Bot,
  User,
  ArrowRight,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AsistentePropuestasPage() {
  const { proposalAccepted, acceptProposal, partnerName } = useSimulation();
  const router = useRouter();
  
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ia"; text: string; subText?: string; isSuggestion?: boolean }>>([
    {
      sender: "user",
      text: "He pensado en solicitar 500€ de pensión compensatoria. Dejé mi carrera durante 5 años para cuidar de los niños y creo que es justo."
    },
    {
      sender: "ia",
      isSuggestion: true,
      text: '"Conforme al Art. 97 del Código Civil y dada la disparidad de ingresos demostrada (15%), una propuesta inicial de 500€ podría generar alta fricción y rechazo por la otra parte. Se recomienda plantear una pensión de 350€ con carácter temporal por 24 meses para facilitar el reequilibrio económico y aumentar las probabilidades de consenso."',
      subText: "— JURISPRUDENCIA: SAP MADRID 2023"
    }
  ]);
  
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = inputVal;
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setInputVal("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      
      let aiText = "He analizado tu propuesta. Jurídicamente, entra dentro de los límites habituales en España. ¿Te gustaría redactarla de forma neutral para enviársela a tu ex-pareja?";
      let aiSubText = "— CÓDIGO CIVIL ESPAÑOL";
      
      if (userMsg.toLowerCase().includes("custodia")) {
        aiText = '"En la jurisprudencia española actual, la custodia compartida es el régimen preferente. Para custodias alternas semanales, se recomienda detallar las entregas los domingos por la tarde para evitar interrumpir la jornada escolar del lunes."';
        aiSubText = "— GUÍA CGPJ CUSTODIA COMPARTIDA 2024";
      } else if (userMsg.toLowerCase().includes("casa") || userMsg.toLowerCase().includes("piso") || userMsg.toLowerCase().includes("vivienda")) {
        aiText = '"El uso de la vivienda familiar suele atribuirse al cónyuge con quien queden los hijos menores. En custodia compartida, si el inmueble es ganancial, la tendencia es establecer un uso temporal limitado (ej. 1 a 2 años) antes de su liquidación."';
        aiSubText = "— SENTENCIA TS 418/2023";
      }

      setMessages(prev => [
        ...prev,
        {
          sender: "ia",
          text: aiText,
          subText: aiSubText,
          isSuggestion: true
        }
      ]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-brand-bg select-none relative">
      
      {/* Top Header bar (Screenshot 4) */}
      <div className="flex justify-between items-center px-6 py-3 border-b border-brand-border/30 bg-white shrink-0">
        <button
          onClick={() => router.push("/boveda")}
          className="w-8 h-8 rounded-full hover:bg-brand-border/40 flex items-center justify-center text-brand-green"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <span className="text-[9px] font-bold text-brand-gold tracking-[0.2em] uppercase font-sans">
            BÓVEDA PRIVADA
          </span>
          <h2 className="font-serif text-base font-bold text-[#13382c]">
            Asistente de Propuestas
          </h2>
          <span className="text-[8px] font-bold text-brand-gold tracking-widest uppercase">
            BORRADOR DE NEGOCIACIÓN
          </span>
        </div>

        <button className="w-8 h-8 rounded-full hover:bg-brand-border/40 flex items-center justify-center text-brand-muted">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-6">
        
        {/* Date Stamp Separator */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-[1px] bg-brand-border/60 flex-1" />
          <span className="text-[9px] font-bold text-brand-muted tracking-[0.2em] uppercase font-sans">
            HOY, 10:42 AM
          </span>
          <div className="h-[1px] bg-brand-border/60 flex-1" />
        </div>

        {/* Message Thread */}
        <div className="flex flex-col gap-6">
          {messages.map((msg, idx) => {
            if (msg.sender === "user") {
              return (
                <div key={idx} className="flex justify-end items-start gap-2.5">
                  <div className="bg-[#163B30] text-white rounded-2xl rounded-tr-none px-4 py-3 text-xs leading-relaxed max-w-[85%] shadow-sm border border-[#1d4c3f]">
                    {msg.text}
                  </div>
                  <div className="w-7 h-7 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold border border-brand-gold/20 shrink-0">
                    <User size={12} />
                  </div>
                </div>
              );
            }

            // Otherwise, AI Suggestion Card (Screenshot 4)
            return (
              <div key={idx} className="flex flex-col gap-3 max-w-[95%]">
                
                {/* Proposal card block */}
                <div className="bg-white border border-brand-border rounded-2xl shadow-md overflow-hidden">
                  
                  {/* Card AI Header */}
                  <div className="bg-[#163B30] px-4 py-2.5 flex items-center gap-2 text-white border-b border-brand-border/20">
                    <div className="w-5 h-5 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold border border-brand-gold/20">
                      <Sparkles size={10} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-serif text-xs font-bold text-white leading-none">
                        Sugerencia Legal (IA)
                      </span>
                      <span className="text-[8px] text-brand-gold font-bold tracking-widest uppercase leading-none mt-1">
                        ANÁLISIS DE VIABILIDAD
                      </span>
                    </div>
                  </div>

                  {/* Card Content & Quote */}
                  <div className="p-4 flex flex-col gap-3 bg-[#FBFBFA]/50">
                    <div className="border-l-2 border-brand-gold pl-3 py-1 text-xs text-brand-text leading-relaxed font-serif italic text-justify">
                      {msg.text}
                    </div>

                    {msg.subText && (
                      <span className="text-[9px] font-bold text-brand-muted tracking-wider uppercase font-sans mt-0.5 text-right block pr-1">
                        {msg.subText}
                      </span>
                    )}

                    {/* Conditional Action Buttons (only show for the interactive 500€ compensation proposal suggestion) */}
                    {msg.isSuggestion && idx === 1 && (
                      <div className="flex flex-col gap-2 mt-2">
                        {proposalAccepted ? (
                          <div className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-xs font-bold">
                            <Check size={14} strokeWidth={3} />
                            PROPUESTA ACEPTADA (350€ / 24 Meses)
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                acceptProposal();
                              }}
                              className="w-full bg-brand-green hover:bg-brand-green/95 text-brand-gold font-bold py-3 rounded-xl text-[10px] tracking-wider transition duration-150 flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <span>ACEPTAR PARA EL CUESTIONARIO</span>
                              <ArrowRight size={12} className="text-brand-gold" />
                            </button>

                            <button
                              type="button"
                              onClick={() => alert("Refinando con IA: Puedes escribir tu comentario en el chat inferior.")}
                              className="w-full bg-white hover:bg-brand-bg border border-brand-border text-brand-green font-bold py-2.5 rounded-xl text-[10px] tracking-wider transition duration-150 flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <Sliders size={12} className="text-brand-gold" />
                              <span>REFINAR CON IA</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 max-w-[80%]">
              <div className="w-6 h-6 rounded-full bg-brand-green/5 border border-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
                <Bot size={12} />
              </div>
              <div className="bg-[#EAEAE6]/50 rounded-2xl px-4 py-2.5 text-xs text-brand-muted flex items-center gap-1 border border-brand-border">
                <span className="w-1.5 h-1.5 bg-brand-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-brand-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-brand-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Message Input Panel (Screenshot 4) */}
      <div className="p-4 bg-white border-t border-brand-border/60 shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Escribe tu propuesta o duda legal..."
            className="w-full bg-[#F3F4F0] border border-brand-border focus:border-brand-gold focus:outline-none rounded-xl py-3 pl-4 pr-12 text-xs text-brand-text placeholder-brand-muted/70 transition"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="absolute right-2 top-2 w-8 h-8 rounded-lg bg-brand-green hover:bg-brand-green/90 text-brand-gold flex items-center justify-center transition shadow-sm disabled:bg-neutral-300 disabled:text-neutral-500"
          >
            <ArrowUp size={16} strokeWidth={2.5} />
          </button>
        </form>
      </div>
      
    </div>
  );
}
