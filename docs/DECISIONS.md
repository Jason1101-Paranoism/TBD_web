# DECISIONS

方向性決策的紀錄：技術選型、schema 取捨、命名遷移、依賴引入。

**決策發生的那一輪就要記。事後補記等同沒記** —— 因為當下你記得「為什麼否決了另外兩個選項」，一週後你只記得結論。被否決的選項才是這份文件的價值：它讓下一個人不用把同樣的死路再走一次。

被取代的決策**不刪除**，標記 `已取代（由 D-0xx）`，之後歸檔到 `docs/archive/DECISIONS_archived.md`。

---

## 條目模板（複製這段）

```markdown
## D-001 — <一句話：選了什麼>

**背景**：什麼問題逼我們必須做這個選擇？（不是「我們想讓程式更好」，是具體的壓力）
**選項**：
  - A（採用）— 代價是什麼
  - B（否決）— 為什麼不行
  - C（否決）— 為什麼不行
**決定**：
**後果**：我們因此接受了什麼壞處？未來出現什麼訊號時，該重新考慮這個決策？
```

---

## D-001 — verify 探針改為「不重用連線 + 獨立 Chrome profile + 重試」

**背景**：`npm run verify` 隨機失敗。同一份 dist 連跑三次，失敗集合完全不同（12/22、16/22、13/22），連本輪完全沒動過的 `/404.html` 都中過。錯誤先是 `探針錯誤：fetch failed`，修掉之後換成 `spawnSync chrome.exe ETIMEDOUT`。閘門一旦會隨機說謊，它就同時失去「擋下真問題」和「證明沒問題」兩種價值——本輪交付被它卡住，必須當場處理。

**根因（兩個，第二個被第一個蓋住）**：

1. 每個目標之間夾著一個 blocking 的 headless Chrome（`--virtual-time-budget=5000`，實耗 > 5 秒），而 astro preview 底下 Node HTTP server 的 `keepAliveTimeout` 預設是 5 秒。undici 連線池保留的 socket 在等待期間被伺服器關閉，下一次 `fetch` 撿到死 socket。
2. 探針啟動 Chrome 時沒有指定 `--user-data-dir`，會用使用者的預設設定檔，與已開著的 Chrome 搶 profile lock，並附帶 GCM 註冊、安裝 web app 等背景動作（先前執行 log 中的 `DEPRECATED_ENDPOINT`、`externally_managed_app_manager` 噪音即是），偶發卡死到逾時。

**選項**：
  - A（採用）— 修根因：`fetch` 明示 `connection: close` + 最多 3 次重試；Chrome 加 `--user-data-dir=<tmp>/chrome-profile`、`--no-first-run`、`--no-default-browser-check`、`--disable-extensions`，逾時放寬到 45 秒並重試一次。代價是失敗時最多多花數十秒，且重試會遮蔽「真的很慢」這種問題。
  - B（否決）— 整個 verify 失敗就重跑一次，人工判斷。等於把不可靠的閘門常態化，下次真的壞掉時第一反應會是「再跑一次就好」。
  - C（否決）— 放寬逾時就好，不動連線設定。只處理第二個根因，`fetch failed` 會繼續發生。
  - D（否決）— 改用 puppeteer／playwright。要引入重量級依賴，違反這個腳本「零額外套件」的設計前提。

**決定**：採 A。

**後果**：接受了「重試會掩蓋效能退化」這個壞處——如果之後 verify 整體耗時明顯變長，要回來看是不是重試在補破網，而不是直接再放寬逾時。另外，Chrome 每次跑都建新 profile，執行時間比共用 profile 略長，但換到的是與使用者當下開著的瀏覽器完全隔離。

## D-002 — verify 的三處 `catch {}` 改為帶註解的空 block，而非在 eslint 放行 `no-empty`

**背景**：`scripts/verify.mjs` 有三處刻意留空的 `catch {}`（等 server 就緒的重試、收尾 kill server 的兩處），被 eslint `no-empty` 擋下，上一輪 WORKLOG 記為待決。本輪 hook 再次擋住交付。

**選項**：
  - A（採用）— 在每個 catch block 內寫下「為什麼這裡可以吞掉例外」的註解。`no-empty` 不會回報含註解的 block，規則維持全域啟用。
  - B（否決）— 在 eslint config 對該檔放行 `no-empty`。整個檔案從此不受這條規則保護，未來新增的真·漏接例外不會被抓到。
  - C（否決）— 改寫成具名 no-op 函式。多一層間接，可讀性反而比一行註解差。

**決定**：採 A。

**後果**：往後在這個檔案新增空 catch 時，必須寫出理由才過得了 lint——這正是想要的效果。
