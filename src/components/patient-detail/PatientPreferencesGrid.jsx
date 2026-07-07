import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Stack,
  TextField,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  ChatBubbleOutlineOutlined as CommunicationIcon,
  PersonAddAltOutlined as ReferringIcon,
  NotificationsNoneOutlined as ConfirmationIcon,
  AssignmentOutlined as AssignmentIcon,
  CreditCardOutlined as CreditCardIcon,
  AccountBalanceOutlined as BankIcon,
  PrivacyTipOutlined as ReleaseIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import SectionCard from '../shared/SectionCard';
import { InlineFieldRow } from './InlineField';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight } from '../../constants/styles';
import { roundedSelectMenuProps } from '../../constants/styles';

// ── Shared bits ────────────────────────────────────────────────────────────

const CheckItemLabel = ({ text }) => (
  <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_BODY, lineHeight: 1.4 }}>
    {text}
  </Typography>
);

/** Checklist used by both Communication Preferences and Confirmation Settings. */
function CheckList({ items, isEditMode, onToggle }) {
  return (
    <Stack spacing={isEditMode ? 0.5 : 1.25}>
      {items.map((item) =>
        isEditMode ? (
          <FormControlLabel
            key={item.field}
            control={
              <Checkbox
                size="small"
                checked={item.checked}
                onChange={(e) => onToggle(item.field, e.target.checked)}
                sx={{ p: 0.5 }}
              />
            }
            label={<CheckItemLabel text={item.text} />}
          />
        ) : (
          <Box key={item.field} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            {item.checked ? (
              <CheckCircleIcon sx={{ fontSize: 16, color: COLORS.ACCENT, mt: '2px', flexShrink: 0 }} />
            ) : (
              <UncheckedIcon sx={{ fontSize: 16, color: COLORS.TEXT_MUTED, mt: '2px', flexShrink: 0 }} />
            )}
            <CheckItemLabel text={item.text} />
          </Box>
        )
      )}
    </Stack>
  );
}

/** Orange/green/red status pill for Assignment & Release answers. */
function AnswerPill({ value }) {
  const normalized = (value || '').toLowerCase();
  const tone =
    normalized === 'yes'
      ? { label: 'YES', color: COLORS.STATUS_SUCCESS, bg: 'rgba(22, 163, 74, 0.10)' }
      : normalized === 'no'
      ? { label: 'NO', color: COLORS.STATUS_ERROR, bg: 'rgba(239, 68, 68, 0.10)' }
      : { label: 'NOT ANSWERED', color: COLORS.STATUS_WARNING, bg: 'rgba(234, 88, 12, 0.10)' };

  return (
    <Chip
      label={tone.label}
      size="small"
      sx={{
        fontFamily: 'Inter',
        fontWeight: fontWeight.semibold,
        fontSize: '9px',
        letterSpacing: '0.3px',
        height: 20,
        backgroundColor: tone.bg,
        color: tone.color,
      }}
    />
  );
}

/** Empty-state box used by Credit Card / Bank Account cards. */
function EmptyStateBox({ icon: EmptyIcon, text }) {
  return (
    <Box
      sx={{
        border: `1.2px dashed ${COLORS.BORDER}`,
        borderRadius: 2,
        py: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.75,
      }}
    >
      {EmptyIcon && <EmptyIcon sx={{ fontSize: 26, color: COLORS.TEXT_MUTED }} />}
      <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_MUTED }}>
        {text}
      </Typography>
    </Box>
  );
}

// ── Communication Preferences ───────────────────────────────────────────────

export function CommunicationPreferencesCard({ patient, isEditMode, onPatientDataChange }) {
  const items = [
    { text: 'Contact me on the phone numbers provided', field: 'communicationContactByPhone' },
    { text: 'Leave voicemail at home', field: 'communicationLeaveVoicemailAtHome' },
    { text: 'I agree that the dental practice may communicate with me electronically at the email address I provided.', field: 'communicationAgreeElectronicCommunications' },
    { text: 'By opting in, I agree to receive SMS messages from the dental office regarding appointment reminders.', field: 'communicationAgreeSmsMessages' },
  ].map((item) => ({ ...item, checked: !!patient?.customFields?.[item.field] }));

  const handleToggle = (field, checked) => {
    onPatientDataChange({ ...patient, customFields: { ...patient?.customFields, [field]: checked } });
  };

  return (
    <SectionCard icon={CommunicationIcon} title="Communication Preferences">
      <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_MUTED, fontStyle: 'italic', mb: 1.5 }}>
        You can contact the patient via the following:
      </Typography>
      <CheckList items={items} isEditMode={isEditMode} onToggle={handleToggle} />
    </SectionCard>
  );
}

// ── Referring ────────────────────────────────────────────────────────────

export function ReferringCard({ patient }) {
  const stripPatientId = (value) => (value ? value.replace(/\s*\(PAT\d+\)/, '').trim() : value);
  return (
    <SectionCard icon={ReferringIcon} title="Referring">
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <InlineFieldRow label="Referring Sources" value={patient?.referralSource || 'None'} InputProps={{ readOnly: true }} />
        <InlineFieldRow
          label="Referring Patient"
          value={stripPatientId(patient?.customFields?.referringPatient) || 'None'}
          InputProps={{ readOnly: true }}
        />
      </Box>
    </SectionCard>
  );
}

// ── Confirmation Settings ───────────────────────────────────────────────────

export function ConfirmationSettingsCard({ patient, isEditMode, onPatientDataChange }) {
  const items = [
    { text: 'Pause Schedule Gap-Fill Reminders', field: 'communicationPauseScheduleGapFillsReminders' },
    { text: 'Pause AR Automation Reminders', field: 'communicationPauseArAutomationReminders' },
    { text: 'Receive Email Campaign', field: 'communicationAgreeElectronicCommunications' },
  ].map((item) => ({ ...item, checked: !!patient?.customFields?.[item.field] }));

  const handleToggle = (field, checked) => {
    onPatientDataChange({ ...patient, customFields: { ...patient?.customFields, [field]: checked } });
  };

  return (
    <SectionCard icon={ConfirmationIcon} title="Confirmation Settings">
      <CheckList items={items} isEditMode={isEditMode} onToggle={handleToggle} />
    </SectionCard>
  );
}

// ── Assignment & Release ────────────────────────────────────────────────────

export function AssignmentReleaseCard({ patient, isEditMode, onPatientDataChange }) {
  const fields = [
    { label: 'Assignment & Release', field: 'assignmentRelease' },
    { label: 'Photography Release', field: 'photographyRelease' },
    { label: 'Social Media Release', field: 'socialMediaRelease' },
    { label: 'AI Release', field: 'aiRelease' },
  ];

  const handleChange = (field, value) => {
    onPatientDataChange({ ...patient, customFields: { ...patient?.customFields, [field]: value } });
  };

  return (
    <SectionCard icon={AssignmentIcon} title="Assignment & Release">
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        {fields.map((item) => {
          const value = patient?.customFields?.[item.field] || '';
          return (
            <Box key={item.field}>
              <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>
                {item.label}
              </Typography>
              {isEditMode ? (
                <TextField
                  select
                  size="small"
                  fullWidth
                  value={value || 'not_answered'}
                  onChange={(e) => handleChange(item.field, e.target.value === 'not_answered' ? '' : e.target.value)}
                  SelectProps={{ MenuProps: roundedSelectMenuProps }}
                  sx={{ '& .MuiInputBase-root': { fontSize: fontSize.base } }}
                >
                  <MenuItem value="not_answered">Not answered</MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </TextField>
              ) : (
                <AnswerPill value={value} />
              )}
            </Box>
          );
        })}
      </Box>
    </SectionCard>
  );
}

// ── Credit Card / Bank Account ──────────────────────────────────────────────

function CreditCardCard({ patient }) {
  const info = patient?.customFields?.creditCardInfo;
  return (
    <SectionCard
      icon={CreditCardIcon}
      title="Credit Card"
      action={
        <Button size="small" startIcon={<AddIcon />} sx={{ textTransform: 'none', fontFamily: 'Inter', fontWeight: fontWeight.semibold, fontSize: fontSize.base, color: COLORS.ACCENT }}>
          Add card
        </Button>
      }
    >
      {info ? (
        <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>{info}</Typography>
      ) : (
        <EmptyStateBox icon={CreditCardIcon} text="No cards registered" />
      )}
    </SectionCard>
  );
}

function BankAccountCard({ patient }) {
  const info = patient?.customFields?.bankAccountInfo;
  return (
    <SectionCard
      icon={BankIcon}
      title="Bank Account"
      action={
        <Button size="small" startIcon={<AddIcon />} sx={{ textTransform: 'none', fontFamily: 'Inter', fontWeight: fontWeight.semibold, fontSize: fontSize.base, color: COLORS.ACCENT }}>
          Add
        </Button>
      }
    >
      {info ? (
        <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>{info}</Typography>
      ) : (
        <EmptyStateBox icon={BankIcon} text="No account on file" />
      )}
    </SectionCard>
  );
}

// ── Release Information ─────────────────────────────────────────────────────

function ReleaseInformationCard({ patient, isEditMode, onPatientDataChange }) {
  const options = [
    { label: 'Spouse / Common-law partner', field: 'releaseSpouse' },
    { label: 'Children', field: 'releaseChildren' },
    { label: 'Parents', field: 'releaseParents' },
  ];

  const handleToggle = (field) => {
    if (!isEditMode) return;
    onPatientDataChange({ ...patient, customFields: { ...patient?.customFields, [field]: !patient?.customFields?.[field] } });
  };

  return (
    <SectionCard icon={ReleaseIcon} title="Release Information">
      <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, mb: 1 }}>
        Can discuss information with:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
        {options.map((opt) => {
          const active = !!patient?.customFields?.[opt.field];
          return (
            <Chip
              key={opt.field}
              label={opt.label}
              onClick={isEditMode ? () => handleToggle(opt.field) : undefined}
              sx={{
                fontFamily: 'Inter',
                fontSize: fontSize.base,
                fontWeight: fontWeight.medium,
                height: 28,
                backgroundColor: active ? COLORS.ACCENT_BG : 'transparent',
                color: active ? COLORS.ACCENT : COLORS.TEXT_MUTED,
                border: `1px solid ${active ? COLORS.ACCENT : COLORS.BORDER}`,
                cursor: isEditMode ? 'pointer' : 'default',
              }}
            />
          );
        })}
      </Box>
      <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}>
        Other: {patient?.customFields?.releaseOther || 'None'}
      </Typography>
    </SectionCard>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────

/**
 * Preferences area — a set of independent SectionCards laid out in rows,
 * matching the target design (each preference topic is its own card rather
 * than a subsection inside one big "Preferences" card).
 *
 * Communication Preferences, Referring, Confirmation Settings, and
 * Assignment & Release moved out of this full-width area into the Col 1 /
 * Col 3 body columns (see PatientDetailOverview) to close the void those
 * columns left next to the much taller Contact Information column.
 */
export default function PatientPreferencesGrid({ patient, isEditMode = false, onPatientDataChange }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
      <CreditCardCard patient={patient} />
      <BankAccountCard patient={patient} />
      <ReleaseInformationCard patient={patient} isEditMode={isEditMode} onPatientDataChange={onPatientDataChange} />
    </Box>
  );
}
