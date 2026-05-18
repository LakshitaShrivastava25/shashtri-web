import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import {
  Home as HomeIcon,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Heart,
  Bookmark,
  Bell,
  Gift,
  HelpCircle,
  Settings,
  LogOut,
  Pencil,
  ChevronRight,
  MoreVertical,
  Plus,
  Lock,
  ShieldCheck,
  Headphones,
  RotateCcw,
  Coins,
  CheckCircle2,
  Clock,
  XCircle,
  IndianRupee,
} from 'lucide-react';
import TopNavbar from '../../components/layout/TopNavbar';
import { useAuthStore } from '../../store/authStore';
import { authApi, bookingsApi } from '../../api/services';

// ─── Static config ────────────────────────────────────────────────────────────

const SIDEBAR_NAV = [
  { id: 'overview', icon: HomeIcon, label: 'Profile Overview' },
  { id: 'personal', icon: User, label: 'Personal Information' },
  { id: 'addresses', icon: MapPin, label: 'Addresses' },
  { id: 'payment', icon: CreditCard, label: 'Payment Methods' },
  { id: 'bookings', icon: Calendar, label: 'My Bookings', route: '/bookings' },
  { id: 'saved-pandits', icon: Heart, label: 'Saved Pandits' },
  { id: 'wishlist', icon: Bookmark, label: 'Wishlist' },
  { id: 'notifications', icon: Bell, label: 'Notifications', route: '/notifications' },
  { id: 'refer', icon: Gift, label: 'Refer & Earn' },
  { id: 'help', icon: HelpCircle, label: 'Help & Support' },
  { id: 'settings', icon: Settings, label: 'Settings' },
  { id: 'logout', icon: LogOut, label: 'Logout', danger: true, action: 'logout' },
];

const QUICK_LINKS = [
  { id: 'saved-pandits', icon: Heart, label: 'Saved Pandits' },
  { id: 'wishlist', icon: Bookmark, label: 'Wishlist' },
  { id: 'addresses', icon: MapPin, label: 'Addresses' },
  { id: 'payment', icon: CreditCard, label: 'Payment Methods' },
  { id: 'refer', icon: Gift, label: 'Refer & Earn' },
  { id: 'help', icon: HelpCircle, label: 'Help & Support' },
];

const TRUST_BADGES = [
  { Icon: Lock, label: '100% Secure' },
  { Icon: ShieldCheck, label: 'Verified Pandits' },
  { Icon: Headphones, label: '24/7 Support' },
  { Icon: RotateCcw, label: 'Easy Refunds' },
];

const MOCK_PAYMENT_METHODS = [
  { id: 1, type: 'UPI', label: 'priya@upi', name: 'UPI', primary: true, brand: 'bg-purple-50 text-purple-700' },
  { id: 2, type: 'Visa', label: '**** **** **** 4521', name: 'Visa', primary: false, brand: 'bg-blue-50 text-blue-700' },
  { id: 3, type: 'Mastercard', label: '**** **** **** 8832', name: 'Mastercard', primary: false, brand: 'bg-orange-50 text-orange-700' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getRitualName = (b) => b?.ritual?.name || b?.ritual_name || 'Ritual Booking';
const getDate = (b) => b?.date || b?.selected_date || b?.booking_date;
const getLocation = (b) => b?.location || b?.city || b?.address || 'At Home';
const getPrice = (b) =>
  Number(b?.proposed_price ?? b?.final_price ?? b?.price ?? 0);

function statusBadge(status) {
  const upper = (status || '').toUpperCase();
  if (upper === 'PENDING' || upper === 'ACCEPTED')
    return {
      label: 'Upcoming',
      cls: 'bg-green-50 text-green-700 border-green-200',
    };
  if (upper === 'COMPLETED')
    return {
      label: 'Completed',
      cls: 'bg-blue-50 text-blue-700 border-blue-200',
    };
  if (['CANCELLED', 'REJECTED', 'EXPIRED'].includes(upper))
    return {
      label: 'Cancelled',
      cls: 'bg-red-50 text-red-700 border-red-200',
    };
  return {
    label: 'Pending',
    cls: 'bg-amber-50 text-amber-700 border-amber-200',
  };
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function ProfileCard({ user, points = 250 }) {
  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';
  return (
    <div className="bg-white border border-border rounded-xl p-4 text-center">
      <div className="relative inline-block mb-3">
        <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center text-white font-heading font-bold text-2xl mx-auto">
          {initial}
        </div>
        <button
          type="button"
          aria-label="Edit avatar"
          className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:border-gold hover:text-gold transition-all"
        >
          <Pencil size={12} />
        </button>
      </div>
      <p className="font-bold text-text-dark text-base leading-tight">
        {user?.name || 'Devotee'}
      </p>
      {user?.phone_number && (
        <p className="text-xs text-text-light mt-0.5">{user.phone_number}</p>
      )}
      {user?.email && (
        <p className="text-xs text-text-light mt-0.5 break-all">{user.email}</p>
      )}
      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-text-mid">
          <Coins size={14} className="text-gold" />
          Total Rewards
        </span>
        <span className="font-bold text-gold">{points}</span>
      </div>
    </div>
  );
}

function NavMenu({ activeSection, onSelect, onLogout }) {
  return (
    <nav className="bg-white border border-border rounded-xl p-2 mt-4 space-y-0.5">
      {SIDEBAR_NAV.map((item) => {
        const Icon = item.icon;
        const active = activeSection === item.id;

        if (item.action === 'logout') {
          return (
            <button
              key={item.id}
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        }

        if (item.route) {
          return (
            <Link
              key={item.id}
              to={item.route}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-dark hover:bg-gold-bg hover:text-gold transition-colors"
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              active
                ? 'bg-gold/10 text-gold font-semibold'
                : 'text-text-dark hover:bg-gold-bg'
            }`}
          >
            <Icon size={16} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

function ReferEarnSidebarCard() {
  return (
    <div
      className="rounded-xl p-4 mt-4 text-text-dark relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #FCD34D 0%, #F4A623 60%, #D97706 100%)',
      }}
    >
      <div className="absolute right-2 bottom-2 text-4xl opacity-50 pointer-events-none">
        🎁
      </div>
      <p className="font-heading font-bold text-base">Refer &amp; Earn</p>
      <p className="text-xs mt-1 leading-tight max-w-[10rem]">
        Refer your friends and earn exciting rewards.
      </p>
      <button
        type="button"
        className="mt-3 bg-white text-gold font-semibold px-4 py-1.5 rounded-lg text-xs hover:shadow-md transition-all"
      >
        Refer Now
      </button>
    </div>
  );
}

function ProfileSidebar({ user, activeSection, onSelect, onLogout }) {
  return (
    <aside className="w-60 flex-shrink-0 hidden lg:block">
      <div className="sticky top-20">
        <ProfileCard user={user} />
        <NavMenu
          activeSection={activeSection}
          onSelect={onSelect}
          onLogout={onLogout}
        />
        <ReferEarnSidebarCard />
      </div>
    </aside>
  );
}

// ─── Overview content ────────────────────────────────────────────────────────

function WelcomeBanner({ user }) {
  const firstName = user?.name?.split(' ')[0] || 'Devotee';
  return (
    <section
      className="relative w-full rounded-2xl overflow-hidden mb-6"
      style={{
        background:
          'linear-gradient(135deg, #FEF3C7 0%, #FDF6E3 60%, #FEF9F0 100%)',
        minHeight: '120px',
      }}
    >
      <div className="px-6 py-5 max-w-[60%]">
        <h1 className="font-heading text-2xl font-bold text-text-dark">
          Welcome back, {firstName}! 🙏
        </h1>
        <p className="text-text-light text-sm mt-1">
          Manage your account, bookings and preferences all in one place.
        </p>
      </div>
      <img
        src="/hero-puja.webp"
        alt=""
        className="absolute right-0 top-0 h-full w-1/3 object-cover object-right opacity-90 hidden md:block"
        style={{ mixBlendMode: 'multiply' }}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    </section>
  );
}

function StatCard({ Icon, label, value, accent, onView }) {
  return (
    <div className="bg-white border border-border rounded-xl p-3 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center ${
            accent || 'bg-gold-bg text-gold'
          }`}
        >
          <Icon size={16} />
        </div>
      </div>
      <p className="text-xl font-bold font-heading text-text-dark mt-1 leading-tight">
        {value}
      </p>
      <p className="text-xs text-text-light">{label}</p>
      {onView && (
        <button
          type="button"
          onClick={onView}
          className="text-xs text-gold font-semibold hover:underline self-start mt-1"
        >
          View →
        </button>
      )}
    </div>
  );
}

function StatsRow({ stats, onViewBookings }) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      <StatCard
        Icon={Calendar}
        label="Total Bookings"
        value={stats.total}
        onView={onViewBookings}
      />
      <StatCard
        Icon={CheckCircle2}
        label="Completed"
        value={stats.completed}
        accent="bg-blue-50 text-blue-700"
        onView={onViewBookings}
      />
      <StatCard
        Icon={Clock}
        label="Upcoming"
        value={stats.upcoming}
        accent="bg-green-50 text-green-700"
        onView={onViewBookings}
      />
      <StatCard
        Icon={XCircle}
        label="Cancelled"
        value={stats.cancelled}
        accent="bg-red-50 text-red-700"
        onView={onViewBookings}
      />
      <StatCard
        Icon={IndianRupee}
        label="Total Spent"
        value={`₹${stats.totalSpent.toLocaleString('en-IN')}`}
        accent="bg-amber-50 text-amber-700"
      />
    </section>
  );
}

function RecentBookingsCard({ bookings, loading }) {
  return (
    <section className="bg-white border border-border rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading text-base font-bold text-text-dark">
          Recent Bookings
        </h2>
        <Link
          to="/bookings"
          className="text-xs font-semibold text-gold hover:underline"
        >
          View All →
        </Link>
      </div>
      {loading ? (
        <div className="space-y-2">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-14 bg-amber-50 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-sm text-text-light text-center py-6">
          No bookings yet. <Link to="/rituals" className="text-gold font-semibold hover:underline">Book your first ritual →</Link>
        </p>
      ) : (
        <div className="space-y-2">
          {bookings.map((b) => {
            const badge = statusBadge(b.status);
            const date = getDate(b);
            return (
              <Link
                key={b.id}
                to={`/bookings/${b.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🛕</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-text-dark truncate">
                    {getRitualName(b)}
                  </p>
                  <p className="text-xs text-text-light truncate">
                    #SJ{b.id} · {date ? dayjs(date).format('DD MMM YYYY') : '—'} ·{' '}
                    {getLocation(b)}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border ${badge.cls} flex-shrink-0`}
                >
                  {badge.label}
                </span>
                <ChevronRight size={14} className="text-text-light flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

function QuickLinksRow({ onSelect }) {
  return (
    <section className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
      {QUICK_LINKS.map((q) => {
        const Icon = q.icon;
        return (
          <button
            key={q.id}
            type="button"
            onClick={() => onSelect(q.id)}
            className="bg-white border border-border rounded-xl p-3 flex flex-col items-center gap-2 hover:border-gold hover:bg-gold-bg transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-gold-bg flex items-center justify-center">
              <Icon size={18} className="text-gold" />
            </div>
            <p className="text-xs font-medium text-text-dark text-center leading-tight">
              {q.label}
            </p>
          </button>
        );
      })}
    </section>
  );
}

function AccountInfoCard({ user, onEdit }) {
  const rows = [
    { label: 'Name', value: user?.name },
    { label: 'Mobile Number', value: user?.phone_number },
    { label: 'Email Address', value: user?.email },
    { label: 'Date of Birth', value: user?.date_of_birth || user?.dob },
    { label: 'Gender', value: user?.gender },
    { label: 'Language', value: user?.language || user?.preferred_language },
  ];
  return (
    <section className="bg-white border border-border rounded-xl p-4">
      <h2 className="font-heading text-base font-bold text-text-dark mb-3">
        Account Information
      </h2>
      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
          >
            <div className="min-w-0">
              <p className="text-xs text-text-light">{r.label}</p>
              <p className="text-sm text-text-dark font-medium truncate">
                {r.value || '—'}
              </p>
            </div>
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Edit ${r.label}`}
              className="text-text-mid hover:text-gold transition-colors flex-shrink-0 ml-2"
            >
              <Pencil size={12} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="mt-4 border-2 border-gold text-gold rounded-lg px-4 py-2 text-sm font-semibold hover:bg-gold hover:text-white transition-all w-full"
      >
        Edit Profile
      </button>
    </section>
  );
}

function PaymentMethodsCard() {
  return (
    <section className="bg-white border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading text-base font-bold text-text-dark">
          Payment Methods
        </h2>
        <button
          type="button"
          className="text-xs font-semibold text-gold flex items-center gap-1 hover:underline"
        >
          <Plus size={12} />
          Add New
        </button>
      </div>
      <div className="space-y-2">
        {MOCK_PAYMENT_METHODS.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 p-2 rounded-lg border border-border"
          >
            <div
              className={`w-10 h-7 rounded flex items-center justify-center text-[10px] font-bold ${p.brand}`}
            >
              {p.type === 'UPI' ? 'UPI' : p.type === 'Visa' ? 'VISA' : 'MC'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-dark truncate">
                {p.label}
              </p>
              <p className="text-xs text-text-light">{p.name}</p>
            </div>
            {p.primary && (
              <span className="text-[10px] bg-gold-bg text-gold border border-gold/30 px-2 py-0.5 rounded-full font-semibold">
                Primary
              </span>
            )}
            <button
              type="button"
              aria-label="More options"
              className="w-7 h-7 flex items-center justify-center rounded-full text-text-mid hover:bg-gray-100"
            >
              <MoreVertical size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-3 text-xs text-gold font-semibold hover:underline"
      >
        View All Payment Methods →
      </button>
    </section>
  );
}

function TrustBadgesRow() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
      {TRUST_BADGES.map(({ Icon, label }) => (
        <div
          key={label}
          className="bg-white border border-border rounded-xl p-3 flex items-center gap-2"
        >
          <div className="w-9 h-9 rounded-full bg-gold-bg flex items-center justify-center flex-shrink-0">
            <Icon size={16} className="text-gold" />
          </div>
          <span className="text-sm font-semibold text-text-dark">{label}</span>
        </div>
      ))}
    </section>
  );
}

function OverviewSection({ user, bookings, stats, loading, onSelectSection }) {
  const recent = useMemo(
    () =>
      [...bookings]
        .sort(
          (a, b) =>
            dayjs(b.created_at || getDate(b) || 0).valueOf() -
            dayjs(a.created_at || getDate(a) || 0).valueOf()
        )
        .slice(0, 4),
    [bookings]
  );

  return (
    <>
      <WelcomeBanner user={user} />
      <StatsRow stats={stats} onViewBookings={() => onSelectSection('bookings')} />
      <RecentBookingsCard bookings={recent} loading={loading} />
      <QuickLinksRow onSelect={onSelectSection} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AccountInfoCard user={user} onEdit={() => onSelectSection('personal')} />
        <PaymentMethodsCard />
      </div>
      <TrustBadgesRow />
    </>
  );
}

// ─── Personal information section ─────────────────────────────────────────────

function PersonalInformationSection({ user }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    city: user?.city || '',
  });

  useEffect(() => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      city: user?.city || '',
    });
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await authApi.updateProfile(form);
      useAuthStore.getState().refreshAuthStatus();
      toast.success('Profile updated');
      setEditing(false);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || 'Failed to update'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      city: user?.city || '',
    });
    setEditing(false);
  };

  return (
    <section className="bg-white border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl font-bold text-text-dark">
          Personal Information
        </h2>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-sm text-gold font-semibold hover:underline flex items-center gap-1"
          >
            <Pencil size={12} />
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-text-light mb-1">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-light mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-light mb-1">
              City
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-gold text-white font-semibold px-4 py-2 rounded-lg text-sm hover:shadow-md disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="border border-border text-text-mid px-4 py-2 rounded-lg text-sm hover:border-gold/50"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          {[
            { label: 'Name', value: user?.name },
            { label: 'Mobile Number', value: user?.phone_number },
            { label: 'Email Address', value: user?.email },
            { label: 'City', value: user?.city },
            { label: 'Role', value: user?.role },
          ].map((r) => (
            <div
              key={r.label}
              className="flex justify-between py-2 border-b border-border last:border-b-0"
            >
              <span className="text-sm text-text-light">{r.label}</span>
              <span className="text-sm font-medium text-text-dark">
                {r.value || '—'}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Placeholder sections ─────────────────────────────────────────────────────

function PlaceholderSection({ Icon, title, message, ctaLabel, ctaTo }) {
  return (
    <section className="bg-white border border-border rounded-xl p-12 text-center">
      <div className="w-14 h-14 rounded-full bg-gold-bg flex items-center justify-center mx-auto mb-3">
        <Icon size={24} className="text-gold" />
      </div>
      <h2 className="font-heading text-lg font-bold text-text-dark">{title}</h2>
      <p className="text-sm text-text-light mt-1 max-w-md mx-auto">{message}</p>
      {ctaLabel && ctaTo && (
        <Link
          to={ctaTo}
          className="inline-block mt-4 bg-gold text-white font-semibold rounded-lg px-5 py-2 text-sm hover:shadow-md hover:shadow-gold/30 transition-all"
        >
          {ctaLabel}
        </Link>
      )}
    </section>
  );
}

function ReferEarnSection() {
  return (
    <section className="bg-white border border-border rounded-xl p-8 text-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, #FCD34D 0%, #F4A623 60%, #D97706 100%)',
        }}
      />
      <div className="relative">
        <div className="text-5xl mb-3">🎁</div>
        <h2 className="font-heading text-2xl font-bold text-text-dark">
          Refer &amp; Earn
        </h2>
        <p className="text-text-mid mt-2 max-w-md mx-auto">
          Invite your friends to Shastri Ji and earn 100 reward points for every
          successful referral.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 bg-gold-bg border border-gold/30 rounded-lg px-4 py-2">
          <span className="text-text-light text-sm">Your code:</span>
          <span className="font-bold text-gold tracking-wider">SHJI2026</span>
        </div>
        <div className="mt-4">
          <button
            type="button"
            className="bg-gold text-white font-semibold rounded-lg px-6 py-2.5 text-sm hover:shadow-md hover:shadow-gold/30 transition-all"
          >
            Share Referral Code
          </button>
        </div>
      </div>
    </section>
  );
}

function HelpSupportSection() {
  return (
    <section className="bg-white border border-border rounded-xl p-6">
      <h2 className="font-heading text-xl font-bold text-text-dark mb-1">
        Help &amp; Support
      </h2>
      <p className="text-text-light text-sm mb-4">
        We're here to help. Reach out anytime.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <a
          href="tel:+919876543210"
          className="flex items-center gap-3 border border-border rounded-lg p-4 hover:border-gold transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-gold-bg flex items-center justify-center">
            <Headphones size={18} className="text-gold" />
          </div>
          <div>
            <p className="font-semibold text-text-dark text-sm">Call Support</p>
            <p className="text-xs text-text-light">+91 98765 43210</p>
          </div>
        </a>
        <a
          href="mailto:hello@shastriji.com"
          className="flex items-center gap-3 border border-border rounded-lg p-4 hover:border-gold transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-gold-bg flex items-center justify-center">
            <HelpCircle size={18} className="text-gold" />
          </div>
          <div>
            <p className="font-semibold text-text-dark text-sm">Email Us</p>
            <p className="text-xs text-text-light">hello@shastriji.com</p>
          </div>
        </a>
      </div>
    </section>
  );
}

function SettingsSection() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  return (
    <section className="bg-white border border-border rounded-xl p-6">
      <h2 className="font-heading text-xl font-bold text-text-dark mb-4">
        Settings
      </h2>
      <div className="space-y-4">
        <label className="flex items-center justify-between">
          <span className="text-sm text-text-dark">Email notifications</span>
          <input
            type="checkbox"
            checked={emailNotifs}
            onChange={(e) => setEmailNotifs(e.target.checked)}
            className="w-4 h-4 accent-gold"
          />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-sm text-text-dark">SMS notifications</span>
          <input
            type="checkbox"
            checked={smsNotifs}
            onChange={(e) => setSmsNotifs(e.target.checked)}
            className="w-4 h-4 accent-gold"
          />
        </label>
      </div>
    </section>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [activeSection, setActiveSection] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const stats = useMemo(() => {
    const total = bookings.length;
    let completed = 0;
    let upcoming = 0;
    let cancelled = 0;
    let totalSpent = 0;
    bookings.forEach((b) => {
      const upper = (b.status || '').toUpperCase();
      if (upper === 'COMPLETED') completed += 1;
      else if (upper === 'PENDING' || upper === 'ACCEPTED') upcoming += 1;
      else if (['CANCELLED', 'REJECTED', 'EXPIRED'].includes(upper))
        cancelled += 1;
      totalSpent += getPrice(b);
    });
    return { total, completed, upcoming, cancelled, totalSpent };
  }, [bookings]);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    navigate('/login');
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
        <span className="text-text-dark font-medium">Profile</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
        <ProfileSidebar
          user={user}
          activeSection={activeSection}
          onSelect={setActiveSection}
          onLogout={handleLogout}
        />

        <main className="flex-1 min-w-0">
          {activeSection === 'overview' && (
            <OverviewSection
              user={user}
              bookings={bookings}
              stats={stats}
              loading={loading}
              onSelectSection={(id) => {
                const item = SIDEBAR_NAV.find((n) => n.id === id);
                if (item?.route) navigate(item.route);
                else setActiveSection(id);
              }}
            />
          )}
          {activeSection === 'personal' && (
            <PersonalInformationSection user={user} />
          )}
          {activeSection === 'addresses' && (
            <PlaceholderSection
              Icon={MapPin}
              title="No addresses saved yet"
              message="Add an address to make booking rituals at home faster."
              ctaLabel="Add Address"
              ctaTo="#"
            />
          )}
          {activeSection === 'payment' && (
            <div className="bg-white border border-border rounded-xl p-6">
              <h2 className="font-heading text-xl font-bold text-text-dark mb-4">
                Payment Methods
              </h2>
              <PaymentMethodsCard />
            </div>
          )}
          {activeSection === 'saved-pandits' && (
            <PlaceholderSection
              Icon={Heart}
              title="No saved pandits yet"
              message="Save your favourite pandits to quickly book them next time."
              ctaLabel="Browse Pandits"
              ctaTo="/priests"
            />
          )}
          {activeSection === 'wishlist' && (
            <PlaceholderSection
              Icon={Bookmark}
              title="Your wishlist is empty"
              message="Save rituals you're interested in to come back to later."
              ctaLabel="Browse Rituals"
              ctaTo="/rituals"
            />
          )}
          {activeSection === 'refer' && <ReferEarnSection />}
          {activeSection === 'help' && <HelpSupportSection />}
          {activeSection === 'settings' && <SettingsSection />}
        </main>
      </div>
    </div>
  );
}
