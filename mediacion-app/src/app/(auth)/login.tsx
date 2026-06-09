import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [fullNameError, setFullNameError] = useState("");

  const validate = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");
    setFullNameError("");

    if (!email) {
      setEmailError("El correo es requerido");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("El correo electrónico no es válido");
      isValid = false;
    }

    if (!password) {
      setPasswordError("La contraseña es requerida");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      isValid = false;
    }

    if (isSignUp && !fullName) {
      setFullNameError("El nombre completo es requerido");
      isValid = false;
    }

    return isValid;
  };

  const handleResendConfirmation = async () => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Correo reenviado ✅",
        "Revisa tu bandeja de entrada y también la carpeta de spam."
      );
    }
  };

  const handleAuth = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });

        if (error) throw error;

        Alert.alert(
          "Registro Exitoso ✅",
          "Revisa tu correo para confirmar la cuenta (también la carpeta de spam).",
          [{ text: "Entendido" }]
        );
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Email sin confirmar — ofrecer reenvío
          if (
            error.message.toLowerCase().includes("email not confirmed") ||
            error.message.toLowerCase().includes("not confirmed")
          ) {
            Alert.alert(
              "Email no confirmado 📧",
              "Confirma tu cuenta desde el correo que te enviamos. ¿Quieres que te lo reenvíemos?",
              [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Reenviar correo",
                  onPress: handleResendConfirmation,
                },
              ]
            );
          } else if (
            error.message.toLowerCase().includes("invalid login credentials") ||
            error.message.toLowerCase().includes("invalid")
          ) {
            Alert.alert(
              "Credenciales incorrectas",
              "El correo o la contraseña no son correctos. Compruébalos y vuelve a intentarlo."
            );
          } else {
            throw error;
          }
        }
      }
    } catch (error: any) {
      Alert.alert(
        "Error de Autenticación",
        error.message || "Ha ocurrido un error inesperado."
      );
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In — disponible en producción
  const handleGoogleSignIn = () => {
    Alert.alert(
      "Google Sign In",
      "Esta opción estará disponible en producción mediante Google OAuth."
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-cream">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="px-6"
        >
          {/* Header / Logo */}
          <View className="items-center justify-center mt-12 mb-10">
            <View className="bg-brand-green w-16 h-16 rounded-3xl items-center justify-center shadow-lg shadow-brand-green/20 mb-4">
              <Text className="text-brand-cream text-3xl font-serif">M</Text>
            </View>
            <Text className="text-2xl font-serif font-bold text-brand-dark">
              MedIAdor
            </Text>
            <Text className="text-sm text-gray-500 mt-1.5 text-center px-4">
              Plataforma digital para la resolución amistosa de convenios de mediación
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <Text className="text-xl font-bold text-brand-dark mb-6">
              {isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}
            </Text>

            {isSignUp && (
              <Input
                label="Nombre Completo"
                placeholder="Juan Pérez"
                value={fullName}
                onChangeText={setFullName}
                error={fullNameError}
                autoCapitalize="words"
              />
            )}

            <Input
              label="Correo Electrónico"
              placeholder="juan@ejemplo.com"
              value={email}
              onChangeText={setEmail}
              error={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              error={passwordError}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text className="text-xs font-semibold text-brand-green">
                    {showPassword ? "OCULTAR" : "MOSTRAR"}
                  </Text>
                </TouchableOpacity>
              }
            />

            {!isSignUp && (
              <TouchableOpacity className="mb-6">
                <Text className="text-sm font-semibold text-brand-green text-right">
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>
            )}

            <Button
              label={isSignUp ? "Registrarse" : "Entrar"}
              onPress={handleAuth}
              loading={loading}
              className="mt-2"
            />
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="text-xs text-gray-400 px-3 uppercase tracking-wider font-semibold">
              o continuar con
            </Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Google OAuth */}
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            className="flex-row items-center justify-center bg-white border border-gray-200 py-3.5 px-6 rounded-xl active:opacity-80 mb-8"
          >
            <Text className="text-base font-bold text-gray-700">Google</Text>
          </TouchableOpacity>

          {/* Switch mode */}
          <View className="flex-row justify-center items-center mb-10">
            <Text className="text-sm text-gray-500">
              {isSignUp ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}
            </Text>
            <TouchableOpacity
              onPress={() => setIsSignUp(!isSignUp)}
              className="ml-1.5"
            >
              <Text className="text-sm font-bold text-brand-green">
                {isSignUp ? "Inicia Sesión" : "Regístrate ahora"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
