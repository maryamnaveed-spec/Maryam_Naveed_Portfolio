'use client';

import { useEffect, useState } from 'react';

const DISMISS_KEY = 'pwa_install_dismissed';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export default function InstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) return;

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    if (isStandalone) return;

    const ua = window.navigator.userAgent;
    const iOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredEvent(e as BeforeInstallPromptEvent);
      setVisible(true);
    }

    if (iOSDevice) {
      setIsIOS(true);
      // Give the page a moment to settle before nudging iOS visitors.
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, 'true');
  }

  async function handleInstall() {
    if (!deferredEvent) return;
    await deferredEvent.prompt();
    await deferredEvent.userChoice;
    setDeferredEvent(null);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="w-full bg-gradient-to-r from-pink-400 to-pink-600 text-white animate-fadeUp">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-2.5 flex items-center gap-3">
        <span className="text-xl flex-shrink-0" aria-hidden="true">
          📲
        </span>
        <p className="flex-1 text-xs sm:text-sm font-medium leading-snug min-w-0">
          {isIOS ? (
            <>
              Install this app: tap <strong>Share</strong> then{' '}
              <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
            </>
          ) : (
            'Install Maryam Naveed as an app for quick access, right from your home screen.'
          )}
        </p>
        {!isIOS && (
          <button
            onClick={handleInstall}
            className="flex-shrink-0 text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-1.5 rounded-full bg-white text-pink-600 hover:bg-pink-50 transition-colors"
          >
            Install
          </button>
        )}
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-lg leading-none"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
