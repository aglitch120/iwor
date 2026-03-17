'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ERDisclaimerBanner, ERDisclaimerFooter, ERResultCaution } from '@/components/tools/ERDisclaimer'
interface Choice{label:string;value:string;icon?:string;danger?:boolean}
interface TreeNode{id:string;title:string;desc?:string;choices?:Choice[];result?:{severity:'critical'|'urgent'|'moderate'|'low';title:string;actions:string[];workup:string[];disposition:string;pitfall?:string};next?:(s:string)=>string}
const tree:Record<string,TreeNode>={
  start:{id:'start',title:'Step 1: 緊急疾患の除外',desc:'しびれ（感覚障害）のER評価では脳卒中・脊髄圧迫・GBSを最初に除外。急性発症＋局所神経症状は緊急。',
    choices:[
      {label:'急性片側しびれ + 脱力/失語（脳卒中疑い）',value:'stroke',icon:'🧠',danger:true},
      {label:'両下肢のしびれ + 筋力低下 + 膀胱直腸障害（脊髄/馬尾）',value:'spinal',icon:'🚨',danger:true},
      {label:'上行性の四肢しびれ + 腱反射消失（GBS疑い）',value:'gbs',icon:'⚠️',danger:true},
      {label:'手袋靴下型（両手足先端から）— 末梢神経障害パターン',value:'peripheral',icon:'🧤'},
      {label:'単一神経領域のしびれ（手/肘/足のしびれ）',value:'focal',icon:'📍'},
      {label:'全身のピリピリ + 過換気（パニック/過換気症候群）',value:'hyperventilation',icon:'😰'},
    ],next:v=>v,
  },
  stroke:{id:'stroke',title:'🧠 急性片側しびれ → 脳卒中評価',
    result:{severity:'critical',title:'脳卒中疑い — 急性片側感覚障害',
      actions:['→ 麻痺・脱力フロー参照（/tools/er/weakness）','脳卒中プロトコル発動','純粋感覚障害（pure sensory stroke）= 視床ラクナ梗塞が代表','頭部CT → MRI DWI','発症4.5h以内 → t-PA適応評価','TIA（一過性のしびれ）でも24-48h以内の脳梗塞リスクあり → ABCD2スコア'],
      workup:['頭部CT → MRI DWI/MRA','CBC・凝固','血糖','心電図（AF）'],
      disposition:'脳卒中ユニット',
      pitfall:'「しびれだけで脱力がない」= 脳卒中ではない、ではない。純粋感覚性脳卒中は見逃しやすい。片側の急性しびれは常に脳血管疾患を考慮',
    },
  },
  spinal:{id:'spinal',title:'🚨 脊髄/馬尾 → 緊急MRI',
    result:{severity:'critical',title:'脊髄圧迫 / 馬尾症候群',
      actions:['→ 腰背部痛フローの馬尾症候群セクション参照（/tools/er/back-pain）','感覚レベルの特定（ピンプリックテスト: どの高さから感覚が変わるか）','馬尾: サドル麻痺 + 膀胱直腸障害 + 両下肢脱力','脊髄圧迫: デキサメタゾン 10mg iv → 緊急MRI','48h以内の除圧が予後を左右'],
      workup:['全脊椎MRI（緊急）','残尿測定','神経学的診察（感覚レベル・反射・肛門反射）'],
      disposition:'緊急手術 → 入院',
      pitfall:'「腰痛 + 両足のしびれ」は馬尾のRed Flag。サドル麻痺と肛門反射は必ず確認',
    },
  },
  gbs:{id:'gbs',title:'⚠️ GBS疑い → 麻痺・脱力フロー参照',
    result:{severity:'urgent',title:'GBS（ギラン・バレー症候群）疑い',
      actions:['→ 麻痺・脱力フロー参照（/tools/er/weakness）','上行性の対称性しびれ/脱力 + 腱反射消失','先行感染歴（1-4週前）を確認','呼吸機能評価が最重要: FVC < 20mL/kg → 挿管準備','IVIG or 血漿交換'],
      workup:['腰椎穿刺（蛋白細胞解離）','NCS/EMG','FVC/NIF'],
      disposition:'入院（進行が予測不能）',
      pitfall:'GBSの初期症状は「足先のしびれ」だけのことがある。腱反射消失は早期サイン',
    },
  },
  peripheral:{id:'peripheral',title:'手袋靴下型 — 末梢神経障害',
    result:{severity:'low',title:'末梢神経障害（ポリニューロパチー）',
      actions:['最多原因: 糖尿病性末梢神経障害','HbA1c・空腹時血糖で糖尿病の評価','ビタミンB12欠乏: MCV上昇 + B12低値 → 補充（B12 1000μg筋注）','アルコール性: 栄養障害 + チアミン欠乏','薬剤性: 抗がん剤（シスプラチン・タキサン）・INH・メトロニダゾール','その他: 甲状腺機能低下・尿毒症・MGUS・vasculitic neuropathy','疼痛管理: プレガバリン or デュロキセチン or アミトリプチリン'],
      workup:['血糖・HbA1c','ビタミンB12','葉酸','TSH','腎機能','血清蛋白電気泳動（MGUS除外）','NCS/EMG（外来）'],
      disposition:'帰宅（神経内科外来紹介）',
      pitfall:'B12欠乏は不可逆的な脊髄障害（亜急性連合性脊髄変性）に進展しうる。MCV正常でもB12は測定を。メトホルミン長期服用でB12低下',
    },
  },
  focal:{id:'focal',title:'単一神経領域のしびれ',
    result:{severity:'low',title:'単神経障害 — 絞扼性神経障害の評価',
      actions:['手根管症候群: 正中神経（母指〜環指橈側のしびれ、夜間増悪）→ Tinel/Phalen試験','肘部管症候群: 尺骨神経（環指尺側〜小指のしびれ）','腓骨神経麻痺: 下腿外側〜足背のしびれ + 下垂足（足関節背屈不能）','橈骨神経麻痺: 手背のしびれ + 下垂手（Saturday night palsy）','大腿外側皮神経痛（メラルジア・パレステティカ）: 大腿外側のしびれ・灼熱感','NCS/EMGで確定診断（外来）','保存的治療: スプリント固定・NSAIDs・生活指導。改善しなければ手術'],
      workup:['神経学的診察（感覚領域の分布で責任神経同定）','NCS/EMG（外来で）','頚椎/腰椎MRI（神経根症との鑑別が必要な場合）'],
      disposition:'帰宅（整形外科 or 神経内科外来紹介）',
      pitfall:'手のしびれ = 手根管症候群と決めつけない。C6/C7神経根症（頚椎椎間板ヘルニア）でも類似症状。Spurling testで神経根症を評価',
    },
  },
  hyperventilation:{id:'hyperventilation',title:'過換気症候群',
    result:{severity:'low',title:'過換気症候群 — 安心させつつ他疾患除外',
      actions:['両手足のしびれ + 口周囲のしびれ + テタニー（手の攣縮: 助産婦手位）','呼吸性アルカローシス → イオン化Ca低下 → しびれ・テタニー','ペーパーバッグ法は推奨されなくなった（低酸素リスク）→ ゆっくり呼吸を指導','器質的疾患の除外: PE・ACS・DKA（Kussmaul呼吸を過換気と誤認）','不安障害/パニック障害が背景にあることが多い → 精神科/心療内科紹介検討'],
      workup:['血液ガス（呼吸性アルカローシスの確認）','心電図（ACS除外）','SpO2','D-dimer（PE疑い時）'],
      disposition:'帰宅（改善後）',
      pitfall:'「過換気症候群」は除外診断。PE・DKA・代謝性アシドーシスの代償としての過換気を見逃さない。血液ガスでpH>7.45＋PCO2低下で確認',
    },
  },
}
const sevColor={critical:{bg:'bg-[#FDECEA]',border:'border-[#D93025]',text:'text-[#B71C1C]',badge:'🚨 緊急'},urgent:{bg:'bg-[#FFF8E1]',border:'border-[#F9A825]',text:'text-[#E65100]',badge:'⚠️ 準緊急'},moderate:{bg:'bg-[#E8F0FE]',border:'border-[#4285F4]',text:'text-[#1565C0]',badge:'ℹ️ 中等度'},low:{bg:'bg-[#E6F4EA]',border:'border-[#34A853]',text:'text-[#1B5E20]',badge:'✅ 低リスク'}}
export default function NumbnessPage(){
  const[path,setPath]=useState<string[]>(['start']);const current=tree[path[path.length-1]];const hc=(v:string)=>{if(current?.next){const n=current.next(v);if(tree[n])setPath(p=>[...p,n])}};const gb=()=>{if(path.length>1)setPath(p=>p.slice(0,-1))};const rs=()=>setPath(['start']);if(!current)return null;const sc=current.result?sevColor[current.result.severity]:null
  return(<div className="max-w-3xl mx-auto"><nav className="text-sm text-muted mb-6"><Link href="/" className="hover:text-ac">ホーム</Link><span className="mx-2">›</span><Link href="/tools" className="hover:text-ac">臨床ツール</Link><span className="mx-2">›</span><Link href="/tools/er" className="hover:text-ac">ER対応</Link><span className="mx-2">›</span><span>しびれ</span></nav>
  <header className="mb-6"><span className="inline-block text-sm bg-dnl text-dn px-2.5 py-0.5 rounded-full font-medium mb-2">🚨 ER対応</span><h1 className="text-2xl font-bold text-tx mb-1">しびれ</h1><p className="text-sm text-muted">脳卒中・脊髄・GBS除外 → 末梢神経障害(DM/B12) → 絞扼性神経障害 → 過換気症候群</p></header>
  <ERDisclaimerBanner /><div className="mb-4 flex items-center gap-2">{path.length>1&&<button onClick={gb} className="text-xs text-ac px-2 py-1 rounded border border-ac/20 hover:bg-acl transition-colors">← 戻る</button>}{path.length>1&&<button onClick={rs} className="text-xs text-muted px-2 py-1 rounded border border-br hover:bg-s1 transition-colors">最初から</button>}</div>
  {current.choices&&!current.result&&(<div className="bg-s0 border border-br rounded-xl p-5 mb-6"><h2 className="text-base font-bold text-tx mb-2">{current.title}</h2>{current.desc&&<p className="text-sm text-muted mb-4">{current.desc}</p>}<div className="space-y-2">{current.choices.map(c=>(<button key={c.value} onClick={()=>hc(c.value)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${c.danger?'border-[#D93025]/30 hover:border-[#D93025] hover:bg-[#FDECEA]':'border-br hover:border-ac/40 hover:bg-acl'}`}><span className="text-sm font-medium text-tx">{c.icon&&<span className="mr-2">{c.icon}</span>}{c.label}</span></button>))}</div></div>)}
  {current.result&&sc&&(<div className={`${sc.bg} border-2 ${sc.border} rounded-xl p-5 mb-6`}><div className="flex items-center gap-2 mb-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sc.text} bg-white/70`}>{sc.badge}</span></div><h2 className={`text-lg font-bold mb-3 ${sc.text}`}>{current.result.title}</h2><div className="space-y-4"><div><p className="text-xs font-bold text-tx mb-2">アクション</p><div className="space-y-1.5">{current.result.actions.map((a,i)=><p key={i} className="text-sm text-tx leading-relaxed">{a}</p>)}</div></div><div><p className="text-xs font-bold text-tx mb-2">検査オーダー</p><div className="flex flex-wrap gap-1.5">{current.result.workup.map((w,i)=><span key={i} className="text-xs px-2 py-0.5 rounded bg-white/60 text-tx">{w}</span>)}</div></div><div className="flex items-center gap-2"><p className="text-xs font-bold text-tx">Disposition:</p><p className="text-sm text-tx">{current.result.disposition}</p></div>{current.result.pitfall&&(<div className="bg-white/60 rounded-lg p-3"><p className="text-xs font-bold text-[#E65100] mb-1">⚠️ ピットフォール</p><p className="text-xs text-tx leading-relaxed">{current.result.pitfall}</p></div>)}</div><ERResultCaution /><button onClick={rs} className="mt-4 w-full py-2.5 bg-white/60 rounded-xl text-sm font-medium text-tx hover:bg-white/80 transition-colors">最初からやり直す</button></div>)}
  <ERDisclaimerFooter /></div>)
}
