import { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { getNewsDetail, type Category } from "@/lib/microcms";
import { RichContent } from "@/components/RichContent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const data = await getNewsDetail(params.id);

  return {
    title: data?.title,
    description: data?.description,
  };
}

export default async function NewsDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const data = await getNewsDetail(id);

  if (!data) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard/news">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Button>
        </Link>
      </div>
      <Card className="overflow-hidden">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {data.important && <Badge variant="destructive">重要</Badge>}
            {data.category.map((cat: string) => (
              <Badge key={cat} variant="secondary">
                {cat}
              </Badge>
            ))}
          </div>
          <h1 className="text-2xl font-bold leading-tight">{data.title}</h1>
          <div className="text-sm text-muted-foreground">
            掲載期間：
            {format(new Date(data.publishedDate), "yyyy年MM月dd日", {
              locale: ja,
            })}
            ～
            {format(new Date(data.endDate), "yyyy年MM月dd日", {
              locale: ja,
            })}
          </div>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none pb-8">
          <RichContent content={data.content} />
        </CardContent>
      </Card>
    </main>
  );
}
