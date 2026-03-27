'use client'

import { ReactNode } from 'react'

/**
 * GlowButton — 細い回転グローボーダー付きボタンラッパー
 * 
 * 使い方:
 *   <GlowButton>
 *     <button className="...">無料で始める</button>
 *   </GlowButton>
 * 
 *   <GlowButton as="link" href="/pro">
 *     PRO プランを見る
 *   </GlowButton>
 */

interface GlowButtonProps {
  children: ReactNode
  /** ボタンの角丸（内側ボタンに合わせる） */
  radius?: number
  /** グローの強さ: 'default' | 'strong' */
  intensity?: 'default' | 'strong'
  /** fullwidth */
  fullWidth?: boolean
  className?: string
}

export default function GlowButton({
  children,
  radius = 12,
  intensity = 'default',
  fullWidth = false,
  className = '',
}: GlowButtonProps) {
  const outerRadius = radius + 2
  const blurSize = intensity === 'strong' ? 10 : 6
  const blurOpacity = intensity === 'strong' ? 0.45 : 0.3

  // padding方式: 外側にpadding 2pxを設け、その隙間にグラデーションが回る
  // 子要素は内側で不透明背景により内部は見えない
  return (
    <span
      className={`glow-btn-wrap ${fullWidth ? 'glow-btn-full' : ''} ${className}`}
      style={{
        position: 'relative',
        display: fullWidth ? 'block' : 'inline-block',
        borderRadius: outerRadius,
        padding: 2,
        overflow: 'hidden',
      }}
    >
      {/* 回転グラデーション（padding 2pxの隙間から見える） */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-50%', left: '-50%',
          width: '200%', height: '200%',
          background: 'conic-gradient(from 0deg, transparent 40%, #2DB464 50%, #4ADE80 55%, #86EFAC 58%, #4ADE80 62%, #2DB464 68%, transparent 75%)',
          animation: 'glowBtnSpin 3s linear infinite',
        }}
      />
      <style>{`@keyframes glowBtnSpin { to { transform: rotate(360deg); } }`}</style>
      {/* 子要素 — z-index:1で前面、borderRadiusでクリップ */}
      <span style={{ position: 'relative', display: fullWidth ? 'block' : 'inline-block', zIndex: 1 }}>
        {children}
      </span>
    </span>
  )
}
