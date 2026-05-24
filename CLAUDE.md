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
2. CSS 改 `css/` 目錄的對應檔案（同時也要改 `public/css/` 的同名檔案，或只改 `css/` 再手動同步）
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
│   ├── Nav.astro          ← 全站導覽列
│   └── Footer.astro       ← 全站頁腳
├── config/
│   └── site.ts            ← 站台常數（logo、LINE URL、nav 項目）
├── content/
│   └── articles/          ← 知識庫文章（MDX Content Collections）
│       └── *.mdx          ← 每篇文章一個 .mdx 檔
├── layouts/
│   ├── BaseLayout.astro   ← 全站 HTML shell（head、nav、footer）
│   └── ArticleLayout.astro ← 知識庫文章版型（hero、側欄、CTA）
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
            └── [slug].astro ← 動態路由，從 MDX Content Collections 產生

public/
├── css/                   ← CSS 靜態檔案（5 個檔案 + style.css 入口）
├── js/                    ← main.js、portfolio-guide.js
├── assets/images/
└── pages/
    └── portfolio-guide.html ← 獨立 React/Babel 頁面，直接靜態服務

css/                       ← CSS 原始碼（與 public/css/ 保持同步）
src/_fragments/            ← 舊 HTML 片段備份，僅供參考，不會被 build
```

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
css/tbd-theme.css      ← 品牌色、字體、設計 tokens
css/tbd-base.css       ← reset、全站基礎
css/tbd-layout.css     ← nav、footer、全站 layout
css/tbd-components.css ← button、card、table、timeline、cta
css/tbd-pages.css      ← 各頁差異樣式
```

- 修改按鈕 → `tbd-components.css`
- 修改品牌色 → `tbd-theme.css`
- 修改某一頁特定樣式 → `tbd-pages.css`
- 不要把新樣式寫進 `style.css`（它只是 CSS @import 入口）
- 改 `css/` 後也要同步更新 `public/css/` 的同名檔案

---

## 教育服務語氣

- 語氣專業但親切，不生硬、不像 SaaS 行銷文案
- 不要過度強調功能列表，要有溫度感與陪伴感
- 避免「一鍵解決」、「極致體驗」等誇大詞彙
- CTA 應明確但不強迫（「預約策略諮詢」比「立即購買」好）
- 信任感來自案例的真實性，不來自設計炫技

---

## 修改後的交付格式

```
## 修改內容

### 變更檔案
- `src/content/articles/xxx.mdx`：說明改了什麼
- `css/tbd-components.css` + `public/css/tbd-components.css`：說明改了什麼

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
