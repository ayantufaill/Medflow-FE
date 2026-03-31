import React, { useState, useRef } from 'react';
import { 
  Box, Typography, Button, IconButton, Paper, RadioGroup, 
  FormControlLabel, FormControl, InputLabel, Radio, TextField, Select, MenuItem, 
  Table, TableBody, TableCell, TableHead, TableRow, Checkbox, Chip, Avatar, Dialog,
  Popover, Grid, Autocomplete
} from '@mui/material';
import { 
  DeleteOutline, MailOutline, ChatBubbleOutline, 
  Settings, Science, Mic, MoreVert, Close, InfoOutlined, CheckCircle,
  Close as CloseIcon
} from '@mui/icons-material';
import LabOrder from './LabOrder';

const FONT_SM = { fontSize: "11px" };
const FONT_XS = { fontSize: "10px" };

const AppointmentPage = ({ patient, open, onClose, onSave }) => {
  // Mock data for the procedure icons shown in your screenshot
  const procedureIcons = [
    { label: "New", color: "#81ecec" }, { label: "Scr", color: "#ff7675" },
    { label: "FULL", color: "#ffeaa7" }, { label: "Pano", color: "#636e72", font: "white" },
    { label: "FMX", color: "#2d3436", font: "white" }, { label: "Xray", color: "#636e72", font: "white" },
    { label: "AdX", color: "#b2bec3" }, { label: "SCN", color: "#55efc4" },
    { label: "Con", color: "#81ecec" }, { label: "Vir", color: "#00b894", font: "white" }
  ];

  // Default procedure added to the table when each tag chip is selected
  const TAG_DEFAULT_PROCEDURES = {
    New:  { code: "D0150", treatment: "Comprehensive Evaluation",         charge: "$85.00"  },
    Scr:  { code: "D4341", treatment: "Periodontal Scaling & Root Planing", charge: "$220.00" },
    FULL: { code: "D2391", treatment: "Resin Composite – One Surface",     charge: "$185.00" },
    Pano: { code: "D0330", treatment: "Panoramic Radiographic Image",      charge: "$120.00" },
    FMX:  { code: "D0210", treatment: "Complete Series of Radiographs",    charge: "$150.00" },
    Xray: { code: "D0220", treatment: "Periapical First Image",            charge: "$30.00"  },
    AdX:  { code: "D0230", treatment: "Periapical Each Additional Image",  charge: "$25.00"  },
    SCN:  { code: "D1110", treatment: "Prophy",                            charge: "$120.00" },
    Con:  { code: "D0120", treatment: "Periodic Oral Evaluation",          charge: "$55.00"  },
    Vir:  { code: "D9310", treatment: "Consultation – Diagnostic Service", charge: "$95.00"  },
  };

  // State management
  const [visitType, setVisitType] = useState('recare');
  const [appointmentStatus, setAppointmentStatus] = useState('checked out complete');
  const [durationMins, setDurationMins] = useState(60);
  const [providerTimes, setProviderTimes] = useState([
    { provider: 'Dr. Masterson', mins: 60 }
  ]);
  const [preferredDentist, setPreferredDentist] = useState('');
  const [preferredHygienist, setPreferredHygienist] = useState('');
  const [referredBy, setReferredBy] = useState('Google reviews.');
  const [notes, setNotes] = useState('- Cash pay, no insurance.');
  const [sendReminders, setSendReminders] = useState(false);
  const [operatory, setOperatory] = useState('Operatory 2');
  const [labOrderOpen, setLabOrderOpen] = useState(false);
  const [tagsAnchorEl, setTagsAnchorEl] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [completedProcedures, setCompletedProcedures] = useState([true]); // Track completion status of each procedure
  const [isCheckedOut, setIsCheckedOut] = useState(true);
  
  // Procedure tags state
  const [selectedTagLabels, setSelectedTagLabels] = useState(new Set());
  const [tagProcedureIds, setTagProcedureIds] = useState({});
  const [procedures, setProcedures] = useState([
    { id: 1, code: "D4910", treatment: "Maintenance", tag: null, provider: "Dr. Masterson", charge: "$257.00", checked: true }
  ]);
  const nextProcedureId = useRef(2);
  
  // "Add Procedure" autocomplete state
  const [addingProcedure, setAddingProcedure] = useState(false);
  const [procedureInputValue, setProcedureInputValue] = useState("");
  
  // Dummy searchable procedure catalog for the "Add Procedure" autocomplete
  const DUMMY_PROCEDURE_OPTIONS = [
    { code: "D0120", treatment: "Periodic Oral Evaluation",           tag: { label: "Con",  color: "#81ecec" },                charge: "$55.00"  },
    { code: "D0140", treatment: "Limited Oral Evaluation",            tag: { label: "Con",  color: "#81ecec" },                charge: "$75.00"  },
    { code: "D0210", treatment: "Complete Series of Radiographs",     tag: { label: "FMX",  color: "#2d3436", font: "white" }, charge: "$150.00" },
    { code: "D0220", treatment: "Periapical First Image",             tag: { label: "Xray", color: "#636e72", font: "white" }, charge: "$30.00"  },
    { code: "D0230", treatment: "Periapical Each Additional Image",   tag: { label: "Xray", color: "#636e72", font: "white" }, charge: "$25.00"  },
    { code: "D0330", treatment: "Panoramic Radiographic Image",       tag: { label: "Pano", color: "#636e72", font: "white" }, charge: "$120.00" },
    { code: "D1120", treatment: "Child Prophylaxis",                  tag: { label: "SCN",  color: "#55efc4" },                charge: "$85.00"  },
    { code: "D2140", treatment: "Amalgam – One Surface Primary",      tag: { label: "FULL", color: "#ffeaa7" },                charge: "$145.00" },
    { code: "D2391", treatment: "Resin Composite – One Surface",      tag: { label: "FULL", color: "#ffeaa7" },                charge: "$185.00" },
    { code: "D4341", treatment: "Periodontal Scaling & Root Planing", tag: { label: "Scr",  color: "#ff7675" },                charge: "$220.00" },
    { code: "D7140", treatment: "Extraction – Erupted Tooth",         tag: { label: "New",  color: "#81ecec" },                charge: "$175.00" },
    { code: "D9310", treatment: "Consultation – Diagnostic Service",  tag: { label: "Vir",  color: "#00b894", font: "white" }, charge: "$95.00"  },
  ];

  const handleTagsClick = (event) => {
    setTagsAnchorEl(event.currentTarget);
  };

  const handleTagsClose = () => {
    setTagsAnchorEl(null);
  };

  const openTags = Boolean(tagsAnchorEl);

  const handleCompleteAll = () => {
    // Mark all procedures as completed
    setCompletedProcedures(completedProcedures.map(() => true));
  };

  // ── Procedure tag handlers ────────────────────────────────────────────────

  // Toggle a tag: selecting adds its default procedure to the table; deselecting removes it
  const handleTagClick = (label) => {
    const isSelected = selectedTagLabels.has(label);

    if (isSelected) {
      // Deselect — remove the procedure row that was added by this tag
      setSelectedTagLabels((prev) => { const n = new Set(prev); n.delete(label); return n; });
      const procId = tagProcedureIds[label];
      if (procId != null) {
        setProcedures((prev) => prev.filter((p) => p.id !== procId));
        setTagProcedureIds((prev) => { const { [label]: _, ...rest } = prev; return rest; });
      }
    } else {
      // Select — add the tag's default procedure to the table
      setSelectedTagLabels((prev) => new Set([...prev, label]));
      const template = TAG_DEFAULT_PROCEDURES[label];
      const tagInfo  = procedureIcons.find((t) => t.label === label);
      if (template && tagInfo) {
        const newId = nextProcedureId.current++;
        setProcedures((prev) => [
          ...prev,
          {
            id: newId,
            code: template.code,
            treatment: template.treatment,
            tag: { label: tagInfo.label, color: tagInfo.color, font: tagInfo.font },
            provider: "",
            charge: template.charge,
            checked: true,
          },
        ]);
        setTagProcedureIds((prev) => ({ ...prev, [label]: newId }));
      }
    }
  };

  // Add a procedure from the autocomplete search to the scheduled procedures table
  const handleSelectProcedure = (option) => {
    if (!option) return;
    setProcedures((prev) => [
      ...prev,
      {
        id: nextProcedureId.current++,
        code: option.code,
        treatment: option.treatment,
        tag: option.tag,
        provider: "",
        charge: option.charge,
        checked: true,
      },
    ]);
    setProcedureInputValue("");
    setAddingProcedure(false);
  };

  // Tag Data matching screenshot colors/labels
  const availableTags = [
    { icon: "🎁", bg: "#fff7ed", border: "#ffedd5" },
    { icon: "📥", bg: "#fff7ed", border: "#ffedd5" },
    { icon: "📤", bg: "#fff7ed", border: "#ffedd5" },
    { icon: "🔔", bg: "#fef2f2", border: "#fee2e2" },
    { label: "S", bg: "#fef2f2", border: "#fee2e2", color: "#ef4444" },
    { icon: "🧬", bg: "#f0f9ff", border: "#e0f2fe" },
    { label: "✳️", bg: "#f0fdf4", border: "#dcfce7" },
    { icon: "🗂️", bg: "#fff7ed", border: "#ffedd5" },
    { label: "ASAP", bg: "#f0f9ff", border: "#e0f2fe", color: "#0ea5e9" },
    { label: "$", bg: "#f0fdf4", border: "#dcfce7", color: "#22c55e" },
    { icon: "🪪", bg: "#f5f3ff", border: "#ede9fe" },
    { label: "DR", bg: "#fdf2f8", border: "#fce7f3", color: "#ec4899" },
    { icon: "👥", bg: "#fdf2f8", border: "#fce7f3" },
    { label: "HYG", bg: "#f0fdf4", border: "#dcfce7", color: "#166534" },
    { icon: "💳", bg: "#fef2f2", border: "#fee2e2" },
    { label: "PRE", bg: "#fef2f2", border: "#fee2e2", color: "#991b1b" },
    { icon: "📘", bg: "#eff6ff", border: "#dbeafe" },
    { label: "Tx", bg: "#fffbeb", border: "#fef3c7", color: "#d97706" },
    { label: "VER", bg: "#f0fdf4", border: "#dcfce7", color: "#22c55e" },
    { icon: "📧", bg: "#f0f9ff", border: "#e0f2fe" },
    { icon: "📩", bg: "#f0fdf4", border: "#dcfce7" },
    { icon: "💉", bg: "#fdf2f8", border: "#fce7f3" },
    { icon: "💊", bg: "#fff7ed", border: "#ffedd5" },
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: 'none',
          maxHeight: '90vh',
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ bgcolor: 'white', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', height: '100%', overflow: 'hidden' }}>
        
        {/* 1. Top Blue Header Bar */}
        <Box sx={{ 
          bgcolor: '#4a6da7', color: 'white', p: 0.8, 
          display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '13px',
          position: 'relative'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, justifyContent: 'center' }}>
            <Typography sx={{ fontWeight: 500, fontSize: '14px' }}>
              {patient ? `${patient.firstName} ${patient.lastName}` : 'Tony Mastutus'}, Recare Appointment on 03/04/2026 @ 08:15 AM
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Button variant="contained" 
                sx={{ bgcolor: '#d4a373', textTransform: 'none', fontSize: '11px', py: 0, height: 22, px: 1, boxShadow: 'none' }}>
                Re-schedule
              </Button>
              <Button variant="contained" 
                sx={{ bgcolor: '#d4a373', textTransform: 'none', fontSize: '11px', py: 0, height: 22, px: 1, boxShadow: 'none' }}>
                Move to shortlist
              </Button>
              <Button variant="contained" 
                sx={{ bgcolor: '#d4a373', textTransform: 'none', fontSize: '11px', py: 0, height: 22, px: 1, boxShadow: 'none' }}>
                Copy to shortlist
              </Button>
            </Box>
          </Box>
          <Select size="small" value={operatory} onChange={(e) => setOperatory(e.target.value)}
            sx={{ bgcolor: 'white', height: 24, fontSize: '12px', borderRadius: 1, '& .MuiSelect-select': { py: 0, px: 1 } }}>
            <MenuItem value="Operatory 1">Operatory 1</MenuItem>
            <MenuItem value="Operatory 2">Operatory 2</MenuItem>
            <MenuItem value="Operatory 3">Operatory 3</MenuItem>
            <MenuItem value="Hyg 1">Hyg 1</MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden', minHeight: 0 }}>
          {/* LEFT PANEL: Procedure Entry */}
          <Box sx={{ flexGrow: 1, p: 2, borderRight: '1px solid #cbd5e1', overflowY: 'auto', minHeight: 0 }}>
            
            {/* Visit Type Row */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Typography sx={{ fontSize: '12px', mr: 2, fontWeight: 600, color: '#4a6da7' }}>Type of visit:</Typography>
              <RadioGroup row value={visitType} onChange={(e) => setVisitType(e.target.value)}>
                <FormControlLabel value="treatment" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography sx={{fontSize: '12px'}}>Treatment</Typography>} />
                <FormControlLabel value="recare" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography sx={{fontSize: '12px'}}>Recare</Typography>} />
              </RadioGroup>
            </Box>

            {/* Procedure Icons Grid */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3, alignItems: 'center' }}>
               {/* Dynamic Icons from your screenshot */}
               <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {procedureIcons.map((item, idx) => {
                    const isSelected = selectedTagLabels.has(item.label);
                    return (
                      <Chip 
                        key={idx} 
                        label={item.label} 
                        onClick={() => handleTagClick(item.label)}
                        sx={{ 
                          bgcolor: item.color, 
                          color: item.font || 'black', 
                          borderRadius: '4px', 
                          height: 22, 
                          fontSize: '10px', 
                          fontWeight: 700,
                          cursor: 'pointer',
                          // Highlight selected tags with a dark border + slight shadow
                          border: isSelected ? "2px solid #1e293b" : "2px solid transparent",
                          boxShadow: isSelected ? "0 0 0 2px rgba(30,41,59,0.25)" : "none",
                          transition: "border 0.1s, box-shadow 0.1s",
                          "&:hover": { opacity: 0.85 },
                        }} 
                      />
                    );
                  })}

                  {/* Inline "Add Procedure" autocomplete */}
                  {addingProcedure ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Autocomplete
                        autoFocus
                        open={procedureInputValue.length > 0}
                        options={DUMMY_PROCEDURE_OPTIONS}
                        getOptionLabel={(o) => `${o.code} – ${o.treatment}`}
                        inputValue={procedureInputValue}
                        onInputChange={(_, val) => setProcedureInputValue(val)}
                        onChange={(_, val) => handleSelectProcedure(val)}
                        filterOptions={(opts, { inputValue }) => {
                          const q = inputValue.toLowerCase();
                          return opts.filter(
                            (o) =>
                              o.code.toLowerCase().includes(q) ||
                              o.treatment.toLowerCase().includes(q),
                          );
                        }}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            key={option.code}
                            sx={{ display: "flex", alignItems: "center", gap: 1, py: "4px !important" }}
                          >
                            <Chip
                              label={option.tag.label}
                              size="small"
                              sx={{
                                bgcolor: option.tag.color,
                                color: option.tag.font || "black",
                                fontSize: "9px",
                                height: 18,
                                borderRadius: "3px",
                                fontWeight: 700,
                              }}
                            />
                            <Typography sx={{ fontSize: "11px", fontWeight: 600 }}>
                              {option.code}
                            </Typography>
                            <Typography sx={{ fontSize: "11px", color: "#475569" }}>
                              {option.treatment}
                            </Typography>
                            <Typography sx={{ fontSize: "11px", color: "#94a3b8", ml: "auto" }}>
                              {option.charge}
                            </Typography>
                          </Box>
                        )}
                        sx={{ width: 280 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            autoFocus
                            placeholder="Search by code or name…"
                            onKeyDown={(e) => {
                              if (e.key === "Escape") {
                                setProcedureInputValue("");
                                setAddingProcedure(false);
                              }
                            }}
                            sx={{ "& .MuiInputBase-input": { fontSize: "11px", py: "4px !important" } }}
                          />
                        )}
                      />
                      <IconButton
                        size="small"
                        onClick={() => { setProcedureInputValue(""); setAddingProcedure(false); }}
                        sx={{ p: 0.25 }}
                      >
                        <CloseIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                      </IconButton>
                    </Box>
                  ) : (
                    <Typography
                      onClick={() => setAddingProcedure(true)}
                      sx={{
                        color: '#64748b',
                        fontSize: '12px',
                        ml: 1,
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline', color: '#1976d2' },
                      }}
                    >
                      +Add Procedure
                    </Typography>
                  )}
               </Box>
            </Box>

            {/* Table Header Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#4a6da7' }}>
                Scheduled Procedures: <span style={{ fontWeight: 400, color: '#64748b', fontSize: '12px' }}>(show all procedures)</span>
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button sx={{ bgcolor: '#e74c3c', color: 'white', textTransform: 'none', fontSize: '11px', height: 28, px: 2 }}>Compute next visit</Button>
                <Button sx={{ bgcolor: '#d4a373', color: 'white', textTransform: 'none', fontSize: '11px', height: 28, px: 2 }}>Re-estimate</Button>
              </Box>
            </Box>

            {/* The Procedure Table */}
            <Table size="small" sx={{ border: '1px solid #e2e8f0' }}>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ borderBottom: '2px solid #cbd5e1' }}>
                    <Checkbox 
                      size="small" 
                      checked={completedProcedures.every(p => p === true)}
                      indeterminate={completedProcedures.some(p => p === true) && !completedProcedures.every(p => p === true)}
                      onChange={(e) => {
                        const allCompleted = e.target.checked;
                        setCompletedProcedures(completedProcedures.map(() => allCompleted));
                      }}
                    />
                  </TableCell>
                  {['Procedure', 'Site', 'Treatment', 'Provider', 'Pt Part', 'Total Charge'].map(head => (
                    <TableCell key={head} sx={{ fontSize: '11px', fontWeight: 700, color: '#475569', borderBottom: '2px solid #cbd5e1' }}>{head}</TableCell>
                  ))}
                  <TableCell sx={{ borderBottom: '2px solid #cbd5e1' }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {procedures.map((row) => (
                  <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#f1f5f9' } }}>
                    <TableCell padding="checkbox">
                      <Checkbox 
                        size="small" 
                        checked={row.checked || false}
                        onChange={(e) => {
                          const newProcedures = [...procedures];
                          const index = procedures.findIndex(p => p.id === row.id);
                          if (index !== -1) {
                            newProcedures[index].checked = e.target.checked;
                            setProcedures(newProcedures);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '12px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        {row.tag && (
                          <Chip
                            label={row.tag.label}
                            size="small"
                            sx={{
                              bgcolor: row.tag.color,
                              color: row.tag.font || 'black',
                              fontSize: '9px',
                              height: 18,
                              borderRadius: '3px',
                              fontWeight: 700,
                            }}
                          />
                        )}
                        {row.code}
                      </Box>
                    </TableCell>
                    <TableCell />
                    <TableCell>
                      <Select size="small" value={row.treatment} sx={{ height: 26, fontSize: '11px', width: 140, bgcolor: 'white' }}>
                        <MenuItem value={row.treatment}>{row.treatment}</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select size="small" value={row.provider || ''} sx={{ height: 26, fontSize: '11px', minWidth: 120, bgcolor: 'white' }}>
                        <MenuItem value="">— Select —</MenuItem>
                        <MenuItem value="Dr. Masterson">Dr. Masterson</MenuItem>
                        <MenuItem value="Dr. Kim">Dr. Kim</MenuItem>
                        <MenuItem value="Hygienist Kim">Hygienist Kim</MenuItem>
                        <MenuItem value="Hygienist Sarah">Hygienist Sarah</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell sx={{ fontSize: '12px' }}>{row.charge}</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 600 }}>{row.charge}</TableCell>
                    <TableCell sx={{ width: 80 }}>
                      <Box sx={{ display: 'flex', gap: 3, color: '#94a3b8' }}>
                        <CheckCircle sx={{ fontSize: 18, color: row.checked ? '#22c55e' : '#94a3b8', mr: 1 }} />
                        <Settings sx={{ fontSize: 18, cursor: 'pointer' }} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Total Row */}
                <TableRow>
                  <TableCell colSpan={6} align="right" sx={{ fontSize: '12px', fontWeight: 700, py: 0.5 }}>
                    $
                    {procedures
                      .reduce(
                        (sum, p) => sum + parseFloat(p.charge?.replace('$', '') || '0'),
                        0,
                      )
                      .toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ fontSize: '12px', fontWeight: 700, py: 0.5 }}>
                    $
                    {procedures
                      .reduce(
                        (sum, p) => sum + parseFloat(p.charge?.replace('$', '') || '0'),
                        0,
                      )
                      .toFixed(2)}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>

            {/* Action Footer */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mt: 2, gap: 1 }}>
               <Button 
                 variant="contained" 
                 sx={{ bgcolor: '#4a6da7', textTransform: 'none', fontSize: '10px', px: 3 }}
                 onClick={handleCompleteAll}
               >
                 Complete All
               </Button>
               <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel 
                    control={
                      <Checkbox 
                        size="small" 
                        checked={isCheckedOut}
                        onChange={(e) => setIsCheckedOut(e.target.checked)}
                      />
                    } 
                    label={<Typography sx={{fontSize: '12px', color: '#475569'}}>check out appointment</Typography>} 
                  />
                  <Button sx={{ bgcolor: '#d4a373', color: 'white', textTransform: 'none', ml: 1, fontSize: '12px', px: 2 }}>Collect Payments</Button>
               </Box>
            </Box>
            <Button
              sx={{
                color: '#1976d2',
                textTransform: 'none',
                fontSize: '11px',
                p: 0,
                minHeight: 0,
                mb: 2,
              }}
            >
              + add procedures from another visit
            </Button>
          </Box>
          

          {/* RIGHT PANEL: Appointment Details */}
          <Box sx={{ width: 340, p: 1.5, bgcolor: '#fdfdfd', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#475569', mb: 0.5 }}>Appointment Status</Typography>
              <FormControl size="small" fullWidth>
                <Select 
                  value={appointmentStatus} 
                  onChange={(e) => setAppointmentStatus(e.target.value)}
                  sx={{ fontSize: '11px', height: 30 }}
                >
                  <MenuItem value="unconfirmed">Unconfirmed</MenuItem>
                  <MenuItem value="preconfirmed">Preconfirmed</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="seated">Seated</MenuItem>
                  <MenuItem value="call">Call</MenuItem>
                  <MenuItem value="checkout incomplete">Checkout Incomplete</MenuItem>
                  <MenuItem value="checked out complete">Checked out complete</MenuItem>
                  <MenuItem value="no show">No Show</MenuItem>
                  <MenuItem value="rescheduled">Rescheduled</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography sx={{ ...FONT_XS, color: "#475569", mb: 0.5 }}>
                Appt Duration:
              </Typography>
              <TextField
                type="number"
                size="small"
                value={durationMins}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setDurationMins("");
                  } else {
                    setDurationMins(Number(value) || 0);
                  }
                }}
                onBlur={(e) => {
                  const value = Number(e.target.value);
                  if (!value || value < 5) {
                    setDurationMins(5);
                  }
                }}
                sx={{ "& .MuiInputBase-input": FONT_XS }}
                inputProps={{ min: 5, step: 5 }}
              />
              <Typography
                component="span"
                sx={{ ...FONT_XS, ml: 0.5, color: "#64748b" }}
              >
                mins
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#4a6da7', mb: 0.5 }}>Provider/Assistant Times:</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', pb: 0.3, mb: 0.5 }}>
                  <Typography sx={{ fontSize: '10px', color: '#64748b' }}>Provider</Typography>
                  <Typography sx={{ fontSize: '10px', color: '#64748b' }}>Time</Typography>
              </Box>
              {providerTimes.map((row, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  <Select size="small" value={row.provider} sx={{ height: 28, flexGrow: 1, fontSize: '11px' }}>
                    <MenuItem value="Dr. Masterson">Dr. Masterson</MenuItem>
                    <MenuItem value="Dr. Kim">Dr. Kim</MenuItem>
                    <MenuItem value="Hygienist Kim">Hygienist Kim</MenuItem>
                  </Select>
                  <Typography sx={{ fontSize: '10px', color: '#64748b' }}>{row.mins}m</Typography>
                  <DeleteOutline sx={{ color: '#ff7675', fontSize: 16, cursor: 'pointer' }} onClick={() => {
                    const newTimes = [...providerTimes];
                    newTimes.splice(index, 1);
                    setProviderTimes(newTimes);
                  }} />
                </Box>
              ))}
              <Button 
                size="small" 
                onClick={() => setProviderTimes([...providerTimes, { provider: '', mins: 60 }])}
                sx={{ fontSize: '10px', color: '#4a6da7', textTransform: 'none', p: 0, minHeight: 0 }}
              >
                + Add Provider/Assistant
              </Button>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '11px', color: '#475569', mb: 0.3 }}>
                Patient's Preferred Dentist:
              </Typography>
              <FormControl size="small" fullWidth>
                <Select 
                  value={preferredDentist}
                  onChange={(e) => setPreferredDentist(e.target.value)}
                  sx={{ fontSize: '11px', height: 30 }}
                >
                  <MenuItem value=""><em>Select</em></MenuItem>
                  <MenuItem value="Dr. Masterson">Dr. Masterson</MenuItem>
                  <MenuItem value="Dr. Kim">Dr. Kim</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '11px', color: '#475569', mb: 0.3 }}>
                Patient's Preferred Hygienist:
              </Typography>
              <FormControl size="small" fullWidth>
                <Select 
                  value={preferredHygienist}
                  onChange={(e) => setPreferredHygienist(e.target.value)}
                  sx={{ fontSize: '11px', height: 30 }}
                >
                  <MenuItem value=""><em>Select</em></MenuItem>
                  <MenuItem value="Hygienist Kim">Hygienist Kim</MenuItem>
                  <MenuItem value="Hygienist Sarah">Hygienist Sarah</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '11px', color: '#4a6da7' }}>Referred By:</Typography>
              <TextField 
                size="small" 
                fullWidth
                value={referredBy}
                onChange={(e) => setReferredBy(e.target.value)}
                sx={{ '& .MuiInputBase-input': { fontSize: '11px' }, mt: 0.3 }} 
              />
              <Typography sx={{ fontSize: '11px', color: '#4a6da7', mt: 0.5 }}>Notes <span style={{ fontSize: '9px', color: '#94a3b8' }}>(Show System Notes)</span></Typography>
              <Paper variant="outlined" sx={{ p: 0.5, mt: 0.3, bgcolor: '#fff', position: 'relative', minHeight: '32px', minWidth: '100%' }}>
                 {notes ? (
                   <Typography sx={{ fontSize: '10px', pr: 2 }}>{notes}</Typography>
                 ) : (
                   <Typography sx={{ fontSize: '10px', color: '#94a3b8', fontStyle: 'italic' }}>No notes</Typography>
                 )}
                 <DeleteOutline 
                    sx={{ position: 'absolute', right: 4, top: 4, fontSize: 14, color: '#ff7675', cursor: 'pointer' }} 
                    onClick={() => setNotes('')}
                  />
              </Paper>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 0.5 }}>
                <Button 
                  size="small" 
                  sx={{ fontSize: '10px', color: '#d4a373', textTransform: 'none', p: 0, minHeight: 0 }}
                  onClick={() => setNotes(notes + ' - ')}
                >
                  Add note/tags
                </Button>
                <IconButton size="small" sx={{ p: 0, color: '#00d2d3' }}>
                  <Mic fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#475569', mb: 0.3 }}>
                Reminder Preferences
              </Typography>
              <FormControlLabel 
                control={
                  <Checkbox 
                    size="small" 
                    checked={sendReminders}
                    onChange={(e) => setSendReminders(e.target.checked)}
                    sx={{ py: 0 }} 
                  />
                } 
                label={<Typography sx={{fontSize: '10px'}}>Don't send reminders for this appointment</Typography>} 
                sx={{ mt: 0, ml: 0, '& .MuiFormControlLabel-label': { fontSize: '10px' } }}
              />
            </Box>

            <Box sx={{ mt: 'auto' }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#4a6da7', mb: 0.3 }}>Tags</Typography>
              
              {/* The Add Button */}
              <Button 
                size="small" 
                onClick={handleTagsClick}
                sx={{ 
                  bgcolor: '#d4a373', 
                  color: 'white', 
                  textTransform: 'none', 
                  minWidth: 55, 
                  fontSize: '10px', 
                  py: 0.3,
                  '&:hover': { bgcolor: '#bc8a5f' }
                }}
              >
                Add
              </Button>

              {/* Display selected tags */}
              {selectedTags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                  {selectedTags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag.label || tag.icon}
                      size="small"
                      onDelete={() => setSelectedTags(selectedTags.filter((_, i) => i !== index))}
                      sx={{ 
                        height: 20, 
                        fontSize: '9px', 
                        bgcolor: tag.bg, 
                        border: `1px solid ${tag.border}`,
                        color: tag.color || '#475569',
                        fontWeight: tag.label ? 700 : 400,
                        '& .MuiChip-deleteIcon': {
                          fontSize: '12px',
                          color: tag.color || '#94a3b8',
                          '&:hover': {
                            color: tag.color || '#64748b'
                          }
                        }
                      }}
                    />
                  ))}
                </Box>
              )}

              {/* The Popover matching screenshot */}
              <Popover
                open={openTags}
                anchorEl={tagsAnchorEl}
                onClose={handleTagsClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                PaperProps={{
                  sx: {
                    p: 1,
                    borderRadius: 2,
                    boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
                    maxWidth: 350,
                    maxHeight: 350,
                  }
                }}
              >
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0.5, maxWidth: 350 }}>
                  {availableTags.map((tag, idx) => (
                    <Box
                      key={idx}
                      onClick={() => {
                        // Add tag to selection
                        if (!selectedTags.some(t => JSON.stringify(t) === JSON.stringify(tag))) {
                          setSelectedTags([...selectedTags, tag]);
                        }
                        handleTagsClose();
                      }}
                      sx={{
                        aspectRatio: '1/1',
                        bgcolor: tag.bg,
                        border: `1px solid ${tag.border}`,
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.1s',
                        '&:hover': { transform: 'scale(1.1)', boxShadow: 1 },
                        minWidth: 55,
                      }}
                    >
                      <Typography sx={{ 
                        fontSize: tag.label?.length > 2 ? '13px' : '20px', 
                        fontWeight: 700,
                        color: tag.color || 'inherit'
                      }}>
                        {tag.label || tag.icon}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Popover>
            </Box>
          </Box>
        </Box>

        {/* Footer Utility Bar */}
        <Box sx={{ p: 1.5, borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
          {/* First Line: Lab Order Button */}
          <Box sx={{ mb: 1 }}>
            <Button
              sx={{
                color: '#1976d2',
                textTransform: 'none',
                fontSize: '11px',
                p: 0,
                minHeight: 0,
              }}
              onClick={() => setLabOrderOpen(true)}
            >
              + Lab Order
            </Button>
          </Box>

          {/* Second Line: Reminder and Save/Cancel Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontSize: '12px', color: '#475569' }}>Send a reminder to "save the date" now:</Typography>
              <Button startIcon={<MailOutline />} sx={{ fontSize: '11px', textTransform: 'none', color: '#4a6da7' }}>Via Email</Button>
              <Button startIcon={<ChatBubbleOutline />} sx={{ fontSize: '11px', textTransform: 'none', color: '#4a6da7' }}>Via Text Message</Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                sx={{ bgcolor: '#d4a373', color: 'white', textTransform: 'none', fontSize: '11px', px: 2 }}
                onClick={() => {
                  if (onSave) {
                    onSave({
                      patientId: patient?.id || patient?._id,
                      visitType,
                      appointmentStatus,
                      durationMinutes: durationMins,
                      providerTimes,
                      preferredDentist,
                      preferredHygienist,
                      referredBy,
                      notes,
                      sendReminders,
                      operatory
                    });
                  }
                }}
              >
                Save
              </Button>
              <Button sx={{ bgcolor: '#94a3b8', color: 'white', textTransform: 'none', fontSize: '11px', px: 2 }} onClick={onClose}>Cancel</Button>
            </Box>
          </Box>
        </Box>
      </Box>
      
      {/* Lab Order Dialog */}
      <LabOrder open={labOrderOpen} onClose={() => setLabOrderOpen(false)} />
    </Dialog>
  );
};

export default AppointmentPage;