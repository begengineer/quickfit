import type { Metadata } from "next";
import Script from "next/script";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuickFit - サーキットトレーニング・自重トレーニング動画",
  description: "7～15分のサーキットトレーニング動画を難易度別にご提案。器具不要の自重トレーニングも充実。自宅やジムで手軽にエクササイズを始めましょう。",
  keywords: ["サーキットトレーニング", "自重トレーニング", "ワークアウト", "フィットネス", "エクササイズ", "器具なし", "トレーニング動画"],
  openGraph: {
    title: "QuickFit - サーキットトレーニング・自重トレーニング動画",
    description: "7～15分のサーキットトレーニング動画を難易度別にご提案。器具不要の自重トレーニングも充実。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {/* Google AdSense スクリプト（本番環境でca-pub-XXXXを設定） */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
