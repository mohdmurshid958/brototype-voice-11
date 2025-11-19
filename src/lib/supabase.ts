import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export type { User, Session };

export { supabase };

// Helper function to get current user
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper function to get user role
export const getUserRole = async (userId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();
  
  if (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
  
  return data?.role || null;
};

// Helper function to check if user is admin
export const isAdmin = async (userId: string): Promise<boolean> => {
  const role = await getUserRole(userId);
  return role === "admin";
};
