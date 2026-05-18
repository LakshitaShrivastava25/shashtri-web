import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Users,
  Bell,
  User,
  LogOut,
  LayoutDashboard,
  Calendar,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';

const USER_NAV = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/rituals', icon: BookOpen, label: 'Rituals' },
  { to: '/priests', icon: Users, label: 'Pandits' },
  { to: '/bookings', icon: Calendar, label: 'My Bookings' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/notifications', icon: Bell, label: 'Notifications', badge: true },
  { to: '/profile', icon: User, label: 'Profile' },
];

const PRIEST_NAV = [
  { to: '/priest/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/priest/bookings', icon: Calendar, label: 'Bookings' },
  { to: '/notifications', icon: Bell, label: 'Notifications', badge: true },
  { to: '/profile', icon: User, label: 'Profile' },
];

const ADMIN_NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/priests', icon: Users, label: 'Priests' },
  { to: '/admin/users', icon: User, label: 'Users' },
  { to: '/admin/rituals', icon: BookOpen, label: 'Rituals' },
  { to: '/admin/banners', icon: Home, label: 'Banners' },
];

function NavItem({ item, unreadCount, collapsed }) {
  const location = useLocation();
  const active =
    location.pathname === item.to ||
    (item.to !== '/home' && location.pathname.startsWith(item.to));
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 group ${
        active
          ? 'bg-gold text-white shadow-md shadow-gold/25 font-semibold'
          : 'text-text-mid hover:bg-gold/10 hover:text-gold'
      }`}
    >
      <div className="relative flex-shrink-0">
        <Icon size={18} />
        {item.badge && unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-error text-white text-[9px] font-bold rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-0.5">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>
      {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
    </Link>
  );
}

function BrandMark({ size = 'md' }) {
  const dim = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9';
  const svgSize = size === 'sm' ? 16 : 22;
  return (
    <div
      className={`${dim} bg-gold rounded-xl flex items-center justify-center shadow-md shadow-gold/30 flex-shrink-0`}
    >
      <svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 100 100"
        className="text-white"
      >
        <text
          x="50%"
          y="68%"
          textAnchor="middle"
          fontSize="72"
          fontFamily="serif"
          fill="currentColor"
        >
          ॐ
        </text>
      </svg>
    </div>
  );
}

function Sidebar({ collapsed, setCollapsed, navItems, unreadCount, user, role, onLogout, onCloseMobile }) {
  return (
    <aside
      className={`flex flex-col h-full border-r border-border transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
      style={{ background: 'linear-gradient(180deg, #FFF6EA 0%, #FFF0D0 100%)' }}
    >
      <div className="flex items-center justify-between px-4 py-5 border-b border-border/50">
        {!collapsed ? (
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <BrandMark />
            <div className="min-w-0">
              <span className="font-heading font-bold text-lg text-text-dark block leading-tight truncate">
                Shastri Ji
              </span>
              <span className="text-[10px] text-text-light font-medium">
                Sacred Rituals
              </span>
            </div>
          </Link>
        ) : (
          <div className="mx-auto">
            <BrandMark />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg text-text-light hover:text-gold hover:bg-gold-bg transition-all ml-auto"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <Menu size={16} />}
        </button>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-text-light hover:text-gold hover:bg-gold-bg transition-all ml-1 md:hidden"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            item={item}
            unreadCount={unreadCount}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className="p-3 border-t border-border/50">
        {!collapsed && user && (
          <div className="bg-gold/10 rounded-xl p-3 mb-2 flex items-center gap-3 border border-gold/20">
            <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-white font-bold font-heading text-sm flex-shrink-0 shadow-sm">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-dark truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-gold font-semibold uppercase tracking-wide">
                {role}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className={`flex items-center gap-3 px-3 py-2 rounded-xl w-full text-error hover:bg-red-50 transition-colors text-sm font-medium ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={16} />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </aside>
  );
}

export function AppLayout({ children }) {
  const navigate = useNavigate();
  const { user, role, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems =
    role === 'ADMIN' ? ADMIN_NAV : role === 'PRIEST' ? PRIEST_NAV : USER_NAV;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarProps = {
    collapsed,
    setCollapsed,
    navItems,
    unreadCount,
    user,
    role,
    onLogout: handleLogout,
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex flex-col flex-shrink-0">
        <Sidebar {...sidebarProps} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="w-60 flex flex-col flex-shrink-0">
            <Sidebar
              {...sidebarProps}
              onCloseMobile={() => setMobileOpen(false)}
            />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header
          className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border/50 flex-shrink-0"
          style={{ background: 'linear-gradient(90deg, #FFF6EA 0%, #FFF0D0 100%)' }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="text-text-mid p-1"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <BrandMark size="sm" />
            <span className="font-heading font-bold text-base text-text-dark">
              Shastri Ji
            </span>
          </Link>
          <Link
            to="/notifications"
            className="relative text-text-mid p-1"
            aria-label="Notifications"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-error text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav
        style={{ background: 'rgba(160,50,15,0.97)' }}
        className="sticky top-0 z-50 backdrop-blur-sm border-b border-white/20"
      >
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gold rounded-xl flex items-center justify-center shadow-md">
              <svg
                width="22"
                height="22"
                viewBox="0 0 100 100"
                className="text-white"
              >
                <text
                  x="50%"
                  y="68%"
                  textAnchor="middle"
                  fontSize="72"
                  fontFamily="serif"
                  fill="currentColor"
                >
                  ॐ
                </text>
              </svg>
            </div>
            <div>
              <span className="font-heading font-bold text-lg text-white block leading-tight">
                Shastri Ji
              </span>
              <span className="text-[10px] text-white/60">Sacred Rituals</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/rituals"
              className="text-white/80 hover:text-gold transition-colors text-sm font-medium"
            >
              Rituals
            </Link>
            <Link
              to="/priests"
              className="text-white/80 hover:text-gold transition-colors text-sm font-medium"
            >
              Pandits
            </Link>
            <Link
              to="/calendar"
              className="text-white/80 hover:text-gold transition-colors text-sm font-medium"
            >
              Calendar
            </Link>
          </div>
          <Link
            to="/login"
            className="bg-gold text-white font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-gold/30 transition-all text-sm"
          >
            Book Now
          </Link>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default AppLayout;
