import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuickFit - 10分サーキットトレーニング動画",
  description: "10分以内のサーキットトレーニング動画を難易度別にご提案。自宅やジムで手軽にエクササイズを始めましょう。",
  keywords: ["サーキットトレーニング", "ワークアウト", "フィットネス", "10分運動", "エクササイズ"],
  openGraph: {
    title: "QuickFit - 10分サーキットトレーニング動画",
    description: "10分以内のサーキットトレーニング動画を難易度別にご提案",
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
        {children}
      </body>
    </html>
  );
}
