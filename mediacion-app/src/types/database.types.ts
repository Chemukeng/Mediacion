export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          kyc_verified: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          kyc_verified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          kyc_verified?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedSource: "auth";
          }
        ];
      };
      cases: {
        Row: {
          id: string;
          user_a_id: string;
          user_b_id: string | null;
          status: "pending_partner" | "questionnaires" | "negotiation" | "signing" | "completed";
          invite_token: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_a_id: string;
          user_b_id?: string | null;
          status?: "pending_partner" | "questionnaires" | "negotiation" | "signing" | "completed";
          invite_token?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_a_id?: string;
          user_b_id?: string | null;
          status?: "pending_partner" | "questionnaires" | "negotiation" | "signing" | "completed";
          invite_token?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cases_user_a_id_fkey";
            columns: ["user_a_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedSource: "public";
          },
          {
            foreignKeyName: "cases_user_b_id_fkey";
            columns: ["user_b_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedSource: "public";
          }
        ];
      };
      questionnaire_basic: {
        Row: {
          id: string;
          case_id: string;
          user_id: string;
          monthly_income: number | null;
          has_children: boolean;
          children_details: string | null;
          has_properties: boolean;
          properties_details: string | null;
          has_debts: boolean;
          debts_details: string | null;
          submitted_at: string | null;
        };
        Insert: {
          id?: string;
          case_id: string;
          user_id: string;
          monthly_income?: number | null;
          has_children?: boolean;
          children_details?: string | null;
          has_properties?: boolean;
          properties_details?: string | null;
          has_debts?: boolean;
          debts_details?: string | null;
          submitted_at?: string | null;
        };
        Update: {
          id?: string;
          case_id?: string;
          user_id?: string;
          monthly_income?: number | null;
          has_children?: boolean;
          children_details?: string | null;
          has_properties?: boolean;
          properties_details?: string | null;
          has_debts?: boolean;
          debts_details?: string | null;
          submitted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "questionnaire_basic_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedSource: "public";
          },
          {
            foreignKeyName: "questionnaire_basic_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedSource: "public";
          }
        ];
      };
      questionnaire_dynamic: {
        Row: {
          id: string;
          case_id: string;
          user_id: string;
          question_text: string;
          answer_text: string | null;
          order_index: number | null;
          answered_at: string | null;
        };
        Insert: {
          id?: string;
          case_id: string;
          user_id: string;
          question_text: string;
          answer_text?: string | null;
          order_index?: number | null;
          answered_at?: string | null;
        };
        Update: {
          id?: string;
          case_id?: string;
          user_id?: string;
          question_text?: string;
          answer_text?: string | null;
          order_index?: number | null;
          answered_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "questionnaire_dynamic_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedSource: "public";
          },
          {
            foreignKeyName: "questionnaire_dynamic_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedSource: "public";
          }
        ];
      };
      agreements: {
        Row: {
          id: string;
          case_id: string;
          topic: string;
          ai_summary: string;
          user_a_status: "pending" | "accepted" | "rejected";
          user_b_status: "pending" | "accepted" | "rejected";
          ai_suggestion: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          case_id: string;
          topic: string;
          ai_summary: string;
          user_a_status?: "pending" | "accepted" | "rejected";
          user_b_status?: "pending" | "accepted" | "rejected";
          ai_suggestion?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          case_id?: string;
          topic?: string;
          ai_summary?: string;
          user_a_status?: "pending" | "accepted" | "rejected";
          user_b_status?: "pending" | "accepted" | "rejected";
          ai_suggestion?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "agreements_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedSource: "public";
          }
        ];
      };
      assistant_messages: {
        Row: {
          id: string;
          case_id: string;
          user_id: string;
          role: "user" | "assistant";
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          case_id: string;
          user_id: string;
          role: "user" | "assistant";
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          case_id?: string;
          user_id?: string;
          role?: "user" | "assistant";
          content?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "assistant_messages_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedSource: "public";
          },
          {
            foreignKeyName: "assistant_messages_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedSource: "public";
          }
        ];
      };
      payments: {
        Row: {
          id: string;
          case_id: string;
          user_id: string;
          stripe_session_id: string | null;
          amount_cents: number;
          type: "full" | "half";
          status: "pending" | "paid" | "failed";
          created_at: string;
        };
        Insert: {
          id?: string;
          case_id: string;
          user_id: string;
          stripe_session_id?: string | null;
          amount_cents: number;
          type: "full" | "half";
          status?: "pending" | "paid" | "failed";
          created_at?: string;
        };
        Update: {
          id?: string;
          case_id?: string;
          user_id?: string;
          stripe_session_id?: string | null;
          amount_cents?: number;
          type?: "full" | "half";
          status?: "pending" | "paid" | "failed";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedSource: "public";
          },
          {
            foreignKeyName: "payments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedSource: "public";
          }
        ];
      };
    };
  };
}
