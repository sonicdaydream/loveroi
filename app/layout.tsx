import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'ラブROI - 恋愛の投資対効果、見える化',
  description: 'デート費用を記録・分析。総支出、1回平均、CPA（獲得単価）を見える化する恋愛管理アプリ',
  openGraph: {
    title: 'ラブROI - 恋愛の投資対効果、見える化',
    description: 'デート費用を記録・分析。総支出、1回平均、CPA（獲得単価）を見える化',
    images: ['/og-image.png'],
    url: 'https://loveroi.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ラブROI - 恋愛の投資対効果、見える化',
    description: 'デート費用を記録・分析。総支出、1回平均、CPA（獲得単価）を見える化',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
