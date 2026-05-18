import type { ReactNode } from "react";

interface MovieLayoutProps {
  children: ReactNode;
}

export default function MovieLayout({ children }: MovieLayoutProps) {
  return children;
}
