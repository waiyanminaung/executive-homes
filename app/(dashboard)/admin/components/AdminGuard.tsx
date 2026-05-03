"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@geckoui/geckoui";
import { authClient } from "@/lib/auth-client";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const session = authClient.useSession();

  useEffect(() => {
    if (!session.isPending && !session.data) {
      router.replace("/admin/login");
    }
  }, [router, session.data, session.isPending]);

  if (session.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white/30">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!session.data) {
    return null;
  }

  return children;
}
