import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db, isFirebaseConfigured } from "./firebase";

import {
  blogPostsData,
  certificationsData,
  creativeItemsData,
  projectsData,
  venturesData,
  volunteeringData,
  websitesData,
} from "./data";

import {
  BlogPost,
  BusinessVenture,
  Certification,
  CreativeItem,
  Project,
  SiteSettings,
  VolunteeringExp,
  WebsiteShowcase,
} from "./types";

export const defaultSiteSettings: SiteSettings = {
  id: "main",
  siteName: "Thukha Aung — Growth & Ecommerce Specialist",
  tagline:
    "Growth, ecommerce operations, performance marketing and digital experiences.",
  author: "Thukha Aung",
  siteUrl: "https://thukhaaung.me",
  seoTitle: "Thukha Aung | Growth & Ecommerce Specialist",
  seoDescription:
    "Portfolio of Thukha Aung, a growth and ecommerce specialist focused on Amazon, Noon GCC and performance marketing.",
  seoKeywords: [
    "Thukha Aung",
    "digital Marekting Yangon",
    "thukha aung",
  "thukha",
  "thu kha",
    "growth specialist",
    "ecommerce specialist",
    "Amazon UAE",
    "Noon GCC",
    "performance marketing",
  ],
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

function sortItems<T extends { order?: number }>(items: T[]) {
  return [...items].sort(
    (first, second) =>
      (first.order ?? 999) - (second.order ?? 999),
  );
}

export function usePortfolioContent(): PortfolioContent {
  const [content, setContent] = useState<PortfolioContent>({
    ...fallbackContent,
    loading: isFirebaseConfigured,
  });

  useEffect(() => {
    if (!db) return;

    const subscriptions: Array<() => void> = [];

    function connectCollection<
      T extends {
        id: string;
        published?: boolean;
        order?: number;
      },
    >(
      collectionName: string,
      stateKey: keyof Omit<
        PortfolioContent,
        "settings" | "loading"
      >,
    ) {
      const contentQuery = query(
        collection(db!, collectionName),
        where("published", "==", true),
      );

      const unsubscribe = onSnapshot(
        contentQuery,

        (snapshot) => {
          const items = snapshot.docs.map((document) => ({
            id: document.id,
            ...document.data(),
          })) as T[];

          setContent((current) => ({
            ...current,
            [stateKey]: sortItems(items),
            loading: false,
          }));
        },

        (error) => {
          console.warn(
            `Unable to load ${collectionName}. Using fallback content.`,
            error,
          );

          setContent((current) => ({
            ...current,
            loading: false,
          }));
        },
      );

      subscriptions.push(unsubscribe);
    }

    connectCollection<Project>("projects", "projects");

    connectCollection<CreativeItem>(
      "creativeItems",
      "creativeItems",
    );

    connectCollection<WebsiteShowcase>(
      "websites",
      "websites",
    );

    connectCollection<BusinessVenture>(
      "ventures",
      "ventures",
    );

    connectCollection<VolunteeringExp>(
      "volunteering",
      "volunteering",
    );

    connectCollection<Certification>(
      "certifications",
      "certifications",
    );

    connectCollection<BlogPost>(
      "blogPosts",
      "blogPosts",
    );

    const settingsUnsubscribe = onSnapshot(
      doc(db, "siteSettings", "main"),

      (snapshot) => {
        if (!snapshot.exists()) return;

        setContent((current) => ({
          ...current,
          settings: {
            ...defaultSiteSettings,
            ...snapshot.data(),
            id: "main",
          } as SiteSettings,
          loading: false,
        }));
      },

      (error) => {
        console.warn(
          "Unable to load global site settings.",
          error,
        );
      },
    );

    subscriptions.push(settingsUnsubscribe);

    return () => {
      subscriptions.forEach((unsubscribe) =>
        unsubscribe(),
      );
    };
  }, []);

  return content;
}

export const bundledContent = fallbackContent;
