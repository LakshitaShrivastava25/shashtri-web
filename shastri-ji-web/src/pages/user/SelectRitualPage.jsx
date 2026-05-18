import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import TopNavbar from '../../components/layout/TopNavbar';
import { priestsApi, ritualsApi } from '../../api/services';

// ─── Helpers ──────────────────────────────────────────────────────────────────
//
// Variant shape from GET /api/rituals/variants/ (Django):
//   { id, ritual, ritual_title, tradition_name, variant_name,
//     duration_minutes, price, is_active }
//
// We keep accessors shape-tolerant in case the backend nests `ritual` or
// `tradition` as objects on some endpoints.

const getRitualName = (v) =>
  v?.ritual_title || v?.ritual?.name || v?.ritual_name || v?.name || 'Ritual';
const getVariantSubtitle = (v) =>
  v?.variant_name ||
  v?.subtitle ||
  v?.tradition?.description ||
  v?.description ||
  [v?.tradition_name || v?.tradition?.name, v?.ritual_title || v?.ritual?.name]
    .filter(Boolean)
    .join(' ');
const getTraditionName = (v) =>
  v?.tradition_name || v?.tradition?.name || null;
const getDuration = (v) =>
  v?.duration_minutes ??
  (v?.duration_hours != null ? v.duration_hours * 60 : null);
const getPrice = (v) =>
  Number(v?.price ?? v?.final_price ?? v?.base_price ?? 0);
const getRitualRef = (v) =>
  v?.ritual_id ??
  v?.ritual?.id ??
  (typeof v?.ritual === 'number' || typeof v?.ritual === 'string'
    ? v.ritual
    : null);

// The flat /rituals/variants/ endpoint does NOT include a ritual id —
// only ritual_title. So we have to fetch /rituals/ in parallel and match
// the variant's ritual_title against ritual.name (or .title) to recover the id.
const findRitualIdByTitle = (rituals, title) => {
  if (!title || !Array.isArray(rituals)) return null;
  const match = rituals.find(
    (r) => (r?.name || r?.title || r?.ritual_title) === title
  );
  return match?.id ?? null;
};

const getPanditName = (p) => p?.name || 'Pandit';

// ─── Variant card ─────────────────────────────────────────────────────────────

function VariantCard({ v, onBook }) {
  const duration = getDuration(v);
  const price = getPrice(v);
  const tradition = getTraditionName(v);
  return (
    <div className="bg-white border border-border rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-full bg-gold-bg flex items-center justify-center flex-shrink-0 text-2xl">
        🛕
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base text-text-dark line-clamp-1">
          {getRitualName(v)}
        </h3>
        {getVariantSubtitle(v) && (
          <p className="text-xs text-text-light line-clamp-1 mt-0.5">
            {getVariantSubtitle(v)}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {tradition && (
            <span className="text-xs bg-gold-bg text-gold border border-gold/30 px-2 py-0.5 rounded-full font-medium">
              {tradition}
            </span>
          )}
          {duration != null && (
            <span className="text-xs text-text-light flex items-center gap-1">
              <Clock size={11} />
              {duration} min
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        {price > 0 && (
          <p className="text-gold font-bold">
            ₹{price.toLocaleString('en-IN')}
          </p>
        )}
        <button
          type="button"
          onClick={() => onBook(v)}
          className="bg-gold text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:shadow-md hover:shadow-gold/30 transition-all"
        >
          Book
        </button>
      </div>
    </div>
  );
}

function CardShimmer() {
  return (
    <div className="bg-white border border-border rounded-2xl p-4 flex items-center gap-4 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-amber-50 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-surface-alt rounded w-2/3" />
        <div className="h-3 bg-surface-alt rounded w-1/2" />
      </div>
      <div className="h-8 w-16 bg-surface-alt rounded-lg flex-shrink-0" />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SelectRitualPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pandit, setPandit] = useState(null);
  const [variants, setVariants] = useState([]);
  const [rituals, setRituals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    // allSettled so a slow/failing priest-variants call never delays the page.
    Promise.allSettled([
      priestsApi.detail(id),
      ritualsApi.variants(),
      ritualsApi.list({ page_size: 200 }),
      priestsApi.variants(id),
    ])
      .then(
        ([detailRes, allVariantsRes, ritualsListRes, priestVariantsRes]) => {
          if (cancelled) return;

          const detail =
            detailRes.status === 'fulfilled' ? detailRes.value : null;
          setPandit(detail);

          const vRes =
            allVariantsRes.status === 'fulfilled'
              ? allVariantsRes.value
              : null;
          const vList = Array.isArray(vRes) ? vRes : vRes?.results ?? [];
          const allVariants = (Array.isArray(vList) ? vList : []).filter(
            (v) => v?.is_active !== false
          );

          const pvRes =
            priestVariantsRes.status === 'fulfilled'
              ? priestVariantsRes.value
              : null;
          const pvList = Array.isArray(pvRes) ? pvRes : pvRes?.results ?? [];
          const priestVariants = Array.isArray(pvList) ? pvList : [];

          // Intersect with the priest's own offerings when available.
          // Falls through to all variants when the priest endpoint is empty,
          // so the page degrades gracefully until the backend wires the
          // priest→variant relationship.
          const offeredIds = new Set(
            priestVariants.map((v) => String(v?.id))
          );
          const filteredVariants =
            offeredIds.size > 0
              ? allVariants.filter((v) => offeredIds.has(String(v?.id)))
              : allVariants;
          setVariants(filteredVariants);

          const rRes =
            ritualsListRes.status === 'fulfilled'
              ? ritualsListRes.value
              : null;
          const rList = Array.isArray(rRes) ? rRes : rRes?.results ?? [];
          setRituals(Array.isArray(rList) ? rList : []);
        }
      )
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Failed to load');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleBook = (v) => {
    const params = new URLSearchParams();
    if (v?.id) params.set('variantId', String(v.id));
    // The variant payload doesn't carry a ritual id, so look it up by title
    // from the rituals list. Fall back to any nested shape just in case.
    const ritualRef =
      findRitualIdByTitle(rituals, v?.ritual_title) ?? getRitualRef(v);
    if (ritualRef != null) params.set('ritualId', String(ritualRef));
    const price = getPrice(v);
    if (price > 0) params.set('price', String(price));
    const name = getRitualName(v);
    if (name) params.set('ritualName', name);
    navigate(`/priests/${id}/request-booking?${params.toString()}`);
  };

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
        <Link to="/priests" className="hover:text-gold transition-colors">
          Pandits
        </Link>{' '}
        <span className="text-text-light/60">›</span>{' '}
        <span className="text-text-dark font-medium truncate">
          Select Ritual
        </span>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6">
        <h1 className="font-heading text-2xl font-bold text-text-dark text-center">
          Select a Ritual
        </h1>
        <p className="text-gold text-center text-sm mt-1">
          {loading ? '...' : getPanditName(pandit)}
        </p>

        <div className="mt-6 space-y-3">
          {loading ? (
            Array(4)
              .fill(0)
              .map((_, i) => <CardShimmer key={i} />)
          ) : error ? (
            <div className="bg-white border border-border rounded-2xl text-center py-12">
              <div className="text-5xl text-gold/30 mb-2">✦</div>
              <h2 className="font-heading text-lg font-bold text-text-dark">
                Could not load rituals
              </h2>
              <p className="text-text-light text-sm mt-1">{error}</p>
            </div>
          ) : variants.length === 0 ? (
            <div className="bg-white border border-border rounded-2xl text-center py-12">
              <div className="text-5xl mb-2">🛕</div>
              <h2 className="font-heading text-lg font-bold text-text-dark">
                No rituals available yet
              </h2>
              <p className="text-text-light text-sm mt-1">
                Ritual variants haven't been added yet. Please check back soon.
              </p>
              <Link
                to="/priests"
                className="inline-block mt-4 text-gold font-semibold hover:underline"
              >
                ← Back to Pandits
              </Link>
            </div>
          ) : (
            variants.map((v) => (
              <VariantCard key={v.id} v={v} onBook={handleBook} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
