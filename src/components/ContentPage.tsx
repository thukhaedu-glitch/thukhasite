import { useEffect } from 'react';
import { ArrowLeft, CheckCircle, Clock, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { usePortfolioContent } from '../content';
import { useSeo } from '../seo';
import { BlogContentBlock, BlogPost, Project, SeoFields } from '../types';

const SITE_URL = 'https://www.thukhaaung.me';

type ParsedBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  | { kind: 'p'; text: string };

// Phrases that read like section titles even without markdown markers.
const HEADING_HINTS =
  /^(understanding|benefits of|why |what |how |which |the answer|choose|conclusion|final thoughts|frequently asked|important pages|key takeaways)/i;

function looksLikeHeading(line: string) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (/^#{1,4}\s/.test(trimmed)) return true; // markdown heading
  const isShort = trimmed.length <= 70 && trimmed.split(/\s+/).length <= 9;
  const noEndPunctuation = !/[.,:;]$/.test(trimmed);
  return isShort && noEndPunctuation && HEADING_HINTS.test(trimmed);
}

// Curated heading phrases that commonly appear inside a flat blob of text.
// Each becomes a section heading. Add your own recurring section titles here.
const EMBEDDED_HEADINGS = [
  'Why a Website Is Important for Myanmar Businesses',
  'Why a Website Is Important',
  'A Website Helps Customers Trust Your Business',
  'Facebook Page Alone Is Not Enough',
  'Website Development Helps You Rank on Google',
  'What a Good Business Website Should Include',
  'Website Development Cost in Myanmar',
  'Important Pages',
  'Final Thoughts',
  'Frequently Asked Questions',
  'Conclusion',
  'Key Takeaways',
  'Understanding Facebook Marketing',
  'Understanding Google Ads',
  'Benefits of Facebook Marketing',
  'Benefits of Google Ads',
  'Which Platform Is Better',
  'Choose Facebook Marketing If',
  'Choose Google Ads If',
];

// When the stored content has no line breaks at all, rebuild structure:
// insert a line break before each known heading phrase, then break long
// runs of prose into paragraphs at sentence boundaries (~3 sentences each).
function restructureFlatText(text: string): string {
  let out = text.replace(/\s+/g, ' ').trim();

  // 1. Put each known heading phrase on its own line, marked with ##.
  //    Longest phrases first so an overlapping shorter phrase can't split it.
  const sorted = [...EMBEDDED_HEADINGS].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const headingRe = new RegExp(`\\s*(${escaped.join('|')})\\s*`, 'g');
  out = out.replace(headingRe, (_match, phrase) => `\n\n## ${phrase}\n\n`);

  // 2. Break remaining long paragraphs into ~3-sentence chunks.
  const segments = out.split('\n\n');
  const rebuilt = segments.map((segment) => {
    const seg = segment.trim();
    if (!seg || seg.startsWith('##')) return seg;
    const sentences = seg.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) || [seg];
    const paras: string[] = [];
    for (let i = 0; i < sentences.length; i += 3) {
      paras.push(sentences.slice(i, i + 3).join(' ').trim());
    }
    return paras.join('\n\n');
  });

  return rebuilt.filter(Boolean).join('\n\n');
}

function parseContent(content: string): ParsedBlock[] {
  let source = content.replace(/\r\n/g, '\n');
  // If the content is effectively one unbroken blob, rebuild its structure.
  const nonEmptyLines = source.split('\n').filter((l) => l.trim()).length;
  if (nonEmptyLines <= 2 && source.length > 400) {
    source = restructureFlatText(source);
  }
  const lines = source.split('\n');
  const blocks: ParsedBlock[] = [];
  let listBuffer: string[] | null = null;
  let listKind: 'ul' | 'ol' = 'ul';

  const flushList = () => {
    if (listBuffer && listBuffer.length) {
      blocks.push({ kind: listKind, items: listBuffer });
    }
    listBuffer = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }
    if (/^[*-]\s+/.test(line)) {
      if (!listBuffer || listKind !== 'ul') {
        flushList();
        listBuffer = [];
        listKind = 'ul';
      }
      listBuffer.push(line.replace(/^[*-]\s+/, ''));
      continue;
    }
    if (/^\d+[.)]\s+/.test(line)) {
      if (!listBuffer || listKind !== 'ol') {
        flushList();
        listBuffer = [];
        listKind = 'ol';
      }
      listBuffer.push(line.replace(/^\d+[.)]\s+/, ''));
      continue;
    }
    flushList();
    if (looksLikeHeading(line)) {
      blocks.push({ kind: 'heading', text: line.replace(/^#{1,4}\s*/, '') });
    } else {
      blocks.push({ kind: 'p', text: line });
    }
  }
  flushList();
  return blocks;
}

function RichText({ content }: { content: string }) {
  const blocks = parseContent(content || '');
  return (
    <div className="space-y-6 text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
      {blocks.map((block, index) => {
        if (block.kind === 'heading') {
          return (
            <h2
              key={index}
              className="pt-6 text-xl font-bold leading-snug text-white sm:text-2xl"
            >
              {renderInline(block.text)}
            </h2>
          );
        }
        if (block.kind === 'ul') {
          return (
            <ul key={index} className="list-disc space-y-2 pl-6 marker:text-emerald-400">
              {block.items.map((item, i) => (
                <li key={i}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }
        if (block.kind === 'ol') {
          return (
            <ol key={index} className="list-decimal space-y-2 pl-6 marker:text-emerald-400">
              {block.items.map((item, i) => (
                <li key={i}>{renderInline(item)}</li>
              ))}
            </ol>
          );
        }
        return <p key={index}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={index} className="font-bold text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

function StructuredContent({ blocks }: { blocks: BlogContentBlock[] }) {
  return (
    <div className="space-y-6 text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
      {blocks.map((block) => {
        if (block.type === 'heading') {
          return (
            <h2
              key={block.id}
              className="pt-6 text-xl font-bold leading-snug text-white sm:text-2xl"
            >
              {renderInline(block.content)}
            </h2>
          );
        }
        if (block.type === 'image') {
          return (
            <figure key={block.id} className="space-y-2 py-2">
              <img src={block.content} alt={block.alt || 'Article illustration'} loading="lazy" width="1200" height="800" className="w-full rounded-2xl border border-slate-800 object-cover" />
              {block.alt && <figcaption className="text-center text-xs text-slate-500">{block.alt}</figcaption>}
            </figure>
          );
        }
        return <RichText key={block.id} content={block.content} />;
      })}
    </div>
  );
}

export default function ContentPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { blogPosts, projects, settings, loading } = usePortfolioContent();
  const path = window.location.pathname.replace(/\/+$/, '');
  const blogSlug = path.startsWith('/blog/') ? decodeURIComponent(path.slice('/blog/'.length)) : '';
  const projectId = path.startsWith('/case-study/')
    ? decodeURIComponent(path.slice('/case-study/'.length))
    : '';
  const blogPost = blogPosts.find((post) => post.slug === blogSlug);
  const project = projects.find((item) => (item.slug || item.id) === projectId);
  const item = blogPost || project;
  const canonicalPath = blogPost
    ? `/blog/${blogPost.slug}`
    : project
      ? `/case-study/${project.slug || project.id}`
      : path;
  const pageSeo: SeoFields = item
    ? {
        seoTitle: item.seoTitle || `${item.title} | Thukha Aung`,
        seoDescription:
          item.seoDescription ||
          ('excerpt' in item ? item.excerpt : item.subtitle),
        seoKeywords: item.seoKeywords,
        ogImage:
          item.ogImage ||
          ('coverImage' in item ? item.coverImage : undefined) ||
          settings.defaultOgImage,
        canonicalUrl: `${SITE_URL}${canonicalPath}`,
      }
    : {
        seoTitle: 'Content not found | Thukha Aung',
        seoDescription: 'The requested portfolio content could not be found.',
        canonicalUrl: `${SITE_URL}${path}`,
      };

  useSeo(settings, pageSeo);

  useEffect(() => {
    if (!item) return;
    document.getElementById('portfolio-schema')?.remove();
    const schema = document.createElement('script');
    schema.id = 'portfolio-schema';
    schema.type = 'application/ld+json';
    schema.text = JSON.stringify(
      blogPost
        ? {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: blogPost.title,
            description: blogPost.excerpt,
            datePublished: blogPost.date,
            author: { '@type': 'Person', name: settings.author, url: settings.siteUrl },
            image: blogPost.coverImage || settings.defaultOgImage,
            mainEntityOfPage: `${SITE_URL}/blog/${blogPost.slug}`,
          }
        : {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project!.title,
            description: project!.subtitle,
            author: { '@type': 'Person', name: settings.author, url: settings.siteUrl },
            image: project!.coverImage || settings.defaultOgImage,
            url: `${SITE_URL}/case-study/${project!.slug || project!.id}`,
          },
    );
    document.head.appendChild(schema);
    return () => schema.remove();
  }, [blogPost, item, project, settings]);

  if (!item && loading) {
    return <div className="min-h-screen bg-[#080c14]" />;
  }

  if (!item) {
    return (
      <main className="min-h-screen bg-[#080c14] px-6 py-24 text-center text-slate-300">
        <h1 className="text-3xl font-bold text-white">Content not found</h1>
        <a href="/" className="mt-6 inline-flex items-center gap-2 text-emerald-400">
          <ArrowLeft size={16} /> Back to portfolio
        </a>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-300">
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#080c14]/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
          <a href="/" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-xs font-bold text-white">
              TA
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#080c14]" />
            </div>
            <div>
              <span className="block text-sm font-extrabold leading-none tracking-tight text-white">THUKHA AUNG</span>
              <span className="mt-1 block text-[9px] font-bold uppercase tracking-widest text-emerald-500">Growth Specialist</span>
            </div>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {[
              ['Home', '/#home'],
              ['About Specialist', '/#about'],
              ['Works & Sandbox', '/#projects'],
              ['Creative Studio', '/#creative'],
              ['Noble Impact', '/#volunteering'],
              ['Intel Blog', '/#blog'],
              ['Get In Touch', '/#contact'],
            ].map(([label, href]) => (
              <a key={href} href={href} className="rounded-full px-3.5 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white">
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <a href="/#contact" className="rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-blue-500">
              Let&apos;s Work Together
            </a>
          </div>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="rounded-lg border border-slate-800 p-2 text-slate-300 lg:hidden"
          >
            {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="border-t border-slate-800 bg-[#0b111e] px-6 py-4 lg:hidden">
            <div className="mx-auto grid max-w-7xl gap-1">
              {[
                ['Home', '/#home'],
                ['About Specialist', '/#about'],
                ['Works & Sandbox', '/#projects'],
                ['Creative Studio', '/#creative'],
                ['Noble Impact', '/#volunteering'],
                ['Intel Blog', '/#blog'],
                ['Get In Touch', '/#contact'],
              ].map(([label, href]) => (
                <a key={href} href={href} className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                  {label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      {blogPost ? <BlogArticle post={blogPost} /> : <CaseStudy project={project!} />}

      <footer className="border-t border-slate-800 px-6 py-10 text-center text-xs text-slate-500">
        © 2026 Thukha Aung
      </footer>
    </div>
  );
}

function BlogArticle({ post }: { post: BlogPost }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
      <article>
        <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-mono text-emerald-400">
          <span>{post.category}</span>
          <span className="text-slate-600">•</span>
          <span className="inline-flex items-center gap-1 text-slate-400"><Clock size={13} /> {post.readTime}</span>
          <span className="text-slate-500">{post.date}</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl">{post.title}</h1>
        <p className="mt-6 text-base leading-7 text-slate-400 sm:text-lg">{post.excerpt}</p>
        {(post.authorName || post.authorPhoto) && (
          <div className="mt-7 flex items-center gap-3">
            {post.authorPhoto && <img src={post.authorPhoto} alt={post.authorName || 'Article author'} width="48" height="48" className="h-12 w-12 rounded-full border border-slate-700 object-cover" />}
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Written by</p>
              <p className="text-sm font-semibold text-white">{post.authorName || 'Thukha Aung'}</p>
            </div>
          </div>
        )}
        {post.coverImage && (
          <img src={post.coverImage} alt={post.title} width="1200" height="630" className="mt-10 w-full rounded-2xl border border-slate-800 object-cover" />
        )}
        {post.videoUrl && <video src={post.videoUrl} controls playsInline preload="metadata" className="mt-8 w-full rounded-2xl border border-slate-800" />}
        <div className="mt-12 border-t border-slate-800 pt-10">
          {post.contentBlocks && post.contentBlocks.length > 0
            ? <StructuredContent blocks={post.contentBlocks} />
            : <RichText content={post.content} />}
        </div>
      </article>
    </main>
  );
}

function CaseStudy({ project }: { project: Project }) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
      <article>
        <div className="mb-5 flex flex-wrap gap-3 text-xs font-mono text-emerald-400">
          <span>{project.industry}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">{project.market}</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl">{project.title}</h1>
        <p className="mt-6 text-base leading-7 text-slate-400 sm:text-lg">{project.subtitle}</p>
        {project.coverImage && (
          <img src={project.coverImage} alt={project.title} width="1200" height="630" className="mt-10 w-full rounded-2xl border border-slate-800 object-cover" />
        )}
        {project.videoUrl && <video src={project.videoUrl} controls playsInline preload="metadata" className="mt-8 w-full rounded-2xl border border-slate-800" />}

        <section className="mt-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <p className="text-xs font-mono uppercase text-slate-500">Validated result</p>
          <p className="mt-2 text-xl font-bold text-emerald-400">{project.stats}</p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-white">Execution</h2>
          <p className="mt-4 leading-7 text-slate-300">{project.fullDetails}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">Services</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.services.map((service) => (
              <span key={service} className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs">{service}</span>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">Key outcomes</h2>
          <ul className="mt-5 space-y-4">
            {project.results.map((result) => (
              <li key={result} className="flex items-start gap-3 leading-7">
                <CheckCircle size={18} className="mt-1 shrink-0 text-emerald-400" />
                <span>{result}</span>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}
