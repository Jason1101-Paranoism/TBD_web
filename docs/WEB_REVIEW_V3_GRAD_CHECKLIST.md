# 知識庫 v3 Web Review 執行清單（研究所推甄系列）

> 來源：知識庫v3 Google Doc（4 分頁：通用軌文章／理工軌文章／設計指南總覽／理工指南總覽）
> 範圍：研究所推甄系列（兩個分群總覽 + 通用軌/單科軌文章，邏輯適用推甄全系列文章）
> 日期：2026-07-06

---

## A. Review 指出、但現況已符合（不動，留證據）

| # | Review 建議 | 現況證據 |
|---|------------|---------|
| A1 | 文末 CTA 是純文字，需深色區隔＋Primary 按鈕 | `.cta` 已是深藍卡片（`--tbd-dark`）＋黃色 primary＋白框 secondary（tbd-components.css:20-23） |
| A2 | 內文 line-height 1.6–1.8 | `.article-section p` 已 1.75（tbd-pages.css:128） |
| A3 | 引言/麵包屑灰字對比不足 | `--tbd-mid` 前次 UX 稽核已調至 #6A6D89（4.9:1，過 WCAG AA；tbd-theme.css:3 註解） |
| A4 | Footer Email/LINE 缺底線與 hover | 已有 underline + offset 4px + hover 變黃（tbd-layout.css:76-77） |
| A5 | 引言 max-width 768px | `.sub-page .lead` 已 760px |
| A6 | FAQ 點擊範圍要含整列 | `<summary>` 本身即整列可點 |
| A7 | 按鈕觸控 48px | `.button` min-height 48px（tbd-components.css:2） |
| A8 | Timeline 標題垂直對齊被大數字破壞 | rail 用 grid 固定欄寬（`--railnum`），標題本就對齊同一基準線；不採絕對定位方案 |
| A9 | 系列導覽 hover 回饋 | `.button:hover` 已有 translateY(-2px) |
| A10 | Hero 分類標籤要 chip 化（padding 4px 12px＋淺底） | `.kicker` 已是 pill chip（tbd-components.css:7） |

## B. 採納執行

### P0
- [x] **B1** 文章底部 CTA 移除「回知識庫」（範圍：`category === '研究所推甄'` 的文章；避免轉換節點選擇超載）→ `ArticleLayout.astro`
- [x] **B2** 兩個指南總覽 CTA：「回知識庫」→「看研究所推甄服務」secondary → `graduate-design.astro`、`graduate-engineering.astro`
- [x] **B3** 理工總覽「階段 4 套磁要點」整段移出 → `graduate-contact-professor.mdx` 新增 `#stem-tips`〈理工專屬重點〉section（含 3 要點＋套磁模板下載）；總覽 rail 階段 4 連結指向 `#stem-tips` 錨點 → `graduate-engineering.astro`
- [x] **B4** 通用軌 `rs-tag` 辨識強化：font-weight 600（色碼已過 AA，不再加深——review 建議的 #737373/#6A6A6A 對比反而低於現值）→ `tbd-pages.css`

### P1
- [x] **B5** `graduate-timeline.mdx`「大三下」「暑假」兩節：粗體小標＋段落 → 列點（內容不變）
- [x] **B6** Mid-point inline CTA：兩篇時程文第 2 個 H2 section 後插入 `.guide-inline-cta`（重用既有元件，帶 `-inline` UTM）
- [x] **B7** 文章引言升級摘要卡：`.article-hero .lead` 淺底＋左側 4px 品牌色邊框 → `tbd-pages.css`
- [x] **B8** 文章 H2 節奏：`.article-section` margin-bottom 2.5rem → 3rem（48px）
- [x] **B9** FAQ：summary hover 底色＋展開 0.25s 過場（含 prefers-reduced-motion 豁免）→ `tbd-pages.css`
- [x] **B10** TOC 展開鈕 hitbox：min-height 44px（僅手機顯示）→ `tbd-pages.css`
- [x] **B11** Footer 移除重複的「Line ID」列（下方已有加入 LINE pill）→ `Footer.astro`
- [x] **B12** 理工總覽模板區更名「理工推甄專屬工具包」；套磁模板「看使用說明」指向 `#stem-tips`（其餘 4 篇理工子文已內嵌下載，雙軌配置已閉環）
- [x] **B13** 文章 Meta bar：H1 下方顯示「TBD Studio 編輯團隊 · 更新於 YYYY 年 M 月」（updatedDate ?? publishDate，全文章生效）→ `ArticleLayout.astro` + CSS

### P2（輕量採納）
- [x] **B14** 兩個指南 CTA 信任微文案「線上進行、不代寫，過程文件可追蹤」→ ✓ 三項並列樣式（`.cta-trust`）

## C. 不採納／延後（理由）

| # | Review 建議 | 處置 | 理由 |
|---|------------|------|------|
| C1 | Sticky 側欄目錄＋手機 FAB | 延後 | 與知識庫首頁既有決策一致（Sticky TOC 延後）；成本中 |
| C2 | 預估閱讀時間 | 延後 | Astro layout 拿不到 slot 內文字數，需另建 remark 統計 |
| C3 | 指定色碼（#F4F7F9、#737373、深藍等） | 不採 | 一律映射既有 `--tbd-*` token，不引入新色；部分建議色對比低於現值 |
| C4 | li 圓點改自訂 SVG icon | 不採 | 與站上簡潔風格不符，維持原生列點 |
| C5 | 大數字絕對定位＋透明度 5–8% | 不採 | 現有 grid 已達成其目的（標題對齊）；數字色 `--tbd-light` 已是低權重 |
| C6 | 8pt 網格全域重排 | 不採（局部採 B8） | 全域間距重排屬大改版，逾越本輪 scope |

## D. 寫入 SOP 的規範（未來新文章遵循）

1. **3 段落規則**：連續純文字段落 ≤ 3；並列資訊一律列點或表格。
2. **Mid-point CTA**：文章超過 3 個 H2 時，第 2 個 H2 section 後插入 `.guide-inline-cta`（UTM：`article-<slug>-inline`）。
3. **Terminal CTA**：底部 CTA 維持深色卡片元件；推甄系列不放「回知識庫」。
4. **模板雙軌配置**：總覽頁工具包展示＋對應子文內文情境化下載，兩邊都要有。

## E. Verification Gates（缺一不可）

| Gate | 內容 | 通過標準 |
|------|------|---------|
| G1 | `npm run build` | 零錯誤 |
| G2 | `npm run verify`（擴充後） | 全數通過；新增測項見下 |
| G3 | dist 靜態斷言（併入 G2 的 mustContain/mustNotContain） | `graduate-timeline.html`：含 `guide-inline-cta`、不含「回知識庫」；`graduate-contact-professor.html`：含 `id="stem-tips"`＋套磁模板連結；`graduate-engineering.html`：含「理工推甄專屬工具包」＋`#stem-tips` 連結、不含舊 `id="contact-tips"` |
| G4 | 對比度 | 只用既有 token，無新色；`--tbd-mid` 4.9:1 維持 |
| G5 | 手機 RWD | verify 探針 docOverflow ≤ 1px（既有全頁閘門） |

verify.mjs 擴充：TARGETS 支援 `mustContain` / `mustNotContain`（對 preview 回傳的 HTML 做靜態斷言），並新增 `graduate-timeline.html`、`graduate-contact-professor.html` 兩個目標頁。
