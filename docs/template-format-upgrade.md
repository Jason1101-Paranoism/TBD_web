# 模板形式補齊工作清單

> 拍板日期：2026-08-05｜決策正本：`TEMPLATE_INVENTORY.md` §7
> 來源企劃：`TBD知識庫轉工具模板銷售企劃_0804`（Google Doc）11 個產品
>
> **決定：全面補齊企劃書指定的交付形式。** 不是只補含公式的三份。
>
> 這份文件放在 repo 內是刻意的——`MONETIZATION_PLAN.md` 與 `TEMPLATE_INVENTORY.md`
> 目前在 `D:\New folder\TBD\` 根目錄、不在任何 repo 裡，沒有版控。本清單會被多人反覆改，
> 不能重蹈那個覆轍。

---

## 一、要補的是哪一段

企劃書的 6 階段 SOP：

```
1 內容規劃(LR) → 2 邏輯校準(YC) → 3 系統架設(LR) → 4 視覺執行(YC規劃→YY) → 5 UX檢核(CL) → 6 商業包裝(YC)
   ▲ 已完成                        ▲———————— 要補的是這裡開始 ————————————————————▲
```

現有 36 份 CSV+MD 等於**階段 1 的產出**（核心血肉：評估維度、提問結構、學術框架、語法公版）。
階段 2 有沒有跑過沒有紀錄。階段 3 之後**完全沒跑**——現況的 CSV 不是「毛胚版」，
是內容稿存成了表格檔。

---

## 二、11 個產品的形式落差

「現況檔名」皆位於 `public/assets/templates/`，每份為 `.csv` + `.md` 兩檔。

| # | 產品 | 現況檔名 | 現況形式 | 目標形式 | 補什麼（階段 3 起） |
|---|---|---|---|---|---|
| 1 | 升學管道戰力評估與決策雷達圖 | `admission-channel-radar` | CSV（批次 B，未上線） | Google Sheets | 三管道權重計分公式、雷達圖物件、勾選式填答區、分頁 |
| 2 | 學習歷程「反思」寫作引導 | `portfolio-reflection-guide` | CSV（批次 B，未上線） | Google Forms → Docs | 表單化 3 種反思結構、表單自動匯出文件的串接、AI Prompt 串接 |
| 3 | 備審故事線與亮點挖掘畫布 | `admission-main-thread` | CSV（**已上線**） | Google Slides | 可拖曳便利貼、畫布底圖、4 步驟分區與引導提示語 |
| 4 | GitHub README 與 Portfolio 包 | `readme-portfolio-planner` | CSV（批次 B，未上線） | 靜態網頁版型 ＋ Docs | **Portfolio 靜態網站版型本身尚不存在**；README Markdown 公版；無痛部署說明書 |
| 5 | 2 分鐘面試自介框架＋題庫 | `interview-answer-material` | CSV（批次 B，未上線） | Google Docs | 文件目錄跳轉、自介填空骨架、焦慮安撫微文案 |
| 6 | 系統性面試準備六層防護網 | `interview-six-layer-prep` | CSV（批次 B，未上線） | Notion 模板 | 六層關聯資料庫、多視圖、Icon／封面／欄位配色 |
| 7 | Side Project 企劃與執行追蹤板 | `side-project-tracker` | CSV（批次 B，未上線） | Google Sheets | Kanban 下拉選單、進度條、條件式格式、欄寬 |
| 8 | 研究計畫書大綱＋學術 CV | `grad-{arts,biomed,business,engineering,humanities}-proposal-framework`（5 份） | CSV（**已上線**） | Google Docs | 學術排版（字級階層、縮排、1.5 行距、隱藏框線）；**CV 表格骨架目前不存在** |
| 9 | 套磁信 Email 模板 | `grad-{...}-contact-email`（5 份） | CSV（**已上線**） | Google Docs | 變數區塊視覺標註、防呆格式、三種情境分節 |
| 10 | 研究所推甄時程倒數與甘特圖 | `graduate-timeline-gantt` | CSV（批次 B，未上線） | Google Sheets | 單一日期回推全時程的公式、甘特圖、紅黃綠期限警示 |
| 11 | 準大學生 30 天衝刺日誌本 | `pre-college-30day-checklist` | CSV（**已上線**） | Docs／可列印 PDF | **範圍擴大**：現況是 checklist，企劃書要的是 30 天日誌本（每日鼓勵語、可手寫排版） |

### 兩份「目標形式需要新做、不是轉換」

產品 4 的 **Portfolio 靜態網站版型**、產品 8 的 **學術 CV 表格骨架**——
現況的 CSV 裡沒有對應內容，不是換檔案格式就有的。這兩項要回到階段 1（LR 內容規劃）。

產品 11 是**範圍擴大**：從一份 checklist 變成 30 天日誌本，工作量不是排版。

---

## 三、企劃書沒有涵蓋的 17 份

36 份裡只有 19 份對應到企劃書的 11 個產品。剩下 17 份**沒有指定目標形式**：

| 模板 | 份數 |
|---|---|
| `department-compare-prompt`、`department-interview-questions` | 2 |
| `grad-*-oral-checklist` | 5 |
| `grad-*-portfolio-checklist` | 5 |
| `grad-*-school-compare`（arts／business／humanities） | 3 |
| `grad-*-lab-compare`（biomed／engineering） | 2 |

**這 17 份要不要一起補，尚未決定。** 不決定的後果是可預期的：同一頁上 19 份是
Sheets／Slides／Notion、17 份是 CSV，會重演 `TEMPLATE_INVENTORY` §4 選項 X 的問題
——學生問「這兩種差在哪」，而誠實的答案是「沒人決定」。

注意這 17 份有 15 份是研究所端，而 `TEMPLATE_INVENTORY` §2 記著研究所端佔資產 72%
且該族群有支付能力。要補的話，這批的優先度不見得比高中端低。

---

## 四、與上線順序的衝突

見 `TEMPLATE_INVENTORY.md` §8。一句話：批次 B 的 7 份現在**同時**是
「待上線」與「待補形式」，兩者不能同時做。走法 A／B／C 尚未選。

其中 5 份（產品 1、2、5、6、7、10 中的批次 B 項目）補完形式後**不會再是 CSV**，
意味著 `tools.astro` 的下載連結、`gradTemplates.ts` 的資料結構、
以及 `verify.mjs` 的斷言都要跟著改——不只是換檔案。

---

## 五、下一步

1. 選定 `TEMPLATE_INVENTORY` §8 的走法 A／B／C（這一項阻塞其他所有事）
2. 決定第三節那 17 份要不要一起補
3. 確認企劃書的四人分工（LR／YC／YY／CL）是否真的可調度——
   六階段 SOP 需要四個角色，缺任一個角色這份清單就執行不了
4. 產品 4 的 Portfolio 版型、產品 8 的 CV 骨架回到階段 1，先產內容
