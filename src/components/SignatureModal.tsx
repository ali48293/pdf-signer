import React, { useRef, useEffect, useState } from 'react';
import { X, Check, Pen, Eraser } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDirtyRef = useRef(false);
  const [isEraser, setIsEraser] = useState(false);
  const isEraserRef = useRef(false);

  const setEraserMode = (mode: boolean) => {
    setIsEraser(mode);
    isEraserRef.current = mode;
  };

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    isDirtyRef.current = false;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000';

    // ── Shared draw helper (must be defined FIRST) ──────────────────
    const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.globalCompositeOperation = isEraserRef.current ? 'destination-out' : 'source-over';
      ctx.lineWidth = isEraserRef.current ? 20 : 3;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      isDirtyRef.current = true;
    };

    // ── MOUSE support (desktop) ─────────────────────────────────────
    let isMouseDrawing = false;
    let lastMX = 0;
    let lastMY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDrawing = true;
      const rect = canvas.getBoundingClientRect();
      lastMX = (e.clientX - rect.left) * (canvas.width / rect.width);
      lastMY = (e.clientY - rect.top) * (canvas.height / rect.height);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      drawLine(lastMX, lastMY, x, y);
      lastMX = x;
      lastMY = y;
    };

    const onMouseUp = () => { isMouseDrawing = false; };
    const onMouseLeave = () => { isMouseDrawing = false; };
    const onContextMenu = (e: MouseEvent) => e.preventDefault();

    // ── TOUCH support (mobile) ──────────────────────────────────────
    let lastTX = 0;
    let lastTY = 0;

    const getTouchCoords = (touch: Touch) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (touch.clientX - rect.left) * (canvas.width / rect.width),
        y: (touch.clientY - rect.top) * (canvas.height / rect.height),
      };
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const { x, y } = getTouchCoords(e.touches[0]);
      lastTX = x;
      lastTY = y;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const { x, y } = getTouchCoords(e.touches[0]);
      drawLine(lastTX, lastTY, x, y);
      lastTX = x;
      lastTY = y;
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('contextmenu', onContextMenu);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('contextmenu', onContextMenu);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    isDirtyRef.current = false;
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !isDirtyRef.current) {
      alert('Please draw your signature first.');
      return;
    }
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div className="modal-overlay" onMouseDown={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Draw your signature</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <p className="modal-hint">
          Desktop: click &amp; drag &nbsp;·&nbsp; Mobile: draw with your finger
        </p>

        <div className="signature-pad-container" style={{ cursor: isEraser ? 'cell' : 'crosshair' }}>
          <canvas
            ref={canvasRef}
            width={450}
            height={200}
            style={{ display: 'block', width: '100%', height: 'auto', touchAction: 'none' }}
          />
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-secondary"
              style={{ background: !isEraser ? 'var(--card-border)' : '' }}
              onClick={() => setEraserMode(false)}
              title="Pen"
            >
              <Pen size={16} />
            </button>
            <button
              className="btn btn-secondary"
              style={{ background: isEraser ? 'var(--card-border)' : '' }}
              onClick={() => setEraserMode(true)}
              title="Eraser"
            >
              <Eraser size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={handleClear}>
              Clear
            </button>
            <button className="btn" onClick={handleSave}>
              <Check size={16} /> Place Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
