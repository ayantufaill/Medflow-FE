import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Radio,
  RadioGroup,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import {
  Assignment as ChecklistIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Description as DocumentIcon,
  PhotoCamera as CameraIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { patientService } from "../../services/patient.service";
import { documentService } from "../../services/document.service";
import PatientSectionTabs from "../../components/patients/PatientSectionTabs";
import SignaturePad from "../../components/shared/SignaturePad";

const formatVisitDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const formatDate = (value) => {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const PageContainer = (props) => (
  <Box
    {...props}
    sx={{
      bgcolor: "#f5f5f5",
      minHeight: "100%",
      pb: 4,
      position: "relative",
      ...(props.sx || {}),
    }}
  />
);

const Card = (props) => (
  <Paper
    elevation={0}
    {...props}
    sx={{
      p: 3,
      mb: 2,
      borderRadius: 1,
      border: "1px solid #e0e0e0",
      bgcolor: "#ffffff",
      ...(props.sx || {}),
    }}
  />
);

const FloatingActions = (props) => (
  <Box
    {...props}
    sx={{
      position: "fixed",
      right: 16,
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      zIndex: 10,
      ...(props.sx || {}),
    }}
  />
);

const FloatingActionButton = (props) => (
  <IconButton
    {...props}
    sx={{
      bgcolor: "#ffffff",
      borderRadius: "50%",
      border: "1px solid #e0e0e0",
      boxShadow: "0px 1px 3px rgba(0,0,0,0.15)",
      "&:hover": {
        bgcolor: "#fafafa",
      },
      ...(props.sx || {}),
    }}
  />
);

const PatientMedicalHistoryPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { showSnackbar } = useSnackbar();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [historyTab, setHistoryTab] = useState(0); // 0 = Summary, 1 = Full Medical History
  const [medications, setMedications] = useState([]);
  const [supplements, setSupplements] = useState([]);
  const [visitDates, setVisitDates] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [signature, setSignature] = useState(null);

  const addMedication = () => {
    const nextId = Math.max(0, ...medications.map((m) => m.id)) + 1;
    setMedications((prev) => [
      ...prev,
      { id: nextId, drug: "", dosage: "", purpose: "" },
    ]);
  };

  const updateMedication = (id, field, value) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  };

  const addSupplement = () => {
    const nextId = Math.max(0, ...supplements.map((s) => s.id)) + 1;
    setSupplements((prev) => [
      ...prev,
      { id: nextId, drug: "", dosage: "", purpose: "" },
    ]);
  };

  const updateSupplement = (id, field, value) => {
    setSupplements((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
  };

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const data =
          await patientService.getStructuredMedicalHistory(patientId);
        if (!cancelled) {
          setPatient(data?.patient || null);
          setMedicalHistory(data || null);
          setMedications(
            Array.isArray(data?.medications) ? data.medications : [],
          );
          setSupplements(
            Array.isArray(data?.supplements) ? data.supplements : [],
          );
          setSignature(data?.review?.signatureDataUrl || null);
          const labels = Array.isArray(data?.visitDates)
            ? data.visitDates
                .map((date) => formatVisitDate(date))
                .filter(Boolean)
            : [];
          setVisitDates(labels);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.error?.message ||
              err?.response?.data?.message ||
              "Failed to load medical history",
          );
          showSnackbar("Failed to load medical history", "error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [patientId, showSnackbar]);

  const patientName = (() => {
    if (patient?.firstName || patient?.lastName) {
      return `${patient.firstName || ""} ${patient.lastName || ""}`.trim();
    }
    return "Ayan Tufail";
  })();

  const generalInfo = medicalHistory?.generalInfo || {};

  // Medical history questions come from the canonical `sections` array
  // provided by /patients/:id/medical-history.
  const rawSections = Array.isArray(medicalHistory?.sections)
    ? medicalHistory.sections
    : [];

  // Normalize additionalInfo for UI: backend stores it as an array, but
  // the UI edits a single multiline string.
  const summarySections = rawSections.map((section) => ({
    ...section,
    additionalInfo: Array.isArray(section.additionalInfo)
      ? section.additionalInfo.join("\n\n")
      : section.additionalInfo || "",
  }));
  const risk = medicalHistory?.risk || {};
  const reviewedWithPatient = Boolean(
    medicalHistory?.review?.reviewedWithPatient,
  );

  const dobText = patient?.dateOfBirth
    ? `DOB: ${formatDate(patient.dateOfBirth)}`
    : "DOB: Mar 4, 2026";

  const [uploading, setUploading] = useState(false);

  const updateMedicalHistoryState = (updater) => {
    setMedicalHistory((prev) =>
      typeof updater === "function" ? updater(prev) : updater,
    );
  };

  const handleSummarySectionChange = (sectionId, field, value) => {
    updateMedicalHistoryState((prev) => {
      const currentSections = Array.isArray(prev?.sections)
        ? prev.sections
        : [];
      const updatedSections = currentSections.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section,
      );

      return {
        ...prev,
        summary: {
          ...(prev?.summary || {}),
          sections: updatedSections,
        },
        sections: updatedSections,
      };
    });
  };

  const handleGeneralInfoChange = (field, value) => {
    updateMedicalHistoryState((prev) => ({
      ...prev,
      generalInfo: {
        ...(prev?.generalInfo || {}),
        [field]: value,
      },
    }));
  };

  const handlePremedChange = (requiresPremed) => {
    updateMedicalHistoryState((prev) => ({
      ...prev,
      premed: {
        ...(prev?.premed || {}),
        requiresPremed,
      },
    }));
  };

  const saveMedicalHistory = async (reviewedWithPatient = false) => {
    if (!patientId || !medicalHistory) return;
    try {
      const baseReview = medicalHistory.review || {};
      const review = reviewedWithPatient
        ? {
            ...baseReview,
            reviewedWithPatient: true,
            reviewedAt: new Date().toISOString(),
            signatureDataUrl: signature || baseReview.signatureDataUrl || null,
          }
        : {
            ...baseReview,
            signatureDataUrl: signature || baseReview.signatureDataUrl || null,
          };

      const sectionsForSave = Array.isArray(medicalHistory.sections)
        ? medicalHistory.sections
        : summarySections;

      const data = await patientService.updateStructuredMedicalHistory(
        patientId,
        {
          generalInfo: medicalHistory.generalInfo,
          premed: medicalHistory.premed,
          risk: medicalHistory.risk,
          // Backend expects additionalInfo to be an array; UI edits a single
          // multiline string, so convert it before sending.
          sections: sectionsForSave.map((section) => ({
            ...section,
            additionalInfo: Array.isArray(section.additionalInfo)
              ? section.additionalInfo
              : section.additionalInfo
                ? [section.additionalInfo]
                : [],
          })),
          medications,
          supplements,
          review,
        },
      );

      setMedicalHistory(data || null);
      setMedications(Array.isArray(data?.medications) ? data.medications : []);
      setSupplements(Array.isArray(data?.supplements) ? data.supplements : []);
      setSignature(data?.review?.signatureDataUrl || signature || null);
      showSnackbar(
        reviewedWithPatient
          ? "Medical history reviewed"
          : "Medical history updated",
        "success",
      );
    } catch (err) {
      showSnackbar(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          "Failed to update medical history",
        "error",
      );
    }
  };

  const handleAddDocument = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,.pdf";
    input.multiple = true;
    input.onchange = async () => {
      const files = input.files;
      if (!files?.length || !patientId) return;
      try {
        setUploading(true);
        for (let i = 0; i < files.length; i++) {
          const formData = new FormData();
          formData.append("file", files[i]);
          formData.append("patientId", patientId);
          formData.append("documentType", "other");
          formData.append(
            "documentName",
            files[i].name || `Medical history document ${i + 1}`,
          );
          await documentService.uploadDocument(formData);
        }
        showSnackbar(
          `Uploaded ${files.length} document(s). View them under SIGNED DOCS tab.`,
          "success",
        );
      } catch (err) {
        showSnackbar(
          err?.response?.data?.error?.message ||
            err?.response?.data?.message ||
            "Failed to upload document",
          "error",
        );
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  if (loading && !patient) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Card>
          <Typography color="error">{error}</Typography>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PatientSectionTabs activeTab="medical" patientId={patientId} />

      <FloatingActions>
        <FloatingActionButton onClick={handleAddDocument} disabled={uploading}>
          <CameraIcon fontSize="small" />
        </FloatingActionButton>
        <FloatingActionButton>
          <DocumentIcon fontSize="small" />
        </FloatingActionButton>
        <FloatingActionButton>
          <ChecklistIcon fontSize="small" />
        </FloatingActionButton>
      </FloatingActions>

      {/* Header */}
      <Box
        sx={{
          mt: 1.5,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#424242", fontSize: "1.1rem" }}
            >
              Medical History
            </Typography>
            <Typography variant="body2" sx={{ color: "#757575", mt: 0.25 }}>
              {patientName} · {dobText}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => saveMedicalHistory(false)}
            sx={{
              textTransform: "none",
              borderRadius: 1,
              bgcolor: "#1976d2",
              "&:hover": { bgcolor: "#1565c0" },
            }}
          >
            Update Hx
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<CheckIcon />}
            onClick={() => saveMedicalHistory(true)}
            sx={{
              textTransform: "none",
              borderRadius: 1,
              bgcolor: "#43a047",
              "&:hover": { bgcolor: "#388e3c" },
            }}
          >
            Reviewed With Patient
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PrintIcon />}
            sx={{
              textTransform: "none",
              borderRadius: 1,
              borderColor: "#9e9e9e",
              color: "#616161",
              "&:hover": { borderColor: "#616161" },
            }}
          >
            Print
          </Button>
        </Box>
      </Box>

      {/* Timeline – visit dates from backend */}
      <Card
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          {visitDates.map((label, index) => {
            const isLast = index === visitDates.length - 1;
            return (
              <Box
                key={`${label}-${index}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                }}
              >
                <Box
                  sx={{
                    width: isLast ? 14 : 10,
                    height: isLast ? 14 : 10,
                    borderRadius: "50%",
                    bgcolor: isLast ? "#1976d2" : "#bdbdbd",
                  }}
                />
                <Typography variant="body2" sx={{ color: "#757575" }}>
                  {label}
                </Typography>
                {isLast && (
                  <CloseIcon
                    sx={{ fontSize: 14, color: "#e53935", cursor: "pointer" }}
                    onClick={() => setVisitDates((prev) => prev.slice(0, -1))}
                  />
                )}
              </Box>
            );
          })}
          {visitDates.length === 0 && (
            <Typography variant="body2" sx={{ color: "#9e9e9e" }}>
              No visit dates from medical history
            </Typography>
          )}
        </Box>
      </Card>

      {/* General Information */}
      <Card>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: "#424242",
            fontSize: "1.05rem",
          }}
        >
          General Information
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="What is your estimate of your general health?"
              value={generalInfo.healthEstimate || ""}
              onChange={(e) =>
                handleGeneralInfoChange("healthEstimate", e.target.value)
              }
              sx={{
                "& .MuiInputLabel-root": { fontSize: 13 },
                "& .MuiInputBase-input": { fontSize: 13 },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Physician Name"
              value={generalInfo.physicianName || ""}
              onChange={(e) =>
                handleGeneralInfoChange("physicianName", e.target.value)
              }
              sx={{
                "& .MuiInputLabel-root": { fontSize: 13 },
                "& .MuiInputBase-input": { fontSize: 13 },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Date of most recent physical examination"
              value={
                generalInfo.lastExamDate
                  ? new Date(generalInfo.lastExamDate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleGeneralInfoChange("lastExamDate", e.target.value || null)
              }
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiInputLabel-root": { fontSize: 13 },
                "& .MuiInputBase-input": { fontSize: 13 },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Purpose"
              value={generalInfo.purpose || ""}
              onChange={(e) =>
                handleGeneralInfoChange("purpose", e.target.value)
              }
              sx={{
                "& .MuiInputLabel-root": { fontSize: 13 },
                "& .MuiInputBase-input": { fontSize: 13 },
              }}
            />
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Weight"
              value={generalInfo.weight || ""}
              onChange={(e) =>
                handleGeneralInfoChange("weight", e.target.value)
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="caption" sx={{ color: "#9e9e9e" }}>
                      {generalInfo.weightUnit || "LBS"}
                    </Typography>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputLabel-root": { fontSize: 13 },
                "& .MuiInputBase-input": { fontSize: 13 },
              }}
            />
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Height"
              value={generalInfo.height || ""}
              onChange={(e) =>
                handleGeneralInfoChange("height", e.target.value)
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="caption" sx={{ color: "#9e9e9e" }}>
                      {generalInfo.heightUnit || "FT/IN"}
                    </Typography>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputLabel-root": { fontSize: 13 },
                "& .MuiInputBase-input": { fontSize: 13 },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Physician specialty"
              value={generalInfo.physicianSpecialty || ""}
              onChange={(e) =>
                handleGeneralInfoChange("physicianSpecialty", e.target.value)
              }
              sx={{
                "& .MuiInputLabel-root": { fontSize: 13 },
                "& .MuiInputBase-input": { fontSize: 13 },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mt: 0.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#616161" }}
              >
                Premed
              </Typography>
              <RadioGroup
                row
                value={medicalHistory?.premed?.requiresPremed ? "yes" : "no"}
                onChange={(_, value) => handlePremedChange(value === "yes")}
                sx={{
                  "& .MuiFormControlLabel-root": { mr: 2 },
                  "& .MuiTypography-root": { fontSize: 14 },
                }}
              >
                <FormControlLabel
                  value="premed"
                  control={<Radio size="small" />}
                  label="Premed"
                />
                <FormControlLabel
                  value="yes"
                  control={<Radio size="small" />}
                  label="Requires premed"
                />
                <FormControlLabel
                  value="no"
                  control={<Radio size="small" />}
                  label="No"
                />
              </RadioGroup>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Summary / Full Medical History */}
      <Card>
        <Box sx={{ borderBottom: "1px solid #e0e0e0", mb: 2 }}>
          <Tabs
            value={historyTab}
            onChange={(_, v) => setHistoryTab(v)}
            TabIndicatorProps={{ style: { height: 3 } }}
          >
            <Tab
              label="Summary"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: 14,
                minHeight: 40,
              }}
            />
            <Tab
              label="Full Medical History"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: 14,
                minHeight: 40,
              }}
            />
          </Tabs>
        </Box>

        {historyTab === 0 && (
          <Box>
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 1,
                border: "1px solid #e0e0e0",
                bgcolor: "#ffffff",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ background: "#fafafa" }}>
                    <TableCell sx={{ width: "55%" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: "#616161" }}
                        >
                          Personal History
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Typography variant="caption">🟢 Low</Typography>
                          <Typography variant="caption">🟡 Moderate</Typography>
                          <Typography variant="caption">🔴 High</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ width: "10%" }} align="center" />
                    <TableCell sx={{ width: "35%" }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: "#616161" }}
                      >
                        Additional information
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {summarySections.map((section, index) => (
                    <TableRow
                      key={section.number || index}
                      sx={{
                        borderBottom: "2px solid #e0e0e0",
                      }}
                    >
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#424242" }}
                        >
                          {section.number ? `${section.number}. ` : ""}
                          {section.question || "No question available"}
                        </Typography>
                        {section.scale && (
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              color: "#9e9e9e",
                              mt: 0.5,
                            }}
                          >
                            on a scale of 1 to 10: {section.scale}
                          </Typography>
                        )}
                        {section.doctorNote && (
                          <Typography
                            variant="caption"
                            display="block"
                            sx={{ color: "#9e9e9e", mt: 0.5 }}
                          >
                            Doctor&apos;s Note: {section.doctorNote}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          variant="standard"
                          size="small"
                          value={section.answer || ""}
                          onChange={(e) =>
                            handleSummarySectionChange(
                              section.id || section.number || index,
                              "answer",
                              e.target.value,
                            )
                          }
                          InputProps={{ disableUnderline: true }}
                          sx={{
                            minWidth: 120,
                            "& .MuiInputBase-input": {
                              textAlign: "center",
                              fontSize: 14,
                              py: 0,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          background: "#f5f5f5",
                          maxHeight: 120,
                          overflow: "auto",
                        }}
                      >
                        <TextField
                          variant="standard"
                          fullWidth
                          multiline
                          minRows={3}
                          size="small"
                          value={
                            section.additionalInfo || section.comment || ""
                          }
                          onChange={(e) =>
                            handleSummarySectionChange(
                              section.id || section.number || index,
                              "additionalInfo",
                              e.target.value,
                            )
                          }
                          InputProps={{ disableUnderline: true }}
                          sx={{
                            "& .MuiInputBase-input": {
                              fontSize: 14,
                              py: 0.5,
                            },
                            bgcolor: "transparent",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {!summarySections.length && (
                    <TableRow>
                      <TableCell colSpan={3}>
                        No medical history questions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        )}

        {historyTab === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
            {summarySections.length ? (
              summarySections.map((section) => (
                <Paper
                  key={`${section.number}-${section.question}`}
                  variant="outlined"
                  sx={{ p: 2, borderColor: "grey.300" }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {section.number ? `${section.number}. ` : ""}
                    {section.question}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    Answer: {section.answer || "—"}
                  </Typography>
                  {section.comment ? (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {section.comment}
                    </Typography>
                  ) : null}
                  {section.doctorNote ? (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 1 }}
                    >
                      Doctor&apos;s Note: {section.doctorNote}
                    </Typography>
                  ) : null}
                </Paper>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: "#9e9e9e" }}>
                Full medical history is not available for this patient yet.
              </Typography>
            )}
          </Box>
        )}
      </Card>

      {/* Medication List */}
      <Card>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: "#424242",
            fontSize: "1.05rem",
          }}
        >
          Medication List
        </Typography>

        <Grid
          container
          spacing={0}
          sx={{
            borderBottom: "1px solid #eeeeee",
            pb: 1,
            mb: 1,
          }}
        >
          <Grid item xs={5}>
            <Typography
              variant="caption"
              sx={{ color: "#9e9e9e", fontWeight: 600 }}
            >
              Drug
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography
              variant="caption"
              sx={{ color: "#9e9e9e", fontWeight: 600 }}
            >
              Dosage
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="caption"
              sx={{ color: "#9e9e9e", fontWeight: 600 }}
            >
              Purpose
            </Typography>
          </Grid>
        </Grid>

        {medications.map((row) => (
          <Grid
            key={row.id}
            container
            spacing={0}
            sx={{
              py: 1,
              borderBottom: "1px solid #f0f0f0",
              fontSize: 14,
            }}
          >
            <Grid item xs={5}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                placeholder="Drug"
                value={row.drug}
                onChange={(e) =>
                  updateMedication(row.id, "drug", e.target.value)
                }
                InputProps={{ disableUnderline: true }}
                sx={{ "& input": { py: 0.5, fontSize: 14 } }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                placeholder="Dosage"
                value={row.dosage}
                onChange={(e) =>
                  updateMedication(row.id, "dosage", e.target.value)
                }
                InputProps={{ disableUnderline: true }}
                sx={{ "& input": { py: 0.5, fontSize: 14 } }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                placeholder="Purpose"
                value={row.purpose}
                onChange={(e) =>
                  updateMedication(row.id, "purpose", e.target.value)
                }
                InputProps={{ disableUnderline: true }}
                sx={{ "& input": { py: 0.5, fontSize: 14 } }}
              />
            </Grid>
          </Grid>
        ))}

        <Link
          component="button"
          variant="body2"
          onClick={addMedication}
          sx={{
            mt: 1,
            color: "#1976d2",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          + add more
        </Link>
      </Card>

      {/* Supplements & Vitamins */}
      <Card>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: "#424242",
            fontSize: "1.05rem",
          }}
        >
          Supplements &amp; Vitamins
        </Typography>

        <Grid
          container
          spacing={0}
          sx={{
            borderBottom: "1px solid #eeeeee",
            pb: 1,
            mb: 1,
          }}
        >
          <Grid item xs={5}>
            <Typography
              variant="caption"
              sx={{ color: "#9e9e9e", fontWeight: 600 }}
            >
              Drug
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography
              variant="caption"
              sx={{ color: "#9e9e9e", fontWeight: 600 }}
            >
              Dosage
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="caption"
              sx={{ color: "#9e9e9e", fontWeight: 600 }}
            >
              Purpose
            </Typography>
          </Grid>
        </Grid>

        {supplements.map((row) => (
          <Grid
            key={row.id}
            container
            spacing={0}
            sx={{
              py: 1,
              borderBottom: "1px solid #f0f0f0",
              fontSize: 14,
            }}
          >
            <Grid item xs={5}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                placeholder="Drug"
                value={row.drug}
                onChange={(e) =>
                  updateSupplement(row.id, "drug", e.target.value)
                }
                InputProps={{ disableUnderline: true }}
                sx={{ "& input": { py: 0.5, fontSize: 14 } }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                placeholder="Dosage"
                value={row.dosage}
                onChange={(e) =>
                  updateSupplement(row.id, "dosage", e.target.value)
                }
                InputProps={{ disableUnderline: true }}
                sx={{ "& input": { py: 0.5, fontSize: 14 } }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                placeholder="Purpose"
                value={row.purpose}
                onChange={(e) =>
                  updateSupplement(row.id, "purpose", e.target.value)
                }
                InputProps={{ disableUnderline: true }}
                sx={{ "& input": { py: 0.5, fontSize: 14 } }}
              />
            </Grid>
          </Grid>
        ))}

        <Link
          component="button"
          variant="body2"
          onClick={addSupplement}
          sx={{
            mt: 1,
            color: "#1976d2",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          + add more
        </Link>
      </Card>

      {/* Signature – aligned to the right like dental page */}
      <Card sx={{ mb: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Box>
            <Typography
              variant="caption"
              sx={{ color: "#757575", mb: 0.5, display: "block" }}
            >
              Patient/Guardian Signature:
            </Typography>
            <SignaturePad
              width={240}
              height={72}
              value={signature}
              onChange={setSignature}
              showClearButton
              sx={{ mt: 0.5 }}
            />
            {reviewedWithPatient && (
              <Typography
                variant="caption"
                sx={{ color: "#43a047", mt: 1, display: "block" }}
              >
                ✓ Reviewed with patient
              </Typography>
            )}
          </Box>
        </Box>
      </Card>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          textAlign: "center",
          mt: 2,
          color: "#bdbdbd",
        }}
      >
        {risk?.asaClass ? `${risk.asaClass} · ` : ""}
        {risk?.level
          ? `Risk: ${risk.level}`
          : "Medical history loaded from patient record"}
      </Typography>
    </PageContainer>
  );
};

export default PatientMedicalHistoryPage;
