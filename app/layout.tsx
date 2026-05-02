import type { Metadata } from "next";
import { Inter, Noto_Sans_Myanmar } from "next/font/google";
import { classNames } from "@/utils/classNames";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const myanmar = Noto_Sans_Myanmar({
  variable: "--font-myanmar",
  subsets: ["myanmar"],
});

export const metadata: Metadata = {
  title: "Patekar",
  description: "Patekar movie library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={classNames(
        inter.variable,
        myanmar.variable,
        "h-full",
        "antialiased",
      )}
    >
      <body className={classNames("min-h-full", "flex", "flex-col")}>
        {children}
      </body>
    </html>
  );
}
