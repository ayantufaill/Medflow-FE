import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  TextField,
  IconButton,
  Chip,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { allergyService } from "../../services/allergy.service";
import { patientService } from "../../services/patient.service";
import ConfirmationDialog from "../../components/shared/ConfirmationDialog";
import dayjs from "dayjs";

const AllergiesListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientIdFromQuery = searchParams.get("patient_id");
  const { showSnackbar } = useSnackbar();
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [patient, setPatient] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    allergyId: null,
    allergen: "",
  });
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    allergyId: null,
    allergen: "",
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchPatient = useCallback(async () => {
    if (patientIdFromQuery) {
      try {
        const patientData = await patientService.getPatientById(patientIdFromQuery);
        setPatient(patientData);
      } catch (err) {
        console.error("Error fetching patient:", err);
      }
    }
  }, [patientIdFromQuery]);

  const fetchAllergies = useCallback(async () => {
    if (!patientIdFromQuery) {
      setError("Patient ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const allergiesData = await allergyService.getAllergies(patientIdFromQuery);
      setAllergies(allergiesData || []);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to fetch allergies. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [patientIdFromQuery]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  useEffect(() => {
    fetchAllergies();
  }, [fetchAllergies]);

  const handleDeleteClick = (allergyId, allergen) => {
    setDeleteDialog({
      open: true,
      allergyId,
      allergen,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      setError("");
      const allergyId = deleteDialog.allergyId;
      
      if (!allergyId) {
        throw new Error("Allergy ID is missing");
      }
      
      await allergyService.deleteAllergy(allergyId);
      showSnackbar("Allergy deleted successfully", "success");
      setDeleteDialog({ open: false, allergyId: null, allergen: "" });
      await fetchAllergies();
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        "Failed to delete allergy. Please try again.";
      setError(errorMessage);
      showSnackbar(errorMessage, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, allergyId: null, allergen: "" });
  };

  const handleActionMenuOpen = (event, allergyId, allergen) => {
    setActionMenu({
      anchorEl: event.currentTarget,
      allergyId,
      allergen,
    });
  };

  const handleActionMenuClose = () => {
    setActionMenu({
      anchorEl: null,
      allergyId: null,
      allergen: "",
    });
  };

  const handleEdit = (allergyId) => {
    handleActionMenuClose();
    navigate(`/allergies/${allergyId}/edit`);
  };

  const handleDelete = (allergyId, allergen) => {
    handleActionMenuClose();
    handleDeleteClick(allergyId, allergen);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "mild":
        return "success";
      case "moderate":
        return "warning";
      case "severe":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Allergies
          </Typography>
          {patient && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Patient: {patient.firstName} {patient.lastName} ({patient.patientCode})
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            navigate(
              patientIdFromQuery
                ? `/allergies/new?patient_id=${patientIdFromQuery}`
                : "/allergies/new"
            )
          }
        >
          Add Allergy
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {!patientIdFromQuery && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Please provide a patient_id in the URL query parameters.
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Allergen</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Reaction</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Severity</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Documented By</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Documented Date</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allergies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No allergies found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    allergies
                      .filter((allergy) => allergy.isActive !== false)
                      .map((allergy) => (
                        <TableRow 
                          key={allergy._id || allergy.id} 
                          hover
                          sx={{ "&:hover": { backgroundColor: "action.hover" } }}
                        >
                          <TableCell sx={{ fontWeight: 500 }}>
                            {allergy.allergen}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ maxWidth: 300 }}>
                              {allergy.reaction}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={allergy.severity?.charAt(0).toUpperCase() + allergy.severity?.slice(1) || "Unknown"}
                              color={getSeverityColor(allergy.severity)}
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell>
                            {allergy.documentedBy
                              ? `${allergy.documentedBy.firstName || ""} ${allergy.documentedBy.lastName || ""}`.trim() || "-"
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {allergy.documentedDate
                              ? dayjs(allergy.documentedDate).format("MM/DD/YYYY")
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={allergy.isActive ? "Active" : "Inactive"}
                              color={allergy.isActive ? "success" : "default"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) =>
                                handleActionMenuOpen(
                                  e,
                                  allergy._id || allergy.id,
                                  allergy.allergen
                                )
                              }
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
          </>
        )}
      </Paper>

      <Menu
        anchorEl={actionMenu.anchorEl}
        open={Boolean(actionMenu.anchorEl)}
        onClose={handleActionMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => handleEdit(actionMenu.allergyId)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handleDelete(actionMenu.allergyId, actionMenu.allergen)}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <ConfirmationDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
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

