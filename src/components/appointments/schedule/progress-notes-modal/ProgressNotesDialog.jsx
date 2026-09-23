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
import { COLORS } from '../../../../constants/colors';
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

  // Local loading flag: stays true until ALL three concurrent dispatches resolve.
  // We cannot rely on `clinicalLoading` alone because it flips false as soon as
  // the FIRST of the two fetchClinicalNotes calls completes, causing a flash of
  // partial data (appointments appear then vanish when the second batch arrives).
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const _reduxLoading = clinicalLoading || checkoutLoading; // kept to avoid selector removal lint

  const toggleNoteExpansion = (id) => {
    setExpandedNoteIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // fetchData accepts explicit params so it always uses the current filter values,
  // avoiding stale-closure issues regardless of when it is called.
  // It is async so we can await all three dispatches with Promise.all and keep
  // isLocalLoading true for the entire round-trip.
  const fetchData = useCallback(async (
    sd = startDate,
    ed = endDate,
    pid = providerId,
    k = kind,
  ) => {
    const filters = {
      startDate: sd.format("YYYY-MM-DD"),
      endDate: ed.format("YYYY-MM-DD"),
      providerId: pid === "All" ? "" : pid,
      noteType: k === "All" ? "" : k,
    };

    setIsLocalLoading(true);
    try {
      await Promise.all([
        dispatch(fetchClinicalNotes({ page: 1, limit: 100, filters: { ...filters, isSigned: true } })),
        dispatch(fetchClinicalNotes({ page: 1, limit: 100, filters: { ...filters, isSigned: false } })),
        dispatch(fetchCheckoutAppointments({ page: 1, limit: 200, ...filters })),
      ]);
    } finally {
      setIsLocalLoading(false);
    }
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const normalizeNote = (note) => {
    if (!note) return note;
    const patientId = typeof note.patientId === 'object' && note.patientId !== null
      ? note.patientId
      : { _id: note.patientId || null, firstName: note.patientFirstName || note.patientName?.firstName || '', lastName: note.patientLastName || note.patientName?.lastName || '' };
    const providerId = typeof note.providerId === 'object' && note.providerId !== null
      ? note.providerId
      : { _id: note.providerId || null, firstName: '', lastName: '', name: note.providerName || 'Unknown Provider' };

    // Build a human-readable content string from SOAP/narrative fields since
    // the backend stores note body across chiefComplaint/subjective/objective/assessment/plan.
    const parts = [
      note.chiefComplaint ? `Chief Complaint: ${note.chiefComplaint}` : null,
      note.subjective     ? `Subjective: ${note.subjective}`         : null,
      note.objective      ? `Objective: ${note.objective}`           : null,
      note.assessment     ? `Assessment: ${note.assessment}`         : null,
      note.plan           ? `Plan: ${note.plan}`                     : null,
    ].filter(Boolean);
    const content = note.content || (parts.length ? parts.join('\n\n') : '');

    return {
      ...note,
      patientId,
      providerId,
      content,
      noteType: note.noteType || 'Treatment',
    };
  };

  const [signedNotes, setSignedNotes] = useState([]);
  const [unsignedNotes, setUnsignedNotes] = useState([]);

  useEffect(() => {
    setSignedNotes((signedData || []).map(normalizeNote));
  }, [signedData]);

  useEffect(() => {
    setUnsignedNotes((unsignedData || []).map(normalizeNote));
  }, [unsignedData]);

  const missingNotes = useMemo(() => {
    const allFetchedNotes = [...signedNotes, ...unsignedNotes];
    const missing = [];
    const appointments = checkoutAppointments || [];

    // Extract a comparable ID string from a value that may be an object or a raw string.
    const extractId = (val) => {
      if (!val) return null;
      if (typeof val === 'object') return String(val._id || val.id || '');
      return String(val);
    };

    appointments.forEach(appt => {
      const ptId = extractId(appt.patientId);
      if (!ptId) return;

      const aptId = String(appt._id || appt.id || '');
      const apptDay = appt.appointmentDate
        ? String(appt.appointmentDate).slice(0, 10)
        : null;

      // Two-tier match — an appointment is considered "covered" if:
      //  1. A note explicitly references it via appointmentId (most precise), OR
      //  2. A note from the same patient was created on the same calendar day
      //     (handles notes written without an appointmentId link).
      // Deliberately NOT matching by patient ID alone: a note from a prior
      // visit by the same patient must not hide today's uncovered appointment.
      const hasNote = allFetchedNotes.some(n => {
        // Tier 1: explicit appointmentId link
        const noteAptId = String(n.appointmentId || '');
        if (noteAptId && aptId && noteAptId === aptId) return true;

        // Tier 2: same patient, same calendar day
        const notePatId = extractId(n.patientId);
        if (!notePatId || notePatId !== ptId) return false;
        const noteDay = n.createdAt
          ? dayjs(n.createdAt).format('YYYY-MM-DD')
          : null;
        return !!(apptDay && noteDay && apptDay === noteDay);
      });

      if (!hasNote) {
        const patientObj = typeof appt.patientId === 'object' ? appt.patientId : null;

        const apptProviderName = appt.providerId?.firstName
          ? `${appt.providerId.firstName} ${appt.providerId.lastName || ''}`.trim()
          : (appt.providerId?.name || "Unknown Provider");

        const procProviderName = (pid) => {
          if (!pid) return null;
          const match = providers.find(item => String(item._id || item.id) === String(pid));
          if (!match) return null;
          if (match.name) return match.name;
          const fullName = `${match.firstName || ""} ${match.lastName || ""}`.trim();
          if (fullName) return fullName;
          return match.providerCode || `Provider #${match._id || match.id}`;
        };

        const procedures = (appt.customFields?.procedures || []).filter(p => p.completed === true);

        procedures.forEach((p, idx) => {
          const procProviderNameResolved = procProviderName(p.provider);
          const rowProviderName = procProviderNameResolved
            || (p.provider ? `Provider #${p.provider}` : null)
            || apptProviderName;

          let toothVal = p.tooth || p.toothNum || p.toothNumber || appt.toothNumber || null;
          let surfaceVal = p.surface || (Array.isArray(p.surfaces) ? p.surfaces.join(', ') : p.surfaces) || appt.surface || null;

          const rawSite = (p.site || '').trim();
          if (rawSite && (!toothVal || !surfaceVal)) {
            const entries = rawSite.split(',').map(e => e.replace('#', '').trim()).filter(Boolean);
            const teeth = [];
            const surfaces = [];
            let surfaceOnly = null;
            for (const entry of entries) {
              const parts = entry.split(' ').filter(Boolean);
              if (parts.length >= 2) {
                if (toothVal === null) teeth.push(parts[0]);
                if (surfaceVal === null) surfaces.push(parts.slice(1).join(''));
              } else if (parts.length === 1) {
                if (toothVal === null) teeth.push(parts[0]);
                else if (surfaceVal === null) surfaceOnly = parts[0];
              }
            }
            if (rawSite.startsWith('#') && toothVal === null && entries.length === 1) {
              toothVal = entries[0].split(' ')[0];
            }
            if (teeth.length) toothVal = [...new Set(teeth)].join(', ');
            if (surfaces.length) surfaceVal = [...new Set(surfaces)].join(', ');
            else if (surfaceOnly && surfaceVal === null) surfaceVal = surfaceOnly;
          }

          missing.push({
            _id: `m-${appt._id || appt.id}-${idx}`,
            patientName: appt.patientName
              || (patientObj ? `${patientObj.firstName || ''} ${patientObj.lastName || ''}`.trim() : '')
              || 'Unknown Patient',
            appointmentDate: appt.appointmentDate || appt.date || null,
            providerName: rowProviderName,
            providerId: procProviderNameResolved ? p.provider : (appt.providerId || null),
            time: appt.startTime || "Unknown Time",
            toothNumber: toothVal,
            surface: surfaceVal,
            code: p.code || null,
          });
        });
      }
    });

    return missing;
  }, [signedNotes, unsignedNotes, checkoutAppointments, providers]);

  const handleExport = () => {
    const data = [
      ...missingNotes.map(n => ({ status: 'Missing', patient: n.patientName, date: String(n.appointmentDate).slice(0, 10), provider: n.providerName || `${n.providerId?.firstName || ''} ${n.providerId?.lastName || ''}`.trim() || 'Unknown' })),
      ...unsignedNotes.map(n => ({ status: 'Unsigned', patient: `${n.patientId?.firstName} ${n.patientId?.lastName}`, date: dayjs(n.createdAt).format('YYYY-MM-DD'), provider: n.providerId?.firstName || 'Unknown' })),
      ...signedNotes.map(n => ({ status: 'Signed', patient: `${n.patientId?.firstName} ${n.patientId?.lastName}`, date: dayjs(n.createdAt).format('YYYY-MM-DD'), provider: n.providerId?.firstName || 'Unknown' }))
    ];
    exportToCSV(data, [
      { header: 'Status', key: 'status' },
      { header: 'Patient', key: 'patient' },
      { header: 'Date', key: 'date' },
      { header: 'Provider', key: 'provider' }
    ], 'Progress_Notes');
  };
  useEffect(() => {
    if (open) {
      // Reset filters to defaults and immediately fetch with those exact values.
      // We pass the default values directly into fetchData so there is no
      // dependency on React state (which may not have flushed yet).
      const defaultStart = dayjs();
      const defaultEnd   = dayjs();
      setDateRange('Today');
      setStartDate(defaultStart);
      setEndDate(defaultEnd);
      setKind("All");
      setProviderId("All");
      fetchData(defaultStart, defaultEnd, "All", "All");
    } else {
      setDateRange('Today');
      setStartDate(dayjs());
      setEndDate(dayjs());
      setKind("All");
      setProviderId("All");
      setExpandedNoteIds(new Set());
      setEditingNoteId(null);
      setEditingContent("");
    }
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
        sx: { 
          borderRadius: "12px", 
          border: '1px solid #e0e5eb',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
          minHeight: '80vh' 
        }
      }}
    >
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <DialogTitle
        sx={{
          display: "flex", alignItems: "center", gap: "12px",
          px: "10px", py: "10px",
          borderBottom: "1px solid #e0e5eb", flexShrink: 0,
          backgroundColor: "#f3f8fd",
          m: 0,
        }}
      >
        <Box sx={{
          width: "36px", height: "36px", borderRadius: "8px",
          backgroundColor: "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <DescriptionIcon sx={{ fontSize: "20px", color: "#2262ef" }} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
          <Typography sx={{
            display: "flex", flexDirection: "column", justifyContent: "flex-start",
            alignItems: "flex-start", height: "24px", padding: "0px",
            fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            Progress Notes
          </Typography>
        </Box>

        <IconButton onClick={onClose} size="small" sx={{ color: "#6b7280", ml: 1 }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: '25px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', overflow: 'hidden', "@media print": { p: 0, '& .no-print': { display: 'none !important' } } }}>
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
          onApply={() => fetchData(startDate, endDate, providerId, kind)}
        />

        {/* ACTIONS */}
        <ProgressNotesActions 
          onRefresh={fetchData}
          onExport={handleExport}
          onPrint={() => window.print()}
        />

        </Box>

        {/* TABLES */}
        <Box className="printable-content" sx={{ flexGrow: 1, overflow: 'auto', mb: "25px" }}>
          {isLocalLoading ? (
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

        <Box sx={{ p: "12px 24px", borderTop: '1px solid #e0e5eb', backgroundColor: '#fff', display: 'flex', justifyContent: 'flex-end', mt: 'auto', mx: '-25px', mb: '-25px', flexShrink: 0 }}>
          <Button 
            variant="outlined" 
            size="small"
            onClick={onClose}
            sx={{ 
              borderColor: "#d0d5dd",
              color: "#374151",
              fontFamily: "Inter",
              "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
              textTransform: "none",
              borderRadius: "8px",
              px: "16px", py: "7px",
              height: 36,
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressNotesDialog;
