import { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { client, type News, type Category } from "@/lib/microcms";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AlertCircle, Calendar, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "お知らせ一覧",
};

export const revalidate = 60;

const PER_PAGE = 12;

export default async function NewsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const now = new Date();

  // 現在の日付で掲示期間内のお知らせのみを取得
  const data = await client.getList<News>({
    endpoint: "news",
    queries: {
      offset: (currentPage - 1) * PER_PAGE,
      limit: PER_PAGE,
      filters: `publishedDate[less_than]${now.toISOString()}[and]endDate[greater_than]${now.toISOString()}`,
      orders: "important,-publishedDate",
    },
  });

  const totalPages = Math.ceil(data.totalCount / PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          戻る
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">お知らせ一覧</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.contents.map((news) => (
          <Link key={news.id} href={`/dashboard/news/${news.id}`}>
            <Card className="h-full hover:bg-accent transition-colors">
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
                  {news.category.map((cat: Category) => (
                    <Badge key={cat} variant="secondary">
                      {cat}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="line-clamp-2">{news.title}</CardTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={news.publishedDate}>
                    {format(new Date(news.publishedDate), "yyyy年MM月dd日", {
                      locale: ja,
                    })}
                  </time>
                  ～
                  <time dateTime={news.endDate}>
                    {format(new Date(news.endDate), "yyyy年MM月dd日", {
                      locale: ja,
                    })}
                  </time>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={`/dashboard/news?page=${currentPage - 1}`}
                />
              </PaginationItem>
            )}

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href={`/dashboard/news?page=${page}`}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (page === currentPage - 3 || page === currentPage + 3) {
                return (
                  <PaginationItem key={page}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return null;
            })}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  href={`/dashboard/news?page=${currentPage + 1}`}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
