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

1. 確認受影響的檔案類型（見下方結構說明）
2. CSS 只改 `public/css/` 對應檔案（`css/` 目錄已不存在，`public/css/` 是唯一來源）
3. 修改後執行 `npm run build` 確認無錯誤
4. **不要修改 `dist/`**，那是 build 產物

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
    └── pages/
        ├── about.astro        ← 關於 TBD Studio
        ├── cases.astro        ← 成功案例（3-tab）
        ├── services.astro     ← 服務內容（情境入口 + 依對象分組）
        ├── process.astro      ← 合作流程與申請時程（泳道圖 + 時序圖）
        ├── plans.astro        ← 服務方案
        ├── audience.astro     ← 適合對象
        ├── faq.astro          ← 常見問題
        ├── search.astro       ← 知識庫搜尋（client-side，URL params）
        ├── index.astro        ← 服務總覽導覽頁
        ├── resources.astro    ← 知識庫首頁（側邊欄 + 分主題）
        ├── timeline.astro     ← 舊頁面，已轉為 redirect → /pages/process.html
        └── resources/
            └── [slug].astro   ← 動態路由，從 MDX Content Collections 產生

public/
├── css/                       ← CSS 唯一來源（5 個模組 + style.css @import 入口）
├── js/                        ← main.js（含 GA4 事件追蹤）、portfolio-guide.js
├── assets/images/
└── pages/
    └── portfolio-guide.html   ← 獨立 vanilla JS 頁面，直接靜態服務

.env                           ← 本地環境變數（gitignore，不 commit）
```

---

## GA4 事件追蹤

所有 LINE CTA 連結已加上 `data-ga-event` 屬性，`main.js` 會在 click 時呼叫 `gtag('event', ...)`.

| 事件名稱 | 位置 |
|---------|------|
| `click_line_footer` | 頁腳 |
| `click_line_home_pricing` | 首頁定價區 |
| `click_line_about` | 關於頁 CTA |
| `click_line_services` | 服務頁 Hero |
| `click_line_services_situation` | 服務頁情境卡 |
| `click_line_services_bottom` | 服務頁底部 |
| `click_line_process` / `_bottom` | 合作流程頁 |
| `click_line_faq` / `_bottom` | FAQ 頁 |
| `click_line_cases` / `_bottom` | 成功案例頁 |
| `click_line_resources` | 知識庫頁 |
| `click_line_article_sidebar` / `_bottom` | 文章頁 |
| `search_resources` | 知識庫搜尋（附 search_term） |

新增 LINE CTA 時，記得加上對應的 `data-ga-event` 屬性。  
Vercel 環境變數：`PUBLIC_GA_MEASUREMENT_ID=G-J30L8GC4TT`（已設定）。

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

### 測試方式
1. 執行 `npm run build`
2. 執行 `npm run preview` 開啟本地預覽
3. 測試桌面版 (1280px) 與手機版 (375px)
4. 確認 CTA 按鈕可點擊、nav 正常顯示
```

---

## 禁止清單（不需要討論，直接拒絕）

- 新增 React、Vue、Alpine.js 到現有頁面（portfolio-guide.html 例外，它已是獨立檔案）
- 把 Landing Page 設計成 SaaS 模板風格（大量卡片、icon grid、feature list）
- 移除或覆蓋現有內容，改成 AI 生成的 placeholder
- 直接修改 `dist/` 目錄（build 產物）
- 下載或執行第三方安裝腳本
- 在 `css/` 目錄寫 CSS（該目錄已不存在）
- commit `.env` 檔案（已加入 .gitignore）
