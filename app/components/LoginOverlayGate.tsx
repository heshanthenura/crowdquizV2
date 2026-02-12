"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import AskLogin from "@/app/components/AskLogin";

export default function LoginOverlayGate() {
  const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(true);

  if (user || !showLoginPrompt) {
    return null;
  }

  return <AskLogin onClose={() => setShowLoginPrompt(false)} />;
}
