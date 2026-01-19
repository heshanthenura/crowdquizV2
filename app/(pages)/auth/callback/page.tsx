"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/utils/supabase";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      router.replace("/");
      return;
    }

    supabase.auth
      .exchangeCodeForSession(code)
      .then(() => {
        router.replace("/");
      })
      .catch((err) => {
        console.error("Auth error:", err);
        router.replace("/");
      });
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Completing sign in...</p>
    </div>
  );
}
