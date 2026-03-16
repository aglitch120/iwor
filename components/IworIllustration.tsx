/**
 * iwor 幾何学イラスト — 森の中の小川
 * 木（三角形の針葉樹）と右上に流れる川
 * 背景ボックスなし、形だけが浮かぶ
 */
export function IworIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 280"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* ── 川（左下から右上へ蛇行） ── */}
      <path
        d="M-20,260 Q80,250 160,235 Q280,210 400,195 Q520,178 640,155 Q720,140 820,120"
        stroke="#1B4F3A"
        strokeWidth="18"
        opacity="0.04"
        strokeLinecap="round"
      />
      <path
        d="M-20,268 Q90,256 180,242 Q300,218 420,200 Q540,182 660,158 Q740,142 820,128"
        stroke="#1B4F3A"
        strokeWidth="8"
        opacity="0.06"
        strokeLinecap="round"
      />
      {/* 川のハイライト */}
      <path
        d="M40,258 Q140,245 240,230 Q380,208 500,192 Q620,174 720,150"
        stroke="#1B4F3A"
        strokeWidth="2"
        opacity="0.08"
        strokeLinecap="round"
        strokeDasharray="6 12"
      />

      {/* ── 左の森（川の左岸） ── */}
      {/* 大きな木 */}
      <polygon points="50,270 75,180 100,270" fill="#1B4F3A" opacity="0.09" />
      <rect x="71" y="270" width="8" height="10" fill="#1B4F3A" opacity="0.07" />
      {/* 中くらいの木 */}
      <polygon points="110,265 130,195 150,265" fill="#1B4F3A" opacity="0.07" />
      <polygon points="15,272 35,210 55,272" fill="#1B4F3A" opacity="0.06" />
      {/* 小さい木（奥） */}
      <polygon points="80,268 95,218 110,268" fill="#1B4F3A" opacity="0.05" />
      <polygon points="145,262 162,208 179,262" fill="#1B4F3A" opacity="0.06" />

      {/* ── 中央の木（川沿い） ── */}
      <polygon points="260,248 282,168 304,248" fill="#1B4F3A" opacity="0.08" />
      <polygon points="300,245 318,180 336,245" fill="#1B4F3A" opacity="0.06" />
      <polygon points="230,252 248,198 266,252" fill="#1B4F3A" opacity="0.05" />

      {/* ── 右の木（川の奥、小さく） ── */}
      <polygon points="480,220 496,165 512,220" fill="#1B4F3A" opacity="0.07" />
      <polygon points="520,215 534,168 548,215" fill="#1B4F3A" opacity="0.05" />
      <polygon points="560,210 572,170 584,210" fill="#1B4F3A" opacity="0.06" />

      {/* ── 遠景の木（最も小さく、薄く） ── */}
      <polygon points="650,195 660,160 670,195" fill="#1B4F3A" opacity="0.04" />
      <polygon points="690,188 700,155 710,188" fill="#1B4F3A" opacity="0.03" />
      <polygon points="730,180 738,152 746,180" fill="#1B4F3A" opacity="0.04" />
      <polygon points="760,175 767,150 774,175" fill="#1B4F3A" opacity="0.03" />
    </svg>
  )
}
