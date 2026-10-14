import "server-only";
import type { User } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/app/lib/http";
import { supabaseAdmin } from "@/app/utils/supabaseAdmin";

type RequireUserResult = { user: User } | { response: NextResponse };

export const getBearerToken = (request: NextRequest): string | null => {
  const authHeader = request.headers.get("authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice("Bearer ".length) || null;
};

export const getOptionalUser = async (
  request: NextRequest,
): Promise<User | null> => {
  const token = getBearerToken(request);
  if (!token) return null;

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return null;
  return user;
};

export const requireUser = async (
  request: NextRequest,
): Promise<RequireUserResult> => {
  const token = getBearerToken(request);
  if (!token) {
    return { response: jsonError("Unauthorized", 401) };
  }

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    return { response: jsonError("Invalid token", 401) };
  }

  return { user };
};
