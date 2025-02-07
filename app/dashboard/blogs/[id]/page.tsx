import { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { getBlogDetail, type Category } from "@/lib/microcms";
import { RichContent } from "@/components/RichContent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, User, Calendar } from "lucide-react";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const data = await getBlogDetail(params.id);

  return {
    title: data?.title,
    description: data?.description,
  };
}

export default async function BlogDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const data = await getBlogDetail(id);

  if (!data) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard/blogs">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Button>
        </Link>
      </div>
      <Card className="overflow-hidden">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {data.category.slice(0, 4).map((cat: string) => (
              <Badge key={cat} variant="secondary">
                {cat}
              </Badge>
            ))}
          </div>
          <h1 className="text-2xl font-bold leading-tight">{data.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={data.publishDate}>
                {format(new Date(data.publishDate), "yyyy年MM月dd日", {
                  locale: ja,
                })}
              </time>
            </div>
            {data.author && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{data.author}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none pb-8">
          <RichContent content={data.content} />
        </CardContent>
      </Card>
    </main>
  );
}
