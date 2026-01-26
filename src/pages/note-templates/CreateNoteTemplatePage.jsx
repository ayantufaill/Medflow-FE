import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Alert,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { noteTemplateService } from "../../services/note-template.service";
import NoteTemplateForm from "../../components/note-templates/NoteTemplateForm";

const CreateNoteTemplatePage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [templateFields, setTemplateFields] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [specialties, setSpecialties] = useState([]);

    useEffect(() => {
      const fetchSpecialties = async () => {
        try {
          setInitialLoading(true);
          const data = await noteTemplateService.getSpecialties();
          setSpecialties(data || []);
        } catch (error) {
          console.error('Failed to fetch specialties:', error);
          setSpecialties([]);
        } finally {
          setInitialLoading(false);
        }
      };
  
      fetchSpecialties();
    }, []);

  const handleBack = () => {
    window.history.back();
  };

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError("");

      await noteTemplateService.createNoteTemplate(data);

      showSnackbar("Note template created successfully", "success");
      navigate("/note-templates");
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Failed to create note template. Please try again.";
      setError(errorMessage);
      showSnackbar(errorMessage, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {initialLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Create SOAP Note Template
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create a reusable template for clinical documentation
              </Typography>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <NoteTemplateForm
              onSubmit={handleSubmit}
              loading={saving}
              isEditMode={false}
              hideButtons={true}
              formId="create-note-template-form"
              onFieldsChange={setTemplateFields}
              specialties={specialties}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 4,
              }}
            >
              <Button variant="outlined" onClick={handleBack} disabled={saving}>
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                form="create-note-template-form"
                disabled={saving || templateFields.length === 0}
                startIcon={
                  saving ? <CircularProgress size={20} color="inherit" /> : null
                }
              >
                {saving ? "Creating..." : "Create Template"}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default CreateNoteTemplatePage;
