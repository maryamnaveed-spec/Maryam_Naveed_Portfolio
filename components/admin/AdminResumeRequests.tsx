'use client';

import { useEffect, useState } from 'react';
import { supabase, ResumeRequestItem } from '@/lib/supabase';

export default function AdminResumeRequests() {
  const [requests, setRequests] = useState<ResumeRequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('resume_requests')
      .select('*')
      .order('created_at', { ascending: false });
    setRequests(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: 'approved' | 'rejected') {
    await supabase.from('resume_requests').update({ status }).eq('id', id);
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  async function remove(id: string) {
    if (!confirm('Delete this request?')) return;
    await supabase.from('resume_requests').delete().eq('id', id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="bg-surface border border-borderpink rounded-card p-6 card-shadow">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg">Resume requests</h3>
        {pendingCount > 0 && (
          <span className="text-[11px] font-semibold text-white bg-pink-600 px-2 py-0.5 rounded-full">
            {pendingCount} pending
          </span>
        )}
      </div>

      {loading && <p className="text-sm text-inksoft">Loading...</p>}
      {!loading && requests.length === 0 && (
        <p className="text-sm text-inksoft italic">No resume requests yet.</p>
      )}

      <div className="space-y-3">
        {requests.map((r) => (
          <div
            key={r.id}
            className={`border rounded-lg p-4 transition-colors ${
              r.status === 'pending'
                ? 'border-pink-400 bg-pink-50/50'
                : r.status === 'approved'
                ? 'border-emerald-300 bg-emerald-50/50'
                : r.status === 'downloaded'
                ? 'border-sky-200 bg-sky-50/40'
                : 'border-borderpink opacity-70'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <span className="font-semibold text-sm">{r.name}</span>
              <span
                className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${
                  r.status === 'pending'
                    ? 'text-pink-600 bg-pink-100'
                    : r.status === 'approved'
                    ? 'text-emerald-700 bg-emerald-100'
                    : r.status === 'downloaded'
                    ? 'text-sky-700 bg-sky-100'
                    : 'text-inksoft bg-borderpink'
                }`}
              >
                {r.status}
              </span>
            </div>
            <p className="text-sm text-inksoft mb-3 whitespace-pre-wrap">{r.reason}</p>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] text-inksoft/70">
                {new Date(r.created_at).toLocaleString('en-US')}
              </span>
              <div className="flex gap-2">
                {r.status !== 'approved' && (
                  <button
                    onClick={() => setStatus(r.id, 'approved')}
                    className="text-[11px] font-semibold px-3 py-1 rounded-full border border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    Approve
                  </button>
                )}
                {r.status !== 'rejected' && (
                  <button
                    onClick={() => setStatus(r.id, 'rejected')}
                    className="text-[11px] font-semibold px-3 py-1 rounded-full border border-red-200 text-red-500 hover:bg-red-50"
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => remove(r.id)}
                  className="text-[11px] font-semibold px-3 py-1 rounded-full border border-borderpink text-inksoft hover:bg-pink-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
