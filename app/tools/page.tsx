import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '臨床ツール',
  description: '内科外来・ER・病棟のすべてをカバー。臨床計算70種、生活習慣病管理、γ計算、輸液、ACLS、主訴別ER対応など。',
}

// ── 3軸カテゴリ定義 ──
const sections = [
  {
    id: 'outpatient',
    icon: '🏥',
    title: '内科外来',
    subtitle: '生活習慣病・スクリーニング・定期フォロー',
    tools: [
      { href: '/tools/lifestyle', name: '生活習慣病 総合管理', desc: '高血圧/DM/脂質/CKD/肝障害を一括評価→次のアクション自動生成', badge: 'NEW', live: true },
      { href: '/tools/calc/ldl-friedewald', name: 'LDL-C計算（Friedewald式）', desc: 'TC/HDL/TGからLDL算出、non-HDL併記', live: true },
      { href: '/tools/calc/bmi', name: 'BMI計算', desc: '肥満度・標準体重', live: true },
      { href: '/tools/calc/egfr', name: 'eGFR計算（CKD-EPI）', desc: 'CKDステージ判定', live: true },
      { href: '/tools/calc/fib-4', name: 'FIB-4 index', desc: '肝線維化スクリーニング', live: true },
      { href: '/tools/calc/corrected-ca', name: '補正Ca', desc: '低Alb時のCa補正', live: true },
      { href: '/tools/calc/cockcroft-gault', name: 'Cockcroft-Gault式', desc: 'CCr推算', live: true },
      { href: '/tools/calc/cha2ds2-vasc', name: 'CHA₂DS₂-VASc', desc: '心房細動の脳卒中リスク', live: true },
      { href: '/tools/calc/has-bled', name: 'HAS-BLED', desc: '出血リスク評価', live: true },
      { href: '/tools/calc/audit', name: 'AUDIT', desc: '飲酒スクリーニング', live: true },
      { href: '/tools/calc/phq9', name: 'PHQ-9', desc: 'うつ病スクリーニング', live: true },
      { href: '/tools/calc/gad7', name: 'GAD-7', desc: '不安症スクリーニング', live: true },
      { href: '/tools/calc/charlson', name: 'Charlson', desc: '併存疾患指数', live: true },
    ],
  },
  {
    id: 'er',
    icon: '🚨',
    title: 'ER・救急',
    subtitle: '主訴別アプローチ・スコアリング・緊急計算',
    tools: [
      { href: '/tools/calc/qtc', name: 'QTc計算', desc: 'Bazett/Fridericia式', live: true },
      { href: '/tools/calc/map', name: 'MAP（平均動脈圧）', desc: '臓器灌流圧', live: true },
      { href: '/tools/calc/anion-gap', name: 'アニオンギャップ', desc: 'AG開大型アシドーシス鑑別', live: true },
      { href: '/tools/calc/winters-formula', name: 'Winters式', desc: '代償pCO2予測', live: true },
      { href: '/tools/calc/osmolality-gap', name: '浸透圧ギャップ', desc: '中毒スクリーニング', live: true },
      { href: '/tools/calc/aa-gradient', name: 'A-aDO₂', desc: '肺胞気動脈血酸素分圧較差', live: true },
      { href: '/tools/calc/fena', name: 'FENa', desc: 'AKI鑑別', live: true },
      { href: '/tools/calc/wells-pe', name: 'Wells PE', desc: '肺塞栓事前確率', live: true },
      { href: '/tools/calc/wells-dvt', name: 'Wells DVT', desc: 'DVT事前確率', live: true },
      { href: '/tools/calc/perc', name: 'PERC', desc: 'PE除外ルール', live: true },
      { href: '/tools/calc/heart-score', name: 'HEART', desc: '胸痛の短期イベントリスク', live: true },
      { href: '/tools/calc/timi', name: 'TIMI', desc: 'NSTE-ACSリスク', live: true },
      { href: '/tools/calc/grace', name: 'GRACE', desc: 'ACSリスク', live: true },
      { href: '/tools/calc/nihss', name: 'NIHSS', desc: '脳卒中重症度・rt-PA適応', live: true },
      { href: '/tools/calc/gcs', name: 'GCS', desc: '意識レベル', live: true },
      { href: '/tools/calc/abcd2', name: 'ABCD²', desc: 'TIA後脳梗塞リスク', live: true },
      { href: '/tools/calc/qsofa', name: 'qSOFA', desc: '敗血症スクリーニング', live: true },
      { href: '/tools/calc/curb-65', name: 'CURB-65', desc: '肺炎重症度', live: true },
      { href: '/tools/calc/a-drop', name: 'A-DROP', desc: '市中肺炎重症度（日本）', live: true },
      { href: '/tools/calc/centor', name: 'Centor', desc: '溶連菌咽頭炎スコア', live: true },
      { href: '/tools/calc/alvarado', name: 'Alvarado', desc: '虫垂炎スコア', live: true },
      { href: '/tools/calc/ottawa-ankle', name: 'Ottawa Ankle', desc: '足関節X線撮影基準', live: true },
      { href: '/tools/calc/ranson', name: 'Ranson', desc: '急性膵炎重症度', live: true },
      { href: '/tools/calc/bisap', name: 'BISAP', desc: '急性膵炎（簡便版）', live: true },
      { href: '/tools/calc/glasgow-blatchford', name: 'Glasgow-Blatchford', desc: '上部GI出血', live: true },
      { href: '/tools/calc/rockall', name: 'Rockall', desc: 'GI出血再出血リスク', live: true },
      { href: '/tools/calc/aims65', name: 'AIMS65', desc: 'GI出血死亡リスク', live: true },
      { href: '/tools/calc/parkland', name: 'Parkland式', desc: '熱傷輸液量', badge: 'NEW', live: true },
      { href: '/tools/calc/corrected-phenytoin', name: '補正フェニトイン', desc: '低Alb時TDM', live: true },
      { href: '#', name: '主訴別ER対応ツリー', desc: '胸痛・意識障害・腹痛・発熱など', badge: '準備中', live: false },
      { href: '#', name: 'ACLS / BLSフロー', desc: '心停止・不整脈・緊急対応', badge: '準備中', live: false },
    ],
  },
  {
    id: 'ward',
    icon: '🛏️',
    title: '病棟業務',
    subtitle: '輸液・電解質・ICU管理・栄養・抗菌薬',
    tools: [
      { href: '/tools/calc/dopamine-dose', name: 'γ計算（昇圧剤投与速度）', desc: 'DOA/DOB/NAd/Ad・用量域表示', badge: 'NEW', live: true },
      { href: '/tools/calc/maintenance-fluid', name: '維持輸液計算', desc: '4-2-1ルール', live: true },
      { href: '/tools/calc/na-deficit', name: 'Na欠乏量', desc: 'Na補正量', live: true },
      { href: '/tools/calc/na-correction-rate', name: 'Na補正速度', desc: 'ODS予防', live: true },
      { href: '/tools/calc/free-water-deficit', name: '自由水欠乏量', desc: '高Na補正', live: true },
      { href: '/tools/calc/kcl-correction', name: 'KCl補正', desc: 'K欠乏量・投与速度', live: true },
      { href: '/tools/calc/ibw', name: '理想体重・調整体重', desc: 'TV設定・薬物投与量', live: true },
      { href: '/tools/calc/steroid-converter', name: 'ステロイド換算', desc: '等価用量換算', live: true },
      { href: '/tools/calc/insulin-sliding', name: 'インスリンスライディングスケール', desc: '3段階スケール', live: true },
      { href: '/tools/calc/renal-dose-abx', name: '抗菌薬 腎機能別用量', desc: '20薬剤・eGFR別', live: true },
      { href: '/tools/calc/anc', name: 'ANC（好中球数）', desc: 'FN判定', live: true },
      { href: '/tools/calc/mascc', name: 'MASCC', desc: '発熱性好中球減少リスク', live: true },
      { href: '/tools/calc/sofa', name: 'SOFA', desc: '臓器障害スコア', live: true },
      { href: '/tools/calc/apache2', name: 'APACHE II', desc: 'ICU死亡率予測', live: true },
      { href: '/tools/calc/news2', name: 'NEWS2', desc: '早期警戒スコア', live: true },
      { href: '/tools/calc/child-pugh', name: 'Child-Pugh', desc: '肝硬変重症度', live: true },
      { href: '/tools/calc/meld', name: 'MELD', desc: '肝移植スコア', live: true },
      { href: '/tools/calc/meld-na', name: 'MELD-Na', desc: 'MELD改良版', live: true },
      { href: '/tools/calc/caprini', name: 'Caprini', desc: 'VTEリスク', live: true },
      { href: '/tools/calc/padua', name: 'Padua', desc: '内科VTEリスク', live: true },
      { href: '/tools/calc/spesi', name: 'sPESI', desc: '肺塞栓重症度', live: true },
      { href: '/tools/calc/isth-dic', name: 'ISTH DIC', desc: 'DIC診断', live: true },
      { href: '/tools/calc/light-criteria', name: 'Light基準', desc: '胸水鑑別', live: true },
      { href: '/tools/calc/rcri', name: 'RCRI', desc: '周術期心血管リスク', live: true },
      { href: '/tools/calc/mrs', name: 'mRS', desc: '脳卒中転帰評価', live: true },
      { href: '/tools/calc/ecog', name: 'ECOG PS', desc: '全身状態', live: true },
      { href: '/tools/calc/karnofsky', name: 'Karnofsky PS', desc: '活動状態', live: true },
      { href: '#', name: '病棟管理ダッシュボード', desc: '患者TODO・採血・輸液・メモ', badge: 'PRO', live: false },
    ],
  },
]

export default function ToolsHubPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-tx">臨床ツール</h1>
        <p className="text-muted mt-2">
          内科外来・ER・病棟 — 現場で必要なものがすべて揃う。計算・判断・緊急系はすべて<span className="font-bold text-ac">無料</span>。
        </p>
      </div>

      {/* 全ツール検索リンク */}
      <Link
        href="/tools/calc"
        className="inline-flex items-center gap-2 text-sm text-ac bg-acl px-4 py-2 rounded-lg hover:bg-ac/20 transition-colors mb-8"
      >
        🔍 全70ツールを検索・一覧で見る →
      </Link>

      {/* 3セクション */}
      {sections.map(section => (
        <section key={section.id} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{section.icon}</span>
            <div>
              <h2 className="text-lg font-bold text-tx">{section.title}</h2>
              <p className="text-xs text-muted">{section.subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {section.tools.map(tool => (
              tool.live ? (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex items-start gap-3 p-3 bg-s0 border border-br rounded-lg hover:border-ac/30 hover:bg-acl/30 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-tx group-hover:text-ac transition-colors truncate">{tool.name}</p>
                      {tool.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-ac/10 text-ac font-bold shrink-0">{tool.badge}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted line-clamp-1">{tool.desc}</p>
                  </div>
                  <span className="text-ac text-sm shrink-0 mt-0.5">→</span>
                </Link>
              ) : (
                <div
                  key={tool.name}
                  className="flex items-start gap-3 p-3 bg-s1/50 border border-br/50 rounded-lg opacity-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-muted truncate">{tool.name}</p>
                      {tool.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                          tool.badge === 'PRO' ? 'bg-amber-100 text-amber-700' : 'bg-s2 text-muted'
                        }`}>{tool.badge}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted/70 line-clamp-1">{tool.desc}</p>
                  </div>
                </div>
              )
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
