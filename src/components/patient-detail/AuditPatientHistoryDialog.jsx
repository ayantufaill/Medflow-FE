import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import apiClient from "../../config/api";
import { COLORS } from "../../constants/colors";
import {
  fontSize,
  fontWeight,
  radius,
  roundedSelectMenuProps,
} from "../../constants/styles";

const diffSubHeaderSx = {
  fontFamily: "Inter",
  fontSize: fontSize.xs,
  fontWeight: fontWeight.semibold,
  color: COLORS.TEXT_MUTED,
  letterSpacing: "0.3px",
  textTransform: "uppercase",
  py: 0.5,
  borderBottom: `1px solid ${COLORS.BORDER}`,
};

const diffCellSx = {
  fontFamily: "Inter",
  fontSize: fontSize.sm,
  color: COLORS.TEXT_BODY,
  py: 0.75,
  px: 1,
  wordBreak: "break-word",
  whiteSpace: "pre-line",
};

/**
 * Utility function to format key names (e.g. mouthCondition -> Mouth Condition)
 */
const formatFieldKey = (key) => {
  if (!key || typeof key !== "string") return String(key || "");

  const knownMap = {
    mouthCondition: "Mouth Condition",
    previousDentist: "Previous Dentist",
    recentExamDate: "Recent Exam Date",
    recentTreatmentDate: "Recent Treatment Date",
    immediateConcern: "Immediate Concern",
    patientsSince: "Patients Since",
    recentXrayDate: "Recent X-Ray Date",
    dentistVisitFrequency: "Dentist Visit Frequency",
    generalInfo: "General Info",
    personalHistory: "Personal History",
    medicalHistory: "Medical History",
    dentalHistory: "Dental History",
    dental_history: "Dental History",
    dental_history_updated: "Dental History Updated",
    patient_updated: "Patient Updated",
    patient_created: "Patient Created",
    patient_profile: "Patient Profile",
    "fearful-treatment": "Fearful of Dental Treatment",
  };

  if (knownMap[key]) return knownMap[key];

  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
};

/**
 * Try parsing stringified JSON safely
 */
const tryParseJson = (val) => {
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        return JSON.parse(trimmed);
      } catch (_) {
        return val;
      }
    }
  }
  return val;
};

/**
 * Format any value to human readable plain text
 */
const formatValueToText = (val) => {
  if (
    val === null ||
    val === undefined ||
    val === "" ||
    val === "null" ||
    val === "undefined"
  ) {
    return "-";
  }
  if (typeof val === "boolean") {
    return val ? "Yes" : "No";
  }
  if (typeof val === "number") {
    return String(val);
  }
  if (typeof val === "string") {
    const parsed = tryParseJson(val);
    if (parsed !== val && typeof parsed === "object") {
      return formatValueToText(parsed);
    }
    // Format ISO dates if applicable
    if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/.test(val)) {
      try {
        const d = new Date(val);
        if (!isNaN(d.getTime())) {
          if (val.includes("T")) {
            return d.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            });
          }
          return val;
        }
      } catch (_) {}
    }
    return val;
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return "-";
    const items = val
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          if (item.question && item.answer !== undefined) {
            return `${item.question}: ${formatValueToText(item.answer)}`;
          }
          if (item.question) {
            return `${item.question}`;
          }
          if (item.label) return item.label;
          if (item.name) return item.name;
          return Object.entries(item)
            .filter(([k]) => k !== "id")
            .map(([k, v]) => `${formatFieldKey(k)}: ${formatValueToText(v)}`)
            .join(", ");
        }
        return formatValueToText(item);
      })
      .filter(Boolean);

    return items.length > 0 ? items.join("\n") : "-";
  }
  if (typeof val === "object") {
    const entries = Object.entries(val).filter(
      ([, v]) => v !== null && v !== undefined && v !== ""
    );
    if (entries.length === 0) return "-";
    return entries
      .map(([k, v]) => `${formatFieldKey(k)}: ${formatValueToText(v)}`)
      .join("\n");
  }
  return String(val);
};

/**
 * Extract clean key-old-new difference rows from object/value diffs
 */
const extractDifferences = (oldVal, newVal, parentKey = "") => {
  const diffs = [];

  const oldParsed = tryParseJson(oldVal);
  const newParsed = tryParseJson(newVal);

  const isOldObj =
    oldParsed && typeof oldParsed === "object" && oldParsed !== null;
  const isNewObj =
    newParsed && typeof newParsed === "object" && newParsed !== null;

  if (isOldObj || isNewObj) {
    const o = isOldObj ? oldParsed : {};
    const n = isNewObj ? newParsed : {};

    const allKeys = Array.from(new Set([...Object.keys(o), ...Object.keys(n)]));

    allKeys.forEach((k) => {
      const oVal = o[k];
      const nVal = n[k];
      const fieldName = formatFieldKey(k);
      const subKey =
        parentKey &&
        !["General Info", "General Information", "Personal History"].includes(
          parentKey
        )
          ? `${parentKey} - ${fieldName}`
          : fieldName;

      if (JSON.stringify(oVal) !== JSON.stringify(nVal)) {
        if (
          (oVal && typeof oVal === "object" && !Array.isArray(oVal)) ||
          (nVal && typeof nVal === "object" && !Array.isArray(nVal))
        ) {
          diffs.push(...extractDifferences(oVal, nVal, fieldName));
        } else {
          diffs.push({
            key: subKey,
            old: formatValueToText(oVal),
            new: formatValueToText(nVal),
          });
        }
      }
    });
  } else {
    diffs.push({
      key: parentKey ? parentKey : "Value",
      old: formatValueToText(oldVal),
      new: formatValueToText(newVal),
    });
  }

  return diffs;
};

/**
 * Format ISO date string into readable date time
 */
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (_) {
    return dateStr;
  }
};

const normalizeAuditData = (payload) => {
  const list = Array.isArray(payload)
    ? payload
    : payload?.auditEvents || payload?.data?.auditEvents || [];

  return (list || []).map((entry, index) => {
    let differences = [];

    if (Array.isArray(entry?.differences)) {
      entry.differences.forEach((diff) => {
        const subDiffs = extractDifferences(
          diff?.old ?? diff?.previous,
          diff?.new ?? diff?.current,
          formatFieldKey(diff?.key || diff?.field || diff?.path || "")
        );
        differences.push(...subDiffs);
      });
    } else if (entry?.oldValue !== undefined || entry?.newValue !== undefined) {
      differences = extractDifferences(entry.oldValue, entry.newValue, "");
    }

    if (differences.length === 0) {
      differences.push({
        key: "Record Status",
        old: "-",
        new: "Updated",
      });
    }

    const rawActor = entry?.actor;
    const actorName =
      typeof rawActor === "object" && rawActor !== null
        ? `${rawActor.firstName || ""} ${rawActor.lastName || ""}`.trim() ||
          rawActor.email ||
          "System"
        : entry?.actorName || entry?.userName || entry?.user || "System";

    return {
      id: entry?._id || entry?.id || entry?.eventId || `audit-${index}`,
      date: formatDate(
        entry?.changedAt || entry?.createdAt || entry?.timestamp || entry?.date
      ),
      user: actorName || "System",
      name: formatFieldKey(
        entry?.name || entry?.section || entry?.patientName || "Patient"
      ),
      action: formatFieldKey(entry?.action || entry?.type || "Update"),
      rawAction: entry?.action || entry?.type || "Update",
      differences,
    };
  });
};

const AuditPatientHistoryDialog = ({
  open,
  onClose,
  auditData: propAuditData,
  patientId,
}) => {
  const [auditData, setAuditData] = useState([]);
  const [selectedAction, setSelectedAction] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) {
      setAuditData([]);
      setSelectedAction("ALL");
      setLoading(false);
      setError(null);
      return;
    }

    if (!patientId && propAuditData) {
      setAuditData(normalizeAuditData(propAuditData));
      setError(null);
      setLoading(false);
      return;
    }

    if (!patientId) {
      setAuditData([]);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const loadAuditHistory = async () => {
      setLoading(true);
      setError(null);
      setAuditData([]);

      try {
        const response = await apiClient.get(
          `/patients/${patientId}/audit-history`,
          { signal: controller.signal }
        );
        const payload = response?.data?.data || response?.data || {};
        setAuditData(normalizeAuditData(payload));
      } catch (err) {
        if (err?.name === "CanceledError") return;
        setError(
          err?.response?.data?.message ||
            "Failed to load patient audit history."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAuditHistory();

    return () => controller.abort();
  }, [open, patientId, propAuditData]);

  // Extract unique actions for filtering
  const availableActions = useMemo(() => {
    const actions = new Set(
      auditData.map((item) => item.rawAction || item.action)
    );
    return Array.from(actions);
  }, [auditData]);

  const filteredAuditData = useMemo(() => {
    if (selectedAction === "ALL") return auditData;
    return auditData.filter(
      (item) => (item.rawAction || item.action) === selectedAction
    );
  }, [auditData, selectedAction]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{ zIndex: 26000 }}
      PaperProps={{
        sx: { borderRadius: radius.lg, p: 0, maxHeight: "calc(80vh - 96px)" },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.25,
          backgroundColor: COLORS.SURFACE_TINT,
          borderBottom: `1px solid ${COLORS.BORDER}`,
          borderTopLeftRadius: radius.lg,
          borderTopRightRadius: radius.lg,
        }}
      >
        <Typography
          sx={{
            fontSize: fontSize.lg,
            fontWeight: fontWeight.semibold,
            color: COLORS.TEXT_PRIMARY,
          }}
        >
          Audit Patient History
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: COLORS.TEXT_MUTED, p: "4px" }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      <Box
        sx={{
          p: 2.5,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Filter row */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Typography
            sx={{
              fontSize: fontSize.md,
              fontWeight: fontWeight.semibold,
              color: COLORS.TEXT_SECONDARY,
            }}
          >
            Filter list by:
          </Typography>
          <Typography
            sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY }}
          >
            Action:
          </Typography>
          <Select
            size="small"
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            MenuProps={
              roundedSelectMenuProps.PaperProps
                ? roundedSelectMenuProps
                : undefined
            }
            sx={{
              minWidth: 160,
              fontFamily: "Inter",
              fontSize: fontSize.md,
              "& .MuiSelect-select": { py: "6px" },
              borderRadius: radius.md,
            }}
          >
            <MenuItem
              value="ALL"
              sx={{ fontFamily: "Inter", fontSize: fontSize.md }}
            >
              All Actions
            </MenuItem>
            {availableActions.map((actionKey) => (
              <MenuItem
                key={actionKey}
                value={actionKey}
                sx={{ fontFamily: "Inter", fontSize: fontSize.md }}
              >
                {formatFieldKey(actionKey)}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Box sx={{ py: 4 }}>
            <Alert severity="info">{error}</Alert>
          </Box>
        ) : filteredAuditData.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontSize: fontSize.md,
                color: COLORS.TEXT_MUTED,
              }}
            >
              No audit history available
            </Typography>
          </Box>
        ) : (
          <TableContainer
            sx={{
              border: `1px solid ${COLORS.BORDER}`,
              borderRadius: radius.lg,
              maxHeight: "calc(100vh - 280px)",
              overflow: "auto",
            }}
          >
            <Table size="small" stickyHeader sx={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow
                  sx={{
                    "& .MuiTableCell-head": {
                      fontFamily: "Inter",
                      fontSize: fontSize.sm,
                      fontWeight: fontWeight.semibold,
                      color: COLORS.TEXT_MUTED,
                      letterSpacing: "0.4px",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      backgroundColor: COLORS.SURFACE_CARD,
                      borderBottom: `1px solid ${COLORS.BORDER}`,
                    },
                  }}
                >
                  <TableCell sx={{ width: 170 }}>Date</TableCell>
                  <TableCell sx={{ width: 100 }}>User</TableCell>
                  <TableCell sx={{ width: 140 }}>Name</TableCell>
                  <TableCell sx={{ width: 170 }}>Action</TableCell>
                  <TableCell colSpan={3} sx={{ p: 0 }}>
                    <Box sx={{ py: 1, px: 1.5 }}>Difference</Box>
                    <Box
                      sx={{
                        display: "flex",
                        borderTop: `1px solid ${COLORS.BORDER}`,
                      }}
                    >
                      <Box sx={{ ...diffSubHeaderSx, flex: 1, px: 1.5 }}>
                        Key
                      </Box>
                      <Box
                        sx={{
                          ...diffSubHeaderSx,
                          flex: 1,
                          px: 1.5,
                          borderLeft: `1px solid ${COLORS.BORDER}`,
                        }}
                      >
                        Old
                      </Box>
                      <Box
                        sx={{
                          ...diffSubHeaderSx,
                          flex: 1,
                          px: 1.5,
                          borderLeft: `1px solid ${COLORS.BORDER}`,
                        }}
                      >
                        New
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAuditData.map((row, rowIndex) => (
                  <TableRow key={row.id || rowIndex} hover>
                    <TableCell
                      sx={{
                        fontFamily: "Inter",
                        fontSize: fontSize.sm,
                        color: COLORS.TEXT_BODY,
                        verticalAlign: "top",
                        borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.date}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "Inter",
                        fontSize: fontSize.sm,
                        color: COLORS.TEXT_BODY,
                        verticalAlign: "top",
                        borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                      }}
                    >
                      {row.user}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "Inter",
                        fontSize: fontSize.sm,
                        color: COLORS.TEXT_BODY,
                        verticalAlign: "top",
                        borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                        wordBreak: "break-word",
                      }}
                    >
                      {row.name}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "Inter",
                        fontSize: fontSize.sm,
                        color: COLORS.TEXT_BODY,
                        verticalAlign: "top",
                        borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                        wordBreak: "break-word",
                      }}
                    >
                      {row.action}
                    </TableCell>
                    <TableCell
                      colSpan={3}
                      sx={{
                        p: 0,
                        verticalAlign: "top",
                        borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                      }}
                    >
                      {row.differences.map((diff, diffIndex) => (
                        <Box
                          key={diffIndex}
                          sx={{
                            display: "flex",
                            width: "100%",
                            borderTop:
                              diffIndex > 0
                                ? `1px solid ${COLORS.BORDER_VERY_LIGHT}`
                                : "none",
                          }}
                        >
                          <Box
                            sx={{
                              ...diffCellSx,
                              flex: 1,
                              fontWeight: fontWeight.medium,
                            }}
                          >
                            {diff.key}
                          </Box>
                          <Box
                            sx={{
                              ...diffCellSx,
                              flex: 1,
                              borderLeft: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                            }}
                          >
                            {diff.old}
                          </Box>
                          <Box
                            sx={{
                              ...diffCellSx,
                              flex: 1,
                              borderLeft: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                            }}
                          >
                            {diff.new}
                          </Box>
                        </Box>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderTop: `1px solid ${COLORS.BORDER}`,
          display: "flex",
          justifyContent: "flex-end",
          backgroundColor: COLORS.SURFACE_FOOTER,
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={onClose}
          sx={{
            borderRadius: radius.sm,
            textTransform: "none",
            fontSize: fontSize.md,
            fontWeight: fontWeight.medium,
            px: 2,
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_PRIMARY,
            "&:hover": {
              borderColor: COLORS.TEXT_MUTED,
              backgroundColor: "rgba(0,0,0,0.02)",
            },
          }}
        >
          Close
        </Button>
      </Box>
    </Dialog>
  );
};

export default AuditPatientHistoryDialog;
