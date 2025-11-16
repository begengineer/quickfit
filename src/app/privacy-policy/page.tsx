import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'プライバシーポリシー | QuickFit',
  description: 'QuickFitのプライバシーポリシー',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">プライバシーポリシー</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. 個人情報の収集について</h2>
            <p className="text-gray-700 leading-relaxed">
              当サイトでは、ユーザーの個人情報を直接収集することはありません。
              ただし、Google AdSenseやGoogle Analyticsなどの第三者サービスを利用しており、
              これらのサービスによってCookieを使用した情報収集が行われる場合があります。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Cookieについて</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              当サイトでは、以下の目的でCookieを使用しています：
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>視聴履歴の管理（重複動画の表示回避）</li>
              <li>Google AdSenseによる広告配信の最適化</li>
              <li>Google Analyticsによるアクセス解析</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              ユーザーはブラウザの設定によりCookieを無効化することができますが、
              一部機能が正常に動作しない可能性があります。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Google AdSenseについて</h2>
            <p className="text-gray-700 leading-relaxed">
              当サイトでは、Google AdSenseを利用して広告を配信しています。
              Google AdSenseは、Cookieを使用してユーザーの興味に応じた広告を表示します。
              詳細については、
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Googleの広告ポリシー
              </a>
              をご確認ください。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Google Analyticsについて</h2>
            <p className="text-gray-700 leading-relaxed">
              当サイトでは、Google Analyticsを利用してサイトの利用状況を分析しています。
              Google Analyticsは、Cookieを使用してユーザーの行動データを収集します。
              収集されたデータは匿名化され、個人を特定することはできません。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. プライバシーポリシーの変更</h2>
            <p className="text-gray-700 leading-relaxed">
              当サイトは、必要に応じてプライバシーポリシーを変更する場合があります。
              変更後のプライバシーポリシーは、当ページに掲載した時点で効力を生じるものとします。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. お問い合わせ</h2>
            <p className="text-gray-700 leading-relaxed">
              プライバシーポリシーに関するご質問は、当サイトの運営者までお問い合わせください。
            </p>
          </section>

          <div className="text-right text-gray-600 mt-8">
            <p>制定日: 2025年11月16日</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
            トップページに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
