# README 與 Portfolio 內容規劃表

> 先確認每個區塊「有沒有」，再處理「好不好」。全部必填項都有內容之後，再回頭優化。
>
> 依據：`/pages/resources/readme-guide.html` 與 `/pages/portfolio-guide.html`

## 這份表的用途

排版和選工具是最容易讓人卡住的部分，但它們其實是最後一步。這份表把順序倒過來：
**先把內容湊齊，再管長什麼樣。**

README 的最低可行版本花一到兩個小時就能寫完，但它讓你的專案從「有程式碼但看不懂」
變成「有說明、有展示、有完整度」——在備審和面試裡的差距非常大。

## 區塊檢核

| 文件 | 區塊 | 必要性 | 重點 | 我的內容 / 連結 |
|---|---|---|---|---|
| README | 專案介紹（一到三句話） | 必填 | 這個專案在解決什麼問題、給誰用的 | |
| README | Demo 或截圖 | 必填 | 最常被忽略也最重要；評審沒時間自己把專案跑起來 | |
| README | 功能列表 | 必填 | 三到五點就夠，抓核心 | |
| README | 使用技術 Tech Stack | 必填 | 主要語言與框架，幾個詞就夠 | |
| README | 如何安裝或使用 | 必填 | 就算只有三行指令也要寫 | |
| README | 專案背景或動機 | 選填但推薦 | 技術很多人會，問題意識是獨一無二的 | |
| Portfolio | About Me | 必填 | 你是誰、你的主線是什麼 | |
| Portfolio | Projects 專案解構 | 必填 | 每個專案：問題、你的角色、做法、結果、反思 | |
| Portfolio | Skills 能力矩陣 | 必填 | 能力要有專案佐證，不要只列名詞 | |
| Portfolio | 歷程或時間軸 | 選填 | 有主線才放，沒有的話會變流水帳 | |
| Portfolio | 聯絡方式 | 必填 | | |

## README 公版（複製整段，換掉方括號）

把下面這段存成專案根目錄的 `README.md`：

```markdown
# [專案名稱]

[一到三句話：這個專案在解決什麼問題、給誰用的。
不要寫「這是一個練習作品」——寫它做什麼。]

## Demo

![截圖說明](./screenshot.png)

線上版本：[連結，沒有的話就放操作 GIF 或影片連結]

## 功能

- [核心功能一]
- [核心功能二]
- [核心功能三]

## 使用技術

[語言] / [框架] / [資料庫或其他工具]

## 安裝與執行

    git clone [你的 repo 網址]
    cd [專案資料夾]
    [安裝指令]
    [啟動指令]

## 為什麼做這個

[一段話。你觀察到什麼問題、為什麼決定動手。
這一段通常是讓評審記住這個專案的地方。]
```

## 三個常見錯誤

- **只有截圖沒有說明**，或**只有說明沒有截圖**。兩個都要——文字讓人知道是什麼，
  圖讓人知道長什麼樣，缺一個評審都得自己腦補。
- **功能列表寫成十五點**。抓三到五個核心就好，列太多反而看不出重點在哪。
- **「安裝方式」寫「請自行安裝相關套件」**。這句話等於沒寫，而且它透露的是
  你沒有考慮過別人要怎麼用你的東西。

## Commit 紀錄也算 README 的一部分

一連串 `update`、`fix`、`123` 的 commit 訊息，跟一份寫清楚的 README 傳達的是相反的訊息。
細節見 `/pages/resources/github-commit-guide.html`。

## 用完接哪裡

- README 完整說明：`/pages/resources/readme-guide.html`
- Portfolio 六步驟建置指南：`/pages/portfolio-guide.html`
- 資料夾與檔名怎麼整理：`/pages/resources/portfolio-folder-structure.html`
- Commit 訊息怎麼寫：`/pages/resources/github-commit-guide.html`

---

*模板由 TBD Studio 提供 · tbd-web.vercel.app*
