import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSystemSettings,
  updateSystemSetting,
  selectSettingsMap,
  selectLoadingSettings
} from '../../store/slices/clinicalManagementSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';

import syncSvg from '../../assets/claimicons/refreshicon.svg';

import DeleteSvg from '../../assets/practicesetupicon/deleteicon.svg';

import { radius, fontSize, fontWeight } from '../../constants/styles';
import { COLORS } from '../../constants/colors';

import HeaderConfig from '../../components/admin/clinical-management/treatment-plan-presentation/HeaderConfig';
import DisplayConfig from '../../components/admin/clinical-management/treatment-plan-presentation/DisplayConfig';
import PaymentOptionsConfig from '../../components/admin/clinical-management/treatment-plan-presentation/PaymentOptionsConfig';
import AcknowledgmentsConfig from '../../components/admin/clinical-management/treatment-plan-presentation/AcknowledgmentsConfig';
import SyncOfficesDialog from '../../components/admin/clinical-management/products/SyncOfficesDialog';

const dropdownMenuProps = {
  PaperProps: {
    sx: {
      mt: 1,
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      '& .MuiMenuItem-root': {
        fontSize: '13px',
        fontFamily: 'Inter',
        padding: '8px 16px',
        '&:hover': {
          backgroundColor: '#f3f4f6'
        },
        '&.Mui-selected': {
          backgroundColor: '#eff6ff',
          color: '#1d4ed8',
          '&:hover': {
            backgroundColor: '#dbeafe'
          }
        }
      }
    }
  },
  style: { zIndex: 10000 },
  sx: { zIndex: 10000 },
};

const selectStyles = {
  fontFamily: "Inter", 
  fontSize: "13px", 
  borderRadius: "8px", 
  backgroundColor: "#fff",
  color: "#374151", 
  height: "38px",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d5dd" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9ca3af" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3b82f6", borderWidth: "1px" },
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    paddingTop: "0 !important",
    paddingBottom: "0 !important",
    height: "100% !important",
  },
  "& .MuiSelect-icon": {
    color: "#9ca3af",
  }
};

const TreatmentPlanPresentation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();

  const settingsMap = useSelector(selectSettingsMap);
  const loading = useSelector(selectLoadingSettings);

  const [formName, setFormName] = useState('');
  const [activeForm, setActiveForm] = useState('');
  const [savedForms, setSavedForms] = useState([]);
  const [isSyncDialogOpen, setSyncDialogOpen] = useState(false);

  // Form configurations
  const [headerChecks, setHeaderChecks] = useState({ logo: true, phone: true, address: false, website: false, email: false });
  const [displayBy, setDisplayBy] = useState('itemized');
  const [displayPerItem, setDisplayPerItem] = useState({
    dateDiagnosed: true, toothNumber: true, procCode: true, shortDesc: true, officeDesc: false,
    procNote: false, showProcs: true, officeFee: true, newFee: false, billedFee: true,
    contractedFee: true, ptPortion: true, insCoverage: true, insAdj: false, appliedAdj: false, appliedAdjPct: false
  });
  const [totals, setTotals] = useState({ officeFees: false, billedFees: true, contractedFees: true, adjustment: false, ptPortion: true, insCoverage: true });

  // Payment Options States
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [addedPaymentTypes, setAddedPaymentTypes] = useState([]);

  // Acknowledgment Paragraphs state
  const [acknowledgments, setAcknowledgments] = useState([]);

  useEffect(() => {
    dispatch(fetchSystemSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settingsMap) {
      if (settingsMap.clinical_treatment_plan_templates) {
        try {
          const parsed = JSON.parse(settingsMap.clinical_treatment_plan_templates);
          setSavedForms(parsed);
          if (parsed.length > 0) {
            const first = parsed[0];
            setActiveForm(first.name);
            setFormName(first.name);
            setHeaderChecks(first.headerChecks || { logo: true, phone: true });
            setDisplayBy(first.displayBy || 'itemized');
            setDisplayPerItem(first.displayPerItem || {});
            setTotals(first.totals || {});
            setAddedPaymentTypes(first.addedPaymentTypes || []);
            setAcknowledgments(first.acknowledgments || []);
          }
        } catch (e) {
          setSavedForms([]);
        }
      } else {
        setSavedForms([]);
      }
    }
  }, [settingsMap]);

  const handleAddPaymentOption = (type) => {
    const nextIndex = addedPaymentTypes.length + 1;
    const hasVariables = (type === 'Payment Plan' || type === 'Financing');

    const newType = {
      id: Date.now().toString(),
      typeName: `Payment Type ${nextIndex}`,
      kind: type,
      title: '',
      body: '',
      variables: hasVariables ? [
        { name: 'Duration (months)', placeholder: 'Duration (months)', value: '' },
        { name: 'Management Fee (%)', placeholder: 'Management Fee', value: '' },
        { name: 'Down Payment (% of total)', placeholder: 'Down Payment (%', value: '' },
        { name: 'Down Payment', value: 'Auto calculated', isAuto: true },
        { name: 'Monthly Payment', value: 'Auto calculated', isAuto: true }
      ] : []
    };

    setAddedPaymentTypes([...addedPaymentTypes, newType]);
    setDropdownOpen(false);
  };

  const handleTitleChange = (optionId, value) => {
    setAddedPaymentTypes(addedPaymentTypes.map(opt =>
      opt.id === optionId ? { ...opt, title: value } : opt
    ));
  };

  const handleBodyChange = (optionId, value) => {
    setAddedPaymentTypes(addedPaymentTypes.map(opt =>
      opt.id === optionId ? { ...opt, body: value } : opt
    ));
  };

  const handleVariableValueChange = (optionId, varName, value) => {
    setAddedPaymentTypes(addedPaymentTypes.map(opt => {
      if (opt.id === optionId) {
        const updatedVars = opt.variables.map(v =>
          v.name === varName ? { ...v, value: value } : v
        );
        return { ...opt, variables: updatedVars };
      }
      return opt;
    }));
  };

  const handleInsertVariable = (optionId, variableName) => {
    const textarea = document.getElementById(`body-textarea-${optionId}`);
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const textVal = textarea.value;
    const variableText = `{${variableName}}`;

    const newBody = textVal.substring(0, startPos) + variableText + textVal.substring(endPos, textVal.length);

    setAddedPaymentTypes(addedPaymentTypes.map(opt =>
      opt.id === optionId ? { ...opt, body: newBody } : opt
    ));

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = startPos + variableText.length;
    }, 0);
  };

  // Click outside listener for dropdown
  React.useEffect(() => {
    const handleOutsideClick = () => {
      setDropdownOpen(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleAddParagraph = () => {
    setAcknowledgments([...acknowledgments, "New acknowledgment paragraph text here."]);
  };

  const handleDeleteParagraph = (indexToDelete) => {
    setAcknowledgments(acknowledgments.filter((_, idx) => idx !== indexToDelete));
  };

  const handleOpenSyncDialog = () => setSyncDialogOpen(true);
  const handleCloseSyncDialog = () => setSyncDialogOpen(false);

  const handleSaveForm = async () => {
    try {
      const exists = savedForms.some(f => f.name === activeForm);
      let newSavedForms = [];
      const currentFormObj = {
        name: formName || 'Untitled Presentation',
        headerChecks,
        displayBy,
        displayPerItem,
        totals,
        addedPaymentTypes,
        acknowledgments
      };

      if (exists) {
        newSavedForms = savedForms.map(f => f.name === activeForm ? currentFormObj : f);
      } else {
        newSavedForms = [...savedForms, currentFormObj];
      }

      await dispatch(updateSystemSetting({ key: 'clinical_treatment_plan_templates', value: JSON.stringify(newSavedForms) })).unwrap();
      dispatch(fetchSystemSettings());
      setActiveForm(formName || 'Untitled Presentation');
      showSnackbar('Presentation template saved successfully', 'success');
    } catch (e) {
      console.error(e);
      showSnackbar('Failed to save presentation template', 'error');
    }
  };

  const handleDeleteForm = async (formToDelete) => {
    try {
      const filtered = savedForms.filter(f => f.name !== formToDelete);
      await dispatch(updateSystemSetting({ key: 'clinical_treatment_plan_templates', value: JSON.stringify(filtered) })).unwrap();
      dispatch(fetchSystemSettings());
      showSnackbar('Presentation template deleted successfully', 'success');
      if (activeForm === formToDelete) {
        if (filtered.length > 0) {
          const first = filtered[0];
          setActiveForm(first.name);
          setFormName(first.name);
          setHeaderChecks(first.headerChecks || { logo: true, phone: true });
          setDisplayBy(first.displayBy || 'itemized');
          setDisplayPerItem(first.displayPerItem || {});
          setTotals(first.totals || {});
          setAddedPaymentTypes(first.addedPaymentTypes || []);
          setAcknowledgments(first.acknowledgments || []);
        } else {
          setActiveForm('');
          setFormName('');
        }
      }
    } catch (e) {
      console.error(e);
      showSnackbar('Failed to delete presentation template', 'error');
    }
  };

  const handleCreateNewForm = () => {
    const newName = `New Presentation ${Date.now().toString().slice(-4)}`;
    const newForm = {
      isNew: true,
      name: newName,
      headerChecks: { logo: true, phone: true, address: false, website: false, email: false },
      displayBy: 'itemized',
      displayPerItem: {
        dateDiagnosed: true, toothNumber: true, procCode: true, shortDesc: true, officeDesc: false,
        procNote: false, showProcs: true, officeFee: true, newFee: false, billedFee: true,
        contractedFee: true, ptPortion: true, insCoverage: true, insAdj: false, appliedAdj: false, appliedAdjPct: false
      },
      totals: { officeFees: false, billedFees: true, contractedFees: true, adjustment: false, ptPortion: true, insCoverage: true },
      addedPaymentTypes: [],
      acknowledgments: ["This estimate is valid for 90 days from the date of this letter."]
    };
    setSavedForms([...savedForms, newForm]);
    setActiveForm(newName);
    setFormName(newName);
    setHeaderChecks(newForm.headerChecks);
    setDisplayBy(newForm.displayBy);
    setDisplayPerItem(newForm.displayPerItem);
    setTotals(newForm.totals);
    setAddedPaymentTypes(newForm.addedPaymentTypes);
    setAcknowledgments(newForm.acknowledgments);
  };

  const handleRefresh = () => {
    dispatch(fetchSystemSettings());
  };

  const originalForm = savedForms.find(f => f.name === activeForm) || null;
  const currentFormObj = {
    name: formName || 'Untitled Presentation',
    headerChecks,
    displayBy,
    displayPerItem,
    totals,
    addedPaymentTypes,
    acknowledgments
  };
  
  const isDirty = originalForm ? (originalForm.isNew || JSON.stringify(originalForm) !== JSON.stringify(currentFormObj)) : true;

  return (
    <Box sx={{ backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh', pb: 5 }}>
      {/* Header Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', px: 4, pt: 4, mb: 4 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>Treatment Plan Presentation</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mt: 0.5 }}>
            Configure and manage the treatment plan presentation templates for your practice.
          </Typography>
        </Box>

        {/* Action Icons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            startIcon={<RefreshIcon sx={{ fontSize: '16px' }} />}
            size="small"
            variant="outlined"
            onClick={handleRefresh}
            sx={{
              textTransform: 'none',
              color: '#1e293b',
              borderColor: '#e2e8f0',
              fontWeight: 600,
              borderRadius: 2,
              height: 36,
              px: 2,
              '&:hover': { backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }
            }}
          >
            Refresh
          </Button>
          <Button
            startIcon={<img src={syncSvg} alt="Sync" style={{ width: 16, height: 16 }} />}
            size="small"
            variant="outlined"
            onClick={handleOpenSyncDialog}
            sx={{
              textTransform: 'none',
              color: '#1e293b',
              borderColor: '#e2e8f0',
              fontWeight: 600,
              borderRadius: 2,
              height: 36,
              px: 2,
              '&:hover': { backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }
            }}
          >
            Sync
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>Loading configurations...</Typography>
        </Box>
      ) : (
        <Box sx={{ px: 4 }}>
          <Grid container spacing={4}>
            {/* Left Column: Form Configuration */}
            <Grid size={{ xs: 12, md: 9 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>Form Name:</Typography>
                <TextField
                  size="small"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  sx={{
                    width: 350,
                    '& .MuiInputBase-input': { fontSize: '0.9rem', py: 1, backgroundColor: '#fff' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0', borderRadius: 2 }
                  }}
                />
              </Box>

              <HeaderConfig headerChecks={headerChecks} setHeaderChecks={setHeaderChecks} />

              <DisplayConfig
                displayBy={displayBy}
                setDisplayBy={setDisplayBy}
                displayPerItem={displayPerItem}
                setDisplayPerItem={setDisplayPerItem}
                totals={totals}
                setTotals={setTotals}
              />

              <PaymentOptionsConfig
                addedPaymentTypes={addedPaymentTypes}
                setAddedPaymentTypes={setAddedPaymentTypes}
                handleAddPaymentOption={handleAddPaymentOption}
                handleTitleChange={handleTitleChange}
                handleBodyChange={handleBodyChange}
                handleVariableValueChange={handleVariableValueChange}
                handleInsertVariable={handleInsertVariable}
              />

              <AcknowledgmentsConfig
                acknowledgments={acknowledgments}
                setAcknowledgments={setAcknowledgments}
                handleDeleteParagraph={handleDeleteParagraph}
                handleAddParagraph={handleAddParagraph}
              />

              {/* Signature Section */}
              <Box sx={{ mb: 4, p: 3, backgroundColor: '#fff', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '1.05rem', mb: 2 }}>
                  Signature Requirements
                </Typography>
                <Box sx={{ display: 'flex', gap: 6 }}>
                  <FormControlLabel control={<Checkbox size="small" checked sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Patient/Guardian</Typography>} />
                  <FormControlLabel control={<Checkbox size="small" checked sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Office</Typography>} />
                </Box>
              </Box>

              {/* Bottom Footer Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleRefresh}
                  sx={{
                    textTransform: 'none',
                    borderRadius: radius.md,
                    fontFamily: 'Inter',
                    fontSize: fontSize.base,
                    fontWeight: fontWeight.semibold,
                    color: COLORS.TEXT_MUTED,
                    borderColor: COLORS.BORDER,
                    px: 5,
                    '&:hover': { backgroundColor: COLORS.BACKGROUND, borderColor: COLORS.TEXT_MUTED }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  disableElevation
                  disabled={!isDirty}
                  onClick={handleSaveForm}
                  sx={{
                    textTransform: 'none',
                    borderRadius: radius.md,
                    fontFamily: 'Inter',
                    fontSize: fontSize.base,
                    fontWeight: fontWeight.semibold,
                    backgroundColor: COLORS.ACCENT,
                    color: COLORS.WHITE,
                    px: 5,
                    '&:hover': { backgroundColor: COLORS.ACCENT_HOVER },
                    '&.Mui-disabled': { backgroundColor: COLORS.TEXT_MUTED, color: COLORS.BACKGROUND }
                  }}
                >
                  Save
                </Button>
              </Box>
            </Grid>

            {/* Right Column: Management Sidebar */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Button
                variant="contained"
                disableElevation
                fullWidth
                onClick={handleCreateNewForm}
                sx={{
                  textTransform: 'none',
                  borderRadius: radius.md,
                  fontFamily: 'Inter',
                  fontSize: fontSize.base,
                  fontWeight: fontWeight.semibold,
                  backgroundColor: COLORS.ACCENT,
                  color: COLORS.WHITE,
                  mb: 3,
                  py: 1.2,
                  '&:hover': { backgroundColor: COLORS.ACCENT_HOVER }
                }}
              >
                + Create new Presentation
              </Button>

              <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mb: 0.5, fontWeight: 600, textTransform: 'uppercase' }}>Sort By</Typography>
                  <Select fullWidth size="small" value="Created Date" IconComponent={KeyboardArrowDownIcon} MenuProps={dropdownMenuProps} sx={selectStyles}>
                    <MenuItem value="Created Date">Created Date</MenuItem>
                  </Select>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mb: 0.5 }}>&nbsp;</Typography>
                  <Select fullWidth size="small" value="Descending" IconComponent={KeyboardArrowDownIcon} MenuProps={dropdownMenuProps} sx={selectStyles}>
                    <MenuItem value="Descending">Descending</MenuItem>
                  </Select>
                </Box>
              </Box>

              <Box sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Saved Templates</Typography>
                </Box>
                <Box>
                  {savedForms.map((form) => (
                    <Box
                      key={form.name}
                      onClick={() => {
                        setActiveForm(form.name);
                        setFormName(form.name);
                        setHeaderChecks(form.headerChecks || {});
                        setDisplayBy(form.displayBy || 'itemized');
                        setDisplayPerItem(form.displayPerItem || {});
                        setTotals(form.totals || {});
                        setAddedPaymentTypes(form.addedPaymentTypes || []);
                        setAcknowledgments(form.acknowledgments || []);
                      }}
                      sx={{
                        p: 2,
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        backgroundColor: activeForm === form.name ? '#f0f9ff' : 'transparent',
                        color: activeForm === form.name ? '#0f172a' : '#475569',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: '0.2s',
                        '&:hover': { backgroundColor: activeForm === form.name ? '#e0f2fe' : '#f8fafc' },
                        position: 'relative',
                        '&::before': activeForm === form.name ? {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '4px',
                          backgroundColor: '#3b82f6'
                        } : {}
                      }}
                    >
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: activeForm === form.name ? 600 : 500, flex: 1, pr: 1, pl: activeForm === form.name ? 1 : 0 }}>
                        {form.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenSyncDialog(); }} sx={{ p: 0.5, color: '#94a3b8', '&:hover': { color: '#3b82f6', backgroundColor: '#e0f2fe' } }}>
                          <img src={syncSvg} alt="Sync" width="16" height="16" style={{ opacity: 0.8 }} />
                        </IconButton>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteForm(form.name); }} sx={{ p: 0.5, color: '#94a3b8', '&:hover': { color: '#ef4444', backgroundColor: '#fee2e2' } }}>
                          <img src={DeleteSvg} alt="Delete" width="16" height="16" style={{ opacity: 0.8 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Sync Dialog */}
      <SyncOfficesDialog open={isSyncDialogOpen} onClose={handleCloseSyncDialog} />
    </Box>
  );
};

export default TreatmentPlanPresentation;
