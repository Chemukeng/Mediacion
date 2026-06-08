"use client";

import { useState } from "react";
import { submitStaticQuestionnaire } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function StaticForm({ caseId }: { caseId: string }) {
  const [hasChildren, setHasChildren] = useState("false");
  const [hasProperties, setHasProperties] = useState("false");
  const [hasDebts, setHasDebts] = useState("false");
  const [loading, setLoading] = useState(false);

  return (
    <form 
      action={async (formData) => {
        setLoading(true);
        await submitStaticQuestionnaire(caseId, formData);
      }} 
      className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-slate-100"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Hijos */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>¿Tenéis hijos en común?</Label>
            <Select name="has_children" value={hasChildren} onValueChange={setHasChildren}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sí</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {hasChildren === "true" && (
            <div className="space-y-2">
              <Label>Indica el número y edades</Label>
              <Input name="children_details" placeholder="Ej: 2 hijos, de 5 y 8 años" required />
            </div>
          )}
        </div>

        {/* Ingresos */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Ingresos netos mensuales aprox. (€)</Label>
            <Input type="number" name="monthly_income" placeholder="Ej: 2500" required />
          </div>
        </div>

        {/* Propiedades */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>¿Tenéis propiedades inmobiliarias?</Label>
            <Select name="has_properties" value={hasProperties} onValueChange={setHasProperties}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sí</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {hasProperties === "true" && (
            <div className="space-y-2">
              <Label>Describe brevemente (Ej: Vivienda habitual, plaza de garaje)</Label>
              <Textarea name="properties_details" placeholder="Descripción breve" required />
            </div>
          )}
        </div>

        {/* Deudas */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>¿Tenéis deudas conjuntas o préstamos?</Label>
            <Select name="has_debts" value={hasDebts} onValueChange={setHasDebts}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sí</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {hasDebts === "true" && (
            <div className="space-y-2">
              <Label>Describe brevemente (Ej: Hipoteca restante 100k, Préstamo coche)</Label>
              <Textarea name="debts_details" placeholder="Descripción breve" required />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <Label>Información adicional importante</Label>
        <Textarea name="additional_info" placeholder="Cualquier otro dato económico relevante que debamos saber..." />
      </div>

      <div className="flex justify-end pt-6">
        <Button type="submit" size="lg" disabled={loading} className="bg-slate-900 hover:bg-slate-800 text-white w-full md:w-auto px-12">
          {loading ? "Procesando y generando IA..." : "Siguiente Fase (Dinámica) ➔"}
        </Button>
      </div>
    </form>
  );
}
