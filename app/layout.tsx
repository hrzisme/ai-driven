import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@styles/globals.css";
import "@styles/tailwind.css";
import { SmoothScroll } from "@components/smooth-scroll";

export const metadata: Metadata = {
  title: 'My Site',
  description: 'Next.js + Sass 示例',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'My Site',
    description: '欢迎来逛',
    url: 'https://example.com',
    siteName: 'My Site',
    images: [{ url: 'https://example.com/og.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@yourname',
  },
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header>
          {/* <link href="https://fonts.googleapis.com/css?family=Inter:400" rel="stylesheet" /> */}
          {/* <link href="/styles/tailwind.css" rel="stylesheet" /> */}
        </header>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
