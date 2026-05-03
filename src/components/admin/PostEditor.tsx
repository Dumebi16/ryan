import { useState, useEffect, useRef, useCallback } from "react";
import { X, Plus, Trash, Info, Activity, ArrowUpRight, UploadCloud, Check, ChevronDown } from "lucide-react";
import RichTextEditor from "../RichTextEditor";
import { supabase } from "../../lib/supabase";
import { formatDate } from "../../lib/utils";

type Tab = "main" | "seo" | "quality";
type SaveStatus = "idle" | "saving" | "saved" | "error";

interface PostEditorProps {
  draft: any;
  setDraft: (d: any) => void;
  publishAction: "draft" | "schedule" | "publish";
  setPublishAction: (a: "draft" | "schedule" | "publish") => void;
  savePost: () => Promise<void>;
  loading: boolean;
  onClose: () => void;
}

const Tooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block ml-2 align-middle">
    <Info size={12} className="text-current opacity-40 hover:opacity-100 hover:text-[#D4AF37] cursor-help transition-all" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black border border-white/10 text-white text-[10px] p-2 leading-relaxed opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl pointer-events-none font-sans normal-case tracking-normal">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white/10"></div>
    </div>
  </div>
);

const tInput = "bg-white/[0.03] border border-white/10 text-white focus:border-[#D4AF37]/50 font-sans normal-case outline-none";

const PRESET_CATS = ["SBA Loans", "Business Acquisition Strategy", "Financial Guidance"];
const CUSTOM_CATS_KEY = "cms_custom_categories";

export default function PostEditor({
  draft, setDraft,
  publishAction, setPublishAction,
  savePost, loading, onClose,
}: PostEditorProps) {
  const [activeTab, setActiveTab] = useState<Tab>("main");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // ── Category dropdown ─────────────────────────────────────────────────────────
  const [catOpen, setCatOpen] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [newCatInput, setNewCatInput] = useState("");
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [customCats, setCustomCats] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem(CUSTOM_CATS_KEY) ?? "[]")
  );
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!catOpen) return;
    const close = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
        setCreateMode(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [catOpen]);

  useEffect(() => {
    supabase.from("posts").select("category").then(({ data }) => {
      if (data) {
        const cats = [...new Set(data.map((p: any) => p.category).filter(Boolean))] as string[];
        setDbCategories(cats);
      }
    });
  }, []);

  const allCats = [...new Set([...PRESET_CATS, ...dbCategories, ...customCats])];

  const handleAddCategory = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (![...PRESET_CATS, ...dbCategories].includes(trimmed)) {
      const updated = [...customCats, trimmed];
      setCustomCats(updated);
      localStorage.setItem(CUSTOM_CATS_KEY, JSON.stringify(updated));
    }
    setDraft({ ...draft, category: trimmed });
    setCreateMode(false);
    setNewCatInput("");
    setCatOpen(false);
  };

  // ── Image upload ─────────────────────────────────────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const ext = file.name.split('.').pop();
    const path = `post-images/${Math.random().toString(36).substring(2)}.${ext}`;
    try {
      const { error } = await supabase.storage.from('images').upload(path, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path);
      setDraft((prev: any) => ({ ...prev, [field]: publicUrl }));
    } catch (err: any) {
      alert('Error uploading image: ' + err.message);
    }
  };

  // ── Autosave ─────────────────────────────────────────────────────────────────
  const autoSave = useCallback(async () => {
    if (!draft.id || loading) return;
    if (!draft.title?.trim()) return;
    setSaveStatus('saving');
    try {
      const { error } = await supabase.from('posts').update({
        title: draft.title,
        slug: draft.slug,
        markdown_content: draft.markdown_content,
        excerpt: draft.excerpt,
        meta_title: draft.meta_title,
        meta_description: draft.meta_description,
        category: draft.category,
        read_time: parseInt(draft.read_time) || 0,
        updated_at: new Date().toISOString(),
      }).eq('id', draft.id);
      if (error) throw error;
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch {
      setSaveStatus('error');
    }
  }, [draft, loading]);

  useEffect(() => {
    if (!draft.id) return;
    clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(autoSave, 3000);
    return () => clearTimeout(autosaveTimer.current);
  }, [draft.title, draft.markdown_content, draft.excerpt, draft.meta_title]);

  // ── SEO completeness ──────────────────────────────────────────────────────────
  const seoChecks = [
    { label: 'Title', ok: !!draft.title?.trim() },
    { label: 'Slug', ok: !!draft.slug?.trim() },
    { label: 'Meta Description', ok: !!draft.meta_description?.trim() },
    { label: 'Cover Image', ok: !!draft.cover_image_url?.trim() },
    { label: 'Excerpt', ok: !!draft.excerpt?.trim() },
  ];
  const seoScore = seoChecks.filter(c => c.ok).length;

  // Strip HTML tags before counting words (content is stored as HTML)
  const plainText = draft.markdown_content
    ? draft.markdown_content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    : '';
  const wordCount = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  // Keep draft.read_time in sync with estimated value (user can still override via the input)
  useEffect(() => {
    if (wordCount > 0 && draft.read_time !== estimatedReadTime) {
      setDraft((prev: any) => ({ ...prev, read_time: estimatedReadTime }));
    }
  // Only re-run when content changes, not on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.markdown_content]);

  return (
    <div className="flex h-full animate-in fade-in slide-in-from-right-4 duration-500 overflow-hidden font-sans bg-[#0a0a0a]">

      {/* ── Left: Writing canvas ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-10 py-10 relative">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">

          {/* Title + slug */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Article Title..."
              value={draft.title}
              onChange={e => setDraft({ ...draft, title: e.target.value })}
              className="bg-transparent text-5xl font-light outline-none text-white placeholder-white/20 pb-4 border-b border-transparent focus:border-white/10 transition-colors w-full"
            />
            <div className="flex items-center gap-3 text-xs text-white/40">
              <span className="uppercase tracking-widest font-kiona text-[9px] text-[#D4AF37]">Slug</span>
              <input
                type="text"
                placeholder="auto-generated-slug"
                value={draft.slug}
                onChange={e => setDraft({ ...draft, slug: e.target.value })}
                className="bg-transparent border-none outline-none flex-1 hover:bg-white/[0.02] p-1 font-sans text-white/60"
              />
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 border-b border-white/10 pb-px">
            {(['main', 'seo', 'quality'] as Tab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-[10px] font-kiona uppercase tracking-widest transition-all ${
                  activeTab === tab
                    ? 'text-[#D4AF37] border-b border-[#D4AF37]'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {tab === 'main' ? 'Editorial' : tab === 'seo' ? `SEO / Data${seoScore < 5 ? ` (${seoScore}/5)` : ''}` : 'Compliance'}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div>
            {activeTab === 'main' && (
              <div className="flex flex-col gap-8 animate-in fade-in duration-300">
                <RichTextEditor
                  value={draft.markdown_content}
                  onChange={val => setDraft({ ...draft, markdown_content: val })}
                />

                {/* Article Settings */}
                <div className="border border-white/10 p-6 bg-white/[0.01]">
                  <label className="block text-[10px] uppercase font-kiona text-[#D4AF37] tracking-widest mb-4">Article Settings</label>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-[10px] uppercase font-kiona text-white/40 tracking-wider mb-2">Category</label>
                      <div ref={catRef} className="relative">
                        {/* Trigger button */}
                        <button
                          type="button"
                          onClick={() => { setCatOpen(v => !v); setCreateMode(false); }}
                          className={`w-full flex items-center justify-between p-3 text-sm text-left transition-colors ${tInput}`}
                        >
                          <span className={draft.category ? "text-white" : "text-white/30"}>
                            {draft.category || "Select category..."}
                          </span>
                          <ChevronDown
                            size={14}
                            className={`text-white/40 transition-transform duration-150 shrink-0 ${catOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        {/* Dropdown panel */}
                        {catOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-[#0d0d0d] border border-white/10 shadow-2xl z-50">
                            {allCats.map(cat => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => { setDraft({ ...draft, category: cat }); setCatOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-xs font-sans flex items-center justify-between transition-colors ${
                                  draft.category === cat
                                    ? "text-[#D4AF37] bg-[#D4AF37]/5"
                                    : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                                }`}
                              >
                                {cat}
                                {draft.category === cat && <Check size={11} />}
                              </button>
                            ))}

                            <div className="h-px bg-white/10 my-1" />

                            {!createMode ? (
                              <button
                                type="button"
                                onClick={() => setCreateMode(true)}
                                className="w-full text-left px-4 py-2.5 text-[10px] font-kiona uppercase tracking-widest text-[#D4AF37]/60 hover:text-[#D4AF37] hover:bg-white/[0.03] flex items-center gap-2 transition-colors"
                              >
                                <Plus size={11} /> Create New Category
                              </button>
                            ) : (
                              <div className="p-3 border-t border-white/5">
                                <div className="flex gap-2">
                                  <input
                                    autoFocus
                                    type="text"
                                    value={newCatInput}
                                    onChange={e => setNewCatInput(e.target.value)}
                                    onKeyDown={e => {
                                      if (e.key === "Enter") handleAddCategory(newCatInput);
                                      if (e.key === "Escape") setCreateMode(false);
                                    }}
                                    placeholder="New category name..."
                                    className="flex-1 bg-white/[0.05] border border-white/20 text-white text-xs px-3 py-2 outline-none focus:border-[#D4AF37]/50 font-sans"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleAddCategory(newCatInput)}
                                    className="bg-[#D4AF37] text-black px-3 py-2 text-[10px] font-bold font-kiona tracking-widest uppercase hover:bg-white transition-colors shrink-0"
                                  >
                                    Add
                                  </button>
                                </div>
                                <p className="text-[10px] text-white/25 mt-2 font-sans">
                                  Press Enter or click Add — saved for future posts.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-kiona text-white/40 tracking-wider mb-2">
                        Read Time (Mins)
                      </label>
                      <input
                        type="number"
                        value={draft.read_time}
                        onChange={e => setDraft({ ...draft, read_time: e.target.value })}
                        className={`w-full p-3 transition-colors ${tInput}`}
                      />
                    </div>
                  </div>

                  {/* Cover image */}
                  <div className="mb-4">
                    <label className="block text-[10px] uppercase font-kiona text-white/40 tracking-wider mb-2">
                      Cover Feature Image <Tooltip text="Feature image shown at the top of the article." />
                    </label>
                    {draft.cover_image_url ? (
                      <div>
                        <div className="relative h-48 w-full border border-white/10 overflow-hidden group">
                          <img src={draft.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <label className="bg-black/80 border border-white/20 text-white text-[10px] px-4 py-2 font-kiona uppercase tracking-widest cursor-pointer hover:border-white/40 transition-colors">
                              Replace
                              <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'cover_image_url')} />
                            </label>
                            <button
                              type="button"
                              onClick={() => setDraft({ ...draft, cover_image_url: '' })}
                              className="bg-black/80 border border-red-400/40 text-red-400 text-[10px] px-4 py-2 font-kiona uppercase tracking-widest hover:bg-red-400/10 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <p className="text-[10px] text-white/25 mt-1.5 font-sans">
                          Recommended: 1600 × 900 px (16:9) · Min 1200 px wide · JPG, PNG, WebP
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="h-48 w-full border border-white/10 border-dashed hover:border-[#D4AF37]/50 transition-colors flex flex-col items-center justify-center relative cursor-pointer bg-white/[0.01]">
                          <UploadCloud size={24} className="text-white/30 mb-3" />
                          <span className="text-[10px] font-kiona tracking-widest uppercase text-[#D4AF37] mb-1">Click or Drag to Upload</span>
                          <span className="text-[10px] text-white/30">High fidelity files preferred</span>
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={e => handleImageUpload(e, 'cover_image_url')} />
                        </div>
                        <p className="text-[10px] text-white/25 mt-1.5 font-sans">
                          Recommended: 1600 × 900 px (16:9) · Min 1200 px wide · JPG, PNG, WebP
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-kiona text-white/40 tracking-wider mb-2">
                      Cover Alt Text <Tooltip text="Describes the image for screen readers and image search." />
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ryan Kroge reviewing SBA loan documents"
                      value={draft.hero_alt_text}
                      onChange={e => setDraft({ ...draft, hero_alt_text: e.target.value })}
                      className={`w-full p-3 transition-colors ${tInput}`}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="flex flex-col gap-8 animate-in fade-in duration-300">
                {/* SEO completeness */}
                <div className="border border-white/10 p-4 bg-white/[0.01]">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[10px] font-kiona tracking-widest text-[#D4AF37] uppercase">SEO Completeness</label>
                    <span className={`text-[10px] font-kiona ${seoScore === 5 ? 'text-green-400' : seoScore >= 3 ? 'text-[#D4AF37]' : 'text-red-400/70'}`}>
                      {seoScore}/5
                    </span>
                  </div>
                  {seoChecks.map(({ label, ok }) => (
                    <div key={label} className="flex items-center justify-between py-1">
                      <span className="text-xs text-white/50">{label}</span>
                      {ok
                        ? <Check size={12} className="text-[#D4AF37]" />
                        : <X size={12} className="text-red-400/60" />}
                    </div>
                  ))}
                </div>

                {/* Metadata */}
                <div>
                  <h3 className="text-[10px] font-kiona tracking-widest text-[#D4AF37] uppercase mb-4">Metadata</h3>
                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="block text-xs font-sans text-white/50 mb-2">
                        Excerpt <Tooltip text="Short summary shown on the blog listing cards." />
                      </label>
                      <textarea
                        value={draft.excerpt}
                        onChange={e => setDraft({ ...draft, excerpt: e.target.value })}
                        className={`w-full p-3 h-24 resize-none ${tInput}`}
                        placeholder="Brief summary of this article…"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-sans text-white/50 mb-2">
                        Search Engine Title <Tooltip text="The clickable title on Google search results." />
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. SBA 7(a) Business Acquisition Guide"
                        value={draft.meta_title}
                        onChange={e => setDraft({ ...draft, meta_title: e.target.value })}
                        className={`w-full p-3 transition-colors ${tInput}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-sans text-white/50 mb-2">Search Engine Description</label>
                      <textarea
                        placeholder="e.g. Learn how to secure an SBA loan…"
                        value={draft.meta_description}
                        onChange={e => setDraft({ ...draft, meta_description: e.target.value })}
                        className={`w-full p-3 h-20 resize-none ${tInput}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-sans text-white/50 mb-2">Canonical URL</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={draft.canonical_url}
                        onChange={e => setDraft({ ...draft, canonical_url: e.target.value })}
                        className={`w-full p-3 transition-colors ${tInput}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-sans text-white/50 mb-2">Open Graph / Social Image URL</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={draft.open_graph_image}
                        onChange={e => setDraft({ ...draft, open_graph_image: e.target.value })}
                        className={`w-full p-3 transition-colors ${tInput}`}
                      />
                    </div>
                  </div>
                </div>

                {/* FAQs */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[10px] font-kiona tracking-widest text-[#D4AF37] uppercase">People Also Ask (FAQs)</h3>
                    <button
                      onClick={() => setDraft({ ...draft, faqs: [...(draft.faqs || []), { question: "", answer: "" }] })}
                      className="text-[10px] uppercase font-kiona text-white hover:text-[#D4AF37] border border-white/20 px-3 py-1 flex items-center gap-1 transition-colors"
                    >
                      <Plus size={12} /> Add
                    </button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {draft.faqs?.map((faq: any, i: number) => (
                      <div key={i} className="border border-white/10 p-4 bg-white/[0.01] relative group">
                        <button
                          onClick={() => { const f = [...draft.faqs]; f.splice(i, 1); setDraft({ ...draft, faqs: f }); }}
                          className="absolute top-4 right-4 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash size={14} />
                        </button>
                        <input
                          type="text"
                          placeholder="Question"
                          value={faq.question}
                          onChange={e => { const f = [...draft.faqs]; f[i].question = e.target.value; setDraft({ ...draft, faqs: f }); }}
                          className={`w-full mb-3 p-2 ${tInput}`}
                        />
                        <textarea
                          placeholder="Answer"
                          value={faq.answer}
                          onChange={e => { const f = [...draft.faqs]; f[i].answer = e.target.value; setDraft({ ...draft, faqs: f }); }}
                          className={`w-full h-20 resize-none p-2 ${tInput}`}
                        />
                      </div>
                    ))}
                    {(!draft.faqs || draft.faqs.length === 0) && (
                      <p className="text-sm text-white/40 italic">Add FAQs to improve Google AEO visibility.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'quality' && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                <h3 className="text-[10px] font-kiona tracking-widest text-[#D4AF37] uppercase mb-2">Compliance & Strategy</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans text-white/50 mb-2">Tone of Voice</label>
                    <select
                      value={draft.tone_of_voice || ''}
                      onChange={e => setDraft({ ...draft, tone_of_voice: e.target.value })}
                      className={`w-full p-3 cursor-pointer ${tInput}`}
                    >
                      <option value="expert-friendly">Expert-Friendly</option>
                      <option value="authoritative">Authoritative</option>
                      <option value="concise">Concise</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-sans text-white/50 mb-2">Reading Level</label>
                    <input
                      type="text"
                      placeholder="e.g. 5th Grade, General Web"
                      value={draft.reading_level}
                      onChange={e => setDraft({ ...draft, reading_level: e.target.value })}
                      className={`w-full p-3 transition-colors ${tInput}`}
                    />
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={draft.originality_check} onChange={e => setDraft({ ...draft, originality_check: e.target.checked })} className="accent-[#D4AF37] w-4 h-4" />
                  <span className="text-sm">Human Originality Verified</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={draft.noindex} onChange={e => setDraft({ ...draft, noindex: e.target.checked })} className="accent-[#D4AF37] w-4 h-4" />
                  <span className="text-sm text-red-300">Apply NOINDEX — hide from search engines</span>
                </label>
                <div>
                  <label className="block text-xs font-sans text-white/50 mb-2">Legal Disclaimer</label>
                  <textarea
                    placeholder="e.g. The information provided does not constitute financial advice…"
                    value={draft.legal_disclaimer}
                    onChange={e => setDraft({ ...draft, legal_disclaimer: e.target.value })}
                    className={`w-full p-3 h-24 resize-none ${tInput}`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Right: Publish panel ─────────────────────────────────────────────── */}
      <div className="w-[300px] border-l border-white/10 bg-[#070707] flex flex-col overflow-y-auto z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
        <div className="p-5 border-b border-white/10 flex justify-between items-center">
          <span className="text-[#D4AF37] text-[10px] uppercase font-kiona tracking-widest">Publish Context</span>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X size={16} /></button>
        </div>

        <div className="p-5 flex flex-col gap-5 flex-1">
          {/* Workflow state */}
          <div>
            <label className="block text-xs font-sans text-white/50 mb-3">Workflow State</label>
            <div className="flex flex-col gap-2">
              {(['draft', 'schedule', 'publish'] as const).map(action => (
                <label
                  key={action}
                  className={`cursor-pointer p-3 border text-sm flex items-center gap-3 transition-colors ${
                    publishAction === action ? 'border-[#D4AF37] bg-white/[0.05]' : 'border-white/10 bg-white/[0.01] opacity-60'
                  }`}
                >
                  <input
                    type="radio"
                    name="state"
                    value={action}
                    checked={publishAction === action}
                    onChange={() => setPublishAction(action)}
                    className="accent-[#D4AF37]"
                  />
                  {action === 'draft' ? 'Draft' : action === 'schedule' ? 'Schedule' : 'Publish Now'}
                </label>
              ))}
            </div>
          </div>

          {publishAction === 'schedule' && (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <label className="block text-xs font-sans text-white/50 mb-2">Publication Date & Time</label>
              <input
                type="datetime-local"
                value={draft.published_at ? new Date(draft.published_at).toISOString().slice(0, 16) : ''}
                onChange={e => setDraft({ ...draft, published_at: new Date(e.target.value).toISOString() })}
                className={`w-full p-2 text-sm text-white ${tInput} [color-scheme:dark]`}
              />
            </div>
          )}

          {/* Article intel */}
          <div className="border border-white/10 p-4 bg-white/[0.02]">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={14} className="text-[#D4AF37]" />
              <span className="text-[10px] uppercase font-kiona tracking-widest text-[#D4AF37]">Article Intel</span>
            </div>
            <div className="flex justify-between text-xs py-1 text-white/60"><span>Word Count:</span> <span>{wordCount.toLocaleString()}</span></div>
            <div className="flex justify-between text-xs py-1 text-white/60"><span>Est. Reading Time:</span> <span>{estimatedReadTime} min</span></div>
            <div className="flex justify-between text-xs py-1 text-white/60"><span>Last Saved:</span> <span>{draft.updated_at ? formatDate(draft.updated_at) : 'Never'}</span></div>

            {draft.slug && (
              <button
                onClick={() => window.open(`/resources/${draft.slug}?preview=true`, '_blank')}
                className="flex items-center justify-between text-xs py-1 mt-3 border-t border-white/10 pt-3 text-white/80 hover:text-[#D4AF37] transition-colors w-full text-left"
              >
                <span>Preview Draft</span>
                <ArrowUpRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Autosave status + save button */}
        <div className="border-t border-white/10 bg-black/50">
          {saveStatus !== 'idle' && (
            <div className="px-5 py-2 border-b border-white/5">
              {saveStatus === 'saving' && <span className="text-[10px] font-kiona text-white/40 uppercase tracking-widest">Saving...</span>}
              {saveStatus === 'saved' && <span className="text-[10px] font-kiona text-[#D4AF37] uppercase tracking-widest flex items-center gap-1"><Check size={10} /> Saved</span>}
              {saveStatus === 'error' && <span className="text-[10px] font-kiona text-red-400 uppercase tracking-widest">Error autosaving</span>}
            </div>
          )}
          <div className="p-5">
            <button
              onClick={savePost}
              disabled={loading}
              className="w-full bg-[#D4AF37] text-black px-6 py-4 text-[11px] font-bold font-kiona tracking-widest uppercase hover:bg-white transition-all transform hover:-translate-y-0.5 shadow-[4px_4px_0px_rgba(255,255,255,0.1)] disabled:opacity-50"
            >
              {loading
                ? 'Syncing...'
                : publishAction === 'draft'
                  ? (draft.id ? 'Update Draft' : 'Save Draft')
                  : publishAction === 'schedule'
                    ? 'Schedule Post'
                    : (draft.id ? 'Update Article' : 'Publish Article')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
