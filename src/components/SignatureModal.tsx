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

    // Clear and set up styling
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    isDirtyRef.current = false;
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000';

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const toggleDrawing = (e: MouseEvent) => {
      isDrawing = !isDrawing;
      if (isDrawing) {
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
      }
    };

    const stopDrawing = () => {
      isDrawing = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.globalCompositeOperation = isEraserRef.current ? 'destination-out' : 'source-over';
      ctx.lineWidth = isEraserRef.current ? 20 : 3;

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();

      lastX = x;
      lastY = y;
      isDirtyRef.current = true;
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault(); // Prevent right-click menu so user can right-click to toggle
    };

    canvas.addEventListener('mousedown', toggleDrawing);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('contextmenu', handleContextMenu);

    return () => {
      canvas.removeEventListener('mousedown', toggleDrawing);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', stopDrawing);
      canvas.removeEventListener('contextmenu', handleContextMenu);
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
      alert("Please provide a signature first.");
      return;
    }
    
    // Trim functionality can be complex, but we will just save the whole canvas for now.
    // The signature scaling is handled in the util.
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div className="modal-overlay" onMouseDown={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Draw your signature (Click to start/stop drawing)</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        
        <div className="signature-pad-container" style={{ cursor: isEraser ? 'cell' : 'crosshair' }}>
          <canvas 
            ref={canvasRef}
            width={450}
            height={200}
            style={{ display: 'block' }}
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
