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
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { patientService } from '../../services/patient.service';
import { insuranceCompanyService, insurancePlanService } from '../../services/insurance.service';
import InsuranceDialog from '../insurance/InsuranceDialog';
import ImportedCoverageModal from '../insurance/ImportedCoverageModal';
import EditCoverageModal from '../insurance/EditCoverageModal';
import ConfirmationDialog from '../shared/ConfirmationDialog';

export default function PatientInsuranceTabContent({ patientId }) {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [insurances, setInsurances] = useState([]);
  const [allCompanies, setAllCompanies] = useState({ companies: [] });
  const [insuranceDialog, setInsuranceDialog] = useState({ open: false, mode: 'add', insurance: null });
  const [insuranceMenu, setInsuranceMenu] = useState({ anchorEl: null, insurance: null });
  const [insuranceSaving, setInsuranceSaving] = useState(false);
  const [insuranceDeleteDialog, setInsuranceDeleteDialog] = useState({ open: false, insurance: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [importedCoverageModalOpen, setImportedCoverageModalOpen] = useState(false);
  const [editCoverageModal, setEditCoverageModal] = useState({ open: false, insurance: null, mode: 'edit' });
  const [creatingPolicy, setCreatingPolicy] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);
  const [planCatalog, setPlanCatalog] = useState([]);
  const [coverageTemplates, setCoverageTemplates] = useState([]);

  const fetchInsurancesAndCompanies = async () => {
    try {
      const [insList, companies, plans, templates] = await Promise.all([
        patientService.getPatientInsurances(patientId, undefined),
        insuranceCompanyService.getAllInsuranceCompanies(1, 500),
        insurancePlanService.getInsurancePlans(1, 100, ''),
        insurancePlanService.getCoverageTemplates(),
      ]);
      setInsurances(insList || []);
      setAllCompanies(companies || { companies: [] });
      setPlanCatalog(plans?.plans || []);
      setCoverageTemplates(templates?.templates || []);
    } catch (err) {
      console.error('Failed to load insurance data', err);
    }
  };

  useEffect(() => {
    if (patientId) fetchInsurancesAndCompanies();
  }, [patientId]);

  const getInsuranceCompanyName = (insuranceCompanyId) => {
    if (insuranceCompanyId && typeof insuranceCompanyId === 'object') {
      return insuranceCompanyId.name || 'Unknown';
    }
    if (typeof insuranceCompanyId === 'string') {
      const company = (allCompanies.companies || []).find((c) => (c._id || c.id) === insuranceCompanyId);
      return company?.name || 'Unknown';
    }
    return 'Unknown';
  };

  const displayInsurances = insurances;
  const hasActiveCoverage = displayInsurances.some((i) => i.isActive);
  const inactiveInsurances = insurances.filter((i) => !i.isActive);

  const handleInsuranceAdd = () => setInsuranceDialog({ open: true, mode: 'add', insurance: null });
  const handleInsuranceEdit = (insurance) => {
    setEditCoverageModal({ open: true, insurance, mode: 'edit' });
    setInsuranceMenu({ anchorEl: null, insurance: null });
  };
  const handleViewPlan = (insurance) => {
    setEditCoverageModal({ open: true, insurance, mode: 'view' });
  };
  const handleInsuranceDelete = (insurance) => {
    setInsuranceDeleteDialog({ open: true, insurance });
    setInsuranceMenu({ anchorEl: null, insurance: null });
  };
  const handleInsuranceActivate = async (insurance) => {
    setInsuranceMenu({ anchorEl: null, insurance: null });
    try {
      await patientService.updatePatientInsurance(patientId, insurance._id || insurance.id, { isActive: true });
      showSnackbar('Insurance activated successfully', 'success');
      await fetchInsurancesAndCompanies();
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to activate', 'error');
    }
  };
  const handleInsuranceDeactivate = async (insurance) => {
    setInsuranceMenu({ anchorEl: null, insurance: null });
    try {
      await patientService.updatePatientInsurance(patientId, insurance._id || insurance.id, { isActive: false });
      showSnackbar('Insurance deactivated successfully', 'success');
      await fetchInsurancesAndCompanies();
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
      await patientService.updatePatientInsurance(patientId, insurance._id || insurance.id, { isActive: true });
      showSnackbar('Policy created successfully', 'success');
      await fetchInsurancesAndCompanies();
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
      await patientService.createPatientInsurance(patientId, payload);
      showSnackbar('Plan saved successfully', 'success');
      await fetchInsurancesAndCompanies();
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
      await patientService.deletePatientInsurance(patientId, insuranceDeleteDialog.insurance._id || insuranceDeleteDialog.insurance.id);
      showSnackbar('Insurance deleted successfully', 'success');
      setInsuranceDeleteDialog({ open: false, insurance: null });
      await fetchInsurancesAndCompanies();
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
                  onClick={() => setImportedCoverageModalOpen(true)}
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
              {inactiveInsurances.length > 0 && (
                <Box id="imported-coverage-list" sx={{ mt: 4, width: '100%', maxWidth: 500 }}>
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
                  <Stack spacing={1}>
                    {inactiveInsurances.map((ins) => (
                      <Paper
                        key={ins._id || ins.id}
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderColor: '#e0e0e0',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: '"Manrope", "Segoe UI", sans-serif',
                            fontSize: '0.875rem',
                            color: '#424242',
                          }}
                        >
                          {getInsuranceCompanyName(ins.insuranceCompanyId)} – {ins.insuranceType || 'Unknown'}
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          onClick={() => handleInsuranceActivate(ins)}
                          sx={{
                            fontFamily: '"Manrope", "Segoe UI", sans-serif',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          Activate
                        </Button>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setImportedCoverageModalOpen(true)}
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
                  textAlign: 'center',
                }}
              >
                Active Insurance Coverages
              </Typography>
              <Stack spacing={1.5} sx={{ mb: 3 }}>
                {displayInsurances.filter((i) => i.isActive).map((ins) => {
                  const companyName = getInsuranceCompanyName(ins.insuranceCompanyId);
                  const usedAmount = ins.usedAmount ?? ins.copayAmount ?? 0;
                  const maxAmount = ins.individualAnnualMax ?? ins.deductibleAmount ?? 1500;
                  return (
                    <Paper
                      key={ins._id || ins.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        borderColor: '#e0e0e0',
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 200 }}>
                        <Typography
                          sx={{
                            fontFamily: '"Manrope", "Segoe UI", sans-serif',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: '#424242',
                          }}
                        >
                          {(ins.insuranceType || 'Primary').charAt(0).toUpperCase() + (ins.insuranceType || 'primary').slice(1)}:{' '}
                          <Box component="span" sx={{ fontWeight: 700 }}>{ins.employerName || ins.planName?.split(' by ')[0] || companyName}</Box>
                          {' '}by {companyName}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: '"Manrope", "Segoe UI", sans-serif',
                            fontSize: '0.8125rem',
                            color: '#757575',
                            mt: 0.5,
                          }}
                        >
                          Used up-to-date: ${Number(usedAmount).toFixed(2)} / ${Number(maxAmount).toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => handleViewPlan(ins)}
                          sx={{ fontFamily: '"Manrope", "Segoe UI", sans-serif', fontSize: '0.75rem', textTransform: 'none' }}
                        >
                          View Plan
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => handleInsuranceEdit(ins)}
                          sx={{ fontFamily: '"Manrope", "Segoe UI", sans-serif', fontSize: '0.75rem', textTransform: 'none' }}
                        >
                          Edit Policy
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => handleInsuranceDeactivate(ins)}
                          sx={{ fontFamily: '"Manrope", "Segoe UI", sans-serif', fontSize: '0.75rem', textTransform: 'none' }}
                        >
                          Deactivate
                        </Button>
                        <IconButton size="small" onClick={(e) => handleInsuranceMenuOpen(e, ins)}>
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </Paper>
                  );
                })}
              </Stack>
            </>
          )}
        </Box>
      </Box>

      <InsuranceDialog
        open={insuranceDialog.open}
        onClose={() => setInsuranceDialog({ open: false, mode: 'add', insurance: null })}
        patientId={patientId}
        insurance={insuranceDialog.insurance}
        mode={insuranceDialog.mode}
        companies={allCompanies.companies || []}
        existingInsurances={insurances}
        onSave={async () => {
          await fetchInsurancesAndCompanies();
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
