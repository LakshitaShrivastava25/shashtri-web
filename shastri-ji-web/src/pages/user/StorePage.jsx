import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  Truck,
  Lock,
  RotateCcw,
  Star as StarIcon,
  Phone,
} from 'lucide-react';
import TopNavbar from '../../components/layout/TopNavbar';

// ─── Static data ──────────────────────────────────────────────────────────────

const HERO_TRUST = [
  { icon: '🔮', title: '100% Authentic', sub: 'Sourced from trusted vendors' },
  { icon: '🪔', title: 'Puja Ready', sub: 'Cleaned & packed with care' },
  { icon: '🚚', title: 'Fast Delivery', sub: 'Across India' },
  { icon: '📦', title: 'Secure Packaging', sub: 'Safe & tamper-proof' },
];

const SIDEBAR_CATEGORIES = [
  { id: '', label: 'All Categories' },
  { id: 'puja-kits', label: 'Puja Kits' },
  { id: 'puja-samagri', label: 'Puja Samagri' },
  { id: 'havan-samagri', label: 'Havan Samagri' },
  { id: 'idols', label: 'Idols & Murti' },
  { id: 'dhoop', label: 'Dhoop & Agarbatti' },
];

const RATING_FILTERS = [
  { id: '4', label: '4 & above', stars: 5 },
  { id: '3', label: '3 & above', stars: 4 },
  { id: '2', label: '2 & above', stars: 3 },
  { id: '1', label: '1 & above', stars: 2 },
];

const SHOP_CATEGORIES = [
  { id: 'puja-kits', emoji: '🏺', name: 'Puja Kits' },
  { id: 'puja-samagri', emoji: '🪔', name: 'Puja Samagri' },
  { id: 'havan-samagri', emoji: '🔥', name: 'Havan Samagri' },
  { id: 'idols', emoji: '🪆', name: 'Idols & Murti' },
  { id: 'dhoop', emoji: '🌿', name: 'Dhoop & Agarbatti' },
  { id: 'rudraksha', emoji: '📿', name: 'Rudraksha' },
  { id: 'yantra', emoji: '🔯', name: 'Yantra' },
  { id: 'books', emoji: '📚', name: 'Books' },
  { id: 'decor', emoji: '🎁', name: 'Decor & Gifts' },
];

const PRODUCTS = [
  { id: 1, name: 'Complete Puja Kit', subtitle: 'Thali with Samagri', rating: 4.8, reviews: 256, price: 999, category: 'puja-kits' },
  { id: 2, name: 'Brass Panch Aarti Diya', subtitle: '', rating: 4.7, reviews: 182, price: 499, category: 'puja-samagri' },
  { id: 3, name: 'Havan Samagri', subtitle: 'Premium', rating: 4.6, reviews: 142, price: 299, category: 'havan-samagri' },
  { id: 4, name: '5 Mukhi Rudraksha Mala', subtitle: '', rating: 4.9, reviews: 312, price: 799, category: 'rudraksha' },
  { id: 5, name: 'Premium Dhoop Sticks', subtitle: 'Pack of 3', rating: 4.5, reviews: 98, price: 249, category: 'dhoop' },
  { id: 6, name: 'Shree Vishnu Sahasranamam', subtitle: 'Hindi', rating: 4.8, reviews: 201, price: 199, category: 'books' },
];

const SORT_OPTIONS = [
  { id: 'popularity', label: 'Popularity' },
  { id: 'rating', label: 'Rating' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
];

const FOOTER_FEATURES = [
  { Icon: Truck, title: 'Pan India Delivery', subtitle: 'Delivering happiness across India' },
  { Icon: Lock, title: 'Secure Payments', subtitle: '100% safe & secure payment options' },
  { Icon: RotateCcw, title: 'Easy Returns', subtitle: 'Hassle-free returns within 7 days' },
  { Icon: StarIcon, title: 'Quality Assured', subtitle: 'Premium quality products you can trust' },
  { Icon: Phone, title: '24/7 Support', subtitle: 'We are here to help you anytime' },
];

const PRICE_MIN = 0;
const PRICE_MAX = 5000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function MandalaTile() {
  return (
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
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroBanner() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: '208px',
        background:
          'linear-gradient(135deg, #FEF3C7 0%, #FDF6E3 60%, #FEF9F0 100%)',
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none">
        <svg
          viewBox="0 0 200 200"
          className="w-[420px] h-[420px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            transform="translate(100,100)"
            fill="none"
            stroke="#F4A623"
            strokeWidth="0.8"
          >
            {[20, 40, 60, 80].map((r) => (
              <circle key={r} r={r} />
            ))}
            {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((a) => (
              <g key={a} transform={`rotate(${a})`}>
                <line x1="0" y1="20" x2="0" y2="80" />
                <ellipse cx="0" cy="35" rx="4" ry="8" />
              </g>
            ))}
          </g>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-12 py-8 h-full relative flex items-center">
        <div className="w-[55%]">
          <h1 className="font-heading text-4xl font-bold text-text-dark">
            Store
          </h1>
          <p className="text-sm text-text-light mt-1">
            Explore pure and authentic puja samagri delivered to your doorstep.
          </p>
          <div className="flex flex-wrap gap-6 mt-4">
            {HERO_TRUST.map((b) => (
              <div key={b.title} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white text-sm flex-shrink-0">
                  {b.icon}
                </div>
                <div>
                  <p className="font-bold text-xs text-text-dark leading-tight">
                    {b.title}
                  </p>
                  <p className="text-xs text-text-light leading-tight">
                    {b.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute right-0 top-0 h-full hidden md:block"
        style={{ width: '40%' }}
      >
        <img
          src="/store-hero.webp"
          alt="Store"
          className="w-full h-full object-cover object-right"
          style={{ mixBlendMode: 'multiply' }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    </section>
  );
}

// ─── Filter sidebar ───────────────────────────────────────────────────────────

function FilterSidebar({
  selectedCategory,
  onSelectCategory,
  maxPrice,
  onPriceChange,
  ratingFilters,
  onToggleRating,
  onClearAll,
}) {
  return (
    <aside className="w-52 flex-shrink-0 hidden lg:block">
      <div className="bg-white border border-border rounded-xl p-4 sticky top-20 self-start">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal size={16} className="text-text-dark" />
          <h2 className="font-semibold text-text-dark">Filters</h2>
        </div>

        <div className="border-b border-border pb-3">
          <p className="text-sm font-semibold text-text-dark mb-2">Categories</p>
          <div className="space-y-2">
            {SIDEBAR_CATEGORIES.map((c) => {
              const checked = selectedCategory === c.id;
              return (
                <button
                  key={c.id || 'all'}
                  type="button"
                  onClick={() => onSelectCategory(c.id)}
                  className="flex items-center gap-2 w-full text-sm text-text-dark hover:text-gold"
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      checked ? 'border-gold' : 'border-border'
                    }`}
                  >
                    {checked && (
                      <span className="w-2 h-2 rounded-full bg-gold" />
                    )}
                  </span>
                  <span className="truncate">{c.label}</span>
                </button>
              );
            })}
            <button
              type="button"
              className="text-xs text-gold font-semibold hover:underline mt-1"
            >
              + More Categories
            </button>
          </div>
        </div>

        <div className="border-b border-border py-3">
          <p className="text-sm font-semibold text-text-dark mb-2">Price Range</p>
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={100}
            value={maxPrice}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="w-full accent-gold"
          />
          <div className="flex justify-between text-xs text-text-light mt-1">
            <span>₹{PRICE_MIN}</span>
            <span>₹{maxPrice.toLocaleString('en-IN')}+</span>
          </div>
        </div>

        <div className="py-3">
          <p className="text-sm font-semibold text-text-dark mb-2">Ratings</p>
          <div className="space-y-2">
            {RATING_FILTERS.map((r) => {
              const checked = ratingFilters.includes(r.id);
              return (
                <label
                  key={r.id}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleRating(r.id)}
                    className="w-4 h-4 accent-gold rounded"
                  />
                  <span className="text-gold tracking-tighter">
                    {'★'.repeat(r.stars)}
                  </span>
                  <span className="text-text-light text-xs">{r.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className="mt-2 w-full border-2 border-gold text-gold rounded-xl py-2 text-sm font-semibold hover:bg-gold hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={14} />
          Clear All Filters
        </button>
      </div>
    </aside>
  );
}

// ─── Category strip ───────────────────────────────────────────────────────────

function ShopByCategory({ onSelectCategory }) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl font-bold text-text-dark">
          Shop by Category
        </h2>
        <button
          type="button"
          className="text-sm font-semibold text-gold hover:underline"
        >
          View All Categories →
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {SHOP_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectCategory(c.id)}
            className="card-hover flex-shrink-0 w-32 bg-white rounded-xl border border-border p-4 text-center cursor-pointer hover:border-gold hover:shadow-sm transition-all"
          >
            <div className="text-3xl mb-2">{c.emoji}</div>
            <p className="text-sm font-medium text-text-dark line-clamp-2 leading-tight">
              {c.name}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

// ─── Product card ─────────────────────────────────────────────────────────────

function ProductCard({ p }) {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate('/store/product/' + p.id)}
      className="bg-white rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col cursor-pointer"
    >
      <div className="relative h-40 bg-amber-50">
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling)
                e.target.nextSibling.style.display = 'block';
            }}
          />
        ) : null}
        <div
          className="absolute inset-0"
          style={{ display: p.image ? 'none' : 'block' }}
        >
          <MandalaTile />
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setLiked((v) => !v);
          }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
          aria-label="Wishlist"
        >
          <Heart
            size={14}
            className={
              liked ? 'fill-red-500 text-red-500' : 'text-text-mid'
            }
          />
        </button>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-sm text-text-dark line-clamp-2 leading-tight">
          {p.name}
        </h3>
        {p.subtitle && (
          <p className="text-xs text-text-light truncate mt-0.5">
            {p.subtitle}
          </p>
        )}
        <div className="flex items-center gap-1 mt-1 text-xs">
          <span className="text-gold">★</span>
          <span className="font-semibold text-text-dark">
            {Number(p.rating).toFixed(1)}
          </span>
          <span className="text-text-light">({p.reviews})</span>
        </div>
        <p className="text-gold font-bold text-base mt-1">
          ₹{Number(p.price).toLocaleString('en-IN')}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/store/product/' + p.id);
          }}
          className="mt-2 w-full border-2 border-gold text-gold text-xs font-semibold py-1.5 rounded-lg hover:bg-gold hover:text-white transition-all flex items-center justify-center gap-1"
        >
          <ShoppingCart size={12} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

// ─── Best sellers section ─────────────────────────────────────────────────────

function BestSellers({ items, sortBy, onSortChange }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="font-heading text-xl font-bold text-text-dark">
          Best Sellers
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-light">Sort by:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
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

      {items.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl text-center py-16">
          <div className="text-5xl mb-2">🛍️</div>
          <h3 className="font-heading text-lg text-text-dark">
            No products match your filters
          </h3>
          <p className="text-text-light text-sm mt-1">
            Try adjusting filters or clearing them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-6">
        <button
          type="button"
          className="border-2 border-gold text-gold rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-gold hover:text-white transition-all flex items-center gap-2"
        >
          View All Products
          <ChevronRight size={14} />
        </button>
      </div>
    </section>
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

export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [ratingFilters, setRatingFilters] = useState([]);
  const [sortBy, setSortBy] = useState('popularity');

  const filtered = useMemo(() => {
    let out = PRODUCTS.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (Number(p.price) > maxPrice) return false;
      if (ratingFilters.length > 0) {
        const minRating = Math.min(...ratingFilters.map((r) => Number(r)));
        if (Number(p.rating) < minRating) return false;
      }
      return true;
    });

    const cmp = {
      popularity: (a, b) => Number(b.reviews) - Number(a.reviews),
      rating: (a, b) => Number(b.rating) - Number(a.rating),
      'price-asc': (a, b) => Number(a.price) - Number(b.price),
      'price-desc': (a, b) => Number(b.price) - Number(a.price),
    }[sortBy];
    if (cmp) out = [...out].sort(cmp);

    return out;
  }, [selectedCategory, maxPrice, ratingFilters, sortBy]);

  const handleClearAll = () => {
    setSelectedCategory('');
    setMaxPrice(PRICE_MAX);
    setRatingFilters([]);
    setSortBy('popularity');
  };

  const toggleRating = (id) => {
    setRatingFilters((arr) =>
      arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]
    );
  };

  return (
    <div className="min-h-screen bg-bg">
      <TopNavbar />

      <div className="max-w-7xl mx-auto px-6 pt-3 text-sm text-text-light">
        <Link to="/home" className="hover:text-gold transition-colors">
          Home
        </Link>{' '}
        <span className="text-text-light/60">›</span>{' '}
        <span className="text-text-dark font-medium">Store</span>
      </div>

      <HeroBanner />

      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
        <FilterSidebar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          maxPrice={maxPrice}
          onPriceChange={setMaxPrice}
          ratingFilters={ratingFilters}
          onToggleRating={toggleRating}
          onClearAll={handleClearAll}
        />

        <main className="flex-1 min-w-0">
          <ShopByCategory onSelectCategory={setSelectedCategory} />
          <BestSellers
            items={filtered}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </main>
      </div>

      <BottomFeaturesBar />
    </div>
  );
}
