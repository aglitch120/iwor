#!/usr/bin/env python3
"""
rebuild-hospital-data.py — JRMP公式PDFから全病院データを再生成
2021-2025年度の結果PDF + 中間公表PDFをパースし、hospitals-data.tsを更新

使用法: python3 scripts/rebuild-hospital-data.py
"""
import fitz
import json
import re
import sys
import math
from collections import defaultdict

PDF_DIR = '/tmp/jrmp_pdfs'
YEARS = [2021, 2022, 2023, 2024, 2025]

PREFECTURES = {'北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
  '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
  '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県',
  '滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県',
  '鳥取県','島根県','岡山県','広島県','山口県',
  '徳島県','香川県','愛媛県','高知県',
  '福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県'}

# ──────────────────────────────────────────
#  結果PDF パーサー（定員・マッチ者数・空席数・志望者数）
# ──────────────────────────────────────────
def parse_kekka(pdf_path):
    """結果PDFをパース。programId → {hospital, program, prefecture, capacity, matched, vacancy, applicants}"""
    doc = fitz.open(pdf_path)
    results = {}

    for page in doc:
        text = page.get_text()
        lines = [l.strip() for l in text.split('\n') if l.strip()]

        # ページ番号パターンを除去 (例: "1 / 50", "50 / 50")
        lines = [l for l in lines if not re.match(r'^\d+\s*/\s*\d+\s*$', l)]
        # ヘッダー行を除去
        lines = [l for l in lines if l not in ('都', '道', '府', '県', 'プログラム', '番号',
                  '病院名称', 'プログラム名称', '定', '員', 'マ', 'ッ', 'チ', '者', '数',
                  '空', '席', '当', '該', 'プ', 'ロ', 'グ', 'ラ', 'ム', 'を', '希', '望',
                  '順', '位', '登', '録', 'し', 'た', '学', '生')]
        # 注釈行を除去
        lines = [l for l in lines if not l.startswith('※') and not l.startswith('令和')]

        current_pref = None
        i = 0
        while i < len(lines):
            line = lines[i]

            # 都道府県の検出
            if line in PREFECTURES:
                current_pref = line
                i += 1
                continue

            # プログラム番号の検出
            # パターン: "030001801 市立函館病院" or "都道府県030001801 病院名"
            m = re.match(r'^(0[0-9]\d{7})\s*(.*)', line)
            if not m:
                # 県名がプログラム番号と同じ行に連結しているケース
                m2 = re.match(r'^.+?(0[0-9]\d{7})\s*(.*)', line)
                if m2 and any(line.startswith(p) for p in PREFECTURES):
                    # 県名を抽出してからIDを処理
                    for p in sorted(PREFECTURES, key=len, reverse=True):
                        if line.startswith(p):
                            current_pref = p
                            break
                    m = m2
            if m:
                prog_id = m.group(1)
                hospital = m.group(2).strip()
                i += 1

                # 病院名が同じ行にない場合
                if not hospital and i < len(lines) and not re.match(r'^\d', lines[i]) and lines[i] not in PREFECTURES:
                    hospital = lines[i]
                    i += 1

                # プログラム名（数字が出るまでスキップ）
                program = ''
                while i < len(lines):
                    if re.match(r'^0[0-9]\d{7}', lines[i]) or lines[i] in PREFECTURES:
                        break
                    # 数字のみの行 or "数字 数字"の行 → データ部分
                    if re.match(r'^\d+(\s+\d+)*$', lines[i]):
                        break
                    program += lines[i]
                    i += 1

                # 数値の収集（定員・マッチ者数・空席数・志望者数）
                numbers = []
                while i < len(lines) and len(numbers) < 6:
                    cur = lines[i]
                    if re.match(r'^0[0-9]\d{7}', cur) or cur in PREFECTURES:
                        break
                    # 県名+IDの連結パターンも停止
                    if any(cur.startswith(p) for p in PREFECTURES) and re.search(r'0[0-9]\d{7}', cur):
                        break
                    # ページ番号パターン "X / Y" を除外
                    if re.match(r'^\d+\s*/\s*\d+', cur):
                        i += 1
                        continue
                    nums_in_line = re.findall(r'\d+', cur)
                    if nums_in_line and not re.match(r'^0[0-9]\d{7}', cur):
                        # 年度っぽい数値(2020-2030)やプログラムID(9桁)を除外
                        valid_nums = [int(n) for n in nums_in_line if not (2020 <= int(n) <= 2030) and len(n) < 7]
                        if valid_nums:
                            numbers.extend(valid_nums)
                            i += 1
                        else:
                            break
                    else:
                        break

                # 数値の解釈
                capacity = matched = vacancy = applicants = 0
                if len(numbers) >= 4:
                    capacity, matched, vacancy, applicants = numbers[0], numbers[1], numbers[2], numbers[3]
                elif len(numbers) == 3:
                    capacity, matched = numbers[0], numbers[1]
                    # 3番目が空席か志望者かの判定
                    diff = capacity - matched
                    if numbers[2] == diff and diff > 0:
                        # 空席数 = capacity - matched → 志望者数なし
                        vacancy = numbers[2]
                        applicants = 0
                    else:
                        # 空席なし（capacity==matched）→ 3番目は志望者数
                        vacancy = capacity - matched
                        applicants = numbers[2]
                elif len(numbers) == 2:
                    capacity, matched = numbers[0], numbers[1]
                    vacancy = capacity - matched
                    applicants = 0
                elif len(numbers) == 1:
                    capacity = numbers[0]
                    matched = 0
                    vacancy = capacity

                # vacancyの自動計算（整合性チェック）
                expected_vacancy = capacity - matched
                if expected_vacancy >= 0:
                    vacancy = expected_vacancy

                results[prog_id] = {
                    'hospital': hospital,
                    'program': program,
                    'prefecture': current_pref or '',
                    'capacity': capacity,
                    'matched': matched,
                    'vacancy': vacancy,
                    'applicants': applicants,
                }
            else:
                i += 1

    doc.close()
    return results

# ──────────────────────────────────────────
#  中間公表PDF パーサー（第1希望者数）
# ──────────────────────────────────────────
def parse_chukan(pdf_path):
    """中間公表PDFをパース。programId → {capacity, first_choice}"""
    doc = fitz.open(pdf_path)
    results = {}

    for page in doc:
        text = page.get_text()
        lines = [l.strip() for l in text.split('\n') if l.strip()]

        i = 0
        while i < len(lines):
            line = lines[i]

            # プログラム番号
            m = re.match(r'^(0[0-9]\d{7})$', line)
            if m:
                prog_id = m.group(1)
                i += 1

                # 病院名・プログラム名をスキップ（数字が出るまで）
                while i < len(lines):
                    if re.match(r'^0[0-9]\d{7}$', lines[i]) or lines[i] in PREFECTURES:
                        break
                    if re.match(r'^\d+$', lines[i]) and int(lines[i]) < 2000:
                        break
                    i += 1

                # 数値: 定員, 第1希望者数
                numbers = []
                while i < len(lines) and len(numbers) < 2:
                    if re.match(r'^0[0-9]\d{7}$', lines[i]) or lines[i] in PREFECTURES:
                        break
                    if re.match(r'^\d+$', lines[i]) and int(lines[i]) < 2000:
                        numbers.append(int(lines[i]))
                        i += 1
                    else:
                        break

                if len(numbers) >= 2:
                    results[prog_id] = {'capacity': numbers[0], 'first_choice': numbers[1]}
                elif len(numbers) == 1:
                    # 定員のみ（第1希望0人）
                    results[prog_id] = {'capacity': numbers[0], 'first_choice': 0}
            else:
                i += 1

    doc.close()
    return results


# ──────────────────────────────────────────
#  メイン処理
# ──────────────────────────────────────────
def main():
    all_years = {}  # year -> {prog_id -> data}

    for year in YEARS:
        kekka_path = f'{PDF_DIR}/{year}kekka.pdf'
        chukan_path = f'{PDF_DIR}/{year}chukan.pdf'

        print(f'\n=== {year}年度 ===', file=sys.stderr)
        kekka = parse_kekka(kekka_path)
        chukan = parse_chukan(chukan_path)
        print(f'  結果: {len(kekka)}プログラム', file=sys.stderr)
        print(f'  中間: {len(chukan)}プログラム', file=sys.stderr)

        # マージ
        merged = {}
        for pid, k in kekka.items():
            fc = chukan.get(pid, {}).get('first_choice')
            merged[pid] = {**k, 'first_choice': fc}

        all_years[year] = merged

    # 最新年(2025)をベースに病院リストを構築
    latest = all_years[2025]
    print(f'\n=== 2025年度ベース: {len(latest)}プログラム ===', file=sys.stderr)

    # 検証: 既知の病院をスポットチェック
    spot_checks = {
        '030001801': ('市立函館病院', 11, 11, 36, 15),  # cap, matched, app, fc
        '030241004': ('武蔵野赤十字病院', 10, 10, 108, 60),
        '030210108': ('山手メディカル', 8, 8, 46, 5),
    }
    print('\n=== スポットチェック ===', file=sys.stderr)
    for pid, (name, exp_cap, exp_matched, exp_app, exp_fc) in spot_checks.items():
        d = latest.get(pid, {})
        ok = True
        issues = []
        if d.get('capacity') != exp_cap: issues.append(f'cap: {d.get("capacity")} vs {exp_cap}')
        if d.get('matched') != exp_matched: issues.append(f'matched: {d.get("matched")} vs {exp_matched}')
        if d.get('applicants') != exp_app: issues.append(f'app: {d.get("applicants")} vs {exp_app}')
        if d.get('first_choice') != exp_fc: issues.append(f'fc: {d.get("first_choice")} vs {exp_fc}')
        status = '✅' if not issues else '❌ ' + ', '.join(issues)
        print(f'  {name}: {status}', file=sys.stderr)

    # JSON出力
    output = {
        'years': {},
        'latest': latest,
    }
    for year in YEARS:
        output['years'][year] = all_years[year]

    json.dump(output, sys.stdout, ensure_ascii=False, indent=2)
    print(f'\n✅ 全{sum(len(v) for v in all_years.values())}レコード出力', file=sys.stderr)

if __name__ == '__main__':
    main()
