# P0 Site Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完成四項 P0 優先任務：navbar 收斂、首頁 H1 改寫、主圖本地化、補 OG metadata。

**Architecture:** 純靜態 HTML template 系統。維護來源在 `src/`，build 產物在 `pages/` 與根目錄。所有修改改 `src/`，改完執行 `python build.py`。`pages/portfolio-guide.html` 為例外，需手動同步。

**Tech Stack:** Python build.py、HTML、Tailwind CDN、CSS

---

## 檔案異動總覽

| 檔案 | 類型 | 任務 |
|------|------|------|
| `src/config.json` | 修改 | T1 nav 收斂、T4 OG metadata |
| `src/pages/home.html` | 修改 | T2 H1 改寫、T3 主圖本地化 |
| `src/partials/head.html` | 修改 | T4 OG/Twitter card tags |
| `build.py` | 修改 | T4 傳遞 og_image、site_url 到 head context |
| `assets/images/` | 建立 | T3 主圖本地資產目錄（需手動放圖） |
| `pages/portfolio-guide.html` | 手動同步 | T1 nav 收斂後同步 |
| `src/pages/portfolio-guide.html` | 手動同步 | T1 nav 收斂後同步 |

---

## Task 1: Navbar 收斂（9 項 → 6 項）

**Files:**
- Modify: `src/config.json` (nav array)
- Manual sync: `src/pages/portfolio-guide.html` 與 `pages/portfolio-guide.html`

### 說明
從 9 個 nav 項目收斂為 6 個：

| 保留 | 移除 |
|------|------|
| 官方首頁 | 服務總覽 (overview) |
| 成功案例 | 適合對象 (audience) |
| 服務內容（原服務項目，label 改名） | 服務方案 (plans) |
| Portfolio 指南 | |
| 申請時程 | |
| 合作流程 | |

- [ ] **Step 1: 修改 `src/config.json` nav 陣列**

將 nav 替換為以下 6 項（`services` 的 label 從「服務項目」改為「服務內容」）：

```json
"nav": [
  { "id": "home",            "label": "官方首頁",      "href": "index.html" },
  { "id": "cases",           "label": "成功案例",      "href": "pages/cases.html" },
  { "id": "services",        "label": "服務內容",      "href": "pages/services.html" },
  { "id": "portfolio-guide", "label": "Portfolio 指南","href": "pages/portfolio-guide.html" },
  { "id": "timeline",        "label": "申請時程",      "href": "pages/timeline.html" },
  { "id": "process",         "label": "合作流程",      "href": "pages/process.html" }
]
```

- [ ] **Step 2: 執行 build.py**

```bash
python build.py
```

預期輸出：`Built 9 pages.`

- [ ] **Step 3: 同步 portfolio-guide.html（手動，兩份都改）**

在 `src/pages/portfolio-guide.html` 與 `pages/portfolio-guide.html` 中找到 nav 的 `<a>` 連結區塊，手動移除以下三個連結（exact match 找到並刪除整行）：

移除（desktop nav 與 mobile nav 各一組，共移除 6 行）：
- 含 `服務總覽` / `pages/index.html` 的 `<a>`
- 含 `適合對象` / `audience.html` 的 `<a>`
- 含 `服務方案` / `plans.html` 的 `<a>`

並將含 `服務項目` 的 `<a>` 的文字改為 `服務內容`。

- [ ] **Step 4: 驗證**

開啟 `index.html` 於瀏覽器，確認 navbar 只有 6 項。  
開啟 `pages/portfolio-guide.html`，確認 navbar 同樣只有 6 項。

---

## Task 2: 首頁 H1 改寫

**Files:**
- Modify: `src/pages/home.html`

- [ ] **Step 1: 修改 `src/pages/home.html` 的 H1 與副標**

找到目前 H1（第 21–24 行附近）：

```html
<h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-relaxed text-tbd-dark">
  Define, Design, Deliver <br>
  <span class="text-tbd-accent">Your Next Move</span>
</h1>
```

替換為：

```html
<h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-snug text-tbd-dark">
  把零散經歷，<br>
  整理成教授<span class="text-tbd-accent">看得懂的申請策略</span>
</h1>
```

找到目前 H2（第 26–29 行附近）：

```html
<h2 class="text-lg sm:text-xl lg:text-2xl text-tbd-mid font-medium">
  在多元的升學選擇中建立清晰航線，
  <span class="hidden sm:inline"><br></span>
  讓孩子成長的每一步都能穩穩實現。
</h2>
```

替換為：

```html
<h2 class="text-base sm:text-lg lg:text-xl text-tbd-mid font-medium leading-relaxed">
  TBD Studio 協助學生完成方向判斷、備審重構、面試訓練與 Portfolio 主線整理，<br class="hidden sm:block">
  讓每一步準備都可追蹤、可驗收。
</h2>
```

並在 Badge 區塊（`<div class="inline-flex...">` 內）加入 slogan 作為副標識：

```html
<p class="mt-1 text-xs text-tbd-mid/70 font-mono tracking-wider">Define, Design, Deliver Your Next Move.</p>
```

放在 badge `<div>` 下方（badge 閉合 `</div>` 之後、H1 之前）。

- [ ] **Step 2: 執行 build.py**

```bash
python build.py
```

- [ ] **Step 3: 驗證**

開啟 `index.html`，確認首頁 H1 是「把零散經歷，整理成教授看得懂的申請策略」，副標文案已更新。

---

## Task 3: 主圖改本地資產

**Files:**
- Create: `assets/images/` 目錄
- Modify: `src/pages/home.html`

### 前置條件（手動）

> 此步驟需要使用者手動完成：將 hero 主圖儲存至 `assets/images/tbd-landing-banner.png`（或 `.jpg`）。  
> 可從 Google Drive 下載原始圖片，或提供任何替代圖片。

- [ ] **Step 1: 確認圖片已放置（手動確認）**

確認 `assets/images/tbd-landing-banner.png` 存在：

```bash
ls assets/images/
```

若不存在，先完成「前置條件」再繼續。

- [ ] **Step 2: 修改 `src/pages/home.html` 的 img src**

找到（第 54–60 行附近）：

```html
<img
  src="https://drive.google.com/thumbnail?id=1b9so5furNJzG-xpprXzxVlMsJThhgTHV&sz=w1600"
  alt="TBD Studio 升學策略顧問首頁視覺主圖"
  class="w-full h-full object-contain object-center bg-white"
  loading="eager"
  decoding="async"
  fetchpriority="high"
>
```

替換為：

```html
<img
  src="assets/images/tbd-landing-banner.png"
  alt="TBD Studio 升學策略顧問首頁視覺主圖"
  class="w-full h-full object-contain object-center bg-white"
  loading="eager"
  decoding="async"
  fetchpriority="high"
>
```

- [ ] **Step 3: 執行 build.py**

```bash
python build.py
```

- [ ] **Step 4: 驗證**

開啟 `index.html`，確認主圖正常顯示（非 Google Drive URL），圖片載入不依賴外部 CDN。

---

## Task 4: 補 OG Metadata

**Files:**
- Modify: `src/config.json`（加 `site_url`、每頁加 `og_image`）
- Modify: `build.py`（將 og_image、canonical 傳入 head context）
- Modify: `src/partials/head.html`（加 OG + Twitter card tags）

- [ ] **Step 1: 在 `src/config.json` 加入 site_url 與全站預設 og_image**

在 `"site"` 物件內新增：

```json
"site_url": "https://tbd-studio.vercel.app",
"og_image": "https://tbd-studio.vercel.app/assets/images/tbd-og-cover.png"
```

（og_image 先用站台絕對路徑，可後續替換；site_url 依實際部署 domain 修改）

- [ ] **Step 2: 修改 `build.py` 的 render_page() 函式，將 canonical 與 og_image 傳入 head context**

找到 `render_page` 裡的 `context` dict（第 71–78 行），在現有欄位後加入：

```python
context = {
    **CONFIG["site"],
    "title": page["title"],
    "description": page["description"],
    "body_class": page.get("body_class", ""),
    "asset_prefix": prefix,
    "home_href": resolve_href("index.html", output),
    "canonical_url": CONFIG["site"].get("site_url", "") + "/" + output,
    "og_image": page.get("og_image", CONFIG["site"].get("og_image", "")),
}
```

- [ ] **Step 3: 修改 `src/partials/head.html`，在 `</head>` 前加入 OG 與 Twitter card meta tags**

在現有 `<link rel="stylesheet" ...>` 之後、`</head>` 之前加入：

```html
  <!-- Canonical -->
  <link rel="canonical" href="{{canonical_url}}">
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="TBD Studio">
  <meta property="og:title" content="{{title}}">
  <meta property="og:description" content="{{description}}">
  <meta property="og:image" content="{{og_image}}">
  <meta property="og:url" content="{{canonical_url}}">
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{{title}}">
  <meta name="twitter:description" content="{{description}}">
  <meta name="twitter:image" content="{{og_image}}">
```

- [ ] **Step 4: 執行 build.py**

```bash
python build.py
```

- [ ] **Step 5: 驗證 OG tags 已注入**

開啟 `index.html`，在 `<head>` 區段確認存在 `og:title`、`og:image`、`canonical` 等 meta tags。  
可用瀏覽器 DevTools → Elements → `<head>` 檢查。

---

## 完成後確認清單

- [ ] navbar 只有 6 項（所有 build 產物頁面 + portfolio-guide 手動同步版）
- [ ] 首頁 H1 是「把零散經歷，整理成教授看得懂的申請策略」
- [ ] 首頁主圖 src 不再是 Google Drive URL
- [ ] 所有頁面 `<head>` 有 `og:title`、`og:description`、`og:image`、`canonical`
- [ ] 桌面版（1280px）與手機版（375px）navbar 正常顯示
