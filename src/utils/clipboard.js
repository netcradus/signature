import { generateFullHtmlDocument } from './signatureTemplates.js';

/**
 * Copies rich HTML to clipboard with plaintext fallback.
 * @param {string} htmlString - Rich HTML markup
 * @param {string} plainText - Plain text fallback
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export async function copySignatureToClipboard(htmlString, plainText) {
  // Try modern Clipboard API with rich HTML
  if (navigator?.clipboard && typeof window.ClipboardItem !== 'undefined') {
    try {
      const htmlBlob = new Blob([htmlString], { type: 'text/html' });
      const textBlob = new Blob([plainText], { type: 'text/plain' });
      const item = new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob,
      });
      await navigator.clipboard.write([item]);
      return {
        success: true,
        message: 'Signature copied! Paste directly into Gmail, Outlook, or Apple Mail.',
      };
    } catch (clipboardErr) {
      console.warn('ClipboardItem write failed, falling back to execCommand:', clipboardErr);
    }
  }

  // Fallback: document.execCommand('copy') on DOM selection
  try {
    const container = document.createElement('div');
    container.innerHTML = htmlString;
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';
    container.setAttribute('aria-hidden', 'true');
    document.body.appendChild(container);

    const range = document.createRange();
    range.selectNode(container);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    const successful = document.execCommand('copy');
    selection.removeAllRanges();
    document.body.removeChild(container);

    if (successful) {
      return {
        success: true,
        message: 'Signature copied! Ready to paste into your email settings.',
      };
    }
  } catch (domErr) {
    console.warn('DOM copy fallback failed:', domErr);
  }

  // Last-resort fallback: plain text
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(plainText);
      return {
        success: true,
        message: 'Plain text signature copied (rich formatting was restricted by browser).',
      };
    }
  } catch (textErr) {
    console.warn('Plain text fallback failed:', textErr);
    return {
      success: false,
      error: 'Clipboard access was blocked by the browser. Please check browser permissions.',
    };
  }

  return {
    success: false,
    error: 'Could not copy to clipboard. Please copy manually or download HTML.',
  };
}

/**
 * Downloads signature as an HTML file.
 * @param {string} signatureHtml - Signature HTML
 * @param {string} employeeName - Employee name for the filename
 * @returns {{success: boolean, fileName?: string, error?: string}}
 */
export function downloadSignatureHtml(signatureHtml, employeeName = 'employee') {
  try {
    const cleanName = (employeeName || 'employee')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'signature';

    const fileName = `netcradus-signature-${cleanName}.html`;
    const fullHtml = generateFullHtmlDocument(signatureHtml, employeeName || 'Employee');

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1500);

    return {
      success: true,
      fileName,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Failed to download HTML file.',
    };
  }
}
