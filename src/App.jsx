import { useState, useId } from 'react';
import localLogo from './assets/netcradus-logo.png';
import {
  generateSignatureHtml,
  generatePlainTextSignature,
} from './utils/signatureTemplates.js';
import { copySignatureToClipboard, downloadSignatureHtml } from './utils/clipboard.js';
import './App.css';

function App() {
  // Form State initialized with empty fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    designation: '',
  });

  // Touch tracking for validation feedback
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    designation: false,
  });

  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  // Unique accessible IDs
  const nameId = useId();
  const emailId = useId();
  const designationId = useId();

  // Field Validations
  const validateName = (val) => {
    if (!val || !val.trim()) return 'Full Name is required.';
    return '';
  };

  const validateEmail = (val) => {
    if (!val || !val.trim()) return 'Official Email Address is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) {
      return 'Please enter a valid email address (e.g. name@netcradus.com).';
    }
    return '';
  };

  const validateDesignation = (val) => {
    if (!val || !val.trim()) return 'Designation is required.';
    return '';
  };

  const errors = {
    fullName: validateName(formData.fullName),
    email: validateEmail(formData.email),
    designation: validateDesignation(formData.designation),
  };

  const isFormValid = !errors.fullName && !errors.email && !errors.designation;

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 4000);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleReset = () => {
    setFormData({ fullName: '', email: '', designation: '' });
    setTouched({ fullName: false, email: false, designation: false });
    showToast('success', 'Form fields cleared.');
  };

  // Generate Current Email Signature HTML
  const currentSignatureHtml = generateSignatureHtml({
    fullName: formData.fullName,
    email: formData.email,
    designation: formData.designation,
  });

  const currentPlainText = generatePlainTextSignature({
    fullName: formData.fullName,
    email: formData.email,
    designation: formData.designation,
  });

  // Copy Action
  const handleCopySignature = async () => {
    setTouched({ fullName: true, email: true, designation: true });

    if (!isFormValid) {
      showToast('error', 'Please fill in all required fields with valid details.');
      return;
    }

    const result = await copySignatureToClipboard(currentSignatureHtml, currentPlainText);
    if (result.success) {
      showToast('success', 'Signature copied! Paste directly into your email settings.');
    } else {
      showToast('error', result.error || 'Failed to copy signature.');
    }
  };

  // Download Action
  const handleDownloadHtml = () => {
    setTouched({ fullName: true, email: true, designation: true });

    if (!isFormValid) {
      showToast('error', 'Please fill in all required fields before downloading.');
      return;
    }

    const result = downloadSignatureHtml(currentSignatureHtml, formData.fullName);
    if (result.success) {
      showToast('success', `Signature downloaded as ${result.fileName}`);
    } else {
      showToast('error', result.error || 'Failed to download HTML file.');
    }
  };

  return (
    <div className="app-wrapper">
      {/* Header matching visual prototype */}
      <header className="app-header">
        <div className="header-container">
          <div className="header-brand-group">
            <img
              src={localLogo}
              alt="Netcradus Logo"
              className="header-logo-img"
            />
            <div className="header-divider" aria-hidden="true" />
            <div className="header-text-group">
              <span className="header-title">Email Signature Generator</span>
              <span className="header-subtitle">Netcradus Limited</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Two-Column Layout */}
      <main className="app-main">
        <div className="layout-grid">
          {/* Left Column: Employee Information Form */}
          <section className="panel-card" aria-labelledby="form-heading">
            <h1 id="form-heading" className="card-heading">Employee Information</h1>

            <div className="form-stack">
              {/* Field 1: Full Name */}
              <div className="form-group">
                <label htmlFor={nameId} className="form-label">
                  Full Name <span className="required-asterisk">*</span>
                </label>
                <input
                  id={nameId}
                  type="text"
                  className={`form-input ${touched.fullName && errors.fullName ? 'has-error' : ''}`}
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  autoComplete="name"
                />
                {touched.fullName && errors.fullName && (
                  <span className="field-error-text" role="alert">{errors.fullName}</span>
                )}
              </div>

              {/* Field 2: Official Email Address */}
              <div className="form-group">
                <label htmlFor={emailId} className="form-label">
                  Official Email Address <span className="required-asterisk">*</span>
                </label>
                <input
                  id={emailId}
                  type="email"
                  className={`form-input ${touched.email && errors.email ? 'has-error' : ''}`}
                  placeholder="Enter your official email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  autoComplete="email"
                />
                {touched.email && errors.email && (
                  <span className="field-error-text" role="alert">{errors.email}</span>
                )}
              </div>

              {/* Field 3: Designation */}
              <div className="form-group">
                <label htmlFor={designationId} className="form-label">
                  Designation <span className="required-asterisk">*</span>
                </label>
                <input
                  id={designationId}
                  type="text"
                  className={`form-input ${touched.designation && errors.designation ? 'has-error' : ''}`}
                  placeholder="Enter your designation"
                  value={formData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  onBlur={() => handleBlur('designation')}
                />
                {touched.designation && errors.designation && (
                  <span className="field-error-text" role="alert">{errors.designation}</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="button-stack">
                <button
                  type="button"
                  id="copy-signature-btn"
                  className="btn-copy-signature"
                  onClick={handleCopySignature}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy Signature</span>
                </button>

                <button
                  type="button"
                  id="download-html-btn"
                  className="btn-download-html"
                  onClick={handleDownloadHtml}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download HTML</span>
                </button>
              </div>

              <div className="form-clear-row">
                <button type="button" className="btn-clear-form" onClick={handleReset}>
                  Clear form
                </button>
              </div>
            </div>
          </section>

          {/* Right Column: Signature Preview + Usage Instructions */}
          <div className="right-column-stack">
            {/* Signature Preview Card */}
            <section className="panel-card" aria-labelledby="preview-heading">
              <h2 id="preview-heading" className="card-heading">Signature Preview</h2>

              {/* Centered Email Signature Box matching prototype */}
              <div
                id="signature-preview-container"
                className="preview-inner-box"
                dangerouslySetInnerHTML={{ __html: currentSignatureHtml }}
              />

              {/* Prototype Info Text */}
              <div className="preview-helper-text">
                <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>Copy your signature and paste it into your email client's signature settings.</span>
              </div>
            </section>

            {/* Collapsible How to Use Your Signature Section */}
            <section className="panel-card instructions-panel" aria-labelledby="instructions-heading">
              <button
                type="button"
                id="instructions-heading"
                className="instructions-toggle-btn"
                onClick={() => setInstructionsOpen((prev) => !prev)}
                aria-expanded={instructionsOpen}
              >
                <span className="instructions-heading">How to Use Your Signature</span>
                <svg
                  className={`instructions-chevron ${instructionsOpen ? 'open' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {instructionsOpen && (
                <div className="instructions-body">
                  <div className="instructions-grid">
                    {/* Step 1 */}
                    <div className="instruction-step-card">
                      <div className="step-card-header">
                        <span className="step-badge">1</span>
                        <h3 className="step-title">Copy or Download</h3>
                      </div>
                      <ul className="step-bullet-list">
                        <li>Click &ldquo;Copy Signature&rdquo; to copy the formatted email signature.</li>
                        <li>Alternatively, click &ldquo;Download HTML&rdquo; to download the signature as an HTML file.</li>
                      </ul>
                    </div>

                    {/* Step 2 */}
                    <div className="instruction-step-card">
                      <div className="step-card-header">
                        <span className="step-badge">2</span>
                        <h3 className="step-title">Open Email Settings</h3>
                      </div>
                      <ul className="step-bullet-list">
                        <li><strong>Gmail:</strong> Settings &rarr; See all settings &rarr; General &rarr; Signature.</li>
                        <li><strong>Outlook:</strong> Settings &rarr; Mail &rarr; Compose and reply, or the corresponding signature settings in your Outlook version.</li>
                        <li><strong>Apple Mail:</strong> Mail &rarr; Settings &rarr; Signatures.</li>
                      </ul>
                    </div>

                    {/* Step 3 */}
                    <div className="instruction-step-card">
                      <div className="step-card-header">
                        <span className="step-badge">3</span>
                        <h3 className="step-title">Paste and Save</h3>
                      </div>
                      <ul className="step-bullet-list">
                        <li>If you copied the signature, paste it into the signature editor using <kbd>Ctrl+V</kbd> on Windows or <kbd>Cmd+V</kbd> on Mac.</li>
                        <li>If you downloaded the HTML file, open it in a browser, copy the rendered signature, and paste it into your email signature editor. Do not paste the raw HTML source as plain text.</li>
                        <li>Save the changes in your email client.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Toast Feedback */}
      {toast && (
        <aside className={`toast-notice ${toast.type}`} role="status" aria-live="polite">
          <span className="toast-message">{toast.message}</span>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => setToast(null)}
            aria-label="Close notification"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </aside>
      )}
    </div>
  );
}

export default App;
