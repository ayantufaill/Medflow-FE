import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Checkbox, Select,
  MenuItem, TextField, Autocomplete,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';

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
  PaperProps: {
    sx: {
      bgcolor: '#fff',
      '& .MuiMenuItem-root': { fontSize: '12px', py: 0.5 },
      '& .Mui-selected': { bgcolor: '#5c6bc0 !important', color: '#fff' },
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

  // ── Redux state ──────────────────────────────────────────────────────────
  const providers      = useSelector(selectProviderDropdownList);
  const patients       = useSelector(selectPatientList);
  const insurancesCache = useSelector(selectPatientInsurancesCache);
  const invoicesLoading = useSelector(selectDraftInvoicesLoading);
  const isSubmitting    = useSelector(selectClaimLoading);

  // ── Local form state ─────────────────────────────────────────────────────
  const [description,      setDescription]      = useState('');
  const [showDescription,  setShowDescription]  = useState(false);
  const [note,             setNote]             = useState('');
  const [showNote,         setShowNote]         = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(patient?._id || patient?.id || '');
  const [selectedInsuranceId,    setSelectedInsuranceId]    = useState('');
  const [selectedTreatingProvider, setSelectedTreatingProvider] = useState('');
  const [selectedBillingEntity,    setSelectedBillingEntity]    = useState('');
  const [claimType, setClaimType] = useState('Manual');

  // ── Derived values ───────────────────────────────────────────────────────
  const patientId = selectedPatientId || patient?._id || patient?.id;

  // Memoised selector for the current patient's draft invoices
  const invoices = useSelector(selectDraftInvoicesForPatient(patientId));

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
      alert('Please select an insurance plan.');
      return;
    }
    if (!selectedTreatingProvider) {
      alert('Please select a treating provider.');
      return;
    }
    if (!selectedBillingEntity) {
      alert('Please select a billing entity.');
      return;
    }

    const selectedItems = [];
    invoices.forEach((inv) => {
      inv.lineItems.forEach((item) => {
        if (item.checked) {
          selectedItems.push({
            invoiceId: inv.id,
            itemId: item.id,
            amount: Number(item.insAmount?.replace('$', '')) || 0,
          });
        }
      });
    });

    if (selectedItems.length === 0) {
      alert('Please select at least one procedure to include in the claim.');
      return;
    }

    const result = await dispatch(
      createManualClaim({
        patientId,
        insuranceId: selectedInsuranceId,
        treatingProviderId: selectedTreatingProvider,
        billingEntityId: selectedBillingEntity,
        claimType,
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
      alert('Claim successfully added to batch.');
      onClose();
    } else {
      alert(result.payload || 'Failed to create manual claim. Please try again.');
    }
  };

  // ── Display helpers ──────────────────────────────────────────────────────
  const selectedPatient = patients.find((p) => (p._id || p.id) === selectedPatientId);
  const selectedPatientName = selectedPatient
    ? `${selectedPatient.firstName || ''} ${selectedPatient.lastName || ''}`.trim()
    : patient
      ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim()
      : '';

  const headerBackground = '#7788bb';
  const textGrey         = '#555';
  const linkBlue         = '#5b7bb1';
  const errorRed         = '#d32f2f';

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Box sx={{ width: '100%', minWidth: '1000px', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden', bgcolor: '#fff', pb: 2 }}>
      {/* Header */}
      <Box sx={{ bgcolor: headerBackground, py: 1.5, textAlign: 'center' }}>
        <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 600 }}>
          Manual Claim
        </Typography>
      </Box>

      <Box sx={{ p: 2, maxHeight: '80vh', overflowY: 'auto' }}>
        {/* ── Top Info Row ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2, borderBottom: '1px solid #eee', pb: 1.5, flexWrap: 'wrap' }}>
          <Typography sx={{ color: headerBackground, fontSize: '0.75rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
            {dayjs().format('MM/DD/YYYY')}
          </Typography>

          {/* Patient search */}
          <Typography sx={{ fontSize: '0.75rem', ml: 1 }}>For</Typography>
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
                variant="standard"
                placeholder="Search patient..."
                sx={{ fontSize: '0.75rem', minWidth: 160, mr: 1, '& input': { fontSize: '0.75rem', pb: 0.5 } }}
              />
            )}
            sx={{ minWidth: 160, mr: 1 }}
            size="small"
            disablePortal
            ListboxProps={{ sx: { fontSize: '12px' } }}
          />

          {/* Insurance */}
          <Typography sx={{ fontSize: '0.75rem' }}>To</Typography>
          <Select
            variant="standard"
            value={selectedInsuranceId}
            onChange={(e) => setSelectedInsuranceId(e.target.value)}
            displayEmpty
            sx={{ fontSize: '0.75rem', mr: 1, '& .MuiSelect-select': { pb: 0.5, pt: 0.5 } }}
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
                    return (
                      <MenuItem key={ins._id || ins.id} value={ins._id || ins.id}>
                        {label}
                      </MenuItem>
                    );
                  }),
                ]
            }
          </Select>

          {/* Treating Provider */}
          <Typography sx={{ fontSize: '0.75rem' }}>
            Treating Provider <span style={{ color: '#999' }}>(for claim)</span>
          </Typography>
          <Select
            variant="standard"
            value={selectedTreatingProvider}
            onChange={(e) => setSelectedTreatingProvider(e.target.value)}
            displayEmpty
            sx={{ fontSize: '0.75rem', mr: 1, '& .MuiSelect-select': { pb: 0.5, pt: 0.5 } }}
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

          {/* Billing Entity */}
          <Typography sx={{ fontSize: '0.75rem' }}>
            Billing Entity <span style={{ color: '#999' }}>(for claim)</span>
          </Typography>
          <Select
            variant="standard"
            value={selectedBillingEntity}
            onChange={(e) => setSelectedBillingEntity(e.target.value)}
            displayEmpty
            sx={{ fontSize: '0.75rem', mr: 1, '& .MuiSelect-select': { pb: 0.5, pt: 0.5 } }}
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

          {/* Claim Type */}
          <Typography sx={{ fontSize: '0.75rem' }}>Type:</Typography>
          <Select
            variant="standard"
            value={claimType}
            onChange={(e) => setClaimType(e.target.value)}
            sx={{ fontSize: '0.75rem', '& .MuiSelect-select': { pb: 0.5, pt: 0.5 } }}
            MenuProps={DROPDOWN_MENU_PROPS}
          >
            <MenuItem value="Manual">Manual Claim</MenuItem>
            <MenuItem value="Electronic">Electronic Claim</MenuItem>
          </Select>
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
          invoices.map((inv) => (
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
                    Patient: ${(inv.lineItems || []).reduce((sum, item) => sum + Number(item.ptAmount.replace('$', '')), 0).toFixed(2)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '130px', textAlign: 'right', color: errorRed }}>
                    Insurance: ${(inv.lineItems || []).reduce((sum, item) => sum + Number(item.insAmount.replace('$', '')), 0).toFixed(2)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, width: '260px', textAlign: 'right', color: errorRed, whiteSpace: 'nowrap' }}>
                    Total Balance: ${(inv.lineItems || []).reduce((sum, item) => sum + (Number(item.total || item.totalPrice || 0) - Number(item.writeoff || 0)), 0).toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              {/* Line-item rows */}
              {inv.lineItems?.map((proc) => (
                <Box key={proc.id} sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f5f5f5', py: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, pl: 2 }}>
                    <Checkbox
                      size="small"
                      sx={{ p: 0.5 }}
                      checked={proc.checked}
                      onChange={() => handleProcedureToggle(inv.id, proc.id)}
                    />
                    <Typography sx={{ fontSize: '0.75rem', width: '60px', color: textGrey, ml: 1 }}>
                      {proc.cptCode || proc.code}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', width: '200px', color: textGrey }}>
                      {proc.description || proc.name || proc.notes}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: textGrey }}>
                      {inv.provider?.userId?.firstName || inv.provider?.firstName || ''} {inv.provider?.userId?.lastName || inv.provider?.lastName || ''}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, pr: 6 }}>
                    <Typography sx={{ fontSize: '0.75rem', width: '100px', textAlign: 'right', color: textGrey }}>
                      {proc.ptAmount}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', width: '130px', textAlign: 'right', color: textGrey }}>
                      {proc.insAmount}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', width: '260px', textAlign: 'right', color: textGrey, whiteSpace: 'nowrap' }}>
                      {proc.prevAmount}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          ))
        )}

        {/* ── Footer ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
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

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!showNote ? (
              <Typography
                onClick={() => setShowNote(true)}
                sx={{ color: linkBlue, fontSize: '0.8125rem', cursor: 'pointer' }}
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
                sx={{ width: 200, input: { fontSize: '0.8125rem' } }}
              />
            )}

            <Button
              variant="contained"
              onClick={handleSendToBatch}
              disabled={isSubmitting}
              sx={{
                bgcolor: headerBackground,
                color: '#fff',
                textTransform: 'none',
                boxShadow: 'none',
                px: 2,
                fontSize: '0.8125rem',
                '&:hover': { bgcolor: '#6677aa' },
              }}
            >
              {isSubmitting ? 'Sending...' : 'Send to Batch'}
            </Button>

            <Button
              variant="contained"
              onClick={onClose}
              sx={{ bgcolor: '#a9a9a9', color: '#fff', textTransform: 'none', boxShadow: 'none', px: 2, fontSize: '0.8125rem' }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ManualClaimDialog;
