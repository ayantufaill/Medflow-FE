import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, Assignment, PeopleAlt } from '@mui/icons-material';

/* ── Reusable sub-section row ────────────────────────────────────── */
const SubSection = ({ label, chevronSide = null, open, onToggle, children }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <Box
      sx={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: chevronSide ? 'pointer' : 'default' }}
      onClick={chevronSide ? onToggle : undefined}
    >
      {/* Left chevron — Medical Alerts style */}
      {chevronSide === 'left' && (
        open
          ? <KeyboardArrowDown sx={{ fontSize: '14px', color: '#6b7280' }} />
          : <KeyboardArrowUp sx={{ fontSize: '14px', color: '#6b7280' }} />
      )}

      {/* Vertical bar */}
      <Box sx={{ width: '2px', height: '16px', backgroundColor: '#d1d5db', borderRadius: '1px', flexShrink: 0 }} />

      {/* Label */}
      <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 600, color: '#374151', flex: 1 }}>
        {label}
      </Typography>

      {/* Right chevron — Preferred Providers style */}
      {chevronSide === 'right' && (
        open
          ? <KeyboardArrowDown sx={{ fontSize: '16px', color: '#6b7280' }} />
          : <KeyboardArrowUp sx={{ fontSize: '16px', color: '#6b7280' }} />
      )}
    </Box>

    {open !== false && children}
  </Box>
);

/* ── Dropdown row (Dentist / Hygienist) ──────────────────────────── */
const DropdownRow = ({ label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mb: '6px' }}>
    <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#5c646f', whiteSpace: 'nowrap' }}>
      {label}
    </Typography>
    <Box sx={{ flex: 1, height: '1px', backgroundColor: '#d1d5db' }} />
    <KeyboardArrowDown sx={{ fontSize: '16px', color: '#6b7280', flexShrink: 0 }} />
  </Box>
);

/* ── Form badge ───────────────────────────────────────────────────── */
const FormBadge = ({ label, active }) => (
  <Box
    sx={{
      width: '26px', height: '26px',
      borderRadius: '5px',
      backgroundColor: active ? '#ef4444' : '#f3f4f6',
      border: active ? 'none' : '1px solid #e5e7eb',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}
  >
    <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 700, color: active ? '#fff' : '#6b7280' }}>
      {label}
    </Typography>
  </Box>
);

/* ── Collapsible card shell ──────────────────────────────────────── */
const DetailCard = ({ icon, title, children }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <Box sx={{ backgroundColor: '#ffffff', border: '1px solid #e0e5eb', borderRadius: '10px', overflow: 'hidden', mt: '8px' }}>
      <Box
        onClick={() => setExpanded((p) => !p)}
        sx={{
          display: 'flex', alignItems: 'center', gap: '8px',
          px: '14px', py: '12px',
          cursor: 'pointer',
          borderBottom: expanded ? '1px solid #f0f2f5' : 'none',
        }}
      >
        {icon}
        <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 700, color: '#09121f', flex: 1 }}>
          {title}
        </Typography>
        {expanded
          ? <KeyboardArrowUp sx={{ fontSize: '18px', color: '#5c646f' }} />
          : <KeyboardArrowDown sx={{ fontSize: '18px', color: '#5c646f' }} />}
      </Box>
      {expanded && (
        <Box sx={{ px: '14px', py: '12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {children}
        </Box>
      )}
    </Box>
  );
};

/* ── Patient Details ─────────────────────────────────────────────── */
export const PatientDetails = () => {
  const [providersOpen, setProvidersOpen] = useState(true);
  const [alertsOpen, setAlertsOpen] = useState(true);

  return (
    <DetailCard icon={<Assignment sx={{ fontSize: '20px', color: '#2262ef' }} />} title="Patient Details">

      {/* Preferred Providers */}
      <SubSection label="Preferred Providers" chevronSide="right" open={providersOpen} onToggle={() => setProvidersOpen((p) => !p)}>
        <Box sx={{ pl: '8px' }}>
          <DropdownRow label="Preferred Dentist:" />
          <DropdownRow label="Preferred Hygienist:" />
        </Box>
      </SubSection>

      {/* Patient Forms */}
      <SubSection label="Patient Forms" open>
        <Box sx={{ display: 'flex', gap: '6px', pl: '8px' }}>
          <FormBadge label="B" active />
          <FormBadge label="R" />
          <FormBadge label="P" />
          <FormBadge label="Q" />
        </Box>
      </SubSection>

      {/* Medical Alerts — chevron on LEFT of bar */}
      <SubSection label="Medical Alerts" chevronSide="left" open={alertsOpen} onToggle={() => setAlertsOpen((p) => !p)}>
        <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 600, color: '#dc2626', textAlign: 'center', pl: '8px' }}>
          Diabetes Type I
        </Typography>
      </SubSection>

      {/* Patient Flags */}
      <SubSection label="Patient Flags" open>
        <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#9aa3ae', pl: '8px' }}>No flags</Typography>
      </SubSection>

      {/* Bills */}
      <SubSection label="Bills" open>
        <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#5c646f', textAlign: 'center' }}>
          Last Bill: None
        </Typography>
      </SubSection>

      {/* Used Amount */}
      <SubSection label="Used Amount:" open>
        <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 700, color: '#09121f', pl: '8px' }}>
          $0.00
        </Typography>
      </SubSection>

    </DetailCard>
  );
};

/* ── Family Details ──────────────────────────────────────────────── */
export const FamilyDetails = () => {
  const BillRow = ({ label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
      <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#5c646f' }}>{label}</Typography>
      <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 700, color: '#09121f' }}>{value}</Typography>
    </Box>
  );

  return (
    <DetailCard icon={<PeopleAlt sx={{ fontSize: '20px', color: '#2262ef' }} />} title="Family Details">

      {/* Family members */}
      <SubSection label="Family members:" open>
        <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#9aa3ae', pl: '8px' }}>
          No family found
        </Typography>
      </SubSection>

      {/* Family Bills */}
      <SubSection label="Family Bills:" open>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', pl: '8px' }}>
          <BillRow label="Total outstanding:" value="$0.00" />
          <BillRow label="Individual Outstanding:" value="$0.00" />
          <BillRow label="Insurance Outstanding:" value="$0.00" />
        </Box>
      </SubSection>

    </DetailCard>
  );
};

export default PatientDetails;
