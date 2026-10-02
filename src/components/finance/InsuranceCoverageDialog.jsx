import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Divider, Typography } from '@mui/material';
import BaseDialog from '../shared/BaseDialog';
import { patientService } from '../../services/patient.service';

const labelFor = (key) => String(key).replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const parseBenefit = (value) => {
  try { return JSON.parse(value); } catch { return value; }
};
const valueFor = (value) => {
  if (value === null || value === undefined || value === '') return 'Not recorded';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value)) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toLocaleDateString();
  }
  return String(value);
};

const DetailRow = ({ label, value }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '180px 1fr' }, gap: { xs: 0, sm: 2 }, py: 0.75, borderBottom: '1px solid #eef1f5' }}>
    <Typography variant="body2" sx={{ color: '#64748b' }}>{label}</Typography>
    <Typography variant="body2" sx={{ color: '#1e293b', overflowWrap: 'anywhere' }}>{valueFor(value)}</Typography>
  </Box>
);
const Section = ({ title, children }) => (
  <Box sx={{ mb: 2.5 }}>
    <Typography variant="subtitle2" sx={{ color: '#1e293b', fontWeight: 700, mb: 0.75 }}>{title}</Typography>
    <Divider sx={{ mb: 0.5 }} />
    {children}
  </Box>
);

// Present stored benefit grids as labeled rows instead of raw JSON.
const BenefitValue = ({ name, value, depth = 0 }) => {
  if (value === null || value === undefined || value === '') return <DetailRow label={name} value={null} />;
  if (typeof value === 'string' && ['[', '{'].includes(value.trim()[0])) {
    const parsed = parseBenefit(value);
    if (parsed !== value) return <BenefitValue name={name} value={parsed} depth={depth} />;
  }
  if (depth < 5 && Array.isArray(value)) {
    if (!value.length) return <DetailRow label={name} value={null} />;
    return value.map((item, index) => (
      <Box key={`${name}-${index}`} sx={{ ml: depth ? 2 : 0 }}>
        <BenefitValue name={`${name} ${index + 1}`} value={item} depth={depth + 1} />
      </Box>
    ));
  }
  if (depth < 5 && typeof value === 'object') {
    return (
      <Box sx={{ ml: depth ? 2 : 0, mb: 1 }}>
        {depth > 0 && <Typography variant="body2" sx={{ fontWeight: 600, mt: 1 }}>{labelFor(name)}</Typography>}
        {Object.entries(value).map(([key, nested]) => <BenefitValue key={key} name={labelFor(key)} value={nested} depth={depth + 1} />)}
      </Box>
    );
  }
  return <DetailRow label={labelFor(name)} value={value} />;
};

const InsuranceCoverageDialog = ({ open, onClose, patientId, insuranceId }) => {
  const [insurance, setInsurance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !patientId || !insuranceId) return undefined;
    let current = true;
    patientService.getPatientInsuranceById(patientId, insuranceId)
      .then((data) => { if (current) setInsurance(data); })
      .catch(() => { if (current) setError('Could not load this insurance coverage. Please try again.'); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [open, patientId, insuranceId]);

  return (
    <BaseDialog open={open} onClose={onClose} title="Insurance Coverage" maxWidth="md" showCloseButton contentSx={{ maxHeight: '70vh', overflowY: 'auto' }}>
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress size={28} /></Box>}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && !insurance && <Alert severity="info">No coverage details were returned for this policy.</Alert>}
      {!loading && !error && insurance && (
        <Box>
          <Section title="Policy and plan">
            <DetailRow label="Coverage" value={insurance.insuranceType} />
            <DetailRow label="Status" value={insurance.isActive ? 'Active' : 'Inactive'} />
            <DetailRow label="Carrier" value={insurance.insuranceCompanyId?.name} />
            <DetailRow label="Payer ID" value={insurance.insuranceCompanyId?.payerId} />
            <DetailRow label="Group name" value={insurance.groupName} />
            <DetailRow label="Group number" value={insurance.groupNumber} />
            <DetailRow label="Policy / subscriber ID" value={insurance.policyNumber} />
            <DetailRow label="Coverage type" value={insurance.coverageType} />
            <DetailRow label="Plan fee guide" value={insurance.planFeeGuide} />
            <DetailRow label="Effective date" value={insurance.effectiveDate} />
            <DetailRow label="Expiration date" value={insurance.expirationDate} />
            <DetailRow label="Renewal month" value={insurance.renewalMonth} />
          </Section>
          <Section title="Subscriber and family">
            <DetailRow label="Subscriber" value={insurance.subscriberName} />
            <DetailRow label="Subscriber birth date" value={insurance.subscriberDateOfBirth} />
            <DetailRow label="Relationship to patient" value={insurance.relationshipToPatient} />
            <DetailRow label="Family plan" value={insurance.isFamilyPlan} />
            <DetailRow label="Patients covered" value={insurance.patientsCovered} />
            <DetailRow label="Covered members" value={insurance.members?.join(', ')} />
          </Section>
          <Section title="Eligibility and benefits">
            <DetailRow label="Verification status" value={insurance.verificationStatus} />
            <DetailRow label="Verified on" value={insurance.verificationDate} />
            <DetailRow label="Automatic verification" value={insurance.autoVerify} />
            <DetailRow label="Copay" value={insurance.copayAmount} />
            <DetailRow label="Deductible" value={insurance.deductibleAmount} />
            <DetailRow label="Assignment of benefits" value={insurance.assignmentOfBenefits} />
            <DetailRow label="Honor write-off" value={insurance.honorWriteOff} />
          </Section>
          <Section title="Coverage limits"><BenefitValue name="Coverage limits" value={insurance.coverageLimits} /></Section>
          <Section title="Deductibles"><BenefitValue name="Deductibles" value={insurance.deductiblesGrid} /></Section>
          <Section title="Category coverage"><BenefitValue name="Categories" value={insurance.coverageCategoryTable} /></Section>
          <Section title="Coverage book"><BenefitValue name="Entries" value={insurance.coverageBookData} /></Section>
          <Section title="Additional plan details">
            <BenefitValue name="Provider fee guides" value={insurance.providersPlanFeeGuides} />
            <BenefitValue name="Health plan" value={insurance.healthPlan} />
            <BenefitValue name="Payment plan" value={insurance.paymentPlan} />
            <DetailRow label="Subscriber notes" value={insurance.notes} />
            <DetailRow label="Policy notes" value={insurance.policyNotes} />
            <DetailRow label="Eligibility notes" value={insurance.eligibilityPolicyNotes} />
            <DetailRow label="Insurance plan notes" value={insurance.insurancePlanNotes} />
          </Section>
        </Box>
      )}
    </BaseDialog>
  );
};

export default InsuranceCoverageDialog;
