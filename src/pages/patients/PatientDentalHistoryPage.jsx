import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Alert,
} from "@mui/material";
import {
  Print as PrintIcon,
  CheckCircle as CheckCircleIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import { patientService } from "../../services/patient.service";
import PatientSectionTabs from "../../components/patients/PatientSectionTabs";
import PatientSignatureSection from "../../components/patients/PatientSignatureSection";
import { useSnackbar } from "../../contexts/SnackbarContext";

const EMPTY_HISTORY = {
  generalInfo: {
    mouthCondition: "",
    previousDentist: "",
    recentExamDate: "",
    recentTreatmentDate: "",
    immediateConcern: "",
    patientSince: "",
    recentXrayDate: "",
    dentistVisitFrequency: "6mo",
  },
  personalHistory: [],
  reviewStatus: false,
  lastUpdateDate: null,
  review: {
    reviewedWithPatient: false,
    reviewedAt: null,
    signatureDataUrl: null,
  },
  visitDates: [],
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

const dateInputValue = (value) => {
  if (!value) return "";
  try {
    return new Date(value).toISOString().split("T")[0];
  } catch {
    return "";
  }
};

const getRiskColor = (value) => {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "high") return "#d32f2f";
  if (normalized === "moderate") return "#f9a825";
  return "#43a047";
};

const groupDentalHistoryRows = (rows = []) => {
  const grouped = new Map();
  rows.forEach((item) => {
    const key = item?.group || "General";
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key).push(item);
  });
  return Array.from(grouped.entries());
};

const PatientDentalHistoryPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { showSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [patient, setPatient] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState("");
  const [dentalHistory, setDentalHistory] = useState(EMPTY_HISTORY);
  const [visitDates, setVisitDates] = useState([]);
  const [signature, setSignature] = useState(null);

  const fetchDentalHistory = async (cancelled = false) => {
    try {
      setLoading(true);
      setError("");
      const data = await patientService.getDentalHistory(patientId);
      if (cancelled) return;
      setPatient(data?.patient || null);
      setDentalHistory({
        generalInfo: {
          ...EMPTY_HISTORY.generalInfo,
          ...(data?.generalInfo || {}),
        },
        personalHistory: Array.isArray(data?.personalHistory) ? data.personalHistory : [],
        reviewStatus: Boolean(data?.reviewStatus),
        lastUpdateDate: data?.lastUpdateDate || null,
        review: {
          ...EMPTY_HISTORY.review,
          ...(data?.review || {}),
        },
        visitDates: Array.isArray(data?.visitDates) ? data.visitDates : [],
      });
      setVisitDates(Array.isArray(data?.visitDates) ? data.visitDates : []);
      setSignature(data?.review?.signatureDataUrl || null);
    } catch (err) {
      if (cancelled) return;
      setError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          "Failed to load dental history"
      );
      setPatient(null);
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetchDentalHistory(cancelled);
    return () => {
      cancelled = true;
    };
  }, [patientId]);

  const updateGeneralInfo = (field, value) => {
    setDentalHistory((prev) => ({
      ...prev,
      generalInfo: { ...prev.generalInfo, [field]: value },
    }));
  };

  const updatePersonalHistory = (id, field, value) => {
    setDentalHistory((prev) => ({
      ...prev,
      personalHistory: prev.personalHistory.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const dentalGroups = groupDentalHistoryRows(dentalHistory.personalHistory);

  const saveDentalHistory = async (reviewedWithPatient = false) => {
    if (!patientId) return;
    try {
      setSaving(true);
      const review = reviewedWithPatient
        ? {
            ...(dentalHistory.review || {}),
            reviewedWithPatient: true,
            reviewedAt: new Date().toISOString(),
            signatureDataUrl: signature || dentalHistory.review?.signatureDataUrl || null,
          }
        : {
            ...(dentalHistory.review || {}),
            signatureDataUrl: signature || dentalHistory.review?.signatureDataUrl || null,
          };

      const data = await patientService.updateDentalHistory(patientId, {
        generalInfo: dentalHistory.generalInfo,
        personalHistory: dentalHistory.personalHistory,
        review,
      });

      setPatient(data?.patient || null);
      setDentalHistory({
        generalInfo: {
          ...EMPTY_HISTORY.generalInfo,
          ...(data?.generalInfo || {}),
        },
        personalHistory: Array.isArray(data?.personalHistory) ? data.personalHistory : [],
        reviewStatus: Boolean(data?.reviewStatus),
        lastUpdateDate: data?.lastUpdateDate || null,
        review: {
          ...EMPTY_HISTORY.review,
          ...(data?.review || {}),
        },
        visitDates: Array.isArray(data?.visitDates) ? data.visitDates : [],
      });
      setVisitDates(Array.isArray(data?.visitDates) ? data.visitDates : []);
      setSignature(data?.review?.signatureDataUrl || signature || null);
      showSnackbar(reviewedWithPatient ? "Dental history reviewed" : "Dental history updated", "success");
    } catch (err) {
      showSnackbar(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          "Failed to update dental history",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const showContent = !loading || patient;

  return (
    <Box
      sx={{
        bgcolor: "#f5f5f5",
        minHeight: "100%",
        pb: 4,
        position: "relative",
      }}
    >
      <PatientSectionTabs activeTab="dental" patientId={patientId} />
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      {!showContent ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
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
                  Dental History
                </Typography>
                <Typography variant="body2" sx={{ color: "#757575", mt: 0.25 }}>
                  {patient?.firstName || ""} {patient?.lastName || ""} · DOB:{" "}
                  {patient?.dateOfBirth
                    ? new Date(patient.dateOfBirth).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="small"
                disabled={saving}
                onClick={() => saveDentalHistory(false)}
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
                disabled={saving}
                onClick={() => saveDentalHistory(true)}
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
                onClick={() => window.print()}
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

          <Paper
            variant="outlined"
            sx={{
              py: 1.5,
              px: 2,
              mb: 2,
              borderRadius: 1,
              border: "1px solid #e0e0e0",
              bgcolor: "#ffffff",
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
              {visitDates.map((entry, index) => {
                const label = entry?.label || formatDate(entry?.date);
                const isLast = index === visitDates.length - 1;
                return (
                  <Box
                    key={`${entry?.date || label}-${index}`}
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
                  No visit dates from dental history
                </Typography>
              )}
            </Box>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 3,
              mb: 2,
              borderRadius: 1,
              border: "1px solid #e0e0e0",
              bgcolor: "#ffffff",
            }}
          >
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
                  label="How would you rate the condition of your mouth?"
                  value={dentalHistory.generalInfo.mouthCondition}
                  onChange={(e) =>
                    updateGeneralInfo("mouthCondition", e.target.value)
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
                  label="Previous Dentist"
                  value={dentalHistory.generalInfo.previousDentist}
                  onChange={(e) =>
                    updateGeneralInfo("previousDentist", e.target.value)
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
                  label="Date of most recent dental exam"
                  value={dateInputValue(dentalHistory.generalInfo.recentExamDate)}
                  onChange={(e) =>
                    updateGeneralInfo(
                      "recentExamDate",
                      e.target.value || null,
                    )
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
                  type="date"
                  label="Recent treatment date"
                  value={dateInputValue(
                    dentalHistory.generalInfo.recentTreatmentDate,
                  )}
                  onChange={(e) =>
                    updateGeneralInfo(
                      "recentTreatmentDate",
                      e.target.value || null,
                    )
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
                  label="Immediate concern"
                  value={dentalHistory.generalInfo.immediateConcern}
                  onChange={(e) =>
                    updateGeneralInfo("immediateConcern", e.target.value)
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
                  label="Patient since"
                  value={dentalHistory.generalInfo.patientSince}
                  onChange={(e) =>
                    updateGeneralInfo("patientSince", e.target.value)
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
                    I routinely see my dentist every:
                  </Typography>
                  <RadioGroup
                    row
                    value={dentalHistory.generalInfo.dentistVisitFrequency}
                    onChange={(e) =>
                      updateGeneralInfo(
                        "dentistVisitFrequency",
                        e.target.value,
                      )
                    }
                    sx={{
                      "& .MuiTypography-root": { fontSize: 14 },
                    }}
                  >
                    <FormControlLabel
                      value="3mo"
                      control={<Radio size="small" />}
                      label="3 Mo."
                    />
                    <FormControlLabel
                      value="4mo"
                      control={<Radio size="small" />}
                      label="4 Mo."
                    />
                    <FormControlLabel
                      value="6mo"
                      control={<Radio size="small" />}
                      label="6 Mo."
                    />
                    <FormControlLabel
                      value="12mo"
                      control={<Radio size="small" />}
                      label="12 Mo."
                    />
                    <FormControlLabel
                      value="not"
                      control={<Radio size="small" />}
                      label="Not routinely"
                    />
                  </RadioGroup>
                </Box>
              </Grid>
            </Grid>

            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Typography variant="body2">
                Date of this dental history update:{" "}
                {formatDate(dentalHistory.lastUpdateDate) || "—"}
              </Typography>
              {dentalHistory.reviewStatus && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="caption">
                    Reviewed with patient
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              mb: 2,
              borderRadius: 1,
              border: "1px solid #e0e0e0",
              bgcolor: "#ffffff",
            }}
          >
            <Box sx={{ borderBottom: "1px solid #e0e0e0", mb: 2 }}>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} TabIndicatorProps={{ style: { height: 3 } }}>
                <Tab label="Summary" sx={{ textTransform: "none", fontWeight: 600, fontSize: 14, minHeight: 40 }} />
                <Tab label="Full Dental History" sx={{ textTransform: "none", fontWeight: 600, fontSize: 14, minHeight: 40 }} />
              </Tabs>
            </Box>
          </Paper>

          {tabValue === 0 && (
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
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
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
                    {dentalHistory.personalHistory.map((item) => (
                      <TableRow
                        key={item.id}
                        sx={{ borderBottom: "2px solid #e0e0e0" }}
                      >
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "#424242" }}
                          >
                            {item.number || item.id}. {item.question}
                          </Typography>

                          {item.scale && (
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                color: "#9e9e9e",
                                mt: 0.5,
                              }}
                            >
                              on a scale of 1 to 10: {item.scale}
                            </Typography>
                          )}

                          {item.note && (
                            <Typography
                              variant="caption"
                              display="block"
                              sx={{ color: "#9e9e9e", mt: 0.5 }}
                            >
                              Doctor&apos;s Note: {item.note}
                            </Typography>
                          )}
                        </TableCell>

                    <TableCell align="center">
                      <TextField
                        variant="standard"
                        size="small"
                        value={item.answer || ""}
                        onChange={(e) =>
                          updatePersonalHistory(item.id, "answer", e.target.value)
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
                        value={item.additionalInfo || ""}
                        onChange={(e) =>
                          updatePersonalHistory(
                            item.id,
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
                    {!dentalHistory.personalHistory.length ? (
                      <TableRow>
                        <TableCell colSpan={3}>
                          No dental history questions found.
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </Paper>
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 1,
                  border: "1px solid #e0e0e0",
                  bgcolor: "#ffffff",
                }}
              >
                {dentalGroups.map(([groupName, rows]) => (
                  <Box key={groupName} sx={{ mb: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "2px solid #eeeeee",
                        pb: 1,
                        mb: 2,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#424242" }}>
                        {groupName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#757575" }}>
                        {rows.length} question{rows.length === 1 ? "" : "s"}
                      </Typography>
                    </Box>

                    <Grid container spacing={2}>
                      {rows.map((item) => (
                        <Grid item xs={12} key={item.id}>
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 2,
                              borderRadius: 1,
                              borderColor: "#e0e0e0",
                              bgcolor: "#fafafa",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: 2,
                                mb: 1.5,
                                flexWrap: "wrap",
                              }}
                            >
                              <Typography variant="body1" sx={{ fontWeight: 600, color: "#424242", flex: 1 }}>
                                {item.number || ""}. {item.question}
                              </Typography>
                              <Box
                                sx={{
                                  px: 1.25,
                                  py: 0.4,
                                  borderRadius: 999,
                                  bgcolor: `${getRiskColor(item.scale || "low")}15`,
                                  color: getRiskColor(item.scale || "low"),
                                  fontSize: 12,
                                  fontWeight: 700,
                                  textTransform: "capitalize",
                                }}
                              >
                                {item.scale || "low"}
                              </Box>
                            </Box>

                            <Grid container spacing={2}>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Answer"
                                  value={item.answer || ""}
                                  onChange={(e) => updatePersonalHistory(item.id, "answer", e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Scale"
                                  value={item.scale || ""}
                                  onChange={(e) => updatePersonalHistory(item.id, "scale", e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Doctor's Note"
                                  value={item.note || ""}
                                  onChange={(e) => updatePersonalHistory(item.id, "note", e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  multiline
                                  minRows={3}
                                  size="small"
                                  label="Additional Information"
                                  value={item.additionalInfo || ""}
                                  onChange={(e) => updatePersonalHistory(item.id, "additionalInfo", e.target.value)}
                                />
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ))}

                {!dentalGroups.length ? (
                  <Typography color="text.secondary">No full dental history is available yet.</Typography>
                ) : null}
              </Paper>
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <PatientSignatureSection
              value={signature}
              onChange={setSignature}
              reviewedWithPatient={dentalHistory.reviewStatus}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default PatientDentalHistoryPage;