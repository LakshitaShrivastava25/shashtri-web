import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
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

const EVENT_ICONS = {
  REQUEST_SENT: '📤',
  VIEWED: '👁️',
  ACCEPTED: '✅',
  REJECTED: '❌',
  CANCELLED: '🚫',
  SUGGESTED: '💬',
  RESPONDED: '↩️',
  EXPIRED: '⏰',
  COMPLETED: '🙏',
};

function DetailShimmer() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-6 animate-pulse">
      <div className="h-4 w-16 bg-surface-alt rounded mb-4" />
      <div className="h-7 w-1/2 bg-surface-alt rounded mb-4" />
      <div className="h-40 bg-surface-alt rounded-2xl" />
    </div>
  );
}

export default function PriestBookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [showCounterForm, setShowCounterForm] = useState(false);
  const [proposedDate, setProposedDate] = useState('');
  const [proposedTime, setProposedTime] = useState('');
  const [message, setMessage] = useState('');

  const loadBooking = useCallback(async () => {
    try {
      const data = await priestBookingsApi.detail(id);
      setBooking(data);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || 'Failed to load booking'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    loadBooking();
  }, [loadBooking]);

  const handleAction = async (action) => {
    setActionLoading(true);
    try {
      await priestBookingsApi.action(
        id,
        action,
        action === 'suggest' ? proposedDate : undefined,
        action === 'suggest' ? proposedTime : undefined,
        message || undefined
      );
      if (action === 'accept') toast.success('Booking accepted! 🙏');
      else if (action === 'reject') toast.success('Booking declined');
      else if (action === 'suggest') toast.success('Counter offer sent!');
      setShowCounterForm(false);
      setProposedDate('');
      setProposedTime('');
      setMessage('');
      await loadBooking();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || 'Action failed'
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !booking) {
    return (
      <AppLayout>
        <DetailShimmer />
      </AppLayout>
    );
  }

  if (!booking) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-5 py-6 text-center">
          <div className="text-6xl text-gold/20 mb-2">ॐ</div>
          <h3 className="font-heading text-lg text-text-dark">
            Booking not found
          </h3>
          <button
            onClick={() => navigate(-1)}
            className="text-gold text-sm font-semibold hover:underline mt-3"
          >
            ← Back
          </button>
        </div>
      </AppLayout>
    );
  }

  const canSubmitSuggestion =
    proposedDate && proposedTime && !actionLoading;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-5 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-text-light hover:text-gold transition-colors text-sm mb-4"
        >
          ← Back
        </button>

        <h1 className="font-heading text-2xl font-bold text-text-dark mb-4">
          Booking Details
        </h1>

        <div className="bg-surface border border-border rounded-2xl p-5 mb-4">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="min-w-0">
              <h2 className="font-heading text-xl font-bold text-text-dark truncate">
                {booking.ritual_name}
              </h2>
              <p className="text-text-light text-sm mt-0.5">
                from {booking.user_name}
              </p>
            </div>
            <StatusPill status={booking.status} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gold-bg rounded-xl p-3">
              <p className="text-xs text-text-light">Date</p>
              <p className="font-semibold text-sm text-text-dark">
                {booking.selected_date
                  ? dayjs(booking.selected_date).format('D MMMM YYYY')
                  : '—'}
              </p>
            </div>
            <div className="bg-gold-bg rounded-xl p-3">
              <p className="text-xs text-text-light">Time</p>
              <p className="font-semibold text-sm text-text-dark">
                {booking.selected_time || '—'}
              </p>
            </div>
          </div>

          {booking.address && (
            <p className="text-xs text-text-mid mt-3 flex items-start gap-1.5">
              <span>📍</span>
              {booking.address}
            </p>
          )}
        </div>

        {booking.status === 'PENDING' && (
          <div className="bg-surface border border-border rounded-2xl p-5 mb-4">
            <h3 className="font-heading text-base font-bold text-text-dark mb-4">
              Respond to Request
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                type="button"
                onClick={() => handleAction('accept')}
                disabled={actionLoading}
                className="bg-gold text-white font-semibold rounded-xl py-3 text-sm hover:shadow-md hover:shadow-gold/30 transition-all disabled:opacity-60"
              >
                ✓ Accept
              </button>
              <button
                type="button"
                onClick={() => handleAction('reject')}
                disabled={actionLoading}
                className="border-2 border-red-200 text-red-600 font-semibold rounded-xl py-3 text-sm hover:bg-red-50 transition-all disabled:opacity-60"
              >
                ✗ Decline
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowCounterForm(!showCounterForm)}
              className="w-full border-2 border-gold/40 text-gold font-semibold rounded-xl py-2.5 text-sm hover:bg-gold-bg transition-all"
            >
              💬 Suggest Different Time
            </button>

            {showCounterForm && (
              <div className="mt-4 space-y-3 border-t border-border pt-4">
                <div>
                  <label className="block text-sm font-medium text-text-mid mb-1.5">
                    Proposed Date
                  </label>
                  <input
                    type="date"
                    value={proposedDate}
                    onChange={(e) => setProposedDate(e.target.value)}
                    className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text-dark focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-mid mb-1.5">
                    Proposed Time
                  </label>
                  <input
                    type="time"
                    value={proposedTime}
                    onChange={(e) => setProposedTime(e.target.value)}
                    className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text-dark focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-mid mb-1.5">
                    Message (optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={2}
                    placeholder="Reason for suggesting a new time…"
                    className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text-dark placeholder-text-light focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 resize-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAction('suggest')}
                  disabled={!canSubmitSuggestion}
                  className="w-full bg-gold text-white font-semibold rounded-xl py-2.5 text-sm hover:shadow-md transition-all disabled:opacity-60"
                >
                  Send Counter Offer
                </button>
              </div>
            )}
          </div>
        )}

        {Array.isArray(booking.timeline) && booking.timeline.length > 0 && (
          <div className="bg-surface border border-border rounded-2xl p-5">
            <h3 className="font-heading text-base font-bold text-text-dark mb-4">
              Timeline
            </h3>
            <div className="space-y-3">
              {booking.timeline.map((event, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">
                    {EVENT_ICONS[event.event_type] || '•'}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-dark">
                      {event.event_type?.replace(/_/g, ' ')}
                    </p>
                    {event.message && (
                      <p className="text-xs text-text-light italic">
                        {event.message}
                      </p>
                    )}
                    <p className="text-xs text-text-light mt-0.5">
                      {event.created_at
                        ? dayjs(event.created_at).format('D MMM, h:mm A')
                        : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
