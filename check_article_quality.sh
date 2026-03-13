#!/bin/bash
# 記事品質チェックスクリプト
# Usage: bash check_article_quality.sh content/blog/NEW_ARTICLE.mdx
# コミット前に必ず実行すること

FILE=$1
if [ -z "$FILE" ]; then echo "Usage: $0 <mdx_file>"; exit 1; fi
if [ ! -f "$FILE" ]; then echo "Error: File not found: $FILE"; exit 1; fi

echo "=========================================="
echo "記事品質チェック: $(basename $FILE)"
echo "=========================================="
PASS=true
WARN=false

# 1. SVG数
SVG_COUNT=$(grep -c '<svg' "$FILE")
if [ "$SVG_COUNT" -ge 2 ]; then
  echo "✅ SVG: ${SVG_COUNT}個"
else
  echo "❌ SVG不足: ${SVG_COUNT}個（2個以上必要）"
  PASS=false
fi

# 2. CTA数（booth.pmリンク）
CTA_COUNT=$(grep -c 'booth.pm' "$FILE")
if [ "$CTA_COUNT" -ge 2 ]; then
  echo "✅ CTA: ${CTA_COUNT}箇所"
else
  echo "❌ CTA不足: ${CTA_COUNT}箇所（2箇所以上必要）"
  PASS=false
fi

# 3. 内部リンク数（相対パス + 絶対URL）
LINKS_REL=$(grep -oE '\(/blog/[^)]+\)' "$FILE" | wc -l)
LINKS_ABS=$(grep -oE 'naikanavi\.com/blog/' "$FILE" | wc -l)
LINKS=$((LINKS_REL + LINKS_ABS))
if [ "$LINKS" -ge 3 ]; then
  echo "✅ 内部リンク: ${LINKS}本（相対${LINKS_REL} + 絶対${LINKS_ABS}）"
else
  echo "❌ リンク不足: ${LINKS}本（3本以上必要）"
  PASS=false
fi

# 4. よくある失敗セクション
FAIL_COUNT=$(grep -c 'よくある失敗' "$FILE")
if [ "$FAIL_COUNT" -ge 1 ]; then
  echo "✅ 失敗パターンあり"
else
  echo "❌ 失敗パターンなし（必須セクション）"
  PASS=false
fi

# 5. 箇条書き壁（5行以上の連続）
WALLS=$(awk '/^- |^[0-9]+\. |^\*\*[A-Z]/{c++; next} c>=5{n++} {c=0} END{print n+0}' "$FILE")
if [ "$WALLS" -eq 0 ]; then
  echo "✅ 箇条書き壁なし"
else
  echo "⚠️  箇条書き壁${WALLS}箇所（リファレンスリストなら許容）"
  WARN=true
fi

# 6. 文字数
CHARS=$(wc -c < "$FILE")
if [ "$CHARS" -ge 12000 ]; then
  echo "✅ 文字数: ${CHARS}"
else
  echo "❌ 文字数不足: ${CHARS}（12000以上推奨）"
  PASS=false
fi

# 7. 散文ファースト違反（H2直後に箇条書き）
H2_BULLET=$(awk '
/^## /{h2=1; blank=0; next}
h2 && /^$/{blank++; if(blank>1){h2=0}; next}
h2 && /^- |^\*\*[A-Z]|^[0-9]+\./{print NR": "$0; h2=0; next}
h2 && /^[^#<>|]/{h2=0}
' "$FILE" | head -3)
if [ -z "$H2_BULLET" ]; then
  echo "✅ 散文ファースト: OK"
else
  echo "❌ 散文ファースト違反（H2直後に箇条書き）:"
  echo "   $H2_BULLET"
  PASS=false
fi

# 7.5. 太字マークダウン破損チェック
BOLD_BROKEN=$(grep -c "\*\*[^*]*（[^*]*）\*\*" "$FILE" 2>/dev/null || echo 0)
if [ "$BOLD_BROKEN" -eq 0 ]; then echo "✅ 太字マークダウン: 破損なし"; else echo "❌ 太字マークダウン破損: ${BOLD_BROKEN}箇所（**の中に（）がある）"; PASS=false; fi

# 8. SVGの多様性チェック
if [ "$SVG_COUNT" -ge 2 ]; then
  SVG_TYPES=$(grep -oE 'aria-label="[^"]*"' "$FILE" | sort -u | wc -l)
  if [ "$SVG_TYPES" -ge 2 ]; then
    echo "✅ SVG多様性: ${SVG_TYPES}種類"
  else
    echo "⚠️  SVGが全て同じタイプの可能性（aria-label ${SVG_TYPES}種類）"
    WARN=true
  fi
fi

# 9. 著作権フッター
SVG_COPYRIGHT=$(grep -c '© 内科ナビ' "$FILE")
if [ "$SVG_COPYRIGHT" -ge "$SVG_COUNT" ] && [ "$SVG_COUNT" -gt 0 ]; then
  echo "✅ SVG著作権フッター: ${SVG_COPYRIGHT}個"
elif [ "$SVG_COUNT" -gt 0 ]; then
  echo "⚠️  SVG著作権フッター不足: SVG${SVG_COUNT}個に対し${SVG_COPYRIGHT}個"
  WARN=true
fi

# 10. 太字の使用
BOLD_COUNT=$(grep -c '\*\*' "$FILE")
if [ "$BOLD_COUNT" -ge 10 ]; then
  echo "✅ 太字: ${BOLD_COUNT}箇所"
else
  echo "⚠️  太字が少ない: ${BOLD_COUNT}箇所（10箇所以上推奨）"
  WARN=true
fi

echo "=========================================="
if $PASS; then
  if $WARN; then
    echo "🟡 合格（警告あり）: コミットOK、但し警告箇所の確認推奨"
  else
    echo "🟢 合格: コミットOK"
  fi
else
  echo "🔴 不合格: 修正してから再チェック"
  echo ""
  echo "修正のヒント:"
  [ "$SVG_COUNT" -lt 2 ] && echo "  → SVG図解を追加してください（フローチャート/比較図/ステップ図等）"
  [ "$CTA_COUNT" -lt 2 ] && echo "  → 中盤に自然なCTAリンクを追加してください"
  [ "$LINKS" -lt 3 ] && echo "  → 関連記事への内部リンクを追加してください"
  [ "$FAIL_COUNT" -eq 0 ] && echo "  → 「## よくある失敗3パターン」セクションを追加してください"
  [ -n "$H2_BULLET" ] && echo "  → H2セクション冒頭に2〜3段落の散文を追加してください"
  [ "$CHARS" -lt 12000 ] && echo "  → 散文を拡充して文字数を増やしてください"
fi
echo "=========================================="
