import type { Metadata } from "next";
import Script from "next/script";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuickFit - 器具不要の自重トレーニング動画",
  description: "器具不要の自重トレーニング動画を厳選してご提案。5～20分で自宅で手軽にサーキットトレーニング。",
  keywords: ["自重トレーニング", "器具なし", "サーキットトレーニング", "自宅トレーニング", "ワークアウト", "フィットネス", "エクササイズ"],
  openGraph: {
    title: "QuickFit - 器具不要の自重トレーニング動画",
    description: "器具不要の自重トレーニング動画を厳選してご提案。5～20分で自宅で手軽にトレーニング。",
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
