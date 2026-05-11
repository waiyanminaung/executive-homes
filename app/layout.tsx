import type { Metadata } from "next";
import { Inter, Noto_Sans_Myanmar } from "next/font/google";
import { GeckoUIPortal } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";

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
        "antialiased dark",
      )}
    >
      <body className={classNames("min-h-full", "flex", "flex-col")}>
        <NuqsAdapter>
          {children}
          <GeckoUIPortal />
        </NuqsAdapter>
      </body>
    </html>
  );
}
