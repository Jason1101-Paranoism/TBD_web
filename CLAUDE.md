# CLAUDE.md — TBD Studio 官網 Claude 協作規範

> 本文件定義 Claude 在這個專案中的工作方式、Skills 使用原則與前端修改規範。  
> 所有 Claude 會話開始時請先讀這份文件。

---

## 專案背景

這是 TBD Studio 的靜態官網，定位為**教育服務 Landing Page + 品牌官網**。

- 使用者：高中生、大學生、家長
- 主要流量來源：IG Bio、LINE 官方選單、口碑轉介
- 技術棧：Astro 5 + MDX Content Collections + Tailwind CDN + 自訂 CSS
- 部署：Vercel（push to main 自動觸發，build command: `npm run build`，output: `dist/`）
- 未來可能延伸：學生管理後台、教師媒合、CRM

---

## 第一原則：觀察先於行動

**修改前必須做的事：**

1. 先寫清楚 Scope / **Non-scope**（不做什麼比做什麼更重要；預設紅線見 `docs/dev-workflow.md`）
2. 確認受影響的檔案類型（見下方結構說明）
3. CSS 只改 `public/css/` 對應檔案（`css/` 目錄已不存在，`public/css/` 是唯一來源）
4. **不要修改 `dist/`**，那是 build 產物

**修改後必須做的事（兩道獨立閘門，缺一不可）：**

1. `npm run build` — 證明能編譯。
2. `npm run verify` — 證明能在真瀏覽器跑（headless 行為煙霧測試：每頁零 JS 錯誤 + 目錄／選單 toggle 可展開）。**「build 通過」≠「完成」**：TOC 目錄事故就是 build 全綠卻在載入時 JS 崩潰，只有 verify 抓得到。
3. 改了「會動的東西」就把它加進 `scripts/verify.mjs` 的測試清單，讓回歸測試跟著功能長大。

> 完整流程（界定範圍 → 觀察 → 改 → build → verify → 證據式回報 → commit → push → 確認部署）見 **`docs/dev-workflow.md`**。`git push` 會觸發 Vercel 正式部署，屬「必須先確認」的高風險操作，除非本輪已獲明確授權。

**驗證時的四個陷阱（都是本專案實際踩過的，不是假想）：**

1. **要判斷「頁面上有沒有這個連結／區塊」，查 `dist/`，不要查 `src/`。**
   `src/` 只能證明「不是手寫的」。這個站有大量由 layout 資料驅動產生的連結（`ArticleLayout` 的 `series-nav`、`graduate-application` 的學群對照表），grep `.mdx` 會得到 0 個結果，然後你會做出「完全沒有內部連結」這種與事實相反的判斷——這件事真的發生過，而且被當成結論回報給使用者。
   查法：`npm run build` 後對 `dist/**/*.html` 搜尋。

2. **量 RWD 寬度不要用 `--window-size`。**
   Windows 有視窗最小寬度（指定 375 實際會得到 485），再加上顯示縮放曾量到 497。用錯寬度截出來的圖會出現「內容被切掉」的假象，看起來像嚴重破版，其實版面完全正常。
   正確作法：走 DevTools Protocol 的 `Emulation.setDeviceMetricsOverride`，並用 `document.documentElement.scrollWidth === clientWidth` 判定有無橫向溢出，不要只靠肉眼看截圖。

3. **要引用外部網址，先實測它活著再寫進文章。**
   本專案文章的外部連結必須是可查證的權威來源（政府、學術、官方機構）。寫進 `.mdx` 之前一律先發一次 HTTP 請求確認 200；曾有候選來源（藝術銀行）DNS 解不出來而被剔除。憑記憶寫網址等於製造死連結。

4. **PowerShell 主控台輸出的中文會變亂碼。**
   要取得檔案內的中文原文（例如複製既有文案到新檔），用 Read 工具，不要從 PowerShell 的輸出複製——`Get-Content` + regex 印出來的中文是 mojibake，照抄會把文案寫壞。同理，改寫含中文的檔案用 Edit／Write，不要用 `Set-Content` 管線。

**禁止行為：**

- 不要任意重構整個專案架構
- 不要引入新的框架（React、Vue、Alpine）除非明確被要求
- 不要在頁面放 placeholder 文字（"Lorem ipsum"、"Coming soon"、"待填"）
- 不要新增無意義的 TODO 或未完成的 UI 區塊
- 不要在沒有被要求的情況下修改現有頁面的內容或樣式

---

## 專案結構

```
src/
├── components/
│   ├── Nav.astro              ← 全站導覽列
│   ├── Footer.astro           ← 全站頁腳
│   └── GoogleAnalytics.astro  ← GA4 追蹤元件（讀 PUBLIC_GA_MEASUREMENT_ID env var）
├── config/
│   └── site.ts                ← 站台常數（logo、LINE URL、nav 7 項）
├── content/
│   └── articles/              ← 知識庫文章（MDX Content Collections）
│       └── *.mdx              ← 每篇文章一個 .mdx 檔
├── layouts/
│   ├── BaseLayout.astro       ← 全站 HTML shell（head、nav、footer、GA4）
│   └── ArticleLayout.astro    ← 知識庫文章版型（hero、側欄、CTA）
└── pages/
    ├── index.astro            ← 首頁
    ├── 404.astro              ← 自訂 404（品牌版，Vercel 自動採用 dist/404.html）
    └── pages/
        ├── about.astro        ← 關於 TBD Studio
        ├── cases.astro        ← 成功案例（7 案例 tab + hash 深連結）
        ├── services.astro     ← 服務內容（情境入口 + 方案 A–D + 費用摘要；plans/audience 已併入）
        ├── services/*.astro   ← 四個管道子頁（個申/特選/研究所/面試）
        ├── process.astro      ← 合作流程與申請時程（泳道圖 + 時序圖）
        ├── faq.astro          ← 常見問題
        ├── guides/*.astro     ← 主題指南（12 通用 + 分學群 graduate-*）
        ├── resources.astro    ← 知識庫首頁（搜尋/篩選/主題指南 Tabs）
        ├── resources/         ← tools / library / interview-bank / [slug] 動態文章路由
        └── plans / audience / index / search / timeline .astro
                               ← 皆為轉址頁（Vercel 308 或 meta-refresh，保留舊連結用，不要當內容頁改）

public/
├── css/                       ← CSS 唯一來源（5 個模組 + style.css @import 入口）
├── js/                        ← main.js（含 GA4 事件追蹤）、portfolio-guide.js
├── assets/images/
└── pages/
    └── portfolio-guide.html   ← 獨立 vanilla JS 頁面，直接靜態服務

.env                           ← 本地環境變數（gitignore，不 commit）
```

---

## GA4 事件追蹤（v1.2 Key Event）

`public/js/main.js` 是全站統一的事件追蹤 script（在每頁 `</body>` 前載入），會自動把點擊／瀏覽行為對應到 8 個標準 Key Event：

| 標準事件 | 觸發方式 |
|---------|---------|
| `click_line_cta` | 點擊純加 LINE 好友連結（頁腳「加入 LINE 官方帳號」、或無 cta/nav utm 的 lin.ee 連結） |
| `click_ig_cta` | 點擊 Instagram 連結（頁腳「追蹤 Instagram」、或任何 `instagram.com` 連結） |
| `click_consultation_cta` | 點擊「預約策略諮詢」類 CTA（帶 `utm_medium=cta` 或 `nav` 的 LINE 連結、或舊有 `data-ga-event="click_line_*"`） |
| `view_service_page` | 進入 `/pages/services...` 任一服務頁 |
| `view_article` | 進入 `/pages/resources/<slug>` 文章頁 |
| `scroll_75` | 頁面捲動超過 75%（每頁一次） |
| `download_resource` | 點擊 `.pdf/.zip/.doc/.xls/.ppt/.csv` 等下載連結 |
| `submit_contact_form` | 任一 `<form>` 送出（未來新增表單時自動生效；用 `data-no-track` 可排除） |

**事件如何決定**（`resolveClickEvent`）：
1. 元素上的 `data-track-event="<event>"` → 直接用該值（最明確，新 CTA 建議用這個）。
2. 否則看舊有的 `data-ga-event`（`click_line_footer`→line、`click_ig_*`→ig、其餘 `click_line_*`→consultation）。
3. 否則依 `href` 自動推斷（instagram / 下載副檔名 / lin.ee）。

每個事件都會附帶 `page_path`，點擊事件再附 `link_url`、`link_text`、`cta_id`（原 `data-ga-event` 值，保留細分粒度）。

**新增 CTA 時**：直接加 `data-track-event="click_consultation_cta"`（或對應事件）即可；舊的 `data-ga-event` 可留可不留，script 會自動 fallback。

**測試 / DebugView**：本機 `localhost` 或網址加 `?ga_debug=1` 時，事件會帶 `debug_mode: true` 並在 console 印出 `[ga] ...`，可在 GA4 DebugView 即時驗證。

Vercel 環境變數：`PUBLIC_GA_MEASUREMENT_ID=G-J30L8GC4TT`（已設定）。

**GA4 後台**：在「管理 → 事件」把 `click_line_cta`、`click_ig_cta`、`click_consultation_cta`、`submit_contact_form` 標記為 Key Event（轉換）。

---

## 新增知識庫文章

只需在 `src/content/articles/` 新增一個 `.mdx` 檔，不需要改任何其他設定。

**Frontmatter 必填欄位：**

```yaml
---
title: 文章標題
description: 頁面 meta description
kicker: 分類標籤（例：Side Project 指南）
lead: 文章導言（hero 區的摘要段落）
sidebarCtaText: 側欄 CTA 說明文字
sidebarCtaUtm: utm_campaign 值（例：article-my-slug）
bottomCtaH2: 底部 CTA 標題
bottomCtaUtm: utm_campaign 值（通常與 sidebarCtaUtm 相同）
tocItems:
  - href: "#section-id"
    label: 目錄文字
relatedArticles:
  - badge: 分類
    title: 文章標題
    href: /pages/resources/slug.html
    desc: 簡短說明
---
```

**MDX 內文結構：**

```mdx
<section class="article-section" id="section-id">
## 段落標題

段落內容，支援 **粗體**、`程式碼`、清單等 Markdown 語法。
</section>
```

---

## 新增分學群模板（研究所推甄工具包）

模板的資料只有一份：`src/config/gradTemplates.ts`。五個分學群指南頁與 `resources/tools.html` 都從它讀，**不要在頁面裡另寫一份陣列**。

**固定順序（順序錯了閘門會擋）：**

1. 把 `.md` 與 `.csv` 放進 `public/assets/templates/`，檔名為 `grad-<學群>-<用途>`
2. 在 `scripts/template-manifest.json` 登記一筆（`slug` ＋ `delivery: "file"`）
3. 在 `gradTemplates.ts` 對應的學群 group 裡登記（`title` / `desc` / `file` / `article`）
4. `npm run verify`

第 2、3 步漏掉任一步，verify 都會直接失敗。事實來源是 `template-manifest.json`，並與**磁碟上的實體檔**雙向校驗——設定檔（`gradTemplates.ts`）不能兼任事實來源，兩邊都從同一份設定推導的話等於自己驗自己。

**模板要改成 Google Sheets／Docs／Notion 時**：把 manifest 那筆改成 `delivery: "external"` 並填 `url`，不要只刪掉磁碟上的檔案。只刪檔會讓這道閘門安靜地少驗一項，而那正是它要擋的事（理由見 `docs/DECISIONS.md` 的 D-008）。

**為什麼有這條規則**：這些模板原本各自寫死在指南頁裡，`tools.html` 是另一份手寫清單。Week 3 落地時只更新了指南頁，結果 20 份模板在下載頁上消失了四輪（Week 3–6）都沒被發現。完整決策見 `docs/DECISIONS.md` 的 D-003。

---

## Skills 分工說明

### 核心層（Landing Page / 服務頁 / 品牌頁）

| Skill | 用途 |
|-------|------|
| `frontend-design` | HTML/CSS 前端實作、元件設計、響應式排版 |
| `taste-skill` | 確保視覺有品味，避免 generic AI UI |
| `output-skill` | 最終輸出品質把關：無 placeholder、互動狀態完整 |

### 改版層（針對既有頁面的視覺審查與改善）

| Skill | 用途 |
|-------|------|
| `redesign-skill` | 審查排版問題、間距、層級、CTA 順序，適合頁面健診 |

**設計稿先行（UI 改版三級流程）：**

1. **日常小改**（文章、元件微調）：直接改 + build + verify，不需設計稿。
2. **區塊／單頁改版**：先用 Artifact 出 2–3 個「會動的」HTML 方向稿——內嵌 tbd-theme tokens、
   真實中文內容、含 RWD 與互動狀態——使用者在瀏覽器挑定方向後再實作進站。
   **不用 imagegen 圖稿當中介**（中文假字、審美偏 SaaS 模板、靜態單幀三個硬傷）。
3. **大改版／新產品線**：先以 DesignSync 把 TBD 元件庫同步到 claude.ai/design 做系統盤點，再走方向稿流程。

### 後台 / 設計系統層（未來才需要）

| Skill | 啟用時機 |
|-------|---------|
| `ui-ux-pro-max` | 學生管理後台、教師媒合後台、CRM、設計系統、複雜表單 |

### 策略層（IA 決策時才需要）

| Skill | 啟用時機 |
|-------|---------|
| `ux-strategy` | 資訊架構調整、Nav 收斂、使用者旅程、轉換漏斗 |

---

## 樣式層級

```
public/css/tbd-theme.css      ← 品牌色、字體、設計 tokens（--tbd-* 變數）
public/css/tbd-base.css       ← reset、全站基礎
public/css/tbd-layout.css     ← nav、footer、全站 layout
public/css/tbd-components.css ← button、card、table、timeline、cta
public/css/tbd-pages.css      ← 各頁差異樣式（about、swimlane、search、resources 等）
public/css/style.css          ← @import 入口，不直接寫樣式
```

- 修改按鈕 → `public/css/tbd-components.css`
- 修改品牌色 → `public/css/tbd-theme.css`
- 修改某一頁特定樣式 → `public/css/tbd-pages.css`
- **`css/` 目錄已不存在**，`public/css/` 是唯一 CSS 來源，不需要雙份同步

---

## 教育服務語氣

- 語氣專業但親切，不生硬、不像 SaaS 行銷文案
- 不要過度強調功能列表，要有溫度感與陪伴感
- 避免「一鍵解決」、「極致體驗」等誇大詞彙
- CTA 應明確但不強迫（「預約策略諮詢」比「立即購買」好）
- 信任感來自案例的真實性，不來自設計炫技
- 核心語氣原則：「共創，不代筆；引導，不操控；如實呈現，不憑空捏造。」

---

## 修改後的交付格式

```
## 修改內容

### 變更檔案
- `src/pages/pages/xxx.astro`：說明改了什麼
- `public/css/tbd-pages.css`：說明改了什麼

### 驗證（三道證據，缺一不可）
1. `npm run build`：通過 / 失敗
2. `npm run verify`：通過 X/Y（headless 行為測試；失敗項貼出來）
3. 人工目視：桌面 1280 / 手機 375 看過哪些頁、CTA 可點、nav 正常、版面無破

### 範圍
- 是否只動了 Scope 內的檔案、是否碰到 Non-scope

### 待確認 / 風險（若有）
```

> 完整 SOP（含 Scope/Non-scope 卡、操作分級、部署後抽查）見 `docs/dev-workflow.md`。

---

## 禁止清單（不需要討論，直接拒絕）

- 新增 React、Vue、Alpine.js 到現有頁面（portfolio-guide.html 例外，它已是獨立檔案）
- 把 Landing Page 設計成 SaaS 模板風格（大量卡片、icon grid、feature list）
- 移除或覆蓋現有內容，改成 AI 生成的 placeholder
- 直接修改 `dist/` 目錄（build 產物）
- 下載或執行第三方安裝腳本
- 在 `css/` 目錄寫 CSS（該目錄已不存在）
- commit `.env` 檔案（已加入 .gitignore）
