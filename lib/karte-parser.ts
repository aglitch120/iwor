// ═══════════════════════════════════════════════════════════════
//  カルテテキスト → J-OSLER病歴要約セクション 自動振り分けエンジン
//  AI不使用・正規表現ベース・ブラウザ完結
// ═══════════════════════════════════════════════════════════════

import { convertPrescriptionToGeneric } from './drug-name-converter'
import type { DiseaseTemplate } from './josler-templates'

export interface ParsedKarte {
  chiefComplaint: string
  history: string        // 既往歴+生活歴+家族歴
  presentIllness: string // 現病歴
  physicalExam: string   // 入院時現症
  labFindings: string    // 検査所見
  problemList: string    // プロブレムリスト
  course: string         // 入院後経過
  dischargeMeds: string  // 退院時処方
  diagnosis: string      // 確定診断名
  unparsed: string       // パースできなかった部分
}

// ── セクションヘッダーパターン（日本のカルテで使われる表現） ──
const SECTION_PATTERNS: { key: keyof ParsedKarte; patterns: RegExp[] }[] = [
  { key: 'chiefComplaint', patterns: [
    /^(?:【)?主\s*訴(?:】)?[：:\s]/m,
    /^(?:CC|Chief Complaint)[：:\s]/im,
  ]},
  { key: 'presentIllness', patterns: [
    /^(?:【)?現\s*病\s*歴(?:】)?[：:\s]/m,
    /^(?:【)?病\s*歴(?:】)?[：:\s]/m,
    /^(?:HPI|History of Present Illness|Present Illness)[：:\s]/im,
    /^(?:【)?経\s*過(?:】)?[：:\s]/m,
  ]},
  { key: 'history', patterns: [
    /^(?:【)?既\s*往\s*歴(?:】)?[：:\s]/m,
    /^(?:PMH|Past Medical History)[：:\s]/im,
    /^(?:【)?生\s*活\s*歴(?:】)?[：:\s]/m,
    /^(?:SH|Social History)[：:\s]/im,
    /^(?:【)?家\s*族\s*歴(?:】)?[：:\s]/m,
    /^(?:FH|Family History)[：:\s]/im,
    /^(?:【)?アレルギー(?:歴)?(?:】)?[：:\s]/m,
    /^(?:【)?内\s*服\s*薬(?:】)?[：:\s]/m,
  ]},
  { key: 'physicalExam', patterns: [
    /^(?:【)?(?:入院時)?身\s*体\s*所\s*見(?:】)?[：:\s]/m,
    /^(?:【)?(?:入院時)?現\s*症(?:】)?[：:\s]/m,
    /^(?:【)?(?:入院時)?理学(?:的)?所見(?:】)?[：:\s]/m,
    /^(?:PE|Physical Examination|Physical Exam)[：:\s]/im,
    /^(?:【)?バイタル(?:サイン)?(?:】)?[：:\s]/m,
    /^(?:VS|Vital Signs)[：:\s]/im,
  ]},
  { key: 'labFindings', patterns: [
    /^(?:【)?(?:入院時)?検\s*査\s*(?:所見|結果)(?:】)?[：:\s]/m,
    /^(?:【)?(?:血液)?検\s*査(?:】)?[：:\s]/m,
    /^(?:Lab|Laboratory|検査データ)[：:\s]/im,
    /^(?:【)?画\s*像\s*(?:所見|検査)(?:】)?[：:\s]/m,
    /^(?:【)?血液ガス(?:】)?[：:\s]/m,
    /^(?:【)?心電図(?:】)?[：:\s]/m,
    /^(?:【)?胸部(?:X線|Xp|CT)(?:】)?[：:\s]/m,
  ]},
  { key: 'diagnosis', patterns: [
    /^(?:【)?(?:確定)?診\s*断(?:名)?(?:】)?[：:\s]/m,
    /^(?:【)?(?:入院時)?診断(?:】)?[：:\s]/m,
    /^(?:Diagnosis|Assessment|Dx)[：:\s]/im,
    /^#1\s/m, // プロブレムリスト形式
  ]},
  { key: 'problemList', patterns: [
    /^(?:【)?プロブレム(?:リスト)?(?:】)?[：:\s]/m,
    /^(?:【)?問題(?:リスト)?(?:】)?[：:\s]/m,
    /^(?:Problem List|Assessment & Plan|A\/P)[：:\s]/im,
  ]},
  { key: 'course', patterns: [
    /^(?:【)?(?:入院後)?経\s*過(?:】)?[：:\s]/m,
    /^(?:【)?臨\s*床\s*経\s*過(?:】)?[：:\s]/m,
    /^(?:【)?治\s*療\s*(?:経過|内容)(?:】)?[：:\s]/m,
    /^(?:Course|Hospital Course|Clinical Course)[：:\s]/im,
    /^(?:Day|第)\s*\d+\s*(?:日目|病日)/m,
  ]},
  { key: 'dischargeMeds', patterns: [
    /^(?:【)?(?:退院時)?処\s*方(?:】)?[：:\s]/m,
    /^(?:【)?(?:退院時)?(?:内服|投薬)(?:薬)?(?:】)?[：:\s]/m,
    /^(?:Discharge (?:Medication|Prescription)|Rx|Rp)[：:\s]/im,
  ]},
]

/**
 * カルテテキストをJ-OSLERセクションに自動振り分け
 */
export function parseKarteText(text: string): ParsedKarte {
  const result: ParsedKarte = {
    chiefComplaint: '', history: '', presentIllness: '', physicalExam: '',
    labFindings: '', problemList: '', course: '', dischargeMeds: '',
    diagnosis: '', unparsed: '',
  }

  if (!text.trim()) return result

  // Step 1: セクションヘッダーの位置を検出
  interface SectionMatch { key: keyof ParsedKarte; start: number; headerEnd: number }
  const matches: SectionMatch[] = []

  for (const { key, patterns } of SECTION_PATTERNS) {
    for (const pattern of patterns) {
      const m = text.match(pattern)
      if (m && m.index !== undefined) {
        matches.push({ key, start: m.index, headerEnd: m.index + m[0].length })
        break // 1パターンマッチしたら次のキーへ
      }
    }
  }

  // Step 2: 位置でソートして各セクションのテキストを抽出
  matches.sort((a, b) => a.start - b.start)

  if (matches.length === 0) {
    // ヘッダーが見つからない場合、ヒューリスティックで推定
    return parseUnstructuredText(text)
  }

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i]
    const nextStart = i < matches.length - 1 ? matches[i + 1].start : text.length
    const content = text.slice(current.headerEnd, nextStart).trim()

    // 既に内容がある場合は追記（既往歴+生活歴+家族歴など）
    if (result[current.key]) {
      result[current.key] += '\n' + content
    } else {
      result[current.key] = content
    }
  }

  // ヘッダー前のテキスト
  if (matches.length > 0 && matches[0].start > 0) {
    result.unparsed = text.slice(0, matches[0].start).trim()
  }

  // 処方を一般名に変換
  if (result.dischargeMeds) {
    result.dischargeMeds = convertPrescriptionToGeneric(result.dischargeMeds)
  }

  // 主訴は25文字に制限
  if (result.chiefComplaint.length > 25) {
    result.chiefComplaint = result.chiefComplaint.slice(0, 25)
  }

  // 既往歴は100文字に制限
  if (result.history.length > 100) {
    result.history = result.history.slice(0, 100)
  }

  return result
}

/**
 * ヘッダーなしの非構造化テキストからヒューリスティックで抽出
 */
function parseUnstructuredText(text: string): ParsedKarte {
  const result: ParsedKarte = {
    chiefComplaint: '', history: '', presentIllness: '', physicalExam: '',
    labFindings: '', problemList: '', course: '', dischargeMeds: '',
    diagnosis: '', unparsed: '',
  }

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

  // 検査値っぽい行を検出（数値+単位のパターン）
  const labPattern = /(?:WBC|Hb|Plt|CRP|BUN|Cr|Na|K|AST|ALT|TP|Alb|T-Bil|LDH|CK|BNP|PCT|HbA1c|eGFR|pH|PaO2|PaCO2|BE|AG)/i
  const vitalPattern = /(?:体温|BT|BP|HR|PR|SpO2|RR|呼吸数|脈拍|血圧|身長|体重|BMI)/i
  const rxPattern = /(?:mg|μg|mL|錠|カプセル|包|本|回|日|分\d|1T|2T|3T)/
  const coursePattern = /(?:Day|第\d+|入院\d+日目|\d+月\d+日|投与|開始|中止|改善|悪化|転科|退院)/

  const labLines: string[] = []
  const vitalLines: string[] = []
  const rxLines: string[] = []
  const courseLines: string[] = []
  const otherLines: string[] = []

  for (const line of lines) {
    if (labPattern.test(line)) {
      labLines.push(line)
    } else if (vitalPattern.test(line)) {
      vitalLines.push(line)
    } else if (rxPattern.test(line) && line.length < 100) {
      rxLines.push(line)
    } else if (coursePattern.test(line)) {
      courseLines.push(line)
    } else {
      otherLines.push(line)
    }
  }

  if (labLines.length > 0) result.labFindings = labLines.join('\n')
  if (vitalLines.length > 0) result.physicalExam = vitalLines.join('\n')
  if (rxLines.length > 0) result.dischargeMeds = convertPrescriptionToGeneric(rxLines.join('\n'))
  if (courseLines.length > 0) result.course = courseLines.join('\n')
  if (otherLines.length > 0) result.presentIllness = otherLines.join('\n')

  return result
}

/**
 * 考察テンプレートを生成（疾患テンプレートベース）
 * AI不使用 — テンプレートの穴埋め構造を提供するだけ
 */
export function generateDiscussionTemplate(
  template: DiseaseTemplate | undefined,
  problemList: string,
  diagnosis: string,
): { courseTemplate: string; discussionTemplate: string } {
  if (!template) {
    return {
      courseTemplate: `【経過】\n（入院後の治療経過を時系列で記載）\n\n【考察】\n（診断根拠・鑑別除外・治療選択の根拠を記載）`,
      discussionTemplate: `（診断・治療の過程を文献を引用しながら考察）\n\n（文献）\n1. \n2. `,
    }
  }

  // プロブレムリストからプロブレムを抽出
  const problems = problemList.split('\n').filter(l => l.trim().startsWith('#')).map(l => l.trim())
  const mainProblem = problems[0] || `#1 ${template.disease}`

  // ── 入院後経過と考察のテンプレート ──
  let courseTemplate = ''

  // メインプロブレム
  courseTemplate += `${mainProblem}\n`
  courseTemplate += `【経過】\n`
  courseTemplate += `入院後, （初期治療: ${template.standardTreatment.slice(0, 2).join(', ') || '【要記載】'}）を開始した. `
  courseTemplate += `（治療経過・検査値の推移を時系列で記載）. `
  courseTemplate += `（転帰: 改善/増悪/転科/退院を記載）.\n\n`
  courseTemplate += `【考察】\n`

  // 診断根拠
  courseTemplate += `本症例は（主訴・所見の要約）から${template.disease}と診断した. `

  // 鑑別診断の除外
  if (template.differentialDiagnosis.length > 0) {
    const diffs = template.differentialDiagnosis.slice(0, 3)
    courseTemplate += `鑑別として${diffs.join(', ')}を考慮したが, `
    diffs.forEach((d, i) => {
      courseTemplate += `${d}は（除外根拠を記載）より否定的であった${i < diffs.length - 1 ? '. ' : '. '}`
    })
  }

  // 治療選択の根拠
  if (template.standardTreatment.length > 0) {
    courseTemplate += `治療は${template.standardTreatment[0]}を選択した. `
    if (template.guidelineRef) {
      courseTemplate += `（${template.guidelineRef}）に準じた治療方針とした. `
    }
  }

  courseTemplate += `\n`

  // 副プロブレム
  for (let i = 1; i < Math.min(problems.length, 4); i++) {
    courseTemplate += `\n${problems[i]}\n`
    courseTemplate += `【経過】\n（経過を記載）\n\n`
    courseTemplate += `【考察】\n（考察を記載）\n`
  }

  // ── 総合考察のテンプレート ──
  let discussionTemplate = ''

  discussionTemplate += `本症例は（患者背景の要約）にて入院した${template.disease}の症例である. `

  // 診断プロセス
  discussionTemplate += `\n\n${template.disease}の診断において, `
  if (template.differentialDiagnosis.length > 0) {
    discussionTemplate += `${template.differentialDiagnosis.slice(0, 2).join('や')}との鑑別が重要であった. `
  }

  // 治療の考察
  if (template.standardTreatment.length > 0) {
    discussionTemplate += `治療は${template.standardTreatment.join(', ')}を行い, `
    discussionTemplate += `（治療効果・転帰を記載）. `
  }

  // ガイドライン参照
  if (template.guidelineRef) {
    discussionTemplate += `\n\n${template.guidelineRef}では, （ガイドラインの推奨内容を記載）とされている. `
    discussionTemplate += `本症例の治療はガイドラインに準じた妥当なものであったと考える. `
  }

  // 文献スロット
  discussionTemplate += `\n\n（文献）\n`
  discussionTemplate += `1. （PubMed検索: ${template.pubmedQuery}）\n`
  discussionTemplate += `2. \n`
  if (template.guidelineRef) {
    discussionTemplate += `3. ${template.guidelineRef}\n`
  }

  // 学び
  discussionTemplate += `\n本症例を通じて, （この症例から得た学びを記載）. `

  return { courseTemplate, discussionTemplate }
}
