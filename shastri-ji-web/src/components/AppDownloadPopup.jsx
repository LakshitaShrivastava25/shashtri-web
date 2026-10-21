import { useState, useEffect } from 'react';
import { X, Smartphone } from 'lucide-react';

const APP_STORE_URL = 'https://apps.apple.com/us/app/shashtri-jii/id6778672568';
const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.shastri_ji.app&pcampaignid=web_share';

export default function AppDownloadPopup() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show popup after 3 seconds on first visit
    // Check localStorage — don't show if permanently dismissed
    const dismissed = localStorage.getItem('app_popup_dismissed');
    if (dismissed === 'permanent') {
      setIsDismissed(true);
      return;
    }
    const timer = setTimeout(() => setIsExpanded(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExpanded(false);
    // Collapse to pill, don't permanently dismiss
  };

  const handleDismissPermanent = () => {
    localStorage.setItem('app_popup_dismissed', 'permanent');
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* EXPANDED POPUP */}
      {isExpanded && (
        <div
          className="w-[300px] bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#F0E8D8]"
          style={{ animation: 'slideUp 0.3s ease-out' }}
        >
          {/* HEADER — dark brown */}
          <div className="bg-[#2D1B00] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* App icon */}
              <img
                src="/logo-512.webp"
                alt="Shastri Ji"
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                style={{ background: '#2D1B00' }}
              />
              <div>
                <div className="text-white font-semibold text-sm">
                  Shastri Ji App
                </div>
                <div className="text-[#F4A623] text-[10px]">
                  ★★★★★ 4.8 rating
                </div>
              </div>
            </div>
            {/* Close button — collapses to pill */}
            <button
              type="button"
              onClick={handleClose}
              className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-white/70 hover:bg-white/25 transition-colors text-sm font-medium"
              aria-label="Collapse popup"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* BODY — white */}
          <div className="px-4 pt-4 pb-3">
            <p className="text-sm font-semibold text-[#2D1B00] mb-1">
              Get the app for a better experience
            </p>
            <p className="text-xs text-[#8B7355] mb-4 leading-relaxed">
              Book pandits, track rituals &amp; get reminders — all in one
              place.
            </p>

            {/* Store buttons */}
            <div className="flex gap-2 mb-3">
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#2D1B00] rounded-xl px-3 py-2.5 flex items-center gap-2 hover:bg-[#3D2810] transition-colors"
              >
                <svg
                  className="w-4 h-4 text-white flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div>
                  <div className="text-white/60 text-[9px] leading-none">
                    App Store
                  </div>
                  <div className="text-white text-xs font-bold leading-tight mt-0.5">
                    iOS
                  </div>
                </div>
              </a>
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#2D1B00] rounded-xl px-3 py-2.5 flex items-center gap-2 hover:bg-[#3D2810] transition-colors"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M3.18 23.76c.3.17.64.19.96.08L14.76 12 3.18.16C2.86.27 2.5.49 2.5.98v22.04c0 .49.36.71.68.74zM19 14.22l-2.48-1.66 2.48-1.66L21.5 12 19 14.22zM16.27 6.93L5.49 1.27 14 9.78l2.27-2.85zM5.49 22.73l10.78-5.66L14 14.22l-8.51 8.51z" />
                </svg>
                <div>
                  <div className="text-white/60 text-[9px] leading-none">
                    Google Play
                  </div>
                  <div className="text-white text-xs font-bold leading-tight mt-0.5">
                    Android
                  </div>
                </div>
              </a>
            </div>

            {/* Scan row */}
            <div className="bg-[#FFF8ED] rounded-xl px-3 py-2.5 flex items-center gap-3">
              <div className="w-8 h-8 bg-[#F4A623]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-4 h-4 text-[#F4A623]" />
              </div>
              <div>
                <div className="text-[10px] text-[#8B7355]">
                  Scan to download
                </div>
                <div className="text-xs font-semibold text-[#2D1B00]">
                  shastriji.app/download
                </div>
              </div>
            </div>

            {/* Permanent dismiss link */}
            <button
              type="button"
              onClick={handleDismissPermanent}
              className="w-full text-center text-[10px] text-[#C0A882] hover:text-[#8B7355] mt-2.5 transition-colors"
            >
              Don&apos;t show again
            </button>
          </div>
        </div>
      )}

      {/* COLLAPSED PILL */}
      {!isExpanded && !isDismissed && (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="bg-[#2D1B00] border border-[#F4A623] rounded-full px-4 py-2 flex items-center gap-2 shadow-lg hover:bg-[#3D2810] transition-colors"
          style={{ animation: 'slideUp 0.3s ease-out' }}
        >
          <div className="w-5 h-5 bg-[#F4A623] rounded-md flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-3 h-3 text-[#2D1B00]" />
          </div>
          <span className="text-white text-xs font-semibold">Get the App</span>
          <span className="text-[#F4A623] text-xs">↑</span>
        </button>
      )}

      {/* Slide-up animation */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
