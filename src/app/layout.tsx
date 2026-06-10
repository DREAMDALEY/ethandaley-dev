import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ethandaley.dev"),
  title: "Ethan Daley — Developer",
  description:
    "Founder first, builder by necessity. Ethan Daley ships the products he runs — from AI infrastructure to consumer apps. Stack, repos, and live GitHub activity.",
  applicationName: "Ethan Daley — Developer",
  authors: [{ name: "Ethan Daley", url: "https://ethandaley.dev" }],
  creator: "Ethan Daley",
  keywords: [
    "Ethan Daley",
    "developer",
    "founder",
    "TNAADO",
    "TNAADO Labs",
    "AI infrastructure",
    "Next.js",
    "portfolio",
  ],
  openGraph: {
    type: "website",
    url: "https://ethandaley.dev",
    title: "Ethan Daley — Developer",
    description:
      "Founder first, builder by necessity. The raw view: stack, repos, and live GitHub activity.",
    siteName: "Ethan Daley — Developer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ethan Daley — Developer",
    description:
      "Founder first, builder by necessity. The raw view: stack, repos, and live GitHub activity.",
    creator: "@dreamdaley",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body>{children}</body>
    </html>
  );
}
