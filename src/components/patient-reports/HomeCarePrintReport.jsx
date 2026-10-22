import React from 'react';
import medflowLogo from '../../assets/medflow-logo.png';
import { formatDate } from '../../utils/dateUtils';

const timestamp = value => {
  if (!value) return 'Not recorded';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not recorded' : date.toLocaleString('en-US', {
    month: 'short', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
  });
};

const printStyles = `
  @page { size: A4 portrait; margin: 14mm; }
  * { box-sizing: border-box; }
  body { margin: 0; color: #253449; background: #fff; font: 10pt/1.5 Arial, sans-serif;
    -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .report { max-width: 182mm; margin: 0 auto; }
  .masthead { text-align: center; padding-bottom: 5mm; border-bottom: 2px solid #2362ef; }
  .logo { display: block; height: 45px; max-width: 180px; object-fit: contain; margin: 0 auto 4mm; }
  h1 { margin: 0; font-size: 18pt; line-height: 1.3; color: #1e293b; }
  .subtitle { color: #64748b; font-size: 10pt; margin: 2mm 0 0; }
  .patient { display: grid; grid-template-columns: 1fr 1fr; gap: 2mm 6mm; padding: 4mm;
    border: 1px solid #dbe3ef; border-radius: 2mm; margin: 5mm 0; background: #f8fafc; }
  .patient p { margin: 0; }
  .patient-name { font-size: 12pt; font-weight: bold; }
  .muted { color: #526175; }
  h2 { font-size: 12pt; color: #1e293b; margin: 5mm 0 2mm; padding-bottom: 1.5mm; border-bottom: 1px solid #dbe3ef; }
  h3 { font-size: 10pt; margin: 3mm 0 1mm; }
  p { margin: 0 0 2mm; overflow-wrap: anywhere; }
  .overview { display: grid; grid-template-columns: 43% 1fr; gap: 6mm; align-items: start; }
  figure { margin: 0; }
  .assessment-image { width: 100%; height: auto; display: block; }
  .overview h2 { margin-top: 0; }
  .category-subtitle { font-size: 10pt; font-weight: 600; color: #2362ef; margin-bottom: 2mm; }
  ul { padding-left: 5mm; margin: 2mm 0; }
  li { margin-bottom: 2mm; overflow-wrap: anywhere; }
  .finding-value { color: #a62929; }
  .report-end { margin-top: 6mm; padding-top: 2mm; border-top: 1px solid #dbe3ef; color: #64748b; font-size: 8pt; }
  .masthead, .patient, .overview, figure, tr { break-inside: avoid; }
  h2, h3 { break-after: avoid; }
  p, li { orphans: 3; widows: 3; }
`;

const Finding = ({ issue }) => <li>
  {typeof issue === 'string' ? issue : <>
    {issue.label && <strong>{issue.label}{issue.value ? ' — ' : ''}</strong>}
    {issue.value && <span className="finding-value">{issue.value}</span>}
  </>}
</li>;

export default function HomeCarePrintReport({
  patient,
  patientId,
  category,
  categoryLabel,
  sectionNumber = 1,
  primaryConcern,
  printedAt = new Date(),
  baseUrl,
  logoUrl = medflowLogo,
  imageUrl = '/report_visual.png',
}) {
  const name = [patient.firstName, patient.lastName].filter(Boolean).join(' ') || 'Not recorded';
  const issues = category?.issues || [];
  const title = `${categoryLabel} — Home Care`;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <style>{printStyles}</style>
      </head>
      <body>
        <main className="report">
          <header className="masthead">
            <img className="logo" src={new URL(logoUrl, baseUrl).href} alt="Medflow" />
            <h1>{title}</h1>
            <p className="subtitle">Personalized oral hygiene recommendations and care instructions</p>
          </header>

          <section className="patient" aria-label="Patient details">
            <div>
              <p className="patient-name">{name}</p>
              <p><strong>Patient ID:</strong> {patient.patientCode || patientId}</p>
              <p><strong>Date of birth:</strong> {formatDate(patient.dateOfBirth, 'DD MMM YYYY')}</p>
            </div>
            <div>
              <p><strong>Report generated:</strong> {timestamp(printedAt)}</p>
              {patient.email && <p className="muted">{patient.email}</p>}
              {(patient.phonePrimary || patient.phoneSecondary) && (
                <p className="muted">{patient.phonePrimary || patient.phoneSecondary}</p>
              )}
            </div>
          </section>

          {primaryConcern && (
            <p><strong>Main concern:</strong> {primaryConcern}</p>
          )}

          <section className="overview" aria-label="Home care overview">
            <figure>
              <img
                className="assessment-image"
                src={new URL(imageUrl, baseUrl).href}
                alt="Dental assessment visualization"
              />
            </figure>
            <div>
              <h2>{sectionNumber}. {category.title || categoryLabel}</h2>
              {category.subtitle && <p className="category-subtitle">{category.subtitle}</p>}
              {category.description && <p className="muted">{category.description}</p>}
            </div>
          </section>

          <section aria-label="Recorded findings and recommendations">
            <h2>{category.findingsTitle || 'Current Status'}</h2>
            {issues.length > 0 ? (
              <ul>
                {issues.map((issue, index) => (
                  <Finding key={index} issue={issue} />
                ))}
              </ul>
            ) : (
              <p>No issues detected in this category</p>
            )}

            {category.explanations?.length > 0 && (
              <>
                <h3>What we found</h3>
                <ul>
                  {category.explanations.map((explanation, index) => (
                    <li key={index}>{explanation}</li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <footer className="report-end">
            Medflow · {categoryLabel} · {name} · {patient.patientCode || patientId}
          </footer>
        </main>
      </body>
    </html>
  );
}
