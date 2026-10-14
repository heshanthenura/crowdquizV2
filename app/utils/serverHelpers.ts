import "server-only";
import { supabaseAdmin } from "@/app/utils/supabaseAdmin";

export const checkAdmin = async (
  userId: string,
): Promise<{ isAdmin: boolean; error?: string }> => {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return {
      isAdmin: false,
      error: error?.message ?? "User not found",
    };
  }

  return {
    isAdmin: data.role === "ADMIN",
  };
};
