'use client'

import { useState, useEffect, useCallback } from 'react'
import { useProStatus } from '@/components/pro/useProStatus'
import ProModal from '@/components/pro/ProModal'
import FavoriteButton from '@/components/tools/FavoriteButton'
import HospitalTab from './HospitalSection'
import InterviewTab from './InterviewSection'
import DocumentsTab from './DocumentsTab'

// ── テーマカラー ──
const MC = '#1B4F3A'
const MCL = '#E8F0EC'

// ── 型定義 ──
interface Profile {
  name: string
  university: string
  graduationYear: string
  preferredSpecialty: string
  preferredRegions: string[]
  clubs: string
  research: string
  strengths: string
  motivation: string
}

const EMPTY_PROFILE: Profile = {
  name: '', university: '', graduationYear: '', preferredSpecialty: '',
  preferredRegions: [], clubs: '', research: '', strengths: '', motivation: '',
}

const SPECIALTIES = [
  '内科','外科','小児科','産婦人科','整形外科','脳神経外科',
  '皮膚科','眼科','耳鼻咽喉科','泌尿器科','精神科','放射線科',
  '麻酔科','救急科','形成外科','病理','リハビリテーション科',
  '総合診療科','未定',
]

const REGIONS = ['北海道','東北','関東','中部','近畿','中国','四国','九州・沖縄']

const STORAGE_KEY = "iwor_matching_profile"
const MODE_STORAGE_KEY = "iwor_matching_mode"

// ── モード ──
type Mode = 'matching' | 'career'

// ── タブ定義 ──
type TabId = 'profile' | 'documents' | 'hospitals' | 'interview'

function getTabs(mode: Mode) {
  const tabs: { id: TabId; label: string; icon: React.ReactNode; pro?: boolean }[] = [
    {
      id: 'profile', label: 'プロフィール',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
    },
    {
      id: 'documents', label: '書類・メール',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
    },
  ]
  if (mode === 'matching') {
    tabs.push({
      id: 'hospitals', label: '病院検索',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>,
    })
  }
  tabs.push({
    id: 'interview', label: 'AI面接',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>,
    pro: true,
  })
  return tabs
}

export default function MatchingApp() {
  const { isPro } = useProStatus()
  const [mode, setMode] = useState<Mode>('matching')
  const [tab, setTab] = useState<TabId>('profile')
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE)
  const [showProModal, setShowProModal] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [helpDismissed, setHelpDismissed] = useState(false)
  const [tutorialDone, setTutorialDone] = useState(false)

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) setProfile(JSON.parse(raw)) } catch {}
    const m = localStorage.getItem(MODE_STORAGE_KEY)
    if (m === 'career' || m === 'matching') setMode(m)
    if (!localStorage.getItem('iwor_matching_tutorial_done')) setShowTutorial(true)
    else setTutorialDone(true)
    if (localStorage.getItem('iwor_matching_help_dismissed')) setHelpDismissed(true)
  }, [])

  const handleModeChange = useCallback((m: Mode) => {
    setMode(m); localStorage.setItem(MODE_STORAGE_KEY, m)
    if (m === 'career' && tab === 'hospitals') setTab('profile')
  }, [tab])

  const saveProfile = useCallback(() => {
    if (!isPro) { setShowProModal(true); return }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }, [isPro, profile])

  const updateField = useCallback((field: keyof Profile, value: string | string[]) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }, [])

  const toggleRegion = useCallback((region: string) => {
    setProfile(prev => ({
      ...prev,
      preferredRegions: prev.preferredRegions.includes(region)
        ? prev.preferredRegions.filter(r => r !== region)
        : [...prev.preferredRegions, region],
    }))
  }, [])

  const profileCompletion = (() => {
    const fields = [profile.name, profile.university, profile.graduationYear, profile.preferredSpecialty, profile.strengths, profile.motivation]
    return Math.round((fields.filter(f => f.length > 0).length / fields.length) * 100)
  })()

  const tabs = getTabs(mode)

  return (
    <>
      {/* ── ヘッダー ── */}
      <div className="mb-4 pt-2">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: MCL }}>
            <svg className="w-5 h-5" style={{ stroke: MC }} viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-tx">マッチング・転職対策</h1>
            <p className="text-[11px] text-muted">
              {mode === 'matching' ? 'プロフィール → 書類・メール → 病院検索 → AI面接' : 'プロフィール → 書類・メール → AI面接'}
            </p>
          </div>
          <FavoriteButton slug="app-matching" title="マッチング・転職対策" href="/matching" type="app" size="sm" />
        </div>

        {/* ── モード切替 ── */}
        <div className="flex bg-s1 rounded-xl p-1 mb-4">
          <button
            onClick={() => handleModeChange('matching')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${mode === 'matching' ? 'bg-s0 shadow-sm' : 'text-muted hover:text-tx'}`}
            style={mode === 'matching' ? { color: MC } : undefined}
          >
            <span className="flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
              医学生（マッチング）
            </span>
          </button>
          <button
            onClick={() => handleModeChange('career')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${mode === 'career' ? 'bg-s0 shadow-sm' : 'text-muted hover:text-tx'}`}
            style={mode === 'career' ? { color: MC } : undefined}
          >
            <span className="flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              専攻医・転職
            </span>
          </button>
        </div>
      </div>

      {/* ── タブナビ ── */}
      <div className="flex gap-1 mb-6 bg-s1 rounded-xl p-1 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              tab === t.id ? 'bg-s0 shadow-sm' : 'text-muted hover:text-tx'
            }`}
            style={tab === t.id ? { color: MC } : undefined}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
            {t.pro && <span className="text-[9px] font-bold px-1 py-0.5 rounded" style={{ background: MCL, color: MC }}>PRO</span>}
          </button>
        ))}
      </div>

      {/* ── タブコンテンツ ── */}
      {tab === 'profile' && (
        <ProfileTab profile={profile} updateField={updateField} toggleRegion={toggleRegion}
          saveProfile={saveProfile} saved={saved} completion={profileCompletion} isPro={isPro} mode={mode} />
      )}
      {tab === 'documents' && <DocumentsTab profile={profile} mode={mode} />}
      {tab === 'hospitals' && mode === 'matching' && (
        <HospitalTab profile={profile} isPro={isPro} onShowProModal={() => setShowProModal(true)} />
      )}
      {tab === 'interview' && (
        <InterviewTab profile={profile} isPro={isPro} onShowProModal={() => setShowProModal(true)} />
      )}

      {showProModal && <ProModal onClose={() => setShowProModal(false)} feature="save" />}

      {showTutorial && <MatchingTutorial mode={mode} onClose={() => {
        setShowTutorial(false); setTutorialDone(true)
        localStorage.setItem('iwor_matching_tutorial_done', '1')
      }} />}

      {!helpDismissed && tutorialDone && !showTutorial && (
        <div style={{ position:'fixed', bottom:'calc(72px + env(safe-area-inset-bottom, 0px))', left:'max(14px, calc(50% - 346px))', zIndex:40, display:'flex', alignItems:'center', gap:0 }}>
          <button onClick={() => setShowTutorial(true)} style={{ width:40, height:40, borderRadius:'50%', border:'1.5px solid #DDD9D2', background:'#FEFEFC', color:MC, fontSize:16, fontWeight:700, cursor:'pointer', boxShadow:'0 2px 10px rgba(0,0,0,.08)', display:'flex', alignItems:'center', justifyContent:'center' }} aria-label="使い方ヘルプ">?</button>
          <button onClick={() => { setHelpDismissed(true); localStorage.setItem('iwor_matching_help_dismissed','1') }} style={{ width:18, height:18, borderRadius:'50%', border:'none', background:'#C8C4BC', color:'#fff', fontSize:10, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', top:-14, left:-6, lineHeight:1 }} aria-label="ヘルプを非表示">×</button>
        </div>
      )}
    </>
  )
}

// ═══════════════════════════════════════
//  プロフィールタブ（履歴書プレビュー統合）
// ═══════════════════════════════════════
function ProfileTab({ profile, updateField, toggleRegion, saveProfile, saved, completion, isPro, mode }: {
  profile: Profile; updateField: (f: keyof Profile, v: string | string[]) => void
  toggleRegion: (r: string) => void; saveProfile: () => void
  saved: boolean; completion: number; isPro: boolean; mode: Mode
}) {
  const [openSection, setOpenSection] = useState<number>(1)
  const [showResume, setShowResume] = useState(false)
  const toggle = (n: number) => setOpenSection(prev => prev === n ? 0 : n)
  const hasData = profile.name && profile.university

  return (
    <div className="space-y-3">
      {/* 完成度 */}
      <div className="bg-s0 border border-br rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-tx">プロフィール完成度</p>
          <p className="text-sm font-bold" style={{ color: MC }}>{completion}%</p>
        </div>
        <div className="w-full h-2 bg-s1 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${completion}%`, background: MC }} />
        </div>
        {completion < 100 && <p className="text-[11px] text-muted mt-2">すべて入力すると履歴書が自動生成されます</p>}
      </div>

      {/* 基本情報 */}
      <AccordionSection num={1} title="基本情報" done={!!(profile.name && profile.university)} open={openSection === 1} onToggle={() => toggle(1)}>
        <Field label="氏名" value={profile.name} onChange={v => updateField('name', v)} placeholder="山田 太郎" />
        <Field label="大学" value={profile.university} onChange={v => updateField('university', v)} placeholder="○○大学医学部" />
        <div>
          <label className="text-xs font-medium text-tx mb-1 block">卒業年度</label>
          <select value={profile.graduationYear} onChange={e => updateField('graduationYear', e.target.value)}
            className="w-full px-3 py-2.5 border border-br rounded-lg bg-bg text-sm text-tx focus:border-ac focus:ring-1 focus:ring-ac/20 outline-none transition-all">
            <option value="">選択してください</option>
            {[2026,2027,2028,2029,2030].map(y => <option key={y} value={String(y)}>{y}年3月卒業</option>)}
          </select>
        </div>
      </AccordionSection>

      {/* 志望 */}
      <AccordionSection num={2} title="志望情報" done={!!profile.preferredSpecialty} open={openSection === 2} onToggle={() => toggle(2)}>
        <div>
          <label className="text-xs font-medium text-tx mb-1 block">志望科</label>
          <select value={profile.preferredSpecialty} onChange={e => updateField('preferredSpecialty', e.target.value)}
            className="w-full px-3 py-2.5 border border-br rounded-lg bg-bg text-sm text-tx focus:border-ac focus:ring-1 focus:ring-ac/20 outline-none transition-all">
            <option value="">選択してください</option>
            {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {mode === 'matching' && (
          <div>
            <label className="text-xs font-medium text-tx mb-2 block">希望地域（複数選択可）</label>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map(r => (
                <button key={r} onClick={() => toggleRegion(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    profile.preferredRegions.includes(r) ? 'text-white border-transparent' : 'border-br text-muted hover:border-br2 bg-s0'
                  }`}
                  style={profile.preferredRegions.includes(r) ? { background: MC } : undefined}
                >{r}</button>
              ))}
            </div>
          </div>
        )}
      </AccordionSection>

      {/* 経歴・PR */}
      <AccordionSection num={3} title="経歴・自己PR" done={!!(profile.strengths && profile.motivation)} open={openSection === 3} onToggle={() => toggle(3)}>
        <TextArea label="部活・課外活動" value={profile.clubs} onChange={v => updateField('clubs', v)} placeholder="例: バスケットボール部 主将（4年間）" rows={2} />
        <TextArea label="研究経験" value={profile.research} onChange={v => updateField('research', v)} placeholder="例: 循環器内科学教室で心不全に関する基礎研究" rows={2} />
        <TextArea label="自己PRポイント" value={profile.strengths} onChange={v => updateField('strengths', v)} placeholder="例: チームでの協調性、粘り強く取り組む姿勢" rows={3} />
        <TextArea label="志望動機" value={profile.motivation} onChange={v => updateField('motivation', v)} placeholder="例: 幅広い症例を経験し、地域医療に貢献できる医師になりたい" rows={3} />
      </AccordionSection>

      {/* 保存 */}
      <button onClick={saveProfile}
        className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2"
        style={{ background: MC, boxShadow: `0 4px 14px ${MC}33` }}>
        {saved ? (
          <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>保存しました</>
        ) : (
          <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>{isPro ? 'プロフィールを保存' : 'プロフィールを保存（PRO）'}</>
        )}
      </button>

      {/* 履歴書プレビュー */}
      <div className="bg-s0 border border-br rounded-xl overflow-hidden">
        <button onClick={() => setShowResume(!showResume)} className="w-full flex items-center justify-between p-4 hover:bg-s1/50 transition-colors">
          <span className="text-sm font-bold text-tx flex items-center gap-2">
            <svg className="w-4 h-4" style={{ stroke: MC }} fill="none" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            履歴書プレビュー
            {!isPro && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: MCL, color: MC }}>PRO</span>}
          </span>
          <span className={`text-muted transition-transform ${showResume ? 'rotate-180' : ''}`}>▾</span>
        </button>
        {showResume && (
          <div className="border-t border-br">
            {!hasData ? (
              <div className="p-6 text-center"><p className="text-xs text-muted">氏名と大学を入力すると履歴書が表示されます</p></div>
            ) : (
              <div className="p-5 relative">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-24 bg-s1 border border-br rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-[10px] text-muted">写真</span></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-bold text-tx mb-1">{profile.name}</p>
                      <div className="space-y-0.5 text-xs text-muted">
                        <p>{profile.university}</p>
                        {profile.graduationYear && <p>{profile.graduationYear}年3月卒業見込み</p>}
                        {profile.preferredSpecialty && <p>志望科: <span className="font-medium text-tx">{profile.preferredSpecialty}</span></p>}
                      </div>
                    </div>
                  </div>
                  <hr className="border-br" />
                  <RSection title="志望動機" content={profile.motivation} />
                  <RSection title="自己PRポイント" content={profile.strengths} />
                  <RSection title="部活・課外活動" content={profile.clubs} />
                  <RSection title="研究経験" content={profile.research} />
                  {profile.preferredRegions.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-tx mb-1">希望研修地域</p>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.preferredRegions.map(r => <span key={r} className="px-2 py-0.5 rounded text-[11px] font-medium" style={{ background: MCL, color: MC }}>{r}</span>)}
                      </div>
                    </div>
                  )}
                </div>
                {!isPro && (
                  <div className="absolute inset-0 top-32">
                    <div className="w-full h-full backdrop-blur-md bg-s0/60 flex flex-col items-center justify-center px-6">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: MCL }}>
                        <svg className="w-6 h-6" style={{ stroke: MC }} fill="none" viewBox="0 0 24 24" strokeWidth={2}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                      </div>
                      <p className="text-sm font-bold text-tx mb-1">PRO会員で履歴書を完全生成</p>
                      <p className="text-xs text-muted mb-4 text-center">PDF出力・病院別カスタマイズ・AI添削が使えます</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── アコーディオンセクション ──
function AccordionSection({ num, title, done, open, onToggle, children }: {
  num: number; title: string; done: boolean; open: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div className="bg-s0 border border-br rounded-xl overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-4 hover:bg-s1/50 transition-colors">
        <span className="text-sm font-bold text-tx flex items-center gap-2">
          <span className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold" style={{ background: MC }}>{num}</span>
          {title}
          {done && <span className="text-[10px] text-ac">✓</span>}
        </span>
        <span className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && <div className="px-5 pb-5 space-y-3">{children}</div>}
    </div>
  )
}

function RSection({ title, content }: { title: string; content: string }) {
  if (!content) return null
  return <div><p className="text-xs font-bold text-tx mb-1">{title}</p><p className="text-xs text-muted leading-relaxed whitespace-pre-wrap">{content}</p></div>
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-tx mb-1 block">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2.5 border border-br rounded-lg bg-bg text-sm text-tx focus:border-ac focus:ring-1 focus:ring-ac/20 outline-none transition-all" />
    </div>
  )
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <div>
      <label className="text-xs font-medium text-tx mb-1 block">{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className="w-full px-3 py-2.5 border border-br rounded-lg bg-bg text-sm text-tx focus:border-ac focus:ring-1 focus:ring-ac/20 outline-none transition-all resize-none" />
    </div>
  )
}

// ═══ Tutorial ═══
const TUT_MATCH = [
  { emoji: '📝', title: 'プロフィールを入力', desc: '基本情報を入力しましょう。履歴書の自動生成やAI面接のパーソナライズに使われます。' },
  { emoji: '✉️', title: '書類・メールを作成', desc: '見学申込メール、お礼メール、送付状をテンプレートから作成。見学準備チェックリストも。' },
  { emoji: '🏥', title: '病院を検索・比較', desc: '45病院のデータベースから地域・タイプ・診療科・倍率で検索。志望リストでマッチ確率を確認。' },
  { emoji: '🤖', title: 'AI面接で練習', desc: '志望病院に合わせたAI面接練習。圧迫度や時間を調整して本番に備えましょう。' },
]
const TUT_CAREER = [
  { emoji: '📝', title: 'プロフィールを入力', desc: '基本情報・経歴・自己PRを入力しましょう。書類作成やAI面接に活用されます。' },
  { emoji: '✉️', title: '書類・メールを作成', desc: '見学申込メール、お礼メールなどをテンプレートから簡単に作成できます。' },
  { emoji: '🤖', title: 'AI面接で練習', desc: 'AI面接練習で面接スキルを磨きましょう。フィードバックで改善点を把握できます。' },
]

function MatchingTutorial({ mode, onClose }: { mode: Mode; onClose: () => void }) {
  const steps = mode === 'matching' ? TUT_MATCH : TUT_CAREER
  const [step, setStep] = useState(0)
  const s = steps[step]
  const isLast = step === steps.length - 1

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'#FEFEFC', borderRadius:20, width:'100%', maxWidth:400, padding:'32px 28px 24px', textAlign:'center', animation:'matchTutFadeUp .3s ease-out' }}>
        <div style={{ display:'flex', justifyContent:'center', gap:6, marginBottom:20 }}>
          {steps.map((_,i) => <div key={i} style={{ width: i===step?20:8, height:8, borderRadius:4, background: i===step?MC:'#E8E5DF', transition:'all .3s' }} />)}
        </div>
        <div style={{ width:64, height:64, borderRadius:16, background:MCL, border:`2px solid ${MC}30`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:28 }}>{s.emoji}</div>
        <h3 style={{ fontSize:18, fontWeight:700, color:'#1A1917', marginBottom:8 }}>{s.title}</h3>
        <p style={{ fontSize:13, color:'#6B6760', lineHeight:1.7, marginBottom:24 }}>{s.desc}</p>
        <p style={{ fontSize:11, color:'#C8C4BC', marginBottom:16 }}>{step+1} / {steps.length}</p>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={onClose} style={{ flex:1, padding:'12px 0', border:'1.5px solid #DDD9D2', borderRadius:12, background:'none', color:'#6B6760', fontSize:13, fontWeight:500, cursor:'pointer' }}>スキップ</button>
          <button onClick={() => isLast ? onClose() : setStep(step+1)} style={{ flex:2, padding:'12px 0', border:'none', borderRadius:12, background:MC, color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>{isLast ? 'はじめる 🚀' : '次へ →'}</button>
        </div>
      </div>
      <style>{`@keyframes matchTutFadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}
