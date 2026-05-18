import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  ArrowLeft,
  Ticket,
  User,
  Calendar,
  Clock,
  MapPin,
  Timer,
  Send,
} from 'lucide-react';
import TopNavbar from '../../components/layout/TopNavbar';
import { bookingsApi } from '../../api/services';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getRitualName = (b) =>
  b?.ritual?.name || b?.ritual_name || b?.ritual_title || 'Ritual Booking';
const getVariantSubtitle = (b) =>
  b?.variant?.tradition_name ||
  b?.variant?.name ||
  b?.tradition_name ||
  b?.priest_variant?.tradition_name ||
  '';
const getPanditName = (b) =>
  b?.priest?.name || b?.priest_name || b?.pandit_name || 'Pandit';
const getDate = (b) => b?.date || b?.selected_date || b?.booking_date;
const getTime = (b) => b?.time || b?.selected_time || b?.booking_time;
const getAddress = (b) => b?.address || b?.location || '';
const getAmount = (b) =>
  Number(b?.proposed_price ?? b?.final_price ?? b?.price ?? 0);

function statusInfo(status) {
  const upper = (status || '').toUpperCase();
  if (upper === 'PENDING' || upper === 'COUNTER_OFFERED' || upper === 'COUNTER_OFFER')
    return {
      label: 'Pending',
      cls: 'bg-gold-bg text-gold border-gold/30',
      bucket: 'pending',
    };
  if (upper === 'ACCEPTED' || upper === 'CONFIRMED' || upper === 'COMPLETED')
    return {
      label: upper === 'COMPLETED' ? 'Completed' : 'Confirmed',
      cls: 'bg-green-50 text-green-700 border-green-200',
      bucket: 'confirmed',
    };
  if (['CANCELLED', 'REJECTED', 'EXPIRED'].includes(upper))
    return {
      label: upper === 'EXPIRED' ? 'Expired' : 'Cancelled',
      cls: 'bg-red-50 text-red-700 border-red-200',
      bucket: 'cancelled',
    };
  return {
    label: 'Pending',
    cls: 'bg-gold-bg text-gold border-gold/30',
    bucket: 'pending',
  };
}

// ─── Detail rows ──────────────────────────────────────────────────────────────

function DetailRow({ Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-b-0">
      <div className="w-9 h-9 rounded-full bg-gold-bg flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-gold" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text-light">{label}</p>
        <p className="text-sm font-medium text-text-dark mt-0.5 break-words">
          {value || '—'}
        </p>
      </div>
    </div>
  );
}

// ─── Status banner ────────────────────────────────────────────────────────────

function PendingBanner() {
  return (
    <section className="bg-gold-bg border border-gold/30 rounded-2xl p-4 mt-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
        <Timer size={18} className="text-white" />
      </div>
      <p className="text-sm text-text-dark">
        Waiting for pandit to confirm your booking.
      </p>
    </section>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

const TIMELINE_DEFAULTS = ['REQUEST_SENT'];

function timelineIcon(eventType) {
  const upper = (eventType || '').toUpperCase();
  if (upper === 'REQUEST_SENT') return Send;
  if (upper === 'ACCEPTED' || upper === 'CONFIRMED') return Calendar;
  if (upper === 'COMPLETED') return Calendar;
  return Send;
}

function humaniseEvent(eventType) {
  if (!eventType) return 'Update';
  return eventType
    .toString()
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function TimelineCard({ events, fallbackDate }) {
  const list =
    Array.isArray(events) && events.length > 0
      ? events
      : TIMELINE_DEFAULTS.map((t) => ({
          event_type: t,
          message: 'Your booking request has been sent to the pandit.',
          created_at: fallbackDate,
        }));
  return (
    <section className="bg-white border border-border rounded-2xl p-5 mt-4">
      <h2 className="font-heading font-bold text-text-dark mb-4">
        Booking Timeline
      </h2>
      <div className="space-y-4">
        {list.map((e, i) => {
          const Icon = timelineIcon(e.event_type);
          return (
            <div key={i} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center flex-shrink-0 shadow-sm shadow-gold/30">
                <Icon size={14} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-dark">
                  {humaniseEvent(e.event_type)}
                </p>
                {e.message && (
                  <p className="text-xs text-text-light mt-0.5">
                    {e.message}
                  </p>
                )}
                {e.created_at && (
                  <p className="text-xs text-text-light/70 mt-0.5">
                    {dayjs(e.created_at).format('DD MMM YYYY, h:mm A')}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Loading ──────────────────────────────────────────────────────────────────

function DetailShimmer() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-6 space-y-4 animate-pulse">
      <div className="h-7 w-1/3 bg-surface-alt rounded" />
      <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
        <div className="h-5 w-2/3 bg-surface-alt rounded" />
        <div className="h-3 w-1/3 bg-surface-alt rounded" />
        <div className="h-3 w-full bg-surface-alt rounded" />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    bookingsApi
      .detail(id)
      .then((data) => {
        if (!cancelled) setBooking(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Failed to load booking');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <TopNavbar />
        <DetailShimmer />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-bg">
        <TopNavbar />
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="text-6xl text-gold/30 mb-3">✦</div>
          <h2 className="font-heading text-xl font-bold text-text-dark">
            Could not load this booking
          </h2>
          <p className="text-text-light text-sm mt-1">
            {error || 'The booking may not exist or there was a network error.'}
          </p>
          <Link
            to="/bookings"
            className="inline-block mt-4 text-gold font-semibold hover:underline"
          >
            ← Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const status = statusInfo(booking.status);

  return (
    <div className="min-h-screen bg-bg">
      <TopNavbar />

      <div className="max-w-3xl mx-auto px-6 pt-3 flex items-center gap-3 text-sm text-text-light">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="text-text-mid hover:text-gold transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <Link to="/home" className="hover:text-gold transition-colors">
          Home
        </Link>{' '}
        <span className="text-text-light/60">›</span>{' '}
        <Link to="/bookings" className="hover:text-gold transition-colors">
          My Bookings
        </Link>{' '}
        <span className="text-text-light/60">›</span>{' '}
        <span className="text-text-dark font-medium">#{booking.id}</span>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6">
        <h1 className="font-heading text-2xl font-bold text-text-dark">
          Booking Detail
        </h1>

        <section className="bg-white border-2 border-gold/30 rounded-2xl p-5 mt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-heading text-xl font-bold text-text-dark">
                {getRitualName(booking)}
              </h2>
              {getVariantSubtitle(booking) && (
                <p className="text-sm text-text-light mt-0.5">
                  {getVariantSubtitle(booking)}
                </p>
              )}
            </div>
            <span
              className={`text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full border whitespace-nowrap ${status.cls}`}
            >
              {status.label}
            </span>
          </div>

          <div className="mt-2 divide-y divide-border">
            <DetailRow
              Icon={Ticket}
              label="Booking ID"
              value={`#${booking.id}`}
            />
            <DetailRow
              Icon={User}
              label="Pandit"
              value={getPanditName(booking)}
            />
            <DetailRow
              Icon={Calendar}
              label="Date"
              value={
                getDate(booking)
                  ? dayjs(getDate(booking)).format('DD MMM YYYY, dddd')
                  : null
              }
            />
            <DetailRow
              Icon={Clock}
              label="Time"
              value={getTime(booking)}
            />
            <DetailRow
              Icon={MapPin}
              label="Address"
              value={getAddress(booking)}
            />
          </div>

          {getAmount(booking) > 0 && (
            <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
              <span className="text-sm text-text-light">Amount</span>
              <span className="font-bold text-gold text-lg">
                ₹{getAmount(booking).toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </section>

        {status.bucket === 'pending' && <PendingBanner />}

        <TimelineCard
          events={booking.timeline}
          fallbackDate={booking.created_at}
        />
      </div>
    </div>
  );
}
