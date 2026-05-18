import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import TopNavbar from '../../components/layout/TopNavbar';
import { priestsApi } from '../../api/services';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getName = (p) => p?.name || 'Pandit';
const getImage = (p) => p?.profile_image || p?.profile_picture || null;
const getRating = (p) => Number(p?.rating ?? 0);
const getReviews = (p) => Number(p?.review_count ?? p?.total_reviews ?? 0);
const getExperience = (p) => Number(p?.experience_years ?? 0);
const getBasePrice = (p) =>
  Number(p?.base_price ?? p?.price ?? p?.starting_price ?? 0);
const getTradition = (p) =>
  p?.tradition?.name || p?.tradition_name || p?.tradition || '';
const getLanguages = (p) => {
  if (Array.isArray(p?.languages)) return p.languages;
  if (typeof p?.languages === 'string')
    return p.languages.split(',').map((s) => s.trim()).filter(Boolean);
  if (p?.tradition) return [getTradition(p)];
  return [];
};
const getBio = (p) =>
  p?.bio ||
  p?.about ||
  p?.description ||
  'An experienced and verified pandit dedicated to performing authentic Hindu rituals with devotion and precision.';
const getAvailability = (p) =>
  p?.is_available !== false && p?.availability !== 'unavailable';

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroAvatar({ pandit }) {
  const initial = getName(pandit).charAt(0).toUpperCase();
  const img = getImage(pandit);
  return (
    <section
      className="relative w-full flex flex-col items-center justify-end pb-12"
      style={{
        height: '200px',
        background:
          'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #F8EFE3 100%)',
      }}
    >
      <div className="w-28 h-28 rounded-full bg-amber-100 ring-4 ring-gold ring-offset-4 ring-offset-amber-50 flex items-center justify-center relative overflow-hidden">
        <span className="font-heading text-4xl font-bold text-gold">
          {initial}
        </span>
        {img && (
          <img
            src={img}
            alt={getName(pandit)}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
      </div>
    </section>
  );
}

// ─── Info card ────────────────────────────────────────────────────────────────

function InfoCard({ pandit }) {
  const available = getAvailability(pandit);
  const tradition = getTradition(pandit);
  const price = getBasePrice(pandit);
  return (
    <section className="bg-white border border-border rounded-2xl shadow-sm p-5 -mt-8 relative z-10">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="font-heading text-2xl font-bold text-text-dark">
          {getName(pandit)}
        </h1>
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
            available
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              available ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
          {available ? 'Available' : 'Unavailable'}
        </span>
      </div>
      {tradition && (
        <p className="text-sm text-text-light mt-1">{tradition}</p>
      )}
      {price > 0 && (
        <p className="text-gold font-bold mt-2">
          ₹{price.toLocaleString('en-IN')}{' '}
          <span className="text-text-light text-sm font-normal">
            onwards per ritual
          </span>
        </p>
      )}
    </section>
  );
}

// ─── Stats card ───────────────────────────────────────────────────────────────

function StatsCard({ pandit }) {
  return (
    <section className="bg-white border border-border rounded-2xl shadow-sm mt-4 grid grid-cols-3 divide-x divide-border">
      <div className="px-4 py-4 text-center">
        <p className="font-heading text-xl font-bold text-gold">
          {getRating(pandit).toFixed(1)} ★
        </p>
        <p className="text-xs text-text-light mt-1">Rating</p>
      </div>
      <div className="px-4 py-4 text-center">
        <p className="font-heading text-xl font-bold text-text-dark">
          {getExperience(pandit)}yr
        </p>
        <p className="text-xs text-text-light mt-1">Experience</p>
      </div>
      <div className="px-4 py-4 text-center">
        <p className="font-heading text-xl font-bold text-text-dark">
          {getReviews(pandit)}
        </p>
        <p className="text-xs text-text-light mt-1">Reviews</p>
      </div>
    </section>
  );
}

// ─── About + Languages ───────────────────────────────────────────────────────

function AboutCard({ pandit }) {
  return (
    <section className="bg-white border border-border rounded-2xl shadow-sm p-5 mt-4">
      <p className="text-xs text-text-light font-semibold uppercase tracking-wide mb-1">
        About
      </p>
      <p className="text-sm text-text-mid leading-relaxed">{getBio(pandit)}</p>
    </section>
  );
}

function LanguagesCard({ pandit }) {
  const langs = getLanguages(pandit);
  if (langs.length === 0) return null;
  return (
    <section className="bg-white border border-border rounded-2xl shadow-sm p-5 mt-4">
      <p className="text-xs text-text-light font-semibold uppercase tracking-wide mb-2">
        Languages
      </p>
      <div className="flex flex-wrap gap-2">
        {langs.map((l, i) => (
          <span
            key={i}
            className="inline-block bg-gold-bg text-gold border border-gold/30 px-3 py-1 rounded-full text-xs font-semibold"
          >
            {l}
          </span>
        ))}
      </div>
    </section>
  );
}

// ─── Sticky book bar ──────────────────────────────────────────────────────────

function BookNowBar({ onBook }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-30">
      <div className="max-w-3xl mx-auto px-6 py-3">
        <button
          type="button"
          onClick={onBook}
          className="w-full bg-gold text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-gold/30 transition-all flex items-center justify-center gap-2"
        >
          Book Now
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Loading shimmer ──────────────────────────────────────────────────────────

function DetailShimmer() {
  return (
    <div className="animate-pulse">
      <div
        className="w-full h-52"
        style={{
          background:
            'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #F8EFE3 100%)',
        }}
      />
      <div className="max-w-3xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white border border-border rounded-2xl shadow-sm p-5">
          <div className="h-6 w-1/2 bg-surface-alt rounded mb-2" />
          <div className="h-3 w-1/3 bg-surface-alt rounded mb-3" />
          <div className="h-4 w-2/5 bg-surface-alt rounded" />
        </div>
        <div className="h-20 bg-white border border-border rounded-2xl mt-4" />
        <div className="h-32 bg-white border border-border rounded-2xl mt-4" />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PanditDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pandit, setPandit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    priestsApi
      .detail(id)
      .then((data) => {
        if (!cancelled) setPandit(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Failed to load pandit');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

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
        <Link to="/priests" className="hover:text-gold transition-colors">
          Pandits
        </Link>{' '}
        <span className="text-text-light/60">›</span>{' '}
        <span className="text-text-dark font-medium truncate">
          {loading ? '...' : getName(pandit)}
        </span>
      </div>

      {loading ? (
        <div className="mt-4">
          <DetailShimmer />
        </div>
      ) : error || !pandit ? (
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="text-6xl text-gold/30 mb-3">✦</div>
          <h2 className="font-heading text-xl font-bold text-text-dark">
            Could not load this pandit
          </h2>
          <p className="text-text-light text-sm mt-1">
            {error || 'The pandit may not exist or there was a network error.'}
          </p>
          <Link
            to="/priests"
            className="inline-block mt-4 text-gold font-semibold hover:underline"
          >
            ← Back to Pandits
          </Link>
        </div>
      ) : (
        <>
          <HeroAvatar pandit={pandit} />
          <div className="max-w-3xl mx-auto px-6">
            <InfoCard pandit={pandit} />
            <StatsCard pandit={pandit} />
            <h2 className="font-heading text-lg font-bold text-text-dark mt-6 mb-2">
              About Pandit
            </h2>
            <AboutCard pandit={pandit} />
            <LanguagesCard pandit={pandit} />
          </div>
          <BookNowBar
            onBook={() => navigate(`/priests/${id}/select-ritual`)}
          />
        </>
      )}
    </div>
  );
}
