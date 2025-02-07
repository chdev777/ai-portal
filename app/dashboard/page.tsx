import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { client, type News, type Blog, type Category } from "@/lib/microcms";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Calendar,
  Bell,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "ダッシュボード",
};

async function getNews() {
  const response = await client.getList<News>({
    endpoint: "news",
    queries: {
      limit: 3,
      orders: "-publishedDate",
    },
  });
  return response.contents;
}

async function getBlogs() {
  const response = await client.getList<Blog>({
    endpoint: "blog",
    queries: {
      limit: 6,
      orders: "-publishDate",
    },
  });
  return response.contents;
}

export const revalidate = 60; // 1分ごとに再検証

const BlogCard = ({ blog }: { blog: Blog }) => {
  return (
    <Link href={`/dashboard/blogs/${blog.id}`}>
      <Card className="h-full hover:bg-accent transition-colors">
        <CardHeader className="space-y-4">
          {blog.thumbnail && (
            <div className="mb-2">
              <Image
                src={blog.thumbnail.url}
                alt={blog.title}
                width={blog.thumbnail.width}
                height={blog.thumbnail.height}
                className="w-full h-48 object-cover rounded"
              />
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {blog.category.slice(0, 4).map((cat) => (
              <Badge key={cat} variant="secondary">
                {cat}
              </Badge>
            ))}
          </div>
          <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <time dateTime={blog.publishDate}>
              {format(new Date(blog.publishDate), "yyyy年MM月dd日", {
                locale: ja,
              })}
            </time>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default async function DashboardPage() {
  const now = new Date();

  // お知らせは3件まで、ブログは6件までに制限
  const [newsData, blogData] = await Promise.all([
    client.getList<News>({
      endpoint: "news",
      queries: {
        limit: 3, // 3件に制限
        filters: `publishedDate[less_than]${now.toISOString()}[and]endDate[greater_than]${now.toISOString()}`,
        orders: "important,-publishedDate",
      },
    }),
    client.getList<Blog>({
      endpoint: "blog",
      queries: {
        limit: 6, // 6件に制限
        orders: "-publishDate",
      },
    }),
  ]);

  return (
    <main className="space-y-8">
      {/* お知らせセクション */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-sky-500" />
            お知らせ
          </h2>
          <Link
            href="/dashboard/news"
            className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
          >
            すべて表示 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsData.contents.map((news) => (
            <Link key={news.id} href={`/dashboard/news/${news.id}`}>
              <Card className="h-full hover:shadow-md transition-all duration-200 hover:translate-y-[-2px]">
                <CardHeader className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {news.important && (
                      <Badge
                        variant="destructive"
                        className="flex items-center gap-1"
                      >
                        <AlertCircle className="h-3 w-3" />
                        重要
                      </Badge>
                    )}
                    {news.category.map((cat) => (
                      <Badge
                        key={cat}
                        variant="secondary"
                        className="bg-sky-100 text-sky-700"
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="line-clamp-2 text-gray-900">
                    {news.title}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={news.publishedDate}>
                      {format(new Date(news.publishedDate), "yyyy年MM月dd日", {
                        locale: ja,
                      })}
                    </time>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ブログセクション */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-sky-500" />
            ブログ記事
          </h2>
          <Link
            href="/dashboard/blogs"
            className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
          >
            すべて表示 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogData.contents.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>
    </main>
  );
}
