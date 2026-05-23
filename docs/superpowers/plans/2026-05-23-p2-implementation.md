# TBD Studio P2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增知識庫（/resources/）系統、為 LINE CTA 加 UTM tracking、強化 build.py 部署檢查。

**Architecture:** 知識庫採子目錄結構（`src/pages/resources/`），build.py 新增子目錄掃描支援。CTA tracking 直接修改 src/pages 內的 LINE href。部署檢查作為 build.py main() 的後處理步驟。

**Tech Stack:** Python（build.py 擴充）、HTML + Tailwind CDN + 自訂 CSS（現有 stack）

---

## 檔案結構

```
新增：
src/pages/resources/index.html          ← 知識庫列表頁（模板）
src/pages/resources/article-template.html ← 文章頁模板

修改：
src/config.json                          ← 加入 resources 頁、nav 更新
build.py                                 ← 子目錄掃描 + 部署檢查

修改 CTA（src/pages/）：
src/pages/home.html                      ← home-contact UTM
src/pages/cases.html                     ← cases UTM（改 index.html#contact → LINE 直連）
src/pages/services.html                  ← services UTM（改 index.html#contact → LINE 直連）
src/pages/portfolio-guide.html           ← portfolio-guide UTM
src/pages/process.html                   ← process UTM（改 index.html#contact → LINE 直連）

build 產物（python build.py 後自動產生）：
pages/resources/index.html
pages/resources/article-template.html
sitemap.xml                              ← 新增，build 自動產生
```

---

## Task 1：build.py 支援子目錄 + 三項部署檢查

**Files:**
- Modify: `build.py`

背景：目前 build.py 只掃 `src/config.json` 裡的 pages 陣列，不支援子目錄。新增 `build_subdir_pages()` 函式掃 `src/pages/*/` 子目錄，並新增 `check_descriptions()`、`check_broken_links()`、`generate_sitemap()` 三個後處理函式。

- [ ] **Step 1：新增 `build_subdir_pages()`**

在 `build.py` 的 `main()` 之前加入：

```python
def build_subdir_pages():
    """Scan src/pages/*/ subdirectories and build each HTML file found."""
    pages_src = SRC / "pages"
    built = 0
    for subdir in sorted(pages_src.iterdir()):
        if not subdir.is_dir():
            continue
        for html_file in sorted(subdir.glob("*.html")):
            rel_source = f"{subdir.name}/{html_file.name}"
            output = f"pages/{subdir.name}/{html_file.name}"
            page = {
                "id": f"{subdir.name}-{html_file.stem}",
                "title": f"TBD Studio | {html_file.stem.replace('-', ' ').title()}",
                "description": "",
                "source": rel_source,
                "output": output,
                "body_class": "sub-page",
            }
            render_page(page)
            built += 1
    return built
```

- [ ] **Step 2：新增 `generate_sitemap()`**

```python
def generate_sitemap():
    """Generate sitemap.xml from config pages + subdirectory pages."""
    from datetime import date
    site_url = CONFIG["site"].get("site_url", "").rstrip("/")
    today = date.today().isoformat()
    urls = []
    for page in CONFIG["pages"]:
        output = page["output"]
        loc = f"{site_url}/{output}"
        urls.append(f"  <url><loc>{loc}</loc><lastmod>{today}</lastmod></url>")
    pages_dir = ROOT / "pages"
    for subpage in sorted(pages_dir.glob("*/*.html")):
        rel = subpage.relative_to(ROOT).as_posix()
        loc = f"{site_url}/{rel}"
        urls.append(f"  <url><loc>{loc}</loc><lastmod>{today}</lastmod></url>")
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    xml += "\n".join(urls)
    xml += "\n</urlset>\n"
    save(ROOT / "sitemap.xml", xml)
    print(f"Generated sitemap.xml with {len(urls)} URLs.")
```

- [ ] **Step 3：新增 `check_descriptions()`**

```python
def check_descriptions():
    """Warn if any config page is missing a description."""
    warnings = 0
    for page in CONFIG["pages"]:
        if not page.get("description", "").strip():
            print(f"[WARN] missing description: {page['output']}")
            warnings += 1
    return warnings
```

- [ ] **Step 4：新增 `check_broken_links()`**

```python
def check_broken_links():
    """Warn about internal hrefs that point to non-existent files."""
    import re
    pattern = re.compile(r'href="([^"#?]+)"')
    skip_prefixes = ("http", "mailto:", "tel:", "//", "#")
    warnings = 0
    for html_file in sorted(ROOT.glob("pages/**/*.html")) + [ROOT / "index.html"]:
        if not html_file.exists():
            continue
        content = html_file.read_text(encoding="utf-8")
        for href in pattern.findall(content):
            if any(href.startswith(p) for p in skip_prefixes):
                continue
            target = (html_file.parent / href).resolve()
            if not target.exists():
                print(f"[WARN] broken link in {html_file.relative_to(ROOT)}: {href}")
                warnings += 1
    return warnings
```

- [ ] **Step 5：更新 `main()` 整合所有新函式**

將 `main()` 替換為：

```python
def main():
    for page in CONFIG["pages"]:
        render_page(page)
    print(f"Built {len(CONFIG['pages'])} pages.")

    sub_built = build_subdir_pages()
    if sub_built:
        print(f"Built {sub_built} subdir pages.")

    generate_sitemap()

    warn_count = check_descriptions() + check_broken_links()
    if warn_count:
        print(f"{warn_count} warning(s) found.")
    else:
        print("All checks passed.")
```

- [ ] **Step 6：執行 build 確認現有頁面仍正常產生**

```bash
python build.py
```

預期輸出（無 resources 頁尚未建立）：
```
Built 9 pages.
Generated sitemap.xml with N URLs.
All checks passed.
```

- [ ] **Step 7：Commit**

```bash
git add build.py
git commit -m "feat(build): add subdir page support, sitemap, link/desc checks"
```

---

## Task 2：config.json 加入 resources 頁面與 nav 項目

**Files:**
- Modify: `src/config.json`

- [ ] **Step 1：在 `nav` 陣列末尾加入知識庫**

在 `"id": "process"` 的 nav 物件後方加入：

```json
{
  "id": "resources",
  "label": "知識庫",
  "href": "pages/resources/index.html"
}
```

- [ ] **Step 2：在 `pages` 陣列加入 resources 頁面**

在 `process` 頁面物件後方加入：

```json
{
  "id": "resources",
  "title": "升學知識庫｜TBD Studio",
  "description": "TBD Studio 升學知識文章：備審撰寫、特殊選才準備、面試技巧與 Portfolio 建置指南。",
  "source": "resources/index.html",
  "output": "pages/resources/index.html",
  "body_class": "sub-page resources-page"
},
{
  "id": "resources-article-template",
  "title": "文章標題｜TBD Studio",
  "description": "TBD Studio 升學知識文章。",
  "source": "resources/article-template.html",
  "output": "pages/resources/article-template.html",
  "body_class": "sub-page article-page"
}
```

- [ ] **Step 3：Commit**

```bash
git add src/config.json
git commit -m "feat(config): add resources pages and nav entry"
```

---

## Task 3：建立知識庫列表頁 `src/pages/resources/index.html`

**Files:**
- Create: `src/pages/resources/index.html`

- [ ] **Step 1：建立 `src/pages/resources/` 目錄並新增 `index.html`**

```bash
mkdir src\pages\resources
```

建立 `src/pages/resources/index.html`，內容如下（這是頁面 fragment，不含 nav/footer）：

```html
<section class="hero">
  <span class="kicker">TBD Studio 知識庫</span>
  <h1>升學路上，你需要知道的事。</h1>
  <p class="lead">彙整備審撰寫、特殊選才、面試準備與 Portfolio 建置的核心觀念，幫助你做出更清楚的準備決策。</p>
</section>

<main>
  <section class="section">
    <div class="card-grid">

      <article class="card article-card">
        <span class="badge">備審</span>
        <h2>備審怎麼寫</h2>
        <p class="card-desc">從素材盤點、主線設計到文件撰寫，系統拆解備審製作的每個關鍵環節。</p>
        <span class="article-status">即將上線</span>
      </article>

      <article class="card article-card">
        <span class="badge">特殊選才</span>
        <h2>特殊選才怎麼準備</h2>
        <p class="card-desc">了解特殊選才的審查邏輯，以及如何把跨域經歷轉化成評審看得懂的申請主線。</p>
        <span class="article-status">即將上線</span>
      </article>

      <article class="card article-card">
        <span class="badge">面試</span>
        <h2>面試常見問題</h2>
        <p class="card-desc">整理面試中最常被問到的題型，以及如何設計有結構、有故事性的回答。</p>
        <span class="article-status">即將上線</span>
      </article>

      <article class="card article-card">
        <span class="badge">Portfolio</span>
        <h2>Portfolio 建置指南</h2>
        <p class="card-desc">高中生 Portfolio 的結構、視覺與選材邏輯，搭配具體範本與 prompt 工具。</p>
        <a class="text-link" href="../../pages/portfolio-guide.html">前往完整指南 →</a>
      </article>

    </div>
  </section>

  <section class="section cta">
    <h2>準備開始，但不知道從哪裡切入？</h2>
    <p>預約一次策略諮詢，讓我們幫你判斷目前最值得投入的方向。</p>
    <a class="button" href="https://lin.ee/9ciZvbA?utm_source=website&utm_medium=cta&utm_campaign=resources" target="_blank" rel="noopener noreferrer">加 LINE 預約策略諮詢</a>
  </section>
</main>
```

- [ ] **Step 2：執行 build 確認列表頁產生**

```bash
python build.py
```

確認 `pages/resources/index.html` 已產生，用瀏覽器開啟確認 nav、footer 正常，知識庫在 nav 為 active 狀態。

- [ ] **Step 3：Commit**

```bash
git add src/pages/resources/index.html pages/resources/index.html
git commit -m "feat(resources): add knowledge base listing page"
```

---

## Task 4：建立文章模板 `src/pages/resources/article-template.html`

**Files:**
- Create: `src/pages/resources/article-template.html`

- [ ] **Step 1：建立 `src/pages/resources/article-template.html`**

```html
<section class="hero article-hero">
  <nav class="breadcrumb">
    <a href="../../index.html">首頁</a>
    <span>›</span>
    <a href="../../pages/resources/index.html">知識庫</a>
    <span>›</span>
    <span>文章標題</span>
  </nav>
  <span class="kicker">分類標籤</span>
  <h1>文章主標題</h1>
  <p class="lead">文章摘要說明，一到兩句話說明這篇文章的核心內容與讀者對象。</p>
</section>

<main>
  <div class="article-layout">

    <!-- 主要內容 -->
    <article class="article-body">

      <section class="article-section">
        <h2>第一段標題</h2>
        <p>文章段落內容。這裡是第一個主要段落，說明核心概念或背景。</p>
      </section>

      <section class="article-section">
        <h2>第二段標題</h2>
        <p>文章段落內容。這裡是第二個主要段落，提供具體方法或步驟說明。</p>
        <ul>
          <li>重點項目一</li>
          <li>重點項目二</li>
          <li>重點項目三</li>
        </ul>
      </section>

      <section class="article-section">
        <h2>第三段標題</h2>
        <p>文章段落內容。可以是案例說明、常見錯誤或延伸建議。</p>
      </section>

    </article>

    <!-- 側欄 -->
    <aside class="article-sidebar">

      <div class="sidebar-toc card">
        <h3>本文目錄</h3>
        <ul>
          <li><a href="#section-1">第一段標題</a></li>
          <li><a href="#section-2">第二段標題</a></li>
          <li><a href="#section-3">第三段標題</a></li>
        </ul>
      </div>

      <div class="sidebar-cta card">
        <p>準備好了，但不確定下一步？</p>
        <a class="button" href="https://lin.ee/9ciZvbA?utm_source=website&utm_medium=cta&utm_campaign=resources-article" target="_blank" rel="noopener noreferrer">預約策略諮詢</a>
      </div>

    </aside>

  </div>

  <!-- 相關文章 -->
  <section class="section">
    <h2>其他知識庫文章</h2>
    <div class="card-grid">
      <article class="card article-card">
        <span class="badge">備審</span>
        <h3>備審怎麼寫</h3>
        <span class="article-status">即將上線</span>
      </article>
      <article class="card article-card">
        <span class="badge">特殊選才</span>
        <h3>特殊選才怎麼準備</h3>
        <span class="article-status">即將上線</span>
      </article>
      <article class="card article-card">
        <span class="badge">面試</span>
        <h3>面試常見問題</h3>
        <span class="article-status">即將上線</span>
      </article>
    </div>
  </section>
</main>
```

- [ ] **Step 2：執行 build 確認模板頁產生**

```bash
python build.py
```

確認 `pages/resources/article-template.html` 已產生，用瀏覽器開啟確認結構正確。

- [ ] **Step 3：Commit**

```bash
git add src/pages/resources/article-template.html pages/resources/article-template.html
git commit -m "feat(resources): add article page template"
```

---

## Task 5：加入文章版面 CSS

**Files:**
- Modify: `css/tbd-pages.css`

知識庫頁面需要：`.article-layout`（sidebar 排版）、`.article-card`、`.article-status`、`.breadcrumb`、`.article-sidebar`。

- [ ] **Step 1：在 `css/tbd-pages.css` 末尾加入**

```css
/* ── Resources / Knowledge Base ── */
.article-card { display: flex; flex-direction: column; gap: 0.5rem; }
.article-card .card-desc { color: var(--color-mid); font-size: 0.9rem; flex: 1; }
.article-status { display: inline-block; font-size: 0.75rem; font-weight: 600; color: var(--color-mid); background: var(--color-light); padding: 0.2rem 0.6rem; border-radius: 999px; width: fit-content; }

.breadcrumb { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: var(--color-mid); margin-bottom: 1rem; }
.breadcrumb a { color: var(--color-mid); text-decoration: none; }
.breadcrumb a:hover { color: var(--color-accent); }

.article-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; }
@media (min-width: 1024px) {
  .article-layout { grid-template-columns: 1fr 280px; align-items: start; }
}

.article-body { max-width: 100%; }
.article-section { margin-bottom: 2.5rem; }
.article-section h2 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--color-dark); }
.article-section p, .article-section ul { color: var(--color-mid); line-height: 1.75; }
.article-section ul { padding-left: 1.25rem; }
.article-section li { margin-bottom: 0.4rem; }

.article-sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
.sidebar-toc h3 { font-size: 0.9rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--color-dark); }
.sidebar-toc ul { list-style: none; padding: 0; }
.sidebar-toc li { margin-bottom: 0.4rem; }
.sidebar-toc a { font-size: 0.875rem; color: var(--color-mid); text-decoration: none; }
.sidebar-toc a:hover { color: var(--color-accent); }
.sidebar-cta { text-align: center; }
.sidebar-cta p { font-size: 0.875rem; color: var(--color-mid); margin-bottom: 1rem; }
.sidebar-cta .button { width: 100%; text-align: center; }
```

- [ ] **Step 2：瀏覽器確認樣式**

開啟 `pages/resources/index.html` 與 `pages/resources/article-template.html`，確認：
- 卡片正常排列、「即將上線」badge 顯示
- 文章模板的 sidebar 在桌面版（1024px+）變成雙欄

- [ ] **Step 3：Commit**

```bash
git add css/tbd-pages.css
git commit -m "feat(css): add knowledge base and article layout styles"
```

---

## Task 6：CTA Tracking — 加入 UTM 參數

**Files:**
- Modify: `src/pages/home.html`
- Modify: `src/pages/cases.html`
- Modify: `src/pages/services.html`
- Modify: `src/pages/portfolio-guide.html`
- Modify: `src/pages/process.html`

背景：home.html 和 portfolio-guide.html 已有直接 LINE 連結，加 UTM。cases.html / services.html / process.html 目前使用 `index.html#contact` 錨點，改為直接 LINE 連結並加 UTM，以取得更精確的頁面來源追蹤。

- [ ] **Step 1：`home.html` 加 UTM（home-contact，line 357）**

在 `src/pages/home.html` 第 357 行，將：
```html
<a href="https://lin.ee/9ciZvbA"
```
改為：
```html
<a href="https://lin.ee/9ciZvbA?utm_source=website&utm_medium=cta&utm_campaign=home-contact"
```

- [ ] **Step 2：`cases.html` 改為直接 LINE 連結並加 UTM**

`src/pages/cases.html` 有兩處 `href="../index.html#contact"`，全部改為：
```html
href="https://lin.ee/9ciZvbA?utm_source=website&utm_medium=cta&utm_campaign=cases"
```
同時在 `<a>` 標籤加上 `target="_blank" rel="noopener noreferrer"`。

- [ ] **Step 3：`services.html` 改為直接 LINE 連結並加 UTM**

`src/pages/services.html` 有兩處 `href="../index.html#contact"`，全部改為：
```html
href="https://lin.ee/9ciZvbA?utm_source=website&utm_medium=cta&utm_campaign=services"
```
同時加上 `target="_blank" rel="noopener noreferrer"`。

- [ ] **Step 4：`portfolio-guide.html` 加 UTM（line 675）**

將：
```html
href="https://lin.ee/9ciZvbA"
```
改為：
```html
href="https://lin.ee/9ciZvbA?utm_source=website&utm_medium=cta&utm_campaign=portfolio-guide"
```

- [ ] **Step 5：`process.html` 的 CTA 區塊加直接 LINE 連結**

`src/pages/process.html` 的 CTA section（約 20–23 行）目前無 LINE 連結。在「LINE 官方帳號可用的初步提問」下方加入按鈕：

```html
<a class="button" href="https://lin.ee/9ciZvbA?utm_source=website&utm_medium=cta&utm_campaign=process" target="_blank" rel="noopener noreferrer">加 LINE 預約初談</a>
```

- [ ] **Step 6：執行 build 並確認連結**

```bash
python build.py
```

在 `pages/cases.html`、`pages/services.html`、`pages/process.html` 中搜尋 `lin.ee` 確認 UTM 已正確注入。

- [ ] **Step 7：Commit**

```bash
git add src/pages/home.html src/pages/cases.html src/pages/services.html src/pages/portfolio-guide.html src/pages/process.html
git commit -m "feat(tracking): add UTM params to LINE CTA links across all pages"
```

---

## Task 7：最終驗收

- [ ] **Step 1：完整 build**

```bash
python build.py
```

預期輸出包含：
```
Built 11 pages.
Built 2 subdir pages.
Generated sitemap.xml with N URLs.
All checks passed.
```

- [ ] **Step 2：確認 sitemap.xml**

開啟 `sitemap.xml`，確認包含 `pages/resources/index.html` 與 `pages/resources/article-template.html`。

- [ ] **Step 3：瀏覽器測試清單**

桌面（1280px）與手機（375px）各確認：
1. `index.html` — nav 顯示「知識庫」項目，home-contact CTA 含 UTM
2. `pages/resources/index.html` — nav active 為「知識庫」，4 張卡片顯示正常
3. `pages/resources/article-template.html` — 麵包屑、sidebar、相關文章正常
4. `pages/cases.html` — CTA 按鈕連結含 `utm_campaign=cases`
5. `pages/services.html` — CTA 按鈕連結含 `utm_campaign=services`
6. `pages/process.html` — CTA 按鈕連結含 `utm_campaign=process`

- [ ] **Step 4：Commit**

```bash
git add sitemap.xml
git commit -m "chore: final build artifacts for P2"
```
