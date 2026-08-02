# WORKLOG

每次交付前寫一則。最新的在最上面。主檔只留最近 15 則，其餘由 `archive-docs.js` 移到 `docs/archive/`。

**只寫可觀察的行為差異。** 「已優化」「更完善」「重構得更清楚」不是變更描述，是形容詞。

---

## 條目模板（複製這段）

```markdown
## #001｜YYYY-MM-DD｜<一句話摘要>

**Scope**：這一輪要做的
**Non-scope**：明確不做的（空著＝還沒想清楚）
**變更檔案**：
- `path/to/file.py` — 做了什麼

**閘門證據**：
- G1 語法：PASS
- G2 boot：PASS（import 零 DB 連線）
- G3 smoke：NOT RUN（無測試 DB）← 寫原因，不要寫「略過」
- G4 migration：N/A（未動 schema）
- 測試：PASS（42 passed）

**計畫／決策異動**：勾掉 PLAN 的哪幾項；新增了 D-0xx 嗎
**風險與待確認**：
**下一步**：            ← 絕對不能空。下次開場的自動簡報只讀這一欄。
```

---

## #003｜2026-08-03｜Week 6 藝術類群落地：5 篇文章＋指南頁＋5 份模板

**Scope**：把 `docs/content-plans/Week6_…藝術類群…md` 轉成知識庫資產，沿用 Week 2–5 的一週一包結構（5 篇分科文＋1 個 Guide 頁＋5 份雙格式模板＋註冊）。
**Non-scope**：既有頁面的視覺調整、新增 IG／Threads 社群素材、Day 1／Day 4 不另寫專屬文（沿用通用文）、規劃文件第十節列的 12 份工具只落地其中 5 份（沿用前四週的五件式工具包，未擴充）。

**變更檔案**：
- `src/content/articles/arts-graduate-{timeline,choose,proposal,cv,oral}.mdx` — 新增 5 篇，`departmentGroup: 藝術`、`gradStage` 2／3／5／6／7、`order` 6.1–6.5，各帶 3 則 faqItems
- `src/content/articles/graduate-contact-professor.mdx` — 新增 `#arts-tips` 區塊與對應 tocItem（Day 4 沿用通用文，同 stem-／biomed-／business-／humanities-tips）
- `src/pages/pages/guides/graduate-arts.astro` — 新增指南頁：路線快篩三卡（改以「作品脈絡／現場表現／創作契合」三問切入，而非人文社科的文字代表作）、七階段 rail、工具包、CTA
- `public/assets/templates/grad-arts-{school-compare,contact-email,proposal-framework,portfolio-checklist,oral-checklist}.{md,csv}` — 新增 5 份模板 × 2 格式
- `src/layouts/ArticleLayout.astro` — `GUIDE_BY_DEPT` 補上 `藝術`
- `src/pages/pages/guides/graduate-application.astro` — `GUIDE_BY_TRACK` 補上 `藝術`（對照表的藝術欄本身是資料驅動，自動長出）
- `src/pages/pages/resources.astro` — 搜尋資料補上藝術指南一筆，註解「五份」改「六份」
- `src/config/resourceCategories.ts` — 匯總卡 desc 補上藝術（五個學群→六個）
- `scripts/verify.mjs` — 新增 2 個測試項（藝術指南頁工具包＋arts-tips 錨點、藝術時程文的分軌 relatedArticles），並在既有兩項的 mustContain 補上 `graduate-arts.html` 與對照表的藝術欄位標題連結

**閘門證據**：
- G1 語法：PASS（`npm run build` 156 頁；上輪 150，+6 = 5 篇文章 + 1 指南頁）
- G2 boot：N/A（靜態站，無 server 端初始化）
- G3 smoke：PASS（`npm run verify` **25/25**，含新增的 2 項）
- G4 migration：N/A（未動 schema，沿用既有 frontmatter 欄位）
- eslint：手動跑過 5 個改動檔，0 error；2 個既有 warning（`ArticleLayout` 的 `b`、`resources.astro` 的 `DIM_NAMES`）與本輪無關，未動。PostToolUse 的 eslint hook 曾回報一次 `spawnSync ETIMEDOUT`，是 spawn 逾時不是 lint 失敗，改用手動執行確認。

**計畫／決策異動**：無新增 D-0xx。`departmentGroup` 採 `藝術`（與 Week 1 的 `設計傳播` 分開，對照表因此有六欄）；命名前綴採 `arts-`，與大學端既有的 `arts-application.mdx`、`pre-college-arts.mdx` 同前綴但不衝突。

**風險與待確認**：
- 人工目視尚未執行（本輪為內容與腳本改動，未動共用樣式；新指南頁沿用 `guide-page` 既有版型與 Week 5 相同的元件）。
- 規劃文件第十節列了 12 份工具資產，本輪只做了對應五階段的 5 份。其餘 7 份（作品盤點與淘汰表、母題發展圖、作品拍攝檢核表、一分鐘創作主張等）多數已內含在這 5 份模板的分節裡，若要獨立成檔需另開一輪。
- 尚未 push；Vercel 正式部署需另行確認。

**下一步**：Week 7 素材到位後同一套結構落地（`docs/content-plans/` 目前最新為 Week 6，需先向使用者確認素材與類群）。另可考慮把「人工目視 1280／375」補做在 Week 5、Week 6 新增的兩個指南頁與 10 篇文章上——已連續兩輪掛帳。

---

## #002｜2026-07-28｜Week 5 人文社科類群落地＋修好會隨機說謊的 verify 閘門

**Scope**：把 `docs/content-plans/Week5_…人文與社會科學類群…md` 轉成知識庫資產，沿用 Week 2–4 的一週一包結構（5 篇分科文＋1 個 Guide 頁＋5 份雙格式模板＋註冊）。過程中 verify 閘門被發現會隨機失敗，一併修掉。
**Non-scope**：Week 6（下一輪）、既有頁面的視覺調整、新增 IG／Threads 社群素材、Day 1／Day 4 不另寫專屬文（沿用通用文）。

**變更檔案**：
- `src/content/articles/humanities-graduate-{timeline,choose,proposal,cv,oral}.mdx` — 新增 5 篇，`departmentGroup: 人文社科`、`gradStage` 2／3／5／6／7、`order` 5.1–5.5
- `src/content/articles/graduate-contact-professor.mdx` — 新增 `#humanities-tips` 區塊與對應 tocItem（Day 4 沿用通用文，同 stem-tips／biomed-tips／business-tips）
- `src/pages/pages/guides/graduate-humanities.astro` — 新增指南頁：路線快篩三卡（改以「文字代表作／限時申論／學術傳統」三問切入，而非商管的系排級距）、七階段 rail、工具包、CTA
- `public/assets/templates/grad-humanities-{school-compare,contact-email,proposal-framework,portfolio-checklist,oral-checklist}.{md,csv}` — 新增 5 份模板 × 2 格式
- `src/config/resourceCategories.ts` — 研究所推甄區新增分學群指南卡（order 8.4）
- `src/layouts/ArticleLayout.astro` — `GUIDE_BY_DEPT` 補上 `人文社科`
- `scripts/verify.mjs` — ①新增 2 個測試項（人文社科指南頁工具包＋humanities-tips 錨點、人文社科時程文的分軌 relatedArticles）；②`fetch` 改走 `fetchHtml()`：明示 `connection: close` + 最多 3 次重試；③Chrome 改走 `runBrowser()`：獨立 `--user-data-dir`、`--no-first-run`、`--no-default-browser-check`、`--disable-extensions`，逾時 30s→45s 並重試一次；④三處 `catch {}` 補上說明註解

**閘門證據**：
- G1 語法：PASS（`npm run build` 150 頁；上輪 144，+6 = 5 篇文章 + 1 指南頁）
- G2 boot：N/A（靜態站，無 server 端初始化）
- G3 smoke：PASS（`npm run verify` **22/22，連續兩次**；修 verify 之前同一份 dist 連跑三次是 12/22、16/22、13/22，失敗集合每次都不同）
- G4 migration：N/A（未動 schema，沿用既有 frontmatter 欄位）

**計畫／決策異動**：新增 D-001（verify 探針改為不重用連線＋獨立 Chrome profile＋重試）、D-002（三處 `catch {}` 改帶註解而非在 eslint 放行 `no-empty`）。後者結清上一輪 WORKLOG 留下的待決事項。

**風險與待確認**：
- verify 的重試會掩蓋「真的變慢」這類問題。之後若 verify 整體耗時明顯拉長，要回頭查是不是重試在補破網，而不是再放寬逾時（見 D-001 後果）。
- 人工目視尚未執行（本輪為內容與腳本改動，未動共用樣式；新指南頁沿用 `guide-page` 既有版型與 Week 4 相同的元件）。
- 尚未 push；Vercel 正式部署需另行確認。

**下一步**：Week 6 同一套結構落地（依 `docs/content-plans/` 是否已有 Week 6 規劃文件而定；目前該目錄最新為 Week 5，需先向使用者確認素材）。另可考慮把「人工目視 1280／375」補做在本輪新增的指南頁與 5 篇文章上。

---

## #001｜2026-07-28｜Week 4 商管與財經類群落地：5 篇文章＋指南頁＋5 份模板

**Scope**：把 `docs/content-plans/Week4_…商管與財經類群…md` 轉成知識庫資產，沿用 Week 2／Week 3 的一週一包結構（5 篇分科文＋1 個 Guide 頁＋5 份雙格式模板＋註冊）。
**Non-scope**：Week 5 人文社科（下一輪）、既有頁面的視覺調整、新增 IG／Threads 社群素材。

**變更檔案**：
- `src/content/articles/business-graduate-{timeline,choose,proposal,cv,oral}.mdx` — 新增 5 篇，`departmentGroup: 商管財經`、`gradStage` 2／3／5／6／7、`order` 4.1–4.5
- `src/content/articles/graduate-contact-professor.mdx` — 新增 `#business-tips` 區塊與對應 tocItem（Day 4 沿用通用文的做法，同 stem-tips／biomed-tips）
- `src/pages/pages/guides/graduate-business.astro` — 新增指南頁：路線快篩三卡、七階段 rail、工具包、CTA
- `public/assets/templates/grad-business-{school-compare,contact-email,proposal-framework,portfolio-checklist,oral-checklist}.{md,csv}` — 新增 5 份模板 × 2 格式
- `src/config/resourceCategories.ts` — 研究所推甄區新增分學群指南卡（order 8.3）
- `src/layouts/ArticleLayout.astro` — `GUIDE_BY_DEPT` 補上 `商管財經`，並補回漏掉的 `生醫`（Week 3 遺漏，導致生醫文的麵包屑指南層回退到通用指南）
- `scripts/verify.mjs` — 新增 2 個測試項（商管指南頁工具包＋business-tips 錨點、商管時程文的分軌 relatedArticles）

**閘門證據**：
- G1 語法：PASS（`npm run build` 144 頁）
- G2 boot：N/A（靜態站，無 server 端初始化）
- G3 smoke：PASS（`npm run verify` 20/20，含新增的 2 項）
- G4 migration：N/A（未動 schema，沿用既有 frontmatter 欄位）

**計畫／決策異動**：無新增 D-0xx。命名前綴沿用學群慣例採 `business-`（與大學端的 `business-application.mdx` 同前綴但不衝突）。

**風險與待確認**：
- `scripts/verify.mjs` 有 3 處既有的 `catch {}` 被 eslint `no-empty` 擋下（行 152／265／267），是刻意的 best-effort 清理，與本輪改動無關，未動。要嘛在 eslint config 對該檔放行 `no-empty`，要嘛改寫成具名 no-op，待決定。
- 尚未 push；Vercel 正式部署需另行確認。

**下一步**：Week 5 人文社科同一套結構落地（`humanities-graduate-*` 5 篇＋`graduate-humanities.astro`＋5 份模板＋`#humanities-tips`＋註冊 order 8.4）。
