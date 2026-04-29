import { useState } from "react";
import { User, UploadCloud, Check } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface ProfilePageProps {
  session: any;
  showToast: (msg: string, type?: "success" | "error") => void;
  onSessionRefresh: () => void;
}

export default function ProfilePage({ session, showToast, onSessionRefresh }: ProfilePageProps) {
  const meta = session?.user?.user_metadata ?? {};
  const [displayName, setDisplayName] = useState<string>(meta.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState<string>(meta.avatar_url || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const email: string = session?.user?.email ?? '';
  const initials = displayName
    ? displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : email.slice(0, 2).toUpperCase();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const ext = file.name.split('.').pop();
    const userId = session?.user?.id ?? 'unknown';
    const path = `avatars/${userId}.${ext}`;
    setUploading(true);
    try {
      const { error } = await supabase.storage.from('images').upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path);
      setAvatarUrl(publicUrl);
      showToast('Avatar uploaded.', 'success');
    } catch (err: any) {
      showToast('Upload failed: ' + err.message, 'error');
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: displayName, avatar_url: avatarUrl },
      });
      if (error) throw error;
      onSessionRefresh();
      showToast('Profile updated.', 'success');
    } catch (err: any) {
      showToast('Save failed: ' + err.message, 'error');
    }
    setSaving(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-2xl mx-auto py-12 px-8">
      <div className="mb-10 border-b border-white/10 pb-6">
        <div className="text-[#D4AF37] text-[10px] uppercase tracking-widest font-kiona mb-2">Account</div>
        <h1 className="text-3xl font-light tracking-tight">Profile</h1>
      </div>

      <div className="flex flex-col gap-8">
        {/* Avatar */}
        <div>
          <label className="block text-[10px] uppercase font-kiona text-white/40 tracking-wider mb-4">Avatar</label>
          <div className="flex items-center gap-6">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName || email} className="w-20 h-20 object-cover border border-[#D4AF37]/30" />
            ) : (
              <div className="w-20 h-20 bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-2xl font-kiona font-bold text-[#D4AF37]">
                {initials || <User size={24} />}
              </div>
            )}
            <div>
              <label className="relative cursor-pointer inline-flex items-center gap-2 border border-white/10 px-4 py-2 text-[10px] font-kiona uppercase tracking-widest hover:border-[#D4AF37]/50 transition-colors text-white/60 hover:text-white">
                <UploadCloud size={14} />
                {uploading ? 'Uploading…' : 'Upload Photo'}
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleAvatarUpload} disabled={uploading} />
              </label>
              <p className="text-[10px] text-white/30 mt-2 font-sans">JPG, PNG, WebP. Max 2MB.</p>
            </div>
          </div>
        </div>

        {/* Display name */}
        <div>
          <label className="block text-[10px] uppercase font-kiona text-white/40 tracking-wider mb-2">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="Ryan Kroge"
            className="w-full bg-white/[0.03] border border-white/10 text-white focus:border-[#D4AF37]/50 font-sans outline-none px-4 py-3"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-[10px] uppercase font-kiona text-white/40 tracking-wider mb-2">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full bg-white/[0.01] border border-white/10 text-white/40 font-sans outline-none px-4 py-3 cursor-not-allowed"
          />
          <p className="text-[10px] text-white/30 mt-1 font-sans">Email cannot be changed here.</p>
        </div>

        {/* Save */}
        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#D4AF37] text-black px-8 py-3 text-[10px] font-bold font-kiona tracking-widest uppercase hover:bg-white transition-all disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
          {!saving && (
            <div className="opacity-0 animate-in fade-in duration-300 flex items-center gap-1 text-[10px] text-[#D4AF37] font-kiona uppercase tracking-widest" style={{ opacity: 0 }}>
              <Check size={12} /> Saved
            </div>
          )}
        </div>

        {/* Password note */}
        <div className="border border-white/10 p-6 bg-white/[0.01]">
          <h4 className="text-[10px] font-kiona uppercase tracking-widest text-white/50 mb-2">Password</h4>
          <p className="text-sm text-white/40 font-sans">To change your password, use the Supabase password reset flow from the login page.</p>
        </div>
      </div>
    </div>
  );
}
