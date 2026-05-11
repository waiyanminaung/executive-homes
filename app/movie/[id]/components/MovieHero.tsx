"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import type { Content } from "@/types/content";

interface MovieHeroProps {
  movie: Content;
}

export const MovieHero = ({ movie }: MovieHeroProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  return (
    <div
      className={classNames(
        "relative h-[50vh] lg:h-[90vh] overflow-hidden bg-black",
      )}
    >
      <Image
        src={movie.backdropUrl}
        alt={movie.title}
        fill
        priority
        sizes="100vw"
        className={classNames("object-cover")}
        referrerPolicy="no-referrer"
      />
      <div
        className={classNames(
          "absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent",
        )}
      />

      <Button
        type="button"
        variant="icon"
        onClick={handleBack}
        className={classNames(
          "absolute left-4 top-4 z-20 size-11 rounded-full",
          "border border-white/10 bg-black/45 text-white backdrop-blur-md",
          "transition-all hover:bg-white/10 active:scale-95",
          "lg:left-8 lg:top-8 lg:size-12",
        )}
        aria-label="Back"
      >
        <ArrowLeft className={classNames("size-5")} />
      </Button>

      <div
        className={classNames(
          "absolute inset-0 flex items-center justify-center p-6",
        )}
      >
        <Link
          href={`/movie/${movie.id}/play`}
          scroll={false}
          replace
          className={classNames(
            "w-20 h-20 lg:w-28 lg:h-28 bg-accent/90 backdrop-blur-sm",
            "rounded-full flex items-center justify-center text-white",
            "shadow-2xl shadow-accent/20 transition-colors border border-white/10",
          )}
          aria-label="Play movie"
        >
          <Play
            className={classNames("w-8 h-8 lg:w-12 lg:h-12 fill-current ml-1")}
          />
        </Link>
      </div>
    </div>
  );
};
