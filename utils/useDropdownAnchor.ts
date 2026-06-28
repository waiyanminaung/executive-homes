"use client";

import { useState, useRef, useEffect } from "react";

interface DropdownPos {
  top: number;
  left: number;
  width: number;
}

export function useDropdownAnchor(dropdownRef: React.RefObject<HTMLElement | null>) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<DropdownPos>({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (!dropdownOpen) return;

    const updatePos = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (anchorRef.current?.contains(target) || dropdownRef.current?.contains(target)) return;
      setDropdownOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [dropdownOpen, dropdownRef]);

  const openDropdown = () => {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    setDropdownOpen(true);
  };

  const closeDropdown = () => setDropdownOpen(false);

  return { anchorRef, dropdownOpen, dropdownPos, openDropdown, closeDropdown };
}
