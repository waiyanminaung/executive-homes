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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner className="size-6 text-primary-600" />
      </div>
    );
  }

  if (!session.data) {
    return null;
  }

  return children;
}
