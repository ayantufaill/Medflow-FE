import { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, InputAdornment, Divider, Checkbox, FormControlLabel, Button, Stack, MenuItem, Chip, Avatar } from '@mui/material';
import {
  KeyboardArrowDown as ArrowDownIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Info as InfoIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Warning as EmergencyIcon,
  CheckCircle as CheckCircleIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  BookmarkBorder as SnapshotIcon,
  AssignmentTurnedIn as AssignmentIcon,
  Add as AddIcon
} from '@mui/icons-material';
import PatientDetailActions from './PatientDetailActions';
import MyChartProfileModal from './MyChartProfileModal';
import PatientSummaryCard from './PatientSummaryCard';
import PatientDetailsSection from './PatientDetailsSection';
import AdditionalInformationSection from './AdditionalInformationSection';
import ContactInformationSection from './ContactInformationSection';
import FamilyMembersSection from './FamilyMembersSection';
import FinancialResponsibilitySection from './FinancialResponsibilitySection';
import EmergencyContactSection from './EmergencyContactSection';
import SectionCard from './SectionCard';
import { StackedFieldRow } from './InlineField';
import { getInitials } from './utils';

// Spouse Information inside Column 2
function SpouseInformationSectionContent({ patient, isEditMode = false, onPatientDataChange }) {
  const [spouseInfo, setSpouseInfo] = useState(patient?.spouseInfo || {});
  
  useEffect(() => {
    setSpouseInfo(patient?.spouseInfo || {});
  }, [patient?.spouseInfo]);
  
  const handleFieldChange = (field, value) => {
    const updatedSpouseInfo = { ...spouseInfo, [field]: value };
    setSpouseInfo(updatedSpouseInfo);
    
    if (onPatientDataChange) {
      onPatientDataChange({ 
        ...patient, 
        spouseInfo: updatedSpouseInfo
      });
    }
  };

  const handlePhoneChange = (e) => {
    const rawValue = e.target.value;
    const digitsOnly = rawValue.replace(/\D/g, '');
    let cleanedNumber = digitsOnly;
    if (digitsOnly.length > 11) {
      cleanedNumber = digitsOnly.slice(0, 11);
    }
    if (cleanedNumber.length > 0 && (cleanedNumber[0] === '0' || cleanedNumber[0] === '9')) {
      cleanedNumber = cleanedNumber.slice(1);
    }
    
    const updatedSpouseInfo = { ...spouseInfo, phone: cleanedNumber };
    setSpouseInfo(updatedSpouseInfo);
    
    if (onPatientDataChange) {
      onPatientDataChange({ ...patient, spouseInfo: updatedSpouseInfo });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <StackedFieldRow
        label="Spouse Name"
        value={spouseInfo?.name || ''}
        placeholder="Full name"
        isEditMode={isEditMode}
        onChange={(e) => handleFieldChange('name', e.target.value)}
      />
      <StackedFieldRow
        label="Spouse Phone"
        isEditMode={isEditMode}
        input={
          <TextField
            variant="outlined"
            fullWidth
            value={spouseInfo?.phone ? (() => {
              const digits = spouseInfo.phone.replace(/\D/g, '');
              if (digits.length === 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
              if (digits.length === 11 && digits.startsWith('1')) return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
              return spouseInfo.phone;
            })() : ''}
            onChange={handlePhoneChange}
            slotProps={{
              input: {
                readOnly: !isEditMode,
                maxLength: isEditMode ? 16 : undefined,
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0.5, cursor: 'pointer', flexShrink: 0 }}>
                    <span style={{ fontSize: '1rem' }}>🇺🇸</span>
                    <ArrowDownIcon sx={{ fontSize: 16, ml: 0.25, color: 'action.active' }} />
                  </InputAdornment>
                ),
              }
            }}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 38,
                fontSize: '0.8rem',
                backgroundColor: '#ffffff',
                borderRadius: '6px',
                '& fieldset': {
                  borderColor: '#e2e8f0',
                },
              },
            }}
            placeholder="(XXX) XXX-XXXX"
          />
        }
      />
      <StackedFieldRow
        label="Email"
        value={spouseInfo?.email || ''}
        placeholder="email@example.com"
        isEditMode={isEditMode}
        onChange={(e) => handleFieldChange('email', e.target.value)}
      />
    </Box>
  );
}

// Care Team Providers
function CareTeamProvidersSection({ patient, isEditMode = false, onPatientDataChange, providers = [] }) {
  const providerLabel = (provider) => {
    if (!provider) return '';
    if (provider.userId?.firstName || provider.userId?.lastName) {
      return `${provider.userId?.firstName || ""} ${provider.userId?.lastName || ""}`.trim();
    }
    return `${provider.firstName || ""} ${provider.lastName || ""}`.trim() || `ID: ${provider._id || provider.id}`;
  };

  const getProviderName = (id) => {
    if (!id) return null;
    const provider = providers.find(p => (p._id || p.id)?.toString() === id.toString());
    return provider ? providerLabel(provider) : null;
  };

  const dentistId = patient?.preferredDentistId || patient?.customFields?.preferredDentistId || '';
  const hygienistId = patient?.preferredHygienistId || patient?.customFields?.preferredHygienistId || '';

  const dentistName = getProviderName(dentistId);
  const hygienistName = getProviderName(hygienistId);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {isEditMode ? (
        <>
          <StackedFieldRow
            label="Dentist"
            isEditMode={isEditMode}
            input={
              <TextField
                select
                variant="outlined"
                size="small"
                fullWidth
                value={dentistId}
                onChange={(e) => onPatientDataChange({ ...patient, preferredDentistId: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { height: 38 } }}
              >
                <MenuItem value="">None</MenuItem>
                {providers.map(p => (
                  <MenuItem key={p._id || p.id} value={(p._id || p.id)?.toString()}>
                    {providerLabel(p)}
                  </MenuItem>
                ))}
              </TextField>
            }
          />
          <StackedFieldRow
            label="Hygienist"
            isEditMode={isEditMode}
            input={
              <TextField
                select
                variant="outlined"
                size="small"
                fullWidth
                value={hygienistId}
                onChange={(e) => onPatientDataChange({ ...patient, preferredHygienistId: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { height: 38 } }}
              >
                <MenuItem value="">None</MenuItem>
                {providers.map(p => (
                  <MenuItem key={p._id || p.id} value={(p._id || p.id)?.toString()}>
                    {providerLabel(p)}
                  </MenuItem>
                ))}
              </TextField>
            }
          />
        </>
      ) : (
        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, border: '1px solid #f1f5f9', borderRadius: '6px' }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#eef6ff', color: '#3b82f6', fontSize: '0.75rem', fontWeight: 700 }}>
              JP
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Dentist</Typography>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>
                {dentistName || 'Dr. James Patel'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, border: '1px solid #f1f5f9', borderRadius: '6px' }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#eef6ff', color: '#3b82f6', fontSize: '0.75rem', fontWeight: 700 }}>
              MJ
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Hygienist</Typography>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>
                {hygienistName || 'Marcus Johnson'}
              </Typography>
            </Box>
          </Box>
        </Stack>
      )}
    </Box>
  );
}

// Communication Preferences
function CommunicationPreferencesSection({ patient, isEditMode = false, onPatientDataChange }) {
  const preferences = [
    { text: "Contact me on the phone numbers provided", field: "communicationContactByPhone" },
    { text: "Leave voicemail at home", field: "communicationLeaveVoicemailAtHome" },
    { text: "I agree the dental practice may communicate with me electronically at the email address provided.", field: "communicationAgreeElectronicCommunications" },
    { text: "By opting in, I agree to receive SMS messages from the dental office regarding appointment reminders.", field: "communicationAgreeSmsMessages" }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {preferences.map((item, index) => {
        const isChecked = !!patient?.customFields?.[item.field];
        return isEditMode ? (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                size="small"
                checked={isChecked}
                onChange={(e) => onPatientDataChange({
                  ...patient,
                  customFields: { ...patient?.customFields, [item.field]: e.target.checked }
                })}
                sx={{ p: 0.5 }}
              />
            }
            label={<Typography sx={{ fontSize: '0.75rem', color: 'text.primary', lineHeight: 1.3 }}>{item.text}</Typography>}
          />
        ) : (
          <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <CheckCircleIcon sx={{ color: isChecked ? '#3b82f6' : '#cbd5e1', fontSize: 18, mt: 0.2 }} />
            <Typography sx={{ fontSize: '0.75rem', color: isChecked ? 'text.primary' : 'text.secondary', lineHeight: 1.3 }}>
              {item.text}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

// Confirmation Settings
function ConfirmationSettingsSection({ patient, isEditMode = false, onPatientDataChange }) {
  const settings = [
    { text: "Pause Schedule Gap-Fill Reminders", field: "communicationPauseScheduleGapFillsReminders" },
    { text: "Pause AR Automation Reminders", field: "communicationPauseArAutomationReminders" },
    { text: "Receive Email Campaign", field: "communicationAgreeElectronicCommunications" }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {settings.map((item, index) => {
        const isChecked = !!patient?.customFields?.[item.field];
        return isEditMode ? (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                size="small"
                checked={isChecked}
                onChange={(e) => onPatientDataChange({
                  ...patient,
                  customFields: { ...patient?.customFields, [item.field]: e.target.checked }
                })}
                sx={{ p: 0.5 }}
              />
            }
            label={<Typography sx={{ fontSize: '0.75rem', color: 'text.primary', lineHeight: 1.3 }}>{item.text}</Typography>}
          />
        ) : (
          <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <CheckCircleIcon sx={{ color: isChecked ? '#3b82f6' : '#cbd5e1', fontSize: 18, mt: 0.2 }} />
            <Typography sx={{ fontSize: '0.75rem', color: isChecked ? 'text.primary' : 'text.secondary', lineHeight: 1.3 }}>
              {item.text}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

// Referring Card
function ReferringSection({ patient, isEditMode = false, onPatientDataChange }) {
  const stripPatientId = (name) => {
    return name ? name.replace(/\s*\(PAT\d+\)/, '').trim() : name;
  };

  const referringPatient = patient?.customFields?.referringPatient || '';
  const referralSource = patient?.referralSource || '';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box>
        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 700 }}>Referring Sources</Typography>
        {isEditMode ? (
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            value={referralSource}
            onChange={(e) => onPatientDataChange({ ...patient, referralSource: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { height: 36, mt: 0.5 } }}
          />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, p: 1, border: '1px solid #f1f5f9', borderRadius: '6px', bgcolor: '#f0f7ff' }}>
            <Box sx={{ width: 6, height: 6, bgcolor: '#3b82f6', borderRadius: '50%' }} />
            <Typography sx={{ fontSize: '0.75rem', color: '#1e3a8a', fontWeight: 600 }}>
              {referralSource || 'Colleague Referral'}
            </Typography>
          </Box>
        )}
      </Box>
      <Box>
        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 700 }}>Referring Patient</Typography>
        {isEditMode ? (
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            value={referringPatient}
            onChange={(e) => onPatientDataChange({
              ...patient,
              customFields: { ...patient?.customFields, referringPatient: e.target.value }
            })}
            sx={{ '& .MuiOutlinedInput-root': { height: 36, mt: 0.5 } }}
          />
        ) : (
          <Box sx={{ mt: 0.5, p: 1, border: '1px solid #f1f5f9', borderRadius: '6px', bgcolor: '#ffffff', minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              {stripPatientId(referringPatient) || 'None'}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// Assignment & Release
function AssignmentReleaseSection({ patient, isEditMode = false, onPatientDataChange }) {
  const fields = [
    { label: "Assignment & Release", field: "assignmentRelease" },
    { label: "Photography Release", field: "photographyRelease" },
    { label: "Social Media Release", field: "socialMediaRelease" },
    { label: "AI Release", field: "aiRelease" }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {fields.map((item, idx) => {
        const val = patient?.customFields?.[item.field] || 'Not answered';
        const isNotAnswered = val.toLowerCase() === 'not answered' || !val;
        return (
          <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 32 }}>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500 }}>{item.label}</Typography>
            {isEditMode ? (
              <TextField
                select
                variant="outlined"
                size="small"
                value={val}
                onChange={(e) => onPatientDataChange({
                  ...patient,
                  customFields: { ...patient?.customFields, [item.field]: e.target.value }
                })}
                sx={{ width: 120, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.7rem' } }}
              >
                <MenuItem value="Not answered" sx={{ fontSize: '0.75rem' }}>Not answered</MenuItem>
                <MenuItem value="yes" sx={{ fontSize: '0.75rem' }}>Yes</MenuItem>
                <MenuItem value="no" sx={{ fontSize: '0.75rem' }}>No</MenuItem>
              </TextField>
            ) : (
              <Chip
                label={isNotAnswered ? 'NOT ANSWERED' : val.toUpperCase()}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  bgcolor: isNotAnswered ? '#fef3c7' : '#dcfce7',
                  color: isNotAnswered ? '#d97706' : '#16a34a',
                  borderRadius: '4px'
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}

// Release Information
function ReleaseInfoSection({ patient, isEditMode = false, onPatientDataChange }) {
  const options = [
    { label: "Spouse / Common-law partner", field: "releaseSpouse" },
    { label: "Children", field: "releaseChildren" },
    { label: "Parents", field: "releaseParents" }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary' }}>Can discuss information with:</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {options.map((item, idx) => {
          const isChecked = !!patient?.customFields?.[item.field];
          return isEditMode ? (
            <FormControlLabel
              key={idx}
              control={
                <Checkbox
                  size="small"
                  checked={isChecked}
                  onChange={(e) => onPatientDataChange({
                    ...patient,
                    customFields: { ...patient?.customFields, [item.field]: e.target.checked }
                  })}
                  sx={{ p: 0.5 }}
                />
              }
              label={<Typography sx={{ fontSize: '0.75rem' }}>{item.label}</Typography>}
            />
          ) : (
            <Chip
              key={idx}
              label={item.label}
              size="small"
              sx={{
                height: 26,
                fontSize: '0.7rem',
                fontWeight: 600,
                bgcolor: isChecked ? '#eef6ff' : '#f1f5f9',
                color: isChecked ? '#3b82f6' : '#64748b',
                border: isChecked ? '1px solid #dbeafe' : '1px solid transparent',
              }}
            />
          );
        })}
      </Box>
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', mt: 0.5 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary' }}>Other:</Typography>
        {isEditMode ? (
          <TextField
            size="small"
            variant="standard"
            value={patient?.customFields?.releaseOther || ''}
            onChange={(e) => onPatientDataChange({
              ...patient,
              customFields: { ...patient?.customFields, releaseOther: e.target.value }
            })}
            sx={{ input: { fontSize: '0.75rem', py: 0.2 } }}
          />
        ) : (
          <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', fontWeight: 550 }}>
            {patient?.customFields?.releaseOther || 'None'}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

// Snapshot Section
function SnapshotSection({ patient }) {
  const chartId = patient?.patientCode || patient?.patientNumber || 'PAT010';
  const balance = patient?.balance != null ? `$${parseFloat(patient.balance).toFixed(2)}` : '$0.00';
  const lastVisit = patient?.lastVisitDate ? new Date(patient.lastVisitDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '—';
  
  // Custom format next appointment date to match screenshot format e.g. "17 Jan - 10:00 AM"
  const nextAppt = patient?.customFields?.nextAppt || '17 Jan - 10:00 AM';
  const insurance = patient?.customFields?.insurance || 'No active';
  const referredBy = patient?.referralSource || 'Colleague';

  const items = [
    { label: "Chart #", val: chartId },
    { label: "Balance", val: balance },
    { label: "Last visit", val: lastVisit },
    { label: "Next appt", val: nextAppt },
    { label: "Insurance", val: insurance },
    { label: "Referred by", val: referredBy }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {items.map((item, idx) => (
        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', minHeight: 24 }}>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500 }}>{item.label}</Typography>
          <Box sx={{ flexGrow: 1, borderBottom: '1px dotted #e2e8f0', mx: 1, height: '0.8em' }} />
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b' }}>{item.val}</Typography>
        </Box>
      ))}
    </Box>
  );
}

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
    <Box sx={{ width: '100%', position: 'relative' }}>
      <MyChartProfileModal
        open={myChartModalOpen}
        onClose={() => setMyChartModalOpen(false)}
        patient={patient}
      />

      {/* Top Card Summary and Action Row */}
      <Paper
        variant="outlined"
        sx={{
          p: 1.5,
          borderRadius: 2,
          borderColor: 'grey.200',
          mb: 3,
          bgcolor: 'white',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
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

      {/* ===== TOP ROW: Patient Details | Contact Info | Financial Responsibility (3 equal cols) ===== */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, 
          gap: 3, 
          alignItems: 'start'
        }}
      >
        {/* ================= COLUMN 1: Patient Details + Care Team ================= */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <SectionCard
            title="Patient Details"
            icon={<PersonIcon sx={{ fontSize: 16 }} />}
          >
            <PatientDetailsSection 
              patient={patient} 
              patientNumber={patientNumber}
              isEditMode={isEditMode}
              onPatientDataChange={onPatientDataChange}
            />
          </SectionCard>

          <SectionCard
            title="Care Team Providers"
            icon={<PeopleIcon sx={{ fontSize: 16 }} />}
          >
            <CareTeamProvidersSection
              patient={patient}
              isEditMode={isEditMode}
              onPatientDataChange={onPatientDataChange}
              providers={preferredDentists}
            />
          </SectionCard>
        </Box>

        {/* ================= COLUMN 2: Contact Information (with Work Address inside) ================= */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <SectionCard
            title="Contact Information"
            icon={<PhoneIcon sx={{ fontSize: 16 }} />}
            badge="Verified"
            badgeColor="success"
          >
            <ContactInformationSection 
              patient={patient}
              isEditMode={isEditMode}
              onPatientDataChange={onPatientDataChange}
            />
          </SectionCard>
        </Box>

        {/* ================= COLUMN 3: Financial Responsibility + Snapshot ================= */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <SectionCard
            title="Financial Responsibility"
            icon={<MoneyIcon sx={{ fontSize: 16 }} />}
          >
            <FinancialResponsibilitySection 
              patient={patient}
              isEditMode={isEditMode}
              onPatientDataChange={onPatientDataChange}
            />
          </SectionCard>

          <SectionCard
            title="Snapshot"
            icon={<SnapshotIcon sx={{ fontSize: 16 }} />}
          >
            <SnapshotSection patient={patient} />
          </SectionCard>
        </Box>
      </Box>

      {/* ========== ROW 2: Additional Info | Spouse Info | Emergency Contact (3 equal cols) ========== */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
          gap: 3,
          mt: 3,
          alignItems: 'start'
        }}
      >
        <SectionCard
          title="Additional Information"
          icon={<InfoIcon sx={{ fontSize: 16 }} />}
        >
          <AdditionalInformationSection 
            patient={patient} 
            isEditMode={isEditMode}
            onPatientDataChange={onPatientDataChange}
          />
        </SectionCard>

        <SectionCard
          title="Spouse Information"
          icon={<PersonIcon sx={{ fontSize: 16 }} />}
        >
          <SpouseInformationSectionContent 
            patient={patient} 
            isEditMode={isEditMode}
            onPatientDataChange={onPatientDataChange}
          />
        </SectionCard>

        <SectionCard
          title="Emergency Contact"
          icon={<EmergencyIcon sx={{ fontSize: 16 }} />}
        >
          <EmergencyContactSection 
            patient={patient}
            isEditMode={isEditMode}
            onPatientDataChange={onPatientDataChange}
          />
        </SectionCard>
      </Box>

      {/* ========== ROW 3: Communication Preferences | Referring (2 equal cols) ========== */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          mt: 3,
          alignItems: 'start'
        }}
      >
        <SectionCard
          title="Communication Preferences"
          icon={<InfoIcon sx={{ fontSize: 16 }} />}
        >
          <CommunicationPreferencesSection
            patient={patient}
            isEditMode={isEditMode}
            onPatientDataChange={onPatientDataChange}
          />
        </SectionCard>

        <SectionCard
          title="Referring"
          icon={<PeopleIcon sx={{ fontSize: 16 }} />}
        >
          <ReferringSection
            patient={patient}
            isEditMode={isEditMode}
            onPatientDataChange={onPatientDataChange}
          />
        </SectionCard>
      </Box>

      {/* ========== ROW 4: Confirmation Settings | Assignment & Release (2 equal cols) ========== */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          mt: 3,
          alignItems: 'start'
        }}
      >
        <SectionCard
          title="Confirmation Settings"
          icon={<InfoIcon sx={{ fontSize: 16 }} />}
        >
          <ConfirmationSettingsSection
            patient={patient}
            isEditMode={isEditMode}
            onPatientDataChange={onPatientDataChange}
          />
        </SectionCard>

        <SectionCard
          title="Assignment & Release"
          icon={<AssignmentIcon sx={{ fontSize: 16 }} />}
        >
          <AssignmentReleaseSection
            patient={patient}
            isEditMode={isEditMode}
            onPatientDataChange={onPatientDataChange}
          />
        </SectionCard>
      </Box>

      {/* ========== ROW 5: Credit Card | Bank Account | Release Information (3 equal cols) ========== */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
          gap: 3,
          mt: 3,
          alignItems: 'start'
        }}
      >
        <SectionCard
          title="Credit Card"
          icon={<CreditCardIcon sx={{ fontSize: 16 }} />}
          headerAction={
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon sx={{ fontSize: 12 }} />}
              sx={{ 
                textTransform: 'none', 
                fontSize: '0.65rem', 
                fontWeight: 700, 
                py: 0.25, 
                px: 1, 
                height: 24, 
                borderColor: '#cbd5e1',
                color: '#1e293b'
              }}
            >
              Add card
            </Button>
          }
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 2, gap: 1 }}>
            <CreditCardIcon sx={{ fontSize: 24, color: '#cbd5e1' }} />
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>No cards registered</Typography>
          </Box>
        </SectionCard>

        <SectionCard
          title="Bank Account"
          icon={<BankIcon sx={{ fontSize: 16 }} />}
          headerAction={
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon sx={{ fontSize: 12 }} />}
              sx={{ 
                textTransform: 'none', 
                fontSize: '0.65rem', 
                fontWeight: 700, 
                py: 0.25, 
                px: 1, 
                height: 24, 
                borderColor: '#cbd5e1',
                color: '#1e293b'
              }}
            >
              Add
            </Button>
          }
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 2, gap: 1 }}>
            <BankIcon sx={{ fontSize: 24, color: '#cbd5e1' }} />
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>No account on file</Typography>
          </Box>
        </SectionCard>

        <SectionCard
          title="Release Information"
          icon={<InfoIcon sx={{ fontSize: 16 }} />}
        >
          <ReleaseInfoSection
            patient={patient}
            isEditMode={isEditMode}
            onPatientDataChange={onPatientDataChange}
          />
        </SectionCard>
      </Box>

      {/* ========== ROW 6: Family Members (full width) ========== */}
      <Box sx={{ mt: 3 }}>
        <SectionCard
          title="Family Members"
          icon={<PeopleIcon sx={{ fontSize: 16 }} />}
          headerAction={
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon sx={{ fontSize: 12 }} />}
              onClick={onAddFamilyMember}
              sx={{ 
                textTransform: 'none', 
                fontSize: '0.65rem', 
                fontWeight: 700, 
                py: 0.25, 
                px: 1, 
                height: 24, 
                borderColor: '#cbd5e1',
                color: '#1e293b'
              }}
            >
              Add member
            </Button>
          }
        >
          <FamilyMembersSection 
            patient={patient} 
            isEditMode={isEditMode}
            onPatientDataChange={onPatientDataChange}
          />
        </SectionCard>
      </Box>
    </Box>
  );
}
