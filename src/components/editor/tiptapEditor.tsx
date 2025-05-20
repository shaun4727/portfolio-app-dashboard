'use client';

import * as React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';

import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node';
import { MAX_FILE_SIZE, handleImageUpload } from '@/lib/tiptap-utils';

import './editor.css';
import './editorMenu.css';
import '@/components/tiptap-node/image-upload-node/image-upload-node.scss';
import { MenuBar } from './editorTools';

export default function TipTapClient({
  onChange,
  value,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle,
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Image,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error('Upload failed:', error),
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value]);

  return (
    <>
      {editor && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </>
  );
}
