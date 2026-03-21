import type { Metadata } from 'next'
import Link from 'next/link'
import HeroBackground from '@/components/HeroBackground'

export const metadata: Metadata = {
  title: 'iworとは',
  description: 'iwor（イウォール）は医師の臨床とキャリアを支えるWebプラットフォーム。名前の由来、開発の経緯、提供する機能について。',
  alternates: {
    canonical: 'https://iwor.jp/about',
  },
}

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      {/* ── Hero: 山と川のアニメーション背景 ── */}
      <div className="relative pt-8 pb-14 mb-10 overflow-hidden">
        <HeroBackground />
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-tx text-center">iworとは</h1>
          <p className="text-sm text-muted text-center mt-3 max-w-md mx-auto">
            アイヌ語で「恵みの地」— 医師の臨床とキャリアを支える場所
          </p>
        </div>
      </div>

      {/* CSS-only スクロールアニメーション */}
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .about-section > div { animation: fadeInUp 0.6s ease-out both; }
        .about-section > div:nth-child(1) { animation-delay: 0.1s; }
        .about-section > div:nth-child(2) { animation-delay: 0.2s; }
        .about-section > div:nth-child(3) { animation-delay: 0.3s; }
        .about-section > div:nth-child(4) { animation-delay: 0.4s; }
      `}</style>
      <section className="about-section space-y-8 text-sm leading-relaxed text-tx">
        {/* なぜiworなのか */}
        <div>
          <h2 className="text-base font-bold mb-3">なぜ「iwor」なのか</h2>
          <p>
            アイヌの世界観に、<span className="font-bold">iwor</span>（イウォール）という概念があります。
            人が自然とともに暮らし、山や川から恵みを受け取りながら、
            健やかに生きていくための場所。
          </p>
          <p className="mt-3">
            患者さんが長く健やかに暮らせること。
            それが、医師として私たちが最終的に目指していることだと思います。
          </p>
          <p className="mt-3">
            でも、その患者さんの「健やかな暮らし」を守っているのは、日々の臨床を支えている医師自身です。
            当直明けに病歴要約を書き、症例登録に追われ、試験勉強の時間を捻出し、
            それでも目の前の患者さんには最善の判断を求められる。
          </p>
          <p className="mt-3">
            医師を支えることは、その先にいる患者さんの暮らしを支えることにつながる。
          </p>
          <p className="mt-3 text-muted">
            研修医の頃から専門医を取得するまで、その先のキャリアまで。
            時期に応じて必要なものが変わっても、ずっと身近にある場所。
            そういう存在でありたいと思い、このサービスを<span className="font-bold text-tx">iwor</span>と名付けました。
          </p>
        </div>

        {/* 開発の経緯 */}
        <div>
          <h2 className="text-base font-bold mb-3">つくったきっかけ</h2>
          <p>
            iworは、内科専攻医として働く中で感じた小さな不満の積み重ねから生まれました。
          </p>
          <p className="mt-3">
            当直中、患者さんのeGFRを計算しようとしてアプリを開く。でも目当てのツールが見つからない。
            J-OSLERの症例登録が溜まっていく。病歴要約を書いたら指導医に差し戻される。
            試験対策の情報はブログやSNSに散らばっていて、どれが正しいかわからない。
          </p>
          <p className="mt-3">
            どれも個別には解決策がある。でも一箇所にまとまっていない。
            必要なときに必要なものがすぐ手に届く場所があれば、もっと楽になるのに。
          </p>
          <p className="mt-3 text-muted">
            ないなら作ろう。それがiworの始まりです。
          </p>
        </div>

        {/* 提供するもの */}
        <div>
          <h2 className="text-base font-bold mb-3">iworが提供するもの</h2>
          <p>
            「計算・判断・緊急はすべて無料」が原則です。
            一刻を争う場面で課金画面が出るようなサービスにはしたくない。
          </p>
          <ul className="mt-4 space-y-2.5 text-muted">
            <li className="flex gap-2">
              <span>🧮</span>
              <span><span className="text-tx font-medium">臨床計算ツール</span> — eGFR、CHA₂DS₂-VASc、SOFA、A-aDO₂など。ブラウザだけで即使える</span>
            </li>
            <li className="flex gap-2">
              <span>📖</span>
              <span><span className="text-tx font-medium">iwor Study</span> — FSRS搭載フラッシュカード。CBT・国試・専門医試験対策</span>
            </li>
            <li className="flex gap-2">
              <span>📝</span>
              <span><span className="text-tx font-medium">研修記録</span> — J-OSLER症例管理・EPOC管理を一元化</span>
            </li>
            <li className="flex gap-2">
              <span>📰</span>
              <span><span className="text-tx font-medium">論文フィード</span> — 英語28誌+日本語10誌の最新論文</span>
            </li>
            <li className="flex gap-2">
              <span>🎓</span>
              <span><span className="text-tx font-medium">マッチング対策</span> — 病院DB・志望リスト・JIS履歴書生成</span>
            </li>
          </ul>
        </div>

        {/* 運営者 */}
        <div>
          <h2 className="text-base font-bold mb-3">運営</h2>
          <p>
            iworは現役の内科専攻医が個人で開発・運営しています。
            臨床の合間に少しずつ機能を追加しているため、至らない点もありますが、
            使ってくださる方の声を反映しながら改善を続けています。
          </p>
          <p className="mt-3 text-muted">
            ご意見・ご要望は<Link href="/contact" className="text-ac underline">お問い合わせ</Link>からお気軽にどうぞ。
          </p>
        </div>
      </section>

      {/* ナビゲーション */}
      <div className="mt-12 pt-8 border-t border-br flex flex-wrap gap-4 text-sm">
        <Link href="/tools" className="text-ac hover:underline">臨床ツール →</Link>
        <Link href="/blog" className="text-ac hover:underline">ブログ →</Link>
        <Link href="/contact" className="text-ac hover:underline">お問い合わせ →</Link>
      </div>
    </main>
  )
}
