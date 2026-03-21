// ═══════════════════════════════════════════════════════════════
//  マッチング自己分析 — コア質問データ
//  面接頻出15問を厳選。マルチチョイス+一言補足の没入型体験
//  出典: 医師臨床研修マッチング面接質問集(300+質問から厳選)
// ═══════════════════════════════════════════════════════════════

export interface WizardQuestion {
  id: string
  /** 質問テキスト */
  question: string
  /** 面接での聞かれ方バリエーション */
  variants?: string[]
  /** マルチチョイス選択肢（複数選択可） */
  choices: string[]
  /** 選択肢の最大選択数（0=無制限） */
  maxChoices: number
  /** 自由記述のプレースホルダー */
  freeTextPlaceholder: string
  /** 自由記述の入力を促すラベル */
  freeTextLabel: string
  /** カテゴリ */
  category: 'origin' | 'self' | 'career' | 'training' | 'values'
  /** 面接での重要度（1-5） */
  importance: number
  /** アイコン */
  icon: string
  /** AIフォローアップのヒント */
  aiHint: string
}

export const CORE_QUESTIONS: WizardQuestion[] = [
  // ═══ 原点・動機 ═══
  {
    id: 'doctor-reason',
    question: '医師を目指したきっかけは？',
    variants: ['何故医師になろうと思った？', '医師を目指した理由'],
    choices: ['家族や身近な人の病気', '医師の姿に憧れた', '人の役に立ちたい', '科学・生物学への興味', '安定した職業', 'ドラマ・メディアの影響', '家族が医療従事者', 'ボランティア体験', 'その他'],
    maxChoices: 3,
    freeTextPlaceholder: '具体的なエピソードがあれば一言で',
    freeTextLabel: 'もう少し詳しく',
    category: 'origin',
    importance: 5,
    icon: '💡',
    aiHint: '動機の深層にある価値観を掘り下げる',
  },
  {
    id: 'specialty',
    question: '興味のある診療科は？',
    variants: ['将来志望する診療科は？', '志望科とその理由'],
    choices: ['内科系', '外科系', '小児科', '産婦人科', '精神科', '皮膚科', '眼科', '耳鼻咽喉科', '整形外科', '脳神経外科', '泌尿器科', '放射線科', '麻酔科', '救急科', '総合診療', 'まだ決めていない'],
    maxChoices: 3,
    freeTextPlaceholder: 'その診療科に惹かれた理由',
    freeTextLabel: '惹かれた理由',
    category: 'career',
    importance: 5,
    icon: '🩺',
    aiHint: '志望科と自分の性格・価値観の一致を探る',
  },

  // ═══ 自己分析 ═══
  {
    id: 'strengths',
    question: 'あなたの一番の強みは？',
    variants: ['自己PR', '長所は？', '他の受験者に負けないこと'],
    choices: ['チームワーク', 'リーダーシップ', '粘り強さ', '共感力', 'コミュニケーション力', '行動力', '分析力', '柔軟性', '責任感', '好奇心', '計画性', '冷静さ'],
    maxChoices: 3,
    freeTextPlaceholder: 'その強みを発揮した具体的な場面',
    freeTextLabel: 'エピソード',
    category: 'self',
    importance: 5,
    icon: '💪',
    aiHint: '強みの根拠となるエピソードの具体性を高める',
  },
  {
    id: 'weakness',
    question: '自分の課題・弱みは？',
    variants: ['短所は？', '医師に向かないと思う点'],
    choices: ['完璧主義', '心配性', '断れない', '優柔不断', 'せっかち', '人前で緊張する', '細かいことが苦手', '一人で抱え込む', 'マルチタスクが苦手'],
    maxChoices: 2,
    freeTextPlaceholder: 'その弱みにどう向き合っている？',
    freeTextLabel: '克服への取り組み',
    category: 'self',
    importance: 4,
    icon: '🔧',
    aiHint: '弱みを認識し改善する姿勢を示せているか',
  },
  {
    id: 'personality',
    question: '周りからどんな人と言われる？',
    variants: ['他人からどう評価されている？', '友人は自分のことをどう思っている？'],
    choices: ['真面目', '面白い', '優しい', '頼りになる', 'しっかり者', 'ムードメーカー', '聞き上手', 'マイペース', '努力家', '天然'],
    maxChoices: 3,
    freeTextPlaceholder: '言われて嬉しかった一言',
    freeTextLabel: '具体的に言われたこと',
    category: 'self',
    importance: 3,
    icon: '🪞',
    aiHint: '他者評価と自己認識のギャップを探る',
  },

  // ═══ 大学生活 ═══
  {
    id: 'extracurricular',
    question: '大学で一番力を入れたことは？',
    variants: ['課外活動は？', '部活で学んだこと', '学生時代に頑張ったこと'],
    choices: ['部活動', '研究活動', 'アルバイト', 'ボランティア', '留学', '資格取得', '勉強', '友人関係', '趣味・特技', 'サークル'],
    maxChoices: 2,
    freeTextPlaceholder: 'そこから得た学びや成長',
    freeTextLabel: '得られたもの',
    category: 'self',
    importance: 4,
    icon: '🎓',
    aiHint: '経験から得た学びが医師としてどう活きるか',
  },
  {
    id: 'setback',
    question: '一番の挫折経験は？',
    variants: ['挫折した経験と乗り越え方', '今までで一番つらかった体験'],
    choices: ['試験の不合格', '人間関係の対立', '部活での挫折', '研究の失敗', '体調を崩した', '家庭の事情', '留年・休学', '目標を見失った', '大きな挫折はない'],
    maxChoices: 1,
    freeTextPlaceholder: 'どう乗り越えた？何を学んだ？',
    freeTextLabel: '乗り越え方と学び',
    category: 'self',
    importance: 4,
    icon: '🏔️',
    aiHint: '逆境をどう成長に変えたかのストーリー',
  },

  // ═══ 研修・将来 ═══
  {
    id: 'training-goal',
    question: '初期研修で身につけたいことは？',
    variants: ['2年間の研修をどう過ごす？', '研修で大事だと思うこと'],
    choices: ['幅広い臨床能力', '救急対応力', 'コミュニケーション力', '手技の習得', 'チーム医療の実践', '医学的思考力', 'プレゼン力', '論文を読む力', '患者との信頼構築', '自己学習の習慣'],
    maxChoices: 3,
    freeTextPlaceholder: '特に重視する理由',
    freeTextLabel: '重視する理由',
    category: 'training',
    importance: 4,
    icon: '📋',
    aiHint: '研修への具体的なビジョンがあるか',
  },
  {
    id: 'future-5y',
    question: '5年後、どんな医師になっていたい？',
    variants: ['将来像', '10年後の目標', '理想の医師像'],
    choices: ['専門性を極めるスペシャリスト', '幅広く診るジェネラリスト', '研究と臨床の両立', '教育に力を入れる指導医', '地域医療に貢献', '国際的に活躍', '医療IT・イノベーション', '経営・マネジメント'],
    maxChoices: 2,
    freeTextPlaceholder: '具体的な目標やイメージ',
    freeTextLabel: '具体的なビジョン',
    category: 'career',
    importance: 5,
    icon: '🔮',
    aiHint: '将来像と志望科・研修先の一貫性',
  },

  // ═══ 価値観・医師像 ═══
  {
    id: 'doctor-values',
    question: '医師にとって最も大切なことは？',
    variants: ['医師として必要だと思うこと', '医師の素質'],
    choices: ['患者に寄り添う心', 'コミュニケーション能力', '医学知識の深さ', 'チームワーク', '責任感', '生涯学習の姿勢', '倫理観', '冷静な判断力', '体力・精神力', 'プロフェッショナリズム'],
    maxChoices: 3,
    freeTextPlaceholder: 'なぜそれが大切だと思う？',
    freeTextLabel: 'その理由',
    category: 'values',
    importance: 4,
    icon: '❤️',
    aiHint: '価値観と自身の行動の一貫性',
  },
  {
    id: 'team-medical',
    question: 'チーム医療で大切なことは？',
    variants: ['医師のチームでの役割', '多職種連携について'],
    choices: ['お互いを尊重する', '情報共有の徹底', 'リーダーシップ', 'フォロワーシップ', '患者中心の視点', '専門性の活用', 'コミュニケーション', '心理的安全性'],
    maxChoices: 3,
    freeTextPlaceholder: 'チームで大切にしたいこと',
    freeTextLabel: '自分がチームで心がけたいこと',
    category: 'values',
    importance: 4,
    icon: '🤝',
    aiHint: 'チーム医療への理解と自分の役割認識',
  },
  {
    id: 'stress',
    question: 'ストレスへの対処法は？',
    variants: ['リフレッシュ方法', 'メンタルに自信はあるか', '当直に耐えられるか'],
    choices: ['運動・スポーツ', '友人と話す', '趣味に没頭', '睡眠を確保', '一人の時間', '音楽を聴く', '旅行', '食事', '瞑想・マインドフルネス', '計画的に休む'],
    maxChoices: 3,
    freeTextPlaceholder: '実際にストレスを感じた時の体験',
    freeTextLabel: '具体的なエピソード',
    category: 'self',
    importance: 3,
    icon: '🧘',
    aiHint: 'ストレス耐性と自己管理能力',
  },

  // ═══ 時事・社会 ═══
  {
    id: 'medical-news',
    question: '最近気になった医療ニュースは？',
    variants: ['今関心のある社会問題', 'AIが医療をどう変えるか'],
    choices: ['医師の働き方改革', 'AI・デジタルヘルス', '地域医療の課題', '少子高齢化', '感染症対策', '医療費の問題', '再生医療', '遺伝子治療', 'オンライン診療', 'メンタルヘルス'],
    maxChoices: 2,
    freeTextPlaceholder: 'そのニュースについて思うこと',
    freeTextLabel: 'あなたの考え',
    category: 'values',
    importance: 3,
    icon: '📰',
    aiHint: '社会問題への関心と自分なりの見解',
  },

  // ═══ 病院選択（面接直前に記入） ═══
  {
    id: 'hospital-reason',
    question: 'この病院を志望した理由は？',
    variants: ['当院での研修を志望した理由', '病院選びの基準'],
    choices: ['教育体制が充実', '症例数が多い', '立地が良い', '救急が強い', '先輩の評判が良い', '見学で雰囲気が良かった', '専門科が強い', '研究もできる', 'ER型で手技が学べる', '大学との連携'],
    maxChoices: 3,
    freeTextPlaceholder: '見学時の印象など',
    freeTextLabel: '見学時の具体的な印象',
    category: 'training',
    importance: 5,
    icon: '🏥',
    aiHint: '病院の特徴と自分の志望動機の接続',
  },
  {
    id: 'reverse-question',
    question: '面接で聞きたい逆質問は？',
    variants: ['何か質問はありますか？'],
    choices: ['研修プログラムの詳細', '指導体制について', '当直の頻度', '先輩研修医の進路', '研修医の裁量権', '勉強会の頻度', '海外研修の機会', '研修後の進路支援'],
    maxChoices: 3,
    freeTextPlaceholder: 'オリジナルの質問があれば',
    freeTextLabel: 'オリジナル質問',
    category: 'training',
    importance: 3,
    icon: '❓',
    aiHint: '病院への関心度と研修への主体性',
  },
]

/** JIS規格履歴書の志望動機生成用プロンプト */
export function generateResumePrompt(answers: Record<string, { choices: string[]; freeText: string }>): string {
  const sections: string[] = []

  const get = (id: string) => {
    const a = answers[id]
    if (!a) return ''
    return `選択: ${a.choices.join(', ')}${a.freeText ? `\n補足: ${a.freeText}` : ''}`
  }

  sections.push(`【医師を目指した理由】\n${get('doctor-reason')}`)
  sections.push(`【志望診療科】\n${get('specialty')}`)
  sections.push(`【強み】\n${get('strengths')}`)
  sections.push(`【弱み】\n${get('weakness')}`)
  sections.push(`【大学で力を入れたこと】\n${get('extracurricular')}`)
  sections.push(`【挫折経験】\n${get('setback')}`)
  sections.push(`【研修の目標】\n${get('training-goal')}`)
  sections.push(`【将来像】\n${get('future-5y')}`)
  sections.push(`【医師として大切なこと】\n${get('doctor-values')}`)
  sections.push(`【病院志望理由】\n${get('hospital-reason')}`)

  return `以下の自己分析データから、JIS規格の履歴書に記載する「志望の動機、特技、自己PR、アピールポイントなど」欄の文章を生成してください。

## 要件
- 文字数: 200〜300文字（JIS規格A4履歴書の志望動機欄に収まるサイズ）
- トーン: 丁寧語で簡潔に。「です・ます」調
- 構成: ①医師を目指した理由 → ②強み・経験 → ③志望科・将来像 → ④この病院での研修への意欲
- 一貫性のあるストーリーにまとめること

## 自己分析データ
${sections.join('\n\n')}

## 出力
志望動機（200〜300文字）のみを出力してください。`
}
