import React, { useState } from "react";
import { 
  Box, Card, Typography, Checkbox, FormControlLabel, Stack, Divider,
  Button, Popover, IconButton, RadioGroup, Radio, TextField
} from "@mui/material";
import KeyboardDoubleArrowUp from '@mui/icons-material/KeyboardDoubleArrowUp';
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { fontSize, fontWeight } from "../../../constants/styles";
import RestorationToothIcon from "../common/RestorationToothIcon";

const DentalSection = ({ title, children, badge }) => {
  const [noFindings, setNoFindings] = useState(false);
  return (
  <Card sx={{ mb: 1, borderRadius: 0, border: '1px solid #6b7cb4', bgcolor: 'white' }}>
    <Box sx={{ 
      bgcolor: '#6b7cb4', color: 'white', px: 1.5, py: 0.4, 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
    }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold }}>{title}</Typography>
        {badge && (
          <Box sx={{ bgcolor: '#e57373', px: 0.5, borderRadius: '2px', fontSize: fontSize.xs, fontWeight: fontWeight.bold }}>{badge}</Box>
        )}
      </Stack>
      <FormControlLabel
        control={<Checkbox size="small" checked={noFindings} onChange={(e) => setNoFindings(e.target.checked)} sx={{ p: 0.25, color: 'white', '&.Mui-checked': { color: 'white' } }} />}
        label={<Typography sx={{ fontSize: fontSize.xs, fontStyle: 'italic' }}>no findings</Typography>}
        labelPlacement="start"
        sx={{ ml: 0 }}
      />
    </Box>
    <Box sx={{ p: 1.5, ...(noFindings && { opacity: 0.5, pointerEvents: 'none', userSelect: 'none' }) }}>{children}</Box>
  </Card>
  );
};

const Row = ({ label, children, hasChat = false, isGray = false }) => (
  <Box sx={{ py: 1 }}>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Typography sx={{ 
          fontSize: fontSize.sm, 
          color: isGray ? '#ccc' : '#444',
          fontWeight: isGray ? fontWeight.regular : fontWeight.medium 
        }}>
          {label}
        </Typography>
        {hasChat && <ChatBubbleOutline sx={{ fontSize: 13, color: '#bbb' }} />}
      </Stack>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 0.5, maxWidth: '70%' }}>
        {children}
      </Box>
    </Stack>
  </Box>
);

const ExistingRestorations = ({ 
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

  const handleApplyDirectRestoration = (type) => {
    if (!selectedTeeth || selectedTeeth.length === 0) return;

    setToothFindings(prev => {
      const updated = { ...prev };
      selectedTeeth.forEach(num => {
        if (!updated[num]) {
          updated[num] = {
            findings: ['Existing Restoration (Direct)'],
            restorationType: type,
            surfaces: ['O/I'], // default surface
            isthmus: '< 1/3',
            concerns: [],
            notes: []
          };
        } else if (!updated[num].findings.includes('Existing Restoration (Direct)')) {
          updated[num] = {
            ...updated[num],
            findings: [...updated[num].findings, 'Existing Restoration (Direct)'],
            restorationType: type,
            surfaces: updated[num].surfaces || ['O/I'],
            isthmus: updated[num].isthmus || '< 1/3',
            concerns: updated[num].concerns || []
          };
        } else {
          updated[num] = {
            ...updated[num],
            restorationType: type
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

  const handleUpdateRestorationType = (toothNum, type) => {
    setToothFindings(prev => {
      const updated = { ...prev };
      if (updated[toothNum]) {
        updated[toothNum] = {
          ...updated[toothNum],
          restorationType: type
        };
      }
      return updated;
    });
  };

  const handleUpdateIsthmus = (toothNum, isthmus) => {
    setToothFindings(prev => {
      const updated = { ...prev };
      if (updated[toothNum]) {
        updated[toothNum] = {
          ...updated[toothNum],
          isthmus: isthmus
        };
      }
      return updated;
    });
  };

  const handleToggleConcern = (toothNum, concern) => {
    setToothFindings(prev => {
      const updated = { ...prev };
      if (!updated[toothNum]) return prev;
      const curConcerns = updated[toothNum].concerns || [];
      if (curConcerns.includes(concern)) {
        updated[toothNum] = {
          ...updated[toothNum],
          concerns: curConcerns.filter(c => c !== concern)
        };
      } else {
        updated[toothNum] = {
          ...updated[toothNum],
          concerns: [...curConcerns, concern]
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
      delete updated[toothNum];
      return updated;
    });
    if (activeToothNum === toothNum) {
      setActiveToothNum(null);
    }
    handlePopoverClose();
  };

  const activeToothData = activeToothNum ? toothFindings[activeToothNum] : null;

  return (
    <DentalSection title="Existing Restorations" badge="DH">
      {expanded && (
        <>
          {/* Direct Section */}
          <Row label="Direct">
            <Stack direction="row" spacing={0.2}>
              <Box onClick={() => handleApplyDirectRestoration('Composite')} sx={{ cursor: 'pointer' }}><RestorationToothIcon fill="#fff" /></Box>
              <Box onClick={() => handleApplyDirectRestoration('Amalgam')} sx={{ cursor: 'pointer' }}><RestorationToothIcon fill="#666" /></Box>
              <Box onClick={() => handleApplyDirectRestoration('Temporary')} sx={{ cursor: 'pointer' }}><RestorationToothIcon fill="#eee" /></Box>
              <Box onClick={() => handleApplyDirectRestoration('Gold')} sx={{ cursor: 'pointer' }}><RestorationToothIcon fill="#ffd700" /></Box>
              <Box onClick={() => handleApplyDirectRestoration('Sealant')} sx={{ cursor: 'pointer' }}><RestorationToothIcon fill="#add8e6" /></Box>
            </Stack>
          </Row>
          
          {/* Badges for active direct restorations */}
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" flexWrap="wrap" useFlexGap mb={1}>
            {Object.entries(toothFindings)
              .filter(([, data]) => data && data.findings && data.findings.includes('Existing Restoration (Direct)'))
              .map(([toothNum, data]) => {
                const surfacesAbbr = (data.surfaces || []).map(s => s === 'O/I' ? 'O' : s).join('');
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

          <Divider />

          {/* Indirect Section */}
          <Row label="Indirect">
            <Stack direction="row" spacing={0.2}>
              <RestorationToothIcon fill="#ffd700" />
              <RestorationToothIcon fill="#fff" />
              <RestorationToothIcon fill="#444" />
              <RestorationToothIcon fill="#eee" />
              <RestorationToothIcon fill="#fff" />
              <RestorationToothIcon fill="#fff" />
              <RestorationToothIcon type="incisor" fill="#eee" />
              <RestorationToothIcon fill="#b39ddb" />
            </Stack>
          </Row>

          <Divider />

          {/* Isthmus Section */}
          <Row label="Isthmus" isGray>
            <Stack direction="row" spacing={0.2}>
              <RestorationToothIcon fill="#e8f5e9" />
              <RestorationToothIcon fill="#fffde7" />
              <RestorationToothIcon fill="#ffebee" />
            </Stack>
          </Row>

          <Divider />

          {/* Restoration Concerns Section */}
          <Row label="Restoration Concerns">
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.2 }}>
              <RestorationToothIcon status="occlusal" />
              <RestorationToothIcon status="gold" />
              <RestorationToothIcon fill="#ffd700" />
              <RestorationToothIcon fill="#eee" />
              <RestorationToothIcon fill="#ffd700" />
              <RestorationToothIcon type="incisor" fill="#fff" />
              <RestorationToothIcon fill="#fff" />
              <Box /> <Box /> <Box />
              <RestorationToothIcon fill="#ffd700" />
              <RestorationToothIcon status="forbidden" fill="#999" />
              <RestorationToothIcon fill="#ffd700" />
              <RestorationToothIcon fill="#ffd700" />
            </Box>
          </Row>

          <Divider />

          {/* Bridge Section */}
          <Row label="Bridge" hasChat>
            <Stack direction="row" spacing={0.5}>
              {[
                { c1: '#fff', c2: '#fff' },
                { c1: '#fff', c2: '#999' },
                { c1: '#ffd700', c2: '#ffd700' },
                { c1: '#999', c2: '#999' },
                { c1: '#add8e6', c2: '#add8e6' },
                { c1: '#b39ddb', c2: '#b39ddb' }
              ].map((b, i) => (
                <Box key={i} sx={{ 
                  width: 24, height: 24, borderRadius: '4px', border: '1px solid #999',
                  background: `linear-gradient(135deg, ${b.c1} 50%, ${b.c2} 50%)`
                }} />
              ))}
            </Stack>
          </Row>

          <Divider />

          {/* Denture Section */}
          <Row label="Denture" hasChat />
          
          {/* Footer Expand Icon */}
          <Box 
            sx={{ display: 'flex', justifyContent: 'center', mt: 1, cursor: 'pointer' }}
            onClick={onToggle}
          >
            <KeyboardDoubleArrowUp 
              sx={{ 
                fontSize: 20, 
                color: '#666',
                transform: 'rotate(180deg)',
                transition: 'transform 0.3s'
              }} 
            />
          </Box>
        </>
      )}
      
      {!expanded && (
        <Box 
          sx={{ display: 'flex', justifyContent: 'center', p: 1, cursor: 'pointer', bgcolor: '#fafafa' }}
          onClick={onToggle}
        >
          <KeyboardDoubleArrowUp 
            sx={{ 
              fontSize: 20, 
              color: '#666',
              transform: 'rotate(0deg)',
              transition: 'transform 0.3s'
            }} 
          />
        </Box>
      )}

      {/* Popover for Detailed Direct Restorations Form */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            p: 3,
            width: 380,
            maxHeight: 500,
            overflowY: 'auto',
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
          <Box>
            {/* Restoration Type Direct Selection */}
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', mb: 0.5 }}>Restoration Type:</Typography>
            <Box sx={{ pl: 1, mb: 1.5 }}>
              <Typography sx={{ fontSize: '0.78rem', color: '#64748b' }}>Direct:</Typography>
              <RadioGroup
                row
                value={activeToothData.restorationType || 'Composite'}
                onChange={(e) => handleUpdateRestorationType(activeToothNum, e.target.value)}
              >
                {['Composite', 'Amalgam', 'Temporary', 'Gold', 'Sealant'].map(type => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={<Radio size="small" />}
                    label={<Typography sx={{ fontSize: '0.75rem' }}>{type}</Typography>}
                    sx={{ mr: 1 }}
                  />
                ))}
              </RadioGroup>
            </Box>

            {/* Surface Selection */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Surface:</Typography>
              <Stack direction="row" spacing={0.5}>
                {['D', 'O/I', 'M', 'L', 'B/F', 'C'].map(surf => {
                  const isSel = (activeToothData.surfaces || []).includes(surf);
                  return (
                    <Button
                      key={surf}
                      size="small"
                      variant={isSel ? "contained" : "outlined"}
                      onClick={() => handleToggleSurface(activeToothNum, surf)}
                      sx={{
                        fontSize: '0.7rem',
                        p: '2px 6px',
                        minWidth: 26,
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
                      {surf}
                    </Button>
                  );
                })}
              </Stack>
            </Box>

            {/* Isthmus Radio Selection */}
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', mb: 0.5 }}>Isthmus:</Typography>
            <RadioGroup
              row
              value={activeToothData.isthmus || '< 1/3'}
              onChange={(e) => handleUpdateIsthmus(activeToothNum, e.target.value)}
              sx={{ pl: 1, mb: 2 }}
            >
              {['< 1/3', '1/3 - 1/2', '> 1/2'].map(opt => (
                <FormControlLabel
                  key={opt}
                  value={opt}
                  control={<Radio size="small" />}
                  label={<Typography sx={{ fontSize: '0.75rem' }}>{opt}</Typography>}
                  sx={{ mr: 2 }}
                />
              ))}
            </RadioGroup>

            {/* Concerns Checkboxes */}
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', mb: 0.5 }}>Concerns:</Typography>
            <Box sx={{ pl: 1, mb: 2 }}>
              <Typography sx={{ fontSize: '0.78rem', color: '#64748b', mb: 0.5 }}>Marginal Integrity:</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2, mb: 1 }}>
                {['Caries', 'Open Margin', 'Margin Overhang', 'Margin Leakage', 'Deep margin (Violation of biologic width)'].map(concern => {
                  const isChecked = (activeToothData.concerns || []).includes(concern);
                  return (
                    <FormControlLabel
                      key={concern}
                      control={
                        <Checkbox 
                          size="small" 
                          checked={isChecked}
                          onChange={() => handleToggleConcern(activeToothNum, concern)}
                          sx={{ py: 0.2 }}
                        />
                      }
                      label={<Typography sx={{ fontSize: '0.75rem' }}>{concern}</Typography>}
                      sx={{ my: -0.1 }}
                    />
                  );
                })}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2 }}>
                {['Chipped Restoration', 'Compromised Occlusal Surface', 'Inappropriate Contour', 'Alloy Sensitivity', 'Fracture'].map(concern => {
                  const isChecked = (activeToothData.concerns || []).includes(concern);
                  return (
                    <FormControlLabel
                      key={concern}
                      control={
                        <Checkbox 
                          size="small" 
                          checked={isChecked}
                          onChange={() => handleToggleConcern(activeToothNum, concern)}
                          sx={{ py: 0.2 }}
                        />
                      }
                      label={<Typography sx={{ fontSize: '0.75rem' }}>{concern}</Typography>}
                      sx={{ my: -0.1 }}
                    />
                  );
                })}
              </Box>
            </Box>

            {/* Notes Section */}
            {showPopoverNoteInput ? (
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  placeholder="Add note..."
                  value={popoverNoteValue}
                  onChange={(e) => setPopoverNoteValue(e.target.value)}
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem', p: 1 } }}
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
                  mb: 2,
                  '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                }}
              >
                + Add note
              </Button>
            )}

            <Divider sx={{ my: 1.5 }} />

            {/* Delete button */}
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
    </DentalSection>
  );
};

export default ExistingRestorations;
