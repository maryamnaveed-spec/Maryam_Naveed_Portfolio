'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase, ResumeRequestStatus } from '@/lib/supabase';
import { forceDownload } from '@/lib/forceDownload';
import ResumeRequestModal from './ResumeRequestModal';

const STORAGE_KEY = 'resume_request_id';

type LocalStatus = 'none' | ResumeRequestStatus | 'checking';

export default function ResumeRequestButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<LocalStatus>('checking');
  const [downloading, setDownloading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function checkStatus(id: string) {
    const { data, error } = await supabase
      .from('resume_requests')
      .select('status')
      .eq('id', id)
      .single();

    if (error || !data) {
      // request row is gone (e.g. deleted by admin) - reset
      localStorage.removeItem(STORAGE_KEY);
      setStatus('none');
      return;
    }

    if (data.status === 'rejected' || data.status === 'downloaded') {
      localStorage.removeItem(STORAGE_KEY);
      setStatus('none');
    } else {
      setStatus(data.status as ResumeRequestStatus);
    }
  }

  useEffect(() => {
    const id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      setStatus('none');
      return;
    }
    checkStatus(id);

    // Keep checking every 20s while a request is outstanding, so the button
    // flips to "Download CV" on its own once Maryam approves it - no need
    // to refresh the page.
    pollRef.current = setInterval(() => {
      const currentId = localStorage.getItem(STORAGE_KEY);
      if (currentId) checkStatus(currentId);
    }, 20000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmitted(id: string) {
    localStorage.setItem(STORAGE_KEY, id);
    setStatus('pending');
    setOpen(false);
  }

  async function handleDownload() {
    setDownloading(true);
    const { data } = await supabase
      .from('settings')
      .select('resume_url')
      .eq('id', 1)
      .single();

    if (data?.resume_url) {
      await forceDownload(data.resume_url, 'Maryam-Naveed-Resume.pdf');

      // One approved request = one download. Mark it used so the button
      // goes back to "Request Resume" and a fresh approval is needed for
      // the next download.
      const id = localStorage.getItem(STORAGE_KEY);
      if (id) {
        await supabase.from('resume_requests').update({ status: 'downloaded' }).eq('id', id);
        localStorage.removeItem(STORAGE_KEY);
      }
      setStatus('none');
    }
    setDownloading(false);
  }

  function handleClick() {
    if (status === 'none') {
      setOpen(true);
    } else if (status === 'approved') {
      handleDownload();
    }
    // 'pending' -> no-op, button is disabled below
  }

  const baseClass =
    className ??
    'text-sm font-semibold px-4 py-2 rounded-full border transition-colors';

  let label = 'Request Resume';
  let extraClass = 'border-borderpink text-inksoft hover:bg-pink-50';
  let disabled = false;

  if (status === 'checking') {
    label = 'Request Resume';
  } else if (status === 'pending') {
    label = 'Request sent ⏳';
    extraClass = 'border-goldlight text-gold bg-goldlight/20 cursor-default';
    disabled = true;
  } else if (status === 'approved') {
    label = downloading ? 'Downloading...' : 'Download CV ✓';
    extraClass =
      'border-transparent text-white bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40';
  }

  return (
    <>
      <button onClick={handleClick} disabled={disabled} className={`${baseClass} ${extraClass}`}>
        {label}
      </button>
      {open && (
        <ResumeRequestModal onClose={() => setOpen(false)} onSubmitted={handleSubmitted} />
      )}
    </>
  );
}
