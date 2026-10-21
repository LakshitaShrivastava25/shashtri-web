import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../api/services';
import { tokenStorage } from '../../api/client';
import { useAuthStore } from '../../store';

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

const ROLE_OPTIONS = [
  { value: 'USER', emoji: '🙏', title: 'Devotee', desc: 'Book rituals & ceremonies' },
  { value: 'PRIEST', emoji: '📿', title: 'Pandit', desc: 'Offer your services' },
];

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState(location.state?.user?.name || '');
  const [role, setRole] = useState('USER');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tokens = location.state?.tokens;
    if (tokens) tokenStorage.setTokens(tokens.access, tokens.refresh);
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    setLoading(true);
    try {
      const data = await authApi.shortRegister(
        location.state.phone,
        name,
        role
      );
      const userObj = data?.user || {};
      useAuthStore
        .getState()
        .login(location.state.tokens, { ...userObj, name, role });
      navigate(role === 'PRIEST' ? '/register/priest' : '/register/user');
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || 'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="font-heading text-xl font-bold text-text-dark mb-1">
        Create Account
      </h2>
      <p className="text-text-light text-sm mb-6">Tell us a bit about yourself</p>
      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-text-dark mb-1">
          Your Name
        </label>
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-dark placeholder-text-light focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
        />

        <p className="text-sm font-medium text-text-dark mt-5 mb-2">I am a…</p>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {ROLE_OPTIONS.map((opt) => {
            const selected = role === opt.value;
            return (
              <div
                key={opt.value}
                onClick={() => setRole(opt.value)}
                className={
                  'cursor-pointer rounded-xl border-2 p-5 text-center transition-all ' +
                  (selected
                    ? 'border-gold bg-gold/10 shadow-md'
                    : 'border-border bg-bg hover:border-gold/40')
                }
              >
                <div className="text-3xl mb-2">{opt.emoji}</div>
                <div className="font-heading text-base font-bold text-text-dark">
                  {opt.title}
                </div>
                <div className="text-xs text-text-light mt-1">{opt.desc}</div>
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-white font-semibold rounded-xl py-3 mt-6 hover:shadow-lg hover:shadow-gold/30 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Spinner />
              Saving...
            </>
          ) : (
            'Continue →'
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
