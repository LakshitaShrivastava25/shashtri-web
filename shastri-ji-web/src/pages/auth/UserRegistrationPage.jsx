import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../api/services';
import { useAuthStore } from '../../store';

const OmIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
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
);

const AuthLayout = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center px-4 py-8">
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <OmIcon size={48} className="text-gold mx-auto mb-2" />
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

const inputClass =
  'w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-dark placeholder-text-light focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all';

const selectClass = `${inputClass} appearance-none`;

export default function UserRegistrationPage() {
  const navigate = useNavigate();

  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [language, setLanguage] = useState('');
  const [options, setOptions] = useState({ states: [], languages: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    authApi
      .getRegistrationOptions()
      .then((res) => {
        if (!cancelled) setOptions(res.data || { states: [], languages: [] });
      })
      .catch(() => {
        // silent — fields fall back to empty selects
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.detailedRegisterUser({ city, state: stateVal, language });
      useAuthStore.getState().markRegistrationCompleted();
      navigate('/home');
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || 'Failed to save profile'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      await authApi.skipDetailedRegister();
      useAuthStore.getState().markRegistrationCompleted();
      navigate('/home');
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || 'Failed to skip'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="font-heading text-xl font-bold text-text-dark mb-1">
        Complete Your Profile
      </h2>
      <p className="text-text-light text-sm mb-6">Personalise your experience</p>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1">
            City
          </label>
          <input
            type="text"
            placeholder="Your city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-dark mb-1">
            State
          </label>
          <select
            value={stateVal}
            onChange={(e) => setStateVal(e.target.value)}
            className={selectClass}
          >
            <option value="">Select state</option>
            {options.states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-dark mb-1">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={selectClass}
          >
            <option value="">Select language</option>
            {options.languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-white font-semibold rounded-xl py-3 hover:shadow-lg hover:shadow-gold/30 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Spinner />
              Saving...
            </>
          ) : (
            'Save & Continue'
          )}
        </button>
      </form>

      <button
        type="button"
        onClick={handleSkip}
        disabled={loading}
        className="w-full text-center text-text-light text-sm hover:text-gold transition-colors mt-3 cursor-pointer"
      >
        Skip for now →
      </button>
    </AuthLayout>
  );
}
