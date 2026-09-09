/**
 * Tailwind 設定（建置期產出，取代原本的 cdn.tailwindcss.com Play CDN）。
 *
 * 為什麼不再用 Play CDN：它是同步的 render-blocking 腳本，而且樣式要等 JS 跑完
 * 才生得出來——先閃一次無樣式內容再跳版。Tailwind 官方本來就明示它不可用於 production。
 *
 * 這份 theme 是原本寫在 BaseLayout 與 portfolio-guide.html 兩處的行內 tailwind.config
 * 合併而來。兩處原本對 tbd-mid 有分歧（#6A6D89 vs #767995），統一取 #6A6D89——
 * 那是 tbd-theme.css 的正本值，註解寫明是為了讓白底正文對比從 4.25 拉到 4.9 過 WCAG AA。
 */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
    // 兩個不走 layout 的獨立靜態頁也吃這份 CSS，漏掉它們的 class 會被 purge 掉
    './public/pages/*.html',
  ],
  theme: {
    extend: {
      colors: {
        'tbd-light': '#D0CEDB',
        'tbd-mid': '#6A6D89',
        'tbd-accent': '#1A5D94',
        'tbd-dark': '#142143',
        'tbd-yellow': '#FAB748',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'sans-serif'],
        serif: ['EB Garamond', 'serif'],
      },
      boxShadow: {
        soft: '0 10px 30px rgba(20, 33, 67, 0.08)',
      },
    },
  },
};
