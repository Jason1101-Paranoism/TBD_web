export const site = {
  name: 'TBD Studio',
  logoUrl: '/assets/images/tbd_logo_lighttransparent_.png',
  logoDarkUrl: '/assets/images/tbd-logo-dark.png',
  lineUrl: 'https://lin.ee/9ciZvbA',
  igUrl: 'https://www.instagram.com/_tbd_studio/',
  email: 'tbd.consulting.studio@gmail.com',
  lineId: '@756etimx',
  tagline: 'Define, Design, Deliver Your Next Move.',
  siteUrl: 'https://tbd-edu.com',
  // OG 圖是專用的 1200×630 裁切版（S-02）。原本直接用 6000×3375 的主視覺 PNG，
  // 11.1 MB 遠超 LINE／FB／X 的 5–8 MB 上限，超過就不產生預覽卡——而 LINE 是站上主要 CTA 通道。
  ogImage: 'https://tbd-edu.com/assets/images/tbd-og-cover.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
};

export const nav = [
  // 首頁一律用 "/"，不要寫 /index.html——兩種寫法會讓同一頁產生兩個 URL（S-07）。
  { id: 'home',      label: '首頁',     href: '/' },
  { id: 'cases',     label: '成功案例', href: '/pages/cases.html' },
  { id: 'services',  label: '服務內容', href: '/pages/services.html' },
  { id: 'process',   label: '合作流程', href: '/pages/process.html' },
  { id: 'resources', label: '知識庫',   href: '/pages/resources.html' },
  { id: 'faq',       label: 'FAQ',      href: '/pages/faq.html' },
  { id: 'about',     label: '關於TBD',  href: '/pages/about.html' },
];
