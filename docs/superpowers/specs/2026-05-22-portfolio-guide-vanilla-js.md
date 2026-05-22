# Portfolio Guide：移除 Babel Runtime 設計文件

**目標：** 將 `portfolio-guide` 頁從 React CDN + Babel standalone 改成純靜態 HTML + vanilla JS，保留所有視覺與互動行為。

**核心決策：** 長頁捲動 + sticky 側邊欄 TOC，取代原本的 tab 切換（每次只顯示一個 section）。所有 section 靜態存在頁面中，SEO 可讀。

---

## 架構

### 變更檔案

| 檔案 | 類型 | 說明 |
|------|------|------|
| `src/pages/portfolio-guide.html` | 完整改寫 | 移除 React/Babel，改成靜態 HTML |
| `js/portfolio-guide.js` | 新增 | 所有互動邏輯 |
| `src/partials/scripts.html` | 確認不改 | build.py 的 `{{scripts}}` 目前是全站共用，portfolio-guide.js 直接內嵌在 portfolio-guide.html 底部 |

> `portfolio-guide.js` **不透過** scripts partial 注入，直接在頁面底部 `<script src="../js/portfolio-guide.js"></script>` 載入，避免影響其他頁面。

---

## HTML 結構

```html
<section class="portfolio-guide-page">
  <div class="pg-layout">  <!-- max-w-7xl, two-col grid on desktop -->

    <!-- 左側：sticky TOC -->
    <aside class="pg-sidebar">
      <!-- 手機版：展開/收合按鈕 -->
      <button class="pg-toc-toggle" aria-expanded="false">
        目錄 <span class="pg-toc-arrow">▾</span>
      </button>
      <!-- TOC nav（桌面永遠顯示，手機收合） -->
      <nav class="pg-toc-nav" id="pgTocNav">
        <div class="pg-toc-header">
          <p>Guide Menu</p>
          <h2>Portfolio 指南</h2>
        </div>
        <a href="#home"      class="pg-toc-link">首頁</a>
        <a href="#concept"   class="pg-toc-link">Portfolio 是什麼</a>
        <a href="#step"      class="pg-toc-link">從 0 開始建立</a>
        <a href="#templates" class="pg-toc-link">架構模板</a>
        <a href="#tools"     class="pg-toc-link">工具指南</a>
        <a href="#cases"     class="pg-toc-link">真實案例</a>
        <a href="#mistakes"  class="pg-toc-link">常見錯誤</a>
        <a href="#resources" class="pg-toc-link">精選資源</a>
        <a href="#faq"       class="pg-toc-link">FAQ</a>
      </nav>
    </aside>

    <!-- 右側：主內容 -->
    <main class="pg-content">
      <section id="home">...</section>
      <section id="concept">...</section>
      <section id="step">...</section>
      <section id="templates">...</section>
      <section id="tools">...</section>
      <section id="cases">...</section>
      <section id="mistakes">...</section>
      <section id="resources">...</section>
      <section id="faq">...</section>
      <!-- prompt generator -->
      <!-- bottom CTA -->
    </main>

  </div>
</section>

<script src="../js/portfolio-guide.js"></script>
```

---

## 互動元件設計

### 1. Scroll-spy（TOC highlight）

用 `IntersectionObserver` 偵測各 section 進入 viewport，更新對應 `.pg-toc-link` 的 `is-active` class。

```js
// 每個 section 觀察，進入時 highlight 對應 TOC link
const observer = new IntersectionObserver(onIntersect, {
  rootMargin: "-20% 0px -70% 0px"
});
document.querySelectorAll(".pg-content section[id]").forEach(s => observer.observe(s));
```

### 2. 手機 TOC 展開收合

`.pg-toc-toggle` 按鈕控制 `#pgTocNav` 的 `is-open` class。點擊 TOC 連結後自動關閉。

```js
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => nav.classList.remove("is-open"))
);
```

### 3. Tool selector（工具指南）

5 個工具（Notion / Carrd / Framer / GitHub Pages / Vercel）。HTML 中各工具有一個 `<div data-tool="notion">` 等。按鈕切換時：
- 移除所有工具 panel 的 `is-active`
- 為對應 panel 加 `is-active`
- 更新按鈕 active 狀態

```js
document.querySelectorAll("[data-tool-btn]").forEach(btn => {
  btn.addEventListener("click", () => {
    const tool = btn.dataset.toolBtn;
    document.querySelectorAll("[data-tool]").forEach(p =>
      p.classList.toggle("is-active", p.dataset.tool === tool)
    );
    document.querySelectorAll("[data-tool-btn]").forEach(b =>
      b.classList.toggle("is-active", b.dataset.toolBtn === tool)
    );
  });
});
// 預設顯示 notion
document.querySelector('[data-tool-btn="notion"]').click();
```

### 4. Cases 欄位切換

同 Tool selector 模式。3 個欄位（engineering / social / design），各有 `[data-case]` panel 與 `[data-case-btn]` 按鈕。預設顯示 engineering。

### 5. FAQ accordion

使用原生 `<details>/<summary>`，瀏覽器原生支援，**不需要任何 JS**。樣式透過 CSS 控制開合動畫。

```html
<details class="pg-faq-item">
  <summary class="pg-faq-question">沒有大獎也能做好 Portfolio 嗎？</summary>
  <p class="pg-faq-answer">可以。Portfolio 重點不是炫耀成果...</p>
</details>
```

### 6. Prompt Generator

表單欄位：姓名、主線、Situation、Action、Result（對應現有 sandboxName/Line/Pain/Action/Result）。

「產生 Prompt」按鈕：讀取表單值 → 組合兩份 template（STAR 結構 + Polish Prompt）→ 顯示在 `<pre>` 區塊，並顯示 toast。

「複製」按鈕：`navigator.clipboard.writeText()` + fallback（textarea + execCommand）→ 顯示 toast。

```js
generateBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  // ... 組合 prompt 字串（同現有邏輯）
  outputEl.textContent = prompt;
  showToast("Prompt 已產生，可以複製使用。");
});
```

### 7. Toast 通知

固定位置浮動元素，顯示 2.6 秒後消失。

```js
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}
```

---

## Step Accordion（從 0 開始建立）

7 個步驟使用原生 `<details>/<summary>`，不需要 JS。每個步驟包含：
- summary：步驟標題
- 說明段落
- tip
- example
- checklist（ul）

---

## 內容保留原則

所有現有文字內容（steps、tools、cases、faqs、prompt template 字串）**完整保留，一字不改**。只是從 JS 資料結構改成靜態 HTML。

---

## CSS

現有 `tbd-pages.css` 加入 `.pg-*` 系列 class：
- `pg-layout`：桌面雙欄 grid（260px sidebar + 1fr content），手機單欄
- `pg-sidebar`：sticky top-24，桌面顯示
- `pg-toc-nav.is-open`：手機展開狀態
- `pg-toc-link.is-active`：藍底白字（同現有 active tab 樣式）
- `[data-tool].is-active`、`[data-case].is-active`：show/hide
- `pg-faq-item`：details/summary 樣式

---

## 不在範圍內

- 視覺設計調整（class、顏色、間距全部沿用現有）
- 內容修改
- 其他頁面
- build.py 修改
