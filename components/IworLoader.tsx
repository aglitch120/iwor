'use client'

/**
 * IworLoader - iworロゴの横棒3本線をモチーフにしたローディングアニメーション
 * 3本の横線が順番に伸縮するウェーブアニメーション
 */
export default function IworLoader({ size = 'md', text }: { size?: 'sm' | 'md' | 'lg'; text?: string }) {
  const dims = { sm: { w: 20, h: 16, bar: 2 }, md: { w: 28, h: 22, bar: 3 }, lg: { w: 40, h: 32, bar: 4 } }
  const d = dims[size]

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={d.w} height={d.h} viewBox={`0 0 ${d.w} ${d.h}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 3本の横棒 — 順番にwidth伸縮 */}
        {[0, 1, 2].map(i => {
          const y = (d.h / 4) * (i + 1) - d.bar / 2
          return (
            <rect
              key={i}
              x={d.w * 0.15}
              y={y}
              width={d.w * 0.7}
              height={d.bar}
              rx={d.bar / 2}
              fill="var(--ac)"
            >
              <animate
                attributeName="width"
                values={`${d.w * 0.3};${d.w * 0.7};${d.w * 0.3}`}
                dur="1.2s"
                begin={`${i * 0.2}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
              />
              <animate
                attributeName="x"
                values={`${d.w * 0.35};${d.w * 0.15};${d.w * 0.35}`}
                dur="1.2s"
                begin={`${i * 0.2}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
              />
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur="1.2s"
                begin={`${i * 0.2}s`}
                repeatCount="indefinite"
              />
            </rect>
          )
        })}
      </svg>
      {text && <p className="text-[10px] text-muted">{text}</p>}
    </div>
  )
}
