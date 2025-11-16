import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '利用規約 | QuickFit',
  description: 'QuickFitの利用規約',
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">利用規約</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. 利用規約の適用</h2>
            <p className="text-gray-700 leading-relaxed">
              本利用規約（以下「本規約」）は、QuickFit（以下「当サイト」）が提供するサービスの利用に関する条件を定めるものです。
              ユーザーは、当サイトを利用することにより、本規約に同意したものとみなされます。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. サービス内容</h2>
            <p className="text-gray-700 leading-relaxed">
              当サイトは、YouTubeに公開されているサーキットトレーニング動画を難易度別に提案するサービスを提供します。
              動画の内容については、YouTube上の投稿者が著作権を保有しており、当サイトは動画のリンクを提供するのみです。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. 免責事項</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              当サイトは、以下の事項について一切の責任を負いません：
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>提案された動画の内容、正確性、有用性</li>
              <li>動画を視聴してトレーニングを行った結果生じた身体的な損傷や健康被害</li>
              <li>YouTube側のサービス停止や動画削除による影響</li>
              <li>当サイトの一時的な利用不可やサービス中断</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              ユーザーは、トレーニングを行う際には自己責任で行い、必要に応じて医師や専門家に相談してください。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. 著作権・知的財産権</h2>
            <p className="text-gray-700 leading-relaxed">
              当サイトに掲載されるコンテンツ（テキスト、画像、デザイン等）の著作権は当サイト運営者に帰属します。
              ただし、YouTube動画の著作権は各投稿者に帰属します。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. 禁止事項</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ユーザーは、当サイトの利用にあたり以下の行為を行ってはなりません：
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>法令に違反する行為</li>
              <li>当サイトの運営を妨害する行為</li>
              <li>不正アクセス、クラッキング等の行為</li>
              <li>他のユーザーや第三者に迷惑をかける行為</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. サービスの変更・終了</h2>
            <p className="text-gray-700 leading-relaxed">
              当サイトは、事前の通知なくサービス内容の変更、追加、または終了を行うことがあります。
              これによりユーザーに生じた損害について、当サイトは責任を負いません。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. 利用規約の変更</h2>
            <p className="text-gray-700 leading-relaxed">
              当サイトは、必要に応じて本規約を変更する場合があります。
              変更後の利用規約は、当ページに掲載した時点で効力を生じるものとします。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. 準拠法・管轄裁判所</h2>
            <p className="text-gray-700 leading-relaxed">
              本規約は日本法に準拠し、解釈されるものとします。
              当サイトに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
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
