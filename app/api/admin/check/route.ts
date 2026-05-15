import { supabaseAdmin } from "@/app/utils/supabaseAdmin";
import { checkAdmin } from "@/app/utils/serverHelpers";
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

  const { isAdmin, error: roleError } = await checkAdmin(data.user.id);

  if (roleError) {
    console.error("Error fetching user role:", roleError);
    return NextResponse.json(
      { error: "Error fetching user role" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "ok",
    isAdmin: isAdmin,
    user: {
      id: data.user.id,
      role: "ADMIN",
    },
  });
}
