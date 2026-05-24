import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    kicker: z.string(),
    lead: z.string(),
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
