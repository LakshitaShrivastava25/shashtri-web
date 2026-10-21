import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../api/services';

const AuthLayout = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center px-4 py-8">
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <img
          src="/logo-512.webp"
          alt="Shastri Ji logo"
          className="w-24 h-24 rounded-full object-cover mx-auto mb-3 ring-4 ring-gold/30 shadow-lg shadow-gold/20"
        />
        <h1 className="font-heading text-2xl font-bold text-text-dark">Shastri Ji</h1>
        <p className="text-text-light text-sm">Sacred rituals at your doorstep</p>
      </div>
      <div className="bg-surface border border-border rounded-2xl shadow-xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-gold-light via-gold to-gold-light" />
        <div className="p-8">{children}</div>
      </div>
    </div>
  </div>
);

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error('Enter a valid 10-digit number');
      return;
    }
    setLoading(true);
    try {
      await authApi.sendOtp(phone);
      navigate('/otp', { state: { phone } });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="font-heading text-xl font-bold text-text-dark mb-1">Sign In</h2>
      <p className="text-text-light text-sm mb-6">
        Enter your mobile number to continue
      </p>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-mid font-medium text-sm select-none">
            +91
          </span>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="Mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 pl-14 text-text-dark placeholder-text-light focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-white font-semibold rounded-xl py-3 mt-4 hover:shadow-lg hover:shadow-gold/30 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Spinner />
              Loading...
            </>
          ) : (
            'Send OTP →'
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
