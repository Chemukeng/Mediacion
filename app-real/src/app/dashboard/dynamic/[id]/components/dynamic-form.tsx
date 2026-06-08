"use client";

import { useState } from "react";
import { saveDynamicAnswers } from "../actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function DynamicForm({ caseId, questions }: { caseId: string, questions: any[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSkip = (questionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: "SKIPPED" }));
  };

  const handleAnswerChange = (questionId: string, text: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: text }));
  };

  const handleSubmit = async () => {
    // Validar que todas las preguntas tienen respuesta (o SKIPPED)
    const missing = questions.filter(q => !answers[q.id]);
    if (missing.length > 0) {
      alert("Por favor, responde o salta todas las preguntas antes de enviar.");
      return;
    }

    setLoading(true);
    try {
      await saveDynamicAnswers(caseId, answers);
    } catch (e) {
      alert("Error al guardar las respuestas.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {questions.map((q, i) => (
        <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
          {answers[q.id] === "SKIPPED" && (
            <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-[1px] flex items-center justify-center z-10">
              <div className="bg-white px-4 py-2 rounded-full border shadow-sm text-slate-500 font-medium text-sm flex items-center gap-2">
                Pregunta Omitida
                <Button variant="ghost" size="sm" onClick={() => handleAnswerChange(q.id, "")} className="h-auto p-0 underline ml-2">
                  Deshacer
                </Button>
              </div>
            </div>
          )}

          <h3 className="text-lg font-medium text-slate-800 mb-4">
            <span className="text-blue-500 font-bold mr-2">{i + 1}.</span> 
            {q.question_text}
          </h3>
          
          <Textarea 
            placeholder="Escribe aquí tu respuesta..." 
            className="min-h-[120px] mb-4"
            value={answers[q.id] !== "SKIPPED" ? answers[q.id] || "" : ""}
            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
          />

          <div className="flex justify-end">
            <Button variant="ghost" onClick={() => handleSkip(q.id)} className="text-slate-500">
              No quiero responder a esto
            </Button>
          </div>
        </div>
      ))}

      <div className="flex justify-end pt-6">
        <Button 
          size="lg" 
          onClick={handleSubmit} 
          disabled={loading || questions.some(q => !answers[q.id])} 
          className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto px-12"
        >
          {loading ? "Enviando..." : "✅ Enviar Cuestionario Dinámico"}
        </Button>
      </div>
    </div>
  );
}
