import { requireUser } from "@/app/lib/auth";
import { checkAdmin } from "@/app/utils/serverHelpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const auth = await requireUser(request);
  if ("response" in auth) return auth.response;

  const { isAdmin, error: roleError } = await checkAdmin(auth.user.id);

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
      id: auth.user.id,
      role: "ADMIN",
    },
  });
}
