import { LayoutDashboard, FileText, FileEdit, Calendar, CheckCircle2, PieChart, Plus, X, User } from "lucide-react";

export type Section = 'dashboard' | 'posts_all' | 'posts_drafts' | 'posts_scheduled' | 'posts_published' | 'analytics' | 'settings' | 'editor' | 'profile';

interface AdminSidebarProps {
  activeSection: Section;
  setActiveSection: (s: Section) => void;
  session: any;
  postsCount: number;
  draftsCount: number;
  scheduledCount: number;
  publishedCount: number;
  onNewPost: () => void;
  onSignOut: () => void;
}

const NavItem = ({ icon, label, section, count, active, onClick }: {
  icon: React.ReactNode; label: string; section: Section;
  count?: number; active: boolean; onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-all ${
      active
        ? 'bg-white/[0.05] text-[#D4AF37] border-l-2 border-[#D4AF37]'
        : 'text-white/60 hover:text-white hover:bg-white/[0.02] border-l-2 border-transparent'
    }`}
  >
    <span className={active ? 'opacity-100' : 'opacity-70'}>{icon}</span>
    <span className="text-sm">{label}</span>
    {count !== undefined && (
      <span className={`ml-auto text-[9px] px-1.5 py-0.5 ${active ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-white/10 text-white/50'}`}>
        {count}
      </span>
    )}
  </button>
);

export default function AdminSidebar({
  activeSection, setActiveSection, session,
  postsCount, draftsCount, scheduledCount, publishedCount,
  onNewPost, onSignOut,
}: AdminSidebarProps) {
  const email: string = session?.user?.email ?? '';
  const meta = session?.user?.user_metadata ?? {};
  const displayName: string = meta.full_name || 'Ryan Kroge';
  const avatarUrl: string | undefined = meta.avatar_url;
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside className="border-r border-white/10 flex flex-col h-screen sticky top-0 bg-[#0a0a0a] z-30">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex flex-col gap-1 items-start">
        <span className="text-[#D4AF37] text-[9px] uppercase font-kiona tracking-widest">Admin Control</span>
        <span className="text-lg font-light tracking-tight">Ryan Kroge</span>
      </div>

      {/* New Post CTA */}
      <div className="p-4">
        <button
          onClick={onNewPost}
          className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] text-black px-4 py-3 text-[10px] font-bold font-kiona tracking-widest uppercase hover:bg-white transition-all"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 88%, 95% 100%, 0 100%)" }}
        >
          <Plus size={14} /> New Post
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-1">
        <NavItem icon={<LayoutDashboard size={14}/>} label="Dashboard" section="dashboard"
          active={activeSection === 'dashboard'} onClick={() => setActiveSection('dashboard')} />

        <div className="mt-6 mb-2 text-white/30 px-3 text-[9px] font-kiona tracking-widest uppercase">Content</div>
        <NavItem icon={<FileText size={14}/>} label="All Posts" count={postsCount} section="posts_all"
          active={activeSection === 'posts_all'} onClick={() => setActiveSection('posts_all')} />
        <NavItem icon={<FileEdit size={14}/>} label="Drafts" count={draftsCount} section="posts_drafts"
          active={activeSection === 'posts_drafts'} onClick={() => setActiveSection('posts_drafts')} />
        <NavItem icon={<Calendar size={14}/>} label="Scheduled" count={scheduledCount} section="posts_scheduled"
          active={activeSection === 'posts_scheduled'} onClick={() => setActiveSection('posts_scheduled')} />
        <NavItem icon={<CheckCircle2 size={14}/>} label="Published" count={publishedCount} section="posts_published"
          active={activeSection === 'posts_published'} onClick={() => setActiveSection('posts_published')} />

        <div className="mt-6 mb-2 text-white/30 px-3 text-[9px] font-kiona tracking-widest uppercase">Insights</div>
        <NavItem icon={<PieChart size={14}/>} label="Analytics" section="analytics"
          active={activeSection === 'analytics'} onClick={() => setActiveSection('analytics')} />

        <div className="mt-auto pt-4 pb-2 border-t border-white/10 flex flex-col gap-1">
          <NavItem icon={<User size={14}/>} label="Profile" section="profile"
            active={activeSection === 'profile' || activeSection === 'settings'} onClick={() => setActiveSection('profile')} />
        </div>
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-white/10 flex items-center justify-between gap-3">
        <button
          onClick={() => setActiveSection('profile')}
          className="flex items-center gap-3 group flex-1 min-w-0"
          title="View profile"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-8 h-8 object-cover border border-[#D4AF37]/30" />
          ) : (
            <div className="w-8 h-8 bg-[#D4AF37]/10 flex items-center justify-center text-xs font-kiona font-bold text-[#D4AF37] border border-[#D4AF37]/30 shrink-0">
              {initials || <User size={14} />}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-xs uppercase font-kiona tracking-widest truncate group-hover:text-[#D4AF37] transition-colors">{displayName}</span>
            <span className="text-[9px] text-white/40 font-sans truncate">{email}</span>
          </div>
        </button>
        <button onClick={onSignOut} className="text-white/40 hover:text-white transition-colors shrink-0" title="Sign out">
          <X size={14} />
        </button>
      </div>
    </aside>
  );
}
