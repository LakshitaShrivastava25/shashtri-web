import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/AppLayout';

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: '🛕',
    title: 'Choose a Ritual',
    desc: 'Browse from 50+ authentic Hindu rituals and ceremonies for every occasion.',
  },
  {
    step: '02',
    icon: '📿',
    title: 'Select a Pandit',
    desc: 'Pick from verified, experienced Pandits matched to your tradition and location.',
  },
  {
    step: '03',
    icon: '🙏',
    title: 'Confirm Booking',
    desc: 'Choose your date, time, and address. Pandit arrives at your doorstep.',
  },
];

const FEATURED_RITUALS = [
  {
    emoji: '🙏',
    name: 'Satyanarayan Katha',
    desc: "Sacred narration of Lord Vishnu's glory for prosperity and well-being.",
    duration: '2-3 hrs',
    price: '₹2,100',
    tags: ['Panchamrit', 'Fruits', 'Flowers'],
  },
  {
    emoji: '🏠',
    name: 'Griha Pravesh Puja',
    desc: 'Havan and pooja for entering a new home with divine blessings.',
    duration: '3-4 hrs',
    price: '₹5,100',
    tags: ['Havan Samagri', 'Ghee', 'Coconut'],
  },
  {
    emoji: '📖',
    name: 'Sunderkand Path',
    desc: 'Recitation of Sunderkand from Ramcharitmanas for removing obstacles.',
    duration: '2-3 hrs',
    price: '₹1,500',
    tags: ['Ramcharitmanas', 'Flowers', 'Prasad'],
  },
  {
    emoji: '🐘',
    name: 'Ganesh Puja',
    desc: 'Invoke Lord Ganesh to remove obstacles and bring success.',
    duration: '1-2 hrs',
    price: '₹1,100',
    tags: ['Modak', 'Durva Grass', 'Red Flowers'],
  },
  {
    emoji: '💰',
    name: 'Lakshmi Puja',
    desc: 'Worship Goddess Lakshmi for wealth, fortune and prosperity.',
    duration: '1.5-2 hrs',
    price: '₹2,100',
    tags: ['Lotus Flowers', 'Kumkum', 'Rice'],
  },
  {
    emoji: '🔱',
    name: 'Rudrabhishek',
    desc: "Sacred abhishek of Lord Shiva's Shivling with holy items.",
    duration: '2-3 hrs',
    price: '₹3,500',
    tags: ['Milk', 'Honey', 'Bel Patra'],
  },
];

const WHY_FEATURES = [
  {
    emoji: '✅',
    title: 'Verified Pandits',
    desc: 'All Pandits are background-verified and certified',
  },
  {
    emoji: '🕐',
    title: 'On Time',
    desc: 'Punctual service, every time without fail',
  },
  {
    emoji: '🏆',
    title: 'All Traditions',
    desc: 'North, South, Vaishnava, Shaivite & more',
  },
  {
    emoji: '📱',
    title: 'Easy Booking',
    desc: 'Book in 2 minutes, confirm instantly',
  },
];

const HERO_STATS = [
  ['500+', 'Pandits'],
  ['50+', 'Pooja Types'],
  ['10K+', 'Bookings'],
];

function MandalaOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 20 }}
      aria-hidden="true"
    >
      {/* 1 — Top left (saffron-area, white stroke) */}
      <div className="absolute" style={{ top: '-60px', left: '-60px', opacity: 0.12 }}>
        <svg width="380" height="380" viewBox="0 0 380 380" fill="none" stroke="white" strokeWidth="0.8">
          <circle cx="190" cy="190" r="170" />
          <circle cx="190" cy="190" r="140" />
          <circle cx="190" cy="190" r="110" />
          <circle cx="190" cy="190" r="80" />
          <circle cx="190" cy="190" r="50" />
          <circle cx="190" cy="190" r="20" />
          <line x1="190" y1="20" x2="190" y2="360" />
          <line x1="20" y1="190" x2="360" y2="190" />
          <line x1="70" y1="70" x2="310" y2="310" />
          <line x1="310" y1="70" x2="70" y2="310" />
          <circle cx="190" cy="190" r="8" fill="white" opacity="0.3" />
        </svg>
      </div>

      {/* 2 — Top right (saffron-area, white stroke) */}
      <div className="absolute" style={{ top: '-40px', right: '-80px', opacity: 0.10 }}>
        <svg width="320" height="320" viewBox="0 0 320 320" fill="none" stroke="white" strokeWidth="0.8">
          <circle cx="160" cy="160" r="145" />
          <circle cx="160" cy="160" r="115" />
          <circle cx="160" cy="160" r="85" />
          <circle cx="160" cy="160" r="55" />
          <circle cx="160" cy="160" r="25" />
          <line x1="160" y1="15" x2="160" y2="305" />
          <line x1="15" y1="160" x2="305" y2="160" />
          <line x1="57" y1="57" x2="263" y2="263" />
          <line x1="263" y1="57" x2="57" y2="263" />
          <circle cx="160" cy="160" r="7" fill="white" opacity="0.25" />
        </svg>
      </div>

      {/* 3 — Center left, 25% (saffron-area, white stroke) */}
      <div className="absolute" style={{ top: '25%', left: '-100px', opacity: 0.08 }}>
        <svg width="420" height="420" viewBox="0 0 420 420" fill="none" stroke="white" strokeWidth="0.9">
          <circle cx="210" cy="210" r="200" />
          <circle cx="210" cy="210" r="165" />
          <circle cx="210" cy="210" r="130" />
          <circle cx="210" cy="210" r="95" />
          <circle cx="210" cy="210" r="60" />
          <circle cx="210" cy="210" r="28" />
          <line x1="210" y1="10" x2="210" y2="410" />
          <line x1="10" y1="210" x2="410" y2="210" />
          <line x1="68" y1="68" x2="352" y2="352" />
          <line x1="352" y1="68" x2="68" y2="352" />
          <line x1="210" y1="10" x2="368" y2="310" />
          <line x1="210" y1="10" x2="52" y2="310" />
          <circle cx="210" cy="210" r="10" fill="white" opacity="0.2" />
        </svg>
      </div>

      {/* 4 — Center right, 38% (saffron-area, white stroke) */}
      <div className="absolute" style={{ top: '38%', right: '-60px', opacity: 0.09 }}>
        <svg width="350" height="350" viewBox="0 0 350 350" fill="none" stroke="white" strokeWidth="0.8">
          <circle cx="175" cy="175" r="160" />
          <circle cx="175" cy="175" r="125" />
          <circle cx="175" cy="175" r="90" />
          <circle cx="175" cy="175" r="55" />
          <circle cx="175" cy="175" r="22" />
          <line x1="175" y1="15" x2="175" y2="335" />
          <line x1="15" y1="175" x2="335" y2="175" />
          <line x1="62" y1="62" x2="288" y2="288" />
          <line x1="288" y1="62" x2="62" y2="288" />
          <circle cx="175" cy="175" r="8" fill="white" opacity="0.25" />
        </svg>
      </div>

      {/* 5 — Center, 52% (parchment-area, gold stroke) */}
      <div className="absolute" style={{ top: '52%', left: '35%', opacity: 0.07 }}>
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" stroke="#F4A623" strokeWidth="0.7">
          <circle cx="150" cy="150" r="135" />
          <circle cx="150" cy="150" r="105" />
          <circle cx="150" cy="150" r="75" />
          <circle cx="150" cy="150" r="45" />
          <circle cx="150" cy="150" r="18" />
          <line x1="150" y1="15" x2="150" y2="285" />
          <line x1="15" y1="150" x2="285" y2="150" />
          <line x1="54" y1="54" x2="246" y2="246" />
          <line x1="246" y1="54" x2="54" y2="246" />
          <circle cx="150" cy="150" r="6" fill="#F4A623" opacity="0.2" />
        </svg>
      </div>

      {/* 6 — Left, 63% (parchment-area, gold stroke) */}
      <div className="absolute" style={{ top: '63%', left: '-50px', opacity: 0.10 }}>
        <svg width="360" height="360" viewBox="0 0 360 360" fill="none" stroke="#F4A623" strokeWidth="0.8">
          <circle cx="180" cy="180" r="165" />
          <circle cx="180" cy="180" r="130" />
          <circle cx="180" cy="180" r="95" />
          <circle cx="180" cy="180" r="60" />
          <circle cx="180" cy="180" r="28" />
          <line x1="180" y1="15" x2="180" y2="345" />
          <line x1="15" y1="180" x2="345" y2="180" />
          <line x1="63" y1="63" x2="297" y2="297" />
          <line x1="297" y1="63" x2="63" y2="297" />
          <circle cx="180" cy="180" r="9" fill="#F4A623" opacity="0.25" />
        </svg>
      </div>

      {/* 7 — Right, 70% (parchment-area, gold stroke) */}
      <div className="absolute" style={{ top: '70%', right: '-90px', opacity: 0.09 }}>
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none" stroke="#F4A623" strokeWidth="0.9">
          <circle cx="200" cy="200" r="185" />
          <circle cx="200" cy="200" r="148" />
          <circle cx="200" cy="200" r="111" />
          <circle cx="200" cy="200" r="74" />
          <circle cx="200" cy="200" r="37" />
          <line x1="200" y1="15" x2="200" y2="385" />
          <line x1="15" y1="200" x2="385" y2="200" />
          <line x1="69" y1="69" x2="331" y2="331" />
          <line x1="331" y1="69" x2="69" y2="331" />
          <circle cx="200" cy="200" r="10" fill="#F4A623" opacity="0.2" />
        </svg>
      </div>

      {/* 8 — Bottom left (CTA/footer-area, white stroke) */}
      <div className="absolute" style={{ bottom: '-80px', left: '10%', opacity: 0.11 }}>
        <svg width="340" height="340" viewBox="0 0 340 340" fill="none" stroke="white" strokeWidth="0.8">
          <circle cx="170" cy="170" r="155" />
          <circle cx="170" cy="170" r="120" />
          <circle cx="170" cy="170" r="85" />
          <circle cx="170" cy="170" r="52" />
          <circle cx="170" cy="170" r="22" />
          <line x1="170" y1="15" x2="170" y2="325" />
          <line x1="15" y1="170" x2="325" y2="170" />
          <line x1="59" y1="59" x2="281" y2="281" />
          <line x1="281" y1="59" x2="59" y2="281" />
          <circle cx="170" cy="170" r="8" fill="white" opacity="0.25" />
        </svg>
      </div>

      {/* 9 — Bottom right (CTA/footer-area, white stroke) */}
      <div className="absolute" style={{ bottom: '-60px', right: '5%', opacity: 0.09 }}>
        <svg width="380" height="380" viewBox="0 0 380 380" fill="none" stroke="white" strokeWidth="0.8">
          <circle cx="190" cy="190" r="170" />
          <circle cx="190" cy="190" r="135" />
          <circle cx="190" cy="190" r="100" />
          <circle cx="190" cy="190" r="65" />
          <circle cx="190" cy="190" r="30" />
          <line x1="190" y1="20" x2="190" y2="360" />
          <line x1="20" y1="190" x2="360" y2="190" />
          <line x1="70" y1="70" x2="310" y2="310" />
          <line x1="310" y1="70" x2="70" y2="310" />
          <circle cx="190" cy="190" r="9" fill="white" opacity="0.2" />
        </svg>
      </div>

      {/* 10 — Center, 83% (CTA/footer-area, white stroke) */}
      <div className="absolute" style={{ top: '83%', left: '55%', opacity: 0.08 }}>
        <svg width="280" height="280" viewBox="0 0 280 280" fill="none" stroke="white" strokeWidth="0.7">
          <circle cx="140" cy="140" r="125" />
          <circle cx="140" cy="140" r="95" />
          <circle cx="140" cy="140" r="65" />
          <circle cx="140" cy="140" r="38" />
          <circle cx="140" cy="140" r="15" />
          <line x1="140" y1="15" x2="140" y2="265" />
          <line x1="15" y1="140" x2="265" y2="140" />
          <line x1="51" y1="51" x2="229" y2="229" />
          <line x1="229" y1="51" x2="51" y2="229" />
          <circle cx="140" cy="140" r="6" fill="white" opacity="0.2" />
        </svg>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative">
      <MandalaOverlay />
      <PublicLayout>
      {/* SECTION 1 — Hero */}
      <section
        className="relative z-10 min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #B8390E 0%, #E07B20 35%, #F4A623 65%, #C4501A 100%)',
        }}
      >
        <div
          className="absolute opacity-10 pointer-events-none"
          style={{ top: '50%', right: '-100px', transform: 'translateY(-50%)' }}
        >
          <svg width="800" height="800" viewBox="0 0 100 100">
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              fontSize="72"
              fontFamily="serif"
              fill="#F4A623"
            >
              ॐ
            </text>
          </svg>
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.25) 100%)',
          }}
        />

        <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full opacity-40 animate-pulse" />
        <div
          className="absolute top-40 right-32 w-1.5 h-1.5 bg-white rounded-full opacity-40 animate-pulse"
          style={{ animationDelay: '0.5s' }}
        />
        <div
          className="absolute bottom-32 left-40 w-2 h-2 bg-white rounded-full opacity-40 animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute bottom-20 right-24 w-1.5 h-1.5 bg-white rounded-full opacity-40 animate-pulse"
          style={{ animationDelay: '1.5s' }}
        />

        <div className="relative z-10 text-center px-5 max-w-4xl mx-auto py-20">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/40 text-white text-sm font-semibold px-5 py-2 rounded-full mb-8">
            ✨ Trusted by 10,000+ Devotees across India
          </div>
          <h1
            className="font-heading text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
          >
            Book a Pandit for
            <br />
            <span style={{ color: '#FFD700' }}>Sacred Poojas</span> at Home
          </h1>
          <p
            className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.2)' }}
          >
            Connect with experienced and verified Pandits for all your religious
            ceremonies. Griha Pravesh, Satyanarayan Katha, Rudrabhishek &amp;
            more.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-10">
            <Link
              to="/login"
              className="bg-gold text-white font-bold text-lg px-8 py-4 rounded-2xl hover:shadow-2xl hover:shadow-gold/40 transition-all hover:scale-105 flex items-center gap-2"
            >
              Book a Pandit Ji →
            </Link>
            <Link
              to="/rituals"
              className="border-2 border-white/40 text-white font-semibold text-lg px-8 py-4 rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2"
            >
              Explore Poojas
            </Link>
          </div>
          <div className="inline-flex items-center gap-12 bg-black/20 backdrop-blur-sm border border-white/20 rounded-2xl px-10 py-4 mt-4 flex-wrap justify-center">
            {HERO_STATS.map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="font-heading text-3xl font-bold text-white">{v}</p>
                <p className="text-white/70 text-sm">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path
              d="M0 80L1440 80L1440 40C1200 80 800 0 600 20C400 40 200 80 0 40L0 80Z"
              fill="#F8EFE3"
            />
          </svg>
        </div>
      </section>

      {/* SECTION 2 — How it works */}
      <section className="relative z-10 py-20 px-5 bg-bg">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            Simple Process
          </p>
          <h2 className="font-heading text-4xl font-bold text-text-dark mb-4">
            How It Works
          </h2>
          <p className="text-text-mid text-lg mb-12">
            Book your puja in 3 simple steps
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((s) => (
              <div
                key={s.step}
                className="relative bg-surface border border-border rounded-3xl p-8 hover:shadow-xl hover:shadow-gold/10 transition-all hover:-translate-y-1 group text-left"
              >
                <div className="absolute -top-4 left-8 bg-gold text-white font-heading font-bold text-sm px-3 py-1 rounded-full">
                  {s.step}
                </div>
                <div className="text-5xl mb-4">{s.icon}</div>
                <h3 className="font-heading text-xl font-bold text-text-dark mb-3">
                  {s.title}
                </h3>
                <p className="text-text-mid leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — Featured rituals */}
      <section
        className="relative z-10 py-20 px-5"
        style={{
          background: 'linear-gradient(180deg, #FFF6EA 0%, #F8EFE3 100%)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
              Our Services
            </p>
            <h2 className="font-heading text-4xl font-bold text-text-dark mb-4">
              Popular Poojas &amp; Havans
            </h2>
            <p className="text-text-mid text-lg">
              Choose from a wide range of sacred rituals performed by experienced
              Pandits
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {FEATURED_RITUALS.map((r) => (
              <Link
                key={r.name}
                to="/rituals"
                className="bg-surface border border-border rounded-3xl p-6 hover:shadow-xl hover:shadow-gold/15 transition-all hover:-translate-y-1 group block"
              >
                <div className="text-4xl mb-4">{r.emoji}</div>
                <h3 className="font-heading text-xl font-bold text-text-dark mb-2 group-hover:text-gold transition-colors">
                  {r.name}
                </h3>
                <p className="text-text-mid text-sm leading-relaxed mb-4">
                  {r.desc}
                </p>
                <div className="flex items-center gap-4 text-sm text-text-light mb-4">
                  <span>⏱ {r.duration}</span>
                  <span className="font-bold text-gold text-base">
                    {r.price}
                  </span>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-text-light font-semibold uppercase tracking-wide mb-2">
                    Samagri
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {r.tags.map((t) => (
                      <span
                        key={t}
                        className="bg-gold-bg text-gold text-xs px-2 py-0.5 rounded-full border border-gold/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="w-full mt-4 bg-gold text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-gold/30 transition-all text-center">
                  Book Now
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/rituals"
              className="inline-block border-2 border-gold text-gold font-semibold px-8 py-3 rounded-2xl hover:bg-gold hover:text-white transition-all"
            >
              View All Rituals →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Why choose us */}
      <section className="relative z-10 py-20 px-5 bg-bg">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-text-dark mb-4">
              Why Choose Shastri Ji?
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {WHY_FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-surface border border-border rounded-2xl p-6 text-center hover:border-gold/40 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-3">{f.emoji}</div>
                <h4 className="font-heading font-bold text-text-dark mb-2">
                  {f.title}
                </h4>
                <p className="text-text-light text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-10 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />

      {/* SECTION 5 — CTA */}
      <section
        className="relative z-10 py-20 px-5 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #B8390E 0%, #E07B20 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <svg width="300" height="300" viewBox="0 0 100 100">
              <text
                x="50%"
                y="60%"
                textAnchor="middle"
                fontSize="72"
                fontFamily="serif"
                fill="#F4A623"
              >
                ॐ
              </text>
            </svg>
          </div>
          <div className="relative">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-4">
              Begin Your Journey
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Ready for a Sacred Ceremony?
            </h2>
            <p className="text-white/70 text-lg mb-10">
              Join thousands of devotees who trust Shastri Ji for their sacred
              rituals
            </p>
            <Link
              to="/login"
              className="bg-gold text-white font-bold text-lg px-10 py-4 rounded-2xl inline-flex items-center gap-2 hover:shadow-2xl hover:shadow-gold/40 transition-all hover:scale-105"
            >
              Book Your First Puja 🙏
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: 'linear-gradient(180deg, #8B2500 0%, #6B1C00 100%)',
        }}
        className="relative z-10 px-5 py-16 overflow-hidden"
      >
        <div className="h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent mb-16" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo-512.webp"
                alt="Shastri Ji logo"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-gold flex-shrink-0"
              />
              <div>
                <p className="font-heading font-bold text-white">Shastri Ji</p>
                <p className="text-white/50 text-xs">Sacred Rituals</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Connecting devotees with verified Pandits for sacred ceremonies at
              home.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-bold text-white mb-4">
              Quick Links
            </h4>
            {['Pooja Services', 'Find Pandit', 'Panchang Calendar', 'Horoscope'].map(
              (l) => (
                <p
                  key={l}
                  className="text-white/60 text-sm mb-2 hover:text-gold cursor-pointer transition-colors"
                >
                  {l}
                </p>
              )
            )}
          </div>
          <div>
            <h4 className="font-heading font-bold text-white mb-4">
              Popular Poojas
            </h4>
            {[
              'Satyanarayan Katha',
              'Griha Pravesh',
              'Rudrabhishek',
              'Ganesh Pooja',
              'Sunderkand Path',
            ].map((l) => (
              <p
                key={l}
                className="text-white/60 text-sm mb-2 hover:text-gold cursor-pointer transition-colors"
              >
                {l}
              </p>
            ))}
          </div>
          <div>
            <h4 className="font-heading font-bold text-white mb-4">
              Contact Us
            </h4>
            <p className="text-white/60 text-sm mb-2">📞 +91 98765 43210</p>
            <p className="text-white/60 text-sm mb-2">✉️ hello@shastriji.com</p>
            <p className="text-white/60 text-sm">📍 Pan India Service</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/10 mt-12 pt-6 flex items-center justify-between flex-wrap gap-4">
          <p className="text-white/40 text-sm">
            © 2026 Shastri Ji. All rights reserved.
          </p>
          <p className="text-white/40 text-sm">🙏 ॐ नमः शिवाय</p>
        </div>
      </footer>
      </PublicLayout>
    </div>
  );
}
