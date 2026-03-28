import { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, InputAdornment } from '@mui/material';
import { KeyboardArrowDown as ArrowDownIcon } from '@mui/icons-material';
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
import { InlineFieldRow, standardFieldSx } from './InlineField';
import { sectionTitleSx, labelSx } from '../../constants/styles';

function SpouseInformationSectionContent({ patient, isEditMode = false, onPatientDataChange }) {
  const [spouseInfo, setSpouseInfo] = useState(patient?.spouseInfo || {});
  
  useEffect(() => {
    setSpouseInfo(patient?.spouseInfo || {});
  }, [patient?.spouseInfo]);
  
  const handleFieldChange = (field, value) => {
    const updatedSpouseInfo = { ...spouseInfo, [field]: value };
    setSpouseInfo(updatedSpouseInfo);
    
    if (onPatientDataChange) {
      const updatedData = { 
        ...patient, 
        spouseInfo: updatedSpouseInfo
      };
      onPatientDataChange(updatedData);
    }
  };

  const handlePhoneChange = (e) => {
    const rawValue = e.target.value;
    
    // Remove all non-digit characters
    const digitsOnly = rawValue.replace(/\D/g, '');
    
    // Limit to max 11 digits
    let cleanedNumber = digitsOnly;
    if (digitsOnly.length > 11) {
      cleanedNumber = digitsOnly.slice(0, 11);
    }
    
    // If starts with 0 or 9 (invalid first digits), remove them
    if (cleanedNumber.length > 0 && (cleanedNumber[0] === '0' || cleanedNumber[0] === '9')) {
      cleanedNumber = cleanedNumber.slice(1);
    }
    
    // Format for display
    let formattedNumber = '';
    if (cleanedNumber.length === 10) {
      formattedNumber = `(${cleanedNumber.slice(0, 3)}) ${cleanedNumber.slice(3, 6)}-${cleanedNumber.slice(6)}`;
    } else if (cleanedNumber.length === 11 && cleanedNumber.startsWith('1')) {
      formattedNumber = `+1 (${cleanedNumber.slice(1, 4)}) ${cleanedNumber.slice(4, 7)}-${cleanedNumber.slice(7)}`;
    } else if (cleanedNumber.length <= 3) {
      formattedNumber = cleanedNumber;
    } else if (cleanedNumber.length <= 6) {
      formattedNumber = `(${cleanedNumber.slice(0, 3)}) ${cleanedNumber.slice(3)}`;
    } else {
      formattedNumber = `(${cleanedNumber.slice(0, 3)}) ${cleanedNumber.slice(3, 6)}-${cleanedNumber.slice(6)}`;
    }
    
    // Update state with formatted value
    const updatedSpouseInfo = { ...spouseInfo, phone: cleanedNumber };
    setSpouseInfo(updatedSpouseInfo);
    
    if (onPatientDataChange) {
      const updatedData = { ...patient, spouseInfo: updatedSpouseInfo };
      onPatientDataChange(updatedData);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'primary.main', mb: 1.5 }}>
        Spouse Information
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 1, alignItems: 'center', py: 0.75, minHeight: 36 }}>
          <Typography component="label" sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Spouse Name:
          </Typography>
          <TextField
            variant="standard"
            fullWidth
            value={spouseInfo?.name || ''}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            InputProps={{
              readOnly: !isEditMode,
              disableUnderline: false,
            }}
            sx={standardFieldSx}
          />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 1, alignItems: 'center', py: 0.75, minHeight: 36 }}>
          <Typography component="label" sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Spouse Phone:
          </Typography>
          <TextField
            variant="standard"
            fullWidth
            value={spouseInfo?.phone ? (() => {
              const digits = spouseInfo.phone.replace(/\D/g, '');
              if (digits.length === 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
              if (digits.length === 11 && digits.startsWith('1')) return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
              return spouseInfo.phone;
            })() : ''}
            onChange={handlePhoneChange}
            inputProps={{
              maxLength: isEditMode ? 16 : undefined,
            }}
            InputProps={{
              readOnly: !isEditMode,
              disableUnderline: false,
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0.5, cursor: 'pointer', flexShrink: 0 }}>
                  <span style={{ fontSize: '1rem' }}>🇺🇸</span>
                  <ArrowDownIcon sx={{ fontSize: 18, ml: 0.25, color: 'action.active' }} />
                </InputAdornment>
              ),
            }}
            sx={standardFieldSx}
            placeholder="(XXX) XXX-XXXX"
          />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 1, alignItems: 'center', py: 0.75, minHeight: 36 }}>
          <Typography component="label" sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Email Address:
          </Typography>
          <TextField
            variant="standard"
            fullWidth
            value={spouseInfo?.email || ''}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            InputProps={{
              readOnly: !isEditMode,
              disableUnderline: false,
            }}
            sx={standardFieldSx}
            placeholder="email@example.com"
          />
        </Box>
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
  isEditMode = false,
  onEdit,
  onSave,
  onCancelEdit,
  onRefresh,
  onDeactivate,
  onActivate,
  onConvertToNonPatient,
  onBalance,
  onDocuments,
  onAddFamilyMember,
  onSendUpdateRequest,
  onPatientDataChange,
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
            onSave={onSave}
            onCancelEdit={onCancelEdit}
            onRefresh={onRefresh}
            onDeactivate={onDeactivate}
            onActivate={onActivate}
            isActive={patient?.isActive}
            onConvertToNonPatient={onConvertToNonPatient}
            onSendUpdateRequest={onSendUpdateRequest}
            patient={patient}
            isEditMode={isEditMode}
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
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
            gap: 4,
            alignItems: 'start',
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
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <PatientDetailsSection 
              patient={patient} 
              patientNumber={patientNumber}
              isEditMode={isEditMode}
              onPatientDataChange={onPatientDataChange}
            />
          </Box>
          {/* Col 2: Contact information | Spouse information */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <ContactInformationSection 
              patient={patient}
              isEditMode={isEditMode}
              onPatientDataChange={onPatientDataChange}
            />
          </Box>
          {/* Col 3: Financial Responsibility | Head of communication | Emergency contact */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FinancialResponsibilitySection 
              patient={patient}
              isEditMode={isEditMode}
              onPatientDataChange={onPatientDataChange}
            />
            <Box sx={{ mt: 3 }}>
              <HeadOfCommunicationSection 
                patient={patient}
                isEditMode={isEditMode}
                onPatientDataChange={onPatientDataChange}
              />
            </Box>
          </Box>
        </Box>
        
        {/* Second row: Additional Information | Spouse Information | Emergency Contact - aligned equally */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
            gap: 4,
            mt: 0,
          }}
        >
          <Box sx={{ pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <AdditionalInformationSection 
              patient={patient} 
              showSpouse={false}
              isEditMode={isEditMode}
              onPatientDataChange={onPatientDataChange}
            />
          </Box>
          <Box sx={{ pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <SpouseInformationSectionContent 
              patient={patient} 
              isEditMode={isEditMode}
              onPatientDataChange={onPatientDataChange}
            />
          </Box>
          <Box sx={{ pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <EmergencyContactSection 
              patient={patient}
              isEditMode={isEditMode}
              onPatientDataChange={onPatientDataChange}
            />
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
          <FamilyMembersSection 
            patient={patient} 
            onAddNew={onAddFamilyMember}
            isEditMode={isEditMode}
            onPatientDataChange={onPatientDataChange}
          />
        </Box>
      </Paper>
    </Box>
  );
}
