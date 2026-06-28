const SITE_URL = 'https://www.thukhaaung.me';

type FirestoreValue = {
  stringValue?: string;
  booleanValue?: boolean;
  timestampValue?: string;
};

type FirestoreDocument = {
  fields?: Record<string, FirestoreValue>;
};

type QueryResult = {
  document?: FirestoreDocument;
};

type SitemapPost = {
  slug: string;
  title: string;
  lastmod: string;
  image?: string;
};

const FALLBACK_POSTS: SitemapPost[] = [
  {
    slug: 'amazon-uae-seo-guide',
    title: 'Amazon UAE and KSA SEO Guide',
    lastmod: '2026-06-18',
  },
  {
    slug: 'noon-pricing-strategy-gcc',
    title: 'Noon Pricing Strategy GCC',
    lastmod: '2026-06-12',
  },
  {
    slug: 'ecommerce-reporting-dashboard',
    title: 'Ecommerce Reporting Dashboard',
    lastmod: '2026-05-28',
  },
  {
    slug: 'amazon-ppc-tips-skincare',
    title: 'Amazon PPC Tips for Skincare',
    lastmod: '2026-04-15',
  },
  {
    slug: 'website-development-myanmar-business-website-2026',
    title: 'Website Development Myanmar: Why Every Business Needs a Professional Website in 2026',
    lastmod: '2026-06-28',
  },
];

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function validPublicUrl(value: string | undefined) {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function getLastModified(fields: Record<string, FirestoreValue>) {
  const timestamp =
    fields.updatedAt?.timestampValue || fields.createdAt?.timestampValue;

  if (timestamp) return timestamp.slice(0, 10);

  const dateText = fields.date?.stringValue;
  if (dateText) {
    const parsed = new Date(dateText);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }
  }

  return new Date().toISOString().slice(0, 10);
}

async function getPublishedPosts(): Promise<SitemapPost[]> {
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  const apiKey = process.env.VITE_FIREBASE_API_KEY;

  if (!projectId || !apiKey) return FALLBACK_POSTS;

  const endpoint =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
    `/databases/(default)/documents:runQuery?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: 'blogPosts' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'published' },
            op: 'EQUAL',
            value: { booleanValue: true },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Firestore sitemap query failed: ${response.status}`);
  }

  const results = (await response.json()) as QueryResult[];
  const firestorePosts = results.flatMap((result): SitemapPost[] => {
    const fields = result.document?.fields;
    const slug = fields?.slug?.stringValue?.trim();

    if (!fields || !slug) return [];

    return [
      {
        slug,
        title: fields.title?.stringValue || slug,
        lastmod: getLastModified(fields),
        image: validPublicUrl(
          fields.ogImage?.stringValue || fields.coverImage?.stringValue,
        ),
      },
    ];
  });

  const merged = new Map<string, SitemapPost>();
  FALLBACK_POSTS.forEach((post) => merged.set(post.slug, post));
  firestorePosts.forEach((post) => merged.set(post.slug, post));
  return [...merged.values()];
}

function createSitemap(posts: SitemapPost[]) {
  const blogEntries = posts
    .map((post) => {
      const image = post.image
        ? `\n    <image:image>\n      <image:loc>${escapeXml(post.image)}</image:loc>\n      <image:title>${escapeXml(post.title)}</image:title>\n    </image:image>`
        : '';

      return `  <url>
    <loc>${SITE_URL}/blog/${encodeURIComponent(post.slug)}</loc>
    <lastmod>${escapeXml(post.lastmod)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>${image}
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${SITE_URL}/thukha-aung-profile.webp</image:loc>
      <image:title>Thukha Aung — Growth and Ecommerce Specialist</image:title>
      <image:caption>Official profile photo of Thukha Aung</image:caption>
    </image:image>
  </url>
${blogEntries}
</urlset>`;
}

export async function GET(_request: Request) {
  let posts = FALLBACK_POSTS;

  try {
    posts = await getPublishedPosts();
  } catch (error) {
    console.error('Unable to build sitemap.', error);
  }

  return new Response(createSitemap(posts), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control':
        'public, s-maxage=300, stale-while-revalidate=86400',
    },
  });
}
