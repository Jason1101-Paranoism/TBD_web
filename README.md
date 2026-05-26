# TBD Studio 官方網站

> 版本：v2.1 | 最後更新：2026-05-26
> 現況：正式營運型教育顧問官網，GA4 事件追蹤上線

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
        ├── faq.astro          ← 常見問題
        ├── search.astro       ← 知識庫搜尋（client-side）
        ├── index.astro        ← 服務總覽
        ├── resources.astro    ← 知識庫首頁（側邊欄）
        ├── timeline.astro     ← redirect → /pages/process.html
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
title: 文章標題
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
- 新增 LINE CTA：記得加 `data-ga-event="click_line_xxx"` 屬性

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

所有 LINE CTA 連結標記 `data-ga-event` 屬性，`main.js` 統一處理 click 事件。  
在 GA4 後台將 `click_line_*` 設為 Key Event 即可追蹤轉換漏斗。

---

## 版本紀錄

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
