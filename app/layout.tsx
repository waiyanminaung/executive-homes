import type { Metadata } from "next";
import { Roboto, Noto_Sans_Myanmar } from "next/font/google";
import { GeckoUIPortal } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const myanmar = Noto_Sans_Myanmar({
  variable: "--font-myanmar",
  subsets: ["myanmar"],
});

export const metadata: Metadata = {
  title: "Executive Homes",
  description: "Executive Homes",
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
        roboto.variable,
        myanmar.variable,
        "h-full",
        "antialiased",
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
