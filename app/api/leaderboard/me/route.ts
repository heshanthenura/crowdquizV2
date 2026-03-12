import { supabaseAdmin } from "@/app/utils/supabaseAdmin";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { data: me, error: meError } = await supabaseAdmin
    .from("leaderboard_with_users")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (meError && meError.code !== "PGRST116") {
    return NextResponse.json({ error: meError.message }, { status: 500 });
  }

  if (!me) {
    return NextResponse.json({ data: null });
  }

  const { count, error: rankError } = await supabaseAdmin
    .from("leaderboard_with_users")
    .select("id", { count: "exact", head: true })
    .gt("xp", me.xp);

  if (rankError) {
    return NextResponse.json({ error: rankError.message }, { status: 500 });
  }

  return NextResponse.json({
    data: {
      ...me,
      rank: (count ?? 0) + 1,
    },
  });
}
