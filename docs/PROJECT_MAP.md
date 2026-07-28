# PROJECT MAP

**自動產生**（`/detect-requirements`）。這是本專案的權威文件索引 —— 動手前先確認你要改的東西，
真相是不是已經寫在下面某一份裡了。

排序不是裝飾：越上面的，違反它的代價越難回收。

## 3. 設計系統／CIS（前端的唯一真相）

> Design token、色彩、字級、間距、元件規範。**不准硬幹 hex 色碼或魔術數字** —— 一律映射到既有 token。這是前端版的詞彙表：自創一個 `#3B7A9E` 的代價，跟自創一個事件名一樣，事後 grep 不回來。

- `docs/UX_UI_AUDIT.md` (26KB)
- `docs/UX_UI_COMPONENT_AUDIT.md` (9KB)
- `docs/UX_UI_IMPLEMENTATION_PLAN.md` (8KB)
- `public/css/tbd-components.css` (5KB)
- `docs/UX_UI_PAGE_PRIORITY.md` (4KB)
- `public/css/tbd-theme.css` (1KB)

## 5. 需求／規格

> 功能該長什麼樣。動手前確認你做的是這裡寫的東西。

- `docs/strategy/TBD-AI-First-Impression-Strategy-企劃書-v3.1.md` (18KB)
- `docs/strategy/TBD-AI-Knowledge-Navigator-企劃書-v3.md` (14KB)
- `docs/content-pipeline-spec.md` (6KB)

## 6. 驗收條件／檢查表

> 「做完了」的定義在這裡，不在你的感覺裡。

- `docs/WEB_REVIEW_V3_GRAD_CHECKLIST.md` (7KB)

## 8. 流程規範

> 怎麼做事。含紅線與禁止清單。

- `CLAUDE.md` (12KB)
- `docs/dev-workflow.md` (8KB)

---

重新產生：`/detect-requirements --write`
