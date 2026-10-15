import { LOGO_BASE64 } from '../assets/logoBase64.js';

export const OFFICIAL_COMPANY_NAME = 'Netcradus Limited';
export const OFFICIAL_WEBSITE_URL = 'https://netcradus.com';

/**
 * Generates email-compatible HTML signature matching the official prototype:
 * - Netcradus logo left-aligned at top
 * - Employee name, designation, company name, email address, and website below it
 * 
 * @param {Object} params
 * @param {string} params.fullName - Employee Full Name
 * @param {string} params.email - Official Email Address
 * @param {string} params.designation - Employee Designation
 * @returns {string} Email-safe HTML string
 */
export function generateSignatureHtml({
  fullName = '',
  email = '',
  designation = '',
}) {
  const name = fullName.trim() || 'Divyanshu Kumar';
  const mail = email.trim() || 'divyanshu@netcradus.com';
  const role = designation.trim() || 'Software Engineer';

  return `<table cellpadding="0" cellspacing="0" border="0" class="netcradus-signature" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, Helvetica, sans-serif; font-size: 13px; line-height: 1.4; color: #1e293b; max-width: 480px; width: 100%; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
  <!-- Row 1: Left-Aligned Logo -->
  <tr>
    <td align="left" style="text-align: left; padding: 0 0 18px 0;">
      <a href="${OFFICIAL_WEBSITE_URL}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-block;">
        <img src="${LOGO_BASE64}" alt="Netcradus" width="155" height="17" border="0" style="display: block; width: 155px; height: 17px; max-width: 155px; border: 0; outline: none; text-decoration: none;" />
      </a>
    </td>
  </tr>
  <!-- Row 2: Employee & Company Details (Left-Aligned) -->
  <tr>
    <td style="text-align: left;">
      <table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, Helvetica, sans-serif; font-size: 13px; line-height: 1.4; color: #1e293b; border-collapse: collapse;">
        <tr>
          <td style="font-size: 16px; font-weight: bold; color: #0f172a; line-height: 1.25; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, Helvetica, sans-serif;">
            ${name}
          </td>
        </tr>
        <tr>
          <td style="font-size: 13px; font-weight: 600; color: #ea580c; line-height: 1.3; padding-top: 3px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, Helvetica, sans-serif;">
            ${role}
          </td>
        </tr>
        <tr>
          <td style="font-size: 12px; font-weight: 500; color: #475569; line-height: 1.3; padding-top: 3px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, Helvetica, sans-serif;">
            ${OFFICIAL_COMPANY_NAME}
          </td>
        </tr>
        <tr>
          <td style="font-size: 12px; color: #64748b; line-height: 1.4; padding-top: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, Helvetica, sans-serif;">
            <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
              <tr>
                <td valign="middle" style="padding-right: 6px; vertical-align: middle;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" style="display: block;">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </td>
                <td valign="middle" style="vertical-align: middle;">
                  <a href="mailto:${mail}" style="color: #0284c7; text-decoration: none; font-weight: 500;">${mail}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="font-size: 12px; color: #64748b; line-height: 1.4; padding-top: 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, Helvetica, sans-serif;">
            <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
              <tr>
                <td valign="middle" style="padding-right: 6px; vertical-align: middle;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" style="display: block;">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </td>
                <td valign="middle" style="vertical-align: middle;">
                  <a href="${OFFICIAL_WEBSITE_URL}" target="_blank" rel="noopener noreferrer" style="color: #0284c7; text-decoration: none; font-weight: 500;">${OFFICIAL_WEBSITE_URL}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

/**
 * Generates plain text version of the signature for fallback clipboard.
 */
export function generatePlainTextSignature({ fullName = '', email = '', designation = '' }) {
  const name = fullName.trim() || 'Employee Name';
  const mail = email.trim() || 'name@netcradus.com';
  const role = designation.trim() || 'Designation';

  return `${name}
${role}
${OFFICIAL_COMPANY_NAME}
Email: ${mail}
Web: ${OFFICIAL_WEBSITE_URL}`;
}

/**
 * Generates complete standalone HTML file content for downloading.
 */
export function generateFullHtmlDocument(signatureHtml, employeeName = 'Employee') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Netcradus Email Signature - ${employeeName}</title>
  <style>
    body {
      margin: 0;
      padding: 40px 20px;
      background-color: #f3f6f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .wrapper {
      max-width: 520px;
      width: 100%;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
    }
    .instructions {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 20px;
      padding-bottom: 14px;
      border-bottom: 1px solid #e2e8f0;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="instructions">
      <strong>Netcradus Official Email Signature</strong><br>
      Copy your signature (<kbd>Ctrl+C</kbd> or <kbd>Cmd+C</kbd>) and paste it into your email client's signature settings.
    </div>
    ${signatureHtml}
  </div>
</body>
</html>`;
}
