import React, { useState } from 'react';
import { 
  Box, Typography, Stack, IconButton, Button, Checkbox, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  TextField, Divider 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ScienceIcon from '@mui/icons-material/Science';

const EditProcedureFees = ({ onClose }) => {
  // Static data based on image reference
  const procedures = [
    { code: 'D0274', treatment: 'Bitewing Four Xrays', currentFee: 123.00, editedFee: 0, adjustment: 123.00, provider: 'Temp Hygiene' },
    { code: 'D1110', treatment: 'Prophy', options: 'Adult', currentFee: 195.00, editedFee: 0, adjustment: 195.00, provider: 'Temp Hygiene' },
    { code: 'D0120', treatment: 'Periodic Evaluation', currentFee: 109.00, editedFee: 0, adjustment: 109.00, provider: 'Christina Sabour' },
    { code: 'D1206', treatment: 'Fluoride', options: 'Varnish', currentFee: 37.00, editedFee: 0, adjustment: 37.00, provider: 'Temp Hygiene' },
    { code: 'D0210', treatment: 'Intraoral Full Mouth Xrays', currentFee: 199.00, editedFee: 0, adjustment: 199.00, provider: 'Temp Hygiene' },
  ];

  const headerBlue = '#5479b1';
  const subHeaderBlue = '#4a69bd';
  const summaryBg = '#f4f7fa';
  const borderCol = '#b4bedb';

  const [showRecareNote, setShowRecareNote] = useState(false);
  const [recareNote, setRecareNote] = useState('');
  const [showVisit1Note, setShowVisit1Note] = useState(false);
  const [visit1Note, setVisit1Note] = useState('');

  const [editedFees, setEditedFees] = useState(
    procedures.reduce((acc, _, i) => ({ ...acc, [i]: { dollar: '', percent: '' } }), {})
  );
  const [adjustments, setAdjustments] = useState(
    procedures.reduce((acc, _, i) => ({ ...acc, [i]: '' }), {})
  );

  const handleClearFees = () => {
    setEditedFees(procedures.reduce((acc, _, i) => ({ ...acc, [i]: { dollar: '', percent: '' } }), {}));
    setAdjustments(procedures.reduce((acc, _, i) => ({ ...acc, [i]: '' }), {}));
  };

  const handleFeeChange = (idx, field, value) => {
    setEditedFees(prev => ({
      ...prev,
      [idx]: { ...prev[idx], [field]: value }
    }));
  };

  const handleAdjustmentChange = (idx, value) => {
    setAdjustments(prev => ({ ...prev, [idx]: value }));
  };

  return (
    <Box sx={{ width: '100%', bgcolor: '#fff', borderRadius: 0, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ bgcolor: headerBlue, color: '#fff', px: 2, py: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>Edit Procedures Fees</Typography>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, color: '#fff', p: 0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ p: 2.5 }}>
        <Typography sx={{ fontStyle: 'italic', color: subHeaderBlue, fontSize: '13px', mb: 2, fontWeight: 500 }}>
          Edit fees manually and/or apply adjustment to procedures
        </Typography>

        {/* Phase Summary Bar */}
        <Box sx={{ bgcolor: summaryBg, p: 1, borderRadius: 1, mb: 3, display: 'flex', alignItems: 'center', gap: 4, border: '1px solid #eef2f6' }}>
           <Stack direction="row" spacing={0.5} alignItems="center">
             <Checkbox size="small" defaultChecked sx={{ p: 0, color: '#5479b1' }} />
             <Typography sx={{ fontWeight: 700, fontSize: '12px', color: headerBlue }}>Phase 1</Typography>
           </Stack>
           <Typography sx={{ fontWeight: 700, fontSize: '12px', color: headerBlue }}>PT. PORTION: $0.00</Typography>
           <Typography sx={{ fontWeight: 700, fontSize: '12px', color: headerBlue }}>INS. PORTION: $0.00</Typography>
           <Typography sx={{ fontWeight: 700, fontSize: '12px', color: headerBlue }}>ADJ: $0.00</Typography>
           <Typography sx={{ fontWeight: 700, fontSize: '12px', color: headerBlue }}>TOTAL BILLED FEE: $0.00</Typography>
        </Box>

        {/* Sections Wrapper */}
        <Box sx={{ maxHeight: '500px', overflowY: 'auto', pr: 1 }}>
          
          {/* Recare Section */}
          <Box sx={{ border: `1px solid ${borderCol}`, borderRadius: 1.5, mb: 3, overflow: 'hidden' }}>
            <Box sx={{ px: 1.5, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Checkbox size="small" defaultChecked sx={{ p: 0 }} />
                <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#333' }}>Recare</Typography>
                {showRecareNote ? (
                  <TextField 
                    size="small" 
                    placeholder="Enter note..." 
                    value={recareNote}
                    onChange={(e) => setRecareNote(e.target.value)}
                    sx={{ width: 150, '& .MuiInputBase-input': { p: '2px 8px', fontSize: '11px' } }}
                  />
                ) : (
                  <Typography 
                    onClick={() => setShowRecareNote(true)}
                    sx={{ fontSize: '11px', color: subHeaderBlue, cursor: 'pointer', fontWeight: 600 }}
                  >
                    +add note
                  </Typography>
                )}
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: '#ccc', cursor: 'not-allowed' }}>
                <ScienceIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: '11px', fontWeight: 700 }}>+ Lab Order</Typography>
              </Stack>
            </Box>

            <TableContainer>
              <Table size="small" sx={{ borderTop: `1px solid ${borderCol}` }}>
                <TableHead sx={{ bgcolor: '#fff' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Tooth#</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Surf</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Treatment</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Options</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Current Fee</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Edited Fee</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Adjustment</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Total fee</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Provider</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {procedures.map((row, idx) => (
                    <TableRow key={idx} sx={{ bgcolor: idx % 2 === 0 ? '#f9fbff' : '#fff' }}>
                      <TableCell sx={{ borderBottom: 'none' }}></TableCell>
                      <TableCell sx={{ borderBottom: 'none' }}></TableCell>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 600, borderBottom: 'none' }}>{row.code}</TableCell>
                      <TableCell sx={{ fontSize: '11px', borderBottom: 'none' }}>{row.treatment}</TableCell>
                      <TableCell sx={{ fontSize: '11px', borderBottom: 'none' }}>{row.options || ''}</TableCell>
                      <TableCell sx={{ fontSize: '11px', borderBottom: 'none' }}>${row.currentFee.toFixed(2)}</TableCell>
                      <TableCell sx={{ borderBottom: 'none' }}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography sx={{ fontSize: '11px', color: '#666' }}>$</Typography>
                        <TextField 
                          size="small" 
                          value={editedFees[idx]?.dollar || ''}
                          onChange={(e) => handleFeeChange(idx, 'dollar', e.target.value)}
                          sx={{ width: 65, '& .MuiInputBase-input': { p: 0.5, fontSize: '11px', bgcolor: '#fff' } }} 
                        />
                        <TextField 
                          size="small" 
                          placeholder="0" 
                          value={editedFees[idx]?.percent || ''}
                          onChange={(e) => handleFeeChange(idx, 'percent', e.target.value)}
                          sx={{ width: 40, '& .MuiInputBase-input': { p: 0.5, fontSize: '11px', bgcolor: '#fff' } }} 
                        />
                        <Typography sx={{ fontSize: '11px', color: '#666' }}>%</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ borderBottom: 'none' }}>
                       <Stack direction="row" alignItems="center" spacing={0.5}>
                         <TextField 
                           size="small" 
                           placeholder="(+/-)" 
                           value={adjustments[idx] || ''}
                           onChange={(e) => handleAdjustmentChange(idx, e.target.value)}
                           sx={{ width: 90, '& .MuiInputBase-input': { p: 0.5, fontSize: '11px', bgcolor: '#fff' } }} 
                         />
                         <Typography sx={{ fontSize: '11px', color: '#666' }}>%</Typography>
                       </Stack>
                    </TableCell>
                      <TableCell sx={{ fontSize: '11px', borderBottom: 'none' }}>{row.adjustment.toFixed(2)}</TableCell>
                      <TableCell sx={{ fontSize: '11px', borderBottom: 'none', lineHeight: 1.1 }}>{row.provider}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Visit 1 Section */}
          <Box sx={{ border: `1px solid ${borderCol}`, borderRadius: 1.5, mb: 2, overflow: 'hidden' }}>
            <Box sx={{ px: 1.5, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Checkbox size="small" sx={{ p: 0 }} />
                <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#333' }}>Visit 1</Typography>
                {showVisit1Note ? (
                  <TextField 
                    size="small" 
                    placeholder="Enter note..." 
                    value={visit1Note}
                    onChange={(e) => setVisit1Note(e.target.value)}
                    sx={{ width: 150, '& .MuiInputBase-input': { p: '2px 8px', fontSize: '11px' } }}
                  />
                ) : (
                  <Typography 
                    onClick={() => setShowVisit1Note(true)}
                    sx={{ fontSize: '11px', color: subHeaderBlue, cursor: 'pointer', fontWeight: 600 }}
                  >
                    +add note
                  </Typography>
                )}
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: '#ccc', cursor: 'not-allowed' }}>
                <ScienceIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: '11px', fontWeight: 700 }}>+ Lab Order</Typography>
              </Stack>
            </Box>
            <Divider sx={{ borderColor: borderCol }} />
            <TableContainer sx={{ p: 1.5 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Tooth#</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Surf</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Treatment</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Options</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Current Fee</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Edited Fee</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Adjustment</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Total fee</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Provider</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
          </Box>
        </Box>

        {/* Footer Buttons */}
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            onClick={handleClearFees}
            sx={{ bgcolor: headerBlue, textTransform: 'none', borderRadius: 1.5, px: 2, fontSize: '13px', fontWeight: 600 }}
          >
            Clear Edited Fees
          </Button>
          <Stack direction="row" spacing={1.5}>
            <Button variant="contained" sx={{ bgcolor: '#ccaa70', textTransform: 'none', borderRadius: 1.5, px: 4, fontSize: '13px', fontWeight: 600, '&:hover': { bgcolor: '#b89a63' } }}>
              Save
            </Button>
            <Button variant="contained" onClick={onClose} sx={{ bgcolor: '#aeb9c4', textTransform: 'none', borderRadius: 1.5, px: 4, fontSize: '13px', fontWeight: 600, '&:hover': { bgcolor: '#9aa7b3' } }}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default EditProcedureFees;
