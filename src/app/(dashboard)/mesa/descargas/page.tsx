"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSimulation } from "@/context/SimulationContext";
import {
  FileText,
  Download,
  ShieldCheck,
  ChevronLeft,
  Check,
  CreditCard,
  Lock,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
  X,
  Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DescargasOpcionesPage() {
  const router = useRouter();
  const { partnerName, hijos, vivienda } = useSimulation();

  const hasChildren = hijos !== "no";
  const hasProperties = vivienda !== "alquiler";
  const totalCost = (hasChildren || hasProperties) ? 800 : 500;
  const halfCost = totalCost / 2;

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [downloadingFree, setDownloadingFree] = useState(false);
  const [downloadingPaid, setDownloadingPaid] = useState(false);

  const handleDownloadFree = () => {
    setDownloadingFree(true);
    setTimeout(() => {
      setDownloadingFree(false);
      alert("Descargando: 'Resumen_Acuerdos_Colaborativos.txt' (Lenguaje Común). Recuerde que este archivo carece de terminología y validez jurídica.");
    }, 1500);
  };

  const handlePurchasePaid = () => {
    setPaymentModalOpen(true);
  };

  const handleCompletePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
    }, 1800);
  };

  const handleDownloadPaid = () => {
    setDownloadingPaid(true);
    setTimeout(() => {
      setDownloadingPaid(false);
      setPaymentModalOpen(false);
      setPaymentSuccess(false);
      alert("Descargando: 'Convenio_Regulador_Juridico_Finalista.pdf'. Estipulaciones estructuradas formalmente listas para el Juzgado.");
    }, 1500);
  };

  return (
    <div className="flex flex-col px-6 py-4 select-none bg-brand-bg min-h-full justify-between gap-5 animate-in fade-in duration-300">
      
      {/* Header bar */}
      <div className="w-full flex justify-between items-center py-2 border-b border-brand-border/30 bg-brand-bg shrink-0">
        <button
          onClick={() => router.push("/mesa/ventajas")}
          className="w-8 h-8 rounded-full hover:bg-brand-border/40 flex items-center justify-center text-brand-green"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h2 className="font-serif text-base font-bold text-[#13382c]">
          Opciones de Descarga
        </h2>

        <div className="w-8 h-8 flex items-center justify-center text-brand-gold shrink-0">
          <FileText size={20} />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-5 py-2 overflow-y-auto no-scrollbar">
        {/* Title context */}
        <div className="text-center flex flex-col gap-1 shrink-0">
          <span className="text-[9px] font-bold text-brand-gold tracking-[0.25em] uppercase font-sans">
            DOCUMENTACIÓN DISPONIBLE
          </span>
          <h3 className="font-serif text-xl font-bold text-brand-green leading-snug">
            ¿Cómo deseas tus acuerdos?
          </h3>
          <p className="text-[10px] text-brand-muted leading-relaxed font-light">
            Selecciona el formato de descarga del convenio alcanzado con {partnerName}.
          </p>
        </div>

        {/* Option 1: Free Informal Summary Card */}
        <div className="bg-white border border-brand-border rounded-3xl p-5 shadow-sm flex flex-col gap-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-mono text-brand-muted font-bold uppercase tracking-wider bg-neutral-100 px-2 py-0.5 rounded w-fit">
                PAQUETE GRATUITO
              </span>
              <h4 className="font-serif text-base font-bold text-brand-green mt-1">
                Resumen Colaborativo
              </h4>
            </div>
            <span className="font-serif text-base font-bold text-brand-green">0€</span>
          </div>

          <p className="text-[10.5px] text-brand-muted leading-relaxed font-light">
            Descarga un documento informativo que detalla los puntos acordados en <strong>lenguaje informal común</strong>.
          </p>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex gap-2 text-[9.5px] leading-relaxed text-amber-800">
            <AlertTriangle className="text-brand-gold shrink-0 mt-0.5" size={13} />
            <span>
              <strong>Sin validez legal:</strong> No cuenta con la estructura, terminología jurídica formal ni el redactado técnico exigido por los tribunales en España.
            </span>
          </div>

          <button
            onClick={handleDownloadFree}
            disabled={downloadingFree}
            className="w-full bg-transparent hover:bg-neutral-50 border border-brand-border text-brand-green font-bold py-3 rounded-xl text-[10px] tracking-wider transition flex items-center justify-center gap-1.5 shadow-sm font-sans cursor-pointer mt-1"
          >
            {downloadingFree ? (
              <span>Generando archivo...</span>
            ) : (
              <>
                <Download size={13} className="text-brand-gold" />
                <span>Descargar Resumen (Gratis)</span>
              </>
            )}
          </button>
        </div>

        {/* Option 2: Paid Premium Legal Draft (50€) */}
        <div className="bg-white border border-brand-gold/30 rounded-3xl p-5 shadow-sm flex flex-col gap-3 relative overflow-hidden">
          {/* Gold highlight badge */}
          <div className="absolute right-0 top-0 bg-brand-gold text-[#0E1E1A] text-[8px] font-bold font-sans px-3 py-1 rounded-bl-xl tracking-widest uppercase">
            RECOMENDADO
          </div>

          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-mono text-brand-gold font-bold uppercase tracking-wider bg-brand-gold/10 px-2 py-0.5 rounded w-fit">
                PAQUETE CONVENIO JURÍDICO
              </span>
              <h4 className="font-serif text-base font-bold text-brand-green mt-1">
                Convenio Regulador Técnico
              </h4>
            </div>
            <span className="font-serif text-base font-bold text-brand-gold mt-6 mr-1 lg:mt-0">80€</span>
          </div>

          <p className="text-[10.5px] text-brand-muted leading-relaxed font-light">
            Obtén el borrador del convenio regulador redactado en <strong>términos jurídicos estrictos</strong> con los artículos y la estructura judicial estandarizada en España.
          </p>

          {/* Bullet advantages list */}
          <div className="flex flex-col gap-1.5 text-[9.5px] text-brand-green pl-1 font-medium font-sans">
            <div className="flex items-center gap-1.5">
              <Check size={11} className="text-brand-gold shrink-0" strokeWidth={3} />
              <span>Redacción legal formalizada (listo para tu abogado)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={11} className="text-brand-gold shrink-0" strokeWidth={3} />
              <span>Estructura formal de Cláusulas y Estipulaciones Judiciales</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={11} className="text-brand-gold shrink-0" strokeWidth={3} />
              <span>Ahorra hasta un 80% del tiempo de redacción en despacho</span>
            </div>
          </div>

          <button
            onClick={handlePurchasePaid}
            className="w-full bg-brand-gold hover:bg-brand-gold-hover text-[#0E1E1A] font-bold py-3.5 rounded-xl text-[10px] tracking-wider transition flex items-center justify-center gap-1.5 shadow-sm uppercase font-serif cursor-pointer mt-1"
          >
            <CreditCard size={13} className="text-[#0E1E1A]" />
            <span>Comprar Convenio Finalista (80€)</span>
          </button>
        </div>

        {/* Premium Upgrade Banner */}
        <div className="bg-[#163B30] text-white border border-[#235848] rounded-2xl p-4 flex flex-col gap-2.5 shadow-sm text-left">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="text-brand-gold shrink-0" size={16} />
            <span className="font-serif text-[11.5px] font-bold text-brand-gold">¿Deseas la tramitación judicial completa?</span>
          </div>
          <p className="text-[9.5px] text-white/70 leading-relaxed font-light">
            Si decides contratar a nuestro abogado y procurador para homologar tu convenio en el Juzgado por **{halfCost}€** (tu parte), te descontaremos íntegramente los **80€** de esta descarga.
          </p>
          <button
            onClick={() => router.push("/mesa/pago")}
            className="text-[9.5px] text-brand-gold hover:text-brand-gold-hover font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5 text-left bg-transparent border-none cursor-pointer self-start"
          >
            <span>Ver servicio con Abogados</span>
            <ArrowRight size={10} />
          </button>
        </div>
      </div>

      {/* Micropayment & Download Simulator Modal */}
      <AnimatePresence>
        {paymentModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0E1E1A]/85 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={() => { if(!isProcessingPayment) setPaymentModalOpen(false); }} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-bg rounded-3xl p-6 border border-brand-gold/30 z-10 flex flex-col gap-4 max-w-sm w-full relative text-center text-brand-green"
            >
              {/* Close button */}
              {!isProcessingPayment && !paymentSuccess && (
                <button
                  onClick={() => setPaymentModalOpen(false)}
                  className="absolute top-4 right-4 w-6 h-6 rounded-full hover:bg-neutral-100 flex items-center justify-center text-brand-muted hover:text-brand-green cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}

              {paymentSuccess ? (
                /* Success & Download Trigger State */
                <div className="flex flex-col gap-4 py-3">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                    <Check size={24} className="text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-brand-green">¡Pago Confirmado!</h4>
                    <p className="text-[10px] text-brand-muted mt-2 leading-relaxed px-2">
                      El micropago de 80€ se ha realizado con éxito. Ya puedes descargar la versión finalista estructurada jurídicamente de tu convenio.
                    </p>
                  </div>
                  
                  <button
                    onClick={handleDownloadPaid}
                    disabled={downloadingPaid}
                    className="w-full bg-brand-gold hover:bg-brand-gold-hover text-[#0E1E1A] font-bold py-3.5 rounded-xl text-[10px] tracking-wider transition flex items-center justify-center gap-1.5 shadow-sm font-sans cursor-pointer"
                  >
                    {downloadingPaid ? (
                      <span>Descargando...</span>
                    ) : (
                      <>
                        <Download size={13} className="text-[#0E1E1A]" />
                        <span>Descargar Convenio PDF</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Card Checkout Checkout Form State */
                <div className="flex flex-col gap-4 text-left">
                  <div className="text-center flex flex-col gap-1 border-b border-brand-border pb-3">
                    <h4 className="font-serif text-base font-bold text-brand-green">Pasarela Expresa</h4>
                    <span className="text-[10px] text-brand-muted">Descarga del Convenio Técnico</span>
                    <span className="text-lg font-serif font-bold text-brand-gold mt-1">80,00 €</span>
                  </div>

                  <div className="flex flex-col gap-3 font-sans">
                    {/* Simulated card inputs */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[8.5px] font-bold text-brand-gold uppercase tracking-wider">Número de Tarjeta</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="•••• •••• •••• 4242"
                          className="w-full bg-[#EAEAE6]/50 border border-brand-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-gold outline-none pl-9 font-mono"
                          disabled={isProcessingPayment}
                        />
                        <CreditCard className="absolute left-3 top-3.5 text-brand-muted" size={13} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[8.5px] font-bold text-brand-gold uppercase tracking-wider">Caducidad</label>
                        <input
                          type="text"
                          placeholder="12 / 28"
                          className="w-full bg-[#EAEAE6]/50 border border-brand-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-gold outline-none text-center font-mono"
                          disabled={isProcessingPayment}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[8.5px] font-bold text-brand-gold uppercase tracking-wider">CVC</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full bg-[#EAEAE6]/50 border border-brand-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-gold outline-none text-center font-mono"
                            disabled={isProcessingPayment}
                          />
                          <Lock className="absolute right-3 top-3.5 text-brand-muted/40" size={12} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment buttons */}
                  <div className="flex flex-col gap-2 mt-2">
                    <button
                      onClick={handleCompletePayment}
                      disabled={isProcessingPayment}
                      className="w-full bg-brand-green hover:bg-brand-green/95 text-white font-bold py-3.5 rounded-xl text-[10.5px] tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md font-sans"
                    >
                      {isProcessingPayment ? (
                        <span className="animate-pulse">Procesando pago...</span>
                      ) : (
                        <span>Pagar 80,00 €</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleCompletePayment}
                      disabled={isProcessingPayment}
                      className="w-full bg-black hover:bg-neutral-900 text-white font-bold py-3.5 rounded-xl text-[10px] tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm font-sans border-none"
                    >
                      <Smartphone size={12} className="text-white" />
                      <span>Pagar con Apple Pay</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
