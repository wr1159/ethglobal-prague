import type { Metadata } from "next";
import { Oxanium } from "next/font/google";
import Providers from "@/components/provider";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

const defaultUrl = process.env.VERCEL_URL
  ? "https://prague-persona.vercel.app"
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Persona",
  description: "Persona - Ready to show your True Identity?",
  openGraph: {
    title: "Persona",
    description: "Persona - Ready to show your True Identity?",
    url: defaultUrl,
    siteName: "Persona",
    images: [
      {
        url: `${defaultUrl}/og.png`,
        width: 1200,
        height: 630,
        alt: "Persona",
      },
    ],
  },
};

const oxanium = Oxanium({
  variable: "--font-oxanium",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${oxanium.className} antialiased`}>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
