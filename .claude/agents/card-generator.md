# Card Generator Agent

国試過去問から「合格できるカード」を生成するエージェント。

## 呼び出し方

```
@card-generator 消化器のカードを作って。過去問チャートのURL: https://...  テキスト: /path/to/pdf
```

## 実行手順

### 1. 入力を受け取る

必須:
- 科目名
- 過去問データ（URLまたはテキスト）

任意:
- テキストPDF（章構成の把握に使用）
- ガイドラインURL

### 2. CARD_GENERATION_PIPELINE.md を読む

```bash
cat docs/CARD_GENERATION_PIPELINE.md
```

パイプラインのStep 0-5に従って実行する。

### 3. 過去問データを取得・分析

過去問チャートURLが与えられた場合はweb_fetchで取得。
7つの出題パターンに分類する。

### 4. 禁忌肢を最優先で抽出

科目内の全禁忌をリストアップ。1つも漏らさない。

### 5. 6カテゴリのカードを生成

枚数配分はパイプラインに従う。
ガイドラインの数値はweb検索で最新を確認する。

### 6. 品質検証

チェックリストを全項目確認。合格シミュレーション85%以上を目標。

### 7. 出力

```bash
# ファイルを配置
cp {科目}-cards.ts app/study/data/

# 生成ログも残す
echo "生成ログ" >> docs/card-generation-logs.md

# コミット
git add app/study/data/{科目}-cards.ts docs/card-generation-logs.md
git commit -m "feat(study): add {科目} flashcard deck (XX cards, exam-pattern-driven)"
```

## 品質基準

- [ ] 禁忌肢が全数カード化されている
- [ ] frontが症例提示 or 臨床判断形式になっている（「〜を述べよ」は不可）
- [ ] 過去問の問題文を直接引用していない
- [ ] ガイドラインの数値が最新版で確認済み
- [ ] ID重複がない
- [ ] 合格シミュレーション推定正答率 85%以上
