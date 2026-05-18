import { useEffect, useMemo, useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
} from 'lucide-react';
import TopNavbar from '../../components/layout/TopNavbar';
import { priestsApi, bookingsApi } from '../../api/services';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TIME_SLOTS = [
  { id: '06:00', label: '06:00 AM' },
  { id: '08:00', label: '08:00 AM' },
  { id: '10:00', label: '10:00 AM' },
  { id: '12:00', label: '12:00 PM' },
  { id: '14:00', label: '02:00 PM' },
  { id: '18:00', label: '06:00 PM' },
];

const DAY_LABELS_SUN_FIRST = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildMonthDays(currentMonth) {
  const firstOfMonth = currentMonth.startOf('month');
  // dayjs week defaults to Sunday-start, which matches the spec
  const calStart = firstOfMonth.startOf('week');
  const days = [];
  for (let i = 0; i < 42; i++) days.push(calStart.add(i, 'day'));
  return days;
}

const getPanditName = (p) => p?.name || 'Pandit';
const getPanditImage = (p) =>
  p?.profile_image || p?.profile_picture || null;
const getPanditRating = (p) => Number(p?.rating ?? 0);

// ─── Mini calendar ────────────────────────────────────────────────────────────

function MiniCalendar({ selectedDate, onSelect }) {
  const [currentMonth, setCurrentMonth] = useState(() => selectedDate);
  useEffect(() => {
    setCurrentMonth(selectedDate);
  }, [selectedDate]);

  const days = useMemo(() => buildMonthDays(currentMonth), [currentMonth]);
  const today = dayjs().startOf('day');

  return (
    <div className="bg-white border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setCurrentMonth((m) => m.subtract(1, 'month'))}
          aria-label="Previous month"
          className="w-8 h-8 rounded-full hover:bg-gold-bg flex items-center justify-center text-text-mid hover:text-gold"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="font-bold text-text-dark text-sm">
          {currentMonth.format('MMMM YYYY')}
        </span>
        <button
          type="button"
          onClick={() => setCurrentMonth((m) => m.add(1, 'month'))}
          aria-label="Next month"
          className="w-8 h-8 rounded-full hover:bg-gold-bg flex items-center justify-center text-text-mid hover:text-gold"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {DAY_LABELS_SUN_FIRST.map((d) => (
          <div
            key={d}
            className="text-[10px] text-text-light font-semibold py-1"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const inMonth = day.month() === currentMonth.month();
          const isPast = day.isBefore(today, 'day');
          const isToday = day.isSame(today, 'day');
          const isSelected = day.isSame(selectedDate, 'day');

          if (!inMonth) {
            return (
              <div key={day.format('YYYY-MM-DD')} className="h-10" />
            );
          }

          if (isPast) {
            return (
              <div
                key={day.format('YYYY-MM-DD')}
                className="h-10 flex items-center justify-center text-xs text-text-light/40 line-through"
                aria-disabled="true"
              >
                {day.date()}
              </div>
            );
          }

          let cls;
          if (isSelected) cls = 'bg-gold text-white font-bold';
          else if (isToday)
            cls =
              'border-2 border-gold text-gold font-bold hover:bg-gold-bg';
          else cls = 'text-text-dark hover:bg-gold-bg';

          return (
            <button
              key={day.format('YYYY-MM-DD')}
              type="button"
              onClick={() => {
                onSelect(day);
                setCurrentMonth(day);
              }}
              className={`h-10 rounded-full text-xs transition-all ${cls}`}
            >
              {day.date()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Time slots ───────────────────────────────────────────────────────────────

function TimeSlotsGrid({ unavailable, selectedSlot, onSelectSlot }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {TIME_SLOTS.map((s) => {
        const isUnavailable = unavailable.includes(s.id);
        const isSelected = selectedSlot === s.id;

        if (isUnavailable) {
          return (
            <button
              key={s.id}
              type="button"
              onClick={() =>
                toast.error(
                  'This time slot is no longer available. Please select a different time.'
                )
              }
              className="rounded-xl border border-border bg-gray-100 text-text-light/60 text-sm py-3 px-2 cursor-not-allowed line-through flex items-center justify-center gap-1"
            >
              <span aria-hidden>×</span>
              {s.label}
              <span aria-hidden>×</span>
            </button>
          );
        }

        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelectSlot(s.id)}
            className={`rounded-xl border text-sm py-3 px-2 transition-all ${
              isSelected
                ? 'bg-gold text-white border-gold font-semibold shadow-md shadow-gold/20'
                : 'bg-white text-text-dark border-border hover:border-gold'
            }`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Summary card ─────────────────────────────────────────────────────────────

function SummaryCard({ pandit, ritualName, price, selectedDate }) {
  const initial = getPanditName(pandit).charAt(0).toUpperCase();
  const img = getPanditImage(pandit);
  return (
    <div className="bg-white border-2 border-gold/40 rounded-2xl p-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 relative overflow-hidden flex items-center justify-center flex-shrink-0">
          <span className="font-bold text-gold">{initial}</span>
          {img && (
            <img
              src={img}
              alt={getPanditName(pandit)}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-text-dark text-sm truncate">
            {getPanditName(pandit)}
          </p>
          <div className="flex items-center gap-1 text-xs text-text-light">
            <Star size={11} className="fill-gold text-gold" />
            {getPanditRating(pandit).toFixed(1)}
          </div>
          {ritualName && (
            <p className="text-xs text-text-mid truncate mt-0.5">
              {ritualName}
            </p>
          )}
        </div>
        {price > 0 && (
          <p className="text-gold font-bold flex-shrink-0">
            ₹{price.toLocaleString('en-IN')}
          </p>
        )}
      </div>
      {selectedDate && (
        <div className="mt-3 inline-flex items-center gap-1.5 bg-gold-bg text-gold text-xs font-semibold px-3 py-1 rounded-full border border-gold/30">
          📅 {selectedDate.format('DD MMM, dddd')}
        </div>
      )}
    </div>
  );
}

// ─── Sticky submit bar ────────────────────────────────────────────────────────

function SubmitBar({ onSubmit, disabled, loading }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-30">
      <div className="max-w-3xl mx-auto px-6 py-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || loading}
          className="w-full bg-gold text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-gold/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending…' : 'Request Booking'}
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function RequestBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const variantId = params.get('variantId');
  const ritualId = params.get('ritualId');
  const ritualName = params.get('ritualName') || '';
  const priceFromUrl = Number(params.get('price') || 0);

  const [pandit, setPandit] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() =>
    dayjs().add(1, 'day').startOf('day')
  );
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [address, setAddress] = useState('');
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Load pandit info + verify the priest actually offers this variant.
  // - 403/404 on the priest detail call → priest profile is gone, bounce.
  // - Priest offerings list comes back non-empty AND our variantId isn't
  //   in it → incompatible combo, bounce.
  // - Offerings list empty/missing → stay permissive; backend will still
  //   reject mismatches on submit.
  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      priestsApi.detail(id),
      priestsApi.variants(id),
    ]).then(([detailRes, variantsRes]) => {
      if (cancelled) return;

      if (detailRes.status === 'rejected') {
        const status = detailRes.reason?.response?.status;
        if (status === 403 || status === 404) {
          toast.error('This pandit profile is not available.');
          navigate(-1);
          return;
        }
        // Other errors: leave summary card as fallback placeholder
      } else {
        setPandit(detailRes.value);
      }

      if (!variantId) return;
      const vRes =
        variantsRes.status === 'fulfilled' ? variantsRes.value : null;
      const list = Array.isArray(vRes) ? vRes : vRes?.results ?? [];
      if (!Array.isArray(list) || list.length === 0) return;

      const target = String(variantId);
      const match = list.find((v) => String(v?.id) === target);
      if (!match) {
        toast.error('This pandit does not offer this ritual variant');
        navigate(-1);
        return;
      }
      setSelectedVariant(match);
    });
    return () => {
      cancelled = true;
    };
  }, [id, variantId, navigate]);

  // Load availability whenever selectedDate changes
  useEffect(() => {
    let cancelled = false;
    setSelectedSlot(null);
    setUnavailableSlots([]);
    priestsApi
      .availability(id, selectedDate.format('YYYY-MM-DD'))
      .then((data) => {
        if (cancelled) return;
        // Tolerate several response shapes:
        // - { unavailable: ['08:00', ...] }
        // - { slots: [{ time: '08:00', available: false }, ...] }
        // - array of unavailable strings
        let unavail = [];
        if (Array.isArray(data?.unavailable)) {
          unavail = data.unavailable.map(String);
        } else if (Array.isArray(data?.slots)) {
          unavail = data.slots
            .filter((s) => s.available === false)
            .map((s) => String(s.time || s.id || s.slot));
        } else if (Array.isArray(data)) {
          // assume array of unavailable times
          unavail = data.map(String);
        }
        setUnavailableSlots(unavail);
      })
      .catch(() => {
        // silent — assume all slots available
      });
    return () => {
      cancelled = true;
    };
  }, [id, selectedDate]);

  const canSubmit = !!selectedDate && !!selectedSlot && address.trim().length > 0;

  const handleSubmit = async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }
    if (!address.trim()) {
      toast.error('Please enter your address');
      return;
    }
    setSubmitting(true);
    try {
      const data = await bookingsApi.create({
        priest_id: Number(id),
        ritual_id: ritualId ? Number(ritualId) : undefined,
        ritual_variant_id: variantId ? Number(variantId) : undefined,
        selected_date: selectedDate.format('YYYY-MM-DD'),
        selected_time: selectedSlot,
        address: address.trim(),
      });
      const bookingId = data?.id;
      toast.success('Booking request sent! 🙏');
      navigate('/booking-confirmation', {
        state: {
          bookingId,
          ritualName,
          panditName: getPanditName(pandit),
          date: selectedDate.format('YYYY-MM-DD'),
          time: selectedSlot,
          price: priceFromUrl,
        },
      });
    } catch (err) {
      console.log('Booking error:', err.response?.data);
      const data = err?.response?.data;

      // Specific case: backend rejects the priest+variant combo via
      // non_field_errors. Route the user back to pick a different option.
      const nonFieldErr = data?.non_field_errors?.[0];
      if (
        typeof nonFieldErr === 'string' &&
        (nonFieldErr.includes('does not offer') ||
          nonFieldErr.includes('ritual variant'))
      ) {
        toast.error(
          'This pandit is not available for this ritual. Please choose a different pandit or ritual.'
        );
        setTimeout(() => navigate(-1), 1500);
        return;
      }

      // Surface field-level Django REST errors when present
      const fieldErrors =
        data && typeof data === 'object'
          ? Object.entries(data)
              .map(([k, v]) =>
                Array.isArray(v) ? `${k}: ${v.join(', ')}` : `${k}: ${v}`
              )
              .join(' | ')
          : null;
      toast.error(
        data?.message || data?.detail || fieldErrors || err?.message || 'Booking failed'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg pb-24">
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
        <span className="text-text-dark font-medium">Request Booking</span>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-5">
        <h1 className="font-heading text-2xl font-bold text-text-dark">
          Request Booking
        </h1>

        <SummaryCard
          pandit={pandit}
          ritualName={ritualName}
          price={priceFromUrl}
          selectedDate={selectedDate}
        />

        <section>
          <h2 className="font-heading text-lg font-bold text-text-dark mb-3">
            Select Date &amp; Time
          </h2>
          <MiniCalendar
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />
        </section>

        <section>
          <h3 className="font-bold text-text-dark text-sm mb-2">
            Available Time Slots
          </h3>
          <TimeSlotsGrid
            unavailable={unavailableSlots}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
          />
        </section>

        <section>
          <h3 className="font-bold text-text-dark text-sm mb-2">
            Enter Address
          </h3>
          <div className="relative">
            <MapPin
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gold pointer-events-none"
            />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-text-dark placeholder-text-light focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
            />
          </div>
        </section>
      </div>

      <SubmitBar
        onSubmit={handleSubmit}
        disabled={!canSubmit}
        loading={submitting}
      />
    </div>
  );
}
