import type { ReactNode } from "react";

interface MovieLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

export default function MovieLayout({ children, modal }: MovieLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
