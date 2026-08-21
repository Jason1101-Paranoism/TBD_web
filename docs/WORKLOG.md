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

## #025｜2026-08-21｜設計傳播五份補齊、正本升 shipped；順手修好一道一直是瞎的埠防護（D-012）

**做了什麼**（可觀察的行為差異）：

- **設計傳播工具包從 1 份補到 5 份**，`/pages/guides/graduate-design.html` 的
  「設計推甄專屬工具包」現在五份都渲染得出來，`/pages/resources/tools.html` 也跟著長出來：
  - `grad-design-contact-email`：設計套磁的獨有難處是「作品最有說服力、也最容易被誤讀」。
    模板把重點放在**作品怎麼附**（精選版連結、每件一句話定位、不寄完整作品集），
    另有「該不該寄」的判斷條件與八項寄信前檢核。
  - `grad-design-proposal-framework`：先分學術研究型 vs 實務創作型，再填四大架構；
    實務型另有「創作如何回答問題」專段，含一格「什麼結果會讓我知道方向不成立」——
    說不出失敗長什麼樣就不是探究，是執行。
  - `grad-design-portfolio-checklist`：選件少而深、排序、作品說明六欄位，
    並用一整段逼出「作品集與研究計畫互相指涉」。
  - `grad-design-oral-checklist`：三分鐘作品簡報、四類追問題庫，
    以及設計口試特有的「被當場講評」四種情境的該做／不該做。
- **`graduate-contact-professor.mdx` 補上 `#design-tips`**。八個學群裡原本只有設計沒有
  專屬段落，套磁模板的 article 連結沒有落點。補完後八群齊。
- **`scripts/grad-departments.json` 的設計傳播 `guide-only` → `shipped`**，
  現況變成 shipped 8 ／ planned 1（農生環境）。
- **verify 的設計那條斷言從抽驗一份改成五份逐一列出**，並加驗 `#design-tips` 錨點。
  分批補的東西最容易漏掉中間某一份，抽驗一個擋不住。
- **修好 `portInUse()`（D-012）**：原本只探 `127.0.0.1`，而 Astro dev server 只綁 `[::1]`，
  所以這道 D-004 立的防護**從來沒擋過 Astro dev server**。本輪實際踩到：
  另一個 repo 的 dev server 還活著 → 防護放行 → preview 綁不到埠 → 36 個探針全打到別人的站，
  得到 1/36 全 404 的假失敗。改成兩個位址都探，並實測「占用時確實會擋下來」。

**憑什麼說做完了**（閘門證據）：

| 閘門 | 結果 | 證據 |
|---|---|---|
| build | PASS | 169 頁，無錯 |
| `npm run verify` | PASS | **36/36**，含強化後的設計五份＋`#design-tips` 斷言 |
| `check-grad-departments` | PASS | 正本／`gradTemplates.ts`／`template-manifest.json`／`dist` 四方一致（shipped 8／planned 1） |
| `check-markdown-leak` | PASS | 172 頁 0 處外漏（新增四份模板的 md 不經 mdx 管線，但仍全站掃過） |
| `check-links` | PASS | 0 死連結 |
| CSV BOM | PASS | 四份新 CSV 皆帶 BOM、CRLF、固定 4 欄（verify 內建檢查） |
| D-012 的修正 | PASS | 故意占住 4321 後重跑，防護正確擋下並印出提示；釋放後 36/36 |
| 正式站 | **NOT RUN** | 本輪未 push。合併後要打正式站 URL 複驗（push ≠ 上線） |

**下一步**：

- **② `design-graduate-timeline.mdx` 仍缺**——八群裡唯一沒有專屬時程文的，
  `graduate-design.astro:11` 還掛著通用的 `graduate-timeline`。
  需要的素材只有三點：作品集要抓多久、有沒有 portfolio review／作品簡報這關、
  實務型與學術型的送件季差異。其餘照其他七群現成的四階段骨架就能寫。
- **設計那份比較表仍然沒有 Google Sheet 副本**——站上有、寄不出去。
  SEL-299 的交付鏈缺這一環（見根目錄 `SEL-299_出貨連結.md`）。
- 農生環境 8/24 上線後：加指南頁與文章、補五份模板、正本改狀態，三件缺一閘門就紅。

---

## #024｜2026-08-18｜出貨清單 9b 核對：待辦寫的三處都不對；SEL-299 的交付鏈少一環

**Scope**：核對 `LR_進度紀錄.xlsx`（Drive，owner yaching.0601）分頁一「出貨清單」的 9b
（把農生環境標未排程），並釐清 SEL-299 實際要交付什麼。
**Non-scope**：**這一輪沒有改任何程式碼**。Drive 那份也沒改——Drive MCP 的 `update_file`
只能改標題與位置，寫不了儲存格，且該檔權限清單只有 owner 一人。本輪產出是核對結果與指示。

**變更檔案**：無（`WEEKLY_CHECKLIST.md` 在 repo 外，已更新）

**查到什麼**（可觀察的事實）：

- **9b 的前提三處都不對**：
  1. 不是 5 項是 **6 列**——農生環境除五份推甄工具，還有一列「範例本（899）／AGR-899」。
  2. 那 6 列的 G 欄**早就寫著「內容未產出」**。再標一次，完成率不會動——
     把它壓在 0.0% 的是統計列的分母 65（＝全部資料列），不是備註。
  3. 設計傳播那 6 列同樣寫「內容未產出」，但設計已定案要補（且本日補了第一份），
     它是待辦不是未排程，留在分母才對。
  → 真正要動的是 F 欄狀態與統計公式（建議 `COUNTIF` 讓「未排程」自動退出分母，65 → 59），
    不是備註欄。逐格指示寫在 `WEEKLY_CHECKLIST.md` 的 9b-1～9b-4。

- **SEL-299 的交付鏈少一環**：它賣的是 **Google Sheets 的「建立副本」連結**
  （出貨清單明文要求貼 copy 網址、不要貼編輯網址），對應 Drive 的 YC `Batch1_v2_20260818`
  ——那 8 份正好是 7 學群比較表 ＋ `graduate-timeline-gantt`。
  **本日補的設計比較表是站上的 `.md`／`.csv`，Drive 那批 Sheets 裡沒有它。**
  8/25 若要照「8 學群」出貨，得先把設計那份做成原生 Google Sheet 放進 YC 批次，
  否則品項建起來了卻沒有可寄的第 8 條連結。站上下載頁與付費出貨是兩條不同的交付路徑。

- **金流分頁「第二波（9/8）需建立 9」與它自己的備註矛盾**：AGR-499 與 DSN-499 兩列都寫
  「內容未產出，暫不建立」，扣掉之後第二波實際只需建 7 個。

**閘門證據**：
- G1／G2／G3／G4：N/A（本輪未動碼）。最後一次全綠是 #023：build 170 頁、verify 36/36，
  且已 push 並在正式站抽查通過。

**計畫／決策異動**：無。`grad-departments.json` 的農生環境**刻意維持 `planned`**——
使用者告知下週補內容，但正本記錄現況、不記預期，免得閘門依據還沒發生的事放行。

**風險與待確認**：
- SEL-299 的內含數字要以**上架當天實際有幾份**為準。8/25 農生環境若還沒上線就寫 8，
  上線後再改 9；不想來回改就不綁數字。寫 9 而當天只有 8，等於賣了拿不到的東西。
- Drive 上的 9b／9d／10a 三項都要人手動做，我改不了。這是這批營運資料的結構性限制：
  正本是 `.xlsx`（非原生 Sheet）且不屬於使用者帳號。
- 主檔已累積 23 則 WORKLOG，超過「只留最近 15 則」的規則，該跑一次 `archive-docs.js`。
  （既有狀態，非本輪造成。）

**下一步**：
1. **8/25 建綠界 SEL-299**（只有使用者能做）。建之前先定內含那格的數字，
   並確認設計比較表的 Sheets 版是否來得及進 YC 批次。
2. Drive 手動修改：9b-1～9b-4、9d、10a。
3. 設計傳播其餘四份模板；補滿五份要把正本升成 `shipped`，否則閘門會紅。
4. 農生環境下週上線後：加指南頁與文章、補五份模板、正本改狀態——三件事缺一閘門就紅。
5. ② `design-graduate-timeline.mdx`（仍需素材與方向確認）。

---

## #023｜2026-08-18｜設計傳播補上第一份模板（比較表），SEL-299 的內含才對得上

**Scope**：8/25 第一波要建的 SEL-299 內含寫「甘特圖 ＋ 各學群比較表」，但設計傳播沒有比較表。
補這一份，並讓它在下載頁與設計指南頁都真的看得到。
**Non-scope**：設計的其餘四份模板（套磁信／研究計畫書架構／備審 Checklist／口試檢核）不做；
`design-graduate-timeline.mdx` 不做；農生環境維持 `planned`，不碰。

**變更檔案**：
- `public/assets/templates/grad-design-school-compare.{md,csv}`（新增）— CSV 帶 UTF-8 BOM
- `scripts/template-manifest.json` — 登記一筆（47 份）
- `src/config/gradTemplates.ts` — `gradTemplateGroups` 新增設計傳播組（目前一份）
- `src/pages/pages/guides/graduate-design.astro` — 新增工具包區塊（原本沒有，因為以前零模板）
- `scripts/check-grad-departments.mjs` — 規則調整（見下）
- `scripts/grad-departments.json` — 設計傳播的 note 更新為「已補一份、還缺四份」
- `scripts/verify.mjs` — 新增設計指南頁的工具包斷言

**規則被自己擋住，所以改了規則**（D-011 補記）：
原本寫「非 shipped 的群一份模板都不該有」，預設五份一次補完。只補一份時兩邊都走不通——
升 `shipped` 會因不足五份而紅，不升則因「非 shipped 不得有模板」而紅。
改成 `guide-only` 是合法的補到一半狀態（0–4 份），補滿五份沒升級才報；
`gradTemplateGroups` 的對照集合改為「有模板的集合」而非「shipped 的集合」。
原始用意（正本不得落後於產出）沒放棄，判準從「有沒有模板」改成「補齊了沒」。

**模板內容對齊文章，不另立一套**：欄位取自 `design-graduate-choose.mdx` 的四個判準——
型態（學術研究型／實務創作型，文章說這是設計選校最大的選擇）、師資創作或研究方向、
課程導向、資源與產學連結，再加作品集要求（多數設計所權重很高、有些是第一關門檻）。
外部驗證管道沿用文章已實測過的三個連結（臺灣博碩士論文知識加值系統、新一代設計展、金點新秀）。

**閘門證據**：
- G1 語法：PASS（eslint 零問題）
- G2 boot：PASS（`npm run build` 170 頁）
- G3 smoke：PASS（`npm run verify` 36/36，比上一輪多一項＝新增的設計指南頁斷言）
- G4 migration：N/A
- 注入測試（調整後的規則，皆 exit 1）：只有 1 份就宣告 `shipped` → 報「應 ≥5」；
  有模板卻標 `planned` → 同時報 gradGuides 多了、manifest 有模板、指南頁已 build 出來
- 可見性實查：`dist/pages/resources/tools.html` 與 `dist/pages/guides/graduate-design.html`
  都含 `grad-design-school-compare`。**補這一項是因為第一次 build 後發現指南頁是 0**——
  設計指南頁從來沒有工具包區塊（以前零模板），只登記設定檔的話模板只在 tools 頁看得到。

**計畫／決策異動**：D-011 補記規則調整。PLAN Phase 2 的「設計傳播補五份模板」改為進行中（1/5）。

**風險與待確認**：
- SEL-299 的內含仍不能寫「全 9 學群」：農生環境沒有比較表，設計現在有了，實際是 8 個。
  金流分頁那一格要改（WEEKLY_CHECKLIST 9d）。
- 設計還缺四份。缺著的期間 `guide-only` 是誠實狀態，閘門不會催——但補滿五份不升 `shipped` 會紅。

**下一步**：
1. 出貨清單 9b（農生環境改「未排程」＋統計改 COUNTIF）與 9d（SEL-299 內含改「全 8 學群」）——
   都在 Drive 的 .xlsx 上，Drive MCP 只能讀不能寫，要人手動做。指示已寫在 `WEEKLY_CHECKLIST.md`。
2. 設計其餘四份模板；補齊後把 `grad-departments.json` 的設計傳播升成 `shipped`。
3. ② `design-graduate-timeline.mdx`（仍需素材與方向確認）。

---

## #022｜2026-08-18｜學群數定案 9：正本落地成 `grad-departments.json`＋四方一致性閘門（D-011）

**Scope**：把使用者定案的「9 群、農生環境之後補」寫成 repo 內可被驗證的正本，
並讓「學群數對不起來」這件事以後由閘門擋下。
**Non-scope**：不產任何內容——`design-graduate-timeline.mdx` 與 `grad-design-*` 五份模板
都還沒寫，本輪只是把它們的位置與狀態定義清楚（設計傳播＝`guide-only`）。
農生環境的研究所內容一份都沒動。

**變更檔案**：
- `scripts/grad-departments.json`（新增）— 9 群正本，帶 `decidedCount` 與三態
  （`shipped` 7／`guide-only` 1／`planned` 1）與 `slugPrefix`
- `scripts/check-grad-departments.mjs`（新增）— 四方一致性校驗
- `scripts/verify.mjs` — 在起 preview 之前呼叫上述閘門
- `src/config/gradTemplates.ts` — 註解改指向正本，說明本陣列＝非 planned 集合、
  `gradTemplateGroups` ＝ shipped 集合，不要單邊改
- `CLAUDE.md` — 「新增分學群模板」加第 0 步：新增整個學群要先改正本

**為什麼不是直接把農生環境加進 `gradGuides` 湊 9**：
`gradGuides` 會驅動麵包屑、series-nav 橫向出口與知識庫搜尋資料，加進去等於在前台長出
通往 `graduate-agriculture.html` 的連結，而那頁不存在——`check-links` 當場紅。
**「定案 9 群」與「前台開 9 個入口」是兩件事**，正本必須能同時表示，所以才有三態。

**閘門證據**：
- G1 語法：PASS（`npx eslint scripts/check-grad-departments.mjs` 零問題；
  write hook 的 eslint 又回了一次 `spawnSync cmd.exe ETIMEDOUT`，是 spawn 逾時不是規則失敗，已手動重跑）
- G2 boot：PASS（`npm run build` 169 頁）
- G3 smoke：PASS（`npm run verify` 35/35，含本輪與 #021 兩道新閘門）
- G4 migration：N/A（未動 schema）
- 新閘門注入測試（三個分支，皆 exit 1，還原後 exit 0）：
  設計傳播謊報 `shipped` → 報 gradTemplateGroups 缺項＋manifest 0 份 `grad-design-*`；
  農生環境提前開入口 → 報 gradGuides 缺項＋指南頁沒 build 出來；
  `decidedCount` 改 8 → 報與實際 9 筆不符
- 現況：正本 9 群，與 `gradTemplates.ts`、`template-manifest.json`、`dist/` 四方一致

**計畫／決策異動**：新增 D-011。PLAN Phase 2 的「定案學群數」勾掉；
`WEEKLY_CHECKLIST.md` ⑨ 從 🔴 改為已定案。

**風險與待確認**：
- 設計傳播停在 `guide-only` 是**被閘門記著的已知缺口**，不是漏記。補完五份模板要記得升 `shipped`，
  否則 manifest 有檔而正本說沒有，閘門會紅（這正是它要擋的）。
- 農生環境的 5 項工具已列在出貨清單上但內容未產出。清單那邊要標「未排程」，
  否則完成率會一直被它拉著（⑩ 的 10a 尚未處理）。

**下一步**：
1. ② 新增 `design-graduate-timeline.mdx`（`gradStage: 2`／`departmentGroup: 設計傳播`／
   `order` 排在 1 之前／faqItems ≥3／tocItems 8 項），換掉 `graduate-design.astro:11` 的通用文，
   tag 改「設計專屬」。**需要素材與內容判斷，不是機械工作——動手前先確認方向。**
2. ③ 補 `grad-design-*` 五份模板（各 `.md`+`.csv`）→ 登記 manifest → 登記 `gradTemplateGroups`
   → **把正本的設計傳播升成 `shipped`** → verify。
3. 本輪與 #021 都在分支 `fix/kb-bold-flanking`，未 commit、未 push。要上正式站需合進 `main` 由使用者推。

---

## #021｜2026-08-18｜知識庫字面 `**` 從 160 處歸零，並補上 dist 掃描閘門（D-010）

**Scope**：修掉 #020 定位到的 25 頁破版，並讓同一類問題以後由閘門擋下。
**Non-scope**：不新增 `design-graduate-timeline.mdx`、不補 `grad-design-*` 模板、不碰學群數
（②③⑨ 全部卡在「7／8／9 尚未定案」，先做等於替農生環境先挖好下一個洞）；
不動 `public/assets/templates/*.md`（那裡的 `**` 是下載檔本來就該有的內容）；不動 CSS。

**變更檔案**：
- `src/content/articles/*.mdx`（25 檔）— 78 段收尾 `**` 從中文標點之後移到之前
  （`…有判斷。**多` → `…有判斷**。多`），粗體範圍不含句末標點，語意不動
- `src/content/articles/arts-graduate-cv.mdx:20` — `faqItems` 的 `**看得出發展**` 去掉標記
- `scripts/check-markdown-leak.mjs`（新增）— dist 的 HTML 不得含字面 `**`；
  另附源頭檢查：frontmatter 不得含 `**`
- `scripts/verify.mjs` — 在起 preview 之前呼叫上述閘門，與 `check-links` 同層

**查到什麼**（修正過程中翻掉 #020 的一個歸因）：
#020 把 dist 的 160 個 `**` 全歸給 flanking rule。實際上是 **156 + 4**：
`arts-graduate-cv` 的 `faqItems` 是純文字欄位，原樣輸出到 `<p>` 與 JSON-LD 兩處，
不經 markdown 渲染——那 4 個是同一段輸出兩次，怎麼調標點位置都不會變粗體。
先寫的 flanking 偵測器（156 runs／25 檔）只看得到 A 類，B 類完全在它視野外；
這正是閘門最後守 dist、不守解析規則的理由（見 D-010）。

**閘門證據**：
- G1 語法：PASS（`npx eslint scripts/check-markdown-leak.mjs` 零問題。
  註：write hook 的 eslint 曾回 `spawnSync cmd.exe ETIMEDOUT`，是 spawn 逾時不是規則失敗，已手動重跑確認）
- G2 boot：PASS（`npm run build` 169 頁）
- G3 smoke：PASS（`npm run verify` 35/35，含新閘門）
- G4 migration：N/A（未動 schema）
- 新閘門注入測試：往 `dist/index.html` 插一段壞粗體 → exit 1；往 frontmatter 插 `**` → exit 1；
  兩者還原後 → exit 0
- 事實核對：修正前 `grep -o '\*\*' dist` = 160／25 檔；修正後 = 0
- 抽查渲染：`law-graduate-cv` 該段輸出 `自傳要回答的是：<strong>你怎麼走到這個研究問題的</strong>？四個要素：`

**計畫／決策異動**：新增 D-010。#020「下一步」的第 1 項完成，第 2、3 項仍卡在第 4 項（學群數定案）。

**風險與待確認**：
- 新閘門對字面 `**` 零容忍。日後要寫「講解 markdown 語法」的文章時得改用 HTML 實體或
  程式碼區塊，或替它開例外並在 D-010 補記。
- 這是第三次出現「正確做法寫在註解／文件裡、沒有東西保證它成立」（D-003、D-008、D-010）。
  下次寫下規範時，先問「什麼東西會在它被違反時變紅」。

**下一步**：
1. **等使用者定案學群數 7／8／9**（WEEKLY_CHECKLIST ⑨）。這是 ②③ 的唯一前置，不定案不動。
2. 定案後：新增 `design-graduate-timeline.mdx`（`gradStage: 2`／`departmentGroup: 設計傳播`／
   `order` 排在 1 之前／faqItems ≥3／tocItems 8 項），換掉 `graduate-design.astro:11` 的通用文，
   tag 改「設計專屬」。
3. 補 `grad-design-*` 五份模板（各 `.md`+`.csv`）、登記進 `scripts/template-manifest.json`、
   在 `gradTemplateGroups` 加該組。
4. 本輪未 push。分支 `fix/kb-bold-flanking`，要上正式站需合進 `main` 再由使用者推。

---

## #020｜2026-08-18｜本週待辦逐項核對：`**` 破版定位到 25 頁、設計學群兩個洞證實

**Scope**：把「樂平方本週待辦」的知識庫三項當假設逐一驗證，用 build 輸出與設定檔實際內容當事實來源，
不靠待辦本身的描述。
**Non-scope**：這一輪**沒有改任何程式碼**——只做核對與定位。修正留給 #021。

**變更檔案**：無（僅 `npm run build` 產生 `dist/`）

**查到什麼**（可觀察的事實）：

- **`**` 沒渲染的範圍是 25 頁、160 個字元 = 80 段粗體**，全部落在
  `dist/pages/resources/*-graduate-*.html`。分佈：教育 42／商管 34／人文 32／藝術 30／
  法政 12／通用套磁 6／生醫 2；理工與設計 0。
- **根因是 CommonMark 的 flanking rule 撞中文標點**，不是漏跳脫、不是 MDX 解析。
  粗體內容以「。？！」結尾又緊接文字時，收尾的 `**` 前是標點、後是文字，
  不成立 right-flanking → 無法收尾 → 整組吐字面。例：
  `…關鍵在第四步。**主動指出限制，反而顯示你對作品有判斷。**多數學生…`
  修法是把收尾 `**` 移到標點之前（`…有判斷**。`），語意不動，可腳本化。
  `public/assets/templates/*.md` 裡的 `**` 是下載檔本來就該有的 markdown，**不可一起改**。
- **設計學群缺時程專屬文，且是八群裡唯一一個。** 逐一掃過八份指南的 `STAGE_ORDER`，
  只有 `graduate-design.astro:11` 的時程階段掛通用文 `graduate-timeline`。
  另註：設計沒有 `-cv` 是刻意的（該階段由 `design-graduate-portfolio` 頂替），不是漏。
- **設計學群模板缺整組 5 份。** `gradGuides` 8 群 vs `gradTemplateGroups` 7 群×5=35 份；
  磁碟 46 份不重複模板 = 35 分學群 + 11 通用，`grad-design-*` 零份。
  `gradTemplates.ts:20` 的註解早就寫了「含設計傳播（有指南但沒有模板）」——寫下來但沒有閘門盯。
- **學群數在三個地方對不起來：模板 7／指南 8／出貨清單 9。**
  出貨清單多出來的「農生環境」目前只有大學申請與高中文章，研究所內容一份都沒有，
  但清單已經替它列了 5 項工具。

**閘門證據**：
- G1 語法：N/A（未改碼）
- G2 boot：N/A
- G3 smoke：NOT RUN（本輪不動碼，`npm run verify` 未跑）
- G4 migration：N/A（未動 schema）
- `npm run build`：PASS（169 頁），輸出即為上述 25 頁數字的事實來源

**計畫／決策異動**：無新增 D-0xx。但 `**` 這件事符合 D-003／D-008 的同一種失敗形狀
（正確做法寫在註解裡、沒有任何東西保證它成立），修正時應一併補閘門。

**風險與待確認**：
- 80 段要逐一改，機械但量大；沒有閘門的話下次寫文一樣會再犯。
- 學群數 7／8／9 不定案的話，補完設計之後農生環境就是下一個一模一樣的洞。

**下一步**：
1. 修 80 段 `**`，並在 `scripts/verify.mjs` 加一條：build 後 `dist/**/*.html` 不得含 `**`（防回歸）。
2. 新增 `design-graduate-timeline.mdx`（`gradStage: 2`／`departmentGroup: 設計傳播`／
   `order` 排在 1 之前／faqItems ≥3／tocItems 8 項），並把 `graduate-design.astro:11`
   換掉、tag 改「設計專屬」。
3. 補 `grad-design-*` 五份模板（各 `.md`+`.csv`）、登記進 `scripts/template-manifest.json`、
   在 `gradTemplateGroups` 加該組。
4. **先定案學群數是 7／8／9**，再動 2 與 3——否則等於替下一個洞先挖好。

---

## #019｜2026-08-16｜文章表格破版改在 CSS 端解根因（D-009）

**Scope**：把 #018 用 `.table-wrapper` 逐篇擋住的手機破版，改成 `tbd-pages.css` 的一條規則，
並把從未被測過的舊文加進 verify 清單。
**Non-scope**：不動全域 `table { min-width: 760px }` 本身（影響指南頁等頁面級表格，且目前是綠的）、
不改任何文章的文字內容、不動 `.plan-table` 與 `.series-matrix` 的既有處理。

**為什麼不是逐篇包**：量過文章欄實寬是 356–764px（1120 容器 − 22×2 內距 − 280 側欄 − 32 gap），
760px 的下限幾乎在每個視窗寬度都會溢出。逐篇包 `.table-wrapper` 是「每篇都要記得做」的儀式，
和 D-003 那 20 份消失的模板是同一類失敗；而且結果是橫向捲動，不如直接換行。

**變更檔案**：
- `public/css/tbd-pages.css` — 新增 `.article-section table:not([class])`：`table-layout: fixed`
  ＋ `min-width: 0` ＋ `width: 100%`，儲存格加 `word-break`。`:not([class])` 讓手寫表格不受影響
- `src/content/articles/law-graduate-{timeline,choose,proposal,cv}.mdx` — 移除 #018 加的 6 個
  `.table-wrapper` 包裝，回到純 markdown，與其他六週一致
- `scripts/verify.mjs` — 法政研究計畫那項的 `mustContain` 拿掉 `table-wrapper`；新增
  `education-graduate-choose`、`arts-graduate-cv` 兩項舊文回歸

**閘門證據**：
- G1 語法：PASS（`npm run build` 169 頁）
- G3 smoke：PASS（`npm run verify` 35/35，含兩篇舊文；站內連結無死連結）
- 修正確實生效：`dist/css/tbd-pages.css` 內含該規則；修正前 `law-graduate-timeline` 溢出 285px

**計畫／決策異動**：新增 D-009；PLAN Phase 2 的「舊文表格破版」一項可勾掉。
**風險與待確認**：`:not([class])` 依賴「markdown 表格不帶 class」這個前提。若日後有人在 `.mdx` 裡
手寫帶 class 的表格，要自己處理 RWD——D-009 有寫，但這是規則的邊界，值得知道。
**下一步**：Week 8（#018）與本則都還沒 commit／push；一起送出後要打正式站 URL 確認，
push ≠ 上線（WORKLOG #015）。

---

## #018｜2026-08-16｜Week 8 法政類群落地：5 篇文章＋指南頁＋5 組模板

**Scope**：把 `docs/content-plans/Week8_研究所申請陪跑計畫_法政類群_知識庫轉換規劃.md`
轉成站上資產——5 篇 `law-graduate-*.mdx`、`guides/graduate-law.astro`、5 組 `grad-law-*`
模板（md＋csv）與兩處登記，並在共用文 `graduate-contact-professor.mdx` 補 `#law-tips`。
**Non-scope**：不動既有六個學群的任何檔案、不改 CSS、不重構 `gradTemplates.ts` 結構、
不改 `graduate-application.astro`（對照表由文章 `departmentGroup` 自動推導）、不 push。

**變更檔案**：
- `src/content/articles/law-graduate-{timeline,choose,proposal,cv,oral}.mdx` — 新增，
  gradStage 2/3/5/6/7、`departmentGroup: 法政`、order 8.1–8.5
- `src/pages/pages/guides/graduate-law.astro` — 新增，七階段（2 篇通用＋5 篇法政專屬）
- `public/assets/templates/grad-law-*.{md,csv}` — 新增 5 組共 10 檔
- `scripts/template-manifest.json` — 登記 5 筆 `delivery: "file"`
- `src/config/gradTemplates.ts` — `gradGuides` 加法政一筆、`gradTemplateGroups` 加一組
- `src/content/articles/graduate-contact-professor.mdx` — 新增 `#law-tips` 區塊與目錄項
- `scripts/verify.mjs` — 新增 3 項測試（法政指南／法政時程／法政研究計畫多表格 RWD）

**閘門證據**：
- G1 語法：PASS（`npm run build` 169 頁）
- G3 smoke：PASS（`npm run verify` 33/33；站內連結掃 172 頁無死連結）
- G4 migration：N/A（未動 schema）
- 外部連結：8 個候選來源逐一實測，`law.judicial.gov.tw` 連不上已剔除，
  實際採用 law.moj.gov.tw／lis.ly.gov.tw／judgment.judicial.gov.tw／cons.judicial.gov.tw／
  ndltd.ncl.edu.tw／scholar.google.com／tpl.ncl.edu.tw／nstc.gov.tw（皆 200）

**閘門擋下的兩件事（都不是假想）**：
1. 5 個 CSV 缺 UTF-8 BOM——`Write` 工具不寫 BOM，Excel 開起來會是亂碼。模板閘門直接紅。
2. `law-graduate-timeline.html` 在 400px 水平溢出 285px。原因是 `tbd-components.css` 的全域
   `table { min-width: 760px }`，而手機端的解法（`table-layout: fixed`）只寫在 `.plan-table`
   上。裸的 markdown 表格因此會撐破版面，要包 `.table-wrapper` 才會被 `overflow-x: auto` 收住。

**計畫／決策異動**：未新增 D-0xx。上面第 2 點是既有 CSS 的既知陷阱，不是新決策。
**風險與待確認**：既有六個學群的 `*-graduate-{choose,cv,proposal}.mdx` 共 6 篇也有裸的
markdown 表格（arts-choose／arts-cv／biomed-choose／business-choose／education-choose／
education-cv／education-proposal），推測有同一個手機破版，但它們不在 verify 清單內所以從沒被
測到。本輪 Non-scope 沒動它們。
**下一步**：① 決定要不要用一輪把上述 6 篇的表格補上 `.table-wrapper`（或改成在 CSS 端
讓所有文章表格都適用 `table-layout: fixed`，一次解掉根因）；② Week 8 尚未 commit／push，
正式站要等 main 部署才會出現。

---

## #017｜2026-08-09｜補上模板閘門的反方向漏洞（D-008）；PLAN.md 第一次填

**Scope**：① 解掉 WORKLOG #015 標為「風險最高」的技術債——模板改成 Sheets／Notion 後
`verify.mjs` 會失去事實來源；② 把散落的待辦收斂成 `docs/PLAN.md` 正本。
**Non-scope**：不動任何模板檔內容、不改頁面、不做形式轉換本身（那批產出在 repo 外）。

**這道閘門原本漏在哪**：D-003 讓閘門掃磁碟上的 `.md`，只擋得住**一個方向**——
多了檔案沒登記會紅，**少了檔案不會**。而形式補齊拍板的方向正是把模板改成
Google Sheets／Docs／Notion，那些形式在磁碟上沒有檔案。第一份轉過去的模板會讓
掃出來的清單少一項、斷言跟著少一項，**閘門覆蓋範圍安靜縮編且沒有任何訊號**。
D-003 要擋的就是「模板從下載頁消失」，縮編後它剛好不再擋得住那件事。

**變更檔案**：
- `scripts/template-manifest.json` — 新增。41 筆，每筆 `slug` ＋ `delivery: "file" | "external"`（external 需 `url`）
- `scripts/verify.mjs` — `templateFiles()` 改為 `templateManifest()` / `templateLinkFragments()` /
  `checkTemplateManifest()`；後者與 `checkVercelJson()` 一樣在 build 之前跑
- `docs/DECISIONS.md` — 新增 D-008（含三個被否決的選項與理由）
- `CLAUDE.md` — 新增模板的順序由 2 步改為 3 步（放檔案 → 登記 manifest → 登記 gradTemplates.ts），
  並寫明「改外部形式時不要只刪檔案」
- `docs/PLAN.md` — 第一次填。Phase 0–5，把 WORKLOG 各則「下一步」、
  `template-format-upgrade.md` §5、根目錄兩份無版控文件的待辦收斂成單一正本
- `docs/template-format-upgrade.md` — §4／§5 把已解決那項劃掉並指向 D-008

**閘門證據**：
- G1 語法：PASS（build）
- G2 boot：PASS（163 頁）
- G3 smoke：PASS（`npm run verify` 30/30）
- **反向測試（重點）**：新閘門的四個失敗方向逐一實測，全部會紅——
  ① 磁碟多一份沒登記；② manifest 說 file 但檔案不在（模擬轉 Sheets 只刪檔）；
  ③ 改成 external 但沒填 url；④ 宣告一致的 external 但下載頁沒有它的連結（29/30）。
  沒實測過失敗方向的守門等於沒有守門——這一則的價值就在這四行。
- G4 migration：N/A

**計畫／決策異動**：新增 D-008；`template-format-upgrade.md` §5 第 5 項劃掉；
PLAN.md Phase 3 第一項勾掉。
**風險與待確認**：manifest 是「有哪些模板」的唯一宣告處，但**它不驗內容**——
一份模板的 md/csv 內容爛掉、或 csv 與 md 不同步，這道閘門看不出來。目前沒有人在驗這件事。

**下一步**：Phase 3 剩下的四項都不是 repo 內的工作（逐份決定 17 份的目標形式、重估排程、
確認四人分工、產品 4／8 回到內容規劃），需要使用者拍板才動得了。
repo 內能先做的只有「形式補完後連帶要改的 `tools.astro` 下載連結結構與 `gradTemplates.ts` 資料結構」，
但在第一份外部模板實際存在之前做那件事＝寫沒有使用者的程式，刻意不做。

---

## #016｜2026-08-09｜Week 7 教育類群落地：5 篇文章＋指南頁＋5 份模板

**Scope**：依 `docs/content-plans/Week7_研究所申請陪跑計畫_教育類群_知識庫轉換規劃.md`，
比照 Week 6（藝術，`6af82a3`）的形狀把教育類群落地。
**Non-scope**：不動既有六學群的文章內容、不改 CSS／layout、不改 content schema、不 push。
在新分支 `feat/week7-education` 上做（`feat/templates-and-compass-funnel` 還有在途工作）。

**變更檔案**：
- `src/content/articles/education-graduate-{timeline,choose,proposal,cv,oral}.mdx` — 新增 5 篇
  （`departmentGroup: 教育`、`gradStage` 2/3/5/6/7、`order` 7.1–7.5、各含 faqItems 與 inline CTA）
- `src/content/articles/graduate-contact-professor.mdx` — 新增 `#education-tips` 區塊與對應 tocItem
  （Day 4 沿用通用文，與前五個學群同一作法）
- `src/pages/pages/guides/graduate-education.astro` — 新增指南頁：路線快篩三卡、七階段 rail、工具包
- `public/assets/templates/grad-education-*.{md,csv}` — 5 份模板 × 雙格式（共 10 個檔）
- `src/config/gradTemplates.ts` — `gradGuides` 與 `gradTemplateGroups` 各加一組「教育」
  （麵包屑、對照表欄位標題、知識庫搜尋資料、tools.html 分組全部由此自動長出）
- `src/config/resourceCategories.ts`、`src/pages/pages/resources.astro`、
  `src/pages/pages/resources/tools.astro` — 匯總卡與 meta description 的學群列舉補上「教育」
- `scripts/verify.mjs` — 新增 2 項回歸測試（教育指南頁、教育時程文），
  既有 3 項（knowledge base 首頁、對照表欄位標題、階段1 橫向出口）補上教育的 mustContain

**閘門證據**：
- G1 語法：PASS（`npm run build`）
- G2 boot：PASS（build 163 頁，較 Week 6 的 156 頁 +7＝5 文章＋指南頁＋sitemap 產物）
- G3 smoke：PASS（`npm run verify` 30/30，含站內死連結檢查「無死連結」）
- G4 migration：N/A（未動 schema）
- 測試：`npm run verify` 即本專案的行為測試套件，見上
- lint：`npx eslint` 對改動的 .ts/.mjs 回 0 errors（`src/config/*.ts` 無 eslint 設定涵蓋，回 warning「File ignored」）。
  過程中 PostToolUse hook 的 eslint 連兩次回 `spawnSync cmd.exe ETIMEDOUT`——那是 spawn 逾時，不是規則失敗，
  故獨立再跑一次確認。

**「模板漏登記」那道閘門有生效**：`tools.html` 那項以磁碟上的實體 `.md` 檔為事實來源，
10 份新檔在 `gradTemplates.ts` 登記前會直接讓 verify 紅——這正是 D-003 要防的形狀，這輪照順序走沒有踩到。

**計畫／決策異動**：無新決策；沿用 D-003 的單一資料來源作法。
**風險與待確認**：
- 文章涉及心諮／特教的實習、修業年限與專業資格路徑，一律寫成「以系所公告與當年度簡章為準」，
  未寫任何具體時數或年限數字——這類數字會隨法規調整，寫死等於製造過期內容。
- 外部連結只用了站內既有且已驗證的兩個（臺灣博碩士論文知識加值系統、Google 學術搜尋），未新增未驗證來源。
- 尚未 push、未合併 main，因此正式站上還看不到（見 #015 的教訓）。

**下一步**：等使用者確認內容方向後再 `git push`；push 只上 feature branch，
要在正式站生效仍需合併進 `main`。若要驗收，請打正式站 URL 而不是看 git 狀態。

---

## #015｜2026-08-05｜實測發現 7 份新模板與漏斗出口從未在正式站生效；形式落差拍板全面補齊

**Scope**：對照 `TBD知識庫轉工具模板銷售企劃_0804`（Google Doc）與實際狀態，
查證上線狀況，記錄形式落差的拍板結果。
**Non-scope**：不合併分支、不部署、不改任何模板檔或頁面程式。

**本輪最該記的一項——待辦被標成完成，但正式站上不成立**：

實測 `https://tbd-web.vercel.app`（2026-08-05）：

| 檢查 | 結果 |
|---|---|
| `tools.html` 列出的 CSV 數 | **29**（批次 A；批次 B 的 7 份不在） |
| 7 份新模板 CSV | 全部 404 |
| `/pages/placement.html` | **404** ← 四份高中端模板的 compass 出口是死連結 |
| `/pages/compass.html` | 404 |
| `/pages/seen.html`（對照組） | 307 → compass（本來就在 main 上，所以活著） |

成因不是沒 push：`f867065` 已在 `origin/feat/templates-and-compass-funnel`，
但**該分支未合併進 `main`**，而正式站部署 `main`。`/pages/placement.html` 的轉址
規則寫在 `vercel.json:13`，同樣在未合併的分支上，所以規則在正式環境根本不存在。
`5f58789`（#014 的銷售頁改寫）則連分支都還沒推。

**教訓**：「push 了」與「上線了」在這個 repo 是兩件事，因為所有工作都在 feature branch。
驗收一律打正式站 URL，不要看 git 狀態。這次是靠 `tools.html` 只列 29 份這個
**與我方設定無關的獨立訊號**抓到的——先前用猜的檔名打 404，那證明不了任何事。

**變更檔案**：
- `docs/template-format-upgrade.md` — 新增。11 個產品的形式落差逐項對照、
  企劃書沒涵蓋的 17 份、與上線順序的衝突
- `../TEMPLATE_INVENTORY.md`（根目錄，無版控）— 待辦 2／3 改為「尚未生效」並附實測證據；
  待辦 5 標記完成（使用者回報，repo 側無法查證）；新增 §7 形式落差拍板、§8 待拍板的上線順序

**閘門證據**：G1／G2／G3／G4 全部 **N/A**——本輪只動 Markdown，未觸及任何會被
build 或 verify 涵蓋的檔案。正式站實測見上表，那是本輪唯一的證據來源。

**計畫／決策異動**：形式落差拍板「全面補齊」（正本記在 `TEMPLATE_INVENTORY` §7）。
連帶把企劃書的 8 週排程重新啟用——扣掉已完成的階段 1 內容層。

**風險與待確認**：
1. **批次 B 的 7 份同時是「待上線」與「待補形式」，兩者互斥。** 走法 A／B／C 未選，
   這一項阻塞其他所有事
2. 補完形式後 5 份不再是 CSV，`tools.astro` 的下載連結、`gradTemplates.ts`、
   `verify.mjs` 斷言都要跟著改——不是換檔案而已
3. 企劃書的定價段落（單品 150–399、落點分析 +$299 解鎖）與 D-M2／D-006 直接衝突，
   **尚未處理**。文件還是團隊手上的執行依據，不修會有人照著做
4. 六階段 SOP 需要四個角色（LR／YC／YY／CL），目前完全沒有在跑

**走法拍板：C**（2026-08-05，同日）。分支已備妥，**未推、未合併**：

- 分支 `feat/compass-page-and-redirect`，基底 `origin/main`（6669ff7），單一 commit `327ddf4`
- 作法不是 cherry-pick 而是**按路徑取檔**：從 `feat/templates-and-compass-funnel`
  取 9 個路徑的最終狀態，因此包含 `5f58789` 的銷售頁改寫，不需要處理 commit 之間的中間態
- 含：`vercel.json` 轉址、`compass.astro`、`pricing.ts`、`tbd-pages.css`、
  `verify.mjs`、三份批次 A 模板的 `.md`（compass 出口）、`DECISIONS.md`
- 排除：7 份新模板的 14 個檔、`tools.astro` 分組改版、分組方向稿
- 第四份帶 compass 出口的是 `admission-channel-radar`（批次 B），出口跟著模板押後
- 在隔離的 worktree 驗，未動主工作區

**C 分支的閘門證據**：
- G1／build：PASS，157 頁
- G3 verify：PASS **28/28**，含新增的 `/pages/compass.html`（`NT$`／`499`／`899`／
  compass 網域四項 mustContain）
- 排除有效（對 `dist/` 實測，不是看 git）：模板 CSV 計 **29** 份、7 份新模板全數不在
  `dist`、compass 頁仍 `noindex`、首頁不含 compass 連結、`tools.html` 無新模板連結
- **本來預期會失敗但沒有的一項**：`verify.mjs` 的 `templateFiles()` 改成掃磁碟上
  所有 `.md`（原本只篩 `grad-`），我原本判斷 main 的舊 `tools.astro` 可能沒列全
  4 份通用模板而會紅。實測列全了，所以過。這是實測結果，不是推論

**C 的後續成本（現在就要知道）**：`feat/templates-and-compass-funnel` 之後要重新
接上 main 時，`vercel.json`／`verify.mjs`／`pricing.ts`／`compass.astro`／`DECISIONS.md`
與三份 `.md` 都已在 main 上。內容相同的部分 git 併得掉，但 `WORKLOG.md` 與
`DECISIONS.md` 兩邊都在檔首插入條目，**衝突是必然的**，要手動解。
建議該分支改為 rebase 到新的 main 再續做，不要 merge。

**PR #18 的 CI 紅燈與根因（2026-08-05 追加）**：

推上去之後 Vercel check 直接 `failure`。原始訊息由 Vercel bot 貼在 PR 留言：

```
The `vercel.json` schema validation failed with the following message:
`redirects[1]` should NOT have additional property `_comment`
```

`redirects[1]` 就是新增的那筆 `/pages/placement.html` 轉址。Vercel 的 `redirects`
schema 是 `additionalProperties: false`，多一個鍵就整份設定驗證失敗，
**在 build 開始前中止部署**——所以 `target_url` 只給
`vercel.com/docs/.../project-configuration`，沒有 build log。
辨識方式記起來：**失敗連到設定文件而非部署 log ＝ 設定檔無效，不是程式壞。**

**這不是本 PR 造成的，而是本 PR 讓它第一次被看見。** `_comment` 由 `f867065` 引進，
之後每一次 preview 部署都是紅的：

| commit | 環境 | 結果 |
|---|---|---|
| `6669ff7`（`_comment` 出現前） | Production | success |
| `9957a5f` | Preview | **failure** |
| `0f40235` | Preview | **failure** |
| `327ddf4`（本 PR 第一版） | Preview | **failure** |

**三個 commit 連紅沒被發現，因為本機閘門根本不驗 `vercel.json`。**
`npm run build` 不碰它，`verify` 的 28 項也不碰它，只有 Vercel 會。
這是閘門缺口，不是誰不小心——所以修法不是「下次記得」，是把它加進閘門。

**修正 commit `d678c5e`**：
- `vercel.json` — 移除 `_comment`
- `docs/DECISIONS.md` — 新增 D-007：模板出口為什麼走站內轉址（模板是會被下載的檔案，
  網域搬家後改不到已下載的副本）、以及這條 schema 限制與辨識方式
- `scripts/verify.mjs` — 新增 `checkVercelJson()`，放在 build 之前。
  **用白名單而非黑名單**：schema 本身就是 `additionalProperties: false`，
  黑名單只擋得住已經出過事的那個鍵名，下次換個名字又會重演

**閘門有效性已實測**（不是只確認它在正常情況下不報錯）：
修好的設定 → 0 問題；放回 `_comment` → 1 問題且訊息指到 `redirects[1]` 與鍵名、
與 Vercel 自己回的一致；故意寫壞 JSON → 1 問題。
修正後 `npm run verify` 仍 28/28。

**已合併並在正式站實證（2026-08-05）**：PR #18 squash 為 `a44da05`。
部署後 30 秒內生效，六項全過：

| 檢查 | 結果 |
|---|---|
| `/pages/placement.html` | **307 → `tbd-compass-app.vercel.app/placement`** |
| `/pages/compass.html` | 200 |
| `tools.html` 模板數 | **29**（排除有效） |
| 批次 B 三支 CSV | 全 404 |
| compass 頁 | `noindex` |
| 對照組 `seen.html` | 307 → compass |

**更正一處先前的說法**：本則原本寫「應為 302」。實際是 **307**——Vercel 對
`permanent: false` 一律發 307，本來就在站上的 `seen.html` 也是 307。語意（非永久轉址）
正確，是先前的狀態碼寫得不精確。驗收條件應寫「307 且目的地為 compass」。

**驗收方式本身有一個坑值得記**：合併前試過用 preview 部署先驗，但整個 preview 被
Vercel SSO 保護擋著，**每一條路徑都回 302 到 `vercel.com/sso-api`**。
`/pages/placement.html` 當時也是 302——只看狀態碼會誤判成「轉址生效」。
識破它靠的是比對 `redirect_url`，以及注意到三支**本來就不存在**的批次 B CSV 也回 302
而非 404。**驗轉址一律比對目的地，不要只看狀態碼。**

**分支 rebase（2026-08-05 收尾）**：`feat/templates-and-compass-funnel` 已 rebase 到
`a44da05` 並 force-push（`5f58789` → `64f5201`）。5 個 commit 全部重放，只解一輪衝突。

驗收條件刻意不是「rebase 沒報錯」，而是**「收斂到與 main 相同」**——
`vercel.json`／`verify.mjs`／`DECISIONS.md`／`tbd-pages.css`／`pricing.ts`／`compass.astro`
六個檔案相對 main 必須零差異，實測全過（`_comment` 計數 0，D-007 還在，
`checkVercelJson` 出現 2 次＝定義＋呼叫而非重複貼上）。
剩餘差異正好是 main 還缺的：7 份模板、`tools.astro` 分組、方向稿、兩份 docs。
rebase 後 `npm run verify` 28/28、`dist` 36 份。
退路 tag：`pre-rebase-templates` = `58d580f`。

解衝突原則（下次再遇到照這個走）：`vercel.json` 與 `DECISIONS.md` 取 main
（main 是超集）；`pricing.ts`／`compass.astro` 取被重放的 commit，
讓後面 `f12f564` 的改寫乾淨套上、自然收斂到與 main 相同。

**本輪三個決策（2026-08-05 收尾拍板）**：
1. **形式補齊範圍擴大到全部 36 份**，不只企劃書涵蓋的 19 份。
   理由同 `TEMPLATE_INVENTORY` §4 選項 X：兩種形式並存，學生會問「差在哪」，
   而誠實的答案是「沒人決定」。**代價：工作量約 1.9 倍，企劃書的 8 週排程作廢，
   需要重估——這件事還沒做。**
2. **押後期間的預覽管道**：`feat/templates-and-compass-funnel` 的 Vercel preview
   （SSO 保護，登入 Vercel 的瀏覽器可開；curl 會被導到 `sso-api`），
   或本機 `npm run preview`。正式站 29 份、preview 36 份，**看到 36 份不代表上線**。
3. **企劃書定價段落與 D-006 的衝突：延後討論。** 未處理，那份 Google Doc
   仍是團隊手上的執行依據，仍會有人照著做——這個風險維持開著。

**下一步（下次開場從這裡接）**：形式補齊的第一件事是**逐份決定那 17 份的目標形式**
（`docs/template-format-upgrade.md` §3 有初步方向，未拍板），接著重估排程。

另有一項風險最高的技術債要先想清楚：模板改成 Sheets／Notion 之後**磁碟上不會有檔案**，
`verify.mjs` 的 `templateFiles()` 會失去事實來源——而它正是擋住 D-003
（20 份模板消失四輪）的那道閘門。換形式時必須同步決定新的事實來源，不能只是刪掉它。

`TEMPLATE_INVENTORY` 待辦 3 已劃掉（但只有三份出口活了，第四份
`admission-channel-radar` 屬批次 B、跟著押後）。**待辦 2 仍維持未完成**，
這是走法 C 的設計而非遺漏。

---

## #014｜2026-08-05｜D-M2／D-M3 拍板後，銷售頁與 pricing.ts 全面改寫

**Scope**：把 `compass.astro` 與 `pricing.ts` 對齊拍板結果——**付費的不是落點分析**。
**Non-scope**：不拿掉 `noindex`（解鎖流程還沒接起來）、不掛進 nav、不動 compass repo 的程式。

**背景**：拍板前這一頁的整個價值主張是「免費版只看得到概略位置，完整報告付費」。
拍板後落點分析全部免費且免登入，那句話從賣點變成假話，必須整段改寫而不是改幾個字。

**變更檔案**：
- `src/config/pricing.ts` — 兩個方案的 `includes` 由「完整落點報告／個人化校系比對結果」
  改為「顧問接手包分享連結／跨裝置同步／跨年度保存」；同步註記更新為 2026-08-05
- `src/pages/pages/compass.astro` — `description`、hero lead、「那付費解鎖的是什麼」
  整節、方案註腳、開始區的 CTA 文案。免費清單第一項由「落點分析的基本結果」
  改為「落點分析的全部功能」，模板份數 29 → 36（早就過時了，這輪順手修）

**閘門證據**：
- G1 語法：PASS。`npm run build` 157 頁
- G3 smoke：PASS。`npm run verify` 28/28，含 `/pages/compass.html` 的
  `mustContain: ['NT$','499','899','tbd-compass-app.vercel.app']`——價格未變故仍通過
- 人工目視：**未做**。本輪只改文案未動版型，且 Chrome 擴充功能仍未連線

**計畫／決策異動**：`MONETIZATION_PLAN.md` 狀態改為已拍板、§2 兩節加拍板註記、
§8 待辦 1 劃掉並新增待辦 5；`TEMPLATE_INVENTORY.md` 待辦 1 劃掉。
決策正本是 compass 的 D-006，本 repo 不重複寫一份。

**風險與待確認**：
1. `pricing.ts` 仍是手寫鏡像，正本在 compass 的 `PLANS`。這輪兩邊同時改、內容一致，
   但保證機制還是只有「改價先改 compass」這條人為規則。verify 只比對數字（499／899），
   **比對不到 `includes` 的文字**——方案內容講錯不會有任何訊號
2. 銷售頁現在主打「落點免費」，等於把最強的鉤子從付費項移到免費項。
   轉換率的假設變了，軟啟動要重新看數據

**下一步**：等 compass 那側把 `hasAccess()` 接到接手包、且金流實刷過一筆之後，
再回來拿掉 `noindex` 並把本頁加進 `site.ts` 的 nav。

---

## #013｜2026-08-05｜挑定方向 1（依準備階段）並實作；甘特圖移出通用區

**Scope**：`tools.astro` 的「可下載模板」區由單一平鋪網格改為依準備階段五組；
把「推甄時程倒數與任務甘特圖」從通用區移到研究所區的跨學群區塊。
**Non-scope**：不動 `gradTemplates.ts` 與五個分學群指南頁、不動 `resourceSituations.ts`、
不改任何模板檔本身、不動 `verify.mjs`。

**挑選過程中發現的事（這是本輪最該記的一項）**：方向稿宣稱方向 3「沿用
`resourceSituations.ts` 已定義的六個處境」，但它模擬裡的六句只有三句真的在那份設定裡
（活動很散、Side Project、研究所推甄）；「不知道選哪個科系」「面試快到了」「已經錄取了」
三句是新造的，而既有的 `special-admission`、`parent`、`early-start` 被靜靜拿掉。
方向稿自估的實作成本「改一個設定檔加兩頁」因此是低估的——真要共用一份資料，
等於把 `situations` 從 6 改成 9 並改寫既有三個，而 `resources.astro`（知識庫首頁）與
`search.astro`（搜尋頁空狀態）都讀它，這是全站處境語彙改版，不是模板頁改版。
**教訓：方向稿裡「沿用既有設定」這種話要打開那份設定逐項比對，不能照收。**

**變更檔案**：
- `src/pages/pages/resources/tools.astro` — `downloads` 平陣列改為 `downloadGroups`
  五組（找方向 3／累積與記錄 2／整理成果 2／面試 2／入學前 1）；新增 `gradShared`
  放跨學群的甘特圖，渲染在 `#grad-toolkits` 五個學群之前；卡片標題 `h3`→`h4`
  （組標題升為 `h3`）；`description` meta 改為反映分組
- `public/css/tbd-pages.css` — `.grad-toolkit-*` 更名為 `.tool-group-*`（通用區與研究所區
  現在共用同一組樣式，`grad` 前綴不再成立）；新增 `.tool-group-why`、`.tool-group-count`；
  新增 `@media (min-width: 900px)` 下 `.tool-group .card-grid` 固定三欄

**閘門證據**：
- G1 語法：PASS。`npm run build` 157 頁
- G2 boot：N/A（靜態站，無 server 端 import）
- G3 smoke：PASS。`npm run verify` 28/28
- G4 migration：N/A（未動 schema）
- 人工目視：桌面 1280 headless 截圖看過（`verify.mjs` 同一套 Chrome/CDP 路徑）。
  手機 375 **未目視**——Chrome 擴充功能未連線，改由 verify 的 `docOverflow` 探針覆蓋
  （每個目標都在 MOBILE 寬度下測頁面級水平溢出，tools.html 通過）。
  依 CLAUDE.md 陷阱 2，`--window-size` 在窄寬度不可信，故不用它截 375 圖充數。

**第一次截圖抓到的問題（已修）**：拆成五組後每個 `.card-grid` 各自 `auto-fit`，
份數不同的組算出不同欄數——3 份的組卡片 1/3 寬、2 份的組 1/2 寬、1 份的組整排寬，
同一頁卡片忽大忽小。固定三欄修掉。**build 與 verify 都不會抓到這個，只有看圖才會。**

**計畫／決策異動**：`TEMPLATE_INVENTORY.md` 待辦 4 由「方向稿完成，待挑選」改為「已完成」。
無新增 D-0xx——分組軸線是可逆的呈現選擇，不是會綁住後續的結構決策。

**風險與待確認**：
1. 五組的份數不均（3/2/2/2/1）是刻意保留的。「入學前」只有 1 份，視覺上會空一片。
2. 方向 3 的價值（全站語彙一致）沒有實現，只是被延後。若日後要做，範圍見上面那段。

**下一步**：拍板 `TEMPLATE_INVENTORY.md` 的 D-M2／D-M3（賣什麼、定價）。
compass 的 `hasAccess()` 目前仍無呼叫端，整條付費線卡在這個決策後面。
另外 PR #17（本站）與 tbd-compass-app PR #56 都還沒 merge——
#17 merge 後要立刻打 `https://tbd-web.vercel.app/pages/placement.html` 確認回 302。

---

## #012｜2026-08-04｜tools.astro 分組：三個方向稿完成，三案並存待挑，未實作

**Scope**：依 CLAUDE.md 的 UI 改版三級流程（區塊改版＝先出方向稿），為
`TEMPLATE_INVENTORY.md` 待辦 4 產出可操作的 HTML 方向稿。
**Non-scope**：**不實作進站**。三個方向都保留，等挑定再動 `tools.astro`。

**背景**：通用模板從 4 份長到 11 份後，「可下載模板」變成單一平鋪網格。
這 11 份橫跨高中升學、Side Project、面試、Portfolio 四種情境，平鋪讓人難挑。

**產出**：
- Artifact（可操作）：<https://claude.ai/code/artifact/90e5ea7f-67a3-4ea7-a3de-05e1945f1072>
- 原始檔：`docs/design-drafts/tools-grouping-directions.html` — **新增目錄**。
  收進 repo 的理由：artifact 的來源檔原本只在 session 暫存目錄，那裡會被清掉，
  之後就只能把 artifact 抓回來重建。要改方向稿改這個檔再重新發布即可

**三個方向與各自的代價**：

| 方向 | 分組軸 | 主要代價 |
|---|---|---|
| 1 依準備階段 | 找方向→累積記錄→整理成果→面試→入學前 | 最後一組只有 1 份會空；假設學生分得清自己在哪一步 |
| 2 依對象分頁籤 | 高中生 7／大學生 3／研究所 26 | **沒點的頁籤等於不存在**（SEO 與探索性受損）；高中生組仍 7 份平鋪；六層防護網跨身分被迫二選一 |
| 3 依處境 | 沿用 `src/config/resourceSituations.ts` 既有的六個處境語彙 | 若不與該設定共用資料就是 D-003 的形狀；既有處境中「特選」「家長」無對應模板 |

**當輪結論**：使用者表示三個方向都可接受、三種呈現都保留，決定延後。**未挑定，未實作。**

**閘門證據**：N/A —— 本輪未動任何產品程式碼，只新增 `docs/` 底下的文件與方向稿原始檔。
`tools.astro`、`verify.mjs`、模板檔案一律未動，上一輪的 build 157 頁 / verify 28/28 仍然成立。

**計畫／決策異動**：`TEMPLATE_INVENTORY.md` 待辦 4 由「未開始」改為「方向稿完成，待挑選」。
無新增 D-0xx——分組方式尚未拍板，還不到寫決策的時候。

**風險與待確認**：
1. 三個方向的模擬裡，**推甄時程甘特圖都被移到研究所組**（它目前錯放在通用區，是 #009 放的）。
   這是三案共同的前提，但尚未經使用者確認。實作前要先問一次
2. 若選方向 3，實作範圍會從「改一頁」變成「改 `resourceSituations.ts` 加兩頁」——
   處境清單必須共用一份資料，否則同一份事實會有兩份手寫

**下一步**：本輪停在這裡。下次開場要處理的依序是——
① `git push` 兩個 branch（`feat/templates-and-compass-funnel` / `feat/paywall-scaffold-and-theme`），
push 後**立刻**打 `https://tbd-web.vercel.app/pages/placement.html` 確認回 302，
否則四份模板的 compass 出口是死的；
② 挑定分組方向並確認甘特圖歸屬，然後實作；
③ 拍板 `TEMPLATE_INVENTORY.md` 的結論（等同 D-M2）。

---

## #011｜2026-08-04｜接上斷掉的漏斗：4 份高中端模板加 compass 出口，走站內轉址而非硬寫外站網域

**Scope**：`TEMPLATE_INVENTORY.md` 第五節的待辦 3。順帶補齊 7 份新模板缺的頁尾署名。
**Non-scope**：研究所端 25 份不加出口（compass 目前沒有研究所對應功能，導到用不上的地方比不導更傷）、
`tools.astro` 的資訊架構分組、免費／付費決策本身。

**起因**：`TEMPLATE_INVENTORY.md` 盤點時實測 36 份模板的 `.md`，**零份導向 compass**。
118 篇文章 → 36 份模板 → 斷了。學生填完雷達圖、排完甘特圖，沒有任何東西告訴他
可以去把落點算出來。

**變更檔案**：
- `vercel.json` — 新增 `/pages/placement.html` → compass `/placement` 的 302 轉址
- `public/assets/templates/admission-channel-radar.{md,csv}` — 加 compass 出口（CSV 版加在表尾一列）
- `public/assets/templates/admission-main-thread.md` — 加 compass 出口
- `public/assets/templates/department-compare-prompt.md` — 加 compass 出口
- `public/assets/templates/pre-college-30day-checklist.md` — 加出口，指向 `/pages/seen.html`
  （準大學生用不到落點，對應的是經歷紀錄那條線）
- 7 份新模板的 `.md` — 補上既有慣例的頁尾署名（原本 29/36 有，7 份缺）

**為什麼走站內轉址，不直接寫 compass 網域**：
模板是**會被下載的靜態檔**。compass 目前在暫時網域（`tbd-compass-app.vercel.app`，
其首頁註解寫明「搬到 app.tbd… 後再開放索引」）。若把該網域寫進模板，網域一搬，
已經下載到學生電腦裡的副本全部變死連結，而且我們改不到。走 `/pages/placement.html`
轉址則只要改 `vercel.json` 一行。沿用既有 `/pages/seen.html` 的做法，同樣用
`permanent: false`（302）——目的地本來就是暫時的。utm 查詢字串 Vercel 會自動帶過去。

**閘門證據**：
- `npm run build`：PASS（157 頁）
- `npm run verify`：PASS 28/28
- `vercel.json`：JSON 合法性已驗
- CSV 結構：`admission-channel-radar.csv` 加列後仍 22 列 × 4 欄
- 四份模板各自命中一次出口連結（grep 確認）
- **轉址本身 NOT RUN**：`vercel.json` 的 redirects 只在 Vercel 部署後生效，
  本機 `astro preview` 實測 `/pages/placement.html` 回 **404**（預期行為）。
  **部署後必須手動打一次確認回 302 並落在 compass 的落點頁**——在那之前，
  這四份模板裡的連結是死的

**計畫／決策異動**：`TEMPLATE_INVENTORY.md` 待辦 3 完成。無新增 D-0xx。

**風險與待確認**：
1. **轉址未驗證**（見上）。這是本輪唯一沒有證據的一環，且影響四份對外檔案。
2. 這四份模板中有三份**已經在正式站上線**，改動會隨下次 push 一起生效。
3. 發現 compass 的公開鉤子頁（`tbd-compass-app` 的 `src/pages/index.astro`）內嵌了
   **第三份品牌色副本**（`--gc-*`），且其中 `--gc-mid: #767995` 是 `tbd-theme.css`
   註明「已調暗為 #6A6D89 以通過 WCAG AA」之前的舊值。屬 compass 的範圍，本輪未動。

**下一步**：push 之後第一件事是打 `https://tbd-web.vercel.app/pages/placement.html`
確認 302 生效。接著回 `TEMPLATE_INVENTORY.md` 的待辦 4（`tools.astro` 分組，要先出方向稿）
與待辦 5（含公式的 CSV 實際匯入 Google 試算表確認）。

---

## #010｜2026-08-04｜軌 A 收尾：補完剩餘 6 份模板，模板總數 30 → 36

**Scope**：`MONETIZATION_PLAN.md` 軌 A 的產品 1、2、4、5、6、7。
**Non-scope**：既有 29 份的免費／付費決策（D-M2 未拍板）、視覺統一（YY）、UX 檢核（CL）、
`tools.astro` 的資訊架構調整（見下方風險 2）。

**變更檔案**（每份皆 `.md` + `.csv` 兩格式）：
- `side-project-tracker` — 產品 7。15 個任務，CSV 帶公式：填專案開始日自動排目標完成日，
  剩餘天數 `=Cn-TODAY()` 每天更新。前六列都還沒開始寫程式，對應文章 Step 1–2
- `admission-channel-radar` — 產品 1。11 題各評 1–5 分，三管道平均分 `=AVERAGE(C5:C8)` 等自動算
- `interview-answer-material` — 產品 5。三段式自介填空 + 五題型素材表
- `interview-six-layer-prep` — 產品 6。六層逐層填
- `portfolio-reflection-guide` — 產品 2。三種反思結構各兩則
- `readme-portfolio-planner` — 產品 4。區塊檢核表 + 可直接複製的 README 公版
- `src/pages/pages/resources/tools.astro` — `downloads` 陣列 5 → 11 筆

**內容來源**：六份的維度、層序、結構全部取自既有文章，未自創另一套標準——
六層架構逐字對應 `lulu-preparation-system.mdx`、三種反思對應 `reflection-in-portfolio.mdx`、
三管道評估項目對應 `admission-channels-compare.mdx`、README 區塊對應 `readme-guide.mdx`
的「最低可行版本」、Side Project 五階段對應 `side-project-from-zero.mdx`。

**刻意不重複既有資產**：`portfolio-guide.html`（839 行六步驟指南）與 `interview-bank.astro`
（5 題型題庫，每題附「評審想看什麼」）內容已很完整，產品 4、5 只補「可填的工作表」那一層，
不重講一次內容。素材表也導向題庫頁挑題，不在模板裡再抄一份題目。

**閘門證據**：
- `npm run build`：PASS（157 頁）
- `npm run verify`：PASS **28/28**，模板不得漏檔項現在斷言 36 個檔名
- CSV 結構檢查（腳本）：7 份全部 BOM 存在、欄數一致、自我參照公式（`=Dn-`／`=Cn-`）的列號
  等於所在列、雷達圖三個 `AVERAGE` 範圍與實際資料列吻合（C5:C8／C9:C12／C13:C15）
- 人工目視：CDP 量測 `tools.html`，桌面 1280 `1265===1265`、手機 375 `375===375`，
  溢出元素清單皆空。截圖確認 11 張卡片在三欄網格正常排列

**計畫／決策異動**：軌 A 的 7 份模板全部完成（#009 一份 + 本輪六份）。無新增 D-0xx。

**風險與待確認**：
1. **公式版本只有結構驗證，沒有真的匯入 Google 試算表跑過。** 我驗的是欄數、列號參照、
   範圍對齊，這些擋得住最常見的錯位；但「Sheets 匯入後公式是否被正確識別為公式而非文字」
   要實際匯入一次才知道。建議上架前每份 CSV 各匯入一次確認。
2. **`tools.astro` 的資訊架構該重看了。** 「可下載模板」現在是 11 張卡的平鋪網格，
   而底下研究所推甄區是依學群分組的。這 11 份橫跨高中升學、Side Project、面試、Portfolio
   四種情境，平鋪讓人難挑。依 CLAUDE.md 的 UI 改版三級流程，這屬「區塊改版」，
   要先出方向稿再實作，本輪刻意不動。
3. 尚未 push。

**下一步**：兩件事二選一——(a) 處理風險 2 的 `tools.astro` 分組（要先出 2–3 個方向稿）；
(b) 進軌 A 的 W1 盤點：36 份模板逐份決定免費／付費，那同時就是在回答 D-M2。
建議先 (b)，因為 (a) 的分組方式會被 (b) 的結果影響（付費項要不要跟免費項混排是同一個問題）。

---

## #009｜2026-08-04｜新增推甄時程甘特圖模板（CSV 帶公式，首份），並把模板閘門從 25 份擴到 30 份

**Scope**：`MONETIZATION_PLAN.md` 軌 A 的產品 10。順帶修正閘門只保護 `grad-*` 的涵蓋缺口。
**Non-scope**：其餘 6 份待做模板、既有 29 份的免費／付費決策、視覺統一（YY）、UX 檢核（CL）。

**變更檔案**：
- `public/assets/templates/graduate-timeline-gantt.{md,csv}` — **新增**。17 個任務，CSV 的日期欄是公式（`=$B$2±n`），改 B2 一格全部重算
- `src/pages/pages/resources/tools.astro` — `downloads` 陣列新增第 5 筆
- `scripts/verify.mjs` — `templateFiles()` 由 `grad-` 前綴篩選改為所有 `.md`，閘門涵蓋 25 → **30 份**

**閘門證據**：
- `npm run build`：PASS（157 頁）
- `npm run verify`：PASS **28/28**，模板不得漏檔那一項現在斷言 30 個檔名
- CSV 結構：BOM 存在、每行皆 7 欄（腳本檢查）
- **公式求值模擬**：解析 CSV、以 `B2=2026/10/15` 代入求值，確認 17 列的 `=$B$2±n` 可解析、
  `=Dn-$B$2` 的列號與所在列一致、起訖未顛倒。**這一步抓到一個真的錯**——見下

**抓到並修掉的錯**：末段三列的偏移量與 `graduate-timeline.mdx` 不符。原本錄取結果落在
+90 天（送件 10/15 → 隔年 1/12），但文章寫的是「十一月底到十二月」。已改為
口試準備 +14→+40、口試 +30→+50、錄取 +45→+75，重算後為 11/14–12/04 口試、11/29–12/29 錄取，
與文章一致。**只看檔案長得對是抓不到這個的**，要把公式真的算一次。

**計畫／決策異動**：無新增 D-0xx。閘門涵蓋範圍的擴大屬 D-003 的既有原則延伸，不另立決策。

**風險與待確認**：
1. **CSV 帶公式是本站首例**，既有 29 份都沒有。代價是欄位位置變成契約——使用者在表格中間插入一列，
   該列以下的 `=Dn-$B$2` 會被試算表自動調整（沒問題），但若刪掉 B2 所在列則全表壞掉。MD 版已註明
   「CSV 才是完整工具，MD 是紙本版」。
2. 甘特圖的**色條沒有自動產生**——CSV 帶不了條件式格式。MD 裡給了四步驟自己加，並明講不加也完全可用。
   沒有在頁面上宣稱「自動產生甘特圖」。
3. 尚未 push。

**下一步**：軌 A 剩 6 份。建議順序：Side Project 追蹤板、升學管道雷達圖（這兩份同樣需要公式，
可沿用本輪的作法）→ 面試答題素材工作表、六層防護網、反思引導、README／Portfolio 規劃表（純結構）。

---

## #008｜2026-08-04｜新增落點分析方案頁（noindex、未掛 nav），價格以 verify 寫死數字防跨 repo 走鐘

**Scope**：`MONETIZATION_PLAN.md` §5.4——官網側的方案說明頁與導流。
**Non-scope**：不改 `site.ts` 的 nav（付費牆未上線，先不開入口）、不動既有頁面、不動 29 份免費模板、不碰金流（在 compass 那側）、不 push。

**變更檔案**：
- `src/pages/pages/compass.astro` — **新增**。落點分析方案頁：先講免費的三件事（落點基本結果、29 份模板、知識庫）→ 免費與付費的一句話差別 → 兩張方案卡 → CTA。設 `noindex={true}`
- `src/config/pricing.ts` — **新增**。官網側的方案資料單一來源，檔頭標明它是 compass `entitlement.ts` 的鏡像與改價順序（見 D-006）
- `public/css/tbd-pages.css` — 附加 `.pricing-*` 區塊（8 個 class）。全部走 `--tbd-*` token，未寫死色值
- `scripts/verify.mjs` — 新增 1 個測試項，`mustContain` 寫死 `NT$`／`499`／`899`／`tbd-compass-app.vercel.app`

**閘門證據**：
- `npm run build`：PASS（157 頁，較上輪 +1）
- `npm run verify`：PASS **28/28**（含新增的 1 項）
- 人工目視：改用 CDP `Emulation.setDeviceMetricsOverride` 量測（依 CLAUDE.md 陷阱 #2，不用 `--window-size`）。桌面 1280 → `scrollWidth 1265 === clientWidth 1265`；手機 375 → `375 === 375`；兩者 `overflowing` 元素清單皆為空。截圖確認：桌面三欄卡片、手機單欄堆疊、兩個 CTA 皆可見，價格 NT$499／NT$899 正確渲染
- 外部連結實測（CLAUDE.md 陷阱 #3）：`tbd-compass-app.vercel.app` 的 `/`、`/placement`、`/login` 皆回 200，才寫進頁面

**計畫／決策異動**：新增 D-006（跨 repo 價格鏡像與 verify 寫死數字）。

**風險與待確認**：
1. **頁面內容描述的付費／免費界線尚未成真。** compass 的付費牆還沒套到落點頁，`MONETIZATION_PLAN.md` §2 的 D-M2／D-M3 也未拍板。這正是設 `noindex` 且不掛 nav 的原因——目前它是給團隊對稿用的，不是對外頁。**拍板並且 compass 的 gating 實際上線之前，不要拿掉 noindex。**
2. 價格是跨 repo 鏡像，三處要同步（見 D-006）。
3. `src/config/pricing.ts` 不在 eslint config 的涵蓋範圍內（跑 eslint 得到 "File ignored because no matching configuration was supplied"）。`src/config/` 底下的其他檔案應該也一樣，本輪未動 eslint 設定。
4. 尚未 push；Vercel 正式部署需另行確認。

**下一步**：等 D-M2／D-M3 拍板。拍板後這一頁要做三件事：拿掉 `noindex={true}`、在 `src/config/site.ts` 的 nav 加入口、把文案裡「免費 vs 付費」的描述對回 compass 實際 gating 的行為。

---

## #007｜2026-08-03｜還清三項技術債＋知識庫首頁去冗餘

**Scope**：①#006 下一步列的三項技術債全部處理 ②知識庫首頁（`resources.astro`）的冗餘與優化。
**Non-scope**：知識庫首頁的視覺改版、文章內容調整、Week 7。

**變更檔案**：
- `scripts/verify.mjs` — ①新增 `portInUse()`，啟動 preview 前若 4321 已被占用就 `exit 2` 並說明原因（見 D-004）②在啟動 preview 前先跑站內連結檢查，壞掉直接中止
- `scripts/check-links.mjs` — **新增**。掃 `dist/**/*.html` 全部站內連結，比對檔案存在與錨點存在（見 D-005）
- `src/content/articles/pre-college-30-day-checklist.mdx` — 修死錨點：`pre-college-complete-guide.html#departments` 該 id 不存在，改指向各科系建議實際的起點 `#stem`，連結文字同步改為「各科系準備建議」以與目標一致
- `src/layouts/BaseLayout.astro` — `tailwind` 加 `/* global */` 宣告（它是 CDN 注入的執行期全域，規則沒錯、是缺宣告，所以宣告而非關規則）
- `src/config/gradTemplates.ts` — 新增 `gradGuides` / `gradGuideByDept`：「學群 → 完整指南」的唯一資料來源（含設計傳播，故不能用 `gradTemplateGroups` 代替）
- `src/layouts/ArticleLayout.astro` — `GUIDE_BY_DEPT` 改讀 `gradGuideByDept`；順手修掉 sort comparator 的未使用參數
- `src/pages/pages/guides/graduate-application.astro` — `GUIDE_BY_TRACK` 由 `gradGuides` 產生
- `src/pages/pages/resources.astro` — ①六筆手寫的分學群指南搜尋資料改由 `gradGuides` 展開 ②主題指南 Tab3 移除與「快速入口」重複的 3 個資源頁連結，標籤由「備審面試與資源」改為「備審與面試」 ③刪除未使用的 `DIM_NAMES` ④工具頁的搜尋描述由「理工研究所五套模板等」更新為五個學群
- `src/pages/pages/faq.astro` — 移除未使用的 `site` import

**閘門證據**：
- G1 語法：PASS（`npm run build` 156 頁）
- G3 smoke：PASS（`npm run verify` 27/27）
- 站內連結：PASS（159 頁掃描，**首次執行抓到 1 個死錨點**，已修）
- eslint：`npx eslint src scripts` **0 error 0 warning**（本輪之前是 1 error 3 warning，全部清掉）
- 埠守衛：以真實佔用 4321 的 server 實測，verify 如預期 `exit 2` 並印出說明
- 產物抽查：對照表頁與知識庫首頁各含 6 個學群指南連結（單一來源生效）；Tab3 已無資源頁連結

**計畫／決策異動**：新增 D-004（埠占用直接中止）、D-005（站內連結閘門，事實來源是 build 產物、只檢查站內）。

**風險與待確認**：
- ~~六份指南頁的 `title` 仍各自寫死，與 `gradGuides.label` 沒有機制保證一致。目前兩邊相同~~ → **本輪一併解決，且原描述有誤**：兩邊本來就**不同**（頁面是「…申請**完整**指南」，label 是「…申請指南」），不是「目前相同」。這不是 bug——短版供麵包屑與搜尋結果用、全稱供頁面標題用，是兩個用途。處置：在 `GradGuide` 增加 `pageTitle` 欄位承接全稱，六個指南頁改讀 `gradGuideByDept['<學群>'].pageTitle`，兩種形式收進同一份來源並各自命名。build 產物比對，六頁的 `<title>` 與 `<h1>` 與改動前完全一致。
- 錨點檢查依賴產物裡的靜態 `id=`／`name=`；若日後出現 JS 動態產生的錨點會誤報。
- 尚未 push。

**下一步**：Week 7 素材到位後同一套結構落地。技術面已無掛帳項目——`gradGuides` 現在同時是 href、短名、頁標題與搜尋說明的唯一來源，新增學群只要加一筆。

---

## #006｜2026-08-03｜分學群系列補外部權威來源（12 篇）＋把本輪教訓寫進 CLAUDE.md

**Scope**：結清 #004 留下的「其餘 21 篇零外部連結」，重點是當時說找不到來源的商管財經與設計傳播兩軌；並把這幾輪踩到的驗證陷阱固化成規範。
**Non-scope**：新增文章、視覺調整、`BaseLayout.astro` 既有的 `tailwind is not defined` lint error（仍未處理）。

**變更檔案**：
- `src/content/articles/` 共 12 篇補上外部來源（只加在內文已經叫讀者去查的位置）：
  - 商管財經：`business-graduate-choose`（AACSB 認證校院查詢、NDLTD）、`business-graduate-proposal`（公開資訊觀測站、主計總處、政府資料開放平臺）
  - 設計傳播：`design-graduate-choose`（NDLTD、新一代設計展、金點設計獎）、`design-graduate-portfolio`（新一代設計展、金點設計獎）
  - 理工：`engineering-graduate-timeline`（國科會大專生研究計畫）、`engineering-graduate-proposal`（Scholar、NDLTD、學術倫理中心）、`engineering-graduate-cv`（學術倫理中心）
  - 生醫：`biomed-graduate-proposal`／`biomed-graduate-oral`（臺灣學術倫理教育資源中心）、`biomed-graduate-timeline`（政府資料開放平臺）
  - 人文社科：`humanities-graduate-proposal`（華藝、臺灣期刊論文索引、NDLTD、Scholar）
  - 藝術：`arts-graduate-cv`（藝術銀行 `artbank.tfaf.org.tw`）
- `CLAUDE.md` — 新增「驗證時的四個陷阱」（查 dist 不查 src／RWD 寬度別用 `--window-size`／外部網址先實測／PowerShell 中文亂碼）與「新增分學群模板」節（實體檔 → `gradTemplates.ts` 登記 → verify 的固定順序）
- `~/.claude/skills/fullstack-flow/references/gotchas.md` — 同一批教訓的泛用英文版（**不在本 repo 版控內**，換機器要另外帶）

**閘門證據**：
- G1 語法：PASS（`npm run build` 156 頁）
- G3 smoke：PASS（`npm run verify` 27/27）
- 外部連結：13 個網址逐一實測，全部 200。`www.stat.gov.tw` 首次 DNS 解析失敗、重試 200 且公共 DNS 查得到（104.18.0.120），屬本機解析器抖動；藝術銀行早先用 `artbank.ntmofa.gov.tw` 兩次解不出來，改用可解析的 `artbank.tfaf.org.tw`

**風險與待確認**：
- **~~verify 隨機失敗再現~~ → 根因已查明，不是 D-001**（本欄原先寫成「D-001 首次再現」，是錯的，更正於此）。本輪 verify 連續三次紅：19/27、22/27、13/27，加上另一路的 21/27。四次的共同特徵是**失敗項全是 `探針錯誤：fetch failed`，而且是從某一點開始的連續尾段**，不是 D-001 那種「失敗集合每次都不同、連沒動過的 404 頁都中」的隨機分布。
  實際原因：**當時有兩個 `npm run verify` 併發**（主線與一個背景 agent 各跑各的），兩邊都要綁 `PORT 4321` 起 astro preview，後啟動的那個搶不到／先啟動的被擠掉，於是從某個目標開始整段 fetch 不到。等背景工作結束後單獨重跑，**27/27，一次就過**。
  另外查過：磁碟上沒有我自己腳本殘留的 Chrome（`--user-data-dir` 指向 scratchpad 的進程數為 0），當時的 29 個 chrome 進程是使用者自己的瀏覽器，與此無關。
  **處置原則：整批尾段失敗先確認有沒有第二個 verify／preview 在跑，而不是去調重試參數。** D-001 的重試機制在這個情境下幫不上忙——埠被佔住時重試幾次都一樣。真正該做的是讓 verify 在 4321 已被佔用時**明確報錯而不是靜默失敗**，這一項列入下一步。
- 藝術類群仍有 4 篇（timeline／choose 以外）沒有外部來源；藝術的展覽與駐村資訊分散在各館所，沒有單一權威入口可引。
- 這兩個 commit 當下沒寫 WORKLOG，是事後補記（違反「當輪沒記＝違規」）。補記時是靠 `git show` 逐檔取回實際新增的網址，不是憑印象。

**下一步**：Week 7 素材到位後同一套結構落地（`docs/content-plans/` 目前最新為 Week 6）。技術面三項：①**`scripts/verify.mjs` 應在 4321 埠已被占用時明確中止並說明原因**（本輪四次紅字全出於此，卻表現成「隨機失敗」，差點被誤記成 D-001 再現）②`BaseLayout.astro` 的 lint error 已掛帳多輪 ③篇數已達 118，值得評估加一道「站內連結全掃、404 即失敗」的閘門——`relatedArticles` 指向的 slug 目前無人把關。

---

## #005｜2026-08-03｜人工目視 1280／375（結清連續三輪的掛帳）＋修掉一處重複文字

**Scope**：把連續三輪掛帳的人工目視補做完：Week 5／6 兩個指南頁、Week 6 五篇文章、本輪新增的 tools 頁分學群區塊與階段 1 的 series-nav。
**Non-scope**：目視發現的排版偏好調整（卡片 3+2 換行留白、學群標題字級）——不是缺陷，未動。

**變更檔案**：
- `src/layouts/ArticleLayout.astro` — series-nav 的學群指南按鈕移除 `{track}：` 前綴。label 本身已含學群名，原本會渲染成「理工：理工研究所申請指南」「藝術：藝術研究所申請指南」

**閘門證據**：
- G3 smoke：PASS（`npm run verify` 27/27）
- 人工目視：**已執行**，1280 與 375 兩個寬度，量測 + 截圖：
  - 橫向溢出：tools／graduate-recommend-vs-exam／graduate-arts／arts-graduate-oral 四頁在 375 皆為 `scrollWidth == clientWidth`，過寬元素 0 個
  - 目視：tools 頁五組學群卡片分組清楚；375 下 6 顆學群指南按鈕垂直堆疊、無截斷

**工具方法（下次要用）**：Claude in Chrome 擴充功能未連線，改用本機 Chrome。**但 `--window-size` 在這台機器上量不到窄寬度**——Windows 有視窗最小寬度，指定 375 實際會得到 485，加上顯示縮放一度量到 497，早期截圖「內容被切掉」全部是這個造成的假象，不是版面 bug。正確作法是走 DevTools Protocol 的 `Emulation.setDeviceMetricsOverride`，才拿得到真正的 375。腳本留在 scratchpad（`shoot.mjs` 全頁截圖＋溢出量測、`shoot-at.mjs` 捲到選擇器截視窗）。

**風險與待確認**：
- 目視只覆蓋 5 頁的關鍵區塊，不是全站逐頁。
- 尚未 push。

**下一步**：Week 7 素材到位後同一套結構落地。另掛帳：分學群系列其餘 21 篇的外部來源（商管財經與設計傳播兩軌尚未找到合適的權威來源）。

---

## #004｜2026-08-03｜補內外部連結：找回下載頁上消失四輪的 20 份模板、階段1／4 的死路、分學群系列的第一批外部來源

**Scope**：使用者驗收 Week 6 後要求盤點「哪些地方需要優化、需要增加內外部連結」，授權動到 Week 1–5 的既有檔案。三件事：①模板下載頁漏檔 ②研究所系列的斷點 ③分學群系列補外部權威來源。
**Non-scope**：既有頁面的視覺改版、新增文章、社群素材、`BaseLayout.astro` 既有的 `tailwind is not defined` lint error（不在本輪範圍，只回報）。

**變更檔案**：
- `src/config/gradTemplates.ts` — **新增**。五學群 × 五份模板的唯一資料來源（見 D-003）
- `src/pages/pages/guides/graduate-{engineering,biomed,business,humanities,arts}.astro` — 五頁的本地 `templates` 陣列改為 `templatesFor('<學群>')`，渲染結果不變
- `src/pages/pages/resources/tools.astro` — 新增「研究所推甄：分學群工具包」區塊（依學群分組、各附指南連結）；原本混在通用清單裡的 5 筆理工模板移入該區塊；meta description 補上五學群
- `public/css/tbd-pages.css` — 新增 `.grad-toolkit-group/.grad-toolkit-title/.grad-toolkit-guide`（25 張卡需要分組標題，否則連成一片）
- `src/layouts/ArticleLayout.astro` — `seriesNav` 新增 `guides` 欄位：當 `others` 為空（階段 1 推甄vs考試、階段 4 聯繫教授沒有分學群專屬文）時，橫向軸改列六份學群指南，不再是死路
- `src/content/articles/{arts,humanities,engineering,biomed}-graduate-choose.mdx` — 在「內文已經叫讀者去查論文／計畫」的位置補上查詢入口：臺灣博碩士論文知識加值系統、GRB 政府研究資訊系統、Google 學術搜尋、華藝線上圖書館
- `src/content/articles/arts-graduate-proposal.mdx` — 常見錯誤節補上國藝會補助（對應「忽略製作成本」那一項）
- `src/content/articles/arts-graduate-oral.mdx` — 補兩處內文連結（→ cv、→ proposal、→ choose）；原本內文站內連結只有 1 個，五篇中最少
- `src/content/articles/{arts,design,humanities,stem,cs-ai,business,medical}-application.mdx` — relatedArticles 各補一筆，從大學端各科系文向前導流到對應學群的研究所指南
- `scripts/verify.mjs` — 新增 2 項：①tools.html 必須包含磁碟上每一份 `grad-*.md`（事實來源是檔案系統，不是設定檔）②階段 1 文章的橫向出口必須是六份學群指南

**閘門證據**：
- G1 語法：PASS（`npm run build` 156 頁，與上輪相同——本輪未新增頁面）
- G2 boot：N/A（靜態站）
- G3 smoke：PASS（`npm run verify` **27/27**，含新增的 2 項）
- G4 migration：N/A
- eslint：`npx eslint src scripts` → 1 error 3 warnings，**全部為既有問題且都不在本輪改動的行上**：`BaseLayout.astro:68 'tailwind' is not defined`（Tailwind CDN 的 inline config）、`faq.astro:3 site 未使用`、`resources.astro:433 DIM_NAMES 未使用`、`ArticleLayout.astro:124 b 未使用`
- 產物抽查：`dist/pages/resources/tools.html` 含 29 個模板 `.md` 連結（4 通用 + 25 分學群，與磁碟一致）；四篇 choose 文與 proposal 文的外部連結都進了 build

**修正**：向使用者回報的第二項發現「通用研究所文完全沒有向下連到學群版（0 處）」**是錯的**。我只 grep 了 `.mdx` 原始碼，沒看 layout 渲染結果——`ArticleLayout` 的 `series-nav` 早就自動產生了同階段各學群連結，藝術版也已自動長出。實際查 build 產物，六篇通用文中五篇各有 5 個學群連結，只有階段 1 的 `graduate-recommend-vs-exam` 是 0（因為沒有任何學群有階段 1 專屬文）。本輪修的是這個真正的洞，不是原先誤判的那個。**教訓：判斷「頁面上有沒有這個連結」要查 `dist/`，查 `src/` 只能證明「不是手寫的」。**

**計畫／決策異動**：新增 D-003（分學群模板單一資料來源＋閘門以磁碟為事實來源）。

**風險與待確認**：
- 五個分學群指南頁改吃共用資料後，渲染結果靠 verify 的既有工具包測試把關（五頁都有一項），但那些測試只斷言「工具包標題＋一個錨點」，不逐張比對卡片內容。若日後有人改動 `gradTemplates.ts` 的文案，指南頁會跟著變而閘門不會擋——這是單一來源的預期代價。
- 外部連結目前只補在四篇 choose 文與一篇 proposal 文。分學群系列其餘 21 篇仍為零外部連結，商管財經與設計傳播兩軌尚未找到合適的權威來源。
- 藝術銀行（`artbank.ntmofa.gov.tw`）DNS 解析失敗，未採用；需要時要另外找正確網域。
- 尚未 push。

**下一步**：Week 7 素材到位後同一套結構落地。另兩件掛帳：①人工目視 1280／375 已連續兩輪掛帳，本輪又動了 tools 頁的新版型（25 張卡分五組），**這一頁的目視優先度最高** ②分學群系列其餘 21 篇的外部來源尚未補。

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
