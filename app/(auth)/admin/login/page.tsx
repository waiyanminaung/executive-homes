"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import { Input, LoadingButton } from "@geckoui/geckoui";
import { authClient } from "@/lib/auth-client";
import { classNames } from "@/utils/classNames";
import AdminAuthShell from "../components/AdminAuthShell";

export default function AdminLoginPage() {
  const router = useRouter();
  const session = authClient.useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session.data) {
      router.replace("/admin");
    }
  }, [router, session.data]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message ?? "Login failed. Please try again.");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/admin");
  };

  return (
    <AdminAuthShell
      title="Admin Login"
      subtitle="ပိတ်ကား - စီမံခန့်ခွဲသူ ဝင်ရောက်ရန်"
      footer={
        <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-white/10">
          စည်းကမ်းနှင့်အညီသာ အသုံးပြုပါ
        </p>
      }
    >
      <form onSubmit={handleLogin} className={classNames("space-y-6")}>
        <div className={classNames("space-y-2")}>
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">
            Email Address
          </label>
          <Input
            type="email"
            required
            placeholder="admin@patekar.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            prefix={<Mail className="w-4 h-4 text-white/20" />}
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-1.5 px-4 focus-within:ring-1 focus-within:ring-accent/30 transition-all"
            inputClassName="py-4 font-bold placeholder:text-white/10 bg-transparent text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">
            Password
          </label>
          <Input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            prefix={<Lock className="w-4 h-4 text-white/20" />}
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-1.5 px-4 focus-within:ring-1 focus-within:ring-accent/30 transition-all"
            inputClassName="py-4 font-bold placeholder:text-white/10 bg-transparent text-white"
          />
        </div>

        {error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        <LoadingButton
          type="submit"
          loading={loading}
          loadingText="Logging in..."
          className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/10 disabled:opacity-50 disabled:scale-100"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>ဝင်ရောက်မည်</span><ArrowRight className="w-5 h-5" /></>}
        </LoadingButton>
      </form>
    </AdminAuthShell>
  );
}
