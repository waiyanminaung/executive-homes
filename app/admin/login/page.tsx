"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import { Input, LoadingButton } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import { authClient } from "@/lib/auth-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <div
      className={classNames(
        "min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6",
        "bg-linear-to-br from-[#0A0A0A] via-[#111] to-accent/5",
      )}
    >
      <div className={classNames("max-w-md w-full")}>
        <div className={classNames("text-center mb-6 lg:mb-10")}>
          <h1
            className={classNames(
              "text-3xl lg:text-5xl font-black uppercase tracking-tighter",
              "text-white mb-2",
            )}
          >
            Admin Login
          </h1>
          <p
            className={classNames(
              "text-white/40 text-[9px] lg:text-[10px] font-black",
              "uppercase tracking-[0.5em]",
            )}
          >
            ပိတ်ကား - စီမံခန့်ခွဲသူ ဝင်ရောက်ရန်
          </p>
        </div>

        <div
          className={classNames(
            "bg-[#111] border border-white/5 rounded-3xl",
            "lg:rounded-[2.5rem] p-6 lg:p-10 shadow-2xl",
            "relative overflow-hidden",
          )}
        >
          <div
            className={classNames(
              "absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-accent to-transparent opacity-50",
            )}
          />

          <form onSubmit={handleLogin} className={classNames("space-y-6")}>
            <div className={classNames("space-y-2")}>
              <label
                className={classNames(
                  "text-[10px] font-black uppercase tracking-widest text-white/40",
                  "ml-1",
                )}
              >
                Email Address
              </label>
              <Input
                type="email"
                required
                placeholder="admin@patekar.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                prefix={
                  <Mail className={classNames("w-4 h-4 text-white/20")} />
                }
                className={classNames(
                  "w-full bg-white/5 border border-white/5 rounded-2xl",
                  "py-1.5 px-4 focus-within:ring-1 focus-within:ring-accent/30",
                  "transition-all",
                )}
                inputClassName={classNames(
                  "py-4 font-bold placeholder:text-white/10",
                  "bg-transparent text-white",
                )}
              />
            </div>

            <div className={classNames("space-y-2")}>
              <label
                className={classNames(
                  "text-[10px] font-black uppercase tracking-widest text-white/40",
                  "ml-1",
                )}
              >
                Password
              </label>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                prefix={
                  <Lock className={classNames("w-4 h-4 text-white/20")} />
                }
                className={classNames(
                  "w-full bg-white/5 border border-white/5 rounded-2xl",
                  "py-1.5 px-4 focus-within:ring-1 focus-within:ring-accent/30",
                  "transition-all",
                )}
                inputClassName={classNames(
                  "py-4 font-bold placeholder:text-white/10",
                  "bg-transparent text-white",
                )}
              />
            </div>

            {error ? (
              <div
                className={classNames(
                  "p-4 bg-red-500/10 border border-red-500/20 rounded-xl",
                  "flex items-center gap-3 text-red-500 text-xs font-bold",
                )}
              >
                <AlertCircle className={classNames("w-4 h-4 shrink-0")} />
                <span>{error}</span>
              </div>
            ) : null}

            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Logging in..."
              className={classNames(
                "w-full bg-white text-black py-5 rounded-2xl",
                "font-black uppercase tracking-widest flex items-center",
                "justify-center gap-3 hover:scale-[1.02] active:scale-95",
                "transition-all shadow-xl shadow-white/10",
                "disabled:opacity-50 disabled:scale-100",
              )}
            >
              {loading ? (
                <Loader2 className={classNames("w-5 h-5 animate-spin")} />
              ) : (
                <>
                  <span>ဝင်ရောက်မည်</span>
                  <ArrowRight className={classNames("w-5 h-5")} />
                </>
              )}
            </LoadingButton>
          </form>
        </div>

        <p
          className={classNames(
            "text-center mt-10 text-[10px] font-black",
            "uppercase tracking-[0.3em] text-white/10",
          )}
        >
          စည်းကမ်းနှင့်အညီသာ အသုံးပြုပါ
        </p>
      </div>
    </div>
  );
}
