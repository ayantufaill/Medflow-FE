import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Checkbox,
  CircularProgress,
  Drawer,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../store/slices/providerSlice';
import { fetchProcedureCodes, selectProcedureCodes, selectProcedureCodesLoading } from '../../../store/slices/feeGuideSlice';
import { icd10Service } from '../../../services/icd10.service';
import { normalizeIcd10Code } from '../../../utils/icd10';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius, roundedAutocompletePaperSx, roundedSelectMenuProps, standardFieldSx } from '../../../constants/styles';

const STATUS_OPTIONS = ['Planned', 'Scheduled', 'Unplanned', 'Rejected', 'Existing Current', 'Existing Other', 'Referred', 'Completed'];
const PROGNOSIS_OPTIONS = ['Excellent', 'Good', 'Fair', 'Poor', 'Questionable', 'Hopeless'];
const SITE_OPTIONS = ['Tooth/Surface', 'Arch', 'Quadrant', 'Mouth', 'None'];
const EMPTY_OPTIONS = [];

const fieldSx = {
  ...standardFieldSx,
  '& .MuiOutlinedInput-root': {
    ...standardFieldSx['& .MuiOutlinedInput-root'],
    height: '42px',
    backgroundColor: COLORS.SURFACE_INPUT,
  },
  '& .MuiOutlinedInput-input': { padding: '8px 12px', fontSize: fontSize.md },
  '& .MuiSelect-select': { display: 'flex', alignItems: 'center' },
};

const labelSx = {
  mb: 0.75,
  fontSize: fontSize.base,
  fontWeight: fontWeight.semibold,
  color: COLORS.TEXT_SECONDARY
};

const mutedLabelSx = {
  ...labelSx,
  color: COLORS.TEXT_MUTED
};

const sectionSx = {
  border: `1px solid ${COLORS.BORDER}`,
  borderRadius: radius.lg,
  bgcolor: COLORS.SURFACE_CARD,
  overflow: 'hidden'
};

const sectionHeaderSx = {
  px: 2,
  py: 1.5,
  bgcolor: COLORS.SURFACE_TINT,
  borderBottom: `1px solid ${COLORS.BORDER}`,
  fontSize: fontSize.lg,
  fontWeight: fontWeight.bold,
  color: COLORS.TEXT_PRIMARY
};

const drawerMenuProps = {
  ...roundedSelectMenuProps,
  sx: { zIndex: 1500 },
  PaperProps: {
    ...roundedSelectMenuProps.PaperProps,
    sx: {
      ...roundedSelectMenuProps.PaperProps?.sx,
      zIndex: 1501,
    },
  },
};

const getProviderValue = (provider) => {
  if (!provider || provider === '-') return '';
  if (typeof provider === 'object') return String(provider._id || provider.id || provider.providerCode || provider.ProvNum || '');
  return String(provider);
};

const getProviderLabel = (provider) => {
  const first = provider.userId?.firstName || provider.firstName || provider.FName || '';
  const last = provider.userId?.lastName || provider.lastName || provider.LName || '';
  return `${first} ${last}`.trim() || provider.providerCode || provider._id || provider.id || 'Unknown';
};

const inferSiteSelection = (procedure) => {
  const site = String(procedure?.site || '').trim();
  if (!site || site === '-') return 'Mouth';
  if (site.includes('#') || procedure?.tooth) return 'Tooth/Surface';
  return 'Mouth';
};

const EditProcedureDrawer = ({ open, procedure, onClose, onSave }) => {
  const dispatch = useDispatch();
  const providersList = useSelector(selectProviderDropdownList) || EMPTY_OPTIONS;
  const procedureCodes = useSelector(selectProcedureCodes) || EMPTY_OPTIONS;
  const procedureCodesLoading = useSelector(selectProcedureCodesLoading);
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);
  const [icdCodes, setIcdCodes] = useState([]);
  const [icdSearch, setIcdSearch] = useState('');
  const [icdLoading, setIcdLoading] = useState(false);
  const [icdError, setIcdError] = useState('');
  const [savedIcdOption, setSavedIcdOption] = useState(null);

  useEffect(() => {
    if (!open) return;
    if (providersList.length === 0) {
      dispatch(fetchAllProvidersForDropdown());
    }
    if (procedureCodes.length === 0 && !procedureCodesLoading) {
      dispatch(fetchProcedureCodes({ limit: 2000 }));
    }
  }, [dispatch, open, providersList.length, procedureCodes.length, procedureCodesLoading]);

  const providerOptions = useMemo(() => {
    const currentProvider = getProviderValue(procedure?.provider);
    const hasCurrent = providersList.some((provider) => String(provider._id || provider.id || provider.providerCode || provider.ProvNum) === currentProvider);
    return hasCurrent || !currentProvider
      ? providersList
      : [{ _id: currentProvider, providerCode: currentProvider }, ...providersList];
  }, [providersList, procedure?.provider]);

  const [form, setForm] = useState({
    code: '',
    description: '',
    status: 'Planned',
    provider: '',
    prognosis: '',
    icd: '',
    dateOfProcedure: '',
    creditToPractice: false,
    siteSelection: 'Mouth'
  });

  useEffect(() => {
    if (!procedure) return;
    setForm({
      code: procedure.code && procedure.code !== '-' ? procedure.code : '',
      description: procedure.description && procedure.description !== '-' ? procedure.description : '',
      status: procedure.status || 'Planned',
      provider: getProviderValue(procedure.provider),
      prognosis: procedure.prognosis || '',
      icd: procedure.icd && procedure.icd !== '-' ? String(procedure.icd) : '',
      dateOfProcedure: procedure.scheduled && procedure.scheduled !== '-' ? procedure.scheduled : (procedure.created || ''),
      creditToPractice: Boolean(procedure.creditToPractice),
      siteSelection: procedure.siteSelection || inferSiteSelection(procedure)
    });
    setIsHeaderEditing(false);
    setIcdSearch('');
  }, [procedure]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    setIcdLoading(true);
    setIcdError('');
    const timer = setTimeout(async () => {
      try {
        const result = await icd10Service.search({ search: icdSearch, signal: controller.signal });
        if (!controller.signal.aborted) setIcdCodes(result.data || []);
      } catch (error) {
        if (!controller.signal.aborted) {
          setIcdCodes([]);
          setIcdError(error.response?.data?.message || 'Could not load ICD codes. Reopen the drawer to retry.');
        }
      } finally {
        if (!controller.signal.aborted) setIcdLoading(false);
      }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [open, icdSearch]);

  useEffect(() => {
    setSavedIcdOption(null);
    const code = normalizeIcd10Code(procedure?.icd);
    if (!open || !code) return;
    const controller = new AbortController();
    icd10Service.search({ code, signal: controller.signal }).then(result => {
      if (!controller.signal.aborted) setSavedIcdOption(result.data?.[0] || null);
    }).catch(() => {});
    return () => controller.abort();
  }, [open, procedure?.icd]);

  const selectedIcdOption = useMemo(() => {
    if (!form.icd) return null;
    return icdCodes.find(item => item.code === form.icd)
      || (savedIcdOption?.code === form.icd ? savedIcdOption : null)
      || { code: form.icd, description: '' };
  }, [form.icd, icdCodes, savedIcdOption]);
  const icdOptions = useMemo(() => selectedIcdOption && !icdCodes.some(item => item.code === selectedIcdOption.code)
    ? [selectedIcdOption, ...icdCodes] : icdCodes, [icdCodes, selectedIcdOption]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!procedure) return;
    onSave({
      ...procedure,
      code: form.code || procedure.code || '-',
      description: form.description || procedure.description || '-',
      status: form.status,
      provider: form.provider || null,
      prognosis: form.prognosis,
      icd: form.icd || null,
      scheduled: form.dateOfProcedure || '-',
      creditToPractice: form.creditToPractice,
      siteSelection: form.siteSelection
    });
  };

  const handleProcedureCodeChange = (value) => {
    const nextCode = value ? String(value.ProcCode || value.code || '') : '';
    const nextDescription = value
      ? String(value.Descript || value.description || value.name || value.AbbrDesc || '')
      : '';
    setForm((prev) => ({
      ...prev,
      code: nextCode,
      description: nextDescription || prev.description
    }));
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ zIndex: 1400 }}
      PaperProps={{
        sx: {
          width: { xs: '100%', md: 860 },
          maxWidth: '100%'
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{
          boxSizing: "border-box",
          px: "25px",
          py: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}>
          <EditOutlinedIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 600,
              color: COLORS.TEXT_PRIMARY,
              flex: 1,
            }}
          >
            Edit Procedure
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
            <CloseIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ ...sectionSx, p: 2, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                <Chip
                  label={form.code || '-'}
                  size="small"
                  sx={{ height: 24, borderRadius: radius.sm, bgcolor: COLORS.ACCENT_BG, color: COLORS.ACCENT, fontSize: fontSize.base, fontWeight: fontWeight.bold }}
                />
                <Chip
                  label={form.status || 'Planned'}
                  size="small"
                  sx={{ height: 24, borderRadius: radius.sm, bgcolor: COLORS.SURFACE_INPUT, color: COLORS.TEXT_SECONDARY, fontSize: fontSize.base, fontWeight: fontWeight.medium }}
                />
              </Box>
              {isHeaderEditing ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '220px 1fr' }, gap: 1.5, mt: 1 }}>
                  <Autocomplete
                    openOnFocus
                    popupIcon={<KeyboardArrowDownIcon sx={{ color: COLORS.TEXT_SECONDARY }} />}
                    options={procedureCodes}
                    loading={procedureCodesLoading}
                    value={procedureCodes.find((code) => String(code.ProcCode || code.code) === form.code) || null}
                    inputValue={form.code}
                    onInputChange={(_, value, reason) => {
                      if (reason !== 'reset') handleChange('code', value);
                    }}
                    onChange={(_, value) => handleProcedureCodeChange(value)}
                    getOptionLabel={(option) => {
                      if (typeof option === 'string') return option;
                      return String(option?.ProcCode || option?.code || '');
                    }}
                    isOptionEqualToValue={(option, value) => String(option.ProcCode || option.code) === String(value.ProcCode || value.code)}
                    renderOption={(props, option) => {
                      const { key, ...restProps } = props;
                      return (
                        <Box component="li" key={key} {...restProps} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: '6px !important' }}>
                          <Typography sx={{ minWidth: 72, fontSize: fontSize.md, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
                            {option.ProcCode || option.code}
                          </Typography>
                          <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY }}>
                            {option.Descript || option.description || option.name || option.AbbrDesc || ''}
                          </Typography>
                        </Box>
                      );
                    }}
                    slotProps={{ popper: { sx: { zIndex: 1500 } }, paper: { sx: roundedAutocompletePaperSx } }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        autoFocus
                        placeholder="Code"
                        sx={fieldSx}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {procedureCodesLoading ? <CircularProgress color="inherit" size={14} sx={{ mr: 0.75 }} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                  <TextField
                    fullWidth
                    value={form.description}
                    onChange={(event) => handleChange('description', event.target.value)}
                    placeholder="Description"
                    sx={fieldSx}
                  />
                </Box>
              ) : (
                <>
                  <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 0.5 }}>
                    {form.code || '-'}
                  </Typography>
                  <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY, lineHeight: 1.5 }}>
                    {form.description || '-'}
                  </Typography>
                </>
              )}
            </Box>
            <IconButton
              size="small"
              aria-label="Edit procedure code and description"
              onClick={() => setIsHeaderEditing((prev) => !prev)}
              sx={{ width: 32, height: 32, borderRadius: radius.md, color: COLORS.ACCENT, bgcolor: COLORS.ACCENT_BG, '&:hover': { bgcolor: 'rgba(35, 98, 239, 0.16)' } }}
            >
              <EditOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          <Box sx={sectionSx}>
            <Typography sx={sectionHeaderSx}>Procedure Details</Typography>
            <Box sx={{ p: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, columnGap: 2, rowGap: 2 }}>
              <Box>
                <Typography sx={labelSx}>Status <Box component="span" sx={{ color: COLORS.STATUS_ERROR }}>*</Box></Typography>
                <FormControl fullWidth>
                  <Select value={form.status} onChange={(event) => handleChange('status', event.target.value)} IconComponent={KeyboardArrowDownIcon} sx={fieldSx} MenuProps={drawerMenuProps}>
                    {STATUS_OPTIONS.map((status) => <MenuItem key={status} value={status} sx={{ fontSize: '0.8rem' }}>{status}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Typography sx={labelSx}>Provider <Box component="span" sx={{ color: COLORS.STATUS_ERROR }}>*</Box></Typography>
                <FormControl fullWidth>
                  <Select value={form.provider} onChange={(event) => handleChange('provider', event.target.value)} displayEmpty IconComponent={KeyboardArrowDownIcon} sx={fieldSx} MenuProps={drawerMenuProps}>
                    <MenuItem value="">Select</MenuItem>
                    {providerOptions.map((provider) => {
                      const value = String(provider._id || provider.id || provider.providerCode);
                      return <MenuItem key={value} value={value}>{getProviderLabel(provider)}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Typography sx={labelSx}>Prognosis</Typography>
                <FormControl fullWidth>
                  <Select value={form.prognosis} onChange={(event) => handleChange('prognosis', event.target.value)} displayEmpty IconComponent={KeyboardArrowDownIcon} sx={fieldSx} MenuProps={drawerMenuProps}>
                    <MenuItem value="">Select</MenuItem>
                    {PROGNOSIS_OPTIONS.map((prognosis) => <MenuItem key={prognosis} value={prognosis}>{prognosis}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Typography sx={labelSx}>ICD Codes</Typography>
                <Autocomplete
                  openOnFocus
                  popupIcon={<KeyboardArrowDownIcon sx={{ color: COLORS.TEXT_SECONDARY }} />}
                  options={icdOptions}
                  loading={icdLoading}
                  value={selectedIcdOption}
                  filterOptions={(options) => options}
                  onInputChange={(_, value, reason) => { if (reason === 'input' || reason === 'clear') setIcdSearch(value); }}
                  onChange={(_, value) => { setSavedIcdOption(value); setIcdSearch(''); handleChange('icd', value?.code || ''); }}
                  noOptionsText={icdError || 'No ICD codes found'}
                  getOptionLabel={(option) => {
                    if (!option) return '';
                    const code = option.code || '';
                    const description = option.description || '';
                    return description ? `${code} - ${description}` : String(code);
                  }}
                  isOptionEqualToValue={(option, value) => option.code === value.code}
                  renderOption={(props, option) => {
                    const { key, ...restProps } = props;
                    return (
                      <Box component="li" key={key} {...restProps} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: '6px !important' }}>
                        <Typography sx={{ minWidth: 72, fontSize: fontSize.md, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
                          {option.code}
                        </Typography>
                        <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY }}>
                          {option.description || ''}
                        </Typography>
                      </Box>
                    );
                  }}
                  slotProps={{ popper: { sx: { zIndex: 1500 } }, paper: { sx: roundedAutocompletePaperSx } }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search ICD code or description"
                      error={Boolean(icdError)}
                      helperText={icdError || 'Search the complete ICD-10 catalogue'}
                      sx={fieldSx}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {icdLoading ? <CircularProgress color="inherit" size={14} sx={{ mr: 0.75 }} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Box>

              <Box>
                <Typography sx={mutedLabelSx}>Date of Procedure</Typography>
                <TextField
                  fullWidth
                  value={form.dateOfProcedure}
                  onChange={(event) => handleChange('dateOfProcedure', event.target.value)}
                  sx={fieldSx}
                  InputProps={{ endAdornment: <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: COLORS.TEXT_MUTED }} /> }}
                />
              </Box>

              <Box>
                <Typography sx={labelSx}>Credit to Practice</Typography>
                <FormControlLabel
                  control={<Checkbox checked={form.creditToPractice} onChange={(event) => handleChange('creditToPractice', event.target.checked)} sx={{ color: COLORS.TEXT_MUTED, '&.Mui-checked': { color: COLORS.ACCENT } }} />}
                  label={<Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_BODY }}>Yes</Typography>}
                />
              </Box>
            </Box>
          </Box>

          <Box sx={sectionSx}>
            <Typography sx={sectionHeaderSx}>Site Selection</Typography>
            <RadioGroup
              row
              value={form.siteSelection}
              onChange={(event) => handleChange('siteSelection', event.target.value)}
              sx={{ p: 2, gap: 1, flexWrap: 'wrap' }}
            >
              {SITE_OPTIONS.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio sx={{ p: 0.5, color: COLORS.TEXT_MUTED, '&.Mui-checked': { color: COLORS.ACCENT } }} />}
                  label={<Typography sx={{ fontSize: fontSize.md, color: form.siteSelection === option ? COLORS.ACCENT : COLORS.TEXT_SECONDARY, fontWeight: form.siteSelection === option ? fontWeight.semibold : fontWeight.regular }}>{option}</Typography>}
                  sx={{
                    m: 0,
                    px: 1.25,
                    py: 0.75,
                    borderRadius: radius.md,
                    border: `1px solid ${form.siteSelection === option ? COLORS.ACCENT : COLORS.BORDER}`,
                    bgcolor: form.siteSelection === option ? COLORS.ACCENT_BG : COLORS.SURFACE_INPUT,
                    '&:hover': { bgcolor: form.siteSelection === option ? COLORS.ACCENT_BG : COLORS.SURFACE_HOVER }
                  }}
                />
              ))}
            </RadioGroup>
          </Box>
        </Box>

        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1.5, bgcolor: '#fff', borderTop: `1px solid ${COLORS.BORDER}`, flexShrink: 0 }}>
          <Button onClick={onClose} variant="outlined" sx={{ minWidth: 112, height: 38, borderRadius: radius.md, borderColor: COLORS.BORDER, color: COLORS.TEXT_BODY, textTransform: 'none', fontWeight: fontWeight.semibold, '&:hover': { borderColor: COLORS.TEXT_MUTED, bgcolor: COLORS.SURFACE_HOVER } }}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" sx={{ minWidth: 112, height: 38, borderRadius: radius.md, bgcolor: COLORS.ACCENT, boxShadow: 'none', textTransform: 'none', fontWeight: fontWeight.semibold, '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' } }}>
            Save
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default EditProcedureDrawer;
