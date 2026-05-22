# TBD Studio 官方網站｜Template System 版

這版把官方網站整理成「可直接部署」與「可維護模板來源」並存的靜態網站。

## 使用方式

直接預覽 / 部署：
- 開啟根目錄 `index.html`
- 或將整包上傳到 GitHub Pages、Netlify、Vercel、一般虛擬主機

開發修改：
1. 修改 `src/pages/` 的內容片段，或 `src/partials/` 的共用區塊。
2. 修改 `src/config.json` 的頁面、導覽與站點資訊。
3. 執行：

```bash
python build.py
```

系統會重新產生：
- `index.html`
- `pages/*.html`

## 架構

```txt
.
├─ index.html                  # build 後首頁，可直接部署
├─ pages/                      # build 後子頁，可直接部署
├─ css/
│  ├─ style.css                # CSS 入口
│  ├─ tbd-theme.css            # 品牌色、字體、設計 tokens
│  ├─ tbd-base.css             # body、reset、全站基礎
│  ├─ tbd-layout.css           # nav、footer、全站 layout
│  ├─ tbd-components.css       # button、card、table、timeline、cta
│  └─ tbd-pages.css            # 子頁與首頁差異樣式
├─ js/
│  └─ main.js                  # mobile menu 等全站互動
├─ src/
│  ├─ config.json              # 網站資訊、導覽、頁面 metadata
│  ├─ templates/
│  │  └─ base.html             # 全站 HTML 骨架
│  ├─ partials/
│  │  ├─ head.html             # 共用 head、字體、Tailwind、CSS
│  │  ├─ nav.html              # 共用 navbar
│  │  ├─ footer.html           # 共用 footer
│  │  └─ scripts.html          # 共用 scripts
│  └─ pages/                   # 各頁主要內容片段
└─ build.py                    # 靜態頁面產生器
```

## 維護原則

- 要改 navbar：改 `src/partials/nav.html` 或 `src/config.json`。
- 要改 footer：改 `src/partials/footer.html`。
- 要新增頁面：新增 `src/pages/xxx.html`，再到 `src/config.json` 加一筆 page 與 nav。
- 要改品牌色：改 `css/tbd-theme.css`。
- 要改卡片、按鈕、表格、時間軸：改 `css/tbd-components.css`。

## 這版處理目標

- Navbar 不只內容一致，而是由同一份 partial 產生。
- Footer、head、scripts、CSS tokens 也共用。
- 保留純 HTML 輸出，避免導入 React / Vite 後增加部署與維護成本。


## v1.1.1 Navbar 修正

本版修正子頁 logo 變超大的問題。原因不是單純 logo 尺寸，而是模板化時子頁內容仍保留舊版完整 HTML，導致頁面內出現第二組舊 navbar；舊 navbar 的 logo class 沒有套用新版 `.site-logo` 尺寸限制，因此在桌面版會被原始圖片尺寸撐大。

修正項目：
- `src/pages/*.html` 改為純內容片段，不再包含 `<!doctype>`、`<head>`、舊版 `<header>`、舊版 `<footer>`。
- `build.py` 加入 `normalize_content()` 防呆，未來即使誤貼完整 HTML，也會自動抽出主要內容。
- 保留新版共用 `src/partials/nav.html` 作為唯一 navbar 來源。


## 2026-05-22 成功案例頁更新

本版新增：
- `pages/cases.html`：去識別化成功案例頁。
- 首頁 `#cases` 區塊：已由 placeholder 改成真實案例設計區塊。
- `src/pages/cases.html`：案例頁模板來源。
- `src/config.json`：新增「成功案例」導覽項目。

去識別化原則：
- 不放學生姓名、Email、LINE 截圖原圖、完整文件連結或可回推個人的細節。
- 保留案例類型、合作週期、方法模組、Before/After 與錄取成果。
- 首頁使用設計化 case block，不使用原始對話截圖。
