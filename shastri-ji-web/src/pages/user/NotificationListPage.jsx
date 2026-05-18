import { useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNotificationStore } from '../../store';
import AppLayout from '../../components/layout/AppLayout';

dayjs.extend(relativeTime);

const KIND_ICONS = {
  BOOKING_REQUEST: '📋',
  BOOKING_ACCEPTED: '✅',
  BOOKING_REJECTED: '❌',
  BOOKING_CANCELLED: '🚫',
  BOOKING_SUGGESTED: '💬',
  BOOKING_RESPONDED: '↩️',
  BOOKING_COMPLETED: '🙏',
  GENERAL: '🔔',
};

function ShimmerRow() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl border border-border bg-surface animate-pulse">
      <div className="w-6 h-6 bg-surface-alt rounded flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-surface-alt rounded w-3/4" />
        <div className="h-3 bg-surface-alt rounded w-1/3" />
      </div>
    </div>
  );
}

export default function NotificationListPage() {
  const { items, isLoading, unreadCount, load, markRead, markAllRead } =
    useNotificationStore();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-5 py-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-heading text-2xl font-bold text-text-dark">
              Notifications
            </h1>
            <p className="text-text-light text-sm">
              Stay updated on your bookings
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="text-gold text-sm font-semibold hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>

        {isLoading && items.length === 0 ? (
          <div className="space-y-3">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <ShimmerRow key={i} />
              ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-2">🔔</div>
            <h3 className="font-heading text-lg text-text-dark">
              No notifications yet
            </h3>
            <p className="text-text-light text-sm">
              You'll see booking updates here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.is_read && markRead(n.id)}
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  n.is_read
                    ? 'bg-surface border-border opacity-70'
                    : 'bg-gold/5 border-gold/30 hover:bg-gold/10'
                }`}
              >
                <span className="text-xl flex-shrink-0">
                  {KIND_ICONS[n.kind] || '🔔'}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${
                      n.is_read
                        ? 'text-text-mid'
                        : 'font-semibold text-text-dark'
                    }`}
                  >
                    {n.title || n.message}
                  </p>
                  {n.title && n.message && n.title !== n.message && (
                    <p className="text-xs text-text-light mt-0.5">
                      {n.message}
                    </p>
                  )}
                  <p className="text-xs text-text-light mt-0.5">
                    {n.created_at ? dayjs(n.created_at).fromNow() : ''}
                  </p>
                </div>
                {!n.is_read && (
                  <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0 mt-1.5" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
