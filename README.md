# QuickFit

10分以内のサーキットトレーニング動画を難易度別に提案するWebアプリケーション。

## 機能

- **難易度別動画提案**: 初級・中級・上級の3つのレベルから選択
- **YouTube動画統合**: YouTubeの厳選されたサーキットトレーニング動画を表示
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

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd Workout
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成し、各値を設定します。

```bash
cp .env.local.example .env.local
```

#### 必要な環境変数：

**Firebase設定**
1. [Firebase Console](https://console.firebase.google.com/) でプロジェクトを作成
2. Firestore データベースを有効化
3. プロジェクト設定 > 全般 から設定値を取得
4. `.env.local` に各値を設定

**YouTube API**
1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作成
2. YouTube Data API v3 を有効化
3. 認証情報 > APIキー を作成
4. `YOUTUBE_API_KEY` に設定

**Cron Job認証**
```bash
# ランダムな文字列を生成
openssl rand -base64 32
```
生成した文字列を `CRON_SECRET` に設定

**AdSense**
1. Google AdSenseアカウントを作成・申請
2. 承認後、AdSense IDを取得
3. `NEXT_PUBLIC_ADSENSE_ID` に設定

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

## デプロイ（Vercel）

### 1. Vercelアカウント作成

[Vercel](https://vercel.com/) でアカウントを作成します。

### 2. プロジェクトのインポート

1. Vercel ダッシュボード > New Project
2. GitHubリポジトリを接続
3. プロジェクトをインポート

### 3. 環境変数の設定

Vercel プロジェクト設定 > Environment Variables で、`.env.local` の内容を設定します。

### 4. デプロイ

```bash
vercel --prod
```

または、GitHubにpushすると自動的にデプロイされます。

### 5. Cron Jobsの確認

Vercel プロジェクト設定 > Cron Jobs で、バッチ処理が正しく設定されているか確認します。

- **スケジュール**: 10日に1回（`0 0 */10 * *`）
- **エンドポイント**: `/api/cron/update-videos`

### 6. 初回バッチ実行

デプロイ後、手動でバッチ処理を実行して動画データを準備します。

```bash
curl -X GET https://your-domain.vercel.app/api/cron/update-videos \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

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

## API エンドポイント

### GET /api/videos

動画を取得します。

**クエリパラメータ:**
- `level`: 難易度（`beginner` | `intermediate` | `advanced`）
- `excludeIds`: 除外する動画ID（カンマ区切り）

**レスポンス例:**
```json
{
  "success": true,
  "video": {
    "id": "abc123",
    "video_id": "dQw4w9WgXcQ",
    "level": "beginner",
    "title": "10分サーキットトレーニング",
    "description": "...",
    "thumbnail_url": "https://...",
    "duration_sec": 600,
    "view_count": 10000,
    "published_at": "2024-01-01T00:00:00Z",
    "score": 5000,
    "updated_at": "2025-11-16T00:00:00Z"
  }
}
```

### GET /api/cron/update-videos

バッチ処理でYouTube APIから動画を取得・更新します。

**ヘッダー:**
- `Authorization: Bearer <CRON_SECRET>`

**レスポンス例:**
```json
{
  "success": true,
  "message": "Batch update completed successfully",
  "stats": {
    "beginner": 50,
    "intermediate": 48,
    "advanced": 45
  }
}
```

## トラブルシューティング

### 動画が表示されない

1. Firestoreに動画データがあるか確認
2. バッチ処理を手動実行
3. YouTube API キーが有効か確認

### バッチ処理が動かない

1. `CRON_SECRET` が正しく設定されているか確認
2. Vercel Cron Jobs の設定を確認
3. Vercel ログを確認

### AdSenseが表示されない

1. `NEXT_PUBLIC_ADSENSE_ID` が正しく設定されているか確認
2. AdSenseアカウントが承認済みか確認
3. ブラウザの広告ブロッカーを無効化

## ライセンス

MIT

## 注意事項

- YouTube Data API の利用制限に注意してください
- トレーニング動画の内容については、各投稿者が著作権を保有しています
- ユーザーは自己責任でトレーニングを行ってください
