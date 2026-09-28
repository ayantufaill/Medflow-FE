import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Checkbox, Select,
  MenuItem, TextField, Autocomplete, DialogTitle, IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';
import { useSnackbar } from '../../contexts/SnackbarContext';

// Redux — providers & patients
import {
  fetchAllProvidersForDropdown,
  selectProviderDropdownList,
} from '../../store/slices/providerSlice';
import {
  fetchPatients,
  selectPatientList,
  fetchPatientInsurances,
  selectPatientInsurancesCache,
} from '../../store/slices/patientSlice';

// Redux — claims (invoice fetching + submission)
import {
  fetchDraftInvoicesForClaim,
  createManualClaim,
  toggleInvoiceChecked,
  toggleLineItemChecked,
  invalidateDraftInvoices,
  selectDraftInvoicesForPatient,
  selectDraftInvoicesLoading,
  selectClaimLoading,
} from '../../store/slices/claimSlice';

const DROPDOWN_MENU_PROPS = {
  disablePortal: true,
  anchorOrigin: { vertical: "bottom", horizontal: "left" },
  transformOrigin: { vertical: "top", horizontal: "left" },
  PaperProps: {
    sx: {
      bgcolor: '#fff',
      '& .MuiMenuItem-root': { fontSize: '12px', py: 0.5 },
    },
  },
};

const getProviderName = (p) => {
  if (p?.userId?.firstName || p?.userId?.lastName) {
    return `${p.userId.firstName || ''} ${p.userId.lastName || ''}`.trim();
  }
  return `${p?.firstName || ''} ${p?.lastName || ''}`.trim() || p?.name || 'Provider';
};

const ManualClaimDialog = ({ patient, onClose }) => {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();

  // ── Redux state ──────────────────────────────────────────────────────────
  const providers = useSelector(selectProviderDropdownList);
  const patients = useSelector(selectPatientList);
  const insurancesCache = useSelector(selectPatientInsurancesCache);
  const invoicesLoading = useSelector(selectDraftInvoicesLoading);
  const isSubmitting = useSelector(selectClaimLoading);

  // ── Local form state ─────────────────────────────────────────────────────
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [note, setNote] = useState('');
  const [showNote, setShowNote] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(patient?._id || patient?.id || '');
  const [selectedInsuranceId, setSelectedInsuranceId] = useState('');
  const [selectedTreatingProvider, setSelectedTreatingProvider] = useState('');
  const [selectedBillingEntity, setSelectedBillingEntity] = useState('');
  const [claimType, setClaimType] = useState('Manual');

  // ── Derived values ───────────────────────────────────────────────────────
  const patientId = selectedPatientId || patient?._id || patient?.id;

  // Memoised selector for the current patient's draft invoices
  const rawInvoices = useSelector(selectDraftInvoicesForPatient(patientId));
  const invoices = React.useMemo(() => {
    return (rawInvoices || [])
      .map(inv => ({
        ...inv,
        lineItems: (inv.lineItems || []).filter(item => {
          if (item.dbi) return false;
          const writeoff = Number(item.writeoff || 0);
          const ins = Number(item.insPortion || item.insurance || 0);
          const pt = Number(item.ptPortion || 0);
          const total = Number(item.total || item.totalPrice || 0);
          const patientBal = pt > 0 ? pt : ins > 0 ? 0 : Math.max(0, total - writeoff - ins);
          return !(patientBal > 0 && ins === 0);
        })
      }))
      .filter(inv => inv.lineItems.length > 0);
  }, [rawInvoices]);
  const activeInsurances = patientId && insurancesCache?.[patientId]
    ? (insurancesCache[patientId].data || []).filter((ins) => ins.isActive !== false)
    : [];

  // ── Bootstrap dropdowns ──────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
    dispatch(fetchPatients({ limit: 50 }));
  }, [dispatch]);

  // Fetch insurances for whichever patient is selected
  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientInsurances({ patientId }));
    }
  }, [dispatch, patientId]);

  // Fetch (or use cached) draft invoices whenever the effective patient changes
  useEffect(() => {
    if (!patientId) return;
    dispatch(fetchDraftInvoicesForClaim(patientId));
  }, [dispatch, patientId]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handlePatientSearch = (_e, val) => {
    if (val !== undefined && val !== null) {
      dispatch(fetchPatients({ search: val, limit: 50 }));
    }
  };

  const handlePatientChange = (_, newVal) => {
    const newId = newVal ? (newVal._id || newVal.id) : '';
    // Evict cached invoices so the new patient's invoices load fresh
    if (newId !== patientId) {
      dispatch(invalidateDraftInvoices(patientId));
    }
    setSelectedPatientId(newId);
    setSelectedInsuranceId('');
  };

  const handleInvoiceToggle = (invoiceId) => {
    dispatch(toggleInvoiceChecked({ patientId, invoiceId }));
  };

  const handleProcedureToggle = (invoiceId, itemId) => {
    dispatch(toggleLineItemChecked({ patientId, invoiceId, itemId }));
  };

  const handleSendToBatch = async () => {
    if (!selectedInsuranceId) {
      showSnackbar('Please select an insurance plan.', 'warning');
      return;
    }
    if (!selectedTreatingProvider) {
      showSnackbar('Please select a treating provider.', 'warning');
      return;
    }
    if (!selectedBillingEntity) {
      showSnackbar('Please select a billing entity.', 'warning');
      return;
    }

    const selectedInsurance = activeInsurances.find(
      (ins) => String(ins._id || ins.id) === String(selectedInsuranceId)
    );
    const isSecondary =
      selectedInsurance?.insuranceType?.toLowerCase() === 'secondary' ||
      selectedInsurance?.ordinal === 2;

    const getProcedureInsAmount = (proc) => {
      if (isSecondary) {
        if (proc.secondaryInsPortion !== undefined && proc.secondaryInsPortion !== null && Number(proc.secondaryInsPortion) > 0) {
          return Number(proc.secondaryInsPortion);
        }
        const primIns = Number(proc.insPortion || 0);
        const wo = Number(proc.writeoff || 0);
        const total = Number(proc.total || proc.totalPrice || proc.charge || 0);
        return Math.max(0, total - wo - primIns);
      }
      const ins = Number(proc.insPortion !== undefined && proc.insPortion !== null ? proc.insPortion : (proc.insurance || 0));
      if (ins === 0 && Number(proc.ptPortion || 0) === 0) {
        const wo = Number(proc.writeoff || 0);
        const total = Number(proc.total || proc.totalPrice || proc.charge || 0);
        return Math.max(0, total - wo);
      }
      return ins;
    };

    const getProcedurePtAmount = (proc) => {
      if (isSecondary) {
        return 0;
      }
      return Number(proc.ptPortion || 0);
    };

    const isProcClaimedForSelectedIns = (proc) => {
      return isSecondary ? Boolean(proc.claimedBySecondary) : Boolean(proc.claimedByPrimary);
    };

    const selectedItems = [];
    invoices.forEach((inv) => {
      (inv.lineItems || []).forEach((item) => {
        if (item.checked && !isProcClaimedForSelectedIns(item)) {
          const itemInsAmount = getProcedureInsAmount(item);
          const itemPtAmount = getProcedurePtAmount(item);
          selectedItems.push({
            invoiceId: inv.id,
            invoiceNumber: inv.invoiceNumber || inv.id,
            invoiceDate: inv.invoiceDate || '',
            itemId: item.id,
            code: item.cptCode || item.code || '',
            description: item.description || item.name || item.notes || '',
            fee: Number(item.total || item.totalPrice || item.charge || 0),
            ptAmount: itemPtAmount,
            insAmount: itemInsAmount,
            amount: itemInsAmount,
          });
        }
      });
    });

    if (selectedItems.length === 0) {
      showSnackbar('Please select at least one procedure to include in the claim.', 'warning');
      return;
    }

    const result = await dispatch(
      createManualClaim({
        patientId,
        insuranceId: selectedInsuranceId,
        treatingProviderId: selectedTreatingProvider,
        billingEntityId: selectedBillingEntity,
        claimType: isSecondary ? 'Secondary' : claimType,
        insuranceType: isSecondary ? 'secondary' : 'primary',
        description,
        note,
        selectedItems,
      })
    );

    if (createManualClaim.fulfilled.match(result)) {
      // Bust the draft invoices cache so claimed items don't reappear
      dispatch(invalidateDraftInvoices(patientId));
      // Fire the same event LedgerList already listens to — triggers a full
      // ledger re-fetch so the claim shows up in each invoice's procedure rows
      window.dispatchEvent(new CustomEvent('refresh-ledger'));
      showSnackbar('Claim successfully added to batch.', 'success');
      onClose();
    } else {
      showSnackbar(result.payload || 'Failed to create manual claim. Please try again.', 'error');
    }
  };

  // ── Display helpers ──────────────────────────────────────────────────────
  const selectedPatient = patients.find((p) => (p._id || p.id) === selectedPatientId);
  const selectedPatientName = selectedPatient
    ? `${selectedPatient.firstName || ''} ${selectedPatient.lastName || ''}`.trim()
    : patient
      ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim()
      : '';

  const selectedInsurance = activeInsurances.find(
    (ins) => String(ins._id || ins.id) === String(selectedInsuranceId)
  );
  const isSecondary =
    selectedInsurance?.insuranceType?.toLowerCase() === 'secondary' ||
    selectedInsurance?.ordinal === 2;

  const getProcedureInsAmount = (proc) => {
    if (isSecondary) {
      if (proc.secondaryInsPortion !== undefined && proc.secondaryInsPortion !== null && Number(proc.secondaryInsPortion) > 0) {
        return Number(proc.secondaryInsPortion);
      }
      const primIns = Number(proc.primaryInsPortion ?? (proc.secondaryInsPortion ? Math.max(0, Number(proc.insPortion || 0) - Number(proc.secondaryInsPortion)) : proc.insPortion) ?? 0);
      const wo = Number(proc.writeoff || 0);
      const total = Number(proc.total || proc.totalPrice || proc.charge || 0);
      return Math.max(0, total - wo - primIns);
    }
    const ins = Number(
      proc.primaryInsPortion !== undefined && proc.primaryInsPortion !== null
        ? proc.primaryInsPortion
        : proc.secondaryInsPortion && Number(proc.secondaryInsPortion) > 0 && Number(proc.insPortion || 0) > Number(proc.secondaryInsPortion)
          ? Number(proc.insPortion) - Number(proc.secondaryInsPortion)
          : proc.insPortion !== undefined && proc.insPortion !== null
            ? proc.insPortion
            : (proc.insurance || 0)
    );
    if (ins === 0 && Number(proc.ptPortion || 0) === 0) {
      const wo = Number(proc.writeoff || 0);
      const total = Number(proc.total || proc.totalPrice || proc.charge || 0);
      return Math.max(0, total - wo);
    }
    return ins;
  };

  const getProcedurePtAmount = (proc) => {
    if (isSecondary) {
      return 0;
    }
    return Number(proc.ptPortion || 0);
  };

  const isProcClaimedForSelectedIns = (proc) => {
    return isSecondary ? Boolean(proc.claimedBySecondary) : Boolean(proc.claimedByPrimary);
  };

  const linkBlue = COLORS.ACCENT;
  const errorRed = '#d32f2f';

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Box sx={{ width: '100%', minWidth: '1000px', borderRadius: '14px', border: `1px solid ${COLORS.BORDER}`, overflow: 'hidden', bgcolor: '#fff', display: 'flex', flexDirection: 'column' }}>
      <DialogTitle sx={{
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
        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1, fontFamily: 'Inter, sans-serif' }}>
          Manual Claim
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>

      <Box sx={{ p: 3, maxHeight: '80vh', overflowY: 'auto' }}>
        {/* ── Top Info Row ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, borderBottom: `1px solid ${COLORS.BORDER}`, pb: 2, flexWrap: 'wrap' }}>
          <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif' }}>
            {dayjs().format('MM/DD/YYYY')}
          </Typography>

          {/* Patient search */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>For</Typography>
            <Autocomplete
              options={patients}
              getOptionLabel={(p) => `${p.firstName || ''} ${p.lastName || ''}`.trim()}
              value={patients.find((p) => (p._id || p.id) === selectedPatientId) || null}
              onChange={handlePatientChange}
              onInputChange={handlePatientSearch}
              isOptionEqualToValue={(opt, val) => (opt._id || opt.id) === (val._id || val.id)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search patient..."
                  size="small"
                  sx={{
                    '& .MuiInputBase-root': {
                      height: '36px',
                      bgcolor: COLORS.SURFACE_TINT,
                      borderRadius: radius.sm,
                      fontSize: '13px',
                      color: COLORS.TEXT_PRIMARY,
                      fontWeight: 500,
                      '& fieldset': { borderColor: COLORS.BORDER }
                    }
                  }}
                />
              )}
              sx={{ width: 150 }}
              size="small"
              disablePortal
              ListboxProps={{ sx: { fontSize: '13px' } }}
            />
          </Box>

          {/* Insurance */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>To</Typography>
            <Select
              value={selectedInsuranceId}
              onChange={(e) => setSelectedInsuranceId(e.target.value)}
              displayEmpty
              size="small"
              sx={{
                height: "36px",
                width: "180px",
                bgcolor: COLORS.SURFACE_TINT,
                borderRadius: radius.sm,
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  fontSize: "13px",
                  color: COLORS.TEXT_PRIMARY,
                  fontWeight: 500,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: COLORS.BORDER,
                }
              }}
              MenuProps={DROPDOWN_MENU_PROPS}
            >
              {activeInsurances.length === 0
                ? <MenuItem value="" disabled>No active insurance</MenuItem>
                : [
                  <MenuItem key="default" value="" disabled>Select Insurance</MenuItem>,
                  ...activeInsurances.map((ins) => {
                    const label =
                      ins.insuranceCompany?.name ||
                      ins.insuranceCompanyId?.name ||
                      ins.payer ||
                      ins.planType ||
                      ins.plan ||
                      'Insurance Plan';
                    const typeLabel = ins.insuranceType ? ` (${ins.insuranceType})` : (ins.ordinal === 2 ? ' (secondary)' : '');
                    return (
                      <MenuItem key={ins._id || ins.id} value={ins._id || ins.id}>
                        {label}{typeLabel}
                      </MenuItem>
                    );
                  }),
                ]
              }
            </Select>
          </Box>

          {/* Treating Provider */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 500, lineHeight: 1 }}>
                Treating Provider
              </Typography>
              <Typography sx={{ fontSize: '10px', fontWeight: 400, color: '#999', mt: 0.5, lineHeight: 1 }}>
                (for claim)
              </Typography>
            </Box>
            <Select
              value={selectedTreatingProvider}
              onChange={(e) => setSelectedTreatingProvider(e.target.value)}
              displayEmpty
              size="small"
              sx={{
                height: "36px",
                width: "130px",
                bgcolor: COLORS.SURFACE_TINT,
                borderRadius: radius.sm,
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  fontSize: "13px",
                  color: COLORS.TEXT_PRIMARY,
                  fontWeight: 500,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: COLORS.BORDER,
                }
              }}
              MenuProps={DROPDOWN_MENU_PROPS}
            >
              <MenuItem value="" disabled>
                {providers.length === 0 ? 'Loading providers...' : 'Select Provider'}
              </MenuItem>
              {providers.map((p) => (
                <MenuItem key={p._id || p.id} value={p._id || p.id}>
                  {getProviderName(p)}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Billing Entity */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 500, lineHeight: 1 }}>
                Billing Entity
              </Typography>
              <Typography sx={{ fontSize: '10px', fontWeight: 400, color: '#999', mt: 0.5, lineHeight: 1 }}>
                (for claim)
              </Typography>
            </Box>
            <Select
              value={selectedBillingEntity}
              onChange={(e) => setSelectedBillingEntity(e.target.value)}
              displayEmpty
              size="small"
              sx={{
                height: "36px",
                width: "130px",
                bgcolor: COLORS.SURFACE_TINT,
                borderRadius: radius.sm,
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  fontSize: "13px",
                  color: COLORS.TEXT_PRIMARY,
                  fontWeight: 500,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: COLORS.BORDER,
                }
              }}
              MenuProps={DROPDOWN_MENU_PROPS}
            >
              <MenuItem value="" disabled>
                {providers.length === 0 ? 'Loading providers...' : 'Select Provider'}
              </MenuItem>
              {providers.map((p) => (
                <MenuItem key={p._id || p.id} value={p._id || p.id}>
                  {getProviderName(p)}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Claim Type */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>Type:</Typography>
            <Select
              value={claimType}
              onChange={(e) => setClaimType(e.target.value)}
              size="small"
              sx={{
                height: "36px",
                width: "130px",
                bgcolor: COLORS.SURFACE_TINT,
                borderRadius: radius.sm,
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  fontSize: "13px",
                  color: COLORS.TEXT_PRIMARY,
                  fontWeight: 500,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: COLORS.BORDER,
                }
              }}
              MenuProps={DROPDOWN_MENU_PROPS}
            >
              <MenuItem value="Manual">Manual Claim</MenuItem>
              <MenuItem value="Electronic">Electronic Claim</MenuItem>
            </Select>
          </Box>
        </Box>

        {/* ── Invoice / Procedure list ── */}
        {invoicesLoading ? (
          <Typography sx={{ p: 2, textAlign: 'center', color: '#666' }}>
            Loading pending procedures for claim...
          </Typography>
        ) : invoices.length === 0 ? (
          <Typography sx={{ p: 2, textAlign: 'center', color: '#666' }}>
            No pending procedures found for insurance billing.
          </Typography>
        ) : (
          invoices.map((inv) => {
            const visibleLineItems = (inv.lineItems || []).filter((proc) => !isProcClaimedForSelectedIns(proc));
            if (visibleLineItems.length === 0) return null;
            return (
            <Box key={inv.id} sx={{ mb: 2 }}>
              {/* Invoice summary row */}
              <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', pb: 1, mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <Checkbox
                    size="small"
                    sx={{ p: 0.5 }}
                    checked={inv.checked}
                    onChange={() => handleInvoiceToggle(inv.id)}
                  />
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#333' }}>
                    Invoice #{inv.invoiceNumber || inv.id} :{' '}
                    {inv.invoiceDate ? dayjs(inv.invoiceDate).format('MM/DD/YYYY') : 'N/A'} for {selectedPatientName}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, pr: 6 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '100px', textAlign: 'right', color: errorRed }}>
                    Patient: ${visibleLineItems.reduce((sum, item) => sum + getProcedurePtAmount(item), 0).toFixed(2)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '130px', textAlign: 'right', color: errorRed }}>
                    Insurance: ${visibleLineItems.reduce((sum, item) => sum + getProcedureInsAmount(item), 0).toFixed(2)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '260px', textAlign: 'right', color: errorRed, whiteSpace: 'nowrap' }}>
                    Total Balance: ${visibleLineItems.reduce((sum, item) => sum + (Number(item.total || item.totalPrice || item.charge || 0) - Number(item.writeoff || 0)), 0).toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              {/* Line-item rows */}
              {visibleLineItems.map((proc) => (
                <Box key={proc.id} sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f5f5f5', py: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, pl: 2 }}>
                    <Checkbox
                      size="small"
                      sx={{ p: 0.5 }}
                      checked={proc.checked}
                      onChange={() => handleProcedureToggle(inv.id, proc.id)}
                    />
                    <Typography sx={{ fontSize: '0.75rem', width: '60px', color: COLORS.TEXT_SECONDARY, ml: 1 }}>
                      {proc.cptCode || proc.code}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', width: '200px', color: COLORS.TEXT_SECONDARY }}>
                      {proc.description || proc.name || proc.notes}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.TEXT_SECONDARY }}>
                      {inv.provider?.userId?.firstName || inv.provider?.firstName || ''} {inv.provider?.userId?.lastName || inv.provider?.lastName || ''}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, pr: 6 }}>
                    <Typography sx={{ fontSize: '0.75rem', width: '100px', textAlign: 'right', color: COLORS.TEXT_SECONDARY }}>
                      ${getProcedurePtAmount(proc).toFixed(2)}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', width: '130px', textAlign: 'right', color: COLORS.TEXT_SECONDARY }}>
                      ${getProcedureInsAmount(proc).toFixed(2)}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', width: '260px', textAlign: 'right', color: COLORS.TEXT_SECONDARY, whiteSpace: 'nowrap' }}>
                      {proc.prevAmount}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            );
          })
        )}

      </Box>

      {/* ── Footer ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: '12px 24px', borderTop: `1px solid ${COLORS.BORDER}`, backgroundColor: '#fff' }}>
        <Box sx={{ flex: 1 }}>
          {!showDescription ? (
            <Typography
              onClick={() => setShowDescription(true)}
              sx={{ color: linkBlue, fontSize: '0.8125rem', cursor: 'pointer', display: 'inline-block' }}
            >
              + Add description
            </Typography>
          ) : (
            <TextField
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="standard"
              autoFocus
              sx={{ width: 250, input: { fontSize: '0.8125rem' } }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!showNote ? (
            <Typography
              onClick={() => setShowNote(true)}
              sx={{ color: linkBlue, fontSize: '0.8125rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            >
              + Add note/narrative
            </Typography>
          ) : (
            <TextField
              placeholder="Note/Narrative"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              variant="standard"
              autoFocus
              sx={{ width: 200, input: { fontSize: '0.8125rem', fontFamily: 'Inter, sans-serif' } }}
            />
          )}

          <Button
            variant="contained"
            onClick={handleSendToBatch}
            disabled={isSubmitting}
            sx={{
              textTransform: 'none', backgroundColor: COLORS.ACCENT, color: '#fff', borderRadius: '8px', px: 2, fontWeight: 600, boxShadow: 'none', '&:hover': { backgroundColor: '#1565c0', boxShadow: 'none' }, fontFamily: 'Inter, sans-serif'
            }}
          >
            {isSubmitting ? 'Sending...' : 'Send to Batch'}
          </Button>

          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              color: '#64748b',
              borderColor: '#cbd5e1',
              borderRadius: '8px',
              '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f1f5f9' },
              textTransform: 'none',
              px: 2,
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ManualClaimDialog;
