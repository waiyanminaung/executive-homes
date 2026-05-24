"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  RHFInput,
  RHFInputGroup,
} from "@geckoui/geckoui";
import { Link2, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { classNames } from "@/utils/classNames";
import {
  WATCH_PARTY_HOST_TOKEN_QUERY_KEY,
  WATCH_PARTY_ROOM_QUERY_KEY,
} from "@/constants/watchParty";
import { useWrite } from "@/lib/spoosh";
import { RETURN_TO_QUERY_KEY } from "@/utils/navigationReturn";
import {
  watchPartyJoinSchema,
  type WatchPartyJoinInput,
} from "@/validation/watchPartySchema";

interface WatchPartyActionsProps {
  episodeId?: string;
  isSupported: boolean;
  movieId: string;
}

const joinFieldLabelClassName =
  "text-[10px] font-black uppercase tracking-widest text-white/50";
const joinFieldErrorClassName = "text-red-400 text-xs font-semibold";

const buildWatchUrl = (path: string, returnTo: string) => {
  const url = new URL(path, window.location.origin);

  url.searchParams.set(RETURN_TO_QUERY_KEY, returnTo);

  return `${url.pathname}${url.search}`;
};

const getDetailRoomPath = (
  path: string,
  movieId: string,
  episodeId?: string,
) => {
  const url = new URL(path, window.location.origin);
  const roomId = url.searchParams.get(WATCH_PARTY_ROOM_QUERY_KEY);
  const hostToken = url.searchParams.get(WATCH_PARTY_HOST_TOKEN_QUERY_KEY);
  const roomEpisodeId = url.searchParams.get("episode");

  if (!roomId) {
    return `/movie/${movieId}`;
  }

  const params = new URLSearchParams({
    room: roomId.toUpperCase(),
  });

  if (roomEpisodeId) {
    params.set("episode", roomEpisodeId);
  } else if (episodeId) {
    params.set("episode", episodeId);
  }

  if (hostToken) {
    params.set(WATCH_PARTY_HOST_TOKEN_QUERY_KEY, hostToken);
  }

  return `/movie/${movieId}?${params.toString()}`;
};

const getJoinPath = (
  codeOrUrl: string,
  movieId: string,
  episodeId?: string,
) => {
  const normalizedValue = codeOrUrl.trim();
  const parsedUrl = URL.canParse(normalizedValue)
    ? new URL(normalizedValue)
    : null;

  if (parsedUrl) {
    const roomId = parsedUrl.searchParams.get(WATCH_PARTY_ROOM_QUERY_KEY);
    const hostToken = parsedUrl.searchParams.get(WATCH_PARTY_HOST_TOKEN_QUERY_KEY);
    const roomEpisodeId = parsedUrl.searchParams.get("episode");

    if (roomId) {
      const params = new URLSearchParams({
        room: roomId.toUpperCase(),
      });

      if (roomEpisodeId) {
        params.set("episode", roomEpisodeId);
      } else if (episodeId) {
        params.set("episode", episodeId);
      }

      if (hostToken) {
        params.set(WATCH_PARTY_HOST_TOKEN_QUERY_KEY, hostToken);
      }

      return `/movie/${movieId}?${params.toString()}`;
    }
  }

  const params = new URLSearchParams({
    room: normalizedValue.toUpperCase(),
  });

  if (episodeId) {
    params.set("episode", episodeId);
  }

  return `/movie/${movieId}?${params.toString()}`;
};

export const WatchPartyActions = ({
  episodeId,
  isSupported,
  movieId,
}: WatchPartyActionsProps) => {
  const router = useRouter();
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const methods = useForm<WatchPartyJoinInput>({
    values: {
      codeOrUrl: "",
    },
    resolver: zodResolver(watchPartyJoinSchema) as unknown as Resolver<WatchPartyJoinInput>,
  });
  const createRoom = useWrite((api) => api("watch-party/rooms").POST());

  const handleCreateRoom = async () => {
    if (!isSupported) {
      return;
    }

    const result = await createRoom.trigger({
      body: {
        episodeId,
        movieId,
      },
    });

    if (!result.data) {
      return;
    }

    router.push(
      buildWatchUrl(
        getDetailRoomPath(result.data.watchPath, movieId, episodeId),
        `/movie/${movieId}`,
      ),
    );
  };

  const handleJoinRoom = methods.handleSubmit(async (values) => {
    router.push(
      buildWatchUrl(getJoinPath(values.codeOrUrl, movieId, episodeId), `/movie/${movieId}`),
    );

    setIsJoinOpen(false);
    methods.reset({
      codeOrUrl: "",
    });
  });

  return (
    <>
      <div className={classNames("flex flex-wrap gap-3 lg:gap-4")}>
        <Button
          type="button"
          onClick={handleCreateRoom}
          disabled={!isSupported || createRoom.loading}
          title={createRoom.loading ? "Creating room" : "Start watch party"}
          aria-label={createRoom.loading ? "Creating room" : "Start watch party"}
          className={classNames(
            "flex size-11 items-center justify-center rounded-xl",
            "border border-accent/25 lg:size-12",
            "transition-all active:scale-95",
            isSupported
              ? "bg-accent/10 text-accent hover:bg-accent/15"
              : "bg-white/5 text-white/30",
          )}
        >
          <Users className={classNames("w-4 h-4")} />
        </Button>

        <Button
          type="button"
          onClick={() => setIsJoinOpen(true)}
          title="Join room"
          aria-label="Join room"
          className={classNames(
            "flex size-11 items-center justify-center rounded-xl",
            "border border-white/5 bg-white/5 hover:bg-white/10 lg:size-12",
            "transition-all active:scale-95",
          )}
        >
          <Link2 className={classNames("w-4 h-4")} />
        </Button>
      </div>

      {!isSupported ? (
        <p
          className={classNames(
            "mt-5 text-xs font-semibold leading-5 text-white/45 max-w-xl",
          )}
        >
          Watch party works only with the built-in controllable video source for
          now. Embedded provider videos cannot be synchronized safely yet.
        </p>
      ) : null}

      {isJoinOpen ? (
        <div
          className={classNames(
            "fixed inset-0 z-[220] bg-black/80 backdrop-blur-xl",
            "flex items-center justify-center p-6",
          )}
          onClick={() => setIsJoinOpen(false)}
        >
          <div
            className={classNames(
              "bg-[#111] w-full max-w-md rounded-[2rem] p-5 lg:p-6",
              "border border-white/5 relative overflow-hidden mx-4",
            )}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsJoinOpen(false)}
              className={classNames(
                "absolute top-5 right-5 p-2 text-white/30 hover:text-white",
                "transition-colors",
              )}
            >
              <X className={classNames("w-5 h-5")} />
            </button>

            <div className={classNames("mb-5")}>
              <div
                className={classNames(
                  "text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2",
                )}
              >
                Watch Party
              </div>
              <h2
                className={classNames(
                  "text-xl lg:text-2xl font-black uppercase tracking-tighter",
                )}
              >
                Join an Existing Room
              </h2>
              <p
                className={classNames(
                  "text-white/50 text-xs lg:text-sm mt-1 leading-6",
                )}
              >
                Paste the room code or the shared room link. No account is needed.
              </p>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleJoinRoom} className={classNames("space-y-4")}>
                <RHFInputGroup
                  label="Room code or link"
                  labelClassName={joinFieldLabelClassName}
                  errorClassName={joinFieldErrorClassName}
                >
                  <RHFInput
                    name="codeOrUrl"
                    placeholder="AB12CD34 or https://..."
                  className={classNames(
                      "w-full bg-white/5 border border-white/5 rounded-xl",
                      "py-3 px-6 text-sm font-bold placeholder:text-white/15",
                      "focus-within:ring-1 focus-within:ring-accent/30",
                      "focus-within:bg-white/10 transition-all",
                    )}
                  />
                </RHFInputGroup>

                <Button
                  type="submit"
                  title="Join watch party"
                  aria-label="Join watch party"
                  className={classNames(
                    "w-full bg-accent text-black py-3 rounded-xl",
                    "font-black uppercase tracking-widest flex items-center",
                    "justify-center gap-3 hover:scale-[1.02] active:scale-95",
                    "transition-all text-[10px] lg:text-xs",
                  )}
                >
                  <Users className={classNames("w-4 h-4")} />
                </Button>
              </form>
            </FormProvider>
          </div>
        </div>
      ) : null}
    </>
  );
};
