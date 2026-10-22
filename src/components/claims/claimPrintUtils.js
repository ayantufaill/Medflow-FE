import medflowLogo from '../../assets/medflow-logo.png';

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

export const formatCurrency = (val) => {
  const num = Number(val) || 0;
  return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const formatStatus = (status) => {
  if (!status) return '—';
  const labels = {
    readyForSubmission: 'Ready for Submission',
    validationError: 'Validation Error',
    draft: 'Draft',
    submitted: 'Submitted',
    pending: 'Pending',
    accepted: 'Accepted',
    acceptedPaid: 'Accepted & Paid',
    acceptedForProcessing: 'Accepted for Processing',
    denied: 'Denied',
    rejected: 'Rejected',
    error: 'Error',
    inProcess: 'In Process',
    eobUploaded: 'EOB Uploaded',
    manualClaim: 'Manual Claim',
  };
  return labels[status] || status;
};

const formatDateValue = (val) => {
  if (!val) return '—';
  if (typeof val === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(val)) return val;
  const d = new Date(val);
  return isNaN(d.getTime()) ? String(val) : d.toLocaleDateString();
};

const isNotPatientCodeOrChart = (val, claim) => {
  if (val === null || val === undefined) return false;
  const str = String(val).trim();
  if (!str || str === '—' || str === '-' || str === 'undefined' || str === 'null') return false;

  const clean = str.replace(/[()]/g, '').trim().toLowerCase();

  const patCodes = [
    claim?.patientCode ? String(claim.patientCode).replace(/[()]/g, '').trim().toLowerCase() : null,
    claim?.patient?.patientCode ? String(claim.patient.patientCode).replace(/[()]/g, '').trim().toLowerCase() : null,
    claim?.patientRefId ? String(claim.patientRefId).trim().toLowerCase() : null,
    claim?.patient?.patNum ? String(claim.patient.patNum).trim().toLowerCase() : null,
    claim?.patient?.PatNum ? String(claim.patient.PatNum).trim().toLowerCase() : null,
  ].filter(Boolean);

  if (patCodes.includes(clean)) return false;
  return true;
};

/**
 * Resolves the ID to display for an Outstanding Claim:
 * - If the person has a membership plan, shows the Member ID.
 * - If the person has no membership plan, shows the Subscriber ID.
 * - Never returns patient chart codes (like PAT001).
 * - Cross-resolves from other claims of the same patient if patientLookup is provided.
 */
export const getMemberOrSubscriberId = (claim, patientLookup = null) => {
  if (!claim) return '—';

  const hasMembership = Boolean(
    claim.hasMembershipPlan ||
    claim.isMembershipPlan ||
    claim.patient?.hasMembershipPlan ||
    claim.patient?.membershipPlan ||
    claim.patient?.membership ||
    (Array.isArray(claim.patient?.memberships) && claim.patient.memberships.length > 0) ||
    claim.membershipPlan ||
    claim.membershipPlanId ||
    claim.membershipNumber ||
    claim.membershipId ||
    claim.insuranceType === 'membership' ||
    claim.planType === 'membership' ||
    (typeof claim.planName === 'string' && claim.planName.toLowerCase().includes('membership'))
  );

  const pickValid = (...candidates) => {
    for (const c of candidates) {
      if (isNotPatientCodeOrChart(c, claim)) return String(c).trim();
    }
    return '';
  };

  let subscriberId = pickValid(
    claim.subscriberId,
    claim.subscriberDetails?.subscriberId,
    claim.subscriberDetails?.memberId,
    claim.subscriberDetails?.SubscriberID,
    claim.subscriberNumber,
    claim.policyNumber,
    claim.meta?.subscriberId,
    claim.meta?.policyNumber,
    claim.inssub?.SubscriberID,
    claim.inssub?.subscriberId,
    claim.insurancePolicy?.policyNumber,
    claim.insuranceSub?.subscriberId,
    claim.patient?.subscriberId,
    claim.patient?.insurance?.subscriberId,
    claim.memberId
  );

  let memberId = pickValid(
    claim.memberId,
    claim.membershipNumber,
    claim.membershipId,
    claim.patient?.membershipNumber,
    claim.patient?.membershipId,
    claim.patient?.memberId,
    claim.membershipPlan?.membershipNumber,
    claim.membershipPlan?.memberId,
    claim.subscriberDetails?.memberId,
    claim.subscriberDetails?.subscriberId,
    subscriberId
  );

  // If this claim lacks a resolved ID, cross-resolve from other claims of the same patient
  if (patientLookup && (!subscriberId || !memberId)) {
    const lookupKeys = [
      claim.patientRefId ? String(claim.patientRefId).trim() : null,
      claim.patient?.id ? String(claim.patient.id).trim() : null,
      claim.patient?._id ? String(claim.patient._id).trim() : null,
      claim.patient?.PatNum ? String(claim.patient.PatNum).trim() : null,
      claim.patient?.patNum ? String(claim.patient.patNum).trim() : null,
      claim.patientCode ? String(claim.patientCode).replace(/[()]/g, '').trim().toLowerCase() : null,
      claim.patient?.patientCode ? String(claim.patient.patientCode).replace(/[()]/g, '').trim().toLowerCase() : null,
      claim.patientName ? String(claim.patientName).replace(/\([^)]*\)/g, '').trim().toLowerCase() : null,
      claim.patient ? `${claim.patient.firstName || ''} ${claim.patient.lastName || ''}`.trim().toLowerCase() : null,
    ].filter(Boolean);

    for (const key of lookupKeys) {
      const match = patientLookup.get(key);
      if (match) {
        if (!subscriberId) {
          subscriberId = match.subscriberId || match.anyId || '';
        }
        if (!memberId) {
          memberId = match.memberId || match.anyId || '';
        }
        if (subscriberId || memberId) break;
      }
    }
  }

  if (hasMembership) {
    return memberId || subscriberId || '—';
  }

  return subscriberId || memberId || '—';
};

/**
 * Builds the standalone, printable HTML document for claims reports.
 * For Outstanding Claims, includes DOB, Member ID, DOS, and Sent Date columns.
 */
export function generateClaimsReportHtml(options = {}) {
  const {
    claims = [],
    tabTitle = 'Claims Management',
    filters = {},
    customDateRange = {},
    logoUrl = '',
    now = new Date(),
    isOutstanding: explicitIsOutstanding,
  } = options;

  const isOutstanding = Boolean(
    explicitIsOutstanding ??
    tabTitle?.toLowerCase().includes('outstanding')
  );

  const nowStr = (now instanceof Date ? now : new Date(now)).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  // Calculate totals
  const totalAmount = claims.reduce((sum, c) => {
    const rawVal = c?.submittedValue ?? c?.submittedAmount ?? c?.totalFee ?? 0;
    return sum + (Number(rawVal) || 0);
  }, 0);
  const totalClaims = claims.length;

  // Build filter summary line
  const filterParts = [];
  if (filters?.carrier && filters.carrier !== 'all') {
    filterParts.push(`Carrier: ${escapeHtml(filters.carrier)}`);
  }
  if (filters?.claimType && filters.claimType !== 'all') {
    filterParts.push(`Type: ${escapeHtml(filters.claimType)}`);
  }
  if (filters?.status && filters.status !== 'all') {
    filterParts.push(`Status: ${escapeHtml(filters.status)}`);
  }
  if (filters?.attachment && filters.attachment !== 'all') {
    filterParts.push(`Attachment: ${escapeHtml(filters.attachment)}`);
  }
  if (filters?.filterDate && filters.filterDate !== 'all') {
    filterParts.push(`Date: ${escapeHtml(filters.filterDate)}`);
  } else if (filters?.dateRange && filters.dateRange !== 'all') {
    filterParts.push(`Date: ${escapeHtml(filters.dateRange)}`);
  } else if (customDateRange?.start || customDateRange?.end) {
    const start = customDateRange.start ? new Date(customDateRange.start).toLocaleDateString() : '';
    const end = customDateRange.end ? new Date(customDateRange.end).toLocaleDateString() : '';
    filterParts.push(`Range: ${start} - ${end}`);
  }

  const filterSummary = filterParts.length > 0 ? filterParts.join(' | ') : 'All Claims (No filter applied)';

  // Pre-build patient lookup map from all claims in the report so multiple claims for the same patient share the resolved ID
  const patientLookup = new Map();
  for (const claim of claims) {
    if (!claim) continue;
    const directId = getMemberOrSubscriberId(claim);
    if (directId && directId !== '—') {
      const hasMembership = Boolean(
        claim.hasMembershipPlan ||
        claim.isMembershipPlan ||
        claim.patient?.hasMembershipPlan ||
        claim.patient?.membershipPlan ||
        claim.patient?.membership ||
        (Array.isArray(claim.patient?.memberships) && claim.patient.memberships.length > 0) ||
        claim.membershipPlan ||
        claim.membershipPlanId ||
        claim.membershipNumber ||
        claim.membershipId ||
        claim.insuranceType === 'membership' ||
        claim.planType === 'membership' ||
        (typeof claim.planName === 'string' && claim.planName.toLowerCase().includes('membership'))
      );

      const keys = [
        claim.patientRefId ? String(claim.patientRefId).trim() : null,
        claim.patient?.id ? String(claim.patient.id).trim() : null,
        claim.patient?._id ? String(claim.patient._id).trim() : null,
        claim.patient?.PatNum ? String(claim.patient.PatNum).trim() : null,
        claim.patient?.patNum ? String(claim.patient.patNum).trim() : null,
        claim.patientCode ? String(claim.patientCode).replace(/[()]/g, '').trim().toLowerCase() : null,
        claim.patient?.patientCode ? String(claim.patient.patientCode).replace(/[()]/g, '').trim().toLowerCase() : null,
        claim.patientName ? String(claim.patientName).replace(/\([^)]*\)/g, '').trim().toLowerCase() : null,
        claim.patient ? `${claim.patient.firstName || ''} ${claim.patient.lastName || ''}`.trim().toLowerCase() : null,
      ].filter(Boolean);

      for (const k of keys) {
        const existing = patientLookup.get(k) || {};
        patientLookup.set(k, {
          subscriberId: existing.subscriberId || (!hasMembership ? directId : ''),
          memberId: existing.memberId || (hasMembership ? directId : ''),
          anyId: existing.anyId || directId,
        });
      }
    }
  }

  const rowsHtml = claims.map((claim, index) => {
    const claimNum = claim?.claimNumber || claim?.claimCode || (claim?.id ? `#${claim.id}` : '—');
    const patCode = claim?.patientCode
      ? (String(claim.patientCode).trim().startsWith('(')
          ? ` ${claim.patientCode.trim()}`
          : ` (${claim.patientCode.trim()})`)
      : '';
    const patName = (claim?.patientName || '—') + patCode;
    const carrier = claim?.carrier || '—';
    const claimType = claim?.claimType || '—';
    const status = formatStatus(claim?.status);

    const claimAmount = Number(claim?.submittedValue ?? claim?.submittedAmount ?? claim?.totalFee ?? 0);
    const amount = formatCurrency(claimAmount);

    const isEven = index % 2 === 1;
    const rowBg = isEven ? '#f8fafc' : '#ffffff';

    if (isOutstanding) {
      const dob = claim?.patientDob
        || claim?.dob
        || (claim?.patient?.dateOfBirth ? formatDateValue(claim.patient.dateOfBirth) : '—');
      const memberOrSubId = getMemberOrSubscriberId(claim, patientLookup);
      const dos = claim?.dos
        || claim?.dateOfService
        || (claim?.procedures?.[0]?.dateOfService ? formatDateValue(claim.procedures[0].dateOfService) : (claim?.createdDate || '—'));
      const sentDate = claim?.sentDate
        || (claim?.submittedDate ? formatDateValue(claim.submittedDate) : (claim?.submissionDate ? formatDateValue(claim.submissionDate) : '—'));

      return `
        <tr style="background-color: ${rowBg};">
          <td style="font-weight: 600; color: #1e293b;">${escapeHtml(claimNum)}</td>
          <td style="font-weight: 600; color: #2563eb;">${escapeHtml(patName)}</td>
          <td>${escapeHtml(dob)}</td>
          <td>${escapeHtml(memberOrSubId)}</td>
          <td>${escapeHtml(carrier)}</td>
          <td>${escapeHtml(claimType)}</td>
          <td>${escapeHtml(dos)}</td>
          <td>${escapeHtml(sentDate)}</td>
          <td><span class="status-badge">${escapeHtml(status)}</span></td>
          <td style="text-align: right; font-weight: 600; font-variant-numeric: tabular-nums;">${escapeHtml(amount)}</td>
        </tr>
      `;
    }

    const date = claim?.sentDate || claim?.createdDate || claim?.dateOfService || '—';
    let procs = '—';
    if (Array.isArray(claim?.procedures) && claim.procedures.length > 0) {
      procs = claim.procedures
        .map((p) => (typeof p === 'string' ? p : p?.code || p?.procedureCode || ''))
        .filter(Boolean)
        .join(', ') || '—';
    } else if (typeof claim?.procedures === 'string') {
      procs = claim.procedures;
    }

    return `
      <tr style="background-color: ${rowBg};">
        <td style="font-weight: 600; color: #1e293b;">${escapeHtml(claimNum)}</td>
        <td style="font-weight: 600; color: #2563eb;">${escapeHtml(patName)}</td>
        <td>${escapeHtml(carrier)}</td>
        <td>${escapeHtml(claimType)}</td>
        <td><span class="status-badge">${escapeHtml(status)}</span></td>
        <td>${escapeHtml(date)}</td>
        <td style="font-size: 10px; color: #475569;">${escapeHtml(procs)}</td>
        <td style="text-align: right; font-weight: 600; font-variant-numeric: tabular-nums;">${escapeHtml(amount)}</td>
      </tr>
    `;
  }).join('');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Claims Report - ${escapeHtml(tabTitle)}</title>
    <style>
      @page {
        size: A4 landscape;
        margin: 10mm 12mm;
      }
      * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 11px;
        color: #1e293b;
        background: #ffffff;
      }
      header {
        text-align: center;
        margin-bottom: 16px;
        border-bottom: 2px solid #00bbab;
        padding-bottom: 12px;
      }
      .logo {
        height: 42px;
        max-width: 100%;
        object-fit: contain;
        margin-bottom: 8px;
      }
      h1 {
        font-size: 20px;
        font-weight: 700;
        color: #0f172a;
        margin: 0 0 6px 0;
        letter-spacing: -0.02em;
      }
      .meta-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 11px;
        color: #64748b;
        margin-top: 4px;
      }
      .filter-summary {
        font-weight: 500;
        color: #334155;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
        line-height: 1.4;
      }
      thead {
        display: table-header-group;
      }
      th {
        background-color: #f1f5f9 !important;
        color: #334155;
        font-weight: 700;
        font-size: 10.5px;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        border-top: 1px solid #cbd5e1;
        border-bottom: 2px solid #94a3b8;
        padding: 7px 8px;
        text-align: left;
      }
      th:last-child {
        text-align: right;
      }
      td {
        border-bottom: 1px solid #e2e8f0;
        padding: 6px 8px;
        vertical-align: middle;
      }
      tr {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      .status-badge {
        display: inline-block;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 9.5px;
        font-weight: 600;
        background-color: #e2e8f0;
        color: #334155;
      }
      tfoot {
        display: table-footer-group;
      }
      tfoot tr td {
        border-top: 2px solid #0f172a;
        border-bottom: 2px solid #0f172a;
        font-weight: 700;
        font-size: 12px;
        padding: 10px 8px;
        background-color: #f8fafc;
      }
      .footer-note {
        margin-top: 16px;
        font-size: 10px;
        color: #94a3b8;
        display: flex;
        justify-content: space-between;
      }
      .no-print, button, svg {
        display: none !important;
      }
    </style>
  </head>
  <body>
    <header>
      ${logoUrl ? `<img class="logo" src="${escapeHtml(logoUrl)}" alt="Medflow Logo" onerror="this.style.display='none'" />` : ''}
      <h1>Claims Management — ${escapeHtml(tabTitle)}</h1>
      <div class="meta-bar">
        <span class="filter-summary">${filterSummary}</span>
        <span>Generated: ${escapeHtml(nowStr)}</span>
      </div>
    </header>

    <table>
      <thead>
        ${isOutstanding ? `
        <tr>
          <th style="width: 9%;">Claim #</th>
          <th style="width: 14%;">Patient Name</th>
          <th style="width: 8%;">DOB</th>
          <th style="width: 10%;">Member / Subscriber ID</th>
          <th style="width: 13%;">Carrier</th>
          <th style="width: 10%;">Type</th>
          <th style="width: 8%;">DOS</th>
          <th style="width: 8%;">Sent Date</th>
          <th style="width: 10%;">Status</th>
          <th style="width: 10%; text-align: right;">Billed Amount</th>
        </tr>
        ` : `
        <tr>
          <th style="width: 10%;">Claim #</th>
          <th style="width: 16%;">Patient Name</th>
          <th style="width: 16%;">Carrier</th>
          <th style="width: 12%;">Type</th>
          <th style="width: 14%;">Status</th>
          <th style="width: 10%;">Date</th>
          <th style="width: 12%;">Procedures</th>
          <th style="width: 10%; text-align: right;">Billed Amount</th>
        </tr>
        `}
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
      <tfoot>
        ${isOutstanding ? `
        <tr>
          <td colspan="8">Total: ${totalClaims} Claim${totalClaims === 1 ? '' : 's'}</td>
          <td style="text-align: right;">Grand Total:</td>
          <td style="text-align: right; color: #0f172a;">${formatCurrency(totalAmount)}</td>
        </tr>
        ` : `
        <tr>
          <td colspan="6">Total: ${totalClaims} Claim${totalClaims === 1 ? '' : 's'}</td>
          <td style="text-align: right;">Grand Total:</td>
          <td style="text-align: right; color: #0f172a;">${formatCurrency(totalAmount)}</td>
        </tr>
        `}
      </tfoot>
    </table>

    <div class="footer-note">
      <span>Medflow Dental Practice Management System</span>
      <span>Page 1 of 1</span>
    </div>
  </body>
</html>`;
}

let activePrint = null;

/**
 * Generates an isolated, styled print report document for Claim Management tabs
 * and launches the browser native print pop-up, matching Medflow reports pages.
 */
export function printClaimsReport(arg = {}) {
  const options = Array.isArray(arg) ? { claims: arg } : (arg || {});
  const {
    claims = [],
    tabTitle = 'Claims Management',
    filters = {},
    customDateRange = {},
    isOutstanding,
  } = options;

  if (activePrint) return activePrint;

  if (!claims || claims.length === 0) {
    if (typeof window !== 'undefined' && typeof window.alert === 'function') {
      try {
        window.alert('No claims available to print.');
      } catch {
        // Safe fallback in environments like jsdom where alert is not implemented
      }
    }
    return Promise.resolve();
  }

  // Headless or non-DOM environment guard
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
    return Promise.resolve(generateClaimsReportHtml(options));
  }

  const logoUrl = typeof window !== 'undefined'
    ? (medflowLogo?.startsWith('http') || medflowLogo?.startsWith('data:')
        ? medflowLogo
        : new URL(medflowLogo, window.location.origin).href)
    : '';

  const html = generateClaimsReportHtml({
    claims,
    tabTitle,
    filters,
    customDateRange,
    logoUrl,
    isOutstanding,
  });

  activePrint = new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    const previousFocus = document.activeElement;
    iframe.title = 'Claims print document';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    Object.assign(iframe.style, {
      position: 'fixed',
      left: '-10000px',
      top: '0',
      width: '1123px',
      height: '794px',
      border: '0',
    });

    let cleanupTimer = null;
    let loadTimer = null;

    const cleanup = () => {
      clearTimeout(loadTimer);
      clearTimeout(cleanupTimer);
      iframe.onload = null;
      if (iframe.contentWindow) iframe.contentWindow.onafterprint = null;
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      if (previousFocus?.isConnected) previousFocus.focus();
    };

    const fail = () => {
      cleanup();
      reject(new Error('The claims report could not be prepared for printing. Please try again.'));
    };

    loadTimer = setTimeout(fail, 10000);

    iframe.onload = async () => {
      iframe.onload = null;
      try {
        const frameWindow = iframe.contentWindow;
        const doc = iframe.contentDocument;
        if (!frameWindow || !doc) throw new Error('Print document unavailable');

        clearTimeout(loadTimer);

        // Wait safely for images & fonts without blocking if an image fails
        try {
          if (doc.images && doc.images.length > 0) {
            await Promise.all(Array.from(doc.images, (img) => img.decode?.().catch(() => {})));
          }
          if (doc.fonts?.ready) {
            await doc.fonts.ready;
          }
        } catch {
          // Ignore asset decode error and proceed to print
        }

        if (!iframe.isConnected) return;

        frameWindow.onafterprint = () => {
          cleanup();
          resolve();
        };

        // Fallback cleanup timer in case onafterprint doesn't fire
        cleanupTimer = setTimeout(() => {
          cleanup();
          resolve();
        }, 60000);

        frameWindow.focus();
        frameWindow.print();
      } catch {
        fail();
      }
    };

    iframe.srcdoc = html;
    document.body.appendChild(iframe);
  }).finally(() => {
    activePrint = null;
  });

  return activePrint;
}
