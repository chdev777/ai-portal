import { client, type Blog, type Category } from "@/lib/microcms";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SortSelect } from "@/components/SortSelect";
import { CategoryBadge } from "@/components/CategoryBadge";
import { CategoryTabs } from "@/components/CategoryTabs";
import { Metadata } from "next";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import styles from "./styles.module.css";

// デバイスごとの表示件数を定義
const ITEMS_PER_PAGE = {
  MOBILE: 6, // モバイルでは1ページあたり6件
  DESKTOP: 9, // デスクトップでは1ページあたり9件
};

type SortOrder = "publishDate" | "-publishDate" | "title" | "-title";

// すべてのブログ記事からカテゴリーを収集する
async function getAllCategories() {
  const response = await client.getList<Blog>({
    endpoint: "blog",
    queries: { limit: 100 },
  });

  const categories = response.contents.flatMap((blog) => blog.category);
  return Array.from(new Set(categories));
}

async function getAllBlogs(
  page: number = 1,
  sortOrder: SortOrder = "-publishDate",
  category?: Category
) {
  const queries = {
    limit: ITEMS_PER_PAGE.DESKTOP,
    offset: (page - 1) * ITEMS_PER_PAGE.DESKTOP,
    orders: sortOrder,
    filters: category ? `category[contains]${category}` : undefined,
  };

  const response = await client.getList<Blog>({
    endpoint: "blog",
    queries,
  });

  return {
    contents: response.contents,
    totalCount: response.totalCount,
  };
}

export const metadata: Metadata = {
  title: "ブログ一覧",
};

export const revalidate = 60; // 1分ごとに再検証

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: { page?: string; sort?: SortOrder; category?: Category };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const sort = (searchParams.sort as SortOrder) || "-publishDate";
  const category = searchParams.category;

  const [{ contents: blogs, totalCount }, categories] = await Promise.all([
    getAllBlogs(currentPage, sort, category),
    getAllCategories(),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE.DESKTOP);

  // ページネーションの表示用の配列を生成
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="outline">← 戻る</Button>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ブログ記事一覧</h1>
        <div className="flex gap-4">
          <SortSelect defaultValue={sort} />
        </div>
      </div>

      <CategoryTabs categories={categories} currentCategory={category} />

      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${styles.mobileGrid} ${styles.desktopGrid}`}
      >
        {blogs.map((blog) => (
          <Link href={`/dashboard/blogs/${blog.id}`} key={blog.id}>
            <Card className="h-full hover:bg-accent transition-colors">
              <CardHeader>
                {blog.thumbnail && (
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={blog.thumbnail.url}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mb-2 max-h-[2.5rem] overflow-hidden">
                  {blog.category.slice(0, 4).map((cat: Category) => (
                    <CategoryBadge key={cat} category={cat} />
                  ))}
                </div>
                <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                <CardDescription>
                  {format(new Date(blog.publishDate), "yyyy年MM月dd日", {
                    locale: ja,
                  })}
                  {blog.author && ` · ${blog.author}`}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Pagination className="mt-8">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href={`/dashboard/blogs?page=${currentPage - 1}&sort=${sort}${
                  category ? `&category=${category}` : ""
                }`}
              />
            </PaginationItem>
          )}

          {pageNumbers.map((pageNum) => {
            // 現在のページの前後2ページまでと最初と最後のページを表示
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
            ) {
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href={`/dashboard/blogs?page=${pageNum}&sort=${sort}${
                      category ? `&category=${category}` : ""
                    }`}
                    isActive={pageNum === currentPage}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            // 省略記号を表示
            if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
              return (
                <PaginationItem key={`ellipsis-${pageNum}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return null;
          })}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext
                href={`/dashboard/blogs?page=${currentPage + 1}&sort=${sort}${
                  category ? `&category=${category}` : ""
                }`}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
