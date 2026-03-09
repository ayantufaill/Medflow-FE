import { useState } from "react";

const theme = {
  bg: "#F0F4FA",
  surface: "#FFFFFF",
  surfaceAlt: "#F7F9FD",
  border: "#D6DFF0",
  borderFocus: "#3A6FD8",
  primary: "#1A3E8C",
  primaryLight: "#3A6FD8",
  accent: "#0EA5E9",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  text: "#111827",
  textSecondary: "#4B5E82",
  textMuted: "#8898BB",
  headerBg: "#0F2557",
  sectionBg: "#EEF3FB",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body, #root {
    font-family: 'DM Sans', sans-serif;
    background: ${theme.bg};
    color: ${theme.text};
    min-height: 100vh;
  }

  .insurance-mockup-shell {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .top-nav {
    background: ${theme.headerBg};
    color: white;
    display: flex;
    align-items: center;
    padding: 0 24px;
    height: 52px;
    gap: 32px;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 12px rgba(15,37,87,0.3);
  }

  .nav-logo {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: white;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .nav-logo .dot {
    width: 8px; height: 8px;
    background: ${theme.accent};
    border-radius: 50%;
    display: inline-block;
  }

  .nav-tabs {
    display: flex;
    gap: 4px;
    flex: 1;
  }

  .nav-tab {
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    color: rgba(255,255,255,0.6);
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  .nav-tab:hover { color: white; background: rgba(255,255,255,0.08); }
  .nav-tab.active { color: white; background: rgba(255,255,255,0.14); }

  .nav-patient {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 12px;
    background: rgba(255,255,255,0.1);
    border-radius: 8px;
  }

  .patient-avatar {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${theme.accent}, ${theme.primaryLight});
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: white;
  }

  .patient-name { font-size: 13px; font-weight: 600; color: white; }

  .sub-header {
    background: white;
    border-bottom: 1px solid ${theme.border};
    padding: 12px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .sub-title {
    font-size: 17px;
    font-weight: 700;
    color: ${theme.primary};
    letter-spacing: -0.01em;
  }

  .sub-actions { display: flex; gap: 10px; }

  .btn {
    padding: 8px 20px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
    letter-spacing: 0.01em;
  }

  .btn-ghost {
    background: transparent;
    color: ${theme.textSecondary};
    border: 1.5px solid ${theme.border};
  }
  .btn-ghost:hover { border-color: ${theme.primaryLight}; color: ${theme.primary}; }

  .btn-primary {
    background: ${theme.primary};
    color: white;
    box-shadow: 0 2px 8px rgba(26,62,140,0.3);
  }
  .btn-primary:hover { background: ${theme.primaryLight}; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(26,62,140,0.35); }

  .btn-template {
    background: ${theme.sectionBg};
    color: ${theme.primary};
    border: 1.5px solid ${theme.border};
    font-size: 12px;
    padding: 7px 14px;
  }

  .main-layout {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 0;
    flex: 1;
    min-height: 0;
  }

  .left-panel {
    background: white;
    border-right: 1px solid ${theme.border};
    overflow-y: auto;
    padding-bottom: 32px;
  }

  .right-panel {
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background: ${theme.bg};
  }

  .card {
    background: white;
    border-radius: 12px;
    border: 1px solid ${theme.border};
    overflow: hidden;
  }

  .card-header {
    background: ${theme.primary};
    padding: 11px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .card-header-alt {
    background: ${theme.sectionBg};
    padding: 11px 20px;
    border-bottom: 1px solid ${theme.border};
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .card-title {
    font-size: 11px;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card-title-alt {
    font-size: 11px;
    font-weight: 700;
    color: ${theme.primary};
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .card-body { padding: 20px; }
  .card-body-tight { padding: 0; }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .form-full { grid-column: 1 / -1; }

  .field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .field-label {
    font-size: 10.5px;
    font-weight: 600;
    color: ${theme.textSecondary};
    text-transform: uppercase;
    letter-spacing: 0.06em;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .field-label .req { color: ${theme.danger}; }

  .field-input {
    height: 36px;
    border: 1.5px solid ${theme.border};
    border-radius: 7px;
    padding: 0 12px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: ${theme.text};
    background: white;
    transition: border-color 0.15s, box-shadow 0.15s;
    outline: none;
    appearance: none;
  }
  .field-input:focus {
    border-color: ${theme.borderFocus};
    box-shadow: 0 0 0 3px rgba(58,111,216,0.12);
  }
  .field-input.prefilled {
    background: ${theme.surfaceAlt};
    color: ${theme.textSecondary};
  }

  .field-select {
    height: 36px;
    border: 1.5px solid ${theme.border};
    border-radius: 7px;
    padding: 0 12px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: ${theme.text};
    background: white;
    outline: none;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234B5E82' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
  }
  .field-select:focus { border-color: ${theme.borderFocus}; box-shadow: 0 0 0 3px rgba(58,111,216,0.12); }

  .search-wrapper { position: relative; }
  .search-icon {
    position: absolute;
    left: 11px;
    top: 50%;
    transform: translateY(-50%);
    color: ${theme.textMuted};
    font-size: 13px;
  }
  .search-input {
    width: 100%;
    height: 36px;
    border: 1.5px solid ${theme.border};
    border-radius: 7px;
    padding: 0 12px 0 34px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: ${theme.text};
    background: white;
    outline: none;
  }
  .search-input:focus { border-color: ${theme.borderFocus}; box-shadow: 0 0 0 3px rgba(58,111,216,0.12); }

  .check-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
  }
  .check-row input[type="checkbox"] {
    width: 15px; height: 15px;
    accent-color: ${theme.primary};
    cursor: pointer;
  }
  .check-label {
    font-size: 12.5px;
    color: ${theme.textSecondary};
    cursor: pointer;
  }

  .lpanel-section {
    padding: 18px 20px;
    border-bottom: 1px solid ${theme.border};
  }
  .lpanel-section-title {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${theme.textMuted};
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .lpanel-section-title::before {
    content: '';
    display: block;
    width: 3px;
    height: 12px;
    background: ${theme.primaryLight};
    border-radius: 2px;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.04em;
  }
  .badge-blue { background: #DBEAFE; color: #1D4ED8; }
  .badge-green { background: #D1FAE5; color: #065F46; }
  .badge-yellow { background: #FEF3C7; color: #92400E; }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12.5px;
  }
  .data-table th {
    background: ${theme.sectionBg};
    padding: 9px 14px;
    text-align: left;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: ${theme.textSecondary};
    border-bottom: 1px solid ${theme.border};
  }
  .data-table td {
    padding: 10px 14px;
    border-bottom: 1px solid ${theme.border};
    color: ${theme.text};
  }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:nth-child(even) td { background: ${theme.surfaceAlt}; }
  .data-table input[type="text"],
  .data-table input[type="number"] {
    width: 80px;
    height: 30px;
    border: 1.5px solid ${theme.border};
    border-radius: 6px;
    padding: 0 8px;
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    text-align: right;
    outline: none;
  }
  .data-table input:focus { border-color: ${theme.borderFocus}; box-shadow: 0 0 0 2px rgba(58,111,216,0.1); }
  .data-table input[type="checkbox"] {
    width: 14px; height: 14px;
    accent-color: ${theme.primary};
    cursor: pointer;
  }
  .pct-input { width: 64px !important; text-align: center !important; }

  .add-row-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: transparent;
    border: 1.5px dashed ${theme.border};
    border-radius: 7px;
    color: ${theme.primaryLight};
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
    margin-top: 10px;
  }
  .add-row-btn:hover { border-color: ${theme.primaryLight}; background: ${theme.sectionBg}; }

  .patients-covered {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #EFF6FF;
    border: 1px solid #BFDBFE;
    border-radius: 8px;
    font-size: 12px;
    color: #1D4ED8;
    font-weight: 500;
  }
  .mono { font-family: 'DM Mono', monospace; font-size: 12px; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .card-title-alt { font-size: 11px; font-weight: 700; color: ${theme.primary}; text-transform: uppercase; letter-spacing: 0.06em; }
  .info-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px; height: 14px;
    border-radius: 50%;
    background: ${theme.textMuted};
    color: white;
    font-size: 9px;
    font-weight: 700;
    cursor: help;
  }
  .verified {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: ${theme.success};
    font-size: 11px;
    font-weight: 600;
  }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 3px; }
`;

const deductibleRows = [
  { type: "Standard", indiv: "50.00", family: "150.00", met: "50.00", date: "03/03/2026", lifetime: false, standard: false },
  { type: "Preventative", indiv: "0.00", family: "0.00", met: "0.00", date: "03/03/2026", lifetime: false, standard: false },
  { type: "Basic", indiv: "", family: "", met: "", date: "", lifetime: false, standard: true },
  { type: "Major", indiv: "", family: "", met: "", date: "", lifetime: false, standard: true },
  { type: "Orthodontics", indiv: "0.00", family: "0.00", met: "0.00", date: "03/03/2026", lifetime: false, standard: false },
];

const coverageRows = [
  { type: "Individual", unlimited: false, annualMax: "1,500.00", used: "158.00", date: "03/03/2026" },
  { type: "Family", unlimited: true, annualMax: "", used: "", date: "" },
  { type: "Ortho", unlimited: false, annualMax: "2,000.00", used: "18.00", date: "03/03/2026" },
  { type: "Diagnostic", unlimited: false, annualMax: "", used: "", date: "" },
  { type: "Preventative", unlimited: false, annualMax: "", used: "", date: "" },
  { type: "Major", unlimited: false, annualMax: "", used: "", date: "" },
];

const coverageBookData = [
  { category: "Diagnostic", subs: [{ name: "Preventative", pct: "100", wait: "0" }, { name: "Basic", pct: "80", wait: "0" }] },
  { category: "Preventative", subs: [{ name: "Preventative", pct: "100", wait: "0" }, { name: "Basic", pct: "80", wait: "0" }] },
  { category: "Restorative", subs: [{ name: "Basic", pct: "80", wait: "0" }, { name: "Major", pct: "50", wait: "0" }] },
  { category: "Endodontics", subs: [{ name: "Endodontics", pct: "80", wait: "0" }] },
  { category: "Periodontics", subs: [{ name: "Major", pct: "50", wait: "0" }] },
  { category: "Oral Surgery", subs: [{ name: "Basic", pct: "80", wait: "0" }, { name: "Major", pct: "50", wait: "0" }] },
  { category: "Implant Services", subs: [{ name: "Major", pct: "50", wait: "0" }] },
  { category: "Prosthodontics, Fixed", subs: [{ name: "", pct: "50", wait: "0" }] },
  { category: "Orthodontics", subs: [{ name: "Orthodontics", pct: "50", wait: "0" }] },
];

export default function InsuranceFormMockupPage() {
  const [assignBenefits, setAssignBenefits] = useState("dentist");
  const [relationship, setRelationship] = useState("self");
  const [coverageType, setCoverageType] = useState("ppo");
  const [planFee, setPlanFee] = useState("careington");
  const [honorWriteOff, setHonorWriteOff] = useState(true);
  const [saveTemplate, setSaveTemplate] = useState(false);
  const [releaseInfo, setReleaseInfo] = useState(true);

  return (
    <>
      <style>{styles}</style>
      <div className="insurance-mockup-shell">
        <nav className="top-nav">
          <div className="nav-logo">
            <span className="dot" />
            DentaCore
          </div>
          <div className="nav-tabs">
            {["Patient", "Ancillary Tests", "Clinical", "Finance", "Patient Reports"].map((t) => (
              <div key={t} className={`nav-tab ${t === "Finance" ? "active" : ""}`}>{t}</div>
            ))}
          </div>
          <div className="nav-patient">
            <div className="patient-avatar">AR</div>
            <div>
              <div className="patient-name">Anna Ricco</div>
            </div>
          </div>
        </nav>

        <div className="sub-header">
          <div>
            <div className="sub-title">Add a Coverage for Anna Ricco</div>
          </div>
          <div className="sub-actions">
            <button type="button" className="btn btn-ghost">Cancel</button>
            <button type="button" className="btn btn-primary">Save Coverage</button>
          </div>
        </div>

        <div className="main-layout">
          <div className="left-panel">
            <div className="lpanel-section">
              <div className="lpanel-section-title">Insurance Information</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="search-wrapper">
                  <span className="search-icon">🔍</span>
                  <input className="search-input" defaultValue="MetLife" placeholder="Search Payer, Carrier, Plan, Group…" />
                </div>
                <div className="check-row">
                  <input type="checkbox" id="excl" />
                  <label className="check-label" htmlFor="excl">Exclude System Carriers</label>
                </div>
                <div className="form-grid">
                  <div className="field">
                    <label className="field-label">Carrier / Payer Name <span className="req">*</span></label>
                    <input className="field-input prefilled" value="MetLife" readOnly />
                  </div>
                  <div className="field">
                    <label className="field-label">Payer ID <span className="req">*</span></label>
                    <input className="field-input prefilled mono" value="65978" readOnly />
                  </div>
                  <div className="field form-full">
                    <label className="field-label">Carrier Phone</label>
                    <input className="field-input prefilled" value="1-877-638-3379" readOnly />
                  </div>
                  <div className="field form-full">
                    <label className="field-label">Payer Address</label>
                    <input className="field-input prefilled" value="PO Box 981282, El Paso, TX 79998" readOnly />
                  </div>
                </div>
              </div>
            </div>

            <div className="lpanel-section">
              <div className="lpanel-section-title">Plan Details</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="field">
                  <label className="field-label">Insurance Plan <span className="req">*</span></label>
                  <input className="field-input prefilled" value="MetLife" readOnly />
                </div>
                <div className="field">
                  <label className="field-label">Group Name <span className="req">*</span></label>
                  <input className="field-input" defaultValue="Acme Corp" />
                </div>
                <div className="field">
                  <label className="field-label">Group Number <span className="req">*</span></label>
                  <input className="field-input mono" defaultValue="GRP-44821" />
                </div>
                <div className="field">
                  <label className="field-label">Phone Number</label>
                  <input className="field-input" placeholder="---" />
                </div>
                <div className="check-row">
                  <input type="checkbox" id="hplan" />
                  <label className="check-label" htmlFor="hplan">Health Plan</label>
                </div>
                <div className="field">
                  <label className="field-label">Assignment of Benefits <span className="req">*</span></label>
                  <select className="field-select" value={assignBenefits} onChange={(e) => setAssignBenefits(e.target.value)}>
                    <option value="dentist">Pay to Dentist (Assignment)</option>
                    <option value="patient">Pay to Patient</option>
                  </select>
                </div>
                <div className="check-row">
                  <input type="checkbox" id="tmpl" checked={saveTemplate} onChange={(e) => setSaveTemplate(e.target.checked)} />
                  <label className="check-label" htmlFor="tmpl">Save as Template</label>
                </div>
                <button type="button" className="btn btn-template" style={{ width: "100%" }}>📋 Copy Plan Billing Info From Template</button>
              </div>
            </div>

            <div className="lpanel-section">
              <div className="lpanel-section-title">Subscriber Information</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="field">
                  <label className="field-label">Relationship to Subscriber <span className="req">*</span></label>
                  <select className="field-select" value={relationship} onChange={(e) => setRelationship(e.target.value)}>
                    <option value="self">Self</option>
                    <option value="spouse">Spouse</option>
                    <option value="child">Child</option>
                    <option value="other">Other Dependent</option>
                  </select>
                </div>
                <div className="form-grid">
                  <div className="field">
                    <label className="field-label">Subscriber Name</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <input className="field-input prefilled" value="Anna" readOnly style={{ flex: 1 }} />
                      <span className="verified">✓</span>
                    </div>
                  </div>
                  <div className="field">
                    <label className="field-label">Subscriber ID <span className="req">*</span></label>
                    <input className="field-input mono" defaultValue="MLF-8821X" />
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">SSN <span style={{ fontSize: 10, color: theme.textMuted }}>(PII – masked)</span></label>
                  <input className="field-input" type="password" defaultValue="000000000" />
                </div>
                <div className="field">
                  <label className="field-label">Date of Birth <span className="req">*</span></label>
                  <input className="field-input" type="text" defaultValue="08/25/1998" />
                </div>
                <div className="check-row">
                  <input type="checkbox" id="rel" checked={releaseInfo} onChange={(e) => setReleaseInfo(e.target.checked)} />
                  <label className="check-label" htmlFor="rel">Release Info to Insurer</label>
                </div>
              </div>
            </div>

            <div className="lpanel-section">
              <div className="lpanel-section-title">Renewal & Policy Dates</div>
              <div className="form-grid">
                <div className="field">
                  <label className="field-label">Policy Start <span className="req">*</span></label>
                  <input className="field-input" defaultValue="01/01/2026" />
                </div>
                <div className="field">
                  <label className="field-label">Policy End</label>
                  <input className="field-input" placeholder="MM/DD/YYYY" />
                </div>
                <div className="field form-full">
                  <label className="field-label">Renewal Month <span className="req">*</span></label>
                  <select className="field-select">
                    <option>January</option>
                    <option>February</option>
                    <option>March</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="lpanel-section">
              <div className="patients-covered">
                👤 <strong>Patients covered: 1</strong>&nbsp;— editing affects all covered patients
              </div>
            </div>
          </div>

          <div className="right-panel">
            <div className="card">
              <div className="card-header">
                <span className="card-title">⚙ Plan Fee Guide & Coverage Type</span>
                <span className="badge badge-green" style={{ fontSize: 10 }}>Active</span>
              </div>
              <div className="card-body">
                <div className="two-col">
                  <div className="field">
                    <label className="field-label">Plan Fee Guide <span className="req">*</span></label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <select className="field-select" value={planFee} onChange={(e) => setPlanFee(e.target.value)} style={{ flex: 1 }}>
                        <option value="careington">Careington PPO Platinum (directly in network)</option>
                        <option value="delta">Delta Dental Premier</option>
                        <option value="custom">Custom Fee Guide</option>
                      </select>
                      <button type="button" className="btn btn-ghost" style={{ whiteSpace: "nowrap", padding: "0 14px", height: 36, fontSize: 12 }}>View Guide</button>
                    </div>
                  </div>
                  <div className="field">
                    <label className="field-label">Coverage Type <span className="req">*</span></label>
                    <select className="field-select" value={coverageType} onChange={(e) => setCoverageType(e.target.value)}>
                      <option value="ppo">Percentage Based Coverage (PPO)</option>
                      <option value="table">Table / Schedule of Benefits</option>
                      <option value="flat">Flat Fee</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">⬡ Deductibles</span>
              </div>
              <div className="card-body-tight">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th style={{ textAlign: "center" }}>Lifetime</th>
                      <th style={{ textAlign: "center" }}>Standard</th>
                      <th style={{ textAlign: "right" }}>Individual ($)</th>
                      <th style={{ textAlign: "right" }}>Family ($)</th>
                      <th style={{ textAlign: "right" }}>Met Amount ($)</th>
                      <th>Met Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deductibleRows.map((r, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{r.type}</td>
                        <td style={{ textAlign: "center" }}><input type="checkbox" defaultChecked={r.lifetime} /></td>
                        <td style={{ textAlign: "center" }}><input type="checkbox" defaultChecked={r.standard} /></td>
                        <td style={{ textAlign: "right" }}><input type="text" className="mono" defaultValue={r.indiv} placeholder="0.00" /></td>
                        <td style={{ textAlign: "right" }}><input type="text" className="mono" defaultValue={r.family} placeholder="0.00" /></td>
                        <td style={{ textAlign: "right", color: theme.success, fontWeight: 600, fontFamily: "'DM Mono', monospace", fontSize: 12 }}>{r.met ? `$${r.met}` : "—"}</td>
                        <td style={{ color: theme.textSecondary, fontSize: 12 }}>{r.date || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ padding: "10px 16px" }}>
                  <button type="button" className="add-row-btn">+ Add Deductible by Procedure Code</button>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">◈ Coverage Maximums</span>
              </div>
              <div className="card-body-tight">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Benefit</th>
                      <th style={{ textAlign: "center" }}>Unlimited</th>
                      <th style={{ textAlign: "right" }}>Annual Max ($)</th>
                      <th style={{ textAlign: "right" }}>Used Amount ($)</th>
                      <th>Used Up-to Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coverageRows.map((r, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{r.type}</td>
                        <td style={{ textAlign: "center" }}><input type="checkbox" defaultChecked={r.unlimited} /></td>
                        <td style={{ textAlign: "right" }}>
                          {r.unlimited ? <span style={{ color: theme.textMuted, fontSize: 11 }}>Unlimited</span>
                            : r.annualMax
                              ? <span className="mono" style={{ fontWeight: 600 }}>${r.annualMax}</span>
                              : <button type="button" className="add-row-btn" style={{ margin: 0, padding: "3px 10px", fontSize: 11 }}>+ Add Max</button>}
                        </td>
                        <td style={{ textAlign: "right", color: r.used ? theme.warning : theme.textMuted, fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: r.used ? 600 : 400 }}>
                          {r.used ? `$${r.used}` : "—"}
                        </td>
                        <td style={{ color: theme.textSecondary, fontSize: 12 }}>{r.date || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ padding: "10px 16px", borderTop: `1px solid ${theme.border}` }}>
                  <div className="check-row">
                    <input type="checkbox" id="hwo" checked={honorWriteOff} onChange={(e) => setHonorWriteOff(e.target.checked)} />
                    <label className="check-label" htmlFor="hwo" style={{ fontWeight: 500 }}>
                      Honor Write Off <span style={{ color: theme.textMuted }}>(When Limitation Reached for In-Network Providers Only)</span>
                    </label>
                    <span className="info-icon">i</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header" style={{ justifyContent: "space-between" }}>
                <span className="card-title">◎ Coverage Table</span>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <select className="field-select" style={{ height: 30, fontSize: 11, padding: "0 28px 0 10px", color: "white", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6 }}>
                    <option>Select Template…</option>
                    <option>MetLife Standard PPO</option>
                    <option>Delta Premier</option>
                  </select>
                  <button type="button" className="btn" style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.25)", padding: "4px 12px", fontSize: 11 }}>+ Add Coverage Group</button>
                </div>
              </div>
              <div className="card-body-tight">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Sub-type</th>
                      <th style={{ textAlign: "center" }}>Coverage %</th>
                      <th style={{ textAlign: "center" }}>Waiting Period (Mo)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coverageBookData.map((cat, ci) =>
                      cat.subs.map((sub, si) => (
                        <tr key={`${ci}-${si}`}>
                          {si === 0 && (
                            <td rowSpan={cat.subs.length} style={{ fontWeight: 700, color: theme.primary, verticalAlign: "top", paddingTop: 12, borderRight: `2px solid ${theme.sectionBg}` }}>
                              {cat.category}
                            </td>
                          )}
                          <td style={{ color: theme.textSecondary }}>{sub.name || <span style={{ color: theme.textMuted, fontStyle: "italic" }}>General</span>}</td>
                          <td style={{ textAlign: "center" }}>
                            <input type="text" className="pct-input" defaultValue={sub.pct} style={{ width: 60, height: 28, textAlign: "center", border: `1.5px solid ${theme.border}`, borderRadius: 6, fontFamily: "'DM Mono', monospace", fontSize: 13 }} />
                            <span style={{ marginLeft: 4, color: theme.textMuted, fontSize: 12 }}>%</span>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input type="text" className="pct-input" defaultValue={sub.wait} style={{ width: 48, height: 28, textAlign: "center", border: `1.5px solid ${theme.border}`, borderRadius: 6, fontFamily: "'DM Mono', monospace", fontSize: 13 }} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div className="card-header-alt">
                <span className="card-title-alt">📝 Policy Notes</span>
              </div>
              <div className="card-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                  {["Policy Notes", "Eligibility Policy Notes", "Insurance Plan Notes"].map((label) => (
                    <div className="field" key={label}>
                      <label className="field-label">{label}</label>
                      <textarea
                        placeholder="Add your note here…"
                        style={{
                          height: 80, border: `1.5px solid ${theme.border}`, borderRadius: 8,
                          padding: "8px 10px", fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                          color: theme.text, resize: "none", outline: "none", background: theme.surfaceAlt
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingBottom: 8 }}>
              <button type="button" className="btn btn-ghost">Cancel</button>
              <button type="button" className="btn btn-primary" style={{ padding: "10px 32px", fontSize: 14 }}>💾 Save Coverage</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
