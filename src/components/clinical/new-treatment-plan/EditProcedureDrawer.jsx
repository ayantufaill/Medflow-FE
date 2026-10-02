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
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius, roundedAutocompletePaperSx, roundedSelectMenuProps, standardFieldSx } from '../../../constants/styles';

const STATUS_OPTIONS = ['Planned', 'Scheduled', 'Unplanned', 'Rejected', 'Existing Current', 'Existing Other', 'Referred', 'Completed'];
const PROGNOSIS_OPTIONS = ['Excellent', 'Good', 'Fair', 'Poor', 'Questionable', 'Hopeless'];
const SITE_OPTIONS = ['Tooth/Surface', 'Arch', 'Quadrant', 'Mouth', 'None'];

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
  const providersList = useSelector(selectProviderDropdownList) || [];
  const procedureCodes = useSelector(selectProcedureCodes) || [];
  const procedureCodesLoading = useSelector(selectProcedureCodesLoading);

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

  const procedureCodeOptions = useMemo(() => {
    const currentCode = procedure?.icd && procedure.icd !== '-' ? String(procedure.icd) : '';
    const hasCurrent = procedureCodes.some((code) => String(code.ProcCode || code.code) === currentCode);
    return hasCurrent || !currentCode
      ? procedureCodes
      : [{ ProcCode: currentCode, Descript: currentCode }, ...procedureCodes];
  }, [procedureCodes, procedure?.icd]);

  const [form, setForm] = useState({
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
      status: procedure.status || 'Planned',
      provider: getProviderValue(procedure.provider),
      prognosis: procedure.prognosis || '',
      icd: procedure.icd && procedure.icd !== '-' ? procedure.icd : '',
      dateOfProcedure: procedure.scheduled && procedure.scheduled !== '-' ? procedure.scheduled : (procedure.created || ''),
      creditToPractice: Boolean(procedure.creditToPractice),
      siteSelection: procedure.siteSelection || inferSiteSelection(procedure)
    });
  }, [procedure]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!procedure) return;
    onSave({
      ...procedure,
      status: form.status,
      provider: form.provider || null,
      prognosis: form.prognosis,
      icd: form.icd || '-',
      scheduled: form.dateOfProcedure || '-',
      creditToPractice: form.creditToPractice,
      siteSelection: form.siteSelection
    });
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
          maxWidth: '100%',
          bgcolor: COLORS.SURFACE_PAGE
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ px: 2.5, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: `1px solid ${COLORS.BORDER}`, bgcolor: COLORS.SURFACE_TINT, flexShrink: 0 }}>
          <Box sx={{ width: 34, height: 34, borderRadius: radius.md, bgcolor: COLORS.ACCENT_BG, color: COLORS.ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
              Edit Procedure
            </Typography>
            <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, mt: 0.25 }}>
              Update treatment details and clinical metadata
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ width: 32, height: 32, borderRadius: radius.md, color: COLORS.TEXT_SECONDARY, '&:hover': { bgcolor: COLORS.SURFACE_INPUT, color: COLORS.TEXT_PRIMARY } }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ ...sectionSx, p: 2, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                <Chip
                  label={procedure?.code || '-'}
                  size="small"
                  sx={{ height: 24, borderRadius: radius.sm, bgcolor: COLORS.ACCENT_BG, color: COLORS.ACCENT, fontSize: fontSize.base, fontWeight: fontWeight.bold }}
                />
                <Chip
                  label={form.status || 'Planned'}
                  size="small"
                  sx={{ height: 24, borderRadius: radius.sm, bgcolor: COLORS.SURFACE_INPUT, color: COLORS.TEXT_SECONDARY, fontSize: fontSize.base, fontWeight: fontWeight.medium }}
                />
              </Box>
              <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 0.5 }}>
                {procedure?.code || '-'}
              </Typography>
              <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY, lineHeight: 1.5 }}>
                {procedure?.description || '-'}
              </Typography>
            </Box>
            <IconButton size="small" sx={{ width: 32, height: 32, borderRadius: radius.md, color: COLORS.ACCENT, bgcolor: COLORS.ACCENT_BG, '&:hover': { bgcolor: 'rgba(35, 98, 239, 0.16)' } }}>
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
                  options={procedureCodeOptions}
                  loading={procedureCodesLoading}
                  value={procedureCodeOptions.find((code) => String(code.ProcCode || code.code) === form.icd) || null}
                  onChange={(_, value) => handleChange('icd', value ? String(value.ProcCode || value.code || '') : '')}
                  getOptionLabel={(option) => {
                    if (!option) return '';
                    const code = option.ProcCode || option.code || '';
                    const description = option.Descript || option.description || option.name || option.AbbrDesc || '';
                    return description ? `${code} - ${description}` : String(code);
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
                      placeholder="Select"
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

        <Box sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.BORDER}`, bgcolor: COLORS.SURFACE_FOOTER, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.25, flexShrink: 0 }}>
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
