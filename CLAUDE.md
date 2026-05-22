# CLAUDE.md — TBD Studio 官網 Claude 協作規範

> 本文件定義 Claude 在這個專案中的工作方式、Skills 使用原則與前端修改規範。  
> 所有 Claude 會話開始時請先讀這份文件。

---

## 專案背景

這是 TBD Studio 的靜態官網，定位為**教育服務 Landing Page + 品牌官網**。

- 使用者：高中生、大學生、家長
- 主要流量來源：IG Bio、LINE 官方選單、口碑轉介
- 技術棧：純 HTML + Tailwind CDN + 自訂 CSS + build.py 模板系統
- 未來可能延伸：學生管理後台、教師媒合、CRM

---

## 第一原則：觀察先於行動

**修改前必須做的事：**

1. 閱讀 `README.md` 與 `updatePlan_260519.md` 了解現況與優先順序
2. 確認受影響的檔案（`src/pages/` 是維護來源，`pages/` 是 build 產物）
3. 修改 `src/` 後執行 `python build.py` 重新產生
4. 不要修改 `pages/` 底下的 build 產物，應改 `src/` 再 build

**禁止行為：**

- 不要任意重構整個專案架構
- 不要引入新的框架（React、Vue、Alpine）除非明確被要求
- 不要在 HTML 放 placeholder 文字（"Lorem ipsum"、"Coming soon"、"待填"）
- 不要新增無意義的 TODO 或未完成的 UI 區塊
- 不要在沒有被要求的情況下修改現有頁面的內容或樣式

---

## Skills 分工說明

### 核心層（Landing Page / 服務頁 / 品牌頁）

| Skill | 用途 |
|-------|------|
| `frontend-design` | HTML/CSS 前端實作、元件設計、響應式排版 |
| `taste-skill` | 確保視覺有品味，避免 generic AI UI |
| `output-skill` | 最終輸出品質把關：無 placeholder、互動狀態完整 |

這三個 skills 在一般前端修改任務中可同時啟用。

### 改版層（針對既有頁面的視覺審查與改善）

| Skill | 用途 |
|-------|------|
| `redesign-skill` | 審查排版問題、間距、層級、CTA 順序，適合頁面健診 |

啟用時機：對某一頁進行全面視覺改善（非單點修改）。不要在每次小改動都啟用。

### 後台 / 設計系統層（未來才需要）

| Skill | 啟用時機 |
|-------|---------|
| `ui-ux-pro-max` | 學生管理後台、教師媒合後台、CRM、設計系統、跨頁面 UI 規範、複雜表單 |

**不要把 ui-ux-pro-max 當成 Landing Page 的美化工具**。Landing Page 不是 dashboard，不需要這個層級的規格。

### 策略層（IA 決策時才需要）

| Skill | 啟用時機 |
|-------|---------|
| `ux-strategy` | 資訊架構調整、Nav 收斂、使用者旅程、轉換漏斗、onboarding flow、KPI 設定 |

**不要讓 ux-strategy 介入一般 CSS 或元件修改**。它是策略顧問，不是視覺工具。

---

## 什麼情況不要同時啟用太多 Skills

| 情況 | 建議 |
|------|------|
| 改一個按鈕顏色 | 不需要任何 skill，直接改 CSS |
| 改一段文案 | 不需要 skill，直接改 HTML |
| 增加一個新 section | `frontend-design` + `taste-skill` |
| 做整頁視覺健診 | `redesign-skill` 單獨啟用 |
| 新增後台功能 | `ui-ux-pro-max` |
| 重新規劃 Nav 結構 | `ux-strategy` 先行，再交給 `frontend-design` 實作 |
| 同時啟用 4 個 skills | 避免，會產生矛盾指令 |

---

## 前端修改原則

### 樣式層級

```
css/tbd-theme.css     ← 品牌色、字體、設計 tokens
css/tbd-base.css      ← reset、全站基礎
css/tbd-layout.css    ← nav、footer、全站 layout
css/tbd-components.css ← button、card、table、timeline、cta
css/tbd-pages.css     ← 各頁差異樣式
```

- 修改按鈕 → `tbd-components.css`
- 修改品牌色 → `tbd-theme.css`
- 修改某一頁特定樣式 → `tbd-pages.css`
- 不要把新樣式寫進 `style.css`（它只是 CSS 入口）

### HTML 修改

- `src/pages/` 是維護來源，永遠改這裡
- `src/partials/` 是共用區塊（nav、footer、head）
- 改完後必須執行 `python build.py`
- 不要直接修改 `pages/*.html` 或 `index.html`（build 產物）

### 例外：portfolio-guide.html

`src/pages/portfolio-guide.html` 與 `pages/portfolio-guide.html` **必須同時手動維護**，不走 `build.py`。

原因：此頁嵌入 React CDN + Babel standalone，頁面本身就是完整 HTML（含 nav、footer），不符合模板系統的內容片段架構。`build.py` 的模板機制不適用於此頁。

規則：
- 修改此頁時，`src/pages/portfolio-guide.html` 與 `pages/portfolio-guide.html` **兩份都要改**，保持同步
- 不要讓兩份出現內容差異，否則部署版（`pages/`）與來源版（`src/pages/`）會不一致
- 長期目標：移除 Babel runtime，改成純 JS（參考 `updatePlan_260519.md` P1 問題 4）

### 教育服務語氣

- 語氣專業但親切，不生硬、不像 SaaS 行銷文案
- 不要過度強調功能列表，要有溫度感與陪伴感
- 避免「一鍵解決」、「極致體驗」等誇大詞彙
- CTA 應明確但不強迫（「預約策略諮詢」比「立即購買」好）
- 信任感來自案例的真實性，不來自設計炫技

---

## 修改後的交付格式

每次修改完成後，Claude 應回報：

```
## 修改內容

### 變更檔案
- `src/pages/xxx.html`：說明改了什麼
- `css/tbd-components.css`：說明改了什麼

### 未修改
- `pages/`：build 產物，需手動執行 build.py 重新產生

### 測試方式
1. 執行 `python build.py`
2. 開啟 `index.html` 或對應的 `pages/xxx.html`
3. 測試桌面版 (1280px) 與手機版 (375px)
4. 確認 CTA 按鈕可點擊、nav 正常顯示
```

---

## 禁止清單（不需要討論，直接拒絕）

- 新增 React、Vue、Alpine.js 到現有頁面
- 在 `src/partials/head.html` 加入未經確認的第三方 JS
- 把 Landing Page 設計成 SaaS 模板風格（大量卡片、icon grid、feature list）
- 移除或覆蓋現有內容，改成 AI 生成的 placeholder
- 在沒有明確要求的情況下修改 `build.py` 核心邏輯
- 下載或執行第三方安裝腳本
