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
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { COLORS } from "../../../../constants/colors";
import {
  fontSize,
  fontWeight,
  radius,
  roundedSelectMenuProps,
} from "../../../../constants/styles";
import dayjs from "dayjs";

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

const formatValue = (val) => {
  if (val === null || val === undefined) return "";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
};

const normalizeAuditData = (payload) => {
  const list = Array.isArray(payload) ? payload : [];

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
    } else if (entry?.message) {
      differences = [
        {
          key: "Message",
          old: "-",
          new: formatValue(entry.message),
        }
      ]
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
      name: entry?.name || entry?.section || entry?.patientName || "Appointment",
      action: entry?.action || entry?.type || "Update",
      differences,
    };
  });
};

const ReminderScheduleHistoryDialog = ({
  open,
  onClose,
  appointment,
}) => {
  const [auditData, setAuditData] = useState([]);
  const [filterAction, setFilterAction] = useState("All");

  useEffect(() => {
    if (!open || !appointment) {
      setAuditData([]);
      return;
    }

    // Reminders could be in reminders, communications, or systemEvents
    const reminders = appointment?.reminders || appointment?.communications || [];
    if (reminders.length > 0) {
      setAuditData(normalizeAuditData(reminders));
    } else {
      setAuditData([]);
    }
  }, [open, appointment]);

  const allActions = ["All", ...new Set(auditData.map((d) => d.action))];

  const filteredData = auditData.filter((row) => {
    if (filterAction !== "All" && row.action !== filterAction) return false;
    return true;
  });

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
          Reminder Schedule History
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
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
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
            {allActions.map((action) => (
              <MenuItem
                key={action}
                value={action}
                sx={{ fontFamily: "Inter", fontSize: fontSize.md }}
              >
                {action}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {auditData.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontSize: fontSize.md,
                color: COLORS.TEXT_MUTED,
              }}
            >
              No reminder records found.
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
                    <Box sx={{ py: 1, px: 1.5 }}>Details</Box>
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
                {filteredData.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell
                      sx={{
                        fontFamily: "Inter",
                        fontSize: fontSize.sm,
                        color: COLORS.TEXT_BODY,
                        borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                        whiteSpace: "nowrap",
                        verticalAlign: "top",
                      }}
                    >
                      {row.date ? dayjs(row.date).format("MM/DD/YYYY") : "---"}
                      <br />
                      <Typography
                        component="span"
                        sx={{ color: COLORS.TEXT_MUTED, fontSize: fontSize.xs }}
                      >
                        {row.date ? dayjs(row.date).format("hh:mm:ss A") : ""}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "Inter",
                        fontSize: fontSize.sm,
                        color: COLORS.TEXT_BODY,
                        borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                        verticalAlign: "top",
                      }}
                    >
                      {row.user || "---"}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "Inter",
                        fontSize: fontSize.sm,
                        color: COLORS.TEXT_BODY,
                        borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                        verticalAlign: "top",
                      }}
                    >
                      {row.name || "---"}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "Inter",
                        fontSize: fontSize.sm,
                        color: COLORS.TEXT_BODY,
                        borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                        verticalAlign: "top",
                      }}
                    >
                      {row.action || "---"}
                    </TableCell>

                    <TableCell
                      colSpan={3}
                      sx={{
                        p: 0,
                        borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                        verticalAlign: "top",
                      }}
                    >
                      {row.differences && row.differences.length > 0 ? (
                        row.differences.map((diff, idx) => {
                          const isLast = idx === row.differences.length - 1;
                          return (
                            <Box
                              key={idx}
                              sx={{
                                display: "flex",
                                width: "100%",
                                borderBottom: isLast
                                  ? "none"
                                  : `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                              }}
                            >
                              <Box
                                sx={{
                                  flex: 1,
                                  ...diffCellSx,
                                }}
                              >
                                {diff.key}
                              </Box>
                              <Box
                                sx={{
                                  flex: 1,
                                  ...diffCellSx,
                                  borderLeft: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                                }}
                              >
                                {diff.old || "-"}
                              </Box>
                              <Box
                                sx={{
                                  flex: 1,
                                  ...diffCellSx,
                                  borderLeft: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
                                }}
                              >
                                {diff.new || "-"}
                              </Box>
                            </Box>
                          );
                        })
                      ) : (
                        <Box sx={{ p: 1, color: COLORS.TEXT_MUTED, fontSize: fontSize.sm }}>
                          No specific changes recorded.
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          px: 2.5,
          py: 1.5,
          borderTop: `1px solid ${COLORS.BORDER}`,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: COLORS.TEXT_SECONDARY,
            borderColor: COLORS.BORDER,
            textTransform: "none",
            fontFamily: "Inter",
            fontWeight: fontWeight.medium,
            px: 3,
            borderRadius: radius.md,
            "&:hover": {
              backgroundColor: COLORS.SURFACE_HOVER,
              borderColor: COLORS.BORDER_HOVER,
            },
          }}
        >
          Close
        </Button>
      </Box>
    </Dialog>
  );
};

export default ReminderScheduleHistoryDialog;
