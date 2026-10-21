import { useEffect, useState } from 'react';
import { useAuthStore } from '../store';

const SPLASH_SEEN_KEY = 'shastri_splash_seen';
const MIN_VISIBLE_MS = 1800;

function hasSeenSplash() {
  try {
    return sessionStorage.getItem(SPLASH_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markSplashSeen() {
  try {
    sessionStorage.setItem(SPLASH_SEEN_KEY, '1');
  } catch {
    // storage unavailable (private mode etc.) — splash just shows again next load
  }
}

export default function SplashScreen() {
  const isLoading = useAuthStore((s) => s.isLoading);
  const [isDone, setIsDone] = useState(hasSeenSplash);
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    // Keep the splash up for a minimum time so it doesn't just flash
    const timer = setTimeout(() => setMinElapsed(true), MIN_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, []);

  // Fade out once the minimum time has passed and auth has resolved
  const isLeaving = minElapsed && !isLoading;

  const handleTransitionEnd = (e) => {
    if (e.target !== e.currentTarget || !isLeaving) return;
    markSplashSeen();
    setIsDone(true);
  };

  if (isDone) return null;

  return (
    <div
      role="status"
      aria-label="Loading Shastri Ji"
      onTransitionEnd={handleTransitionEnd}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg px-4 transition-opacity duration-500 ${
        isLeaving ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative motion-safe:animate-splash-logo">
        {/* soft glow behind the logo */}
        <div className="absolute inset-0 rounded-full bg-gold/40 blur-2xl motion-safe:animate-splash-glow" />
        <img
          src="/logo-512.webp"
          alt="Shastri Ji"
          className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover ring-4 ring-gold/30 shadow-2xl shadow-gold/30"
        />
      </div>

      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-dark mt-6 motion-safe:animate-fade-in-up-delay-2">
        Shastri Ji
      </h1>
      <p className="text-text-light text-sm mt-1 motion-safe:animate-fade-in-up-delay-3">
        Sacred rituals at your doorstep
      </p>

      <div className="flex gap-1.5 mt-8" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-gold motion-safe:animate-splash-dot"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
