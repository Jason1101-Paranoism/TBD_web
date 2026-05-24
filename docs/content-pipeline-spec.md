# TBD Studio 內容管線規格書

> 版本：v2.0 | 2026-05-25
> 狀態：Astro 遷移已完成，進入半自動產檔階段

---

## 一、計劃目標

將 TBD Studio 既有的 Instagram 圖文貼文，系統化轉化為可搜尋、可累積、可導流、可重複利用的網站內容資產。

核心內容管線：

```
IG 貼文（社群觸及）
    ↓
官網知識庫（長尾搜尋 + 品牌信任）
    ↓
FAQ / 服務頁（降低諮詢成本）
    ↓
LINE / 預約頁（轉換成交）
```

---

## 二、技術架構

### 現況

官網已遷移至 **Astro 5 + MDX Content Collections**。

新增文章只需在 `src/content/articles/` 丟一個 `.mdx` 檔，commit 後 Vercel 自動部署，無需改任何設定。

### 文章路由規則

- 文章檔案：`src/content/articles/{slug}.mdx`
- 產生 URL：`/pages/resources/{slug}.html`
- 知識庫列表：`/pages/resources.html`

### 現有 Content Collection Schema

```yaml
title: string
description: string
kicker: string
lead: string
sidebarCtaText: string
sidebarCtaUtm: string
bottomCtaH2: string
bottomCtaP: string (optional)
bottomCtaUtm: string
tocItems: { href, label }[]
relatedArticles: { badge, title, href, desc }[]
```

---

## 三、內容分類系統

| 分類 | 說明 |
|------|------|
| Side Project | Side Project 定義、類型、開始方式、完整流程 |
| 學習歷程 | 學習歷程主線、三年規劃、資源有無的影響 |
| 備審策略 | 審閱視角、常見問題、反思結構、強申請者特徵 |
| 競賽 | 競賽選擇與延伸 |
| GitHub / Portfolio | GitHub 作品集、README、個人網站 |
| 面試 | 面試準備五件事 |
| 科系指南 | 資工/AI 科系申請 |
| 觀點 | AI 時代執行力等視角文章 |

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
audience:
  - 高中生
  - 家長
funnel_stage: 信任建立           # 引流 / 教育 / 信任 / 成交
core_question: 升學顧問到底能幫學生做什麼？
core_message: 升學顧問不是代寫或包裝，而是協助學生找到定位、規劃策略，並把經歷整理成教授看得懂的故事。
pain_points:
  - 不知道自己適合什麼科系
  - 經歷很多但無法整理成清楚主線
service_connection:
  - 升學策略諮詢
  - 學習歷程整理
seo_keywords:
  - 升學顧問
  - 學習歷程
  - 備審資料
cta:
  primary: 預約升學策略諮詢
  secondary: 查看更多升學準備文章
status: draft                    # draft / review / published
```

---

## 七、MDX 文章輸出格式

Claude 直接產出可放入 `src/content/articles/` 的 `.mdx` 檔：

```mdx
---
title: "文章標題（SEO 化）"
description: "頁面 meta description"
kicker: "分類標籤"
lead: "文章導言（hero 區的摘要段落）"
sidebarCtaText: "側欄 CTA 說明文字"
sidebarCtaUtm: "article-slug"
bottomCtaH2: "底部 CTA 標題"
bottomCtaUtm: "article-slug"
tocItems:
  - href: "#section-1"
    label: "目錄項目"
relatedArticles:
  - badge: "分類"
    title: "相關文章標題"
    href: "/pages/resources/related-slug.html"
    desc: "簡短說明"
---

<section class="article-section" id="section-1">
## 段落標題

段落內容。
</section>
```

---

## 八、自動化程度規劃

### 階段一：MVP 半自動（已完成）

- 人工提供 IG 截圖 → Claude 讀圖萃取 → 產出 MDX 格式 → 人工微調 → commit
- 不依賴 API，最穩定

### 階段二：半自動產檔（現在可執行）

- Claude 直接輸出 `.mdx` 檔（含 frontmatter）
- 放入 `src/content/articles/` → git commit → Vercel 自動部署
- 可搭配 Notion MCP 直接存取內容資料庫

### 階段三：完整自動化管線（未來）

```
IG 貼文截圖 / Caption
    ↓
Claude 讀圖 + OCR
    ↓
產出 MDX 檔（含 frontmatter）
    ↓
自動寫入 GitHub Repo
    ↓
Vercel 自動部署
    ↓
官網知識庫更新
```

---

## 九、內容管理總表欄位

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
| MDX 檔案 | 對應檔案名稱 | src/content/articles/slug.mdx |
| CTA | 導流文案 | 預約升學策略諮詢 |
| 對應服務 | 連結到哪個服務 | 升學策略諮詢 |
| 是否重發 IG | 改寫後是否回發 IG | 是 / 否 |

---

## 十、核心原則

> IG 是內容的起點，官網才是內容資產的沉澱地。

- IG 貼文負責社群觸及
- 官網知識庫負責長尾搜尋與品牌信任
- FAQ 負責降低諮詢成本
- LINE 負責轉換成交
