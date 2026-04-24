import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Quote, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `post-images/${fileName}`;

        try {
          const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file);
            
          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

          editor.chain().focus().setImage({ src: publicUrl }).run();
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to upload image. Please ensure you have created the "images" bucket in Supabase.');
        }
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-white/[0.02] sticky top-0 z-10 backdrop-blur-md">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('bold') ? 'text-[#D4AF37] bg-white/5' : 'text-white/60'}`}
        title="Bold"
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('italic') ? 'text-[#D4AF37] bg-white/5' : 'text-white/60'}`}
        title="Italic"
      >
        <Italic size={16} />
      </button>
      <div className="w-px h-4 bg-white/10 mx-1"></div>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'text-[#D4AF37] bg-white/5' : 'text-white/60'}`}
        title="Heading 2"
      >
        <Heading1 size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'text-[#D4AF37] bg-white/5' : 'text-white/60'}`}
        title="Heading 3"
      >
        <Heading2 size={16} />
      </button>
      <div className="w-px h-4 bg-white/10 mx-1"></div>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('bulletList') ? 'text-[#D4AF37] bg-white/5' : 'text-white/60'}`}
        title="Bullet List"
      >
        <List size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('orderedList') ? 'text-[#D4AF37] bg-white/5' : 'text-white/60'}`}
        title="Ordered List"
      >
        <ListOrdered size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('blockquote') ? 'text-[#D4AF37] bg-white/5' : 'text-white/60'}`}
        title="Quote"
      >
        <Quote size={16} />
      </button>
      <div className="w-px h-4 bg-white/10 mx-1"></div>
      <button
        onClick={handleImageUpload}
        className="p-2 rounded hover:bg-white/10 transition-colors text-white/60 hover:text-[#D4AF37]"
        title="Upload Image"
      >
        <ImageIcon size={16} />
      </button>
    </div>
  );
};

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-md shadow-lg my-6',
        },
      }),
      Placeholder.configure({
        placeholder: 'Write your article... (Press "/" for commands, or drag an image here)',
      }),
      Markdown,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[400px] p-6 text-white/90 font-light',
      },
      handleDrop: function(view, event, slice, moved) {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `post-images/${fileName}`;

          event.preventDefault();
          
          // Show quick loading toast/state in future?
          supabase.storage
            .from('images')
            .upload(filePath, file)
            .then(({ error: uploadError }) => {
              if (uploadError) throw uploadError;
              const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
              const { schema } = view.state;
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
              if (!coordinates) return;
              
              const node = schema.nodes.image.create({ src: publicUrl });
              const transaction = view.state.tr.insert(coordinates.pos, node);
              view.dispatch(transaction);
            })
            .catch(err => {
              console.error(err);
              alert('Failed to upload dropped image.');
            });

          return true;
        }
        return false;
      }
    },
    onUpdate: ({ editor }) => {
      // Tiptap-markdown provides editor.storage.markdown.getMarkdown()
      const markdown = (editor.storage as any).markdown.getMarkdown();
      onChange(markdown);
    },
  });

  return (
    <div className="border border-white/10 bg-[#0a0a0a] min-h-[500px] flex flex-col focus-within:border-[#D4AF37]/50 transition-colors">
      <MenuBar editor={editor} />
      <div className="flex-1 cursor-text overflow-y-auto" onClick={() => editor?.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div>
      
      {/* Required css for placeholder */}
      <style dangerouslySetInnerHTML={{__html: `
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: rgba(255, 255, 255, 0.3);
          pointer-events: none;
          height: 0;
        }
      `}} />
    </div>
  );
}
