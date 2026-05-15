import { supabaseAdmin } from "@/app/utils/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { data: role, error: roleError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("user_id", data.user.id)
    .single();

  if (roleError) {
    console.error("Error fetching user role:", roleError);
    return NextResponse.json(
      { error: "Error fetching user role" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "ok",
    isAdmin: role.role === "ADMIN",
    user: {
      id: data.user.id,
      role: role.role,
    },
  });
}
