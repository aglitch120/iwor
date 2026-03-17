'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ERDisclaimerBanner, ERDisclaimerFooter, ERResultCaution } from '@/components/tools/ERDisclaimer'
interface Choice { label: string; value: string; icon?: string; danger?: boolean }
interface TreeNode { id: string; title: string; desc?: string; choices?: Choice[]; result?: { severity: 'critical'|'urgent'|'moderate'|'low'; title: string; actions: string[]; workup: string[]; disposition: string; pitfall?: string }; next?: (s:string)=>string }
const tree: Record<string,TreeNode> = {
  start: { id:'start', title:'Step 1: 緊急疾患の除外',
    desc:'悪心・嘔吐は非特異的な症状。まず生命を脅かす原因を除外。バイタル評価 → 腹部所見 → 随伴症状で方針決定。',
    choices:[
      {label:'激しい腹痛を伴う（急性腹症の可能性）',value:'acute_abd',icon:'🩺',danger:true},
      {label:'頭痛・神経症状を伴う（頭蓋内圧亢進・髄膜炎）',value:'neuro',icon:'🧠',danger:true},
      {label:'胸痛を伴う（ACS・大動脈解離）',value:'chest',icon:'💓',danger:true},
      {label:'妊娠可能年齢の女性',value:'pregnancy',icon:'🤰'},
      {label:'脱水徴候あり（頻脈・口腔乾燥・尿量減少）',value:'dehydration',icon:'💧'},
      {label:'上記なし — 軽症の悪心嘔吐',value:'mild',icon:'✅'},
    ],
    next:v=>v,
  },
  acute_abd: { id:'acute_abd', title:'腹痛 + 嘔吐 → 急性腹症の評価',
    result:{severity:'critical',title:'急性腹症を伴う嘔吐',
      actions:['→ 腹痛フローへ（/tools/er/abdominal-pain）','腸閉塞: 腹部膨満 + 嘔吐 + 排ガス停止 → 腹部X線/CT','急性膵炎: 心窩部痛 + 背部放散 → リパーゼ','虫垂炎: 右下腹部痛 + 嘔吐（嘔吐は痛みの後に出現するのが典型）','絞扼性イレウス/腸管虚血 → 緊急手術適応'],
      workup:['腹部CT造影','CBC・CRP','電解質・腎機能','リパーゼ','乳酸（腸管虚血疑い時）','腹部X線（立位: ニボー）'],
      disposition:'原因に応じて入院 or 手術',
      pitfall:'嘔吐が主訴でも、原因は腹腔外（頭蓋内圧亢進・DKA・薬物中毒）の可能性がある。腹部所見が軽微でも軽視しない',
    },
  },
  neuro: { id:'neuro', title:'神経症状 + 嘔吐 → 中枢性',
    result:{severity:'critical',title:'中枢性嘔吐 — 頭蓋内圧亢進の評価',
      actions:['頭部CT（出血・腫瘍・水頭症の除外）','射出性嘔吐（projectile）は頭蓋内圧亢進を示唆','髄膜炎疑い → 頭痛フロー参照','小脳出血/梗塞 → めまい + 嘔吐 + 失調で考慮','DKA: 血糖 + 血液ガス + ケトン体'],
      workup:['頭部CT','血糖','血液ガス','電解質','ケトン体（DKA）'],
      disposition:'原因に応じて入院',
      pitfall:'「胃腸炎」と思ったら実はDKA（嘔吐＋腹痛が主訴のことがある）。血糖チェックを忘れない',
    },
  },
  chest: { id:'chest', title:'胸痛 + 嘔吐 → ACS/解離',
    result:{severity:'critical',title:'心血管系の評価',
      actions:['→ 胸痛フローへ（/tools/er/chest-pain）','下壁MI: 嘔吐を伴うことが多い（迷走神経反射）','12誘導心電図 + トロポニン','大動脈解離: 突然の背部痛 + 嘔吐'],
      workup:['心電図','トロポニン','胸部X線/CT'],
      disposition:'ACS/解離疑い → CCU/ICU',
      pitfall:'高齢者・糖尿病患者のMIは嘔吐が唯一の症状のことがある（silent MI）',
    },
  },
  pregnancy: { id:'pregnancy', title:'妊娠可能年齢の女性',
    result:{severity:'moderate',title:'妊娠関連の嘔吐評価',
      actions:['尿中hCG → 妊娠の確認/除外','妊娠初期のつわり（妊娠悪阻: 体重5%以上減少・ケトン尿→入院適応）','異所性妊娠: 下腹部痛 + 嘔吐 + 無月経 → 経腟エコー','妊娠悪阻: 輸液 + チアミン100mg iv（Wernicke予防）+ 制吐薬','制吐薬の安全性: メトクロプラミド・オンダンセトロンは妊娠中使用可'],
      workup:['尿中hCG','電解質（低K・低Na）','ケトン体','経腟エコー（異所性妊娠疑い時）'],
      disposition:'軽症つわり→帰宅。妊娠悪阻（脱水・電解質異常）→入院',
      pitfall:'妊娠可能年齢の嘔吐では常にhCGを確認。異所性妊娠は腹腔内出血で致命的になりうる',
    },
  },
  dehydration: { id:'dehydration', title:'脱水を伴う嘔吐',
    result:{severity:'moderate',title:'脱水 — 輸液＋原因検索',
      actions:['末梢ルート確保 → 生食 or リンゲル液 500-1000mL急速投与','電解質補正（特に低K: 嘔吐で大量喪失）','制吐薬: メトクロプラミド10mg iv or オンダンセトロン4mg iv','原因検索: 感染性胃腸炎・薬剤性・腸閉塞・代謝性（DKA, 高Ca, 尿毒症）','経口補水が可能になれば経口補液へ切り替え'],
      workup:['CBC','電解質（K, Na, Cl）','腎機能（BUN/Cr比上昇→脱水示唆）','血糖','尿検査（比重・ケトン）'],
      disposition:'補液で改善・経口摂取可→帰宅。経口摂取不能持続→入院',
      pitfall:'嘔吐による代謝性アルカローシス（低Cl性）を見逃さない。低K血症が重度だと不整脈リスク',
    },
  },
  mild: { id:'mild', title:'軽症の悪心嘔吐',
    result:{severity:'low',title:'軽症嘔吐 — 対症療法＋原因鑑別',
      actions:['感染性胃腸炎が最多（ノロ・ロタウイルス、細菌性）','制吐薬: メトクロプラミド or ドンペリドン','経口補水（ORS）を少量頻回で','薬剤性嘔吐: オピオイド・抗菌薬・化学療法 → 原因薬剤の見直し','GERD/消化性潰瘍 → PPI開始','慢性嘔吐（4週以上）→ 上部内視鏡検討'],
      workup:['通常は不要（典型的な急性胃腸炎パターン）','持続/反復する場合: CBC・電解質・肝腎機能'],
      disposition:'帰宅（再受診指導: 経口摂取不能が24h以上・血性嘔吐・高熱持続）',
      pitfall:'「胃腸炎」は除外診断。Red Flagがないことを確認してから診断する',
    },
  },
}
const sevColor={critical:{bg:'bg-[#FDECEA]',border:'border-[#D93025]',text:'text-[#B71C1C]',badge:'🚨 緊急'},urgent:{bg:'bg-[#FFF8E1]',border:'border-[#F9A825]',text:'text-[#E65100]',badge:'⚠️ 準緊急'},moderate:{bg:'bg-[#E8F0FE]',border:'border-[#4285F4]',text:'text-[#1565C0]',badge:'ℹ️ 中等度'},low:{bg:'bg-[#E6F4EA]',border:'border-[#34A853]',text:'text-[#1B5E20]',badge:'✅ 低リスク'}}
export default function NauseaVomitingPage(){
  const[path,setPath]=useState<string[]>(['start']);const current=tree[path[path.length-1]];const handleChoice=(v:string)=>{if(current?.next){const n=current.next(v);if(tree[n])setPath(p=>[...p,n])}};const goBack=()=>{if(path.length>1)setPath(p=>p.slice(0,-1))};const reset=()=>setPath(['start']);if(!current)return null;const sc=current.result?sevColor[current.result.severity]:null
  return(<div className="max-w-3xl mx-auto"><nav className="text-sm text-muted mb-6"><Link href="/" className="hover:text-ac">ホーム</Link><span className="mx-2">›</span><Link href="/tools" className="hover:text-ac">臨床ツール</Link><span className="mx-2">›</span><Link href="/tools/er" className="hover:text-ac">ER対応</Link><span className="mx-2">›</span><span>悪心・嘔吐</span></nav>
    <header className="mb-6"><span className="inline-block text-sm bg-dnl text-dn px-2.5 py-0.5 rounded-full font-medium mb-2">🚨 ER対応</span><h1 className="text-2xl font-bold text-tx mb-1">悪心・嘔吐</h1><p className="text-sm text-muted">急性腹症・頭蓋内圧亢進・ACS・DKAの除外 → 脱水評価 → 対症療法</p></header>
    <ERDisclaimerBanner /><div className="mb-4 flex items-center gap-2">{path.length>1&&<button onClick={goBack} className="text-xs text-ac px-2 py-1 rounded border border-ac/20 hover:bg-acl transition-colors">← 戻る</button>}{path.length>1&&<button onClick={reset} className="text-xs text-muted px-2 py-1 rounded border border-br hover:bg-s1 transition-colors">最初から</button>}</div>
    {current.choices&&!current.result&&(<div className="bg-s0 border border-br rounded-xl p-5 mb-6"><h2 className="text-base font-bold text-tx mb-2">{current.title}</h2>{current.desc&&<p className="text-sm text-muted mb-4">{current.desc}</p>}<div className="space-y-2">{current.choices.map(c=>(<button key={c.value} onClick={()=>handleChoice(c.value)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${c.danger?'border-[#D93025]/30 hover:border-[#D93025] hover:bg-[#FDECEA]':'border-br hover:border-ac/40 hover:bg-acl'}`}><span className="text-sm font-medium text-tx">{c.icon&&<span className="mr-2">{c.icon}</span>}{c.label}</span></button>))}</div></div>)}
    {current.result&&sc&&(<div className={`${sc.bg} border-2 ${sc.border} rounded-xl p-5 mb-6`}><div className="flex items-center gap-2 mb-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sc.text} bg-white/70`}>{sc.badge}</span></div><h2 className={`text-lg font-bold mb-3 ${sc.text}`}>{current.result.title}</h2><div className="space-y-4"><div><p className="text-xs font-bold text-tx mb-2">アクション</p><div className="space-y-1.5">{current.result.actions.map((a,i)=><p key={i} className="text-sm text-tx leading-relaxed">{a}</p>)}</div></div><div><p className="text-xs font-bold text-tx mb-2">検査オーダー</p><div className="flex flex-wrap gap-1.5">{current.result.workup.map((w,i)=><span key={i} className="text-xs px-2 py-0.5 rounded bg-white/60 text-tx">{w}</span>)}</div></div><div className="flex items-center gap-2"><p className="text-xs font-bold text-tx">Disposition:</p><p className="text-sm text-tx">{current.result.disposition}</p></div>{current.result.pitfall&&(<div className="bg-white/60 rounded-lg p-3"><p className="text-xs font-bold text-[#E65100] mb-1">⚠️ ピットフォール</p><p className="text-xs text-tx leading-relaxed">{current.result.pitfall}</p></div>)}</div><ERResultCaution /><button onClick={reset} className="mt-4 w-full py-2.5 bg-white/60 rounded-xl text-sm font-medium text-tx hover:bg-white/80 transition-colors">最初からやり直す</button></div>)}
    <ERDisclaimerFooter /></div>)
}
