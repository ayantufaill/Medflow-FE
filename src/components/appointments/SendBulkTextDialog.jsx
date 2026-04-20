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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Chip,
  Divider,
  InputAdornment,
  CircularProgress,
  Paper,
  Popover,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { usePatients } from "../../hooks/redux/usePatient";
import { appointmentService } from "../../services/appointment.service";

/**
 * SendBulkTextDialog - Final Optimized Version
 * High-fidelity UI matching user images with compact Filter Popover.
 */
const SendBulkTextDialog = ({ open, onClose, providers = [], selectedDate }) => {
  // ─── Data Source ───────────
  const { patients: reduxPatients, fetch: fetchPatientsRedux, loading: patientsLoading } = usePatients();
  const [appointments, setAppointments] = useState([]);
  const [apptsLoading, setApptsLoading] = useState(false);
  const [selectedPatientIds, setSelectedPatientIds] = useState(new Set());
  
  // ─── Filter & Search State ───────────
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnchor, setFilterAnchor] = useState(null);
  
  // Local filter state for the popover (applied only on 'Apply')
  const [popoverSearchTerm, setPopoverSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState(new Set());
  const [selectedProviderIds, setSelectedProviderIds] = useState(new Set());

  // Final applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    statuses: new Set(),
    providers: new Set(),
  });

  const [message, setMessage] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  const TEXT_TEMPLATES = [
    { 
      id: 1, 
      title: "New Patient Text Welcome", 
      body: "Hello {Patient: Preferred Name}! We are excited to meet you! To ensure a smooth and efficient visit, please register your MyChart account and complete the medical and dental histories. To help you maximize your reserved time with us, this is needed 24 hours prior to your appointment. Please text C to confirm." 
    },
    { 
      id: 2, 
      title: "Existing patient reminder", 
      body: "Hello {Patient: Preferred Name}! We are looking forward to seeing you at your appointment! Again, if you are needing to cancel/change your appointment, we ask that you give us at least 48 hours notice. Please text C to confirm." 
    }
  ];

  // ─── Helper for Robust Provider Name Detection ──────────
  const getProviderName = useCallback((p) => {
    if (!p) return "";
    if (p.name) return p.name;
    const fullName = `${p.firstName || ""} ${p.lastName || ""}`.trim();
    if (fullName) return fullName;
    const userFullName = `${p.userId?.firstName || ""} ${p.userId?.lastName || ""}`.trim();
    if (userFullName) return userFullName;
    return p.providerCode || `Provider #${p._id || p.id}` || "";
  }, []);

  // ─── Provider Map for Name Lookup ──────────
  const providerMap = useMemo(() => {
    const map = new Map();
    providers.forEach(p => map.set(p._id || p.id, getProviderName(p)));
    return map;
  }, [providers, getProviderName]);

  // ─── Data Fetching ───────────
  useEffect(() => {
    if (open) {
      fetchPatientsRedux({ page: 1, limit: 100 });
      loadAppointments();
    }
  }, [open, fetchPatientsRedux]);

  const loadAppointments = async () => {
    setApptsLoading(true);
    try {
      const todayStr = (selectedDate || new Date()).toISOString().split("T")[0];
      const result = await appointmentService.getAllAppointments(1, 200, "", "", "", todayStr, todayStr);
      setAppointments(result?.appointments || []);
    } catch (err) {
      console.error("Failed to fetch schedule data:", err);
    } finally {
      setApptsLoading(false);
    }
  };

  // ─── Merging Logic ───────────
  const displayPatients = useMemo(() => {
    const apptMap = new Map();
    appointments.forEach(a => {
      const id = a.patientId?._id || a.patientId?.id || a.patientId;
      if (id) apptMap.set(id.toString(), a);
    });

    const list = reduxPatients.map(p => {
      const pId = (p._id || p.id)?.toString();
      const appt = pId ? apptMap.get(pId) : null;
      const provId = appt?.providerId?._id || appt?.providerId || null;
      
      return {
        id: pId,
        firstName: p.firstName,
        lastName: p.lastName,
        name: `${p.firstName || ""} ${p.lastName || ""}`.trim() || p.preferredName || "Unknown",
        phone: p.phonePrimary || p.phoneSecondary || "No Phone",
        time: appt?.startTime || null,
        status: appt?.status || null,
        isSAB: appt?.isSAB || false,
        providerId: provId,
        providerName: providerMap.get(provId) || getProviderName(appt?.providerId) || null,
      };
    });

    // Sort: patients with appointments today at the top
    return list.sort((a, b) => {
      if (a.time && !b.time) return -1;
      if (!a.time && b.time) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [reduxPatients, appointments, providerMap, getProviderName]);

  // Initial selection
  useEffect(() => {
    if (open && displayPatients.length > 0 && selectedPatientIds.size === 0) {
      const initial = displayPatients.filter(p => p.time).map(p => p.id);
      if (initial.length > 0) setSelectedPatientIds(new Set(initial));
    }
  }, [open, displayPatients, selectedPatientIds.size]);

  // Filter implementation
  const filteredPatients = useMemo(() => {
    return displayPatients.filter((p) => {
      const query = (searchTerm || appliedFilters.search).toLowerCase();
      if (query && !p.name.toLowerCase().includes(query) && !p.phone.includes(query)) {
        return false;
      }
      if (appliedFilters.statuses.size > 0 && !appliedFilters.statuses.has(p.status?.toLowerCase())) {
        return false;
      }
      if (appliedFilters.providers.size > 0 && !appliedFilters.providers.has(p.providerId)) {
        return false;
      }
      return true;
    });
  }, [displayPatients, searchTerm, appliedFilters]);

  // ─── Badge Logic ───────────
  const getBadgeStyle = (status) => {
    const s = String(status || "").toLowerCase().replace(/_/g, " ");
    if (s.includes("checkout") || s.includes("completed")) return { label: "CHECKEDOUT COMPLETED", bg: "#fff3e0", color: "#e65100" };
    if (s === "arrived") return { label: "ARRIVED", bg: "#fff3e0", color: "#e65100" };
    if (s === "seated" || s === "confirmed" || s === "ready to be seated") return { label: s.toUpperCase(), bg: "#e8f5e9", color: "#2e7d32" };
    if (s === "rescheduled") return { label: "RESCHEDULED", bg: "#f5f5f5", color: "#616161" };
    if (s === "cancelled") return { label: "CANCELLED", bg: "#ffebee", color: "#c62828" };
    return { label: s.toUpperCase(), bg: "#e3f2fd", color: "#1565c0" };
  };

  // ─── Handlers ───────────
  const handleApplyFilters = () => {
    setAppliedFilters({
      search: popoverSearchTerm,
      statuses: new Set(selectedStatuses),
      providers: new Set(selectedProviderIds),
    });
    setFilterAnchor(null);
  };

  const toggleStatus = (s) => {
    const next = new Set(selectedStatuses);
    if (next.has(s)) next.delete(s); else next.add(s);
    setSelectedStatuses(next);
  };

  const toggleProvider = (id) => {
    const next = new Set(selectedProviderIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedProviderIds(next);
  };

  return (
    <Dialog 
      open={open} onClose={onClose} 
      maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: "4px", height: "92vh" }}}
    >
      <DialogTitle sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
         <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#333" }}>Send Bulk Text</Typography>
            <Typography variant="body2" sx={{ color: "#777" }}>Select patients and compose your message.</Typography>
         </Box>
         <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0, display: "flex", overflow: "hidden" }}>
        {/* LIST SECTION */}
        <Box sx={{ width: "48%", display: "flex", flexDirection: "column", borderRight: "1px solid #f0f0f0" }}>
          <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: '1px solid #f9f9f9' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#333' }}>
              Select Patients ({selectedPatientIds.size} selected)
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setSelectedPatientIds(new Set(selectedPatientIds.size === filteredPatients.length ? [] : filteredPatients.map(p => p.id)))}>
                <Checkbox size="small" checked={filteredPatients.length > 0 && selectedPatientIds.size === filteredPatients.length} sx={{ p: 0.5 }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#666' }}>Select All</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', color: '#1a237e' }} onClick={(e) => setFilterAnchor(e.currentTarget)}>
                <FilterIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 700 }}>Filter</Typography>
              </Box>
            </Box>
          </Box>

          <List sx={{ flex: 1, overflow: "auto", py: 0 }}>
            {patientsLoading && reduxPatients.length === 0 ? (
               <Box sx={{ textAlign: 'center', p: 4 }}><CircularProgress size={24} /></Box>
            ) : filteredPatients.map((p) => {
              const style = getBadgeStyle(p.status);
              return (
                <ListItem key={p.id} dense sx={{ py: 1, px: 2, borderBottom: '1px solid #f9f9f9', "&:hover": { bgcolor: '#fcfcfc' } }} onClick={() => { const n = new Set(selectedPatientIds); if(n.has(p.id)) n.delete(p.id); else n.add(p.id); setSelectedPatientIds(n); }}>
                  <ListItemIcon sx={{ minWidth: 32 }}><Checkbox size="small" checked={selectedPatientIds.has(p.id)} /></ListItemIcon>
                  <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>{p.name}</Typography>} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 240, justifyContent: 'flex-end' }}>
                    {p.time && <Typography variant="caption" sx={{ fontWeight: 700, color: '#333', mr: 0.5 }}>{p.time}</Typography>}
                    {p.isSAB && <Box sx={{ color: '#0288d1', fontSize: '9px', fontWeight: 800, bgcolor: '#e1f5fe', px: 0.5, py: 0.2, borderRadius: 0.5 }}>SAB</Box>}
                    {p.status && (
                      <Box sx={{ bgcolor: style.bg, color: style.color, px: 1, py: 0.3, borderRadius: '3px', fontSize: '9px', fontWeight: 800, minWidth: 105, textAlign: 'center' }}>
                        {style.label}
                      </Box>
                    )}
                  </Box>
                </ListItem>
              );
            })}
          </List>
          <Box sx={{ p: 1.5, px: 2, borderTop: '1px solid #f0f0f0' }}>
            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>{selectedPatientIds.size} patients selected</Typography>
          </Box>
        </Box>

        {/* MESSAGE SECTION */}
        <Box sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column", bgcolor: "#fff", borderLeft: '1px solid #f0f0f0', overflow: 'auto' }}>
           <Typography variant="caption" sx={{ color: "#777", mb: 3 }}>Use templates or write a custom message.</Typography>
           <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5 }}>Text Templates</Typography>
           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
             {TEXT_TEMPLATES.map(t => (
               <Paper key={t.id} variant="outlined" onClick={() => { setSelectedTemplateId(t.id); setMessage(t.body); }} sx={{ p: 1.5, cursor: 'pointer', bgcolor: selectedTemplateId === t.id ? '#f5faff' : '#fcfcfc', borderColor: selectedTemplateId === t.id ? '#1976d2' : '#e0e0e0' }}>
                 <Typography variant="body2" sx={{ fontWeight: 700 }}>{t.title}</Typography>
                 <Typography variant="caption" sx={{ color: '#666', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{t.body}</Typography>
               </Paper>
             ))}
           </Box>
           <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Message</Typography>
           <TextField multiline rows={5} fullWidth variant="outlined" value={message} onChange={(e) => setMessage(e.target.value)} sx={{ "& .MuiOutlinedInput-root": { bgcolor: '#f5f5f5', borderRadius: '8px' } }} />
           <Typography variant="caption" sx={{ mt: 1, fontWeight: 700, display: 'block' }}>{1000 - message.length} characters remaining</Typography>
           <Typography variant="caption" sx={{ mt: 0.5, color: '#888', display: 'block', fontStyle: 'italic' }}>
             The system will automatically add the practice name and contact info to the end of your text message.
           </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, px: 3, gap: 2 }}>
        <Button onClick={onClose} sx={{ bgcolor: '#eee', color: '#333', textTransform: 'none', px: 3, '&:hover': { bgcolor: '#e0e0e0' } }}>Cancel</Button>
        <Button 
          variant="contained" disabled={selectedPatientIds.size === 0 || !message.trim()}
          startIcon={<SendIcon sx={{ fontSize: 18 }} />}
          sx={{ textTransform: 'none', px: 4, bgcolor: '#b0bec5', color: '#fff', '&:not(.Mui-disabled)': { bgcolor: '#1a237e' } }}
        >
          Send Text
        </Button>
      </DialogActions>

      {/* COMPACT FILTER POPOVER PIXEL PERFECT */}
      <Popover
        open={Boolean(filterAnchor)} anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        PaperProps={{ sx: { width: 300, borderRadius: '4px', p: 0, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}}
      >
        <Box sx={{ p: 1.2, borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end' }}>
           <FilterIcon sx={{ fontSize: 16, color: '#aaa' }} />
        </Box>
        
        <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: '50vh', overflowY: 'auto' }}>
          {/* Section: BY PATIENT NAME */}
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#999', fontSize: '0.6rem' }}>BY PATIENT NAME</Typography>
            <TextField 
              fullWidth size="small" placeholder="Search For Patient"
              value={popoverSearchTerm} onChange={(e) => setPopoverSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 14, color: '#aaa' }} /></InputAdornment> }}
              sx={{ mt: 0.5, "& .MuiOutlinedInput-root": { borderRadius: '4px', bgcolor: '#fcfcfc', fontSize: '0.75rem' }}}
            />
          </Box>

          {/* Section: BY APPOINTMENT STATUS */}
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#999', fontSize: '0.6rem' }}>BY APPOINTMENT STATUS</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.1, mt: 0.5 }}>
              {["unconfirmed", "preconfirmed", "confirmed", "arrived", "seated", "no show", "checkout incomplete"].map(s => {
                const badge = getBadgeStyle(s);
                return (
                  <Box key={s} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox size="small" checked={selectedStatuses.has(s)} onChange={() => toggleStatus(s)} sx={{ p: 0.4 }} />
                    <Chip 
                      label={s.toUpperCase().replace(/_/g, " ")} size="small" 
                      sx={{ height: 16, fontSize: '0.6rem', fontWeight: 800, bgcolor: badge.bg, color: badge.color, borderRadius: '3px' }} 
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Section: BY PROVIDER */}
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#999', fontSize: '0.6rem' }}>BY PROVIDER</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.1, mt: 0.5 }}>
              {providers.map(p => {
                const pName = getProviderName(p);
                const pId = p._id || p.id;
                return (
                  <Box key={pId} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox size="small" checked={selectedProviderIds.has(pId)} onChange={() => toggleProvider(pId)} sx={{ p: 0.4 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#555', fontSize: '0.75rem' }}>{pName}</Typography>
                  </Box>
                );
              })}
              {providers.length === 0 && (
                 <Typography variant="caption" sx={{ color: '#aaa', fontStyle: 'italic', ml: 1 }}>No providers available</Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 1.5, borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" size="small" onClick={handleApplyFilters}
            sx={{ bgcolor: '#00255c', textTransform: 'none', px: 2, fontSize: '0.75rem', fontWeight: 700, '&:hover': { bgcolor: '#001a40' } }}
          >
            Apply Filters
          </Button>
        </Box>
      </Popover>
    </Dialog>
  );
};

export default SendBulkTextDialog;
