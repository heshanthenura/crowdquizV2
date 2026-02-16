import { encrypt } from "@/app/utils/crypto";

export async function GET() {
  return new Response(
    JSON.stringify({ token: encrypt(Date.now().toString()) }),
  );
}
