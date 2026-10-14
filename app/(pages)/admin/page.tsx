"use client";
import { useAuth } from "@/app/context/AuthContext";
import { checkAdmin } from "@/app/utils/helpers";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [status, setStatus] = useState<"checking" | "denied" | "ok">(
    "checking",
  );
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/");
      return;
    }

    (async () => {
      const res = await checkAdmin(user.id);
      if (res.isAdmin) {
        setStatus("ok");
      } else {
        setStatus("denied");
        router.push("/");
      }
    })();
  }, [user, loading, router]);

  if (status === "checking") return <div>Checking admin access…</div>;
  if (status === "denied") return <div>Access denied</div>;

  return <div>Admin Page</div>;
}
