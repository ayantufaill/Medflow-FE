import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
  Print as PrintIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { clinicalNoteService } from "../../services/clinical-note.service";
import { appointmentService } from "../../services/appointment.service";

/**
 * ProgressNotesDialog
 * High-fidelity implementation of "Today's Progress Notes" dashboard.
 */
const ProgressNotesDialog = ({ open, onClose, providers = [] }) => {
  const today = dayjs().format("YYYY-MM-DD");
  
  // ─── Filter State ───────────
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [kind, setKind] = useState("All");
  const [providerId, setProviderId] = useState("All");

  // ─── Data State ─────────────
  const [loading, setLoading] = useState(false);
  const [missingNotes, setMissingNotes] = useState([]);
  const [unsignedNotes, setUnsignedNotes] = useState([]);
  const [signedNotes, setSignedNotes] = useState([]);
  const [expandedNoteIds, setExpandedNoteIds] = useState(new Set());

  const toggleNoteExpansion = (id) => {
    setExpandedNoteIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        startDate,
        endDate,
        providerId: providerId === "All" ? "" : providerId,
        noteType: kind === "All" ? "" : kind,
      };

      // 1 & 2. Fetch Signed and Unsigned Notes
      const [signedData, unsignedData, allAppointments] = await Promise.all([
        clinicalNoteService.getAllClinicalNotes(1, 100, { ...filters, isSigned: true }),
        clinicalNoteService.getAllClinicalNotes(1, 100, { ...filters, isSigned: false }),
        appointmentService.getAllAppointments(1, 200, filters.providerId, "", "checkout complete", startDate, endDate)
      ]);

      setSignedNotes(signedData.clinicalNotes || []);
      setUnsignedNotes(unsignedData.clinicalNotes || []);

      // 3. Logic for "Missing Notes"
      // Filter appointments that don't have a clinical note associated
      // (Simplified logic: if appointment.clinicalNoteId is missing)
      const noteApptIds = new Set([
        ...(signedData.clinicalNotes || []).map(n => n.appointmentId?._id || n.appointmentId),
        ...(unsignedData.clinicalNotes || []).map(n => n.appointmentId?._id || n.appointmentId)
      ]);

      const missing = (allAppointments.appointments || []).filter(a => !noteApptIds.has(a._id || a.id));
      setMissingNotes(missing);

    } catch (err) {
      console.error("Failed to fetch progress notes data:", err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, kind, providerId]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  const handleApply = () => fetchData();

  const getProviderName = useCallback((pOrId) => {
    if (!pOrId) return "N/A";
    
    // Find provider if only ID was passed
    const p = typeof pOrId === 'string' ? providers.find(item => (item._id || item.id) === pOrId) : pOrId;
    if (!p) return typeof pOrId === 'string' ? `Provider #${pOrId}` : "Unknown";

    if (p.name) return p.name;
    const fullName = `${p.firstName || ""} ${p.lastName || ""}`.trim();
    if (fullName) return fullName;
    const userFullName = `${p.userId?.firstName || ""} ${p.userId?.lastName || ""}`.trim();
    if (userFullName) return userFullName;
    return p.providerCode || `Provider #${p._id || p.id}` || "";
  }, [providers]);

  const providerNameMap = useMemo(() => {
    const map = new Map();
    providers.forEach(p => map.set(p._id || p.id, getProviderName(p)));
    return map;
  }, [providers, getProviderName]);

  const tableHeadSx = { 
    bgcolor: "#f8f9fa", 
    "& .MuiTableCell-root": { 
      fontSize: "0.75rem", 
      fontWeight: 700, 
      color: "#666",
      py: 1,
      borderBottom: "2px solid #edeff1"
    } 
  };

  const cellSx = { py: 0.75, fontSize: "0.8rem", color: "#333", borderBottom: "1px solid #f0f0f0" };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: "8px", height: "90vh" } }}>
      {/* HEADER */}
      <DialogTitle sx={{ bgcolor: "#5c7cbc", p: 1.5, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem" }}>Today's Progress Notes</Typography>
        <IconButton onClick={onClose} size="small" sx={{ position: "absolute", right: 8, top: 8, color: "#fff" }}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
        {/* FILTERS */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap", mb: 1, mt: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155" }}>Start Date:</Typography>
            <TextField variant="standard" type="date" size="small" value={startDate} onChange={(e) => setStartDate(e.target.value)} sx={{ width: 130, "& .MuiInputBase-input": { fontSize: "0.85rem" } }} />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155" }}>End Date:</Typography>
            <TextField variant="standard" type="date" size="small" value={endDate} onChange={(e) => setEndDate(e.target.value)} sx={{ width: 130, "& .MuiInputBase-input": { fontSize: "0.85rem" } }} />
          </Box>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155" }}>Kind:</Typography>
            <Select variant="standard" value={kind} onChange={(e) => setKind(e.target.value)} sx={{ minWidth: 100, fontSize: "0.85rem" }}>
              {["All", "Treatment", "Recare", "Exam", "Emergency"].map(k => <MenuItem key={k} value={k}>{k}</MenuItem>)}
            </Select>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155" }}>Provider:</Typography>
            <Select variant="standard" value={providerId} onChange={(e) => setProviderId(e.target.value)} sx={{ minWidth: 150, fontSize: "0.85rem" }}>
              <MenuItem value="All">All</MenuItem>
              {providers.map(p => (
                <MenuItem key={p._id || p.id} value={p._id || p.id}>
                  {getProviderName(p)}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button variant="contained" size="small" onClick={handleApply} sx={{ bgcolor: "#7d99d1", "&:hover": { bgcolor: "#6a85bd" }, textTransform: "none", height: 32, px: 2, fontWeight: 600 }}>Apply</Button>
            <Button variant="contained" size="small" onClick={fetchData} startIcon={<RefreshIcon sx={{ fontSize: 16 }} />} sx={{ bgcolor: "#5c7cbc", "&:hover": { bgcolor: "#4a6496" }, textTransform: "none", height: 32, px: 2, fontWeight: 600 }}>Refresh</Button>
          </Box>
        </Box>

        {/* ACTIONS */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="contained" size="small" startIcon={<ExportIcon />} sx={{ bgcolor: "#5c7cbc", textTransform: "none", fontSize: "0.75rem" }}>Export as CSV</Button>
          <Button variant="contained" size="small" startIcon={<PrintIcon />} sx={{ bgcolor: "#d8b16b", "&:hover": { bgcolor: "#c49c56" }, textTransform: "none", fontSize: "0.75rem" }}>Print</Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress /></Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
            
            {/* 1. COMPLETED PROCEDURES WITH MISSING NOTES */}
            <Box>
              <Typography sx={{ fontWeight: 700, color: "#5c7cbc", fontSize: "0.9rem", mb: 1 }}>Completed Procedures with Missing Progress Notes</Typography>
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #edeff1" }}>
                <Table size="small">
                  <TableHead sx={tableHeadSx}>
                    <TableRow>
                      <TableCell>Patient</TableCell>
                      <TableCell>DOS</TableCell>
                      <TableCell>Tooth #</TableCell>
                      <TableCell>Surface</TableCell>
                      <TableCell>Code</TableCell>
                      <TableCell>Provider</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {missingNotes.length > 0 ? missingNotes.map((a, i) => (
                      <TableRow key={i}>
                        <TableCell sx={{ ...cellSx, color: "#1976d2", fontWeight: 600 }}>{a.patientId?.firstName} {a.patientId?.lastName}</TableCell>
                        <TableCell sx={cellSx}>{dayjs(a.appointmentDate).format("MM/DD/YYYY")}</TableCell>
                        <TableCell sx={cellSx}>{a.toothNumber || "—"}</TableCell>
                        <TableCell sx={cellSx}>{a.surface || "—"}</TableCell>
                        <TableCell sx={cellSx}>{a.appointmentTypeId?.code || "—"}</TableCell>
                        <TableCell sx={cellSx}>{getProviderName(a.providerId) || providerNameMap.get(a.providerId)}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow><TableCell colSpan={6} align="center" sx={{ py: 2, color: "#999" }}>No missing progress notes</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* 2. UNSIGNED NOTES */}
            <Box>
              <Typography sx={{ fontWeight: 700, color: "#5c7cbc", fontSize: "0.9rem", mb: 1 }}>Unsigned Progress Notes</Typography>
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #edeff1" }}>
                <Table size="small">
                  <TableHead sx={tableHeadSx}>
                    <TableRow>
                      <TableCell>Patient</TableCell>
                      <TableCell>Created Date</TableCell>
                      <TableCell>Kind</TableCell>
                      <TableCell>Provider</TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {unsignedNotes.length > 0 ? unsignedNotes.map((n, i) => {
                      const isExpanded = expandedNoteIds.has(n._id || n.id);
                      return (
                        <React.Fragment key={n._id || n.id || i}>
                          <TableRow onClick={() => toggleNoteExpansion(n._id || n.id)}>
                            <TableCell sx={{ ...cellSx, color: "#1976d2", fontWeight: 600, cursor: "pointer" }}>{n.patientId?.firstName} {n.patientId?.lastName}</TableCell>
                            <TableCell sx={cellSx}>{dayjs(n.createdAt).format("MM/DD/YYYY")}</TableCell>
                            <TableCell sx={cellSx}>{n.noteType || "Treatment"}</TableCell>
                            <TableCell sx={cellSx}>{getProviderName(n.providerId)}</TableCell>
                            <TableCell align="right" sx={cellSx}>
                              <Box sx={{ display: "flex", alignItems: "center", color: "#666", cursor: "pointer", justifyContent: "flex-end" }}>
                                {isExpanded ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
                                <Typography sx={{ fontSize: "0.75rem", ml: 0.5 }}>View Note</Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                          {isExpanded && (
                            <TableRow sx={{ bgcolor: "#fafcfe" }}>
                              <TableCell colSpan={5} sx={{ p: 2, borderBottom: "1px solid #edeff1" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                                  <Button variant="contained" size="small" sx={{ bgcolor: "#d8b16b", "&:hover": { bgcolor: "#c49c56" }, textTransform: "none", fontSize: "0.7rem", height: 24, px: 2 }}>Edit Note</Button>
                                  <Typography sx={{ color: "#5c7cbc", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>Sign Progress Note</Typography>
                                </Box>
                                <Typography sx={{ fontSize: "0.85rem", color: "#334155", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                                  {n.content || "No content available for this note."}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    }) : (
                      <TableRow><TableCell colSpan={5} align="center" sx={{ py: 2, color: "#999" }}>No unsigned notes</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* 3. SIGNED NOTES */}
            <Box>
              <Typography sx={{ fontWeight: 700, color: "#5c7cbc", fontSize: "0.9rem", mb: 1 }}>Signed Progress Notes</Typography>
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #edeff1" }}>
                <Table size="small">
                  <TableHead sx={tableHeadSx}>
                    <TableRow>
                      <TableCell>Patient</TableCell>
                      <TableCell>Created Date</TableCell>
                      <TableCell>Kind</TableCell>
                      <TableCell>Provider</TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {signedNotes.length > 0 ? signedNotes.map((n, i) => {
                      const isExpanded = expandedNoteIds.has(n._id || n.id);
                      return (
                        <React.Fragment key={n._id || n.id || i}>
                          <TableRow onClick={() => toggleNoteExpansion(n._id || n.id)}>
                            <TableCell sx={{ ...cellSx, color: "#1976d2", fontWeight: 600, cursor: "pointer" }}>{n.patientId?.firstName} {n.patientId?.lastName}</TableCell>
                            <TableCell sx={cellSx}>{dayjs(n.createdAt).format("MM/DD/YYYY")}</TableCell>
                            <TableCell sx={cellSx}>{n.noteType || "Recare"}</TableCell>
                            <TableCell sx={cellSx}>{getProviderName(n.providerId)}</TableCell>
                            <TableCell align="right" sx={cellSx}>
                              <Box sx={{ display: "flex", alignItems: "center", color: "#666", cursor: "pointer", justifyContent: "flex-end" }}>
                                {isExpanded ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
                                <Typography sx={{ fontSize: "0.75rem", ml: 0.5 }}>View Note</Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                          {isExpanded && (
                            <TableRow sx={{ bgcolor: "#fafcfe" }}>
                              <TableCell colSpan={5} sx={{ p: 2, borderBottom: "1px solid #edeff1" }}>
                                <Box sx={{ mb: 1.5 }}>
                                  <Button variant="contained" size="small" sx={{ bgcolor: "#d8b16b", "&:hover": { bgcolor: "#c49c56" }, textTransform: "none", fontSize: "0.7rem", height: 24, px: 2 }}>Edit Note</Button>
                                </Box>
                                <Typography sx={{ fontSize: "0.85rem", color: "#334155", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                                  {n.content || "No content available for this note."}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    }) : (
                      <TableRow><TableCell colSpan={5} align="center" sx={{ py: 2, color: "#999" }}>No signed notes</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: "1px solid #eee" }}>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: "#94a3b8", "&:hover": { bgcolor: "#64748b" }, textTransform: "none", px: 4 }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProgressNotesDialog;
