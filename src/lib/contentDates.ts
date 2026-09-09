import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';

/**
 * 文章的「最後異動日」——給 Article schema 的 dateModified 用。
 *
 * 為什麼不是叫作者在 frontmatter 填 updatedDate：原本 134 篇一篇都沒填，
 * 於是 dateModified 全等於 datePublished，等於對外宣告「這站的內容從來沒維護過」。
 * 那不是懶，是這種欄位本來就會被忘記——一個要靠人記得的欄位，長期一定是空的。
 *
 * 所以改成從 git 取該檔的最後 commit 日期：不必記得，也不會謊報。
 * frontmatter 的 updatedDate 保留為手動覆寫，用在「這篇有實質改寫」要蓋過 git 日期的時候
 * （例如只改錯字的 commit 不該被當成內容更新）。
 *
 * 取不到 git（Vercel 有時是 shallow clone）就退回檔案 mtime；再失敗就回 null，
 * 由呼叫端退回 publishDate。寧可少一個訊號，也不要編一個日期出來。
 */

const cache = new Map<string, Date | null>();

export function contentModifiedDate(slug: string): Date | null {
  if (cache.has(slug)) return cache.get(slug)!;
  const file = `src/content/articles/${slug}.mdx`;
  let out: Date | null = null;
  try {
    const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (iso) out = new Date(iso);
  } catch { /* git 不可用，往下退 */ }
  if (!out) {
    try { out = statSync(file).mtime; } catch { out = null; }
  }
  cache.set(slug, out);
  return out;
}
