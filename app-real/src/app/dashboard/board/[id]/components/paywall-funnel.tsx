"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, Lock, ShieldCheck } from "lucide-react";
import { createCheckoutSession } from "../actions";

export function PaywallFunnel({ caseId, caseData, isUserA }: { caseId: string, caseData: any, isUserA: boolean }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (type: "full" | "half") => {
    setLoading(type);
    try {
      const url = await createCheckoutSession(caseId, type);
      if (url) window.location.href = url;
    } catch (e) {
      alert("Error al iniciar el pago");
      setLoading(null);
    }
  };

  const handleRequestPayment = async () => {
    setLoading("request");
    // TODO: Server action to set status to requested
    alert("Hemos notificado a la otra parte para que asuma el pago completo.");
    setLoading(null);
  };

  if (caseData.payment_status === "paid_in_full") {
    return (
      <div className="mt-12 p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-emerald-900 mb-2">¡Proceso Legal Finalizado!</h3>
        <p className="text-emerald-700 mb-6">El pago de 500€ se ha completado. Ya puedes descargar tu documento oficial con plena validez legal.</p>
        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
          <FileText className="w-4 h-4 mr-2" />
          Descargar Convenio Regulador Oficial (PDF)
        </Button>
      </div>
    );
  }

  // Calculate what's left
  const remaining = 500 - (caseData.amount_paid || 0);

  return (
    <div className="mt-16 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      <div className="bg-slate-900 p-8 text-center text-white">
        <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-2">¡Habéis llegado a un acuerdo total!</h2>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
          Habéis conseguido lo más difícil: poneros de acuerdo. Ahora solo falta darle validez legal para que este documento tenga plenos efectos jurídicos y proteja vuestro futuro.
        </p>
      </div>

      <div className="p-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Lock className="w-5 h-5 text-slate-400" />
                Desbloquea el Documento Oficial
              </h4>
              <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                Por una tarifa plana y transparente de 500€, obtendréis el Convenio Regulador redactado por abogados especializados y validado por IA, listo para ser presentado en el juzgado.
              </p>
            </div>

            {remaining < 500 && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm">
                <strong>Aviso:</strong> La otra parte ya ha abonado {(caseData.amount_paid).toFixed(2)}€.
                Quedan <strong>{remaining.toFixed(2)}€</strong> pendientes.
              </div>
            )}

            <div className="space-y-3">
              {remaining === 500 ? (
                <>
                  <Button 
                    className="w-full h-14 text-base bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleCheckout("full")}
                    disabled={!!loading}
                  >
                    {loading === "full" ? "Redirigiendo a Stripe..." : "Pagar todo (500€) y finalizar ya"}
                  </Button>
                  <Button 
                    className="w-full h-12" variant="outline"
                    onClick={() => handleCheckout("half")}
                    disabled={!!loading}
                  >
                    {loading === "half" ? "Redirigiendo..." : "Pagar solo mi mitad (250€)"}
                  </Button>
                  <Button 
                    className="w-full h-12" variant="ghost"
                    onClick={handleRequestPayment}
                    disabled={!!loading}
                  >
                    {loading === "request" ? "Notificando..." : "Solicitar a la otra parte que pague el 100%"}
                  </Button>
                </>
              ) : (
                <Button 
                  className="w-full h-14 text-base bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleCheckout("half")} // Technical it's the remaining half
                  disabled={!!loading}
                >
                  {loading === "half" ? "Redirigiendo a Stripe..." : `Pagar el resto (${remaining}€) y finalizar`}
                </Button>
              )}
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-4 text-center">Opción sin validez legal</h4>
            <p className="text-sm text-slate-500 mb-6 text-center">
              Si no queréis darle validez jurídica inmediata, podéis descargar un borrador. Ten en cuenta que este documento NO sirve para presentar en un juzgado ni ofrece garantías legales.
            </p>
            <Button variant="secondary" className="w-full" onClick={() => alert("Descargando borrador con marca de agua...")}>
              Descargar Borrador (Marca de Agua)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
