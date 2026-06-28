---
name: tbd-seo-meta
description: >
  TBD Studio 知識庫文章的中文 SEO meta 撰寫與審查規範。每當在這個專案新增、改寫或
  審查 src/content/articles 下的 .mdx 文章，或處理 title / seoTitle / description /
  publishDate、調整 SERP 顯示、做 SEO 優化、或懷疑中文標題被 Google 截斷時，請使用本
  skill。它涵蓋中文 SERP 截斷的「視覺寬度」判斷、description 改寫公式、seoTitle 縮短原則、
  publishDate 慣例，以及中文粗體會失效的 flanking 陷阱。即使使用者只說「優化這篇的 meta」
  或「描述太短」也應觸發。
---

# TBD 中文 SEO meta 規範

這份 skill 把 TBD Studio 官網實際做過的一輪知識庫 SEO 優化固化下來。核心觀念只有一個：
**中文 SERP 的截斷看「視覺寬度」，不是字數。** 一個中文字約佔兩個英數字的寬度，所以
`GitHub`、`Side Project`、`README` 這類半形詞用 `len()` 數會嚴重高估長度。先用寬度思考，
其餘規則都從這裡長出來。

> 寬度定義：中文等寬字元算 2、英數與半形標點算 1。

## 先跑檢查腳本

動手改之前先看現況，改完再驗一次：

```bash
python .claude/skills/tbd-seo-meta/scripts/check_meta.py            # 全部文章
python .claude/skills/tbd-seo-meta/scripts/check_meta.py src/content/articles/<slug>.mdx
```

它會標出會被截斷的 title/seoTitle、偏短或用半形標點的 description、缺 `publishDate`、以及
CJK 粗體陷阱。`❌` 是要處理的、`⚠️` 是建議。改完務必再跑 `npm run build` 確認 schema 通過。

## description 改寫

目標寬度 **150–180**（約 75–90 個中文字；含較多半形詞時碼點數會更高，以寬度為準）。
中文桌機 SERP 約 **160 寬**就填滿摘要，所以 150–180 是甜蜜點：太短會浪費版位、CTR 偏低；
超過約 **210** 尾端會明顯被截（180–210 之間還可接受，關鍵字務必前置、手機也會顯示較完整）。

公式（三段）：
1. **首句點出對象/情境痛點**，用問句或場景開場，並讓**主關鍵字**自然出現在前段。
2. **中段說明本文具體拆解什麼**（承接內文重點，不是喊口號）。
3. 守教育語氣：專業而親切、有溫度、不誇大；禁用「一鍵」「極致」「保證上榜」「立即」。

硬規則：
- 標點一律**全形**（，。？——「」），不要半形逗號句號。
- **嚴格忠於文章內容**：不得新增文章沒講的主張、數字、承諾。寫「四個迷思」「五大類型」前，
  先回去數內文標題確認數字對得上——這是這個專案最容易出錯、也最不能犯的地方。

**範例（舊 → 新）**

舊：四個家長最常有的誤解，以及家長真正能幫上忙的事情。（太短、只是條列）
新：家長在孩子升學備審中常因不熟悉現行制度，無意間讓準備方向走偏。本文整理四個最常見的備審迷思——從盲目追營隊、比賽到代勞文件，並說明家長真正能幫上忙、和孩子站在同一個方向的做法。

舊：書審委員的閱讀方式、評審在問的三個核心問題，以及讓備審真正有效的關鍵特徵。
新：教授第一次看備審可能只花 30 秒。本文還原書審委員的閱讀方式與評估邏輯，拆解評審心中真正在問的三個核心問題，並指出讓備審在前 30 秒就被認真讀下去的關鍵特徵。

## seoTitle

桌機標題寬度約 60 就截斷，而「｜TBD Studio」品牌後綴就佔約 13 寬，所以描述部分只剩 ~47。

- 寬度壓到 **≤62**。
- **主關鍵字前置、品牌結尾**，分隔符統一用 `｜`（不要同時出現 `|` 和 `-`）。
- 列舉最多兩三項就好，冗長的「、A、B、C、D」要砍。
- 沒寫 `seoTitle` 時 SERP 會用 `title`，所以 `title` 太長同樣要顧。

**範例**：`商管財經科系升大學前準備：Excel、簡報、案例分析與小專案｜TBD Studio`（寬 67，截）
→ `商管財經科系升大學前準備：試算表、簡報與案例分析｜TBD Studio`（寬 60）

首頁等品牌頁同理：關鍵字前置，例如
`升學申請策略顧問：讓選擇變清楚、路徑可驗收｜TBD Studio`。

## publishDate / datePublished

文章 frontmatter **必填 `publishDate: YYYY-MM-DD`**（[src/content/config.ts](../../../src/content/config.ts)
的 schema 為 `z.coerce.date()`，缺了會 build 失敗）。需要時可加 `updatedDate`（選填）。
[ArticleLayout.astro](../../../src/layouts/ArticleLayout.astro) 會把它們輸出成 Article JSON-LD 的
`datePublished` 與 `dateModified`（`dateModified` 在沒填 `updatedDate` 時 fallback 為 `publishDate`）。

回填既有文章的發布日，用 git 首次提交日（truthful）：
```bash
git log --diff-filter=A --format=%ad --date=short -- src/content/articles/<slug>.mdx | tail -1
```

## CJK 粗體 flanking 陷阱

內文 `**粗體**` 若**結尾的 `**` 緊貼一個標點（）」)等）、後面又接中文字**，CommonMark 的
delimiter flanking 規則會讓粗體無法閉合，網頁直接顯示字面 `**`，看起來像格式跑掉。

- 壞：`**考試（如 X）**的…`、`**[主線](url)**意味著…`（粗體包連結也會踩到，連結結尾是 `)`）
- 好：把標點移到 `**` 外 →`**考試**（如 X）的…`；或粗體包連結時直接拿掉粗體
  （內文連結在 tbd-pages.css 已是 accent 色 + 粗體，本來就夠醒目）
- 反例（正常）：`**完整性**意味著`（結尾貼中文字）、`**重點：**`（結尾後接標點）都沒問題

`check_meta.py` 會掃出這類風險行；批量驗證可在 build 後 grep `dist/pages/resources/*.html`
的文章本文，殘留字面 `**` 應為 0。

## 收尾檢查清單

- [ ] `check_meta.py` 無 `❌`
- [ ] `npm run build` 通過（116 頁）
- [ ] 新文章 frontmatter 有 `publishDate`、`category`、`order`
- [ ] description 數字/列舉與內文一致（沒虛構）
