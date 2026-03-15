# 依存パッケージ ライセンス確認

> 最終確認日: 2026-03-15

## 結論

**GPL混入なし。** 全パッケージがMITまたはMPL-2.0で、商用利用・事業譲渡に問題なし。

## 直接依存パッケージ

| パッケージ | ライセンス | 備考 |
|-----------|-----------|------|
| next | MIT | |
| react | MIT | |
| react-dom | MIT | |
| next-mdx-remote | MPL-2.0 | 弱いコピーレフト。同ファイルの変更のみ開示義務。プロジェクト全体には波及しない |
| @mdx-js/loader | MIT | |
| @mdx-js/react | MIT | |
| @next/mdx | MIT | |
| autoprefixer | MIT | |
| gray-matter | MIT | |
| postcss | MIT | |
| reading-time | MIT | |
| rehype-autolink-headings | MIT | |
| rehype-slug | MIT | |
| remark-gfm | MIT | |
| tailwindcss | MIT | |

## devDependencies

| パッケージ | ライセンス |
|-----------|-----------|
| @types/node | MIT |
| @types/react | MIT |
| typescript | Apache-2.0 |

## MPL-2.0について

next-mdx-remoteのMPL-2.0は「ファイルレベルのコピーレフト」。
next-mdx-remote自体のソースを改変して再配布する場合のみ、改変部分の開示義務がある。
プロジェクトのコードやビジネスロジックには波及しない。事業譲渡に影響なし。
