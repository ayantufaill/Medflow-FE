import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import { formatDate, formatDateForPayload } from '../../utils/dateUtils';
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
import InsuranceTabs from '../insurance/InsuranceTabs';
import ImportedCoverageBanner from '../insurance/ImportedCoverageBanner';
import FamilyCoverageBanner from '../insurance/FamilyCoverageBanner';
import FamilyCoverageMatrix from '../insurance/components/FamilyCoverageMatrix';
import CoverageOrderPanel from '../cob/CoverageOrderPanel';
import { getCoverageAmounts, getCoverageUsage } from '../insurance/utils/insuranceHelpers';
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, radius } from "../../constants/styles";
import {
  fetchInsuranceUsage,
  selectInsuranceUsage,
  selectInsuranceUsageCache,
} from '../../store/slices/patientSlice';

const CoverageRow = ({
  ins, 
  companies, 
  getInsuranceCompanyName, 
  handleViewPlan, 
  handleInsuranceDeactivate, 
  isInactive, 
  handleInsuranceActivate,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  patient,
  onViewCarrierInfo,
  usage
}) => {
  const [expanded, setExpanded] = useState(false);
  const companyName = getInsuranceCompanyName(ins.insuranceCompanyId);
  const { usedAmount, maxAmount } = getCoverageAmounts(ins, usage);

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
      <Box 
        onClick={() => setExpanded(!expanded)}
        sx={{ py: 1.5, px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', cursor: 'pointer' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <IconButton size="small" sx={{ p: 0.2, color: COLORS.TEXT_MUTED }}>
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
        <Box 
          onClick={(e) => e.stopPropagation()}
          sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
        >
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
                  {ins.subscriberDateOfBirth ? formatDate(ins.subscriberDateOfBirth) : (((!ins.relationshipToPatient || ins.relationshipToPatient.toLowerCase() === 'self') && patient?.dateOfBirth) ? formatDate(patient.dateOfBirth) : '-')}
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
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();

  const patientName = patient ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim() : "Patient";
  const formattedDob = patient?.dateOfBirth ? formatDate(patient.dateOfBirth, 'MMM D, YYYY') : null;
  const dobText = formattedDob && formattedDob !== '-' 
    ? `DOB: ${formattedDob}`
    : "DOB: N/A";
  const {
    insurances,
    fetch: fetchInsurances,
    create: createInsurance,
    update: updateInsurance,
    remove: removeInsurance,
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
  const [tabValue, setTabValue] = useState(0);
  const insuranceUsage = useSelector(selectInsuranceUsage);
  const insuranceUsageCache = useSelector(selectInsuranceUsageCache);
  const cachedUsage = patientId ? insuranceUsageCache[patientId]?.data : null;
  const activeUsage = cachedUsage ?? insuranceUsage ?? null;

  const handleViewCarrierInfo = (company) => {
    setSelectedCarrier(company);
    setCarrierInfoOpen(true);
  };

  const fetchInsurancesAndCompanies = useCallback(async () => {
    try {
      await Promise.all([
        fetchInsurances(),
        fetchAllCatalog(),
      ]);
    } catch (err) {
      console.error('Failed to load insurance data', err);
    }
  }, [fetchAllCatalog, fetchInsurances]);

  useEffect(() => {
    if (patientId) fetchInsurancesAndCompanies();
  }, [patientId, fetchInsurancesAndCompanies]);

  useEffect(() => {
    if (patientId) dispatch(fetchInsuranceUsage(patientId));
  }, [patientId, dispatch]);

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
  
  const isFamily = (i) => Boolean(
    i.isFamilyPlan || 
    (i.members && i.members.length > 1) || 
    (i.relationshipToPatient && i.relationshipToPatient.toLowerCase() !== 'self')
  );

  const filteredTabInsurances = useMemo(() => {
    switch (tabValue) {
      case 0: { // Active Coverages (1st Tab)
        const activeInd = displayInsurances.filter((i) => i.isActive && !isFamily(i));
        return activeInd.length > 0 ? activeInd : displayInsurances.filter((i) => i.isActive);
      }
      case 1: // Family Coverages (2nd Tab)
        return displayInsurances.filter((i) => i.isActive && isFamily(i));
      case 2: { // Archived Coverages (3rd Tab)
        const archInd = displayInsurances.filter((i) => !i.isActive && !isFamily(i));
        return archInd.length > 0 ? archInd : displayInsurances.filter((i) => !i.isActive);
      }
      case 3: // Archived Family Coverages (4th Tab)
        return displayInsurances.filter((i) => !i.isActive && isFamily(i));
      default:
        return displayInsurances.filter((i) => i.isActive);
    }
  }, [displayInsurances, tabValue]);

  const inactiveInsurances = localInsurances.filter((i) => !i.isActive);

  // Household members already imply "family with coverage" — the matrix itself
  // confirms per-policy detail, this banner is just a nudge to go look.
  const hasHousehold = Array.isArray(patient?.household) && patient.household.length > 0;
  // Reuses the same inactive-coverage set the "Imported Coverage" button/modal
  // already treats as pending import, so the banner and the modal never disagree.
  const hasImportedCoverage = inactiveInsurances.length > 0;
  const isFamilyTab = tabValue === 1 || tabValue === 3;

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
      setLocalInsurances((prev) =>
        prev.map((i) => ((i._id || i.id) === (insurance._id || insurance.id) ? { ...i, isActive: true } : i))
      );
      showSnackbar('Insurance activated successfully', 'success');
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to activate', 'error');
    }
  };
  const handleInsuranceDeactivate = async (insurance) => {
    setInsuranceMenu({ anchorEl: null, insurance: null });
    try {
      await updateInsurance(insurance._id || insurance.id, { isActive: false }).unwrap();
      setLocalInsurances((prev) =>
        prev.map((i) => ((i._id || i.id) === (insurance._id || insurance.id) ? { ...i, isActive: false } : i))
      );
      showSnackbar('Insurance deactivated successfully', 'success');
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to deactivate', 'error');
    }
  };

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
        subscriberDateOfBirth: formatDateForPayload(planData.subscriberDateOfBirth) || dayjs().subtract(25, 'year').format('YYYY-MM-DD'),
        relationshipToPatient: planData.relationshipToPatient || 'self',

        effectiveDate: formatDateForPayload(planData.effectiveDate) || dayjs().format('YYYY-MM-DD'),
        expirationDate: formatDateForPayload(planData.expirationDate),
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

  // Single matcher for both this tab and the finance coverage card, so a policy
  // shows the same used/max pair wherever it appears.
  const getUsageForCoverage = (ins, index) => getCoverageUsage(ins, index, activeUsage);

  // Carrier list in the shape the COB panel's dialogs expect. Reuses the
  // companies already loaded for this tab rather than fetching the same list
  // again.
  const carrierOptions = useMemo(
    () =>
      (companies || []).map((company) => ({
        id: company._id || company.id,
        name: company.name || company.companyName,
        // Drives the Medicare questions on the coverage form; absent until the
        // carrier's payer type has been recorded, in which case the form falls
        // back to the coverage basis.
        payerType: company.payerType,
      })),
    [companies]
  );

  /** Same, for the plan picker. */
  const planOptions = useMemo(
    () =>
      (planCatalog || []).map((plan) => ({
        id: plan._id || plan.id,
        carrierId:
          plan.insuranceCompanyId?._id || plan.insuranceCompanyId?.id || plan.insuranceCompanyId,
        name: plan.groupName || plan.name || plan.templateName,
        benefitCategory: plan.benefitCategory,
      })),
    [planCatalog]
  );

  // A NEEDS_INFO "fix this" click lands here. The existing coverage editor is
  // a full page, so we route to it and carry the field to focus in the query
  // string; `mode: 'create'` comes from the panel's empty state instead.
  const handleCoverageOrderEdit = (target = {}) => {
    if (target.mode === 'create' || (!target.coverageId && !target.field)) {
      handleInsuranceAdd();
      return;
    }
    const query = target.field ? `?focus=${encodeURIComponent(target.field)}` : '';
    navigate(`/patients/${patientId}/insurance/${target.coverageId}/edit${query}`);
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

      {(hasHousehold || hasImportedCoverage) && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          {hasHousehold && (
            <Box sx={{ flex: 1, minWidth: 320 }}>
              <FamilyCoverageBanner onReview={() => setTabValue(1)} />
            </Box>
          )}
          {hasImportedCoverage && (
            <Box sx={{ flex: 1, minWidth: 320 }}>
              <ImportedCoverageBanner onReview={() => setImportedCoverageModalOpen(true)} />
            </Box>
          )}
        </Box>
      )}

      {/* Who we bill first, and why. Sits above the coverage list because the
          order (and anything blocking a claim) is the question staff open this
          tab to answer; the individual policies are the detail behind it. */}
      <Box sx={{ mt: 2 }}>
        <CoverageOrderPanel
          patientId={patientId}
          /* The patient's age plus which policies a parent holds is what
             decides whether the dependent-child custody questions apply —
             see deriveCoverageFormContext. */
          patient={patient}
          carriers={carrierOptions}
          plans={planOptions}
          onEditCoverage={handleCoverageOrderEdit}
          onOpenClaim={(claimId) => navigate(`/claims/${claimId}`)}
        />
      </Box>

      <Box sx={{ pt: 0, display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <InsuranceTabs tabValue={tabValue} onTabChange={(e, val) => setTabValue(val)} />

          {isFamilyTab ? (
            <FamilyCoverageMatrix
              patient={patient}
              patientId={patientId}
              patientInsurances={displayInsurances}
              getInsuranceCompanyName={getInsuranceCompanyName}
              showArchived={tabValue === 3}
              onViewPolicy={(member, ins) => navigate(`/patients/${member.id}/insurance/${ins._id || ins.id}/edit`)}
              onChanged={fetchInsurancesAndCompanies}
            />
          ) : filteredTabInsurances.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 180,
                textAlign: 'center',
                bgcolor: 'transparent',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Inter',
                  fontSize: fontSize.md,
                  fontWeight: fontWeight.semibold,
                  color: COLORS.TEXT_MUTED,
                }}
              >
                No coverages found for this section.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              {filteredTabInsurances.map((ins, index, array) => (
                <CoverageRow
                  key={ins._id || ins.id}
                  ins={ins}
                  companies={companies}
                  getInsuranceCompanyName={getInsuranceCompanyName}
                  handleViewPlan={handleViewPlan}
                  handleInsuranceDeactivate={handleInsuranceDeactivate}
                  isInactive={!ins.isActive}
                  handleInsuranceActivate={handleInsuranceActivate}
                  isFirst={index === 0}
                  isLast={index === array.length - 1}
                  onMoveUp={() => handleMoveUp(index, array)}
                  onMoveDown={() => handleMoveDown(index, array)}
                  patient={patient}
                  onViewCarrierInfo={handleViewCarrierInfo}
                  usage={getUsageForCoverage(ins, index)}
                />
              ))}
            </Stack>
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
