import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/services';
import AppLayout from '../../components/layout/AppLayout';

const inputClass =
  'w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text-dark placeholder-text-light focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all';

const selectClass = `${inputClass} appearance-none`;

const textareaClass =
  'w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text-dark placeholder-text-light focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-none';

function RitualRowShimmer() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-surface-alt flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-surface-alt rounded w-1/2" />
        <div className="h-3 bg-surface-alt rounded w-1/3" />
      </div>
    </div>
  );
}

export default function AdminRitualsPage() {
  const [rituals, setRituals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingRitual, setEditingRitual] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategoryId('');
  };

  const loadRituals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.rituals();
      const list = Array.isArray(data) ? data : data?.results ?? [];
      setRituals(Array.isArray(list) ? list : []);
    } catch {
      setRituals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRituals();
  }, [loadRituals]);

  useEffect(() => {
    let cancelled = false;
    adminApi
      .categories()
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data?.results ?? [];
        setCategories(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        // silent
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const startCreate = () => {
    setEditingRitual(null);
    resetForm();
    setShowForm(true);
  };

  const startEdit = (r) => {
    setEditingRitual(r);
    setName(r.name || '');
    setDescription(r.description || '');
    setPrice(r.price ?? '');
    setCategoryId(r.category_id ?? r.category?.id ?? '');
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingRitual(null);
    resetForm();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    setSaving(true);
    const payload = {
      name,
      description,
      price: price === '' ? null : Number(price),
      ...(categoryId && { category_id: categoryId }),
    };
    try {
      if (editingRitual) {
        await adminApi.updateRitual(editingRitual.id, payload);
        toast.success('Ritual updated');
      } else {
        await adminApi.createRitual(payload);
        toast.success('Ritual created');
      }
      handleCancelForm();
      await loadRituals();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || 'Failed to save ritual'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRitualAction = async (id, action) => {
    try {
      await adminApi.ritualAction(id, action);
      toast.success(`Ritual ${action}d`);
      await loadRituals();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || 'Action failed'
      );
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-5 py-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-heading text-2xl font-bold text-text-dark">
            Rituals
          </h1>
          {!showForm && (
            <button
              type="button"
              onClick={startCreate}
              className="bg-gold text-white text-sm font-semibold px-4 py-2 rounded-xl hover:shadow-md hover:shadow-gold/30 transition-all"
            >
              + Add Ritual
            </button>
          )}
        </div>

        {showForm && (
          <form
            onSubmit={handleSave}
            className="bg-surface border border-border rounded-2xl p-5 mb-5 space-y-4"
          >
            <h2 className="font-heading text-base font-bold text-text-dark">
              {editingRitual ? 'Edit Ritual' : 'New Ritual'}
            </h2>

            <div>
              <label className="block text-sm font-medium text-text-mid mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Satyanarayan Puja"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-mid mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What this ritual is about…"
                className={textareaClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-text-mid mb-1.5">
                  Price (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-mid mb-1.5">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Uncategorised</option>
                  {categories.map((c) => (
                    <option key={c.id ?? c.slug} value={c.id ?? c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gold text-white font-semibold rounded-xl py-2.5 text-sm hover:shadow-md hover:shadow-gold/30 transition-all disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save Ritual'}
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
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <RitualRowShimmer key={i} />
              ))}
          </div>
        ) : rituals.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl text-gold/20 mb-2">ॐ</div>
            <h3 className="font-heading text-lg text-text-dark">
              No rituals yet
            </h3>
            <p className="text-text-light text-sm">
              Click "+ Add Ritual" to create one
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {rituals.map((r) => (
              <div
                key={r.id}
                className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-bg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🛕</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-text-dark truncate">
                    {r.name}
                  </p>
                  <p className="text-xs text-text-light truncate">
                    ₹
                    {Number(r.final_price ?? r.price ?? 0).toLocaleString(
                      'en-IN'
                    )}{' '}
                    • {r.category_name || 'No category'}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                  {r.is_featured ? (
                    <button
                      type="button"
                      onClick={() => handleRitualAction(r.id, 'unfeature')}
                      className="text-xs bg-gold-bg text-gold border border-gold/30 px-2.5 py-1.5 rounded-lg font-medium"
                    >
                      ★ Featured
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRitualAction(r.id, 'feature')}
                      className="text-xs bg-surface border border-border text-text-mid px-2.5 py-1.5 rounded-lg hover:border-gold/50 font-medium"
                    >
                      Feature
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => startEdit(r)}
                    className="text-xs bg-surface border border-border text-text-mid px-2.5 py-1.5 rounded-lg hover:border-gold/50 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRitualAction(r.id, 'deactivate')}
                    className="text-xs bg-red-50 text-red-600 border border-red-200 px-2.5 py-1.5 rounded-lg font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
