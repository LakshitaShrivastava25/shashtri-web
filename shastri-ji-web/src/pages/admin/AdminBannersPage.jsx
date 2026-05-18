import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/services';
import AppLayout from '../../components/layout/AppLayout';

const inputClass =
  'w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text-dark placeholder-text-light focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all';

const selectClass = `${inputClass} appearance-none`;

const REDIRECT_TYPES = ['NONE', 'RITUAL', 'PRIEST', 'CATEGORY'];

function BannerRowShimmer() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4 animate-pulse">
      <div className="w-16 h-12 rounded-xl bg-surface-alt flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-surface-alt rounded w-1/2" />
        <div className="h-3 bg-surface-alt rounded w-1/3" />
      </div>
    </div>
  );
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [redirectType, setRedirectType] = useState('NONE');
  const [redirectId, setRedirectId] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setRedirectType('NONE');
    setRedirectId('');
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadBanners = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.banners();
      const list = Array.isArray(data) ? data : data?.results ?? [];
      setBanners(Array.isArray(list) ? list : []);
    } catch {
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  const handleCancelForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    setSaving(true);
    const fd = new FormData();
    fd.append('title', title);
    if (subtitle) fd.append('subtitle', subtitle);
    fd.append('redirect_type', redirectType);
    if (redirectId) fd.append('redirect_id', redirectId);
    if (imageFile) fd.append('image', imageFile);
    try {
      await adminApi.createBanner(fd);
      toast.success('Banner created');
      handleCancelForm();
      await loadBanners();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || 'Failed to save banner'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteBanner(id);
      toast.success('Banner deleted');
      await loadBanners();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || 'Failed to delete'
      );
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-5 py-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-heading text-2xl font-bold text-text-dark">
            Banners
          </h1>
          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="bg-gold text-white text-sm font-semibold px-4 py-2 rounded-xl hover:shadow-md hover:shadow-gold/30 transition-all"
            >
              + New Banner
            </button>
          )}
        </div>

        {showForm && (
          <form
            onSubmit={handleSave}
            className="bg-surface border border-border rounded-2xl p-5 mb-5 space-y-4"
          >
            <h2 className="font-heading text-base font-bold text-text-dark">
              New Banner
            </h2>

            <div>
              <label className="block text-sm font-medium text-text-mid mb-1.5">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Diwali Specials"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-mid mb-1.5">
                Subtitle
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Optional"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-text-mid mb-1.5">
                  Redirect Type
                </label>
                <select
                  value={redirectType}
                  onChange={(e) => setRedirectType(e.target.value)}
                  className={selectClass}
                >
                  {REDIRECT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              {redirectType !== 'NONE' && (
                <div>
                  <label className="block text-sm font-medium text-text-mid mb-1.5">
                    Redirect ID
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={redirectId}
                    onChange={(e) => setRedirectId(e.target.value)}
                    placeholder="e.g. 42"
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-mid mb-1.5">
                Banner Image
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-gold/50 transition-all"
              >
                {imageFile ? (
                  <p className="text-sm text-text-dark">{imageFile.name}</p>
                ) : (
                  <p className="text-sm text-text-light">
                    Click to upload banner image
                  </p>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gold text-white font-semibold rounded-xl py-2.5 text-sm hover:shadow-md hover:shadow-gold/30 transition-all disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save Banner'}
              </button>
              <button
                type="button"
                onClick={handleCancelForm}
                disabled={saving}
                className="flex-1 border-2 border-border text-text-mid rounded-xl py-2.5 text-sm font-semibold hover:border-gold/50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="space-y-2">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <BannerRowShimmer key={i} />
              ))}
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-2">🖼️</div>
            <h3 className="font-heading text-lg text-text-dark">
              No banners yet
            </h3>
            <p className="text-text-light text-sm">
              Add your first homepage banner
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {banners.map((b) => (
              <div
                key={b.id}
                className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4"
              >
                {b.image && (
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-16 h-12 object-cover rounded-xl flex-shrink-0 bg-gold-bg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-text-dark truncate">
                    {b.title}
                  </p>
                  <p className="text-xs text-text-light truncate">
                    {b.redirect_type || 'NONE'}
                    {b.redirect_id ? ` → ID:${b.redirect_id}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(b.id)}
                  className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg font-medium hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
