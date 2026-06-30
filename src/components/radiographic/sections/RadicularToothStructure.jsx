import React, { useState } from "react";
import { 
  Box, Card, Typography, Checkbox, FormControlLabel, Stack, Divider, 
  Button, Popover, IconButton, RadioGroup, Radio, TextField, InputAdornment 
} from "@mui/material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { fontSize, fontWeight } from "../../../constants/styles";
import RestorationToothIcon from "../common/RestorationToothIcon";

const DentalSection = ({ title, children, badge }) => {
  const [noFindings, setNoFindings] = useState(false);
  return (
  <Box sx={{ mb: 1, border: '1px solid #b4bedb', overflow: 'hidden', bgcolor: 'white' }}>
    <Box sx={{ 
      bgcolor: '#6b7cb4', 
      color: 'white', 
      px: 1.5, 
      py: 0.4, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold }}>{title}</Typography>
        {badge && (
          <Box sx={{ bgcolor: '#e57373', px: 0.5, borderRadius: '2px', fontSize: fontSize.xs, fontWeight: fontWeight.bold }}>
            {badge}
          </Box>
        )}
      </Stack>
      <FormControlLabel
        control={<Checkbox checked={noFindings} onChange={(e) => setNoFindings(e.target.checked)} size="small" sx={{ p: 0.25, color: 'white', '&.Mui-checked': { color: 'white' } }} />}
        label={<Typography sx={{ fontSize: fontSize.xs, fontStyle: 'italic' }}>no findings</Typography>}
        labelPlacement="start"
        sx={{ ml: 0 }}
      />
    </Box>
    <Box sx={{ 
      p: 1.5, 
      bgcolor: 'white',
      ...(noFindings && {
        opacity: 0.4,
        pointerEvents: 'none',
        userSelect: 'none'
      })
    }}>
      {children}
    </Box>
  </Box>
);
};

const ConcernRow = ({ label, options, selectedValue, onChange }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
    <Typography sx={{ fontSize: '0.75rem', width: 90, color: '#333', fontWeight: 600 }}>
      {label}
    </Typography>
    <Stack direction="row" spacing={1.5} flexWrap="wrap">
      {options.map(opt => {
        const isSelected = selectedValue === opt;
        return (
          <FormControlLabel
            key={opt}
            control={
              <Radio 
                size="small" 
                checked={isSelected}
                onClick={() => onChange(isSelected ? null : opt)}
                sx={{ p: 0.25 }} 
              />
            }
            label={<Typography sx={{ fontSize: '0.75rem', color: '#555' }}>{opt}</Typography>}
            sx={{ mr: 1, ml: -0.5 }}
          />
        );
      })}
    </Stack>
  </Box>
);

const RadicularToothStructure = ({ 
  expanded, 
  onToggle,
  toothFindings = {},
  setToothFindings,
  selectedTeeth = [],
  activeToothNum = null,
  setActiveToothNum
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showPopoverNoteInput, setShowPopoverNoteInput] = useState(false);
  const [popoverNoteValue, setPopoverNoteValue] = useState('');

  const handleApplyRCT = () => {
    if (!selectedTeeth || selectedTeeth.length === 0) return;
    
    setToothFindings(prev => {
      const updated = { ...prev };
      selectedTeeth.forEach(num => {
        if (!updated[num]) {
          updated[num] = {
            findings: ['Root Canal Treatment'],
            rctStatus: 'Questionable',
            rctConcerns: {
              radiolucency: null,
              obturation: null,
              pdl: null,
              canalFill: null,
              iatrogenic: null
            },
            notes: []
          };
        } else if (!updated[num].findings.includes('Root Canal Treatment')) {
          updated[num] = {
            ...updated[num],
            findings: [...updated[num].findings, 'Root Canal Treatment'],
            rctStatus: updated[num].rctStatus || 'Questionable',
            rctConcerns: updated[num].rctConcerns || {
              radiolucency: null,
              obturation: null,
              pdl: null,
              canalFill: null,
              iatrogenic: null
            }
          };
        }
      });
      return updated;
    });
    
    setActiveToothNum(selectedTeeth[0]);
  };

  const handleBadgeClick = (event, toothNum) => {
    setAnchorEl(event.currentTarget);
    setActiveToothNum(toothNum);
    
    const data = toothFindings[toothNum];
    if (data && data.notes && data.notes.length > 0) {
      setPopoverNoteValue(data.notes[data.notes.length - 1].text || '');
      setShowPopoverNoteInput(true);
    } else {
      setPopoverNoteValue('');
      setShowPopoverNoteInput(false);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setShowPopoverNoteInput(false);
  };

  const handleUpdateRCTStatus = (toothNum, status) => {
    setToothFindings(prev => {
      const updated = { ...prev };
      if (updated[toothNum]) {
        updated[toothNum] = {
          ...updated[toothNum],
          rctStatus: status
        };
      }
      return updated;
    });
  };

  const handleUpdateRCTConcern = (toothNum, category, value) => {
    setToothFindings(prev => {
      const updated = { ...prev };
      if (updated[toothNum]) {
        const prevConcerns = updated[toothNum].rctConcerns || {};
        updated[toothNum] = {
          ...updated[toothNum],
          rctConcerns: {
            ...prevConcerns,
            [category]: value
          }
        };
      }
      return updated;
    });
  };

  const handleSaveNote = (toothNum, text) => {
    setToothFindings(prev => {
      const updated = { ...prev };
      if (!updated[toothNum]) return prev;
      const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
      
      const existingNotes = updated[toothNum].notes || [];
      const updatedNotes = [...existingNotes];
      
      if (updatedNotes.length > 0) {
        if (!text.trim()) {
          updatedNotes.pop();
        } else {
          updatedNotes[updatedNotes.length - 1] = { date: today, text };
        }
      } else if (text.trim()) {
        updatedNotes.push({ date: today, text });
      }
      
      updated[toothNum] = {
        ...updated[toothNum],
        notes: updatedNotes
      };
      return updated;
    });
  };

  const handleDeleteFinding = (toothNum) => {
    setToothFindings(prev => {
      const updated = { ...prev };
      if (updated[toothNum]) {
        // Remove RCT finding
        const updatedFindings = (updated[toothNum].findings || []).filter(f => f !== 'Root Canal Treatment');
        if (updatedFindings.length === 0) {
          delete updated[toothNum];
        } else {
          updated[toothNum] = {
            ...updated[toothNum],
            findings: updatedFindings
          };
        }
      }
      return updated;
    });
    if (activeToothNum === toothNum) {
      setActiveToothNum(null);
    }
    handlePopoverClose();
  };

  const activeToothData = activeToothNum ? toothFindings[activeToothNum] : null;

  return (
    <DentalSection title="Radicular Tooth Structure" badge="DH" onToggle={onToggle} expanded={expanded}>
      {expanded && (
        <>
          {/* Root Canal Treatment Header Row */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Stack 
              direction="row" 
              spacing={0.5}
              alignItems="center"
              onClick={handleApplyRCT}
              sx={selectedTeeth.length > 0 ? { cursor: 'pointer', '&:hover': { opacity: 0.8 } } : { opacity: 0.8 }}
            >
              <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: '#333' }}>
                Root Canal Treatment
              </Typography>
              <ChatBubbleOutlineIcon sx={{ fontSize: 13, color: '#bbb' }} />
            </Stack>
            <Stack direction="row" spacing={1}>
              <RestorationToothIcon fill="#fff" />
              <RestorationToothIcon fill="#ffebee" />
              <RestorationToothIcon fill="#f3e5ab" />
            </Stack>
          </Stack>
          
          {/* Badges for Root Canal Treatment aligned to the right */}
          <Stack direction="row" spacing={0.8} justifyContent="flex-end" flexWrap="wrap" useFlexGap sx={{ mb: 2, pr: 0.5 }}>
            {Object.entries(toothFindings)
              .filter(([, data]) => data && data.findings && data.findings.includes('Root Canal Treatment'))
              .map(([toothNum]) => {
                const isActive = activeToothNum === toothNum;
                return (
                  <Button
                    key={toothNum}
                    size="small"
                    variant={isActive ? "contained" : "outlined"}
                    onClick={(e) => handleBadgeClick(e, toothNum)}
                    sx={{
                      fontSize: '0.7rem',
                      py: 0.1,
                      px: 0.8,
                      minWidth: 'auto',
                      lineHeight: 1.2,
                      textTransform: 'none',
                      borderColor: '#1976d2',
                      color: isActive ? '#fff' : '#1976d2',
                      bgcolor: isActive ? '#1976d2' : 'transparent',
                      fontWeight: 'bold',
                      borderRadius: '4px',
                      '&:hover': {
                        bgcolor: isActive ? '#1565c0' : 'rgba(25, 118, 210, 0.04)',
                        borderColor: '#1565c0',
                      }
                    }}
                  >
                    {toothNum}
                  </Button>
                );
              })}
          </Stack>

          <Divider />

          {/* Posts Row */}
          <Box sx={{ opacity: 0.5, pointerEvents: 'none', userSelect: 'none' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mt={1.5}>
              <Stack direction="row" spacing={0.5}>
                <Typography sx={{ fontSize: fontSize.sm }}>Posts</Typography>
                <ChatBubbleOutlineIcon sx={{ fontSize: 13, color: '#bbb', mt: 0.3 }} />
              </Stack>
              <Stack direction="row" spacing={1}>
                <RestorationToothIcon fill="#ffd700" />
                <RestorationToothIcon fill="#90a4ae" />
                <RestorationToothIcon fill="#bcaaa4" />
              </Stack>
            </Stack>

            <Divider sx={{ mt: 2 }} />
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
              <Typography sx={{ fontSize: fontSize.xs, color: '#bca67a', fontWeight: fontWeight.bold, fontStyle: 'italic' }}>
                Resorption, Canal Calcification, Root Fracture
              </Typography>
            </Stack>
          </Box>
          
          {/* Footer Expand Icon */}
          <Box 
            sx={{ display: 'flex', justifyContent: 'center', mt: 2, cursor: 'pointer' }}
            onClick={onToggle}
          >
            <KeyboardDoubleArrowUpIcon 
              sx={{ 
                fontSize: 18, 
                color: '#666',
                transform: 'rotate(180deg)',
                transition: 'transform 0.3s'
              }} 
            />
          </Box>
        </>
      )}

      {/* RCT Findings Popover Editor */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            p: 2.5,
            width: 530,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            position: 'relative'
          }
        }}
      >
        <IconButton 
          size="small" 
          onClick={handlePopoverClose} 
          sx={{ position: 'absolute', right: 4, top: 4, color: '#aaa' }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>

        {activeToothData && (
          <Box sx={{ mt: 1 }}>
            {/* Status Selection Row */}
            <RadioGroup
              row
              value={activeToothData.rctStatus || 'Questionable'}
              onChange={(e) => handleUpdateRCTStatus(activeToothNum, e.target.value)}
              sx={{ mb: 2, justifyContent: 'flex-start', gap: 4 }}
            >
              {['Acceptable', 'Questionable', 'Not acceptable'].map(status => (
                <FormControlLabel
                  key={status}
                  value={status}
                  control={<Radio size="small" sx={{ p: 0.5 }} />}
                  label={
                    <Typography sx={{ fontSize: '0.75rem', fontStyle: 'italic', color: '#555' }}>
                      {status}
                    </Typography>
                  }
                  sx={{ mx: 0 }}
                />
              ))}
            </RadioGroup>

            <Typography sx={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#333', mb: 1.5 }}>
              Concerns:
            </Typography>

            {/* Concerns Grid Table */}
            <Box sx={{ display: 'flex', flexDirection: 'column', pl: 0.5 }}>
              <ConcernRow 
                label="Radiolucency" 
                options={['Periapical', 'Periradicular']} 
                selectedValue={activeToothData.rctConcerns?.radiolucency}
                onChange={(val) => handleUpdateRCTConcern(activeToothNum, 'radiolucency', val)}
              />
              <ConcernRow 
                label="Obturation" 
                options={['Incomplete', 'Voids', 'Silver points']} 
                selectedValue={activeToothData.rctConcerns?.obturation}
                onChange={(val) => handleUpdateRCTConcern(activeToothNum, 'obturation', val)}
              />
              <ConcernRow 
                label="PDL" 
                options={['Slightly thickened', 'Thickened']} 
                selectedValue={activeToothData.rctConcerns?.pdl}
                onChange={(val) => handleUpdateRCTConcern(activeToothNum, 'pdl', val)}
              />
              <ConcernRow 
                label="Canal fill" 
                options={['Overfilled', 'Underfilled']} 
                selectedValue={activeToothData.rctConcerns?.canalFill}
                onChange={(val) => handleUpdateRCTConcern(activeToothNum, 'canalFill', val)}
              />
              <ConcernRow 
                label="Iatrogenic" 
                options={['Separated instrument', 'Perforation', 'Over-enlarged canals']} 
                selectedValue={activeToothData.rctConcerns?.iatrogenic}
                onChange={(val) => handleUpdateRCTConcern(activeToothNum, 'iatrogenic', val)}
              />
            </Box>

            {/* Note text field */}
            {showPopoverNoteInput && (
              <Box sx={{ mt: 2, mb: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  placeholder="Add note..."
                  value={popoverNoteValue}
                  onChange={(e) => setPopoverNoteValue(e.target.value)}
                  sx={{
                    '& .MuiInputBase-root': { fontSize: '0.75rem', p: 1 }
                  }}
                />
                <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: 'flex-end' }}>
                  <Button 
                    size="small" 
                    color="error" 
                    onClick={() => {
                      setPopoverNoteValue('');
                      handleSaveNote(activeToothNum, '');
                      setShowPopoverNoteInput(false);
                    }}
                    sx={{ textTransform: 'none', fontSize: '0.7rem', minWidth: 'auto', p: '2px 8px' }}
                  >
                    Delete Note
                  </Button>
                  <Button 
                    size="small" 
                    variant="contained" 
                    onClick={() => {
                      handleSaveNote(activeToothNum, popoverNoteValue);
                      setShowPopoverNoteInput(false);
                    }}
                    sx={{ textTransform: 'none', fontSize: '0.7rem', minWidth: 'auto', p: '2px 8px' }}
                  >
                    Save Note
                  </Button>
                </Stack>
              </Box>
            )}

            <Divider sx={{ my: 1.5 }} />

            {/* Bottom Actions Row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <IconButton 
                size="small" 
                color="error" 
                onClick={() => handleDeleteFinding(activeToothNum)}
                sx={{ p: 0.5 }}
              >
                <DeleteOutlineIcon sx={{ fontSize: 18 }} />
              </IconButton>

              {!showPopoverNoteInput && (
                <Button
                  size="small"
                  startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                  onClick={() => setShowPopoverNoteInput(true)}
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    color: '#1976d2',
                    p: 0,
                    '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                  }}
                >
                  + Add note
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Popover>
    </DentalSection>
  );
};

export default RadicularToothStructure;
