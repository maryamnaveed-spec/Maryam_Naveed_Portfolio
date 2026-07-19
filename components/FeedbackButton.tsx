'use client';

import { useState } from 'react';
import FeedbackModal from './FeedbackModal';

export default function FeedbackButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        Leave feedback
      </button>
      {open && <FeedbackModal onClose={() => setOpen(false)} />}
    </>
  );
}
