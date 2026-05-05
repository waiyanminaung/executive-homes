"use client";

import { type ChangeEvent, useState } from "react";
import { useFormContext } from "react-hook-form";
import { DownloadCloud } from "lucide-react";
import { Input, LoadingButton } from "@geckoui/geckoui";
import { useWrite } from "@/lib/spoosh";
import { classNames } from "@/utils/classNames";
import type { MovieCreateInput } from "@/validation/moviesSchema";

export default function AdminTmdbImportPanel() {
  const [movieId, setMovieId] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const methods = useFormContext<MovieCreateInput>();
  const { trigger, loading } = useWrite((api) => api("tmdb/movie").POST());

  const handleMovieIdChange = (value: ChangeEvent<HTMLInputElement> | string) => {
    if (typeof value === "string") {
      setMovieId(value);
      return;
    }

    setMovieId(value.target.value);
  };

  const handleImport = async () => {
    const trimmedMovieId = movieId.trim();
    setImportError(null);

    if (!trimmedMovieId) {
      setImportError("TMDB movie ID is required.");
      return;
    }

    const parsedMovieId = Number(trimmedMovieId);

    if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
      setImportError("Enter a valid TMDB movie ID.");
      return;
    }

    const result = await trigger({
      body: {
        movieId: parsedMovieId,
      },
    });

    if (result.error) {
      setImportError(result.error.message);
      return;
    }

    methods.reset({
      ...methods.getValues(),
      ...result.data,
    });
  };

  return (
    <div
      className={classNames(
        "rounded-3xl border border-white/5 bg-white/[0.03] p-4",
        "lg:p-5",
      )}
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          className={classNames(
            "flex size-9 items-center justify-center rounded-xl bg-[#01B4E4]/10",
            "text-[#01B4E4]",
          )}
        >
          <DownloadCloud className="size-4" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
            Import from TheMovieDB
          </p>
          <p className="mt-1 text-xs text-white/35">
            Paste a TMDB movie ID to fill this form.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <Input
          value={movieId}
          onChange={handleMovieIdChange}
          placeholder="TMDB movie ID"
          className="rounded-2xl border-white/5 bg-white/5 px-4"
          inputClassName="font-bold placeholder:text-white/20"
        />
        <LoadingButton
          type="button"
          loading={loading}
          loadingText="Importing..."
          onClick={handleImport}
          className="rounded-2xl bg-white px-5 text-[10px] font-black uppercase tracking-widest text-black hover:bg-white/90"
        >
          Import
        </LoadingButton>
      </div>

      {importError ? (
        <p className="mt-3 text-xs font-semibold text-red-400">
          {importError}
        </p>
      ) : null}
    </div>
  );
}
