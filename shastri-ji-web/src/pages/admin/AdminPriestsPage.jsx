import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/services';
import AppLayout from '../../components/layout/AppLayout';

const SearchIcon = () => (
  <svg
    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light w-4 h-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
  </svg>
);

function PriestRowShimmer() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-surface-alt flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-surface-alt rounded w-1/3" />
        <div className="h-3 bg-surface-alt rounded w-1/2" />
      </div>
    </div>
  );
}

export default function AdminPriestsPage() {
  const [priests, setPriests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const loadPriests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.priests({
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      });
      const list = Array.isArray(data) ? data : data?.results ?? [];
      setPriests(Array.isArray(list) ? list : []);
    } catch {
      setPriests([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    loadPriests();
  }, [loadPriests]);

  const handleAction = async (priestId, action) => {
    setActionLoading(priestId);
    try {
      await adminApi.priestAction(priestId, action);
      toast.success(`Priest ${action}d successfully`);
      await loadPriests();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || 'Action failed'
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-5 py-6">
        <div className="mb-5">
          <h1 className="font-heading text-2xl font-bold text-text-dark">
            Priests
          </h1>
          <p className="text-text-light text-sm">
            Verify, feature, and moderate
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <SearchIcon />
            <input
              type="search"
              placeholder="Search by name or city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-dark placeholder-text-light focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text-dark focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all sm:w-48"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <PriestRowShimmer key={i} />
              ))}
          </div>
        ) : priests.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl text-gold/20 mb-2">ॐ</div>
            <h3 className="font-heading text-lg text-text-dark">
              No priests found
            </h3>
            <p className="text-text-light text-sm">Try a different filter</p>
          </div>
        ) : (
          <div className="space-y-2">
            {priests.map((p) => (
              <div
                key={p.id}
                className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-gold-bg border border-gold/30 flex items-center justify-center text-gold font-bold font-heading flex-shrink-0">
                  {p.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-text-dark">
                      {p.name}
                    </p>
                    {p.is_verified && (
                      <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full">
                        ✓ Verified
                      </span>
                    )}
                    {p.is_featured && (
                      <span className="text-xs bg-gold-bg text-gold border border-gold/30 px-1.5 py-0.5 rounded-full">
                        ★ Featured
                      </span>
                    )}
                    {p.is_suspended && (
                      <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-full">
                        Suspended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-light mt-0.5">
                    {p.city || '—'}
                    {p.tradition_name && ` • ${p.tradition_name}`}
                    {p.rating != null && ` • ★${Number(p.rating).toFixed(1)}`}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                  {!p.is_verified && (
                    <button
                      type="button"
                      onClick={() => handleAction(p.id, 'verify')}
                      disabled={actionLoading === p.id}
                      className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-all font-medium disabled:opacity-60"
                    >
                      Verify
                    </button>
                  )}
                  {p.is_verified && !p.is_featured && (
                    <button
                      type="button"
                      onClick={() => handleAction(p.id, 'feature')}
                      disabled={actionLoading === p.id}
                      className="text-xs bg-gold-bg text-gold border border-gold/30 px-3 py-1.5 rounded-lg hover:bg-gold/20 transition-all font-medium disabled:opacity-60"
                    >
                      Feature
                    </button>
                  )}
                  {p.is_featured && (
                    <button
                      type="button"
                      onClick={() => handleAction(p.id, 'unfeature')}
                      disabled={actionLoading === p.id}
                      className="text-xs bg-surface border border-border text-text-mid px-3 py-1.5 rounded-lg hover:border-gold/50 transition-all font-medium disabled:opacity-60"
                    >
                      Unfeature
                    </button>
                  )}
                  {!p.is_suspended && (
                    <button
                      type="button"
                      onClick={() => handleAction(p.id, 'suspend')}
                      disabled={actionLoading === p.id}
                      className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-all font-medium disabled:opacity-60"
                    >
                      Suspend
                    </button>
                  )}
                  {p.is_suspended && (
                    <button
                      type="button"
                      onClick={() => handleAction(p.id, 'reactivate')}
                      disabled={actionLoading === p.id}
                      className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-all font-medium disabled:opacity-60"
                    >
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
