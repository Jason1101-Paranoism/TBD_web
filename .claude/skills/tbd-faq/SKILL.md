---
name: tbd-faq
description: >
  TBD Studio 知識庫文章「要不要加 FAQ、怎麼加」的判準與寫法。每當在 src/content/articles
  下新增或審查文章、決定是否加 faqItems、撰寫 FAQ 問答、或處理 FAQPage 結構化資料時，請用
  本 skill。它定義 FAQ 的資格判準（哪些文章值得加、哪些該跳過）、品質紅線（不虛構、不重述內文）、
  以及在本專案的實作方式（frontmatter faqItems → 自動渲染 FAQ 區塊 + FAQPage schema）。
  即使使用者只說「幫這篇加 FAQ」也應觸發。
---

# TBD FAQ 建置判準（Build Criteria）

FAQ 是 **opt-in**：frontmatter 有填 `faqItems` 才渲染。**不是每篇都要加。** 亂加會變 filler、
互相稀釋、違反 CLAUDE.md「不新增無意義區塊」。先過資格,再談品質。

## SEO 現實（先設定期待）

Google 自 2023 起把 FAQ 複合式搜尋結果限縮到政府/衛生類權威站,**一般教育站放 FAQPage schema
在 SERP 上不會再出現那排問答**。所以加 FAQ 的價值 **不是** 換版位,而是:
- 內容深度、涵蓋「延伸/長尾」查詢
- 被 People-also-ask 與 AI 摘要取用的機會

→ 因此 FAQ 只有在「答的是內文沒答、而讀者真的會問的問題」時才有意義。

## 資格判準（GATE：全部符合才加）

1. **類型對**：決策/比較型、how-to/準備型、家長向、制度/管道說明。
   （觀念型、單一主題短文、純清單文通常不適合。）
2. **寫得出 ≥3 題**「內文本身沒有直接回答」的真實問題。若問題答案已在內文,別搬進 FAQ。
3. **每題答得出 grounded 答案**：有內文或可靠常識支撐,**不虛構**數字、日期、截止時間、名額。
4. **同分類不重複**：同主題群的文章,FAQ 不要彼此雷同（會製造近重複內容,反傷 SEO）。

任一條不過 → **不加**（維持沒有 `faqItems`）。寧缺勿濫。

## 品質紅線

- **不虛構**:沒把握的數字/時程/規定就用相對說法(「越早越好」「以簡章為準」),不要編。
- **不重述內文**:FAQ 補的是內文的縫隙(邊界情況、常見誤解、「我這種情況呢」)。
- **自足**:每個答案 2–4 句,不看內文也讀得懂;不要「詳見上文」。
- **語氣**:專業而親切,不誇大;禁「一鍵/保證上榜/立即」。標點全形。繁體中文。
- **題數**:3–5 題為宜,最多不超過 6。

## 好問題的來源(挑這些角度)

- 邊界:「我不是這類學生也適用嗎?」「跨考/轉領域可以嗎?」
- 時機:「多久前開始?」(用相對說法)
- 常見誤解:「是不是一定要 X?」
- 比較:「A 和 B 差在哪、我該選哪個?」
- 家長:家長會問、但跟學生視角不同的實務題。

## 實作(本專案)

1. frontmatter 加(放在 `bottomCtaUtm:` 之後、`tocItems:` 之前):
   ```yaml
   faqItems:
     - q: 問題？
       a: 答案（2–4 句，全形標點）。
   ```
2. `tocItems` **最後**補一筆:
   ```yaml
     - href: "#faq"
       label: 常見問題
   ```
3. 其餘全自動:[ArticleLayout.astro](../../../src/layouts/ArticleLayout.astro) 有填 `faqItems` 就渲染
   文末 FAQ 區塊(`<details>` 手風琴,內容留在 DOM 利於 SEO)並注入 FAQPage JSON-LD;schema 在
   [config.ts](../../../src/content/config.ts) 已定義 `faqItems: {q,a}[]` optional。
4. **不用寫 HTML/CSS**:FAQ 版型與 RWD 已在 `tbd-pages.css` 的 `.faq-item` 處理好(320px 實測不溢出)。

## 收尾

- `npm run build` 通過(schema 驗 faqItems 格式)。
- 抽查 `dist/pages/resources/<slug>.html`:`"@type":"FAQPage"` 存在、Question 數 = 題數、可見 `常見問題`。
- meta/標題另見 [[seo-meta-skill]] 的 tbd-seo-meta;圖片引用見 tbd-image-citation。
