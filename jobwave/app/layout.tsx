import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JOBWAVE",
  description: "첫 진로부터 다음 이직까지, 잡웨이브.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
