import fs from 'node:fs';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// 路徑 → git 最後提交時間。由 scripts/prebuild.mjs 產生（build 前一定會先跑）。
// 用 fs 讀而不是 import：這支設定檔在 Node 端執行，讀檔最不會有解析器差異。
const lastmod = JSON.parse(fs.readFileSync(new URL('./src/config/lastmod.json', import.meta.url), 'utf8'));

export default defineConfig({
  site: 'https://tbd-web.vercel.app',
  output: 'static',
  build: {
    format: 'file',
  },
  trailingSlash: 'never',
  integrations: [
    mdx(),
    sitemap({
      customPages: ['https://tbd-web.vercel.app/pages/portfolio-guide'],
      filter: (page) =>
        !page.includes('/audience') &&
        !page.includes('/plans') &&
        !page.includes('/article-template') &&
        !page.includes('/timeline') &&
        !page.includes('/search') &&
        !page.includes('/404') &&
        // compass 掛 noindex（付費牆未上線，刻意不收錄）。留在 sitemap 會變成互斥訊號，
        // Search Console 會回報「已提交的網址標示為 noindex」（S-05）。
        !page.includes('/compass') &&
        !page.endsWith('/pages'),
      serialize(item) {
        const root = 'https://tbd-web.vercel.app';
        if (item.url !== root && item.url !== root + '/') {
          item.url = item.url + '.html';
        }
        // <lastmod> 是爬取預算與重抓判斷唯一的機器可讀依據（S-06）。
        const key = item.url === root || item.url === root + '/' ? '/' : item.url.slice(root.length);
        const d = lastmod.byPath[key];
        if (d) item.lastmod = d;
        return item;
      },
    }),
  ],
});
