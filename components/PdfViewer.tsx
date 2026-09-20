'use client';

import { useEffect, useRef, useState } from 'react';

export default function PdfViewer({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<any>(null);
  const renderTaskRef = useRef<any>(null);

  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load the document once.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        // Import the package's main entry - deep subpaths like
        // "pdfjs-dist/legacy/build/pdf" aren't guaranteed to exist across
        // versions and can fail webpack's module resolution at build time.
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const doc = await pdfjsLib.getDocument(url).promise;
        if (cancelled) return;

        pdfDocRef.current = doc;
        setNumPages(doc.numPages);
        setPageNum(1);
        setLoading(false);
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || 'Could not open this PDF.');
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
      pdfDocRef.current?.destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  // Render the current page whenever it changes (and on container resize).
  useEffect(() => {
    if (!pdfDocRef.current || loading) return;
    let cancelled = false;

    async function renderPage() {
      try {
        renderTaskRef.current?.cancel?.();

        const page = await pdfDocRef.current.getPage(pageNum);
        if (cancelled) return;

        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const containerWidth = container.clientWidth || 800;
        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = containerWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale });

        const dpr = window.devicePixelRatio || 1;
        canvas.width = viewport.width * dpr;
        canvas.height = viewport.height * dpr;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const task = page.render({ canvasContext: ctx, viewport });
        renderTaskRef.current = task;
        await task.promise;
      } catch (err: any) {
        // Cancelled renders throw - that's expected when flipping pages
        // quickly, so only surface genuine failures.
        if (!cancelled && err?.name !== 'RenderingCancelledException') {
          setError(err?.message || 'Could not render this page.');
        }
      }
    }

    renderPage();
    return () => {
      cancelled = true;
    };
  }, [pageNum, loading]);

  function prevPage() {
    setPageNum((p) => Math.max(1, p - 1));
  }
  function nextPage() {
    setPageNum((p) => Math.min(numPages, p + 1));
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div
        ref={containerRef}
        className="flex-1 min-h-0 overflow-auto flex items-start justify-center bg-[#FFFDF9] px-2 py-4"
      >
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 text-inksoft text-sm h-full">
            <div className="w-8 h-8 rounded-full border-2 border-pink-200 border-t-pink-600 animate-spin" />
            <span>Opening book...</span>
          </div>
        )}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-2 text-center text-sm text-red-500 h-full px-6">
            <span>⚠️ {error}</span>
          </div>
        )}
        <canvas ref={canvasRef} className={loading || error ? 'hidden' : 'shadow-md rounded'} />
      </div>

      {!loading && !error && numPages > 0 && (
        <div className="flex items-center justify-center gap-4 py-3 border-t border-borderpink flex-shrink-0 bg-surface">
          <button
            onClick={prevPage}
            disabled={pageNum <= 1}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-borderpink text-inksoft disabled:opacity-30 hover:bg-pink-50"
            aria-label="Previous page"
          >
            ‹
          </button>
          <span className="text-xs text-inksoft font-medium">
            Page {pageNum} of {numPages}
          </span>
          <button
            onClick={nextPage}
            disabled={pageNum >= numPages}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-borderpink text-inksoft disabled:opacity-30 hover:bg-pink-50"
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
