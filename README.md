# TBD Studio 官方網站

> 版本：v1.3 | 最後更新：2026-05-22  
> 現況：P0 優化完成，正朝 P1 推進中

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
- 或部署到 GitHub Pages、Netlify、Vercel

開發修改：
1. 修改 `src/pages/` 的內容片段，或 `src/partials/` 的共用區塊
2. 修改 `src/config.json` 的頁面、導覽與站點資訊
3. 執行：

```bash
python build.py
```

系統會重新產生 `index.html` 與 `pages/*.html`。

---

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
│  └─ pages/                   # 各頁主要內容片段（維護來源）
├─ docs/                       # 專案文件
│  └─ claude-skills-strategy.md
├─ build.py                    # 靜態頁面產生器
├─ CLAUDE.md                   # Claude 協作規範
└─ updatePlan_260519.md        # 2026-05-19 現況評估報告
```

---

## 維護原則

- 要改 navbar：改 `src/partials/nav.html` 或 `src/config.json`
- 要改 footer：改 `src/partials/footer.html`
- 要新增頁面：新增 `src/pages/xxx.html`，再到 `src/config.json` 加 page 與 nav
- 要改品牌色：改 `css/tbd-theme.css`
- 要改卡片、按鈕、表格、時間軸：改 `css/tbd-components.css`

---

## 版本紀錄

### v1.3 | 2026-05-22 — P0 優化完成

完成 updatePlan_260519.md 的四項 P0 任務：

- **Navbar 收斂**：從 9 項精簡為 6 項（官方首頁、成功案例、服務內容、Portfolio 指南、申請時程、合作流程）
- **首頁 H1**：改為「把零散經歷，整理成教授看得懂的申請策略」，副標與 slogan 同步更新
- **主圖本地化**：hero 圖從 Google Drive thumbnail 改為 `assets/images/TBD_Landing Page Banner.png`
- **OG Metadata**：`head.html` 加入 canonical、og:title/description/image/url、twitter:card；`build.py` 自動注入；`config.json` 新增 `site_url`、`og_image`

### v1.2 | 2026-05-22 — Claude Skills 規範建立

新增：
- `CLAUDE.md`：Claude 協作規範、skills 分工說明
- `.claude/skills/README.md`：本專案 skills 組合說明
- `docs/claude-skills-strategy.md`：完整 skills 策略文件

### v1.1.2 | 2026-05-22 — 成功案例頁更新

新增：
- `pages/cases.html`：去識別化成功案例頁
- 首頁 `#cases` 區塊從 placeholder 改成真實案例設計區塊
- `src/config.json` 新增「成功案例」導覽項目

去識別化原則：不放學生姓名、Email、LINE 截圖原圖、可回推個人的細節；保留案例類型、週期、方法、Before/After 與錄取成果。

### v1.1.1 — Navbar 修正

修正子頁 logo 變超大問題。原因是模板化時子頁仍保留舊版完整 HTML，導致雙 navbar。

修正項目：
- `src/pages/*.html` 改為純內容片段
- `build.py` 加入 `normalize_content()` 防呆
- 保留 `src/partials/nav.html` 作為唯一 navbar 來源

### v1.1.0 — Template System 建立

從單頁 Landing Page 進化成 template system。

---

## 下一步優先順序（來自 updatePlan_260519.md）

> 詳細說明見 `updatePlan_260519.md`

### P0｜已完成 ✓

1. ✅ **收斂 Navbar**：6 項（官方首頁、成功案例、服務內容、Portfolio 指南、申請時程、合作流程）
2. ✅ **首頁 H1**：「把零散經歷，整理成教授看得懂的申請策略」
3. ✅ **主圖本地化**：`assets/images/TBD_Landing Page Banner.png`
4. ✅ **OG Metadata**：canonical + og:* + twitter:card 全數補上

### P1｜兩週內（提升正式感）

5. **Portfolio Guide 去 Babel runtime**：React CDN + Babel standalone 換成純 JS tab/accordion
6. **服務內容整合頁**：收斂適合對象 / 服務項目 / 服務方案，目前三頁仍獨立存在但不在 nav
7. **成功案例頁增加 slot**：Featured Case + 多個類型 slot

### P2｜之後（品牌與成長）

8. 資源文章系統（備審 / 特殊選才 / 面試 FAQ）
9. CTA UTM tracking
10. `build.py` 增加 sitemap / robots / 連結檢查

---

## 技術注意事項

- 目前使用 Tailwind CDN（非 PostCSS 編譯版），適合靜態 HTML 但生產環境有效能限制
- Portfolio Guide 頁仍使用 React CDN + Babel standalone，短期可接受，中期建議移除
- Logo 使用 Google Drive URL（非本地資產），建議移至 `assets/` 目錄
- `site_url` 設為 `https://tbd-studio.vercel.app`，部署 domain 若不同需更新 `src/config.json`
