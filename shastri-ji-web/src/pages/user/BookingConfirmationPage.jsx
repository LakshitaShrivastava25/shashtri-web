import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { CheckCircle, Calendar, Timer, ChevronRight } from 'lucide-react';
import TopNavbar from '../../components/layout/TopNavbar';
import { bookingsApi } from '../../api/services';

// ─── Timeline ─────────────────────────────────────────────────────────────────

function StepRow({ Icon, title, active, last }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="flex flex-col items-center">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
            active
              ? 'bg-gold text-white shadow-md shadow-gold/30'
              : 'bg-gold-bg text-gold/50 border-2 border-gold/30'
          }`}
        >
          <Icon size={16} />
        </div>
        {!last && (
          <div
            className={`w-0.5 h-8 ${active ? 'bg-gold/40' : 'bg-border'}`}
          />
        )}
      </div>
      <div className="pt-1.5">
        <p
          className={`text-sm font-semibold ${
            active ? 'text-text-dark' : 'text-text-light'
          }`}
        >
          {title}
        </p>
      </div>
    </div>
  );
}

function ProgressTimeline() {
  return (
    <section className="bg-white border border-border rounded-2xl p-5 mt-6">
      <StepRow Icon={CheckCircle} title="Request Sent" active />
      <StepRow Icon={Timer} title="Awaiting Priest Confirmation" />
      <StepRow Icon={Calendar} title="Booking Confirmed" last />
    </section>
  );
}

// ─── Summary card ─────────────────────────────────────────────────────────────

function SummaryCard({ booking }) {
  const rows = [
    { label: 'Booking ID', value: `#${booking.id ?? '—'}` },
    { label: 'Ritual', value: booking.ritualName },
    { label: 'Pandit', value: booking.panditName },
    {
      label: 'Date',
      value: booking.date ? dayjs(booking.date).format('DD MMM YYYY') : null,
    },
    { label: 'Time', value: booking.time },
  ];
  return (
    <section className="bg-white border border-border rounded-2xl p-5 mt-4">
      <div className="space-y-3">
        {rows.map(
          (r) =>
            r.value && (
              <div
                key={r.label}
                className="flex justify-between items-center py-1"
              >
                <span className="text-sm text-text-light">{r.label}</span>
                <span className="text-sm font-medium text-text-dark text-right truncate ml-2">
                  {r.value}
                </span>
              </div>
            )
        )}
        {booking.price > 0 && (
          <div className="flex justify-between items-center py-1 border-t border-border pt-3">
            <span className="text-sm text-text-light">Amount</span>
            <span className="font-bold text-gold">
              ₹{Number(booking.price).toLocaleString('en-IN')}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center pt-1">
          <span className="text-sm text-text-light">Status</span>
          <span className="text-xs font-bold uppercase tracking-wide bg-gold-bg text-gold border border-gold/30 px-3 py-1 rounded-full">
            Pending
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BookingConfirmationPage() {
  const location = useLocation();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const initialBookingId =
    location.state?.bookingId || params.get('bookingId') || null;

  const [booking, setBooking] = useState({
    id: initialBookingId,
    ritualName: location.state?.ritualName || '',
    panditName: location.state?.panditName || '',
    date: location.state?.date || '',
    time: location.state?.time || '',
    price: location.state?.price || 0,
  });

  // If only the bookingId is known (e.g. user refreshed), fetch full details
  useEffect(() => {
    if (!initialBookingId) return;
    if (booking.ritualName && booking.panditName) return;
    let cancelled = false;
    bookingsApi
      .detail(initialBookingId)
      .then((data) => {
        if (cancelled || !data) return;
        setBooking((prev) => ({
          ...prev,
          ritualName:
            prev.ritualName ||
            data?.ritual?.name ||
            data?.ritual_name ||
            'Ritual Booking',
          panditName:
            prev.panditName ||
            data?.priest?.name ||
            data?.priest_name ||
            'Pandit',
          date:
            prev.date || data?.date || data?.selected_date || data?.booking_date || '',
          time:
            prev.time || data?.time || data?.selected_time || data?.booking_time || '',
          price:
            prev.price ||
            Number(data?.proposed_price ?? data?.final_price ?? data?.price ?? 0),
        }));
      })
      .catch(() => {
        // silent — page still renders with whatever state was passed
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialBookingId]);

  return (
    <div className="min-h-screen bg-bg">
      <TopNavbar />

      <div className="max-w-md mx-auto px-6 py-10 text-center">
        <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center mx-auto shadow-lg shadow-gold/30">
          <CheckCircle size={40} className="text-white" strokeWidth={2.5} />
        </div>

        <h1 className="font-heading text-3xl font-bold text-text-dark mt-5">
          Request Sent
        </h1>
        <p className="text-text-light text-sm mt-1">
          Waiting for priest response
        </p>

        <ProgressTimeline />

        <SummaryCard booking={booking} />

        <button
          type="button"
          onClick={() =>
            booking.id ? navigate(`/bookings/${booking.id}`) : navigate('/bookings')
          }
          className="w-full mt-6 bg-gold text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-gold/30 transition-all flex items-center justify-center gap-2"
        >
          Track Booking
          <ChevronRight size={16} />
        </button>

        <Link
          to="/home"
          className="inline-block mt-3 text-sm text-text-mid hover:text-gold transition-colors"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
