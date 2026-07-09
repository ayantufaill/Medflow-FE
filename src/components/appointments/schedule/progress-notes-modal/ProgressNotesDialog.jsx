import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Button,
  CircularProgress,
  Link
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import dayjs from "dayjs";
import { exportToCSV } from "../../../../utils/exportUtils";
import { clinicalNoteService } from "../../../../services/clinical-note.service";

import { useDropdownData } from '../../../../hooks/redux/useDropdownData';

import { 
  fetchClinicalNotes, 
  selectSignedNotes, 
  selectUnsignedNotes, 
  selectClinicalListLoading 
} from "../../../../store/slices/clinicalSlice";
import { 
  fetchCheckoutAppointments, 
  selectCheckoutCompleteList, 
  selectCheckoutLoading 
} from "../../../../store/slices/appointmentSlice";

import ProgressNotesFilters from "./ProgressNotesFilters";
import ProgressNotesActions from "./ProgressNotesActions";
import ProgressNotesTables from "./ProgressNotesTables";

// ─── Mock Data ─────────────────────────────────────────────────────────────
const MOCK_MISSING_NOTES = [
  { _id: "m1", patientId: { firstName: "Emma", lastName: "Watson" }, appointmentDate: "2026-03-26", toothNumber: "", surface: "", appointmentTypeId: { code: "D0220" }, providerId: { name: "Christine Sabour" } },
  { _id: "m2", patientId: { firstName: "John", lastName: "Smith" }, appointmentDate: "2026-03-26", toothNumber: "21", surface: "", appointmentTypeId: { code: "D2740" }, providerId: { name: "Christine Sabour" } },
  { _id: "m3", patientId: { firstName: "Robert", lastName: "Downey" }, appointmentDate: "2026-03-26", toothNumber: "21", surface: "", appointmentTypeId: { code: "D2950" }, providerId: { name: "Christine Sabour" } },
  { _id: "m4", patientId: { firstName: "Scarlett", lastName: "Johansson" }, appointmentDate: "2026-03-26", toothNumber: "28", surface: "", appointmentTypeId: { code: "D2740" }, providerId: { name: "Christine Sabour" } },
  { _id: "m5", patientId: { firstName: "Chris", lastName: "Evans" }, appointmentDate: "2026-03-26", toothNumber: "28", surface: "", appointmentTypeId: { code: "D2950" }, providerId: { name: "Christine Sabour" } },
  { _id: "m6", patientId: { firstName: "Mark", lastName: "Ruffalo" }, appointmentDate: "2026-03-26", toothNumber: "27", surface: "", appointmentTypeId: { code: "D2740" }, providerId: { name: "Christine Sabour" } }
];

const MOCK_UNSIGNED_NOTES = [
  { _id: "u1", patientId: { firstName: "Alexis", lastName: "Quintero" }, createdAt: "2026-03-26", noteType: "Treatment", providerId: { name: "Christine Sabour" }, content: `CC: "I don't like the open bite" points to #23,26 when she smiles that shows black/dark spaces due to open bite\nDiscussed needing IPR to level out the lowers and reduce the open bite\nMentioned rotation #9 and lining up the midlines-I told her we can attempt and will need large vertical attachment on #9` },
  { _id: "u2", patientId: { firstName: "James", lastName: "Bond" }, createdAt: "2026-03-26", noteType: "Recare", providerId: { name: "Karla Riley" }, content: `Patient presents for Adult Prophy via Guided Biofilm Therapy, Periodic Exam, IOC, iTero, FLV. **INVISALIGN START**\n- Protective eye wear worn by patient.\n- Dr. Sabour prescribed the following X-Rays: No xrays completed today.\n- 3D Wellness Scan completed: Completed full iTero Wellness scan today.\n- Adult prophy following 8-step Guided Biofilm Therapy protocol completed today Hand Instruments only, EMS Airflow Prophylaxis Master utilized and hand instruments.\n- Assessment Ultrasonic and Hand Instruments used.\n- Perio Diagnosis: Stage 1, Grade A\n- Gingival Description healthy- stable, pink and firm, Localized, mild` },
  { _id: "u3", patientId: { firstName: "Steve", lastName: "Rogers" }, createdAt: "2026-03-26", noteType: "Exam", providerId: { name: "Christine Sabour" }, content: "Periodic oral evaluation - established patient. No significant changes in medical history. Soft tissue exam normal." },
  { _id: "u4", patientId: { firstName: "Natasha", lastName: "Romanoff" }, createdAt: "2026-03-26", noteType: "Recare", providerId: { name: "Karla Riley" }, content: "Prophylaxis - adult. Scaling and polishing completed. Patient maintained good oral hygiene." }
];

const MOCK_SIGNED_NOTES = [
  { _id: "s1", patientId: { firstName: "Diana", lastName: "Prince" }, createdAt: "2026-03-26", noteType: "Recare", providerId: { name: "Karla Riley" }, content: `Patient presents for Adult Prophy via Guided Biofilm Therapy, Periodic Exam, 4BWX + PAs, IOC, FLV.` }
];

const ProgressNotesDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { providers = [] } = useDropdownData({ providers: true });

  const [dateRange, setDateRange] = useState('Today');
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [kind, setKind] = useState("All");
  const [providerId, setProviderId] = useState("All");

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
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
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
      ...unsignedNotes.map(n => ({ status: 'Unsigned', patient: `${n.patientId?.firstName} ${n.patientId?.lastName}`, date: dayjs(n.createdAt).format('YYYY-MM-DD'), provider: n.providerId?.name || 'Unknown' })),
      ...signedNotes.map(n => ({ status: 'Signed', patient: `${n.patientId?.firstName} ${n.patientId?.lastName}`, date: dayjs(n.createdAt).format('YYYY-MM-DD'), provider: n.providerId?.name || 'Unknown' }))
    ];
    exportToCSV(data, [
      { header: 'Status', key: 'status' },
      { header: 'Patient', key: 'patient' },
      { header: 'Date', key: 'date' },
      { header: 'Provider', key: 'provider' }
    ], 'Progress_Notes');
  };

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
    if (typeof pOrId === 'object' && pOrId.name) return pOrId.name;
    const p = typeof pOrId === 'string' ? providers.find(item => (item._id || item.id) === pOrId) : pOrId;
    if (!p) return typeof pOrId === 'string' ? `Provider #${pOrId}` : "Unknown";
    if (p.name) return p.name;
    const fullName = `${p.firstName || ""} ${p.lastName || ""}`.trim();
    if (fullName) return fullName;
    const userFullName = `${p.userId?.firstName || ""} ${p.userId?.lastName || ""}`.trim();
    if (userFullName) return userFullName;
    return p.providerCode || `Provider #${p._id || p.id}` || "";
  }, [providers]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      sx={{ zIndex: 1500 }}
      PaperProps={{
        sx: { borderRadius: 1, minHeight: '80vh' }
      }}
    >
      <DialogTitle sx={{ height: '73px', boxSizing: 'border-box', p: '0 25px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: `1px solid #e2e8f0` }}>
        <Box sx={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
          <DescriptionIcon sx={{ fontSize: '20px' }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
            Progress Notes
          </Typography>
          <Typography sx={{ fontSize: '13px', color: '#64748b' }}>
            View and manage patient progress notes
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748b' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: '25px', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', overflow: 'hidden', "@media print": { p: 0, '& .no-print': { display: 'none !important' } } }}>
        <style>
          {`
            @media print {
              body * { visibility: hidden; }
              .printable-content, .printable-content * { visibility: visible; }
              .printable-content { position: absolute; left: 0; top: 0; width: 100%; }
            }
          `}
        </style>
        
        <Box className="no-print" sx={{ mt: 2 }}>
          {/* FILTERS */}
        <ProgressNotesFilters 
          dateRange={dateRange}
          setDateRange={setDateRange}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          kind={kind}
          setKind={setKind}
          providerId={providerId}
          setProviderId={setProviderId}
          providers={providers}
          onApply={fetchData}
        />

        {/* ACTIONS */}
        <ProgressNotesActions 
          onRefresh={fetchData}
          onExport={handleExport}
          onPrint={() => window.print()}
        />

        </Box>

        {/* TABLES */}
        <Box className="printable-content" sx={{ flexGrow: 1, overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress /></Box>
          ) : (
            <ProgressNotesTables 
              missingNotes={missingNotes}
              unsignedNotes={unsignedNotes}
              signedNotes={signedNotes}
              expandedNoteIds={expandedNoteIds}
              toggleNoteExpansion={toggleNoteExpansion}
              editingNoteId={editingNoteId}
              editingContent={editingContent}
              setEditingContent={setEditingContent}
              handleEditStart={handleEditStart}
              handleEditCancel={handleEditCancel}
              handleEditSave={handleEditSave}
              handleSignNote={handleSignNote}
              getProviderName={getProviderName}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, flexShrink: 0 }}>
          <Button 
            variant="outlined" 
            size="small"
            onClick={onClose}
            sx={{ 
              color: '#64748b', 
              borderColor: '#cbd5e1', 
              borderRadius: '8px',
              '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f1f5f9' },
              textTransform: 'none',
              px: 2,
              fontWeight: 600
            }}
          >
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressNotesDialog;
