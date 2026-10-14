import { requireUser } from "@/app/lib/auth";
import { supabaseAdmin } from "@/app/utils/supabaseAdmin";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if ("response" in auth) return auth.response;

  const { data: me, error: meError } = await supabaseAdmin
    .from("leaderboard_with_users")
    .select("*")
    .eq("user_id", auth.user.id)
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
