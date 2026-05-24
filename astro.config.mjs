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
      filter: (page) =>
        !page.includes('/audience') &&
        !page.includes('/plans') &&
        !page.includes('/article-template'),
    }),
  ],
});
