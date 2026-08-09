# PLAN

回答一個問題：**還剩什麼。**

SessionStart hook 會讀這份文件，找出**編號最小、還有未勾選項目**的 Phase，注入成開場簡報。所以：

- 用 `## Phase N — 標題` 當段落標題（順序有意義）
- 項目用 `- [ ]` / `- [x]`（hook 只認這個格式）
- 做完就打勾。**改計畫要寫理由** —— 一個被默默改掉的計畫，等於沒有計畫

> **這份文件在 2026-08-09 才第一次填。** 在此之前它是空模板，待辦散在
> `WORKLOG.md` 每則的「下一步」、`docs/template-format-upgrade.md` §5，以及
> **不在任何 repo 內**的 `D:\New folder\TBD\MONETIZATION_PLAN.md` 與 `TEMPLATE_INVENTORY.md`。
> 開場簡報因此一直接不上實際進度。下面是把那些來源收斂成的單一正本；
> 各項後面的括號標出原始出處，方便回頭查脈絡。

---

## Phase 0 — 界定範圍

- [x] 要解決的問題：讓學生與家長在做升學決策時，找得到一份講得清楚、不誇大的方法說明，並能從中判斷是否需要顧問協助（見 `CLAUDE.md`）
- [x] **不做什麼**：不做 SaaS 模板風格的行銷站、不引入前端框架、不放 placeholder、不在未被要求時改既有頁面內容或樣式（紅線清單見 `CLAUDE.md`、`docs/dev-workflow.md`）
- [x] 成功長什麼樣、怎麼驗證：`npm run build` ＋ `npm run verify`（headless 行為煙霧測試）雙閘門全綠，且**驗收一律打正式站 URL**——push 與上線是兩件事（見 WORKLOG #015）

## Phase 1 — 骨架

- [x] 技術棧：Astro 5 ＋ MDX Content Collections ＋ Tailwind CDN ＋ 自訂 CSS，Vercel 部署
- [x] 內容模型：`src/content/articles` 的 frontmatter schema（`src/content/config.ts`）
- [x] 單一資料來源機制：`src/config/gradTemplates.ts`（D-003）、`resourceCategories.ts`、`pricing.ts`（D-006）
- [x] 閘門：`npm run build`、`scripts/verify.mjs`（D-004 埠檢查、D-005 死連結、`checkVercelJson`、D-008 模板 manifest）

## Phase 2 — 分學群研究所系列

- [x] Week 1 設計傳播（僅指南頁，無模板）
- [x] Week 2 理工 ／ Week 3 生醫與公衛 ／ Week 4 商管財經 ／ Week 5 人文社科 ／ Week 6 藝術
- [x] Week 7 教育（2026-08-09，PR #19 → `77fde0a`，已在正式站）
- [ ] Week 8 之後的學群：`resources.astro` 的 `deptOrder` 已預留「法政」「農生環境」
      —— **卡在沒有週次規劃 md**，內容不能憑空生成，需先有限動素材
- [ ] 設計傳播補上五份模板（目前是六個學群裡唯一沒有工具包的，tools 頁以一句話帶過）

## Phase 3 — 模板形式補齊（36 份）

正本：`docs/template-format-upgrade.md`（2026-08-05 拍板全面補齊，非只補 19 份）

- [x] 想清楚「模板不再是磁碟檔案」之後閘門的事實來源（2026-08-09，D-008；原 §5 第 5 項）
- [ ] 逐份決定那 17 份企劃書沒涵蓋的目標形式（§3 有初步方向，**未拍板**）
- [ ] 重估排程 —— 企劃書的 8 週是照 19 份估的，36 份跑不完
- [ ] 確認四人分工（LR／YC／YY／CL）是否真的可調度；六階段 SOP 缺任一角色就執行不了
- [ ] 產品 4 的 Portfolio 靜態網站版型、產品 8 的學術 CV 骨架 —— 這兩項要回到內容規劃階段，不是換檔案格式
- [ ] 形式補完後連帶要改：`tools.astro` 的下載連結結構、`gradTemplates.ts` 的資料結構
      （閘門那一項已由 D-008 解決，改成 external 時走 manifest）

## Phase 4 — 付費線與 compass 漏斗

- [x] 站內轉址出口上線（D-007；`/pages/placement.html` 307 → compass，2026-08-09 正式站實測通過）
- [x] 銷售頁與 `pricing.ts` 對齊拍板結果（WORKLOG #014）
- [ ] compass 那側把 `hasAccess()` 接到接手包，並實刷過一筆金流
- [ ] 上一項完成後：拿掉 `/pages/compass.html` 的 `noindex`，並把它加進 `site.ts` 的 nav（WORKLOG #012 的下一步）
- [ ] 押後的 7 份模板上線（走法 C 的設計，跟著 Phase 3 一起走）

## Phase 5 — 文件治理

- [ ] `MONETIZATION_PLAN.md` 與 `TEMPLATE_INVENTORY.md` 目前在 `D:\New folder\TBD\` 根目錄、
      **不在任何 repo 內、沒有版控**，但它們是定價與模板盤點的正本，且會被多人反覆改。
      要決定搬進哪個 repo（或建一個 docs repo）
- [ ] 企劃書（Google Doc `TBD知識庫轉工具模板銷售企劃_0804`）的定價段落與 D-006 衝突，
      **2026-08-05 決定延後討論、風險維持開著**——那份 Doc 仍是團隊手上的執行依據，仍會有人照著做

---

## 慣例

**一個 Phase 一個交付。** Phase 大到需要拆成兩次交付，就是兩個 Phase。

**延後的項目要留在原地，標註理由與日期**，不要刪掉：

```markdown
- [ ] P2-5 真檔案上傳（延後 2026-07-10；預設連結制，見 D-023）
```

刪掉它，你會在三個月後重新想一次同一件事。
