"use client";
import { useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Menubar } from "./Menubar";
import { EditorContent, useEditor } from "@tiptap/react";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        // FIX: Removed newline characters and excessive whitespace from the class string
        class:
          `min-h-[300px] p-4 focus:outline-none prose prose-s sm:prose lg:prose-lg xl:prose-xl dark:prose-invert`,
      },
    },
     immediatelyRender: false, 
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html !== value) {
        onChange(html);
      }
    },
  });
  // Sinkronisasi content saat value eksternal berubah
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border w-full border-input rounded-lg overflow-hidden dark:bg-input/30">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
