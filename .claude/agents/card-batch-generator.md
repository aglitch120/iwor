# Card Batch Generator Agent

全科目のカードデッキを一括生成するエージェント。

## 呼び出し方

```
@card-batch-generator Phase 1の残りを生成して
@card-batch-generator 全科目生成して
```

## 処理フロー

### 1. 進捗確認

```bash
ls app/study/data/*-cards.ts | wc -l
```

生成済みの科目を確認し、未生成の科目リストを作る。

### 2. 科目ごとに @card-generator を呼び出す

各科目について:

```
a) 過去問チャートから過去問データを取得
   URL: https://medical-illustration.club/kakomon-chart/med/tag/tag/{科目名URLエンコード}
   → web_fetchでHTMLを取得→過去問リストを抽出

b) CARD_GENERATION_PIPELINE.md のStep 1-4を実行

c) .tsファイルを app/study/data/{ファイル名}-cards.ts に出力

d) コミット
   git add app/study/data/{ファイル名}-cards.ts
   git commit -m "feat(study): add {科目名} deck ({N} cards, {正答率}%)"
```

### 3. 科目マッピング

| slug (URLエンコード用) | file prefix | id prefix |
|----------------------|-------------|-----------|
| 代謝・内分泌疾患 | taisha | ts |
| 脳・神経疾患 | shinkei | sk |
| 腎臓疾患 | jinzo | jz |
| 血液疾患 | ketsueki | ke |
| 感染症 | kansensho | ks |
| 自己免疫疾患 | meneki | mk |
| アレルギー疾患 | allergy | al |
| 小児科 | shounika | sn |
| 産科 | sanka | sa |
| 婦人科 | fujinka | fj |
| 整形外科 | seikei | sk |
| 泌尿器科 | hinyoki | hn |
| 精神科 | seishin | ss |
| 皮膚科 | hifu | hf |
| 眼科 | ganka | gn |
| 耳鼻咽喉科 | jibi | jb |
| 救急・集中治療 | kyukyu | ky |
| 外科・周術期管理 | geka | gk |
| 放射線科 | hoshasen | hs |
| 麻酔科 | masui | ms |

### 4. Phase終了ごとにpush

```bash
git push origin main
```

### 5. 全完了後にindex.tsを生成

```typescript
// app/study/data/index.ts
export { junkanki_cards } from './junkanki-cards'
export { kokyuki_cards } from './kokyuki-cards'
// ... 全科目
```

## 実行優先順

Phase 1（内科メジャー）→ Phase 2（内科マイナー）→ Phase 3（外科系）→ Phase 4（マイナー）→ Phase 5（横断系）

STUDY_DECK_MASTER_PLAN.md の「推奨実行順序」に従う。
