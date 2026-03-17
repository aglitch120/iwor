'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ERDisclaimerBanner, ERDisclaimerFooter, ERResultCaution } from '@/components/tools/ERDisclaimer'
interface Choice { label: string; value: string; icon?: string; danger?: boolean }
interface TreeNode { id: string; title: string; desc?: string; choices?: Choice[]; result?: { severity: 'critical'|'urgent'|'moderate'|'low'; title: string; actions: string[]; workup: string[]; disposition: string; pitfall?: string }; next?: (selected: string) => string }

const tree: Record<string, TreeNode> = {
  start: {
    id:'start', title:'Step 1: バイタル評価 + 上部/下部の判別',
    desc:'消化管出血ではまずショックの有無を評価。吐血/コーヒー残渣様嘔吐=上部消化管出血（UGI）、鮮血便/黒色便=下部（LGI）が基本だが、大量上部出血でも血便になる。',
    choices:[
      {label:'ショック徴候あり（頻脈≧100, sBP<90, 意識障害, 蒼白）',value:'shock',icon:'🚨',danger:true},
      {label:'吐血 / コーヒー残渣様嘔吐（上部消化管出血疑い）',value:'upper',icon:'🩸'},
      {label:'黒色便（タール便）',value:'melena',icon:'⬛'},
      {label:'鮮血便 / 血便（下部消化管出血疑い）',value:'lower',icon:'🔴'},
    ],
    next:v=>v,
  },
  shock: {
    id:'shock', title:'🚨 出血性ショック → 蘇生＋緊急内視鏡',
    result:{severity:'critical',title:'消化管出血＋ショック — 大量出血プロトコル',
      actions:['大口径ルート（16G以上）2本確保','輸液: 晶質液急速投与 → 輸血準備（T&S, 緊急O型RBC）','目標: MAP≧65, Hb≧7（心疾患合併は≧9）','PPI: オメプラゾール80mg iv bolus → 8mg/h持続（上部出血疑い時）','経鼻胃管: 上部出血の確認（血液/コーヒー残渣→上部確定）','消化器内科緊急コンサルト → 24h以内の緊急内視鏡（ショックなら12h以内）','大量輸血プロトコル: RBC:FFP:PLT = 1:1:1 を考慮','抗凝固薬/抗血小板薬の中止＋拮抗薬の検討'],
      workup:['CBC（Hb: 出血直後は正常値のことあり）','凝固（PT-INR, APTT, Fib）','T&S/クロスマッチ','電解質・腎機能','乳酸','肝機能（肝硬変→食道静脈瘤を考慮）','心電図（高齢者: 出血によるACS誘発）'],
      disposition:'ICU/HCU（緊急内視鏡後も集中管理）',
      pitfall:'出血直後のHbは希釈前で正常値を示す。バイタルで重症度を判断。「Hbが正常だから大丈夫」は危険。抗凝固薬服用中の患者は少量の出血でも重症化しやすい',
    },
  },
  upper: {
    id:'upper', title:'Step 2: 上部消化管出血 — リスク評価',
    desc:'上部GI出血の原因: 消化性潰瘍(最多)、食道静脈瘤、Mallory-Weiss、びらん性胃炎、悪性腫瘍。Glasgow-Blatchford Scoreで内視鏡の緊急度を判断。',
    choices:[
      {label:'肝硬変/門脈圧亢進の既往あり（静脈瘤出血疑い）',value:'variceal',icon:'🫙',danger:true},
      {label:'NSAIDs/抗血小板薬使用 or ピロリ菌感染歴（消化性潰瘍疑い）',value:'peptic',icon:'💊'},
      {label:'繰り返す嘔吐後の吐血（Mallory-Weiss疑い）',value:'mallory',icon:'🤮'},
    ],
    next:v=>v,
  },
  variceal: {
    id:'variceal', title:'🫙 食道静脈瘤破裂',
    result:{severity:'critical',title:'食道静脈瘤出血 — 緊急対応',
      actions:['輸液＋輸血（目標Hb 7-8、過剰輸血は門脈圧↑で再出血リスク）','オクトレオチド 50μg iv bolus → 50μg/h 持続（施設プロトコル参照）','PPI: 必ずしも第一選択ではない（静脈瘤にはオクトレオチド）','予防的抗菌薬: CTRX 1g/日 iv（SBP予防、7日間。肝硬変+GI出血の標準）','緊急内視鏡（12h以内）→ EVL（結紮術）or 硬化療法','内視鏡止血困難 → S-Bチューブ or TIPS検討','気道保護: 大量出血・肝性脳症 → 気管挿管考慮'],
      workup:['CBC・凝固','肝機能・アルブミン・アンモニア','Child-Pugh / MELD計算','T&S','心電図'],
      disposition:'ICU',
      pitfall:'肝硬変患者は凝固異常＋血小板低下があるため、「PT-INRが高い＝抗凝固薬の影響」と誤解しない。過剰輸血で門脈圧↑→再出血の悪循環に注意',
    },
  },
  peptic: {
    id:'peptic', title:'消化性潰瘍出血',
    result:{severity:'urgent',title:'消化性潰瘍出血 — PPI＋内視鏡',
      actions:['PPI: オメプラゾール80mg iv bolus → 8mg/h持続（内視鏡前から開始）','Glasgow-Blatchford Score（GBS）でリスク層別化','GBS=0 → 外来内視鏡可（低リスク）','GBS≧1 → 入院＋24h以内の内視鏡','内視鏡所見: Forrest分類で再出血リスク評価','原因薬剤（NSAIDs, アスピリン）の中止','ピロリ菌検査→陽性なら除菌'],
      workup:['CBC','BUN/Cr（BUN上昇は上部GI出血を示唆）','凝固','肝機能','ピロリ菌検査（内視鏡時に）'],
      disposition:'GBS=0→帰宅可（外来内視鏡予約）。GBS≧1→入院',
      pitfall:'GBS=0は非常に低リスク（重大イベント率<1%）で外来管理が安全とされる。ただしバイタル正常・Hb正常であることが前提',
    },
  },
  mallory: {
    id:'mallory', title:'Mallory-Weiss裂傷',
    result:{severity:'moderate',title:'Mallory-Weiss症候群',
      actions:['90%は自然止血→保存的管理','PPI投与','制吐薬（嘔吐の反復予防）','持続出血 or 大量出血→内視鏡止血','アルコール多飲患者では肝硬変の合併を評価'],
      workup:['CBC','凝固','肝機能','内視鏡（持続出血時 or 診断確定目的）'],
      disposition:'自然止血・バイタル安定→帰宅可。持続出血→入院',
      pitfall:'Boerhaave症候群（食道破裂）との鑑別。Mallory-Weissは粘膜の裂傷だが、Boerhaaveは全層穿孔で縦隔気腫・胸水を伴う。胸痛＋嘔吐後の吐血は胸部CTを',
    },
  },
  melena: {
    id:'melena', title:'Step 2: 黒色便 → 上部消化管出血',
    result:{severity:'urgent',title:'タール便（黒色便）— 上部消化管出血の評価',
      actions:['タール便は通常、上部消化管出血を示す（Treitz靭帯より口側）','まれに右側結腸出血でも黒色便になる','経鼻胃管でコーヒー残渣 or 血液→上部確定','PPI iv開始','消化器内科コンサルト→内視鏡','鉄剤・ビスマス製剤による偽タール便を除外（便潜血で確認）'],
      workup:['便潜血（偽タール便の除外）','CBC・BUN/Cr','凝固・肝機能','上部内視鏡'],
      disposition:'入院（内視鏡まで）',
      pitfall:'鉄剤服用中の黒色便は便潜血陰性。「鉄剤を飲んでいるから」で安心しない→便潜血を確認',
    },
  },
  lower: {
    id:'lower', title:'Step 2: 下部消化管出血 — 重症度評価',
    desc:'鮮血便の原因: 憩室出血(最多)、虚血性腸炎、痔核、大腸癌、血管異形成、炎症性腸疾患。',
    choices:[
      {label:'大量鮮血便（血圧低下・頻脈あり）',value:'massive_lower',icon:'🚨',danger:true},
      {label:'少量〜中等量の血便（バイタル安定）',value:'stable_lower',icon:'🔴'},
      {label:'排便時の鮮血付着のみ（痔を疑う）',value:'hemorrhoid',icon:'🩹'},
    ],
    next:v=>v,
  },
  massive_lower: {
    id:'massive_lower', title:'🚨 大量下部GI出血',
    result:{severity:'critical',title:'大量下部消化管出血 — 緊急対応',
      actions:['蘇生: 輸液・輸血（上部出血と同じプロトコル）','経鼻胃管: 上部出血の除外（胆汁が吸引→上部は否定的）','大腸内視鏡（出血コントロール後に前処置→内視鏡）','内視鏡困難な大量出血→CT血管造影（造影CT）で出血点同定','IVR（血管塞栓術）or 緊急手術の検討','抗凝固薬の拮抗'],
      workup:['CBC・凝固','T&S','CT血管造影（活動性出血の検出）','大腸内視鏡（準備可能なら）'],
      disposition:'ICU',
      pitfall:'下部GI出血の15%は実は上部出血。経鼻胃管で上部を除外。大量血便でバイタル不安定なら上部内視鏡を先行する施設もある',
    },
  },
  stable_lower: {
    id:'stable_lower', title:'安定した下部消化管出血',
    result:{severity:'moderate',title:'下部消化管出血（安定）— 待機的精査',
      actions:['入院観察（再出血リスクの監視）','輸液＋必要に応じて輸血','大腸内視鏡（入院中に前処置→施行）','50歳以上 or 大腸癌リスク因子あり→大腸内視鏡は必須','若年で少量→感染性腸炎・IBDを考慮（便培養・CRP）'],
      workup:['CBC','CRP','便培養（感染性疑い時）','大腸内視鏡'],
      disposition:'入院（軽症で自然止血→翌日外来大腸内視鏡も可）',
      pitfall:'憩室出血は自然止血率80%だが、再出血率も高い（35%）。「止まったから大丈夫」ではなく大腸内視鏡での確認が重要',
    },
  },
  hemorrhoid: {
    id:'hemorrhoid', title:'痔核出血の疑い',
    result:{severity:'low',title:'痔核出血 — 保存的管理',
      actions:['肛門診察（外痔核の確認。直腸診で腫瘤触知→大腸癌を除外）','保存的治療: 食物繊維摂取↑、温水洗浄、軟膏（ステロイド外用）','大量出血 or 貧血→内痔核結紮術検討','40歳以上 or 便通異常 → 大腸内視鏡（痔＝大腸癌の否定にはならない）'],
      workup:['直腸診','CBC（貧血の確認）','40歳以上→大腸内視鏡（外来）'],
      disposition:'帰宅（消化器外科 or 肛門科外来紹介）',
      pitfall:'「痔だろう」で大腸癌を見逃さない。特に40歳以上、血便＋体重減少、便通変化は大腸内視鏡の適応',
    },
  },
}

const sevColor={critical:{bg:'bg-[#FDECEA]',border:'border-[#D93025]',text:'text-[#B71C1C]',badge:'🚨 緊急'},urgent:{bg:'bg-[#FFF8E1]',border:'border-[#F9A825]',text:'text-[#E65100]',badge:'⚠️ 準緊急'},moderate:{bg:'bg-[#E8F0FE]',border:'border-[#4285F4]',text:'text-[#1565C0]',badge:'ℹ️ 中等度'},low:{bg:'bg-[#E6F4EA]',border:'border-[#34A853]',text:'text-[#1B5E20]',badge:'✅ 低リスク'}}

export default function GIBleedingPage(){
  const[path,setPath]=useState<string[]>(['start'])
  const current=tree[path[path.length-1]]
  const handleChoice=(v:string)=>{if(current?.next){const n=current.next(v);if(tree[n])setPath(p=>[...p,n])}}
  const goBack=()=>{if(path.length>1)setPath(p=>p.slice(0,-1))}
  const reset=()=>setPath(['start'])
  if(!current)return null
  const sc=current.result?sevColor[current.result.severity]:null
  return(
    <div className="max-w-3xl mx-auto">
      <nav className="text-sm text-muted mb-6"><Link href="/" className="hover:text-ac">ホーム</Link><span className="mx-2">›</span><Link href="/tools" className="hover:text-ac">臨床ツール</Link><span className="mx-2">›</span><Link href="/tools/er" className="hover:text-ac">ER対応</Link><span className="mx-2">›</span><span>吐血・下血</span></nav>
      <header className="mb-6"><span className="inline-block text-sm bg-dnl text-dn px-2.5 py-0.5 rounded-full font-medium mb-2">🚨 ER対応</span><h1 className="text-2xl font-bold text-tx mb-1">吐血・下血</h1><p className="text-sm text-muted">上部/下部の判別 → ショック対応 → 静脈瘤/潰瘍/憩室の鑑別。GBSでリスク層別化</p></header>
      <ERDisclaimerBanner />
      <div className="mb-4 flex items-center gap-2">{path.length>1&&<button onClick={goBack} className="text-xs text-ac px-2 py-1 rounded border border-ac/20 hover:bg-acl transition-colors">← 戻る</button>}{path.length>1&&<button onClick={reset} className="text-xs text-muted px-2 py-1 rounded border border-br hover:bg-s1 transition-colors">最初から</button>}</div>
      {current.choices&&!current.result&&(<div className="bg-s0 border border-br rounded-xl p-5 mb-6"><h2 className="text-base font-bold text-tx mb-2">{current.title}</h2>{current.desc&&<p className="text-sm text-muted mb-4">{current.desc}</p>}<div className="space-y-2">{current.choices.map(c=>(<button key={c.value} onClick={()=>handleChoice(c.value)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${c.danger?'border-[#D93025]/30 hover:border-[#D93025] hover:bg-[#FDECEA]':'border-br hover:border-ac/40 hover:bg-acl'}`}><span className="text-sm font-medium text-tx">{c.icon&&<span className="mr-2">{c.icon}</span>}{c.label}</span></button>))}</div></div>)}
      {current.result&&sc&&(<div className={`${sc.bg} border-2 ${sc.border} rounded-xl p-5 mb-6`}><div className="flex items-center gap-2 mb-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sc.text} bg-white/70`}>{sc.badge}</span></div><h2 className={`text-lg font-bold mb-3 ${sc.text}`}>{current.result.title}</h2><div className="space-y-4"><div><p className="text-xs font-bold text-tx mb-2">アクション</p><div className="space-y-1.5">{current.result.actions.map((a,i)=><p key={i} className="text-sm text-tx leading-relaxed">{a}</p>)}</div></div><div><p className="text-xs font-bold text-tx mb-2">検査オーダー</p><div className="flex flex-wrap gap-1.5">{current.result.workup.map((w,i)=><span key={i} className="text-xs px-2 py-0.5 rounded bg-white/60 text-tx">{w}</span>)}</div></div><div className="flex items-center gap-2"><p className="text-xs font-bold text-tx">Disposition:</p><p className="text-sm text-tx">{current.result.disposition}</p></div>{current.result.pitfall&&(<div className="bg-white/60 rounded-lg p-3"><p className="text-xs font-bold text-[#E65100] mb-1">⚠️ ピットフォール</p><p className="text-xs text-tx leading-relaxed">{current.result.pitfall}</p></div>)}</div><ERResultCaution />{current.choices&&(<div className="mt-4 pt-4 border-t border-black/10"><div className="space-y-2">{current.choices.map(c=>(<button key={c.value} onClick={()=>handleChoice(c.value)} className="w-full text-left p-3 rounded-xl border-2 border-white/40 hover:border-white/80 hover:bg-white/30 transition-all"><span className="text-sm font-medium text-tx">{c.icon&&<span className="mr-2">{c.icon}</span>}{c.label}</span></button>))}</div></div>)}<button onClick={reset} className="mt-4 w-full py-2.5 bg-white/60 rounded-xl text-sm font-medium text-tx hover:bg-white/80 transition-colors">最初からやり直す</button></div>)}
      <section className="mb-8"><h2 className="text-lg font-bold mb-3">関連ツール</h2><div className="flex flex-wrap gap-2">{[{href:'/tools/calc/glasgow-blatchford',name:'Glasgow-Blatchford'},{href:'/tools/calc/rockall',name:'Rockall Score'},{href:'/tools/calc/child-pugh',name:'Child-Pugh'},{href:'/tools/calc/meld',name:'MELD'},{href:'/tools/er/abdominal-pain',name:'腹痛'}].map(t=>(<Link key={t.href} href={t.href} className="text-sm bg-s1 text-tx px-3 py-1.5 rounded-lg hover:bg-acl hover:text-ac transition-colors">{t.name}</Link>))}</div></section>
      <ERDisclaimerFooter />
      <section className="mb-8"><h2 className="text-lg font-bold mb-3">参考文献</h2><ol className="list-decimal list-inside text-sm text-muted space-y-2"><li>Laine L et al. ACG Clinical Guideline: Upper GI Bleeding. Am J Gastroenterol 2021</li><li>Strate LL, Gralnek IM. ACG Clinical Guideline: Management of Lower GI Bleeding. Am J Gastroenterol 2016</li><li>日本消化器病学会. 消化管出血ガイドライン 2020</li></ol></section>
    </div>
  )
}
