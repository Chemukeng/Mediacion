"use client";

import { useState } from "react";
import { updateAgreementStatus } from "../actions";
import { Button } from "@/components/ui/button";
import { PaywallFunnel } from "./paywall-funnel";
import { CheckCircle2, XCircle, ArrowRight, Scale } from "lucide-react";

export function BoardClient({ caseId, agreements, isUserA, caseData }: { caseId: string, agreements: any[], isUserA: boolean, caseData: any }) {
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);

  const handleStatusChange = async (agreementId: string, status: "pending" | "accepted" | "rejected") => {
    setLoadingIds(prev => ({ ...prev, [agreementId]: true }));
    await updateAgreementStatus(agreementId, caseId, status);
    setLoadingIds(prev => ({ ...prev, [agreementId]: false }));
  };

  const agreementsCount = agreements.filter(a => a.user_a_status === "accepted" && a.user_b_status === "accepted").length;
  const disagreementsCount = agreements.filter(a => a.user_a_status === "rejected" || a.user_b_status === "rejected").length;
  const totalAgreements = agreements.length || 1; // avoid division by 0
  const progressPercent = Math.round((agreementsCount / totalAgreements) * 100);

  const allAgreementsAccepted = agreements.length > 0 ? agreements.every(a => a.user_a_status === "accepted" && a.user_b_status === "accepted") : true;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 text-center">
          <div className="text-4xl font-serif font-bold text-emerald-600 mb-1">{agreementsCount}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Acuerdos</div>
        </div>
        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 text-center">
          <div className="text-4xl font-serif font-bold text-red-600 mb-1">{disagreementsCount}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-red-600">Discrepancias</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
          <span>Progreso General</span>
          <span className="text-brand-green">{progressPercent}% Completado</span>
        </div>
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-brand-gold rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="pt-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-6">Puntos Tratados</h3>
        
        <div className="space-y-4">
          {agreements.length === 0 && (
            <div className="text-center p-8 bg-white border border-slate-200 rounded-2xl">
              <h3 className="text-xl font-medium text-brand-green mb-2">No hay puntos de conflicto</h3>
              <p className="text-slate-500">Al no haber declarado hijos, ni propiedades, ni deudas, no hay cláusulas que negociar. Podéis proceder a finalizar el expediente.</p>
            </div>
          )}

          {agreements.map((a) => {
            const myStatus = isUserA ? a.user_a_status : a.user_b_status;
            const otherStatus = isUserA ? a.user_b_status : a.user_a_status;
            const isFullyAccepted = a.user_a_status === "accepted" && a.user_b_status === "accepted";
            const isDisputed = a.user_a_status === "rejected" || a.user_b_status === "rejected";

            return (
              <div key={a.id} className={`p-5 rounded-2xl border transition-all ${isFullyAccepted ? 'bg-white border-slate-200' : isDisputed ? 'bg-red-50/30 border-red-100' : 'bg-white border-slate-200'}`}>
                <div className="flex items-start gap-4">
                  {isFullyAccepted ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
                  ) : isDisputed ? (
                    <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-1" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-300 shrink-0 mt-1"></div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-serif font-bold text-brand-green">{a.topic}</h3>
                        <p className={`text-sm ${isFullyAccepted ? 'text-emerald-600' : isDisputed ? 'text-red-500' : 'text-slate-500'}`}>
                          {isFullyAccepted ? 'Acuerdo Total' : isDisputed ? 'Discrepancia Activa' : 'Pendiente de revisión'}
                        </p>
                      </div>
                      
                      {!isFullyAccepted && !isDisputed && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200" onClick={() => handleStatusChange(a.id, "accepted")}>Aceptar</Button>
                          <Button size="sm" variant="outline" className="text-xs bg-red-50 text-red-700 hover:bg-red-100 border-red-200" onClick={() => handleStatusChange(a.id, "rejected")}>Rechazar</Button>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 text-sm text-slate-600 bg-brand-cream/50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                      "{a.ai_summary}"
                    </div>

                    {isDisputed && (
                      <div className="mt-4 flex justify-end">
                        <Button 
                          className="bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold tracking-wider"
                          onClick={() => setActiveSuggestion(a.id)}
                        >
                          INTERVENIR AHORA <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal de Sugerencia (Simulado dentro del componente por simplicidad) */}
                {activeSuggestion === a.id && (
                  <div className="fixed inset-0 bg-brand-dark/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
                      <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-4 mb-2"></div>
                      
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-white">
                            <Scale className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-serif font-bold text-xl text-brand-green">Sugerencia Legal (IA)</h3>
                            <p className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">Ref: {a.topic}</p>
                          </div>
                        </div>

                        <blockquote className="text-brand-green italic text-sm leading-relaxed mb-4 px-2">
                          "El Tribunal Supremo establece que la pensión no es un mecanismo de igualdad aritmética, sino de reequilibrio. Dada la duración del matrimonio, la jurisprudencia sugiere una pensión temporal limitada, no vitalicia."
                        </blockquote>
                        <p className="text-right text-[10px] text-slate-400 mb-6">— Artículo 97 Código Civil</p>

                        <div className="bg-brand-cream p-4 rounded-xl mb-6">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-green mb-2">Recomendación Neutral</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Considerando la diferencia de ingresos del 15%, una cantidad de 350€ durante 24 meses se alinearía con los estándares provinciales recientes.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <Button className="w-full bg-brand-green hover:bg-brand-green-light text-white h-12">
                            Aceptar Sugerencia (350€)
                          </Button>
                          <Button variant="outline" className="w-full border-slate-200 text-slate-600 h-12" onClick={() => setActiveSuggestion(null)}>
                            Mantener mi propuesta
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {allAgreementsAccepted && (
        <div className="mt-12">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px bg-brand-gold/30 flex-1"></div>
            <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Siguiente Paso</span>
            <div className="h-px bg-brand-gold/30 flex-1"></div>
          </div>
          <PaywallFunnel caseId={caseId} caseData={caseData} isUserA={isUserA} />
        </div>
      )}
    </div>
  );
}
