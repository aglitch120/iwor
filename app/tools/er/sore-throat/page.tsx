'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ERDisclaimerBanner, ERDisclaimerFooter, ERResultCaution } from '@/components/tools/ERDisclaimer'
interface Choice{label:string;value:string;icon?:string;danger?:boolean}
interface TreeNode{id:string;title:string;desc?:string;choices?:Choice[];result?:{severity:'critical'|'urgent'|'moderate'|'low';title:string;actions:string[];workup:string[];disposition:string;pitfall?:string};next?:(s:string)=>string}
const tree:Record<string,TreeNode>={
  start:{id:'start',title:'Step 1: 気道緊急の除外',desc:'咽頭痛のER評価ではまず気道閉塞リスクを評価。stridor・開口障害・流涎・座位前傾姿勢は気道緊急のサイン。',
    choices:[
      {label:'気道緊急サイン（stridor/開口障害/流涎/tripod posture）',value:'airway',icon:'🚨',danger:true},
      {label:'片側性の著明な咽頭腫脹 or 開口制限',value:'peritonsillar',icon:'⚠️',danger:true},
      {label:'発熱 + 咽頭痛（感染症パターン）',value:'infectious',icon:'🌡️'},
      {label:'外傷/異物の可能性',value:'trauma',icon:'🦴'},
    ],next:v=>v,
  },
  airway:{id:'airway',title:'🚨 気道緊急',
    result:{severity:'critical',title:'気道緊急 — 急性喉頭蓋炎/深頚部膿瘍',
      actions:['患者を刺激しない（泣かせない・仰臥位にしない）','酸素投与・気管挿管準備（困難気道→外科的気道確保準備）','耳鼻科/麻酔科緊急コンサルト','急性喉頭蓋炎: 抗菌薬iv（CTRX + ステロイド）+ ICU管理','深頚部膿瘍: 頚部CT造影 → 外科的ドレナージ','Ludwig angina（口腔底蜂窩織炎）: 急速に気道閉塞 → 早期挿管判断'],
      workup:['頚部側面X線（thumb sign: 喉頭蓋腫大）','頚部CT造影（膿瘍評価）','CBC・CRP','血液培養'],
      disposition:'ICU（気道確保後）',
      pitfall:'急性喉頭蓋炎では無理に咽頭を観察しようとすると喉頭痙攣→完全閉塞の危険。挿管準備を整えてから評価',
    },
  },
  peritonsillar:{id:'peritonsillar',title:'⚠️ 扁桃周囲膿瘍疑い',
    result:{severity:'urgent',title:'扁桃周囲膿瘍 — 穿刺排膿',
      actions:['口蓋垂の偏位 + 片側扁桃の著明な腫脹 + 開口障害 → 扁桃周囲膿瘍を強く疑う','耳鼻科コンサルト → 穿刺排膿 or 切開排膿','抗菌薬: ABPC/SBT or クリンダマイシン iv','鎮痛: NSAIDs + アセトアミノフェン','脱水あれば補液','外来穿刺後に改善すれば帰宅可能な場合もある（耳鼻科判断）'],
      workup:['口腔内診察（口蓋垂偏位確認）','頚部CT造影（膿瘍の範囲・深頚部への進展評価）','CBC・CRP'],
      disposition:'耳鼻科で穿刺排膿。深頚部進展→入院',
      pitfall:'「扁桃炎の悪化」で経過観察せず、開口障害があれば膿瘍形成を疑ってCT。深頚部への進展は縦隔膿瘍→致命的',
    },
  },
  infectious:{id:'infectious',title:'Step 2: 感染性咽頭炎の評価',
    choices:[
      {label:'Centor基準 3-4点（発熱+前頚部リンパ節腫脹+扁桃白苔+咳なし）→ GAS疑い',value:'gas',icon:'🦠'},
      {label:'Centor基準 0-2点 → ウイルス性の可能性高い',value:'viral',icon:'🤧'},
      {label:'若年 + 全身倦怠 + 肝脾腫 → 伝染性単核球症疑い',value:'mono',icon:'😫'},
    ],next:v=>v,
  },
  gas:{id:'gas',title:'GAS（A群溶血性レンサ球菌）咽頭炎',
    result:{severity:'moderate',title:'GAS咽頭炎 — 迅速検査＋抗菌薬',
      actions:['迅速抗原検査（感度80-90%）or 咽頭培養','陽性 → AMPC 1500mg/日 分3 × 10日間（ペニシリンアレルギー→アジスロマイシン）','リウマチ熱予防のため10日間完遂が重要','対症療法: アセトアミノフェン/NSAIDs','うがい・トローチ'],
      workup:['迅速抗原検査 or 咽頭培養','必要に応じてCBC（WBC上昇パターン確認）'],
      disposition:'帰宅（経口抗菌薬）',
      pitfall:'迅速検査陰性でも臨床的にGAS疑いが強ければ培養提出。成人ではリウマチ熱リスクは低いが、小児では重要',
    },
  },
  viral:{id:'viral',title:'ウイルス性咽頭炎',
    result:{severity:'low',title:'ウイルス性咽頭炎 — 対症療法',
      actions:['抗菌薬不要','対症療法: アセトアミノフェン/NSAIDs + うがい + 水分摂取','経口摂取困難→補液検討','通常3-5日で改善。1週間以上持続→再評価'],
      workup:['通常不要（典型的パターンなら）'],
      disposition:'帰宅',
      pitfall:'咳・鼻水・結膜炎を伴う→ウイルス性の可能性高い。扁桃白苔はウイルス（EBV等）でも出る',
    },
  },
  mono:{id:'mono',title:'伝染性単核球症（EBV）',
    result:{severity:'moderate',title:'伝染性単核球症 — 安静＋対症療法',
      actions:['異型リンパ球 + 肝脾腫 + 咽頭炎の3徴','EBV VCA-IgM / 異好抗体検査','AMPC/ABPC投与で高率に皮疹（EBVに特異的）→ 処方しないのが無難','脾腫がある間（通常4-6週）は接触スポーツ禁止（脾破裂リスク）','重症例（気道閉塞リスク）→ ステロイド短期投与検討','肝機能のフォロー'],
      workup:['CBC（異型リンパ球）','肝機能','EBV VCA-IgM/IgG, EBNA','異好抗体（Paul-Bunnell）','腹部エコー（脾腫の程度）'],
      disposition:'帰宅（安静指導）。気道狭窄リスク→入院',
      pitfall:'EBV感染にAMPCを投与すると90%以上に皮疹が出る。咽頭炎にルーチンでAMPCを出す前にEBVの可能性を考慮',
    },
  },
  trauma:{id:'trauma',title:'外傷/異物',
    result:{severity:'moderate',title:'咽頭外傷 / 異物',
      actions:['魚骨: 口蓋扁桃・舌根に刺さっていることが多い→直視 or 喉頭鏡で確認','X線/CT（魚骨はX線で見えないことが多い→CTが有用）','異物除去は耳鼻科','頚部外傷 + 咽頭痛 → 頚椎損傷・喉頭骨折の除外（CT）'],
      workup:['口腔内診察','頚部CT（異物が見つからない場合/外傷時）','頚部側面X線'],
      disposition:'異物除去後→帰宅。喉頭損傷→入院',
      pitfall:'「魚骨が刺さった」→自然脱落して痛みだけ残っていることも多いが、遺残異物による深頚部膿瘍の報告もあり、持続痛→CT',
    },
  },
}
const sevColor={critical:{bg:'bg-[#FDECEA]',border:'border-[#D93025]',text:'text-[#B71C1C]',badge:'🚨 緊急'},urgent:{bg:'bg-[#FFF8E1]',border:'border-[#F9A825]',text:'text-[#E65100]',badge:'⚠️ 準緊急'},moderate:{bg:'bg-[#E8F0FE]',border:'border-[#4285F4]',text:'text-[#1565C0]',badge:'ℹ️ 中等度'},low:{bg:'bg-[#E6F4EA]',border:'border-[#34A853]',text:'text-[#1B5E20]',badge:'✅ 低リスク'}}
export default function SoreThroatPage(){
  const[path,setPath]=useState<string[]>(['start']);const current=tree[path[path.length-1]];const hc=(v:string)=>{if(current?.next){const n=current.next(v);if(tree[n])setPath(p=>[...p,n])}};const gb=()=>{if(path.length>1)setPath(p=>p.slice(0,-1))};const rs=()=>setPath(['start']);if(!current)return null;const sc=current.result?sevColor[current.result.severity]:null
  return(<div className="max-w-3xl mx-auto"><nav className="text-sm text-muted mb-6"><Link href="/" className="hover:text-ac">ホーム</Link><span className="mx-2">›</span><Link href="/tools" className="hover:text-ac">臨床ツール</Link><span className="mx-2">›</span><Link href="/tools/er" className="hover:text-ac">ER対応</Link><span className="mx-2">›</span><span>咽頭痛</span></nav>
  <header className="mb-6"><span className="inline-block text-sm bg-dnl text-dn px-2.5 py-0.5 rounded-full font-medium mb-2">🚨 ER対応</span><h1 className="text-2xl font-bold text-tx mb-1">咽頭痛</h1><p className="text-sm text-muted">気道緊急除外 → 扁桃周囲膿瘍 → Centor基準でGAS/ウイルス鑑別 → EBV考慮</p></header>
  <ERDisclaimerBanner /><div className="mb-4 flex items-center gap-2">{path.length>1&&<button onClick={gb} className="text-xs text-ac px-2 py-1 rounded border border-ac/20 hover:bg-acl transition-colors">← 戻る</button>}{path.length>1&&<button onClick={rs} className="text-xs text-muted px-2 py-1 rounded border border-br hover:bg-s1 transition-colors">最初から</button>}</div>
  {current.choices&&!current.result&&(<div className="bg-s0 border border-br rounded-xl p-5 mb-6"><h2 className="text-base font-bold text-tx mb-2">{current.title}</h2>{current.desc&&<p className="text-sm text-muted mb-4">{current.desc}</p>}<div className="space-y-2">{current.choices.map(c=>(<button key={c.value} onClick={()=>hc(c.value)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${c.danger?'border-[#D93025]/30 hover:border-[#D93025] hover:bg-[#FDECEA]':'border-br hover:border-ac/40 hover:bg-acl'}`}><span className="text-sm font-medium text-tx">{c.icon&&<span className="mr-2">{c.icon}</span>}{c.label}</span></button>))}</div></div>)}
  {current.result&&sc&&(<div className={`${sc.bg} border-2 ${sc.border} rounded-xl p-5 mb-6`}><div className="flex items-center gap-2 mb-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sc.text} bg-white/70`}>{sc.badge}</span></div><h2 className={`text-lg font-bold mb-3 ${sc.text}`}>{current.result.title}</h2><div className="space-y-4"><div><p className="text-xs font-bold text-tx mb-2">アクション</p><div className="space-y-1.5">{current.result.actions.map((a,i)=><p key={i} className="text-sm text-tx leading-relaxed">{a}</p>)}</div></div><div><p className="text-xs font-bold text-tx mb-2">検査オーダー</p><div className="flex flex-wrap gap-1.5">{current.result.workup.map((w,i)=><span key={i} className="text-xs px-2 py-0.5 rounded bg-white/60 text-tx">{w}</span>)}</div></div><div className="flex items-center gap-2"><p className="text-xs font-bold text-tx">Disposition:</p><p className="text-sm text-tx">{current.result.disposition}</p></div>{current.result.pitfall&&(<div className="bg-white/60 rounded-lg p-3"><p className="text-xs font-bold text-[#E65100] mb-1">⚠️ ピットフォール</p><p className="text-xs text-tx leading-relaxed">{current.result.pitfall}</p></div>)}</div><ERResultCaution />{current.choices&&(<div className="mt-4 pt-4 border-t border-black/10"><div className="space-y-2">{current.choices.map(c=>(<button key={c.value} onClick={()=>hc(c.value)} className="w-full text-left p-3 rounded-xl border-2 border-white/40 hover:border-white/80 hover:bg-white/30 transition-all"><span className="text-sm font-medium text-tx">{c.icon&&<span className="mr-2">{c.icon}</span>}{c.label}</span></button>))}</div></div>)}<button onClick={rs} className="mt-4 w-full py-2.5 bg-white/60 rounded-xl text-sm font-medium text-tx hover:bg-white/80 transition-colors">最初からやり直す</button></div>)}
  <ERDisclaimerFooter /><section className="mb-8"><h2 className="text-lg font-bold mb-3">参考文献</h2><ol className="list-decimal list-inside text-sm text-muted space-y-2"><li>Shulman ST et al. IDSA Clinical Practice Guideline for GAS Pharyngitis. Clin Infect Dis 2012</li><li>日本耳鼻咽喉科学会. 急性咽頭・扁桃炎診療ガイドライン 2019</li></ol></section></div>)
}
