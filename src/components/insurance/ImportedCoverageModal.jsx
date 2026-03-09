import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Collapse,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  VolunteerActivism as VolunteerActivismIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Typography matches Medical History page: Manrope, fontSize 14, colors #424242, #616161, #757575
const TYPO = {
  fontFamily: '"Manrope", "Segoe UI", sans-serif',
  header: { fontWeight: 700, color: '#424242', fontSize: '1.05rem' },
  sectionTitle: { fontWeight: 600, color: '#616161', fontSize: '0.875rem' },
  label: { fontWeight: 600, color: '#424242', fontSize: 14 },
  value: { color: '#757575', fontSize: 14 },
  caption: { color: '#9e9e9e', fontWeight: 600, fontSize: 12 },
  button: { fontSize: 14, fontWeight: 600 },
};

const DetailRow = ({ label, value }) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography component="span" sx={{ ...TYPO.label }}>
      {label}:{' '}
    </Typography>
    <Typography component="span" sx={{ ...TYPO.value }}>
      {value || '–'}
    </Typography>
  </Box>
);

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Mock insurance plan options – replace with API when backend is ready
const DEDUCTIBLE_CATEGORIES = ['Standard', 'Preventative', 'Basic', 'Major', 'Orthodontics'];
const DEDUCTIBLE_FREQUENCIES = ['Annual', 'Per Visit', 'Lifetime'];

const COVERAGE_ITEMS = [
  { service: 'Diagnostic Preventative', pct: 100 },
  { service: 'Diagnostic Basic', pct: 100 },
  { service: 'Preventative Preventative', pct: 100 },
  { service: 'Preventative Basic', pct: 80 },
  { service: 'Restorative Basic', pct: 80 },
  { service: 'Restorative Major', pct: 50 },
  { service: 'Endodontics', pct: 80 },
  { service: 'Periodontics Major', pct: 50 },
  { service: 'Periodontics Basic', pct: 80 },
  { service: 'Prosthodontics, Removable', pct: 50 },
  { service: 'Maxillofacial Prosthetics', pct: 50 },
  { service: 'Implant Services', pct: 50 },
  { service: 'Prosthodontics, Fixed', pct: 50 },
  { service: 'Oral Surgery Basic', pct: 80 },
  { service: 'Oral Surgery Major', pct: 50 },
  { service: 'Orthodontics', pct: 50 },
  { service: 'Adjunctive General Services Basic', pct: 50 },
  { service: 'Adjunctive General Services Major', pct: 50 },
  { service: 'Adjunctive General Services Standard', pct: 50 },
];

const PLAN_FEE_GUIDE_OPTIONS = [
  'None',
  'Copay fees',
  'Delta Dental PPO',
  'Metlife',
  'BC of WA',
  'tetst',
  'Office Fees 2020',
  'discount plan',
  'Test Test %',
];

const INSURANCE_PLAN_OPTIONS = [
  'PPO Plan',
  'HMO Plan',
  'Dental PPO',
  'Dental HMO',
  'Delta Dental PPO',
  'Delta Dental Premier',
  'Delta Dental Premier Plus',
  'Basic Dental Plan',
  'Comprehensive Dental',
  'Preventive Plus',
  'Family Dental Plan',
  'Individual Dental Plan',
  'Employer Group Plan',
  'Medicare Advantage Dental',
  'Medicaid Dental',
  'Vision & Dental Combo',
  'Orthodontic Coverage',
  'Implant Coverage Plan',
  'High Deductible Dental',
  'Supplemental Dental',
];

export default function ImportedCoverageModal({
  open,
  onClose,
  inactiveInsurances = [],
  getInsuranceCompanyName,
  onCreatePolicy,
  onSavePlan,
  creating,
  savingPlan,
  isMockData = false,
}) {
  const firstId = inactiveInsurances[0]?._id || inactiveInsurances[0]?.id || null;
  const [expandedId, setExpandedId] = useState(firstId);
  const [selectedInsurance, setSelectedInsurance] = useState(inactiveInsurances[0] || null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreatePlanForm, setShowCreatePlanForm] = useState(false);
  const [planSearch, setPlanSearch] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupNumber, setGroupNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [renewalMonth, setRenewalMonth] = useState('January');
  const [policyEndsOn, setPolicyEndsOn] = useState(null);
  const [assignment, setAssignment] = useState('non-assignment');
  const [releaseInfo, setReleaseInfo] = useState(false);
  // Create New Plan form
  const [newPlanPayerName, setNewPlanPayerName] = useState('');
  const [newPlanPayerId, setNewPlanPayerId] = useState('');
  const [newPlanGroupName, setNewPlanGroupName] = useState('');
  const [newPlanGroupNumber, setNewPlanGroupNumber] = useState('');
  const [newPlanNotes, setNewPlanNotes] = useState('');
  const [newPlanEmployerName, setNewPlanEmployerName] = useState('');
  const [newPlanEmployerPhone, setNewPlanEmployerPhone] = useState('');
  const [newPlanFeeGuide, setNewPlanFeeGuide] = useState('None');
  const [newPlanHealthPlan, setNewPlanHealthPlan] = useState(false);
  const [newPlanIndividualMax, setNewPlanIndividualMax] = useState('');
  const [newPlanIndividualUnlimited, setNewPlanIndividualUnlimited] = useState(false);
  const [newPlanFamilyMax, setNewPlanFamilyMax] = useState('');
  const [newPlanFamilyUnlimited, setNewPlanFamilyUnlimited] = useState(true);
  const [newPlanIndividualMaxError, setNewPlanIndividualMaxError] = useState('');
  const [showEditCoverage, setShowEditCoverage] = useState(false);
  const [savedPlans, setSavedPlans] = useState([]);
  const [deductibles, setDeductibles] = useState(() =>
    DEDUCTIBLE_CATEGORIES.map((cat) => ({
      category: cat,
      individual: cat === 'Preventative' ? 0 : 50,
      family: cat === 'Preventative' ? 0 : 100,
      frequency: 'Annual',
      standard: cat !== 'Preventative',
    }))
  );

  useEffect(() => {
    if (open && inactiveInsurances.length > 0) {
      const first = inactiveInsurances[0];
      setExpandedId(first._id || first.id);
      setSelectedInsurance(first);
      const companyName = getInsuranceCompanyName(first.insuranceCompanyId);
      setPlanSearch(companyName || '');
      setSelectedPlan(first.planName || '');
      setGroupName(first.groupName || '');
      setGroupNumber(first.groupNumber || '');
      setNotes(first.notes || '');
      setPolicyEndsOn(first.expirationDate ? dayjs(first.expirationDate) : null);
      setReleaseInfo(false);
    }
  }, [open, inactiveInsurances, getInsuranceCompanyName]);

  useEffect(() => {
    if (!open) {
      setShowCreateForm(false);
      setShowCreatePlanForm(false);
      setSavedPlans([]);
    }
  }, [open]);

  const handleToggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
    const ins = inactiveInsurances.find((i) => (i._id || i.id) === id);
    setSelectedInsurance(ins || selectedInsurance);
  };

  const handleCreatePolicyClick = () => {
    const ins = selectedInsurance || inactiveInsurances[0];
    if (ins) {
      setPlanSearch(getInsuranceCompanyName(ins.insuranceCompanyId) || '');
      setSelectedPlan(ins.planName || '');
      setGroupName(ins.groupName || '');
      setGroupNumber(ins.groupNumber || '');
      setNotes(ins.notes || '');
      setPolicyEndsOn(ins.expirationDate ? dayjs(ins.expirationDate) : null);
      setShowCreateForm(true);
    }
  };

  const planOptions = (() => {
    const ins = selectedInsurance || inactiveInsurances[0];
    const planName = ins?.planName;
    const base = [...savedPlans];
    if (planName && !base.includes(planName)) base.unshift(planName);
    const rest = INSURANCE_PLAN_OPTIONS.filter((o) => !base.includes(o));
    return [...base, ...rest];
  })();

  const handleNewPlanClick = () => {
    const ins = selectedInsurance || inactiveInsurances[0];
    const companyName = getInsuranceCompanyName(ins?.insuranceCompanyId || inactiveInsurances[0]?.insuranceCompanyId);
    const payerId = ins?.insuranceCompanyId?.payerId || inactiveInsurances[0]?.insuranceCompanyId?.payerId;
    setNewPlanPayerName(companyName || '');
    setNewPlanPayerId(payerId || '');
    setNewPlanGroupName(ins?.groupName || groupName || '');
    setNewPlanGroupNumber(ins?.groupNumber || groupNumber || '');
    setNewPlanNotes(notes || '');
    setNewPlanEmployerName(ins?.employerName || ins?.employer || '');
    setNewPlanEmployerPhone('');
    setNewPlanFeeGuide('None');
    setNewPlanHealthPlan(false);
    setNewPlanIndividualMax('');
    setNewPlanIndividualUnlimited(false);
    setNewPlanFamilyMax('');
    setNewPlanFamilyUnlimited(true);
    setNewPlanIndividualMaxError('');
    setShowEditCoverage(false);
    setShowCreatePlanForm(true);
  };

  const handleSaveNewPlan = async () => {
    if (!newPlanIndividualUnlimited) {
      const amt = parseFloat(newPlanIndividualMax) || 0;
      if (amt <= 0) {
        setNewPlanIndividualMaxError('coverage should not be zero');
        return;
      }
    }
    setNewPlanIndividualMaxError('');
    const ins = selectedInsurance || inactiveInsurances[0];
    const companyId = ins?.insuranceCompanyId?._id || ins?.insuranceCompanyId?.id || ins?.insuranceCompanyId;
    const planData = {
      insuranceCompanyId: companyId,
      insuranceCompanyIdObj: ins?.insuranceCompanyId,
      policyNumber: ins?.policyNumber || newPlanGroupNumber,
      groupNumber: newPlanGroupNumber,
      groupName: newPlanGroupName,
      subscriberName: ins?.subscriberName,
      subscriberDateOfBirth: ins?.subscriberDateOfBirth,
      relationshipToPatient: ins?.relationshipToPatient || 'self',
      insuranceType: ins?.insuranceType || 'primary',
      effectiveDate: ins?.effectiveDate,
      expirationDate: ins?.expirationDate,
      employerName: newPlanEmployerName,
      planName: newPlanEmployerName ? `${newPlanEmployerName} by ${newPlanPayerName} (${newPlanGroupNumber || ''})` : `${newPlanPayerName} (${newPlanGroupNumber || ''})`,
      individualAnnualMax: newPlanIndividualUnlimited ? null : parseFloat(newPlanIndividualMax) || 0,
      familyAnnualMax: newPlanFamilyUnlimited ? null : parseFloat(newPlanFamilyMax) || 0,
      notes: newPlanNotes,
      isActive: true,
    };
    if (onSavePlan) {
      try {
        await onSavePlan(planData);
      } catch {
        return;
      }
    }
    setShowCreatePlanForm(false);
    onClose();
  };

  const handleSavePolicy = async () => {
    const ins = selectedInsurance || inactiveInsurances[0];
    if (ins && onCreatePolicy) {
      await onCreatePolicy(ins);
      onClose();
    }
  };

  const getRelationshipLabel = (rel) => {
    const map = { self: 'Self', spouse: 'Spouse', child: 'Child', parent: 'Parent', other: 'Other' };
    return map[rel] || rel || '–';
  };

  const getPolicyTypeLabel = (type) => {
    const map = { primary: 'PRIMARY', secondary: 'SECONDARY', tertiary: 'TERTIARY' };
    return map[(type || '').toLowerCase()] || (type || 'Primary').toUpperCase();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1.5,
          overflow: 'hidden',
          boxShadow: 24,
          fontFamily: TYPO.fontFamily,
        },
      }}
    >
      {/* Blue header */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 1.5,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {showCreateForm || showCreatePlanForm ? (
            <UploadIcon sx={{ fontSize: 28 }} />
          ) : (
            <VolunteerActivismIcon sx={{ fontSize: 28 }} />
          )}
          <Typography
            variant="h6"
            sx={{
              fontFamily: TYPO.fontFamily,
              fontWeight: 700,
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {showCreatePlanForm
              ? 'Imported Coverage > Create New Policy > Create New Plan'
              : showCreateForm
                ? 'Imported Coverage > Create New Policy'
                : 'Imported Coverage'}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0, bgcolor: 'white' }}>
        {inactiveInsurances.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography sx={{ mb: 2, ...TYPO.value, color: '#757575' }}>
              No imported coverage available.
            </Typography>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                fontFamily: TYPO.fontFamily,
                textTransform: 'uppercase',
                ...TYPO.button,
                borderColor: '#9e9e9e',
                color: '#616161',
              }}
            >
              Cancel
            </Button>
          </Box>
        ) : showCreateForm ? (
          showCreatePlanForm ? (
            <Box sx={{ p: 2 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.sectionTitle, mb: 1.5, display: 'block' }}>
                    Payer Information
                  </Typography>
                  <TextField fullWidth size="small" label="Payer Name*" value={newPlanPayerName} onChange={(e) => setNewPlanPayerName(e.target.value)} sx={{ mb: 1.5, '& .MuiInputBase-input': { fontFamily: TYPO.fontFamily } }} />
                  <Box sx={{ display: 'flex', gap: 1, mb: 1.5, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <TextField size="small" label="Payer ID*" value={newPlanPayerId} onChange={(e) => setNewPlanPayerId(e.target.value)} sx={{ flex: '1 1 140px', minWidth: 120, '& .MuiInputBase-input': { fontFamily: TYPO.fontFamily } }} />
                    <Button variant="contained" color="primary" size="small" startIcon={<EditIcon />} sx={{ fontFamily: TYPO.fontFamily, ...TYPO.button, textTransform: 'none', whiteSpace: 'nowrap', flexShrink: 0, mt: 0.5 }}>Edit carrier</Button>
                  </Box>
                  <TextField fullWidth size="small" label="Group Name*" value={newPlanGroupName} onChange={(e) => setNewPlanGroupName(e.target.value)} sx={{ mb: 1.5, '& .MuiInputBase-input': { fontFamily: TYPO.fontFamily } }} />
                  <TextField fullWidth size="small" label="Group Number*" value={newPlanGroupNumber} onChange={(e) => setNewPlanGroupNumber(e.target.value)} sx={{ mb: 1.5, '& .MuiInputBase-input': { fontFamily: TYPO.fontFamily } }} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.sectionTitle, mb: 1.5, display: 'block' }}>
                    Plan and Employer Information
                  </Typography>
                  <TextField fullWidth size="small" label="Plan or employer's name*" value={newPlanEmployerName} onChange={(e) => setNewPlanEmployerName(e.target.value)} sx={{ mb: 1.5, '& .MuiInputBase-input': { fontFamily: TYPO.fontFamily } }} />
                  <TextField fullWidth size="small" label="Plan or employer's phone" value={newPlanEmployerPhone} onChange={(e) => setNewPlanEmployerPhone(e.target.value)} sx={{ mb: 1.5, '& .MuiInputBase-input': { fontFamily: TYPO.fontFamily } }} />
                  <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
                    <InputLabel>Plan Fee Guide</InputLabel>
                    <Select
                      label="Plan Fee Guide"
                      value={newPlanFeeGuide}
                      onChange={(e) => setNewPlanFeeGuide(e.target.value)}
                      sx={{ fontFamily: TYPO.fontFamily }}
                      MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
                    >
                      {PLAN_FEE_GUIDE_OPTIONS.map((opt) => (
                        <MenuItem key={opt} value={opt} sx={{ fontFamily: TYPO.fontFamily }}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControlLabel control={<Checkbox size="small" checked={newPlanHealthPlan} onChange={(e) => setNewPlanHealthPlan(e.target.checked)} />} label="Health Plan" sx={{ fontFamily: TYPO.fontFamily, '& .MuiFormControlLabel-label': { fontSize: 14 } }} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.sectionTitle, mb: 1.5, display: 'block' }}>
                    Coverage
                  </Typography>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.label, mb: 0.5 }}>Individual annual max amount:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        size="small"
                        type="number"
                        value={newPlanIndividualMax}
                        onChange={(e) => { setNewPlanIndividualMax(e.target.value); setNewPlanIndividualMaxError(''); }}
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        sx={{ width: 120, '& .MuiInputBase-input': { fontFamily: TYPO.fontFamily } }}
                        error={!!newPlanIndividualMaxError}
                      />
                      <FormControlLabel control={<Checkbox size="small" checked={newPlanIndividualUnlimited} onChange={(e) => setNewPlanIndividualUnlimited(e.target.checked)} />} label="unlimited" sx={{ fontFamily: TYPO.fontFamily, '& .MuiFormControlLabel-label': { fontSize: 14 } }} />
                    </Box>
                    {newPlanIndividualMaxError && <Typography sx={{ fontFamily: TYPO.fontFamily, fontSize: 12, color: 'error.main', mt: 0.5 }}>{newPlanIndividualMaxError}</Typography>}
                  </Box>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.label, mb: 0.5 }}>Family annual max amount:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        size="small"
                        type="number"
                        value={newPlanFamilyMax}
                        onChange={(e) => setNewPlanFamilyMax(e.target.value)}
                        disabled={newPlanFamilyUnlimited}
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        sx={{ width: 120, '& .MuiInputBase-input': { fontFamily: TYPO.fontFamily } }}
                      />
                      <FormControlLabel control={<Checkbox size="small" checked={newPlanFamilyUnlimited} onChange={(e) => setNewPlanFamilyUnlimited(e.target.checked)} />} label="unlimited" sx={{ fontFamily: TYPO.fontFamily, '& .MuiFormControlLabel-label': { fontSize: 14 } }} />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.label }}>Ortho lifetime limit:</Typography>
                    <Button variant="outlined" color="primary" size="small" sx={{ fontFamily: TYPO.fontFamily, ...TYPO.button, textTransform: 'none' }}>Add Limit</Button>
                  </Box>
                </Grid>
              </Grid>

              {showEditCoverage && (
                <Box sx={{ mt: 3 }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.sectionTitle, mb: 1.5, display: 'block' }}>
                        Deductibles
                      </Typography>
                      <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                        <Table size="small" sx={{ '& .MuiTableCell-root': { py: 0.5, px: 1 } }}>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, fontSize: '0.7rem', py: 0.5, px: 1 }}>Category</TableCell>
                              <TableCell sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, fontSize: '0.7rem', py: 0.5, px: 1 }}>Individual</TableCell>
                              <TableCell sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, fontSize: '0.7rem', py: 0.5, px: 1 }}>Family</TableCell>
                              <TableCell sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, fontSize: '0.7rem', py: 0.5, px: 1 }}>Frequency</TableCell>
                              <TableCell sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, fontSize: '0.7rem', py: 0.5, px: 1 }}>Standard</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {deductibles.map((d, i) => (
                              <TableRow key={d.category}>
                                <TableCell sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.75rem', py: 0.5, px: 1 }}>{d.category}</TableCell>
                                <TableCell sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.75rem', py: 0.5, px: 1 }}>
                                  <TextField type="number" size="small" value={d.individual} onChange={(e) => setDeductibles((prev) => prev.map((x, j) => (j === i ? { ...x, individual: Number(e.target.value) || 0 } : x)))} sx={{ width: 72, minWidth: 72, '& .MuiInputBase-input': { fontFamily: TYPO.fontFamily, fontSize: '0.75rem', py: 0.5 } }} />
                                </TableCell>
                                <TableCell sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.75rem', py: 0.5, px: 1 }}>
                                  <TextField type="number" size="small" value={d.family} onChange={(e) => setDeductibles((prev) => prev.map((x, j) => (j === i ? { ...x, family: Number(e.target.value) || 0 } : x)))} sx={{ width: 72, minWidth: 72, '& .MuiInputBase-input': { fontFamily: TYPO.fontFamily, fontSize: '0.75rem', py: 0.5 } }} />
                                </TableCell>
                                <TableCell sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.75rem', py: 0.5, px: 1 }}>
                                  <Select size="small" value={d.frequency} sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.75rem', minWidth: 72, '& .MuiSelect-select': { fontSize: '0.75rem', py: 0.5 } }} onChange={(e) => setDeductibles((prev) => prev.map((x, j) => (j === i ? { ...x, frequency: e.target.value } : x)))}>
                                    {DEDUCTIBLE_FREQUENCIES.map((f) => (
                                      <MenuItem key={f} value={f} sx={{ fontSize: '0.75rem' }}>{f}</MenuItem>
                                    ))}
                                  </Select>
                                </TableCell>
                                <TableCell sx={{ py: 0.5, px: 1 }}>
                                  {d.category === 'Preventative' ? (
                                    <FormControlLabel control={<Radio size="small" checked={d.standard} onChange={() => setDeductibles((prev) => prev.map((x, j) => (j === i ? { ...x, standard: !x.standard } : x)))} sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }} />} label="standard" sx={{ fontFamily: TYPO.fontFamily, '& .MuiFormControlLabel-label': { fontSize: '0.7rem' } }} />
                                  ) : (
                                    <FormControlLabel control={<Checkbox size="small" checked={d.standard} onChange={() => setDeductibles((prev) => prev.map((x, j) => (j === i ? { ...x, standard: !x.standard } : x)))} sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }} />} label="standard" sx={{ fontFamily: TYPO.fontFamily, '& .MuiFormControlLabel-label': { fontSize: '0.7rem' } }} />
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.sectionTitle, mb: 1.5, display: 'block' }}>
                        Coverage
                      </Typography>
                      <TableContainer component={Paper} variant="outlined" sx={{ mb: 2, maxHeight: 360 }}>
                        <Table size="small" stickyHeader sx={{ '& .MuiTableCell-root': { py: 0.5, px: 1 } }}>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, fontSize: '0.7rem', py: 0.5, px: 1 }}>Service</TableCell>
                              <TableCell align="right" sx={{ fontFamily: TYPO.fontFamily, fontWeight: 600, fontSize: '0.7rem', py: 0.5, px: 1 }}>%</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {COVERAGE_ITEMS.map((item) => (
                              <TableRow key={item.service}>
                                <TableCell sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.75rem', py: 0.5, px: 1 }}>{item.service}</TableCell>
                                <TableCell align="right" sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.75rem', py: 0.5, px: 1 }}>{item.pct}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </Box>
              )}

              <Box sx={{ mt: 3 }}>
                <TextField fullWidth size="small" label="Notes" value={newPlanNotes} onChange={(e) => setNewPlanNotes(e.target.value)} placeholder="Add notes" multiline rows={2} sx={{ mb: 2, '& .MuiInputBase-input': { fontFamily: TYPO.fontFamily } }} />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
                <Button variant="outlined" onClick={() => setShowCreatePlanForm(false)} sx={{ fontFamily: TYPO.fontFamily, ...TYPO.button, borderColor: '#9e9e9e', color: '#616161' }}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={() => setShowEditCoverage(!showEditCoverage)} sx={{ fontFamily: TYPO.fontFamily, ...TYPO.button, textTransform: 'none' }}>Edit Coverage</Button>
                <Button variant="contained" color="primary" sx={{ fontFamily: TYPO.fontFamily, ...TYPO.button, textTransform: 'none' }}>Coverage Book</Button>
                <Button variant="contained" color="primary" onClick={handleSaveNewPlan} disabled={savingPlan} sx={{ fontFamily: TYPO.fontFamily, ...TYPO.button, textTransform: 'none', bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}>{savingPlan ? 'Saving...' : 'Save Plan'}</Button>
              </Box>
            </Box>
          ) : (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ p: 2 }}>
              <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.caption, color: '#757575', mb: 1.5, display: 'block' }}>
                Search for Plan: by Payer Id, carrier, plan name, group number, group name, employer
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search..."
                  value={planSearch}
                  onChange={(e) => setPlanSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#9e9e9e' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiInputBase-input': { fontFamily: TYPO.fontFamily, fontSize: 14 } }}
                />
                <Button variant="contained" color="primary" onClick={handleNewPlanClick} sx={{ fontFamily: TYPO.fontFamily, ...TYPO.button, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  New Plan
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.sectionTitle, mb: 1.5, display: 'block' }}>
                    Payer & Plan Information
                  </Typography>
                  <Typography sx={{ fontFamily: TYPO.fontFamily, fontWeight: 700, fontSize: 14, color: '#424242', mb: 0.5 }}>
                    Payer Name
                  </Typography>
                  <Typography sx={{ fontFamily: TYPO.fontFamily, fontSize: 14, color: '#424242', mb: 1 }}>
                    {getInsuranceCompanyName(selectedInsurance?.insuranceCompanyId || inactiveInsurances[0]?.insuranceCompanyId)}
                  </Typography>
                  <Typography sx={{ fontFamily: TYPO.fontFamily, fontWeight: 700, fontSize: 14, color: 'primary.main', mb: 0.5 }}>
                    Payer ID
                  </Typography>
                  <Typography sx={{ fontFamily: TYPO.fontFamily, fontSize: 14, color: '#424242', mb: 1 }}>
                    {(selectedInsurance?.insuranceCompanyId?.payerId || inactiveInsurances[0]?.insuranceCompanyId?.payerId) || '–'}
                  </Typography>
                  <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
                    <InputLabel>Insurance Plan</InputLabel>
                    <Select
                      label="Insurance Plan"
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                      sx={{ fontFamily: TYPO.fontFamily }}
                      MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
                    >
                      <MenuItem value="">
                        <em>Select existing plan</em>
                      </MenuItem>
                      {planOptions.map((plan) => (
                        <MenuItem key={plan} value={plan} sx={{ fontFamily: TYPO.fontFamily }}>
                          {plan}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField fullWidth size="small" label="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} sx={{ mb: 1.5, '& .MuiInputBase-input': { fontFamily: TYPO.fontFamily } }} />
                  <TextField fullWidth size="small" label="Group Number" value={groupNumber} onChange={(e) => setGroupNumber(e.target.value)} sx={{ mb: 1.5, '& .MuiInputBase-input': { fontFamily: TYPO.fontFamily } }} />
                  <TextField fullWidth size="small" label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} multiline rows={2} sx={{ '& .MuiInputBase-input': { fontFamily: TYPO.fontFamily } }} />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.sectionTitle, mb: 1.5, display: 'block' }}>
                    Subscriber Information
                  </Typography>
                  <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
                    <InputLabel>Patient's Relationship to Subscriber</InputLabel>
                    <Select label="Patient's Relationship to Subscriber" value={selectedInsurance?.relationshipToPatient || inactiveInsurances[0]?.relationshipToPatient || 'self'} sx={{ fontFamily: TYPO.fontFamily }}>
                      <MenuItem value="self">Self</MenuItem>
                      <MenuItem value="spouse">Spouse</MenuItem>
                      <MenuItem value="child">Child</MenuItem>
                      <MenuItem value="parent">Parent</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.label }}>Subscriber*</Typography>
                    <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                  </Box>
                  <Typography sx={{ fontFamily: TYPO.fontFamily, fontSize: 14, color: '#424242', mb: 1.5 }}>
                    {selectedInsurance?.subscriberName || inactiveInsurances[0]?.subscriberName || '–'}
                  </Typography>
                  <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.label, mb: 0.5 }}>Subscriber ID*</Typography>
                  <Typography sx={{ fontFamily: TYPO.fontFamily, fontSize: 14, color: '#424242', mb: 1.5 }}>
                    {selectedInsurance?.policyNumber || inactiveInsurances[0]?.policyNumber || '–'}
                  </Typography>
                  <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.label, mb: 0.5 }}>Individual Used amount*</Typography>
                  <Typography sx={{ fontFamily: TYPO.fontFamily, fontSize: 14, color: '#424242', mb: 1 }}>$ 0</Typography>
                  <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.label, mb: 0.5 }}>Used amount up to date</Typography>
                  <Typography sx={{ fontFamily: TYPO.fontFamily, fontSize: 14, color: '#424242', mb: 1 }}>
                    {selectedInsurance?.effectiveDate ? dayjs(selectedInsurance.effectiveDate).format('MM/DD/YYYY') : inactiveInsurances[0]?.effectiveDate ? dayjs(inactiveInsurances[0].effectiveDate).format('MM/DD/YYYY') : '–'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.sectionTitle, mb: 1.5, display: 'block' }}>
                    Policy Term Details
                  </Typography>
                  <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
                    <InputLabel>Renewal*</InputLabel>
                    <Select label="Renewal*" value={renewalMonth} onChange={(e) => setRenewalMonth(e.target.value)} sx={{ fontFamily: TYPO.fontFamily }}>
                      {MONTHS.map((m) => (
                        <MenuItem key={m} value={m}>{m}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.label, mb: 0.5 }}>Policy started on*</Typography>
                  <Typography sx={{ fontFamily: TYPO.fontFamily, fontSize: 14, color: '#424242', mb: 1.5 }}>
                    {selectedInsurance?.effectiveDate ? dayjs(selectedInsurance.effectiveDate).format('MM/DD/YYYY') : inactiveInsurances[0]?.effectiveDate ? dayjs(inactiveInsurances[0].effectiveDate).format('MM/DD/YYYY') : '–'}
                  </Typography>
                  <DatePicker
                    label="Policy ends on"
                    value={policyEndsOn}
                    onChange={(d) => setPolicyEndsOn(d)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        sx: { mb: 1.5, '& .MuiInputBase-input': { fontFamily: TYPO.fontFamily } },
                      },
                    }}
                  />
                  <Box sx={{ mb: 1.5 }}>
                    <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.label, mb: 0.5 }}>Assignment / Non-assignment</Typography>
                    <RadioGroup row value={assignment} onChange={(e) => setAssignment(e.target.value)}>
                      <FormControlLabel value="assignment" control={<Radio size="small" />} label="Assignment" sx={{ fontFamily: TYPO.fontFamily, '& .MuiFormControlLabel-label': { fontSize: 14 } }} />
                      <FormControlLabel value="non-assignment" control={<Radio size="small" />} label={<Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>Non-assignment <InfoIcon sx={{ fontSize: 14, color: '#9e9e9e' }} /></Box>} sx={{ fontFamily: TYPO.fontFamily }} />
                    </RadioGroup>
                  </Box>
                  <FormControlLabel
                    control={<Checkbox size="small" checked={releaseInfo} onChange={(e) => setReleaseInfo(e.target.checked)} />}
                    label={<Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontFamily: TYPO.fontFamily, fontSize: 14 }}>Release info <InfoIcon sx={{ fontSize: 14, color: '#9e9e9e' }} /></Box>}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowCreateForm(false)}
                  sx={{
                    fontFamily: TYPO.fontFamily,
                    textTransform: 'uppercase',
                    ...TYPO.button,
                    borderColor: '#9e9e9e',
                    color: '#616161',
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSavePolicy}
                  disabled={creating}
                  sx={{
                    fontFamily: TYPO.fontFamily,
                    textTransform: 'uppercase',
                    ...TYPO.button,
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  {creating ? 'Saving...' : 'Save Policy'}
                </Button>
              </Box>
            </Box>
          </LocalizationProvider>
          )
        ) : (
          <Box sx={{ p: 2 }}>
            {inactiveInsurances.map((ins) => {
              const insId = ins._id || ins.id;
              const companyName = getInsuranceCompanyName(ins.insuranceCompanyId);
              const isExpanded = expandedId === insId;
              const policyType = getPolicyTypeLabel(ins.insuranceType);

              return (
                <Box
                  key={insId}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1.5,
                    overflow: 'hidden',
                  }}
                >
                  <Button
                    fullWidth
                    onClick={() => handleToggle(insId)}
                    sx={{
                      fontFamily: TYPO.fontFamily,
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      ...TYPO.button,
                      color: '#424242',
                      py: 1.5,
                      px: 2,
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    startIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  >
                    {policyType}: by {companyName}
                  </Button>
                  <Collapse in={isExpanded}>
                    <Box sx={{ px: 2, pb: 2, pt: 0 }}>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.sectionTitle, mb: 1, display: 'block' }}>
                            Payer Information
                          </Typography>
                          <DetailRow label="Payer Name" value={companyName} />
                          <DetailRow
                            label="Insurance Plan"
                            value={ins.planName ? `${ins.planName} (${ins.policyNumber || ins.groupNumber || '–'})` : `${companyName} (${ins.policyNumber || ins.groupNumber || '–'})`}
                          />
                          <DetailRow label="Group Number" value={ins.groupNumber} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.sectionTitle, mb: 1, display: 'block' }}>
                            Subscriber Information
                          </Typography>
                          <DetailRow
                            label="Patient's Relationship to Subscriber"
                            value={getRelationshipLabel(ins.relationshipToPatient)}
                          />
                          <DetailRow label="Subscriber's Name" value={ins.subscriberName} />
                          <DetailRow
                            label="Subscriber's Birthday"
                            value={ins.subscriberDateOfBirth ? dayjs(ins.subscriberDateOfBirth).format('MM/DD/YYYY') : null}
                          />
                          <DetailRow label="Subscriber's ID" value={ins.policyNumber} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.sectionTitle, mb: 1, display: 'block' }}>
                            Employer Information
                          </Typography>
                          <DetailRow label="Employer Name" value={ins.employerName || ins.employer} />
                          <DetailRow label="Employer Address" value={ins.employerAddress} />
                        </Grid>
                      </Grid>
                    </Box>
                  </Collapse>
                </Box>
              );
            })}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              {isMockData && (
                <Typography sx={{ fontFamily: TYPO.fontFamily, ...TYPO.caption }}>
                  Demo data – replace with backend API when ready
                </Typography>
              )}
              <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                <Button
                  variant="outlined"
                  onClick={onClose}
                  sx={{
                    fontFamily: TYPO.fontFamily,
                    textTransform: 'uppercase',
                    ...TYPO.button,
                    borderColor: '#9e9e9e',
                    color: '#616161',
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreatePolicyClick}
                  disabled={creating}
                  sx={{
                    fontFamily: TYPO.fontFamily,
                    textTransform: 'uppercase',
                    ...TYPO.button,
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  {creating ? 'Creating...' : `Create ${getPolicyTypeLabel(selectedInsurance?.insuranceType || inactiveInsurances[0]?.insuranceType) || 'PRIMARY'} Policy`}
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
