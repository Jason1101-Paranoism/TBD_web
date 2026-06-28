#!/usr/bin/env python3
"""
check_meta.py — TBD 知識庫文章 SEO meta 健檢

用法:
    python .claude/skills/tbd-seo-meta/scripts/check_meta.py [路徑]
    路徑可為單一 .mdx 檔或資料夾；省略時預設 src/content/articles。

它檢查的是「中文 SERP 截斷」與「結構完整性」這類可機械驗證的問題，
判讀寬度用「中文字=2、英數/半形=1」的視覺寬度，而非 len() 碼點數——
因為 GitHub/CV/Side Project 這類半形詞只佔中文一半寬，碼點數會誤判。

門檻(全形寬度，非碼點):
    description  理想 150–180、可接受 140–320；<140 偏短(浪費 SERP 摘要)、>330 會被截
    seoTitle     >62 桌機會被截(含「｜TBD Studio」約 13 寬)
退出碼 1 代表有「會被截斷 / 結構錯誤」等需處理的問題。
"""
import sys, re, glob, os

# Windows 主控台預設 cp1252，印中文會炸；強制 UTF-8 輸出。
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

def width(s: str) -> int:
    """視覺寬度：中文等寬字元算 2，其餘算 1。"""
    return sum(2 if ord(c) > 0x2E80 else 1 for c in s)

def field(fm: str, key: str):
    m = re.search(r'^' + key + r':\s*(.+)$', fm, re.M)
    return m.group(1).strip().strip('"').strip("'") if m else None

# 收尾的 ** 前面是標點、後面接非標點中文字 → CommonMark flanking 失敗，粗體不會生效
BOLD_TRAP = re.compile(r'[）)」』】》\]]\*\*[一-鿿]')

def check_file(path: str):
    issues, warns = [], []
    with open(path, encoding='utf-8') as f:
        text = f.read()
    name = os.path.basename(path)
    parts = text.split('---', 2)
    fm = parts[1] if len(parts) >= 3 else ''
    body = parts[2] if len(parts) >= 3 else text

    title = field(fm, 'title')
    seo = field(fm, 'seoTitle')
    desc = field(fm, 'description')
    pub = field(fm, 'publishDate')

    # description
    if not desc:
        issues.append('缺 description')
    else:
        w = width(desc)
        if w > 330:
            issues.append(f'description 過長(寬{w})會被截，建議 ≤320')
        elif w < 140:
            warns.append(f'description 偏短(寬{w})，建議補到 150–180 填滿摘要')
        if re.search(r'[一-鿿],', desc) or re.search(r'[一-鿿]\.(\s|$)', desc):
            warns.append('description 疑似用了半形逗號/句號，中文內文請用全形')

    # seoTitle（沒寫 seoTitle 時 SERP 用 title）
    eff = seo or title
    if eff and width(eff) > 62:
        kind = 'seoTitle' if seo else 'title(無 seoTitle)'
        issues.append(f'{kind} 過長(寬{width(eff)})桌機會被截，建議 ≤62')

    # publishDate（schema 必填；datePublished 來源）
    if not pub:
        issues.append('缺 publishDate（schema 必填，會導致 build 失敗）')
    elif not re.match(r'^\d{4}-\d{2}-\d{2}$', pub):
        warns.append(f'publishDate 格式異常：{pub}（建議 YYYY-MM-DD）')

    # CJK 粗體 flanking 陷阱
    for i, line in enumerate(body.split('\n'), 1):
        if BOLD_TRAP.search(line):
            issues.append(f'第 {i} 行有 CJK 粗體陷阱（`）**字` 之類，粗體不會生效）：{line.strip()[:50]}')

    return name, issues, warns

def main():
    arg = sys.argv[1] if len(sys.argv) > 1 else 'src/content/articles'
    if os.path.isdir(arg):
        files = sorted(glob.glob(os.path.join(arg, '*.mdx')))
    else:
        files = [arg]

    total_issues = 0
    clean = 0
    for p in files:
        name, issues, warns = check_file(p)
        if issues or warns:
            print(f'\n=== {name} ===')
            for x in issues:
                print(f'  ❌ {x}')
            for x in warns:
                print(f'  ⚠️  {x}')
            total_issues += len(issues)
        else:
            clean += 1

    print(f'\n────────\n檢查 {len(files)} 篇：{clean} 篇乾淨，{total_issues} 個需處理問題（❌）。')
    sys.exit(1 if total_issues else 0)

if __name__ == '__main__':
    main()
