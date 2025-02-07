import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertInternalUrl(url: string): string {
  // 開発環境とプロダクション環境でのURLの変換
  if (url.startsWith("http://localhost:3000")) {
    return url;
  }

  // 内部URLを外部URLに変換
  const internalUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  if (url.startsWith("/")) {
    return `${internalUrl}${url}`;
  }

  return url;
}
