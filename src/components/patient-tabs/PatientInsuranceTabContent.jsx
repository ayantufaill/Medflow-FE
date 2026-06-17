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
import { useInsuranceCatalog } from '../../hooks/redux/useInsuranceCatalog';
import InsuranceDialog from '../insurance/InsuranceDialog';
import ImportedCoverageModal from '../insurance/ImportedCoverageModal';
import EditCoverageModal from '../insurance/EditCoverageModal';
import ViewCoverage from '../insurance/ViewCoverage';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import CarrierInfoModal from '../insurance/CarrierInfoModal';

const CoverageRow = ({ ins, companies, getInsuranceCompanyName, handleViewPlan, handleInsuranceEdit, handleInsuranceDeactivate, isInactive, handleInsuranceActivate }) => {
  const [expanded, setExpanded] = useState(false);
  const [carrierInfoModalOpen, setCarrierInfoModalOpen] = useState(false);
  const companyName = getInsuranceCompanyName(ins.insuranceCompanyId);
  const usedAmount = ins.usedAmount ?? ins.copayAmount ?? 0;
  const maxAmount = ins.individualAnnualMax ?? ins.deductibleAmount ?? 1500;

  const getCompany = (insuranceCompanyId) => {
    // Determine the ID string whether it was populated as an object or just passed as a string
    const idStr = insuranceCompanyId?._id || insuranceCompanyId?.id || (typeof insuranceCompanyId === 'string' ? insuranceCompanyId : null);
    
    // Always prefer the full company object from the Redux store
    if (idStr) {
      const fullCompany = (companies || []).find((c) => (c._id || c.id) === idStr);
      if (fullCompany) return fullCompany;
    }
    
    // Fallback to the provided object (which might be sparsely populated)
    if (insuranceCompanyId && typeof insuranceCompanyId === 'object') return insuranceCompanyId;
    return null;
  };
  const company = getCompany(ins.insuranceCompanyId);
  const payerId = company?.payerId || company?.electronicId || '-';
  const address = company?.address ? `${company.address.street || ''} ${company.address.city || ''}, ${company.address.state || ''} ${company.address.zipCode || ''}` : '-';

  return (
    <Paper variant="outlined" sx={{ borderColor: '#b0c4de', borderRadius: '6px', overflow: 'hidden' }}>
      <Box sx={{ py: 0.8, px: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <IconButton size="small" onClick={() => setExpanded(!expanded)} sx={{ p: 0.2, color: '#5c6b89' }}>
            {expanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
          </IconButton>
          <Typography sx={{ fontFamily: '"Manrope", "Segoe UI", sans-serif', fontSize: '0.8125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <Box component="span" sx={{ color: '#4a6da7' }}>{(ins.insuranceType || 'Primary').charAt(0).toUpperCase() + (ins.insuranceType || 'primary').slice(1)}:</Box>{' '}
            <Box component="span" sx={{ fontWeight: 600, color: '#333' }}>{ins.employerName || ins.planName?.split(' by ')[0] || companyName}</Box>{' '}
            <Box component="span" sx={{ color: '#5c6b89' }}>by {companyName}</Box>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
          <Typography sx={{ fontFamily: '"Manrope", "Segoe UI", sans-serif', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
            <Box component="span" sx={{ color: '#5c6b89' }}>Used up-to-date: </Box>
            <Box component="span" sx={{ color: '#4a6da7', fontWeight: 600 }}>${Number(usedAmount).toFixed(2)} / ${Number(maxAmount).toFixed(2)}</Box>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          {isInactive ? (
            <Button size="small" variant="contained" color="success" onClick={() => handleInsuranceActivate(ins)} sx={{ fontFamily: '"Manrope", "Segoe UI", sans-serif', fontSize: '0.7rem', textTransform: 'none', minWidth: 'auto', py: 0.2, px: 1 }}>Activate</Button>
          ) : (
            <>
              <Button size="small" variant="contained" onClick={() => handleViewPlan(ins)} sx={{ fontFamily: '"Manrope", "Segoe UI", sans-serif', fontSize: '0.7rem', textTransform: 'none', minWidth: 'auto', py: 0.2, px: 1, bgcolor: '#4a6da7', '&:hover': { bgcolor: '#3b588c' } }}>View Plan</Button>
              <Button size="small" variant="contained" onClick={() => handleInsuranceEdit(ins)} sx={{ fontFamily: '"Manrope", "Segoe UI", sans-serif', fontSize: '0.7rem', textTransform: 'none', minWidth: 'auto', py: 0.2, px: 1, bgcolor: '#4a6da7', '&:hover': { bgcolor: '#3b588c' } }}>Edit Policy</Button>
              <Button size="small" variant="contained" color="error" onClick={() => handleInsuranceDeactivate(ins)} sx={{ fontFamily: '"Manrope", "Segoe UI", sans-serif', fontSize: '0.7rem', textTransform: 'none', minWidth: 'auto', py: 0.2, px: 1, bgcolor: '#e55353', '&:hover': { bgcolor: '#c94141' } }}>Deactivate</Button>
            </>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', color: '#5c6b89', ml: 0.5, cursor: 'pointer' }}>
            <KeyboardArrowUpIcon sx={{ fontSize: '0.85rem', mb: -0.5 }} />
            <KeyboardArrowDownIcon sx={{ fontSize: '0.85rem' }} />
          </Box>
        </Box>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2, pt: 0, borderTop: '1px solid #f0f0f0', bgcolor: '#fafafa' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' }, gap: 4, mt: 0 }}>
            <Box sx={{ width: 340, justifySelf: 'start' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Payer Name:</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#333', fontWeight: 500, textAlign: 'right' }}>{companyName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Payer ID:</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#333', fontWeight: 500, textAlign: 'right' }}>{payerId}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Group Name:</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#333', fontWeight: 500, textAlign: 'right' }}>{ins.groupName || ins.planName || '-'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Group Number:</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#333', fontWeight: 500, textAlign: 'right' }}>{ins.groupNumber || '-'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Notes:</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#333', fontWeight: 500, textAlign: 'right' }}>{ins.notes || ''}</Typography>
              </Box>
            </Box>
            <Box sx={{ width: 340, justifySelf: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Patient's Relationship to Subscriber:</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#333', fontWeight: 500, textAlign: 'right' }}>{ins.relationshipToPatient || 'Self'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Subscriber's Name:</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#333', fontWeight: 500, textAlign: 'right' }}>{ins.subscriberName || '-'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Subscriber's Birthday:</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#333', fontWeight: 500, textAlign: 'right' }}>{ins.subscriberDateOfBirth ? dayjs(ins.subscriberDateOfBirth).format('MM/DD/YYYY') : '-'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Subscriber's ID:</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#333', fontWeight: 500, textAlign: 'right' }}>{ins.subscriberId || ins.policyNumber || '-'}</Typography>
              </Box>
            </Box>
            <Box sx={{ width: 340, justifySelf: 'end' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Employer Name:</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#333', fontWeight: 500, textAlign: 'right' }}>{ins.employerName || '-'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Payer Address:</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#333', fontWeight: 500, textAlign: 'right' }}>{address}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Payer Contact Info:</Typography>
                <Typography 
                  sx={{ fontSize: '0.8rem', color: '#1976d2', fontWeight: 500, textAlign: 'right', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => setCarrierInfoModalOpen(true)}
                >
                  {ins.payerContactInfo || 'View Contact Info'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Collapse>
      
      <CarrierInfoModal 
        open={carrierInfoModalOpen} 
        onClose={() => setCarrierInfoModalOpen(false)} 
        carrier={company} 
      />
    </Paper>
  );
};

export default function PatientInsuranceTabContent({ patientId }) {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
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
    fetchCompanies,
    fetchPlans,
    fetchTemplates,
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

  const fetchInsurancesAndCompanies = async () => {
    try {
      await Promise.all([
        fetchInsurances(),
        fetchCompanies(),
      ]);
    } catch (err) {
      console.error('Failed to load insurance data', err);
    }
  };

  useEffect(() => {
    if (patientId) fetchInsurancesAndCompanies();
  }, [patientId]);

  useEffect(() => {
    console.log('InsuranceDialog state:', insuranceDialog);
    console.log('patientId:', patientId);
  }, [insuranceDialog, patientId]);

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

  const displayInsurances = insurances;
  const hasActiveCoverage = displayInsurances.some((i) => i.isActive);
  const inactiveInsurances = insurances.filter((i) => !i.isActive);

  const handleInsuranceAdd = () => {
    console.log('Navigating to Add Coverage page...', patientId);
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
        insuranceType: planData.insuranceType || 'primary',
        effectiveDate: planData.effectiveDate ? dayjs(planData.effectiveDate).toISOString() : dayjs().toISOString(),
        expirationDate: planData.expirationDate ? dayjs(planData.expirationDate).toISOString() : undefined,
        copayAmount: 0,
        deductibleAmount: planData.individualAnnualMax ?? 1500,
        notes: planData.notes,
        isActive: true,
        verificationStatus: 'pending',
      };
      await createInsurance(payload).unwrap();
      showSnackbar('Plan saved successfully', 'success');
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3, display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          {!hasActiveCoverage ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 320,
                textAlign: 'center',
                fontFamily: '"Manrope", "Segoe UI", sans-serif',
                bgcolor: 'white',
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Manrope", "Segoe UI", sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#c62828',
                  mb: 2.5,
                }}
              >
                Patient has no active coverage.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    setImportedCoverageModalOpen(true);
                    fetchPlans();
                    fetchTemplates();
                  }}
                  sx={{
                    fontFamily: '"Manrope", "Segoe UI", sans-serif',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    py: 1,
                    px: 1.5,
                  }}
                >
                  Imported Coverage
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleInsuranceAdd}
                  sx={{
                    fontFamily: '"Manrope", "Segoe UI", sans-serif',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    py: 1,
                    px: 1.5,
                  }}
                >
                  New Coverage
                </Button>
              </Box>

            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    setImportedCoverageModalOpen(true);
                    fetchPlans();
                    fetchTemplates();
                  }}
                  sx={{
                    fontFamily: '"Manrope", "Segoe UI", sans-serif',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    py: 1,
                    px: 1.5,
                  }}
                >
                  Imported Coverage
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleInsuranceAdd}
                  sx={{
                    fontFamily: '"Manrope", "Segoe UI", sans-serif',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    py: 1,
                    px: 1.5,
                  }}
                >
                  New Coverage
                </Button>
              </Box>
              <Typography
                sx={{
                  fontFamily: '"Manrope", "Segoe UI", sans-serif',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#616161',
                  mb: 1.5,
                  textAlign: 'left',
                }}
              >
                Active Insurance Coverages
              </Typography>
              <Stack spacing={1.5} sx={{ mb: 3 }}>
                {displayInsurances.filter((i) => i.isActive).map((ins) => (
                  <CoverageRow
                    key={ins._id || ins.id}
                    ins={ins}
                    companies={companies}
                    getInsuranceCompanyName={getInsuranceCompanyName}
                    handleViewPlan={handleViewPlan}
                    handleInsuranceEdit={handleInsuranceEdit}
                    handleInsuranceDeactivate={handleInsuranceDeactivate}
                  />
                ))}
              </Stack>
            </>
          )}

          {inactiveInsurances.length > 0 && (
            <Box id="imported-coverage-list" sx={{ mt: 4, width: '100%' }}>
              <Typography
                sx={{
                  fontFamily: '"Manrope", "Segoe UI", sans-serif',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#616161',
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
    </LocalizationProvider>
  );
}
