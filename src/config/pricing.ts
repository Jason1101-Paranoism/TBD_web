// Growth Compass 付費方案在官網這一側的資料來源（MONETIZATION_PLAN.md §5.4）。
//
// ⚠️ 這份是**鏡像**，不是正本。
//    正本在 `tbd-compass-app/src/lib/domain/entitlement.ts` 的 PLANS——
//    實際收多少錢由那裡決定，這裡只負責顯示。兩邊不一致時，網站會標一個價、
//    結帳頁收另一個價。這正是 D-003（20 份模板消失四輪）的同一種形狀：
//    同一個事實被抄成兩份手寫清單，而沒有任何東西保證它們一致。
//
//    跨 repo 無法 import，所以目前只能靠這條規則：**改價一律先改 compass 的 PLANS，
//    再回來同步這裡**。長期解法是 compass 開一支公開的方案 JSON 端點，
//    由本站在 build 時抓取——那是另一輪的事，不在本輪範圍。
//
//    最後同步時間：2026-08-05（對應 entitlement.ts 的 single 499 / season 899，
//    以及 D-006 重分後的能力：single＝接手包＋跨裝置同步，season 再加跨年度保存）
//
// 定價 499／899 已於 2026-08-05 拍板（D-M3）。軟啟動只開 single，
// 但本頁兩個方案都列——方案結構是真的，能不能買由 compass 的結帳端控制。

export interface PricingPlan {
  id: 'single' | 'season';
  label: string;
  priceTwd: number;
  /** 這個方案解鎖什麼——用學生看得懂的話，不是功能代號。 */
  includes: readonly string[];
  /** 什麼情況適合選這個。 */
  suitedFor: string;
}

export const COMPASS_URL = 'https://tbd-compass-app.vercel.app';

export const pricingPlans: readonly PricingPlan[] = [
  {
    id: 'single',
    label: '單次解鎖',
    priceTwd: 499,
    includes: ['顧問接手包分享連結', '跨裝置同步：換手機、換電腦都在'],
    suitedFor: '想把整理好的檔案交給顧問，或不只用一台裝置。',
  },
  {
    id: 'season',
    label: '一屆方案',
    priceTwd: 899,
    includes: ['顧問接手包分享連結', '跨裝置同步：換手機、換電腦都在', '跨年度保存：這一屆的紀錄一路留到放榜'],
    suitedFor: '想從現在一路用到學測放榜後填志願，中間的紀錄都留著。',
  },
];
