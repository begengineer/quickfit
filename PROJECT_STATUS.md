# QuickFit プロジェクト現状

最終更新: 2025-11-16

## プロジェクト概要

**QuickFit** - 器具不要の自重トレーニング動画を提案するWebアプリ

- **URL**: https://quickfit-xunq.vercel.app/
- **リポジトリ**: https://github.com/begengineer/quickfit
- **技術スタック**: Next.js 15, TypeScript, Firebase Firestore, Vercel

---

## 現在の状態

### ✅ 完成している機能

1. **動画提案システム**
   - 自重トレーニング動画のみ（器具不要）
   - 動画時間: 5～20分
   - 日本語動画のみ厳選
   - 50本の動画をストック

2. **UI/UX**
   - シンプルな1ボタン検索
   - YouTube動画埋め込みプレーヤー
   - 視聴履歴管理（重複回避）
   - レスポンシブデザイン

3. **多言語対応**
   - 日本語・英語切り替え
   - 言語選択はlocalStorageに保存

4. **バッチ処理**
   - 10日に1回自動更新（Vercel Cron Jobs）
   - YouTube Data API v3統合
   - 再生回数を重視したスコアリング

5. **SEO対策**
   - sitemap.xml自動生成
   - robots.txt設定済み
   - メタデータ最適化

6. **法令対応**
   - プライバシーポリシー
   - 利用規約
   - Cookie同意（AdSense用）

7. **デプロイ**
   - Vercelに本番デプロイ済み
   - 環境変数設定完了
   - HTTPS有効

---

## 🔄 進行中のタスク

### Google AdSense審査

**状態**: 審査申請済み、確認待ち

**AdSense ID**: `ca-pub-6711866419254079`

**確認事項**:
- ✅ AdSenseコードはサイトに正しく埋め込み済み
- ✅ robots.txtでクローラーはブロックされていない
- ⏳ AdSenseクローラーの確認待ち（6～24時間）

**次のステップ**:
1. 数時間～24時間待つ
2. AdSenseダッシュボードで確認状況をチェック
3. 承認されたら自動的に広告が表示開始

---

## 📊 データベース状況

### Firestore コレクション: `videos`

| レベル | 動画数 | 状態 |
|--------|--------|------|
| bodyweight | 50本 | ✅ 最新 |

**最終更新**: 2025-11-16

---

## 🔧 環境設定

### 環境変数（Vercel）

- ✅ Firebase設定（6個）
- ✅ YouTube API Key
- ✅ CRON_SECRET
- ✅ NEXT_PUBLIC_ADSENSE_ID
- ✅ NEXT_PUBLIC_BASE_URL

### Firebase設定

- **プロジェクトID**: quickfitdb-67af5
- **Firestore**: 有効
- **セキュリティルール**: 読み取り許可、書き込み許可（開発中）
- **インデックス**: level + score（複合索引）

### YouTube API

- **APIキー**: 設定済み
- **クォータ**: 標準（10,000ユニット/日）
- **制限**: HTTPリファラー設定済み
  - localhost:3000/*
  - 127.0.0.1:3000/*
  - *.vercel.app/*

---

## 🎯 次にやるべきこと

### 短期（1週間以内）

1. **AdSense審査の確認**
   - 6～24時間後にAdSenseダッシュボードをチェック
   - 審査中の場合は1～2週間待つ

2. **サイトのテスト**
   - 本番環境で動画が正しく表示されるか確認
   - 言語切り替えが動作するか確認
   - モバイルでの表示確認

3. **アクセス数の確保**
   - SNSでシェア
   - 友人に紹介
   - 継続的に利用してもらう

### 中期（1～2週間）

1. **AdSense審査の対応**
   - 承認: 何もしなくても広告が自動表示
   - 不承認: 理由を確認して修正

2. **コンテンツの追加（審査に有利）**
   - よくある質問（FAQ）ページ
   - トレーニングのコツページ
   - Aboutページ

3. **Google Analytics設定**（オプション）
   - アクセス解析の導入
   - ユーザー行動の分析

### 長期

1. **機能拡張**
   - お気に入り機能
   - ユーザー登録・ログイン
   - トレーニング履歴

2. **動画カテゴリの追加**
   - 体の部位別（腹筋、下半身など）
   - 目的別（ダイエット、筋力アップなど）

---

## 🐛 既知の問題

### なし

現在、既知の問題はありません。

---

## 📝 技術メモ

### 難易度フィルタリングを削除した理由

- 初級・中級・上級のキーワードフィルタが厳しすぎた
- YouTube検索結果から適切な動画を抽出できなかった
- 自重系のみに絞ることでシンプル化し、品質を向上

### 動画のフィルタリング基準

1. **時間**: 5～20分
2. **言語**: 日本語タイトルのみ
3. **トレーニングタイプ**: 自重系（検索クエリで指定）
4. **スコアリング**: 再生回数を重視（viewWeight = 0.1）

### Vercel Cron Jobs設定

- **スケジュール**: `0 0 */10 * *`（10日に1回、深夜0時）
- **エンドポイント**: `/api/cron/update-videos`
- **認証**: Bearer Token（CRON_SECRET）

---

## 🔐 セキュリティ注意事項

### ⚠️ 本番環境移行時に必要な対応

現在、Firestoreのセキュリティルールは開発用の緩い設定になっています：

```javascript
// 現在の設定（開発用）
allow read: if true;
allow write: if true;
```

**本番環境では以下に変更を推奨:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /videos/{videoId} {
      allow read: if true;  // 誰でも読み取り可能
      allow write: if false; // サーバーAPIのみ書き込み（セキュア）
    }
  }
}
```

ただし、書き込みを禁止すると、バッチ処理が動作しなくなります。
解決策: Firebase Admin SDKを使用してサーバー側から書き込む（将来的な改善点）

---

## 📞 サポート情報

### エラーが発生した場合

1. **Vercelのログを確認**
   - Vercel Dashboard → Deployments → 該当デプロイ → Runtime Logs

2. **Firestoreのログを確認**
   - Firebase Console → Firestore Database → Usage

3. **YouTube API クォータを確認**
   - Google Cloud Console → APIs & Services → Quotas

---

## 📚 参考リンク

- **Next.js Docs**: https://nextjs.org/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **YouTube Data API**: https://developers.google.com/youtube/v3
- **Vercel Docs**: https://vercel.com/docs
- **Google AdSense**: https://www.google.com/adsense/

---

## 最後のコミット

```
commit 5883427
Fix type error in BatchUpdateResponse
```

**主な変更履歴**:
1. 初期実装（難易度別サーキットトレーニング）
2. 多言語対応追加
3. 自重系トレーニング追加
4. 自重系のみに簡素化 ← 現在
