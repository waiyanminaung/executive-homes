import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import AdminFloatingMenuClient from "./AdminFloatingMenuClient";

export default async function AdminFloatingMenu() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) return null;

  return <AdminFloatingMenuClient adminEmail={session.user.email ?? ""} />;
}
