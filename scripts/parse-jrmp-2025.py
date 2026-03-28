#!/usr/bin/env python3
"""
Parse JRMP 2025 中間公表 + 本番結果 PDFs to calculate honmeiIndex for all programs.
"""
import fitz
import json
import re
import sys

CHUKAN_PDF = '/Users/tasuku/.claude/projects/-Users-tasuku-Desktop-iwor/c03d09f7-f3bb-4c34-b95e-3def7861661b/tool-results/webfetch-1774671731060-92b4id.pdf'
KEKKA_PDF = '/Users/tasuku/.claude/projects/-Users-tasuku-Desktop-iwor/c03d09f7-f3bb-4c34-b95e-3def7861661b/tool-results/webfetch-1774671918030-6r1nsm.pdf'

PREFECTURES = {'北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県','新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県'}

def parse_chukan(pdf_path):
    """Parse 中間公表 PDF: programId -> first_choice_count"""
    doc = fitz.open(pdf_path)
    results = {}
    for page in doc:
        lines = [l.strip() for l in page.get_text().split('\n') if l.strip()]
        i = 0
        while i < len(lines):
            if re.match(r'^03\d{7}$', lines[i]):
                prog_id = lines[i]
                j = i + 1
                # Skip hospital name
                if j < len(lines) and not re.match(r'^\d+$', lines[j]) and lines[j] not in PREFECTURES:
                    j += 1
                # Skip program name (multi-line)
                while j < len(lines) and not re.match(r'^\d+$', lines[j]) and not re.match(r'^03\d{7}$', lines[j]) and lines[j] not in PREFECTURES:
                    j += 1
                # capacity
                cap = None
                if j < len(lines) and re.match(r'^\d+$', lines[j]):
                    cap = int(lines[j]); j += 1
                # first choice
                fc = None
                if j < len(lines) and re.match(r'^\d+$', lines[j]):
                    fc = int(lines[j]); j += 1
                if fc is not None:
                    results[prog_id] = fc
                i = j
            else:
                i += 1
    doc.close()
    return results

def parse_kekka(pdf_path):
    """Parse 本番結果 PDF: programId -> {capacity, matched, vacancy, applicants}"""
    doc = fitz.open(pdf_path)
    results = {}
    for page in doc:
        lines = [l.strip() for l in page.get_text().split('\n') if l.strip()]
        i = 0
        while i < len(lines):
            # Format: "030001801 市立函館病院" (ID + name on same line)
            m = re.match(r'^(03\d{7})\s+(.+)$', lines[i])
            if m:
                prog_id = m.group(1)
                hospital = m.group(2)
                j = i + 1
                # Program name (next line, may span)
                program = ''
                while j < len(lines) and not re.match(r'^\d+', lines[j]) and not re.match(r'^03\d{7}', lines[j]) and lines[j] not in PREFECTURES:
                    program += lines[j]
                    j += 1
                # Numbers: "定員 マッチ者数" on one line, then "空席数" or "応募者数"
                numbers = []
                while j < len(lines):
                    # Try to extract numbers from line
                    nums_in_line = re.findall(r'\d+', lines[j])
                    if nums_in_line and not re.match(r'^03\d{7}', lines[j]) and lines[j] not in PREFECTURES:
                        numbers.extend([int(n) for n in nums_in_line])
                        j += 1
                    else:
                        break
                # Expected: [capacity, matched, vacancy?, applicants]
                # or [capacity, matched] then [applicants] on next line
                if len(numbers) >= 2:
                    capacity = numbers[0]
                    matched = numbers[1]
                    applicants = numbers[-1]  # last number
                    # If capacity == matched and only 2 numbers, applicants is the 2nd... need vacancy
                    # Actually: "11 11" then "36" = cap=11 matched=11 app=36
                    # or "11 11 0 36" = cap matched vacancy app
                    if len(numbers) == 2:
                        # Might be "cap matched" with no separate applicants line
                        applicants = numbers[1]
                    elif len(numbers) == 3:
                        # cap, matched, applicants (vacancy=cap-matched implicit)
                        applicants = numbers[2]
                    elif len(numbers) >= 4:
                        applicants = numbers[3]

                    results[prog_id] = {
                        'hospital': hospital,
                        'program': program,
                        'capacity': capacity,
                        'matched': matched,
                        'applicants': applicants
                    }
                i = j
            else:
                i += 1
    doc.close()
    return results

# Parse
print("Parsing 中間公表 2025...", file=sys.stderr)
chukan = parse_chukan(CHUKAN_PDF)
print(f"  Found {len(chukan)} programs with first-choice data", file=sys.stderr)

print("Parsing 本番結果 2025...", file=sys.stderr)
kekka = parse_kekka(KEKKA_PDF)
print(f"  Found {len(kekka)} programs with results data", file=sys.stderr)

# Calculate honmeiIndex
output = {}
matched_count = 0
for prog_id, k in kekka.items():
    fc = chukan.get(prog_id)
    app = k['applicants']
    if fc is not None and app > 0:
        honmei = round(fc / app, 2)
        matched_count += 1
    else:
        honmei = None
    output[prog_id] = {
        'hospital': k['hospital'],
        'capacity': k['capacity'],
        'matched': k['matched'],
        'applicants': app,
        'first_choice': fc,
        'honmeiIndex': honmei
    }

print(f"  Calculated honmeiIndex for {matched_count} programs", file=sys.stderr)

# Output JSON
print(json.dumps(output, ensure_ascii=False, indent=2))
