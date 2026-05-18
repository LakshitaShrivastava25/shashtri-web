import { useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, ChevronDown, ShoppingCart } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useCartStore, selectTotalItems } from '../../store';

const NAV_LINKS = [
  { to: '/home', label: 'Home' },
  { to: '/rituals', label: 'Rituals' },
  { to: '/priests', label: 'Pandits' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/store', label: 'Store' },
  { to: '/bookings', label: 'My Bookings' },
];

function BrandMark() {
  return (
    <Link to="/home" className="flex items-center gap-2 flex-shrink-0">
      <div className="w-9 h-9 bg-gold rounded-xl flex items-center justify-center shadow-md shadow-gold/30">
        <img
          src="/logo.png"
          alt="Shastri Ji Logo"
          className="w-8 h-8 rounded-full object-cover"
        />
      </div>
      <span
        className="font-heading font-bold text-xl"
        style={{ color: '#F4A623' }}
      >
        Shastri Ji
      </span>
    </Link>
  );
}

export default function TopNavbar() {
  const { user, isLoggedIn } = useAuthStore();
  const { unreadCount, load } = useNotificationStore();
  const location = useLocation();
  const navigate = useNavigate();
  const totalItems = useCartStore(selectTotalItems);
  const isStorePage = location.pathname.startsWith('/store');

  useEffect(() => {
    if (isLoggedIn) load();
  }, [isLoggedIn, load]);

  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';
  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
        <BrandMark />

        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/home'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-gold'
                    : 'text-text-mid hover:text-gold'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden lg:flex relative items-center">
            <Search
              size={16}
              className="absolute left-3 text-text-light pointer-events-none"
            />
            <input
              type="search"
              placeholder="Search rituals, pandits..."
              className="bg-bg border border-border rounded-full pl-9 pr-4 py-2 text-sm w-56 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
            />
          </div>

          {isStorePage && (
            <button
              type="button"
              onClick={() => navigate('/store/cart')}
              className="relative p-2 rounded-xl hover:bg-[#FFF8ED] transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-[#2D1B00]" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#F4A623] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          )}

          <Link
            to="/notifications"
            className="relative p-2 text-text-mid hover:text-gold transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-gold text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-2 hover:bg-bg rounded-xl px-2 py-1 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-white font-bold font-heading text-sm">
              {initial}
            </div>
            <span className="text-sm font-semibold text-text-dark hidden sm:inline-flex items-center gap-1">
              {firstName}
              <ChevronDown size={14} className="text-text-mid" />
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
