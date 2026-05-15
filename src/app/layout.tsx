import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "JobLayer - AI & Tech Jobs in DACH",
    template: "%s - JobLayer",
  },
  description:
    "JobLayer ist die kuratierte Jobbörse für AI- und Tech-Rollen in Deutschland, Österreich und der Schweiz.",
  openGraph: {
    title: "JobLayer - AI & Tech Jobs in DACH",
    description:
      "Kuratierte AI- und Tech-Jobs für Fachkräfte und Unternehmen in der DACH-Region.",
    url: "https://joblayer.de",
    siteName: "JobLayer",
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
