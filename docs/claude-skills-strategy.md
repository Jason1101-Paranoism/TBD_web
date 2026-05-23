# Claude Skills Strategy — TBD Studio 官網

> 版本：v1.0 | 2026-05-22  
> 本文件定義 TBD Studio 官網在 Claude 協作過程中的 Skills 使用策略與工作流程。

---

## Recommended Skill Stack

### Core Layer（核心層）

適用範圍：Landing Page、服務頁、品牌頁、案例頁的日常前端修改。

| Skill | 來源 | 說明 |
|-------|------|------|
| `frontend-design` | Anthropic 官方 | HTML/CSS 前端實作的執行層，確保結構語意正確、響應式設計、可維護的 CSS 架構 |
| `taste-skill` | tasteskill.dev | 視覺品味守門員，避免 AI 產生的 generic UI（不必要的卡片 grid、炫技動效、SaaS 模板感） |
| `output-skill` | 搭配 taste-skill | 最終輸出品質確保：無 placeholder、互動狀態完整、空白區塊有內容、視覺完整 |

### Redesign Layer（改版層）

適用範圍：對既有頁面進行整體視覺健診與改善。

| Skill | 來源 | 說明 |
|-------|------|------|
| `redesign-skill` | 搭配 taste-skill | 審查頁面排版問題：間距、層級、CTA 位置、區塊順序。不做無謂的架構重組。 |

### Product UX Layer（產品後台層）

適用範圍：未來學生管理後台、教師媒合、CRM 或設計系統建立。

| Skill | 來源 | 說明 |
|-------|------|------|
| `ui-ux-pro-max` | nextlevelbuilder.io | 複雜產品 UI 規格化，適合 dashboard、資料視覺化、跨頁面一致性規範、表單設計。**不適合 Landing Page**。 |

### Strategy Layer（策略層）

適用範圍：IA 決策、Nav 重組、轉換漏斗分析、使用者旅程規劃。

| Skill | 來源 | 說明 |
|-------|------|------|
| `ux-strategy` | mcpmarket.com | 商業目標與 UX 對齊，適合 onboarding flow、North Star Metric、轉換漏斗設計。**不介入一般 CSS 修改**。 |

---

## When to Use Each Skill

| 任務類型 | 建議啟用 | 不建議搭配 | 注意事項 |
|---------|---------|-----------|---------|
| 首頁 Hero 改版 | `frontend-design`, `taste-skill` | `ui-ux-pro-max`, `ux-strategy` | 保留教育語氣，不要做成 SaaS 風格 |
| 服務頁排版調整 | `frontend-design`, `taste-skill` | `ui-ux-pro-max` | 信任感比炫技重要 |
| 成功案例頁設計 | `frontend-design`, `taste-skill` | `ux-strategy` | 去識別化原則優先 |
| Portfolio Guide 改版 | `frontend-design` | `taste-skill`（可選）| 此頁已改為純 vanilla JS，正常走 build.py |
| 整頁視覺健診 | `redesign-skill` | 不要同時啟用 `ux-strategy` | 先聚焦視覺，策略討論另開 |
| Nav 結構決策 | `ux-strategy`（策略討論）| `redesign-skill` | ux-strategy 給方向，frontend-design 做實作 |
| 單點 CSS 修改 | 不需要任何 skill | — | 直接改 `css/tbd-components.css` |
| 學生後台 UI | `ui-ux-pro-max`, `frontend-design` | `taste-skill`（可省略）| 先跑 design system，再做頁面 |
| 設計系統建立 | `ui-ux-pro-max` | `redesign-skill` | 整站 token 與規格先定義 |
| 轉換漏斗優化 | `ux-strategy` | `frontend-design`（策略階段不改 code）| 先交付策略報告，確認後再開發 |
| Landing Page CTA 文案 | `taste-skill` | `ux-strategy` | CTA 要有溫度，不要商業感過重 |
| 手機版 RWD 修正 | `frontend-design` | — | 優先測試 375px 與 390px |

---

## Recommended Workflow

### 標準前端修改流程（Landing Page / 服務頁 / 品牌頁）

```
1. 讀取 CLAUDE.md → 確認目前架構與禁止事項
2. 讀取受影響的 src/pages/*.html → 理解現有內容結構
3. 啟用 frontend-design → 確保 HTML/CSS 實作品質
4. 啟用 taste-skill → 把關視覺品味，避免 generic UI
5. 完成修改後，列出 changed files
6. 提示使用者執行 python build.py
7. 啟用 output-skill → 最終檢查：無 placeholder、互動完整、手機版正常
```

### 頁面改版流程（針對既有頁面的大範圍改善）

```
1. 啟用 redesign-skill → 先做視覺健診，列出問題清單
2. 與使用者確認改版範圍（避免過度重構）
3. 啟用 frontend-design + taste-skill → 執行改版
4. output-skill 做最終把關
```

### 策略決策流程（IA 重組 / Nav 收斂 / 新功能規劃）

```
1. 啟用 ux-strategy → 分析現況、提出建議（純討論，不動 code）
2. 使用者確認方向
3. 啟用 frontend-design → 執行實作
4. taste-skill + output-skill → 品質把關
```

### 後台 / 設計系統流程（未來才適用）

```
1. 啟用 ux-strategy → 確認後台使用者旅程與功能範圍
2. 啟用 ui-ux-pro-max → 建立 design system tokens 與元件規格
3. 啟用 frontend-design → 按規格實作
4. output-skill → 最終輸出品質確認
```

---

## Project-Specific Rules

### 教育服務網站語氣

- 語氣：專業 + 親切，像「聰明且有溫度的學長姐顧問」，不像 B2B SaaS
- 不用「極致」「全方位」「一鍵搞定」等誇大詞彙
- 描述服務時強調「陪伴」「策略」「可追蹤」而非「功能清單」
- 中文為主，英文 slogan 作為品牌點綴（如 "Define, Design, Deliver"）
- 目標讀者：高中生本人 + 家長，語氣不要太技術性

### Landing Page CTA 設計原則

- 主要 CTA：預約、諮詢、了解更多（行動導向，非購買導向）
- CTA 文案要明確說明下一步（「預約策略諮詢」比「聯絡我們」好）
- 首頁至少兩個 CTA 入口：「看成功案例」（信任建立）+ 「預約諮詢」（轉換）
- 手機版 CTA 按鈕高度至少 44px，便於點擊

### 案例頁與服務頁設計原則

- 信任感來自真實性，不來自設計炫技
- 案例頁需遵守去識別化原則（不放姓名、截圖原圖、可回推個人資訊）
- 服務頁應清楚說明服務範圍、適合對象、合作方式
- 不要用 icon grid 或 feature bullet 代替真實說明文字

### 視覺品味原則

- 不要做得像 SaaS 模板（大量 feature card、pricing table 風格、左圖右文輪替）
- 保留品牌色系：`tbd-dark (#142143)`、`tbd-accent (#1A5D94)`、`tbd-yellow (#FAB748)`
- 不做不必要的動效，現有 hover 效果保留即可
- 圖片佔位：不要放 placeholder 圖片，寧可保留文字區塊

### 手機版優先檢查

- 所有改版完成後，先在 375px 寬度確認排版
- Navbar 收合後可點擊、CTA 可操作
- 長文字不會截斷或溢出

### 不要做的事

- 不要把 TBD Studio 設計成 Notion、Linear 或 Vercel 的感覺
- 不要用卡片堆疊代替清楚的文字敘述
- 不要引入新的 CSS framework 或 JS library
- 不要在沒有被要求的情況下更改文案語氣或品牌調性
- 不要在 build 產物（`pages/`、`index.html`）直接做修改

---

## Skills 部署現況

| Skill | 狀態 | 優先順序 |
|-------|------|---------|
| `frontend-design` | 建議現在安裝 | P0 |
| `taste-skill` | 建議現在安裝 | P0 |
| `output-skill` | 建議現在安裝 | P0 |
| `redesign-skill` | 建議現在安裝 | P1 |
| `ui-ux-pro-max` | 暫緩，後台開發後安裝 | P2 |
| `ux-strategy` | 暫緩，IA 大改版時安裝 | P2 |

---

## 安裝指令（確認後手動執行）

> 以下為建議指令，請確認來源可信後自行執行，不要讓 Claude 自動執行。

```bash
# frontend-design（Anthropic 官方）
# 請參考：https://github.com/anthropics/skills/tree/main/skills/frontend-design

# taste-skill
# 請參考：https://www.tasteskill.dev/

# ui-ux-pro-max（暫緩）
# 請參考：https://ui-ux-pro-max-skill.nextlevelbuilder.io/

# ux-strategy（暫緩）
# 請參考：https://mcpmarket.com/zh/tools/skills/ux-strategy
```
