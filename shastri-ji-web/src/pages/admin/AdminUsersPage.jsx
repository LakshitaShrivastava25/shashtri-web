import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
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

function UserRowShimmer() {
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

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.users({
        ...(search && { search }),
        ...(roleFilter && { role: roleFilter }),
      });
      const list = Array.isArray(data) ? data : data?.results ?? [];
      setUsers(Array.isArray(list) ? list : []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleUserAction = async (userId, action) => {
    setActionLoading(userId);
    try {
      await adminApi.userAction(userId, action);
      toast.success(`User ${action}d successfully`);
      await loadUsers();
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
            Users
          </h1>
          <p className="text-text-light text-sm">
            Browse, suspend, and reactivate
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <SearchIcon />
            <input
              type="search"
              placeholder="Search by name or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-dark placeholder-text-light focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text-dark focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all sm:w-44"
          >
            <option value="">All roles</option>
            <option value="USER">User</option>
            <option value="PRIEST">Priest</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <UserRowShimmer key={i} />
              ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl text-gold/20 mb-2">ॐ</div>
            <h3 className="font-heading text-lg text-text-dark">
              No users found
            </h3>
            <p className="text-text-light text-sm">Try a different filter</p>
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((u) => (
              <div
                key={u.id}
                className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-gold-bg border border-gold/30 flex items-center justify-center text-gold font-bold font-heading flex-shrink-0">
                  {u.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-text-dark truncate">
                    {u.name || 'Unnamed'}
                  </p>
                  <p className="text-xs text-text-light truncate">
                    {u.phone_number}
                    {u.role && ` • ${u.role}`}
                    {u.date_joined &&
                      ` • Joined ${dayjs(u.date_joined).format('D MMM YYYY')}`}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {u.is_active ? (
                    <button
                      type="button"
                      onClick={() => handleUserAction(u.id, 'suspend')}
                      disabled={actionLoading === u.id}
                      className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 font-medium disabled:opacity-60"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUserAction(u.id, 'activate')}
                      disabled={actionLoading === u.id}
                      className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 font-medium disabled:opacity-60"
                    >
                      Activate
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
