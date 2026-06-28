import { useEffect, useState } from 'react';
import {
  blogPostsData,
  certificationsData,
  creativeItemsData,
  projectsData,
  venturesData,
  volunteeringData,
  websitesData,
} from './data';
import {
  BlogPost,
  BusinessVenture,
  Certification,
  CreativeItem,
  Project,
  SiteSettings,
  VolunteeringExp,
  WebsiteShowcase,
} from './types';

export const defaultSiteSettings: SiteSettings = {
  id: 'main',
  siteName: 'Thukha Aung — Growth & Ecommerce Specialist',
  tagline:
    'Growth, ecommerce operations, performance marketing and digital experiences.',
  author: 'Thukha Aung',
  siteUrl: 'https://www.thukhaaung.me/',
  seoTitle: 'Thukha Aung | Growth & Ecommerce Specialist',
  seoDescription:
    'Portfolio of Thukha Aung, a growth and ecommerce specialist focused on Amazon, Noon GCC, performance marketing and digital experiences.',
  seoKeywords: [
    'Thukha Aung',
    'growth specialist',
    'ecommerce specialist',
    'Amazon UAE',
    'Noon GCC',
    'performance marketing',
  ],
  defaultOgImage: 'https://www.thukhaaung.me/thukha-aung-profile.webp',
};

export interface PortfolioContent {
  projects: Project[];
  creativeItems: CreativeItem[];
  websites: WebsiteShowcase[];
  ventures: BusinessVenture[];
  volunteering: VolunteeringExp[];
  certifications: Certification[];
  blogPosts: BlogPost[];
  settings: SiteSettings;
  loading: boolean;
}

const isFirebaseConfigured = [
  import.meta.env.VITE_FIREBASE_API_KEY,
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  import.meta.env.VITE_FIREBASE_PROJECT_ID,
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  import.meta.env.VITE_FIREBASE_APP_ID,
].every(Boolean);

const fallbackContent: PortfolioContent = {
  projects: projectsData,
  creativeItems: creativeItemsData,
  websites: websitesData,
  ventures: venturesData,
  volunteering: volunteeringData,
  certifications: certificationsData,
  blogPosts: blogPostsData,
  settings: defaultSiteSettings,
  loading: false,
};

const sortLocally = <T extends { order?: number }>(items: T[]) =>
  [...items].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

export function usePortfolioContent(): PortfolioContent {
  const [content, setContent] = useState<PortfolioContent>({
    ...fallbackContent,
    loading: isFirebaseConfigured,
  });

  useEffect(() => {
    const subscriptions: Array<() => void> = [];
    let cancelled = false;

    const connect = async () => {
      if (!isFirebaseConfigured) return;

      const [{ db }, firestore] = await Promise.all([
        import('./firebase'),
        import('firebase/firestore'),
      ]);

      if (!db || cancelled) return;

      const { collection, doc, onSnapshot, query, where } = firestore;

      const bindCollection = <
        T extends {
          id: string;
          published?: boolean;
          order?: number;
        },
      >(
        collectionName: string,
        key: keyof Omit<PortfolioContent, 'settings' | 'loading'>,
      ) => {
        const contentQuery = query(
          collection(db, collectionName),
          where('published', '==', true),
        );

        subscriptions.push(
          onSnapshot(
            contentQuery,
            (snapshot) => {
              const items = snapshot.docs.map((item) => ({
                id: item.id,
                ...item.data(),
              })) as T[];

              setContent((current) => ({
                ...current,
                [key]: sortLocally(items),
                loading: false,
              }));
            },
            (error) => {
              console.warn(
                `Unable to load ${collectionName}; using bundled fallback content.`,
                error,
              );

              setContent((current) => ({
                ...current,
                loading: false,
              }));
            },
          ),
        );
      };

      bindCollection<Project>('projects', 'projects');
      bindCollection<CreativeItem>('creativeItems', 'creativeItems');
      bindCollection<WebsiteShowcase>('websites', 'websites');
      bindCollection<BusinessVenture>('ventures', 'ventures');
      bindCollection<VolunteeringExp>('volunteering', 'volunteering');
      bindCollection<Certification>('certifications', 'certifications');
      bindCollection<BlogPost>('blogPosts', 'blogPosts');

      subscriptions.push(
        onSnapshot(
          doc(db, 'siteSettings', 'main'),
          (snapshot) => {
            if (snapshot.exists()) {
              setContent((current) => ({
                ...current,
                settings: {
                  ...defaultSiteSettings,
                  ...snapshot.data(),
                  id: 'main',
                },
                loading: false,
              }));
            }
          },
          (error) => {
            console.warn('Unable to load site settings.', error);
          },
        ),
      );
    };

  connect().catch((error) => {
  console.warn(
    'Unable to initialize Firebase; using bundled content.',
    error,
  );

  setContent((current) => ({
    ...current,
    loading: false,
  }));
});

    return () => {
      cancelled = true;
 
      subscriptions.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  return content;
}

export const bundledContent = fallbackContent;
