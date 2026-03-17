'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ERDisclaimerBanner, ERDisclaimerFooter, ERResultCaution } from '@/components/tools/ERDisclaimer'
interface Choice{label:string;value:string;icon?:string;danger?:boolean}
interface TreeNode{id:string;title:string;desc?:string;choices?:Choice[];result?:{severity:'critical'|'urgent'|'moderate'|'low';title:string;actions:string[];workup:string[];disposition:string;pitfall?:string};next?:(s:string)=>string}
const tree:Record<string,TreeNode>={
  start:{id:'start',title:'Step 1: 出血量の評価',desc:'喀血の緊急度は出血量で決まる。大量喀血（24hで>200-600mL or 1回で>100mL）は致死的。まず喀血か吐血かの鑑別も重要。',
    choices:[
      {label:'大量喀血（鮮血を大量に喀出 / 呼吸困難を伴う）',value:'massive',icon:'🚨',danger:true},
      {label:'少量〜中等量の血痰（バイタル安定）',value:'moderate',icon:'🩸'},
      {label:'吐血との鑑別が必要',value:'ddx',icon:'🔍'},
    ],next:v=>v,
  },
  massive:{id:'massive',title:'🚨 大量喀血 — 気道確保が最優先',
    result:{severity:'critical',title:'大量喀血 — 窒息防止＋止血',
      actions:['出血側を下にした側臥位（健側肺への血液流入防止）','大口径ルート確保・T&S・輸血準備','酸素投与 → SpO2維持困難なら気管挿管','気管挿管時: 太いチューブ（8.0以上）→ 吸引しやすい','片肺挿管（出血側をブロック）の検討','呼吸器内科 + IVR/放射線科 緊急コンサルト','気管支動脈塞栓術（BAE）が緊急止血の第一選択','BAE困難 → 硬性気管支鏡での止血 or 緊急手術'],
      workup:['胸部CT造影（出血源同定・気管支動脈の走行評価）','CBC・凝固','T&S','血液ガス','喀痰培養・抗酸菌塗抹','胸部X線'],
      disposition:'ICU',
      pitfall:'大量喀血の死因は出血ではなく窒息。気道確保が最優先。抗凝固薬使用中なら拮抗を。肺結核の空洞病変からの大量喀血は致死率高い',
    },
  },
  moderate:{id:'moderate',title:'Step 2: 少量〜中等量の血痰 — 原因検索',
    choices:[
      {label:'咳嗽 + 発熱 + 膿性痰（肺炎/気管支炎）',value:'infection',icon:'🌡️'},
      {label:'慢性咳嗽 + 喫煙歴（肺癌疑い）',value:'cancer',icon:'🫁',danger:true},
      {label:'呼吸困難 + 胸痛（PE疑い）',value:'pe',icon:'💓',danger:true},
      {label:'結核リスク（長引く咳・体重減少・盗汗）',value:'tb',icon:'🦠'},
      {label:'若年 + 反復する血痰（気管支拡張症等）',value:'bronchiectasis',icon:'🔄'},
    ],next:v=>v,
  },
  infection:{id:'infection',title:'感染性（肺炎/気管支炎）',
    result:{severity:'moderate',title:'感染に伴う血痰',
      actions:['急性気管支炎: 血痰は炎症による粘膜損傷。通常自然軽快','肺炎: 抗菌薬治療（→ CURB-65で重症度評価）','肺膿瘍: 長期抗菌薬。ドレナージの適応評価'],
      workup:['胸部X線/CT','喀痰培養・グラム染色','CBC・CRP','抗酸菌塗抹（結核除外）'],
      disposition:'軽症→帰宅。肺炎入院基準→入院',
      pitfall:'「気管支炎で血痰」でも、喫煙者や50歳以上では肺癌の精査（CT）を検討',
    },
  },
  cancer:{id:'cancer',title:'🫁 肺癌疑い',
    result:{severity:'urgent',title:'肺癌疑い — 胸部CT＋気管支鏡',
      actions:['胸部CT造影','喀痰細胞診','呼吸器内科コンサルト → 気管支鏡検査','大量喀血リスク → 入院管理','PET-CT・縦隔リンパ節生検（staging）'],
      workup:['胸部CT造影','喀痰細胞診×3日間','CBC・腫瘍マーカー（CEA, CYFRA, ProGRP, SCC）','気管支鏡（生検）'],
      disposition:'外来精査可（少量血痰・バイタル安定）。大量喀血リスクあれば入院',
      pitfall:'喫煙歴のある患者の血痰は「気管支炎」で片付けず、必ず胸部CTを施行',
    },
  },
  pe:{id:'pe',title:'PE疑い → 胸痛フロー参照',
    result:{severity:'critical',title:'肺塞栓 — 血痰＋呼吸困難＋胸痛',
      actions:['Wells scoreでPE確率評価','D-dimer（低〜中リスクで除外目的）','CT肺動脈造影（CTPA）','抗凝固療法開始（ヘパリン → DOAC）'],
      workup:['CTPA','D-dimer','心電図','心エコー（右心負荷）','下肢静脈エコー'],
      disposition:'抗凝固開始 → 軽症なら外来管理可。massive PE → ICU',
      pitfall:'喀血＋呼吸困難＋胸膜痛はPEの古典的3徴。長時間の座位・術後・下肢DVTの既往を確認',
    },
  },
  tb:{id:'tb',title:'🦠 結核疑い',
    result:{severity:'urgent',title:'肺結核疑い — 隔離＋検査',
      actions:['空気予防策（N95マスク・陰圧個室）','喀痰抗酸菌塗抹×3回（早朝痰が理想）','IGRA（T-SPOT / QFT）','胸部CT（空洞・粟粒影・上葉浸潤影）','保健所への届出（塗抹陽性時）','治療開始は感染症科/呼吸器科と相談'],
      workup:['喀痰抗酸菌塗抹・培養×3','IGRA','胸部CT','HIV検査（結核合併時はHIV検査推奨）'],
      disposition:'塗抹陽性→入院（感染管理目的）。塗抹陰性→外来フォロー可（培養結果待ち）',
      pitfall:'結核は「忘れた頃にやってくる」。長引く咳＋血痰＋体重減少→必ず抗酸菌塗抹を提出。免疫不全者では非典型的な画像所見',
    },
  },
  bronchiectasis:{id:'bronchiectasis',title:'気管支拡張症等',
    result:{severity:'moderate',title:'気管支拡張症 / その他の原因',
      actions:['胸部HRCT（気管支拡張の確認）','反復する血痰 → 気管支鏡で出血源同定','Goodpasture症候群/肺血管炎（ANCA）→ 腎機能＋ANCA＋尿検査','僧帽弁狭窄（左房圧↑→肺うっ血→血痰）→ 心エコー'],
      workup:['胸部HRCT','CBC・凝固','ANCA（血管炎疑い時）','尿検査（腎糸球体腎炎合併）','心エコー'],
      disposition:'外来精査可（少量血痰）',
      pitfall:'若年女性の反復血痰で原因不明 → 気管支内カルチノイドも鑑別に入れる',
    },
  },
  ddx:{id:'ddx',title:'喀血 vs 吐血の鑑別',
    result:{severity:'moderate',title:'喀血と吐血の鑑別ポイント',
      actions:['喀血: 鮮紅色・泡立つ・咳嗽で排出・アルカリ性','吐血: 暗赤色〜コーヒー残渣様・嘔吐で排出・酸性・食物残渣混入','鼻出血の後鼻漏を「喀血」と訴えることもある → 鼻腔の確認','判断困難 → 胸部CT + 上部消化管内視鏡の両方を検討'],
      workup:['胸部X線/CT','CBC','喀痰/嘔吐物の性状確認'],
      disposition:'原因に応じた対応',
      pitfall:'大量の上部消化管出血が気道に流入し「喀血」と訴えることがある。経鼻胃管も鑑別に有用',
    },
  },
}
const sevColor={critical:{bg:'bg-[#FDECEA]',border:'border-[#D93025]',text:'text-[#B71C1C]',badge:'🚨 緊急'},urgent:{bg:'bg-[#FFF8E1]',border:'border-[#F9A825]',text:'text-[#E65100]',badge:'⚠️ 準緊急'},moderate:{bg:'bg-[#E8F0FE]',border:'border-[#4285F4]',text:'text-[#1565C0]',badge:'ℹ️ 中等度'},low:{bg:'bg-[#E6F4EA]',border:'border-[#34A853]',text:'text-[#1B5E20]',badge:'✅ 低リスク'}}
export default function HemoptysisPage(){
  const[path,setPath]=useState<string[]>(['start']);const current=tree[path[path.length-1]];const hc=(v:string)=>{if(current?.next){const n=current.next(v);if(tree[n])setPath(p=>[...p,n])}};const gb=()=>{if(path.length>1)setPath(p=>p.slice(0,-1))};const rs=()=>setPath(['start']);if(!current)return null;const sc=current.result?sevColor[current.result.severity]:null
  return(<div className="max-w-3xl mx-auto"><nav className="text-sm text-muted mb-6"><Link href="/" className="hover:text-ac">ホーム</Link><span className="mx-2">›</span><Link href="/tools" className="hover:text-ac">臨床ツール</Link><span className="mx-2">›</span><Link href="/tools/er" className="hover:text-ac">ER対応</Link><span className="mx-2">›</span><span>血痰・喀血</span></nav>
  <header className="mb-6"><span className="inline-block text-sm bg-dnl text-dn px-2.5 py-0.5 rounded-full font-medium mb-2">🚨 ER対応</span><h1 className="text-2xl font-bold text-tx mb-1">血痰・喀血</h1><p className="text-sm text-muted">出血量評価 → 大量喀血は窒息リスク → 気管支動脈塞栓(BAE)。肺癌・PE・結核の鑑別</p></header>
  <ERDisclaimerBanner /><div className="mb-4 flex items-center gap-2">{path.length>1&&<button onClick={gb} className="text-xs text-ac px-2 py-1 rounded border border-ac/20 hover:bg-acl transition-colors">← 戻る</button>}{path.length>1&&<button onClick={rs} className="text-xs text-muted px-2 py-1 rounded border border-br hover:bg-s1 transition-colors">最初から</button>}</div>
  {current.choices&&!current.result&&(<div className="bg-s0 border border-br rounded-xl p-5 mb-6"><h2 className="text-base font-bold text-tx mb-2">{current.title}</h2>{current.desc&&<p className="text-sm text-muted mb-4">{current.desc}</p>}<div className="space-y-2">{current.choices.map(c=>(<button key={c.value} onClick={()=>hc(c.value)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${c.danger?'border-[#D93025]/30 hover:border-[#D93025] hover:bg-[#FDECEA]':'border-br hover:border-ac/40 hover:bg-acl'}`}><span className="text-sm font-medium text-tx">{c.icon&&<span className="mr-2">{c.icon}</span>}{c.label}</span></button>))}</div></div>)}
  {current.result&&sc&&(<div className={`${sc.bg} border-2 ${sc.border} rounded-xl p-5 mb-6`}><div className="flex items-center gap-2 mb-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sc.text} bg-white/70`}>{sc.badge}</span></div><h2 className={`text-lg font-bold mb-3 ${sc.text}`}>{current.result.title}</h2><div className="space-y-4"><div><p className="text-xs font-bold text-tx mb-2">アクション</p><div className="space-y-1.5">{current.result.actions.map((a,i)=><p key={i} className="text-sm text-tx leading-relaxed">{a}</p>)}</div></div><div><p className="text-xs font-bold text-tx mb-2">検査オーダー</p><div className="flex flex-wrap gap-1.5">{current.result.workup.map((w,i)=><span key={i} className="text-xs px-2 py-0.5 rounded bg-white/60 text-tx">{w}</span>)}</div></div><div className="flex items-center gap-2"><p className="text-xs font-bold text-tx">Disposition:</p><p className="text-sm text-tx">{current.result.disposition}</p></div>{current.result.pitfall&&(<div className="bg-white/60 rounded-lg p-3"><p className="text-xs font-bold text-[#E65100] mb-1">⚠️ ピットフォール</p><p className="text-xs text-tx leading-relaxed">{current.result.pitfall}</p></div>)}</div><ERResultCaution /><button onClick={rs} className="mt-4 w-full py-2.5 bg-white/60 rounded-xl text-sm font-medium text-tx hover:bg-white/80 transition-colors">最初からやり直す</button></div>)}
  <ERDisclaimerFooter /></div>)
}
