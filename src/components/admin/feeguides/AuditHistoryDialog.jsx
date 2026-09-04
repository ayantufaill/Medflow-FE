import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  MenuItem,
} from "@mui/material";
import {
  Close as CloseIcon,
  DescriptionOutlined as DescriptionIcon,
} from "@mui/icons-material";
import CustomSelect from "../../common/CustomSelect";
import apiClient from "../../../config/api";

const normalizeHistoryRows = (payload) => {
  const list = Array.isArray(payload)
    ? payload
    : payload?.auditEvents ||
      payload?.history ||
      payload?.data?.auditEvents ||
      payload?.data?.history ||
      payload?.items ||
      payload?.data?.items ||
      [];

  return list.map((item, index) => {
    const diffs = Array.isArray(item?.differences)
      ? item.differences
      : Array.isArray(item?.diff)
        ? item.diff
        : Array.isArray(item?.changes)
          ? item.changes
          : item?.oldValue !== undefined || item?.newValue !== undefined
            ? [
                {
                  key: item?.section || "value",
                  old: item?.oldValue ?? "",
                  new: item?.newValue ?? "",
                },
              ]
            : [];

    return {
      id:
        item?._id ||
        item?.id ||
        item?.eventId ||
        item?.auditId ||
        `row-${index}`,
      date:
        item?.changedAt ||
        item?.createdAt ||
        item?.timestamp ||
        item?.date ||
        "",
      user:
        item?.actor?.name ||
        item?.actorName ||
        item?.user?.name ||
        item?.userName ||
        item?.user ||
        "System",
      name:
        item?.name ||
        item?.feeGuideName ||
        item?.resourceName ||
        item?.targetName ||
        "Fee Guide",
      action: item?.action || item?.type || item?.event || "Update",
      diff: diffs.map((diff) => ({
        key: diff?.key || diff?.field || diff?.path || "value",
        old: diff?.old ?? diff?.previous ?? "",
        new: diff?.new ?? diff?.current ?? "",
      })),
    };
  });
};

const AuditHistoryDialog = ({
  open,
  onClose,
  historyEndpoint = "/admin/finance-management/fee-guides/audit-history",
  historyItems = null,
}) => {
  const [rows, setRows] = useState([]);
  const [filterAction, setFilterAction] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) {
      setRows([]);
      setFilterAction('All');
      setLoading(false);
      setError(null);
      return;
    }

    if (Array.isArray(historyItems)) {
      setRows(normalizeHistoryRows(historyItems));
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadHistory = async () => {
      setLoading(true);
      setError(null);
      setRows([]);

      try {
        const response = await apiClient.get(historyEndpoint, {
          signal: controller.signal,
        });
        const payload = response?.data?.data || response?.data || {};
        setRows(normalizeHistoryRows(payload));
      } catch (err) {
        if (err?.name === "CanceledError") return;

        if (err?.response?.status === 404) {
          setError(
            "No backend fee-guide audit-history endpoint is available yet.",
          );
        } else {
          setError(
            err?.response?.data?.message || "Failed to load fee guide history.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadHistory();

    return () => controller.abort();
  }, [open, historyEndpoint, historyItems]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{ zIndex: 1600 }}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          px: "20px",
          py: "16px",
          borderBottom: "1px solid #e0e5eb",
          backgroundColor: "#f3f8fd",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            backgroundColor: "#eff6ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <DescriptionIcon sx={{ fontSize: "20px", color: "#2262ef" }} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            flex: 1,
          }}
        >
          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: "15px",
              fontWeight: 700,
              color: "#09121f",
            }}
          >
            Audit Fee Guides History
          </Typography>
          <Typography
            sx={{
              fontWeight: 400,
              color: "#5c646f",
              fontFamily: "Inter",
              fontSize: "11px",
            }}
          >
            View history of actions taken on fee guides.
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: "#6b7280",
            "&:hover": { color: "#111928", backgroundColor: "#e5e7eb" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 4, overflowY: 'auto', flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: "13px",
              color: "#475569",
              fontWeight: 500,
            }}
          >
            Filter list by:
          </Typography>
          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: "13px",
              color: "#475569",
              fontWeight: 500,
              ml: 3,
            }}
          >
            Action:
          </Typography>
          <CustomSelect
            size="small"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            sx={{ width: '120px' }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Create">Create</MenuItem>
            <MenuItem value="Update">Update</MenuItem>
            <MenuItem value="Delete">Delete</MenuItem>
          </CustomSelect>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : error ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, py: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : rows.length === 0 ? (
          <Box
            sx={{
              p: 3,
              border: "1px solid #e2e8f0",
              borderRadius: 2,
              backgroundColor: "#f8fafc",
              textAlign: "center",
            }}
          >
            <Typography sx={{ color: "#475569", fontSize: "14px" }}>
              No fee guide history is available yet.
            </Typography>
          </Box>
        ) : (
          <TableContainer
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: 2,
              maxHeight: 500,
            }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow
                  sx={{
                    "& .MuiTableCell-root": {
                      backgroundColor: "#F8FAFC",
                      color: "#475569",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      py: 1.5,
                      borderBottom: "1px solid #e2e8f0",
                    },
                  }}
                >
                  <TableCell>Date</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell sx={{ textAlign: "center" }} colSpan={3}>
                    Difference
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    "& .MuiTableCell-root": {
                      backgroundColor: "#F8FAFC",
                      color: "#475569",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      py: 1,
                      borderBottom: "2px solid #e2e8f0",
                    },
                  }}
                >
                  <TableCell colSpan={4} />
                  <TableCell sx={{ textAlign: "center", width: "20%" }}>
                    Key
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", width: "20%" }}>
                    Old
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", width: "20%" }}>
                    New
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .filter((row) => filterAction === "All" || row.action === filterAction)
                  .map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      sx={{
                        "& .MuiTableCell-root": {
                          py: 1.5,
                          fontSize: "0.85rem",
                          color: "#1e293b",
                          verticalAlign: "top",
                          borderBottom:
                            row.diff.length > 0 ? "none" : "1px solid #f1f5f9",
                        },
                      }}
                    >
                      <TableCell rowSpan={row.diff.length || 1}>
                        {row.date}
                      </TableCell>
                      <TableCell rowSpan={row.diff.length || 1}>
                        {row.user}
                      </TableCell>
                      <TableCell rowSpan={row.diff.length || 1}>
                        {row.name}
                      </TableCell>
                      <TableCell rowSpan={row.diff.length || 1}>
                        {row.action}
                      </TableCell>
                      {row.diff.length === 0 && <TableCell colSpan={3} />}
                      {row.diff.length > 0 && (
                        <>
                          <TableCell
                            sx={{
                              borderLeft: "1px solid #f1f5f9",
                              textAlign: "center",
                            }}
                          >
                            {row.diff[0].key}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderLeft: "1px solid #f1f5f9",
                              textAlign: "center",
                              color: "#dc2626",
                            }}
                          >
                            {row.diff[0].old}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderLeft: "1px solid #f1f5f9",
                              textAlign: "center",
                              color: "#16a34a",
                            }}
                          >
                            {row.diff[0].new}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                    {row.diff.slice(1).map((diff, index) => (
                      <TableRow
                        key={`${row.id}-${index}`}
                        sx={{
                          "& .MuiTableCell-root": {
                            py: 1.5,
                            fontSize: "0.85rem",
                            borderBottom:
                              index === row.diff.length - 2
                                ? "1px solid #f1f5f9"
                                : "none",
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            borderLeft: "1px solid #f1f5f9",
                            textAlign: "center",
                          }}
                        >
                          {diff.key}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderLeft: "1px solid #f1f5f9",
                            textAlign: "center",
                            color: "#dc2626",
                          }}
                        >
                          {diff.old}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderLeft: "1px solid #f1f5f9",
                            textAlign: "center",
                            color: "#16a34a",
                          }}
                        >
                          {diff.new}
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
            px: 4,
            py: 3,
            borderTop: "1px solid #f1f5f9",
            mx: -4,
            mb: -4,
            mt: 3,
          }}
        >
          <Button
            variant="contained"
            sx={{
              fontFamily: "Inter",
              fontSize: "13px",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "8px",
              backgroundColor: "#2262ef",
              color: "#fff",
              px: "20px",
              py: "7px",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" },
              "&.Mui-disabled": {
                backgroundColor: "#e0e5eb",
                color: "#9aa3ae",
              },
            }}
            onClick={onClose}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuditHistoryDialog;
