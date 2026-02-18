import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Alert,
  IconButton,
  Button,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Grid,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { noteTemplateService } from "../../services/note-template.service";

const ViewNoteTemplatePage = () => {
  const { noteTemplateId } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchTemplate();
  }, [noteTemplateId]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await noteTemplateService.getNoteTemplateById(
        noteTemplateId
      );
      setTemplate(data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Failed to fetch note template. Please try again.";
      setError(errorMessage);
      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleEdit = () => {
    navigate(`/note-templates/${noteTemplateId}/edit`);
  };

  const getFieldTypeLabel = (type) => {
    const types = {
      text: "Text",
      textarea: "Text Area",
      number: "Number",
      date: "Date",
      boolean: "Yes/No",
      select: "Dropdown",
      multiselect: "Multi-Select",
    };
    return types[type] || type;
  };

  const formatCreatedDate = (value) => {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "-";
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {loading ? (
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
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h4" fontWeight="bold">
                  {template.name}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                View template details and structure
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              Edit
            </Button>
          </Box>

          <Paper>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab label="Template Information" />
              <Tab label="Template Structure" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <Box>
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Template Name
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {template.name}
                      </Typography>
                    </Grid>

                    <Grid size={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Status
                      </Typography>
                      {template.isActive ? (
                        <Chip
                          icon={<CheckCircleIcon />}
                          label="Active"
                          color="success"
                          size="small"
                        />
                      ) : (
                        <Chip
                          icon={<CancelIcon />}
                          label="Inactive"
                          color="default"
                          size="small"
                        />
                      )}
                    </Grid>

                    {template.description && (
                      <Grid size={12}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Description
                        </Typography>
                        <Typography variant="body1">
                          {template.description}
                        </Typography>
                      </Grid>
                    )}

                    {template.specialty && (
                      <Grid size={6}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Specialty
                        </Typography>
                        <Chip label={template.specialty} size="small" />
                      </Grid>
                    )}

                    <Grid size={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Total Fields
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {template.templateStructure?.fields?.length || 0}
                      </Typography>
                    </Grid>

                    <Grid size={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Created
                      </Typography>
                      <Typography variant="body1">
                        {formatCreatedDate(template.createdAt)}
                      </Typography>
                    </Grid>

                    {template.createdBy && (
                      <Grid size={6}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Created By
                        </Typography>
                        <Typography variant="body1">
                          {typeof template.createdBy === "object"
                            ? `${template.createdBy.firstName || ""} ${template.createdBy.lastName || ""}`.trim() || template.createdBy._id
                            : template.createdBy}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}

              {activeTab === 1 && (
                <Box>
                  {template.templateStructure?.fields?.length > 0 ? (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Field Label</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Required</TableCell>
                            <TableCell>Options</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {template.templateStructure.fields.map(
                            (field, index) => (
                              <TableRow key={field.id || index}>
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                  >
                                    {field.label}
                                  </Typography>
                                  {field.placeholder && (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ display: "block" }}
                                    >
                                      Placeholder: {field.placeholder}
                                    </Typography>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={getFieldTypeLabel(field.type)}
                                    size="small"
                                    variant="outlined"
                                  />
                                </TableCell>
                                <TableCell>
                                  {field.required ? (
                                    <Chip
                                      label="Yes"
                                      size="small"
                                      color="primary"
                                      variant="outlined"
                                    />
                                  ) : (
                                    <Chip
                                      label="No"
                                      size="small"
                                      variant="outlined"
                                    />
                                  )}
                                </TableCell>
                                <TableCell>
                                  {field.type === "select" ||
                                  field.type === "multiselect" ? (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        gap: 0.5,
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      {field.options?.map(
                                        (option, optIndex) => (
                                          <Chip
                                            key={optIndex}
                                            label={option}
                                            size="small"
                                            variant="outlined"
                                          />
                                        )
                                      )}
                                    </Box>
                                  ) : (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      -
                                    </Typography>
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Box
                      sx={{
                        p: 4,
                        textAlign: "center",
                        bgcolor: "grey.50",
                        borderRadius: 1,
                      }}
                    >
                      <Typography color="text.secondary">
                        No fields defined for this template
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default ViewNoteTemplatePage;
