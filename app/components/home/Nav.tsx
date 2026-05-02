"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";

interface NavProps {
  onRequestClick: () => void;
  isAdmin?: boolean;
}

export const HomeNav = ({ onRequestClick, isAdmin = false }: NavProps) => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={classNames(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#121212]/95 backdrop-blur-md py-4"
          : "bg-transparent py-6",
      )}
    >
      <div
        className={classNames(
          "container mx-auto px-4 flex items-center justify-between",
        )}
      >
        <div className={classNames("flex items-center gap-6")}>
          {isHome ? (
            <Link href="/" className={classNames("flex items-center gap-2")}>
              <span
                className={classNames(
                  "text-xl font-black tracking-tighter text-accent uppercase",
                )}
              >
                ပိတ်ကား
              </span>
            </Link>
          ) : (
            <Button
              type="button"
              variant="icon"
              onClick={() => router.back()}
              className={classNames(
                "p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white",
                "transition-all border border-white/5 flex items-center justify-center",
              )}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}

          {isAdmin ? (
            <Button
              type="button"
              onClick={() => router.push("/admin")}
              className={classNames(
                "px-4 py-2 bg-accent text-white text-[10px] font-black",
                "uppercase tracking-widest rounded-full hover:scale-105 active:scale-95",
                "transition-all shadow-lg shadow-accent/20",
              )}
            >
              Dashboard
            </Button>
          ) : null}
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={onRequestClick}
          className={classNames(
            "flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10",
            "rounded-full border border-white/5 transition-all active:scale-95",
          )}
        >
          <PlusCircle className="w-4 h-4 text-accent" />
          <span
            className={classNames(
              "text-[10px] font-black uppercase tracking-widest text-white/70",
            )}
          >
            ရုပ်ရှင်တောင်းဆိုရန်
          </span>
        </Button>
      </div>
    </nav>
  );
};
