export const PK_PLAYER_CONTROLS_HIDE_DELAY_MS = 3500;

export const PK_PLAYER_KEYBOARD_OUTSIDE_CONTROLS_HIDE_DELAY_MS = 2000;

export const PK_PLAYER_CONTROLS_LEAVE_HIDE_DELAY_MS = 200;

export const PK_PLAYER_CENTER_FEEDBACK_MS = 900;

export const PK_PLAYER_LOADING_INDICATOR_DELAY_MS = 500;

export const PK_PLAYER_READY_STATE_HAVE_FUTURE_DATA = 3;

export const PK_PLAYER_SEEK_SECONDS = 15;

export const PK_PLAYER_DEFAULT_VOLUME = 0.6;

export const PK_PLAYER_PROGRESS_STORAGE_PREFIX = "pk-player-progress:";

export const PK_PLAYER_THEME_COLOR = "#e50914";

export const PK_PLAYER_PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5] as const;

const VIDEO_TEST_STREAM_SRC =
  process.env.NEXT_PUBLIC_VIDEO_TEST_STREAM_SRC ?? "";

const VIDEO_TEST_STREAM_POSTER =
  process.env.NEXT_PUBLIC_VIDEO_TEST_STREAM_POSTER ?? "";

export const VIDEO_TEST_STREAM = {
  title: "Big Buck Bunny",
  subtitle: "HLS streaming test",
  sourceType: "hls",
  src: VIDEO_TEST_STREAM_SRC,
  poster: VIDEO_TEST_STREAM_POSTER,
  duration: "10 min",
  rating: "Sample",
} as const;

export const VIDEO_TEST_EPISODES = [
  {
    title: "Sample HLS Stream",
    label: "Chunked .m3u8",
    isActive: true,
  },
  {
    title: "Movie CDN Stream",
    label: "Ready later",
    isActive: false,
  },
  {
    title: "Subtitle Track",
    label: "Optional",
    isActive: false,
  },
] as const;
