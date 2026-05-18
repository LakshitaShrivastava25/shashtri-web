import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { priestBookingsApi } from '../../api/services';
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

const TABS = ['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED', 'REJECTED'];

function ShimmerCard() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 animate-pulse flex gap-3">
      <div className="w-12 h-12 rounded-xl bg-surface-alt flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-surface-alt rounded w-3/4" />
        <div className="h-3 bg-surface-alt rounded w-1/2" />
      </div>
    </div>
  );
}

export default function PriestBookingListPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    priestBookingsApi
      .list()
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data?.results ?? [];
        setBookings(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (!cancelled) setBookings([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredBookings = useMemo(
    () =>
      activeTab === 'ALL'
        ? bookings
        : bookings.filter((b) => b.status === activeTab),
    [bookings, activeTab]
  );

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-5 py-6">
        <div className="mb-5">
          <h1 className="font-heading text-2xl font-bold text-text-dark">
            My Bookings
          </h1>
          <p className="text-text-light text-sm">
            Manage your booking requests
          </p>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-gold text-white'
                  : 'bg-surface border border-border text-text-mid hover:border-gold/50'
              }`}
            >
              {tab === 'ALL'
                ? 'All'
                : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <ShimmerCard key={i} />
              ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-2">🛕</div>
            <h3 className="font-heading text-lg text-text-dark">
              {activeTab === 'ALL'
                ? 'No bookings yet'
                : `No ${activeTab.toLowerCase()} bookings`}
            </h3>
            <p className="text-text-light text-sm">
              {activeTab === 'ALL'
                ? 'Booking requests will appear here'
                : 'Try a different tab'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map((b) => (
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
      </div>
    </AppLayout>
  );
}
