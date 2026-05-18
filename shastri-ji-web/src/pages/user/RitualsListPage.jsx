import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Heart,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RefreshCw,
} from 'lucide-react';
import TopNavbar from '../../components/layout/TopNavbar';
import { ritualsApi } from '../../api/services';

// ─── Static config ────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;
const PRICE_MIN = 500;
const PRICE_MAX = 25000;

const DURATION_BUCKETS = [
  { id: 'under1', label: 'Under 1 Hour', count: 6, max: 60 },
  { id: '1to3', label: '1–3 Hours', count: 18, min: 60, max: 180 },
  { id: '3to6', label: '3–6 Hours', count: 14, min: 180, max: 360 },
  { id: 'fullday', label: 'Full Day', count: 10, min: 360 },
];

const LANGUAGE_OPTIONS = [
  { id: 'hindi', label: 'Hindi', count: 36 },
  { id: 'sanskrit', label: 'Sanskrit', count: 10 },
  { id: 'english', label: 'English', count: 8 },
];

const SORT_OPTIONS = [
  { id: 'popularity', label: 'Popularity' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Rating' },
];

const PILL_PRESETS = [
  { emoji: '🪷', label: 'All Rituals', match: null },
  { emoji: '🏠', label: 'Griha Pravesh', match: ['griha', 'home', 'pravesh'] },
  { emoji: '🪔', label: 'Puja & Hawan', match: ['puja', 'hawan', 'havan'] },
  { emoji: '🪐', label: 'Shanti & Graha', match: ['shanti', 'graha', 'navgraha'] },
  { emoji: '🙏', label: 'Sanskar', match: ['sanskar', 'marriage'] },
  { emoji: '✋', label: 'Tarpan & Shradh', match: ['tarpan', 'shradh', 'shraddh'] },
  { emoji: '🎆', label: 'Festivals', match: ['festival', 'diwali', 'holi'] },
];

// ─── Small UI bits ────────────────────────────────────────────────────────────

function FilterSection({ title, isOpen, onToggle, children }) {
  return (
    <div className="border-b border-border py-3">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full text-sm font-semibold text-text-dark"
      >
        {title}
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? '' : '-rotate-90'}`}
        />
      </button>
      {isOpen && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

function RadioRow({ label, count, checked, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex items-center justify-between w-full text-sm hover:text-gold"
    >
      <span className="flex items-center gap-2 min-w-0">
        <span
          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            checked ? 'border-gold' : 'border-border'
          }`}
        >
          {checked && <span className="w-2 h-2 rounded-full bg-gold" />}
        </span>
        <span className="text-text-dark truncate">{label}</span>
      </span>
      {count != null && (
        <span className="text-xs text-text-light flex-shrink-0 ml-2">
          {count}
        </span>
      )}
    </button>
  );
}

function CheckboxRow({ label, count, checked, onToggle }) {
  return (
    <label className="flex items-center justify-between w-full text-sm cursor-pointer">
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="w-4 h-4 accent-gold rounded"
        />
        <span className="text-text-dark">{label}</span>
      </span>
      {count != null && (
        <span className="text-xs text-text-light">{count}</span>
      )}
    </label>
  );
}

function MandalaPlaceholder({ name }) {
  return (
    <div className="absolute inset-0 bg-amber-50 flex items-center justify-center">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          transform="translate(100,100)"
          fill="none"
          stroke="#F4A623"
          strokeWidth="0.8"
        >
          <circle r="20" />
          <circle r="40" />
          <circle r="60" />
          <circle r="80" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <line x1="0" y1="10" x2="0" y2="80" />
              <ellipse cx="0" cy="30" rx="5" ry="10" />
              <ellipse cx="0" cy="60" rx="3" ry="6" />
            </g>
          ))}
        </g>
      </svg>
      {name && (
        <p className="absolute bottom-3 text-xs text-gold/60 font-medium">
          {name.split(' ')[0]}
        </p>
      )}
    </div>
  );
}

// ─── Ritual card ──────────────────────────────────────────────────────────────

function RitualCard({ r }) {
  const [liked, setLiked] = useState(false);
  const price = Number(r.final_price ?? r.price ?? 0);
  const rating = Number(r.rating ?? 0);
  const reviews = Number(r.total_reviews ?? 0);
  const duration = r.duration_label || '2–3 Hours';

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow relative">
      <div className="relative h-48 overflow-hidden">
        {r.image ? (
          <img
            src={r.image}
            alt={r.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling)
                e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="absolute inset-0"
          style={{ display: r.image ? 'none' : 'block' }}
        >
          <MandalaPlaceholder name={r.name} />
        </div>
        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
          aria-label="Wishlist"
        >
          <Heart
            size={16}
            className={
              liked ? 'fill-red-500 text-red-500' : 'text-text-mid'
            }
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-base text-text-dark line-clamp-1">
          {r.name}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-gold">★</span>
          <span className="font-bold text-sm text-text-dark">
            {rating.toFixed(1)}
          </span>
          <span className="text-xs text-text-light">({reviews})</span>
        </div>
        {r.description && (
          <p className="text-xs text-text-light line-clamp-2 mt-2">
            {r.description}
          </p>
        )}
        <p className="text-xs text-text-light mt-2 flex items-center gap-1">
          <Clock size={12} /> {duration}
        </p>
        <p className="text-gold font-bold mt-2">
          ₹{price.toLocaleString('en-IN')} onwards
        </p>
        <Link
          to={`/rituals/${r.id}`}
          className="block w-full mt-3 border-2 border-gold text-gold text-sm font-semibold py-2 rounded-xl text-center hover:bg-gold hover:text-white transition-all"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

function CardShimmer() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="h-48 bg-amber-50" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-surface-alt rounded w-3/4" />
        <div className="h-3 bg-surface-alt rounded w-1/2" />
        <div className="h-3 bg-surface-alt rounded w-full" />
        <div className="h-9 bg-surface-alt rounded w-full mt-3" />
      </div>
    </div>
  );
}

// ─── Filter sidebar ───────────────────────────────────────────────────────────

function FilterSidebar({
  totalCount,
  categories,
  categoryCounts,
  selectedCategory,
  onSelectCategory,
  maxPrice,
  onPriceChange,
  durationFilters,
  onToggleDuration,
  languageFilters,
  onToggleLanguage,
  onClearAll,
}) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    duration: true,
    language: false,
  });
  const toggle = (k) =>
    setOpenSections((s) => ({ ...s, [k]: !s[k] }));

  return (
    <aside className="w-56 flex-shrink-0 hidden lg:block">
      <div className="bg-white border border-border rounded-2xl p-4 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="flex items-center gap-2 mb-2">
          <SlidersHorizontal size={16} className="text-text-dark" />
          <h2 className="font-semibold text-text-dark">Filter Rituals</h2>
        </div>

        <FilterSection
          title="Categories"
          isOpen={openSections.categories}
          onToggle={() => toggle('categories')}
        >
          <RadioRow
            label="All Rituals"
            count={totalCount}
            checked={selectedCategory === ''}
            onSelect={() => onSelectCategory('')}
          />
          {categories.map((c) => {
            const value = c.id ?? c.slug ?? c.name;
            return (
              <RadioRow
                key={value}
                label={c.name}
                count={categoryCounts[value] ?? 0}
                checked={selectedCategory === value}
                onSelect={() => onSelectCategory(value)}
              />
            );
          })}
        </FilterSection>

        <FilterSection
          title="Price Range"
          isOpen={openSections.price}
          onToggle={() => toggle('price')}
        >
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={500}
            value={maxPrice}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="w-full accent-gold"
          />
          <div className="flex justify-between text-xs text-text-light">
            <span>₹{PRICE_MIN}</span>
            <span>₹{maxPrice.toLocaleString('en-IN')}+</span>
          </div>
        </FilterSection>

        <FilterSection
          title="Duration"
          isOpen={openSections.duration}
          onToggle={() => toggle('duration')}
        >
          {DURATION_BUCKETS.map((d) => (
            <CheckboxRow
              key={d.id}
              label={d.label}
              count={d.count}
              checked={durationFilters.includes(d.id)}
              onToggle={() => onToggleDuration(d.id)}
            />
          ))}
        </FilterSection>

        <FilterSection
          title="Language"
          isOpen={openSections.language}
          onToggle={() => toggle('language')}
        >
          {LANGUAGE_OPTIONS.map((l) => (
            <CheckboxRow
              key={l.id}
              label={l.label}
              count={l.count}
              checked={languageFilters.includes(l.id)}
              onToggle={() => onToggleLanguage(l.id)}
            />
          ))}
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

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-border text-text-mid hover:border-gold hover:text-gold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Previous page"
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
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function findCategoryByPreset(preset, categories) {
  if (!preset.match) return null;
  const lc = (s) => (s || '').toLowerCase();
  return (
    categories.find((c) =>
      preset.match.some((m) => lc(c.name).includes(m) || lc(c.slug).includes(m))
    ) || null
  );
}

function ritualPriceOf(r) {
  return Number(r.final_price ?? r.price ?? 0);
}

function ritualDurationMinutes(r) {
  if (typeof r.duration_minutes === 'number') return r.duration_minutes;
  if (typeof r.duration_hours === 'number') return r.duration_hours * 60;
  return null;
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function RitualsListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [rituals, setRituals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  );
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [durationFilters, setDurationFilters] = useState([]);
  const [languageFilters, setLanguageFilters] = useState([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [page, setPage] = useState(1);

  // Fetch rituals + categories on mount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      ritualsApi.list({ page_size: 200 }).catch(() => null),
      ritualsApi.categories().catch(() => null),
    ])
      .then(([listRes, catRes]) => {
        if (cancelled) return;
        const list = Array.isArray(listRes)
          ? listRes
          : listRes?.results ?? [];
        const cats = Array.isArray(catRes) ? catRes : catRes?.results ?? [];
        setRituals(Array.isArray(list) ? list : []);
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync URL with category/search
  useEffect(() => {
    const next = {};
    if (search) next.search = search;
    if (selectedCategory) next.category = selectedCategory;
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedCategory]);

  // Reset to first page whenever a filter changes
  useEffect(() => {
    setPage(1);
  }, [
    search,
    selectedCategory,
    maxPrice,
    durationFilters,
    languageFilters,
    sortBy,
  ]);

  const categoryCounts = useMemo(() => {
    const acc = {};
    rituals.forEach((r) => {
      const cid =
        r.category_id ?? r.category?.id ?? r.category_slug ?? r.category_name;
      if (cid != null) acc[cid] = (acc[cid] || 0) + 1;
    });
    return acc;
  }, [rituals]);

  const filteredRituals = useMemo(() => {
    const q = search.trim().toLowerCase();
    let out = rituals.filter((r) => {
      // search
      if (q && !((r.name || '').toLowerCase().includes(q))) return false;
      // category
      if (selectedCategory) {
        const cid =
          r.category_id ?? r.category?.id ?? r.category_slug ?? r.category_name;
        if (String(cid) !== String(selectedCategory)) return false;
      }
      // price
      if (ritualPriceOf(r) > maxPrice) return false;
      // duration (only filters when ritual has duration data; otherwise pass)
      if (durationFilters.length > 0) {
        const dur = ritualDurationMinutes(r);
        if (dur != null) {
          const ok = durationFilters.some((id) => {
            const bucket = DURATION_BUCKETS.find((b) => b.id === id);
            if (!bucket) return false;
            if (bucket.min != null && dur < bucket.min) return false;
            if (bucket.max != null && dur > bucket.max) return false;
            return true;
          });
          if (!ok) return false;
        }
      }
      // language (no backend field — filter is no-op)
      return true;
    });

    // sort
    const cmp = {
      popularity: (a, b) =>
        (Number(b.total_reviews ?? 0)) - (Number(a.total_reviews ?? 0)),
      'price-asc': (a, b) => ritualPriceOf(a) - ritualPriceOf(b),
      'price-desc': (a, b) => ritualPriceOf(b) - ritualPriceOf(a),
      rating: (a, b) =>
        (Number(b.rating ?? 0)) - (Number(a.rating ?? 0)),
    }[sortBy];
    if (cmp) out = [...out].sort(cmp);

    return out;
  }, [
    rituals,
    search,
    selectedCategory,
    maxPrice,
    durationFilters,
    languageFilters,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredRituals.length / PAGE_SIZE));
  const pagedRituals = filteredRituals.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleClearAll = () => {
    setSearch('');
    setSelectedCategory('');
    setMaxPrice(PRICE_MAX);
    setDurationFilters([]);
    setLanguageFilters([]);
    setSortBy('popularity');
  };

  const onPillClick = (preset) => {
    if (!preset.match) {
      setSelectedCategory('');
      return;
    }
    const matched = findCategoryByPreset(preset, categories);
    if (matched) {
      setSelectedCategory(matched.id ?? matched.slug ?? matched.name);
    } else {
      // No matching backend category — visually "select" but don't filter
      setSelectedCategory('');
    }
  };

  const isPillActive = (preset) => {
    if (!preset.match) return selectedCategory === '';
    const matched = findCategoryByPreset(preset, categories);
    if (!matched) return false;
    return (
      String(selectedCategory) ===
      String(matched.id ?? matched.slug ?? matched.name)
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
        <span className="text-text-dark font-medium">Rituals</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
        <FilterSidebar
          totalCount={rituals.length}
          categories={categories}
          categoryCounts={categoryCounts}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          maxPrice={maxPrice}
          onPriceChange={setMaxPrice}
          durationFilters={durationFilters}
          onToggleDuration={(id) =>
            setDurationFilters((f) =>
              f.includes(id) ? f.filter((x) => x !== id) : [...f, id]
            )
          }
          languageFilters={languageFilters}
          onToggleLanguage={(id) =>
            setLanguageFilters((f) =>
              f.includes(id) ? f.filter((x) => x !== id) : [...f, id]
            )
          }
          onClearAll={handleClearAll}
        />

        <main className="flex-1 min-w-0">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="font-heading text-3xl font-bold text-text-dark">
              All Rituals
            </h1>
            <p className="text-text-mid mt-1">
              Find the perfect ritual for every occasion and need.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-16 h-1 bg-gold rounded-full" />
              <span className="text-gold text-sm">✦</span>
            </div>
          </div>

          {/* Top bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none"
              />
              <input
                type="search"
                placeholder="Search rituals..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-dark placeholder-text-light focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
              />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-border rounded-xl pl-4 pr-10 py-2.5 text-sm text-text-dark focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all cursor-pointer"
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
            <button
              type="button"
              className="flex items-center gap-2 border-2 border-border rounded-xl px-4 py-2.5 text-sm font-semibold text-text-dark hover:border-gold hover:text-gold transition-all lg:hidden"
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>
          </div>

          {/* Category pills row */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mb-6">
            {PILL_PRESETS.map((preset) => {
              const active = isPillActive(preset);
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onPillClick(preset)}
                  className={`flex-shrink-0 flex items-center gap-2 rounded-2xl border px-6 py-3 text-sm transition-all whitespace-nowrap ${
                    active
                      ? 'bg-gold/10 border-gold text-gold font-semibold'
                      : 'bg-white border-border text-text-dark hover:border-gold/50'
                  }`}
                >
                  <span className="text-base">{preset.emoji}</span>
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array(10)
                .fill(0)
                .map((_, i) => (
                  <CardShimmer key={i} />
                ))}
            </div>
          ) : pagedRituals.length === 0 ? (
            <div className="text-center py-16 bg-white border border-border rounded-2xl">
              <div className="text-6xl text-gold/20 mb-2">ॐ</div>
              <h3 className="font-heading text-lg text-text-dark">
                No rituals match your filters
              </h3>
              <p className="text-text-light text-sm mt-1">
                Try clearing some filters or searching with different keywords.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {pagedRituals.map((r) => (
                <RitualCard key={r.id} r={r} />
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

      {/* Floating Need Help button */}
      <button
        type="button"
        onClick={() => navigate('/bookings')}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-gold text-white px-3 py-6 rounded-l-2xl font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow z-30"
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        aria-label="Need help?"
      >
        Need Help? 💬
      </button>
    </div>
  );
}
