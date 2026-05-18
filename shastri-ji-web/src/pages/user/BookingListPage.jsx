import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  MapPin,
  MoreVertical,
  RefreshCw,
  HeadphonesIcon,
  Lock,
  ShieldCheck,
  Phone,
} from 'lucide-react';
import TopNavbar from '../../components/layout/TopNavbar';
import { bookingsApi } from '../../api/services';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PAGE_SIZE = 5;

const FILTER_OPTIONS = [
  { id: 'all', label: 'All Bookings' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

const SORT_OPTIONS = [
  { id: 'upcoming', label: 'Upcoming First' },
  { id: 'latest', label: 'Latest First' },
  { id: 'oldest', label: 'Oldest First' },
];

const FOOTER_FEATURES = [
  { Icon: HeadphonesIcon, title: 'Need Help?', subtitle: 'Our support team is here to assist you.' },
  { Icon: CalendarDays, title: 'Easy Reschedule', subtitle: 'Reschedule your booking at your convenience.' },
  { Icon: Lock, title: 'Secure Payments', subtitle: '100% secure payments and easy refunds.' },
  { Icon: ShieldCheck, title: 'Verified Pandits', subtitle: 'All pandits are verified and experienced.' },
  { Icon: Phone, title: '24/7 Support', subtitle: 'We are here to help you anytime.' },
];

// Field-shape tolerant accessors
const getRitualName = (b) =>
  b?.ritual?.name || b?.ritual_name || b?.ritual_title || 'Ritual Booking';
const getPriest = (b) => b?.priest || {};
const getPriestName = (b) =>
  getPriest(b).name || b?.priest_name || 'Pandit';
const getPriestRating = (b) =>
  Number(getPriest(b).rating ?? b?.priest_rating ?? 0);
const getPriestReviews = (b) =>
  Number(getPriest(b).total_reviews ?? getPriest(b).review_count ?? b?.priest_reviews ?? 0);
const getPriestExp = (b) =>
  Number(getPriest(b).experience_years ?? b?.priest_experience ?? 0);
const getPriestImage = (b) =>
  getPriest(b).profile_image || getPriest(b).profile_picture || null;
const getDate = (b) => b?.date || b?.selected_date || b?.booking_date;
const getTime = (b) => b?.time || b?.selected_time || b?.booking_time;
const getLocation = (b) => b?.location || b?.city || b?.address || '';
const getPrice = (b) =>
  Number(b?.proposed_price ?? b?.final_price ?? b?.price ?? 0);
const getPaymentStatus = (b) => b?.payment_status || b?.payment || 'PENDING';

function statusInfo(rawStatus) {
  const upper = (rawStatus || '').toUpperCase();
  if (upper === 'PENDING' || upper === 'ACCEPTED') {
    return {
      bucket: 'upcoming',
      label: 'Upcoming',
      cls: 'bg-blue-50 text-blue-600 border-blue-200',
    };
  }
  if (upper === 'COMPLETED') {
    return {
      bucket: 'completed',
      label: 'Completed',
      cls: 'bg-green-50 text-green-600 border-green-200',
    };
  }
  if (upper === 'CANCELLED' || upper === 'REJECTED' || upper === 'EXPIRED') {
    return {
      bucket: 'cancelled',
      label: 'Cancelled',
      cls: 'bg-red-50 text-red-500 border-red-200',
    };
  }
  if (upper === 'COUNTER_OFFERED' || upper === 'COUNTER_OFFER') {
    return {
      bucket: 'upcoming',
      label: 'Pending',
      cls: 'bg-amber-50 text-amber-600 border-amber-200',
    };
  }
  return {
    bucket: 'upcoming',
    label: upper ? upper.toLowerCase().replace(/_/g, ' ') : 'Pending',
    cls: 'bg-gray-50 text-gray-600 border-gray-200',
  };
}

function paymentInfo(rawStatus) {
  const upper = (rawStatus || 'PENDING').toUpperCase();
  if (upper === 'PAID')
    return { icon: '✅', label: 'Payment: Paid', cls: 'text-green-600' };
  if (upper === 'REFUNDED')
    return { icon: '❌', label: 'Payment: Refunded', cls: 'text-red-400' };
  return { icon: '🔴', label: 'Payment: Pending', cls: 'text-red-500' };
}

// ─── Hero banner ──────────────────────────────────────────────────────────────

function HeroBanner() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: '160px',
        background:
          'linear-gradient(135deg, #FEF3C7 0%, #FDF6E3 60%, #FEF9F0 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-12 py-8 h-full flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-text-dark">
            My Bookings
          </h1>
          <p className="text-text-light text-sm mt-1">
            Track and manage all your ritual bookings in one place.
          </p>
        </div>
      </div>
      <div
        className="absolute right-0 top-0 h-full hidden md:block"
        style={{ width: '45%' }}
      >
        <img
          src="/bookings-hero.webp"
          alt="My Bookings"
          className="w-full h-full object-contain object-right-bottom"
          style={{ mixBlendMode: 'multiply' }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    </section>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function FilterSidebar({
  status,
  onStatusChange,
  counts,
  ritualTypes,
  selectedRitual,
  onRitualChange,
  fromDate,
  onFromChange,
  toDate,
  onToChange,
  onClearAll,
}) {
  return (
    <aside className="w-56 flex-shrink-0 hidden lg:block">
      <div className="bg-white border border-border rounded-xl p-4 sticky top-20">
        <h2 className="font-semibold text-base text-text-dark mb-3">
          Booking Filters
        </h2>

        <div className="space-y-1">
          {FILTER_OPTIONS.map((f) => {
            const active = status === f.id;
            const showCount = f.id !== 'all';
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onStatusChange(f.id)}
                className={`w-full rounded-lg px-3 py-2 text-sm flex justify-between items-center transition-colors ${
                  active
                    ? 'bg-gold/10 text-gold border border-gold font-semibold'
                    : 'hover:bg-amber-50 text-text-dark border border-transparent'
                }`}
              >
                <span>{f.label}</span>
                {showCount && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      active
                        ? 'bg-gold/20 text-gold'
                        : 'bg-gray-100 text-text-mid'
                    }`}
                  >
                    {counts[f.id] ?? 0}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <p className="text-xs text-text-light font-medium mb-1">Ritual Type</p>
          <div className="relative">
            <select
              value={selectedRitual}
              onChange={(e) => onRitualChange(e.target.value)}
              className="w-full appearance-none border border-border rounded-lg px-3 pr-8 py-2 text-sm text-text-dark focus:outline-none focus:border-gold cursor-pointer bg-white"
            >
              <option value="">All Rituals</option>
              {ritualTypes.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-mid pointer-events-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs text-text-light font-medium mb-1">Date Range</p>
          <div className="space-y-2">
            <div className="relative">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => onFromChange(e.target.value)}
                placeholder="From"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm text-text-dark focus:outline-none focus:border-gold"
              />
            </div>
            <div className="relative">
              <input
                type="date"
                value={toDate}
                onChange={(e) => onToChange(e.target.value)}
                placeholder="To"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm text-text-dark focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className="mt-4 w-full border-2 border-gold text-gold rounded-lg py-2 text-sm font-semibold hover:bg-gold hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={14} />
          Clear Filters
        </button>
      </div>
    </aside>
  );
}

// ─── Booking row ──────────────────────────────────────────────────────────────

function RitualMandalaIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-full h-full opacity-50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        transform="translate(32,32)"
        fill="none"
        stroke="#F4A623"
        strokeWidth="0.8"
      >
        <circle r="6" />
        <circle r="14" />
        <circle r="22" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <line x1="0" y1="6" x2="0" y2="22" />
            <ellipse cx="0" cy="14" rx="2" ry="4" />
          </g>
        ))}
      </g>
    </svg>
  );
}

function BookingRow({ b }) {
  const status = statusInfo(b.status);
  const payment = paymentInfo(getPaymentStatus(b));
  const ritualName = getRitualName(b);
  const priestName = getPriestName(b);
  const priestRating = getPriestRating(b);
  const priestReviews = getPriestReviews(b);
  const priestExp = getPriestExp(b);
  const priestImg = getPriestImage(b);
  const initial = priestName?.charAt(0)?.toUpperCase() || 'P';
  const date = getDate(b);
  const time = getTime(b);
  const loc = getLocation(b);
  const price = getPrice(b);

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm p-4 flex items-center gap-4 flex-wrap lg:flex-nowrap">
      {/* Ritual icon */}
      <div className="w-16 h-16 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
        <RitualMandalaIcon />
      </div>

      {/* Ritual info */}
      <div className="w-48 flex-shrink-0 min-w-0">
        <h3 className="font-semibold text-base text-text-dark truncate">
          {ritualName}
        </h3>
        <p className="text-xs text-text-light">Booking ID: #SJ{b.id}</p>
        <span
          className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full border ${status.cls}`}
        >
          {status.label}
        </span>
      </div>

      {/* Date & time */}
      <div className="w-44 flex-shrink-0 flex items-start gap-2 text-text-dark">
        <CalendarDays size={14} className="text-gold flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-sm font-medium">
            {date ? dayjs(date).format('DD MMM YYYY, dddd') : '—'}
          </p>
          {time && (
            <p className="text-xs text-text-light">{time}</p>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="w-40 flex-shrink-0 flex items-start gap-2 text-text-dark">
        <MapPin size={14} className="text-gold flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-sm truncate">{loc || 'At Home'}</p>
          {loc && <p className="text-xs text-text-light">At Home</p>}
        </div>
      </div>

      {/* Pandit info */}
      <div className="w-44 flex-shrink-0 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
          <span className="text-amber-600 font-bold">{initial}</span>
          {priestImg && (
            <img
              src={priestImg}
              alt={priestName}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{priestName}</p>
          <p className="text-xs text-amber-500">
            ★ {priestRating.toFixed(1)} ({priestReviews})
          </p>
          {priestExp > 0 && (
            <p className="text-xs text-text-light">{priestExp}+ Years Exp.</p>
          )}
        </div>
      </div>

      {/* Price + actions */}
      <div className="ml-auto flex flex-col items-end gap-2 flex-shrink-0">
        <span className="font-bold text-base text-text-dark">
          {price > 0 ? `₹${price.toLocaleString('en-IN')}` : '—'}
        </span>
        <span className={`text-xs ${payment.cls}`}>
          {payment.icon} {payment.label}
        </span>
        <div className="flex items-center gap-2">
          <Link
            to={`/bookings/${b.id}`}
            className="border-2 border-gold text-gold text-xs px-4 py-1.5 rounded-lg hover:bg-gold hover:text-white transition-all font-semibold"
          >
            View Details
          </Link>
          <button
            type="button"
            className="w-8 h-8 rounded-full text-text-mid hover:bg-gray-100 flex items-center justify-center transition-colors"
            aria-label="More options"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function RowShimmer() {
  return (
    <div className="bg-white rounded-xl border border-border shadow-sm p-4 flex items-center gap-4 animate-pulse">
      <div className="w-16 h-16 rounded-xl bg-amber-50 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-surface-alt rounded w-1/3" />
        <div className="h-3 bg-surface-alt rounded w-1/4" />
        <div className="h-3 bg-surface-alt rounded w-1/2" />
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-border text-text-mid hover:border-gold hover:text-gold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Previous"
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold transition-all ${
            p === page
              ? 'bg-gold text-white'
              : 'border border-border text-text-dark hover:border-gold hover:text-gold'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-border text-text-mid hover:border-gold hover:text-gold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Next"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ─── Bottom features bar ──────────────────────────────────────────────────────

function BottomFeaturesBar() {
  return (
    <section className="bg-white border-t border-border mt-8">
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {FOOTER_FEATURES.map(({ Icon, title, subtitle }) => (
          <div key={title} className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gold-bg rounded-full flex items-center justify-center flex-shrink-0">
              <Icon size={18} className="text-gold" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-text-dark leading-tight">
                {title}
              </p>
              <p className="text-xs text-text-light leading-tight mt-0.5">
                {subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BookingListPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('all');
  const [ritualFilter, setRitualFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sortBy, setSortBy] = useState('upcoming');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    bookingsApi
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

  const counts = useMemo(() => {
    const c = { upcoming: 0, completed: 0, cancelled: 0 };
    bookings.forEach((b) => {
      const bucket = statusInfo(b.status).bucket;
      if (c[bucket] != null) c[bucket] += 1;
    });
    return c;
  }, [bookings]);

  const ritualTypes = useMemo(() => {
    const set = new Set();
    bookings.forEach((b) => {
      const name = getRitualName(b);
      if (name && name !== 'Ritual Booking') set.add(name);
    });
    return Array.from(set);
  }, [bookings]);

  const filtered = useMemo(() => {
    let out = bookings.filter((b) => {
      // Status bucket
      if (statusFilter !== 'all') {
        if (statusInfo(b.status).bucket !== statusFilter) return false;
      }
      // Ritual type
      if (ritualFilter && getRitualName(b) !== ritualFilter) return false;
      // Date range (compares against booking date)
      const d = getDate(b);
      if (d) {
        if (fromDate && dayjs(d).isBefore(dayjs(fromDate), 'day')) return false;
        if (toDate && dayjs(d).isAfter(dayjs(toDate), 'day')) return false;
      }
      return true;
    });

    const cmp = {
      upcoming: (a, b) => {
        const da = dayjs(getDate(a) || 0).valueOf();
        const db = dayjs(getDate(b) || 0).valueOf();
        return da - db;
      },
      latest: (a, b) =>
        dayjs(b.created_at || getDate(b) || 0).valueOf() -
        dayjs(a.created_at || getDate(a) || 0).valueOf(),
      oldest: (a, b) =>
        dayjs(a.created_at || getDate(a) || 0).valueOf() -
        dayjs(b.created_at || getDate(b) || 0).valueOf(),
    }[sortBy];
    if (cmp) out = [...out].sort(cmp);

    return out;
  }, [bookings, statusFilter, ritualFilter, fromDate, toDate, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, ritualFilter, fromDate, toDate, sortBy]);

  const handleClearAll = () => {
    setStatusFilter('all');
    setRitualFilter('');
    setFromDate('');
    setToDate('');
    setSortBy('upcoming');
  };

  return (
    <div className="min-h-screen bg-bg">
      <TopNavbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-3 text-sm text-text-light">
        <Link to="/home" className="hover:text-gold transition-colors">
          Home
        </Link>{' '}
        <span className="text-text-light/60">›</span>{' '}
        <span className="text-text-dark font-medium">My Bookings</span>
      </div>

      <HeroBanner />

      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
        <FilterSidebar
          status={statusFilter}
          onStatusChange={setStatusFilter}
          counts={counts}
          ritualTypes={ritualTypes}
          selectedRitual={ritualFilter}
          onRitualChange={setRitualFilter}
          fromDate={fromDate}
          onFromChange={setFromDate}
          toDate={toDate}
          onToChange={setToDate}
          onClearAll={handleClearAll}
        />

        <main className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <p className="font-semibold text-sm text-text-dark">
              Total Bookings: {filtered.length}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-text-light">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-border rounded-lg pl-3 pr-8 py-1.5 text-sm text-text-dark focus:outline-none focus:border-gold cursor-pointer"
                >
                  {SORT_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-text-mid pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* List */}
          {loading ? (
            <div className="space-y-3">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <RowShimmer key={i} />
                ))}
            </div>
          ) : paged.length === 0 ? (
            <div className="bg-white border border-border rounded-xl text-center py-16">
              <div className="text-5xl mb-2">🛕</div>
              <h3 className="font-heading text-lg text-text-dark">
                No bookings match your filters
              </h3>
              <p className="text-text-light text-sm mt-1">
                Try clearing filters or book a new ritual.
              </p>
              <Link
                to="/rituals"
                className="inline-block mt-4 bg-gold text-white font-semibold rounded-xl px-6 py-2.5 text-sm hover:shadow-lg hover:shadow-gold/30 transition-all"
              >
                Explore Rituals
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {paged.map((b) => (
                <BookingRow key={b.id} b={b} />
              ))}
            </div>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </main>
      </div>

      <BottomFeaturesBar />
    </div>
  );
}
