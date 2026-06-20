import type { LucideIcon } from "lucide-react";
import {
  Waves, Dumbbell, Car, ShieldCheck, Wind, Wifi, TreeDeciduous, PawPrint,
  Utensils, Coffee, Tv, Snowflake, Baby, Key, Camera, Eye, Bath, Sun, Bike,
  ShoppingBag, Stethoscope, School, Zap, Droplets, Flame, Wrench, Star,
  Check, Building2, Home, Lock, Maximize2, Sailboat, Trees, PackageOpen,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Waves, Dumbbell, Car, ShieldCheck, Wind, Wifi, TreeDeciduous, PawPrint,
  Utensils, Coffee, Tv, Snowflake, Baby, Key, Camera, Eye, Bath, Sun, Bike,
  ShoppingBag, Stethoscope, School, Zap, Droplets, Flame, Wrench, Star,
  Check, Building2, Home, Lock, Maximize2, Sailboat, Trees, PackageOpen,
};

export function getLucideIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Check;
  return ICON_MAP[name] ?? Check;
}
