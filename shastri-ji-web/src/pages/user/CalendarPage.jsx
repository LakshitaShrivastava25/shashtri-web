import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  ChevronLeft,
  ChevronRight,
  Settings2,
  ClipboardCheck,
  Star,
  CalendarDays,
  UserCircle2,
  MapPin,
  Edit3,
  Headphones,
  Download,
} from 'lucide-react';
import TopNavbar from '../../components/layout/TopNavbar';
import { calendarApi } from '../../api/services';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function mondayOfWeek(d) {
  return d.day() === 0 ? d.subtract(6, 'day') : d.startOf('week').add(1, 'day');
}

function buildCalendarDays(currentMonth) {
  const calStart = mondayOfWeek(currentMonth.startOf('month'));
  const days = [];
  for (let i = 0; i < 35; i++) days.push(calStart.add(i, 'day'));
  return days;
}

// ─── Static placeholders ──────────────────────────────────────────────────────

const STATIC_TIMINGS = {
  sunrise: '06:15 AM',
  sunset: '06:10 PM',
  moonrise: '08:42 PM',
  moonset: '07:30 AM',
};

const PANCHANG_TILL = {
  tithi: '11:42 AM',
  nakshatra: '04:18 PM',
  yoga: '09:55 PM',
  karana: '12:32 PM',
};

const MUHURAT_TIMES = [
  { icon: '🚫', name: 'Rahu Kalam', time: '09:00 AM – 10:30 AM' },
  { icon: '⚠️', name: 'Yamaganda', time: '01:30 PM – 03:00 PM' },
  { icon: '🪨', name: 'Gulika Kalam', time: '06:00 AM – 07:30 AM' },
  { icon: '✨', name: 'Abhijit Muhurat', time: '11:50 AM – 12:35 PM' },
  { icon: '💧', name: 'Amrit Kalam', time: '04:30 AM – 06:00 AM' },
  { icon: '🕉️', name: 'Brahma Muhurat', time: '04:30 AM – 05:15 AM' },
  { icon: '🏆', name: 'Vijaya Muhurat', time: '02:30 PM – 03:15 PM' },
  { icon: '🐄', name: 'Godhuli Muhurat', time: '06:00 PM – 06:30 PM' },
  { icon: '🌌', name: 'Nishita Muhurat', time: '11:50 PM – 12:35 AM' },
];

const SAMVAT = {
  chandraRashi: 'Meen',
  paksha: 'Shukla Paksha',
  vikram: '2083',
  shaka: '1948',
  ayana: 'Uttarayana',
  ritu: 'Grishma',
};

const ZODIAC = [
  { id: 'aries', symbol: '♈', name: 'Aries' },
  { id: 'taurus', symbol: '♉', name: 'Taurus' },
  { id: 'gemini', symbol: '♊', name: 'Gemini' },
  { id: 'cancer', symbol: '♋', name: 'Cancer' },
  { id: 'leo', symbol: '♌', name: 'Leo' },
  { id: 'virgo', symbol: '♍', name: 'Virgo' },
  { id: 'libra', symbol: '♎', name: 'Libra' },
  { id: 'scorpio', symbol: '♏', name: 'Scorpio' },
  { id: 'sagittarius', symbol: '♐', name: 'Sagittarius' },
  { id: 'capricorn', symbol: '♑', name: 'Capricorn' },
  { id: 'aquarius', symbol: '♒', name: 'Aquarius' },
  { id: 'pisces', symbol: '♓', name: 'Pisces' },
];

const UPCOMING_DAYS = [
  { emoji: '🪷', name: 'Akshaya Tritiya', date: '14 May 2026', tag: 'Very Auspicious', tagClass: 'bg-green-100 text-green-700' },
  { emoji: '🐘', name: 'Sankashti Chaturthi', date: '17 May 2026', tag: 'Auspicious', tagClass: 'bg-orange-100 text-orange-700' },
  { emoji: '🌕', name: 'Purnima', date: '23 May 2026', tag: 'Very Auspicious', tagClass: 'bg-green-100 text-green-700' },
  { emoji: '🌑', name: 'Amavasya', date: '30 May 2026', tag: 'Auspicious', tagClass: 'bg-orange-100 text-orange-700' },
];

const FOOTER_FEATURES = [
  { Icon: Settings2, title: 'Accurate Panchang', subtitle: 'Calculated to-the-minute precision' },
  { Icon: ClipboardCheck, title: 'Authentic Data', subtitle: 'Verified by Vedic scholars' },
  { Icon: Star, title: 'Daily Horoscope', subtitle: 'Personalised insights for every sign' },
  { Icon: CalendarDays, title: 'Muhurat Finder', subtitle: 'Auspicious timings for every event' },
  { Icon: UserCircle2, title: 'Expert Support', subtitle: 'Talk to our pandits anytime' },
];

const HOROSCOPE_PLACEHOLDER = {
  text: 'A positive day for you. Your confidence will help you achieve your goals. Good time for new beginnings and important decisions.',
  number: '7',
  colour: 'Saffron',
  time: '11:00 AM – 01:00 PM',
};

// ─── Mini calendar ────────────────────────────────────────────────────────────

function MiniCalendar({ selectedDate, onSelect }) {
  const [currentMonth, setCurrentMonth] = useState(() => selectedDate);

  useEffect(() => {
    setCurrentMonth(selectedDate);
  }, [selectedDate]);

  const days = useMemo(() => buildCalendarDays(currentMonth), [currentMonth]);
  const today = dayjs();

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">📅</span>
        <h3 className="font-bold text-text-dark">Calendar</h3>
      </div>
      <p className="text-xs text-text-light mb-3">
        Select a date to view Panchang, Horoscope and important details.
      </p>

      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => setCurrentMonth((m) => m.subtract(1, 'month'))}
          className="w-7 h-7 rounded-full hover:bg-gold-bg flex items-center justify-center text-text-mid hover:text-gold transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="font-bold text-gold text-sm">
          {currentMonth.format('MMMM YYYY')}
        </span>
        <button
          type="button"
          onClick={() => setCurrentMonth((m) => m.add(1, 'month'))}
          className="w-7 h-7 rounded-full hover:bg-gold-bg flex items-center justify-center text-text-mid hover:text-gold transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-[10px] text-text-light font-semibold py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day) => {
          const inMonth = day.month() === currentMonth.month();
          const isSelected = day.isSame(selectedDate, 'day');
          const isToday = day.isSame(today, 'day');
          let cls;
          if (isSelected) cls = 'bg-gold text-white font-bold';
          else if (isToday) cls = 'border border-gold text-gold font-bold';
          else if (inMonth) cls = 'text-text-dark hover:bg-gold-bg';
          else cls = 'text-text-light/40 hover:bg-surface-alt';

          return (
            <button
              key={day.format('YYYY-MM-DD')}
              type="button"
              onClick={() => {
                onSelect(day);
                setCurrentMonth(day);
              }}
              className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-xs transition-all ${cls}`}
            >
              {day.date()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Left sidebar ─────────────────────────────────────────────────────────────

function PanchangDetailsCard({ panchang }) {
  const rows = [
    { label: 'Tithi', value: panchang?.tithi },
    { label: 'Nakshatra', value: panchang?.nakshatra },
    { label: 'Yoga', value: panchang?.yoga },
    { label: 'Karana', value: panchang?.karana },
    { label: 'Sunrise', value: panchang?.sunrise || STATIC_TIMINGS.sunrise },
    { label: 'Sunset', value: panchang?.sunset || STATIC_TIMINGS.sunset },
  ];
  return (
    <div className="mt-4">
      <h4 className="font-bold text-text-dark mb-2">Panchang Details</h4>
      <div className="space-y-1.5 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <span className="text-text-mid">{r.label}</span>
            <span className="text-text-dark font-medium text-right truncate ml-2">
              {r.value || '—'}
            </span>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-3 text-sm text-gold font-semibold hover:underline"
      >
        View Full Panchang →
      </button>
    </div>
  );
}

function UpcomingFestivalsCard({ festival }) {
  return (
    <div className="mt-4">
      <h4 className="font-bold text-text-dark mb-2">Upcoming Festivals</h4>
      {festival ? (
        <div className="bg-gold/10 border border-gold/30 rounded-xl p-3 mb-2">
          <p className="text-sm font-semibold text-text-dark">
            {festival.name}
          </p>
          {festival.is_auspicious && (
            <span className="text-xs text-gold">Auspicious</span>
          )}
        </div>
      ) : (
        <p className="text-sm text-text-light mb-3">
          No festivals on this date
        </p>
      )}
      <button
        type="button"
        className="w-full border-2 border-gold text-gold rounded-xl py-2 text-sm font-semibold hover:bg-gold hover:text-white transition-all flex items-center justify-center gap-2"
      >
        📅 View All Festivals
      </button>
    </div>
  );
}

function LeftSidebar({ selectedDate, onSelect, panchang, festival }) {
  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="bg-white border border-border rounded-2xl p-4 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <MiniCalendar selectedDate={selectedDate} onSelect={onSelect} />
        <PanchangDetailsCard panchang={panchang} />
        <UpcomingFestivalsCard festival={festival} />
      </div>
    </aside>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

function SummaryCard({ icon, label, value, till }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-3 flex flex-col items-start gap-1 min-w-0">
      <span className="text-xl">{icon}</span>
      <p className="text-xs text-text-light">{label}</p>
      <p className="text-sm font-bold text-text-dark truncate w-full">
        {value || '—'}
      </p>
      {till && <p className="text-xs text-text-light">Till {till}</p>}
    </div>
  );
}

function SunMoonCard({ sunrise, sunset }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-3 flex flex-col gap-2 min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-lg">🌅</span>
        <div className="min-w-0">
          <p className="text-[10px] text-text-light">Sunrise</p>
          <p className="text-sm font-bold text-text-dark">{sunrise}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg">🌇</span>
        <div className="min-w-0">
          <p className="text-[10px] text-text-light">Sunset</p>
          <p className="text-sm font-bold text-text-dark">{sunset}</p>
        </div>
      </div>
    </div>
  );
}

function ScrollingInfoBar() {
  const items = [
    { label: 'Chandra Rashi', value: SAMVAT.chandraRashi },
    { label: 'Paksha', value: SAMVAT.paksha },
    { label: 'Vikram Samvat', value: SAMVAT.vikram },
    { label: 'Shaka Samvat', value: SAMVAT.shaka },
    { label: 'Ayana', value: SAMVAT.ayana },
    { label: 'Ritu', value: SAMVAT.ritu },
  ];
  return (
    <div className="bg-gradient-to-r from-gold-bg via-amber-50 to-gold-bg border border-gold/30 rounded-2xl px-4 py-3 my-4 overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-6 whitespace-nowrap text-sm">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-2">
            <span className="text-gold font-semibold">{it.label}:</span>
            <span className="text-text-dark font-bold">{it.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PanchangTabContent({ panchang }) {
  const left = [
    { icon: '☀️', label: 'Tithi', value: panchang?.tithi, till: PANCHANG_TILL.tithi },
    { icon: '⭐', label: 'Nakshatra', value: panchang?.nakshatra, till: PANCHANG_TILL.nakshatra },
    { icon: '🔯', label: 'Yoga', value: panchang?.yoga, till: PANCHANG_TILL.yoga },
    { icon: '🌙', label: 'Karana', value: panchang?.karana, till: PANCHANG_TILL.karana },
    { icon: '🌗', label: 'Paksha', value: SAMVAT.paksha, till: null },
    { icon: '🌅', label: 'Sunrise', value: panchang?.sunrise || STATIC_TIMINGS.sunrise, till: null },
    { icon: '🌇', label: 'Sunset', value: panchang?.sunset || STATIC_TIMINGS.sunset, till: null },
    { icon: '🌝', label: 'Moonrise', value: STATIC_TIMINGS.moonrise, till: null },
    { icon: '🌚', label: 'Moonset', value: STATIC_TIMINGS.moonset, till: null },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white border border-border rounded-2xl p-4 divide-y divide-border">
        {left.map((r) => (
          <div key={r.label} className="flex items-start gap-3 py-2 first:pt-0 last:pb-0">
            <span className="text-base flex-shrink-0">{r.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-text-mid text-xs">{r.label}</p>
              <p className="text-text-dark font-semibold text-sm truncate">
                {r.value || '—'}
              </p>
            </div>
            {r.till && (
              <span className="text-xs text-text-light flex-shrink-0">
                Till {r.till}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white border border-border rounded-2xl p-4 divide-y divide-border">
        {MUHURAT_TIMES.map((m) => (
          <div key={m.name} className="flex items-start gap-3 py-2 first:pt-0 last:pb-0">
            <span className="text-base flex-shrink-0">{m.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-text-dark font-semibold text-sm">{m.name}</p>
            </div>
            <span className="text-xs text-text-mid flex-shrink-0 font-medium">
              {m.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HoroscopeTabContent() {
  return (
    <div className="bg-white border border-border rounded-2xl p-6">
      <p className="text-text-mid text-sm mb-4 text-center">
        Select your zodiac sign to view today's horoscope
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {ZODIAC.map((z) => (
          <button
            key={z.id}
            type="button"
            className="flex flex-col items-center gap-1 p-3 rounded-xl border border-border hover:border-gold hover:bg-gold-bg transition-all"
          >
            <span className="text-2xl text-gold">{z.symbol}</span>
            <span className="text-xs text-text-dark font-medium">{z.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MuhuratTabContent() {
  return (
    <div className="bg-white border border-border rounded-2xl p-6">
      <h3 className="font-bold text-text-dark mb-4">
        Auspicious muhurats for today
      </h3>
      <div className="space-y-2">
        {MUHURAT_TIMES.slice(0, 5).map((m) => (
          <div
            key={m.name}
            className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
          >
            <span className="flex items-center gap-2 text-sm text-text-dark">
              <span>{m.icon}</span>
              {m.name}
            </span>
            <span className="text-sm text-gold font-semibold">{m.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MainContent({ panchang, selectedDate }) {
  const [tab, setTab] = useState('panchang');
  const sunrise = panchang?.sunrise || STATIC_TIMINGS.sunrise;
  const sunset = panchang?.sunset || STATIC_TIMINGS.sunset;

  return (
    <main className="flex-1 min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-text-dark flex items-center gap-2">
            <span>📅</span> Daily Panchang
          </h2>
          <p className="text-sm text-text-light">
            {selectedDate.format('dddd, DD MMMM YYYY')}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={14} className="text-gold" />
          <span className="text-text-dark font-medium">
            Varanasi, Uttar Pradesh
          </span>
          <button
            type="button"
            className="text-gold font-semibold hover:underline flex items-center gap-1"
          >
            <Edit3 size={12} />
            Edit
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <SummaryCard
          icon="☀️"
          label="Tithi"
          value={panchang?.tithi}
          till={PANCHANG_TILL.tithi}
        />
        <SummaryCard
          icon="⭐"
          label="Nakshatra"
          value={panchang?.nakshatra}
          till={PANCHANG_TILL.nakshatra}
        />
        <SummaryCard
          icon="🔯"
          label="Yoga"
          value={panchang?.yoga}
          till={PANCHANG_TILL.yoga}
        />
        <SummaryCard
          icon="🌙"
          label="Karana"
          value={panchang?.karana}
          till={PANCHANG_TILL.karana}
        />
        <SunMoonCard sunrise={sunrise} sunset={sunset} />
      </div>

      <ScrollingInfoBar />

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border mb-4">
        {[
          { id: 'panchang', label: 'Panchang' },
          { id: 'horoscope', label: 'Horoscope' },
          { id: 'muhurat', label: 'Muhurat' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              tab === t.id
                ? 'text-gold'
                : 'text-text-mid hover:text-text-dark'
            }`}
          >
            {t.label}
            {tab === t.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full" />
            )}
          </button>
        ))}
      </div>

      {tab === 'panchang' && <PanchangTabContent panchang={panchang} />}
      {tab === 'horoscope' && <HoroscopeTabContent />}
      {tab === 'muhurat' && <MuhuratTabContent />}

      {/* Download button */}
      <div className="flex justify-center mt-6">
        <button
          type="button"
          className="border-2 border-gold text-gold rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-gold hover:text-white transition-all flex items-center gap-2"
        >
          <Download size={14} />
          Download Panchang
        </button>
      </div>
    </main>
  );
}

// ─── Right sidebar ────────────────────────────────────────────────────────────

function HoroscopeCard({ selectedDate }) {
  const [zodiac, setZodiac] = useState('aries');
  return (
    <div className="bg-white border border-border rounded-xl shadow-sm p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">🔮</span>
        <h3 className="font-bold text-text-dark">Daily Horoscope</h3>
      </div>
      <p className="text-xs text-text-light mb-3">
        {selectedDate.format('DD MMM YYYY')}
      </p>
      <div className="relative mb-3">
        <select
          value={zodiac}
          onChange={(e) => setZodiac(e.target.value)}
          className="appearance-none w-full border-2 border-gold/40 rounded-lg px-3 py-2 text-sm font-semibold text-text-dark focus:outline-none focus:border-gold cursor-pointer"
        >
          {ZODIAC.map((z) => (
            <option key={z.id} value={z.id}>
              {z.symbol}  {z.name}
            </option>
          ))}
        </select>
        <ChevronRight
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gold pointer-events-none"
        />
      </div>
      <p className="text-sm text-text-mid leading-relaxed mb-3">
        {HOROSCOPE_PLACEHOLDER.text}
      </p>
      <div className="space-y-1.5 text-sm border-t border-border pt-3 mb-4">
        <div className="flex justify-between">
          <span className="text-text-mid">Lucky Number</span>
          <span className="font-semibold text-text-dark">
            {HOROSCOPE_PLACEHOLDER.number}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-mid">Lucky Colour</span>
          <span className="font-semibold text-text-dark">
            {HOROSCOPE_PLACEHOLDER.colour}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-mid">Lucky Time</span>
          <span className="font-semibold text-text-dark">
            {HOROSCOPE_PLACEHOLDER.time}
          </span>
        </div>
      </div>
      <button
        type="button"
        className="w-full border-2 border-gold text-gold rounded-xl py-2 text-sm font-semibold hover:bg-gold hover:text-white transition-all"
      >
        View Detailed Horoscope
      </button>
    </div>
  );
}

function UpcomingDaysCard() {
  return (
    <div className="bg-white border border-border rounded-xl shadow-sm p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-text-dark">Upcoming Important Days</h3>
        <button
          type="button"
          className="text-xs text-gold font-semibold hover:underline"
        >
          View All
        </button>
      </div>
      <div className="space-y-3">
        {UPCOMING_DAYS.map((d) => (
          <div key={d.name} className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-gold-bg flex items-center justify-center flex-shrink-0 text-base">
              {d.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gold text-sm">{d.name}</p>
              <p className="text-xs text-text-light">{d.date}</p>
              <span
                className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold mt-0.5 ${d.tagClass}`}
              >
                {d.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GuruIllustration() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full opacity-30"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="#F4A623" stroke="#F4A623" strokeWidth="0.6">
        <circle cx="50" cy="32" r="12" fill="#F4A623" opacity="0.8" />
        <path d="M28 88 L50 52 L72 88 Z" fill="#F4A623" opacity="0.7" />
        <ellipse cx="50" cy="50" rx="14" ry="6" fill="#FBBF24" opacity="0.9" />
      </g>
    </svg>
  );
}

function NeedHelpCard() {
  return (
    <div className="bg-white border border-border rounded-xl shadow-sm p-4 mt-4 relative overflow-hidden">
      <div className="absolute right-2 top-2 bottom-2 w-20 pointer-events-none">
        <GuruIllustration />
      </div>
      <div className="relative">
        <h3 className="font-bold text-text-dark">Need Help?</h3>
        <p className="text-xs text-text-light mb-3 max-w-[10rem]">
          Our experts are here to guide you.
        </p>
        <button
          type="button"
          className="border-2 border-gold text-gold rounded-xl px-3 py-2 text-xs font-semibold hover:bg-gold hover:text-white transition-all flex items-center gap-1.5"
        >
          <Headphones size={12} />
          Talk to Expert
        </button>
      </div>
    </div>
  );
}

function RightSidebar({ selectedDate }) {
  return (
    <aside className="w-72 flex-shrink-0 hidden xl:block">
      <div className="sticky top-20">
        <HoroscopeCard selectedDate={selectedDate} />
        <UpcomingDaysCard />
        <NeedHelpCard />
      </div>
    </aside>
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

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(() => dayjs());
  const [panchangData, setPanchangData] = useState(null);

  const dateKey = selectedDate.format('YYYY-MM-DD');

  useEffect(() => {
    let cancelled = false;
    setPanchangData(null);
    calendarApi
      .panchang(dateKey)
      .then((res) => {
        if (!cancelled) setPanchangData(res);
      })
      .catch(() => {
        // silent — UI falls back to placeholders
      });
    return () => {
      cancelled = true;
    };
  }, [dateKey]);

  const panchang = panchangData?.panchang;
  const festival = panchangData?.festival;

  return (
    <div className="min-h-screen bg-bg">
      <TopNavbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-3 text-sm text-text-light">
        <Link to="/home" className="hover:text-gold transition-colors">
          Home
        </Link>{' '}
        <span className="text-text-light/60">›</span>{' '}
        <span className="text-text-dark font-medium">Calendar</span>
      </div>

      {/* 3-column layout */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
        <LeftSidebar
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
          panchang={panchang}
          festival={festival}
        />

        <MainContent panchang={panchang} selectedDate={selectedDate} />

        <RightSidebar selectedDate={selectedDate} />
      </div>

      <BottomFeaturesBar />
    </div>
  );
}
