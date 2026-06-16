import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  file: File;
  onRightClick: (pageIndex: number, x: number, y: number, width: number, height: number) => void;
  onUpdateSignature: (id: string, x: number, y: number) => void;
  signatures: { id: string; pageIndex: number; x: number; y: number; dataUrl: string }[];
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ file, onRightClick, onUpdateSignature, signatures }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setError(null);
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const doc = await loadingTask.promise;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
      } catch (err: any) {
        console.error('Error loading PDF:', err);
        setError('Something went wrong while loading the document. Please ensure it is a valid PDF.');
      }
    };
    loadPdf();
  }, [file]);

  if (error) {
    return <div className="text-secondary" style={{ color: 'var(--danger)' }}>Error: {error}</div>;
  }

  if (!pdfDoc) {
    return <div className="text-secondary">Loading Document...</div>;
  }

  return (
    <div className="pdf-pages-container">
      {Array.from({ length: numPages }, (_, i) => (
        <PDFPage
          key={i}
          pageIndex={i}
          pdfDoc={pdfDoc}
          onRightClick={onRightClick}
          onUpdateSignature={onUpdateSignature}
          signatures={signatures.filter(s => s.pageIndex === i)}
        />
      ))}
    </div>
  );
};

interface PDFPageProps {
  pageIndex: number;
  pdfDoc: pdfjsLib.PDFDocumentProxy;
  onRightClick: (pageIndex: number, x: number, y: number, width: number, height: number) => void;
  onUpdateSignature: (id: string, x: number, y: number) => void;
  signatures: { id: string; x: number; y: number; dataUrl: string }[];
}

const PDFPage: React.FC<PDFPageProps> = ({ pageIndex, pdfDoc, onRightClick, onUpdateSignature, signatures }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchMoved = useRef(false);

  useEffect(() => {
    let renderTask: any = null;
    let isCancelled = false;

    const renderPage = async () => {
      if (!canvasRef.current) return;
      const page = await pdfDoc.getPage(pageIndex + 1);

      // Responsive scale: fit container width on mobile, fixed 1.5 on desktop
      const container = canvasRef.current.parentElement;
      const containerWidth = container?.clientWidth ?? window.innerWidth;
      const unscaled = page.getViewport({ scale: 1, rotation: 0 });
      const desktopScale = 1.5;
      const mobileScale = (containerWidth - 8) / unscaled.width;
      const isMobile = window.innerWidth <= 768;
      const scale = isMobile ? Math.min(desktopScale, mobileScale) : desktopScale;

      const viewport = page.getViewport({ scale, rotation: 0 });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (isCancelled) return;

      renderTask = page.render({ canvasContext: context, viewport });
      try {
        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') console.error('Render error:', err);
      }
    };

    renderPage();
    return () => {
      isCancelled = true;
      if (renderTask) renderTask.cancel();
    };
  }, [pageIndex, pdfDoc]);

  // ── Desktop: right-click to place signature ──────────────────────
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    // Scale mouse coords to internal canvas coords
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    onRightClick(pageIndex, x, y, canvasRef.current.width, canvasRef.current.height);
  };

  // ── Mobile: long-press (500ms) to place signature ────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchMoved.current = false;
    const touch = e.touches[0];

    longPressTimer.current = setTimeout(() => {
      if (touchMoved.current) return; // cancelled if finger moved (scroll)
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasRef.current.width / rect.width;
      const scaleY = canvasRef.current.height / rect.height;
      const x = (touch.clientX - rect.left) * scaleX;
      const y = (touch.clientY - rect.top) * scaleY;
      if (navigator.vibrate) navigator.vibrate(40);
      onRightClick(pageIndex, x, y, canvasRef.current.width, canvasRef.current.height);
    }, 500);
  };

  const handleTouchMove = () => {
    touchMoved.current = true;
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <div
      className="pdf-canvas-container"
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas ref={canvasRef} className="pdf-canvas" />
      {signatures.map((sig) => (
        <DraggableSignature
          key={sig.id}
          sig={sig}
          onUpdate={(id, x, y) => onUpdateSignature(id, x, y)}
        />
      ))}
    </div>
  );
};

const DraggableSignature = ({
  sig,
  onUpdate,
}: {
  sig: { id: string; x: number; y: number; dataUrl: string };
  onUpdate: (id: string, x: number, y: number) => void;
}) => {
  const [pos, setPos] = useState({ x: sig.x, y: sig.y });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPos({ x: sig.x, y: sig.y });
  }, [sig.x, sig.y]);

  // ── Mouse drag (desktop) ─────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const startX = e.clientX, startY = e.clientY;
    const startPosX = pos.x, startPosY = pos.y;
    setIsDragging(true);

    const onMove = (ev: MouseEvent) =>
      setPos({ x: startPosX + (ev.clientX - startX), y: startPosY + (ev.clientY - startY) });

    const onUp = (ev: MouseEvent) => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setIsDragging(false);
      onUpdate(sig.id, startPosX + (ev.clientX - startX), startPosY + (ev.clientY - startY));
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // ── Touch drag (mobile) ──────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation(); // don't trigger page long-press
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const startX = touch.clientX, startY = touch.clientY;
    const startPosX = pos.x, startPosY = pos.y;
    setIsDragging(true);

    const onTouchMove = (ev: TouchEvent) => {
      ev.preventDefault();
      const t = ev.touches[0];
      setPos({ x: startPosX + (t.clientX - startX), y: startPosY + (t.clientY - startY) });
    };

    const onTouchEnd = (ev: TouchEvent) => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      setIsDragging(false);
      const t = ev.changedTouches[0];
      onUpdate(sig.id, startPosX + (t.clientX - startX), startPosY + (t.clientY - startY));
    };

    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
  };

  return (
    <img
      src={sig.dataUrl}
      className="placed-signature"
      style={{
        left: pos.x,
        top: pos.y,
        width: '150px',
        height: 'auto',
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.8 : 1,
        transform: 'translate(-50%, -50%)',
        touchAction: 'none',
      }}
      alt="signature"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      draggable={false}
    />
  );
};
