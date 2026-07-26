'use client';

import { useState } from 'react';

export default function ShareButtons({
  title,
  imageUrl
}: {
  title: string;
  imageUrl: string;
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl = imageUrl;
  const shareText = `${title} — by Maryam Naveed`;

  function stop(e: React.MouseEvent) {
    e.stopPropagation();
  }

  function shareWhatsapp(e: React.MouseEvent) {
    stop(e);
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function shareFacebook(e: React.MouseEvent) {
    stop(e);
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async function shareInstagram(e: React.MouseEvent) {
    stop(e);
    // Instagram has no public "share this link" web endpoint, so we lean on
    // the native share sheet where available (it lists Instagram as an
    // option on phones), and fall back to copy-link otherwise.
    if (navigator.share) {
      try {
        await navigator.share({ title: shareText, url: shareUrl });
        return;
      } catch {
        /* user cancelled - fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
    } catch {
      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <div className="flex items-center gap-1.5 pt-2 mt-2 border-t border-borderpink/70" onClick={stop}>
      <span className="text-[10px] text-inksoft/60 mr-0.5">Share:</span>
      <button
        onClick={shareWhatsapp}
        aria-label="Share on WhatsApp"
        title="Share on WhatsApp"
        className="w-8 h-8 flex items-center justify-center rounded-full text-sm bg-[#25D366]/10 text-[#1fa855] hover:bg-[#25D366]/20 transition-colors"
      >
        🟢
      </button>
      <button
        onClick={shareFacebook}
        aria-label="Share on Facebook"
        title="Share on Facebook"
        className="w-8 h-8 flex items-center justify-center rounded-full text-sm bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors"
      >
        🔵
      </button>
      <button
        onClick={shareInstagram}
        aria-label="Share on Instagram"
        title="Share on Instagram"
        className="w-8 h-8 flex items-center justify-center rounded-full text-sm bg-gradient-to-br from-pink-400/15 to-gold/15 text-pink-600 hover:from-pink-400/25 hover:to-gold/25 transition-colors"
      >
        🟣
      </button>
      {copied && <span className="text-[10px] text-emerald-600 ml-1">Link copied!</span>}
    </div>
  );
}
