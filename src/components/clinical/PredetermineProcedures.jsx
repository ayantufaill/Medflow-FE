import React, { useState } from 'react';
import { 
  Box, Typography, Stack, IconButton, Button, Checkbox, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  TextField, Divider, Chip, Menu, MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ScienceIcon from '@mui/icons-material/Science';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const PredetermineProcedures = ({ onClose }) => {
  const headerBlue = '#5479b1';
  const subHeaderBlue = '#4a69bd';
  const summaryBg = '#f4f7fa';
  const borderCol = '#b4bedb';

  const procedures = [
    { code: 'D0274', treatment: 'Bitewing Four Xrays', options: '', pt: 123.00, ins: 0.00, adj: 0.00, officeFee: 123.00, billedFee: 123.00, provider: 'KAR', providerColor: '#a3b1d6', status: 'D', date: '04/30/2026' },
    { code: 'D1110', treatment: 'Prophy', options: 'Adult', pt: 195.00, ins: 0.00, adj: 0.00, officeFee: 195.00, billedFee: 195.00, provider: 'KAR', providerColor: '#a3b1d6', status: 'D', date: '04/30/2026' },
    { code: 'D0120', treatment: 'Periodic Evaluation', options: '', pt: 109.00, ins: 0.00, adj: 0.00, officeFee: 109.00, billedFee: 109.00, provider: 'SAB', providerColor: '#c8e6c9', status: 'D', date: '04/30/2026' },
    { code: 'D1206', treatment: 'Fluoride', options: 'Varnish', pt: 37.00, ins: 0.00, adj: 0.00, officeFee: 37.00, billedFee: 37.00, provider: 'KAR', providerColor: '#a3b1d6', status: 'D', date: '04/30/2026', badge: 'DBI' },
    { code: 'D0210', treatment: 'Intraoral Full Mouth', options: '', pt: 199.00, ins: 0.00, adj: 0.00, officeFee: 199.00, billedFee: 199.00, provider: 'KAR', providerColor: '#a3b1d6', status: 'D', date: '04/30/2026' },
  ];

  const [rowProviders, setRowProviders] = useState(
    procedures.map(p => ({ name: p.provider, color: p.providerColor }))
  );
  const [rowTreatments, setRowTreatments] = useState(procedures.map(p => p.treatment));
  const [rowOptions, setRowOptions] = useState(procedures.map(p => p.options));

  const [showRecareNote, setShowRecareNote] = useState(false);
  const [recareNote, setRecareNote] = useState('');
  const [showVisit1Note, setShowVisit1Note] = useState(false);
  const [visit1Note, setVisit1Note] = useState('');

  const [selectedRows, setSelectedRows] = useState(procedures.map(() => true));
  const [recareChecked, setRecareChecked] = useState(true);

  const [policyAnchor, setPolicyAnchor] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState('Primary');

  const [providerAnchor, setProviderAnchor] = useState(null);
  const [treatmentAnchor, setTreatmentAnchor] = useState(null);
  const [optionsAnchor, setOptionsAnchor] = useState(null);
  const [activeRowIdx, setActiveRowIdx] = useState(null);

  const policyOptions = ['Primary', 'Secondary', 'Tertiary'];
  const providerOptions = [
    { name: 'KAR', color: '#a3b1d6' },
    { name: 'SAB', color: '#c8e6c9' },
    { name: 'TMP', color: '#ffd54f' }
  ];
  const treatmentDropdownOptions = [
    'Bitewing Four Xrays',
    'Prophy',
    'Periodic Evaluation',
    'Fluoride',
    'Intraoral Full Mouth'
  ];
  const optionsDropdownOptions = ['Adult', 'Child', 'Varnish', 'None'];

  const handleProviderClick = (event, idx) => {
    setProviderAnchor(event.currentTarget);
    setActiveRowIdx(idx);
  };

  const handleTreatmentClick = (event, idx) => {
    setTreatmentAnchor(event.currentTarget);
    setActiveRowIdx(idx);
  };

  const handleOptionsClick = (event, idx) => {
    setOptionsAnchor(event.currentTarget);
    setActiveRowIdx(idx);
  };

  const handleProviderSelect = (option) => {
    const updated = [...rowProviders];
    updated[activeRowIdx] = option;
    setRowProviders(updated);
    setProviderAnchor(null);
  };

  const handleTreatmentSelect = (val) => {
    const updated = [...rowTreatments];
    updated[activeRowIdx] = val;
    setRowTreatments(updated);
    setTreatmentAnchor(null);
  };

  const handleOptionsSelect = (val) => {
    const updated = [...rowOptions];
    updated[activeRowIdx] = val;
    setRowOptions(updated);
    setOptionsAnchor(null);
  };

  const handleRecareToggle = (e) => {
    const val = e.target.checked;
    setRecareChecked(val);
    setSelectedRows(procedures.map(() => val));
  };

  const handleRowToggle = (idx) => {
    const updated = [...selectedRows];
    updated[idx] = !updated[idx];
    setSelectedRows(updated);
    setRecareChecked(updated.every(v => v));
  };

  return (
    <Box sx={{ width: '100%', bgcolor: '#fff', borderRadius: 0, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ bgcolor: headerBlue, color: '#fff', px: 2, py: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>Predetermine Procedures</Typography>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, color: '#fff', p: 0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ p: 2.5 }}>
        <Typography sx={{ fontStyle: 'italic', color: subHeaderBlue, fontSize: '12px', mb: 0.5, fontWeight: 500 }}>
          Please select procedures to predetermine, all selected procedures should have the same provider.
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Typography sx={{ fontStyle: 'italic', color: subHeaderBlue, fontSize: '12px', fontWeight: 500 }}>
            Note: you can't select procedures without provider.
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography sx={{ fontSize: '12px', color: '#333', fontWeight: 600 }}>Policy:</Typography>
          <Stack 
            direction="row" 
            alignItems="center" 
            onClick={(e) => setPolicyAnchor(e.currentTarget)}
            sx={{ cursor: 'pointer', color: subHeaderBlue }}
          >
            <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>{selectedPolicy}</Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
          </Stack>

          <Menu
            anchorEl={policyAnchor}
            open={Boolean(policyAnchor)}
            onClose={() => setPolicyAnchor(null)}
          >
            {policyOptions.map(opt => (
              <MenuItem 
                key={opt} 
                onClick={() => { setSelectedPolicy(opt); setPolicyAnchor(null); }}
                sx={{ fontSize: '12px' }}
              >
                {opt}
              </MenuItem>
            ))}
          </Menu>
        </Stack>

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
        <Box sx={{ maxHeight: '550px', overflowY: 'auto', pr: 1 }}>
          
          {/* Recare Section */}
          <Box sx={{ border: `1px solid ${borderCol}`, borderRadius: 1.5, mb: 3, overflow: 'hidden' }}>
            <Box sx={{ px: 1.5, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Checkbox 
                  size="small" 
                  checked={recareChecked} 
                  onChange={handleRecareToggle}
                  sx={{ p: 0 }} 
                />
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
                    <TableCell padding="checkbox" sx={{ borderBottom: `1px solid ${borderCol}` }}></TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Tooth#</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Surf</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Treatment</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Options</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Pt:<br/>$663.00</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Ins:<br/>$0.00</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Adj:<br/>$0.00</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Office Fee/UCR:<br/>$663.00</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Billed Fee:<br/>$663.00</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Provider</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: `1px solid ${borderCol}` }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {procedures.map((row, idx) => (
                    <React.Fragment key={idx}>
                      <TableRow sx={{ bgcolor: '#fff', borderBottom: 'none' }}>
                        <TableCell padding="checkbox" sx={{ borderBottom: 'none' }}>
                          <Checkbox 
                            size="small" 
                            checked={selectedRows[idx]} 
                            onChange={() => handleRowToggle(idx)}
                          />
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none' }}></TableCell>
                        <TableCell sx={{ borderBottom: 'none' }}></TableCell>
                        <TableCell sx={{ fontSize: '11px', fontWeight: 600, borderBottom: 'none' }}>{row.code}</TableCell>
                        <TableCell sx={{ fontSize: '11px', borderBottom: 'none' }}>
                          <Stack 
                            direction="row" 
                            alignItems="center" 
                            onClick={(e) => handleTreatmentClick(e, idx)}
                            sx={{ cursor: 'pointer' }}
                          >
                            <Typography sx={{ fontSize: '11px', color: '#333' }}>{rowTreatments[idx]}</Typography>
                            <KeyboardArrowDownIcon sx={{ fontSize: 14, ml: 0.5, color: '#999' }} />
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ fontSize: '11px', borderBottom: 'none' }}>
                          <Stack 
                            direction="row" 
                            alignItems="center" 
                            onClick={(e) => handleOptionsClick(e, idx)}
                            sx={{ cursor: 'pointer', minHeight: 20 }}
                          >
                            <Typography sx={{ fontSize: '11px', color: '#333' }}>{rowOptions[idx] || ''}</Typography>
                            {(rowOptions[idx] || row.options) && <KeyboardArrowDownIcon sx={{ fontSize: 14, ml: 0.5, color: '#999' }} />}
                            {!rowOptions[idx] && <Box sx={{ width: 14, height: 14 }} />} {/* Placeholder if empty but user wants to click */}
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ fontSize: '11px', borderBottom: 'none' }}>${row.pt.toFixed(2)}</TableCell>
                        <TableCell sx={{ fontSize: '11px', borderBottom: 'none' }}>${row.ins.toFixed(2)}</TableCell>
                        <TableCell sx={{ borderBottom: 'none' }}>
                          <Box sx={{ border: '1px solid #ddd', p: 0.3, borderRadius: 1, textAlign: 'center', minWidth: 50 }}>
                            <Typography sx={{ fontSize: '10px' }}>0%</Typography>
                            <Typography sx={{ fontSize: '10px', color: '#666' }}>($0.00)</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: '11px', borderBottom: 'none' }}>${row.officeFee.toFixed(2)}</TableCell>
                        <TableCell sx={{ borderBottom: 'none' }}>
                          <TextField size="small" value={`$${row.billedFee.toFixed(2)}`} sx={{ width: 70, '& .MuiInputBase-input': { p: 0.5, fontSize: '11px', bgcolor: '#fff' } }} />
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none' }}>
                          <Stack 
                            direction="row" 
                            alignItems="center" 
                            onClick={(e) => handleProviderClick(e, idx)}
                            sx={{ cursor: 'pointer' }}
                          >
                            <Chip 
                              label={rowProviders[idx].name} 
                              size="small" 
                              sx={{ height: 20, fontSize: '10px', fontWeight: 700, bgcolor: rowProviders[idx].color, borderRadius: 1, cursor: 'pointer' }} 
                            />
                            <KeyboardArrowDownIcon sx={{ fontSize: 14, ml: 0.2, color: '#999' }} />
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none' }}>
                          <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#999', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>
                            {row.status}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none', fontSize: '10px', whiteSpace: 'nowrap' }}>
                          * {row.date} {row.badge && <Typography component="span" sx={{ color: '#1a237e', fontWeight: 700, ml: 0.5 }}>{row.badge}</Typography>}
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ bgcolor: '#fff' }}>
                        <TableCell sx={{ p: 0, borderBottom: `1px solid ${idx === procedures.length - 1 ? 'transparent' : '#f0f0f0'}` }}></TableCell>
                        <TableCell colSpan={13} sx={{ py: 0.5, borderBottom: `1px solid ${idx === procedures.length - 1 ? 'transparent' : '#f0f0f0'}` }}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Typography sx={{ fontSize: '10px', color: '#666' }}>Note:</Typography>
                            <EditIcon sx={{ fontSize: 12, color: '#999', cursor: 'pointer' }} />
                          </Stack>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Visit 1 Section (Collapsed) */}
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
            <TableContainer sx={{ p: 2 }}>
               <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" sx={{ borderBottom: 'none' }}></TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Tooth#</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Surf</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Treatment</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Options</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Pt:<br/>$0.00</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Ins:<br/>$0.00</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Adj:<br/>$0.00</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Office Fee/UCR:<br/>$0.00</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Billed Fee:<br/>$0.00</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Provider</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#666', borderBottom: 'none' }}>Date</TableCell>
                  </TableRow>
                </TableHead>
               </Table>
            </TableContainer>
          </Box>
        </Box>

        {/* Footer Buttons */}
        <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mt: 3, spacing: 2 }}>
          <Typography sx={{ color: '#f44336', fontSize: '12px', fontWeight: 700, mr: 2 }}>No Active Policies</Typography>
          <Button variant="contained" disabled sx={{ bgcolor: '#ccaa70', textTransform: 'none', borderRadius: 1.5, px: 4, fontSize: '13px', fontWeight: 600, mr: 1.5, "&.Mui-disabled": { bgcolor: '#d4c5a0', color: '#fff' } }}>
            Next
          </Button>
          <Button variant="contained" onClick={onClose} sx={{ bgcolor: '#aeb9c4', textTransform: 'none', borderRadius: 1.5, px: 4, fontSize: '13px', fontWeight: 600 }}>
            Cancel
          </Button>
        </Stack>

        <Menu
          anchorEl={treatmentAnchor}
          open={Boolean(treatmentAnchor)}
          onClose={() => setTreatmentAnchor(null)}
        >
          {treatmentDropdownOptions.map(opt => (
            <MenuItem 
              key={opt} 
              onClick={() => handleTreatmentSelect(opt)}
              sx={{ fontSize: '11px' }}
            >
              {opt}
            </MenuItem>
          ))}
        </Menu>

        <Menu
          anchorEl={optionsAnchor}
          open={Boolean(optionsAnchor)}
          onClose={() => setOptionsAnchor(null)}
        >
          {optionsDropdownOptions.map(opt => (
            <MenuItem 
              key={opt} 
              onClick={() => handleOptionsSelect(opt === 'None' ? '' : opt)}
              sx={{ fontSize: '11px' }}
            >
              {opt}
            </MenuItem>
          ))}
        </Menu>

        <Menu
          anchorEl={providerAnchor}
          open={Boolean(providerAnchor)}
          onClose={() => setProviderAnchor(null)}
        >
          {providerOptions.map(opt => (
            <MenuItem 
              key={opt.name} 
              onClick={() => handleProviderSelect(opt)}
              sx={{ fontSize: '12px' }}
            >
              <Chip 
                label={opt.name} 
                size="small" 
                sx={{ height: 20, fontSize: '10px', fontWeight: 700, bgcolor: opt.color, borderRadius: 1, mr: 1 }} 
              />
              {opt.name === 'KAR' ? 'Dr. Karl' : opt.name === 'SAB' ? 'Dr. Sabour' : 'Temp Provider'}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};

export default PredetermineProcedures;
