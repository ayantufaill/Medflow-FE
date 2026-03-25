import { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import PatientDetailActions from './PatientDetailActions';
import MyChartProfileModal from './MyChartProfileModal';
import PatientSummaryCard from './PatientSummaryCard';
import PatientDetailsSection from './PatientDetailsSection';
import AdditionalInformationSection from './AdditionalInformationSection';
import ContactInformationSection from './ContactInformationSection';
import FamilyMembersSection from './FamilyMembersSection';
import FinancialResponsibilitySection from './FinancialResponsibilitySection';
import HeadOfCommunicationSection from './HeadOfCommunicationSection';
import EmergencyContactSection from './EmergencyContactSection';
import { InlineFieldRow } from './InlineField';

function SpouseInformationSection() {
  return null;
}

function SpouseInformationSectionContent({ patient }) {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'primary.main', mb: 1.5 }}>
        Spouse Information
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <InlineFieldRow label="Spouse Name" value={patient?.spouseInfo?.name || ''} />
        <InlineFieldRow label="Spouse Phone" value={patient?.spouseInfo?.phone || ''} />
        <InlineFieldRow label="Email Address" value={patient?.spouseInfo?.email || ''} />
      </Box>
    </Box>
  );
}

/**
 * Screenshot-exact layout:
 * - Row 1: Profile (avatar, name | age, email, 4 icons) + Action bar (Edit, 5 utility icons, Deactivate, Convert, Request Patient Updates)
 * - Row 2: LEFT column = only Patient Details (pt #). RIGHT column = Patient flags, Contact Information, Family Members, Financial Responsibility, Head of Communication (all stacked)
 * - Row 3: Additional Information | Spouse Information | Emergency Contact
 */
export default function PatientDetailOverview({
  patient,
  patientNumber,
  preferredDentists = [],
  preferredHygienists = [],
  onEdit,
  onRefresh,
  onDeactivate,
  onConvertToNonPatient,
  onBalance,
  onDocuments,
  onAddFamilyMember,
  onSendUpdateRequest,
}) {
  const [myChartModalOpen, setMyChartModalOpen] = useState(false);

  return (
    <Box sx={{ maxWidth: 1280, position: 'relative' }}>
      <MyChartProfileModal
        open={myChartModalOpen}
        onClose={() => setMyChartModalOpen(false)}
        patient={patient}
      />
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          borderRadius: 1.5,
          borderColor: 'grey.300',
          mb: 2.5,
          bgcolor: 'white',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <PatientSummaryCard
            patient={patient}
            onBalance={onBalance}
            onProfileClick={() => setMyChartModalOpen(true)}
          />
          <PatientDetailActions
            onEdit={onEdit}
            onRefresh={onRefresh}
            onDeactivate={onDeactivate}
            onConvertToNonPatient={onConvertToNonPatient}
            onSendUpdateRequest={onSendUpdateRequest}
          />
        </Box>
      </Paper>

      {/* 3-column layout:
          Col 1: Patient details | Additional information
          Col 2: Contact information | Spouse information
          Col 3: Financial Responsibility | Head of communication | Emergency contact */}
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          borderRadius: 1.5,
          borderColor: 'grey.300',
          mb: 2.5,
          bgcolor: 'white',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1.15fr 1fr' },
            gap: 4,
            '& > *:nth-of-type(1)': {
              pl: { xs: 2, sm: 2 },
              pr: { xs: 2, sm: 2 },
            },
            '& > *:nth-of-type(2)': {
              pl: { xs: 2, sm: 2 },
              pr: { xs: 2, sm: 2 },
            },
            '& > *:nth-of-type(3)': {
              pl: { xs: 2, sm: 2 },
              pr: { xs: 2, sm: 2 },
            },
          }}
        >
          {/* Col 1: Patient details | Additional information */}
          <Box>
            <PatientDetailsSection patient={patient} patientNumber={patientNumber} />
            <Box sx={{ mt: 3 }}>
              <AdditionalInformationSection patient={patient} showSpouse={false} />
            </Box>
          </Box>
          {/* Col 2: Contact information | Spouse information */}
          <Box>
            <ContactInformationSection patient={patient} />
            <Box sx={{ mt: 3 }}>
              <SpouseInformationSectionContent patient={patient} />
            </Box>
          </Box>
          {/* Col 3: Financial Responsibility | Head of communication | Emergency contact */}
          <Box>
            <FinancialResponsibilitySection patient={patient} />
            <Box sx={{ mt: 3 }}>
              <HeadOfCommunicationSection patient={patient} />
            </Box>
            <Box sx={{ mt: 3 }}>
              <EmergencyContactSection patient={patient} />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Family Members — full width row */}
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          borderRadius: 1.5,
          borderColor: 'grey.300',
          bgcolor: 'white',
        }}
      >
        <Box sx={{ mt: 3 }}>
          <FamilyMembersSection patient={patient} onAddNew={onAddFamilyMember} />
        </Box>
      </Paper>
    </Box>
  );
}
