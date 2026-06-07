"use client";

import React, { useState } from "react";
import { useSimulation } from "@/context/SimulationContext";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  HelpCircle,
  Home,
  Flag,
  ArrowRight,
  Check,
  Baby,
  Scale,
  CreditCard,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CuestionarioBasicoFormPage() {
  const { submitBasicForm, basicSubmitted } = useSimulation();
  const router = useRouter();

  // Matrimonial & Legal Situational Questions (start collapsed)
  const [hijos, setHijos] = useState<"no" | "menores" | "mayores">("no");
  const [numHijos, setNumHijos] = useState<1 | 2 | 3>(2);
  const [edadesHijos, setEdadesHijos] = useState<string[]>(["4 años", "7 años", ""]);
  
  const [vivienda, setVivienda] = useState<"alquiler" | "propiedad-hipoteca" | "multipropiedad">("alquiler");
  const [regimen, setRegimen] = useState<"gananciales" | "separacion" | "nose">("gananciales");
  const [deudas, setDeudas] = useState<"no" | "hipoteca" | "otros">("no");
  const [cuotaHipoteca, setCuotaHipoteca] = useState("680€");
  
  const [objectives, setObjectives] = useState(
    "Alcanzar un acuerdo justo para la custodia compartida de nuestros hijos y definir el reparto del coche familiar y la vivienda habitual de manera equitativa."
  );

  // Dynamic progress calculation (5 key fields)
  let completedFields = 0;
  if (hijos) completedFields++;
  if (vivienda) completedFields++;
  if (regimen) completedFields++;
  if (deudas) completedFields++;
  if (objectives && objectives.trim().length > 0) completedFields++;
  const progressPercent = basicSubmitted ? 100 : Math.round((completedFields / 5) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitBasicForm(hijos, vivienda);
    router.push("/boveda");
  };

  return (
    <div className="flex flex-col px-6 py-4 select-none relative bg-brand-bg min-h-full">
      
      {/* Header bar */}
      <div className="flex justify-between items-center py-2 border-b border-brand-border/30 bg-brand-bg">
        <button
          type="button"
          onClick={() => router.push("/boveda")}
          className="w-8 h-8 rounded-full hover:bg-brand-border/40 flex items-center justify-center text-brand-green"
        >
          <ChevronLeft size={20} />
        </button>
        
        <span className="text-[10px] font-bold text-brand-gold tracking-[0.2em] uppercase font-sans">
          CUESTIONARIO BÁSICO
        </span>

        <button 
          type="button"
          onClick={() => alert("Ayuda sobre el cuestionario básico")}
          className="w-8 h-8 rounded-full hover:bg-brand-border/40 flex items-center justify-center text-brand-muted"
        >
          <HelpCircle size={18} />
        </button>
      </div>

      {/* Main Title & Progress */}
      <div className="mt-4 flex flex-col gap-3">
        <h2 className="font-serif text-2xl font-bold text-brand-green">
          Perfil Familiar y Patrimonial
        </h2>
        
        {/* Progress Bar Container */}
        <div className="flex flex-col gap-2 bg-white/20 p-3 rounded-2xl border border-brand-border/45">
          <div className="flex justify-between items-center text-[10px] font-semibold text-brand-green/80">
            <span>Diagnóstico Inicial</span>
            <span className="bg-[#B5944E]/10 text-brand-gold px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px]">
              {basicSubmitted ? "FINALIZADO" : `${progressPercent}% completado`}
            </span>
          </div>
          <div className="w-full bg-[#E3E3DE] h-1.5 rounded-full overflow-hidden">
            <div className="bg-brand-gold h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {basicSubmitted && (
        <div className="mt-4 bg-emerald-500/10 border border-emerald-500/25 p-3.5 rounded-xl flex gap-2.5 text-[10px] leading-relaxed text-emerald-800 text-left animate-in fade-in">
          <Check className="text-emerald-600 shrink-0 mt-0.5" size={14} strokeWidth={3} />
          <div>
            <strong className="text-brand-green font-semibold block mb-0.5">Cuestionario Finalizado y Sellado</strong>
            Tus respuestas han sido procesadas de forma segura y confidencial por la IA. Se encuentran guardadas en modo lectura.
          </div>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6 pb-8">
        
        <p className="text-xs text-brand-muted leading-relaxed font-light -mt-2">
          Responde a estas breves preguntas sobre vuestro patrimonio y familia. La IA mediadora adaptará las propuestas a tu situación particular.
        </p>

        {/* 1. Hijos en común */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[10px] font-bold text-brand-green tracking-wider uppercase flex items-center gap-1.5">
            <Baby size={13} className="text-brand-gold" />
            ¿Tenéis hijos en común?
          </label>
          
          <div className="grid grid-cols-3 gap-2">
            {/* No hijos */}
            <button
              type="button"
              disabled={basicSubmitted}
              onClick={() => {
                setHijos("no");
              }}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 relative transition text-center cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed ${
                hijos === "no"
                  ? "bg-[#F3EFE6] border-brand-gold text-brand-green font-semibold"
                  : "bg-white border-brand-border text-brand-muted"
              }`}
            >
              <span className="text-xs font-medium">No, sin hijos</span>
            </button>

            {/* Hijos menores */}
            <button
              type="button"
              disabled={basicSubmitted}
              onClick={() => {
                setHijos("menores");
              }}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 relative transition text-center cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed ${
                hijos === "menores"
                  ? "bg-[#F3EFE6] border-brand-gold text-brand-green font-semibold"
                  : "bg-white border-brand-border text-brand-muted"
              }`}
            >
              {hijos === "menores" && (
                <div className="absolute top-1 right-1 bg-brand-gold text-brand-green rounded-full p-0.5">
                  <Check size={8} strokeWidth={3.5} />
                </div>
              )}
              <span className="text-xs font-medium">Menores de edad</span>
            </button>

            {/* Hijos mayores */}
            <button
              type="button"
              disabled={basicSubmitted}
              onClick={() => {
                setHijos("mayores");
              }}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 relative transition text-center cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed ${
                hijos === "mayores"
                  ? "bg-[#F3EFE6] border-brand-gold text-brand-green font-semibold"
                  : "bg-white border-brand-border text-brand-muted"
              }`}
            >
              <span className="text-xs font-medium">Mayores / Emancipados</span>
            </button>
          </div>

          <AnimatePresence>
            {hijos === "menores" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-3 bg-brand-gold/5 p-4 rounded-2xl border border-brand-gold/25 mt-2 text-left"
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-brand-green/80 tracking-wider uppercase font-sans">
                    ¿Cuántos hijos menores tenéis?
                  </label>
                  <div className="flex gap-2">
                    {([1, 2, 3] as const).map((num) => (
                      <button
                        key={num}
                        type="button"
                        disabled={basicSubmitted}
                        onClick={() => setNumHijos(num)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer disabled:opacity-85 disabled:cursor-not-allowed ${
                          numHijos === num
                            ? "bg-[#13382C] text-brand-gold border-brand-gold"
                            : "bg-white text-brand-muted border-brand-border"
                        }`}
                      >
                        {num === 3 ? "3 o más" : num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-1">
                  {Array.from({ length: numHijos }).map((_, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <label className="text-[8px] font-bold text-brand-green/75 tracking-wider uppercase font-sans">
                        Edad de Hijo {idx + 1}
                      </label>
                      <input
                        type="text"
                        disabled={basicSubmitted}
                        value={edadesHijos[idx] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEdadesHijos((prev) => {
                            const copy = [...prev];
                            copy[idx] = val;
                            return copy;
                          });
                        }}
                        placeholder={`Ej. ${idx === 0 ? "4" : idx === 1 ? "7" : "10"} años`}
                        className="w-full bg-white border border-brand-border focus:border-brand-gold focus:outline-none rounded-xl py-2 px-3 text-xs text-brand-text placeholder-brand-muted/70 transition disabled:bg-neutral-50 disabled:text-brand-muted"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. Vivienda Familiar */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[10px] font-bold text-brand-green tracking-wider uppercase flex items-center gap-1.5">
            <Home size={13} className="text-brand-gold" />
            ¿Qué tipo de vivienda compartís?
          </label>
          
          <div className="flex flex-col gap-2">
            {/* Alquiler */}
            <button
              type="button"
              disabled={basicSubmitted}
              onClick={() => setVivienda("alquiler")}
              className={`p-3 px-4 rounded-xl border flex items-center justify-between transition cursor-pointer text-left disabled:opacity-85 disabled:cursor-not-allowed ${
                vivienda === "alquiler"
                  ? "bg-[#F3EFE6] border-brand-gold text-brand-green font-semibold"
                  : "bg-white border-brand-border text-brand-muted"
              }`}
            >
              <span className="text-xs">Vivienda de Alquiler</span>
              {vivienda === "alquiler" && <Check size={12} className="text-brand-gold" />}
            </button>

            {/* Propiedad con Hipoteca */}
            <button
              type="button"
              disabled={basicSubmitted}
              onClick={() => setVivienda("propiedad-hipoteca")}
              className={`p-3 px-4 rounded-xl border flex items-center justify-between transition cursor-pointer text-left disabled:opacity-85 disabled:cursor-not-allowed ${
                vivienda === "propiedad-hipoteca"
                  ? "bg-[#F3EFE6] border-brand-gold text-brand-green font-semibold"
                  : "bg-white border-brand-border text-brand-muted"
              }`}
            >
              <span className="text-xs">Vivienda en Propiedad (con hipoteca)</span>
              {vivienda === "propiedad-hipoteca" && <Check size={12} className="text-brand-gold" />}
            </button>

            {/* Multipropiedad */}
            <button
              type="button"
              disabled={basicSubmitted}
              onClick={() => setVivienda("multipropiedad")}
              className={`p-3 px-4 rounded-xl border flex items-center justify-between transition cursor-pointer text-left disabled:opacity-85 disabled:cursor-not-allowed ${
                vivienda === "multipropiedad"
                  ? "bg-[#F3EFE6] border-brand-gold text-brand-green font-semibold"
                  : "bg-white border-brand-border text-brand-muted"
              }`}
            >
              <span className="text-xs">Segundas residencias u otras propiedades</span>
              {vivienda === "multipropiedad" && <Check size={12} className="text-brand-gold" />}
            </button>
          </div>
        </div>

        {/* 3. Régimen Económico Matrimonial */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[10px] font-bold text-brand-green tracking-wider uppercase flex items-center gap-1.5">
            <Scale size={13} className="text-brand-gold" />
            Régimen económico matrimonial
          </label>
          
          <div className="grid grid-cols-3 gap-2">
            {/* Gananciales */}
            <button
              type="button"
              disabled={basicSubmitted}
              onClick={() => setRegimen("gananciales")}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition text-center cursor-pointer disabled:opacity-85 disabled:cursor-not-allowed ${
                regimen === "gananciales"
                  ? "bg-[#F3EFE6] border-brand-gold text-brand-green font-semibold"
                  : "bg-white border-brand-border text-brand-muted"
              }`}
            >
              <span className="text-xs font-medium">Gananciales</span>
            </button>

            {/* Separación */}
            <button
              type="button"
              disabled={basicSubmitted}
              onClick={() => setRegimen("separacion")}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition text-center cursor-pointer disabled:opacity-85 disabled:cursor-not-allowed ${
                regimen === "separacion"
                  ? "bg-[#F3EFE6] border-brand-gold text-brand-green font-semibold"
                  : "bg-white border-brand-border text-brand-muted"
              }`}
            >
              <span className="text-xs font-medium">Separación de Bienes</span>
            </button>

            {/* No sabe */}
            <button
              type="button"
              disabled={basicSubmitted}
              onClick={() => setRegimen("nose")}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition text-center cursor-pointer disabled:opacity-85 disabled:cursor-not-allowed ${
                regimen === "nose"
                  ? "bg-[#F3EFE6] border-brand-gold text-brand-green font-semibold"
                  : "bg-white border-brand-border text-brand-muted"
              }`}
            >
              <span className="text-xs font-medium">No aplica / No lo sé</span>
            </button>
          </div>
        </div>

        {/* 4. Deudas y Préstamos */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[10px] font-bold text-brand-green tracking-wider uppercase flex items-center gap-1.5">
            <CreditCard size={13} className="text-brand-gold" />
            ¿Existen deudas o hipotecas conjuntas?
          </label>
          
          <div className="grid grid-cols-3 gap-2">
            {/* Sin deudas */}
            <button
              type="button"
              disabled={basicSubmitted}
              onClick={() => setDeudas("no")}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition text-center cursor-pointer disabled:opacity-85 disabled:cursor-not-allowed ${
                deudas === "no"
                  ? "bg-[#F3EFE6] border-brand-gold text-brand-green font-semibold"
                  : "bg-white border-brand-border text-brand-muted"
              }`}
            >
              <span className="text-xs font-medium">Sin deudas</span>
            </button>

            {/* Hipoteca */}
            <button
              type="button"
              disabled={basicSubmitted}
              onClick={() => setDeudas("hipoteca")}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition text-center cursor-pointer disabled:opacity-85 disabled:cursor-not-allowed ${
                deudas === "hipoteca"
                  ? "bg-[#F3EFE6] border-brand-gold text-brand-green font-semibold"
                  : "bg-white border-brand-border text-brand-muted"
              }`}
            >
              <span className="text-xs font-medium">Hipoteca Común</span>
            </button>

            {/* Otros préstamos */}
            <button
              type="button"
              disabled={basicSubmitted}
              onClick={() => setDeudas("otros")}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition text-center cursor-pointer disabled:opacity-85 disabled:cursor-not-allowed ${
                deudas === "otros"
                  ? "bg-[#F3EFE6] border-brand-gold text-brand-green font-semibold"
                  : "bg-white border-brand-border text-brand-muted"
              }`}
            >
              <span className="text-xs font-medium">Otros Préstamos</span>
            </button>
          </div>

          <AnimatePresence>
            {(vivienda === "propiedad-hipoteca" || deudas === "hipoteca") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-1.5 bg-brand-gold/5 p-4 rounded-2xl border border-brand-gold/25 mt-2 text-left animate-in fade-in"
              >
                <label className="text-[9px] font-bold text-brand-green/80 tracking-wider uppercase font-sans">
                  Cuota mensual de la hipoteca (€)
                </label>
                <input
                  type="text"
                  disabled={basicSubmitted}
                  value={cuotaHipoteca}
                  onChange={(e) => setCuotaHipoteca(e.target.value)}
                  placeholder="Ej. 680€"
                  className="w-full bg-white border border-brand-border focus:border-brand-gold focus:outline-none rounded-xl py-2.5 px-3 text-xs text-brand-text placeholder-brand-muted/70 transition disabled:bg-neutral-50 disabled:text-brand-muted"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 5. Objetivos */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-brand-green tracking-wider uppercase flex items-center gap-1.5">
            <Flag size={12} className="text-brand-gold" />
            OBJETIVOS DE LA MEDIACIÓN
          </label>
          <textarea
            value={objectives}
            disabled={basicSubmitted}
            onChange={(e) => setObjectives(e.target.value)}
            placeholder="¿Qué espera lograr con este proceso?"
            rows={4}
            className="w-full bg-white border border-brand-border focus:border-brand-gold focus:outline-none rounded-2xl py-3.5 px-4 text-xs text-brand-text placeholder-brand-muted/70 transition resize-none leading-relaxed disabled:bg-neutral-50 disabled:text-brand-muted"
          />
        </div>

        {/* Submit button */}
        {basicSubmitted ? (
          <button
            type="button"
            disabled
            className="w-full bg-[#1C2A25] text-white/30 border border-white/5 font-bold py-4 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-not-allowed mt-2 shadow-inner"
          >
            <Lock size={12} className="text-white/20" />
            <span className="font-serif text-sm">Cuestionario Sellado en Bóveda</span>
          </button>
        ) : (
          <button
            type="submit"
            className="w-full bg-brand-green hover:bg-brand-green/95 text-white font-bold py-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition duration-200 mt-2 shadow-md group cursor-pointer"
          >
            <span className="font-serif text-sm">Guardar y Continuar</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
          </button>
        )}

      </form>
      
    </div>
  );
}
