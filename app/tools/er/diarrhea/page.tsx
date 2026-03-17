'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ERDisclaimerBanner, ERDisclaimerFooter, ERResultCaution } from '@/components/tools/ERDisclaimer'
interface Choice{label:string;value:string;icon?:string;danger?:boolean}
interface TreeNode{id:string;title:string;desc?:string;choices?:Choice[];result?:{severity:'critical'|'urgent'|'moderate'|'low';title:string;actions:string[];workup:string[];disposition:string;pitfall?:string};next?:(s:string)=>string}
const tree:Record<string,TreeNode>={
  start:{id:'start',title:'Step 1: 脱水・重症度評価',desc:'下痢のER評価ではまず脱水と全身状態を評価。血便・高熱・高齢者・免疫不全はRed Flag。',
    choices:[
      {label:'重度脱水/ショック（低血圧・頻脈・意識障害・無尿）',value:'shock',icon:'🚨',danger:true},
      {label:'血便を伴う',value:'bloody',icon:'🩸',danger:true},
      {label:'高熱（≧38.5℃）+ 水様性下痢',value:'fever_diarrhea',icon:'🌡️'},
      {label:'軽度〜中等度脱水（口渇・尿量減少・バイタル安定）',value:'moderate_dehydration',icon:'💧'},
      {label:'軽症（バイタル安定・脱水なし・少量の水様便）',value:'mild',icon:'✅'},
    ],next:v=>v,
  },
  shock:{id:'shock',title:'🚨 脱水性ショック',
    result:{severity:'critical',title:'重度脱水 — 急速輸液',
      actions:['大口径ルート2本確保','生食 or リンゲル液 1-2L急速投与 → バイタル再評価','電解質補正（特にK: 下痢で大量喪失）','代謝性アシドーシスの評価（血液ガス）','原因検索: コレラ様大量水様便（Vibrio/ETEC）、C. difficile（抗菌薬使用歴）','尿道カテーテル留置（尿量モニタリング）'],
      workup:['CBC','電解質（K, Na, Cl, HCO3）','BUN/Cr','血液ガス','乳酸','便培養・CD toxin','血液培養（菌血症疑い時）'],
      disposition:'入院（ICU: ショックが遷延する場合）',
      pitfall:'下痢による代謝性アシドーシス（HCO3喪失）+ 低K血症は不整脈リスク。K補正は輸液に混注して行う',
    },
  },
  bloody:{id:'bloody',title:'Step 2: 血便を伴う下痢',
    choices:[
      {label:'感染性腸炎パターン（発熱+粘血便+腹痛）',value:'infectious_bloody',icon:'🦠'},
      {label:'炎症性腸疾患（IBD）疑い（若年・反復・体重減少）',value:'ibd',icon:'🔥'},
      {label:'虚血性腸炎疑い（高齢・突然の左下腹部痛→血便）',value:'ischemic',icon:'⚠️',danger:true},
      {label:'高齢者の大量血便（憩室出血 → 下血フロー参照）',value:'diverticular_ref',icon:'🩸'},
    ],next:v=>v,
  },
  infectious_bloody:{id:'infectious_bloody',title:'感染性血便',
    result:{severity:'urgent',title:'侵襲性細菌性腸炎',
      actions:['便培養（Salmonella, Shigella, Campylobacter, EHEC O157）','EHEC疑い（集団発生・ハンバーガー/生肉摂取歴）→ 抗菌薬は禁忌（HUSリスク↑）','Shigella/Campylobacter → 重症なら抗菌薬（AZM or CPFX）','補液 + 電解質補正','HUS徴候のモニタリング（血小板↓・溶血性貧血・腎障害）→ EHEC後5-10日','整腸剤: 止痢薬（ロペラミド）は侵襲性感染では原則禁忌'],
      workup:['便培養','便中EHEC毒素/PCR','CBC・血小板（HUS監視）','電解質・腎機能','CRP'],
      disposition:'軽症→帰宅（便培養結果フォロー）。重症/EHEC疑い/HUS徴候→入院',
      pitfall:'EHEC O157には抗菌薬を使わない（毒素放出↑でHUSリスク↑）。「血便=抗菌薬」ではない。便培養結果を待って判断',
    },
  },
  ibd:{id:'ibd',title:'炎症性腸疾患（IBD）疑い',
    result:{severity:'moderate',title:'IBD（UC/CD）疑い — 消化器科紹介',
      actions:['UC: 血性粘液便 + 直腸からの連続性炎症','CD: 回盲部・肛門周囲病変 + 非連続性炎症','重症UC: 血便≧6回/日 + 発熱 + 頻脈 + CRP↑ → 入院＋ステロイドiv','大腸内視鏡＋生検が確定診断に必要','消化器内科コンサルト','IBD急性増悪: CMV腸炎・C. difficileの合併を除外'],
      workup:['CBC・CRP・ESR','アルブミン','便培養・CD toxin','大腸内視鏡（入院 or 外来で）','便中カルプロテクチン'],
      disposition:'軽症→外来（消化器科紹介）。重症UC→入院',
      pitfall:'IBD初発を「感染性腸炎」と誤診して帰宅→悪化のパターンに注意。4週以上続く血性下痢は大腸内視鏡の適応',
    },
  },
  ischemic:{id:'ischemic',title:'⚠️ 虚血性腸炎',
    result:{severity:'urgent',title:'虚血性腸炎 — CT＋経過観察',
      actions:['典型: 高齢者 + 突然の左下腹部痛 → 数時間後に血便','腹部CT造影: 腸管壁肥厚 + 周囲脂肪織濃度上昇','大部分は一過性（保存的治療で改善）','絶食 + 輸液 + 抗菌薬（腸管細菌移行予防）','壊疽型（腹膜刺激徴候・乳酸↑・ショック）→ 緊急手術','SMA塞栓/血栓（上腸間膜動脈）との鑑別: 小腸虚血は致死的'],
      workup:['腹部CT造影','CBC・CRP','乳酸（腸管壊死の指標）','凝固','大腸内視鏡（急性期を過ぎてから確定診断目的）'],
      disposition:'入院（壊疽型リスクの監視）。軽症で改善傾向→短期入院',
      pitfall:'SMA塞栓は「pain out of proportion」（身体所見に比べて疼痛が強い）が特徴。乳酸高値は腸管壊死を示唆し緊急手術の適応',
    },
  },
  diverticular_ref:{id:'diverticular_ref',title:'憩室出血 → 吐血・下血フロー参照',
    result:{severity:'moderate',title:'憩室出血疑い',
      actions:['→ 吐血・下血フロー参照（/tools/er/gi-bleeding）','無痛性の大量鮮血便が典型','80%は自然止血するが再出血率高い','大腸内視鏡で出血源同定 + 止血','大量出血時はCT血管造影 → IVR'],
      workup:['CBC','凝固','腹部CT造影'],
      disposition:'入院（出血量・バイタルに応じて）',
      pitfall:'「無痛性の大量血便」は憩室出血の典型だが、大腸癌や血管異形成も同様のプレゼンテーション。大腸内視鏡で確認が必要',
    },
  },
  fever_diarrhea:{id:'fever_diarrhea',title:'発熱 + 水様性下痢',
    result:{severity:'moderate',title:'感染性胃腸炎 — 評価と対症療法',
      actions:['大部分はウイルス性（ノロ・ロタ）→ 対症療法のみ','細菌性疑い（高熱≧38.5℃・血便・渡航歴・生もの摂取）→ 便培養提出','旅行者下痢: 重症ならAZM or CPFX（3日間）','C. difficile（抗菌薬使用歴2-3ヶ月以内）→ CD toxin検査 → VCM内服 or FDX','脱水補正: 経口補水（ORS）優先。経口不能→輸液','制吐薬: オンダンセトロン4mg（経口摂取促進）','止痢薬: ロペラミドは非侵襲性のみ（血便・高熱には禁忌）'],
      workup:['便培養','CD toxin（抗菌薬使用歴あり）','CBC・CRP','電解質・腎機能','寄生虫検査（渡航歴あり）'],
      disposition:'経口摂取可能→帰宅。経口不能/高齢/免疫不全→入院',
      pitfall:'C. difficile感染は抗菌薬使用後2-3ヶ月でも発症する。入院歴＋抗菌薬歴＋下痢→必ずCD toxin提出。メトロニダゾールは軽症CDIのみ（重症はVCM内服）',
    },
  },
  moderate_dehydration:{id:'moderate_dehydration',title:'中等度脱水',
    result:{severity:'moderate',title:'中等度脱水 — 補液＋経過観察',
      actions:['輸液: 生食 or リンゲル液 500-1000mL → バイタル再評価','電解質補正（K: 下痢で大量喪失）','経口補水が可能になればORSへ切り替え','原因に応じた治療（上記参照）'],
      workup:['CBC','電解質','BUN/Cr（BUN/Cr比上昇→脱水）','尿検査（比重）'],
      disposition:'補液で改善・経口摂取可→帰宅。改善しない→入院',
      pitfall:'高齢者の脱水は腎前性AKIに直結。Cr上昇があれば積極的に補液',
    },
  },
  mild:{id:'mild',title:'軽症下痢',
    result:{severity:'low',title:'軽症下痢 — 対症療法＋自然軽快',
      actions:['経口補水（ORS or スポーツドリンク）','食事: BRAT食（バナナ・米・りんごソース・トースト）は推奨されなくなったが、消化の良い食事を少量から','整腸剤（プロバイオティクス）','ロペラミド（症状が辛い場合、非血性のみ）','通常2-5日で改善。1週間以上続く場合は再受診'],
      workup:['通常不要'],
      disposition:'帰宅（再受診指導: 血便・高熱・1週間以上持続・脱水悪化）',
      pitfall:'「軽症の下痢」でも食品取り扱い業者は就業制限が必要な場合がある（感染症法：ノロウイルス等）',
    },
  },
}
const sevColor={critical:{bg:'bg-[#FDECEA]',border:'border-[#D93025]',text:'text-[#B71C1C]',badge:'🚨 緊急'},urgent:{bg:'bg-[#FFF8E1]',border:'border-[#F9A825]',text:'text-[#E65100]',badge:'⚠️ 準緊急'},moderate:{bg:'bg-[#E8F0FE]',border:'border-[#4285F4]',text:'text-[#1565C0]',badge:'ℹ️ 中等度'},low:{bg:'bg-[#E6F4EA]',border:'border-[#34A853]',text:'text-[#1B5E20]',badge:'✅ 低リスク'}}
export default function DiarrheaPage(){
  const[path,setPath]=useState<string[]>(['start']);const current=tree[path[path.length-1]];const hc=(v:string)=>{if(current?.next){const n=current.next(v);if(tree[n])setPath(p=>[...p,n])}};const gb=()=>{if(path.length>1)setPath(p=>p.slice(0,-1))};const rs=()=>setPath(['start']);if(!current)return null;const sc=current.result?sevColor[current.result.severity]:null
  return(<div className="max-w-3xl mx-auto"><nav className="text-sm text-muted mb-6"><Link href="/" className="hover:text-ac">ホーム</Link><span className="mx-2">›</span><Link href="/tools" className="hover:text-ac">臨床ツール</Link><span className="mx-2">›</span><Link href="/tools/er" className="hover:text-ac">ER対応</Link><span className="mx-2">›</span><span>下痢</span></nav>
  <header className="mb-6"><span className="inline-block text-sm bg-dnl text-dn px-2.5 py-0.5 rounded-full font-medium mb-2">🚨 ER対応</span><h1 className="text-2xl font-bold text-tx mb-1">下痢</h1><p className="text-sm text-muted">脱水評価 → 血便/感染性/虚血性の鑑別 → EHEC・CDI・IBDの除外 → 対症療法</p></header>
  <ERDisclaimerBanner /><div className="mb-4 flex items-center gap-2">{path.length>1&&<button onClick={gb} className="text-xs text-ac px-2 py-1 rounded border border-ac/20 hover:bg-acl transition-colors">← 戻る</button>}{path.length>1&&<button onClick={rs} className="text-xs text-muted px-2 py-1 rounded border border-br hover:bg-s1 transition-colors">最初から</button>}</div>
  {current.choices&&!current.result&&(<div className="bg-s0 border border-br rounded-xl p-5 mb-6"><h2 className="text-base font-bold text-tx mb-2">{current.title}</h2>{current.desc&&<p className="text-sm text-muted mb-4">{current.desc}</p>}<div className="space-y-2">{current.choices.map(c=>(<button key={c.value} onClick={()=>hc(c.value)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${c.danger?'border-[#D93025]/30 hover:border-[#D93025] hover:bg-[#FDECEA]':'border-br hover:border-ac/40 hover:bg-acl'}`}><span className="text-sm font-medium text-tx">{c.icon&&<span className="mr-2">{c.icon}</span>}{c.label}</span></button>))}</div></div>)}
  {current.result&&sc&&(<div className={`${sc.bg} border-2 ${sc.border} rounded-xl p-5 mb-6`}><div className="flex items-center gap-2 mb-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sc.text} bg-white/70`}>{sc.badge}</span></div><h2 className={`text-lg font-bold mb-3 ${sc.text}`}>{current.result.title}</h2><div className="space-y-4"><div><p className="text-xs font-bold text-tx mb-2">アクション</p><div className="space-y-1.5">{current.result.actions.map((a,i)=><p key={i} className="text-sm text-tx leading-relaxed">{a}</p>)}</div></div><div><p className="text-xs font-bold text-tx mb-2">検査オーダー</p><div className="flex flex-wrap gap-1.5">{current.result.workup.map((w,i)=><span key={i} className="text-xs px-2 py-0.5 rounded bg-white/60 text-tx">{w}</span>)}</div></div><div className="flex items-center gap-2"><p className="text-xs font-bold text-tx">Disposition:</p><p className="text-sm text-tx">{current.result.disposition}</p></div>{current.result.pitfall&&(<div className="bg-white/60 rounded-lg p-3"><p className="text-xs font-bold text-[#E65100] mb-1">⚠️ ピットフォール</p><p className="text-xs text-tx leading-relaxed">{current.result.pitfall}</p></div>)}</div><ERResultCaution /><button onClick={rs} className="mt-4 w-full py-2.5 bg-white/60 rounded-xl text-sm font-medium text-tx hover:bg-white/80 transition-colors">最初からやり直す</button></div>)}
  <ERDisclaimerFooter /></div>)
}
