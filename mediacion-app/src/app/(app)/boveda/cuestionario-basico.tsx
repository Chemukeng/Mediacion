import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth.store";
import { useCaseStore } from "@/store/case.store";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type EstadoCivil = "casados-gananciales" | "casados-separacion" | "pareja-hecho" | "no-casados";
type ConvivenciaSituacion = "conviviendo-separados" | "hogares-separados" | "conviviendo-planeando";
type HijosTipo = "no" | "menores" | "mayores" | "ambos";
type CustodiaTipo = "compartida" | "exclusiva-propia" | "exclusiva-pareja" | "indeciso";
type CuidadoTipo = "reparto-equitativo" | "principalmente-yo" | "principalmente-pareja" | "apoyo-externo";
type ViviendaTipo = "alquiler" | "propiedad-hipoteca" | "propiedad-sin-hipoteca" | "propiedad-privativa" | "otra";
type ViviendaUsoTipo = "yo" | "pareja" | "vender" | "indeciso";
type SituacionLaboral = "empleado-ajena" | "autonomo" | "desempleado-prestacion" | "desempleado-sin-prestacion" | "inactivo-hogar" | "jubilado-incapacitado";
type IngresosNetos = "menos-1000" | "1000-1800" | "1800-2800" | "mas-2800";
type DesequilibrioTipo = "no" | "si-yo-perjudicado" | "si-pareja-perjudicada";
type GastosGestion = "cuenta-comun-50" | "cuenta-comun-proporcional" | "reparto-informal" | "uno-paga-todo";
type PrioridadTipo = "bienestar-hijos" | "reparto-bienes" | "liquidacion-deudas" | "pension-alimentos" | "rapidez-paz";
type ComunicacionTipo = "fluida" | "dificil" | "bloqueada";

export default function CuestionarioBasico() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { activeCase } = useCaseStore();

  // Wizard Step State
  const [currentStep, setCurrentStep] = useState(1);

  // --- FORM STATES (15 Questions) ---

  // Paso 1: Relación y Datos Iniciales
  const [estadoCivil, setEstadoCivil] = useState<EstadoCivil>("casados-gananciales"); // Q1
  const [convivenciaInicio, setConvivenciaInicio] = useState(""); // Q2
  const [situacionConvivencia, setSituacionConvivencia] = useState<ConvivenciaSituacion>("conviviendo-separados"); // Q3
  const [fechaSeparacion, setFechaSeparacion] = useState(""); // Q3 Sub

  // Paso 2: Hijos y Cuidado
  const [hijos, setHijos] = useState<HijosTipo>("no"); // Q4
  const [numHijos, setNumHijos] = useState<1 | 2 | 3>(2); // Q4 Sub
  const [edadesHijos, setEdadesHijos] = useState<string[]>(["", "", ""]); // Q4 Sub
  const [necesidadesEspeciales, setNecesidadesEspeciales] = useState<"no" | "si">("no"); // Q4 Sub
  const [necesidadesEspecialesDetalles, setNecesidadesEspecialesDetalles] = useState(""); // Q4 Sub
  const [ideaCustodia, setIdeaCustodia] = useState<CustodiaTipo>("compartida"); // Q5
  const [propuestaReparto, setPropuestaReparto] = useState(""); // Q5 Sub
  const [cuidadoDiario, setCuidadoDiario] = useState<CuidadoTipo>("reparto-equitativo"); // Q6

  // Paso 3: Vivienda y Bienes
  const [vivienda, setVivienda] = useState<ViviendaTipo>("alquiler"); // Q7
  const [alquilerImporte, setAlquilerImporte] = useState(""); // Q7 Sub
  const [alquilerTitular, setAlquilerTitular] = useState(""); // Q7 Sub
  const [propiedadHipotecaCuota, setPropiedadHipotecaCuota] = useState(""); // Q7 Sub
  const [viviendaPropuestaUso, setViviendaPropuestaUso] = useState<ViviendaUsoTipo>("yo"); // Q7 Sub
  const [otrasPropiedades, setOtrasPropiedades] = useState<"no" | "si">("no"); // Q8
  const [otrasPropiedadesDetalles, setOtrasPropiedadesDetalles] = useState(""); // Q8 Sub
  const [vehiculosComunes, setVehiculosComunes] = useState<"no" | "si">("no"); // Q9
  const [vehiculosComunesDetalles, setVehiculosComunesDetalles] = useState(""); // Q9 Sub

  // Paso 4: Trabajo e Ingresos
  const [situacionLaboral, setSituacionLaboral] = useState<SituacionLaboral>("empleado-ajena"); // Q10
  const [ingresosNetos, setIngresosNetos] = useState<IngresosNetos>("1000-1800"); // Q11
  const [otrosIngresos, setOtrosIngresos] = useState<"no" | "si">("no"); // Q11 Sub
  const [otrosIngresosDetalles, setOtrosIngresosDetalles] = useState(""); // Q11 Sub
  const [desequilibrioEconomico, setDesequilibrioEconomico] = useState<DesequilibrioTipo>("no"); // Q12
  const [desequilibrioDetalles, setDesequilibrioDetalles] = useState(""); // Q12 Sub

  // Paso 5: Finanzas y Prioridades
  const [deudasComunes, setDeudasComunes] = useState<"no" | "si">("no"); // Q13
  const [deudasComunesDetalles, setDeudasComunesDetalles] = useState(""); // Q13 Sub
  const [gestionGastos, setGestionGastos] = useState<GastosGestion>("cuenta-comun-50"); // Q14
  const [prioridadMediacion, setPrioridadMediacion] = useState<PrioridadTipo>("bienestar-hijos"); // Q15
  const [comunicacionPareja, setComunicacionPareja] = useState<ComunicacionTipo>("fluida"); // Q15 Sub
  const [comentariosAdicionales, setComentariosAdicionales] = useState(""); // Q15 Sub

  // Fetch existing data
  const { data: existingData, isLoading } = useQuery({
    queryKey: ["basicQuestionnaireData", activeCase?.id, user?.id],
    queryFn: async () => {
      if (!activeCase || !user) return null;
      const { data, error } = await supabase
        .from("questionnaire_basic")
        .select("*")
        .eq("case_id", activeCase.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading basic questionnaire:", error);
        return null;
      }
      return data;
    },
    enabled: !!activeCase?.id && !!user?.id,
  });

  const basicSubmitted = !!existingData?.submitted_at;

  // Populate form if data exists
  useEffect(() => {
    if (existingData) {
      try {
        if (existingData.answers) {
          const ans = typeof existingData.answers === "string" 
            ? JSON.parse(existingData.answers) 
            : existingData.answers;

          if (ans.estadoCivil) setEstadoCivil(ans.estadoCivil);
          if (ans.convivenciaInicio) setConvivenciaInicio(ans.convivenciaInicio);
          if (ans.situacionConvivencia) setSituacionConvivencia(ans.situacionConvivencia);
          if (ans.fechaSeparacion) setFechaSeparacion(ans.fechaSeparacion);

          if (ans.hijos) setHijos(ans.hijos);
          if (ans.numHijos) setNumHijos(ans.numHijos);
          if (ans.edadesHijos) setEdadesHijos(ans.edadesHijos);
          if (ans.necesidadesEspeciales) setNecesidadesEspeciales(ans.necesidadesEspeciales);
          if (ans.necesidadesEspecialesDetalles) setNecesidadesEspecialesDetalles(ans.necesidadesEspecialesDetalles);
          if (ans.ideaCustodia) setIdeaCustodia(ans.ideaCustodia);
          if (ans.propuestaReparto) setPropuestaReparto(ans.propuestaReparto);
          if (ans.cuidadoDiario) setCuidadoDiario(ans.cuidadoDiario);

          if (ans.vivienda) setVivienda(ans.vivienda);
          if (ans.alquilerImporte) setAlquilerImporte(ans.alquilerImporte);
          if (ans.alquilerTitular) setAlquilerTitular(ans.alquilerTitular);
          if (ans.propiedadHipotecaCuota) setPropiedadHipotecaCuota(ans.propiedadHipotecaCuota);
          if (ans.viviendaPropuestaUso) setViviendaPropuestaUso(ans.viviendaPropuestaUso);
          if (ans.otrasPropiedades) setOtrasPropiedades(ans.otrasPropiedades);
          if (ans.otrasPropiedadesDetalles) setOtrasPropiedadesDetalles(ans.otrasPropiedadesDetalles);
          if (ans.vehiculosComunes) setVehiculosComunes(ans.vehiculosComunes);
          if (ans.vehiculosComunesDetalles) setVehiculosComunesDetalles(ans.vehiculosComunesDetalles);

          if (ans.situacionLaboral) setSituacionLaboral(ans.situacionLaboral);
          if (ans.ingresosNetos) setIngresosNetos(ans.ingresosNetos);
          if (ans.otrosIngresos) setOtrosIngresos(ans.otrosIngresos);
          if (ans.otrosIngresosDetalles) setOtrosIngresosDetalles(ans.otrosIngresosDetalles);
          if (ans.desequilibrioEconomico) setDesequilibrioEconomico(ans.desequilibrioEconomico);
          if (ans.desequilibrioDetalles) setDesequilibrioDetalles(ans.desequilibrioDetalles);

          if (ans.deudasComunes) setDeudasComunes(ans.deudasComunes);
          if (ans.deudasComunesDetalles) setDeudasComunesDetalles(ans.deudasComunesDetalles);
          if (ans.gestionGastos) setGestionGastos(ans.gestionGastos);
          if (ans.prioridadMediacion) setPrioridadMediacion(ans.prioridadMediacion);
          if (ans.comunicacionPareja) setComunicacionPareja(ans.comunicacionPareja);
          if (ans.comentariosAdicionales) setComentariosAdicionales(ans.comentariosAdicionales);
        } else {
          // Fallback parsing from legacy columns
          if (existingData.children_details) {
            const parsedChildren = JSON.parse(existingData.children_details);
            setHijos(parsedChildren.type || "no");
            setNumHijos(parsedChildren.count || 2);
            setEdadesHijos(parsedChildren.ages || ["", "", ""]);
            if (parsedChildren.custody) setIdeaCustodia(parsedChildren.custody);
            if (parsedChildren.custody_details) setPropuestaReparto(parsedChildren.custody_details);
            if (parsedChildren.daily_care) setCuidadoDiario(parsedChildren.daily_care);
            if (parsedChildren.special_needs && parsedChildren.special_needs !== "No") {
              setNecesidadesEspeciales("si");
              setNecesidadesEspecialesDetalles(parsedChildren.special_needs);
            }
          }

          if (existingData.properties_details) {
            const parsedProps = JSON.parse(existingData.properties_details);
            setVivienda(parsedProps.type || "alquiler");
            if (parsedProps.regimen) setEstadoCivil(parsedProps.regimen);
            if (parsedProps.coexistence_start) setConvivenciaInicio(parsedProps.coexistence_start);
            if (parsedProps.separation_status) setSituacionConvivencia(parsedProps.separation_status);
            if (parsedProps.separation_date) setFechaSeparacion(parsedProps.separation_date);
            if (parsedProps.vivienda_proposed_use) setViviendaPropuestaUso(parsedProps.vivienda_proposed_use);
            if (parsedProps.other_properties && parsedProps.other_properties !== "No") {
              setOtrasPropiedades("si");
              setOtrasPropiedadesDetalles(parsedProps.other_properties);
            }
            if (parsedProps.vehicles && parsedProps.vehicles !== "No") {
              setVehiculosComunes("si");
              setVehiculosComunesDetalles(parsedProps.vehicles);
            }
          }

          if (existingData.debts_details) {
            const parsedDebts = JSON.parse(existingData.debts_details);
            if (parsedDebts.type === "si") {
              setDeudasComunes("si");
              setDeudasComunesDetalles(parsedDebts.details || "");
            }
            if (parsedDebts.income) setIngresosNetos(parsedDebts.income);
            if (parsedDebts.job) setSituacionLaboral(parsedDebts.job);
            if (parsedDebts.financial_imbalance_type) setDesequilibrioEconomico(parsedDebts.financial_imbalance_type);
            if (parsedDebts.financial_imbalance && parsedDebts.financial_imbalance !== "No") {
              setDesequilibrioDetalles(parsedDebts.financial_imbalance);
            }
            if (parsedDebts.expenses_management) setGestionGastos(parsedDebts.expenses_management);
            if (parsedDebts.objectives) setPrioridadMediacion(parsedDebts.objectives);
          }
        }
      } catch (err) {
        console.error("Error loading questionnaire data:", err);
      }
    }
  }, [existingData]);

  // Submit Mutation
  const saveMutation = useMutation({
    mutationFn: async (submitNow: boolean) => {
      if (!activeCase || !user) throw new Error("No hay expediente activo o sesión iniciada");

      // Assemble full answers JSON
      const answers = {
        estadoCivil,
        convivenciaInicio,
        situacionConvivencia,
        fechaSeparacion: situacionConvivencia === "hogares-separados" ? fechaSeparacion : "",
        
        hijos,
        numHijos: (hijos === "menores" || hijos === "ambos") ? numHijos : 0,
        edadesHijos: (hijos === "menores" || hijos === "ambos") ? edadesHijos.slice(0, numHijos) : [],
        necesidadesEspeciales,
        necesidadesEspecialesDetalles: necesidadesEspeciales === "si" ? necesidadesEspecialesDetalles : "",
        ideaCustodia,
        propuestaReparto: ideaCustodia !== "indeciso" ? propuestaReparto : "",
        cuidadoDiario,

        vivienda,
        alquilerImporte: vivienda === "alquiler" ? alquilerImporte : "",
        alquilerTitular: vivienda === "alquiler" ? alquilerTitular : "",
        propiedadHipotecaCuota: vivienda === "propiedad-hipoteca" ? propiedadHipotecaCuota : "",
        viviendaPropuestaUso,
        otrasPropiedades,
        otrasPropiedadesDetalles: otrasPropiedades === "si" ? otrasPropiedadesDetalles : "",
        vehiculosComunes,
        vehiculosComunesDetalles: vehiculosComunes === "si" ? vehiculosComunesDetalles : "",

        situacionLaboral,
        ingresosNetos,
        otrosIngresos,
        otrosIngresosDetalles: otrosIngresos === "si" ? otrosIngresosDetalles : "",
        desequilibrioEconomico,
        desequilibrioDetalles: desequilibrioEconomico !== "no" ? desequilibrioDetalles : "",

        deudasComunes,
        deudasComunesDetalles: deudasComunes === "si" ? deudasComunesDetalles : "",
        gestionGastos,
        prioridadMediacion,
        comunicacionPareja,
        comentariosAdicionales,
      };

      // Map to legacy fields for Edge Function compatibility
      const has_children = hijos === "menores" || hijos === "ambos";
      const children_details = JSON.stringify({
        type: hijos,
        count: has_children ? numHijos : 0,
        ages: has_children ? edadesHijos.slice(0, numHijos) : [],
        custody: ideaCustodia,
        custody_details: ideaCustodia !== "indeciso" ? propuestaReparto : "",
        daily_care: cuidadoDiario,
        special_needs: necesidadesEspeciales === "si" ? necesidadesEspecialesDetalles : "No",
      });

      const has_properties = vivienda !== "alquiler";
      const properties_details = JSON.stringify({
        type: vivienda,
        regimen: estadoCivil,
        coexistence_start: convivenciaInicio,
        separation_status: situacionConvivencia,
        separation_date: situacionConvivencia === "hogares-separados" ? fechaSeparacion : "",
        vivienda_proposed_use: viviendaPropuestaUso,
        alquiler_details: vivienda === "alquiler" && alquilerImporte ? `${alquilerImporte} (Contrato: ${alquilerTitular})` : null,
        other_properties: otrasPropiedades === "si" ? otrasPropiedadesDetalles : "No",
        vehicles: vehiculosComunes === "si" ? vehiculosComunesDetalles : "No",
      });

      const has_debts = deudasComunes === "si";
      const debts_details = JSON.stringify({
        type: deudasComunes === "si" ? "si" : "no",
        details: deudasComunes === "si" ? deudasComunesDetalles : "No",
        income: ingresosNetos,
        other_income: otrosIngresos === "si" ? otrosIngresosDetalles : "No",
        job: situacionLaboral,
        financial_imbalance_type: desequilibrioEconomico,
        financial_imbalance: desequilibrioEconomico !== "no" ? desequilibrioDetalles : "No",
        expenses_management: gestionGastos,
        objectives: prioridadMediacion,
        communication: comunicacionPareja,
        comments: comentariosAdicionales,
      });

      // Map income net range to a numeric estimation for monthly_income database field
      let monthly_income = 1400.0;
      if (ingresosNetos === "menos-1000") monthly_income = 850.0;
      else if (ingresosNetos === "1000-1800") monthly_income = 1400.0;
      else if (ingresosNetos === "1800-2800") monthly_income = 2300.0;
      else if (ingresosNetos === "mas-2800") monthly_income = 3500.0;

      const { data, error } = await supabase
        .from("questionnaire_basic")
        .upsert({
          case_id: activeCase.id,
          user_id: user.id,
          monthly_income,
          has_children,
          children_details,
          has_properties,
          properties_details,
          has_debts,
          debts_details,
          answers,
          submitted_at: submitNow ? new Date().toISOString() : null,
        }, { onConflict: "case_id,user_id" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["basicQuestionnaire", activeCase?.id, user?.id] });
      queryClient.invalidateQueries({ queryKey: ["basicQuestionnaireData", activeCase?.id, user?.id] });
      
      if (data.submitted_at) {
        Alert.alert("Formulario Sellado", "Tus respuestas se han guardado con éxito en la Bóveda Privada.", [
          { text: "Entendido", onPress: () => router.replace("/boveda") },
        ]);
      } else {
        Alert.alert("Guardado", "Tus respuestas se han guardado como borrador.");
      }
    },
    onError: (err: any) => {
      Alert.alert("Error al guardar", err.message || "Ocurrió un error inesperado.");
    },
  });

  const handleAgeChange = (index: number, text: string) => {
    setEdadesHijos((prev) => {
      const copy = [...prev];
      copy[index] = text;
      return copy;
    });
  };

  // --- REUSABLE UI SELECTORS ---

  // Row option button selector (like a tab row)
  const OptionButton = ({
    label,
    selected,
    onPress,
  }: {
    label: string;
    selected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      disabled={basicSubmitted}
      onPress={onPress}
      className={`p-3.5 rounded-xl border flex-1 items-center justify-center ${
        selected ? "bg-brand-green border-brand-green" : "bg-gray-50/50 border-gray-200"
      } ${basicSubmitted ? "opacity-75" : "active:opacity-85"}`}
    >
      <Text className={`text-xs font-semibold text-center ${selected ? "text-brand-cream" : "text-brand-dark"}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Vertical stacked row option item (like a list item with a radio-button indicator)
  const SelectorRow = ({
    label,
    selected,
    onPress,
  }: {
    label: string;
    selected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      disabled={basicSubmitted}
      onPress={onPress}
      className={`p-3.5 px-4 rounded-xl border flex-row items-center justify-between ${
        selected ? "bg-brand-cream border-brand-green" : "bg-gray-50/50 border-gray-200"
      } ${basicSubmitted ? "opacity-75" : "active:opacity-85"}`}
    >
      <Text className={`text-xs font-medium flex-1 mr-2 ${selected ? "text-brand-green font-semibold" : "text-brand-dark"}`}>
        {label}
      </Text>
      {selected ? (
        <Ionicons name="checkmark-circle" size={18} color="#1a3e31" />
      ) : (
        <View className="w-4.5 h-4.5 rounded-full border border-gray-300 bg-white" />
      )}
    </TouchableOpacity>
  );

  // TextInput component
  const TextInputCard = ({
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    numberOfLines = 1,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    multiline?: boolean;
    numberOfLines?: number;
  }) => (
    <View className="space-y-1.5 mt-3">
      <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
        {label}
      </Text>
      <TextInput
        editable={!basicSubmitted}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={multiline ? { textAlignVertical: "top" } : undefined}
        className={`bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-brand-dark ${
          multiline ? "min-h-[80px] leading-relaxed" : ""
        }`}
      />
    </View>
  );

  // --- STEP INDICATOR ---
  const StepIndicator = () => {
    const steps = [
      { id: 1, label: "Relación" },
      { id: 2, label: "Hijos" },
      { id: 3, label: "Vivienda" },
      { id: 4, label: "Finanzas" },
      { id: 5, label: "Objetivos" },
    ];
    return (
      <View className="flex-row items-center justify-between px-1.5 mb-6">
        {steps.map((s, idx) => (
          <React.Fragment key={s.id}>
            <View className="items-center flex-1">
              <View className={`w-8 h-8 rounded-full items-center justify-center ${
                currentStep >= s.id ? "bg-brand-green" : "bg-gray-200"
              }`}>
                {currentStep > s.id ? (
                  <Ionicons name="checkmark" size={16} color="#fbf9f4" />
                ) : (
                  <Text className={`text-xs font-bold ${currentStep === s.id ? "text-brand-cream" : "text-gray-500"}`}>
                    {s.id}
                  </Text>
                )}
              </View>
              <Text className={`text-[9px] mt-1 font-semibold text-center ${currentStep === s.id ? "text-brand-green font-bold" : "text-gray-400"}`}>
                {s.label}
              </Text>
            </View>
            {idx < steps.length - 1 && (
              <View className={`h-[2px] flex-1 -mt-4 ${
                currentStep > s.id ? "bg-brand-green" : "bg-gray-200"
              }`} />
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-brand-cream">
      <ScreenHeader title="Cuestionario Básico" subtitle="Perfil Familiar y Patrimonial" showBackButton={true} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1a3e31" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          className="p-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Info locked header banner if already submitted */}
          {basicSubmitted && (
            <View className="bg-green-50 border border-green-200 rounded-2xl p-4 flex-row space-x-3 mb-5">
              <Ionicons name="lock-closed" size={18} color="#166534" className="mt-0.5" />
              <View className="flex-1">
                <Text className="text-xs font-bold text-green-800">
                  Cuestionario Finalizado y Sellado
                </Text>
                <Text className="text-[10px] text-green-700 mt-1 leading-relaxed">
                  Tus respuestas han sido procesadas de forma segura y confidencial. Se encuentran guardadas en modo de solo lectura.
                </Text>
              </View>
            </View>
          )}

          {/* Progress Indicator */}
          <StepIndicator />

          {/* --- STEP 1: RELACIÓN Y DATOS INICIALES --- */}
          {currentStep === 1 && (
            <View className="space-y-5">
              <Card className="border-none shadow-sm space-y-4">
                <Text className="text-sm font-bold text-brand-dark">
                  💍 Q1: ¿Cuál es vuestro estado civil o régimen de convivencia?
                </Text>
                <View className="space-y-2">
                  <SelectorRow
                    label="Matrimonio en régimen de Gananciales"
                    selected={estadoCivil === "casados-gananciales"}
                    onPress={() => setEstadoCivil("casados-gananciales")}
                  />
                  <SelectorRow
                    label="Matrimonio en régimen de Separación de Bienes"
                    selected={estadoCivil === "casados-separacion"}
                    onPress={() => setEstadoCivil("casados-separacion")}
                  />
                  <SelectorRow
                    label="Pareja de hecho registrada"
                    selected={estadoCivil === "pareja-hecho"}
                    onPress={() => setEstadoCivil("pareja-hecho")}
                  />
                  <SelectorRow
                    label="Convivencia (no casados ni registrados)"
                    selected={estadoCivil === "no-casados"}
                    onPress={() => setEstadoCivil("no-casados")}
                  />
                </View>
              </Card>

              <Card className="border-none shadow-sm">
                <Text className="text-sm font-bold text-brand-dark mb-1">
                  📅 Q2: Fecha de inicio de matrimonio o convivencia
                </Text>
                <TextInputCard
                  label="Año o fecha aproximada"
                  value={convivenciaInicio}
                  onChangeText={setConvivenciaInicio}
                  placeholder="Ej. Septiembre de 2012 o 2015"
                />
              </Card>

              <Card className="border-none shadow-sm space-y-4">
                <Text className="text-sm font-bold text-brand-dark">
                  💔 Q3: ¿Cuál es vuestra situación de convivencia actual?
                </Text>
                <View className="space-y-2">
                  <SelectorRow
                    label="Convivimos en el mismo hogar pero separados"
                    selected={situacionConvivencia === "conviviendo-separados"}
                    onPress={() => setSituacionConvivencia("conviviendo-separados")}
                  />
                  <SelectorRow
                    label="Ya vivimos en hogares separados"
                    selected={situacionConvivencia === "hogares-separados"}
                    onPress={() => setSituacionConvivencia("hogares-separados")}
                  />
                  <SelectorRow
                    label="Convivimos y planeamos la mudanza/salida inminente"
                    selected={situacionConvivencia === "conviviendo-planeando"}
                    onPress={() => setSituacionConvivencia("conviviendo-planeando")}
                  />
                </View>

                {situacionConvivencia === "hogares-separados" && (
                  <View className="bg-brand-cream border border-gray-100 rounded-xl p-3.5 mt-2">
                    <TextInputCard
                      label="¿Desde cuándo vivís separados?"
                      value={fechaSeparacion}
                      onChangeText={setFechaSeparacion}
                      placeholder="Ej. Hace 3 meses o Enero de 2026"
                    />
                  </View>
                )}
              </Card>
            </View>
          )}

          {/* --- STEP 2: HIJOS Y CUIDADO --- */}
          {currentStep === 2 && (
            <View className="space-y-5">
              <Card className="border-none shadow-sm space-y-4">
                <Text className="text-sm font-bold text-brand-dark">
                  👶 Q4: ¿Tenéis hijos en común?
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  <OptionButton
                    label="No"
                    selected={hijos === "no"}
                    onPress={() => setHijos("no")}
                  />
                  <OptionButton
                    label="Menores"
                    selected={hijos === "menores"}
                    onPress={() => setHijos("menores")}
                  />
                  <OptionButton
                    label="Mayores"
                    selected={hijos === "mayores"}
                    onPress={() => setHijos("mayores")}
                  />
                  <OptionButton
                    label="Ambos"
                    selected={hijos === "ambos"}
                    onPress={() => setHijos("ambos")}
                  />
                </View>

                {(hijos === "menores" || hijos === "ambos") && (
                  <View className="bg-brand-cream border border-gray-100 rounded-xl p-3.5 mt-2 space-y-4">
                    <View className="space-y-2">
                      <Text className="text-xs font-bold text-brand-dark">
                        ¿Cuántos hijos menores de edad tenéis?
                      </Text>
                      <View className="flex-row space-x-2">
                        {([1, 2, 3] as const).map((num) => (
                          <TouchableOpacity
                            key={num}
                            disabled={basicSubmitted}
                            onPress={() => setNumHijos(num)}
                            className={`flex-1 py-2 rounded-lg border items-center justify-center ${
                              numHijos === num ? "bg-brand-green border-brand-green" : "bg-white border-gray-200"
                            }`}
                          >
                            <Text className={`text-xs font-bold ${numHijos === num ? "text-brand-cream" : "text-gray-500"}`}>
                              {num === 3 ? "3 o más" : num}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Ages Inputs */}
                    <View className="space-y-3">
                      {Array.from({ length: numHijos }).map((_, idx) => (
                        <View key={idx}>
                          <TextInputCard
                            label={`Edad del hijo menor ${idx + 1}`}
                            value={edadesHijos[idx] || ""}
                            onChangeText={(text) => handleAgeChange(idx, text)}
                            placeholder="Ej. 6 años o 8 meses"
                          />
                        </View>
                      ))}
                    </View>

                    {/* Especial Needs */}
                    <View className="space-y-2 pt-2 border-t border-gray-100">
                      <Text className="text-xs font-bold text-brand-dark">
                        ¿Algún hijo menor tiene necesidades especiales (salud, escolaridad)?
                      </Text>
                      <View className="flex-row space-x-2">
                        <OptionButton
                          label="No"
                          selected={necesidadesEspeciales === "no"}
                          onPress={() => setNecesidadesEspeciales("no")}
                        />
                        <OptionButton
                          label="Sí"
                          selected={necesidadesEspeciales === "si"}
                          onPress={() => setNecesidadesEspeciales("si")}
                        />
                      </View>
                      {necesidadesEspeciales === "si" && (
                        <TextInputCard
                          label="Detalles de las necesidades especiales"
                          value={necesidadesEspecialesDetalles}
                          onChangeText={setNecesidadesEspecialesDetalles}
                          placeholder="Especifica necesidades médicas, educativas o de desarrollo..."
                          multiline={true}
                          numberOfLines={3}
                        />
                      )}
                    </View>
                  </View>
                )}
              </Card>

              {(hijos === "menores" || hijos === "ambos") && (
                <>
                  <Card className="border-none shadow-sm space-y-4">
                    <Text className="text-sm font-bold text-brand-dark">
                      ⚖️ Q5: Postura inicial sobre la custodia de los menores
                    </Text>
                    <View className="space-y-2">
                      <SelectorRow
                        label="Custodia compartida"
                        selected={ideaCustodia === "compartida"}
                        onPress={() => setIdeaCustodia("compartida")}
                      />
                      <SelectorRow
                        label="Custodia exclusiva para mí"
                        selected={ideaCustodia === "exclusiva-propia"}
                        onPress={() => setIdeaCustodia("exclusiva-propia")}
                      />
                      <SelectorRow
                        label="Custodia exclusiva para mi pareja"
                        selected={ideaCustodia === "exclusiva-pareja"}
                        onPress={() => setIdeaCustodia("exclusiva-pareja")}
                      />
                      <SelectorRow
                        label="Aún no lo tengo claro / Por negociar"
                        selected={ideaCustodia === "indeciso"}
                        onPress={() => setIdeaCustodia("indeciso")}
                      />
                    </View>
                    {ideaCustodia !== "indeciso" && (
                      <TextInputCard
                        label="Propuesta de reparto de tiempos (opcional)"
                        value={propuestaReparto}
                        onChangeText={setPropuestaReparto}
                        placeholder="Ej. Semanas alternas, fines de semana y tardes con pernocta..."
                        multiline={true}
                        numberOfLines={3}
                      />
                    )}
                  </Card>

                  <Card className="border-none shadow-sm space-y-4">
                    <Text className="text-sm font-bold text-brand-dark">
                      🧑‍🍼 Q6: ¿Quién realiza el cuidado diario en la actualidad?
                    </Text>
                    <View className="space-y-2">
                      <SelectorRow
                        label="Reparto equitativo entre ambos"
                        selected={cuidadoDiario === "reparto-equitativo"}
                        onPress={() => setCuidadoDiario("reparto-equitativo")}
                      />
                      <SelectorRow
                        label="Principalmente yo"
                        selected={cuidadoDiario === "principalmente-yo"}
                        onPress={() => setCuidadoDiario("principalmente-yo")}
                      />
                      <SelectorRow
                        label="Principalmente mi pareja"
                        selected={cuidadoDiario === "principalmente-pareja"}
                        onPress={() => setCuidadoDiario("principalmente-pareja")}
                      />
                      <SelectorRow
                        label="Contamos con fuerte apoyo externo (abuelos, cuidadores)"
                        selected={cuidadoDiario === "apoyo-externo"}
                        onPress={() => setCuidadoDiario("apoyo-externo")}
                      />
                    </View>
                  </Card>
                </>
              )}
            </View>
          )}

          {/* --- STEP 3: VIVIENDA Y BIENES --- */}
          {currentStep === 3 && (
            <View className="space-y-5">
              <Card className="border-none shadow-sm space-y-4">
                <Text className="text-sm font-bold text-brand-dark">
                  🏠 Q7: ¿Qué tipo de vivienda ha sido la residencia familiar?
                </Text>
                <View className="space-y-2">
                  <SelectorRow
                    label="Vivienda de alquiler"
                    selected={vivienda === "alquiler"}
                    onPress={() => setVivienda("alquiler")}
                  />
                  <SelectorRow
                    label="Vivienda en propiedad (con hipoteca conjunta)"
                    selected={vivienda === "propiedad-hipoteca"}
                    onPress={() => setVivienda("propiedad-hipoteca")}
                  />
                  <SelectorRow
                    label="Vivienda en propiedad (sin hipoteca)"
                    selected={vivienda === "propiedad-sin-hipoteca"}
                    onPress={() => setVivienda("propiedad-sin-hipoteca")}
                  />
                  <SelectorRow
                    label="Propiedad privativa de uno de los dos"
                    selected={vivienda === "propiedad-privativa"}
                    onPress={() => setVivienda("propiedad-privativa")}
                  />
                  <SelectorRow
                    label="Otros casos (cedida por familiares, etc.)"
                    selected={vivienda === "otra"}
                    onPress={() => setVivienda("otra")}
                  />
                </View>

                {vivienda === "alquiler" && (
                  <View className="bg-brand-cream border border-gray-100 rounded-xl p-3.5 mt-2 space-y-2">
                    <TextInputCard
                      label="Importe del alquiler mensual (€)"
                      value={alquilerImporte}
                      onChangeText={setAlquilerImporte}
                      placeholder="Ej. 750€"
                    />
                    <TextInputCard
                      label="¿A nombre de quién está el contrato?"
                      value={alquilerTitular}
                      onChangeText={setAlquilerTitular}
                      placeholder="Ej. A nombre de ambos, mío, de mi pareja..."
                    />
                  </View>
                )}

                {vivienda === "propiedad-hipoteca" && (
                  <View className="bg-brand-cream border border-gray-100 rounded-xl p-3.5 mt-2">
                    <TextInputCard
                      label="Cuota de hipoteca mensual aproximada (€)"
                      value={propiedadHipotecaCuota}
                      onChangeText={setPropiedadHipotecaCuota}
                      placeholder="Ej. 650€"
                    />
                  </View>
                )}

                <View className="pt-3 border-t border-gray-100 space-y-2">
                  <Text className="text-xs font-bold text-brand-dark">
                    ¿Quién propone quedarse en el uso de la vivienda familiar?
                  </Text>
                  <View className="space-y-2">
                    <SelectorRow
                      label="Yo"
                      selected={viviendaPropuestaUso === "yo"}
                      onPress={() => setViviendaPropuestaUso("yo")}
                    />
                    <SelectorRow
                      label="Mi pareja"
                      selected={viviendaPropuestaUso === "pareja"}
                      onPress={() => setViviendaPropuestaUso("pareja")}
                    />
                    <SelectorRow
                      label="Venderla / Dejar el alquiler"
                      selected={viviendaPropuestaUso === "vender"}
                      onPress={() => setViviendaPropuestaUso("vender")}
                    />
                    <SelectorRow
                      label="Aún por decidir/negociar"
                      selected={viviendaPropuestaUso === "indeciso"}
                      onPress={() => setViviendaPropuestaUso("indeciso")}
                    />
                  </View>
                </View>
              </Card>

              <Card className="border-none shadow-sm space-y-4">
                <Text className="text-sm font-bold text-brand-dark">
                  🏡 Q8: ¿Existen otras propiedades inmuebles en común?
                </Text>
                <View className="flex-row space-x-2">
                  <OptionButton
                    label="No"
                    selected={otrasPropiedades === "no"}
                    onPress={() => setOtrasPropiedades("no")}
                  />
                  <OptionButton
                    label="Sí"
                    selected={otrasPropiedades === "si"}
                    onPress={() => setOtrasPropiedades("si")}
                  />
                </View>
                {otrasPropiedades === "si" && (
                  <TextInputCard
                    label="Detalles de las propiedades y propuesta de reparto"
                    value={otrasPropiedadesDetalles}
                    onChangeText={setOtrasPropiedadesDetalles}
                    placeholder="Ej. Segunda residencia en la playa (proponemos venderla) y garaje común..."
                    multiline={true}
                    numberOfLines={3}
                  />
                )}
              </Card>

              <Card className="border-none shadow-sm space-y-4">
                <Text className="text-sm font-bold text-brand-dark">
                  🚗 Q9: ¿Tenéis vehículos en común (coches, motos)?
                </Text>
                <View className="flex-row space-x-2">
                  <OptionButton
                    label="No"
                    selected={vehiculosComunes === "no"}
                    onPress={() => setVehiculosComunes("no")}
                  />
                  <OptionButton
                    label="Sí"
                    selected={vehiculosComunes === "si"}
                    onPress={() => setVehiculosComunes("si")}
                  />
                </View>
                {vehiculosComunes === "si" && (
                  <TextInputCard
                    label="Detalles de los vehículos y propuesta de uso"
                    value={vehiculosComunesDetalles}
                    onChangeText={setVehiculosComunesDetalles}
                    placeholder="Ej. Coche familiar (para el que tiene custodia) y moto (para mí)..."
                    multiline={true}
                    numberOfLines={3}
                  />
                )}
              </Card>
            </View>
          )}

          {/* --- STEP 4: TRABAJO E INGRESOS --- */}
          {currentStep === 4 && (
            <View className="space-y-5">
              <Card className="border-none shadow-sm space-y-4">
                <Text className="text-sm font-bold text-brand-dark">
                  💼 Q10: ¿Cuál es tu situación laboral actual?
                </Text>
                <View className="space-y-2">
                  <SelectorRow
                    label="Empleado por cuenta ajena"
                    selected={situacionLaboral === "empleado-ajena"}
                    onPress={() => setSituacionLaboral("empleado-ajena")}
                  />
                  <SelectorRow
                    label="Autónomo / Empresario"
                    selected={situacionLaboral === "autonomo"}
                    onPress={() => setSituacionLaboral("autonomo")}
                  />
                  <SelectorRow
                    label="En desempleo (con prestación)"
                    selected={situacionLaboral === "desempleado-prestacion"}
                    onPress={() => setSituacionLaboral("desempleado-prestacion")}
                  />
                  <SelectorRow
                    label="En desempleo (sin prestación)"
                    selected={situacionLaboral === "desempleado-sin-prestacion"}
                    onPress={() => setSituacionLaboral("desempleado-sin-prestacion")}
                  />
                  <SelectorRow
                    label="Cuidado del hogar / Inactivo"
                    selected={situacionLaboral === "inactivo-hogar"}
                    onPress={() => setSituacionLaboral("inactivo-hogar")}
                  />
                  <SelectorRow
                    label="Jubilado / Pensionista por incapacidad"
                    selected={situacionLaboral === "jubilado-incapacitado"}
                    onPress={() => setSituacionLaboral("jubilado-incapacitado")}
                  />
                </View>
              </Card>

              <Card className="border-none shadow-sm space-y-4">
                <Text className="text-sm font-bold text-brand-dark">
                  💶 Q11: ¿Cuáles son tus ingresos netos mensuales?
                </Text>
                <View className="space-y-2">
                  <SelectorRow
                    label="Menos de 1.000€"
                    selected={ingresosNetos === "menos-1000"}
                    onPress={() => setIngresosNetos("menos-1000")}
                  />
                  <SelectorRow
                    label="Entre 1.000€ y 1.800€"
                    selected={ingresosNetos === "1000-1800"}
                    onPress={() => setIngresosNetos("1000-1800")}
                  />
                  <SelectorRow
                    label="Entre 1.800€ y 2.800€"
                    selected={ingresosNetos === "1800-2800"}
                    onPress={() => setIngresosNetos("1800-2800")}
                  />
                  <SelectorRow
                    label="Más de 2.800€"
                    selected={ingresosNetos === "mas-2800"}
                    onPress={() => setIngresosNetos("mas-2800")}
                  />
                </View>

                <View className="pt-3 border-t border-gray-100 space-y-2">
                  <Text className="text-xs font-bold text-brand-dark">
                    ¿Tienes otras fuentes de ingresos (ayudas, pensiones, rentas)?
                  </Text>
                  <View className="flex-row space-x-2">
                    <OptionButton
                      label="No"
                      selected={otrosIngresos === "no"}
                      onPress={() => setOtrosIngresos("no")}
                    />
                    <OptionButton
                      label="Sí"
                      selected={otrosIngresos === "si"}
                      onPress={() => setOtrosIngresos("si")}
                    />
                  </View>
                  {otrosIngresos === "si" && (
                    <TextInputCard
                      label="Detalles de los ingresos adicionales"
                      value={otrosIngresosDetalles}
                      onChangeText={setOtrosIngresosDetalles}
                      placeholder="Ej. Pensión de invalidez, ayuda familiar de 400€, renta de local..."
                    />
                  )}
                </View>
              </Card>

              <Card className="border-none shadow-sm space-y-4">
                <Text className="text-sm font-bold text-brand-dark">
                  ⚖️ Q12: ¿Consideras que existe un desequilibrio económico sustancial?
                </Text>
                <View className="space-y-2">
                  <SelectorRow
                    label="No, nuestra situación económica es equilibrada"
                    selected={desequilibrioEconomico === "no"}
                    onPress={() => setDesequilibrioEconomico("no")}
                  />
                  <SelectorRow
                    label="Sí, yo salgo claramente perjudicado/a tras la separación"
                    selected={desequilibrioEconomico === "si-yo-perjudicado"}
                    onPress={() => setDesequilibrioEconomico("si-yo-perjudicado")}
                  />
                  <SelectorRow
                    label="Sí, mi pareja sale claramente perjudicada/o"
                    selected={desequilibrioEconomico === "si-pareja-perjudicada"}
                    onPress={() => setDesequilibrioEconomico("si-pareja-perjudicada")}
                  />
                </View>
                {desequilibrioEconomico !== "no" && (
                  <TextInputCard
                    label="Explica brevemente el motivo"
                    value={desequilibrioDetalles}
                    onChangeText={setDesequilibrioDetalles}
                    placeholder="Ej. He estado 10 años sin trabajar para cuidar a los niños / Gano un 70% menos..."
                    multiline={true}
                    numberOfLines={3}
                  />
                )}
              </Card>
            </View>
          )}

          {/* --- STEP 5: DEUDAS, GASTOS Y OBJETIVOS --- */}
          {currentStep === 5 && (
            <View className="space-y-5">
              <Card className="border-none shadow-sm space-y-4">
                <Text className="text-sm font-bold text-brand-dark">
                  💳 Q13: ¿Existen deudas o préstamos conjuntos (excluyendo hipoteca)?
                </Text>
                <View className="flex-row space-x-2">
                  <OptionButton
                    label="No"
                    selected={deudasComunes === "no"}
                    onPress={() => setDeudasComunes("no")}
                  />
                  <OptionButton
                    label="Sí"
                    selected={deudasComunes === "si"}
                    onPress={() => setDeudasComunes("si")}
                  />
                </View>
                {deudasComunes === "si" && (
                  <TextInputCard
                    label="Importe pendiente y cuota mensual total aproximados"
                    value={deudasComunesDetalles}
                    onChangeText={setDeudasComunesDetalles}
                    placeholder="Ej. Préstamo de coche (8.000€ pendientes, 220€/mes)..."
                    multiline={true}
                    numberOfLines={3}
                  />
                )}
              </Card>

              <Card className="border-none shadow-sm space-y-4">
                <Text className="text-sm font-bold text-brand-dark">
                  📊 Q14: ¿Cómo gestionabais habitualmente los gastos familiares?
                </Text>
                <View className="space-y-2">
                  <SelectorRow
                    label="Cuenta común al 50% para todo"
                    selected={gestionGastos === "cuenta-comun-50"}
                    onPress={() => setGestionGastos("cuenta-comun-50")}
                  />
                  <SelectorRow
                    label="Cuenta común con aportaciones proporcionales a ingresos"
                    selected={gestionGastos === "cuenta-comun-proporcional"}
                    onPress={() => setGestionGastos("cuenta-comun-proporcional")}
                  />
                  <SelectorRow
                    label="Cuentas separadas y reparto informal"
                    selected={gestionGastos === "reparto-informal"}
                    onPress={() => setGestionGastos("reparto-informal")}
                  />
                  <SelectorRow
                    label="Uno de los dos asumía la totalidad de los gastos"
                    selected={gestionGastos === "uno-paga-todo"}
                    onPress={() => setGestionGastos("uno-paga-todo")}
                  />
                </View>
              </Card>

              <Card className="border-none shadow-sm space-y-4">
                <Text className="text-sm font-bold text-brand-dark">
                  🚩 Q15: Prioridad u objetivo principal de la Mediación
                </Text>
                <View className="space-y-2">
                  <SelectorRow
                    label="El bienestar y custodia de los hijos"
                    selected={prioridadMediacion === "bienestar-hijos"}
                    onPress={() => setPrioridadMediacion("bienestar-hijos")}
                  />
                  <SelectorRow
                    label="El reparto justo de los bienes y propiedades"
                    selected={prioridadMediacion === "reparto-bienes"}
                    onPress={() => setPrioridadMediacion("reparto-bienes")}
                  />
                  <SelectorRow
                    label="La liquidación y reparto de las deudas"
                    selected={prioridadMediacion === "liquidacion-deudas"}
                    onPress={() => setPrioridadMediacion("liquidacion-deudas")}
                  />
                  <SelectorRow
                    label="Fijar una pensión de alimentos/compensatoria justa"
                    selected={prioridadMediacion === "pension-alimentos"}
                    onPress={() => setPrioridadMediacion("pension-alimentos")}
                  />
                  <SelectorRow
                    label="Terminar rápido y con el menor conflicto"
                    selected={prioridadMediacion === "rapidez-paz"}
                    onPress={() => setPrioridadMediacion("rapidez-paz")}
                  />
                </View>

                <View className="pt-3 border-t border-gray-100 space-y-2">
                  <Text className="text-xs font-bold text-brand-dark">
                    ¿Cómo valoras la comunicación actual con tu pareja?
                  </Text>
                  <View className="flex-row space-x-2">
                    <OptionButton
                      label="Fluida"
                      selected={comunicacionPareja === "fluida"}
                      onPress={() => setComunicacionPareja("fluida")}
                    />
                    <OptionButton
                      label="Difícil"
                      selected={comunicacionPareja === "dificil"}
                      onPress={() => setComunicacionPareja("dificil")}
                    />
                    <OptionButton
                      label="Bloqueada"
                      selected={comunicacionPareja === "bloqueada"}
                      onPress={() => setComunicacionPareja("bloqueada")}
                    />
                  </View>
                </View>

                <TextInputCard
                  label="Comentarios adicionales o matices libres"
                  value={comentariosAdicionales}
                  onChangeText={setComentariosAdicionales}
                  placeholder="Añade cualquier otro aspecto importante que quieras que considere la IA..."
                  multiline={true}
                  numberOfLines={4}
                />
              </Card>
            </View>
          )}

          {/* --- BOTTOM WIZARD NAVIGATION BUTTONS --- */}
          <View className="pt-4 pb-4">
            <View className="flex-row space-x-3">
              {currentStep > 1 && (
                <Button
                  label="Atrás"
                  variant="outline"
                  className="flex-1"
                  onPress={() => setCurrentStep((prev) => prev - 1)}
                />
              )}
              
              <Button
                label={currentStep === 5 ? (basicSubmitted ? "Cuestionario Sellado" : "Finalizar y Sellar Bóveda") : "Continuar"}
                variant={currentStep === 5 && basicSubmitted ? "outline" : "primary"}
                disabled={currentStep === 5 && basicSubmitted}
                className="flex-1"
                loading={saveMutation.isPending}
                onPress={() => {
                  if (currentStep === 5) {
                    Alert.alert(
                      "¿Finalizar Cuestionario?",
                      "Una vez guardado y sellado, no podrás editar estas respuestas básicas ya que la IA comenzará a procesarlas. ¿Estás seguro?",
                      [
                        { text: "Cancelar", style: "cancel" },
                        { text: "Sí, Sellar", onPress: () => saveMutation.mutate(true) },
                      ]
                    );
                  } else {
                    setCurrentStep((prev) => prev + 1);
                  }
                }}
              />
            </View>

            {!basicSubmitted && (
              <TouchableOpacity
                disabled={saveMutation.isPending}
                onPress={() => saveMutation.mutate(false)}
                className="py-4.5 items-center justify-center mt-2.5"
              >
                <Text className="text-xs font-semibold text-brand-green-light underline">
                  Guardar Borrador actual
                </Text>
              </TouchableOpacity>
            )}
          </View>

        </ScrollView>
      )}
    </View>
  );
}
