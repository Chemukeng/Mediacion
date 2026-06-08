"use client";

import { ChevronLeft, FileSignature, Download, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DocumentPage({ params }: { params: { id: string } }) {
  // En un caso real, obtendríamos los datos del caso con params.id
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans pb-24">
      {/* Header oscuro tipo App */}
      <header className="bg-brand-dark text-white p-4 sticky top-0 z-10 flex items-center justify-between shadow-md">
        <Link href={`/dashboard/board/${params.id}`} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">Borrador Oficial</span>
          <span className="font-serif text-lg">Convenio Regulador</span>
        </div>
        <div className="w-10"></div>
      </header>

      {/* Papel (El Documento) */}
      <main className="p-4 flex-1 flex justify-center">
        <div className="bg-[#fefdfa] w-full max-w-2xl min-h-[800px] shadow-2xl p-8 md:p-12 relative overflow-hidden text-slate-800">
          
          {/* Sello de agua */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <ShieldCheck className="w-96 h-96" />
          </div>

          <div className="border-b-2 border-black pb-4 mb-8 text-center">
            <h1 className="text-2xl font-serif font-bold uppercase tracking-widest mb-2">Convenio Regulador</h1>
            <p className="text-sm font-serif italic text-slate-600">De Divorcio de Mutuo Acuerdo</p>
          </div>

          <div className="space-y-6 text-sm leading-relaxed font-serif text-justify">
            <p>
              En la ciudad de Madrid, a [Fecha de hoy].
            </p>
            <p>
              <strong>REUNIDOS</strong>
            </p>
            <p>
              De una parte, D. / Dña. [Nombre de la Pareja A], mayor de edad, con DNI [DNI A] y domicilio en [Dirección A].
            </p>
            <p>
              De otra parte, D. / Dña. [Nombre de la Pareja B], mayor de edad, con DNI [DNI B] y domicilio en [Dirección B].
            </p>
            
            <p className="mt-8">
              <strong>EXPONEN</strong>
            </p>
            <p>
              I. Que contrajeron matrimonio en [Fecha de Matrimonio], constando inscrito en el Registro Civil de [Ciudad].
            </p>
            <p>
              II. Que mediante la plataforma <strong>MediAción</strong>, y de forma libre y voluntaria, han alcanzado un consenso total sobre las medidas que han de regular los efectos derivados de la crisis matrimonial, materializadas en el presente Convenio Regulador.
            </p>

            <div className="my-12 flex justify-center">
              <div className="px-6 py-3 bg-brand-cream border border-brand-gold/30 text-brand-gold font-bold text-xs uppercase tracking-widest rounded-full">
                Vista Previa Parcial
              </div>
            </div>
            
            <div className="filter blur-[4px] select-none opacity-50 space-y-4">
              <p>
                <strong>ESTIPULACIONES</strong>
              </p>
              <p>
                PRIMERA.- PATRIA POTESTAD Y GUARDA Y CUSTODIA. Ambas partes acuerdan que la patria potestad de los menores...
              </p>
              <p>
                SEGUNDA.- PENSIÓN DE ALIMENTOS. En concepto de alimentos, se abonará la cantidad de...
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Area */}
      <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20 pb-safe">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-brand-green" />
            <span className="text-sm font-bold text-slate-700">Documento Listo</span>
          </div>
          <span className="text-xl font-serif font-bold text-brand-green">500€</span>
        </div>
        <p className="text-xs text-slate-500 mb-4 px-2 leading-relaxed">
          Este pago único incluye la redacción legal completa, validación jurídica y tramitación en el juzgado competente.
        </p>
        
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 border-brand-green text-brand-green font-bold text-xs">
            <Download className="w-4 h-4 mr-2" />
            DESCARGAR BORRADOR
          </Button>
          <Button className="flex-1 bg-brand-green hover:bg-brand-green-light text-white font-bold text-xs">
            PAGAR Y FIRMAR
          </Button>
        </div>
      </div>
    </div>
  );
}
