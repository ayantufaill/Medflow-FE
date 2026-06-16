import React, { useState } from "react";
import { 
  Box, Card, Typography, Checkbox, FormControlLabel, Stack, Divider, 
  Button, Popover, IconButton, RadioGroup, Radio, TextField 
} from "@mui/material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { fontSize, fontWeight } from "../../../constants/styles";
import ToothIcon from "../common/ToothIcon";

const HeaderLabel = ({ children }) => (
  <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: '#333' }}>
    {children}
  </Typography>
);

const Lesions = ({ 
  expanded, 
  onToggle,
  toothFindings = {},
  setToothFindings,
  selectedTeeth = [],
  setSelectedTeeth,
  activeToothNum = null,
  setActiveToothNum
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showPopoverNoteInput, setShowPopoverNoteInput] = useState(false);
  const [popoverNoteValue, setPopoverNoteValue] = useState('');

  const handleApplyCaries = () => {
    if (!selectedTeeth || selectedTeeth.length === 0) return;
    
    setToothFindings(prev => {
      const updated = { ...prev };
      selectedTeeth.forEach(num => {
        if (!updated[num]) {
          updated[num] = {
            findings: ['Coronal cavitation (Caries)'],
            surfaces: ['O/I'], // default surfaces
            depth: 'Limited to enamel',
            notes: []
          };
        } else if (!updated[num].findings.includes('Coronal cavitation (Caries)')) {
          updated[num] = {
            ...updated[num],
            findings: [...updated[num].findings, 'Coronal cavitation (Caries)'],
            surfaces: updated[num].surfaces || ['O/I'],
            depth: updated[num].depth || 'Limited to enamel'
          };
        }
      });
      return updated;
    });
    
    // Set the first applied tooth as active
    setActiveToothNum(selectedTeeth[0]);
  };

  const handleBadgeClick = (event, toothNum) => {
    setAnchorEl(event.currentTarget);
    setActiveToothNum(toothNum);
    
    // Pre-fill note if existing
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

  const handleToggleSurface = (toothNum, surface) => {
    setToothFindings(prev => {
      const updated = { ...prev };
      if (!updated[toothNum]) return prev;
      const curSurfaces = updated[toothNum].surfaces || [];
      if (curSurfaces.includes(surface)) {
        updated[toothNum] = {
          ...updated[toothNum],
          surfaces: curSurfaces.filter(s => s !== surface)
        };
      } else {
        updated[toothNum] = {
          ...updated[toothNum],
          surfaces: [...curSurfaces, surface]
        };
      }
      return updated;
    });
  };

  const handleUpdateDepth = (toothNum, depth) => {
    setToothFindings(prev => {
      const updated = { ...prev };
      if (updated[toothNum]) {
        updated[toothNum] = {
          ...updated[toothNum],
          depth: depth
        };
      }
      return updated;
    });
  };

  // Batch update depth for all currently selected teeth
  const handleUpdateDepthForSelected = (depth) => {
    if (!selectedTeeth || selectedTeeth.length === 0) return;
    
    setToothFindings(prev => {
      const updated = { ...prev };
      selectedTeeth.forEach(num => {
        if (!updated[num]) {
          updated[num] = {
            findings: ['Coronal cavitation (Caries)'],
            surfaces: ['O/I'], // default
            depth: depth,
            notes: []
          };
        } else {
          updated[num] = {
            ...updated[num],
            findings: [...new Set([...(updated[num].findings || []), 'Coronal cavitation (Caries)'])],
            depth: depth
          };
        }
      });
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
          updatedNotes.pop(); // Remove if empty
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
      delete updated[toothNum];
      return updated;
    });
    if (activeToothNum === toothNum) {
      setActiveToothNum(null);
    }
    handlePopoverClose();
  };

  // Determine active depth based on current selection or active badge
  const getSelectedTeethDepth = () => {
    if (selectedTeeth.length === 0) return null;
    const firstToothWithFinding = selectedTeeth.find(num => toothFindings[num]);
    if (!firstToothWithFinding) return null;
    return toothFindings[firstToothWithFinding]?.depth || null;
  };

  const activeToothData = activeToothNum ? toothFindings[activeToothNum] : null;
  const currentDepth = getSelectedTeethDepth() || (activeToothNum ? toothFindings[activeToothNum]?.depth : null) || 'Limited to enamel';
  const hasActiveSelection = selectedTeeth.length > 0 || activeToothNum !== null;

  const getIconStyle = (depthVal) => {
    const isMatched = currentDepth === depthVal && hasActiveSelection;
    return {
      cursor: hasActiveSelection ? 'pointer' : 'default',
      transition: 'all 0.2s ease-in-out',
      borderRadius: '4px',
      border: isMatched ? '2px solid #1976d2' : '2px solid transparent',
      boxShadow: isMatched ? '0px 0px 8px rgba(25, 118, 210, 0.4)' : 'none',
      transform: isMatched ? 'scale(1.15)' : 'scale(1)',
      opacity: hasActiveSelection ? 1 : 0.6,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    };
  };

  return (
    <Card sx={{ mb: 1, borderRadius: 0, border: '1px solid #6b7cb4', bgcolor: 'white' }}>
      <Box sx={{ 
        bgcolor: '#6b7cb4', color: 'white', px: 1.5, py: 0.4, 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold }}>Lesions</Typography>
          <Box sx={{ bgcolor: '#e57373', px: 0.5, borderRadius: '2px', fontSize: fontSize.xs, fontWeight: fontWeight.bold }}>DH</Box>
        </Stack>
        <FormControlLabel
          control={<Checkbox size="small" sx={{ p: 0.25, color: 'white', '&.Mui-checked': { color: 'white' } }} />}
          label={<Typography sx={{ fontSize: fontSize.xs, fontStyle: 'italic' }}>no findings</Typography>}
          labelPlacement="start"
          sx={{ ml: 0 }}
        />
      </Box>
      
      {expanded && (
        <Box sx={{ p: 1.5 }}>
          {/* Coronal Cavitation Row */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Stack 
              direction="row" 
              spacing={0.5} 
              alignItems="center"
              onClick={handleApplyCaries}
              sx={selectedTeeth.length > 0 ? { cursor: 'pointer', '&:hover': { opacity: 0.8 } } : { opacity: 0.8 }}
            >
              <HeaderLabel>Coronal Cavitation (Caries)</HeaderLabel>
              <ChatBubbleOutlineIcon sx={{ fontSize: 14, color: '#999' }} />
            </Stack>
            
            {/* Interactive teeth icons for depth control */}
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Box 
                onClick={() => {
                  if (selectedTeeth.length > 0) {
                    handleUpdateDepthForSelected('Limited to enamel');
                  } else if (activeToothNum) {
                    handleUpdateDepth(activeToothNum, 'Limited to enamel');
                  }
                }}
                sx={getIconStyle('Limited to enamel')}
                title="Limited to enamel (White)"
              >
                <ToothIcon type="caries" color="#fff" />
              </Box>
              <Box 
                onClick={() => {
                  if (selectedTeeth.length > 0) {
                    handleUpdateDepthForSelected('Into dentin');
                  } else if (activeToothNum) {
                    handleUpdateDepth(activeToothNum, 'Into dentin');
                  }
                }}
                sx={getIconStyle('Into dentin')}
                title="Into dentin (Yellow)"
              >
                <ToothIcon type="caries" color="#f3e5ab" />
              </Box>
              <Box 
                onClick={() => {
                  if (selectedTeeth.length > 0) {
                    handleUpdateDepthForSelected('Deep into dentin');
                  } else if (activeToothNum) {
                    handleUpdateDepth(activeToothNum, 'Deep into dentin');
                  }
                }}
                sx={getIconStyle('Deep into dentin')}
                title="Deep into dentin (Brown)"
              >
                <ToothIcon type="caries" color="#d7ccc8" />
              </Box>
            </Stack>
          </Stack>

          {/* Badges for active findings aligned to the right, below the teeth icons */}
          <Stack direction="row" spacing={0.8} justifyContent="flex-end" flexWrap="wrap" useFlexGap sx={{ mb: 2, pr: 0.5 }}>
            {Object.entries(toothFindings)
              .filter(([, data]) => data && data.findings && data.findings.includes('Coronal cavitation (Caries)'))
              .map(([toothNum, data]) => {
                const surfacesAbbr = (data.surfaces || []).map(s => {
                  if (s === 'O/I') return 'O';
                  return s;
                }).join('');
                
                const label = `${toothNum} ${surfacesAbbr}`;
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
                    {label}
                  </Button>
                );
              })}
          </Stack>
          
          <Divider sx={{ my: 1.5 }} />
          
          {/* Radicular Cavitation Row */}
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: '#bca67a', cursor: 'pointer' }}>
            <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold }}>
              Radicular Cavitation, White Spot Lesion
            </Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
          </Stack>

          {/* Footer Expand Icon */}
          <Box 
            sx={{ display: 'flex', justifyContent: 'center', mt: 1, cursor: 'pointer' }}
            onClick={onToggle}
          >
            <KeyboardDoubleArrowUpIcon 
              sx={{ 
                fontSize: 20, 
                color: '#666',
                transform: 'rotate(180deg)',
                transition: 'transform 0.3s'
              }} 
            />
          </Box>
        </Box>
      )}
      
      {!expanded && (
        <Box 
          sx={{ display: 'flex', justifyContent: 'center', p: 1, cursor: 'pointer', bgcolor: '#fafafa' }}
          onClick={onToggle}
        >
          <KeyboardDoubleArrowUpIcon 
            sx={{ 
              fontSize: 20, 
              color: '#666',
              transform: 'rotate(0deg)',
              transition: 'transform 0.3s'
            }} 
          />
        </Box>
      )}

      {/* Popover for active findings */}
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
            p: 2,
            width: 250,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
            border: '1px solid #6b7cb4',
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
            {/* Surfaces Selection */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
              <Typography sx={{ fontSize: '0.8rem', color: '#555', fontWeight: 600 }}>Surface:</Typography>
              <Stack direction="row" spacing={0.5}>
                {['M', 'O/I', 'D', 'B/F', 'L'].map(surface => {
                  const isSel = (activeToothData.surfaces || []).includes(surface);
                  return (
                    <Button
                      key={surface}
                      size="small"
                      variant={isSel ? "contained" : "outlined"}
                      onClick={() => handleToggleSurface(activeToothNum, surface)}
                      sx={{
                        fontSize: '0.7rem',
                        p: '2px 6px',
                        minWidth: 'auto',
                        lineHeight: 1.1,
                        bgcolor: isSel ? '#1976d2' : '#fff',
                        color: isSel ? '#fff' : '#555',
                        borderColor: isSel ? '#1976d2' : '#ccc',
                        fontWeight: 'bold',
                        '&:hover': {
                          bgcolor: isSel ? '#1565c0' : '#f5f5f5',
                          borderColor: isSel ? '#1565c0' : '#bbb',
                        }
                      }}
                    >
                      {surface}
                    </Button>
                  );
                })}
              </Stack>
            </Box>

            {/* Depth Radio Buttons */}
            <RadioGroup
              value={activeToothData.depth || 'Limited to enamel'}
              onChange={(e) => handleUpdateDepth(activeToothNum, e.target.value)}
              sx={{ mb: 1.5 }}
            >
              {[
                'Limited to enamel',
                'Into dentin',
                'Deep into dentin'
              ].map(opt => (
                <FormControlLabel
                  key={opt}
                  value={opt}
                  control={<Radio size="small" sx={{ py: 0.3 }} />}
                  label={<Typography sx={{ fontSize: '0.75rem', color: '#333' }}>{opt}</Typography>}
                  sx={{ my: -0.1, ml: -0.5 }}
                />
              ))}
            </RadioGroup>

            {/* Note text field */}
            {showPopoverNoteInput ? (
              <Box sx={{ mb: 1.5 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  placeholder="Add note..."
                  value={popoverNoteValue}
                  onChange={(e) => setPopoverNoteValue(e.target.value)}
                  onBlur={() => handleSaveNote(activeToothNum, popoverNoteValue)}
                  sx={{
                    '& .MuiInputBase-root': { fontSize: '0.75rem', p: 1 }
                  }}
                />
              </Box>
            ) : (
              <Button
                size="small"
                startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                onClick={() => setShowPopoverNoteInput(true)}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  color: '#1976d2',
                  p: 0,
                  mb: 1.5,
                  '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                }}
              >
                + Add note
              </Button>
            )}

            <Divider sx={{ my: 1 }} />

            {/* Delete button (trash icon) */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <IconButton 
                size="small" 
                color="error" 
                onClick={() => handleDeleteFinding(activeToothNum)}
                sx={{ p: 0.5 }}
              >
                <DeleteOutlineIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
        )}
      </Popover>
    </Card>
  );
};

export default Lesions;
