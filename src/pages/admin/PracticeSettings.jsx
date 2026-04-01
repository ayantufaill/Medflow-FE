import { useState, useRef } from 'react';
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
} from '@mui/material';
import {
  Search as SearchIcon,
  InfoOutlined as InfoOutlinedIcon,
} from '@mui/icons-material';

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

/** Checkbox row — blue text when checked */
const SettingCheckbox = ({ label, defaultChecked = false, info = false }) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
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

/** Toggle row with inline number input */
const SettingToggle = ({ label, defaultValue, defaultOn = true }) => {
  const [on, setOn]   = useState(defaultOn);
  const [val, setVal] = useState(defaultValue);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 0.5 }}>
      <Switch size="small" checked={on} onChange={(e) => setOn(e.target.checked)} color="success" />
      <Typography variant="body2" sx={{ flex: 1 }}>{label}</Typography>
      {defaultValue !== undefined && (
        <TextField
          variant="standard"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          inputProps={{ style: { width: 28, textAlign: 'center', fontSize: '0.85rem' } }}
          sx={{ width: 36 }}
        />
      )}
    </Box>
  );
};

/** Inline label + number field row (blue label) */
const SettingInlineNumber = ({ label, defaultValue, info = false }) => {
  const [val, setVal] = useState(defaultValue);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 0.75 }}>
      <Typography variant="body2" color="primary.main" sx={{ flex: 1 }}>{label}</Typography>
      <TextField
        variant="standard"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        inputProps={{ style: { width: 36, textAlign: 'center', fontSize: '0.85rem' } }}
        sx={{ width: 44 }}
      />
      {info && <Tooltip title="More info" placement="right"><span><InfoIcon /></span></Tooltip>}
    </Box>
  );
};

/** Inline label + select dropdown */
const SettingInlineSelect = ({ label, options, defaultValue, info = false }) => {
  const [val, setVal] = useState(defaultValue);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 0.75 }}>
      <Typography variant="body2" color="primary.main">{label}</Typography>
      <FormControl variant="standard" sx={{ minWidth: 200 }}>
        <Select value={val} onChange={(e) => setVal(e.target.value)} sx={{ fontSize: '0.85rem' }}>
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
  const [search, setSearch]         = useState('');
  const [airwayExam, setAirwayExam] = useState('fairest');
  const contentRef                  = useRef(null);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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

        {/* ── AI ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="ai" label="AI" />
          <Box sx={{ mt: 1.5, pl: 0.5 }}>
            <SettingCheckbox label="Enable Audio Denoising" defaultChecked info />
            <SettingCheckbox label="Enable Transcription Validation" defaultChecked info />
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
              defaultValue={3}
            />
            <SettingToggle
              label="Automatically request medical history updates X days prior to appointment"
              defaultValue={5}
            />
            <SettingToggle
              label="Send Unsigned Consent Forms Reminder X Days Before Appointment"
              defaultValue={1}
            />
          </Box>
        </Box>

        {/* ── Claim Management ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="claim-management" label="Claim Management" />
          <Box sx={{ mt: 1.5, pl: 0.5 }}>
            <SettingCheckbox label="Allow Custom Codes In Claims" />
            <SettingCheckbox label="Disallow Deactivating Patient Policy if it has unclosed Claims." info />
            <SettingCheckbox label="Enable $0 Procedures in Claim Submission" defaultChecked />
            <SettingCheckbox label="Enable claims auto-attachment" defaultChecked />
            <SettingCheckbox label="Hide Subscriber Signature From Manual Claim" />
            <SettingCheckbox label="Include Pearl Annotations In Claim Attachments" defaultChecked />
            <SettingCheckbox label="Only display the total fee on the last page for multi-page claims." />
            <SettingCheckbox label="Print a Doctor & Patient copy for EOB" defaultChecked info />
          </Box>
        </Box>

        {/* ── Communication ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="communication" label="Communication" />
          <Box sx={{ mt: 1.5, pl: 0.5 }}>
            <SettingCheckbox label="Add calendar invitation to appointment reminders" defaultChecked />
            <SettingCheckbox label="Include confirmations messages in the patient notifications pop-up" />
            <SettingCheckbox label="Include unread messages only in the patient notifications pop-up" defaultChecked />
            <SettingCheckbox label="Show phone call pop-up when having unread confirmation messages" />
            <SettingInlineNumber label="Hide the Caller Id Popup After # of seconds" defaultValue={5} info />
          </Box>
        </Box>

        {/* ── Exam Page Items ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="exam-page-items" label="Exam Page Items" />
          <Box sx={{ mt: 1.5, pl: 0.5 }}>
            <SettingCheckbox label="Create Progress Note From Mango AI Summary" info />
            <SettingCheckbox label="Generate progress notes for new exams without an existing progress note" defaultChecked />
            <SettingCheckbox label="Show Airway Exam" defaultChecked />
            <SettingCheckbox label="Show Clinical Exam for Pediatric Patients" />
            <SettingCheckbox label="Show Dentofacial Exam" defaultChecked />
            <SettingCheckbox label="Show Head & Neck Exam" defaultChecked />
            <SettingCheckbox label="Show Morphological Exam" defaultChecked />
            <SettingCheckbox label="Show Periodontal Exam" defaultChecked />
            <SettingCheckbox label="Show Radiographic Exam" defaultChecked />
            <SettingCheckbox label="Show TMJ Exam" defaultChecked />
            <SettingCheckbox label="Show Tooth Structure Exam" defaultChecked />

            <SettingInlineSelect
              label="Use Google Speech To Text"
              options={[
                { value: 'model2', label: 'Model 2' },
                { value: 'model1', label: 'Model 1' },
              ]}
              defaultValue="model2"
            />

            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Select which airway exam to display
              </Typography>
              <RadioGroup
                row
                value={airwayExam}
                onChange={(e) => setAirwayExam(e.target.value)}
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
            <SettingCheckbox label="Hide Pearl Advertisement" />
            <SettingCheckbox label="Show Dentists on Hygienist list on Patient Info Page" />
            <SettingCheckbox label="Show Outbound Calls" />
            <SettingCheckbox label="Show Patient ID next to patient name in header." />
            <SettingCheckbox label="Use Insurance New Design as Default" defaultChecked />
            <SettingInlineNumber
              label="Consider medical history outdated after X months from the last review"
              defaultValue={11}
            />
            <SettingInlineNumber
              label="Session Expiration Duration (minutes)"
              defaultValue={60}
              info
            />
            <SettingInlineSelect
              label="Custom Date Format"
              options={[
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
              ]}
              defaultValue="MM/DD/YYYY"
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
            <SettingCheckbox label="Allow Sending Quads as Teeth for Claims" defaultChecked info />
            <SettingCheckbox label="Allow Submission of Claims/Preds with no Attachments" defaultChecked info />
            <SettingCheckbox label="Allow Submission of Secondary Claims without Primary Claim Insurance Payment Amount" info />
            <SettingCheckbox label="Allow Submission of Secondary Claims without Primary Claim Remittance Date" info />
            <SettingCheckbox label="Automatically apply payment based on ERA report (beta)" info />
            <SettingCheckbox label="Display Eligibility Response in Vyne HTML Format" defaultChecked info />
            <SettingCheckbox label="Use Tesia Payer Procedure Requirements" defaultChecked info />
            <SettingInlineNumber label="Eligibility Data-Validity Duration" defaultValue={14} info />
          </Box>
        </Box>

        {/* ── Menu Items ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="menu-items" label="Menu Items" />
          <Box sx={{ mt: 1.5, pl: 0.5 }}>
            <SettingCheckbox label="Show Adjunctive Therapy menu item under Clinical menu" defaultChecked />
            <SettingCheckbox label="Show Dental History menu item under Patient menu" defaultChecked />
            <SettingCheckbox label="Show Diagnostic Opinion menu item under Clinical menu" defaultChecked />
            <SettingCheckbox label="Show ETrans menu item under Finance menu" />
            <SettingCheckbox label="Show Home Care menu item under Patient Reports menu" defaultChecked />
            <SettingCheckbox label="Show Medical History menu item under Patient menu" defaultChecked />
            <SettingCheckbox label="Show Pedo Dental History menu item under Patient menu" defaultChecked />
            <SettingCheckbox label="Show Pedo Medical History menu item under Patient menu" defaultChecked />
            <SettingCheckbox label="Show Responses for Deleted Questionnaires" />
            <SettingCheckbox label="Show Risk Assessment menu item under Patient Reports menu" defaultChecked />
            <SettingCheckbox label="Show Scans menu item under Ancillary Tests menu" defaultChecked />
            <SettingCheckbox label="Show Showcase menu item under Patient Reports menu" defaultChecked />
          </Box>
        </Box>

        {/* ── Patient Confidential Info ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="patient-confidential-info" label="Patient Confidential Info" />
          <Box sx={{ mt: 1.5, pl: 0.5 }}>
            <SettingCheckbox label="Additional Info (for pedo only)" defaultChecked />
            <SettingCheckbox label="Emergency Contact Information" defaultChecked />
            <SettingCheckbox label="Home Phone Number" defaultChecked />
            <SettingCheckbox label="Marital Status" defaultChecked />
            <SettingCheckbox label="Release Information" defaultChecked />
            <SettingCheckbox label="Spouse Information" defaultChecked />
            <SettingCheckbox label="Title" defaultChecked />
            <SettingCheckbox label="Work Phone Number" defaultChecked />
          </Box>
        </Box>

        {/* ── Reports ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="reports" label="Reports" />
          <Box sx={{ mt: 1.5, pl: 0.5 }}>
            <SettingCheckbox label="Compute Production Per Hour Based On Schedule" info />
            <SettingCheckbox label="View the row number for all reports" />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 0.75 }}>
              <Typography variant="body2" color="primary.main" sx={{ flex: 1 }}>
                The Production &amp; Collection report will be generated at the selected business day of the month
              </Typography>
              <FormControl variant="standard" sx={{ minWidth: 60 }}>
                <Select defaultValue="5" sx={{ fontSize: '0.85rem' }}>
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
            <SettingCheckbox label="Add Default Sms Footer" defaultChecked info />
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
                defaultValue="10"
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
                <Select defaultValue="lato" sx={{ fontSize: '0.85rem' }}>
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
                defaultValue="#000000"
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
            <SettingCheckbox label="Allow Users To Edit Time Clock Records" />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 0.75 }}>
              <Typography variant="body2" color="primary.main">Select Pay Period Options</Typography>
              <FormControl variant="standard" sx={{ minWidth: 200 }}>
                <Select defaultValue="not-set" sx={{ fontSize: '0.85rem' }}>
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
                defaultValue="21"
                inputProps={{ style: { width: 28, textAlign: 'center', fontSize: '0.85rem' } }}
                sx={{ width: 36 }}
              />
              <Typography variant="body2" color="text.secondary">:</Typography>
              <TextField
                variant="standard"
                defaultValue="00"
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
            <SettingCheckbox label="Collapse Recare Plan Procedures By Default" defaultChecked info />
            <SettingCheckbox label="Show Discount Amount" defaultChecked info />
            <SettingCheckbox label="Show Insurance Portion" defaultChecked info />
            <SettingCheckbox label="Show Insurance Write Off Portion" info />
            <SettingCheckbox label="Show Max Allowed" info />
            <SettingCheckbox label="Show Office Fee" defaultChecked info />
          </Box>
        </Box>

        {/* ── Treatment Printout Form ── */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader id="treatment-printout-form" label="Treatment Printout Form" />
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
