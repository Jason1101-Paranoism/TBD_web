# 開發 → 驗證 → 部署 SOP

> 目的：把「人類判斷前置、固定介面交接、證據式驗收」這套原則，右尺寸化成適合**這個靜態 Astro 站**的流程。
> 不是照搬大型 App 的 PRD/SDD/Spec/2000-task 重機制——這個專案多半是內容更新與單點前端修改，重點放在**驗證與部署的嚴謹度**，而不是文件量。
>
> 核心信念（來自一次真實事故）：**「build 通過」≠「完成」**。
> TOC 目錄展開按鈕曾因一段 JS 在載入時丟 `SyntaxError` 而整段崩潰，但 `npm run build` 完全通過。
> 那種 bug 只有「在真的瀏覽器裡跑一遍、看有沒有 console error、點點看互動」才抓得到——這就是本 SOP 補的缺口。

---

## 0. 任何一輪改動的固定節奏

```
界定範圍 → 觀察 → 改 → build → 行為驗證(npm run verify) → 證據式回報 → commit → push → 確認部署
```

每一步都不可跳。其中 **build 與行為驗證是兩道獨立的閘門**：build 證明能編譯，verify 證明能在瀏覽器跑。

---

## 1. 界定範圍：先寫 Scope / Non-scope

動手前，先用一句話寫清楚這輪要做什麼、**不做什麼**。Non-scope 比 Scope 更重要——AI（與人）最常見的問題不是做太少，而是「順手」把旁邊的東西也改了。

最小 Scope 卡（複雜改動才需要寫下來，小修改在心裡過一遍即可）：

- **本輪目標**：一句話。
- **Scope**：這輪會碰的檔案／模組。
- **Non-scope**：明確不碰的東西。預設紅線見下。
- **驗收方式**：怎麼證明做完了（通常就是 `npm run verify` + 必要的人工目視）。

### 預設 Non-scope（沿用 CLAUDE.md 禁止清單，未經明確要求一律不做）

- 不重構既有頁面架構、不引入新前端框架（React/Vue/Alpine）。
- 不修改 `dist/`（build 產物）。
- 不在 `css/`（已不存在的舊目錄）寫樣式；CSS 唯一來源是 `public/css/`。
- 不放 placeholder（Lorem ipsum / Coming soon / 待填）、不加無意義 TODO。
- 不在沒被要求下改動現有頁面的文案或樣式。
- 不 commit `.env`。

### 三種操作分級（決定哪些能自動做、哪些要先問人）

| 級別 | 例子 | 規則 |
|------|------|------|
| **可自動執行** | 讀檔、搜尋、`git status`、`npm run build`、`npm run verify` | 不必每次問 |
| **先做但要回報** | 提出技術方案、列出影響檔案、比較兩種實作 | 產出後由人／另一輪驗收再執行 |
| **必須停下來確認** | 改 schema、刪資料、改 production 設定、`.env`、大範圍重構、超出本輪 Scope、`git push` | 一律先確認 |

> 註：本專案 `git push` 會觸發 Vercel 正式部署，故歸在「必須確認」。除非使用者本輪已明確說「commit & push」。

---

## 2. 驗證：build 之外一定要跑 `npm run verify`

```bash
npm run verify            # 先 build 再做行為煙霧測試
npm run verify -- --no-build   # dist 已是最新時，只跑行為測試（較快）
```

`scripts/verify.mjs` 會：起 `astro preview` → 用系統 Chrome/Edge headless（手機寬度 400px）逐頁載入 → 檢查：

1. **每頁載入零 uncaught JS 錯誤**（全站閘門，最便宜也最能擋回歸——TOC 事故就是這類）。
2. **文章目錄 toggle**：初始收合 → 點擊後展開（`display: none → flex` 且加上 `.open`）。
3. **作品集指南選單 toggle**：點擊後展開。

通過才會印「✅ 全部通過，可進入部署」，否則 exit code 非 0。

### 改了會動的東西，就把它加進 verify 的測試清單

`scripts/verify.mjs` 的 `TARGETS` 陣列是受測頁面清單。新增關鍵互動（新的可收合區塊、表單、tab…）時，往那裡加一筆，並在 `harness()` 裡補對應的探針斷言。**讓回歸測試跟著功能長大**，而不是只信任「我這次有手動點過」。

### 仍需人工目視的部分

verify 抓行為與 JS 錯誤，但**抓不到「醜」**。版面、間距、層級、CTA 順序、響應式斷點（375 / 768 / 1280px）仍要人眼看過——必要時用對應 skill（`redesign-skill` / `output-skill`）。

---

## 3. 證據式回報：固定格式

不要只說「修好了」。每一輪結束（尤其交給下一輪或回報給使用者時）用固定欄位，讓人或下一個 AI 能直接驗收、接續：

```
### 變更檔案
- `path`：改了什麼、為什麼

### 驗證
- npm run build：通過 / 失敗（貼關鍵輸出）
- npm run verify：通過 X/Y（失敗項貼出來）
- 人工目視：桌面 1280 / 手機 375 看過哪些頁、結果

### 範圍
- 是否只動了 Scope 內的檔案：是 / 否
- 是否碰到 Non-scope：無 / （說明）

### 待確認 / 風險
- 需要人類拍板的事（若有）

### 下一步建議（若有）
```

對應 CLAUDE.md「修改後的交付格式」，這裡把「驗證」一節強化成 build + verify + 目視三道證據。

---

## 4. 部署：push 前後都要確認

1. 確認在分支或已獲明確授權直接推 `main`（本專案慣例直接 push `main`）。
2. **push 前**：`npm run verify` 必須綠燈。
3. push 後 Vercel 自動 build & deploy（`npm run build` → `dist/`）。
4. **部署後抽查**：等 Vercel 完成，開正式網址確認本次改動的頁面（含手機版）行為正確；必要時 `?ga_debug=1` 驗 GA4 事件。
5. 若正式站行為與本機不符，先懷疑「正式站是否用到最新 commit」（Vercel 部署是否成功、是否有快取）。

---

## 5. 什麼時候才升級成完整文件系統

目前刻意**不**維護 PRD/SDD/Spec 重文件。當出現以下情況再升級（屆時可參考文章方法建立 `docs/templates/`）：

- 開始做**有狀態的後端**（學生管理後台、教師媒合、CRM）。
- 一個需求要拆成大量互相依賴的 Task、需反覆驗收。
- 牽涉資料庫 schema、權限模型、正式資料遷移。

在那之前，本 SOP 的「Scope/Non-scope 卡 + verify 閘門 + 固定回報」就是右尺寸的嚴謹度。
