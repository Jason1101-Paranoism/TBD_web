# TBD Studio — Claude Skills 組合說明

> 本文件說明這個專案建議使用哪些 Claude Skills、各自的用途與啟用條件。  
> 完整策略見 `docs/claude-skills-strategy.md`。

---

## 目前建議的 Skills 組合

### 已可啟用（現階段適用）

| Skill | 來源 | 用途 |
|-------|------|------|
| `frontend-design` | Anthropic 官方 | HTML/CSS 前端實作、元件設計、響應式排版 |
| `taste-skill` | tasteskill.dev | 視覺品味把關，避免 generic AI UI |
| `output-skill` | （搭配 taste-skill 使用）| 輸出完整度確保，無 placeholder |
| `redesign-skill` | （搭配 taste-skill 使用）| 既有頁面視覺審查與改善 |

### 暫緩啟用（未來產品擴展後才需要）

| Skill | 來源 | 暫緩原因 |
|-------|------|---------|
| `ui-ux-pro-max` | ui-ux-pro-max-skill.nextlevelbuilder.io | 目前無 dashboard / 後台需求，啟用後會過度設計 Landing Page |
| `ux-strategy` | mcpmarket.com | 策略層工具，適合 IA 重構，不適合日常前端任務 |

---

## Skills 安裝說明

> **注意：請確認指令來源可信後再手動執行，不要讓 Claude 自動執行安裝腳本。**

### frontend-design（Anthropic 官方）

```bash
# 來源：https://github.com/anthropics/skills/tree/main/skills/frontend-design
# 安裝方式請參考官方 repo 說明
```

### taste-skill

```
# 來源：https://www.tasteskill.dev/
# 依照網站指引安裝到 Claude Code
```

### ui-ux-pro-max（暫緩）

```
# 來源：https://ui-ux-pro-max-skill.nextlevelbuilder.io/
# 待後台開發階段再安裝
```

### ux-strategy（暫緩）

```
# 來源：https://mcpmarket.com/zh/tools/skills/ux-strategy
# 待資訊架構大改版時再安裝
```

---

## 各頁面建議使用的 Skill 組合

| 任務 | 建議啟用 |
|------|---------|
| 改首頁 Hero 區塊 | `frontend-design` + `taste-skill` |
| 改服務頁文案排版 | `frontend-design` + `taste-skill` |
| 成功案例頁設計 | `frontend-design` + `taste-skill` |
| Portfolio Guide 改版 | `frontend-design` |
| 頁面整體視覺健診 | `redesign-skill` |
| 收斂 Nav 結構決策 | `ux-strategy`（策略討論），再交 `frontend-design`（實作） |
| 未來學生後台 | `ui-ux-pro-max` + `frontend-design` |
| 設計系統 / token 規範 | `ui-ux-pro-max` |
