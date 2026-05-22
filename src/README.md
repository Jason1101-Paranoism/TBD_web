# src 維護說明

這個資料夾是模板來源，不是直接上線用的頁面。

- `partials/`：全站共用區塊。
- `templates/base.html`：每一頁共用骨架。
- `pages/`：每一頁自己的主要內容。
- `config.json`：站點資料、導覽、頁面 metadata。

修改後請回到專案根目錄執行：

```bash
python build.py
```
