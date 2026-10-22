import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Drawer, Box, Typography, IconButton, Divider, Chip, Button, Paper, CircularProgress, Menu, MenuItem, ListSubheader, Checkbox, Popover, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TuneIcon from '@mui/icons-material/Tune';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import NotesIcon from '@mui/icons-material/Notes';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight } from '../../../constants/styles';
import { MOCK_FILTER_TAGS } from './notes.constants';
import dayjs from 'dayjs';
import EditNoteForm from '../edit-note/EditNoteForm';
import NotesDrawerComposer from './NotesDrawerComposer';
import GeneralNoteForm from './GeneralNoteForm';
import BlankNoteForm from './BlankNoteForm';
import EmergencyTraumaNoteForm, { TRAUMA_TEMPLATE_NAME } from './EmergencyTraumaNoteForm';
import HygieneNoteForm, { HYGIENE_TEMPLATE_NAME } from './HygieneNoteForm';
import { clinicalNoteService } from '../../../services/clinical-note.service';
import { progressNoteService } from '../../../services/progress-note.service';
import { noteTemplateService } from '../../../services/note-template.service';
import { selectProviderDropdownList, fetchAllProvidersForDropdown } from '../../../store/slices/providerSlice';
import { noteFields, printNote } from './notePrint';

const TEMPLATE_MENU_NAMES = [
  'Exam - Emergency Trauma',
  'Exam - Hygiene',
  'Exam - Limited',
  'Failed TX',
  'Frenectomy consult',
  'Frenectomy procedure',
  'Frenectomy follow up',
];

const FILTER_ICONS = {
  Allergy: FavoriteBorderOutlinedIcon,
  'Ask for Review': StarBorderOutlinedIcon,
  Birthday: CakeOutlinedIcon,
  Clinical: MedicalServicesOutlinedIcon,
  General: DescriptionOutlinedIcon,
  'Family Appointment': PeopleOutlineOutlinedIcon,
  'Med Hx': MedicationOutlinedIcon,
  'Medical Clearance': WarningAmberOutlinedIcon,
  'Medical Condition': MedicalServicesOutlinedIcon,
  'New Patient': PeopleOutlineOutlinedIcon,
  'NO FLUORIDE': BlockOutlinedIcon,
  'Online Booking': EventOutlinedIcon,
  Pregnant: FavoriteBorderOutlinedIcon,
  Premedication: MedicationOutlinedIcon,
  'Recall Overdue': EventOutlinedIcon,
  'Repeat No Show': EventOutlinedIcon,
  'Special Needs': FavoriteBorderOutlinedIcon,
  'Text Opt Out': BlockOutlinedIcon,
  'VIP Gift': CardGiftcardOutlinedIcon,
  'X-Rays': MedicalServicesOutlinedIcon,
};

const historyChanges = (event, source) => {
  const previous = new Map(noteFields(event.oldValues || {}, source));
  const current = new Map(noteFields(event.newValues || {}, source));
  const changes = [...current].filter(([name, value]) => previous.get(name) !== value);
  previous.forEach((value, name) => {
    if (!current.has(name)) changes.push([name, `Removed (previously: ${value})`]);
  });
  if (source === 'general') {
    if (event.oldValues?.title !== event.newValues?.title && event.newValues?.title) changes.unshift(['Title', event.newValues.title]);
    if (event.oldValues?.isArchived !== event.newValues?.isArchived) changes.push(['Archive status', event.newValues?.isArchived ? 'Archived' : 'Active']);
    if (event.oldValues?.status !== event.newValues?.status && event.newValues?.status) changes.push(['Status', event.newValues.status]);
  }
  return changes;
};

const isSignedNote = (note) => Boolean(note?.isSigned || String(note?.status || '').toLowerCase() === 'signed');
const personName = (person) => person && typeof person === 'object'
  ? [person.firstName || person.FName, person.lastName || person.LName].filter(Boolean).join(' ').trim()
  : '';

const NotesDrawer = ({ open, onClose, patientName, patientId, appointmentId, providerId, currentPatient, selectedProcedures }) => {
  const dispatch = useDispatch();
  const providersList = useSelector(selectProviderDropdownList) || [];

  useEffect(() => {
    if (open && (!providersList || providersList.length === 0) && typeof dispatch === 'function') {
      dispatch(fetchAllProvidersForDropdown());
    }
  }, [open, dispatch, providersList.length]);

  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [createAnchorEl, setCreateAnchorEl] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState('');
  const [notesError, setNotesError] = useState('');
  const [composerKind, setComposerKind] = useState('clinical');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const requestId = useRef(0);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [historyNote, setHistoryNote] = useState(null);
  const [historyEvents, setHistoryEvents] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [printError, setPrintError] = useState('');
  const [printing, setPrinting] = useState(false);
  const historyRequest = useRef(0);
  const [view, setView] = useState('list'); // 'list' | 'history' | 'edit' | 'create'

  const resolvedPatientId = (() => {
    const candidates = [
      patientId,
      currentPatient?.PatNum,
      currentPatient?._id,
      currentPatient?.id,
      currentPatient?.patientId,
    ];
    for (const candidate of candidates) {
      if (/^\d+$/.test(String(candidate || ''))) return String(candidate);
    }
    return patientId || (currentPatient ? (currentPatient.PatNum || currentPatient._id || currentPatient.id) : null);
  })();

  const resolvedProviderId = (() => {
    const procProvider = (selectedProcedures || []).find((p) => p.provider && p.provider !== '-')?.provider;
    const candidates = [
      providerId,
      currentPatient?.PriProv,
      currentPatient?.primaryProviderId,
      currentPatient?.preferredDentistId,
      currentPatient?.preferredHygienistId,
      currentPatient?.providerId,
      procProvider,
    ];
    for (const candidate of candidates) {
      if (!candidate) continue;
      const directId = typeof candidate === 'object' ? candidate?._id || candidate?.id || candidate?.ProvNum : candidate;
      if (/^\d+$/.test(String(directId || ''))) return String(directId);
      const matched = providersList.find((provider) =>
        String(provider.providerCode || '') === String(directId || '') ||
        String(provider._id || '') === String(directId || '') ||
        `${provider.userId?.firstName || provider.firstName || ''} ${provider.userId?.lastName || provider.lastName || ''}`.trim() === String(directId || '')
      );
      if (matched?._id || matched?.id) return String(matched._id || matched.id);
    }
    if (providersList.length > 0) {
      const first = providersList[0];
      const fallbackId = first?._id || first?.id || first?.ProvNum;
      if (/^\d+$/.test(String(fallbackId || ''))) return String(fallbackId);
    }
    return null;
  })();

  const loadTemplates = async () => {
    setTemplatesLoading(true);
    setTemplatesError('');
    try {
      const result = await noteTemplateService.getActiveTemplates();
      setTemplates(Array.isArray(result) ? result : result?.noteTemplates || []);
    } catch {
      setTemplatesError('Could not load note templates.');
      setTemplates([]);
    } finally {
      setTemplatesLoading(false);
    }
  };

  const openCreateMenu = (event) => {
    setCreateAnchorEl(event.currentTarget);
    loadTemplates();
  };

  const startNote = (kind, template = null) => {
    setCreateAnchorEl(null);
    setActiveNoteId(null);
    setComposerKind(kind);
    setSelectedTemplate(template);
    setView('create');
  };

  const loadRealNotes = async () => {
    const pid = resolvedPatientId;
    if (!pid) return;
    const currentRequest = ++requestId.current;
    try {
      setIsLoading(true);
      setNotesError('');
      const loadPages = async (fetchPage, getRows, getPagination) => {
        const first = await fetchPage(1);
        const rows = [...getRows(first)];
        const pages = getPagination(first)?.pages || 1;
        for (let page = 2; page <= pages; page += 1) {
          if (currentRequest !== requestId.current) break;
          rows.push(...getRows(await fetchPage(page)));
        }
        return rows;
      };
      const [clinicalResult, generalResult] = await Promise.allSettled([
        loadPages(
          (page) => clinicalNoteService.getClinicalNotesByPatient(pid, page, 100),
          (result) => result?.clinicalNotes || [],
          (result) => result?.pagination,
        ),
        loadPages(
          (page) => progressNoteService.getAll({ patientId: pid, category: 'General Notes', page, limit: 100 }),
          (result) => result?.data?.notes || [],
          (result) => result?.data?.pagination,
        ),
      ]);
      if (currentRequest !== requestId.current) return;
      if (clinicalResult.status === 'rejected' || generalResult.status === 'rejected') {
        setNotesError('Some notes could not be loaded. Please reopen the drawer to retry.');
      }
      const clinicalNotes = clinicalResult.status === 'fulfilled' ? clinicalResult.value : [];
      const generalNotes = generalResult.status === 'fulfilled' ? generalResult.value : [];
      {
        // Filter out empty 'soap' notes (junk seed data) that have no structuredData or text
        const validNotes = clinicalNotes.filter(n =>
          n.noteType !== 'soap' || n.structuredData || n.text || n.subjective || n.objective || n.assessment || n.plan || n.chiefComplaint
        );
        const mappedClinical = validNotes.map(n => {
          let titleStr = n.structuredData?.title || n.structuredData?.emergencyTrauma?.title || n.structuredData?.hygiene?.title || n.structuredData?.templateName || n.structuredData?.restorativeTreatment?.split('\n')[0] || n.chiefComplaint;
          if (!titleStr) {
            const type = n.noteType || 'Clinical Note';
            titleStr = n.structuredData?.isBlankNote ? 'Blank Note' : (type === 'soap' || type === 'progress' ? 'Clinical Note' : type.charAt(0).toUpperCase() + type.slice(1));
          }
          const provider = typeof n.providerId === 'object' && n.providerId
            ? n.providerId
            : providersList.find((item) => String(item._id || item.id || item.ProvNum) === String(n.providerId));
          const providerName = personName(provider) || personName(provider?.userId);
          const editorProvider = providersList.find((item) => String(item.userId?._id || '') === String(n.lastEditedBy));
          const signerName = personName(n.signedBy);
          const updatedByName = personName(editorProvider?.userId) || signerName || providerName || 'Provider unavailable';

          return {
            id: n._id || n.id,
            title: titleStr,
            status: n.isSigned ? 'Signed' : 'Draft',
            category: n.structuredData?.isBlankNote ? 'Blank' : 'Clinical',
            tags: Array.isArray(n.structuredData?.tags) && n.structuredData.tags.length > 0
              ? n.structuredData.tags
              : (Array.isArray(n.structuredData?.isolation) ? n.structuredData.isolation : []),
            text: n.structuredData?.content || n.content || n.structuredData?.emergencyTrauma?.chiefComplaint || n.structuredData?.emergencyTrauma?.limitedExam || n.structuredData?.emergencyTrauma?.traumaHistory || n.structuredData?.emergencyTrauma?.diagnosis || n.structuredData?.emergencyTrauma?.treatmentPlan ||
              n.structuredData?.hygiene?.exam || n.structuredData?.hygiene?.treatmentNotes || n.structuredData?.hygiene?.prevention || n.structuredData?.hygiene?.occlusion || n.structuredData?.hygiene?.softTissueExtraoral || n.structuredData?.hygiene?.oralHygieneStatus ||
              n.structuredData?.procedureAccomplished || n.structuredData?.treatmentRequirementsNotes ||
              n.structuredData?.templateFields?.map((field) => `${field.label}: ${Array.isArray(field.value) ? field.value.join(', ') : field.value ?? ''}`).join('\n') ||
              [n.subjective, n.objective, n.assessment, n.plan].filter(Boolean).join('\n') || '',
            updatedBy: updatedByName,
            providerName,
            signerName,
            updatedAt: n.updatedAt ? dayjs(n.updatedAt).format('MMM D, YYYY [at] h:mm A') : '',
            sortDate: n.updatedAt || n.createdAt || '',
            source: 'clinical',
            original: n,
            isSigned: n.isSigned,
            isHeaderOnly: false
          };
        });
        const mappedGeneral = generalNotes.map((n) => ({
          id: n.id,
          title: n.title || n.category || 'General Notes',
          category: 'General',
          status: n.status || 'Saved',
          isSigned: isSignedNote(n),
          text: n.description || '',
          updatedBy: n.provider || 'Provider',
          updatedAt: n.date ? dayjs(n.date).format('MMM D, YYYY [at] h:mm A') : '',
          sortDate: n.date || '',
          source: 'general',
          original: n,
          tags: n.tags || [],
        }));
        setNotes([...mappedClinical, ...mappedGeneral].sort((a, b) => dayjs(b.sortDate).valueOf() - dayjs(a.sortDate).valueOf()));
      }
    } catch (err) {
      console.error(err);
      if (currentRequest === requestId.current) setNotesError('Could not load notes. Please reopen the drawer to retry.');
    } finally {
      if (currentRequest === requestId.current) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      if (resolvedPatientId) {
        loadRealNotes();
      } else {
        requestId.current += 1;
        setNotes([]);
      }
      setView('list');
      setCreateAnchorEl(null);
    } else {
      requestId.current += 1;
      historyRequest.current += 1;
    }
  }, [open, patientId]);

  const handleMenuClick = (event, noteId) => {
    setMenuAnchorEl(event.currentTarget);
    setActiveNoteId(noteId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    if (view === 'list') setActiveNoteId(null);
  };

  const handleHistoryClick = () => {
    const note = notes.find((item) => item.id === activeNoteId);
    if (!note) { setMenuAnchorEl(null); return; }
    const currentRequest = ++historyRequest.current;
    setHistoryNote(note);
    setHistoryEvents([]);
    setHistoryError('');
    setHistoryLoading(true);
    setView('history');
    setMenuAnchorEl(null);
    const service = note.source === 'general' ? progressNoteService : clinicalNoteService;
    service.getHistory(note.id).then((events) => {
      if (currentRequest === historyRequest.current) setHistoryEvents(events || []);
    }).catch((error) => {
      if (currentRequest === historyRequest.current) setHistoryError(error?.response?.data?.error?.message || 'Could not load note history.');
    }).finally(() => {
      if (currentRequest === historyRequest.current) setHistoryLoading(false);
    });
  };

  const handlePrintClick = async () => {
    const note = notes.find((item) => item.id === activeNoteId);
    setMenuAnchorEl(null);
    if (!note || printing) return;
    setPrintError('');
    setPrinting(true);
    try {
      const saved = note.source === 'general'
        ? await progressNoteService.getById(note.id)
        : await clinicalNoteService.getClinicalNoteById(note.id);
      const savedPatientId = saved.patientId?._id || saved.patientId?.id || saved.patientId?.PatNum || saved.patientId;
      if (String(savedPatientId) !== String(resolvedPatientId)) throw new Error('This note does not belong to the selected patient.');
      const savedProvider = saved.providerId && typeof saved.providerId === 'object'
        ? `${saved.providerId.firstName || ''} ${saved.providerId.lastName || ''}`.trim()
        : saved.provider;
      const savedTitle = saved.title || saved.structuredData?.title || saved.structuredData?.emergencyTrauma?.title ||
        saved.structuredData?.hygiene?.title || saved.structuredData?.templateName || note.title;
      await printNote({
        note: saved, source: note.source, patientName,
        title: savedTitle, providerName: savedProvider || note.updatedBy,
      });
    } catch (error) {
      setPrintError(error?.response?.data?.error?.message || error.message || 'Could not print this note.');
    } finally { setPrinting(false); }
  };

  const getStatusDisplay = (note) => {
    if (note.isSigned || note.status === 'Signed' || note.structuredData?.isComplete) {
      return { text: 'Completed', color: '#dcfce7', textColor: '#15803d' };
    }
    return { text: 'Saved', color: '#ffedd5', textColor: '#c2410c' }; // Draft
  };

  const toggleFilter = (filter) => {
    setActiveFilters((current) => current.includes(filter)
      ? current.filter((item) => item !== filter) : [...current, filter]);
  };

  const displayNotes = activeFilters.length === 0 
    ? notes 
    : notes.filter(note => note.isHeaderOnly || activeFilters.some(filter => note.category === filter || (note.tags && note.tags.includes(filter))));
    
  const resultCount = displayNotes.filter(n => !n.isHeaderOnly).length;
  const selectedNote = notes.find((item) => item.id === activeNoteId);
  const selectedNoteSigned = isSignedNote(selectedNote) || isSignedNote(selectedNote?.original);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ zIndex: 1400 }}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 600 } }
      }}
    >
      {view === 'list' ? (
        <>
          {/* Header */}
      <Box sx={{
          boxSizing: "border-box",
          px: "25px",
          py: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
      }}>
        <NotesIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
          <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>
            <Box component="span" sx={{ color: '#2563eb' }}>{patientName || 'Patient'}</Box> / Notes
          </Typography>
          <IconButton aria-label="Add note" onClick={openCreateMenu} disabled={!patientId} size="small" sx={{ color: COLORS.ACCENT, p: 0.5 }}>
            <AddCircleOutlineIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </Box>
      
      {/* Filter Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, borderBottom: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0, flexWrap: 'wrap' }}>
          <Typography sx={{ bgcolor: '#f1f5f9', borderRadius: '8px', px: 1.5, py: 1, fontSize: fontSize.md, color: '#475569' }}>
            {resultCount} result{resultCount === 1 ? '' : 's'}
          </Typography>
          {activeFilters.map((filter) => (
            <Chip key={filter} label={filter} onDelete={() => toggleFilter(filter)} size="small" variant="outlined"
              sx={{ borderRadius: '8px', color: '#334155', borderColor: '#cbd5e1', '& .MuiChip-deleteIcon': { fontSize: 17, color: '#64748b', '&:hover': { color: '#334155' } } }} />
          ))}
          {activeFilters.length > 0 && (
            <Button size="small" onClick={() => setActiveFilters([])} sx={{ minWidth: 0, px: 0.5, textTransform: 'none', color: '#2563eb', fontWeight: fontWeight.semibold, fontSize: fontSize.md }}>Clear</Button>
          )}
        </Box>
        <IconButton id="notes-filter-button" aria-label="Filter notes" aria-haspopup="menu"
          aria-controls={filterAnchorEl ? 'notes-filter-menu' : undefined} aria-expanded={Boolean(filterAnchorEl)}
          onClick={(event) => setFilterAnchorEl(event.currentTarget)}
          sx={{ flexShrink: 0, width: 36, height: 36, border: '1px solid #e2e8f0', borderRadius: '8px', color: activeFilters.length ? '#2563eb' : '#334155', bgcolor: activeFilters.length ? '#eff6ff' : '#fff', '&:hover': { borderColor: '#93c5fd', bgcolor: '#eff6ff' } }}>
          <TuneIcon sx={{ fontSize: '1.25rem' }} />
        </IconButton>
        <Menu id="notes-filter-menu" anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)}
          onClose={() => setFilterAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          MenuListProps={{ 'aria-labelledby': 'notes-filter-button' }}
          sx={{ zIndex: 1500 }}
          PaperProps={{ sx: { mt: 1, minWidth: 240, maxWidth: 'calc(100vw - 32px)', maxHeight: 400, border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)', '& .MuiMenuItem-root': { gap: 1.5, py: 1.25, px: 2, minHeight: 40, fontSize: '0.875rem', fontFamily: 'Inter, sans-serif', color: '#0f172a', '&:hover, &.Mui-focusVisible': { bgcolor: COLORS.SURFACE_HOVER }, '&.Mui-selected': { bgcolor: '#eff6ff' }, '&.Mui-selected:hover': { bgcolor: '#dbeafe' } } } }}
        >
          <ListSubheader disableSticky sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, lineHeight: '32px' }}>Filters</ListSubheader>
          {MOCK_FILTER_TAGS.map(({ label }) => {
            const FilterIcon = FILTER_ICONS[label] || LocalOfferOutlinedIcon;
            return (
              <MenuItem key={label} role="menuitemcheckbox" aria-checked={activeFilters.includes(label)}
                selected={activeFilters.includes(label)} onClick={() => toggleFilter(label)}>
                <FilterIcon sx={{ fontSize: '1.25rem', color: '#334155' }} />
                <Box sx={{ flex: 1 }}>{label}</Box>
                <Checkbox checked={activeFilters.includes(label)} tabIndex={-1} disableRipple size="small" sx={{ p: 0, color: '#94a3b8', '&.Mui-checked': { color: '#2563eb' }, '& .MuiSvgIcon-root': { fontSize: '1.15rem' } }} />
              </MenuItem>
            );
          })}
        </Menu>
      </Box>

      {/* Notes List */}
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
        {notesError && <Alert severity="warning">{notesError}</Alert>}
        {printError && <Alert severity="error" onClose={() => setPrintError('')}>{printError}</Alert>}
        {printing && <Alert severity="info">Preparing note for printing…</Alert>}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress size={24} /></Box>
        ) : displayNotes.length === 0 || resultCount === 0 ? (
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Typography sx={{ color: '#64748b', fontSize: '1rem' }}>No notes match the current filters</Typography>
          </Box>
        ) : (
          displayNotes.map((note) => {
            if (note.isHeaderOnly) {
              return (
                <Box key={note.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography sx={{ fontWeight: fontWeight.semibold, fontSize: fontSize.lg, color: '#0f172a' }}>{note.title}</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small"><NotificationsNoneIcon sx={{ color: '#475569' }} /></IconButton>
                    <IconButton size="small" onClick={(e) => handleMenuClick(e, note.id)}><MoreVertIcon sx={{ color: '#475569' }} /></IconButton>
                  </Box>
                </Box>
              );
            }

            const statusDisplay = getStatusDisplay(note);
            const title = note.title || note.noteType || 'Clinical Note';
            const text = note.content || note.text || '';
            const category = note.category || note.noteType || 'Clinical';
            const tags = note.tags || [];
            const providerName = note.updatedBy || 'System';
            const updatedAt = note.updatedAt || '';

            return (
              <Box key={note._id || note.id}>
                <Paper 
                  elevation={0} 
                  onClick={() => {
                    setActiveNoteId(note._id || note.id);
                    setComposerKind(
                      note.source === 'general' ? 'general' :
                      note.original?.structuredData?.formType === 'emergencyTrauma' ? 'emergencyTrauma' :
                      note.original?.structuredData?.formType === 'hygiene' ? 'hygiene' :
                      note.original?.noteType === 'soap' ? 'soap' : 'clinical'
                    );
                    setSelectedTemplate(null);
                    setView('edit');
                  }}
                  sx={{ 
                    bgcolor: '#f8fafc', 
                    p: 2, 
                    borderRadius: '8px',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f1f5f9' }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography sx={{ fontWeight: fontWeight.semibold, fontSize: fontSize.lg, color: '#0f172a' }}>{title}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" onClick={(e) => e.stopPropagation()}><NotificationsNoneIcon sx={{ color: '#475569' }} /></IconButton>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleMenuClick(e, note._id || note.id); }}><MoreVertIcon sx={{ color: '#475569' }} /></IconButton>
                    </Box>
                  </Box>
                  
                  {(statusDisplay.text || category) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
                      {statusDisplay.text && (
                        <Chip 
                          label={statusDisplay.text} 
                          size="small" 
                          sx={{ bgcolor: statusDisplay.color, color: statusDisplay.textColor, fontWeight: fontWeight.medium, borderRadius: '4px', fontSize: fontSize.sm }} 
                        />
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#3b82f6' }}>
                        <MedicalServicesIcon sx={{ fontSize: '1.1rem', color: '#0f172a' }} />
                        <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.medium }}>{category}</Typography>
                      </Box>
                      {tags.map((tag, idx) => (
                        <Chip key={idx} label={tag} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', borderRadius: '4px', border: 'none', fontSize: fontSize.sm }} />
                      ))}
                    </Box>
                  )}
                  
                  {text && (
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: '#334155', fontSize: fontSize.base, whiteSpace: 'pre-line' }}>
                        {text.length > 200 ? text.substring(0, 200) + '...' : text}
                      </Typography>
                      {text.length > 200 && (
                        <Typography sx={{ color: '#0f172a', fontSize: fontSize.base, fontWeight: fontWeight.semibold, mt: 0.5, cursor: 'pointer' }}>
                          More
                        </Typography>
                      )}
                    </Box>
                  )}
                  
                  <Typography sx={{ color: '#94a3b8', fontSize: fontSize.xs }}>
                    Updated by <Box component="span" sx={{ fontWeight: fontWeight.semibold }}>{providerName}</Box> {updatedAt}
                  </Typography>
                </Paper>
              </Box>
            );
          })
        )}
      </Box>
        </>
      ) : (view === 'edit' || view === 'create') ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Box sx={{
            boxSizing: 'border-box',
            px: '25px',
            py: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: `1px solid ${COLORS.BORDER}`,
            backgroundColor: COLORS.SURFACE_TINT,
            m: 0,
            flexShrink: 0,
          }}>
            <IconButton onClick={() => setView('list')} size="small" sx={{ color: '#2563eb', p: 0.5, ml: -1 }}>
              <ArrowBackIcon sx={{ fontSize: '20px' }} />
            </IconButton>
            <Typography sx={{ fontSize: '15px', fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
              {view === 'create'
                ? (composerKind === 'general' ? 'Create General Note' : composerKind === 'soap' ? 'Create Blank Note' : 'Create Clinical Note')
                : selectedNoteSigned ? 'View Signed Note' : (composerKind === 'soap' ? 'Edit Blank Note' : 'Edit Note')}
            </Typography>
            <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
              <CloseIcon sx={{ fontSize: '18px' }} />
            </IconButton>
          </Box>
          
          {/* Main Content (Form) */}
          <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', bgcolor: '#fff' }}>
            {printError && <Alert severity="error" onClose={() => setPrintError('')} sx={{ m: 2 }}>{printError}</Alert>}
            {printing && <Alert severity="info" sx={{ m: 2 }}>Preparing note for printing…</Alert>}
            {view === 'edit' && selectedNoteSigned ? (
              <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: COLORS.SURFACE_TINT, minHeight: '100%' }}>
                <Paper elevation={0} sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: 2, overflow: 'hidden' }}>
                  <Box sx={{ p: 3, borderBottom: `1px solid ${COLORS.BORDER}`, bgcolor: '#fff' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: fontSize.lg, fontWeight: fontWeight.bold }}>
                          {selectedNote?.title || 'Signed Note'}
                        </Typography>
                        <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: fontSize.sm, mt: 0.5 }}>
                          {selectedNote?.providerName
                            ? `Provider: ${selectedNote.providerName}`
                            : selectedNote?.signerName ? `Signed by: ${selectedNote.signerName}` : 'Provider unavailable'}
                          {selectedNote?.updatedAt ? ` · ${selectedNote.updatedAt}` : ''}
                        </Typography>
                      </Box>
                      <IconButton size="small" aria-label="Note actions" onClick={(event) => handleMenuClick(event, activeNoteId)}>
                        <MoreVertIcon sx={{ color: COLORS.TEXT_SECONDARY }} />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                      <Chip label="Completed" size="small" sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: fontWeight.semibold }} />
                      <Chip label={selectedNote?.category || 'Clinical'} size="small" variant="outlined" sx={{ borderColor: COLORS.BORDER }} />
                    </Box>
                  </Box>
                  <Box sx={{ p: 3 }}>
                    <Alert severity="info" sx={{ mb: 2 }}>This note is signed and read-only.</Alert>
                    {noteFields(selectedNote?.original || {}, selectedNote?.source).map(([name, value], index) => (
                      <Box key={`${name}-${index}`} sx={{ py: 2, borderBottom: `1px solid ${COLORS.BORDER}`, '&:last-child': { borderBottom: 0 } }}>
                        <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: fontSize.sm, fontWeight: fontWeight.semibold, mb: 0.5 }}>{name}</Typography>
                        <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: fontSize.base, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Box>
            ) : composerKind === 'clinical' ? (
              <EditNoteForm
                noteId={activeNoteId}
                view={view}
                patientId={resolvedPatientId}
                appointmentId={appointmentId}
                linkToAppointment={false}
                providerId={resolvedProviderId}
                currentPatient={currentPatient}
                selectedProcedures={selectedProcedures}
                onCancel={() => setView('list')}
                onSuccess={() => { loadRealNotes(); setView('list'); }}
                onOpenActions={view === 'edit' ? (event) => handleMenuClick(event, activeNoteId) : undefined}
              />
            ) : composerKind === 'emergencyTrauma' ? (
              <EmergencyTraumaNoteForm
                key={activeNoteId || 'new-emergency-trauma'}
                note={view === 'edit' ? notes.find((item) => item.id === activeNoteId)?.original : null}
                template={selectedTemplate}
                patientId={resolvedPatientId}
                providerId={resolvedProviderId}
                currentPatient={currentPatient}
                selectedProcedures={selectedProcedures}
                providersList={providersList}
                onCancel={() => setView('list')}
                onSuccess={() => { loadRealNotes(); setView('list'); }}
                onOpenActions={view === 'edit' ? (event) => handleMenuClick(event, activeNoteId) : undefined}
              />
            ) : composerKind === 'hygiene' ? (
              <HygieneNoteForm
                key={activeNoteId || 'new-hygiene'}
                note={view === 'edit' ? notes.find((item) => item.id === activeNoteId)?.original : null}
                template={selectedTemplate}
                patientId={resolvedPatientId}
                patientName={patientName}
                providerId={resolvedProviderId}
                appointmentId={appointmentId}
                currentPatient={currentPatient}
                selectedProcedures={selectedProcedures}
                providersList={providersList}
                onCancel={() => setView('list')}
                onSuccess={() => { loadRealNotes(); setView('list'); }}
                onOpenActions={view === 'edit' ? (event) => handleMenuClick(event, activeNoteId) : undefined}
              />
            ) : composerKind === 'general' ? (
              <GeneralNoteForm
                note={view === 'edit' ? notes.find((item) => item.id === activeNoteId)?.original : null}
                patientId={resolvedPatientId}
                providerId={resolvedProviderId}
                appointmentId={appointmentId}
                providersList={providersList}
                onCancel={() => setView('list')}
                onSuccess={() => { loadRealNotes(); setView('list'); }}
              />
            ) : composerKind === 'soap' ? (
              <BlankNoteForm
                note={view === 'edit' ? notes.find((item) => item.id === activeNoteId)?.original : null}
                patientId={resolvedPatientId}
                providerId={resolvedProviderId}
                appointmentId={appointmentId}
                providersList={providersList}
                onCancel={() => setView('list')}
                onSuccess={() => { loadRealNotes(); setView('list'); }}
              />
            ) : (
              <NotesDrawerComposer
                kind={composerKind}
                note={view === 'edit' ? notes.find((item) => item.id === activeNoteId)?.original : null}
                template={selectedTemplate}
                patientId={resolvedPatientId}
                providerId={resolvedProviderId}
                appointmentId={appointmentId}
                providersList={providersList}
                onCancel={() => setView('list')}
                onSuccess={() => { loadRealNotes(); setView('list'); }}
              />
            )}
          </Box>
        </Box>
      ) : (
        <>
          {/* History Header */}
          <Box sx={{
              boxSizing: "border-box",
              px: "25px",
              py: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderBottom: `1px solid ${COLORS.BORDER}`,
              backgroundColor: COLORS.SURFACE_TINT,
              m: 0,
              flexShrink: 0,
          }}>
            <IconButton onClick={() => setView('list')} size="small" sx={{ color: '#2563eb', p: 0.5, ml: -1 }}>
              <ArrowBackIcon sx={{ fontSize: "20px" }} />
            </IconButton>
            <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
              {historyNote?.title || 'Note'} History
            </Typography>
          </Box>
          
          {/* History Content */}
          <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1 }}>
            {historyLoading && <CircularProgress size={24} />}
            {historyError && <Alert severity="error">{historyError}</Alert>}
            {!historyLoading && !historyError && historyEvents.length === 0 && <Typography>No recorded history for this note.</Typography>}
            {!historyLoading && historyEvents.map((event) => {
              const changes = historyChanges(event, historyNote?.source);
              const becameSigned = (!event.oldValues?.isSigned && event.newValues?.isSigned) || (event.oldValues?.status !== 'signed' && event.newValues?.status === 'signed');
              return <Box key={event.id} sx={{ borderLeft: '2px solid #dbe3ef', pl: 2, pb: 3, mb: 1 }}>
                <Typography sx={{ color: '#334155', fontSize: fontSize.md }}>
                  <Box component="span" sx={{ fontWeight: fontWeight.bold, textTransform: 'capitalize' }}>{String(event.action || 'changed').replace(/_/g, ' ')}</Box>
                  {' by '}<Box component="span" sx={{ color: '#2563eb', fontWeight: fontWeight.semibold }}>{event.actor}</Box>
                  {event.occurredAt && ` on ${dayjs(event.occurredAt).format('MMM D, YYYY [at] h:mm A')}`}
                </Typography>
                {becameSigned && <Chip label="Completed" size="small" sx={{ mt: 1, bgcolor: '#dcfce7', color: '#15803d' }} />}
                {changes.map(([name, value]) => <Box key={name} sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Typography sx={{ minWidth: 110, color: '#64748b', fontSize: fontSize.sm }}>{name}</Typography>
                  <Typography sx={{ color: '#334155', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontSize: fontSize.sm }}>{value}</Typography>
                </Box>)}
              </Box>;
            })}
          </Box>
        </>
      )}

      {/* Options Menu */}
      <Menu
        anchorEl={createAnchorEl}
        open={Boolean(createAnchorEl)}
        onClose={() => setCreateAnchorEl(null)}
        sx={{ zIndex: 1500 }}
        PaperProps={{ sx: { minWidth: 230, maxWidth: 300, maxHeight: 360, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2, boxShadow: '0 8px 24px rgba(9, 18, 31, 0.12)' } }}
      >
        <MenuItem onClick={() => startNote('soap')} sx={{ fontSize: 13 }}>Blank</MenuItem>
        <MenuItem onClick={() => startNote('clinical')} sx={{ fontSize: 13 }}>Clinical Note</MenuItem>
        <MenuItem onClick={() => startNote('general')} sx={{ fontSize: 13 }}>General Note</MenuItem>
        <Divider />
        <ListSubheader disableSticky sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 12, fontWeight: 600, lineHeight: '32px' }}>Clinical Note Templates</ListSubheader>
        {templatesLoading && <MenuItem disabled sx={{ justifyContent: 'center' }}><CircularProgress size={18} /></MenuItem>}
        {templatesError && <MenuItem disabled sx={{ color: COLORS.STATUS_ERROR, fontSize: 12 }}>{templatesError}</MenuItem>}
        {TEMPLATE_MENU_NAMES.map((name) => (
          <MenuItem key={name} disabled={templatesLoading} onClick={() => {
            const template = templates.find((item) => item.name?.trim().toLowerCase() === name.toLowerCase());
            startNote(
              name === TRAUMA_TEMPLATE_NAME ? 'emergencyTrauma' :
              name === HYGIENE_TEMPLATE_NAME ? 'hygiene' : 'soap',
              template || { name, missingContent: true }
            );
          }} sx={{ fontSize: 13, whiteSpace: 'normal' }}>
            {name}
          </MenuItem>
        ))}
      </Menu>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        sx={{ zIndex: 9999 }}
        PaperProps={{
          sx: {
            minWidth: 200,
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)',
            mt: 1,
            '& .MuiMenuItem-root': {
              gap: 1.5,
              py: 1.25,
              px: 2,
              minHeight: 40,
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
              color: '#0f172a',
              '&:hover, &.Mui-focusVisible': { bgcolor: COLORS.SURFACE_HOVER },
            },
            '& .MuiMenuItem-root.Mui-disabled': { opacity: 0.5 },
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {
          if (view === 'edit') {
            setMenuAnchorEl(null);
            return;
          }
          const note = notes.find((item) => item.id === activeNoteId);
          setComposerKind(
            note?.source === 'general' ? 'general' :
            note?.original?.structuredData?.formType === 'emergencyTrauma' ? 'emergencyTrauma' :
            note?.original?.structuredData?.formType === 'hygiene' ? 'hygiene' :
            note?.original?.noteType === 'soap' ? 'soap' : 'clinical'
          );
          setSelectedTemplate(null);
          setMenuAnchorEl(null);
          setView('edit');
        }}>
          {selectedNoteSigned
            ? <VisibilityOutlinedIcon sx={{ fontSize: '1.25rem', color: '#334155' }} />
            : <EditOutlinedIcon sx={{ fontSize: '1.25rem', color: '#334155' }} />}
          {selectedNoteSigned ? 'View' : 'Edit'}
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <FileCopyOutlinedIcon sx={{ fontSize: '1.25rem', color: '#334155' }} />
          Copy Note
        </MenuItem>
        <MenuItem onClick={handleHistoryClick}>
          <MenuBookOutlinedIcon sx={{ fontSize: '1.25rem', color: '#334155' }} />
          History
        </MenuItem>
        <MenuItem onClick={handlePrintClick} disabled={printing}>
          <PrintOutlinedIcon sx={{ fontSize: '1.25rem', color: '#334155' }} />
          Print
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: `${COLORS.STATUS_ERROR} !important` }}>
          <ArchiveOutlinedIcon sx={{ fontSize: '1.25rem', color: COLORS.STATUS_ERROR }} />
          Archive
        </MenuItem>
      </Menu>
    </Drawer>
  );
};

export default NotesDrawer;
