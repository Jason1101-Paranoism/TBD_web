# TBD Studio 官方網站

> 版本：v1.5 | 最後更新：2026-05-23  
> 現況：P0 / P1 / P2 全數完成，正式上線

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

## 使用方式

直接預覽 / 部署：
- 開啟根目錄 `index.html`
- 或部署到 Vercel（目前使用 `https://tbd-studio.vercel.app`）

開發修改：
1. 修改 `src/pages/` 的內容片段，或 `src/partials/` 的共用區塊
2. 修改 `src/config.json` 的頁面、導覽與站點資訊
3. 執行：

```bash
python build.py
```

系統會重新產生 `index.html`、`pages/*.html`、`pages/resources/*.html`，以及 `sitemap.xml`。

---

## 架構

```txt
.
├─ index.html                  # build 後首頁，可直接部署
├─ pages/                      # build 後子頁，可直接部署
│  ├─ cases.html
│  ├─ services.html
│  ├─ portfolio-guide.html
│  ├─ timeline.html
│  ├─ process.html
│  └─ resources/               # 知識庫（P2 新增）
│     ├─ index.html
│     └─ article-template.html
├─ sitemap.xml                 # build 自動產生
├─ assets/
│  └─ images/
├─ css/
│  ├─ style.css                # CSS 入口
│  ├─ tbd-theme.css            # 品牌色、字體、設計 tokens
│  ├─ tbd-base.css             # body、reset、全站基礎
│  ├─ tbd-layout.css           # nav、footer、全站 layout
│  ├─ tbd-components.css       # button、card、table、timeline、cta
│  └─ tbd-pages.css            # 子頁與首頁差異樣式
├─ js/
│  ├─ main.js                  # mobile menu 等全站互動
│  └─ portfolio-guide.js       # Portfolio Guide 互動邏輯
├─ src/
│  ├─ config.json              # 網站資訊、導覽、頁面 metadata
│  ├─ templates/
│  │  └─ base.html             # 全站 HTML 骨架
│  ├─ partials/
│  │  ├─ head.html             # 共用 head、OG metadata、字體、Tailwind、CSS
│  │  ├─ nav.html              # 共用 navbar
│  │  ├─ footer.html           # 共用 footer
│  │  └─ scripts.html          # 共用 scripts
│  └─ pages/                   # 各頁主要內容片段（維護來源）
│     └─ resources/            # 知識庫頁面片段
├─ build.py                    # 靜態頁面產生器
├─ CLAUDE.md                   # Claude 協作規範
└─ docs/                       # 專案文件與歷史規劃
```

---

## 維護原則

- 要改 navbar：改 `src/config.json` 的 nav 陣列
- 要改 footer：改 `src/partials/footer.html`
- 要新增頁面：新增 `src/pages/xxx.html`，再到 `src/config.json` 加 page 與 nav
- 要新增知識庫文章：複製 `src/pages/resources/article-template.html`，在 config.json 登錄
- 要改品牌色：改 `css/tbd-theme.css`（CSS 變數前綴為 `--tbd-*`）
- 要改卡片、按鈕、表格：改 `css/tbd-components.css`

**重要：** `pages/` 和 `sitemap.xml` 是 build 產物，但需要 commit（Vercel 直接部署 git repo，不跑 build command）。

---

## Navbar（目前 7 項）

官方首頁 / 成功案例 / 服務內容 / Portfolio 指南 / 申請時程 / 合作流程 / 知識庫

---

## 版本紀錄

### v1.5 | 2026-05-23 — P2 完成

- **知識庫系統**：`/resources/` 列表頁 + 文章模板，Navbar 加入「知識庫」
- **CTA UTM Tracking**：5 個頁面 LINE 連結加入 UTM 參數（utm_source=website&utm_medium=cta）
- **build.py 強化**：子目錄頁面支援、sitemap.xml 產生、description 完整性檢查、內部連結存在性檢查

### v1.4 | 2026-05-22 — P1 完成

- **Portfolio Guide 去 Babel runtime**：React CDN + Babel → 純 HTML + vanilla JS
- **服務內容整合頁**：audience / services / plans 三頁合併為 services.html，三章節結構
- **成功案例頁增加 slot**：個人申請與研究所推甄預告卡

### v1.3 | 2026-05-22 — P0 完成

- **Navbar 收斂**：從 9 項精簡為 6 項
- **首頁 H1**：「把零散經歷，整理成教授看得懂的申請策略」
- **主圖本地化**：hero 圖改為 `assets/images/TBD_Landing Page Banner.png`
- **OG Metadata**：canonical + og:* + twitter:card 全數補上，build.py 自動注入

### v1.2 | 2026-05-22 — Claude Skills 規範建立

- 新增 `CLAUDE.md`、`.claude/skills/README.md`、`docs/claude-skills-strategy.md`

### v1.1 — Template System 建立

- 從單頁 Landing Page 進化成 build.py 模板系統
- 加入 `normalize_content()` 防呆，防止雙 nav/footer

---

## 技術注意事項

- 使用 Tailwind CDN（非 PostCSS 編譯版），適合靜態 HTML
- Logo 使用 Google Drive URL，建議未來移至 `assets/` 目錄
- `site_url` 設為 `https://tbd-studio.vercel.app`，部署 domain 若不同需更新 `src/config.json`
- UTM 追蹤需搭配 GA4 才能看到數據，LINE 後台無法直接顯示
