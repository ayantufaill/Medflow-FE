import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, Assignment, PeopleAlt } from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius, spacing, headingPrimarySx, headingSecondarySx, avatarSize } from '../../../constants/styles';

/* ── Reusable sub-section row ────────────────────────────────────── */
const SubSection = ({ label, chevronSide = null, open, onToggle, children }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing.innerGap }}>
    <Box
      sx={{ display: 'flex', alignItems: 'center', gap: spacing.innerGap, cursor: chevronSide ? 'pointer' : 'default' }}
      onClick={chevronSide ? onToggle : undefined}
    >
      {/* Left chevron — Medical Alerts style */}
      {chevronSide === 'left' && (
        open
          ? <KeyboardArrowDown sx={{ fontSize: '14px', color: COLORS.TEXT_MUTED }} />
          : <KeyboardArrowUp sx={{ fontSize: '14px', color: COLORS.TEXT_MUTED }} />
      )}

      {/* Vertical bar */}
      <Box sx={{ width: '2px', height: '16px', backgroundColor: '#d1d5db', borderRadius: '1px', flexShrink: 0 }} />

      {/* Label */}
      <Typography sx={{ ...headingSecondarySx, flex: 1 }}>
        {label}
      </Typography>

      {/* Right chevron — Preferred Providers style */}
      {chevronSide === 'right' && (
        open
          ? <KeyboardArrowDown sx={{ fontSize: '16px', color: COLORS.TEXT_MUTED }} />
          : <KeyboardArrowUp sx={{ fontSize: '16px', color: COLORS.TEXT_MUTED }} />
      )}
    </Box>

    {open !== false && children}
  </Box>
);

/* ── Dropdown row (Dentist / Hygienist) ──────────────────────────── */
const DropdownRow = ({ label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: spacing.innerGap, mb: spacing.innerGap }}>
    <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, whiteSpace: 'nowrap' }}>
      {label}
    </Typography>
    <Box sx={{ flex: 1, height: '1px', backgroundColor: '#d1d5db' }} />
    <KeyboardArrowDown sx={{ fontSize: '16px', color: COLORS.TEXT_MUTED, flexShrink: 0 }} />
  </Box>
);

/* ── Form badge ───────────────────────────────────────────────────── */
const FormBadge = ({ label, active }) => (
  <Box
    sx={{
      width: avatarSize.sm, height: avatarSize.sm,
      borderRadius: radius.sm,
      backgroundColor: active ? COLORS.STATUS_ERROR : '#f3f4f6',
      border: active ? 'none' : '1px solid #e5e7eb',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}
  >
    <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: active ? COLORS.WHITE : COLORS.TEXT_MUTED }}>
      {label}
    </Typography>
  </Box>
);

/* ── Collapsible card shell ──────────────────────────────────────── */
const DetailCard = ({ icon, title, children }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <Box sx={{ backgroundColor: COLORS.SURFACE_CARD, border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.lg, overflow: 'hidden', mt: spacing.cardGap }}>
      <Box
        onClick={() => setExpanded((p) => !p)}
        sx={{
          display: 'flex', alignItems: 'center', gap: spacing.cardGap,
          px: spacing.cardPx, py: spacing.cardPy,
          cursor: 'pointer',
          borderBottom: expanded ? `1px solid ${COLORS.BORDER_LIGHT}` : 'none',
        }}
      >
        {icon}
        <Typography sx={{ ...headingPrimarySx, flex: 1 }}>
          {title}
        </Typography>
        {expanded
          ? <KeyboardArrowUp sx={{ fontSize: '18px', color: COLORS.TEXT_SECONDARY }} />
          : <KeyboardArrowDown sx={{ fontSize: '18px', color: COLORS.TEXT_SECONDARY }} />}
      </Box>
      {expanded && (
        <Box sx={{ px: spacing.cardPx, py: spacing.cardPy, display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
    <DetailCard icon={<Assignment sx={{ fontSize: '20px', color: COLORS.ACCENT }} />} title="Patient Details">

      {/* Preferred Providers */}
      <SubSection label="Preferred Providers" chevronSide="right" open={providersOpen} onToggle={() => setProvidersOpen((p) => !p)}>
        <Box sx={{ pl: '8px' }}>
          <DropdownRow label="Preferred Dentist:" />
          <DropdownRow label="Preferred Hygienist:" />
        </Box>
      </SubSection>

      {/* Patient Forms */}
      <SubSection label="Patient Forms" open>
        <Box sx={{ display: 'flex', gap: spacing.innerGap, pl: '8px' }}>
          <FormBadge label="B" active />
          <FormBadge label="R" />
          <FormBadge label="P" />
          <FormBadge label="Q" />
        </Box>
      </SubSection>

      {/* Medical Alerts — chevron on LEFT of bar */}
      <SubSection label="Medical Alerts" chevronSide="left" open={alertsOpen} onToggle={() => setAlertsOpen((p) => !p)}>
        <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: '#dc2626', textAlign: 'center', pl: '8px' }}>
          Diabetes Type I
        </Typography>
      </SubSection>

      {/* Patient Flags */}
      <SubSection label="Patient Flags" open>
        <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_MUTED, pl: '8px' }}>No flags</Typography>
      </SubSection>

      {/* Bills */}
      <SubSection label="Bills" open>
        <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, textAlign: 'center' }}>
          Last Bill: None
        </Typography>
      </SubSection>

      {/* Used Amount */}
      <SubSection label="Used Amount:" open>
        <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, pl: '8px' }}>
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
      <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}>{label}</Typography>
      <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>{value}</Typography>
    </Box>
  );

  return (
    <DetailCard icon={<PeopleAlt sx={{ fontSize: '20px', color: COLORS.ACCENT }} />} title="Family Details">

      {/* Family members */}
      <SubSection label="Family members:" open>
        <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_MUTED, pl: '8px' }}>
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
