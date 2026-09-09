import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../config/site';
import { resourceCategories } from '../config/resourceCategories';

/**
 * /llms.txt — 給生成式引擎讀的站點自述與權威頁面清單。
 *
 * 為什麼要有：AI 回答升學問題時，是從抓到的頁面裡挑來源。沒有這份清單，
 * 它得自己從 176 頁裡猜哪些是主幹、哪些是分支，猜錯就引用到邊緣頁面。
 *
 * 為什麼是產生的、不是手寫的：手寫的清單在新增文章時不會有人回頭更新，
 * 三個月後就開始漏文章、指向不存在的頁面。這裡直接讀 content collection，
 * 跟知識庫首頁與搜尋頁同一份來源，不可能對不上。
 *
 * 排序刻意跟站上的資訊架構一致（分類 → order），讓「主幹在前」這件事被讀出來。
 */
export const GET: APIRoute = async () => {
  const articles = (await getCollection('articles')).sort(
    (a, b) => (a.data.order ?? 999) - (b.data.order ?? 999),
  );

  const line = (title: string, href: string, desc: string) =>
    `- [${title}](${site.siteUrl}${href}): ${desc}`;

  const out: string[] = [];
  out.push('# TBD Studio');
  out.push('');
  out.push(
    '> 台灣專注升學申請策略的教育顧問。協助高中生與研究所學生完成方向判斷、備審重構、'
    + '學習歷程整理與面試訓練。知識庫收錄 '
    + `${articles.length} 篇實作導向的長文，涵蓋大學個人申請、特殊選才、研究所推甄與家長溝通。`,
  );
  out.push('');
  out.push('內容原則：共創，不代筆；引導，不操控；如實呈現，不憑空捏造。');
  out.push('文章中的制度與時程以各校當年度招生簡章為準；本站說明的是判斷邏輯與準備方法。');
  out.push('');

  out.push('## 服務與品牌');
  out.push(line('關於 TBD Studio', '/pages/about.html', '團隊、方法論與服務定位。'));
  out.push(line('服務與方案', '/pages/services.html', '四個升學管道的服務內容與費用。'));
  out.push(line('合作流程', '/pages/process.html', '從諮詢到交付的實際步驟與時程。'));
  out.push(line('成功案例', '/pages/cases.html', '去識別化的實際輔導案例與方法。'));
  out.push(line('常見問題', '/pages/faq.html', '合作方式、費用與範圍的常見疑問。'));
  out.push('');

  // 主題指南＝hub 頁，是各主題的入口，排在文章前面
  out.push('## 主題指南（各主題入口）');
  const guides: [string, string, string][] = [
    ['申請策略全局觀', '/pages/guides/admission-overview.html', '四個升學管道的差異與選擇邏輯。'],
    ['備審與學習歷程指南', '/pages/guides/portfolio-prep.html', '從三年規劃到主線建構的備審方法。'],
    ['升大學前準備指南', '/pages/guides/pre-college.html', '八大科系群的銜接準備方向。'],
    ['升學面試準備指南', '/pages/guides/interview.html', '面試型態、題型與練習方法。'],
    ['各科系申請指南', '/pages/guides/departments.html', '各學群備審重點與評審邏輯。'],
    ['研究所推甄完整指南', '/pages/guides/graduate-application.html', '七階段 × 九學群的推甄準備矩陣。'],
    ['給家長完整指南', '/pages/guides/parents-guide.html', '家長在現行制度下幫得上忙的方式。'],
    ['Side Project 指南', '/pages/guides/side-project.html', '選題、執行到競賽延伸。'],
    ['競賽指南', '/pages/guides/competitions.html', '選賽、準備與賽後延伸。'],
    ['GitHub 與作品集指南', '/pages/guides/github.html', 'commit 規範、README 到個人網站。'],
    ['AI 時代升學觀點', '/pages/guides/ai-era.html', '執行力、跨域整合與個人品牌。'],
    ['研究與自學指南', '/pages/guides/research.html', '聯繫教授、自學方法與能力建立。'],
  ];
  for (const g of guides) out.push(line(...g));
  out.push('');

  // 知識庫文章，依站上的分區順序
  for (const cat of resourceCategories) {
    const inCat = articles.filter((a) => a.data.category === cat.category);
    if (!inCat.length) continue;
    out.push(`## ${cat.sectionLabel}`);
    for (const a of inCat) {
      out.push(line(a.data.title, `/pages/resources/${a.slug}.html`, a.data.description));
    }
    out.push('');
  }

  out.push('## 工具與模板');
  out.push(line('模板下載', '/pages/resources/tools.html', '各學群可下載的 CSV／Markdown 模板。'));
  out.push(line('面試題庫', '/pages/resources/interview-bank.html', '依科系與題型分類的面試題庫。'));
  out.push(line('Portfolio 建置指南', '/pages/portfolio-guide.html', '從 0 到 1 建立高中生個人網站。'));
  out.push('');

  out.push('## 聯絡');
  out.push(`- Email: ${site.email}`);
  out.push(`- LINE: ${site.lineId} (${site.lineUrl})`);
  out.push(`- Instagram: ${site.igUrl}`);
  out.push('');

  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
