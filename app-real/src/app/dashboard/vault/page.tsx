import { ShieldCheck, ChevronLeft, FileText, Lock, Sparkles, MessageSquare, ShieldHeart, Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VaultPage() {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 sticky top-0 z-10">
        <Link href="/dashboard" className="text-slate-600 hover:text-brand-green transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="text-center flex-1">
          <div className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-bold mb-1">Espacio Seguro</div>
          <h1 className="text-xl font-serif font-bold text-brand-green italic">Bóveda Privada Unificada</h1>
        </div>
        <ShieldCheck className="w-6 h-6 text-brand-green" />
      </header>

      <main className="flex-1 p-6 space-y-6">
        {/* Hero Card */}
        <div className="bg-brand-green rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <h2 className="text-3xl font-serif font-medium italic mb-4 relative z-10">Tu Espacio de Preparación</h2>
          <p className="text-brand-cream/80 text-sm leading-relaxed mb-8 relative z-10 font-light">
            Este entorno es 100% privado. Sus borradores y propuestas solo son visibles para usted.
          </p>

          <div className="relative z-10">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2 text-brand-gold">
              <span>Estado de Preparación</span>
              <span>33% completado</span>
            </div>
            <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-brand-gold w-1/3 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Cuestionario Básico */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-brand-gold" />
              <h3 className="text-xl font-serif text-brand-green">Cuestionario Básico</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-gold">
              <Pencil className="w-4 h-4" />
            </div>
          </div>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Recopilación de información esencial para estructurar los pilares fundamentales de su caso.
          </p>
          <Button className="bg-brand-green hover:bg-brand-green-light text-white rounded-xl px-6 text-xs tracking-wider font-bold h-12">
            CONTINUAR <ChevronLeft className="w-4 h-4 ml-2 rotate-180" />
          </Button>
        </div>

        {/* Cuestionario Dinámico IA */}
        <div className="bg-white/50 rounded-3xl p-6 border border-slate-200 border-dashed opacity-80">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-slate-400" />
              <h3 className="text-xl font-serif text-slate-400">Cuestionario Dinámico IA</h3>
            </div>
            <Lock className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Preguntas personalizadas generadas tras el análisis de ambos perfiles.
          </p>
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-400 px-4 py-3 rounded-xl text-xs font-bold tracking-wider">
            <Lock className="w-3 h-3" />
            ESPERANDO A LA OTRA PARTE
          </div>
        </div>

        {/* Asistente de Propuestas */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border-l-4 border-l-brand-gold relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cream rounded-full blur-2xl -mr-10 -mt-10"></div>
          
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-brand-gold" />
              <h3 className="text-xl font-serif text-brand-green">Asistente de Propuestas</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-green flex items-center justify-center text-brand-gold shadow-md">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed relative z-10">
            Redacte borradores y ensaye sus argumentos con la guía de nuestra IA especializada.
          </p>
          <Link href="/dashboard/vault/assistant">
            <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white rounded-xl px-6 text-xs tracking-wider font-bold h-12 relative z-10">
              ABRIR CHAT PRIVADO <MessageSquare className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Footer Security */}
        <div className="text-center py-8">
          <ShieldHeart className="w-8 h-8 text-brand-green mx-auto mb-3" />
          <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green mb-2">Encriptación de Grado Militar</h4>
          <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed">
            Protocolo AES-256. Sus datos son inaccesibles para el mediador, la otra parte o el personal técnico.
          </p>
        </div>
      </main>
    </div>
  );
}
