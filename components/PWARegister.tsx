'use client';

import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Silently ignore - the site still works fully without the SW,
        // it just won't be installable/offline-capable.
      });
    }
  }, []);

  return null;
}
