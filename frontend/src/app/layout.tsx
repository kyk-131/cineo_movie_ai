import type { Metadata } from "next";
import { Inter, Space_Grotesk, Open_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Cineo AI - Next-Generation AI Image & Video Generation",
  description: "Create stunning images and videos with cutting-edge AI models. Premium quality generation powered by Replicate, HuggingFace, and local Stable Diffusion.",
  keywords: ["AI", "image generation", "video generation", "stable diffusion", "artificial intelligence"],
  authors: [{ name: "Cineo AI Team" }],
  creator: "Cineo AI",
  publisher: "Cineo AI",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cineo.ai",
    title: "Cineo AI - Next-Generation AI Image & Video Generation",
    description: "Create stunning images and videos with cutting-edge AI models.",
    siteName: "Cineo AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cineo AI - Next-Generation AI Image & Video Generation",
    description: "Create stunning images and videos with cutting-edge AI models.",
    creator: "@cineoai",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${openSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
