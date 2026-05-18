import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { priestDashboardApi } from '../../api/services';
import { useAuthStore } from '../../store';
import AppLayout from '../../components/layout/AppLayout';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  ACCEPTED: {
    label: 'Accepted',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  COMPLETED: {
    label: 'Completed',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  EXPIRED: {
    label: 'Expired',
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
  },
  COUNTER_OFFERED: {
    label: 'Counter Offer',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
};

const StatusPill = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      {cfg.label}
    </span>
  );
};

const STATS_FIELDS = [
  { label: 'Total Bookings', key: 'total_bookings' },
  { label: 'Pending', key: 'pending_bookings' },
  { label: 'Completed', key: 'completed_bookings' },
  {
    label: 'Rating',
    key: 'average_rating',
    format: (v) =>
      v == null || Number.isNaN(Number(v)) ? '—' : Number(v).toFixed(1),
  },
];

function StatCard({ label, value }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 text-center">
      <p className="text-2xl font-bold font-heading text-gold">{value}</p>
      <p className="text-xs text-text-light mt-1">{label}</p>
    </div>
  );
}

function StatShimmer() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 h-20 animate-pulse" />
  );
}

export default function PriestDashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    priestDashboardApi
      .stats()
      .then((data) => {
        if (cancelled) return;
        setStats(data || {});
        const recent =
          data?.recent_bookings ?? data?.bookings ?? data?.recent ?? [];
        setRecentBookings(Array.isArray(recent) ? recent : []);
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to load dashboard'
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const firstName = user?.name?.split(' ')[0];

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-5 py-6">
        <div className="mb-5">
          <h1 className="font-heading text-2xl font-bold text-text-dark">
            Namaste{firstName ? `, ${firstName}` : ''} 🙏
          </h1>
          <p className="text-text-light text-sm">
            Here's a summary of your practice
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => <StatShimmer key={i} />)
            : STATS_FIELDS.map((f) => {
                const raw = stats?.[f.key];
                const value = f.format
                  ? f.format(raw)
                  : raw == null
                  ? '—'
                  : raw;
                return (
                  <StatCard key={f.key} label={f.label} value={value} />
                );
              })}
        </div>

        <h2 className="font-heading text-lg font-bold text-text-dark mb-3">
          Recent Bookings
        </h2>

        {loading ? (
          <div className="space-y-3">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-surface border border-border rounded-2xl p-4 animate-pulse flex gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-surface-alt flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface-alt rounded w-3/4" />
                    <div className="h-3 bg-surface-alt rounded w-1/2" />
                  </div>
                </div>
              ))}
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="text-center py-12 bg-surface border border-border rounded-2xl">
            <div className="text-5xl mb-2">🛕</div>
            <h3 className="font-heading text-lg text-text-dark">
              No bookings yet
            </h3>
            <p className="text-text-light text-sm">
              Booking requests will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((b) => (
              <Link
                key={b.id}
                to={`/priest/bookings/${b.id}`}
                className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-3 hover:border-gold/40 hover:shadow-sm transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-bg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🛕</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-heading text-sm font-bold text-text-dark group-hover:text-gold transition-colors truncate">
                    {b.ritual_name || 'Ritual Booking'}
                  </h4>
                  <p className="text-xs text-text-light mt-0.5 truncate">
                    {b.user_name}
                    {b.selected_date &&
                      ` • ${dayjs(b.selected_date).format('D MMM YYYY')}`}
                  </p>
                </div>
                <StatusPill status={b.status} />
              </Link>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-6">
          <Link
            to="/priest/bookings"
            className="bg-surface border-2 border-gold text-gold font-semibold rounded-xl py-3 text-center text-sm hover:bg-gold-bg transition-all"
          >
            View All Bookings
          </Link>
          <Link
            to="/profile"
            className="bg-gold text-white font-semibold rounded-xl py-3 text-center text-sm hover:shadow-md hover:shadow-gold/30 transition-all"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
