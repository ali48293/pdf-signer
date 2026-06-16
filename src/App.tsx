import React, { useState, useRef } from 'react';
import { UploadCloud, Download, FileText, Mail, Globe } from 'lucide-react';
import { PDFViewer } from './components/PDFViewer';
import { SignatureModal } from './components/SignatureModal';
import { addSignaturesToPdf, SignatureData } from './utils/pdfModifier';

const GithubIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [signatures, setSignatures] = useState<SignatureData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingLocation, setPendingLocation] = useState<{
    pageIndex: number;
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file?: File) => {
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setSignatures([]); // Reset on new file
    } else if (file) {
      alert('Something went wrong. Please upload a valid PDF file.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleRightClick = (pageIndex: number, x: number, y: number, width: number, height: number) => {
    setPendingLocation({ pageIndex, x, y, width, height });
    setIsModalOpen(true);
  };

  const handleSaveSignature = (dataUrl: string) => {
    if (!pendingLocation) return;
    const newSignature: SignatureData = {
      id: Math.random().toString(36).substring(7),
      dataUrl,
      x: pendingLocation.x,
      y: pendingLocation.y,
      pageIndex: pendingLocation.pageIndex,
      pdfWidth: pendingLocation.width,
      pdfHeight: pendingLocation.height,
    };
    setSignatures([...signatures, newSignature]);
    setIsModalOpen(false);
    setPendingLocation(null);
  };

  const handleSavePDF = async () => {
    if (!pdfFile) return;
    setIsSaving(true);
    try {
      const originalBytes = await pdfFile.arrayBuffer();
      const signedPdfBytes = await addSignaturesToPdf(originalBytes, signatures);
      
      const blob = new Blob([signedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Filename appended with _signed
      const originalName = pdfFile.name;
      const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
      link.download = `${baseName}_signed.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // End the preview to show success
      setPdfFile(null);
      setSignatures([]);
      
      // Optional: Give a visual success alert
      alert('Success! Your signed document has been downloaded.');
      
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Failed to save the document.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSignature = (id: string, x: number, y: number) => {
    setSignatures(prev => prev.map(sig => sig.id === id ? { ...sig, x, y } : sig));
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>SignifyPDF</h1>
        {pdfFile && (
          <button 
            className="btn" 
            onClick={handleSavePDF}
            disabled={isSaving || signatures.length === 0}
          >
            <Download size={18} />
            {isSaving ? 'Processing...' : 'Download Signed PDF'}
          </button>
        )}
      </header>

      <main className="main-content">
        {!pdfFile ? (
          <div 
            className="upload-container" 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ 
              borderColor: isDragging ? 'var(--accent-color)' : '',
              background: isDragging ? 'rgba(59, 130, 246, 0.05)' : ''
            }}
          >
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              style={{ display: 'none' }}
            />
            <UploadCloud className="upload-icon" />
            <h2 className="upload-title">Drop your document here</h2>
            <p className="upload-subtitle">or click to browse from your computer (PDF only)</p>
          </div>
        ) : (
          <div className="pdf-workspace">
            <div className="controls">
              <FileText size={20} color="var(--accent-color)" />
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{pdfFile.name}</span>
              <span style={{ marginLeft: '1rem', color: 'var(--text-secondary)' }}>
                {signatures.length} signature(s) placed
              </span>
            </div>
            
            <p className="instruction-text">
              Tip: Right-click anywhere on the document to place a signature. You can drag placed signatures to reposition them.
            </p>

            <PDFViewer 
              file={pdfFile} 
              onRightClick={handleRightClick} 
              onUpdateSignature={handleUpdateSignature}
              signatures={signatures}
            />
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="seo-content">
          <div className="seo-column">
            <h3>How to Sign a PDF Locally</h3>
            <p>Signing a PDF has never been easier. Simply drag and drop your document into our secure workspace, right-click anywhere to place your signature, and download the finished file. No account required, and everything happens instantly in your browser.</p>
          </div>
          <div className="seo-column">
            <h3>Is it Safe to Sign PDFs Online?</h3>
            <p>Yes! Unlike other PDF tools that upload your sensitive documents to remote servers, SignifyPDF processes everything <strong>100% locally</strong> on your computer. Your files never touch our servers, guaranteeing maximum privacy and security.</p>
          </div>
          <div className="seo-column">
            <h3>Free Premium PDF Signer</h3>
            <p>SignifyPDF is a premium, open-source tool designed to give you a flawless signing experience without subscriptions, hidden fees, or watermarks. Draw your signature naturally with our trackpad-friendly canvas and drag it perfectly into position.</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-text">Developed by Asad Ali</p>
          <div className="footer-links">
            <a href="https://github.com/ali48293" target="_blank" rel="noopener noreferrer" title="GitHub">
              <GithubIcon size={18} />
            </a>
            <a href="mailto:asadalidev200@gmail.com" title="Email">
              <Mail size={18} />
            </a>
            <a href="https://www.linkedin.com/in/asad-ali-21197a177/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <LinkedinIcon size={18} />
            </a>
            <a href="https://divine-play-838786.framer.app/asad's" target="_blank" rel="noopener noreferrer" title="Portfolio">
              <Globe size={18} />
            </a>
          </div>
          <div className="footer-legal">
            <a href="/privacy-policy.html">Privacy Policy</a>
            <span>&middot;</span>
            <a href="/terms-of-service.html">Terms of Service</a>
          </div>
        </div>
      </footer>

      <SignatureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveSignature} 
      />
    </div>
  );
}

export default App;
