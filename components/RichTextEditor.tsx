"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import { Button } from "./ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const colors = [
  { name: "デフォルト", value: "#000000" },
  { name: "赤", value: "#ff0000" },
  { name: "青", value: "#0000ff" },
  { name: "緑", value: "#008000" },
  { name: "オレンジ", value: "#ffa500" },
  { name: "紫", value: "#800080" },
];

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  editable = true,
}: RichTextEditorProps) {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkURL, setLinkURL] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
        paragraph: {
          HTMLAttributes: {
            class: "leading-normal my-0",
          },
        },
      }),
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "underline text-blue-600",
        },
      }),
      Heading,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "min-h-[120px] outline-none",
      },
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const previousURL = editor.getAttributes("link").href;
    if (previousURL) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    setIsLinkModalOpen(true);
  };

  const confirmLink = () => {
    if (linkURL) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkURL })
        .run();
    }
    setLinkURL("");
    setIsLinkModalOpen(false);
  };

  const cancelLink = () => {
    setLinkURL("");
    setIsLinkModalOpen(false);
  };

  return (
    <div className="rounded-md border border-input bg-background">
      {editable && (
        <div className="border-b border-input p-2 flex gap-2 flex-wrap items-center">
          {/* 見出しボタン */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 }) ? "bg-accent" : ""
            }
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""
            }
          >
            <Heading2 className="h-4 w-4" />
          </Button>

          {/* テキスト整列ボタン */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={
              editor.isActive({ textAlign: "left" }) ? "bg-accent" : ""
            }
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={
              editor.isActive({ textAlign: "center" }) ? "bg-accent" : ""
            }
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={
              editor.isActive({ textAlign: "right" }) ? "bg-accent" : ""
            }
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={
              editor.isActive({ textAlign: "justify" }) ? "bg-accent" : ""
            }
          >
            <AlignJustify className="h-4 w-4" />
          </Button>

          {/* フォーマットボタン */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              editor.chain().focus().toggleBold().run();
            }}
            className={editor.isActive("bold") ? "bg-accent" : ""}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              editor.chain().focus().toggleItalic().run();
            }}
            className={editor.isActive("italic") ? "bg-accent" : ""}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              editor.chain().focus().toggleBulletList().run();
            }}
            className={editor.isActive("bulletList") ? "bg-accent" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              editor.chain().focus().toggleOrderedList().run();
            }}
            className={editor.isActive("orderedList") ? "bg-accent" : ""}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              editor.chain().focus().toggleBlockquote().run();
            }}
            className={editor.isActive("blockquote") ? "bg-accent" : ""}
          >
            <Quote className="h-4 w-4" />
          </Button>

          {/* リンク挿入ボタン */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addLink}
            className={editor.isActive("link") ? "bg-accent" : ""}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>

          {/* アンチエイリアスボタン */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              editor.chain().focus().undo().run();
            }}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              editor.chain().focus().redo().run();
            }}
          >
            <Redo className="h-4 w-4" />
          </Button>

          {/* カラーピッカー */}
          <Select
            onValueChange={(value) => {
              editor.chain().focus().setColor(value).run();
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="文字色" />
            </SelectTrigger>
            <SelectContent>
              {colors.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color.value }}
                    />
                    <span>{color.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="min-h-[120px]">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none dark:prose-invert p-4 [&_p]:my-0 [&_p]:leading-normal"
        />
      </div>

      {/* リンク挿入モーダル */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-2">リンクを挿入</h2>
            <input
              type="url"
              placeholder="URLを入力してください"
              value={linkURL}
              onChange={(e) => setLinkURL(e.target.value)}
              className="border p-2 w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button type="button" onClick={cancelLink}>
                キャンセル
              </Button>
              <Button type="button" onClick={confirmLink} disabled={!linkURL}>
                挿入
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
