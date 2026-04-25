import { useState, useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Switch,
  TextField,
  Divider,
  InputAdornment,
  Tooltip,
  RadioGroup,
  Radio,
  MenuItem,
  Select,
  FormControl,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  InfoOutlined as InfoOutlinedIcon,
} from '@mui/icons-material';
import { practiceInfoService } from '../../services/practice-info.service';

// ─── Section anchor IDs ────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'ai',                       label: 'AI' },
  { id: 'aging-report',             label: 'Aging Report' },
  { id: 'automated-workflows',      label: 'Automated Workflows' },
  { id: 'claim-management',         label: 'Claim Management' },
  { id: 'communication',            label: 'Communication' },
  { id: 'exam-page-items',          label: 'Exam Page Items' },
  { id: 'general',                  label: 'General' },
  { id: 'imaging-settings',         label: 'Imaging Settings' },
  { id: 'insurance-nea-vyne',       label: 'Insurance (NEA/Vyne)' },
  { id: 'menu-items',               label: 'Menu Items' },
  { id: 'patient-confidential-info', label: 'Patient Confidential Info' },
  { id: 'reports',                   label: 'Reports' },
  { id: 'templates',                 label: 'Templates (Emails/Texts)' },
  { id: 'text-editors',              label: 'Text Editors' },
  { id: 'time-clock',                label: 'Time Clock' },
  { id: 'treatment-plan-page',       label: 'Treatment Plan Page' },
  { id: 'treatment-printout-form',   label: 'Treatment Printout Form' },
];

// ─── Reusable atoms ────────────────────────────────────────────────────────────

const SectionHeader = ({ id, label }) => (
  <Box id={id} sx={{ pt: 1, pb: 0.5 }}>
    <Typography variant="body1" fontWeight={500} color="text.secondary" sx={{ mb: 0.75 }}>
      {label}
    </Typography>
    <Divider />
  </Box>
);

const InfoIcon = () => (
  <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled', ml: 0.5, verticalAlign: 'middle' }} />
);

/** Checkbox row — controlled */
const SettingCheckbox = ({ label, checked, onChange, info = false }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          checked={!!checked}
          onChange={(e) => onChange(e.target.checked)}
          sx={{ py: 0.5 }}
        />
      }
      label={
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: checked ? 'primary.main' : 'text.primary' }}>
            {label}
          </Typography>
          {info && (
            <Tooltip title="More info" placement="right">
              <span><InfoIcon /></span>
            </Tooltip>
          )}
        </Box>
      }
      sx={{ display: 'flex', ml: 0, my: 0.25 }}
    />
  );
};

/** Toggle row with inline number input — controlled */
const SettingToggle = ({ label, on, onToggle, value, onValueChange }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 0.5 }}>
      <Switch size="small" checked={!!on} onChange={(e) => onToggle(e.target.checked)} color="success" />
      <Typography variant="body2" sx={{ flex: 1 }}>{label}</Typography>
      {value !== undefined && (
        <TextField
          variant="standard"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          inputProps={{ style: { width: 28, textAlign: 'center', fontSize: '0.85rem' } }}
          sx={{ width: 36 }}
        />
      )}
    </Box>
  );
};

/** Inline label + number field row (blue label) — controlled */
const SettingInlineNumber = ({ label, value, onChange, info = false, suffix = "" }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 0.75 }}>
      <Typography variant="body2" color="primary.main" sx={{ flex: 1 }}>{label}</Typography>
      <TextField
        variant="standard"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputProps={{ style: { width: 36, textAlign: 'center', fontSize: '0.85rem' } }}
        sx={{ width: 44 }}
      />
      {suffix && <Typography variant="body2" color="text.secondary">{suffix}</Typography>}
      {info && <Tooltip title="More info" placement="right"><span><InfoIcon /></span></Tooltip>}
    </Box>
  );
};

/** Inline label + select dropdown — controlled */
const SettingInlineSelect = ({ label, options, value, onChange, info = false }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 0.75 }}>
      <Typography variant="body2" color="primary.main">{label}</Typography>
      <FormControl variant="standard" sx={{ minWidth: 200 }}>
        <Select value={value || ''} onChange={(e) => onChange(e.target.value)} sx={{ fontSize: '0.85rem' }}>
          {options.map((o) => (
            <MenuItem key={o.value} value={o.value} sx={{ fontSize: '0.85rem' }}>{o.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {info && <Tooltip title="More info" placement="right"><span><InfoIcon /></span></Tooltip>}
    </Box>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const PracticeSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [practiceId, setPracticeId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const contentRef = useRef(null);

  const [settings, setSettings] = useState({
    ai: { audioDenoising: true, transcriptionValidation: true },
    automatedWorkflows: {
      consentFormAutomation: true, consentFormDays: 3,
      medicalHistoryAutomation: true, medicalHistoryDays: 5,
      unsignedConsentReminder: true, unsignedConsentDays: 1
    },
    claimManagement: {
      allowCustomCodes: false, disallowDeactivatingPolicy: false,
      enableZeroDollarProcedures: true, enableAutoAttachment: true,
      hideSubscriberSignature: false, includePearlAnnotations: true,
      onlyDisplayTotalOnLastPage: false, printEOBCopy: true
    },
    communication: {
      addCalendarInvitation: true, includeConfirmationsInPopup: false,
      includeUnreadOnly: true, showPhoneCallPopup: false, callerIdPopupDuration: 5
    },
    examPageItems: {
      createProgressNoteFromAI: false, generateProgressNotesForNewExams: true,
      showAirwayExam: true, showPediatricClinicalExam: false, showDentofacialExam: true,
      showHeadNeckExam: true, showMorphologicalExam: true, showPeriodontalExam: true,
      showRadiographicExam: true, showTMJExam: true, showToothStructureExam: true,
      googleSpeechToText: 'model2', airwayExamType: 'fairest'
    },
    general: {
      hidePearlAd: false, showDentistsOnHygienistList: false, showOutboundCalls: false,
      showPatientIdNextToName: false, useInsuranceNewDesign: true,
      outdatedMedicalHistoryMonths: 11, sessionExpirationMinutes: 60, customDateFormat: 'MM/DD/YYYY'
    },
    insuranceNeaVyne: {
      allowQuadsAsTeeth: true, allowSubmissionNoAttachments: true,
      allowSecondaryNoPrimaryPayment: false, allowSecondaryNoPrimaryRemittance: false,
      autoApplyPaymentERA: false, displayEligibilityVyneHtml: true,
      useTesiaPayerRequirements: true, eligibilityValidityDuration: 14
    },
    menuItems: {
      showAdjunctiveTherapy: true, showDentalHistory: true, showDiagnosticOpinion: true,
      showETrans: false, showHomeCare: true, showMedicalHistory: true,
      showPedoDentalHistory: true, showPedoMedicalHistory: true,
      showResponsesForDeletedQuestionnaires: false, showRiskAssessment: true,
      showScans: true, showShowcase: true
    },
    patientConfidentialInfo: {
      additionalInfoPedo: true, emergencyContact: true, homePhone: true,
      maritalStatus: true, releaseInformation: true, spouseInformation: true,
      title: true, workPhone: true
    },
    reports: {
      computeProductionPerHour: false, viewRowNumber: false, productionReportDay: '5'
    },
    templates: { addDefaultSmsFooter: true },
    textEditors: { fontSize: '10', fontFamily: 'lato', fontColor: '#000000' },
    timeClock: {
      allowEditRecords: false, payPeriod: 'not-set', autoClockOutHour: '21', autoClockOutMin: '00'
    },
    treatmentPlanPage: {
      collapseRecarePlan: true, showDiscountAmount: true, showInsurancePortion: true,
      showInsuranceWriteOff: false, showMaxAllowed: false, showOfficeFee: true
    }
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await practiceInfoService.getCurrentPracticeInfo();
        if (data) {
          setPracticeId(data._id || data.id);
          if (data.practiceSettings && Object.keys(data.practiceSettings).length > 0) {
            setSettings(prev => ({
              ...prev,
              ...data.practiceSettings
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
        setError('Failed to load settings.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    if (!practiceId) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await practiceInfoService.updatePracticeSettings(practiceId, settings);
      setSuccess('Settings saved successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 3, position: 'relative' }}>
      {/* ── Main content ── */}
      <Box ref={contentRef} sx={{ flex: 1, minWidth: 0 }}>

        {/* Breadcrumb + Search */}
        <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              variant="caption"
              component={RouterLink}
              to="/admin/practice-setup"
              sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Practice Setup
            </Typography>
            <Typography variant="caption" color="text.secondary">{'>'}</Typography>
            <Typography variant="caption" color="text.secondary">Practice Settings</Typography>
          </Box>
          <TextField
            size="small"
            placeholder="Search Settings"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 220 }}
          />
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* ── AI ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="ai" label="AI" />
          <Box sx={{ mt: 1.5, pl: 0.5 }}>
            <SettingCheckbox 
              label="Enable Audio Denoising" 
              checked={settings.ai.audioDenoising}
              onChange={(v) => updateSection('ai', 'audioDenoising', v)}
              info 
            />
            <SettingCheckbox 
              label="Enable Transcription Validation" 
              checked={settings.ai.transcriptionValidation}
              onChange={(v) => updateSection('ai', 'transcriptionValidation', v)}
              info 
            />
          </Box>
        </Box>

        {/* ── Aging Report ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="aging-report" label="Aging report" />
        </Box>

        {/* ── Automated Workflows ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="automated-workflows" label="Automated Workflows" />
          <Box sx={{ mt: 1.5, pl: 0.5 }}>
            <SettingToggle
              label="Automate Consent Form Creation and Sharing X Days Before Appointment"
              on={settings.automatedWorkflows.consentFormAutomation}
              onToggle={(v) => updateSection('automatedWorkflows', 'consentFormAutomation', v)}
              value={settings.automatedWorkflows.consentFormDays}
              onValueChange={(v) => updateSection('automatedWorkflows', 'consentFormDays', v)}
            />
            <SettingToggle
              label="Automatically request medical history updates X days prior to appointment"
              on={settings.automatedWorkflows.medicalHistoryAutomation}
              onToggle={(v) => updateSection('automatedWorkflows', 'medicalHistoryAutomation', v)}
              value={settings.automatedWorkflows.medicalHistoryDays}
              onValueChange={(v) => updateSection('automatedWorkflows', 'medicalHistoryDays', v)}
            />
            <SettingToggle
              label="Send Unsigned Consent Forms Reminder X Days Before Appointment"
              on={settings.automatedWorkflows.unsignedConsentReminder}
              onToggle={(v) => updateSection('automatedWorkflows', 'unsignedConsentReminder', v)}
              value={settings.automatedWorkflows.unsignedConsentDays}
              onValueChange={(v) => updateSection('automatedWorkflows', 'unsignedConsentDays', v)}
            />
          </Box>
        </Box>

        {/* ── Claim Management ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="claim-management" label="Claim Management" />
          <Box sx={{ mt: 1.5, pl: 0.5 }}>
            <SettingCheckbox label="Allow Custom Codes In Claims" checked={settings.claimManagement.allowCustomCodes} onChange={(v) => updateSection('claimManagement', 'allowCustomCodes', v)} />
            <SettingCheckbox label="Disallow Deactivating Patient Policy if it has unclosed Claims." checked={settings.claimManagement.disallowDeactivatingPolicy} onChange={(v) => updateSection('claimManagement', 'disallowDeactivatingPolicy', v)} info />
            <SettingCheckbox label="Enable $0 Procedures in Claim Submission" checked={settings.claimManagement.enableZeroDollarProcedures} onChange={(v) => updateSection('claimManagement', 'enableZeroDollarProcedures', v)} />
            <SettingCheckbox label="Enable claims auto-attachment" checked={settings.claimManagement.enableAutoAttachment} onChange={(v) => updateSection('claimManagement', 'enableAutoAttachment', v)} />
            <SettingCheckbox label="Hide Subscriber Signature From Manual Claim" checked={settings.claimManagement.hideSubscriberSignature} onChange={(v) => updateSection('claimManagement', 'hideSubscriberSignature', v)} />
            <SettingCheckbox label="Include Pearl Annotations In Claim Attachments" checked={settings.claimManagement.includePearlAnnotations} onChange={(v) => updateSection('claimManagement', 'includePearlAnnotations', v)} />
            <SettingCheckbox label="Only display the total fee on the last page for multi-page claims." checked={settings.claimManagement.onlyDisplayTotalOnLastPage} onChange={(v) => updateSection('claimManagement', 'onlyDisplayTotalOnLastPage', v)} />
            <SettingCheckbox label="Print a Doctor & Patient copy for EOB" checked={settings.claimManagement.printEOBCopy} onChange={(v) => updateSection('claimManagement', 'printEOBCopy', v)} info />
          </Box>
        </Box>

        {/* ── Communication ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="communication" label="Communication" />
          <Box sx={{ mt: 1.5, pl: 0.5 }}>
            <SettingCheckbox label="Add calendar invitation to appointment reminders" checked={settings.communication.addCalendarInvitation} onChange={(v) => updateSection('communication', 'addCalendarInvitation', v)} />
            <SettingCheckbox label="Include confirmations messages in the patient notifications pop-up" checked={settings.communication.includeConfirmationsInPopup} onChange={(v) => updateSection('communication', 'includeConfirmationsInPopup', v)} />
            <SettingCheckbox label="Include unread messages only in the patient notifications pop-up" checked={settings.communication.includeUnreadOnly} onChange={(v) => updateSection('communication', 'includeUnreadOnly', v)} />
            <SettingCheckbox label="Show phone call pop-up when having unread confirmation messages" checked={settings.communication.showPhoneCallPopup} onChange={(v) => updateSection('communication', 'showPhoneCallPopup', v)} />
            <SettingInlineNumber label="Hide the Caller Id Popup After # of seconds" value={settings.communication.callerIdPopupDuration} onChange={(v) => updateSection('communication', 'callerIdPopupDuration', v)} info />
          </Box>
        </Box>

        {/* ── Exam Page Items ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="exam-page-items" label="Exam Page Items" />
          <Box sx={{ mt: 1.5, pl: 0.5 }}>
            <SettingCheckbox label="Create Progress Note From Mango AI Summary" checked={settings.examPageItems.createProgressNoteFromAI} onChange={(v) => updateSection('examPageItems', 'createProgressNoteFromAI', v)} info />
            <SettingCheckbox label="Generate progress notes for new exams without an existing progress note" checked={settings.examPageItems.generateProgressNotesForNewExams} onChange={(v) => updateSection('examPageItems', 'generateProgressNotesForNewExams', v)} />
            <SettingCheckbox label="Show Airway Exam" checked={settings.examPageItems.showAirwayExam} onChange={(v) => updateSection('examPageItems', 'showAirwayExam', v)} />
            <SettingCheckbox label="Show Clinical Exam for Pediatric Patients" checked={settings.examPageItems.showPediatricClinicalExam} onChange={(v) => updateSection('examPageItems', 'showPediatricClinicalExam', v)} />
            <SettingCheckbox label="Show Dentofacial Exam" checked={settings.examPageItems.showDentofacialExam} onChange={(v) => updateSection('examPageItems', 'showDentofacialExam', v)} />
            <SettingCheckbox label="Show Head & Neck Exam" checked={settings.examPageItems.showHeadNeckExam} onChange={(v) => updateSection('examPageItems', 'showHeadNeckExam', v)} />
            <SettingCheckbox label="Show Morphological Exam" checked={settings.examPageItems.showMorphologicalExam} onChange={(v) => updateSection('examPageItems', 'showMorphologicalExam', v)} />
            <SettingCheckbox label="Show Periodontal Exam" checked={settings.examPageItems.showPeriodontalExam} onChange={(v) => updateSection('examPageItems', 'showPeriodontalExam', v)} />
            <SettingCheckbox label="Show Radiographic Exam" checked={settings.examPageItems.showRadiographicExam} onChange={(v) => updateSection('examPageItems', 'showRadiographicExam', v)} />
            <SettingCheckbox label="Show TMJ Exam" checked={settings.examPageItems.showTMJExam} onChange={(v) => updateSection('examPageItems', 'showTMJExam', v)} />
            <SettingCheckbox label="Show Tooth Structure Exam" checked={settings.examPageItems.showToothStructureExam} onChange={(v) => updateSection('examPageItems', 'showToothStructureExam', v)} />

            <SettingInlineSelect
              label="Use Google Speech To Text"
              options={[
                { value: 'model2', label: 'Model 2' },
                { value: 'model1', label: 'Model 1' },
              ]}
              value={settings.examPageItems.googleSpeechToText}
              onChange={(v) => updateSection('examPageItems', 'googleSpeechToText', v)}
            />

            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Select which airway exam to display
              </Typography>
              <RadioGroup
                row
                value={settings.examPageItems.airwayExamType}
                onChange={(e) => updateSection('examPageItems', 'airwayExamType', e.target.value)}
              >
                <FormControlLabel
                  value="fairest"
                  control={<Radio size="small" />}
                  label={<Typography variant="body2">FAIrEST 15</Typography>}
                />
                <FormControlLabel
                  value="orofacial"
                  control={<Radio size="small" />}
                  label={<Typography variant="body2">Orofacial Airway Screener</Typography>}
                />
              </RadioGroup>
            </Box>
          </Box>
        </Box>

        {/* ── General ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="general" label="General" />
          <Box sx={{ mt: 1.5, pl: 0.5 }}>
            <SettingCheckbox label="Hide Pearl Advertisement" checked={settings.general.hidePearlAd} onChange={(v) => updateSection('general', 'hidePearlAd', v)} />
            <SettingCheckbox label="Show Dentists on Hygienist list on Patient Info Page" checked={settings.general.showDentistsOnHygienistList} onChange={(v) => updateSection('general', 'showDentistsOnHygienistList', v)} />
            <SettingCheckbox label="Show Outbound Calls" checked={settings.general.showOutboundCalls} onChange={(v) => updateSection('general', 'showOutboundCalls', v)} />
            <SettingCheckbox label="Show Patient ID next to patient name in header." checked={settings.general.showPatientIdNextToName} onChange={(v) => updateSection('general', 'showPatientIdNextToName', v)} />
            <SettingCheckbox label="Use Insurance New Design as Default" checked={settings.general.useInsuranceNewDesign} onChange={(v) => updateSection('general', 'useInsuranceNewDesign', v)} />
            <SettingInlineNumber
              label="Consider medical history outdated after X months from the last review"
              value={settings.general.outdatedMedicalHistoryMonths}
              onChange={(v) => updateSection('general', 'outdatedMedicalHistoryMonths', v)}
            />
            <SettingInlineNumber
              label="Session Expiration Duration (minutes)"
              value={settings.general.sessionExpirationMinutes}
              onChange={(v) => updateSection('general', 'sessionExpirationMinutes', v)}
              info
            />
            <SettingInlineSelect
              label="Custom Date Format"
              options={[
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
              ]}
              value={settings.general.customDateFormat}
              onChange={(v) => updateSection('general', 'customDateFormat', v)}
              info
            />
          </Box>
        </Box>

        {/* ── Imaging Settings ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="imaging-settings" label="Imaging Settings" />
        </Box>

        {/* ── Insurance (for NEA/Vyne offices) ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="insurance-nea-vyne" label="Insurance (for NEA/Vyne offices)" />
          <Box sx={{ mt: 1.5, pl: 0.5 }}>
            <SettingCheckbox label="Allow Sending Quads as Teeth for Claims" checked={settings.insuranceNeaVyne.allowQuadsAsTeeth} onChange={(v) => updateSection('insuranceNeaVyne', 'allowQuadsAsTeeth', v)} info />
            <SettingCheckbox label="Allow Submission of Claims/Preds with no Attachments" checked={settings.insuranceNeaVyne.allowSubmissionNoAttachments} onChange={(v) => updateSection('insuranceNeaVyne', 'allowSubmissionNoAttachments', v)} info />
            <SettingCheckbox label="Allow Submission of Secondary Claims without Primary Claim Insurance Payment Amount" checked={settings.insuranceNeaVyne.allowSecondaryNoPrimaryPayment} onChange={(v) => updateSection('insuranceNeaVyne', 'allowSecondaryNoPrimaryPayment', v)} info />
            <SettingCheckbox label="Allow Submission of Secondary Claims without Primary Claim Remittance Date" checked={settings.insuranceNeaVyne.allowSecondaryNoPrimaryRemittance} onChange={(v) => updateSection('insuranceNeaVyne', 'allowSecondaryNoPrimaryRemittance', v)} info />
            <SettingCheckbox label="Automatically apply payment based on ERA report (beta)" checked={settings.insuranceNeaVyne.autoApplyPaymentERA} onChange={(v) => updateSection('insuranceNeaVyne', 'autoApplyPaymentERA', v)} info />
            <SettingCheckbox label="Display Eligibility Response in Vyne HTML Format" checked={settings.insuranceNeaVyne.displayEligibilityVyneHtml} onChange={(v) => updateSection('insuranceNeaVyne', 'displayEligibilityVyneHtml', v)} info />
            <SettingCheckbox label="Use Tesia Payer Procedure Requirements" checked={settings.insuranceNeaVyne.useTesiaPayerRequirements} onChange={(v) => updateSection('insuranceNeaVyne', 'useTesiaPayerRequirements', v)} info />
            <SettingInlineNumber label="Eligibility Data-Validity Duration" value={settings.insuranceNeaVyne.eligibilityValidityDuration} onChange={(v) => updateSection('insuranceNeaVyne', 'eligibilityValidityDuration', v)} info />
          </Box>
        </Box>

        {/* ── Menu Items ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="menu-items" label="Menu Items" />
          <Box sx={{ mt: 1.5, pl: 0.5 }}>
            <SettingCheckbox label="Show Adjunctive Therapy menu item under Clinical menu" checked={settings.menuItems.showAdjunctiveTherapy} onChange={(v) => updateSection('menuItems', 'showAdjunctiveTherapy', v)} />
            <SettingCheckbox label="Show Dental History menu item under Patient menu" checked={settings.menuItems.showDentalHistory} onChange={(v) => updateSection('menuItems', 'showDentalHistory', v)} />
            <SettingCheckbox label="Show Diagnostic Opinion menu item under Clinical menu" checked={settings.menuItems.showDiagnosticOpinion} onChange={(v) => updateSection('menuItems', 'showDiagnosticOpinion', v)} />
            <SettingCheckbox label="Show ETrans menu item under Finance menu" checked={settings.menuItems.showETrans} onChange={(v) => updateSection('menuItems', 'showETrans', v)} />
            <SettingCheckbox label="Show Home Care menu item under Patient Reports menu" checked={settings.menuItems.showHomeCare} onChange={(v) => updateSection('menuItems', 'showHomeCare', v)} />
            <SettingCheckbox label="Show Medical History menu item under Patient menu" checked={settings.menuItems.showMedicalHistory} onChange={(v) => updateSection('menuItems', 'showMedicalHistory', v)} />
            <SettingCheckbox label="Show Pedo Dental History menu item under Patient menu" checked={settings.menuItems.showPedoDentalHistory} onChange={(v) => updateSection('menuItems', 'showPedoDentalHistory', v)} />
            <SettingCheckbox label="Show Pedo Medical History menu item under Patient menu" checked={settings.menuItems.showPedoMedicalHistory} onChange={(v) => updateSection('menuItems', 'showPedoMedicalHistory', v)} />
            <SettingCheckbox label="Show Responses for Deleted Questionnaires" checked={settings.menuItems.showResponsesForDeletedQuestionnaires} onChange={(v) => updateSection('menuItems', 'showResponsesForDeletedQuestionnaires', v)} />
            <SettingCheckbox label="Show Risk Assessment menu item under Patient Reports menu" checked={settings.menuItems.showRiskAssessment} onChange={(v) => updateSection('menuItems', 'showRiskAssessment', v)} />
            <SettingCheckbox label="Show Scans menu item under Ancillary Tests menu" checked={settings.menuItems.showScans} onChange={(v) => updateSection('menuItems', 'showScans', v)} />
            <SettingCheckbox label="Show Showcase menu item under Patient Reports menu" checked={settings.menuItems.showShowcase} onChange={(v) => updateSection('menuItems', 'showShowcase', v)} />
          </Box>
        </Box>

        {/* ── Patient Confidential Info ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="patient-confidential-info" label="Patient Confidential Info" />
          <Box sx={{ mt: 1.5, pl: 0.5 }}>
            <SettingCheckbox label="Additional Info (for pedo only)" checked={settings.patientConfidentialInfo.additionalInfoPedo} onChange={(v) => updateSection('patientConfidentialInfo', 'additionalInfoPedo', v)} />
            <SettingCheckbox label="Emergency Contact Information" checked={settings.patientConfidentialInfo.emergencyContact} onChange={(v) => updateSection('patientConfidentialInfo', 'emergencyContact', v)} />
            <SettingCheckbox label="Home Phone Number" checked={settings.patientConfidentialInfo.homePhone} onChange={(v) => updateSection('patientConfidentialInfo', 'homePhone', v)} />
            <SettingCheckbox label="Marital Status" checked={settings.patientConfidentialInfo.maritalStatus} onChange={(v) => updateSection('patientConfidentialInfo', 'maritalStatus', v)} />
            <SettingCheckbox label="Release Information" checked={settings.patientConfidentialInfo.releaseInformation} onChange={(v) => updateSection('patientConfidentialInfo', 'releaseInformation', v)} />
            <SettingCheckbox label="Spouse Information" checked={settings.patientConfidentialInfo.spouseInformation} onChange={(v) => updateSection('patientConfidentialInfo', 'spouseInformation', v)} />
            <SettingCheckbox label="Title" checked={settings.patientConfidentialInfo.title} onChange={(v) => updateSection('patientConfidentialInfo', 'title', v)} />
            <SettingCheckbox label="Work Phone Number" checked={settings.patientConfidentialInfo.workPhone} onChange={(v) => updateSection('patientConfidentialInfo', 'workPhone', v)} />
          </Box>
        </Box>

        {/* ── Reports ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="reports" label="Reports" />
          <Box sx={{ mt: 1.5, pl: 0.5 }}>
            <SettingCheckbox label="Compute Production Per Hour Based On Schedule" checked={settings.reports.computeProductionPerHour} onChange={(v) => updateSection('reports', 'computeProductionPerHour', v)} info />
            <SettingCheckbox label="View the row number for all reports" checked={settings.reports.viewRowNumber} onChange={(v) => updateSection('reports', 'viewRowNumber', v)} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 0.75 }}>
              <Typography variant="body2" color="primary.main" sx={{ flex: 1 }}>
                The Production &amp; Collection report will be generated at the selected business day of the month
              </Typography>
              <FormControl variant="standard" sx={{ minWidth: 60 }}>
                <Select value={settings.reports.productionReportDay} onChange={(e) => updateSection('reports', 'productionReportDay', e.target.value)} sx={{ fontSize: '0.85rem' }}>
                  {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                    <MenuItem key={n} value={String(n)} sx={{ fontSize: '0.85rem' }}>{n}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Tooltip title="More info" placement="right"><span><InfoIcon /></span></Tooltip>
            </Box>
          </Box>
        </Box>

        {/* ── Templates (Emails/Texts) ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="templates" label="Templates (Emails/Texts)" />
          <Box sx={{ mt: 1.5, pl: 0.5 }}>
            <SettingCheckbox label="Add Default Sms Footer" checked={settings.templates.addDefaultSmsFooter} onChange={(v) => updateSection('templates', 'addDefaultSmsFooter', v)} info />
          </Box>
        </Box>

        {/* ── Text Editors ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="text-editors" label="Text Editors" />
          <Box sx={{ mt: 1.5, pl: 0.5 }}>
            {/* Font size */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 0.75 }}>
              <Typography variant="body2" color="primary.main" sx={{ flex: 1 }}>
                Default Font Size for Text Editors
              </Typography>
              <TextField
                variant="standard"
                value={settings.textEditors.fontSize}
                onChange={(e) => updateSection('textEditors', 'fontSize', e.target.value)}
                inputProps={{ style: { width: 36, textAlign: 'center', fontSize: '0.85rem' } }}
                sx={{ width: 44 }}
              />
              <Typography variant="body2" color="text.secondary">pt</Typography>
            </Box>

            {/* Font family */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 0.75 }}>
              <Typography variant="body2" color="primary.main" sx={{ flex: 1 }}>
                Default Font Family for Text Editors
              </Typography>
              <FormControl variant="standard" sx={{ minWidth: 200 }}>
                <Select value={settings.textEditors.fontFamily} onChange={(e) => updateSection('textEditors', 'fontFamily', e.target.value)} sx={{ fontSize: '0.85rem' }}>
                  <MenuItem value="lato" sx={{ fontSize: '0.85rem' }}>Lato</MenuItem>
                  <MenuItem value="arial" sx={{ fontSize: '0.85rem' }}>Arial</MenuItem>
                  <MenuItem value="times" sx={{ fontSize: '0.85rem' }}>Times New Roman</MenuItem>
                  <MenuItem value="roboto" sx={{ fontSize: '0.85rem' }}>Roboto</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                Preview Text
              </Typography>
            </Box>

            {/* Font color */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 0.75 }}>
              <Typography variant="body2" color="primary.main" sx={{ flex: 1 }}>
                Default Font Color for Text Editors
              </Typography>
              <Box
                component="input"
                type="color"
                value={settings.textEditors.fontColor}
                onChange={(e) => updateSection('textEditors', 'fontColor', e.target.value)}
                sx={{
                  width: 28,
                  height: 28,
                  border: '1px solid #ccc',
                  borderRadius: '2px',
                  padding: 0,
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* ── Time Clock ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="time-clock" label="Time Clock" />
          <Box sx={{ mt: 1.5, pl: 0.5 }}>
            <SettingCheckbox label="Allow Users To Edit Time Clock Records" checked={settings.timeClock.allowEditRecords} onChange={(v) => updateSection('timeClock', 'allowEditRecords', v)} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 0.75 }}>
              <Typography variant="body2" color="primary.main">Select Pay Period Options</Typography>
              <FormControl variant="standard" sx={{ minWidth: 200 }}>
                <Select value={settings.timeClock.payPeriod} onChange={(e) => updateSection('timeClock', 'payPeriod', e.target.value)} sx={{ fontSize: '0.85rem' }}>
                  <MenuItem value="not-set" sx={{ fontSize: '0.85rem' }}>Not Set</MenuItem>
                  <MenuItem value="weekly" sx={{ fontSize: '0.85rem' }}>Weekly</MenuItem>
                  <MenuItem value="bi-weekly" sx={{ fontSize: '0.85rem' }}>Bi-Weekly</MenuItem>
                  <MenuItem value="monthly" sx={{ fontSize: '0.85rem' }}>Monthly</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 0.75 }}>
              <Typography variant="body2" color="primary.main" sx={{ flex: 1 }}>
                Users will be Automatically clocked out at
              </Typography>
              <TextField
                variant="standard"
                value={settings.timeClock.autoClockOutHour}
                onChange={(e) => updateSection('timeClock', 'autoClockOutHour', e.target.value)}
                inputProps={{ style: { width: 28, textAlign: 'center', fontSize: '0.85rem' } }}
                sx={{ width: 36 }}
              />
              <Typography variant="body2" color="text.secondary">:</Typography>
              <TextField
                variant="standard"
                value={settings.timeClock.autoClockOutMin}
                onChange={(e) => updateSection('timeClock', 'autoClockOutMin', e.target.value)}
                inputProps={{ style: { width: 28, textAlign: 'center', fontSize: '0.85rem' } }}
                sx={{ width: 36 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>(24h format)</Typography>
              <Tooltip title="More info" placement="right"><span><InfoIcon /></span></Tooltip>
            </Box>
          </Box>
        </Box>

        {/* ── Treatment Plan Page ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="treatment-plan-page" label="Treatment Plan Page" />
          <Box sx={{ mt: 1.5, pl: 0.5 }}>
            <SettingCheckbox label="Collapse Recare Plan Procedures By Default" checked={settings.treatmentPlanPage.collapseRecarePlan} onChange={(v) => updateSection('treatmentPlanPage', 'collapseRecarePlan', v)} info />
            <SettingCheckbox label="Show Discount Amount" checked={settings.treatmentPlanPage.showDiscountAmount} onChange={(v) => updateSection('treatmentPlanPage', 'showDiscountAmount', v)} info />
            <SettingCheckbox label="Show Insurance Portion" checked={settings.treatmentPlanPage.showInsurancePortion} onChange={(v) => updateSection('treatmentPlanPage', 'showInsurancePortion', v)} info />
            <SettingCheckbox label="Show Insurance Write Off Portion" checked={settings.treatmentPlanPage.showInsuranceWriteOff} onChange={(v) => updateSection('treatmentPlanPage', 'showInsuranceWriteOff', v)} info />
            <SettingCheckbox label="Show Max Allowed" checked={settings.treatmentPlanPage.showMaxAllowed} onChange={(v) => updateSection('treatmentPlanPage', 'showMaxAllowed', v)} info />
            <SettingCheckbox label="Show Office Fee" checked={settings.treatmentPlanPage.showOfficeFee} onChange={(v) => updateSection('treatmentPlanPage', 'showOfficeFee', v)} info />
          </Box>
        </Box>

        {/* ── Treatment Printout Form ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="treatment-printout-form" label="Treatment Printout Form" />
        </Box>

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, mb: 4 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{ textTransform: 'none', px: 4, bgcolor: '#1a3a6b' }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>

      </Box>

      {/* ── Sticky anchor nav ── */}
      <Box
        sx={{
          width: 16,
          flexShrink: 0,
          position: 'sticky',
          top: 80,
          alignSelf: 'flex-start',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2.5,
          pt: 6,
        }}
      >
        {SECTIONS.map((s) => (
          <Tooltip key={s.id} title={s.label} placement="left">
            <Box
              onClick={() => scrollTo(s.id)}
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                cursor: 'pointer',
                opacity: 0.7,
                '&:hover': { opacity: 1, transform: 'scale(1.3)' },
                transition: 'all 0.15s',
              }}
            />
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default PracticeSettings;
