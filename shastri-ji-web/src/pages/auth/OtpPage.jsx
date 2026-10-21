import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../api/services';
import { useAuthStore } from '../../store';
import { getRoleDashboard } from '../../components/layout/Guards';

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
      <div className="bg-surface border border-border rounded-2xl shadow-lg p-8">
        {children}
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

export default function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;

  const [otp, setOtp] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  useEffect(() => {
    if (!phone) navigate('/login');
  }, [phone, navigate]);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  const handleChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
    if (val && idx < 5) inputRefs[idx + 1].current?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs[idx - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)
      .split('');
    const newOtp = Array(6).fill('');
    digits.forEach((d, i) => {
      newOtp[i] = d;
    });
    setOtp(newOtp);
    inputRefs[Math.min(digits.length, 5)].current?.focus();
  };

  const handleResend = async () => {
    try {
      await authApi.sendOtp(phone);
      toast.success('OTP resent');
      setCountdown(60);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || 'Failed to resend OTP'
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) {
      toast.error('Enter the complete 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.verifyOtp(phone, otpString);
      const status = response?.status;

      if (status === 'NEW_USER') {
        // New user — no tokens yet, go to registration
        navigate('/role-selection', {
          state: { phone, user: response?.user },
        });
        return;
      }

      // Existing user — must have tokens
      const accessToken = response?.tokens?.access;
      const refreshToken = response?.tokens?.refresh;
      const user = response?.user;

      if (!accessToken) {
        throw new Error('No access token in OTP response');
      }

      useAuthStore.getState().login(response.tokens, user);
      toast.success(`Welcome back, ${user?.name || ''}! 🙏`);
      navigate(getRoleDashboard(user?.role), { replace: true });

    } catch (err) {
      console.error('OTP verify failed:', err.message);
      toast.error(
        err?.response?.data?.message || err?.message || 'Invalid OTP'
      );
      setOtp(Array(6).fill(''));
      inputRefs[0].current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="font-heading text-xl font-bold text-text-dark mb-1">
        Verify OTP
      </h2>
      <p className="text-text-light text-sm">
        Sent to <span className="text-text-dark font-medium">+91 {phone}</span>
      </p>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 justify-center my-6">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={inputRefs[idx]}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              className="w-11 h-14 text-center text-xl font-bold bg-surface border border-border rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-text-dark"
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={idx === 0 ? handlePaste : undefined}
            />
          ))}
        </div>
        <div className="text-center text-sm text-text-light mb-4">
          {countdown > 0 ? (
            <span>
              Resend in{' '}
              <span className="text-gold font-semibold">{countdown}s</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-gold font-semibold hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-white font-semibold rounded-xl py-3 hover:shadow-lg hover:shadow-gold/30 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Spinner />
              Verifying...
            </>
          ) : (
            'Verify →'
          )}
        </button>
      </form>
      <Link
        to="/login"
        className="block text-center text-text-light text-sm hover:text-gold transition-colors mt-3"
      >
        ← Change Number
      </Link>
    </AuthLayout>
  );
}
