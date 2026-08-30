import { NextResponse } from 'next/server';

export const revalidate = 3600; // revalidate every hour

export interface MediumPost {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  excerpt: string;
  thumbnail: string | null;
}

function getCdata(tag: string, str: string): string {
  const m = str.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`));
  return m?.[1]?.trim() ?? '';
}

function getTag(tag: string, str: string): string {
  const m = str.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return m?.[1]?.trim() ?? '';
}

function extractImg(html: string): string | null {
  // Prefer Medium CDN images
  const cdnMatch = html.match(/src="(https:\/\/cdn-images[^"]+|https:\/\/miro\.medium[^"]+)"/);
  if (cdnMatch) return cdnMatch[1];
  // Fallback: any https image
  const anyMatch = html.match(/src="(https:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i);
  return anyMatch?.[1] ?? null;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export async function GET() {
  try {
    const res = await fetch('https://medium.com/feed/@stevencooper_75268', {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'Milk Design Studio RSS Reader/1.0' },
    });

    if (!res.ok) throw new Error(`Feed returned ${res.status}`);

    const xml = await res.text();
    const posts: MediumPost[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let m: RegExpExecArray | null;

    while ((m = itemRegex.exec(xml)) !== null) {
      const item = m[1];

      const title = getCdata('title', item) || getTag('title', item);
      if (!title) continue;

      // Medium puts the canonical link right before <guid>
      const link =
        item.match(/<link>(https[^<]+)<\/link>/)?.[1]?.trim() ??
        getCdata('guid', item) ??
        getTag('guid', item);
      if (!link?.startsWith('https://')) continue;

      const pubDate = getTag('pubDate', item);
      const content = getCdata('content:encoded', item);
      const description = getCdata('description', item);

      // Thumbnail: media:content attr first, then first img in content/description
      const thumbnail =
        item.match(/url="(https:\/\/cdn-images[^"]+)"/)?.[1] ??
        item.match(/url="(https:\/\/miro\.medium[^"]+)"/)?.[1] ??
        extractImg(content) ??
        extractImg(description) ??
        null;

      const rawText = stripHtml(description || content);
      const excerpt =
        rawText.length > 200
          ? rawText.slice(0, 200).replace(/\s\S+$/, '') + '…'
          : rawText;

      posts.push({ id: link, title, url: link, publishedAt: pubDate, excerpt, thumbnail });
    }

    return NextResponse.json({ posts: posts.slice(0, 6) });
  } catch (err) {
    console.error('[api/medium]', err);
    return NextResponse.json({ posts: [] });
  }
}
