# QuickFit クイックスタートガイド

このファイルは次回の開発セッション用の簡易ガイドです。

## 🚀 即座に開始

### 開発サーバーの起動

```bash
npm run dev
```

→ http://localhost:3000 でアクセス

### バッチ処理の手動実行（動画更新）

```bash
curl -X GET "http://localhost:3000/api/cron/update-videos" \
  -H "Authorization: Bearer cVzKC1PlOCxyMZ9uTGsMkTj2oGUQe2CHS6+TgLq1FqQ="
```

### ビルドテスト

```bash
npm run build
```

---

## 📁 重要なファイル

### コア機能

| ファイル | 説明 |
|---------|------|
| `src/app/page.tsx` | トップページ（メイン画面） |
| `src/app/api/videos/route.ts` | 動画取得API |
| `src/app/api/cron/update-videos/route.ts` | バッチ処理 |
| `src/lib/youtube/client.ts` | YouTube API統合 |
| `src/lib/firebase/videos.ts` | Firestore操作 |

### 多言語

| ファイル | 説明 |
|---------|------|
| `src/locales/ja.ts` | 日本語翻訳 |
| `src/locales/en.ts` | 英語翻訳 |
| `src/contexts/LanguageContext.tsx` | 言語切り替え |

### 設定

| ファイル | 説明 |
|---------|------|
| `.env.local` | 環境変数（ローカル）|
| `vercel.json` | Vercel設定（Cron Jobs） |

---

## 🔧 よく使うコマンド

### Git操作

```bash
# 変更を確認
git status

# コミット
git add .
git commit -m "メッセージ"

# プッシュ
git push origin main
```

### デプロイ

```bash
# Vercelに自動デプロイ（GitHubにプッシュするだけ）
git push origin main
```

---

## 🐛 トラブルシューティング

### 動画が表示されない

**原因**: Firestoreに動画データがない

**解決策**:
```bash
curl -X GET "http://localhost:3000/api/cron/update-videos" \
  -H "Authorization: Bearer cVzKC1PlOCxyMZ9uTGsMkTj2oGUQe2CHS6+TgLq1FqQ="
```

### ビルドエラー

**原因**: キャッシュの問題

**解決策**:
```bash
rm -rf .next
npm run build
```

### 開発サーバーが起動しない

**原因**: ポート3000が使用中

**解決策**: 自動的に別のポート（3001など）で起動します

---

## 📝 動画フィルタリングのロジック

### 検索クエリ

```
サーキットトレーニング 自重 OR 自重トレーニング OR 器具なし OR 自宅トレーニング
```

### フィルタ条件

1. **時間**: 5～20分（300～1200秒）
2. **言語**: タイトルに日本語が含まれる
3. **検索結果**: YouTube APIで `videoDuration: 'medium'` (4～20分)
4. **地域**: `regionCode: 'JP'`（日本）

### スコア計算

```javascript
viewScore = viewCount * 0.1
ageScore = max(0, 1000 - daysSincePublished)
score = viewScore + ageScore
```

→ 再生回数が多い人気動画を優先

---

## 🔐 環境変数一覧

### 必須（ローカル・本番共通）

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDJdOaJ9lcV_tcuQ5QxGoGWzxRy3ucG76Q
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=quickfitdb-67af5.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=quickfitdb-67af5
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=quickfitdb-67af5.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=586931941752
NEXT_PUBLIC_FIREBASE_APP_ID=1:586931941752:web:ef326cd1fb43c38785588d

# YouTube API
YOUTUBE_API_KEY=AIzaSyDTRKPkWlpHoqmwbVST_pHTKzwCaEqM5sc

# Cron認証
CRON_SECRET=cVzKC1PlOCxyMZ9uTGsMkTj2oGUQe2CHS6+TgLq1FqQ=

# AdSense
NEXT_PUBLIC_ADSENSE_ID=ca-pub-6711866419254079

# ベースURL（本番）
NEXT_PUBLIC_BASE_URL=https://quickfit-xunq.vercel.app
```

---

## 🎯 次回やること候補

### 優先度: 高

1. **AdSense審査の確認**
   - ステータス確認
   - 不承認の場合は理由を確認して修正

2. **動画の品質チェック**
   - 本番環境で何本か動画を確認
   - フィルタリングが適切か検証

### 優先度: 中

3. **コンテンツ追加**（AdSense審査に有利）
   - よくある質問（FAQ）ページ
   - トレーニングのコツページ
   - このサイトについて（About）ページ

4. **Google Analyticsの導入**
   - アクセス解析
   - ユーザー行動の把握

### 優先度: 低

5. **機能拡張**
   - お気に入り機能
   - SNSシェアボタン
   - カテゴリ別フィルタ（部位別など）

6. **Firestoreセキュリティルールの強化**
   - Firebase Admin SDK導入
   - 書き込み権限の厳格化

---

## 💡 改善アイデアメモ

- 動画の長さを表示（現在は表示済み）
- 動画の難易度を手動でタグ付け
- ユーザーレビュー・評価機能
- トレーニングカレンダー
- 達成バッジシステム

---

## 📞 緊急時の対応

### サイトがダウンした場合

1. Vercelのステータス確認: https://vercel.com/status
2. Vercel Dashboard → Deployments → Logs確認
3. Firebase Console → Firestore → 使用状況確認

### YouTube APIクォータ超過

- 1日10,000ユニットの制限
- バッチ処理1回で約150ユニット使用
- 超過した場合は翌日0時（UTC）にリセット

### Firestoreクォータ

- 無料枠: 読み取り 50,000/日
- 現在の使用量は少ないため問題なし

---

このファイルは定期的に更新してください。
