# WORKLOG

每次交付前寫一則。最新的在最上面。主檔只留最近 15 則，其餘由 `archive-docs.js` 移到 `docs/archive/`。

**只寫可觀察的行為差異。** 「已優化」「更完善」「重構得更清楚」不是變更描述，是形容詞。

---

## #031｜2026-09-05｜套磁信 9 份換上 YC 的 v2：八節統一、十五格缺口補齊、勾選欄五種叫法收斂成零

依 YC《輪調審閱 · Batch 2 · W4｜套磁信 9 份》（2026/09/04）。**檔案是 YC 的匯出，不是本地重做**——
依 D-015「Drive 上改、匯出 CSV 走 PR 回 repo」，來源是她 9/4 的 `Batch2_套磁信_v2_csv` 資料夾。

**做了什麼**（可觀察的行為差異）：

- **九份 `grad-*-contact-email.csv` 全數換版**，+559 −239 行。逐項實測而非採信報告：
- **八節在九份裡全部到齊**（先判斷該不該寄／信件結構／可附作品與能力證據／值得問的問題／
  寄信前檢核／寄信時機／好壞寫法對照／教授追蹤），9×8 全 ✓。這就是報告第 01 節那
  **十五格共同規格缺口**的落地：原本理工缺 3、商管缺 3、生醫缺 2、人文缺 2、農生缺 2、
  藝術缺 1、法政缺 1、設計缺 1，加上九份都沒有的教授追蹤。
- **勾選欄名稱收斂**。改版前同一件事有八種寫法，改版後只剩五個、且與規格一一對應：
  是否符合 19、是否確認 11、要附上 9、是否採用 9、我的草稿 9、我手上有 9。
  舊的 `是否成立`、`是否已排除`、`我的內容`、`你的草稿`、`我的版本` **零殘留**。
- **理工的信件結構長出填寫欄**。改版前是「目的｜要寫什麼｜自我檢查」三欄全給讀的，
  使用者沒有地方寫草稿——那份嚴格說不是模板是說明文。現在表頭是
  `段落,這一段要做到,我的草稿`。
- **理工的通用篇連結自己回到頁尾**（第 78 列「完整說明」），
  不再卡在「常見的石沉大海原因」表的資料列區。

**四項待拍板的新增，全部已含在 YC 的檔案裡**，不需要另外實作：教授追蹤（九份都有第八節）、
值得問的問題（九份都有第四節）、理工自我檢查搬進寄信前檢核、農生浮動註解獨立成小標。

**憑什麼說做完了**（閘門證據）：

| 閘門 | 結果 | 證據 |
|---|---|---|
| 落地前先驗來源檔 | PASS | 9 份 BOM 全在、「到到」零命中、行數 78–92 |
| `audit-templates.mjs --strict` | PASS | 九份 contact-email 全 ✓、欄數全 6；轉檔殘留 56 份零命中 |
| 八節到齊 | PASS | 9×8 全 ✓（`grep "^[一二三四五六七八]、"`）|
| 勾選欄收斂 | PASS | 舊五種叫法零殘留 |
| `npm run verify` | PASS | **40/40**，build 176 頁；tools.html 模板不得漏檔那項也綠 |

**計畫／決策異動**：無新增 D-0xx。原本疊在 `fix/csv-dash-daodao`（PR #30）之上，
讓新加的轉檔殘留閘門直接驗 YC 的檔案；#30 合併時該分支被一併刪除、PR #32 因此被 GitHub
自動關閉且無法重開，改以 `main` 為基底重開於 **PR #33**（內容不變）。

**留下的洞**：

1. **PR #31 的理工 CSV 改動被這批取代。** 那個 PR 把通用篇連結從第 24 列移到頁尾，
   YC 的 v2 已經自己做了。#31 應該撤掉那一個檔案的改動、只留文章三處，否則合併時
   會在同一個檔案打架。**未做，待 LR 決定。**
2. **xlsx 的副本連結還沒建。** 出貨用的是 `Batch2_套磁信_xlsx_20260904/` 的三分頁 xlsx，
   不是這批 CSV（依 D-008）。農生那份特別要注意不能用 8/29 的中間版本。**未做。**
3. **勾選欄在 Sheets 要人工轉成真核取方塊。** YC 的 xlsx 用單選下拉代替，這是 xlsx
   帶不動的唯一一項，建副本連結時要補。
4. **YY 還沒被通知**她的 W4 少一份。
5. 生醫的研究誠信在 PR #31 補進了文章，但**工具端沒有對應欄位**，v2 也沒有。要不要補一列
   檢核，下一批一起判斷。

**下一步**：合併 PR #33 後重新部署，
**從正式站下載九份 contact-email 確認拿到的是 v2**（看行數：78–92，舊版是 38–60）。
然後處理副本連結與 YY 的通知。

---

## #030｜2026-09-05｜Batch 2 輪調審閱落地（一）：文章三處對齊工具

依 YC《輪調審閱 · Batch 2 · W4｜套磁信 9 份》（2026/09/04）的第 06 節與第 05 節。
**這則只做「不需要 YC 優化版檔案」的部分**，十五格規格缺口與四項待拍板的新增沒有做，原因見下。

**做了什麼**（可觀察的行為差異）：

- **法政節七段補上「主旨」**（`graduate-contact-professor.mdx`）。文章原本列
  簡短自我介紹→…→附件或代表作→禮貌結尾共七段，`grad-law-contact-email.csv` 卻是
  主旨→…→禮貌結尾與附件共七段：**兩邊都是七段但內容錯開一格**。
  YC 判定主旨實務上必要、這次不動工具，所以是文章向工具對齊：補主旨、把「附件或代表作」
  併進「禮貌結尾與附件」，並加一句主旨要具體到能被辨識。現在逐段對得上。
- **生醫節補「守住研究誠信」一點**。該節標題是「技術即戰力與研究誠信」，正文四點
  全在講即戰力，**研究誠信一個字沒有**——標題承諾了正文沒交付的東西。補的內容：
  未發表數據的來源與引用授權、涉及人體或動物時 IRB／IACUC 的送審狀態、
  作品連結不得放他人未授權的圖表。
- **「收到回覆後怎麼接」補一段追蹤**。全文沒有任何一節提到套磁本來就會同時寄給多位教授、
  因此需要記錄。補的回覆狀況五分類（尚未回覆／願意聊／要看申請結果／今年不收／方向不合）
  與 YC 第 04 節新增 1 的「教授追蹤」分頁下拉一致。
- ~~理工的通用篇連結從表格資料列移到頁尾~~ **已撤回**。原本這一則也改了
  `grad-engineering-contact-email.csv`，把第 24 列那條連結移到頁尾。當天稍晚 YC 交出
  套磁信 v2（見 #031），她的版本自己就把連結放在頁尾第 78 列，這個改動變成多餘、
  而且會和 v2 在同一個檔案打架。**本則只剩文章三處**，CSV 已還原成與 `main` 相同。

**憑什麼說做完了**（閘門證據）：

| 閘門 | 結果 | 證據 |
|---|---|---|
| `audit-templates.mjs --strict` | PASS | 45 份規格全 ✓（撤回 CSV 改動後模板未再變動）|
| `npm run verify` | PASS | **40/40**，build 176 頁 |

**計畫／決策異動**：無新增 D-0xx。本則編號 #030，#029 在 `fix/csv-dash-daodao`（PR #30）上，
兩條分支都從 `main` 開出、尚未合併，合併時 WORKLOG 這一段會需要人工排序。

**留下的洞**：

1. ~~十五格共同規格缺口與四項待拍板的新增，全部未做。~~ **當天由 YC 交出 v2 解決，見 #031。**
   以下保留原始判斷紀錄： YC 的優化版 CSV 9 份在她 Drive 的
   `01_優化版/Batch2_套磁信_v2_20260904/`，但企劃文件只連了 xlsx 資料夾
   （`drive.google.com/drive/folders/1LJk285FEQ8ZWfWCvibYmi6hviBxj5waw`，9 份 xlsx、無 CSV）。
   repo 正本是單頁 6 欄 CSV，xlsx 是三分頁交付版，兩者不是 1:1。
   **從 xlsx 自己推 CSV 等於再發明一次轉檔規則**（今天修的到到 bug 正是轉檔產物），
   而且會產生第三個版本、與 D-008 的單一事實來源衝突。依 D-015 應該取 YC 的 CSV 匯出走 PR。
   **待 LR 裁示。**
2. **要通知 YY**：農生那份原歸她，9/4 由 YC 併進 Batch 2 做完，她的 W4 因此少一份。未通知。
3. **農生的副本連結要改用 `Batch2_套磁信_xlsx_20260904/`**，不要用 8/29 的中間版本、
   也不要用站上的 CSV（依 D-008）。Drive 作業，未做。
4. 生醫那一點是**文章自己的缺口**，工具端沒有對應欄位。要不要在
   `grad-biomed-contact-email.csv` 也補一列研究誠信檢核，等優化版落地時一併判斷。

**下一步**：等 LR 決定十五格缺口要走「跟 YC 要 CSV」還是「從 xlsx 推」。在那之前先把
PR #30（到到修正）合併並重新部署，**從正式站重新下載驗收**。

---

## #029｜2026-09-05｜到到破折號 7 處修回站上；轉檔殘留掃描接成閘門，涵蓋 56 份而非 45 份

**做了什麼**（可觀察的行為差異）：

- **設計 3 份 CSV 的 7 處「到到」改回 ——**。`grad-design-contact-email`（行 25、44）、
  `grad-design-oral-checklist`（行 55）、`grad-design-portfolio-checklist`（行 15、17、20、60）。
  逐處對照同名 `.md` 正本確認替換字是 ——，不是猜的。BOM 與欄數未動（56 份 BOM 全在）。
- **這是第三次處理同一個 bug，前兩次都沒收乾淨。** 8/23 審 Batch 2 時修掉
  `proposal-framework` 一份就收工；8/29 YC 掃出另外 7 處寫成
  `02_文件/12_LR_BUG_到到破折號_20260829.md` 交給 LR；9/4 複查發現**修正指令根本沒生效**，
  7 處原封不動還在站上，買家下載得到。
- **`audit-templates.mjs` 新增「轉檔殘留掃描」並納入 `--strict` 的退出碼**。
  該腳本已經是 `npm run verify` 的閘門（在 build 之前），所以這道檢查跟著自動生效。
- **掃描範圍是 56 份，不是 45 份。** 規格表（B1／B2／B3）只認 `grad-*`，但同一條 MD→CSV
  管線還產出另外 11 份（高中生找方向那批）。只掃 45 份等於留半個洞，所以這道檢查獨立於規格表。
- **結論行不再假綠。** 原本 `結論：` 只看規格缺漏，規格全過但有轉檔殘留時仍印
  「✅ 全部符合規格」而 exit 1——訊息與退出碼互相矛盾。改成兩項分開報。

**憑什麼說做完了**（閘門證據）：

| 閘門 | 結果 | 證據 |
|---|---|---|
| G1 語法 | PASS | `node --check scripts/audit-templates.mjs` |
| lint | PASS | `npx eslint scripts/audit-templates.mjs` exit 0 |
| `audit-templates.mjs --strict` | PASS | 45 份規格全 ✓；轉檔殘留掃描 **56 份零命中**；exit 0 |
| 負向測試（grad-*） | PASS | 在 `grad-design-oral-checklist.csv` 行 55 塞回「到到」→ 紅、指名檔案與行號、exit 1 |
| 負向測試（非 grad-*） | PASS | 在 `side-project-tracker.csv` 塞「到到」→ 紅、exit 1。證明 11 份也擋得到 |
| `grep -c 到到 public/assets/templates/*.csv` | PASS | 零命中（YC 建議的驗證指令） |
| `npm run verify` | PASS | **40/40**，build 176 頁；結論「✅ 全部通過，可進入部署」|

**計畫／決策異動**：無新增 D-0xx。編號跳過 #028——那一號已由 `feat/sop-journey-figures` 佔用，
本分支從 `main` 開出，兩者尚未合併。

**留下的洞**：

1. **根因修不掉，因為轉檔器不在任何 repo 裡。** 跨整個工作區（`D:/New folder/TBD`，
   排除 node_modules）找不到任何 MD→CSV 產生器，`docs/` 也沒有轉檔流程的文件。
   CSV 是被當成正本 commit 進來的產物。YC 的推論（破折號死在剝除 `## ` 與 `- [ ] `
   的那段程式碼，因為 MD 內文 11 處全對、壞的 7 處全在標題與清單列）成立，
   但**沒有程式碼可以修**。這道閘門是目前唯一的防線；下次重轉 CSV 的人是誰、用什麼工具，
   仍然沒有紀錄。
2. **YC Batch 2 輪調審閱（9/4）的其餘發現全部未處理**：七個共同規格缺 15 格、
   同一件事有四到八種叫法、四項待拍板的新增（教授追蹤／值得問的問題／理工自我檢查搬家／
   農生浮動註解）、三處文章修改建議（法政七段少主旨、生醫標題承諾研究誠信但正文沒有、
   各學群沒提追蹤多位教授）。另有兩項交付面的：理工那份的通用篇連結誤置在表格資料列、
   農生要改用 `Batch2_套磁信_xlsx_20260904/` 而不是 8/29 的中間版本。
3. **要通知 YY**：農生那份原歸她，9/4 由 YC 併進 Batch 2 做完，她的 W4 因此少一份。
4. **改完不等於上站。** `dist/` 不入版控，本次只動 `public/`；正式站要重新部署才會生效，
   而本分支是 `fix/csv-dash-daodao`，尚未合進 `main`。8/29 那次失效的可能原因之一
   就是「改了但沒重新部署」，這次要盯到站上重新下載確認。

**下一步**：把 `fix/csv-dash-daodao` 開 PR 併回 `main` 並重新部署，然後**從正式站重新下載**
`grad-design-contact-email.csv` 確認 7 處都沒了（不是看 repo，看站上）。之後再接 YC 審閱的
第 2 項與第 3 項。

---

## #027｜2026-08-30｜農生環境 5 份補審；倫理區塊從 3 個學群擴散到 9 個

**做了什麼**（可觀察的行為差異）：

- **補審農生環境 5 份**（`docs/batch4-agriculture-review.md`）。這 5 份隨 PR #25 於 8/23 上線，
  與排程 v5 擬定同日，v5 §01 仍寫「內容仍未產出，維持 Batch 4（W6 審閱）」——
  **已上線但未審**。這正是 v5 §02 自己預言的失敗：「農生環境上線時若 B1–B3 都已結批，會一次漏 5 份。」
  審完結論是品質高於平均，**不需要下架或 v2 改版**。
- **農生 5 份補回標點 128 處**。實測九學群 CSV 的頓號用量，農生是**唯一的 0**
  （其餘 13–99），全形逗號也只有 4（其餘 34–53）。受害最明顯的是
  `污染死亡天候中斷儀器故障數據不符` 這種五詞黏死的格子。修正後頓號 117、逗號 88。
  §07c「八份標點風格統一」是 Batch 2 做的，農生當時還沒產出，沒被涵蓋到。
- **倫理區塊橫向擴散：3 個學群 → 9 個**。農生的 `proposal-framework` 有一個六列
  「倫理與資料取得」區塊（IACUC／IRB／採集許可／生物安全等級／資料授權／原住民族地區同意），
  修正前只有農生、教育、法政三份有專屬區塊；**生醫只有 2 句夾在別的區塊裡**，
  而它是 IRB／IACUC 最硬性的學群；設計、藝術、商管、理工是 0。
  各補一個對應該領域的區塊（生醫 +6 列，人文／設計／藝術／商管／理工各 +4 列）。
  商管的方法表明列「問卷加迴歸」「個案研究／深度訪談」，理工有「資料或資料集從哪裡來」，
  兩者都實際涉及需要事前確認的對象。
- **A2 收生列收斂到只剩一個刻意例外**。農生原本是 `明年還收學生（名額休假退休）`、
  設計是 `（名額、休假、退休）`。兩份都改為標準的
  `是否確認還收學生（名額、休假、出國或退休）`，農生的陷阱檢核列連帶從「三種都問過」
  改成「四種都問過」。九份現在只剩法政的「借調」一個 A2 明訂的領域例外。
  **設計那份是 A2 的來源**，擴散時漏掉來源自己——與 D-003／D-008 同一種失敗形狀。
- **農生文章補 `#ethics` 段**。`agriculture-graduate-proposal.mdx` 新增
  「倫理與許可要算進時程」含六列對照表並加進 `tocItems`。
  這次的缺口方向和附錄 C／D 相反：**工具比文章完整**。

**憑什麼說做完了**（閘門證據）：

| 閘門 | 結果 | 證據 |
|---|---|---|
| `audit-templates.mjs` | PASS | 45 份全部符合規格；農生 5 份行數與欄數未變（全 6 欄）|
| build | PASS | **176 頁**，27.1s |
| `npm run verify` | PASS | **40/40** |
| CSV 完整性 | PASS | 農生 5 份以 `csv.reader` 逐列檢查，寬度全為 6，無因標點導致的欄位位移 |

**計畫／決策異動**：無新增 D-0xx。新增 `docs/batch4-agriculture-review.md`。

**留下的洞**：

1. **稽核腳本擋不住這一類漏洞。** `audit-templates.mjs` 與排程 v5 §02 的規則都只擋
   「少一份檔案」或「少一個結構欄位」，擋不住「某個學群做對的一列沒有擴散出去」——
   A1／A2 是人工發現的，這次的倫理區塊也是。要寫進 B2 規則得**比對概念不是比對字串**
   （九份的區塊名各不相同），且擴充後要先跑 45 份確認沒有假紅燈。**未做。**
2. **文章端只補了農生**，其餘八份文章沒有對應的倫理段，是新的不對稱。
3. **農生的「出國」也許該是「借調」**——借調農試所、林試所、農業部所屬機關在該領域
   比出國訪問常見。目前先照七學群標準，待 YC 或 LR 裁示。
4. 全形／半形斜線混用是全站既有問題（設計全全形、理工與法政全半形），非農生特有，另案。

---

## #026｜2026-08-21｜設計補上專屬時程文，八群的時程階段不再有人掛通用文

**做了什麼**（可觀察的行為差異）：

- **新增 `design-graduate-timeline.mdx`**，`graduate-design.astro` 的時程階段從
  `graduate-timeline`（通用）改成 `design-graduate-timeline`（專屬）。
  設計原本是**八群裡唯一一個掛通用時程文**的，這是本週待辦 ② 指出的洞。
- **可寫的範圍先查過，查不到的不寫**。這一輪特地先做網路查證再動筆，結論分三類：
  - **可寫**：推甄時間軸（簡章 9–10 月公布、報名 10 月上中旬、書審繳件 10 月中、
    面試 10 月下–11 月中、放榜 11 月前後）——全校統一，可直接寫成四階段骨架。
  - **可寫但要標年分**：作品簡報／實體作品確實是設計獨有的關卡。文章舉了一個**帶年分**的
    具體例子（110 學年度臺科大設計所：一對三、約五分鐘、三件 A3 紙本＋一頁 A4 研究計畫大綱），
    並明講「考生心得不是官方公告、該年度未必等於今年，一律以簡章與面試通知為準」。
  - **查不到就不編**：「作品集要往前抓多久」沒有任何可靠來源。使用者裁示「抓保守即可」，
    所以寫成**大三上開始累積、大三下最晚開始整理、暑假重製定稿、大四上只做微調**，
    並在文章裡明說這是保守的參考骨架不是規定。
- **來源品質有意識地處理**：面試形式那些細節來自 Medium／Dcard 的考生心得，
  不是政府或學校官方公告。CLAUDE.md 規定文章外部連結必須是可查證的權威來源，
  所以**這些來源只用來決定怎麼寫，沒有被寫成連結**，文章裡的具體規格一律導向各校簡章。
  查不到年分的那一篇（雲科／台藝）**不點名也不使用**。
- **四題 FAQ** 走的是內文沒答的縫隙：非本科系跨考、課堂作業 vs 接案作品、
  實體作品集是否必要、實務型與學術型的時程差異（結論：送件時間相同，差在準備重心）。

**憑什麼說做完了**（閘門證據）：

| 閘門 | 結果 | 證據 |
|---|---|---|
| `check_meta.py` | PASS | 1 篇乾淨、0 個 ❌ |
| build | PASS | **170 頁**（169 → 170） |
| `npm run verify` | PASS | **37/37**（36 → 37，本輪新增設計時程文那條） |
| `check-grad-departments` | PASS | 四方一致；shipped 8／guide-only 0／**planned 1** |
| 新增閘門 | PASS | 文章條：FAQPage schema ＋ 分軌 relatedArticles；指南條加驗 `design-graduate-timeline.html` |
| `npx eslint scripts/verify.mjs` | PASS | exit 0（hook 的 ETIMEDOUT 是逾時不是 lint 失敗，已手動確認） |

**下一步**：

- 設計那份比較表**仍然沒有 Google Sheet 副本**——站上有、寄不出去。SEL-299 的交付鏈仍缺這一環。
- 農生環境 8/24 上線後，時程階段要一併確認是掛專屬文還是通用文；
  現在八群都有專屬時程文了，第九群若掛通用文會是唯一的例外。
- 若日後拿到官方或學校公告的面試規格，可把文中那個帶年分的例子換成權威來源並加上連結；
  現況是刻意不放連結。

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

**本輪同時做了歸檔**：主檔從 25 則降到 15 則，#001–#010 移到
`docs/archive/WORKLOG_2026-07-28_2026-08-04.md`，主檔留索引。

**沒有用 `archive-docs.js`**——它的條目判定是
`NOT_AN_ENTRY = /模板|template|索引|index|說明|速查/i`，會把**標題含「模板」的條目判成非條目**。
這個 repo 的內容管線本身就叫模板，11 則真實條目（Week 落地、模板閘門、甘特圖模板…）因此隱形，
25 則被算成 14 則、低於門檻，於是它回報「不動」。就算硬套用，那 11 則也會被當成
「模板／索引區塊」重排到主檔最下方，時序會亂。**這是共用工具的問題，不是這個 repo 的**——
`D:\New folder\Some Tools\Full-stack skills_hooks\hooks\lib\detect.js`，其他專案可能也中。

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

## 已歸檔條目索引

- [#010｜2026-08-04｜軌 A 收尾：補完剩餘 6 份模板，模板總數 30 → 36](archive/WORKLOG_2026-07-28_2026-08-04.md)
- [#009｜2026-08-04｜新增推甄時程甘特圖模板（CSV 帶公式，首份），並把模板閘門從 25 份擴到 30 份](archive/WORKLOG_2026-07-28_2026-08-04.md)
- [#008｜2026-08-04｜新增落點分析方案頁（noindex、未掛 nav），價格以 verify 寫死數字防跨 repo 走鐘](archive/WORKLOG_2026-07-28_2026-08-04.md)
- [#007｜2026-08-03｜還清三項技術債＋知識庫首頁去冗餘](archive/WORKLOG_2026-07-28_2026-08-04.md)
- [#006｜2026-08-03｜分學群系列補外部權威來源（12 篇）＋把本輪教訓寫進 CLAUDE.md](archive/WORKLOG_2026-07-28_2026-08-04.md)
- [#005｜2026-08-03｜人工目視 1280／375（結清連續三輪的掛帳）＋修掉一處重複文字](archive/WORKLOG_2026-07-28_2026-08-04.md)
- [#004｜2026-08-03｜補內外部連結：找回下載頁上消失四輪的 20 份模板、階段1／4 的死路、分學群系列的第一批外部來源](archive/WORKLOG_2026-07-28_2026-08-04.md)
- [#003｜2026-08-03｜Week 6 藝術類群落地：5 篇文章＋指南頁＋5 份模板](archive/WORKLOG_2026-07-28_2026-08-04.md)
- [#002｜2026-07-28｜Week 5 人文社科類群落地＋修好會隨機說謊的 verify 閘門](archive/WORKLOG_2026-07-28_2026-08-04.md)
- [#001｜2026-07-28｜Week 4 商管與財經類群落地：5 篇文章＋指南頁＋5 份模板](archive/WORKLOG_2026-07-28_2026-08-04.md)
