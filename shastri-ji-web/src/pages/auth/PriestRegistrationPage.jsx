import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi, ritualsApi } from '../../api/services';
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

const inputClass =
  'w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-dark placeholder-text-light focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all';

const selectClass = `${inputClass} appearance-none`;

const textareaClass =
  'w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-dark placeholder-text-light focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-none';

export default function PriestRegistrationPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [traditions, setTraditions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [city, setCity] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [traditionId, setTraditionId] = useState('');

  const [bio, setBio] = useState('');
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    let cancelled = false;
    ritualsApi
      .traditions()
      .then((res) => {
        if (cancelled) return;
        const list = res?.data?.results ?? res?.data ?? [];
        setTraditions(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        // silent
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.detailedRegisterPriestStep1({
        city,
        experience_years: experienceYears,
        tradition_id: traditionId,
      });
      setStep(2);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || 'Failed to save details'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      if (bio) fd.append('bio', bio);
      if (upiId) fd.append('upi_id', upiId);
      await authApi.detailedRegisterPriestStep2(fd);
      useAuthStore.getState().markRegistrationCompleted();
      navigate('/priest/dashboard');
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || 'Failed to complete registration'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex gap-2 mb-2">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={
              'flex-1 h-1.5 rounded-full transition-all ' +
              (s <= step ? 'bg-gold' : 'bg-border')
            }
          />
        ))}
      </div>
      <p className="text-xs text-text-light mb-4">Step {step} of 2</p>

      {step === 1 ? (
        <>
          <h2 className="font-heading text-xl font-bold text-text-dark mb-1">
            Your Practice
          </h2>
          <p className="text-text-light text-sm mb-6">
            Help devotees find the right Pandit
          </p>
          <form onSubmit={handleStep1Submit} className="space-y-4">
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
                Experience (years)
              </label>
              <input
                type="number"
                min={0}
                placeholder="e.g. 10"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">
                Tradition
              </label>
              <select
                value={traditionId}
                onChange={(e) => setTraditionId(e.target.value)}
                className={selectClass}
              >
                <option value="">Select tradition</option>
                {traditions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
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
                'Next →'
              )}
            </button>
          </form>
        </>
      ) : (
        <>
          <h2 className="font-heading text-xl font-bold text-text-dark mb-1">
            About You
          </h2>
          <p className="text-text-light text-sm mb-6">
            A short bio and UPI for payouts
          </p>
          <form onSubmit={handleStep2Submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">
                Bio
              </label>
              <textarea
                rows={4}
                placeholder="Tell devotees about your practice..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className={textareaClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">
                UPI ID
              </label>
              <input
                type="text"
                placeholder="yourname@bank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-white font-semibold rounded-xl py-3 hover:shadow-lg hover:shadow-gold/30 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner />
                  Submitting...
                </>
              ) : (
                'Complete Registration'
              )}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={loading}
              className="w-full text-center text-text-light text-sm hover:text-gold transition-colors mt-1 cursor-pointer"
            >
              ← Back
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
