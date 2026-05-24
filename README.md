# TBD Studio 官方網站

> 版本：v2.0 | 最後更新：2026-05-25
> 現況：Astro 5 遷移完成，正式上線

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

- **框架**：Astro 5（靜態輸出）
- **內容**：MDX Content Collections（知識庫文章）
- **樣式**：Tailwind CDN + 自訂 CSS（`public/css/`）
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
│   ├── Nav.astro          ← 全站導覽列
│   └── Footer.astro       ← 全站頁腳
├── config/
│   └── site.ts            ← 站台常數（logo、LINE URL、nav 項目）
├── content/
│   └── articles/          ← 知識庫文章（MDX Content Collections）
│       └── *.mdx          ← 每篇文章一個 .mdx 檔
├── layouts/
│   ├── BaseLayout.astro   ← 全站 HTML shell
│   └── ArticleLayout.astro ← 知識庫文章版型
└── pages/
    ├── index.astro        ← 首頁
    └── pages/
        ├── cases.astro
        ├── services.astro
        ├── process.astro
        ├── timeline.astro
        ├── plans.astro
        ├── audience.astro
        ├── index.astro    ← 服務總覽
        ├── resources.astro ← 知識庫首頁
        └── resources/
            └── [slug].astro ← 動態路由，從 MDX 產生

public/
├── css/                   ← CSS 靜態檔案
├── js/                    ← main.js、portfolio-guide.js
├── assets/images/
└── pages/
    └── portfolio-guide.html ← 獨立靜態頁面

css/                       ← CSS 原始碼（與 public/css/ 保持同步）
dist/                      ← Build 產物（不 commit，由 Vercel 自動產生）
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

- 要改 Nav：改 `src/config/site.ts` 的 `nav` 陣列
- 要改 Footer：改 `src/components/Footer.astro`
- 要新增知識庫文章：在 `src/content/articles/` 新增 `.mdx` 檔
- 要改品牌色：改 `css/tbd-theme.css`（同步更新 `public/css/tbd-theme.css`）
- 要改卡片、按鈕：改 `css/tbd-components.css`（同步更新 `public/css/`）

**重要：** 不要直接修改 `dist/`，那是 build 產物，由 Vercel 自動產生。

---

## Navbar（目前 6 項）

首頁 / 成功案例 / 服務內容 / 合作流程 / 申請時程 / 知識庫

---

## 版本紀錄

### v2.0 | 2026-05-25 — Astro 5 遷移

- 從 Python build.py 靜態 SSG 遷移至 **Astro 5 + MDX Content Collections**
- 知識庫文章改以 `.mdx` 管理，新增文章不再需要改任何設定檔
- 新增 `ArticleLayout.astro`、`BaseLayout.astro`、`Nav.astro`、`Footer.astro`
- 部署改為 Vercel 自動 build（`npm run build`，output: `dist/`）

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
- `portfolio-guide.html` 為獨立 React/Babel 頁面，放在 `public/pages/`，不走 Astro 模板
- UTM 追蹤需搭配 GA4 才能看到數據
