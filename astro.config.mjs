import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const SITE = 'https://tbd-web.vercel.app';

// ── sitemap 的 lastmod 來源 ─────────────────────────────────
// 之前 171 筆 <url> 一個 lastmod 都沒有，等於把「這頁什麼時候變的」這件事
// 完全藏起來，爬取預算與重抓判斷沒有機器可讀的依據。
//
// 兩種來源，準確度不同，所以分開處理：
//   - 知識庫文章：frontmatter 的 updatedDate ?? publishDate。這是人寫的、有意義的日期，最準。
//   - 其他頁面：該 .astro 的 git 最後異動日；git 不可用時退回檔案 mtime。
// 兩者都失敗就不填——Google 說 lastmod 不準確會被整份忽略，寧可缺也不要編。
const ARTICLES = path.resolve('src/content/articles');
const articleDates = new Map();
for (const f of fs.readdirSync(ARTICLES).filter((n) => n.endsWith('.mdx'))) {
  const src = fs.readFileSync(path.join(ARTICLES, f), 'utf8');
  const pick = (k) => (src.match(new RegExp('^' + k + ':\\s*(\\S+)', 'm')) || [])[1];
  const d = pick('updatedDate') || pick('publishDate');
  if (d) articleDates.set(f.replace(/\.mdx$/, ''), new Date(d).toISOString());
}

const gitDateCache = new Map();
function sourceDate(file) {
  if (gitDateCache.has(file)) return gitDateCache.get(file);
  let out = null;
  try {
    const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (iso) out = new Date(iso).toISOString();
  } catch { /* Vercel 上可能是 shallow clone，取不到就往下走 */ }
  if (!out) {
    try { out = fs.statSync(file).mtime.toISOString(); } catch { out = null; }
  }
  gitDateCache.set(file, out);
  return out;
}

// URL 路徑 → 產生它的原始檔。對不上就回 null（不填 lastmod）。
function sourceFor(pathname) {
  if (pathname === '/' || pathname === '/index.html') return 'src/pages/index.astro';
  const slug = pathname.match(/^\/pages\/resources\/([^/]+)\.html$/)?.[1];
  if (slug && articleDates.has(slug)) return null; // 走 frontmatter，不走 git
  const candidates = [
    'src/pages' + pathname.replace(/\.html$/, '.astro'),
    'public' + pathname,
  ];
  return candidates.find((c) => fs.existsSync(c)) ?? null;
}

function lastmodFor(url) {
  const pathname = url.replace(SITE, '') || '/';
  const slug = pathname.match(/^\/pages\/resources\/([^/]+)\.html$/)?.[1];
  if (slug && articleDates.has(slug)) return articleDates.get(slug);
  const src = sourceFor(pathname);
  return src ? sourceDate(src) : null;
}

export default defineConfig({
  site: SITE,
  output: 'static',
  build: {
    format: 'file',
  },
  trailingSlash: 'never',
  integrations: [
    mdx(),
    sitemap({
      customPages: [`${SITE}/pages/portfolio-guide`],
      filter: (page) =>
        !page.includes('/audience') &&
        !page.includes('/plans') &&
        // compass 頁自己帶 noindex；同時出現在 sitemap 是互斥訊號，
        // Search Console 會回報「已提交的網址標示為 noindex」。
        !page.includes('/compass') &&
        !page.includes('/article-template') &&
        !page.includes('/timeline') &&
        !page.includes('/search') &&
        !page.includes('/404') &&
        !page.endsWith('/pages'),
      serialize(item) {
        // 首頁在 sitemap、canonical、站內連結三處只准有一種寫法：帶斜線的根 URL。
        // 其餘頁面補回 .html（build format 是 file）。
        if (item.url === SITE || item.url === SITE + '/') {
          item.url = SITE + '/';
        } else {
          item.url = item.url + '.html';
        }
        const lastmod = lastmodFor(item.url);
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],
});
