export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      campaign: {
        Row: {
          advancement_type: Database["public"]["Enums"]["advancement"]
          allow_feats: boolean
          created_at: string
          encumbrance_type: Database["public"]["Enums"]["encumbrance"]
          hitpoint_type: Database["public"]["Enums"]["hitpoint_management"]
          id: number
          multiclass_requirements: boolean
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          advancement_type?: Database["public"]["Enums"]["advancement"]
          allow_feats?: boolean
          created_at?: string
          encumbrance_type?: Database["public"]["Enums"]["encumbrance"]
          hitpoint_type?: Database["public"]["Enums"]["hitpoint_management"]
          id?: number
          multiclass_requirements?: boolean
          name?: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          advancement_type?: Database["public"]["Enums"]["advancement"]
          allow_feats?: boolean
          created_at?: string
          encumbrance_type?: Database["public"]["Enums"]["encumbrance"]
          hitpoint_type?: Database["public"]["Enums"]["hitpoint_management"]
          id?: number
          multiclass_requirements?: boolean
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_campaign_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_character: {
        Row: {
          advancement_type: Database["public"]["Enums"]["advancement"]
          allow_feats: boolean
          campaign_id: number | null
          charisma: number
          constitution: number
          created_at: string
          dexterity: number
          encumbrance_type: Database["public"]["Enums"]["encumbrance"]
          hitpoint_type: Database["public"]["Enums"]["hitpoint_management"]
          hp: number | null
          id: number
          intelligence: number
          multiclass_requirements: boolean
          name: string
          profile_id: string
          race: string | null
          strength: number
          subrace: string | null
          temp_hp: number | null
          updated_at: string
          wisdom: number
        }
        Insert: {
          advancement_type?: Database["public"]["Enums"]["advancement"]
          allow_feats?: boolean
          campaign_id?: number | null
          charisma?: number
          constitution?: number
          created_at?: string
          dexterity?: number
          encumbrance_type?: Database["public"]["Enums"]["encumbrance"]
          hitpoint_type?: Database["public"]["Enums"]["hitpoint_management"]
          hp?: number | null
          id?: number
          intelligence?: number
          multiclass_requirements?: boolean
          name?: string
          profile_id: string
          race?: string | null
          strength?: number
          subrace?: string | null
          temp_hp?: number | null
          updated_at?: string
          wisdom?: number
        }
        Update: {
          advancement_type?: Database["public"]["Enums"]["advancement"]
          allow_feats?: boolean
          campaign_id?: number | null
          charisma?: number
          constitution?: number
          created_at?: string
          dexterity?: number
          encumbrance_type?: Database["public"]["Enums"]["encumbrance"]
          hitpoint_type?: Database["public"]["Enums"]["hitpoint_management"]
          hp?: number | null
          id?: number
          intelligence?: number
          multiclass_requirements?: boolean
          name?: string
          profile_id?: string
          race?: string | null
          strength?: number
          subrace?: string | null
          temp_hp?: number | null
          updated_at?: string
          wisdom?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_player_character_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_player_character_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
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
      abilityscore_display: "modifiers" | "scores"
      advancement: "milestone" | "xp"
      encumbrance: "off" | "use" | "variant"
      hitpoint_management: "fixed" | "manual"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
