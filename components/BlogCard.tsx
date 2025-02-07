"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import type { Blog } from "@/lib/microcms";

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link href={`/dashboard/blogs/${blog.id}`}>
      <Card className="h-full hover:shadow-md transition-all duration-200 hover:translate-y-[-2px]">
        <CardHeader className="space-y-4">
          {blog.thumbnail && (
            <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
              <Image
                src={blog.thumbnail.url}
                alt={blog.title}
                fill
                className="object-cover transform hover:scale-105 transition-transform duration-200"
              />
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {blog.category.slice(0, 4).map((cat) => (
              <Badge
                key={cat}
                variant="secondary"
                className="bg-sky-100 text-sky-700"
              >
                {cat}
              </Badge>
            ))}
          </div>
          <CardTitle className="line-clamp-2 text-gray-900 hover:text-sky-600 transition-colors">
            {blog.title}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <time dateTime={blog.publishDate}>
              {format(new Date(blog.publishDate), "yyyy年MM月dd日", {
                locale: ja,
              })}
            </time>
            {blog.author && (
              <>
                <span>•</span>
                <span>{blog.author}</span>
              </>
            )}
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
