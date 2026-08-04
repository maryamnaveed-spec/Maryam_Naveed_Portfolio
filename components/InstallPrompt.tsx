'use client';

import { useEffect, useRef, useState } from 'react';

const DISMISS_KEY = 'pwa_install_dismissed';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

type Mode = 'ios' | 'auto' | 'manual';

export default function InstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [visible, setVisible] = useState(false);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) return;

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    if (isStandalone) return;

    const ua = window.navigator.userAgent;
    const iOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;

    if (iOSDevice) {
      // iOS never fires beforeinstallprompt - the Share-sheet steps are the
      // only way in, so just show them after the page settles.
      const t = setTimeout(() => {
        setMode('ios');
        setVisible(true);
      }, 1500);
      return () => clearTimeout(t);
    }

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredEvent(e as BeforeInstallPromptEvent);
      setMode('auto');
      setVisible(true);
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);

    // Chrome only fires beforeinstallprompt once its own engagement
    // heuristics are satisfied - that can take a few visits, not just one
    // page load. Rather than leave visitors with "nothing happened", show
    // the manual browser-menu steps as a fallback if the automatic prompt
    // hasn't shown up after a few seconds. If the real event still fires
    // later, onBeforeInstallPrompt above upgrades this to the real button.
    fallbackTimer.current = setTimeout(() => {
      setMode((current) => current ?? 'manual');
      setVisible(true);
    }, 6000);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    };
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

  if (!visible || !mode) return null;

  return (
    <div className="w-full bg-gradient-to-r from-pink-400 to-pink-600 text-white animate-fadeUp">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-2.5 flex items-center gap-3">
        <span className="text-xl flex-shrink-0" aria-hidden="true">
          📲
        </span>
        <p className="flex-1 text-xs sm:text-sm font-medium leading-snug min-w-0">
          {mode === 'ios' && (
            <>
              Install this app: tap <strong>Share</strong> then{' '}
              <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
            </>
          )}
          {mode === 'manual' && (
            <>
              Install this app: open the browser menu (<strong>⋮</strong>) and
              tap <strong>&ldquo;Install app&rdquo;</strong> or{' '}
              <strong>&ldquo;Add to Home screen&rdquo;</strong>.
            </>
          )}
          {mode === 'auto' &&
            'Install Maryam Naveed as an app for quick access, right from your home screen.'}
        </p>
        {mode === 'auto' && (
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

