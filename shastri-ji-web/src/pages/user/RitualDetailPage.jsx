import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Clock,
  Star,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import TopNavbar from '../../components/layout/TopNavbar';
import { ritualsApi } from '../../api/services';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getName = (r) => r?.name || 'Ritual';
const getDescription = (r) =>
  r?.description ||
  'A sacred Hindu ritual performed by experienced pandits. Brings peace, prosperity and positivity to your home.';
const getImage = (r) => r?.image || r?.banner_image || null;
const getCategoryName = (r) =>
  r?.category?.name || r?.category_name || 'General';
const getDuration = (r) =>
  r?.duration_minutes ??
  (r?.duration_hours != null ? r.duration_hours * 60 : null);
const getRating = (r) => Number(r?.rating ?? 0);
const getReviews = (r) => Number(r?.total_reviews ?? r?.review_count ?? 0);
const getRitualPrice = (r) =>
  Number(r?.base_price ?? r?.final_price ?? r?.price ?? 0);

const getVariantName = (v) =>
  v?.tradition?.name || v?.tradition_name || v?.name || 'Variant';
const getVariantSubtitle = (v) =>
  v?.subtitle || v?.tradition?.description || v?.description || '';
const getVariantDuration = (v) =>
  v?.duration_minutes ??
  (v?.duration_hours != null ? v.duration_hours * 60 : null);
const getVariantPrice = (v) =>
  Number(v?.final_price ?? v?.price ?? v?.base_price ?? 0);

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroFallback({ name }) {
  const word = (name || '').split(' ')[0];
  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #F8EFE3 100%)',
      }}
    >
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full opacity-25"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          transform="translate(100,100)"
          fill="none"
          stroke="#F4A623"
          strokeWidth="0.7"
        >
          {[20, 40, 60, 80].map((r) => (
            <circle key={r} r={r} />
          ))}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <line x1="0" y1="20" x2="0" y2="80" />
              <ellipse cx="0" cy="35" rx="4" ry="8" />
              <ellipse cx="0" cy="65" rx="3" ry="5" />
            </g>
          ))}
        </g>
      </svg>
      <div className="relative text-center">
        <div className="text-6xl text-gold/40 mb-2">✦</div>
        {word && (
          <p className="text-gold/60 text-lg font-heading font-bold">{word}</p>
        )}
      </div>
    </div>
  );
}

function HeroImage() {
  return (
    <div className="relative w-full h-[420px] overflow-hidden">
      <img
        src="/ritual-hero.png"
        alt="Sacred Rituals, Divine Blessings"
        className="w-full h-full object-cover object-[center_20%]"
      />
    </div>
  );
}

// ─── Info card ────────────────────────────────────────────────────────────────

function PillBadge({ children, outlined }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
        outlined
          ? 'border border-border text-text-dark bg-white'
          : 'bg-gold-bg text-gold border border-gold/30'
      }`}
    >
      {children}
    </span>
  );
}

function RitualInfoCard({ ritual }) {
  const duration = getDuration(ritual);
  const rating = getRating(ritual);
  const reviews = getReviews(ritual);
  return (
    <section className="bg-white border border-border rounded-2xl shadow-sm p-6 -mt-12 relative z-10">
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-text-dark leading-tight">
        {getName(ritual)}
      </h1>
      <div className="flex flex-wrap gap-2 mt-3">
        <PillBadge outlined>{getCategoryName(ritual)}</PillBadge>
        {duration != null && (
          <PillBadge outlined>
            <Clock size={12} />
            {duration} min
          </PillBadge>
        )}
        {rating > 0 && (
          <PillBadge>
            <Star size={12} className="fill-gold text-gold" />
            {rating.toFixed(1)}
            {reviews > 0 && (
              <span className="text-text-light ml-1">({reviews})</span>
            )}
          </PillBadge>
        )}
      </div>
      <p className="text-text-mid text-sm leading-relaxed mt-4">
        {getDescription(ritual)}
      </p>
    </section>
  );
}

// ─── Tradition selector ───────────────────────────────────────────────────────

function TraditionCard({ v, selected, onSelect }) {
  const duration = getVariantDuration(v);
  return (
    <button
      type="button"
      onClick={() => onSelect(v)}
      className={`flex-shrink-0 w-64 text-left rounded-xl border-2 p-4 transition-all ${
        selected
          ? 'border-gold bg-gold/10'
          : 'border-border bg-white hover:border-gold/40'
      }`}
    >
      <p className="font-bold text-text-dark text-sm">{getVariantName(v)}</p>
      {getVariantSubtitle(v) && (
        <p className="text-xs text-text-light mt-1 line-clamp-2">
          {getVariantSubtitle(v)}
        </p>
      )}
      <div className="flex items-center justify-between mt-3">
        {duration != null ? (
          <span className="flex items-center gap-1 text-xs text-text-light">
            <Clock size={12} />
            {duration} min
          </span>
        ) : (
          <span />
        )}
        {getVariantPrice(v) > 0 && (
          <span className="text-gold text-sm font-bold">
            ₹{getVariantPrice(v).toLocaleString('en-IN')}
          </span>
        )}
      </div>
    </button>
  );
}

function SelectTraditionSection({
  variants,
  selectedVariantId,
  onSelectVariant,
}) {
  if (variants.length === 0) return null;
  return (
    <section id="select-tradition" className="mt-6 scroll-mt-20">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="font-heading text-lg font-bold text-text-dark">
          Select Tradition
        </h2>
        <span className="text-xs bg-gold-bg text-gold border border-gold/30 px-2 py-0.5 rounded-full font-semibold">
          Required
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {variants.map((v) => (
          <TraditionCard
            key={v.id}
            v={v}
            selected={selectedVariantId === v.id}
            onSelect={() => onSelectVariant(v)}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Available pandits ────────────────────────────────────────────────────────

function PanditCard({ p, onBook }) {
  const initial = p.name?.charAt(0)?.toUpperCase() || '?';
  const img = p.profile_image || p.profile_picture || null;
  const price = Number(p.base_price ?? p.price ?? 0);
  return (
    <div className="flex-shrink-0 w-56 bg-white border border-border rounded-xl p-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center font-bold text-gold relative overflow-hidden flex-shrink-0">
          {initial}
          {img && (
            <img
              src={img}
              alt={p.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm text-text-dark truncate">
            {p.name}
          </p>
          <p className="text-xs text-amber-500">
            ★ {Number(p.rating ?? 0).toFixed(1)}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        {price > 0 ? (
          <span className="text-gold text-sm font-bold">
            ₹{price.toLocaleString('en-IN')}
          </span>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => onBook(p)}
          className="bg-gold text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:shadow-md hover:shadow-gold/30 transition-all"
        >
          Book
        </button>
      </div>
    </div>
  );
}

function AvailablePanditsSection({ pandits, onBookPandit }) {
  if (!Array.isArray(pandits) || pandits.length === 0) return null;
  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading text-lg font-bold text-text-dark">
          Available Pandits
        </h2>
        <Link
          to="/priests"
          className="text-sm font-semibold text-gold hover:underline"
        >
          View All →
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {pandits.map((p) => (
          <PanditCard key={p.id} p={p} onBook={onBookPandit} />
        ))}
      </div>
    </section>
  );
}

// ─── Sticky book bar ──────────────────────────────────────────────────────────

function BookNowBar({ price, onBook, disabled }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-30">
      <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-text-light">Starting from</p>
          <p className="font-heading text-xl font-bold text-text-dark">
            ₹{price > 0 ? price.toLocaleString('en-IN') : '—'}{' '}
            <span className="text-text-light text-sm font-normal">onwards</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onBook}
          disabled={disabled}
          className="bg-gold text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-gold/30 transition-all flex items-center gap-2 disabled:opacity-60"
        >
          Book Now
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Loading / error states ───────────────────────────────────────────────────

function DetailShimmer() {
  return (
    <div className="animate-pulse">
      <div className="w-full h-72 bg-amber-50" />
      <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
          <div className="h-7 bg-surface-alt rounded w-2/3 mb-3" />
          <div className="flex gap-2 mb-3">
            <div className="h-6 w-20 bg-surface-alt rounded-full" />
            <div className="h-6 w-20 bg-surface-alt rounded-full" />
            <div className="h-6 w-20 bg-surface-alt rounded-full" />
          </div>
          <div className="h-3 bg-surface-alt rounded mt-4" />
          <div className="h-3 bg-surface-alt rounded mt-2 w-5/6" />
          <div className="h-3 bg-surface-alt rounded mt-2 w-4/6" />
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function RitualDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ritual, setRitual] = useState(null);
  const [variants, setVariants] = useState([]);
  const [pandits, setPandits] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      ritualsApi.detail(id),
      ritualsApi.ritualVariants(id).catch(() => null),
      ritualsApi.ritualPriests(id).catch(() => null),
    ])
      .then(([detail, variantsRes, panditsRes]) => {
        if (cancelled) return;
        setRitual(detail);
        const vList = Array.isArray(variantsRes)
          ? variantsRes
          : variantsRes?.results ?? [];
        const arr = Array.isArray(vList) ? vList : [];
        setVariants(arr);
        setSelectedVariant(arr[0] || null);

        const pList = Array.isArray(panditsRes)
          ? panditsRes
          : panditsRes?.results ?? [];
        setPandits(Array.isArray(pList) ? pList : []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message || 'Failed to load ritual');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const displayPrice = useMemo(() => {
    if (selectedVariant && getVariantPrice(selectedVariant) > 0)
      return getVariantPrice(selectedVariant);
    return getRitualPrice(ritual || {});
  }, [selectedVariant, ritual]);

  const scrollToTraditions = () => {
    const el = document.getElementById('select-tradition');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goToBooking = (priestId) => {
    const params = new URLSearchParams();
    if (selectedVariant?.id != null)
      params.set('variantId', String(selectedVariant.id));
    if (ritual?.id != null) params.set('ritualId', String(ritual.id));
    const price = getVariantPrice(selectedVariant || {});
    if (price > 0) params.set('price', String(price));
    const name = getName(ritual);
    if (name) params.set('ritualName', name);
    navigate(`/priests/${priestId}/request-booking?${params.toString()}`);
  };

  // Each pandit books against THEIR OWN tradition's variant — not the
  // user's selected tradition card. Match the priest's tradition_name
  // against the variants list (case-insensitive); fall back to
  // selectedVariant only if no match is found.
  const handleBookPandit = (priest) => {
    const priestTradition =
      priest?.tradition_name || priest?.tradition || '';
    const matchedVariant = variants.find(
      (v) =>
        (v?.tradition_name || v?.tradition || '').toLowerCase() ===
        priestTradition.toLowerCase()
    );
    const variantToUse = matchedVariant || selectedVariant;

    if (!variantToUse) {
      toast.error('Please select a tradition first');
      scrollToTraditions();
      return;
    }
    if (!priest?.id) return;

    const params = new URLSearchParams();
    params.set('variantId', String(variantToUse.id));
    if (ritual?.id != null) params.set('ritualId', String(ritual.id));
    const price = getVariantPrice(variantToUse);
    if (price > 0) params.set('price', String(price));
    const name = getName(ritual);
    if (name) params.set('ritualName', name);
    navigate(`/priests/${priest.id}/request-booking?${params.toString()}`);
  };

  const handleBookNow = () => {
    if (!selectedVariant) {
      toast.error('Please select a tradition first');
      scrollToTraditions();
      return;
    }
    const first = pandits[0];
    if (!first?.id) {
      // No pandit on this page — fall back to the priests list pre-filtered
      // by ritual/variant so the user can browse manually.
      navigate('/priests', {
        state: { ritualId: ritual?.id, variantId: selectedVariant?.id },
      });
      return;
    }
    goToBooking(first.id);
  };

  return (
    <div className="min-h-screen bg-bg pb-24">
      <TopNavbar />

      {/* Breadcrumb + back arrow */}
      <div className="max-w-4xl mx-auto px-6 pt-3 flex items-center gap-3 text-sm text-text-light">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-text-mid hover:text-gold transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <Link to="/home" className="hover:text-gold transition-colors">
          Home
        </Link>{' '}
        <span className="text-text-light/60">›</span>{' '}
        <Link to="/rituals" className="hover:text-gold transition-colors">
          Rituals
        </Link>{' '}
        <span className="text-text-light/60">›</span>{' '}
        <span className="text-text-dark font-medium truncate">
          {loading ? '...' : getName(ritual)}
        </span>
      </div>

      {loading ? (
        <div className="mt-4">
          <DetailShimmer />
        </div>
      ) : error || !ritual ? (
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="text-6xl text-gold/30 mb-3">✦</div>
          <h2 className="font-heading text-xl font-bold text-text-dark">
            Could not load this ritual
          </h2>
          <p className="text-text-light text-sm mt-1">
            {error || 'The ritual may not exist or there was a network error.'}
          </p>
          <Link
            to="/rituals"
            className="inline-flex items-center gap-1 mt-4 text-gold font-semibold hover:underline"
          >
            <ChevronLeft size={14} />
            Back to Rituals
          </Link>
        </div>
      ) : (
        <>
          <HeroImage />
          <div className="max-w-4xl mx-auto px-6">
            <RitualInfoCard ritual={ritual} />
            <SelectTraditionSection
              variants={variants}
              selectedVariantId={selectedVariant?.id}
              onSelectVariant={setSelectedVariant}
            />
            <AvailablePanditsSection
              pandits={pandits}
              onBookPandit={handleBookPandit}
            />
          </div>
          <BookNowBar price={displayPrice} onBook={handleBookNow} />
        </>
      )}
    </div>
  );
}
