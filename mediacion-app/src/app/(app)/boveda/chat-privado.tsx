import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth.store";
import { useCaseStore } from "@/store/case.store";
import { ScreenHeader } from "@/components/shared/ScreenHeader";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export default function ChatPrivado() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { activeCase } = useCaseStore();
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  // 1. Fetch Chat History
  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["assistantMessages", activeCase?.id, user?.id],
    queryFn: async () => {
      if (!activeCase || !user) return [];
      const { data, error } = await supabase
        .from("assistant_messages")
        .select("*")
        .eq("case_id", activeCase.id)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading chat messages:", error);
        return [];
      }
      return data || [];
    },
    enabled: !!activeCase?.id && !!user?.id,
  });

  // Scroll to bottom when messages load or change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // 2. Send Message Mutation (invokes Edge Function)
  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!activeCase || !user) throw new Error("No hay expediente activo o sesión activa.");

      const { data, error } = await supabase.functions.invoke("assistant-chat", {
        body: {
          case_id: activeCase.id,
          user_id: user.id,
          message: text,
        },
      });

      if (error) throw error;
      return data;
    },
    onMutate: async (newText) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["assistantMessages", activeCase?.id, user?.id] });
      const previousMessages = queryClient.getQueryData<ChatMessage[]>(["assistantMessages", activeCase?.id, user?.id]);

      if (previousMessages) {
        queryClient.setQueryData<ChatMessage[]>(
          ["assistantMessages", activeCase?.id, user?.id],
          [
            ...previousMessages,
            {
              id: Math.random().toString(),
              role: "user",
              content: newText,
              created_at: new Date().toISOString(),
            },
          ]
        );
      }
      return { previousMessages };
    },
    onError: (err: any, _, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(["assistantMessages", activeCase?.id, user?.id], context.previousMessages);
      }
      Alert.alert("Error al enviar", err.message || "No se pudo comunicar con el asistente.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assistantMessages", activeCase?.id, user?.id] });
    },
  });

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;

    setInputText("");
    sendMessageMutation.mutate(text);
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";

    return (
      <View className={`flex-row my-1.5 ${isUser ? "justify-end" : "justify-start"}`}>
        <View
          className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? "bg-[#13382c] rounded-tr-none"
              : "bg-white border border-gray-100 rounded-tl-none"
          }`}
        >
          {!isUser && (
            <Text className="text-[9px] font-bold text-brand-gold uppercase tracking-wider mb-1">
              Mediador IA ✨
            </Text>
          )}
          <Text
            className={`text-xs leading-relaxed ${
              isUser ? "text-brand-cream font-medium" : "text-brand-dark"
            }`}
          >
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      className="flex-1 bg-brand-cream"
    >
      <ScreenHeader title="Diario de Desahogo" subtitle="Mediador IA Confidencial" showBackButton={true} />

      {/* Intro disclaimer */}
      <View className="bg-brand-green/5 border-b border-brand-green/10 px-4 py-3 flex-row space-x-2">
        <Ionicons name="lock-closed" size={14} color="#1a3e31" className="mt-0.5" />
        <Text className="text-[10px] text-brand-green-light italic flex-1 leading-relaxed">
          Tus mensajes e ideas compartidas en este chat son 100% privadas y encriptadas. Tu expareja no tiene acceso a esta conversación.
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1a3e31" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          className="flex-1"
        />
      )}

      {/* Typing indicator */}
      {sendMessageMutation.isPending && (
        <View className="px-4 py-2 flex-row items-center space-x-2">
          <ActivityIndicator size="small" color="#B5944E" />
          <Text className="text-[10px] text-brand-muted italic">
            El Asistente está escribiendo...
          </Text>
        </View>
      )}

      {/* Input bar */}
      <View className="bg-[#fbf9f4] border-t border-gray-100 p-3 flex-row items-center space-x-2 pb-6">
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Escribe un mensaje privado..."
          placeholderTextColor="#9ca3af"
          onSubmitEditing={handleSend}
          className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2.5 text-xs text-brand-dark"
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!inputText.trim() || sendMessageMutation.isPending}
          className={`w-9 h-9 rounded-full items-center justify-center ${
            inputText.trim() && !sendMessageMutation.isPending ? "bg-[#13382c]" : "bg-gray-200"
          }`}
        >
          <Ionicons
            name="send"
            size={16}
            color={inputText.trim() && !sendMessageMutation.isPending ? "#fbf9f4" : "#9ca3af"}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
