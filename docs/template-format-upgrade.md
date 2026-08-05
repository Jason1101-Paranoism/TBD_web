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

**已拍板：這 17 份一起補，範圍是全部 36 份**（2026-08-05）。

理由與 `TEMPLATE_INVENTORY` §4 選項 X 同一條：同一頁上兩種形式並存，
學生的第一個問題會是「這兩種差在哪」，而誠實的答案是「沒人決定」。

**代價**：工作量約是企劃書原規劃的 **1.9 倍**（19 → 36 份）。企劃書的四人分工與
8 週排程是照 19 份估的，**36 份不可能在 8 週內做完**——排程需要重估，這件事還沒做。

**目標形式未定**：企劃書為 11 個產品指定了形式，這 17 份沒有。逐份決定目標形式
是形式補齊的第一步，不是實作階段才想。初步方向（**未拍板**）：

| 模板 | 份數 | 可能的目標形式 |
|---|---|---|
| `grad-*-school-compare` / `grad-*-lab-compare` | 5 | Google Sheets（比較表天然是試算表，且可加權重計分） |
| `grad-*-oral-checklist` / `grad-*-portfolio-checklist` | 10 | Google Docs 或可列印 PDF（檢核表要能印出來勾） |
| `department-compare-prompt` | 1 | 沿用 Docs；它是 Prompt 公版，形式本來就對 |
| `department-interview-questions` | 1 | Docs（同產品 5 的題庫形式） |

**優先序未定，但 15 份是研究所端這件事值得放在心上**：`TEMPLATE_INVENTORY` §2 記著
研究所端佔資產 72% 且該族群有支付能力。若之後要驗證付費意願，這批是比高中端更合理的起點。

---

## 四、上線順序：已解決

`TEMPLATE_INVENTORY.md` §8 拍板走法 **C** 並已執行（PR #18 → `a44da05`）：
轉址與銷售頁已上正式站，7 份模板押後到形式補齊之後。

**押後期間要看這批東西**：`feat/templates-and-compass-funnel` 的 Vercel preview。
受 SSO 保護，用已登入 Vercel 的瀏覽器可直接開（curl 會被導到 `sso-api`）；
要穩定網址就用 Vercel dashboard 上的 branch alias。本機則 `npm run preview`。
**正式站永遠 29 份、preview 36 份——看到 36 份不代表上線了。**

### 補完形式後會連帶要改的東西

補完後模板**不再是 CSV**，這不只是換檔案：

- `tools.astro` 的下載連結（`.csv` / `.md` 兩個連結的結構要改）
- `src/config/gradTemplates.ts` 的資料結構
- `scripts/verify.mjs` 的模板閘門 —— 目前 `templateFiles()` 掃的是磁碟上的 `.md`，
  改成 Sheets／Notion 之後**磁碟上不會有檔案**，這道閘門會失去事實來源。
  它正是擋住 D-003（20 份模板消失四輪）的那道閘門，換形式時必須同步想清楚
  新的事實來源是什麼，**不能只是把它刪掉**

最後一項是這次形式補齊裡風險最高的技術債，現在就該想，不要等做到一半才發現。

---

## 五、下一步

1. **逐份決定那 17 份的目標形式**（第三節有初步方向，未拍板）
2. **重估排程** —— 36 份不可能照企劃書的 8 週跑完
3. 確認企劃書的四人分工（LR／YC／YY／CL）是否真的可調度——
   六階段 SOP 需要四個角色，缺任一個角色這份清單就執行不了
4. 產品 4 的 Portfolio 版型、產品 8 的 CV 骨架回到階段 1，先產內容
5. 想清楚模板閘門在「模板不再是磁碟檔案」之後的事實來源（見第四節）
