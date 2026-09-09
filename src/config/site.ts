export const site = {
  name: 'TBD Studio',
  // 衍生圖，由 scripts/build-images.mjs 從 assets-src/ 產生。換 logo 要改原圖再重跑那支。
  logoUrl: '/assets/images/tbd-logo-light.webp',
  logoFallbackUrl: '/assets/images/tbd-logo-light.png',
  logoDarkUrl: '/assets/images/tbd-logo-dark.webp',
  logoDarkFallbackUrl: '/assets/images/tbd-logo-dark.png',
  lineUrl: 'https://lin.ee/9ciZvbA',
  igUrl: 'https://www.instagram.com/_tbd_studio/',
  email: 'tbd.consulting.studio@gmail.com',
  lineId: '@756etimx',
  tagline: 'Define, Design, Deliver Your Next Move.',
  siteUrl: 'https://tbd-web.vercel.app',
  // OG 專用圖：1200×630 是 FB／LINE／X 的標準版位，不共用 16:9 的主視覺。
  // 之前這裡指向 11.7 MB 的主視覺，超過各平台 5–8 MB 上限，分享時根本不出預覽卡。
  ogImage: 'https://tbd-web.vercel.app/assets/images/og-default.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'TBD Studio — 專注升學申請策略的教育顧問',
};

export const nav = [
  { id: 'home',      label: '首頁',     href: '/' },
  { id: 'cases',     label: '成功案例', href: '/pages/cases.html' },
  { id: 'services',  label: '服務內容', href: '/pages/services.html' },
  { id: 'process',   label: '合作流程', href: '/pages/process.html' },
  { id: 'resources', label: '知識庫',   href: '/pages/resources.html' },
  { id: 'faq',       label: 'FAQ',      href: '/pages/faq.html' },
  { id: 'about',     label: '關於TBD',  href: '/pages/about.html' },
];
