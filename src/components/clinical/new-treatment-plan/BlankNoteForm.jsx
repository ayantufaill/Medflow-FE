import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, TextField, Button, IconButton, Chip, CircularProgress,
  Alert, Popover, Divider,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight } from '../../../constants/styles';
import { clinicalNoteService } from '../../../services/clinical-note.service';

const TOOLBAR_BUTTONS = [
  { command: 'bold', icon: FormatBoldIcon, label: 'Bold' },
  { command: 'italic', icon: FormatItalicIcon, label: 'Italic' },
  { command: 'underline', icon: FormatUnderlinedIcon, label: 'Underline' },
  { divider: true },
  { command: 'insertUnorderedList', icon: FormatListBulletedIcon, label: 'Bullet List' },
  { command: 'insertOrderedList', icon: FormatListNumberedIcon, label: 'Numbered List' },
  { command: 'indent', icon: FormatIndentIncreaseIcon, label: 'Indent' },
  { command: 'justifyLeft', icon: FormatAlignLeftIcon, label: 'Align Left' },
];

const BlankNoteForm = ({
  note,
  patientId,
  providerId,
  appointmentId,
  providersList = [],
  onCancel,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState(['Clinical']);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tagAnchor, setTagAnchor] = useState(null);
  const editorRef = useRef(null);
  const initializedRef = useRef(false);

  // Initialize provider selection
  useEffect(() => {
    if (note?.providerId) {
      const pId = typeof note.providerId === 'object'
        ? (note.providerId._id || note.providerId.id || note.providerId.ProvNum)
        : note.providerId;
      if (pId) setSelectedProviderId(String(pId));
    } else if (providerId) {
      setSelectedProviderId(String(providerId));
    } else if (providersList.length > 0) {
      const first = providersList[0]._id || providersList[0].id || providersList[0].ProvNum;
      if (first) setSelectedProviderId(String(first));
    }
  }, [note, providerId, providersList]);

  // Populate form when editing an existing note
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    if (note) {
      const noteTitle = note.structuredData?.title || note.title || note.chiefComplaint || '';
      setTitle(noteTitle === 'Blank Note' ? '' : noteTitle);

      const existingTags = note.structuredData?.tags || note.tags;
      if (Array.isArray(existingTags)) {
        setTags(existingTags);
      }

      // Populate editor content
      const content = note.structuredData?.htmlContent ||
        note.structuredData?.content ||
        note.content ||
        [note.subjective, note.objective, note.assessment, note.plan].filter(Boolean).join('\n') ||
        note.description || '';

      requestAnimationFrame(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = content;
        }
      });
    }
  }, [note]);

  const execCommand = useCallback((command) => {
    editorRef.current?.focus();
    document.execCommand(command, false, null);
  }, []);

  const getEditorText = useCallback(() => {
    if (!editorRef.current) return '';
    return editorRef.current.innerText?.trim() || '';
  }, []);

  const getEditorHtml = useCallback(() => {
    if (!editorRef.current) return '';
    return editorRef.current.innerHTML || '';
  }, []);

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput('');
    setTagAnchor(null);
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags((prev) => prev.filter((t) => t !== tagToDelete));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const resolveEffectiveIds = () => {
    const effectivePatientId = (() => {
      const candidates = [
        patientId,
        note?.patientId?._id || note?.patientId?.id || note?.patientId,
      ];
      for (const c of candidates) {
        if (/^\d+$/.test(String(c || ''))) return String(c);
      }
      return null;
    })();

    const effectiveProviderId = (() => {
      const candidates = [
        selectedProviderId,
        note?.providerId?._id || note?.providerId?.id || note?.providerId,
        providerId,
        providersList?.[0]?._id || providersList?.[0]?.id || providersList?.[0]?.ProvNum,
      ];
      for (const c of candidates) {
        if (!c) continue;
        const raw = typeof c === 'object' ? c._id || c.id || c.ProvNum : c;
        if (/^\d+$/.test(String(raw || ''))) return String(raw);
      }
      return null;
    })();

    return { effectivePatientId, effectiveProviderId };
  };

  const handleSave = async () => {
    const { effectivePatientId, effectiveProviderId } = resolveEffectiveIds();
    const textContent = getEditorText();
    const htmlContent = getEditorHtml();

    if (!effectivePatientId || (!note && !effectiveProviderId)) {
      setError('A valid patient and provider are required to save this note.');
      return;
    }
    if (!textContent && !title.trim()) {
      setError('Enter note content before saving.');
      return;
    }

    setSaving(true);
    setError('');

    const noteTitle = title.trim() || 'Blank Note';

    try {
      if (note) {
        const updatePayload = {
          chiefComplaint: noteTitle,
          subjective: textContent,
          content: textContent,
          structuredData: {
            ...(note?.structuredData || {}),
            isBlankNote: true,
            formType: 'blank',
            title: noteTitle,
            tags,
            content: textContent,
            htmlContent,
            providerId: String(effectiveProviderId),
          },
        };
        await clinicalNoteService.updateClinicalNote(note.id || note._id, updatePayload);
      } else {
        const createPayload = {
          patientId: String(effectivePatientId),
          ...(effectiveProviderId ? { providerId: String(effectiveProviderId) } : {}),
          ...(appointmentId && /^\d+$/.test(String(appointmentId)) ? { appointmentId: String(appointmentId) } : {}),
          noteType: 'soap',
          chiefComplaint: noteTitle,
          subjective: textContent,
          structuredData: {
            isBlankNote: true,
            formType: 'blank',
            title: noteTitle,
            tags,
            content: textContent,
            htmlContent,
            providerId: String(effectiveProviderId),
          },
        };
        await clinicalNoteService.createClinicalNote(createPayload);
      }
      onSuccess();
    } catch (saveError) {
      setError(
        saveError?.response?.data?.error?.message ||
        saveError?.response?.data?.message ||
        saveError?.message ||
        'Could not save note. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Scrollable Content */}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Note Title Input with Bell Icon */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 3,
            pt: 3,
            pb: 1,
            gap: 1,
          }}
        >
          <TextField
            placeholder="Note title"
            variant="standard"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: '16px',
                fontWeight: 500,
                color: COLORS.TEXT_PRIMARY,
                '&::placeholder': { color: COLORS.TEXT_MUTED },
              },
            }}
            sx={{
              '& .MuiInput-root': {
                '&:before, &:after': { display: 'none' },
              },
            }}
          />
          <IconButton size="small" sx={{ color: COLORS.TEXT_MUTED }}>
            <NotificationsNoneIcon sx={{ fontSize: '20px' }} />
          </IconButton>
        </Box>

        <Divider sx={{ mx: 3, borderColor: COLORS.BORDER_LIGHT }} />

        {/* Tags Section */}
        <Box sx={{ px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY, fontWeight: fontWeight.medium }}>
            Tags
          </Typography>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              onDelete={() => handleDeleteTag(tag)}
              sx={{
                bgcolor: '#f1f5f9',
                color: '#334155',
                fontWeight: fontWeight.medium,
                borderRadius: '16px',
                fontSize: fontSize.sm,
                height: '26px',
                '& .MuiChip-deleteIcon': {
                  fontSize: '16px',
                  color: '#94a3b8',
                  '&:hover': { color: '#64748b' },
                },
              }}
            />
          ))}
          <IconButton
            size="small"
            onClick={(e) => setTagAnchor(e.currentTarget)}
            sx={{ color: COLORS.TEXT_MUTED, p: 0.5 }}
          >
            <AddCircleOutlineIcon sx={{ fontSize: '20px' }} />
          </IconButton>

          {/* Tag Add Popover */}
          <Popover
            open={Boolean(tagAnchor)}
            anchorEl={tagAnchor}
            onClose={() => { setTagAnchor(null); setTagInput(''); }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            sx={{ zIndex: 1500 }}
            PaperProps={{
              sx: {
                p: 1.5,
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                display: 'flex',
                gap: 1,
                alignItems: 'center',
              },
            }}
          >
            <TextField
              autoFocus
              size="small"
              placeholder="Enter tag…"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              sx={{
                width: 160,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  fontSize: '13px',
                },
              }}
            />
            <Button
              size="small"
              variant="contained"
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
              sx={{
                textTransform: 'none',
                bgcolor: COLORS.ACCENT,
                borderRadius: '6px',
                minWidth: 'unset',
                px: 2,
                fontSize: '13px',
                boxShadow: 'none',
                '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' },
              }}
            >
              Add
            </Button>
          </Popover>
        </Box>

        <Divider sx={{ mx: 3, borderColor: COLORS.BORDER_LIGHT }} />

        {/* Rich Text Toolbar */}
        <Box
          sx={{
            px: 3,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
          }}
        >
          {TOOLBAR_BUTTONS.map((btn, idx) =>
            btn.divider ? (
              <Divider
                key={`div-${idx}`}
                orientation="vertical"
                flexItem
                sx={{ mx: 0.5, borderColor: COLORS.BORDER_LIGHT }}
              />
            ) : (
              <IconButton
                key={btn.command}
                size="small"
                title={btn.label}
                onMouseDown={(e) => {
                  e.preventDefault();
                  execCommand(btn.command);
                }}
                sx={{
                  borderRadius: '4px',
                  p: 0.75,
                  color: COLORS.TEXT_SECONDARY,
                  '&:hover': { bgcolor: '#f1f5f9', color: COLORS.TEXT_PRIMARY },
                }}
              >
                <btn.icon sx={{ fontSize: '20px' }} />
              </IconButton>
            )
          )}
        </Box>

        <Divider sx={{ mx: 3, borderColor: COLORS.BORDER_LIGHT }} />

        {/* Content Editable Editor */}
        <Box
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Start typing your blank note here…"
          sx={{
            flex: 1,
            mx: 3,
            my: 2,
            px: 0,
            py: 0,
            minHeight: 220,
            fontSize: '14px',
            lineHeight: 1.7,
            color: COLORS.TEXT_PRIMARY,
            outline: 'none',
            overflowY: 'auto',
            '&:empty:before': {
              content: 'attr(data-placeholder)',
              color: COLORS.TEXT_MUTED,
              pointerEvents: 'none',
            },
            '& ul, & ol': {
              pl: 3,
              my: 0.5,
            },
          }}
        />

        {/* Error Alert */}
        {error && (
          <Box sx={{ px: 3, pb: 1 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
      </Box>

      {/* Footer Actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 1.5,
          px: 3,
          py: 2,
          borderTop: `1px solid ${COLORS.BORDER}`,
          bgcolor: '#fff',
          flexShrink: 0,
        }}
      >
        <Button
          onClick={onCancel}
          disabled={saving}
          sx={{
            textTransform: 'none',
            color: COLORS.TEXT_SECONDARY,
            fontWeight: fontWeight.medium,
            fontSize: '14px',
            px: 3,
            borderRadius: '8px',
            border: `1px solid ${COLORS.BORDER}`,
            '&:hover': { bgcolor: '#f8fafc' },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{
            textTransform: 'none',
            bgcolor: COLORS.ACCENT,
            fontWeight: fontWeight.medium,
            fontSize: '14px',
            px: 3,
            borderRadius: '8px',
            boxShadow: 'none',
            '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' },
          }}
        >
          {saving ? <CircularProgress size={20} color="inherit" /> : 'Save note'}
        </Button>
      </Box>
    </Box>
  );
};

export default BlankNoteForm;
