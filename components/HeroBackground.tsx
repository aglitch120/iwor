'use client'

// ホーム画面hero背景 — /aboutベースの山と川 + ループアニメーション
// 三角ポリゴン山 + 波カーブ（aboutと同じスタイル）
// アニメーション: 鳥の飛行 + 川の流れ + 微かな霧の揺らぎ
// レスポンシブ: viewBox + preserveAspectRatio で全幅対応

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -mx-4 md:-mx-8" aria-hidden="true">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 800 300"
        fill="none"
        preserveAspectRatio="xMidYEnd slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 端をフェードアウトするラジアルマスク */}
          <radialGradient id="hero-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="65%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="hero-mask">
            <rect width="800" height="300" fill="url(#hero-fade)" />
          </mask>
          {/* 川のストロークグラデーション */}
          <linearGradient id="hero-river" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1B4F3A" stopOpacity="0" />
            <stop offset="25%" stopColor="#1B4F3A" stopOpacity="0.06" />
            <stop offset="75%" stopColor="#1B4F3A" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#1B4F3A" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g mask="url(#hero-mask)">

          {/* ═══ 遠景の大きな山 ═══ */}
          <polygon points="0,220 120,120 240,220" fill="#1B4F3A" opacity="0.05" />
          <polygon points="160,220 320,90 480,220" fill="#1B4F3A" opacity="0.07" />
          <polygon points="400,220 560,100 720,220" fill="#1B4F3A" opacity="0.04" />
          <polygon points="600,220 740,130 800,180 800,220" fill="#1B4F3A" opacity="0.06" />

          {/* ═══ 中景の峰々 ═══ */}
          <polygon points="60,220 80,160 100,220" fill="#1B4F3A" opacity="0.10" />
          <polygon points="90,220 115,150 140,220" fill="#1B4F3A" opacity="0.08" />
          <polygon points="30,220 50,170 70,220" fill="#1B4F3A" opacity="0.06" />
          <polygon points="120,220 140,175 160,220" fill="#1B4F3A" opacity="0.07" />
          <polygon points="340,220 365,140 390,220" fill="#1B4F3A" opacity="0.09" />
          <polygon points="370,220 400,130 430,220" fill="#1B4F3A" opacity="0.07" />
          <polygon points="420,220 445,155 470,220" fill="#1B4F3A" opacity="0.10" />
          <polygon points="620,220 645,155 670,220" fill="#1B4F3A" opacity="0.08" />
          <polygon points="660,220 690,140 720,220" fill="#1B4F3A" opacity="0.10" />
          <polygon points="710,220 735,165 760,220" fill="#1B4F3A" opacity="0.06" />
          <polygon points="750,220 770,170 790,220" fill="#1B4F3A" opacity="0.08" />

          {/* ═══ 地平線 ═══ */}
          <line x1="0" y1="220" x2="800" y2="220" stroke="#1B4F3A" strokeWidth="0.5" opacity="0.08" />

          {/* ═══ 川の波（アニメーション付き） ═══ */}
          <path
            d="M0,240 Q100,230 200,245 Q350,260 500,238 Q650,215 800,240 L800,260 Q650,235 500,258 Q350,280 200,265 Q100,250 0,260Z"
            fill="#1B4F3A"
            opacity="0.05"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -15,2; 0,0"
              dur="6s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M0,255 Q150,248 300,258 Q500,270 700,250 L800,252 L800,258 Q700,256 500,276 Q300,264 150,254 L0,261Z"
            fill="#1B4F3A"
            opacity="0.03"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 12,-1; 0,0"
              dur="8s"
              repeatCount="indefinite"
            />
          </path>

          {/* 川のストローク（流れの質感） */}
          <path
            d="M0,242 Q200,232 400,248 Q600,264 800,244"
            fill="none"
            stroke="url(#hero-river)"
            strokeWidth="1"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -20,1; 0,0"
              dur="7s"
              repeatCount="indefinite"
            />
          </path>

          {/* ═══ 霧 / 空気感（ゆるやかな揺らぎ） ═══ */}
          <ellipse cx="200" cy="200" rx="120" ry="20" fill="#1B4F3A" opacity="0.02">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 30,-3; 0,0"
              dur="12s"
              repeatCount="indefinite"
            />
          </ellipse>
          <ellipse cx="600" cy="190" rx="100" ry="15" fill="#1B4F3A" opacity="0.015">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -25,2; 0,0"
              dur="15s"
              repeatCount="indefinite"
            />
          </ellipse>

          {/* ═══ 鳥たち（ゆっくり横断） ═══ */}
          {/* 鳥1 — 手前、やや大きめ */}
          <g opacity="0.12">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="850,0; -100,0"
              dur="22s"
              repeatCount="indefinite"
            />
            <path
              d="M0,130 Q8,121 16,130 M16,130 Q24,121 32,130"
              fill="none"
              stroke="#1B4F3A"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-2.5; 0,0"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* 鳥2 — 中距離 */}
          <g opacity="0.08">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="900,30; -60,30"
              dur="28s"
              repeatCount="indefinite"
            />
            <path
              d="M0,145 Q5,138 10,145 M10,145 Q15,138 20,145"
              fill="none"
              stroke="#1B4F3A"
              strokeWidth="1.3"
              strokeLinecap="round"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-2; 0,0"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* 鳥3 — 遠景、小さい */}
          <g opacity="0.05">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="950,-10; -50,-10"
              dur="35s"
              repeatCount="indefinite"
            />
            <path
              d="M0,110 Q3,105 6,110 M6,110 Q9,105 12,110"
              fill="none"
              stroke="#1B4F3A"
              strokeWidth="1"
              strokeLinecap="round"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-1.5; 0,0"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </path>
          </g>

        </g>
      </svg>
    </div>
  )
}
