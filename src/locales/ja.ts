export const ja = {
  // ヘッダー
  siteTitle: "QuickFit",
  siteSubtitle: "器具不要の自重トレーニング",

  // 使い方セクション
  howToUse: {
    title: "使い方",
    step1: {
      title: "1. 動画を探す",
      description: "「動画を探す」ボタンをクリックするだけ！"
    },
    step2: {
      title: "2. トレーニング開始",
      description: "5～20分の器具不要の自重トレーニング動画が表示されます。"
    },
    step3: {
      title: "3. 別の動画を試す",
      description: "気に入らなければ「別の動画をもう1本」で他の動画を探せます。"
    }
  },

  // メイン画面
  main: {
    selectLevel: "難易度を選択してください",
    beginner: {
      title: "初級",
      description: "運動初心者向け、ゆっくりとしたペース"
    },
    intermediate: {
      title: "中級",
      description: "ある程度運動習慣がある方向け"
    },
    advanced: {
      title: "上級",
      description: "ハードなトレーニングを求める方向け"
    },
    bodyweight: {
      title: "自重系",
      description: "器具不要、自分の体重だけでトレーニング"
    },
    findVideo: "動画を探す",
    searching: "動画を探しています...",
    anotherVideo: "別の動画をもう1本",
    backToTop: "トップに戻る"
  },

  // 動画情報
  video: {
    views: "回視聴",
    duration: "分"
  },

  // エラーメッセージ
  error: {
    noVideos: "動画が見つかりませんでした",
    fetchFailed: "動画の取得に失敗しました",
    unexpectedError: "予期せぬエラーが発生しました"
  },

  // フッター
  footer: {
    privacyPolicy: "プライバシーポリシー",
    terms: "利用規約",
    copyright: "© 2025 QuickFit. All rights reserved."
  },

  // プライバシーポリシー
  privacy: {
    title: "プライバシーポリシー",
    backToHome: "トップページに戻る"
  },

  // 利用規約
  terms: {
    title: "利用規約",
    backToHome: "トップページに戻る"
  }
};

export type Translations = typeof ja;
