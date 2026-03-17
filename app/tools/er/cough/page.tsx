'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ERDisclaimerBanner, ERDisclaimerFooter, ERResultCaution } from '@/components/tools/ERDisclaimer'
interface Choice{label:string;value:string;icon?:string;danger?:boolean}
interface TreeNode{id:string;title:string;desc?:string;choices?:Choice[];result?:{severity:'critical'|'urgent'|'moderate'|'low';title:string;actions:string[];workup:string[];disposition:string;pitfall?:string};next?:(s:string)=>string}
const tree:Record<string,TreeNode>={
  start:{id:'start',title:'Step 1: 緊急疾患の除外',desc:'咳嗽のER評価ではまず気道緊急・呼吸不全を除外。その後、急性(<3週)/亜急性(3-8週)/慢性(>8週)で鑑別を進める。',
    choices:[
      {label:'気道緊急（stridor/著明な呼吸困難/SpO2<90%）',value:'airway',icon:'🚨',danger:true},
      {label:'血痰・喀血を伴う',value:'hemoptysis_ref',icon:'🩸',danger:true},
      {label:'急性咳嗽（<3週）+ 発熱',value:'acute_fever',icon:'🌡️'},
      {label:'急性咳嗽（<3週）発熱なし',value:'acute_no_fever',icon:'🤧'},
      {label:'亜急性〜慢性咳嗽（3週以上）',value:'chronic',icon:'🔍'},
    ],next:v=>v,
  },
  airway:{id:'airway',title:'🚨 気道緊急',
    result:{severity:'critical',title:'気道緊急 — 呼吸困難フローへ',
      actions:['→ 呼吸困難フロー参照（/tools/er/dyspnea）','酸素投与・気管挿管準備','喘息重積: サルブタモール吸入連続 + イプラトロピウム + ステロイドiv + MgSO4','COPD増悪: NIV(BiPAP)考慮','異物誤嚥: 背部叩打/腹部突き上げ → 硬性気管支鏡','アナフィラキシー: アドレナリン筋注0.3-0.5mg'],
      workup:['SpO2・血液ガス','胸部X線','CBC・CRP','必要に応じてCT'],
      disposition:'重症度に応じてICU or 入院',
      pitfall:'高齢者のCOPD増悪は無動性の呼吸不全（CO2ナルコーシス）に注意。SpO2目標88-92%',
    },
  },
  hemoptysis_ref:{id:'hemoptysis_ref',title:'血痰・喀血 → 専用フローへ',
    result:{severity:'urgent',title:'血痰・喀血を伴う咳嗽',
      actions:['→ 血痰・喀血フロー参照（/tools/er/hemoptysis）','出血量の評価が最優先','大量喀血は窒息リスク → 気道確保','肺癌・PE・結核を鑑別'],
      workup:['胸部CT','CBC','凝固','喀痰培養・抗酸菌塗抹'],
      disposition:'出血量・原因に応じて判断',
      pitfall:'喫煙者の血痰は「気管支炎」で済ませず肺癌の精査を',
    },
  },
  acute_fever:{id:'acute_fever',title:'Step 2: 急性咳嗽 + 発熱',
    choices:[
      {label:'肺炎パターン（膿性痰・胸部異常音・全身状態不良）',value:'pneumonia',icon:'🫁'},
      {label:'上気道感染パターン（鼻汁・咽頭痛・軽症）',value:'uri',icon:'🤧'},
      {label:'COVID-19/インフルエンザ疑い',value:'viral_resp',icon:'🦠'},
    ],next:v=>v,
  },
  pneumonia:{id:'pneumonia',title:'市中肺炎',
    result:{severity:'urgent',title:'市中肺炎 — 重症度評価＋抗菌薬',
      actions:['CURB-65 or A-DROPで重症度評価','軽症（CURB-65 0-1）→ 外来治療: AMPC or AZM or LVFX','中等症（CURB-65 2）→ 入院: CTRX + AZM or LVFX単剤','重症（CURB-65 3-5）→ ICU: CTRX + AZM + レジオネラ尿中抗原','喀痰グラム染色・培養 → 起炎菌同定後にde-escalation','補液（脱水是正）+ 酸素投与（SpO2≧94%、COPD: 88-92%）'],
      workup:['胸部X線（浸潤影の確認）','CBC・CRP・PCT','喀痰グラム染色・培養','血液培養2セット（中等症以上）','尿中抗原（肺炎球菌・レジオネラ）','血液ガス（呼吸不全時）'],
      disposition:'CURB-65 0-1→外来。2→入院。3-5→ICU',
      pitfall:'高齢者の肺炎は発熱・咳嗽がなく食欲低下・意識変容のみのことがある（非定型的プレゼンテーション）。CRPが低くても画像で肺炎パターンなら治療開始',
    },
  },
  uri:{id:'uri',title:'上気道感染（感冒）',
    result:{severity:'low',title:'急性上気道感染 — 対症療法',
      actions:['抗菌薬不要（ウイルス性が大半）','対症療法: アセトアミノフェン + 含嗽 + 水分摂取','鎮咳薬: デキストロメトルファン or コデイン（夜間の咳で睡眠障害時）','急性副鼻腔炎の合併: 10日以上の鼻汁持続 or 二峰性の経過 → AMPC検討','急性気管支炎: 通常3週以内に改善。抗菌薬は原則不要'],
      workup:['通常不要（典型パターン）','肺炎除外が必要な場合: 胸部X線'],
      disposition:'帰宅',
      pitfall:'「風邪」は除外診断。肺炎・百日咳・結核を見落とさないよう、遷延する場合は再評価',
    },
  },
  viral_resp:{id:'viral_resp',title:'COVID-19 / インフルエンザ',
    result:{severity:'moderate',title:'ウイルス性呼吸器感染の評価',
      actions:['迅速検査: インフルエンザ抗原 + COVID-19抗原/PCR','インフルエンザ: 発症48h以内→オセルタミビル（タミフル）75mg×2/日×5日','COVID-19: 重症化リスク因子あり→抗ウイルス薬（ニルマトレルビル/リトナビル等）検討','重症度評価: SpO2、呼吸数、胸部画像','酸素需要あり→入院。SpO2<93%→酸素投与開始','隔離・感染対策の指導'],
      workup:['迅速抗原検査（インフルエンザ・COVID-19）','胸部X線（肺炎合併評価）','SpO2','重症リスク者: CBC・CRP・LDH・D-dimer'],
      disposition:'軽症→帰宅（自宅療養指導）。酸素需要→入院',
      pitfall:'COVID-19は発症7-10日目に急速に悪化することがある（cytokine storm）。軽症でも高リスク者には抗ウイルス薬の早期投与を検討',
    },
  },
  acute_no_fever:{id:'acute_no_fever',title:'急性咳嗽 + 発熱なし',
    result:{severity:'low',title:'急性咳嗽（非感染性）の評価',
      actions:['喘息増悪: 喘鳴 + 呼気延長 → サルブタモール吸入','GERD: 食後・臥位で悪化 → PPI試験投与','後鼻漏: 鼻汁の後鼻漏 → 抗ヒスタミン薬','ACE阻害薬: 服用中なら薬剤性を疑い中止（ARBへ変更）','心不全: 労作時呼吸困難 + 浮腫 → BNP + 胸部X線 + 心エコー','PE: 突然の咳嗽 + 呼吸困難 + 胸痛 → D-dimer + CTPA'],
      workup:['胸部X線（心不全・肺炎除外）','SpO2','心不全疑い: BNP','PE疑い: D-dimer → CTPA'],
      disposition:'帰宅（原因に応じた外来フォロー）',
      pitfall:'「咳だけ」でもPEや心不全が隠れていることがある。呼吸困難を伴う咳は精査を',
    },
  },
  chronic:{id:'chronic',title:'Step 2: 慢性咳嗽（>8週）の3大原因',
    result:{severity:'low',title:'慢性咳嗽 — 3大原因の評価',
      actions:['慢性咳嗽の3大原因: ①後鼻漏 ②喘息/咳喘息 ③GERD','後鼻漏（上気道咳症候群）: 第一世代抗ヒスタミン薬 + 鼻腔ステロイド噴霧','咳喘息: 気管支拡張薬吸入試験 + 呼気NO測定。ICS/LABA開始','GERD: PPI 8週間試験投与','ACE阻害薬: 服用中なら中止（効果判定に4週間必要）','上記3つの治療で改善しない → 胸部CT（肺癌・間質性肺疾患除外）','百日咳: 成人でも。2週間以上の咳嗽 + staccato/whoop → PCR/血清抗体'],
      workup:['胸部X線（まだ撮っていなければ）','呼吸機能検査 + 気道可逆性試験','呼気NO（FeNO: 好酸球性気道炎症の指標）','喀痰好酸球','副鼻腔CT（後鼻漏疑い時）','胸部CT（上記治療で改善しない場合）'],
      disposition:'帰宅（呼吸器内科/耳鼻科外来紹介）',
      pitfall:'慢性咳嗽の30-40%は複数原因の合併。1つの治療で改善しない場合は他の原因も並行して治療。喫煙者の慢性咳嗽の変化は肺癌を疑う',
    },
  },
}
const sevColor={critical:{bg:'bg-[#FDECEA]',border:'border-[#D93025]',text:'text-[#B71C1C]',badge:'🚨 緊急'},urgent:{bg:'bg-[#FFF8E1]',border:'border-[#F9A825]',text:'text-[#E65100]',badge:'⚠️ 準緊急'},moderate:{bg:'bg-[#E8F0FE]',border:'border-[#4285F4]',text:'text-[#1565C0]',badge:'ℹ️ 中等度'},low:{bg:'bg-[#E6F4EA]',border:'border-[#34A853]',text:'text-[#1B5E20]',badge:'✅ 低リスク'}}
export default function CoughPage(){
  const[path,setPath]=useState<string[]>(['start']);const current=tree[path[path.length-1]];const hc=(v:string)=>{if(current?.next){const n=current.next(v);if(tree[n])setPath(p=>[...p,n])}};const gb=()=>{if(path.length>1)setPath(p=>p.slice(0,-1))};const rs=()=>setPath(['start']);if(!current)return null;const sc=current.result?sevColor[current.result.severity]:null
  return(<div className="max-w-3xl mx-auto"><nav className="text-sm text-muted mb-6"><Link href="/" className="hover:text-ac">ホーム</Link><span className="mx-2">›</span><Link href="/tools" className="hover:text-ac">臨床ツール</Link><span className="mx-2">›</span><Link href="/tools/er" className="hover:text-ac">ER対応</Link><span className="mx-2">›</span><span>咳・喀痰</span></nav>
  <header className="mb-6"><span className="inline-block text-sm bg-dnl text-dn px-2.5 py-0.5 rounded-full font-medium mb-2">🚨 ER対応</span><h1 className="text-2xl font-bold text-tx mb-1">咳・喀痰</h1><p className="text-sm text-muted">急性/亜急性/慢性の分類 → 気道緊急・肺炎・PE除外 → 3大慢性咳嗽原因の評価</p></header>
  <ERDisclaimerBanner /><div className="mb-4 flex items-center gap-2">{path.length>1&&<button onClick={gb} className="text-xs text-ac px-2 py-1 rounded border border-ac/20 hover:bg-acl transition-colors">← 戻る</button>}{path.length>1&&<button onClick={rs} className="text-xs text-muted px-2 py-1 rounded border border-br hover:bg-s1 transition-colors">最初から</button>}</div>
  {current.choices&&!current.result&&(<div className="bg-s0 border border-br rounded-xl p-5 mb-6"><h2 className="text-base font-bold text-tx mb-2">{current.title}</h2>{current.desc&&<p className="text-sm text-muted mb-4">{current.desc}</p>}<div className="space-y-2">{current.choices.map(c=>(<button key={c.value} onClick={()=>hc(c.value)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${c.danger?'border-[#D93025]/30 hover:border-[#D93025] hover:bg-[#FDECEA]':'border-br hover:border-ac/40 hover:bg-acl'}`}><span className="text-sm font-medium text-tx">{c.icon&&<span className="mr-2">{c.icon}</span>}{c.label}</span></button>))}</div></div>)}
  {current.result&&sc&&(<div className={`${sc.bg} border-2 ${sc.border} rounded-xl p-5 mb-6`}><div className="flex items-center gap-2 mb-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sc.text} bg-white/70`}>{sc.badge}</span></div><h2 className={`text-lg font-bold mb-3 ${sc.text}`}>{current.result.title}</h2><div className="space-y-4"><div><p className="text-xs font-bold text-tx mb-2">アクション</p><div className="space-y-1.5">{current.result.actions.map((a,i)=><p key={i} className="text-sm text-tx leading-relaxed">{a}</p>)}</div></div><div><p className="text-xs font-bold text-tx mb-2">検査オーダー</p><div className="flex flex-wrap gap-1.5">{current.result.workup.map((w,i)=><span key={i} className="text-xs px-2 py-0.5 rounded bg-white/60 text-tx">{w}</span>)}</div></div><div className="flex items-center gap-2"><p className="text-xs font-bold text-tx">Disposition:</p><p className="text-sm text-tx">{current.result.disposition}</p></div>{current.result.pitfall&&(<div className="bg-white/60 rounded-lg p-3"><p className="text-xs font-bold text-[#E65100] mb-1">⚠️ ピットフォール</p><p className="text-xs text-tx leading-relaxed">{current.result.pitfall}</p></div>)}</div><ERResultCaution /><button onClick={rs} className="mt-4 w-full py-2.5 bg-white/60 rounded-xl text-sm font-medium text-tx hover:bg-white/80 transition-colors">最初からやり直す</button></div>)}
  <section className="mb-8"><h2 className="text-lg font-bold mb-3">関連ツール</h2><div className="flex flex-wrap gap-2">{[{href:'/tools/er/dyspnea',name:'呼吸困難'},{href:'/tools/er/hemoptysis',name:'血痰・喀血'},{href:'/tools/er/fever',name:'発熱'},{href:'/tools/calc/curb-65',name:'CURB-65'}].map(t=>(<Link key={t.href} href={t.href} className="text-sm bg-s1 text-tx px-3 py-1.5 rounded-lg hover:bg-acl hover:text-ac transition-colors">{t.name}</Link>))}</div></section>
  <ERDisclaimerFooter /><section className="mb-8"><h2 className="text-lg font-bold mb-3">参考文献</h2><ol className="list-decimal list-inside text-sm text-muted space-y-2"><li>Irwin RS et al. CHEST Expert Cough Panel: Classification of Cough. Chest 2018</li><li>Metlay JP et al. ATS/IDSA CAP Guideline. Am J Respir Crit Care Med 2019</li><li>日本呼吸器学会. 咳嗽・喀痰の診療ガイドライン 2019</li></ol></section></div>)
}
