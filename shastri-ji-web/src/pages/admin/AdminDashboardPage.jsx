import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/services';
import AppLayout from '../../components/layout/AppLayout';

const STAT_FIELDS = [
  { label: 'Total Users', get: (s) => s?.total_users },
  { label: 'Total Priests', get: (s) => s?.total_priests },
  { label: 'Total Bookings', get: (s) => s?.total_bookings },
  {
    label: 'Pending Review',
    get: (s) => s?.pending_priests ?? s?.priests_pending,
  },
];

const NAV_ITEMS = [
  {
    to: '/admin/priests',
    emoji: '📿',
    label: 'Manage Priests',
    desc: 'Verify, feature, suspend',
  },
  {
    to: '/admin/users',
    emoji: '👥',
    label: 'Manage Users',
    desc: 'View and moderate users',
  },
  {
    to: '/admin/rituals',
    emoji: '🛕',
    label: 'Manage Rituals',
    desc: 'Create and edit rituals',
  },
  {
    to: '/admin/banners',
    emoji: '🖼️',
    label: 'Manage Banners',
    desc: 'Homepage banners',
  },
];

function StatShimmer() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 h-24 animate-pulse" />
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    adminApi
      .stats()
      .then((data) => {
        if (!cancelled) setStats(data || {});
      })
      .catch(() => {
        // silent
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-5 py-6">
        <div className="mb-5">
          <h1 className="font-heading text-2xl font-bold text-text-dark">
            Admin Dashboard
          </h1>
          <p className="text-text-light text-sm">
            Operational health at a glance
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => <StatShimmer key={i} />)
            : STAT_FIELDS.map((f) => {
                const value = f.get(stats);
                return (
                  <div
                    key={f.label}
                    className="bg-surface border border-border rounded-2xl p-5 text-center"
                  >
                    <p className="font-heading text-3xl font-bold text-gold">
                      {value ?? '—'}
                    </p>
                    <p className="text-xs text-text-light mt-1">{f.label}</p>
                  </div>
                );
              })}
        </div>

        <h2 className="font-heading text-lg font-bold text-text-dark mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="bg-surface border border-border rounded-2xl p-5 hover:border-gold/50 hover:shadow-md hover:shadow-gold/10 transition-all group"
            >
              <span className="text-3xl mb-3 block">{item.emoji}</span>
              <h3 className="font-heading text-base font-bold text-text-dark group-hover:text-gold transition-colors">
                {item.label}
              </h3>
              <p className="text-xs text-text-light mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
