"use client";

import { ChevronLeft, MoreVertical, Sparkles, Lock, ArrowUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AssistantPage() {
  const [inputText, setInputText] = useState("");

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col font-sans relative">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <Link href="/dashboard/vault" className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-lg text-slate-600 hover:text-brand-green">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="text-center flex-1">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-1">Bóveda Privada</div>
          <h1 className="text-xl font-serif font-bold text-brand-green">Asistente de Propuestas</h1>
          <div className="text-[10px] uppercase tracking-[0.1em] text-brand-gold font-bold">Borrador de Negociación</div>
        </div>
        <button className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-lg text-slate-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 p-4 overflow-y-auto pb-24 space-y-6">
        <div className="flex items-center justify-center gap-4 my-4">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Hoy, 10:42 AM</span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        {/* User Message */}
        <div className="flex justify-end">
          <div className="bg-brand-green text-white p-5 rounded-3xl rounded-tr-sm max-w-[85%] shadow-sm font-light leading-relaxed text-sm">
            He pensado en solicitar 500€ de pensión compensatoria. Dejé mi carrera durante 5 años para cuidar de los niños y creo que es justo.
          </div>
        </div>

        {/* AI Suggestion Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden ml-4 mr-1">
          <div className="bg-brand-green p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-white font-medium">Sugerencia Legal (IA)</h3>
              <p className="text-[10px] uppercase tracking-wider text-brand-gold font-bold">Análisis de Viabilidad</p>
            </div>
          </div>
          <div className="p-5">
            <blockquote className="border-l-2 border-brand-gold pl-4 text-brand-green italic text-sm leading-relaxed mb-4">
              "Conforme al Art. 97 del Código Civil y dada la disparidad de ingresos demostrada (15%), una propuesta inicial de 500€ podría generar alta fricción y rechazo por la otra parte. Se recomienda plantear una pensión de 350€ con carácter temporal por 24 meses para facilitar el reequilibrio económico y aumentar las probabilidades de consenso."
            </blockquote>
            <p className="text-right text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-6">
              — Jurisprudencia: SAP Madrid 2023
            </p>

            <div className="space-y-3">
              <Button className="w-full bg-brand-green hover:bg-brand-green-light text-white text-xs font-bold tracking-wider h-12">
                ACEPTAR PARA EL CUESTIONARIO <ChevronLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
              <Button variant="outline" className="w-full text-brand-green border-slate-200 text-xs font-bold tracking-wider h-12">
                <Sparkles className="w-4 h-4 mr-2" /> REFINAR CON IA
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-20 pb-safe">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Escribe tu propuesta o duda legal..." 
              className="w-full bg-brand-cream border border-slate-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <button className="w-14 h-14 bg-brand-green rounded-xl flex items-center justify-center text-white shrink-0 hover:bg-brand-green-light transition-colors">
            {inputText.length > 0 ? (
              <ArrowUp className="w-6 h-6" />
            ) : (
              <Lock className="w-6 h-6 text-brand-gold" />
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
