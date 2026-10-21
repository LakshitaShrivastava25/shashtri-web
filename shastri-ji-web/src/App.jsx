import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  RequireAuth,
  RequireRole,
  RedirectIfAuth,
  getRoleDashboard,
} from './components/layout/Guards';
import { useAuthStore } from './store';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import OtpPage from './pages/auth/OtpPage';
import RoleSelectionPage from './pages/auth/RoleSelectionPage';
import UserRegistrationPage from './pages/auth/UserRegistrationPage';
import PriestRegistrationPage from './pages/auth/PriestRegistrationPage';

import HomePage from './pages/user/HomePage';
import RitualsListPage from './pages/user/RitualsListPage';
import RitualDetailPage from './pages/user/RitualDetailPage';
import PriestsListPage from './pages/user/PriestsListPage';
import PanditDetailPage from './pages/user/PanditDetailPage';
import SelectRitualPage from './pages/user/SelectRitualPage';
import BookingConfirmationPage from './pages/user/BookingConfirmationPage';
import BookingListPage from './pages/user/BookingListPage';
import BookingDetailPage from './pages/user/BookingDetailPage';
import RequestBookingPage from './pages/user/RequestBookingPage';
import NotificationListPage from './pages/user/NotificationListPage';
import ProfilePage from './pages/user/ProfilePage';
import CalendarPage from './pages/user/CalendarPage';
import StorePage from './pages/user/StorePage';
import ProductDetail from './pages/store/ProductDetail';
import Checkout from './pages/store/Checkout';
import OrderTracking from './pages/store/OrderTracking';
import Cart from './pages/store/Cart';

import PriestDashboardPage from './pages/priest/PriestDashboardPage';
import PriestBookingListPage from './pages/priest/PriestBookingListPage';
import PriestBookingDetailPage from './pages/priest/PriestBookingDetailPage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPriestsPage from './pages/admin/AdminPriestsPage';
import AdminPriestDetailPage from './pages/admin/AdminPriestDetailPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminUserDetailPage from './pages/admin/AdminUserDetailPage';
import AdminRitualsPage from './pages/admin/AdminRitualsPage';
import AdminBannersPage from './pages/admin/AdminBannersPage';

import AppDownloadPopup from './components/AppDownloadPopup';
import SplashScreen from './components/SplashScreen';

function RootRoute() {
  const { isLoggedIn, role, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <img
          src="/logo-512.webp"
          alt="Shastri Ji"
          className="w-16 h-16 rounded-full object-cover"
        />
      </div>
    );
  }

  if (isLoggedIn) return <Navigate to={getRoleDashboard(role)} replace />;
  return <LandingPage />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/landing" element={<LandingPage />} />

        <Route
          path="/login"
          element={
            <RedirectIfAuth>
              <LoginPage />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/otp"
          element={
            <RedirectIfAuth>
              <OtpPage />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/role-selection"
          element={
            <RedirectIfAuth>
              <RoleSelectionPage />
            </RedirectIfAuth>
          }
        />

        <Route
          path="/register/user"
          element={
            <RequireAuth>
              <UserRegistrationPage />
            </RequireAuth>
          }
        />
        <Route
          path="/register/priest"
          element={
            <RequireAuth>
              <PriestRegistrationPage />
            </RequireAuth>
          }
        />

        <Route
          path="/home"
          element={
            <RequireRole role="USER">
              <HomePage />
            </RequireRole>
          }
        />

        <Route path="/rituals" element={<RitualsListPage />} />
        <Route path="/rituals/:id" element={<RitualDetailPage />} />
        <Route path="/priests" element={<PriestsListPage />} />
        <Route path="/priests/:id" element={<PanditDetailPage />} />
        <Route
          path="/priests/:id/select-ritual"
          element={
            <RequireAuth>
              <SelectRitualPage />
            </RequireAuth>
          }
        />
        <Route
          path="/priests/:id/request-booking"
          element={
            <RequireAuth>
              <RequestBookingPage />
            </RequireAuth>
          }
        />

        <Route
          path="/bookings"
          element={
            <RequireAuth>
              <BookingListPage />
            </RequireAuth>
          }
        />
        <Route
          path="/bookings/:id"
          element={
            <RequireAuth>
              <BookingDetailPage />
            </RequireAuth>
          }
        />
        <Route
          path="/booking-confirmation"
          element={
            <RequireAuth>
              <BookingConfirmationPage />
            </RequireAuth>
          }
        />
        <Route
          path="/notifications"
          element={
            <RequireAuth>
              <NotificationListPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="/calendar"
          element={
            <RequireAuth>
              <CalendarPage />
            </RequireAuth>
          }
        />
        <Route
          path="/store"
          element={
            <RequireAuth>
              <StorePage />
            </RequireAuth>
          }
        />
        <Route
          path="/store/cart"
          element={
            <RequireAuth>
              <Cart />
            </RequireAuth>
          }
        />
        <Route
          path="/store/product/:productId"
          element={
            <RequireAuth>
              <ProductDetail />
            </RequireAuth>
          }
        />
        <Route
          path="/store/checkout"
          element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          }
        />
        <Route
          path="/store/order/:orderId"
          element={
            <RequireAuth>
              <OrderTracking />
            </RequireAuth>
          }
        />

        <Route
          path="/priest/dashboard"
          element={
            <RequireRole role="PRIEST">
              <PriestDashboardPage />
            </RequireRole>
          }
        />
        <Route
          path="/priest/bookings"
          element={
            <RequireRole role="PRIEST">
              <PriestBookingListPage />
            </RequireRole>
          }
        />
        <Route
          path="/priest/bookings/:id"
          element={
            <RequireRole role="PRIEST">
              <PriestBookingDetailPage />
            </RequireRole>
          }
        />

        <Route
          path="/admin"
          element={
            <RequireRole role="ADMIN">
              <AdminDashboardPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/priests"
          element={
            <RequireRole role="ADMIN">
              <AdminPriestsPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/priests/:id"
          element={
            <RequireRole role="ADMIN">
              <AdminPriestDetailPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RequireRole role="ADMIN">
              <AdminUsersPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <RequireRole role="ADMIN">
              <AdminUserDetailPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/rituals"
          element={
            <RequireRole role="ADMIN">
              <AdminRitualsPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/banners"
          element={
            <RequireRole role="ADMIN">
              <AdminBannersPage />
            </RequireRole>
          }
        />
      </Routes>
      <AppDownloadPopup />
      <SplashScreen />
    </BrowserRouter>
  );
}

export default App;
