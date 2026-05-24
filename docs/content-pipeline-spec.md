# TBD Studio 內容管線規格書

> 版本：v1.0 | 2026-05-24  
> 狀態：規劃中，尚未執行  
> 目標：將 IG 貼文系統化轉換為官網知識庫、部落格、FAQ 與服務導流內容

---

## 一、計劃目標

將 TBD Studio 既有的 Instagram 圖文貼文，系統化轉化為可搜尋、可累積、可導流、可重複利用的網站內容資產。

核心內容管線：

```
IG 貼文（社群觸及）
    ↓
官網知識庫 / Blog（長尾搜尋 + 品牌信任）
    ↓
FAQ / 服務頁（降低諮詢成本）
    ↓
LINE / 預約頁（轉換成交）
```

---

## 二、技術架構決策

### 現況

目前官網為靜態 HTML + Python build.py 模板系統。知識庫文章目前以純 HTML fragment 管理（`src/pages/resources/`），適合文章數 < 10 篇的階段。

### 目標架構：遷移至 Astro

當文章數達到 15–20 篇後，遷移至 **Astro**（靜態網站生成器）。

**選擇 Astro 的原因：**

| 考量 | Astro | Next.js / Vite+React |
|------|-------|---------------------|
| 適合靜態內容站 | ✅ 天生支援 | 需額外設定 |
| Markdown / MDX 驅動 | ✅ 內建 Content Collections | 需額外套件 |
| 無 JS hydration 負擔 | ✅ Islands Architecture | ❌ 預設全頁 JS |
| 維護門檻 | 低 | 中高 |
| 現有 Tailwind CSS 相容 | ✅ | ✅ |
| 現有 HTML 可直接複用 | ✅ `.astro` 元件語法接近 HTML | ❌ 需改寫成 JSX |

### 遷移時機

**不立即遷移**，原因：
1. 現有 HTML + build.py 架構在文章少時維護成本更低
2. 遷移前需先確立內容格式標準（Markdown frontmatter）
3. 先跑通 5–10 篇文章的人工流程，再評估自動化需求

**觸發遷移的條件（任一）：**
- 知識庫文章 ≥ 15 篇
- 需要文章標籤頁、分類列表頁、搜尋功能
- 需要 Markdown 編輯流程（非直接改 HTML）

---

## 三、內容分類系統

| 分類 | Slug | 說明 |
|------|------|------|
| 升學策略 | `admission-strategy` | 科系選擇、申請路徑、特殊選才、繁星申請 |
| 學習歷程 | `learning-portfolio` | 學習歷程檔案、反思撰寫、成果整理 |
| 備審資料 | `application-docs` | 自傳、讀書計畫、申請動機、資料架構 |
| 面試準備 | `interview-prep` | 自我介紹、教授提問、口語表達、模擬面試 |
| 案例分享 | `case-studies` | 學生回饋、家長回饋、成功案例 |
| 常見問題 | `faq` | 服務流程、費用、適合對象、合作方式 |

---

## 四、內容輸入格式

每篇 IG 貼文以以下方式輸入：

```
貼文 001｜升學顧問都在做什麼｜6 張
來源：Instagram
主題：升學顧問 / 學習歷程 / 備審策略
輸入方式：截圖貼入對話（Claude 讀圖）
```

**輸入優先順序：**

| 來源 | 優先順序 | 說明 |
|------|---------|------|
| 貼文截圖 + Caption | 最高 | Claude 可直接讀圖文，最完整 |
| IG 截圖（圖片文字） | 高 | OCR 讀取，適合圖片型貼文 |
| Notion 資料庫（需 MCP） | 中 | 設定 Notion Integration 後可直接存取 |
| IG 連結 | 低 | 受登入限制，不穩定 |

---

## 五、每篇貼文的標準輸出

每處理一篇 IG 貼文，固定產出以下九個區塊：

```markdown
# 貼文 {ID}｜{標題}

## 1. 原始貼文摘要

## 2. 官網定位
- 分類：
- 受眾：高中生 / 大學生 / 家長
- 漏斗階段：引流 / 教育 / 信任 / 成交
- 適合放置頁面：

## 3. 結構化資料（YAML）

## 4. Blog 文章草稿（完整版）

## 5. Knowledge Base 條目（精簡版）

## 6. FAQ 條目

## 7. SEO 設定
- title：
- description：
- slug：
- keywords：

## 8. CTA 文案

## 9. 是否建議改寫後重發 IG
```

---

## 六、結構化資料格式（YAML）

```yaml
post_id: tbd_001
source: instagram
original_title: 升學顧問都在做什麼
content_type: carousel          # carousel / single / reel
category: admission-strategy
sub_category:
  - learning-portfolio
  - application-docs
audience:
  - 高中生
  - 家長
funnel_stage: 信任建立           # 引流 / 教育 / 信任 / 成交
core_question: 升學顧問到底能幫學生做什麼？
core_message: 升學顧問不是代寫或包裝，而是協助學生找到定位、規劃策略，並把經歷整理成教授看得懂的故事。
pain_points:
  - 不知道自己適合什麼科系
  - 經歷很多但無法整理成清楚主線
  - 缺乏有說服力的個人故事
service_connection:
  - 升學策略諮詢
  - 學習歷程整理
  - 備審資料規劃
seo_keywords:
  - 升學顧問
  - 學習歷程
  - 備審資料
  - 特殊選才
cta:
  primary: 預約升學策略諮詢
  secondary: 查看更多升學準備文章
status: draft                    # draft / review / published
```

---

## 七、五種輸出版本格式

### 7.1 Blog 文章版（SEO 導向）

```markdown
---
title: "文章標題（SEO 化）"
slug: "url-friendly-slug"
category: "admission-strategy"
tags: [學習歷程, 備審資料, 特殊選才]
audience: [高中生, 家長]
source_post: "tbd_001"
status: "draft"
created_at: "2026-05-24"
seo_title: "..."
seo_description: "..."
cta: "預約升學策略諮詢"
---

## 前言

## 主體段落 1

## 主體段落 2

## 主體段落 3

## 結語 + CTA
```

### 7.2 Knowledge Base 條目版（官網查詢）

精簡條目，偏問答型，200–400 字。包含：核心說明、適合對象、TBD 協助方式。

### 7.3 FAQ 版（客服 / LINE 自動回覆）

```markdown
Q：問題

A：回答（2–4 句話，直接回答，不迴避）
```

### 7.4 服務頁段落版

可直接嵌入官網服務頁的 50–100 字段落，強調 TBD 切入方式，不用第一人稱。

### 7.5 CTA 導流版

2–3 行短文案，用於官網卡片、文章結尾、LINE 選單。

---

## 八、Astro 目標架構（遷移後）

### 資料夾結構

```
src/
  content/
    blog/
      001-what-do-admission-consultants-do.md
      002-learning-portfolio-mistakes.md
    knowledge/
      admission-consulting.md
      learning-portfolio.md
    faq/
      admission.md
      portfolio.md

  pages/
    blog/
      index.astro          ← 文章列表頁
      [slug].astro         ← 文章詳情頁（自動產生）
    resources/
      index.astro          ← 知識庫列表頁
      [slug].astro         ← 知識庫條目頁
    faq/
      index.astro

  components/
    ArticleCard.astro
    FAQItem.astro
    CTABlock.astro
```

### 關鍵 Astro 功能使用

- **Content Collections**：型別安全的 Markdown 管理，frontmatter 自動驗證
- **動態路由 `[slug].astro`**：從 Markdown 自動產生所有文章頁，不需手動加 config
- **Islands Architecture**：只在需要互動的元件載入 JS（如 Portfolio Guide）

### 遷移策略

1. 現有 HTML partials（nav、footer）→ Astro Layout 元件
2. 現有 `src/config.json` → Astro `site.config.ts`
3. 現有 `build.py` → Astro build（`npm run build`）
4. 現有 CSS（`tbd-*.css`）→ 直接沿用，無需改寫
5. 現有 `pages/*.html` → 逐頁改寫為 `.astro`（可分批進行）

---

## 九、自動化程度規劃

### 階段一：MVP 半自動（現在）

- 人工提供 IG 截圖 → Claude 讀圖萃取 → 產出五種格式 → 人工微調 → 手動放入 HTML
- 不依賴 API，最穩定
- 適合處理既有 20 篇貼文

### 階段二：半自動產檔（遷移 Astro 後）

- Claude 直接輸出 `.md` 檔（含 frontmatter）
- 放入 `src/content/blog/` → git commit → Vercel 自動部署
- 可搭配 Notion MCP 直接存取內容資料庫

### 階段三：完整自動化管線（未來）

```
IG 貼文截圖 / Caption
    ↓
Claude 讀圖 + OCR
    ↓
產出結構化 JSON + Markdown
    ↓
自動寫入 GitHub Repo
    ↓
Vercel 自動部署
    ↓
官網知識庫更新
```

---

## 十、內容管理總表欄位（Notion / Google Sheet）

| 欄位 | 說明 | 範例 |
|------|------|------|
| Post ID | 唯一編號 | tbd_001 |
| 原始 IG 標題 | 貼文標題 | 升學顧問都在做什麼 |
| 官網文章標題 | SEO 化後標題 | 升學顧問都在做什麼？ |
| 分類 | 內容分類 | 升學策略 |
| 受眾 | 目標讀者 | 學生 + 家長 |
| 漏斗階段 | 行銷漏斗位置 | 信任建立 |
| 狀態 | 處理進度 | 待整理 / 草稿 / 已上架 |
| Slug | 網址路徑 | what-do-admission-consultants-do |
| CTA | 導流文案 | 預約升學策略諮詢 |
| 對應服務 | 連結到哪個服務 | 升學策略諮詢 |
| 是否重發 IG | 改寫後是否回發 IG | 是 / 否 |
| 備註 | 待補資料或優化方向 | |

---

## 十一、執行排程

### 第一週：建立格式標準

- 選 3–5 篇代表性 IG 貼文（涵蓋不同分類）
- 走完整個輸出流程一次
- 確認 YAML 欄位與文章語氣
- 建立內容管理總表

### 第二週：批次處理既有內容

- 處理 10–20 篇 IG 貼文
- 每篇產出完整九區塊輸出
- 以 HTML fragment 上架至現有 `src/pages/resources/`

### 第三週：評估遷移時機

- 統計文章數與維護複雜度
- 若達到遷移條件，啟動 Astro 遷移計劃
- 若尚未達到，繼續以 HTML 方式管理

### 第四週：優化與自動化

- 建立 Markdown 產生模板
- 設計批次匯入流程
- 確認 SEO、內部連結與 CTA 效果

---

## 十二、預期成果

完成本計劃後，TBD Studio 將擁有：

1. 可持續運作的 IG 內容再利用流程
2. 一批可上架官網的部落格文章
3. 可查詢的升學知識庫（以分類系統組織）
4. 可用於客服與 LINE 自動回覆的 FAQ 庫
5. 更完整的 SEO 內容基礎
6. 清楚的 Astro 遷移路線圖

---

## 十三、核心原則

> IG 是內容的起點，官網才是內容資產的沉澱地。

- IG 貼文負責社群觸及
- 官網知識庫負責長尾搜尋與品牌信任
- FAQ 負責降低諮詢成本
- LINE 負責轉換成交
