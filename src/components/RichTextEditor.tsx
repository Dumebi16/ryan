import { useState, useEffect, useCallback, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useEditor, EditorContent, ReactRenderer, Extension, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Suggestion from '@tiptap/suggestion';
import { Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Image as ImageIcon, Link as LinkIcon, Minus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

// ─── Upload helper ─────────────────────────────────────────────────────────────

async function uploadToSupabase(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `post-images/${Math.random().toString(36).substring(2)}.${ext}`;
  const { error } = await supabase.storage.from('images').upload(path, file);
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path);
  return publicUrl;
}

// ─── Image sizes ──────────────────────────────────────────────────────────────

const IMG_SIZES = {
  small:  { label: 'Small',  maxWidth: '400px' },
  medium: { label: 'Medium', maxWidth: '672px' },
  large:  { label: 'Large',  maxWidth: '100%'  },
} as const;
type ImgSize = keyof typeof IMG_SIZES;

// ─── Image Node View ──────────────────────────────────────────────────────────

const ImageNodeView = ({ node, updateAttributes, deleteNode }: any) => {
  const [uploading, setUploading] = useState(false);
  const size: ImgSize = node.attrs.size in IMG_SIZES ? node.attrs.size : 'large';

  const handleReplace = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (!input.files?.length) return;
      setUploading(true);
      try {
        const url = await uploadToSupabase(input.files[0]);
        updateAttributes({ src: url });
      } catch (err: any) {
        alert('Replace failed: ' + err.message);
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  return (
    <NodeViewWrapper className="group relative my-6 flex flex-col items-center not-prose" data-drag-handle>
      <div
        style={{ maxWidth: IMG_SIZES[size].maxWidth }}
        className="relative w-full mx-auto transition-[max-width] duration-300"
      >
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ''}
          className="w-full shadow-lg block select-none"
          draggable={false}
        />
        {/* Floating image toolbar — visible on hover */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-stretch bg-black/95 border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 whitespace-nowrap">
          {(Object.keys(IMG_SIZES) as ImgSize[]).map((s, i) => (
            <button
              key={s}
              type="button"
              onMouseDown={e => { e.preventDefault(); e.stopPropagation(); updateAttributes({ size: s }); }}
              className={`px-3 py-2 text-[9px] font-kiona uppercase tracking-widest transition-colors ${
                i > 0 ? 'border-l border-white/10' : ''
              } ${
                size === s
                  ? 'text-[#D4AF37] bg-white/5'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.07]'
              }`}
            >
              {IMG_SIZES[s].label}
            </button>
          ))}
          <div className="w-px bg-white/10 mx-0.5" />
          <button
            type="button"
            onMouseDown={e => { e.preventDefault(); e.stopPropagation(); handleReplace(); }}
            disabled={uploading}
            className="px-3 py-2 text-[9px] font-kiona uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/[0.07] transition-colors border-l border-white/10 disabled:opacity-40"
          >
            {uploading ? '…' : 'Replace'}
          </button>
          <button
            type="button"
            onMouseDown={e => { e.preventDefault(); e.stopPropagation(); deleteNode(); }}
            className="px-3 py-2 text-[9px] font-kiona uppercase tracking-widest text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-colors border-l border-white/10"
          >
            Delete
          </button>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

// ─── Custom image extension ────────────────────────────────────────────────────

const CustomImage = Image.extend({
  draggable: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      size: {
        default: 'large' as ImgSize,
        parseHTML: element => {
          const val = element.getAttribute('data-size');
          return val && val in IMG_SIZES ? val : 'large';
        },
        renderHTML: attributes => {
          const s: ImgSize = attributes.size in IMG_SIZES ? attributes.size : 'large';
          return {
            'data-size': s,
            // Inline style ensures correct rendering on the public blog without extra CSS
            style: `max-width: ${IMG_SIZES[s].maxWidth}; margin: 1.5rem auto; display: block;`,
          };
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});

// ─── Slash commands ────────────────────────────────────────────────────────────

const SLASH_ITEMS = [
  { title: 'Heading 1', icon: 'H1', desc: 'Large title',
    command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).toggleHeading({ level: 1 }).run() },
  { title: 'Heading 2', icon: 'H2', desc: 'Medium title',
    command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run() },
  { title: 'Heading 3', icon: 'H3', desc: 'Small title',
    command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).toggleHeading({ level: 3 }).run() },
  { title: 'Paragraph', icon: 'P', desc: 'Normal text',
    command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).setParagraph().run() },
  { title: 'Bullet List', icon: '•', desc: 'Unordered list',
    command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).toggleBulletList().run() },
  { title: 'Numbered List', icon: '1.', desc: 'Ordered list',
    command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).toggleOrderedList().run() },
  { title: 'Quote', icon: '"', desc: 'Block quote',
    command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).toggleBlockquote().run() },
  { title: 'Divider', icon: '—', desc: 'Horizontal rule',
    command: ({ editor, range }: any) => editor.chain().focus().deleteRange(range).setHorizontalRule().run() },
];

const SlashCommandList = forwardRef(({ items, command }: any, ref: any) => {
  const [selected, setSelected] = useState(0);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: any) => {
      if (event.key === 'ArrowUp') { setSelected(s => (s - 1 + items.length) % items.length); return true; }
      if (event.key === 'ArrowDown') { setSelected(s => (s + 1) % items.length); return true; }
      if (event.key === 'Enter') { command(items[selected]); return true; }
      return false;
    },
  }));

  useEffect(() => setSelected(0), [items]);
  if (!items.length) return null;

  return (
    <div className="bg-[#111] border border-white/10 shadow-2xl w-56 overflow-hidden">
      {items.map((item: any, i: number) => (
        <button
          key={item.title}
          type="button"
          onMouseDown={e => { e.preventDefault(); command(item); }}
          className={`w-full flex items-center gap-3 px-3 py-2 text-left ${
            i === selected ? 'bg-[#D4AF37]/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="w-6 h-6 border border-white/10 flex items-center justify-center text-[10px] font-kiona text-[#D4AF37] shrink-0">
            {item.icon}
          </span>
          <div>
            <div className="text-xs font-medium">{item.title}</div>
            <div className="text-[10px] text-white/40">{item.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );
});
SlashCommandList.displayName = 'SlashCommandList';

// ─── Slash command extension ───────────────────────────────────────────────────

function createSlashExtension() {
  return Extension.create({
    name: 'slashCommand',
    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          char: '/',
          startOfLine: false,
          command: ({ editor, range, props }: any) => props.command({ editor, range }),
          items: ({ query }: any) =>
            SLASH_ITEMS.filter(i => i.title.toLowerCase().includes(query.toLowerCase())),
          render: () => {
            let renderer: ReactRenderer | null = null;
            let el: HTMLElement | null = null;
            return {
              onStart(props: any) {
                el = document.createElement('div');
                el.style.cssText = 'position:fixed;z-index:9999;';
                document.body.appendChild(el);
                renderer = new ReactRenderer(SlashCommandList, {
                  props: { items: props.items, command: props.command },
                  editor: props.editor,
                });
                el.appendChild(renderer.element as HTMLElement);
                const rect = props.clientRect?.();
                if (rect && el) { el.style.top = `${rect.bottom + 6}px`; el.style.left = `${rect.left}px`; }
              },
              onUpdate(props: any) {
                renderer?.updateProps({ items: props.items, command: props.command });
                const rect = props.clientRect?.();
                if (rect && el) { el.style.top = `${rect.bottom + 6}px`; el.style.left = `${rect.left}px`; }
              },
              onKeyDown(props: any) {
                if (props.event.key === 'Escape') { el?.remove(); renderer?.destroy(); return true; }
                return (renderer?.ref as any)?.onKeyDown(props) ?? false;
              },
              onExit() { el?.remove(); renderer?.destroy(); el = null; renderer = null; },
            };
          },
        }),
      ];
    },
  });
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

const MenuBar = ({ editor, onImageUpload }: { editor: any; onImageUpload: () => void }) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const applyLink = useCallback(() => {
    if (linkUrl.trim()) {
      const href = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
      editor.chain().focus().setLink({ href, target: '_blank' }).run();
    }
    setLinkUrl(''); setShowLinkInput(false);
  }, [editor, linkUrl]);

  if (!editor) return null;

  const cmd = (fn: () => void) => (e: React.MouseEvent) => { e.preventDefault(); fn(); };
  const active = (name: string, attrs?: any) => editor.isActive(name, attrs);
  const cls = (name: string, attrs?: any) =>
    `p-2 hover:bg-white/10 transition-colors ${active(name, attrs) ? 'text-[#D4AF37] bg-white/5' : 'text-white/60'}`;

  return (
    <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-0.5 p-2">
        <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleBold().run())} className={cls('bold')} title="Bold (Cmd+B)"><Bold size={15} /></button>
        <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleItalic().run())} className={cls('italic')} title="Italic (Cmd+I)"><Italic size={15} /></button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleHeading({ level: 1 }).run())} className={cls('heading', { level: 1 })} title="Heading 1"><Heading1 size={15} /></button>
        <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleHeading({ level: 2 }).run())} className={cls('heading', { level: 2 })} title="Heading 2"><Heading2 size={15} /></button>
        <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleHeading({ level: 3 }).run())} className={cls('heading', { level: 3 })} title="Heading 3"><Heading3 size={15} /></button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleBulletList().run())} className={cls('bulletList')} title="Bullet List"><List size={15} /></button>
        <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleOrderedList().run())} className={cls('orderedList')} title="Numbered List"><ListOrdered size={15} /></button>
        <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleBlockquote().run())} className={cls('blockquote')} title="Quote"><Quote size={15} /></button>
        <button type="button" onMouseDown={cmd(() => editor.chain().focus().setHorizontalRule().run())} className="p-2 hover:bg-white/10 transition-colors text-white/60" title="Divider"><Minus size={15} /></button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button
          type="button"
          onMouseDown={e => {
            e.preventDefault();
            if (active('link')) { editor.chain().focus().unsetLink().run(); }
            else { setShowLinkInput(v => !v); }
          }}
          className={cls('link')}
          title={active('link') ? 'Remove Link' : 'Add Link'}
        >
          <LinkIcon size={15} />
        </button>
        <button
          type="button"
          onMouseDown={e => { e.preventDefault(); onImageUpload(); }}
          className="p-2 hover:bg-white/10 transition-colors text-white/60"
          title="Insert Image (recommended: 1200–1600 px wide, JPG/PNG/WebP)"
        >
          <ImageIcon size={15} />
        </button>
      </div>

      {showLinkInput && (
        <div className="flex items-center gap-2 px-2 pb-2 border-t border-white/5">
          <input
            type="url"
            placeholder="https://..."
            value={linkUrl}
            autoFocus
            onChange={e => setLinkUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyLink(); } if (e.key === 'Escape') { setShowLinkInput(false); setLinkUrl(''); } }}
            className="flex-1 bg-transparent border border-white/10 text-white text-xs px-3 py-1.5 outline-none focus:border-[#D4AF37]/50 font-sans"
          />
          <button type="button" onMouseDown={e => { e.preventDefault(); applyLink(); }} className="text-[10px] font-kiona uppercase text-[#D4AF37] px-3 py-1.5 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 transition-colors">Apply</button>
          <button type="button" onMouseDown={e => { e.preventDefault(); setShowLinkInput(false); setLinkUrl(''); }} className="text-white/40 hover:text-white"><X size={14} /></button>
        </div>
      )}
    </div>
  );
};

// ─── Main editor ──────────────────────────────────────────────────────────────

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const lastValueRef = useRef(value);
  const slashExt = useRef(createSlashExtension()).current;

  const extensions = useMemo(() => [
    StarterKit,
    CustomImage,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { class: 'text-[#D4AF37] underline underline-offset-2 cursor-pointer' },
    }),
    Placeholder.configure({ placeholder: 'Write your article… (type / for commands)' }),
    slashExt,
  ], []); // eslint-disable-line react-hooks/exhaustive-deps

  const editor = useEditor({
    extensions,
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[400px] p-6 text-white/90 font-light',
      },
      handleDrop(view, event, _slice, moved) {
        if (!moved && event.dataTransfer?.files?.[0]) {
          const file = event.dataTransfer.files[0];
          if (!file.type.startsWith('image/')) return false;
          event.preventDefault();
          uploadToSupabase(file).then(publicUrl => {
            const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
            if (!coords) return;
            const node = view.state.schema.nodes.image.create({ src: publicUrl, size: 'large' });
            view.dispatch(view.state.tr.insert(coords.pos, node));
          }).catch(err => alert('Drop upload failed: ' + err.message));
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastValueRef.current = html;
      onChange(html);
    },
  });

  // Sync when parent loads a different post
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    if (value === lastValueRef.current) return;
    lastValueRef.current = value;
    editor.commands.setContent(value ?? '', { emitUpdate: false });
  }, [value, editor]);

  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = async () => {
      if (!input.files?.length) return;
      try {
        const url = await uploadToSupabase(input.files[0]);
        editor?.chain().focus().setImage({ src: url, size: 'large' } as any).run();
      } catch (err: any) {
        alert('Image upload failed: ' + err.message + '\n\nMake sure the "images" storage bucket exists in your Supabase dashboard.');
      }
    };
    input.click();
  }, [editor]);

  return (
    <div className="border border-white/10 bg-[#0a0a0a] min-h-[500px] flex flex-col focus-within:border-[#D4AF37]/30 transition-colors">
      <MenuBar editor={editor} onImageUpload={handleImageUpload} />
      <div className="flex-1 cursor-text overflow-y-auto" onClick={() => editor?.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: rgba(255,255,255,0.22);
          pointer-events: none;
          height: 0;
        }
        .tiptap a { color: #D4AF37; text-decoration: underline; text-underline-offset: 3px; }
        .tiptap hr { border-color: rgba(255,255,255,0.15); margin: 2rem 0; }
        .tiptap h1 { font-size: 2em; font-weight: 300; }
        .tiptap h2 { font-size: 1.5em; font-weight: 300; }
        .tiptap h3 { font-size: 1.25em; font-weight: 400; }
        .tiptap blockquote { border-left: 3px solid #D4AF37; padding-left: 1rem; color: rgba(255,255,255,0.6); }
        .tiptap ul { list-style: disc; padding-left: 1.5rem; }
        .tiptap ol { list-style: decimal; padding-left: 1.5rem; }
      `}} />
    </div>
  );
}
