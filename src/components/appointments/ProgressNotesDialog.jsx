import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExportIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PersonIcon from "@mui/icons-material/Person";
import dayjs from "dayjs";
import { exportToCSV } from "../../utils/exportUtils";
import { clinicalNoteService } from "../../services/clinical-note.service";

// Redux imports
import { 
  fetchClinicalNotes, 
  selectSignedNotes, 
  selectUnsignedNotes, 
  selectClinicalListLoading 
} from "../../store/slices/clinicalSlice";
import { 
  fetchCheckoutAppointments, 
  selectCheckoutCompleteList, 
  selectCheckoutLoading 
} from "../../store/slices/appointmentSlice";

// ─── Mock Data ─────────────────────────────────────────────────────────────
const MOCK_MISSING_NOTES = [
  {
    _id: "m1",
    patientId: { firstName: "Emma", lastName: "Watson" },
    appointmentDate: "2026-03-26",
    toothNumber: "",
    surface: "",
    appointmentTypeId: { code: "D0220" },
    providerId: { name: "Christine Sabour" }
  },
  {
    _id: "m2",
    patientId: { firstName: "John", lastName: "Smith" },
    appointmentDate: "2026-03-26",
    toothNumber: "21",
    surface: "",
    appointmentTypeId: { code: "D2740" },
    providerId: { name: "Christine Sabour" }
  },
  {
    _id: "m3",
    patientId: { firstName: "Robert", lastName: "Downey" },
    appointmentDate: "2026-03-26",
    toothNumber: "21",
    surface: "",
    appointmentTypeId: { code: "D2950" },
    providerId: { name: "Christine Sabour" }
  },
  {
    _id: "m4",
    patientId: { firstName: "Scarlett", lastName: "Johansson" },
    appointmentDate: "2026-03-26",
    toothNumber: "28",
    surface: "",
    appointmentTypeId: { code: "D2740" },
    providerId: { name: "Christine Sabour" }
  },
  {
    _id: "m5",
    patientId: { firstName: "Chris", lastName: "Evans" },
    appointmentDate: "2026-03-26",
    toothNumber: "28",
    surface: "",
    appointmentTypeId: { code: "D2950" },
    providerId: { name: "Christine Sabour" }
  },
  {
    _id: "m6",
    patientId: { firstName: "Mark", lastName: "Ruffalo" },
    appointmentDate: "2026-03-26",
    toothNumber: "27",
    surface: "",
    appointmentTypeId: { code: "D2740" },
    providerId: { name: "Christine Sabour" }
  }
];

const MOCK_UNSIGNED_NOTES = [
  {
    _id: "u1",
    patientId: { firstName: "Alexis", lastName: "Quintero" },
    createdAt: "2026-03-26",
    noteType: "Treatment",
    providerId: { name: "Christine Sabour" },
    content: `CC: "I don't like the open bite" points to #23,26 when she smiles that shows black/dark spaces due to open bite\nDiscussed needing IPR to level out the lowers and reduce the open bite\nMentioned rotation #9 and lining up the midlines-I told her we can attempt and will need large vertical attachment on #9`
  },
  {
    _id: "u2",
    patientId: { firstName: "James", lastName: "Bond" },
    createdAt: "2026-03-26",
    noteType: "Recare",
    providerId: { name: "Karla Riley" },
    content: `Patient presents for Adult Prophy via Guided Biofilm Therapy, Periodic Exam, IOC, iTero, FLV. **INVISALIGN START**\n- Protective eye wear worn by patient.\n- Dr. Sabour prescribed the following X-Rays: No xrays completed today.\n- 3D Wellness Scan completed: Completed full iTero Wellness scan today.\n- Adult prophy following 8-step Guided Biofilm Therapy protocol completed today Hand Instruments only, EMS Airflow Prophylaxis Master utilized and hand instruments.\n- Assessment Ultrasonic and Hand Instruments used.\n- Perio Diagnosis: Stage 1, Grade A\n- Gingival Description healthy- stable, pink and firm, Localized, mild`
  },
  {
    _id: "u3",
    patientId: { firstName: "Steve", lastName: "Rogers" },
    createdAt: "2026-03-26",
    noteType: "Exam",
    providerId: { name: "Christine Sabour" },
    content: "Periodic oral evaluation - established patient. No significant changes in medical history. Soft tissue exam normal."
  },
  {
    _id: "u4",
    patientId: { firstName: "Natasha", lastName: "Romanoff" },
    createdAt: "2026-03-26",
    noteType: "Recare",
    providerId: { name: "Karla Riley" },
    content: "Prophylaxis - adult. Scaling and polishing completed. Patient maintained good oral hygiene."
  }
];

const MOCK_SIGNED_NOTES = [
  {
    _id: "s1",
    patientId: { firstName: "Diana", lastName: "Prince" },
    createdAt: "2026-03-26",
    noteType: "Recare",
    providerId: { name: "Karla Riley" },
    content: `Patient presents for Adult Prophy via Guided Biofilm Therapy, Periodic Exam, 4BWX + PAs, IOC, FLV.
- HHX Review: Reviewed HHX with patient. Patient reports no changes.
Allergies: NKDA, no reported food allergies.
Conditions: autoimmune, HRT, homeopathic/ functional medicine for anti - inflammatory diet.
Medications: PROGESTERONE Cream compounded, Testosterone '2', multivitamin, vit C, Pregnalone pure, probiotic BioDuph 7 plus, Vit D3, CORTROPHIN-ZINC - PRN, Osteopatite Plus, Glucosamine chondroitin Tumeric & MSM, Buffered C powder, DHEA Pure, Omega Genics, Comaplex, ADPHEN, immunity builder, oil pull- organic
ASA: II.
- CC: None.
- Dr. Sabour prescribed the following X-Rays: 4BWX, PA's
- Protective eye wear worn by patient.
- OCS: Negative, NSF, All WNL.
- TMJ: WNL, NSF, Patient reports no pain or discomfort. Discussed TMJ pain and NG/ retainers due to grinding and clenching.
- iTero Scan completed: Not due for wellness scan today.
- Adult Prophy following 8-step Guided Biofilm Therapy protocol completed today EMS Airflow prophylaxis Master utilized with Ultrasonic and hand instruments.
- Assessment Ultrasonic and Hand Instruments used.
- Probing: Full mouth completed, 1-4mm pockets.
- Perio Diagnosis: Stage 1, Grade A.
- Gingival Description Generalized, mild, moderate
- OH = Fair to poor, Stressed importance of angling ETB lightly towards gumline and C shaped flossing at night.
- Plaque: moderate, generalized along gingival margin and interproximal.
- Calculus: moderate, localized lower anterior lingual.
- Stain: slight to moderate, localized lingual.
- Bleeding: slight to moderate, generalized along gingival margin and interproximal.
- Disclosing + Motivation Utilized GC disclosing tri-color gel with brush, Retraction with Optragate utilized and Vaseline placed on lips
- Airflow Settings: Water 10, Powder 2 BOOST as needed. Removed all biofilm prior to moving to calculus removal. High speed suction + saliva ejector utilized . Complete oral biofilm decontamination achieved. Powder utilized: Classic Sodium Bicarbonate 40 microns
- Piezon Calculus removal only where calculus present. Settings: Water: 7-8 (to allow water to heat but can be dropped down if needed). Power 3-4. Boost as needed.
- Flossed all contacts.
- Fluoride: Applied 2.1% NaF varnish, watermelon flavor. Post op instructions given to patient.
- Ortho/ Invisalign: She has a NG/ retainer she wears - seeing massage therapist for TMJ massages.
- Doctor's Exam Findings: #19 WATCH - 6 week eval for possible RCT, #5 Bioclear.
- TX: 6 week Re-eval.
- NVH: 3-4 month recare - REC DUE TO OH - tons of calculus and stain - 6 month recare patient might stay on due to finances - stressed importance of 3-4 mo recare.`
  }
];

/**
 * ProgressNotesDialog
 */
const ProgressNotesDialog = ({ open, onClose, providers = [] }) => {
  const dispatch = useDispatch();
  
  const today = dayjs().format("YYYY-MM-DD");
  
  // ─── Filter State ───────────
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [kind, setKind] = useState("All");
  const [providerId, setProviderId] = useState("All");

  // Redux Selectors
  const signedData = useSelector(selectSignedNotes);
  const unsignedData = useSelector(selectUnsignedNotes);
  const checkoutAppointments = useSelector(selectCheckoutCompleteList);
  const clinicalLoading = useSelector(selectClinicalListLoading);
  const checkoutLoading = useSelector(selectCheckoutLoading);

  const [expandedNoteIds, setExpandedNoteIds] = useState(new Set());
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const loading = clinicalLoading || checkoutLoading;

  const toggleNoteExpansion = (id) => {
    setExpandedNoteIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const fetchData = useCallback(() => {
    const filters = {
      startDate,
      endDate,
      providerId: providerId === "All" ? "" : providerId,
      noteType: kind === "All" ? "" : kind,
    };

    dispatch(fetchClinicalNotes({ page: 1, limit: 100, filters: { ...filters, isSigned: true } }));
    dispatch(fetchClinicalNotes({ page: 1, limit: 100, filters: { ...filters, isSigned: false } }));
    dispatch(fetchCheckoutAppointments({ page: 1, limit: 200, ...filters }));
  }, [dispatch, startDate, endDate, providerId, kind]);

  const [signedNotes, setSignedNotes] = useState([]);
  const [unsignedNotes, setUnsignedNotes] = useState([]);

  useEffect(() => {
    setSignedNotes([...(signedData || []), ...MOCK_SIGNED_NOTES]);
  }, [signedData]);

  useEffect(() => {
    setUnsignedNotes([...(unsignedData || []), ...MOCK_UNSIGNED_NOTES]);
  }, [unsignedData]);

  // Derived state to find Missing Notes
  const missingNotes = useMemo(() => {
    const allFetchedNotes = [...signedNotes, ...unsignedNotes];
    const missing = [];
    const appointments = checkoutAppointments || [];
    
    appointments.forEach(appt => {
      const ptId = appt.patientId?._id || appt.patientId?.id || appt.patientId;
      if (ptId) {
        const hasNote = allFetchedNotes.some(n => {
          const nId = n.patientId?._id || n.patientId?.id || n.patientId;
          return nId === ptId;
        });
        
        if (!hasNote) {
          missing.push({
            _id: `m-${appt._id || appt.id}`,
            patientName: appt.patientName || `${appt.patientId?.firstName || ''} ${appt.patientId?.lastName || ''}`.trim() || 'Unknown Patient',
            appointmentType: appt.appointmentType || appt.appointmentTypeId?.name || "Visit",
            providerName: appt.providerId?.firstName ? `${appt.providerId.firstName} ${appt.providerId.lastName}` : (appt.providerId?.name || "Unknown Provider"),
            time: appt.startTime || "Unknown Time"
          });
        }
      }
    });
    
    return [...missing, ...MOCK_MISSING_NOTES];
  }, [signedNotes, unsignedNotes, checkoutAppointments]);

  const handleExport = () => {
    const data = [
      ...missingNotes.map(n => ({ status: 'Missing', patient: n.patientName, date: dayjs(n.appointmentDate).format('YYYY-MM-DD'), provider: n.providerId?.name || 'Unknown' })),
      ...unsignedNotes.map(n => ({ status: 'Unsigned', patient: `${n.patientId?.firstName} ${n.patientId?.lastName}`, date: dayjs(n.appointmentDate).format('YYYY-MM-DD'), provider: n.providerId?.name || 'Unknown' })),
      ...signedNotes.map(n => ({ status: 'Signed', patient: `${n.patientId?.firstName} ${n.patientId?.lastName}`, date: dayjs(n.appointmentDate).format('YYYY-MM-DD'), provider: n.providerId?.name || 'Unknown' }))
    ];
    exportToCSV(data, [
      { header: 'Status', key: 'status' },
      { header: 'Patient', key: 'patient' },
      { header: 'Date', key: 'date' },
      { header: 'Provider', key: 'provider' }
    ], 'Progress_Notes');
  };

  // Handle open dialog
  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);


  const handleEditStart = (n) => {
    setEditingNoteId(n._id || n.id);
    setEditingContent(n.content || "");
  };

  const handleEditCancel = () => {
    setEditingNoteId(null);
    setEditingContent("");
  };

  const handleEditSave = async () => {
    if (!editingNoteId) return;

    try {
      const isRealNote = !String(editingNoteId).startsWith("u") && !String(editingNoteId).startsWith("s") && !String(editingNoteId).startsWith("m");
      if (isRealNote) {
        await clinicalNoteService.updateClinicalNote(editingNoteId, { content: editingContent });
        fetchData();
      } else {
        const updater = (prev) => prev.map(n => 
          (n._id === editingNoteId || n.id === editingNoteId) 
            ? { ...n, content: editingContent } 
            : n
        );
        setUnsignedNotes(updater);
        setSignedNotes(updater);
      }
    } catch (err) {
      console.error("Failed to save note:", err);
    }
    
    setEditingNoteId(null);
    setEditingContent("");
  };

  const handleSignNote = async (noteId) => {
    try {
      const isRealNote = !String(noteId).startsWith("u") && !String(noteId).startsWith("s") && !String(noteId).startsWith("m");
      if (isRealNote) {
        await clinicalNoteService.signClinicalNote(noteId);
        fetchData();
      } else {
        const noteToSign = unsignedNotes.find(n => (n._id === noteId || n.id === noteId));
        if (noteToSign) {
          setUnsignedNotes(prev => prev.filter(n => n._id !== noteId && n.id !== noteId));
          setSignedNotes(prev => [...prev, { ...noteToSign, isSigned: true, signedAt: new Date().toISOString() }]);
        }
      }
    } catch (err) {
      console.error("Failed to sign note:", err);
    }
  };

  const getProviderName = useCallback((pOrId) => {
    if (!pOrId) return "N/A";
    
    // Handle mock data provider objects which might already have a name string
    if (typeof pOrId === 'object' && pOrId.name) return pOrId.name;

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

      <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3, "@media print": { p: 0, '& .no-print': { display: 'none !important' } } }}>
        <style>
          {`
            @media print {
              body * { visibility: hidden; }
              .printable-content, .printable-content * { visibility: visible; }
              .printable-content { position: absolute; left: 0; top: 0; width: 100%; }
            }
          `}
        </style>
        <Box className="printable-content" sx={{ width: '100%' }}>
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
            <Button variant="contained" size="small" onClick={fetchData} sx={{ bgcolor: "#7d99d1", "&:hover": { bgcolor: "#6a85bd" }, textTransform: "none", height: 32, px: 2, fontWeight: 600 }}>Apply</Button>
            <Button variant="contained" size="small" onClick={fetchData} startIcon={<RefreshIcon sx={{ fontSize: 16 }} />} sx={{ bgcolor: "#5c7cbc", "&:hover": { bgcolor: "#4a6496" }, textTransform: "none", height: 32, px: 2, fontWeight: 600 }}>Refresh</Button>
          </Box>
        </Box>

        {/* ACTIONS */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<ExportIcon />} 
            onClick={handleExport}
            sx={{ bgcolor: "#5c7cbc", textTransform: "none", fontSize: "0.75rem" }}
          >
            Export as CSV
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<PrintIcon />} 
            onClick={() => window.print()}
            sx={{ bgcolor: "#d8b16b", "&:hover": { bgcolor: "#c49c56" }, textTransform: "none", fontSize: "0.75rem" }}
          >
            Print
          </Button>
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
                      <TableRow key={a._id || i}>
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
                                  <Box sx={{ display: "flex", gap: 1 }}>
                                    {editingNoteId === (n._id || n.id) ? (
                                      <>
                                        <Button variant="contained" size="small" onClick={handleEditSave} sx={{ bgcolor: "#5c7cbc", "&:hover": { bgcolor: "#4a6496" }, textTransform: "none", fontSize: "0.7rem", height: 24, px: 2 }}>Save</Button>
                                        <Button variant="outlined" size="small" onClick={handleEditCancel} sx={{ color: "#666", borderColor: "#ccc", textTransform: "none", fontSize: "0.7rem", height: 24, px: 2 }}>Cancel</Button>
                                      </>
                                    ) : (
                                      <Button variant="contained" size="small" onClick={() => handleEditStart(n)} sx={{ bgcolor: "#d8b16b", "&:hover": { bgcolor: "#c49c56" }, textTransform: "none", fontSize: "0.7rem", height: 24, px: 2 }}>Edit Note</Button>
                                    )}
                                  </Box>
                                  <Typography 
                                    onClick={() => handleSignNote(n._id || n.id)}
                                    sx={{ color: "#5c7cbc", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                                  >
                                    Sign Progress Note
                                  </Typography>
                                </Box>
                                
                                {editingNoteId === (n._id || n.id) ? (
                                  <TextField 
                                    fullWidth 
                                    multiline 
                                    rows={4} 
                                    value={editingContent} 
                                    onChange={(e) => setEditingContent(e.target.value)} 
                                    sx={{ 
                                      "& .MuiInputBase-root": { fontSize: "0.85rem", color: "#334155", lineHeight: 1.6, bgcolor: "#fff" } 
                                    }} 
                                  />
                                ) : (
                                  <Typography sx={{ fontSize: "0.85rem", color: "#334155", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                                    {n.content || "No content available for this note."}
                                  </Typography>
                                )}
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
                                <Box sx={{ mb: 1.5, display: "flex", gap: 1 }}>
                                  {editingNoteId === (n._id || n.id) ? (
                                    <>
                                      <Button variant="contained" size="small" onClick={handleEditSave} sx={{ bgcolor: "#5c7cbc", "&:hover": { bgcolor: "#4a6496" }, textTransform: "none", fontSize: "0.7rem", height: 24, px: 2 }}>Save</Button>
                                      <Button variant="outlined" size="small" onClick={handleEditCancel} sx={{ color: "#666", borderColor: "#ccc", textTransform: "none", fontSize: "0.7rem", height: 24, px: 2 }}>Cancel</Button>
                                    </>
                                  ) : (
                                    <Button variant="contained" size="small" onClick={() => handleEditStart(n)} sx={{ bgcolor: "#d8b16b", "&:hover": { bgcolor: "#c49c56" }, textTransform: "none", fontSize: "0.7rem", height: 24, px: 2 }}>Edit Note</Button>
                                  )}
                                </Box>

                                {editingNoteId === (n._id || n.id) ? (
                                  <TextField 
                                    fullWidth 
                                    multiline 
                                    rows={4} 
                                    value={editingContent} 
                                    onChange={(e) => setEditingContent(e.target.value)} 
                                    sx={{ 
                                      "& .MuiInputBase-root": { fontSize: "0.85rem", color: "#334155", lineHeight: 1.6, bgcolor: "#fff" } 
                                    }} 
                                  />
                                ) : (
                                  <Typography sx={{ fontSize: "0.85rem", color: "#334155", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                                    {n.content || "No content available for this note."}
                                  </Typography>
                                )}
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
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: "1px solid #eee" }}>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: "#94a3b8", "&:hover": { bgcolor: "#64748b" }, textTransform: "none", px: 4 }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};


export default ProgressNotesDialog;
