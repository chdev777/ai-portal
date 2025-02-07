import { createClient } from "microcms-js-sdk";

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error("MICROCMS_SERVICE_DOMAIN is required");
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error("MICROCMS_API_KEY is required");
}

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

export type Category =
  | "お知らせ"
  | "イベント"
  | "雑談"
  | "AI関連"
  | "募集"
  | "学生向け";

export type News = {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
  category: Category[];
  publishedDate: string;
  endDate: string;
  important: boolean;
};

export type Blog = {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  category: Category[];
  thumbnail?: {
    url: string;
    width: number;
    height: number;
  };
  publishedAt: string;
  updatedAt: string;
};

export async function getBlogDetail(contentId: string) {
  try {
    const blog = await client.get({
      endpoint: "blog",
      contentId,
    });
    return blog;
  } catch (error) {
    console.error("Error fetching blog detail:", error);
    return null;
  }
}

export async function getNewsDetail(contentId: string) {
  try {
    const news = await client.get({
      endpoint: "news",
      contentId,
    });
    return news;
  } catch (error) {
    console.error("Error fetching news detail:", error);
    return null;
  }
}
