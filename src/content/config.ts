import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    description: z.string(),
    kicker: z.string(),
    lead: z.string(),

    // 知識庫分類（resources 首頁分區依據，必填）
    category: z.string(),
    // 同分類內的顯示順序（小到大），未填排最後
    order: z.number().default(999),
    // 準備階段 / 目標讀者 / 科系群（搜尋頁多維篩選用，可選）
    stage: z.array(z.string()).default([]),
    audience: z.array(z.string()).default([]),
    departmentGroup: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    updatedAt: z.string().optional(),

    bodyClass: z.string().default('sub-page article-page'),
    sitemap: z.boolean().default(true),
    sidebarCtaText: z.string(),
    sidebarCtaUtm: z.string(),
    bottomCtaH2: z.string(),
    bottomCtaP: z.string().optional(),
    bottomCtaUtm: z.string(),
    tocItems: z.array(z.object({
      href: z.string(),
      label: z.string(),
    })),
    relatedArticles: z.array(z.object({
      badge: z.string(),
      title: z.string(),
      href: z.string(),
      desc: z.string(),
    })),
  }),
});

export const collections = { articles };
