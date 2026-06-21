import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const pages = [
  {
    slug: 'sign-nda-online',
    title: 'Sign NDA Online Free – No Upload, No Account',
    h1: 'Sign Your NDA Online — 100% Private',
    description: 'Sign Non-Disclosure Agreements online for free. Your NDA never leaves your device. No uploads, no account, no watermarks.',
    keywords: 'sign nda online free, sign non disclosure agreement online, nda signature tool',
    intro: 'Non-Disclosure Agreements contain some of your most sensitive business information — trade secrets, client names, proprietary processes. The last thing you should do is upload that document to a random cloud server just to add a signature.',
    why: 'NDAs are legally sensitive. Uploading them to a cloud PDF tool means that company has access to your confidential business terms. With SignifyPDF, your NDA is signed entirely in your browser — no file ever leaves your computer.',
    steps: ['Upload your NDA PDF', 'Draw your signature on our secure canvas', 'Drag and place it on the signature line', 'Download your signed NDA instantly'],
    schema_type: 'NDA signing',
  },
  {
    slug: 'sign-contract-online',
    title: 'Sign Contracts Online Free – Local & Secure',
    h1: 'Sign Any Contract Online — Instantly & Securely',
    description: 'Sign contracts online for free without uploading to a server. Draw your signature and download the signed PDF in seconds.',
    keywords: 'sign contract online free, sign pdf contract, digital contract signature',
    intro: 'Whether it\'s a freelance agreement, service contract, or business deal — you need a fast, private way to sign it without paying for DocuSign or uploading sensitive terms to a cloud server.',
    why: 'Contracts contain payment terms, personal addresses, and confidential business clauses. SignifyPDF processes your contract 100% locally in your browser. Nothing is stored. Nothing is uploaded. The signed PDF goes straight to your downloads.',
    steps: ['Drag & drop your contract PDF', 'Click "Draw Signature" and sign with your mouse or finger', 'Right-click (desktop) or long-press (mobile) to place the signature', 'Download the signed contract'],
    schema_type: 'contract signing',
  },
  {
    slug: 'sign-rental-agreement-online',
    title: 'Sign Rental Agreement Online Free – No Cloud Upload',
    h1: 'Sign Your Rental Agreement Online — Free & Private',
    description: 'Sign rental and lease agreements online for free. Your document never leaves your browser. No signup required.',
    keywords: 'sign rental agreement online, sign lease online free, landlord tenant pdf signature',
    intro: 'Rental agreements contain your home address, your landlord\'s personal details, monthly payment amounts, and lease terms. This is exactly the kind of document you should never upload to an unknown cloud server.',
    why: 'Rental agreements are packed with personal information. SignifyPDF is the only PDF signer that guarantees your lease stays entirely on your device. Sign it, download it, and send it to your landlord — all within 60 seconds.',
    steps: ['Open your lease or rental agreement PDF', 'Draw your signature on the canvas', 'Place it on all required signature lines', 'Download and send to your landlord'],
    schema_type: 'rental agreement signing',
  },
  {
    slug: 'sign-offer-letter-online',
    title: 'Sign Offer Letter Online Free – Secure PDF Signer',
    h1: 'Sign Your Job Offer Letter Online — Free',
    description: 'Sign employment offer letters online for free. No uploads, no account. Draw your signature and download instantly.',
    keywords: 'sign offer letter online, sign employment letter pdf, job offer signature free',
    intro: 'You just received a job offer letter. It contains your salary, start date, and employment terms. You need to sign and return it quickly — but you shouldn\'t have to pay for Adobe or risk uploading your compensation details to a cloud tool.',
    why: 'Offer letters contain salary information and personal employment terms. SignifyPDF signs them 100% in your browser in under a minute, with no subscription, no account, and zero file uploads.',
    steps: ['Upload your offer letter PDF', 'Draw a professional signature', 'Place it in the signature box', 'Download and email back to your employer'],
    schema_type: 'offer letter signing',
  },
  {
    slug: 'sign-w9-form-online',
    title: 'Sign W-9 Form Online Free – No Upload Required',
    h1: 'Sign Your W-9 Form Online — Safely & Free',
    description: 'Sign IRS W-9 tax forms online for free. Your Social Security Number stays on your device. No uploads, no servers.',
    keywords: 'sign w9 form online, w-9 pdf signature free, irs w9 digital signature',
    intro: 'A W-9 form contains your full name, address, and Social Security Number or Tax ID. This is perhaps the most sensitive document you will ever need to sign. You should be extremely cautious about which tool you use.',
    why: 'Uploading a W-9 to a cloud server exposes your SSN and tax details to potential breaches. SignifyPDF is purpose-built for exactly this scenario — your W-9 is signed entirely in your browser memory. Nothing is transmitted. Nothing is stored.',
    steps: ['Open your W-9 PDF in SignifyPDF', 'Draw your legal signature', 'Place it in the signature field', 'Download the completed, signed W-9 instantly'],
    schema_type: 'W-9 form signing',
  },
  {
    slug: 'sign-invoice-online',
    title: 'Sign Invoice Online Free – Instant PDF Signature',
    h1: 'Sign Your Invoice Online — Free & Instant',
    description: 'Add your signature to invoices online for free. No account, no upload, no watermarks. Download the signed PDF in seconds.',
    keywords: 'sign invoice online free, invoice pdf signature, add signature to invoice',
    intro: 'Whether you\'re a freelancer, contractor, or small business owner, you need a fast way to sign and send invoices. You don\'t need a subscription. You don\'t need to upload your client\'s billing details to a cloud server.',
    why: 'Invoices contain client names, billing amounts, and payment details. SignifyPDF lets you sign any invoice PDF directly in your browser with zero uploads and zero cost — perfect for freelancers and small businesses.',
    steps: ['Upload your invoice PDF', 'Draw your professional signature', 'Place it in the signature area', 'Download and send to your client'],
    schema_type: 'invoice signing',
  },
  {
    slug: 'docusign-alternative',
    dir: '',
    title: 'Best Free DocuSign Alternative – No Subscription Needed',
    h1: 'The Best Free DocuSign Alternative',
    description: 'SignifyPDF is the best free alternative to DocuSign. No subscription, no account, no uploads. Sign PDFs 100% locally in your browser.',
    keywords: 'docusign alternative free, free esignature tool, docusign replacement no subscription',
    intro: 'DocuSign charges up to $45/month for a personal plan. If you just need to occasionally sign a PDF — an NDA, a contract, a lease — that\'s an absurd cost. Here is why SignifyPDF is the smarter alternative.',
    why: 'DocuSign stores your documents on their servers. SignifyPDF stores nothing. DocuSign requires an account. SignifyPDF requires nothing. DocuSign costs money. SignifyPDF is free forever. Same result — your PDF is signed.',
    steps: ['Go to SignifyPDF.com (no account needed)', 'Upload your PDF', 'Draw and place your signature', 'Download — done in under 60 seconds, for free'],
    schema_type: 'DocuSign alternative',
    is_comparison: true,
    compare_with: 'DocuSign',
    compare_rows: [
      ['Price', '$45/month', 'Free forever'],
      ['Account required', '✗ Yes', '✓ No'],
      ['File uploaded to server', '✗ Yes', '✓ Never'],
      ['Watermarks on free plan', '✗ Yes', '✓ None'],
      ['Open source', '✗ No', '✓ Yes'],
      ['Works offline', '✗ No', '✓ Yes'],
    ],
  },
  {
    slug: 'adobe-fill-sign-alternative',
    dir: '',
    title: 'Best Free Adobe Fill & Sign Alternative',
    h1: 'Free Alternative to Adobe Fill & Sign',
    description: 'SignifyPDF is a free, local alternative to Adobe Fill & Sign. No Adobe account, no subscription, no file uploads. Sign PDFs instantly.',
    keywords: 'adobe fill sign alternative, free alternative to adobe acrobat, sign pdf without adobe',
    intro: 'Adobe Fill & Sign is built into a massive, expensive ecosystem. If you just need to sign a PDF occasionally, you shouldn\'t need an Adobe subscription or even an Adobe account. SignifyPDF gives you the same result for free.',
    why: 'Adobe\'s free tier is limited, ad-supported, and requires a login. SignifyPDF requires nothing — open the site, sign your PDF, download it. That\'s it. No ecosystem lock-in.',
    steps: ['Open SignifyPDF.com in any browser', 'Drop your PDF into the workspace', 'Draw your signature with your mouse or finger', 'Download the signed PDF — no Adobe required'],
    schema_type: 'Adobe Fill & Sign alternative',
    is_comparison: true,
    compare_with: 'Adobe Fill & Sign',
    compare_rows: [
      ['Price', 'Subscription required', 'Free forever'],
      ['Account required', '✗ Yes (Adobe ID)', '✓ No account'],
      ['File stored on server', '✗ Yes', '✓ Never'],
      ['Works on all browsers', '⚠️ Limited', '✓ Yes'],
      ['Open source', '✗ No', '✓ Yes'],
      ['Mobile friendly', '⚠️ App required', '✓ Browser-based'],
    ],
  },
];

const secondBlog = {
  slug: 'blog/is-signing-pdfs-online-safe',
  title: 'Is Signing PDFs Online Safe? The Truth About Cloud PDF Tools',
  h1: 'Is Signing PDFs Online Safe?',
  description: 'Are online PDF signing tools safe? We break down the real privacy risks and show you the only truly safe way to sign a PDF for free.',
  keywords: 'is signing pdf online safe, pdf signing privacy risk, safe pdf signature tool',
};

const sharedCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0f172a; --bg-card: #1e293b; --accent: #38bdf8;
    --accent-dark: #0ea5e9; --text: #f8fafc; --muted: #94a3b8;
    --border: rgba(255,255,255,0.08); --green: #10b981; --red: #f87171;
  }
  html { scroll-behavior: smooth; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif; background: var(--bg); color: var(--text); line-height: 1.7; }

  /* ── Header: matches main app exactly ── */
  header.site-header {
    padding: 1.5rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    background: rgba(11,12,16,0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  header.site-header a.logo {
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: -0.5px;
    background: linear-gradient(to right, #60a5fa, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-decoration: none;
  }
  header.site-header a.cta {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
  }
  header.site-header a.cta:hover { background: #2563eb; transform: translateY(-1px); }
  @media(max-width:768px) { header.site-header { padding: 1rem 1.25rem; } header.site-header a.logo { font-size: 1.2rem; } }

  .hero { max-width: 820px; margin: 5rem auto 0; padding: 0 1.5rem; }
  .tag { display: inline-block; background: rgba(56,189,248,0.12); color: var(--accent); font-size: 0.8rem; font-weight: 600; padding: 0.3rem 0.85rem; border-radius: 999px; margin-bottom: 1.25rem; text-transform: uppercase; letter-spacing: 0.05em; }
  h1 { font-size: clamp(1.8rem,4vw,2.6rem); font-weight: 800; line-height: 1.25; margin-bottom: 1rem; background: linear-gradient(135deg,#f8fafc,#94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .lead { color: var(--muted); font-size: 1.1rem; margin-bottom: 3rem; }
  article { max-width: 820px; margin: 0 auto; padding: 0 1.5rem 5rem; }
  article h2 { font-size: 1.5rem; font-weight: 700; margin: 2.5rem 0 1rem; color: var(--text); }
  article p { color: var(--muted); margin-bottom: 1.25rem; }
  article strong { color: var(--text); }
  .steps { list-style: none; display: flex; flex-direction: column; gap: 1rem; margin: 1rem 0 2rem; }
  .steps li { display: flex; gap: 1rem; align-items: flex-start; background: rgba(255,255,255,0.03); border: 1px solid var(--border); padding: 1rem 1.25rem; border-radius: 12px; }
  .step-num { background: var(--accent); color: #0f172a; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; flex-shrink: 0; margin-top: 2px; }
  .cta-block { background: linear-gradient(135deg,rgba(56,189,248,0.1),rgba(14,165,233,0.05)); border: 1px solid rgba(56,189,248,0.2); border-radius: 16px; padding: 2.5rem; text-align: center; margin: 3rem 0; }
  .cta-block h2 { margin: 0 0 0.75rem; font-size: 1.6rem; -webkit-text-fill-color: var(--text); }
  .cta-block p { margin: 0 0 1.5rem; color: var(--muted); }
  .cta-block a { display: inline-block; background: var(--accent); color: #0f172a; padding: 0.9rem 2.5rem; border-radius: 10px; font-weight: 700; font-size: 1.05rem; text-decoration: none; box-shadow: 0 4px 20px rgba(56,189,248,0.3); }
  .table-wrap { overflow-x: auto; margin: 2rem 0; border-radius: 12px; border: 1px solid var(--border); }
  table { width: 100%; border-collapse: collapse; }
  thead { background: rgba(56,189,248,0.08); }
  thead th { padding: 0.9rem 1.25rem; text-align: left; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent); }
  tbody tr { border-top: 1px solid var(--border); }
  tbody td { padding: 0.9rem 1.25rem; color: var(--muted); font-size: 0.95rem; }
  .g { color: var(--green); font-weight: 700; }
  .r { color: var(--red); font-weight: 700; }
  footer { border-top: 1px solid var(--border); padding: 2rem; text-align: center; color: var(--muted); font-size: 0.85rem; }
  footer a { color: var(--accent); text-decoration: none; }
  @media(max-width:768px) { nav { padding: 0.85rem 1rem; } .hero { margin-top: 3rem; } }
`;

function generatePage(p) {
  const comparisonTable = p.is_comparison ? `
    <h2>SignifyPDF vs ${p.compare_with}</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Feature</th><th>${p.compare_with}</th><th>SignifyPDF</th></tr></thead>
        <tbody>
          ${p.compare_rows.map(([f, bad, good]) => `
            <tr>
              <td><strong>${f}</strong></td>
              <td class="r">${bad}</td>
              <td class="g">${good}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${p.title}</title>
  <meta name="description" content="${p.description}" />
  <meta name="keywords" content="${p.keywords}" />
  <meta name="author" content="Asad Ali" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://signifypdf.com/${p.slug}.html" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${p.title}" />
  <meta property="og:description" content="${p.description}" />
  <meta property="og:url" content="https://signifypdf.com/${p.slug}.html" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${p.title}" />
  <meta name="twitter:description" content="${p.description}" />
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"WebPage","name":"${p.title}","description":"${p.description}","url":"https://signifypdf.com/${p.slug}.html","isPartOf":{"@type":"WebSite","name":"SignifyPDF","url":"https://signifypdf.com"}}
  </script>
  <style>${sharedCSS}</style>
</head>
<body>
<header class="site-header">
  <a href="/" class="logo">✍️ SignifyPDF</a>
  <a href="/" class="cta">Sign PDF Free →</a>
</header>
<div class="hero">
  <span class="tag">Free PDF Signing Tool</span>
  <h1>${p.h1}</h1>
  <p class="lead">${p.description}</p>
</div>
<article>
  <h2>The Problem With Other PDF Tools</h2>
  <p>${p.intro}</p>

  <h2>Why SignifyPDF Is the Safer Choice</h2>
  <p>${p.why}</p>

  ${comparisonTable}

  <h2>How to Sign Your Document in 4 Steps</h2>
  <ol class="steps">
    ${p.steps.map((s, i) => `<li><span class="step-num">${i + 1}</span><span>${s}</span></li>`).join('')}
  </ol>

  <div class="cta-block">
    <h2>Ready to Sign? It's 100% Free.</h2>
    <p>No account. No uploads. No watermarks. Your document stays on your device.</p>
    <a href="/">Open SignifyPDF Now →</a>
  </div>

  <h2>Frequently Asked Questions</h2>

  <h3 style="color:var(--accent);font-size:1rem;margin:1.5rem 0 0.5rem;">Is this really free?</h3>
  <p>Yes, completely. SignifyPDF is open-source and free forever. No plans, no trials, no watermarks.</p>

  <h3 style="color:var(--accent);font-size:1rem;margin:1.5rem 0 0.5rem;">Is my document safe?</h3>
  <p>Your file never leaves your computer. All processing happens locally in your browser using JavaScript. There are no servers involved in handling your documents.</p>

  <h3 style="color:var(--accent);font-size:1rem;margin:1.5rem 0 0.5rem;">Does it work on mobile?</h3>
  <p>Yes. SignifyPDF works on any modern browser on desktop, tablet, or mobile. On mobile, use the "Tap to Sign" button and draw your signature with your finger.</p>

</article>
<footer>
  <p>© 2026 SignifyPDF · Built by <a href="https://www.linkedin.com/in/asad-ali-21197a177/" target="_blank">Asad Ali</a> · <a href="/privacy-policy.html">Privacy Policy</a> · <a href="/terms-of-service.html">Terms of Service</a></p>
</footer>
</body>
</html>`;
}

// Generate all tool pages
for (const p of pages) {
  const path = `public/${p.slug}.html`;
  const dir = dirname(path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path, generatePage(p));
  console.log(`✓ Generated: ${path}`);
}

// Generate second blog post
const blogHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${secondBlog.title}</title>
  <meta name="description" content="${secondBlog.description}" />
  <meta name="keywords" content="${secondBlog.keywords}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://signifypdf.com/${secondBlog.slug}.html" />
  <meta property="og:title" content="${secondBlog.title}" />
  <meta property="og:description" content="${secondBlog.description}" />
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Article","headline":"${secondBlog.title}","author":{"@type":"Person","name":"Asad Ali"},"datePublished":"2026-06-21"}
  </script>
  <style>${sharedCSS}
  .verdict { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); border-radius: 12px; padding: 1.5rem; margin: 2rem 0; }
  .verdict h3 { color: var(--green); margin-bottom: 0.5rem; }
  </style>
</head>
<body>
<header class="site-header">
  <a href="/" class="logo">✍️ SignifyPDF</a>
  <a href="/" class="cta">Sign PDF Free →</a>
</header>
<div class="hero">
  <span class="tag">Privacy & Security</span>
  <h1>${secondBlog.h1}</h1>
  <p class="lead">We analyzed 10 popular free PDF signing tools. Here is what we found — and the only signing method that keeps your documents truly private.</p>
</div>
<article>
  <h2>The Short Answer: It Depends on the Tool</h2>
  <p>Some online PDF signing tools are reasonably safe for low-sensitivity documents. But for anything containing personal data — SSNs, salary figures, home addresses, legal terms — the answer is almost always <strong>no, it is not safe enough</strong>.</p>
  <p>Here is why.</p>

  <h2>What Happens When You Upload a PDF to a Cloud Signer?</h2>
  <p>When you use tools like Smallpdf, iLovePDF, or PDF2Go, your document travels over the internet to a remote server. That server processes the signature, then sends the file back. During this process:</p>
  <ul style="padding-left:1.5rem;color:var(--muted);display:flex;flex-direction:column;gap:0.5rem;margin-bottom:1.25rem;">
    <li>Your document exists on someone else's hardware</li>
    <li>It may be stored temporarily or indefinitely</li>
    <li>It could be exposed in a data breach</li>
    <li>It may be used to train AI models in some services</li>
    <li>Employees with system access can theoretically view it</li>
  </ul>

  <h2>The Documents You Should Never Upload</h2>
  <p>Tax returns, NDAs, employment contracts, rental agreements, bank statements, medical forms, W-9 forms, legal filings. These all contain data that can be used for identity theft, corporate espionage, or targeted phishing.</p>

  <h2>The Only Truly Safe Method: Local Processing</h2>
  <p>A PDF signer that runs entirely in your browser — using JavaScript — never sends your file to any server. Your browser is the server. The file stays in memory on your device and is deleted the moment you close the tab.</p>

  <div class="verdict">
    <h3>✓ The Verdict</h3>
    <p>For sensitive documents, only use a <strong>local-first PDF signer</strong> like <a href="/" style="color:var(--accent);">SignifyPDF</a>. It processes everything in your browser. Nothing is uploaded. Nothing is stored.</p>
  </div>

  <div class="cta-block">
    <h2>Sign Your PDF the Safe Way</h2>
    <p>100% local. 100% free. No account, no uploads, no watermarks.</p>
    <a href="/">Open SignifyPDF →</a>
  </div>
</article>
<footer>
  <p>© 2026 SignifyPDF · <a href="/privacy-policy.html">Privacy Policy</a> · <a href="/terms-of-service.html">Terms of Service</a></p>
</footer>
</body>
</html>`;

mkdirSync('public/blog', { recursive: true });
writeFileSync(`public/${secondBlog.slug}.html`, blogHtml);
console.log(`✓ Generated: public/${secondBlog.slug}.html`);
console.log('\n✅ All SEO pages generated successfully!');
