"use client";

import { Menu, MenuItem, MenuTrigger } from "@geckoui/geckoui";
import { selectPlaybackRate } from "@videojs/react";
import { Settings } from "lucide-react";
import {
  PK_PLAYER_PLAYBACK_RATES,
  PK_PLAYER_THEME_COLOR,
} from "@/constants/videoPlayer";
import { classNames } from "@/utils/classNames";
import { PKVideoControlButton } from "./PKVideoControlButton";
import { Player } from "./PKVideoPlayerInstance";

const formatPlaybackRate = (rate: number) => {
  if (rate === 1) {
    return "Normal";
  }

  return `${rate}x`;
};

export const PKVideoPlaybackSpeedMenu = () => {
  const playbackRate = Player.usePlayer(selectPlaybackRate);

  if (!playbackRate) {
    return null;
  }

  return (
    <Menu
      placement="top-end"
      menuClassName={classNames(
        "min-w-32 border border-white/10 bg-[#2f2e2a] p-2 text-white",
        "shadow-[0_18px_60px_rgba(0,0,0,0.45)]",
      )}
    >
      <MenuTrigger>
        {({ toggleMenu }) => (
          <PKVideoControlButton label="Playback speed" onClick={toggleMenu}>
            <Settings className={classNames("size-4.5 stroke-[2.4]")} />
          </PKVideoControlButton>
        )}
      </MenuTrigger>
      <div
        className={classNames(
          "px-3 py-1.5 text-[10px] whitespace-nowrap font-black uppercase tracking-wider text-white/55",
        )}
      >
        Playback speed
      </div>
      {PK_PLAYER_PLAYBACK_RATES.map((rate) => (
        <MenuItem
          key={rate}
          onClick={() => playbackRate.setPlaybackRate(rate)}
          className={classNames(
            "rounded-md px-3 py-1.5 text-[12px] font-bold",
            "hover:bg-white/10",
          )}
          style={
            rate === playbackRate.playbackRate
              ? { color: PK_PLAYER_THEME_COLOR }
              : undefined
          }
        >
          {formatPlaybackRate(rate)}
        </MenuItem>
      ))}
    </Menu>
  );
};
