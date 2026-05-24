import { createSerializer, parseAsString } from "nuqs";
import {
  WATCH_PARTY_HOST_TOKEN_QUERY_KEY,
  WATCH_PARTY_ROOM_QUERY_KEY,
} from "@/constants/watchParty";
import { RETURN_TO_QUERY_KEY } from "@/utils/navigationReturn";

export const MOVIE_PLAY_QUERY_KEY = "play";

export const MOVIE_EPISODE_QUERY_KEY = "episode";

export const serializeMovieDetailSearchParams = createSerializer({
  [MOVIE_EPISODE_QUERY_KEY]: parseAsString,
  [MOVIE_PLAY_QUERY_KEY]: parseAsString,
  [RETURN_TO_QUERY_KEY]: parseAsString,
  [WATCH_PARTY_HOST_TOKEN_QUERY_KEY]: parseAsString,
  [WATCH_PARTY_ROOM_QUERY_KEY]: parseAsString,
});
