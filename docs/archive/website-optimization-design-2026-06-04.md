# TBD Studio 官網優化設計規格
> 日期：2026-06-04 | 方案：Wave A（兩波次執行）

---

## 範圍

共 10 項優化，分兩波執行。Wave 1 為獨立、低風險的點修；Wave 2 為結構性改動，需要完整測試。

---

## Wave 1 — 快速修改（5 項）

### W1-1 Nav 標籤：「關於」→「關於TBD」

**受影響檔案：**
- `src/config/site.ts` 第 21 行：`label: '關於'` → `label: '關於TBD'`
- `public/pages/portfolio-guide.html` 第 68 行（桌面導覽）、第 99 行（手機導覽）：hardcoded nav 連結文字同步更新

**注意：** portfolio-guide.html 為獨立靜態頁，nav 不透過 site.ts 讀取，需手動更新。

---

### W1-2 Hero Slogan 粗體

**受影響檔案：**
- `src/pages/index.astro` 第 25 行

**變更：**
```
// Before
class="mt-1 text-xs text-tbd-mid/70 font-mono tracking-wider"

// After
class="mt-1 text-xs text-tbd-mid/70 font-bold tracking-wider"
```

移除 `font-mono`（等寬字體），換成 `font-bold`，保留 `tracking-wider`。

---

### W1-3 Footer 社群連結換 Icon

**受影響檔案：**
- `src/components/Footer.astro`
- `src/config/site.ts`（新增 `instagramUrl`）

**變更：**

1. `site.ts` 新增：
```ts
instagramUrl: 'https://www.instagram.com/_tbd_studio/',
```

2. `Footer.astro` 第 17 行：
   - 移除 `👉` emoji
   - 將 LINE 按鈕改為 SVG icon + 文字的 pill 樣式
   - 新增 Instagram 連結（SVG icon + 文字）

視覺：兩個社群連結並排（flex-wrap），使用各自品牌 SVG icon（LINE 綠色 `#06C755`、Instagram 使用 `currentColor`），按鈕 class 維持 `site-footer-pill`。

---

### W1-4 知識庫文章副標題色

**受影響檔案：**
- `public/css/tbd-pages.css` 第 108 行

**變更：**
```css
/* Before */
.article-section h2 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--tbd-dark); }

/* After */
.article-section h2 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem; color: #5c5f72; }
```

`#5c5f72` 明度介於 `--tbd-dark (#142143)` 與 `--tbd-mid (#767995)` 之間，強化標題 → 副標 → 內文三層層級。

---

### W1-5 Portfolio 指南卡片 Padding 統一

**受影響檔案：**
- `public/pages/portfolio-guide.html`（約第 237–258 行的 3 張卡片）
- `public/pages/portfolio-guide.html`（約第 786 行底部 CTA 說明文字）

**變更：**
- 三張卡片：icon → 標題間距 `mt-4` → `mt-3`（與標題 → 內文的 `mt-3` 統一）
- 底部 CTA：說明文字 `mt-3` → `mt-4`（加大按鈕與說明文字的視覺分離）

---

## Wave 2 — 結構型改動（5 項）

### W2-1 CTA 按鈕全站一致化

**問題：** Homepage Tailwind 按鈕用 `rounded-md`（8px 圓角），sub-pages `.button` class 用 `border-radius: 999px`（pill）。Hover 效果也不一致（homepage `hover:opacity-90` vs sub-pages 無 hover）。

**方向：以 sub-pages 的 pill 樣式為統一標準。**

**受影響檔案：**
- `public/css/tbd-components.css` 第 2 行：`.button` 補上 `transition: opacity .15s;`
- `public/css/tbd-components.css`：新增 `.button:hover { opacity: .88; }`
- `src/pages/index.astro`：Hero 區兩個 CTA 按鈕（「先看成功案例」、「預約策略諮詢 →」）改為 `rounded-full`，統一 hover 行為

---

### W2-2 Cases Before/After 列點

**問題：** `.case-ba ul` 沒有明確設定 `list-style`，bullet 視覺依賴瀏覽器預設，實際渲染不夠清楚。

**受影響檔案：**
- `public/css/tbd-pages.css` 第 46 行（`.case-ba ul` 規則）

**變更：**
```css
/* Before */
.case-ba ul { margin: 0; padding-left: 1.2em; color: var(--tbd-mid); }

/* After */
.case-ba ul { margin: 0; padding-left: 1.4em; color: var(--tbd-mid); list-style: disc; }
```

適用範圍：「特殊選才」與「大學個人申請」兩個 Tab 的 Before / After 區塊。

---

### W2-3 Services 方案卡片列點

**問題：** `.card` 的 ul 沒有 list-style 設定，方案 A/B/C/D 的項目符號不顯示。

**受影響檔案：**
- `public/css/tbd-components.css`（`.card` 規則之後新增）

**新增：**
```css
.card ul { list-style: disc; padding-left: 1.25rem; margin: 8px 0 0; }
.card li { margin-bottom: 4px; color: var(--tbd-mid); font-size: 0.9rem; }
```

---

### W2-4 知識庫側欄分兩區塊

**問題：** `resources.astro` 側欄「文章分類」與「主題指南」雖有 `margin-top: 24px` 間隔，但層級區分不夠明確。

**受影響檔案：**
- `src/pages/pages/resources.astro`（第 36–37 行之間）
- `public/css/tbd-pages.css`（新增 `.sidebar-divider`）

**變更：**
- 在兩個 `<nav>` 之間插入 `<hr class="sidebar-divider">`
- CSS 新增：
```css
.sidebar-divider { border: none; border-top: 1px solid var(--tbd-line); margin: 16px 0 20px; }
```

---

### W2-5 FAQ 改 Accordion（`<details>/<summary>`）

**方法：** 原生 HTML `<details>/<summary>`，零 JS，CSS transition 補強開合動畫。

**受影響檔案：**
- `src/pages/pages/faq.astro`：全部 `.faq-item` 結構改為 `<details>/<summary>` 包裝
- `public/css/tbd-pages.css`：新增 FAQ accordion 樣式

**HTML 結構（每個問題）：**
```html
<details class="faq-item">
  <summary class="faq-summary">問題標題</summary>
  <div class="faq-body">
    <p>回答內容</p>
  </div>
</details>
```

**CSS 新增（取代現有 .faq-item 規則）：**
- 移除 `<summary>` 原生 marker（`list-style: none`）
- 自訂右側箭頭 icon（CSS 偽元素，open 狀態旋轉 90deg）
- `.faq-body` 用 `padding-top` 控制與問題的間距
- `<details>` open 狀態下背景輕微 highlight

**注意：** `faqSchema`（JSON-LD）結構不受影響，維持現有 FAQPage schema。

---

## 測試要點

```
Wave 1:
1. npm run build — 無錯誤
2. 確認 Nav 顯示「關於TBD」（桌面 + 手機）
3. Hero slogan 呈現粗體（非等寬）
4. Footer 兩個社群連結有正確 icon（LINE/IG）、連結正確
5. 知識庫文章副標題色為 #5c5f72（非深藍黑）
6. Portfolio 指南三張卡片 padding 一致

Wave 2:
1. npm run build — 無錯誤
2. 首頁與子頁面 CTA 按鈕圓角一致（pill style）、hover 淡出
3. Cases Before/After 列點清楚顯示
4. Services 方案卡片列點清楚顯示
5. 知識庫側欄兩個分類之間有分隔線
6. FAQ 點擊問題後展開，再點擊收合，箭頭旋轉
7. 測試桌面（1280px）與手機（375px）
```
