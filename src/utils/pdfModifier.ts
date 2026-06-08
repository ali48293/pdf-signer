import { PDFDocument } from 'pdf-lib';

export interface SignatureData {
  id: string;
  dataUrl: string; // PNG base64
  x: number;
  y: number; // Coordinate from top-left in CSS pixels
  pageIndex: number;
  pdfWidth: number; // Original canvas width when signed
  pdfHeight: number; // Original canvas height when signed
}

export async function addSignaturesToPdf(
  originalPdfBytes: ArrayBuffer,
  signatures: SignatureData[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(originalPdfBytes);
  const pages = pdfDoc.getPages();

  for (const sig of signatures) {
    const page = pages[sig.pageIndex];
    if (!page) continue;

    // Load the base64 image
    const imageBytes = fetch(sig.dataUrl).then(res => res.arrayBuffer());
    const pngImage = await pdfDoc.embedPng(await imageBytes);

    // Get page dimensions
    const { width: pageWidth, height: pageHeight } = page.getSize();

    // The signature was drawn on a canvas with size sig.pdfWidth x sig.pdfHeight
    const scaleX = pageWidth / sig.pdfWidth;
    const scaleY = pageHeight / sig.pdfHeight;

    const sigWidth = 150; 
    const sigHeight = 75;

    const pdfX = sig.x * scaleX;
    const pdfY = pageHeight - (sig.y * scaleY);

    page.drawImage(pngImage, {
      x: pdfX - sigWidth / 2,
      y: pdfY - sigHeight / 2,
      width: sigWidth,
      height: sigHeight,
    });
  }

  return await pdfDoc.save();
}
