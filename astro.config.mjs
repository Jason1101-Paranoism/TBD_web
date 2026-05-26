import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

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
        !page.endsWith('/pages'),
      serialize(item) {
        const root = 'https://tbd-web.vercel.app';
        if (item.url !== root && item.url !== root + '/') {
          item.url = item.url + '.html';
        }
        return item;
      },
    }),
  ],
});
