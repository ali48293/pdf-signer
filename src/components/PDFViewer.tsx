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
    <div className="pdf-workspace">
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

  useEffect(() => {
    let renderTask: any = null;
    let isCancelled = false;

    const renderPage = async () => {
      if (!canvasRef.current) return;
      const page = await pdfDoc.getPage(pageIndex + 1);
      
      let scale = 1.5;
      const viewport = page.getViewport({ scale, rotation: 0 });
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (isCancelled) return;

      renderTask = page.render({
        canvasContext: context,
        viewport: viewport,
      });

      try {
        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Render error:', err);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pageIndex, pdfDoc]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    onRightClick(pageIndex, x, y, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div className="pdf-canvas-container" onContextMenu={handleContextMenu}>
      <canvas ref={canvasRef} className="pdf-canvas" />
      {/* Overlay signatures for this page */}
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
  onUpdate 
}: { 
  sig: { id: string; x: number; y: number; dataUrl: string }, 
  onUpdate: (id: string, x: number, y: number) => void 
}) => {
  const [pos, setPos] = useState({ x: sig.x, y: sig.y });
  const [isDragging, setIsDragging] = useState(false);

  // Sync prop changes if they happen externally
  useEffect(() => {
    setPos({ x: sig.x, y: sig.y });
  }, [sig.x, sig.y]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click for dragging
    e.stopPropagation(); // Prevent right-click menu or placing new signatures under it
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = pos.x;
    const startPosY = pos.y;
    
    setIsDragging(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      setPos({
        x: startPosX + (moveEvent.clientX - startX),
        y: startPosY + (moveEvent.clientY - startY)
      });
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setIsDragging(false);
      
      const finalX = startPosX + (upEvent.clientX - startX);
      const finalY = startPosY + (upEvent.clientY - startY);
      onUpdate(sig.id, finalX, finalY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
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
        // center the image origin to the point just like before
        transform: 'translate(-50%, -50%)'
      }}
      alt="signature"
      onMouseDown={handleMouseDown}
      draggable={false}
    />
  );
};
