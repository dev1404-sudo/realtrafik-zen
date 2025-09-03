export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      drivers: {
        Row: {
          assigned_vehicle_id: string | null
          created_at: string
          created_by: string | null
          driver_id: string
          email: string | null
          full_name: string
          id: string
          license_number: string
          phone_number: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_vehicle_id?: string | null
          created_at?: string
          created_by?: string | null
          driver_id: string
          email?: string | null
          full_name: string
          id?: string
          license_number: string
          phone_number?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_vehicle_id?: string | null
          created_at?: string
          created_by?: string | null
          driver_id?: string
          email?: string | null
          full_name?: string
          id?: string
          license_number?: string
          phone_number?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_assigned_vehicle_id_fkey"
            columns: ["assigned_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vehicle_tracking: {
        Row: {
          accuracy: number | null
          altitude: number | null
          created_at: string
          heading: number | null
          id: string
          latitude: number
          longitude: number
          speed: number
          timestamp: string
          vehicle_id: string
        }
        Insert: {
          accuracy?: number | null
          altitude?: number | null
          created_at?: string
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          speed?: number
          timestamp?: string
          vehicle_id: string
        }
        Update: {
          accuracy?: number | null
          altitude?: number | null
          created_at?: string
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          speed?: number
          timestamp?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_tracking_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          license_plate: string
          model: string | null
          speed_limit: number | null
          status: string
          type: string
          updated_at: string
          vehicle_id: string
          year: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          license_plate: string
          model?: string | null
          speed_limit?: number | null
          status?: string
          type: string
          updated_at?: string
          vehicle_id: string
          year?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          license_plate?: string
          model?: string | null
          speed_limit?: number | null
          status?: string
          type?: string
          updated_at?: string
          vehicle_id?: string
          year?: number | null
        }
        Relationships: []
      }
      violations: {
        Row: {
          created_at: string
          description: string | null
          detected_at: string
          detected_by: string | null
          driver_id: string | null
          evidence_url: string | null
          fine_amount: number
          fine_status: string
          id: string
          location_lat: number | null
          location_lng: number | null
          location_name: string | null
          speed_limit: number | null
          speed_recorded: number | null
          updated_at: string
          vehicle_id: string
          violation_type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          detected_at?: string
          detected_by?: string | null
          driver_id?: string | null
          evidence_url?: string | null
          fine_amount?: number
          fine_status?: string
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          speed_limit?: number | null
          speed_recorded?: number | null
          updated_at?: string
          vehicle_id: string
          violation_type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          detected_at?: string
          detected_by?: string | null
          driver_id?: string | null
          evidence_url?: string | null
          fine_amount?: number
          fine_status?: string
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          speed_limit?: number | null
          speed_recorded?: number | null
          updated_at?: string
          vehicle_id?: string
          violation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "violations_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "violations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
