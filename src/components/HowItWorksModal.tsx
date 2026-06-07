"use client";

import React from "react";
import { HelpCircle, Lock, Scale, FileText, X, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  const steps = [
    {
      num: "1",
      title: "Cuestionario Inicial",
      desc: "Responderás a preguntas básicas e individuales sobre tu situación familiar, patrimonio y necesidades.",
      icon: HelpCircle
    },
    {
      num: "2",
      title: "Bóveda Privada (100% Confidencial)",
      desc: "Escribirás en tu diario personal tus inquietudes. Tu expareja jamás podrá leer lo que escribas ni tus respuestas.",
      icon: Lock,
      highlight: "Privacidad absoluta protegida por cifrado."
    },
    {
      num: "3",
      title: "Propuestas de Consenso",
      desc: "Nuestra IA analiza ambos diarios buscando puntos de coincidencia y redacta propuestas de mutuo acuerdo neutrales, eliminando la tensión emocional.",
      icon: Scale
    },
    {
      num: "4",
      title: "Firma y Ratificación",
      desc: "Cuando estéis de acuerdo en todo, firmáis el borrador digitalmente y nuestros abogados colegiados lo tramitan en el Juzgado.",
      icon: FileText
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#0E1E1A]/85 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-brand-bg rounded-3xl p-6 border border-brand-gold/30 z-10 flex flex-col gap-4 max-w-sm w-full relative text-left text-brand-green max-h-[90%] overflow-y-auto no-scrollbar"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-6 h-6 rounded-full hover:bg-neutral-100 flex items-center justify-center text-brand-muted hover:text-brand-green cursor-pointer"
            >
              <X size={14} />
            </button>

            {/* Header */}
            <div className="flex flex-col gap-1 pr-4">
              <span className="text-[8.5px] font-bold text-brand-gold tracking-[0.25em] uppercase font-sans">
                ¿CÓMO TRABAJAMOS?
              </span>
              <h3 className="font-serif text-lg font-bold text-brand-green leading-snug">
                El Proceso de Mediación
              </h3>
              <p className="text-[10px] text-brand-muted leading-relaxed font-light">
                MedIAdor es un espacio neutral diseñado para alcanzar convenios reguladores justos evitando el desgaste judicial.
              </p>
            </div>

            {/* Steps Timeline */}
            <div className="flex flex-col gap-4.5 mt-2">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex gap-3 items-start relative">
                    {/* Line connecting steps */}
                    {idx < steps.length - 1 && (
                      <div className="absolute left-4.5 top-9 bottom-[-18px] w-[1px] bg-brand-border/60" />
                    )}

                    {/* Step badge */}
                    <div className="w-9 h-9 rounded-full bg-brand-green/5 border border-brand-border flex items-center justify-center text-brand-green shrink-0 relative z-10">
                      <Icon size={15} className="text-brand-green" />
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-gold text-[#0E1E1A] rounded-full text-[8.5px] font-bold flex items-center justify-center font-sans border border-brand-bg shadow-sm">
                        {step.num}
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <h4 className="font-serif text-xs font-bold text-brand-green leading-snug">
                        {step.title}
                      </h4>
                      <p className="text-[9.5px] text-brand-muted leading-relaxed font-light text-justify">
                        {step.desc}
                      </p>
                      {step.highlight && (
                        <span className="text-[8px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 mt-1 w-fit font-sans">
                          {step.highlight}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Impartiality Stamp */}
            <div className="bg-[#163B30] text-white border border-[#235848] rounded-xl p-3 flex gap-2.5 text-[9.5px] leading-relaxed mt-1">
              <ShieldCheck className="text-brand-gold shrink-0 mt-0.5" size={14} />
              <p className="font-light">
                <strong>Imparcialidad Absoluta:</strong> La IA actúa como facilitador ciego y neutral. En ningún caso revelará vuestras confidencias ni se pondrá a favor de ninguno de los dos.
              </p>
            </div>

            {/* Focus on Agreements / Consensus Card */}
            <div className="bg-[#FAF7EF] text-brand-green border border-brand-gold/30 rounded-xl p-3 flex gap-2.5 text-[9.5px] leading-relaxed mt-1 shadow-sm">
              <Sparkles className="text-brand-gold shrink-0 mt-0.5 animate-pulse" size={14} />
              <p className="font-light text-justify">
                <strong>Enfoque en los Puntos de Encuentro:</strong> Es natural pensar que hay muchas cosas en las que no estaréis de acuerdo. Sin embargo, este programa os ayudará a poner sobre la mesa todo aquello en lo que <strong>sí</strong> estáis de acuerdo. Esto os dará una mejor perspectiva del trámite y os demostrará lo poco que realmente os diferencia.
              </p>
            </div>

            {/* Understand Button */}
            <button
              onClick={onClose}
              className="w-full bg-brand-gold hover:bg-brand-gold-hover text-[#0E1E1A] font-bold py-3 rounded-xl text-[10px] tracking-wider transition uppercase font-serif mt-2 shadow-sm cursor-pointer"
            >
              Entendido
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
