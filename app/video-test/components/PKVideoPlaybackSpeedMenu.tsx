"use client";

import { Menu, MenuItem, MenuTrigger } from "@geckoui/geckoui";
import { Settings } from "lucide-react";
import {
  PK_PLAYER_PLAYBACK_RATES,
  PK_PLAYER_THEME_COLOR,
} from "@/constants/videoPlayer";
import { classNames } from "@/utils/classNames";
import { PKVideoControlButton } from "./PKVideoControlButton";

interface PKVideoPlaybackSpeedMenuProps {
  playbackRate: number;
  onPlaybackRateChange: (playbackRate: number) => void;
}

const formatPlaybackRate = (rate: number) => {
  if (rate === 1) {
    return "Normal";
  }

  return `${rate}x`;
};

export const PKVideoPlaybackSpeedMenu = ({
  playbackRate,
  onPlaybackRateChange,
}: PKVideoPlaybackSpeedMenuProps) => (
  <Menu
    placement="top-end"
    menuClassName={classNames(
      "min-w-28 border border-white/10 bg-[#2f2e2a] p-1 text-white",
      "shadow-[0_18px_60px_rgba(0,0,0,0.45)]",
    )}
  >
    <MenuTrigger>
      {({ toggleMenu }) => (
        <PKVideoControlButton label="Playback speed" onClick={toggleMenu}>
          <Settings className={classNames("size-[18px] stroke-[2.4]")} />
        </PKVideoControlButton>
      )}
    </MenuTrigger>
    <div
      className={classNames(
        "px-2 py-1 text-[9px] whitespace-nowrap font-black uppercase tracking-wider text-white/55",
      )}
    >
      Playback speed
    </div>
    {PK_PLAYER_PLAYBACK_RATES.map((rate) => (
      <MenuItem
        key={rate}
        onClick={() => onPlaybackRateChange(rate)}
        className={classNames(
          "rounded-md px-2 py-1 text-[11px] font-bold",
          "hover:bg-white/10",
        )}
        style={
          rate === playbackRate ? { color: PK_PLAYER_THEME_COLOR } : undefined
        }
      >
        {formatPlaybackRate(rate)}
      </MenuItem>
    ))}
  </Menu>
);
