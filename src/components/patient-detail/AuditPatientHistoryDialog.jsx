import { useEffect, useState } from "react";
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

// Nested Key/Old/New sub-header for the "Difference" column group — same idea as
// before, restyled to match the table header convention (see below) instead of
// hardcoded hex colors.
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
};

/**
 * AuditPatientHistoryDialog — audit log of patient-record changes.
 * @param {Object} props
 * @param {boolean} props.open
 * @param {Function} props.onClose
 * @param {Array} [props.auditData] - defaults to sample data when not provided
 * @param {String} [props.patientId]
 */
const formatValue = (val) => {
  if (val === null || val === undefined) return "";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
};

const normalizeAuditData = (payload) => {
  const list = Array.isArray(payload)
    ? payload
    : payload?.auditEvents || payload?.data?.auditEvents || [];

  return (list || []).map((entry, index) => {
    let differences = [];

    if (Array.isArray(entry?.differences)) {
      differences = entry.differences.map((diff) => ({
        key: diff?.key || diff?.field || diff?.path || "value",
        old: formatValue(diff?.old ?? diff?.previous),
        new: formatValue(diff?.new ?? diff?.current),
      }));
    } else if (entry?.oldValue !== undefined || entry?.newValue !== undefined) {
      if (
        (entry?.oldValue && typeof entry.oldValue === "object") ||
        (entry?.newValue && typeof entry.newValue === "object")
      ) {
        const oldObj =
          typeof entry.oldValue === "object" && entry.oldValue !== null
            ? entry.oldValue
            : {};
        const newObj =
          typeof entry.newValue === "object" && entry.newValue !== null
            ? entry.newValue
            : {};
        
        const oldKeys = Object.keys(oldObj);
        const newKeys = Object.keys(newObj);
        const keysToCompare = oldKeys.filter((k) => newKeys.includes(k));

        keysToCompare.forEach((key) => {
          if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
            differences.push({
              key,
              old: formatValue(oldObj[key]),
              new: formatValue(newObj[key]),
            });
          }
        });

        // If there are truly no measurable differences between the keys we can compare,
        // we don't dump the whole object. We just show that the update happened.
        if (differences.length === 0) {
          differences.push({
            key: "Update logged",
            old: "-",
            new: "-",
          });
        }
      } else {
        differences = [
          {
            key: entry?.section || "value",
            old: formatValue(entry?.oldValue),
            new: formatValue(entry?.newValue),
          },
        ];
      }
    }

    return {
      id: entry?._id || entry?.id || entry?.eventId || `audit-${index}`,
      date:
        entry?.changedAt ||
        entry?.createdAt ||
        entry?.timestamp ||
        entry?.date ||
        "",
      user:
        entry?.actor?.name ||
        entry?.actorName ||
        entry?.user?.name ||
        entry?.userName ||
        entry?.user ||
        "System",
      name: entry?.name || entry?.section || entry?.patientName || "Patient",
      action: entry?.action || entry?.type || "Update",
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
  const [auditData, setAuditData] = useState(propAuditData || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) {
      setAuditData(propAuditData || []);
      setLoading(false);
      setError(null);
      return;
    }

    if (propAuditData) {
      setAuditData(propAuditData);
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
          { signal: controller.signal },
        );
        const payload = response?.data?.data || response?.data || {};
        setAuditData(normalizeAuditData(payload));
      } catch (err) {
        if (err?.name === "CanceledError") return;
        setError(
          err?.response?.data?.message ||
            "Failed to load patient audit history.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAuditHistory();

    return () => controller.abort();
  }, [open, patientId, propAuditData]);

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
      {/* Header — same SURFACE_TINT + close-X treatment as BlockSlotModal.jsx / AddCreditCardModal.jsx */}
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
            defaultValue="Update"
            MenuProps={
              roundedSelectMenuProps.PaperProps
                ? roundedSelectMenuProps
                : undefined
            }
            sx={{
              minWidth: 120,
              fontFamily: "Inter",
              fontSize: fontSize.md,
              "& .MuiSelect-select": { py: "6px" },
              borderRadius: radius.md,
            }}
          >
            <MenuItem
              value="Update"
              sx={{ fontFamily: "Inter", fontSize: fontSize.md }}
            >
              Update
            </MenuItem>
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
        ) : auditData.length === 0 ? (
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
                  <TableCell sx={{ width: 130 }}>Date</TableCell>
                  <TableCell sx={{ width: 90 }}>User</TableCell>
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
                {auditData.map((row, rowIndex) => (
                  <TableRow key={row.id || rowIndex} hover>
                    <TableCell
                      sx={{
                        fontFamily: "Inter",
                        fontSize: fontSize.sm,
                        color: COLORS.TEXT_BODY,
                        verticalAlign: "top",
                        borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
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
                          <Box sx={{ ...diffCellSx, flex: 1 }}>{diff.key}</Box>
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

      {/* Footer — same treatment as AddCreditCardModal.jsx / AddBankAccountModal.jsx */}
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
