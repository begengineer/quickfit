# QuickFit

トレーニング内容を簡単に決めることができる提案アプリケーション

## 機能

- **難易度別動画提案**: 自重トレーニング提案するアプリケーション
- **YouTube動画統合**: YouTubeの厳選された自重動画を表示
- **自動バッチ更新**: 10日に1回、YouTube APIから新しい動画を自動取得
- **視聴履歴管理**: 最近視聴した動画を除外して提案
- **Google AdSense統合**: 広告による収益化対応
- **SEO最適化**: sitemap、robots.txt、メタデータ設定済み

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **データベース**: Firebase Firestore
- **外部API**: YouTube Data API v3
- **ホスティング**: Vercel
- **バッチ処理**: Vercel Cron Jobs

## プロジェクト構造

```
/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── videos/        # 動画取得API
│   │   │   └── cron/          # バッチ処理
│   │   ├── privacy-policy/    # プライバシーポリシー
│   │   ├── terms/             # 利用規約
│   │   ├── layout.tsx         # ルートレイアウト
│   │   ├── page.tsx           # トップページ
│   │   ├── globals.css        # グローバルCSS
│   │   ├── sitemap.ts         # sitemap.xml生成
│   │   └── robots.ts          # robots.txt生成
│   ├── components/            # Reactコンポーネント
│   │   ├── VideoPlayer.tsx   # 動画プレーヤー
│   │   └── AdSense.tsx        # AdSense広告
│   ├── lib/                   # ユーティリティ
│   │   ├── firebase/          # Firestore設定・操作
│   │   └── youtube/           # YouTube API統合
│   └── types/                 # TypeScript型定義
├── public/                    # 静的ファイル
├── .env.local.example         # 環境変数テンプレート
├── vercel.json                # Vercel設定（Cron Jobs）
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```


## ライセンス

MIT
