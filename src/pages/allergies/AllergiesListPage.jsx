import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { allergyService } from '../../services/allergy.service';
import { allergyKeys, useAllergies } from '../../hooks/queries/useAllergies';
import { usePatient } from '../../hooks/queries/usePatients';
import { ConfirmationDialog } from '../../components/shared';

const SEVERITY_COLOR = { mild: 'success', moderate: 'warning', severe: 'error' };

const AllergiesListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patient_id');
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data: patient } = usePatient(patientId);
  const { data: allergies = [], isLoading, isError } = useAllergies(patientId);

  const [deleteDialog, setDeleteDialog] = useState({ open: false, allergyId: null, allergen: '' });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionMenu, setActionMenu] = useState({ anchorEl: null, allergyId: null, allergen: '' });

  const activeAllergies = allergies.filter((a) => a.isActive !== false);

  const openActionMenu = (e, allergyId, allergen) =>
    setActionMenu({ anchorEl: e.currentTarget, allergyId, allergen });

  const closeActionMenu = () =>
    setActionMenu({ anchorEl: null, allergyId: null, allergen: '' });

  const handleEdit = (allergyId) => {
    closeActionMenu();
    navigate(`/allergies/${allergyId}/edit`);
  };

  const handleDeleteClick = (allergyId, allergen) => {
    closeActionMenu();
    setDeleteDialog({ open: true, allergyId, allergen });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await allergyService.deleteAllergy(deleteDialog.allergyId);
      showSnackbar('Allergy deleted successfully', 'success');
      setDeleteDialog({ open: false, allergyId: null, allergen: '' });
      queryClient.invalidateQueries({ queryKey: allergyKeys.byPatient(patientId) });
    } catch (err) {
      const message =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to delete allergy. Please try again.';
      showSnackbar(message, 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!patientId) {
    return <Alert severity="warning">Please provide a patient_id in the URL query parameters.</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Allergies</Typography>
          {patient && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Patient: {patient.firstName} {patient.lastName} ({patient.patientCode})
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(`/allergies/new?patient_id=${patientId}`)}
        >
          Add Allergy
        </Button>
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to fetch allergies. Please try again.
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Allergen</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Reaction</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Severity</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Documented By</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Documented Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeAllergies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No allergies found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  activeAllergies.map((allergy) => (
                    <TableRow key={allergy._id || allergy.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{allergy.allergen}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 300 }}>{allergy.reaction}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={allergy.severity ? allergy.severity.charAt(0).toUpperCase() + allergy.severity.slice(1) : 'Unknown'}
                          color={SEVERITY_COLOR[allergy.severity] || 'default'}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        {allergy.documentedBy
                          ? `${allergy.documentedBy.firstName || ''} ${allergy.documentedBy.lastName || ''}`.trim() || '-'
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {allergy.documentedDate ? dayjs(allergy.documentedDate).format('MM/DD/YYYY') : '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={allergy.isActive ? 'Active' : 'Inactive'}
                          color={allergy.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => openActionMenu(e, allergy._id || allergy.id, allergy.allergen)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Menu
        anchorEl={actionMenu.anchorEl}
        open={Boolean(actionMenu.anchorEl)}
        onClose={closeActionMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => handleEdit(actionMenu.allergyId)}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handleDeleteClick(actionMenu.allergyId, actionMenu.allergen)}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <ConfirmationDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, allergyId: null, allergen: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Allergy"
        message={`Are you sure you want to delete allergy "${deleteDialog.allergen}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={deleteLoading}
      />
    </Box>
  );
};

export default AllergiesListPage;
