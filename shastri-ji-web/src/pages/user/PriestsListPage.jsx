import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Heart,
  MapPin,
  ChevronDown,
  SlidersHorizontal,
  RefreshCw,
  ShieldCheck,
  Clock,
  Phone,
  Home as HomeIcon,
  CheckCircle2,
  LayoutGrid,
  List as ListIcon,
} from 'lucide-react';
import TopNavbar from '../../components/layout/TopNavbar';
import { priestsApi } from '../../api/services';

// ─── Static data ──────────────────────────────────────────────────────────────

const SPECIALIZATION_OPTIONS = [
  'Griha Pravesh',
  'Satyanarayan Katha',
  'Marriage Puja',
  'Vastu Shanti',
  'Shraddh & Tarpan',
];

const LANGUAGE_OPTIONS = ['Hindi', 'Sanskrit', 'English', 'Marathi', 'Gujarati'];

const AVAILABILITY_OPTIONS = [
  { id: 'today', label: 'Today' },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'week', label: 'This Week' },
];

const GENDER_OPTIONS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'any', label: 'Any' },
];

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'experience', label: 'Most Experienced' },
];

const SPECIALIZATION_PILLS = [
  { id: '', emoji: '🙏', label: 'All Pandits', count: '200+' },
  { id: 'griha', emoji: '🏠', label: 'Griha Pravesh', count: '45+', match: 'griha' },
  { id: 'satyanarayan', emoji: '🪔', label: 'Satyanarayan Katha', count: '35+', match: 'satyanarayan' },
  { id: 'marriage', emoji: '💒', label: 'Marriage Puja', count: '50+', match: 'marriage' },
  { id: 'vastu', emoji: '🏡', label: 'Vastu Shanti', count: '30+', match: 'vastu' },
  { id: 'shraddh', emoji: '🕯️', label: 'Shraddh & Tarpan', count: '25+', match: 'shraddh' },
  { id: 'others', emoji: '⋯', label: 'Others', count: '15+' },
];

const FOOTER_TRUST = [
  { Icon: CheckCircle2, title: 'Background Verified', subtitle: 'Every pandit is verified for your safety' },
  { Icon: ShieldCheck, title: 'Experienced & Trusted', subtitle: 'Years of experience in Vedic rituals' },
  { Icon: Clock, title: 'On-time & Reliable', subtitle: 'Punctual pandits for peaceful rituals' },
  { Icon: HomeIcon, title: 'At Home Service', subtitle: 'Pandit at your doorstep as per your convenience' },
  { Icon: Phone, title: '24/7 Support', subtitle: 'We are here to help you anytime, anywhere' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const lc = (s) => (s || '').toString().toLowerCase();
const priestPriceOf = (p) => Number(p.base_price ?? p.price ?? p.starting_price ?? 0);
const priestRating = (p) => Number(p.rating ?? 0);
const priestReviews = (p) => Number(p.review_count ?? p.total_reviews ?? 0);
const priestExp = (p) => Number(p.experience_years ?? 0);
const priestImage = (p) => p.profile_image || p.profile_picture || null;
const priestRituals = (p) =>
  Array.isArray(p.rituals_offered)
    ? p.rituals_offered
    : Array.isArray(p.rituals)
    ? p.rituals.map((r) => (typeof r === 'string' ? r : r.name)).filter(Boolean)
    : [];
const priestLanguages = (p) => {
  if (Array.isArray(p.languages)) return p.languages;
  if (typeof p.languages === 'string') return p.languages.split(',').map((s) => s.trim());
  if (p.tradition) return [p.tradition];
  return [];
};

// ─── Filter sidebar ───────────────────────────────────────────────────────────

function FilterSection({ title, isOpen, onToggle, children }) {
  return (
    <div className="border-b border-border py-3">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full text-sm font-semibold text-text-dark"
      >
        {title}
        <ChevronDown size={16} className={`transition-transform ${isOpen ? '' : '-rotate-90'}`} />
      </button>
      {isOpen && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

function CheckboxRow({ label, checked, onToggle }) {
  return (
    <label className="flex items-center gap-2 text-sm text-text-dark cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="w-4 h-4 accent-gold rounded"
      />
      {label}
    </label>
  );
}

function FilterSidebar({
  location,
  onLocationChange,
  specialFilters,
  onToggleSpecial,
  langFilters,
  onToggleLang,
  availability,
  onSelectAvailability,
  gender,
  onSelectGender,
  onClearAll,
}) {
  const [open, setOpen] = useState({
    spec: true,
    lang: true,
    avail: true,
    gender: true,
  });
  const toggle = (k) => setOpen((s) => ({ ...s, [k]: !s[k] }));

  const allSpecChecked = specialFilters.length === 0;

  return (
    <aside className="w-56 flex-shrink-0 hidden lg:block">
      <div className="bg-white border border-border rounded-2xl p-4 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal size={16} className="text-text-dark" />
          <h2 className="font-semibold text-text-dark">Filter Pandits</h2>
        </div>

        <div className="border-b border-border py-3">
          <p className="text-sm font-semibold text-text-dark mb-2">Location</p>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter your location"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              className="w-full bg-bg border border-border rounded-lg px-3 py-2 pr-9 text-sm text-text-dark placeholder-text-light focus:outline-none focus:border-gold"
            />
            <MapPin
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gold pointer-events-none"
            />
          </div>
        </div>

        <FilterSection title="Specialization" isOpen={open.spec} onToggle={() => toggle('spec')}>
          <CheckboxRow
            label="All Specializations"
            checked={allSpecChecked}
            onToggle={() => onToggleSpecial(null)}
          />
          {SPECIALIZATION_OPTIONS.map((s) => (
            <CheckboxRow
              key={s}
              label={s}
              checked={specialFilters.includes(s)}
              onToggle={() => onToggleSpecial(s)}
            />
          ))}
          <button
            type="button"
            className="text-xs text-gold font-semibold hover:underline mt-1"
          >
            View More ▾
          </button>
        </FilterSection>

        <FilterSection title="Language" isOpen={open.lang} onToggle={() => toggle('lang')}>
          {LANGUAGE_OPTIONS.map((l) => (
            <CheckboxRow
              key={l}
              label={l}
              checked={langFilters.includes(l)}
              onToggle={() => onToggleLang(l)}
            />
          ))}
          <button
            type="button"
            className="text-xs text-gold font-semibold hover:underline mt-1"
          >
            View More ▾
          </button>
        </FilterSection>

        <FilterSection title="Availability" isOpen={open.avail} onToggle={() => toggle('avail')}>
          <div className="grid grid-cols-3 gap-1.5">
            {AVAILABILITY_OPTIONS.map((opt) => {
              const active = availability === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectAvailability(active ? '' : opt.id)}
                  className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? 'bg-gold text-white border-gold'
                      : 'bg-white text-text-dark border-border hover:border-gold'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </FilterSection>

        <FilterSection title="Gender" isOpen={open.gender} onToggle={() => toggle('gender')}>
          <div className="grid grid-cols-3 gap-1.5">
            {GENDER_OPTIONS.map((opt) => {
              const active = gender === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectGender(opt.id)}
                  className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? 'bg-gold text-white border-gold'
                      : 'bg-white text-text-dark border-border hover:border-gold'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </FilterSection>

        <button
          type="button"
          onClick={onClearAll}
          className="mt-4 w-full border-2 border-gold text-gold rounded-xl py-2 text-sm font-semibold hover:bg-gold hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={14} />
          Clear All Filters
        </button>
      </div>
    </aside>
  );
}

// ─── Pandit card ──────────────────────────────────────────────────────────────

function PanditCard({ p, isPopular, ritualId, variantId }) {
  const [liked, setLiked] = useState(false);
  const img = priestImage(p);
  const initial = p.name?.charAt(0)?.toUpperCase() || '?';
  const rituals = priestRituals(p);
  const visibleRituals = rituals.slice(0, 3);
  const moreRituals = rituals.length - visibleRituals.length;
  const langs = priestLanguages(p);
  const price = priestPriceOf(p);

  return (
    <div
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-row"
      style={{ minHeight: '160px' }}
    >
      {/* LEFT — photo column */}
      <div className="w-36 flex-shrink-0 relative bg-amber-50 flex items-center justify-center overflow-hidden">
        <span className="text-4xl font-bold text-amber-400">{initial}</span>
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

      {/* RIGHT — details */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-base text-text-dark leading-tight">
            {p.name}
          </h3>
          <button
            type="button"
            onClick={() => setLiked((v) => !v)}
            className="flex-shrink-0 ml-2"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-4 h-4 cursor-pointer ${
                liked
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-300 hover:text-red-400'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="text-xs text-amber-500">
            ★ {priestRating(p).toFixed(1)}
          </span>
          <span className="text-xs text-text-light">
            ({priestReviews(p)})
          </span>
          {p.city && (
            <span className="text-xs text-text-light">📍 {p.city}</span>
          )}
          {priestExp(p) > 0 && (
            <span className="text-xs text-text-light">
              · {priestExp(p)}+ Yrs Exp.
            </span>
          )}
        </div>

        {isPopular && (
          <span className="text-xs bg-orange-100 text-orange-600 rounded-full px-2 py-0.5 w-fit mt-1">
            Most Popular
          </span>
        )}

        {visibleRituals.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-text-light font-medium mb-1">
              Specializations
            </p>
            <div className="flex flex-wrap gap-1">
              {visibleRituals.map((r, i) => (
                <span
                  key={i}
                  className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-full px-2 py-0.5"
                >
                  {r}
                </span>
              ))}
              {moreRituals > 0 && (
                <span className="text-xs text-amber-600">
                  +{moreRituals} more
                </span>
              )}
            </div>
          </div>
        )}

        {langs.length > 0 && (
          <p className="text-xs text-text-light mt-1">
            Languages: {langs.join(', ')}
          </p>
        )}

        <div className="flex items-center justify-between mt-3 gap-2">
          <span className="text-gold font-bold text-sm">
            {price > 0 ? `₹${price.toLocaleString('en-IN')} onwards` : ''}
          </span>
          <Link
            to={`/priests/${p.id}`}
            state={{ ritualId, variantId }}
            className="text-xs bg-gold text-white px-4 py-1.5 rounded-lg hover:bg-amber-600 transition-colors font-medium"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

function CardShimmer() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex animate-pulse">
      <div className="w-28 h-36 bg-amber-50 flex-shrink-0" />
      <div className="flex-1 p-3 space-y-2">
        <div className="h-4 bg-surface-alt rounded w-3/4" />
        <div className="h-3 bg-surface-alt rounded w-1/2" />
        <div className="h-3 bg-surface-alt rounded w-2/3" />
        <div className="h-7 bg-surface-alt rounded w-full mt-3" />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PriestsListPage() {
  const routerLocation = useLocation();
  const ritualId = routerLocation.state?.ritualId;
  const variantId = routerLocation.state?.variantId;

  const [priests, setPriests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [activeSpecPill, setActiveSpecPill] = useState('');
  const [specialFilters, setSpecialFilters] = useState([]);
  const [langFilters, setLangFilters] = useState([]);
  const [availability, setAvailability] = useState('');
  const [gender, setGender] = useState('any');
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    priestsApi
      .search({ page_size: 200, ...(ritualId && { ritual: ritualId }) })
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data?.results ?? [];
        setPriests(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (!cancelled) setPriests([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ritualId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const loc = location.trim().toLowerCase();
    let out = priests.filter((p) => {
      if (q && !lc(p.name).includes(q)) return false;
      if (loc && !lc(p.city).includes(loc)) return false;
      // Top pill match → check rituals offered for keyword
      if (activeSpecPill) {
        const pill = SPECIALIZATION_PILLS.find((x) => x.id === activeSpecPill);
        if (pill?.match) {
          const hit = priestRituals(p).some((r) => lc(r).includes(pill.match));
          if (!hit) return false;
        }
      }
      // Sidebar specialization checkboxes (any-match)
      if (specialFilters.length > 0) {
        const hit = priestRituals(p).some((r) =>
          specialFilters.some((sf) => lc(r).includes(lc(sf)))
        );
        if (!hit) return false;
      }
      // Language filters (any-match)
      if (langFilters.length > 0) {
        const langs = priestLanguages(p).map(lc);
        const hit = langFilters.some((lf) => langs.includes(lc(lf)));
        if (!hit) return false;
      }
      // Gender filter (only filters when priest exposes a gender field)
      if (gender !== 'any' && p.gender) {
        if (lc(p.gender) !== gender) return false;
      }
      // Availability — no backend field; pass-through
      return true;
    });

    const cmp = {
      recommended: (a, b) =>
        priestRating(b) * Math.log10(priestReviews(b) + 2) -
        priestRating(a) * Math.log10(priestReviews(a) + 2),
      rating: (a, b) => priestRating(b) - priestRating(a),
      'price-asc': (a, b) => priestPriceOf(a) - priestPriceOf(b),
      'price-desc': (a, b) => priestPriceOf(b) - priestPriceOf(a),
      experience: (a, b) => priestExp(b) - priestExp(a),
    }[sortBy];
    if (cmp) out = [...out].sort(cmp);

    return out;
  }, [
    priests,
    search,
    location,
    activeSpecPill,
    specialFilters,
    langFilters,
    gender,
    sortBy,
  ]);

  const handleClearAll = () => {
    setSearch('');
    setLocation('');
    setActiveSpecPill('');
    setSpecialFilters([]);
    setLangFilters([]);
    setAvailability('');
    setGender('any');
    setSortBy('recommended');
  };

  const toggleSpecial = (s) => {
    if (s === null) {
      setSpecialFilters([]);
      return;
    }
    setSpecialFilters((arr) =>
      arr.includes(s) ? arr.filter((x) => x !== s) : [...arr, s]
    );
  };

  const toggleLang = (l) => {
    setLangFilters((arr) =>
      arr.includes(l) ? arr.filter((x) => x !== l) : [...arr, l]
    );
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
        <span className="text-text-dark font-medium">Pandits</span>
      </div>

      {/* HERO BANNER */}
      <section
        className="relative w-full"
        style={{
          height: '280px',
          background:
            'linear-gradient(to right, #FEF3C7 0%, #FDE68A 40%, #FEF3C7 60%, #FDF6E3 100%)',
        }}
      >
        <div
          className="max-w-7xl mx-auto px-12 py-8 flex items-center h-full"
        >
          {/* LEFT — Text, 35% */}
          <div className="flex-shrink-0 w-[35%] pr-6">
            <p className="text-text-light text-sm mb-1">
              Find the Right Pandit for
            </p>
            <h1 className="font-heading text-3xl font-bold text-text-dark leading-tight">
              Every Ritual &amp; Occasion
            </h1>
            <p className="text-text-light text-sm mt-2">
              Verified, experienced &amp; trusted pandits for your peace of
              mind.
            </p>
          </div>

          {/* CENTER — Trust badges, 30% */}
          <div className="flex-shrink-0 w-[30%] grid grid-cols-2 gap-x-6 gap-y-3 px-6">
            {[
              { icon: '🛡️', title: 'Verified Pandits', sub: '100% Background Verified' },
              { icon: '🪷', title: 'Experienced', sub: 'Years of Ritual Expertise' },
              { icon: '⏰', title: 'Punctual & Reliable', sub: 'On-time Rituals' },
              { icon: '🏠', title: 'Available at Home', sub: 'At your convenience' },
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center flex-shrink-0 text-sm">
                  {b.icon}
                </div>
                <div>
                  <p className="font-semibold text-text-dark text-xs leading-tight">
                    {b.title}
                  </p>
                  <p className="text-text-light text-xs">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pandit image — absolute, fills right 40% */}
        <div
          className="absolute right-0 top-0 h-full hidden lg:block"
          style={{ width: '40%' }}
        >
          <img
            src="/pandit-hero.png"
            alt="Pandit"
            className="w-full h-full object-contain object-right-bottom"
            style={{ mixBlendMode: 'multiply' }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* Left-fade gradient overlay — blends pandit into banner */}
        <div
          className="hidden lg:block absolute right-0 top-0 h-full pointer-events-none"
          style={{ width: '40%' }}
        >
          <div
            className="absolute inset-y-0 left-0 w-40"
            style={{
              background: 'linear-gradient(to right, #FEF3C7, transparent)',
            }}
          />
        </div>
      </section>

      {/* MAIN AREA */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
        <FilterSidebar
          location={location}
          onLocationChange={setLocation}
          specialFilters={specialFilters}
          onToggleSpecial={toggleSpecial}
          langFilters={langFilters}
          onToggleLang={toggleLang}
          availability={availability}
          onSelectAvailability={setAvailability}
          gender={gender}
          onSelectGender={setGender}
          onClearAll={handleClearAll}
        />

        <main className="flex-1 min-w-0">
          {/* Page header row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="font-heading text-2xl font-bold text-text-dark">
                Our Verified Pandits
              </h2>
              <p className="text-sm text-text-light">
                200+ experienced and verified pandits available
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none"
                />
                <input
                  type="search"
                  placeholder="Search pandits..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-white border border-border rounded-xl pl-9 pr-4 py-2 text-sm text-text-dark placeholder-text-light focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all w-56"
                />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-border rounded-xl pl-3 pr-9 py-2 text-sm text-text-dark focus:outline-none focus:border-gold cursor-pointer"
                >
                  {SORT_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      Sort By: {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-mid pointer-events-none"
                />
              </div>
              <div className="flex border border-border rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm font-medium flex items-center gap-1 transition-all ${
                    viewMode === 'grid'
                      ? 'bg-gold text-white'
                      : 'bg-white text-text-dark hover:text-gold'
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm font-medium flex items-center gap-1 transition-all ${
                    viewMode === 'list'
                      ? 'bg-gold text-white'
                      : 'bg-white text-text-dark hover:text-gold'
                  }`}
                  aria-label="List view"
                >
                  <ListIcon size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Specialization pills row */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mb-5">
            {SPECIALIZATION_PILLS.map((p) => {
              const active = activeSpecPill === p.id;
              return (
                <button
                  key={p.id || 'all'}
                  type="button"
                  onClick={() => setActiveSpecPill(p.id)}
                  className={`flex-shrink-0 flex items-center gap-2 rounded-2xl border px-5 py-2.5 text-sm transition-all whitespace-nowrap ${
                    active
                      ? 'bg-gold/10 border-gold text-gold font-semibold'
                      : 'bg-white border-border text-text-dark hover:border-gold/50'
                  }`}
                >
                  <span className="text-base">{p.emoji}</span>
                  {p.label}
                  <span className="text-xs text-text-light">{p.count}</span>
                </button>
              );
            })}
          </div>

          {/* Pandits grid / list */}
          {loading ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
                  : 'grid grid-cols-1 lg:grid-cols-2 gap-4'
              }
            >
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <CardShimmer key={i} />
                ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white border border-border rounded-2xl">
              <div className="text-6xl text-gold/20 mb-2">ॐ</div>
              <h3 className="font-heading text-lg text-text-dark">
                No pandits match your filters
              </h3>
              <p className="text-text-light text-sm mt-1">
                Try adjusting filters or clearing them.
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
                  : 'grid grid-cols-1 lg:grid-cols-2 gap-4'
              }
            >
              {filtered.map((p, i) => (
                <PanditCard
                  key={p.id}
                  p={p}
                  isPopular={i === 0}
                  ritualId={ritualId}
                  variantId={variantId}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* FOOTER TRUST BAR */}
      <section className="bg-white border-t border-border mt-8">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <div className="lg:col-span-1 flex items-start gap-3">
              <div className="w-10 h-10 bg-gold-bg rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                🪷
              </div>
              <h3 className="font-heading font-bold text-text-dark text-base leading-tight">
                Why Book Pandits with Shastri Ji?
              </h3>
            </div>
            {FOOTER_TRUST.map(({ Icon, title, subtitle }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gold-bg rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-gold" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-text-dark leading-tight">
                    {title}
                  </p>
                  <p className="text-xs text-text-light mt-0.5 leading-tight">
                    {subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
