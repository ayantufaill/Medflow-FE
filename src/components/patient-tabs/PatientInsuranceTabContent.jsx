import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  IconButton,
  Menu,
  MenuItem as MuiMenuItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Grid,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { usePatientInsurance } from '../../hooks/redux/usePatientInsurance';
import apiClient from '../../config/api';
import { useInsuranceCatalog } from '../../hooks/redux/useInsuranceCatalog';
import InsuranceDialog from '../insurance/components/InsuranceDialog';
import ImportedCoverageModal from '../insurance/components/ImportedCoverageModal';
import EditCoverageModal from '../insurance/components/EditCoverageModal';
import ViewCoverage from '../insurance/components/ViewCoverage';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import CarrierInfoDialog from '../insurance/components/CarrierInfoDialog';
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, radius } from "../../constants/styles";

const parseAmount = (val) => {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') return isNaN(val) ? null : val;
  const cleaned = String(val).replace(/[^0-9.-]+/g, "");
  if (!cleaned) return null;
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};

const getCoverageAmounts = (ins) => {
  let coverageLimits = ins?.coverageLimits;
  if (typeof coverageLimits === 'string') {
    try {
      coverageLimits = JSON.parse(coverageLimits);
    } catch (e) {
      coverageLimits = null;
    }
  }
  const limitsInd = coverageLimits?.individual;
  
  const rawUsed = 
    limitsInd?.usedAmount ?? 
    ins?.usedAmount ?? 
    ins?.copayAmount;
    
  const rawMax = 
    limitsInd?.annualMax ?? 
    ins?.individualAnnualMax ?? 
    ins?.deductibleAmount;

  const usedAmount = parseAmount(rawUsed) ?? 0;
  const maxAmount = parseAmount(rawMax) ?? 0;

  return { usedAmount, maxAmount };
};

const CoverageRow = ({ 
  ins, 
  companies, 
  getInsuranceCompanyName, 
  handleViewPlan, 
  handleInsuranceEdit, 
  handleInsuranceDeactivate, 
  isInactive, 
  handleInsuranceActivate,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  patient,
  onViewCarrierInfo
}) => {
  const [expanded, setExpanded] = useState(false);
  const companyName = getInsuranceCompanyName(ins.insuranceCompanyId);
  const { usedAmount, maxAmount } = getCoverageAmounts(ins);

  const getCompany = (insuranceCompanyId) => {
    if (insuranceCompanyId && typeof insuranceCompanyId === 'object') return insuranceCompanyId;
    if (typeof insuranceCompanyId === 'string') return (companies || []).find((c) => (c._id || c.id) === insuranceCompanyId);
    return null;
  };
  const company = getCompany(ins.insuranceCompanyId);
  const payerId = company?.payerId || company?.electronicId || '-';
  const address = company?.address ? `${company.address.street || ''} ${company.address.city || ''}, ${company.address.state || ''} ${company.address.zipCode || ''}` : '-';

  return (
    <Paper variant="outlined" sx={{ borderColor: COLORS.BORDER, borderRadius: radius.xl, overflow: 'hidden' }}>
      <Box sx={{ py: 1.5, px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <IconButton size="small" onClick={() => setExpanded(!expanded)} sx={{ p: 0.2, color: COLORS.TEXT_MUTED }}>
            {expanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
          </IconButton>
          <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <Box component="span" sx={{ color: COLORS.ACCENT }}>{ins?.Ordinal ? `Coverage #${ins.Ordinal}` : 'Coverage'}:</Box>{' '}
            <Box component="span" sx={{ fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>{ins.employerName || ins.planName?.split(' by ')[0] || companyName}</Box>{' '}
            <Box component="span" sx={{ color: COLORS.TEXT_MUTED }}>by {companyName}</Box>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
          <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, whiteSpace: 'nowrap' }}>
            <Box component="span" sx={{ color: COLORS.TEXT_MUTED }}>Used up-to-date: </Box>
            <Box component="span" sx={{ color: COLORS.ACCENT, fontWeight: fontWeight.semibold }}>${Number(usedAmount).toFixed(2)} / ${Number(maxAmount).toFixed(2)}</Box>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {isInactive ? (
            <Button size="small" variant="contained" onClick={() => handleInsuranceActivate(ins)} sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, textTransform: 'none', py: 0.25, px: 1.5, borderRadius: radius.md, backgroundColor: COLORS.STATUS_SUCCESS, '&:hover': { backgroundColor: COLORS.STATUS_SUCCESS, opacity: 0.9 }, boxShadow: 'none' }}>Activate</Button>
          ) : (
            <>
              <Button size="small" variant="contained" onClick={() => handleViewPlan(ins)} sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, textTransform: 'none', py: 0.25, px: 1.5, borderRadius: radius.md, backgroundColor: COLORS.ACCENT, '&:hover': { backgroundColor: COLORS.ACCENT_HOVER }, boxShadow: 'none' }}>View Plan</Button>
              <Button size="small" variant="contained" onClick={() => handleInsuranceDeactivate(ins)} sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, textTransform: 'none', py: 0.25, px: 1.5, borderRadius: radius.md, backgroundColor: COLORS.STATUS_ERROR, '&:hover': { backgroundColor: COLORS.STATUS_ERROR, opacity: 0.9 }, boxShadow: 'none' }}>Deactivate</Button>
            </>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', color: COLORS.TEXT_MUTED, ml: 0.5 }}>
            <KeyboardArrowUpIcon 
              onClick={isFirst ? undefined : onMoveUp}
              sx={{ 
                fontSize: '1.25rem', 
                mb: -0.5, 
                cursor: isFirst ? 'default' : 'pointer',
                opacity: isFirst ? 0.3 : 1,
                '&:hover': { color: isFirst ? undefined : COLORS.TEXT_PRIMARY }
              }} 
            />
            <KeyboardArrowDownIcon 
              onClick={isLast ? undefined : onMoveDown}
              sx={{ 
                fontSize: '1.25rem', 
                cursor: isLast ? 'default' : 'pointer',
                opacity: isLast ? 0.3 : 1,
                '&:hover': { color: isLast ? undefined : COLORS.TEXT_PRIMARY }
              }} 
            />
          </Box>
        </Box>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2, borderTop: `1px solid ${COLORS.BORDER}`, bgcolor: COLORS.SURFACE_CARD }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' }, gap: 4 }}>
            <Box sx={{ width: 340, justifySelf: 'start' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_SECONDARY }}>Payer Name:</Typography>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, textAlign: 'right' }}>{companyName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_SECONDARY }}>Payer ID:</Typography>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, textAlign: 'right' }}>{payerId}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_SECONDARY }}>Group Name:</Typography>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, textAlign: 'right' }}>{ins.groupName || ins.planName || '-'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_SECONDARY }}>Group Number:</Typography>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, textAlign: 'right' }}>{ins.groupNumber || '-'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_SECONDARY }}>Notes:</Typography>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, textAlign: 'right' }}>{ins.notes || ''}</Typography>
              </Box>
            </Box>
            <Box sx={{ width: 340, justifySelf: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_SECONDARY }}>Patient's Relationship to Subscriber:</Typography>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, textAlign: 'right' }}>{ins.relationshipToPatient || 'Self'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_SECONDARY }}>Subscriber's Name:</Typography>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, textAlign: 'right' }}>
                  {ins.subscriberName || ((!ins.relationshipToPatient || ins.relationshipToPatient.toLowerCase() === 'self') && patient ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim() : '-')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_SECONDARY }}>Subscriber's Birthday:</Typography>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, textAlign: 'right' }}>
                  {ins.subscriberDateOfBirth ? dayjs(ins.subscriberDateOfBirth).format('MM/DD/YYYY') : (((!ins.relationshipToPatient || ins.relationshipToPatient.toLowerCase() === 'self') && patient?.dateOfBirth) ? dayjs(patient.dateOfBirth).format('MM/DD/YYYY') : '-')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_SECONDARY }}>Subscriber's ID:</Typography>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, textAlign: 'right' }}>{ins.subscriberId || ins.policyNumber || '-'}</Typography>
              </Box>
            </Box>
            <Box sx={{ width: 340, justifySelf: 'end' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_SECONDARY }}>Employer Name:</Typography>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, textAlign: 'right' }}>{ins.employerName || '-'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_SECONDARY }}>Payer Address:</Typography>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.medium, textAlign: 'right' }}>{address}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_SECONDARY }}>Payer Contact Info:</Typography>
                <Typography 
                  onClick={() => onViewCarrierInfo && onViewCarrierInfo(company)}
                  sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.ACCENT, fontWeight: fontWeight.medium, textAlign: 'right', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {ins.payerContactInfo || 'View Contact Info'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default function PatientInsuranceTabContent({ patientId, patient }) {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const patientName = patient ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim() : "Patient";
  const dobText = patient?.dateOfBirth 
    ? `DOB: ${dayjs(patient.dateOfBirth).format('MMM D, YYYY')}`
    : "DOB: N/A";
  const {
    insurances,
    fetch: fetchInsurances,
    create: createInsurance,
    update: updateInsurance,
    remove: removeInsurance,
    reorder: reorderInsurances,
  } = usePatientInsurance(patientId);

  const {
    companies,
    plans: planCatalog,
    templates: coverageTemplates,
    fetchAllCatalog,
  } = useInsuranceCatalog();

  const [insuranceDialog, setInsuranceDialog] = useState({ open: false, mode: 'add', insurance: null });
  const [insuranceMenu, setInsuranceMenu] = useState({ anchorEl: null, insurance: null });
  const [insuranceSaving, setInsuranceSaving] = useState(false);
  const [insuranceDeleteDialog, setInsuranceDeleteDialog] = useState({ open: false, insurance: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [importedCoverageModalOpen, setImportedCoverageModalOpen] = useState(false);
  const [editCoverageModal, setEditCoverageModal] = useState({ open: false, insurance: null, mode: 'edit' });
  const [viewCoverageModal, setViewCoverageModal] = useState({ open: false, insurance: null });
  const [creatingPolicy, setCreatingPolicy] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);
  const [localInsurances, setLocalInsurances] = useState([]);
  const [carrierInfoOpen, setCarrierInfoOpen] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState(null);

  const handleViewCarrierInfo = (company) => {
    setSelectedCarrier(company);
    setCarrierInfoOpen(true);
  };

  const fetchInsurancesAndCompanies = async () => {
    try {
      await Promise.all([
        fetchInsurances(),
        fetchAllCatalog(),
      ]);
    } catch (err) {
      console.error('Failed to load insurance data', err);
    }
  };

  useEffect(() => {
    if (patientId) fetchInsurancesAndCompanies();
  }, [patientId]);

  useEffect(() => {
    setLocalInsurances(insurances || []);
  }, [insurances]);

  const getInsuranceCompanyName = (insuranceCompanyId) => {
    if (insuranceCompanyId && typeof insuranceCompanyId === 'object') {
      return insuranceCompanyId.name || 'Unknown';
    }
    if (typeof insuranceCompanyId === 'string') {
      const company = (companies || []).find((c) => (c._id || c.id) === insuranceCompanyId);
      return company?.name || 'Unknown';
    }
    return 'Unknown';
  };

  const displayInsurances = localInsurances;
  const hasActiveCoverage = displayInsurances.some((i) => i.isActive);
  const inactiveInsurances = localInsurances.filter((i) => !i.isActive);

  const handleInsuranceAdd = () => {
    navigate(`/patients/${patientId}/insurance/new`);
  };
  const handleInsuranceEdit = (insurance) => {
    setEditCoverageModal({ open: true, insurance, mode: 'edit' });
    setInsuranceMenu({ anchorEl: null, insurance: null });
  };
  const handleViewPlan = (insurance) => {
    navigate(`/patients/${patientId}/insurance/${insurance._id || insurance.id}/edit`);
  };
  const handleInsuranceDelete = (insurance) => {
    setInsuranceDeleteDialog({ open: true, insurance });
    setInsuranceMenu({ anchorEl: null, insurance: null });
  };
  const handleInsuranceActivate = async (insurance) => {
    setInsuranceMenu({ anchorEl: null, insurance: null });
    try {
      await updateInsurance(insurance._id || insurance.id, { isActive: true }).unwrap();
      showSnackbar('Insurance activated successfully', 'success');
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to activate', 'error');
    }
  };
  const handleInsuranceDeactivate = async (insurance) => {
    setInsuranceMenu({ anchorEl: null, insurance: null });
    try {
      await updateInsurance(insurance._id || insurance.id, { isActive: false }).unwrap();
      showSnackbar('Insurance deactivated successfully', 'success');
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to deactivate', 'error');
    }
  };

  const handleInsuranceMenuOpen = (event, insurance) => setInsuranceMenu({ anchorEl: event.currentTarget, insurance });
  const handleInsuranceMenuClose = () => setInsuranceMenu((prev) => ({ ...prev, anchorEl: null }));
  const handleInsuranceMenuExited = () => setInsuranceMenu({ anchorEl: null, insurance: null });

  const handleCreatePolicyFromImported = async (insurance) => {
    try {
      setCreatingPolicy(true);
      await updateInsurance(insurance._id || insurance.id, { isActive: true }).unwrap();
      showSnackbar('Policy created successfully', 'success');
      setImportedCoverageModalOpen(false);
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to create policy', 'error');
    } finally {
      setCreatingPolicy(false);
    }
  };

  const handleSavePlan = async (planData) => {
    try {
      setSavingPlan(true);
      const companyId = typeof planData.insuranceCompanyId === 'object' ? (planData.insuranceCompanyId?._id || planData.insuranceCompanyId?.id) : planData.insuranceCompanyId;
      const payload = {
        insuranceCompanyId: companyId,
        policyNumber: String(planData.policyNumber || planData.groupNumber || '00000').slice(0, 30),
        groupNumber: planData.groupNumber,
        groupName: planData.groupName,
        subscriberName: planData.subscriberName || 'Subscriber',
        subscriberDateOfBirth: planData.subscriberDateOfBirth ? dayjs(planData.subscriberDateOfBirth).toISOString() : dayjs().subtract(25, 'year').toISOString(),
        relationshipToPatient: planData.relationshipToPatient || 'self',

        effectiveDate: planData.effectiveDate ? dayjs(planData.effectiveDate).toISOString() : dayjs().toISOString(),
        expirationDate: planData.expirationDate ? dayjs(planData.expirationDate).toISOString() : undefined,
        copayAmount: 0,
        deductibleAmount: planData.individualAnnualMax ?? 1500,
        notes: planData.notes,
        isActive: true,
        verificationStatus: 'pending',
      };
      await createInsurance(payload).unwrap();
      showSnackbar('Plan saved successfully. Unbilled procedures have been converted to unsent claims.', 'success');
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to save plan', 'error');
      throw err;
    } finally {
      setSavingPlan(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!insuranceDeleteDialog.insurance) return;
    try {
      setDeleteLoading(true);
      await removeInsurance(insuranceDeleteDialog.insurance._id || insuranceDeleteDialog.insurance.id).unwrap();
      showSnackbar('Insurance deleted successfully', 'success');
      setInsuranceDeleteDialog({ open: false, insurance: null });
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to delete', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleReorder = async (ins1, ins2, activeArray) => {
    // Optimistic UI Update
    const newLocalInsurances = [...localInsurances];
    const localIdx1 = newLocalInsurances.findIndex(i => (i.id || i._id) === (ins1.id || ins1._id));
    const localIdx2 = newLocalInsurances.findIndex(i => (i.id || i._id) === (ins2.id || ins2._id));
    
    if (localIdx1 !== -1 && localIdx2 !== -1) {
      [newLocalInsurances[localIdx1], newLocalInsurances[localIdx2]] = [newLocalInsurances[localIdx2], newLocalInsurances[localIdx1]];
      setLocalInsurances(newLocalInsurances);
    }

    const newOrderIds = activeArray.map(i => i.id || i._id);
    const idx1 = newOrderIds.indexOf(ins1.id || ins1._id);
    const idx2 = newOrderIds.indexOf(ins2.id || ins2._id);
    
    [newOrderIds[idx1], newOrderIds[idx2]] = [newOrderIds[idx2], newOrderIds[idx1]];

    try {
      await apiClient.post(`/patients/${patientId}/insurance/reorder`, {
        insuranceIds: newOrderIds
      });
      showSnackbar('Insurances reordered successfully', 'success');
      fetchInsurances();
    } catch (err) {
      console.error(err);
      // Revert optimistic update on failure
      setLocalInsurances(insurances || []);
      showSnackbar(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to reorder insurances', 'error');
    }
  };

  const handleMoveUp = (index, activeArray) => {
    if (index === 0) return;
    handleReorder(activeArray[index], activeArray[index - 1], activeArray);
  };

  const handleMoveDown = (index, activeArray) => {
    if (index === activeArray.length - 1) return;
    handleReorder(activeArray[index], activeArray[index + 1], activeArray);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          mt: 0,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          px: 2.5,
          py: 2,
          backgroundColor: COLORS.SURFACE_CARD,
          borderRadius: radius.xl,
          border: `0.8px solid ${COLORS.BORDER}`,
        }}
      >
        <Box>
          <Typography sx={{ fontFamily: "Inter", fontWeight: fontWeight.semibold, fontSize: fontSize.lg, color: COLORS.TEXT_PRIMARY }}>
            Insurance
          </Typography>
          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED, mt: 0.25 }}>
            {patientName} · {dobText}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setImportedCoverageModalOpen(true)}
            sx={{
              fontFamily: 'Inter',
              fontWeight: fontWeight.semibold,
              borderColor: COLORS.BORDER,
              color: COLORS.TEXT_BODY,
              bgcolor: COLORS.SURFACE_CARD,
              fontSize: fontSize.sm,
              boxShadow: "none",
              textTransform: 'none',
              py: 0.8,
              px: 1.5,
              borderRadius: radius.md,
              "&:hover": { backgroundColor: COLORS.SURFACE_HOVER, borderColor: COLORS.TEXT_MUTED },
            }}
          >
            Imported Coverage
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleInsuranceAdd}
            sx={{
              fontFamily: 'Inter',
              fontSize: fontSize.sm,
              bgcolor: COLORS.ACCENT,
              fontWeight: fontWeight.semibold,
              textTransform: 'none',
              py: 0.8,
              px: 1.5,
              borderRadius: radius.md,
              boxShadow: "none",
              "&:hover": { backgroundColor: COLORS.ACCENT_HOVER },
            }}
          >
            New Coverage
          </Button>
        </Box>
      </Box>

      <Box sx={{ pt: 0, display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          {!hasActiveCoverage ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 200,
                textAlign: 'center',
                bgcolor: 'transparent',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Inter',
                  fontSize: fontSize.md,
                  fontWeight: fontWeight.semibold,
                  color: COLORS.STATUS_ERROR,
                }}
              >
                Patient has no active coverage.
              </Typography>
            </Box>
          ) : (
            <>
              <Typography
                sx={{
                  fontFamily: 'Inter',
                  fontSize: fontSize.md,
                  fontWeight: fontWeight.semibold,
                  color: COLORS.TEXT_SECONDARY,
                  mb: 1.5,
                  textAlign: 'left',
                }}
              >
                Active Insurance Coverages
              </Typography>
              <Stack spacing={1.5} sx={{ mb: 3 }}>
                {displayInsurances.filter((i) => i.isActive).map((ins, index, array) => (
                  <CoverageRow
                    key={ins._id || ins.id}
                    ins={ins}
                    companies={companies}
                    getInsuranceCompanyName={getInsuranceCompanyName}
                    handleViewPlan={handleViewPlan}
                    handleInsuranceEdit={handleInsuranceEdit}
                    handleInsuranceDeactivate={handleInsuranceDeactivate}
                    isFirst={index === 0}
                    isLast={index === array.length - 1}
                    onMoveUp={() => handleMoveUp(index, array)}
                    onMoveDown={() => handleMoveDown(index, array)}
                    patient={patient}
                    onViewCarrierInfo={handleViewCarrierInfo}
                  />
                ))}
              </Stack>
            </>
          )}

          {inactiveInsurances.length > 0 && (
            <Box id="imported-coverage-list" sx={{ mt: 4, width: '100%' }}>
              <Typography
                sx={{
                  fontFamily: 'Inter',
                  fontSize: fontSize.md,
                  fontWeight: fontWeight.semibold,
                  color: COLORS.TEXT_SECONDARY,
                  mb: 1.5,
                  textAlign: 'left',
                }}
              >
                Inactive coverage (activate to use)
              </Typography>
              <Stack spacing={1.5}>
                {inactiveInsurances.map((ins) => (
                  <CoverageRow
                    key={ins._id || ins.id}
                    ins={ins}
                    companies={companies}
                    getInsuranceCompanyName={getInsuranceCompanyName}
                    handleViewPlan={handleViewPlan}
                    handleInsuranceEdit={handleInsuranceEdit}
                    handleInsuranceDeactivate={handleInsuranceDeactivate}
                    isInactive={true}
                    handleInsuranceActivate={handleInsuranceActivate}
                    isFirst={true}
                    isLast={true}
                    patient={patient}
                    onViewCarrierInfo={handleViewCarrierInfo}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Box>

      <InsuranceDialog
        open={insuranceDialog.open}
        onClose={() => setInsuranceDialog({ open: false, mode: 'add', insurance: null })}
        patientId={patientId}
        insurance={insuranceDialog.insurance}
        mode={insuranceDialog.mode}
        companies={companies || []}
        existingInsurances={insurances}
        onSave={async () => {
          await fetchInsurances();
          setInsuranceDialog({ open: false, mode: 'add', insurance: null });
        }}
        saving={insuranceSaving}
        setSaving={setInsuranceSaving}
      />

      <Menu
        anchorEl={insuranceMenu.anchorEl}
        open={Boolean(insuranceMenu.anchorEl)}
        onClose={handleInsuranceMenuClose}
        TransitionProps={{ onExited: handleInsuranceMenuExited }}
      >
        <MuiMenuItem
          onClick={() => {
            handleInsuranceMenuClose();
            navigate(`/patients/${patientId}/insurance/${insuranceMenu.insurance?._id || insuranceMenu.insurance?.id}`);
          }}
        >
          <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MuiMenuItem>
        <MuiMenuItem onClick={() => handleInsuranceEdit(insuranceMenu.insurance)}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MuiMenuItem>
        {insuranceMenu.insurance?.isActive ? (
          <MuiMenuItem onClick={() => handleInsuranceDeactivate(insuranceMenu.insurance)}>
            <ListItemIcon><CancelIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Deactivate</ListItemText>
          </MuiMenuItem>
        ) : (
          <MuiMenuItem onClick={() => handleInsuranceActivate(insuranceMenu.insurance)}>
            <ListItemIcon><CheckCircleIcon fontSize="small" color="success" /></ListItemIcon>
            <ListItemText>Activate</ListItemText>
          </MuiMenuItem>
        )}
        <MuiMenuItem onClick={() => handleInsuranceDelete(insuranceMenu.insurance)} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MuiMenuItem>
      </Menu>

      <EditCoverageModal
        open={editCoverageModal.open}
        onClose={() => setEditCoverageModal({ open: false, insurance: null, mode: 'edit' })}
        insurance={editCoverageModal.insurance}
        getInsuranceCompanyName={getInsuranceCompanyName}
        mode={editCoverageModal.mode || 'edit'}
        onSave={() => {
          showSnackbar('Coverage updated', 'success');
          setEditCoverageModal({ open: false, insurance: null, mode: 'edit' });
        }}
      />

      <ViewCoverage
        open={viewCoverageModal.open}
        onClose={() => setViewCoverageModal({ open: false, insurance: null })}
        insurance={viewCoverageModal.insurance}
        getInsuranceCompanyName={getInsuranceCompanyName}
      />

      <ImportedCoverageModal
        open={importedCoverageModalOpen}
        onClose={() => setImportedCoverageModalOpen(false)}
        inactiveInsurances={inactiveInsurances}
        getInsuranceCompanyName={getInsuranceCompanyName}
        onCreatePolicy={handleCreatePolicyFromImported}
        onSavePlan={handleSavePlan}
        creating={creatingPolicy}
        savingPlan={savingPlan}
        insurancePlans={planCatalog}
        coverageTemplates={coverageTemplates}
      />

      <ConfirmationDialog
        open={insuranceDeleteDialog.open}
        onClose={() => setInsuranceDeleteDialog({ open: false, insurance: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Insurance"
        message="Are you sure you want to delete this insurance record?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={deleteLoading}
      />

      <CarrierInfoDialog
        open={carrierInfoOpen}
        onClose={() => setCarrierInfoOpen(false)}
        company={selectedCarrier}
      />
    </LocalizationProvider>
  );
}
