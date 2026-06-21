import { useEffect } from 'react';
import { SeoFields, SiteSettings } from './types';

const setMeta = (selector: string, attribute: 'name' | 'property', value: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${selector}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, selector);
    document.head.appendChild(element);
  }
  element.content = value;
};

const setLink = (rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
};

export function useSeo(settings: SiteSettings, page?: SeoFields) {
  useEffect(() => {
    const title = page?.seoTitle || settings.seoTitle || settings.siteName;
    const description = page?.seoDescription || settings.seoDescription || settings.tagline;
    const keywords = page?.seoKeywords || settings.seoKeywords || [];
    const image = page?.ogImage || settings.defaultOgImage;
    const canonical = page?.canonicalUrl || settings.siteUrl;

    document.title = title;
    setMeta('description', 'name', description);
    setMeta('keywords', 'name', keywords.join(', '));
    setMeta('author', 'name', settings.author);
    setMeta('robots', 'name', 'index, follow, max-image-preview:large');
    setMeta('og:type', 'property', 'website');
    setMeta('og:title', 'property', title);
    setMeta('og:description', 'property', description);
    setMeta('og:url', 'property', canonical);
    setMeta('og:site_name', 'property', settings.siteName);
    setMeta('twitter:card', 'name', image ? 'summary_large_image' : 'summary');
    setMeta('twitter:title', 'name', title);
    setMeta('twitter:description', 'name', description);
    if (image) {
      setMeta('og:image', 'property', image);
      setMeta('og:image:width', 'property', '1200');
      setMeta('og:image:height', 'property', '630');
      setMeta('og:image:alt', 'property', title);
      setMeta('twitter:image', 'name', image);
      setMeta('twitter:image:alt', 'name', title);
    }
    if (settings.twitterHandle) setMeta('twitter:site', 'name', settings.twitterHandle);
    if (settings.googleSiteVerification) {
      setMeta('google-site-verification', 'name', settings.googleSiteVerification);
    }
    setLink('canonical', canonical);

    const existingSchema = document.getElementById('portfolio-schema');
    existingSchema?.remove();
    const schema = document.createElement('script');
    schema.id = 'portfolio-schema';
    schema.type = 'application/ld+json';
    schema.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: settings.author,
      url: settings.siteUrl,
      jobTitle: 'Growth & Ecommerce Specialist',
      description,
      image,
    });
    document.head.appendChild(schema);
    return () => schema.remove();
  }, [page, settings]);
}
