# TBD Studio 官方網站

> 版本：v2.5 | 最後更新：2026-05-26
> 現況：正式營運型教育顧問官網，SEO 結構化資料上線，主題指南 + 服務 Landing Page 上線

---

## 專案定位

TBD Studio 是針對高中生與大學生的升學策略顧問品牌，主要服務：

- 方向諮詢與申請策略
- 備審資料整理與重構
- 面試訓練
- Portfolio 建置指南
- 特殊選才、個人申請、研究所推甄

網站定位是**教育服務 Landing Page + 品牌官網**，不是 SaaS 產品網站。主要入口來自 IG Bio、LINE 官方選單、家長口碑轉介。

---

## 技術棧

- **框架**：Astro 5（靜態輸出，`build.format: 'file'`）
- **內容**：MDX Content Collections（知識庫文章）
- **樣式**：Tailwind CDN + 自訂 CSS（`public/css/`，唯一 CSS 來源）
- **追蹤**：GA4（`G-J30L8GC4TT`，透過 `PUBLIC_GA_MEASUREMENT_ID` env var）
- **部署**：Vercel（push to main 自動觸發）

---

## 開發指令

```bash
npm install        # 安裝依賴
npm run dev        # 啟動本地開發伺服器（http://localhost:4321）
npm run build      # 建置靜態檔案至 dist/
npm run preview    # 預覽 build 結果
```

---

## 架構

```
src/
├── components/
│   ├── Nav.astro              ← 全站導覽列
│   ├── Footer.astro           ← 全站頁腳
│   └── GoogleAnalytics.astro  ← GA4 元件（env var 控制是否載入）
├── config/
│   └── site.ts                ← 站台常數（logo、LINE URL、nav 7 項）
├── content/
│   └── articles/              ← 知識庫文章（MDX Content Collections）
│       └── *.mdx
├── layouts/
│   ├── BaseLayout.astro       ← 全站 HTML shell
│   └── ArticleLayout.astro    ← 知識庫文章版型
└── pages/
    ├── index.astro            ← 首頁
    └── pages/
        ├── about.astro        ← 關於 TBD Studio（品牌理念、工作方式）
        ├── cases.astro        ← 成功案例（tab 切換）
        ├── services.astro     ← 服務內容（情境入口 + 依對象分組）
        ├── process.astro      ← 合作流程與申請時程（泳道圖 + 時序圖）
        ├── plans.astro        ← 服務方案
        ├── audience.astro     ← 適合對象
        ├── faq.astro          ← 常見問題（含 FAQPage Schema）
        ├── search.astro       ← 知識庫搜尋（client-side）
        ├── index.astro        ← 服務總覽
        ├── resources.astro    ← 知識庫首頁（側邊欄 + 主題指南導流）
        ├── timeline.astro     ← redirect → /pages/process.html
        ├── guides/            ← 主題指南頁（topic cluster）
        │   ├── side-project.astro
        │   ├── portfolio-prep.astro
        │   ├── github.astro
        │   ├── ai-era.astro
        │   └── research.astro
        ├── services/          ← 服務 Landing Page（按管道）
        │   ├── college-application.astro
        │   ├── special-admission.astro
        │   ├── graduate.astro
        │   └── interview-training.astro
        └── resources/
            └── [slug].astro   ← 動態路由，從 MDX 產生

public/
├── css/                       ← CSS 唯一來源（不需要雙份同步）
│   ├── style.css              ← @import 入口
│   ├── tbd-theme.css          ← 品牌色、字體（--tbd-* 變數）
│   ├── tbd-base.css           ← reset、基礎
│   ├── tbd-layout.css         ← nav、footer
│   ├── tbd-components.css     ← button、card、cta
│   └── tbd-pages.css          ← 各頁差異樣式
├── js/
│   ├── main.js                ← 全站 JS（mobile menu + GA4 事件追蹤）
│   └── portfolio-guide.js     ← Portfolio Guide 頁面邏輯
├── assets/images/
└── pages/
    └── portfolio-guide.html   ← 獨立 vanilla JS 頁面

.env                           ← 本地環境變數（gitignore）
dist/                          ← Build 產物（gitignore，由 Vercel 自動產生）
```

---

## 新增知識庫文章

在 `src/content/articles/` 新增一個 `.mdx` 檔，**不需要改任何其他設定**。

**必填 Frontmatter：**

```yaml
---
title: 文章標題（H1，品牌語氣）
seoTitle: 搜尋意圖標題（可選，用於 <title> 標籤與 OG；省略時與 title 相同）
description: 頁面 meta description
kicker: 分類標籤
lead: 文章導言
sidebarCtaText: 側欄 CTA 說明文字
sidebarCtaUtm: utm_campaign 值
bottomCtaH2: 底部 CTA 標題
bottomCtaUtm: utm_campaign 值
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

**內文結構：**

```mdx
<section class="article-section" id="section-id">
## 段落標題

段落內容。
</section>
```

---

## 維護原則

- 要改 Nav：改 `src/config/site.ts` 的 `nav` 陣列（目前 7 項）
- 要改 Footer：改 `src/components/Footer.astro`
- 要新增知識庫文章：在 `src/content/articles/` 新增 `.mdx` 檔
- 要改品牌色：改 `public/css/tbd-theme.css`
- 要改卡片、按鈕：改 `public/css/tbd-components.css`
- 要改某頁樣式：改 `public/css/tbd-pages.css`
- 新增 CTA：加 `data-track-event="click_consultation_cta"`（或對應的標準事件）即可被追蹤

**重要：**
- 不要直接修改 `dist/`（build 產物）
- `css/` 目錄已不存在，CSS 唯一來源是 `public/css/`
- `.env` 已加入 `.gitignore`，不要 commit

---

## Navbar（目前 7 項）

首頁 / 成功案例 / 服務內容 / 合作流程 / 知識庫 / FAQ / 關於

---

## GA4 事件追蹤

Measurement ID：`G-J30L8GC4TT`（Vercel env var：`PUBLIC_GA_MEASUREMENT_ID`）

`public/js/main.js` 全站統一追蹤，自動送出 8 個標準 Key Event：
`click_line_cta`、`click_ig_cta`、`click_consultation_cta`、`view_service_page`、
`view_article`、`scroll_75`、`download_resource`、`submit_contact_form`。

新 CTA 用 `data-track-event="<event>"` 明確指定；舊的 `data-ga-event` 會自動 fallback。
本機或網址加 `?ga_debug=1` 可在 GA4 DebugView 即時驗證（事件帶 `debug_mode`）。
在 GA4 後台把 `click_line_cta` / `click_ig_cta` / `click_consultation_cta` / `submit_contact_form` 標為 Key Event。

詳見 `CLAUDE.md` 的「GA4 事件追蹤」段落。

---

## 未來方向（規劃中，尚未開工）

### TBD Growth Operating System — 成長週報自動化

把目前分散的成長渠道（IG / Threads 內容 → 官網知識庫/Landing Page → LINE / 初談 CTA → 成交）串成「內容成效 → 官網轉換 → 下週行動」的閉環，每週自動產出可據以決策的報告。

**已決定的方向：混合架構（自動收集 + 網站後台呈現）**

```
Vercel Cron（每週一）
   └─ /api/cron/weekly-snapshot（service account 抓 GA4 + GSC）
        └─ 計算當週數據 + 規則建議 → 寫入資料庫
             └─ /admin 儀表板（SSR、密碼保護）隨時可看
```

**技術選型（已拍板）**
- 資料庫：**Vercel Postgres (Neon)**
- 後台登入：**單一密碼 + 簽名 cookie session**
- 對官網影響：Astro 維持 `output: 'static'`，行銷頁全靜態不變；只有 `/admin`、`/api/*` 走 server（`prerender = false`）
- Google 端用 **service account**（加進 GA4 property 當 Viewer、加進 GSC 當使用者），免互動式登入
- Meta（IG / Threads）token 較麻煩，放後面階段

**追蹤的資料源**
- GA4 Data API：流量、key events（已埋好的 8 個事件）、轉換
- Google Search Console：clicks / impressions / CTR / position / 查詢字詞
- Instagram Graph API（後期）：貼文觸及、互動、saves、website clicks
- Threads API（後期）：views、replies、reposts、quotes

**分階段**

| 階段 | 內容 | 狀態 |
|---|---|---|
| A 地基 | Astro 轉 hybrid、`/admin` + 登入、接 Neon、定 schema | 規劃中 |
| B 收集 | service account + Vercel Cron + GA4/GSC 快照寫入 DB | 規劃中 |
| C 儀表板 | 流量趨勢、Key Events、Top Pages/Queries、規則建議 | 規劃中 |
| D 社群 | Instagram / Threads | 後期 |
| E AI 摘要 | 自然語言週報 + 下週行動建議 | 最後 |

先做 A + B + C＝可用的混合 MVP。

**開工前的前置作業（Phase 0，需人工）**
- 建 GCP 專案 + service account，授權到 GA4 / GSC
- 提供 GA4 property ID（GSC property 已知：`https://tbd-web.vercel.app/`）
- Vercel 建 Neon DB，設定 `DATABASE_URL`、`ADMIN_PASSWORD`、`SESSION_SECRET`

**MVP 成功標準**
- 每週一自動把當週 GA4 + GSC 數據寫進 DB
- `/admin` 看得到 Top Pages、Top Queries、Key Events、週對比
- 自動列出 3–5 個下週優化建議

> 備註：原始評估曾考慮純 Google Apps Script + Sheet + Doc 版本（開發量小、零基礎設施），最後選擇混合版，因為它能整合進品牌化後台，並可作為未來「學生後台 / CRM」的地基。

---

## 版本紀錄

### v2.5 | 2026-05-26 — 主題指南 + 服務 Landing Page + 導流

**主題指南（`/pages/guides/`）**：5 個 topic cluster 頁面，把現有文章整合成完整閱讀路徑
- `side-project`（8 篇）、`portfolio-prep`（10 篇）、`github`（5 篇）、`ai-era`（7 篇）、`research`（7 篇）

**服務 Landing Page（`/pages/services/`）**：4 個按升學管道的轉換頁
- `college-application`、`special-admission`、`graduate`、`interview-training`
- 每頁含 Service Schema、BreadcrumbList、適合對象、服務說明、案例佐證、FAQ、CTA

**導流安排**：
- `resources.astro`：側邊欄加「主題指南」區塊 + 主內容最頂新增指南卡片區
- `services.astro`：章節 02/03 之間加服務說明頁入口（4 張卡片）
- `index.astro`：DELIVERABLES 後加服務管道卡片；METHOD 後加知識庫指南卡片

**Sitemap 修正**：
- `portfolio-guide.html.html` → `portfolio-guide.html`（customPages 移除 `.html` 後綴，serialize 只加一次）
- 新增 `/timeline`、`/pages` 到 sitemap filter 排除清單
- `robots.txt` Sitemap 指向 `sitemap-index.xml`

### v2.4 | 2026-05-26 — SEO P0：結構化資料 + seoTitle + Sitemap

- `BaseLayout.astro`：新增 `seoTitle` prop（`<title>`/OG 與 H1 分離）；全站 Schema（`EducationalOrganization` + `WebSite` + `SearchAction`）；per-page schema slot
- `ArticleLayout.astro`：每篇文章注入 `Article` + `BreadcrumbList` Schema
- `faq.astro`：新增 `FAQPage` Schema（10 組 Q&A）
- 7 篇高搜尋意圖文章加入 `seoTitle` frontmatter（搜尋關鍵字優化版標題）
- `astro.config.mjs`：`portfolio-guide.html` 加入 sitemap `customPages`
- `content/config.ts`：articles schema 新增 optional `seoTitle` 欄位

### v2.3 | 2026-05-26 — CSS 設計系統統一 + 真實信任素材

- portfolio-guide.html：評審教授內心話 block 及 Portfolio Strategy CTA 改以 CSS 變數統一（--tbd-dark、--tbd-yellow 等），移除硬編 hex 色碼
- Portfolio Strategy CTA 改用 .cta 類別（深色背景，符合全站 CTA 規範），移除 blur 裝飾，新增 GA4 事件屬性
- cases.astro Tab 1 家長回饋：替換 placeholder，改為宥榕媽媽訪談金句「這不是幫他考上，而是讓他知道自己是誰。」

### v2.2 | 2026-05-26 — 雙案例展示 + 導覽統一

- 成功案例 Tab 2（大學個申）上線：有程（25-1-YC），中原機械，約 24 週
- 首頁成功案例區右欄改為 有程 compact 案例卡，移除重複 Before/After 內容
- portfolio-guide.html 補齊 Nav（7 項）、Footer（快速連結）
- 側邊欄統一：ArticleLayout TOC 與 portfolio-guide Guide Menu 共用 .pg-sidebar CSS 元件
- 待補：Tab 3（國外研究所）暫維持 pending 卡片，祐熲案例進行中

### v2.1 | 2026-05-26 — 事件追蹤 + 品牌頁

- GA4 事件追蹤：14 個 LINE CTA click 事件 + 知識庫搜尋事件
- 新增 `about.astro`：品牌理念、T/B/D 拆解、工作方式、邊界說明
- Nav 新增「關於」（7 項）
- 合作流程泳道圖補交付物 badge（6 個 Phase）
- `GoogleAnalytics.astro` 元件上線，Vercel env var 已設定

### v2.0 | 2026-05-26 — UX 改版

- 成功案例：tab 切換（大學個申 / 研究所 / 特殊選才）
- 服務內容：情境式入口 + 依對象分組呈現
- 合作流程與申請時程合併：泳道圖 + 時序圖
- 知識庫側邊欄導覽 + 搜尋系統（`search.astro`）
- 新增 `faq.astro`（4 類常見問題）
- `timeline.astro` 轉為 redirect，`config.json` 刪除

### v1.9 | 2026-05-25 — Astro 5 遷移

- 從 Python build.py 靜態 SSG 遷移至 **Astro 5 + MDX Content Collections**
- 知識庫文章改以 `.mdx` 管理，新增文章不再需要改任何設定檔
- 新增 `ArticleLayout.astro`、`BaseLayout.astro`、`Nav.astro`、`Footer.astro`
- 部署改為 Vercel 自動 build

### v1.5 | 2026-05-23 — P2 完成

- 知識庫系統上線：列表頁 + 21 篇文章
- CTA UTM Tracking：5 個頁面 LINE 連結加入 UTM 參數
- Navbar 加入「知識庫」

### v1.4 | 2026-05-22 — P1 完成

- Portfolio Guide 改為純 vanilla JS
- 服務內容整合頁：audience / services / plans 三頁合併

### v1.3 | 2026-05-22 — P0 完成

- Navbar 收斂：從 9 項精簡為 6 項
- 首頁 H1、主圖本地化、OG Metadata 補齊

---

## 技術注意事項

- 使用 Tailwind CDN（非 PostCSS 編譯版），適合靜態輸出
- `build.format: 'file'` 保留 `.html` 副檔名（符合舊 URL 結構）
- `portfolio-guide.html` 為獨立 vanilla JS 頁面，放在 `public/pages/`，不走 Astro 模板
- GA4 在本地開發時需要 `.env` 檔，Vercel 上需要在後台設定 env var
