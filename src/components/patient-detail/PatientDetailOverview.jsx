// http://localhost:5173/patients/details/16 => PatientDetailPage

import { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import { Box, Button, Divider, TextField } from '@mui/material';
import {
  PersonOutlineOutlined as PersonOutlineIcon,
  Groups2Outlined as CareTeamIcon,
  PhoneOutlined as PhoneOutlinedIcon,
  ShieldOutlined as FinancialResponsibilityIcon,
  InsightsOutlined as InsightsOutlinedIcon,
  GroupsOutlined as FamilyIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  FavoriteBorderOutlined as FavoriteBorderIcon,
  WarningAmberOutlined as WarningAmberIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import PatientDetailActions from './PatientDetailActions';
import MyChartProfileModal from './MyChartProfileModal';
import PatientSummaryCard from './PatientSummaryCard';
import PatientDetailsSection from './PatientDetailsSection';
import PatientCareTeamCard from './PatientCareTeamCard';
import PatientSnapshotCard from './PatientSnapshotCard';
import AdditionalInformationSection from './AdditionalInformationSection';
import ContactInformationSection from './ContactInformationSection';
import FamilyMembersSection from './FamilyMembersSection';
import FinancialResponsibilitySection from './FinancialResponsibilitySection';
import HeadOfCommunicationSection from './HeadOfCommunicationSection';
import EmergencyContactSection from './EmergencyContactSection';
import PatientPreferencesGrid, { CommunicationPreferencesCard, ReferringCard, ConfirmationSettingsCard, AssignmentReleaseCard } from './PatientPreferencesGrid';
import SectionCard from '../shared/SectionCard';
import { InlineFieldRow } from './InlineField';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';
import { ZIndexLayer } from 'recharts';

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

    // Update state with formatted value
    const updatedSpouseInfo = { ...spouseInfo, phone: cleanedNumber };
    setSpouseInfo(updatedSpouseInfo);

    if (onPatientDataChange) {
      const updatedData = { ...patient, spouseInfo: updatedSpouseInfo };
      onPatientDataChange(updatedData);
    }
  };

  // Only safe, non-geometric overrides — see the identical note in
  // ContactInformationSection.jsx: overriding height/padding/width here fights the
  // library's own absolute-positioned flag icon math and misaligns it.
  const phoneInputWrapperSx = {
    '& .react-tel-input': {
      fontFamily: 'Inter',
      width: '100%',
    },
    '& .react-tel-input .form-control': {
      width: '100%',
      fontFamily: 'Inter',
      fontSize: fontSize.base,
    },
    '& .react-tel-input .country-list': {
      fontFamily: 'Inter',
    },
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <InlineFieldRow
          label="Spouse Name"
          value={spouseInfo?.name || ''}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow
          label="Spouse Phone"
          input={
            <Box sx={phoneInputWrapperSx}>
              <PhoneInput
                country="us"
                value={spouseInfo?.phone ? (() => {
                  const digits = spouseInfo.phone.replace(/\D/g, '');
                  if (digits.length === 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
                  if (digits.length === 11 && digits.startsWith('1')) return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
                  return spouseInfo.phone;
                })() : ''}
                onChange={(rawValue) => handlePhoneChange({ target: { value: rawValue } })}
                enableSearch
                searchPlaceholder="Search"
                specialLabel=""
              />
            </Box>
          }
        />
        <InlineFieldRow
          label="Email Address"
          value={spouseInfo?.email || ''}
          placeholder="email@example.com"
          onChange={(e) => handleFieldChange('email', e.target.value)}
          InputProps={{ readOnly: !isEditMode }}
        />
      </Box>
    </Box>
  );
}

/**
 * Three independent sections, each owned by a different piece of the route:
 *  - Tabs (PatientSectionTabs, rendered by PatientDetailPage) sit above this
 *    component entirely and never re-render because of anything below.
 *  - Header: identity (PatientSummaryCard) + actions (PatientDetailActions),
 *    a plain row with just a bottom border — not its own card.
 *  - Body: a 32% / 28% / 30% three-column grid of SectionCards —
 *      Col 1: Patient Details, Care Team Providers, Additional Information,
 *             Communication Preferences, Family Members
 *      Col 2: Contact Information, Spouse Information
 *      Col 3: Financial Responsibility (+ Head of Communication nested in),
 *             Snapshot, Emergency Contact, Referring, Confirmation Settings,
 *             Assignment & Release
 *    followed by the full-width Preferences area (Credit Card, Bank
 *    Account, Release Information).
 *    Communication Preferences / Family Members / Referring / Confirmation
 *    Settings / Assignment & Release live in Col 1 / Col 3 rather than the
 *    full-width area below so their height offsets Col 2's much taller
 *    Contact Information card instead of leaving a void beside it.
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
  // Dentist/hygienist dropdowns share one provider list app-wide (see
  // PatientDetailPage.jsx), so either prop works here as the lookup source.
  const careTeamProviders = preferredDentists.length ? preferredDentists : preferredHygienists;

  return (
    <Box sx={{ maxWidth: 1280, position: 'relative' }}>
      <MyChartProfileModal
        open={myChartModalOpen}
        onClose={() => setMyChartModalOpen(false)}
        patient={patient}
      />
      {/* Page header — its own rounded card under the tabs bar, matching the
          SectionCard border/radius treatment used throughout the body. */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          px: 2.5,
          py: 2,
          mb: 1.25,
          backgroundColor: COLORS.SURFACE_CARD,
          borderRadius: radius.xl,
          border: `0.8px solid ${COLORS.BORDER}`,
        }}
      >
        <PatientSummaryCard
          patient={patient}
          patientNumber={patientNumber}
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

      {/* Body — 32% / 28% / 30% three-column card grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '32fr 28fr 30fr' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        {/* Col 1 — 32% */}
        <Box>
          <SectionCard icon={PersonOutlineIcon} title="Patient Details" subtitle={patientNumber != null ? `pt #${patientNumber}` : undefined}>
            <PatientDetailsSection
              patient={patient}
              isEditMode={isEditMode}
              onPatientDataChange={onPatientDataChange}
            />
          </SectionCard>
          <SectionCard icon={CareTeamIcon} title="Care Team Providers">
            <PatientCareTeamCard patient={patient} providers={careTeamProviders} />
          </SectionCard>
          <SectionCard icon={DescriptionOutlinedIcon} title="Additional Information">
            <AdditionalInformationSection
              patient={patient}
              showSpouse={false}
              isEditMode={isEditMode}
              onPatientDataChange={onPatientDataChange}
            />
          </SectionCard>
          <CommunicationPreferencesCard
            patient={patient}
            isEditMode={isEditMode}
            onPatientDataChange={onPatientDataChange}
          />
          <SectionCard
            icon={FamilyIcon}
            title="Family Members"
            subtitle="One HOH per family"
            action={
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={onAddFamilyMember}
                sx={{ textTransform: 'none', fontFamily: 'Inter', fontWeight: fontWeight.semibold, fontSize: fontSize.base, color: COLORS.ACCENT }}
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

        {/* Col 2 — 28% */}
        <Box>
          <SectionCard icon={PhoneOutlinedIcon} title="Contact Information" subtitle="Primary reach & addresses" badge="verified" allowOverflow>
            <ContactInformationSection
              patient={patient}
              isEditMode={isEditMode}
              onPatientDataChange={onPatientDataChange}
            />
          </SectionCard>
          <SectionCard icon={FavoriteBorderIcon} title="Spouse Information" allowOverflow>
            <SpouseInformationSectionContent
              patient={patient}
              isEditMode={isEditMode}
              onPatientDataChange={onPatientDataChange}
            />
          </SectionCard>
        </Box>

        {/* Col 3 — 30% */}
        <Box>
          <SectionCard icon={FinancialResponsibilityIcon} title="Financial Responsibility">
            <FinancialResponsibilitySection
              patient={patient}
              isEditMode={isEditMode}
              onPatientDataChange={onPatientDataChange}
            />
            <Divider sx={{ my: 2.5, borderColor: COLORS.BORDER }} />
            <HeadOfCommunicationSection
              patient={patient}
              isEditMode={isEditMode}
              onPatientDataChange={onPatientDataChange}
            />
          </SectionCard>
          <SectionCard icon={InsightsOutlinedIcon} title="Snapshot">
            <PatientSnapshotCard patient={patient} patientNumber={patientNumber} />
          </SectionCard>
          <SectionCard icon={WarningAmberIcon} title="Emergency Contact">
            <EmergencyContactSection
              patient={patient}
              isEditMode={isEditMode}
              onPatientDataChange={onPatientDataChange}
            />
          </SectionCard>
          <ReferringCard patient={patient} />
          <ConfirmationSettingsCard
            patient={patient}
            isEditMode={isEditMode}
            onPatientDataChange={onPatientDataChange}
          />
          <AssignmentReleaseCard
            patient={patient}
            isEditMode={isEditMode}
            onPatientDataChange={onPatientDataChange}
          />
        </Box>
      </Box>

      <PatientPreferencesGrid
        patient={patient}
        isEditMode={isEditMode}
        onPatientDataChange={onPatientDataChange}
      />
    </Box>
  );
}
