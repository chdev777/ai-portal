"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Script from "next/script";

interface RichContentProps {
  content: string;
}

export const RichContent = ({ content }: RichContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // iframelyスクリプトが読み込まれた後に実行
    const loadIframely = () => {
      if (window.iframely) {
        window.iframely.load();
      }
    };

    // DOMが更新された後にiframelyを再読み込み
    loadIframely();
  }, [content]);

  return (
    <>
      <Script
        src="//cdn.iframe.ly/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (window.iframely) {
            window.iframely.load();
          }
        }}
      />
      <div
        ref={contentRef}
        className="rich-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
};

export default RichContent;
