import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Tag,
  Lock,
  Clock,
  Headphones,
  CreditCard,
  Home as HomeIcon,
  MapPin,
} from 'lucide-react';
import TopNavbar from '../../components/layout/TopNavbar';
import { useHomeStore } from '../../store/homeStore';
import { useAuthStore } from '../../store/authStore';

const STATS = [
  { value: '10,000+', label: 'Bookings', icon: '🙏' },
  { value: '300+', label: 'Pandits', icon: '📿' },
  { value: '4.8★', label: 'Rating', icon: '⭐' },
];

const TRUST_FEATURES = [
  { Icon: Headphones, title: '24/7 Customer Support', subtitle: 'Always here to help' },
  { Icon: Clock, title: 'On-time Rituals', subtitle: 'Punctual every time' },
  { Icon: CreditCard, title: 'Book Now Pay Later', subtitle: 'Flexible payment' },
  { Icon: HomeIcon, title: 'Puja at Home', subtitle: 'Doorstep service' },
  { Icon: MapPin, title: 'Live Tracking', subtitle: 'Real-time updates' },
];

const TRUST_BADGES = [
  {
    Icon: ShieldCheck,
    title: 'Verified & Experienced Pandits',
    subtitle: '100% background verified',
  },
  {
    Icon: Sparkles,
    title: '100% Authentic Rituals',
    subtitle: 'According to scriptures',
  },
  {
    Icon: Tag,
    title: 'Transparent Pricing',
    subtitle: 'No hidden charges',
  },
  {
    Icon: Lock,
    title: 'Secure & Easy Booking',
    subtitle: 'Hassle-free experience',
  },
];

const HeroVisual = () => (
  <div className="w-full h-full relative overflow-hidden">
    <img
      src="/hero-puja.webp"
      alt="Puja"
      className="w-full h-full object-cover object-center"
      onError={(e) => {
        e.target.style.display = 'none';
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(to right, #F8EFE3 0%, rgba(248,239,227,0) 35%)',
      }}
    />
    <div className="absolute inset-0 bg-amber-900/10" />
  </div>
);

function HeroMandalaWatermark() {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
      <svg
        viewBox="0 0 200 200"
        className="w-[320px] h-[320px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          transform="translate(100,100)"
          fill="none"
          stroke="#F4A623"
          strokeWidth="0.8"
        >
          <circle r="10" />
          <circle r="20" />
          <circle r="30" />
          <circle r="40" />
          <circle r="50" />
          <circle r="60" />
          <circle r="70" />
          <circle r="80" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <line x1="0" y1="10" x2="0" y2="80" />
              <ellipse cx="0" cy="25" rx="6" ry="12" />
              <ellipse cx="0" cy="50" rx="4" ry="8" />
              <ellipse cx="0" cy="70" rx="3" ry="5" />
            </g>
          ))}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <circle cx="0" cy="35" r="3" />
              <circle cx="0" cy="60" r="2" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

function HeroSlide({ userName }) {
  const firstName = userName?.split(' ')[0] || 'Devotee';

  return (
    <div className="relative w-full h-full flex">
      <div
        className="relative w-full md:w-[45%] flex-shrink-0 flex flex-col justify-center px-8 py-6"
        style={{ background: '#F8EFE3' }}
      >
        <HeroMandalaWatermark />
        <div className="relative z-10 max-w-md">
          <p
            className="font-medium mb-1"
            style={{ color: '#F4A623', fontSize: '16px' }}
          >
            Namaste, {firstName} 🙏
          </p>
          <h1
            className="font-heading text-text-dark mb-3"
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            Book Authentic Pujas with Verified Pandits
          </h1>
          <p
            className="text-text-mid mt-3"
            style={{ fontSize: '15px' }}
          >
            Bringing peace, prosperity &amp; positivity to your life
          </p>
          <div className="flex gap-3 mt-6 flex-wrap">
            <Link
              to="/rituals"
              className="bg-gold text-white font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-gold/30 transition-all"
            >
              📅 Book Your Puja
            </Link>
            <Link
              to="/rituals"
              className="border-2 border-gold text-gold font-semibold px-5 py-2.5 rounded-xl hover:bg-gold-bg transition-all"
            >
              ⊞ Explore Rituals
            </Link>
          </div>
        </div>
      </div>

      <div className="relative flex-1 hidden md:block">
        <HeroVisual />
        <div
          className="absolute inset-y-0 left-0 w-24 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, #F8EFE3 0%, rgba(248,239,227,0) 100%)',
          }}
        />
      </div>
    </div>
  );
}

function ApiBannerSlide({ banner }) {
  return (
    <div className="relative w-full h-full">
      {banner.image && (
        <img
          src={banner.image}
          alt={banner.title || 'banner'}
          className="w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-6 left-6 max-w-[70%]">
        {banner.title && (
          <h2 className="font-heading font-bold text-white text-2xl md:text-3xl leading-tight">
            {banner.title}
          </h2>
        )}
        {banner.subtitle && (
          <p className="text-white/80 text-sm md:text-base mt-1">
            {banner.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function HeroCarousel({ banners, userName }) {
  const slides = [{ isHero: true }, ...banners];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(
      () => setIdx((i) => (i + 1) % slides.length),
      5000
    );
    return () => clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    if (idx >= slides.length) setIdx(0);
  }, [slides.length, idx]);

  const cur = slides[idx];

  return (
    <section className="max-w-7xl mx-auto px-6 pt-4">
      <div className="relative h-80 rounded-2xl overflow-hidden">
        {cur?.isHero ? (
          <HeroSlide userName={userName} />
        ) : (
          <ApiBannerSlide banner={cur} />
        )}

        {slides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === idx ? 'w-8 bg-gold' : 'w-2 bg-text-light/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">
      <div className="bg-white border border-border rounded-2xl shadow-sm flex items-stretch divide-x divide-border">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="flex-1 px-6 py-4 flex items-center justify-center gap-3"
          >
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="font-heading font-bold text-lg text-text-dark leading-none">
                {s.value}
              </p>
              <p className="text-xs text-text-light mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RitualCardLarge({ r }) {
  const price = Number(r.final_price ?? r.price ?? 0);
  return (
    <Link
      to={`/rituals/${r.id}`}
      className="card-hover min-w-[220px] max-w-[220px] bg-white border border-border rounded-2xl p-3 flex-shrink-0 block"
    >
      <div className="relative w-full h-32 bg-amber-50 rounded-xl overflow-hidden mb-3">
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
          className="absolute inset-0 bg-amber-50 flex items-center justify-center"
          style={{ display: r.image ? 'none' : 'flex' }}
        >
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full opacity-30 absolute inset-0"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              transform="translate(100,100)"
              fill="none"
              stroke="#F4A623"
              strokeWidth="0.8"
            >
              <circle r="10" />
              <circle r="20" />
              <circle r="30" />
              <circle r="40" />
              <circle r="50" />
              <circle r="60" />
              <circle r="70" />
              <circle r="80" />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
                (a) => (
                  <g key={a} transform={`rotate(${a})`}>
                    <line x1="0" y1="10" x2="0" y2="80" />
                    <ellipse cx="0" cy="25" rx="6" ry="12" />
                    <ellipse cx="0" cy="50" rx="4" ry="8" />
                    <ellipse cx="0" cy="70" rx="3" ry="5" />
                  </g>
                )
              )}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                <g key={a} transform={`rotate(${a})`}>
                  <circle cx="0" cy="35" r="3" />
                  <circle cx="0" cy="60" r="2" />
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>
      <h4 className="font-heading text-sm font-bold text-text-dark line-clamp-1">
        {r.name}
      </h4>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-gold text-xs">★</span>
        <span className="text-xs font-semibold text-text-dark">
          {Number(r.rating ?? 4.8).toFixed(1)}
        </span>
        <span className="text-xs text-text-light">
          ({r.total_reviews ?? 120})
        </span>
      </div>
      <p className="text-gold text-sm font-bold mt-2">
        ₹{price.toLocaleString('en-IN')} onwards
      </p>
      <div className="w-full mt-3 bg-gold text-white text-xs font-semibold py-2 rounded-lg text-center hover:shadow-md hover:shadow-gold/30 transition-all">
        Book Now
      </div>
    </Link>
  );
}

function FeaturedRitualsRow({ items, isLoading }) {
  const ref = useRef(null);
  const scroll = (dir) => {
    if (ref.current) ref.current.scrollBy({ left: dir * 240, behavior: 'smooth' });
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="font-heading text-xl font-bold text-text-dark">
          ✨ Today's Featured Rituals
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-gold/50 hover:text-gold transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-gold/50 hover:text-gold transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
          <Link
            to="/rituals"
            className="text-sm font-semibold text-gold hover:underline ml-2"
          >
            View All →
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="min-w-[220px] h-64 bg-surface-alt rounded-2xl animate-pulse flex-shrink-0"
              />
            ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-text-light text-sm py-6 text-center bg-white border border-border rounded-2xl">
          No featured rituals yet
        </div>
      ) : (
        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x"
        >
          {items.map((r) => (
            <RitualCardLarge key={r.id} r={r} />
          ))}
        </div>
      )}
    </section>
  );
}

function PanditCard({ p }) {
  const initial = p.name?.charAt(0)?.toUpperCase() || '?';
  return (
    <div className="card-hover w-48 flex-shrink-0 bg-white border border-border rounded-2xl p-4 text-center block">
      {p.profile_picture ? (
        <img
          src={p.profile_picture}
          alt={p.name}
          className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-amber-100"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-amber-100 mx-auto flex items-center justify-center text-gold font-heading font-bold text-xl">
          {initial}
        </div>
      )}
      <p className="font-semibold text-sm mt-2 text-text-dark line-clamp-1">
        {p.name}
      </p>
      <p className="text-xs text-text-light line-clamp-1 mt-0.5">
        {p.tradition_name || p.city || '—'}
      </p>
      <div className="flex items-center justify-center gap-1 mt-1">
        <span className="text-gold text-xs">★</span>
        <span className="text-xs font-semibold text-text-dark">
          {Number(p.rating ?? 0).toFixed(1)}
        </span>
        <span className="text-xs text-text-light">
          ({p.total_reviews ?? 0})
        </span>
      </div>
      <Link
        to={`/priests/${p.id}`}
        className="block w-full mt-2 bg-gold text-white text-xs font-semibold py-2 rounded-lg hover:shadow-md hover:shadow-gold/30 transition-all"
      >
        Book Now
      </Link>
    </div>
  );
}

function FeaturedPandits({ items, isLoading }) {
  if (!isLoading && items.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl font-bold text-text-dark">
          🙏 Featured Pandits
        </h2>
        <Link
          to="/priests"
          className="text-sm font-semibold text-gold hover:underline"
        >
          View All →
        </Link>
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="w-48 flex-shrink-0 bg-white border border-border rounded-2xl p-4 animate-pulse"
              >
                <div className="w-16 h-16 rounded-full bg-surface-alt mx-auto" />
                <div className="h-4 bg-surface-alt rounded mt-3 w-3/4 mx-auto" />
                <div className="h-3 bg-surface-alt rounded mt-2 w-1/2 mx-auto" />
                <div className="h-7 bg-surface-alt rounded mt-3" />
              </div>
            ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {items.map((p) => (
            <PanditCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </section>
  );
}

function TrustFeaturesBar() {
  return (
    <section className="bg-white border border-border rounded-2xl p-4 mb-8 grid grid-cols-2 md:grid-cols-5 gap-4">
      {TRUST_FEATURES.map(({ Icon, title, subtitle }) => (
        <div key={title} className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gold-bg rounded-full flex items-center justify-center flex-shrink-0">
            <Icon size={18} className="text-gold" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-text-dark leading-tight">
              {title}
            </p>
            <p className="text-xs text-text-light mt-0.5">{subtitle}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

function TrustBadgesCard() {
  return (
    <div className="bg-white border border-border rounded-2xl p-5">
      <h3 className="font-heading font-bold text-base text-text-dark mb-4">
        Why Shastri Ji?
      </h3>
      <div className="space-y-4">
        {TRUST_BADGES.map(({ Icon, title, subtitle }) => (
          <div key={title} className="flex items-start gap-3">
            <div className="w-9 h-9 bg-gold-bg rounded-full flex items-center justify-center flex-shrink-0">
              <Icon size={16} className="text-gold" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-text-dark leading-tight">
                {title}
              </p>
              <p className="text-xs text-text-light mt-0.5">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HelpCard() {
  return (
    <div className="bg-white border border-border rounded-2xl p-5 text-center">
      <p className="font-heading font-bold text-base text-text-dark mb-1">
        Need Help Booking a Puja?
      </p>
      <p className="text-text-light text-sm mb-4">
        Our experts are here to help you
      </p>
      <a
        href="tel:+919876543210"
        className="inline-block w-full bg-gold text-white font-semibold py-2.5 rounded-xl hover:shadow-md hover:shadow-gold/30 transition-all"
      >
        Connect Now
      </a>
    </div>
  );
}

function SpiritualStoreCard() {
  return (
    <div
      className="rounded-2xl p-5 text-white relative overflow-hidden"
      style={{ background: '#3D1C02' }}
    >
      <div className="absolute right-0 top-0 bottom-0 w-24 flex items-center justify-center opacity-30 text-5xl pointer-events-none">
        📿
      </div>
      <div className="relative">
        <h3 className="font-heading font-bold text-lg mb-1">
          Spiritual Store
        </h3>
        <p className="text-white/70 text-sm mb-4 max-w-[14rem]">
          Shop Puja Samagri, Rudraksha, Books &amp; more
        </p>
        <button
          type="button"
          className="bg-gold text-white font-semibold px-5 py-2 rounded-xl hover:shadow-md hover:shadow-gold/30 transition-all text-sm"
        >
          Visit Store
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuthStore();
  const { banners, featuredRituals, featuredPriests, isLoading } =
    useHomeStore();

  useEffect(() => {
    useHomeStore.getState().loadHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <TopNavbar />

      <HeroCarousel banners={banners} userName={user?.name} />

      <StatsBar />

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-6">
        <main className="flex-1 min-w-0">
          <FeaturedRitualsRow items={featuredRituals} isLoading={isLoading} />
          <FeaturedPandits items={featuredPriests} isLoading={isLoading} />
          <TrustFeaturesBar />
        </main>

        <aside className="w-full lg:w-80 lg:flex-shrink-0 space-y-4 lg:sticky lg:top-20 lg:self-start">
          <TrustBadgesCard />
          <HelpCard />
          <SpiritualStoreCard />
        </aside>
      </div>
    </div>
  );
}
