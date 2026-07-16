import { useState, useEffect } from 'react';
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
  Autocomplete,
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
import CardThumbnail from './CardThumbnail';
import AddCreditCardModal from './AddCreditCardModal';
import BankAccountThumbnail from './BankAccountThumbnail';
import AddBankAccountModal from './AddBankAccountModal';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';
import { roundedSelectMenuProps, roundedAutocompletePaperSx, standardFieldSx } from '../../constants/styles';
import { usePatient, usePatients } from '../../hooks/redux/usePatient';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { patientService } from '../../services/patient.service';

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
  const prefs = Array.isArray(patient?.communicationPreference) 
    ? patient.communicationPreference 
    : (typeof patient?.communicationPreference === 'string' ? [patient.communicationPreference] : []);

  const items = [
    { text: 'Contact me on the phone numbers provided', field: 'phone' },
    { text: 'Leave voicemail at home', field: 'voicemail' },
    { text: 'I agree that the dental practice may communicate with me electronically at the email address I provided.', field: 'email' },
    { text: 'By opting in, I agree to receive SMS messages from the dental office regarding appointment reminders.', field: 'sms' },
  ].map((item) => ({ ...item, checked: prefs.includes(item.field) }));

  const handleToggle = (field, checked) => {
    let newPrefs = [...prefs];
    if (checked && !newPrefs.includes(field)) {
      newPrefs.push(field);
    } else if (!checked) {
      newPrefs = newPrefs.filter((p) => p !== field);
    }

    const newCustomFields = { ...patient?.customFields };
    delete newCustomFields.communicationContactByPhone;
    delete newCustomFields.communicationLeaveVoicemailAtHome;
    delete newCustomFields.communicationAgreeElectronicCommunications;
    delete newCustomFields.communicationAgreeSmsMessages;

    onPatientDataChange({ 
      ...patient, 
      communicationPreference: newPrefs,
      customFields: newCustomFields
    });
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

const REFERRING_SOURCE_OPTIONS = ["Google", "Website", "Walk In", "Social Media", "Existing Patient", "Insurance Directory", "Provider Referral"];

const patientLabel = (p) => {
  if (!p) return "";
  const name = `${p.firstName || ""} ${p.lastName || ""}`.trim();
  return name ? `${name} (PAT${p.id})` : `(PAT${p.id})`;
};

export function ReferringCard({ patient, isEditMode, onPatientDataChange }) {
  const stripPatientId = (value) => (value ? value.replace(/\s*\(PAT\d+\)/, '').trim() : value);
  const isReferringPatientEnabled = patient?.referralSource === "Walk In" || patient?.referralSource === "Existing Patient";

  const [patients, setPatients] = useState([]);
  const [patientSearchText, setPatientSearchText] = useState("");

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(async () => {
      if (!isEditMode || !isReferringPatientEnabled) return;
      try {
        const result = await patientService.getAllPatients(1, 20, patientSearchText, "active");
        if (!isMounted) return;
        setPatients(result?.patients || result?.items || []);
      } catch {
        if (!isMounted) return;
        setPatients([]);
      }
    }, 300);
    return () => { isMounted = false; clearTimeout(timer); };
  }, [patientSearchText, isEditMode, isReferringPatientEnabled]);

  const handleSourceChange = (e) => {
    onPatientDataChange({ ...patient, referralSource: e.target.value });
  };

  const handlePatientChange = (e, newValue) => {
    const val = typeof newValue === 'string' ? newValue : patientLabel(newValue);
    onPatientDataChange({ ...patient, customFields: { ...patient?.customFields, referringPatient: val } });
  };

  return (
    <SectionCard icon={ReferringIcon} title="Referring">
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <InlineFieldRow 
          label="Referring Sources" 
          value={patient?.referralSource || 'None'} 
          input={isEditMode ? (
            <TextField
              select
              variant="outlined"
              size="small"
              fullWidth
              value={patient?.referralSource || ''}
              onChange={handleSourceChange}
              SelectProps={{ MenuProps: roundedSelectMenuProps }}
              sx={standardFieldSx}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {REFERRING_SOURCE_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </TextField>
          ) : undefined}
          InputProps={{ readOnly: !isEditMode }} 
        />
        
        {(!isEditMode && patient?.customFields?.referringPatient) || isReferringPatientEnabled ? (
          <InlineFieldRow
            label="Referring Patient"
            value={stripPatientId(patient?.customFields?.referringPatient) || 'None'}
            input={isEditMode ? (
              <Autocomplete
                freeSolo
                options={patients}
                getOptionLabel={(opt) => typeof opt === "string" ? opt : patientLabel(opt)}
                value={patient?.customFields?.referringPatient || ''}
                onChange={handlePatientChange}
                onInputChange={(e, newInputValue) => {
                  setPatientSearchText(newInputValue);
                }}
                slotProps={{ paper: { sx: roundedAutocompletePaperSx } }}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" size="small" placeholder="Search patient..." sx={standardFieldSx} />
                )}
              />
            ) : undefined}
            InputProps={{ readOnly: !isEditMode }}
          />
        ) : null}
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
    // Also remove from customFields to prevent duplicate data payload
    const newCustomFields = { ...patient?.customFields };
    delete newCustomFields[field];
    
    onPatientDataChange({ 
      ...patient, 
      customFields: newCustomFields,
      assignmentAndRelease: { 
        ...patient?.assignmentAndRelease, 
        [field]: value 
      } 
    });
  };

  return (
    <SectionCard icon={AssignmentIcon} title="Assignment & Release">
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        {fields.map((item) => {
          // Read from assignmentAndRelease, fallback to customFields for backwards compatibility if needed
          const value = patient?.assignmentAndRelease?.[item.field] ?? patient?.customFields?.[item.field] ?? '';
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

function CreditCard({ patient, isEditMode, onPatientDataChange }) {
  const [modalOpen, setModalOpen] = useState(false);
  const cards = patient?.customFields?.creditCards || [];

  const handleSaveCard = (tokenized, isDefault) => {
    // Only one card can be default — clear the flag on the rest when a new default is set.
    const updatedCards = [
      ...(isDefault ? cards.map((c) => ({ ...c, isDefault: false })) : cards),
      { ...tokenized, isDefault },
    ];
    onPatientDataChange({ ...patient, customFields: { ...patient?.customFields, creditCards: updatedCards } });
  };

  const handleRemoveCard = (indexToRemove) => {
    const removedCard = cards[indexToRemove];
    let updatedCards = cards.filter((_, idx) => idx !== indexToRemove);

    // If the removed card was the default and at least one card remains, promote
    // one of the others to default so there's never >1 card left with no default.
    if (removedCard?.isDefault && updatedCards.length > 0 && !updatedCards.some((c) => c.isDefault)) {
      updatedCards = updatedCards.map((c, idx) => (idx === 0 ? { ...c, isDefault: true } : c));
    }

    onPatientDataChange({ ...patient, customFields: { ...patient?.customFields, creditCards: updatedCards } });
  };

  return (
    <SectionCard
      icon={CreditCardIcon}
      title="Credit Card"
      action={
        // Gated on isEditMode: saved cards only persist via the page-level Save button
        // (onPatientDataChange stages the change like every other field on this page),
        // so adding a card outside edit mode would silently do nothing visible.
        isEditMode && (
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
            sx={{ textTransform: 'none', fontFamily: 'Inter', fontWeight: fontWeight.semibold, fontSize: fontSize.base, color: COLORS.ACCENT }}
          >
            Add card
          </Button>
        )
      }
    >
      {cards.length > 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            // Scrolls instead of growing the card once there are more than 2 entries.
            ...(cards.length > 2 && { maxHeight: 152, overflowY: 'auto', pr: 0.5 }),
          }}
        >
          {cards.map((card, idx) => (
            <CardThumbnail
              key={card.token || idx}
              card={card}
              isDefault={!!card.isDefault}
              isEditMode={isEditMode}
              onRemove={() => handleRemoveCard(idx)}
            />
          ))}
        </Box>
      ) : (
        <EmptyStateBox icon={CreditCardIcon} text="No cards registered" />
      )}

      <AddCreditCardModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCard}
        hasExistingCards={cards.length > 0}
      />
    </SectionCard>
  );
}

function BankAccountCard({ patient, isEditMode, onPatientDataChange }) {
  const [modalOpen, setModalOpen] = useState(false);
  const accounts = patient?.customFields?.bankAccounts || [];

  const handleSaveAccount = (tokenized, isDefault) => {
    // Only one account can be default — clear the flag on the rest when a new default is set.
    const updatedAccounts = [
      ...(isDefault ? accounts.map((a) => ({ ...a, isDefault: false })) : accounts),
      { ...tokenized, isDefault },
    ];
    onPatientDataChange({ ...patient, customFields: { ...patient?.customFields, bankAccounts: updatedAccounts } });
  };

  const handleRemoveAccount = (indexToRemove) => {
    const removedAccount = accounts[indexToRemove];
    let updatedAccounts = accounts.filter((_, idx) => idx !== indexToRemove);

    // If the removed account was the default and at least one account remains, promote
    // one of the others to default so there's never >1 account left with no default.
    if (removedAccount?.isDefault && updatedAccounts.length > 0 && !updatedAccounts.some((a) => a.isDefault)) {
      updatedAccounts = updatedAccounts.map((a, idx) => (idx === 0 ? { ...a, isDefault: true } : a));
    }

    onPatientDataChange({ ...patient, customFields: { ...patient?.customFields, bankAccounts: updatedAccounts } });
  };

  return (
    <SectionCard
      icon={BankIcon}
      title="Bank Account"
      action={
        // Gated on isEditMode: saved accounts only persist via the page-level Save
        // button (onPatientDataChange stages the change like every other field on
        // this page), so adding an account outside edit mode would silently do nothing.
        isEditMode && (
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
            sx={{ textTransform: 'none', fontFamily: 'Inter', fontWeight: fontWeight.semibold, fontSize: fontSize.base, color: COLORS.ACCENT }}
          >
            Add Account
          </Button>
        )
      }
    >
      {accounts.length > 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            // Scrolls instead of growing the card once there are more than 2 entries.
            ...(accounts.length > 2 && { maxHeight: 152, overflowY: 'auto', pr: 0.5 }),
          }}
        >
          {accounts.map((account, idx) => (
            <BankAccountThumbnail
              key={account.token || idx}
              account={account}
              isDefault={!!account.isDefault}
              isEditMode={isEditMode}
              onRemove={() => handleRemoveAccount(idx)}
            />
          ))}
        </Box>
      ) : (
        <EmptyStateBox icon={BankIcon} text="No account on file" />
      )}

      <AddBankAccountModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveAccount}
        hasExistingAccounts={accounts.length > 0}
      />
    </SectionCard>
  );
}

// ── Release Information ─────────────────────────────────────────────────────

/**
 * Who the practice is legally allowed to discuss this patient's health info with
 * (a HIPAA disclosure-authorization record) — pills are multi-select toggles, not
 * navigation, and every change here auto-saves immediately rather than staging
 * behind the page's Edit/Save flow like the rest of this page's fields, since
 * each one is an independent boolean that should never sit as an unsaved draft.
 */
function ReleaseInformationCard({ patient, isEditMode = false, onPatientDataChange }) {
  const options = [
    { label: 'Spouse / Common-law partner', field: 'releaseSpouse' },
    { label: 'Children', field: 'releaseChildren' },
    { label: 'Parents', field: 'releaseParents' },
  ];

  const patientId = patient?._id || patient?.id;
  const { updatePatient } = usePatient();
  const { showSnackbar } = useSnackbar();
  const [savingField, setSavingField] = useState(null);
  const [otherText, setOtherText] = useState(patient?.customFields?.releaseOther || '');

  useEffect(() => {
    setOtherText(patient?.customFields?.releaseOther || '');
  }, [patient?.customFields?.releaseOther]);

  const persist = async (updatedCustomFields, fieldKey) => {
    if (!patientId) return;
    setSavingField(fieldKey);
    try {
      await updatePatient(patientId, { customFields: updatedCustomFields }).unwrap();
      onPatientDataChange?.({ ...patient, customFields: updatedCustomFields });
    } catch (err) {
      showSnackbar(typeof err === 'string' ? err : err?.message || 'Failed to save', 'error');
    } finally {
      setSavingField(null);
    }
  };

  const handleToggle = (field) => {
    persist({ ...patient?.customFields, [field]: !patient?.customFields?.[field] }, field);
  };

  const handleOtherBlur = () => {
    const current = patient?.customFields?.releaseOther || '';
    if (otherText === current) return;
    persist({ ...patient?.customFields, releaseOther: otherText }, 'releaseOther');
  };

  return (
    <SectionCard icon={ReleaseIcon} title="Release Information">
      <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase', letterSpacing: '0.3px', mb: 1 }}>
        Can discuss information with
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {options.map((opt) => {
          const active = !!patient?.customFields?.[opt.field];
          const isSaving = savingField === opt.field;
          return (
            <Chip
              key={opt.field}
              label={opt.label}
              icon={active ? <CheckCircleIcon sx={{ fontSize: '14px', color: COLORS.ACCENT }} /> : undefined}
              onClick={() => handleToggle(opt.field)}
              disabled={isSaving}
              sx={{
                fontFamily: 'Inter',
                fontSize: fontSize.base,
                fontWeight: fontWeight.medium,
                height: 28,
                backgroundColor: active ? COLORS.ACCENT_BG : 'transparent',
                color: active ? COLORS.ACCENT : COLORS.TEXT_MUTED,
                border: `1px solid ${active ? COLORS.ACCENT : COLORS.BORDER}`,
                cursor: 'pointer',
                opacity: isSaving ? 0.6 : 1,
                '&:hover': { backgroundColor: active ? COLORS.ACCENT_BG : COLORS.SURFACE_HOVER },
                '&.Mui-disabled': { opacity: 0.6 },
              }}
            />
          );
        })}
        {otherText && !isEditMode && (
          <Chip
            label={otherText}
            icon={<CheckCircleIcon sx={{ fontSize: '14px', color: COLORS.ACCENT }} />}
            sx={{
              fontFamily: 'Inter',
              fontSize: fontSize.base,
              fontWeight: fontWeight.medium,
              height: 28,
              backgroundColor: COLORS.ACCENT_BG,
              color: COLORS.ACCENT,
              border: `1px solid ${COLORS.ACCENT}`,
            }}
          />
        )}
      </Box>

      {isEditMode && (
        <>
          <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase', letterSpacing: '0.3px', mb: 0.75 }}>
            Other
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Add another authorized contact"
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            onBlur={handleOtherBlur}
            disabled={savingField === 'releaseOther'}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: radius.md, fontSize: fontSize.md } }}
          />
        </>
      )}
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
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '32fr 28fr 30fr' }, gap: 2, mt: 2 }}>
      <CreditCard patient={patient} isEditMode={isEditMode} onPatientDataChange={onPatientDataChange} />
      <BankAccountCard patient={patient} isEditMode={isEditMode} onPatientDataChange={onPatientDataChange} />
      <ReleaseInformationCard patient={patient} isEditMode={isEditMode} onPatientDataChange={onPatientDataChange} />
    </Box>
  );
}
