**TBD Studio 官方網站現況評估與優化建議報告**

version 01 | 260519

**現在已經是一個可上線的 MVP 官網，但還不是「適合長期投放、SEO、品牌擴張」的正式成熟版。**目前最強的是：架構已經從單頁 Landing Page 進化成 template system；最弱的是：資訊架構稍微過細、首頁轉換文案還偏品牌感、部分新頁仍用 React/Babel CDN 內嵌，長期維護會有負擔。

## **一、目前官網現況總評**

| 面向 | 評價 | 分數 |
| ----- | ----- | ----- |
| 品牌定位 | 清楚，主軸是升學策略、備審、面試、Portfolio、成功案例 | 8.5 / 10 |
| 轉換力 | 有 CTA、有案例，但首頁首屏還可以更直白 | 7.5 / 10 |
| 網站架構 | 已有 template system，方向正確 | 8.5 / 10 |
| 視覺一致性 | 主頁與子頁大致一致，但 Portfolio Guide 是獨立 React 區塊感較重 | 7.0 / 10 |
| 內容完整度 | 成功案例、服務、時程、方案都有，但 nav 分類偏碎 | 8.0 / 10 |
| SEO / 分享預覽 | 目前只有基本 title / description，還缺 OG、canonical、sitemap | 5.5 / 10 |
| 技術成熟度 | 可部署、可維護，但仍使用 Tailwind CDN、React CDN、Babel runtime | 6.5 / 10 |

## **二、目前做得好的地方**

### **1\. Template system 是正確方向**

目前 README 已明確定義「可直接部署層」與「模板維護層」：`index.html`、`pages/*.html` 是 build 後可部署檔，`src/config.json`、`src/partials/`、`src/pages/` 是維護來源。這代表網站不再是到處複製貼上 nav/footer，而是已經具備可長期維護的基本架構。

`build.py` 也已能依照 `src/config.json` 產生每一頁，並處理相對路徑、navbar active 狀態、footer、head 與 scripts。它還有 `normalize_content()`，可以防止誤貼完整 HTML 造成雙 navbar / 雙 footer 問題，這對目前這種多次整併的網站很實用。

### **2\. 導覽與頁面資料集中管理**

目前 `src/config.json` 已集中管理 site 資訊、logo、LINE、email、nav、pages metadata。現在全站包含首頁、服務總覽、成功案例、Portfolio 指南、適合對象、服務項目、申請時程、服務方案、合作流程。

這讓後續新增頁面、改 nav 順序、調整 title / description 都能集中處理，不需要逐頁手改。

### **3\. Navbar 已經有共用 partial 與 logo 尺寸控制**

目前 `src/partials/nav.html` 是全站共用 navbar，logo 使用 `{{logo_url}}` 並有 width / height。 CSS 也對 `.site-logo` 和 `.site-logo img` 設定了明確寬高、最大寬度、object-fit，並在 1240px 以上才展開 desktop nav，這能避免之前子頁 logo 爆版與 nav 擠壓問題。

### **4\. 首頁已有完整轉換結構**

首頁目前包含 hero、痛點、成功案例、方法流程與諮詢 CTA。Hero 已放入視覺主圖，並有「先看成功案例」與「預約策略諮詢」兩個入口。

成功案例 block 也比 placeholder 好很多，已能呈現特殊選才、合作週期、協作模式、錄取結果、Before/After 與去識別化原則。這是目前最有信任感的區塊之一。

### **5\. Portfolio Guide 已經變成一個可吸流量的內容頁**

目前 `portfolio-guide.html` 已加入官網 template，使用側欄導覽，並保留 React 互動、mockup tab、prompt generator、FAQ 等功能。它不再用自製 logo / 自製 footer / 自製 navbar，方向是對的。

## **三、主要問題與風險**

### **問題 1：Navbar 項目太多，使用者會迷路**

目前 nav 有 9 個項目：

官方首頁  
服務總覽  
成功案例  
Portfolio 指南  
適合對象  
服務項目  
申請時程  
服務方案  
合作流程

內容完整，但對初次來訪家長來說，分類太細，會有「我到底該先點哪個」的問題。這對轉換頁不利。

**建議調整成 5–6 個主 nav：**

首頁  
成功案例  
服務內容  
Portfolio 指南  
申請時程  
合作流程

其中「服務內容」頁內再整合：

適合對象  
服務項目  
服務方案

這樣 nav 更像正式官網，而不是資料夾目錄。

### **問題 2：首頁 H1 品牌感夠，但轉換不夠直白**

目前首頁 H1 是：Define, Design, Deliver Your Next Move這很品牌化，但家長或學生第一眼可能不會立刻知道「這個網站幫我解決什麼」。首頁副標有說明「在多元的升學選擇中建立清晰航線」，但仍偏抽象。

**建議首頁 H1 改成更直接：**

把零散經歷，整理成教授看得懂的申請策略

英文 slogan 可保留在 badge 或副標：

Define, Design, Deliver Your Next Move.

這會更適合 IG Bio、LINE 導流、家長第一次打開網站的情境。

### **問題 3：首頁 Hero 視覺主圖使用 Google Drive thumbnail，不夠穩**

目前首頁主圖用：[https://drive.google.com/thumbnail?id=...\&sz=w1600](https://drive.google.com/thumbnail?id=...&sz=w1600) 這能快速用，但長期正式官網不建議依賴 Google Drive thumbnail，因為權限、快取、載入速度、圖片壓縮都不完全可控。

**建議改成 repo 內資產：**assets/images/tbd-landing-banner.png

然後改：\<img src="assets/images/tbd-landing-banner.png" ...\>

這樣 Vercel 部署會更穩，SEO / LCP 效能也比較可控。

### **問題 4：Portfolio Guide 目前是 React \+ Babel CDN runtime，不適合長期 production**

目前 Portfolio Guide 頁面仍在 HTML 裡載入：

React CDN  
ReactDOM CDN  
Babel standalone

這代表瀏覽器每次打開頁面時都要跑 JSX 編譯，對 production 來說偏重，也容易遇到載入慢、白屏、CDN 被擋或 SEO 內容不可見的問題。

短期 MVP 可以接受，但長期有三條路：

1. **短期保留**：繼續用 React CDN，但把內容精簡，當互動工具頁。  
2. **中期改成純 JS**：保留 tab / accordion / prompt generator，但不用 React/Babel。  
3. **長期升級 Vite / React**：整站變成真正前端專案，但維護成本會提高。

我建議目前先走 **中期改純 JS**，因為整站本質仍是靜態 HTML template，不需要整站 React 化。

### **問題 5：SEO 還太基本**

目前 `head.html` 只有 title、description、font、Tailwind、CSS。

正式官網至少要補：

\<link rel="canonical" href="..."\>  
\<meta property="og:title" content="..."\>  
\<meta property="og:description" content="..."\>  
\<meta property="og:image" content="..."\>  
\<meta property="og:type" content="website"\>  
\<meta name="twitter:card" content="summary\_large\_image"\>

另外 build 系統可以產生：

sitemap.xml  
robots.txt

現在如果你把網站貼到 LINE / Threads / IG，預覽圖與標題可能不夠漂亮，也不利於搜尋收錄。

### **問題 6：服務頁分散，可能造成重複內容**

目前有：

服務總覽  
適合對象  
服務項目  
服務方案  
合作流程

這些頁面各有意義，但目前分類很接近。使用者可能不知道「服務總覽」和「服務項目」差在哪，也不一定知道要去哪裡看價格與合作方式。

建議做一次資訊架構收斂：

服務內容頁  
├─ 適合對象  
├─ 服務項目  
├─ 方案類型  
└─ CTA

合作流程頁  
├─ Step 1–8  
└─ 準備資料

然後 nav 只留「服務內容」和「合作流程」。

## **四、優化優先順序**

### **P0｜一週內可做，最值得** ✅ 已於 2026-05-22 完成

#### **1\. 收斂 navbar** ✅

Nav 已從 9 項改成 6 項：官方首頁、成功案例、服務內容、Portfolio 指南、申請時程、合作流程。  
「適合對象、服務總覽、服務方案」移出 nav（頁面仍保留，可深層連結）。

#### **2\. 改首頁 H1** ✅

H1：把零散經歷，整理成教授看得懂的申請策略  
副標：TBD Studio 協助學生完成方向判斷、備審重構、面試訓練與 Portfolio 主線整理，讓每一步準備都可追蹤、可驗收。  
Slogan 副標識：Define, Design, Deliver Your Next Move.（移至 badge 下方）

#### **3\. 主圖改成本地資產** ✅

已新增：`assets/images/TBD_Landing Page Banner.png`  
`src/pages/home.html` img src 已更新，Google Drive thumbnail 已移除。

#### **4\. 補 OG metadata** ✅

`src/config.json` 加入 `site_url`、`og_image`；`build.py` 自動注入 `canonical_url` 與 `og_image`；`src/partials/head.html` 加入 canonical、og:type/site_name/title/description/image/url、twitter:card/title/description/image。

### **P1｜兩週內做，提升正式感**

#### **5\. Portfolio Guide 改成純 JS 或拆分**

短期不一定要全改，但至少避免長期依賴 Babel runtime。可以保留目前互動邏輯，但把 JSX 轉成：

HTML sections \+ JS show/hide

或者建立一個 `js/portfolio-guide.js`，讓 `src/pages/portfolio-guide.html` 變乾淨。

#### **6\. 服務內容整合頁**

新增或重構：

src/pages/services.html

讓它包含：

適合對象  
服務項目  
方案類型  
合作成果  
CTA

接著把 `audience.html`、`plans.html` 從 nav 移除，但可以保留頁面作為深層連結。

#### **7\. 成功案例頁加更多案例 slot**

目前成功案例很強，但只有一個主要案例。建議設計成：

Featured Case  
Case Slot 1：特殊選才  
Case Slot 2：個人申請  
Case Slot 3：研究所推甄

即使後兩個先放「整理中」，也能讓官網看起來像可擴充案例庫。

### **P2｜之後做，品牌與成長**

#### **8\. 新增 FAQ / 知識文章系統**

你現在已有 Portfolio Guide，未來可以擴充：

/resources/  
├─ 備審怎麼寫  
├─ 特殊選才怎麼準備  
├─ 面試常見問題  
├─ Portfolio 建置指南

這會幫 SEO，也可以當 IG / LINE 導流素材。

#### **9\. 新增 CTA tracking**

未來如果要投廣告或追成效，可以在 CTA 加 UTM：

?utm\_source=website\&utm\_medium=cta\&utm\_campaign=portfolio-guide

#### **10\. 加入部署檢查**

`build.py` 可以新增：

檢查所有 href 是否存在  
產生 sitemap  
檢查是否有重複 id  
檢查 pages 是否都有 description

## **五、具體檔案修改建議**

### **1\. `src/config.json`**

用途：調整 nav、頁面 metadata、未來加入 og image。  
 目前 nav 與 pages 都集中在這裡，這是最該優先調整的地方。

建議：

nav 收斂  
新增 og\_image 欄位  
保留深層頁但不一定放 nav

### **2\. `src/pages/home.html`**

用途：改首頁 H1、副標、hero image local path。  
 首頁目前已經是主要轉換頁，應優先優化。

建議：

H1 更直白  
主圖改 assets  
首屏 CTA 文案微調

### **3\. `src/partials/head.html`**

用途：補 OG / canonical / social preview。  
 目前 head 還很基礎。

### **4\. `build.py`**

用途：產生 canonical、sitemap、robots，並擴充 metadata。目前 build.py 架構已經足夠擴充。

### **5\. `src/pages/portfolio-guide.html`**

用途：短期保留互動，長期移除 Babel runtime。目前是功能頁，但技術上還偏 prototype。

## **六、整體結論**

目前 TBD 官網已經可以作為 **MVP 對外展示版**，尤其適合放在：

IG Bio  
LINE 官方選單  
家長諮詢前資料  
成功案例分享  
Portfolio 指南導流

但如果要進一步變成正式品牌官網，我會照這個順序做：

1\. Nav 收斂  
2\. 首頁 H1 與 CTA 轉換優化  
3\. 主圖本地化  
4\. OG / SEO 補強  
5\. Portfolio Guide 去 Babel runtime  
6\. 服務內容頁整合

最核心的一句話是：**現在網站已經有骨架和內容，但下一階段要從「資料完整」轉成「使用者更快做決策」。**
