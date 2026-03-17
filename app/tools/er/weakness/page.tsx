'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ERDisclaimerBanner, ERDisclaimerFooter, ERResultCaution } from '@/components/tools/ERDisclaimer'
interface Choice{label:string;value:string;icon?:string;danger?:boolean}
interface TreeNode{id:string;title:string;desc?:string;choices?:Choice[];result?:{severity:'critical'|'urgent'|'moderate'|'low';title:string;actions:string[];workup:string[];disposition:string;pitfall?:string};next?:(s:string)=>string}
const tree:Record<string,TreeNode>={
  start:{id:'start',title:'Step 1: 脱力のパターン評価',desc:'「脱力」はまず上位運動ニューロン（UMN: 脳卒中等）vs 下位運動ニューロン（LMN: GBS等）vs 非神経学的（全身倦怠）を区別。発症様式と分布が鍵。',
    choices:[
      {label:'急性発症の片麻痺/半身症状（脳卒中疑い）',value:'stroke',icon:'🧠',danger:true},
      {label:'急性の両下肢麻痺（脊髄・馬尾）',value:'paraplegia',icon:'🚨',danger:true},
      {label:'亜急性〜進行性の四肢脱力（GBS/重症筋無力症）',value:'ascending',icon:'⚠️',danger:true},
      {label:'全身倦怠感・だるさ（脱力というより疲労感）',value:'fatigue',icon:'😫'},
    ],next:v=>v,
  },
  stroke:{id:'stroke',title:'🧠 急性片麻痺 → 脳卒中プロトコル',
    result:{severity:'critical',title:'脳卒中疑い — time is brain',
      actions:['脳卒中プロトコル発動（発症時刻の確認が最重要）','NIHSS評価','頭部CT（出血除外）→ MRI DWI','発症4.5h以内 → t-PA適応評価','大血管閉塞 → 血管内治療（24h以内の適応もあり）','Todd麻痺（けいれん後の一過性麻痺）との鑑別'],
      workup:['頭部CT → MRI DWI/MRA','CBC・凝固','電解質・血糖','心電図（AF）','NIHSS'],
      disposition:'脳卒中ユニット or ICU',
      pitfall:'「症状が良くなってきた」TIAでも24-48h以内の脳梗塞リスクが高い。ABCD2スコアで評価。低血糖による片麻痺を脳卒中と誤診しない→血糖チェック必須',
    },
  },
  paraplegia:{id:'paraplegia',title:'🚨 急性対麻痺 → 脊髄緊急',
    result:{severity:'critical',title:'急性対麻痺 — 脊髄圧迫/梗塞/GBS',
      actions:['感覚レベルの確認（T10以下？胸髄？頚髄？）','膀胱直腸障害の確認 → 馬尾症候群の評価','緊急MRI（全脊椎）','脊髄圧迫（転移性腫瘍・硬膜外膿瘍）→ デキサメタゾン + 脊椎外科コンサルト','脊髄梗塞: MRI DWIで確認。大動脈手術後に多い','GBS: 腱反射消失＋蛋白細胞解離（髄液）→ IVIG or 血漿交換','大動脈解離に伴う脊髄虚血も考慮'],
      workup:['全脊椎MRI（緊急）','腰椎穿刺（GBS疑い時: 蛋白↑・細胞正常）','CBC・CRP','電解質','残尿測定'],
      disposition:'入院（脊髄圧迫は緊急手術/放射線治療の適応）',
      pitfall:'急性対麻痺はゴールデンタイムが短い。脊髄圧迫は24-48h以内の除圧が予後を左右。「腰痛からの悪化」を軽視しない',
    },
  },
  ascending:{id:'ascending',title:'⚠️ 進行性四肢脱力',
    result:{severity:'urgent',title:'GBS / 重症筋無力症クリーゼの評価',
      actions:['GBS: 上行性の対称性脱力 + 腱反射消失 + 先行感染歴（1-4週前にCampylobacter等）','呼吸筋評価が最重要: FVC（努力肺活量）< 20mL/kg or NIF < -30cmH2O → 挿管準備','GBS確定 → IVIG(0.4g/kg×5日) or 血漿交換','重症筋無力症: 変動する脱力 + 眼瞼下垂 + 複視 → 抗AChR抗体','MG クリーゼ: 呼吸筋麻痺 → ICU管理 + IVIG/血漿交換','チアミン欠乏（Wernicke脳症: 眼球運動障害+失調+意識障害）→ チアミン iv'],
      workup:['腰椎穿刺（GBS: 蛋白細胞解離）','NCS/EMG（神経伝導検査）','FVC/NIF（呼吸機能）','抗AChR抗体/抗MuSK抗体（MG）','頭部MRI（脱髄疾患除外）'],
      disposition:'入院（GBSは進行が予測不能。FVC測定を頻回に）',
      pitfall:'GBSの20-30%で呼吸不全に至る。「まだ歩ける」段階でも入院管理が原則。自律神経障害（血圧変動・不整脈）にも注意',
    },
  },
  fatigue:{id:'fatigue',title:'全身倦怠感・疲労',
    result:{severity:'low',title:'非神経学的「脱力」— 全身倦怠感の評価',
      actions:['貧血: CBC（Hb低下）','甲状腺機能: TSH（低下症 or 亢進症）','電解質異常: 低K・低Na・高Ca','感染症: CRP・胸部X線','糖尿病: HbA1c・血糖','副腎不全: コルチゾール（朝）+ ACTH','うつ病/慢性疲労症候群: 器質的疾患除外後に検討','薬剤性: β遮断薬・スタチン・BZD'],
      workup:['CBC','TSH/FT4','電解質・Ca','血糖・HbA1c','肝腎機能','CRP','尿検査'],
      disposition:'帰宅（原因に応じた外来フォロー）',
      pitfall:'「疲れやすい」の中に心不全（BNP）やAddisonが隠れていることがある。バイタル・身体所見を丁寧に',
    },
  },
}
const sevColor={critical:{bg:'bg-[#FDECEA]',border:'border-[#D93025]',text:'text-[#B71C1C]',badge:'🚨 緊急'},urgent:{bg:'bg-[#FFF8E1]',border:'border-[#F9A825]',text:'text-[#E65100]',badge:'⚠️ 準緊急'},moderate:{bg:'bg-[#E8F0FE]',border:'border-[#4285F4]',text:'text-[#1565C0]',badge:'ℹ️ 中等度'},low:{bg:'bg-[#E6F4EA]',border:'border-[#34A853]',text:'text-[#1B5E20]',badge:'✅ 低リスク'}}
export default function WeaknessPage(){
  const[path,setPath]=useState<string[]>(['start']);const current=tree[path[path.length-1]];const hc=(v:string)=>{if(current?.next){const n=current.next(v);if(tree[n])setPath(p=>[...p,n])}};const gb=()=>{if(path.length>1)setPath(p=>p.slice(0,-1))};const rs=()=>setPath(['start']);if(!current)return null;const sc=current.result?sevColor[current.result.severity]:null
  return(<div className="max-w-3xl mx-auto"><nav className="text-sm text-muted mb-6"><Link href="/" className="hover:text-ac">ホーム</Link><span className="mx-2">›</span><Link href="/tools" className="hover:text-ac">臨床ツール</Link><span className="mx-2">›</span><Link href="/tools/er" className="hover:text-ac">ER対応</Link><span className="mx-2">›</span><span>麻痺・脱力</span></nav>
  <header className="mb-6"><span className="inline-block text-sm bg-dnl text-dn px-2.5 py-0.5 rounded-full font-medium mb-2">🚨 ER対応</span><h1 className="text-2xl font-bold text-tx mb-1">麻痺・脱力</h1><p className="text-sm text-muted">UMN(脳卒中) vs LMN(GBS) vs 脊髄 vs 非神経学的。発症様式と分布で鑑別</p></header>
  <ERDisclaimerBanner /><div className="mb-4 flex items-center gap-2">{path.length>1&&<button onClick={gb} className="text-xs text-ac px-2 py-1 rounded border border-ac/20 hover:bg-acl transition-colors">← 戻る</button>}{path.length>1&&<button onClick={rs} className="text-xs text-muted px-2 py-1 rounded border border-br hover:bg-s1 transition-colors">最初から</button>}</div>
  {current.choices&&!current.result&&(<div className="bg-s0 border border-br rounded-xl p-5 mb-6"><h2 className="text-base font-bold text-tx mb-2">{current.title}</h2>{current.desc&&<p className="text-sm text-muted mb-4">{current.desc}</p>}<div className="space-y-2">{current.choices.map(c=>(<button key={c.value} onClick={()=>hc(c.value)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${c.danger?'border-[#D93025]/30 hover:border-[#D93025] hover:bg-[#FDECEA]':'border-br hover:border-ac/40 hover:bg-acl'}`}><span className="text-sm font-medium text-tx">{c.icon&&<span className="mr-2">{c.icon}</span>}{c.label}</span></button>))}</div></div>)}
  {current.result&&sc&&(<div className={`${sc.bg} border-2 ${sc.border} rounded-xl p-5 mb-6`}><div className="flex items-center gap-2 mb-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sc.text} bg-white/70`}>{sc.badge}</span></div><h2 className={`text-lg font-bold mb-3 ${sc.text}`}>{current.result.title}</h2><div className="space-y-4"><div><p className="text-xs font-bold text-tx mb-2">アクション</p><div className="space-y-1.5">{current.result.actions.map((a,i)=><p key={i} className="text-sm text-tx leading-relaxed">{a}</p>)}</div></div><div><p className="text-xs font-bold text-tx mb-2">検査オーダー</p><div className="flex flex-wrap gap-1.5">{current.result.workup.map((w,i)=><span key={i} className="text-xs px-2 py-0.5 rounded bg-white/60 text-tx">{w}</span>)}</div></div><div className="flex items-center gap-2"><p className="text-xs font-bold text-tx">Disposition:</p><p className="text-sm text-tx">{current.result.disposition}</p></div>{current.result.pitfall&&(<div className="bg-white/60 rounded-lg p-3"><p className="text-xs font-bold text-[#E65100] mb-1">⚠️ ピットフォール</p><p className="text-xs text-tx leading-relaxed">{current.result.pitfall}</p></div>)}</div><ERResultCaution /><button onClick={rs} className="mt-4 w-full py-2.5 bg-white/60 rounded-xl text-sm font-medium text-tx hover:bg-white/80 transition-colors">最初からやり直す</button></div>)}
  <ERDisclaimerFooter /></div>)
}
