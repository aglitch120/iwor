'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ERDisclaimerBanner, ERDisclaimerFooter, ERResultCaution } from '@/components/tools/ERDisclaimer'
interface Choice { label: string; value: string; icon?: string; danger?: boolean }
interface TreeNode { id: string; title: string; desc?: string; choices?: Choice[]; result?: { severity: 'critical'|'urgent'|'moderate'|'low'; title: string; actions: string[]; workup: string[]; disposition: string; pitfall?: string }; next?: (s:string)=>string }
const tree: Record<string,TreeNode> = {
  start: { id:'start', title:'Step 1: バイタル＋12誘導心電図',
    desc:'動悸の評価は12誘導心電図が最優先。頻脈/徐脈/不整脈の有無と血行動態で方針が決まる。',
    choices:[
      {label:'血行動態不安定（低血圧・意識障害・胸痛・心不全徴候）',value:'unstable',icon:'🚨',danger:true},
      {label:'頻脈 — Narrow QRS（<120ms）',value:'narrow_tachy',icon:'📈'},
      {label:'頻脈 — Wide QRS（≧120ms）',value:'wide_tachy',icon:'📈',danger:true},
      {label:'徐脈（HR<50）+ 症状あり',value:'brady',icon:'📉'},
      {label:'期外収縮 / AF — バイタル安定',value:'stable_arrhythmia',icon:'💓'},
      {label:'心電図正常・バイタル安定',value:'normal_ecg',icon:'✅'},
    ],
    next:v=>v,
  },
  unstable: { id:'unstable', title:'🚨 血行動態不安定',
    result:{severity:'critical',title:'不安定な不整脈 — ACLS参照',
      actions:['頻脈＋不安定 → 同期電気的除細動','徐脈＋不安定 → アトロピン 0.5mg iv → 経皮ペーシング','12誘導心電図（除細動前に可能なら記録）','原因検索: ACS・電解質異常・薬物中毒・PE'],
      workup:['12誘導心電図','トロポニン','電解質（K, Ca, Mg）','血液ガス','胸部X線'],
      disposition:'ICU/CCU',
      pitfall:'不安定な wide QRS頻脈は「VTとして扱う」。SVTとの鑑別に時間をかけない',
    },
  },
  narrow_tachy: { id:'narrow_tachy', title:'Step 2: Narrow QRS頻脈',
    choices:[
      {label:'Regular → 洞性頻脈/SVT/心房粗動',value:'narrow_reg',icon:'📊'},
      {label:'Irregular → 心房細動/MAT',value:'narrow_irreg',icon:'📊'},
    ],
    next:v=>v,
  },
  narrow_reg: { id:'narrow_reg', title:'Narrow Regular Tachycardia',
    result:{severity:'moderate',title:'SVT — 迷走神経刺激 → アデノシン',
      actions:['洞性頻脈除外: 発熱・脱水・貧血・疼痛があれば原因治療','SVT疑い → Valsalva法 or 修正Valsalva法','無効 → アデノシン 6mg rapid iv → 無効なら12mg（施設プロトコル参照）','心房粗動（2:1, HR≒150）→ レートコントロール','再発予防: β遮断薬 or Ca拮抗薬。頻回→アブレーション紹介'],
      workup:['12誘導心電図（発作中＋停止後）','トロポニン（胸痛時）','電解質','甲状腺機能'],
      disposition:'停止＋安定→帰宅可。初発/頻回→循環器紹介',
      pitfall:'アデノシン投与時は除細動器準備。WPW+AFにアデノシンは禁忌（VFリスク）',
    },
  },
  narrow_irreg: { id:'narrow_irreg', title:'心房細動 / MAT',
    result:{severity:'moderate',title:'AF — レートコントロール＋抗凝固評価',
      actions:['レートコントロール: メトプロロール or ジルチアゼム iv','心不全合併 → アミオダロン or ジゴキシン','CHA₂DS₂-VASc ≧2（男性）/≧3（女性）→ 抗凝固','発症48h以内＋低リスク → リズムコントロール検討','MAT → 原疾患治療（COPD増悪・低Mg補正）'],
      workup:['心電図','BNP/NT-proBNP','甲状腺機能','電解質','心エコー','CHA₂DS₂-VASc計算'],
      disposition:'レート安定→外来。コントロール不良→入院',
      pitfall:'新規AFで甲状腺機能亢進を忘れない。WPW+AF（irregular wide QRS）にβ遮断薬/CCBは禁忌',
    },
  },
  wide_tachy: { id:'wide_tachy', title:'🚨 Wide QRS頻脈',
    result:{severity:'critical',title:'Wide QRS tachycardia — VTとして対応',
      actions:['Wide QRS頻脈はVTとして扱う','安定VT → アミオダロン 150mg iv 10分','不安定化 → 同期電気的除細動','Torsades → MgSO4 2g iv + QT延長薬中止 + K>4.0'],
      workup:['心電図','電解質（K, Ca, Mg）','トロポニン','薬剤歴','心エコー'],
      disposition:'CCU/ICU',
      pitfall:'「安定しているからSVT」は危険。構造的心疾患のあるwide QRSはほぼVT',
    },
  },
  brady: { id:'brady', title:'徐脈 + 症状',
    result:{severity:'urgent',title:'症候性徐脈',
      actions:['アトロピン 0.5mg iv（最大3mg）','高度AVB → 経皮ペーシング準備','原因: β遮断薬・CCB・ジゴキシン・高K・甲状腺機能低下','下壁MI → 一過性の可能性あり。循環器コンサルト'],
      workup:['心電図','電解質（K）','甲状腺機能','ジゴキシン濃度','トロポニン'],
      disposition:'Mobitz II/完全AVB→入院（PM検討）。薬剤性→原因除去で改善なら外来可',
      pitfall:'アスリートのHR40台は生理的。高K血症の徐脈は緊急（Ca iv → GI → 透析）',
    },
  },
  stable_arrhythmia: { id:'stable_arrhythmia', title:'安定した不整脈（PAC/PVC等）',
    result:{severity:'low',title:'安定した期外収縮 — 外来精査',
      actions:['PAC/PVCは基本良性','増悪因子: カフェイン・アルコール・睡眠不足','PVC頻発(>10%) → 心エコー + ホルター','症状強い → 少量β遮断薬検討'],
      workup:['心電図','電解質','甲状腺機能','ホルター心電図（外来）'],
      disposition:'帰宅（循環器外来紹介）',
      pitfall:'PVC burden >10-15%でPVC誘発性心筋症のリスク。EF低下あればアブレーション検討',
    },
  },
  normal_ecg: { id:'normal_ecg', title:'心電図正常 — 非心原性の検討',
    result:{severity:'low',title:'非心原性の動悸',
      actions:['貧血（Hb低下）','甲状腺機能亢進症','カフェイン/エナジードリンク過剰','パニック障害/不安障害','薬剤性（β刺激薬・テオフィリン）','発作性の不整脈は発作間欠期に正常 → ホルター/イベントレコーダー'],
      workup:['CBC','TSH/FT4','電解質','血糖','ホルター心電図（外来）'],
      disposition:'帰宅（原因に応じた外来フォロー）',
      pitfall:'心電図正常でも発作性不整脈は否定できない。繰り返す動悸にはホルター or イベントレコーダーを',
    },
  },
}
const sevColor={critical:{bg:'bg-[#FDECEA]',border:'border-[#D93025]',text:'text-[#B71C1C]',badge:'🚨 緊急'},urgent:{bg:'bg-[#FFF8E1]',border:'border-[#F9A825]',text:'text-[#E65100]',badge:'⚠️ 準緊急'},moderate:{bg:'bg-[#E8F0FE]',border:'border-[#4285F4]',text:'text-[#1565C0]',badge:'ℹ️ 中等度'},low:{bg:'bg-[#E6F4EA]',border:'border-[#34A853]',text:'text-[#1B5E20]',badge:'✅ 低リスク'}}
export default function PalpitationPage(){
  const[path,setPath]=useState<string[]>(['start']);const current=tree[path[path.length-1]];const handleChoice=(v:string)=>{if(current?.next){const n=current.next(v);if(tree[n])setPath(p=>[...p,n])}};const goBack=()=>{if(path.length>1)setPath(p=>p.slice(0,-1))};const reset=()=>setPath(['start']);if(!current)return null;const sc=current.result?sevColor[current.result.severity]:null
  return(<div className="max-w-3xl mx-auto"><nav className="text-sm text-muted mb-6"><Link href="/" className="hover:text-ac">ホーム</Link><span className="mx-2">›</span><Link href="/tools" className="hover:text-ac">臨床ツール</Link><span className="mx-2">›</span><Link href="/tools/er" className="hover:text-ac">ER対応</Link><span className="mx-2">›</span><span>動悸</span></nav>
    <header className="mb-6"><span className="inline-block text-sm bg-dnl text-dn px-2.5 py-0.5 rounded-full font-medium mb-2">🚨 ER対応</span><h1 className="text-2xl font-bold text-tx mb-1">動悸</h1><p className="text-sm text-muted">12誘導心電図 → Narrow/Wide QRS → SVT/VT/AF鑑別。ACLS連動。非心原性（貧血・甲状腺）も評価</p></header>
    <ERDisclaimerBanner /><div className="mb-4 flex items-center gap-2">{path.length>1&&<button onClick={goBack} className="text-xs text-ac px-2 py-1 rounded border border-ac/20 hover:bg-acl transition-colors">← 戻る</button>}{path.length>1&&<button onClick={reset} className="text-xs text-muted px-2 py-1 rounded border border-br hover:bg-s1 transition-colors">最初から</button>}</div>
    {current.choices&&!current.result&&(<div className="bg-s0 border border-br rounded-xl p-5 mb-6"><h2 className="text-base font-bold text-tx mb-2">{current.title}</h2>{current.desc&&<p className="text-sm text-muted mb-4">{current.desc}</p>}<div className="space-y-2">{current.choices.map(c=>(<button key={c.value} onClick={()=>handleChoice(c.value)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${c.danger?'border-[#D93025]/30 hover:border-[#D93025] hover:bg-[#FDECEA]':'border-br hover:border-ac/40 hover:bg-acl'}`}><span className="text-sm font-medium text-tx">{c.icon&&<span className="mr-2">{c.icon}</span>}{c.label}</span></button>))}</div></div>)}
    {current.result&&sc&&(<div className={`${sc.bg} border-2 ${sc.border} rounded-xl p-5 mb-6`}><div className="flex items-center gap-2 mb-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sc.text} bg-white/70`}>{sc.badge}</span></div><h2 className={`text-lg font-bold mb-3 ${sc.text}`}>{current.result.title}</h2><div className="space-y-4"><div><p className="text-xs font-bold text-tx mb-2">アクション</p><div className="space-y-1.5">{current.result.actions.map((a,i)=><p key={i} className="text-sm text-tx leading-relaxed">{a}</p>)}</div></div><div><p className="text-xs font-bold text-tx mb-2">検査オーダー</p><div className="flex flex-wrap gap-1.5">{current.result.workup.map((w,i)=><span key={i} className="text-xs px-2 py-0.5 rounded bg-white/60 text-tx">{w}</span>)}</div></div><div className="flex items-center gap-2"><p className="text-xs font-bold text-tx">Disposition:</p><p className="text-sm text-tx">{current.result.disposition}</p></div>{current.result.pitfall&&(<div className="bg-white/60 rounded-lg p-3"><p className="text-xs font-bold text-[#E65100] mb-1">⚠️ ピットフォール</p><p className="text-xs text-tx leading-relaxed">{current.result.pitfall}</p></div>)}</div><ERResultCaution />{current.choices&&(<div className="mt-4 pt-4 border-t border-black/10"><div className="space-y-2">{current.choices.map(c=>(<button key={c.value} onClick={()=>handleChoice(c.value)} className="w-full text-left p-3 rounded-xl border-2 border-white/40 hover:border-white/80 hover:bg-white/30 transition-all"><span className="text-sm font-medium text-tx">{c.icon&&<span className="mr-2">{c.icon}</span>}{c.label}</span></button>))}</div></div>)}<button onClick={reset} className="mt-4 w-full py-2.5 bg-white/60 rounded-xl text-sm font-medium text-tx hover:bg-white/80 transition-colors">最初からやり直す</button></div>)}
    <section className="mb-8"><h2 className="text-lg font-bold mb-3">関連ツール</h2><div className="flex flex-wrap gap-2">{[{href:'/tools/acls/tachycardia',name:'頻脈ACLS'},{href:'/tools/acls/bradycardia',name:'徐脈ACLS'},{href:'/tools/calc/cha2ds2-vasc',name:'CHA₂DS₂-VASc'},{href:'/tools/calc/qtc',name:'QTc計算'},{href:'/tools/er/syncope',name:'失神'}].map(t=>(<Link key={t.href} href={t.href} className="text-sm bg-s1 text-tx px-3 py-1.5 rounded-lg hover:bg-acl hover:text-ac transition-colors">{t.name}</Link>))}</div></section>
    <ERDisclaimerFooter /><section className="mb-8"><h2 className="text-lg font-bold mb-3">参考文献</h2><ol className="list-decimal list-inside text-sm text-muted space-y-2"><li>Page RL et al. 2015 ACC/AHA/HRS SVT Guideline. Circulation 2016</li><li>January CT et al. 2019 AHA/ACC/HRS AF Guidelines. Circulation 2019</li><li>日本循環器学会. 不整脈薬物治療ガイドライン 2020</li></ol></section></div>)
}
