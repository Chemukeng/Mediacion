"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSimulation } from "@/context/SimulationContext";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  FolderOpen,
  ArrowRight,
  Download,
  Home,
  Briefcase,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function FinalizadoPage() {
  const router = useRouter();
  const { partnerName, userName, paymentOption, hijos, vivienda } = useSimulation();

  const hasChildren = hijos !== "no";
  const hasProperties = vivienda !== "alquiler";
  const totalCost = (hasChildren || hasProperties) ? 800 : 500;
  const paidCost = paymentOption === "50" ? totalCost / 2 : totalCost;

  return (
    <div className="flex flex-col px-6 py-4 select-none bg-brand-bg min-h-full justify-between gap-5 animate-in fade-in duration-300">
      
      {/* Header bar */}
      <div className="w-full flex justify-between items-center py-2 border-b border-brand-border/30 bg-brand-bg shrink-0">
        <div className="flex items-center gap-1">
          <ShieldCheck size={18} className="text-brand-gold" />
          <h2 className="font-serif text-xs font-bold text-[#13382c] tracking-wider uppercase">
            MedIAdor Legal
          </h2>
        </div>
        
        <span className="text-[8px] bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
          Trámite Iniciado
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-5 py-2">
        {/* Connection Success Shield */}
        <div className="flex flex-col items-center text-center gap-2 mt-2 shrink-0">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-sm">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-brand-green">
              ¡Expediente en Trámite!
            </h3>
            <p className="text-[10px] text-brand-muted uppercase tracking-wider font-semibold mt-0.5">
              Tus acuerdos se han enviado a nuestros abogados asociados
            </p>
          </div>
        </div>

        {/* Process Timeline */}
        <div className="bg-white border border-brand-border rounded-3xl p-5 shadow-sm flex flex-col gap-4">
          <span className="text-[9px] font-bold text-brand-gold tracking-[0.2em] uppercase font-sans">
            ESTADO DEL EXPEDIENTE
          </span>
          
          <div className="flex flex-col gap-3 font-sans">
            {/* Step 1 */}
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={12} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-brand-green leading-snug">
                  1. Firma del Convenio Regulador
                </span>
                <span className="text-[9.5px] text-brand-muted">
                  Completado y firmado por {userName} y {partnerName}.
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={12} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-brand-green leading-snug">
                  2. Liquidación de Honorarios y Tasas
                </span>
                <span className="text-[9.5px] text-brand-muted">
                  Pago del {paymentOption === "50" ? `50% (${paidCost}€)` : `100% (${paidCost}€)`} completado con éxito.
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#B5944E]/10 text-brand-gold border border-[#B5944E]/30 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                <Clock size={12} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-brand-green leading-snug flex items-center gap-1.5">
                  3. Asignación de Letrado Colegiado
                  <span className="w-1.5 h-1.5 bg-brand-gold rounded-full inline-block animate-ping" />
                </span>
                <span className="text-[9.5px] text-brand-muted font-medium">
                  En progreso. Tu expediente está siendo asignado a un abogado experto.
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3 opacity-40">
              <div className="w-5 h-5 rounded-full border border-brand-border bg-brand-bg flex items-center justify-center shrink-0 mt-0.5">
                <Briefcase size={10} className="text-brand-muted" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-brand-green leading-snug">
                  4. Redacción Jurídica y Visado
                </span>
                <span className="text-[9.5px] text-brand-muted">
                  Formalización del convenio homologable ante el Juzgado.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Important next steps box */}
        <div className="bg-[#EAEAE6]/50 border border-brand-border rounded-3xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <AlertCircle size={15} className="text-brand-gold shrink-0" />
            <span className="text-[9px] font-bold text-[#13382c] tracking-wider uppercase font-sans">
              INFORMACIÓN IMPORTANTE
            </span>
          </div>

          <div className="text-xs text-brand-muted leading-relaxed font-light flex flex-col gap-2">
            <p>
              📧 Un letrado de nuestro bufete asociado se pondrá en contacto contigo por teléfono o email en un plazo de <strong className="text-brand-green font-semibold">24 a 48 horas laborables</strong>.
            </p>
            <p>
              📂 Para agilizar el proceso de ratificación judicial, os recomendamos ir recopilando la siguiente documentación:
            </p>
            <ul className="list-disc pl-4 text-[10.5px] flex flex-col gap-1 text-brand-green">
              <li>Libro de Familia original.</li>
              <li>Certificado de Matrimonio literal (se solicita gratis en el Registro Civil).</li>
              <li>Certificado de Nacimiento literal de los hijos (si aplica).</li>
              <li>Certificado de Empadronamiento de ambos.</li>
            </ul>
          </div>
        </div>

        {/* Contact information card */}
        <div className="bg-white border border-brand-border rounded-2xl p-4 flex justify-between items-center text-xs">
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-brand-green">¿Necesitas ayuda urgente?</span>
            <span className="text-[10px] text-brand-muted">Soporte directo prioritario</span>
          </div>
          <div className="flex gap-2">
            <a
              href="tel:+34900123456"
              className="w-8 h-8 rounded-full border border-brand-border bg-brand-bg flex items-center justify-center text-brand-green hover:border-brand-gold transition"
              title="Llamar"
            >
              <Phone size={14} />
            </a>
            <a
              href="mailto:soporte@mediador.es"
              className="w-8 h-8 rounded-full border border-brand-border bg-brand-bg flex items-center justify-center text-brand-green hover:border-brand-gold transition"
              title="Enviar correo"
            >
              <Mail size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full shrink-0">
        {/* Justificante de Pago Download */}
        <button
          onClick={() => alert("Descargando justificante de pago y confirmación de expediente...")}
          className="w-full bg-transparent hover:bg-neutral-50 border border-brand-border text-brand-green font-bold py-3.5 rounded-xl text-[10px] tracking-wider transition flex items-center justify-center gap-2 shadow-sm"
        >
          <Download size={14} className="text-brand-gold" />
          <span>Descargar Justificante de Pago</span>
        </button>

        {/* Return to Lobby */}
        <button
          onClick={() => router.push("/vestibulo")}
          className="w-full bg-brand-green hover:bg-brand-green/95 text-white font-bold py-4 rounded-xl text-xs flex items-center justify-center gap-2 transition duration-200 shadow-lg"
        >
          <Home size={14} className="text-brand-gold" />
          <span className="font-serif text-brand-gold font-bold">Volver al Vestíbulo</span>
        </button>
      </div>

    </div>
  );
}
