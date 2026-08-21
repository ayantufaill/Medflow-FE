import { useState, useEffect } from 'react';
import { Box, Typography, Collapse, Divider, Dialog } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { COLORS } from '../../../constants/colors';
import { fontWeight, fontSize } from '../../../constants/styles';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import PurchaseProductDialog from './PurchaseProductDialog';
import CompleteProceduresDialog from './CompleteProceduresDialog';
import { DUMMY_PROCEDURE_OPTIONS } from '../new-appointment/constants';
import { useDispatch } from 'react-redux';
import { createInvoice } from '../../../store/slices/billingSlice';
import { updateAppointmentThunk } from '../../../store/slices/appointmentSlice';
import { claimService } from '../../../services/claim.service';
import InvoiceModal from '../../finance/InvoiceModal';

const PRE_APPT_ITEMS = [
  { label: 'Import History' },
  { label: 'Import Record' },
  { label: 'Appt Reminder' },
  { label: 'Verify Insurance Eligibility' },
  { label: 'Premedication Reminder' },
  { label: 'Lab Case Received' },
];

const CHECK_IN_ITEMS = [
  { label: 'Review Records' },
  { label: 'Review & Sign Visit Plan' },
  { label: 'Sign Consent Forms' },
  { label: 'Verify Premed Taken' },
];

const CHECK_OUT_ITEMS = [
  { label: 'Complete & Bill Procedures', link: true },
  { label: 'Purchase Products', link: true },
  { label: 'Share Clinical Reports', link: true },
  { label: 'Prescription' },
  { label: 'Schedule Next Appointment' },
  { label: 'Send Lab Case' },
];

// Single checklist item row
const ChecklistItem = ({ label, status, onSetStatus, link, onClickLink }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: '12px',
      py: '6px',
      '&:hover': { backgroundColor: '#f8fafc' },
    }}
  >
    <Typography
      onClick={link && onClickLink ? onClickLink : undefined}
      sx={{
        fontSize: '13px',
        color: link ? COLORS.ACCENT : COLORS.TEXT_PRIMARY,
        textDecoration: link ? 'underline' : 'none',
        fontWeight: link ? fontWeight.medium : fontWeight.regular,
        cursor: link ? 'pointer' : 'default',
      }}
    >
      {label}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Typography
        onClick={() => onSetStatus(status === 'na' ? null : 'na')}
        sx={{
          fontSize: '11px',
          color: status === 'na' ? '#000' : COLORS.TEXT_MUTED,
          fontWeight: status === 'na' ? fontWeight.bold : fontWeight.regular,
          cursor: 'pointer',
        }}
      >
        NA
      </Typography>
      <Box
        onClick={() => onSetStatus(status === 'checked' ? null : 'checked')}
        sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        {status === 'checked' ? (
          <CheckCircleIcon sx={{ fontSize: '18px', color: '#4ade80' }} />
        ) : (
          <CheckCircleOutlineIcon sx={{ fontSize: '18px', color: '#d1d5db' }} />
        )}
      </Box>
    </Box>
  </Box>
);

// Collapsible checklist section
const ChecklistSection = ({ title, items, state, onSetStatus, open, onToggleOpen, onLinkClick }) => {
  const total = items.length;
  // Both 'checked' and 'na' are truthy, so they both count towards 'done'
  const done = items.filter(i => state[i.label]).length;
  const allDone = done === total;

  return (
    <Box sx={{ borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>
      {/* Header row */}
      <Box
        onClick={onToggleOpen}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: '12px',
          py: '8px',
          cursor: 'pointer',
          backgroundColor: '#f8fafc',
          '&:hover': { backgroundColor: '#f1f5f9' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircleIcon sx={{ fontSize: '16px', color: allDone ? '#4ade80' : '#d1d5db' }} />
          <Typography sx={{ fontSize: '13px', fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: COLORS.TEXT_MUTED }}>
            {done}/{total}
          </Typography>
        </Box>
        {open
          ? <KeyboardArrowDownIcon sx={{ fontSize: '18px', color: COLORS.TEXT_SECONDARY }} />
          : <KeyboardArrowRightIcon sx={{ fontSize: '18px', color: COLORS.TEXT_SECONDARY }} />
        }
      </Box>

      {/* Collapsible items */}
      <Collapse in={open}>
        {items.map(item => (
          <ChecklistItem
            key={item.label}
            label={item.label}
            status={state[item.label]}
            link={item.link}
            onSetStatus={(val) => onSetStatus(item.label, val)}
            onClickLink={() => onLinkClick && onLinkClick(item.label)}
          />
        ))}
      </Collapse>
    </Box>
  );
};

// Main AppointmentChecklist component
const AppointmentChecklist = ({ patientId, appointment }) => {
  const [preApptOpen, setPreApptOpen] = useState(true);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceModalData, setInvoiceModalData] = useState(null);

  const [preApptState, setPreApptState] = useState({});
  const [checkInState, setCheckInState] = useState({});
  const [checkOutState, setCheckOutState] = useState({});
  
  const [purchaseProductOpen, setPurchaseProductOpen] = useState(false);
  const [completeProceduresOpen, setCompleteProceduresOpen] = useState(false);

  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const handleLinkClick = (label) => {
    if (label === 'Purchase Products') {
      setPurchaseProductOpen(true);
    } else if (label === 'Complete & Bill Procedures') {
      setCompleteProceduresOpen(true);
    }
  };

  // Build a complete customFields object that preserves all existing fields (tags, visitType, etc.)
  const buildCustomFieldsPayload = (proceduresArray) => {
    const existing = appointment?.customFields || {};
    console.log('[DEBUG] appointment.customFields:', JSON.stringify(existing));
    console.log('[DEBUG] procedures being saved:', JSON.stringify(proceduresArray.map(p => ({ code: p.code, completed: p.completed }))));
    const payload = {
      ...existing,
      procedures: proceduresArray,
    };
    console.log('[DEBUG] full customFields payload keys:', Object.keys(payload));
    return payload;
  };

  const handleSaveProcedures = (checkedProcedures = []) => {
    const appId = appointment?.id || appointment?._id;
    console.log('[DEBUG] handleSaveProcedures called, appId:', appId);
    console.log('[DEBUG] checkedProcedures:', JSON.stringify(checkedProcedures.map(p => ({ code: p.code, treatment: p.treatment }))));
    console.log('[DEBUG] extractedProcedures:', JSON.stringify(extractedProcedures.map(p => ({ code: p.code, completed: p.completed }))));
    if (appId) {
      const updatedProcedures = extractedProcedures.map(p => {
        const isChecked = checkedProcedures.some(cp => cp.treatment === p.treatment && cp.code === p.code);
        return { ...p, completed: isChecked };
      });
      console.log('[DEBUG] updatedProcedures:', JSON.stringify(updatedProcedures.map(p => ({ code: p.code, completed: p.completed }))));

      dispatch(updateAppointmentThunk({ 
        appointmentId: appId, 
        payload: { 
          customFields: buildCustomFieldsPayload(updatedProcedures)
        } 
      }));
      // Update local state so re-opening the dialog shows the correct checkmarks
      setProceduresState(updatedProcedures);
    }
  };

  const handleCompleteAll = (allProcedures = []) => {
    const appId = appointment?.id || appointment?._id;
    if (appId) {
      const updatedProcedures = extractedProcedures.map(p => ({ ...p, completed: true }));

      dispatch(updateAppointmentThunk({ 
        appointmentId: appId, 
        payload: { 
          status: 'completed',
          customFields: buildCustomFieldsPayload(updatedProcedures)
        } 
      }));
      // Update local state so re-opening the dialog shows all as completed
      setProceduresState(updatedProcedures);
      showSnackbar("Appointment marked as completed and procedures saved.", "success");
    } else {
      showSnackbar("Cannot complete: Appointment ID missing.", "error");
    }
  };

  const handleCollectPayment = (proceduresToBill = extractedProcedures) => {
    const appId = appointment?.id || appointment?._id;
    if (!appId) {
      showSnackbar("Please select an appointment first before collecting payment.", "warning");
      return;
    }

    const totalPortion = proceduresToBill.reduce((sum, p) => {
      const val = p.charge != null ? p.charge : 0;
      const num = Number(String(val).replace(/[$,]/g, ''));
      return sum + (isNaN(num) ? 0 : num);
    }, 0);

    if (totalPortion <= 0) {
      showSnackbar("No procedure charges to collect payment for.", "warning");
    }

    const formattedProcedures = proceduresToBill.map(p => {
      const chargeStr = String(p.charge || "0").replace(/[$,]/g, '');
      const numCharge = parseFloat(chargeStr) || 0;
      return {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        date: new Date().toISOString().split("T")[0],
        code: p.code,
        site: p.site || "",
        treatment: p.treatment || "Custom Procedure",
        provider: p.provider || "DR",
        writeoff: "$0.00",
        coveragePct: 0,
        ptPortion: `$${numCharge.toFixed(2)}`,
        insPortion: "$0.00",
        charge: `$${numCharge.toFixed(2)}`,
        balance: `$${numCharge.toFixed(2)}`,
        dbi: false,
        completed: true,
      };
    });

    setInvoiceModalData({ procedures: formattedProcedures });
    setShowInvoiceModal(true);
  };

  const handleInvoiceModalSave = async (savePayload) => {
    const data = Array.isArray(savePayload) ? savePayload : savePayload.procedures;
    const shouldAddClaim = !Array.isArray(savePayload) && savePayload.addClaim;
    const claimRows = !Array.isArray(savePayload) ? (savePayload.claimProcedures || []) : [];

    const payload = {
      patientId: parseInt(patientId, 10) || (appointment?.patientId?._id ? parseInt(appointment?.patientId?._id, 10) : null),
      appointmentId: parseInt(appointment?.id || appointment?._id, 10) || null,
      notes: savePayload.description || 'Invoice created from appointment checkout',
      items: data.map((row) => {
        let parsedDate = new Date().toISOString();
        if (row.date) { const d = new Date(row.date); if (!isNaN(d.getTime())) parsedDate = d.toISOString(); }
        return {
          code: row.code, description: row.treatment, date: parsedDate, site: row.site,
          provider: row.provider,
          writeoff:   parseFloat((String(row.writeoff   || '')).replace(/[^0-9.-]+/g, '')) || 0,
          ptPortion:  parseFloat((String(row.ptPortion  || '')).replace(/[^0-9.-]+/g, '')) || 0,
          insPortion: parseFloat((String(row.insPortion || '')).replace(/[^0-9.-]+/g, '')) || 0,
          charge:     parseFloat((String(row.charge     || '')).replace(/[^0-9.-]+/g, '')) || 0,
          balance:    parseFloat((String(row.balance    || '')).replace(/[^0-9.-]+/g, '')) || 0,
          dbi:       Boolean(row.dbi), completed: Boolean(row.completed),
        };
      }),
    };

    if (payload.items.length === 0) {
      showSnackbar('Please add at least one procedure before saving.', 'warning');
      return;
    }

    try {
      const result = await dispatch(createInvoice(payload)).unwrap();
      const createdInvoiceId = result?.invoice?._id || result?.invoice?.id || result?._id || result?.id;
      
      setShowInvoiceModal(false);
      showSnackbar("Invoice saved successfully!", "success");
      
      if (shouldAddClaim && claimRows.length > 0 && createdInvoiceId) {
        try {
          await claimService.createClaimFromInvoice(createdInvoiceId, {
            procedures: claimRows.map((row) => ({
              code: row.code,
              description: row.treatment,
              charge: parseFloat((String(row.charge || '')).replace(/[^0-9.-]+/g, '')) || 0,
              provider: row.provider,
              site: row.site,
            }))
          });
          showSnackbar("Claim created successfully!", "success");
        } catch (err) {
          console.error("Failed to create claim:", err);
          showSnackbar("Invoice saved, but failed to create claim.", "warning");
        }
      }
      setCompleteProceduresOpen(false); 
    } catch (err) {
      console.error("Failed to save invoice:", err);
      showSnackbar(err?.message || "Failed to save invoice. Please try again.", "error");
    }
  };

  const setStatus = (setState) => (label, value) => {
    setState(prev => ({ ...prev, [label]: value }));
    if (value === 'checked') {
      showSnackbar(`Marked '${label}' as completed`, 'success', { vertical: 'top', horizontal: 'right' });
    } else if (value === 'na') {
      showSnackbar(`Marked '${label}' as N/A`, 'info', { vertical: 'top', horizontal: 'right' });
    }
  };

  const allItems = [
    ...PRE_APPT_ITEMS.map(i => preApptState[i.label]),
    ...CHECK_IN_ITEMS.map(i => checkInState[i.label]),
    ...CHECK_OUT_ITEMS.map(i => checkOutState[i.label]),
  ];
  // Both 'checked' and 'na' are truthy strings, so they count
  const totalDone = allItems.filter(Boolean).length;
  const totalCount = allItems.length;
  const isAllDone = totalDone === totalCount;

  // Robustly extract procedures from the appointment object
  // NOTE: The Redux normalizer flattens customFields.procedures onto appointment.procedures,
  // so we check appointment.procedures first (it contains the most up-to-date data with completed flags).
  const deriveProcedures = (appt) => {
    if (!appt) return [];
    const customFields = appt.customFields || {};
    if (Array.isArray(appt.procedures) && appt.procedures.length > 0 && typeof appt.procedures[0] === 'object') {
      return appt.procedures.map(p => ({ ...p }));
    } else if (Array.isArray(customFields.procedures) && customFields.procedures.length > 0) {
      return customFields.procedures.map(p => ({ ...p }));
    } else if (Array.isArray(appt.procedures)) {
      return appt.procedures.map(p =>
        typeof p === 'string' ? { code: 'TBD', treatment: p, charge: '$0.00', completed: false } : { ...p }
      );
    } else if (typeof appt.procedures === 'string') {
      return appt.procedures.split(',').map(p => {
        const treatmentName = p.trim();
        const found = DUMMY_PROCEDURE_OPTIONS.find(d => d.treatment === treatmentName);
        return {
          code: found ? found.code : 'TBD',
          treatment: treatmentName,
          provider: appt.providerName || appt.provider || 'DR',
          charge: found ? found.charge : '$0.00',
          completed: false
        };
      });
    } else if (Array.isArray(appt.procedureCodes)) {
      return appt.procedureCodes.map(p => {
        const found = DUMMY_PROCEDURE_OPTIONS.find(d => d.code === p);
        return {
          code: p,
          treatment: found ? found.treatment : p,
          provider: appt.providerName || appt.provider || 'DR',
          charge: found ? found.charge : '$0.00',
          completed: false
        };
      });
    }
    return [];
  };

  const [proceduresState, setProceduresState] = useState(() => deriveProcedures(appointment));

  // Re-derive when a different appointment is selected (appointment prop changes identity)
  useEffect(() => {
    setProceduresState(deriveProcedures(appointment));
  }, [appointment]);

  const extractedProcedures = proceduresState;

  // Build dynamic dropdown options based on current procedures + defaults
  const treatmentSet = new Set(DUMMY_PROCEDURE_OPTIONS.map(d => d.treatment));
  const providerSet = new Set(['DR', 'KIM', appointment?.providerName, appointment?.provider].filter(Boolean));
  extractedProcedures.forEach(p => {
    if (p.treatment) treatmentSet.add(p.treatment);
    if (p.provider) providerSet.add(p.provider);
  });
  
  const treatmentOptions = Array.from(treatmentSet).map(t => ({ label: t, value: t }));
  const providerOptions = Array.from(providerSet).map(p => ({ label: p, value: p }));

  return (
    <Box
      sx={{
        border: `1px solid ${COLORS.BORDER_LIGHT}`,
        borderRadius: '10px',
        overflow: 'hidden',
        mt: '8px',
        backgroundColor: COLORS.WHITE,
      }}
    >
      {/* Checklist sections */}
      <ChecklistSection
        title="Pre-appt Checklist"
        items={PRE_APPT_ITEMS}
        state={preApptState}
        onSetStatus={setStatus(setPreApptState)}
        open={preApptOpen}
        onToggleOpen={() => setPreApptOpen(v => !v)}
      />
      <ChecklistSection
        title="Check-in Checklist"
        items={CHECK_IN_ITEMS}
        state={checkInState}
        onSetStatus={setStatus(setCheckInState)}
        open={checkInOpen}
        onToggleOpen={() => setCheckInOpen(v => !v)}
      />
      <ChecklistSection
        title="Check-out Checklist"
        items={CHECK_OUT_ITEMS}
        state={checkOutState}
        onSetStatus={setStatus(setCheckOutState)}
        open={checkOutOpen}
        onToggleOpen={() => setCheckOutOpen(v => !v)}
        onLinkClick={handleLinkClick}
      />

      {/* Footer */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: '12px',
          py: '8px',
          backgroundColor: '#f8fafc',
        }}
      >
        <Typography sx={{ fontSize: '12px', color: COLORS.TEXT_MUTED }}>
          {totalDone}/{totalCount} complete
        </Typography>
        <Box sx={{ display: 'flex', gap: '12px' }}>
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: fontWeight.semibold,
              color: isAllDone ? '#4ade80' : '#d1d5db',
              cursor: isAllDone ? 'pointer' : 'default',
              pointerEvents: isAllDone ? 'auto' : 'none'
            }}
          >
            All done
          </Typography>
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: fontWeight.semibold,
              color: totalDone > 0 ? COLORS.TEXT_SECONDARY : '#d1d5db',
              cursor: totalDone > 0 ? 'pointer' : 'default',
              pointerEvents: totalDone > 0 ? 'auto' : 'none',
            }}
            onClick={() => {
              if (totalDone === 0) return;
              setPreApptState({});
              setCheckInState({});
              setCheckOutState({});
            }}
          >
            Reset
          </Typography>
        </Box>
      </Box>

      <PurchaseProductDialog 
        open={purchaseProductOpen} 
        onClose={() => setPurchaseProductOpen(false)} 
        patientId={patientId}
      />

      <CompleteProceduresDialog
        open={completeProceduresOpen}
        onClose={() => setCompleteProceduresOpen(false)}
        proceduresData={extractedProcedures}
        treatmentOptions={treatmentOptions.map(t => t.value)}
        providerOptions={providerOptions.map(p => p.value)}
        onCompleteAll={handleCompleteAll}
        onCollectPayments={handleCollectPayment}
        onDone={handleSaveProcedures}
      />
      {showInvoiceModal && (
        <Dialog 
          open={showInvoiceModal} 
          onClose={() => setShowInvoiceModal(false)} 
          maxWidth={false} 
          fullWidth
          sx={{
            zIndex: 140000,
            "& .MuiDialog-paper": {
              width: "calc(100% - 64px)",
              maxWidth: "1050px",
              maxHeight: "900px",
              m: 4,
              borderRadius: "14px",
              bgcolor: "#f8f9fa",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <InvoiceModal 
            patient={{ _id: patientId }}
            invoiceData={invoiceModalData}
            onSave={handleInvoiceModalSave}
            onCancel={() => setShowInvoiceModal(false)}
            onClose={() => setShowInvoiceModal(false)}
          />
        </Dialog>
      )}
    </Box>
  );
};

export default AppointmentChecklist;
