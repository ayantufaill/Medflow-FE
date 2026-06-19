import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../store/slices/providerSlice';
import { Box, Typography, Button, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, TextField } from '@mui/material';
import AddNewProcedureDialog from './AddNewProcedureDialog';

const InvoiceModal = ({ invoiceData, onSave, onCancel }) => {
  const dispatch = useDispatch();
  const [showAddProcedure, setShowAddProcedure] = useState(false);
  const [procedures, setProcedures] = useState([]);

  // Providers from Redux (cached — won't re-fetch if already loaded)
  const providersList = useSelector(selectProviderDropdownList);
  useEffect(() => { dispatch(fetchAllProvidersForDropdown()); }, [dispatch]);

  const containerStyle = {
    fontFamily: '"Segoe UI", Tahoma, sans-serif',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '2px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  };

  const headerStyle = {
    backgroundColor: '#ff6347',
    color: 'white',
    padding: '12px',
    textAlign: 'center',
    fontSize: '16px',
    margin: 0,
    fontWeight: 'normal'
  };

  const bodyStyle = {
    padding: procedures.length > 0 ? '0' : '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    minHeight: '80px',
    maxHeight: 'calc(90vh - 100px)',
    overflowY: 'auto'
  };

  const emptyMessageStyle = {
    color: '#333',
    fontSize: '14px',
    marginBottom: '15px',
    marginTop: '15px'
  };

  const controlsRowStyle = {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 10px',
    borderTop: procedures.length > 0 ? '1px solid #eee' : 'none'
  };

  const leftControls = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const rightControls = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  };

  const addButtonStyle = {
    backgroundColor: '#d6b37a',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px'
  };

  const linkButtonStyle = {
    color: '#5b7bb1',
    textDecoration: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0
  };

  const saveButtonStyle = {
    backgroundColor: '#ff9c8c',
    color: 'white',
    border: 'none',
    padding: '6px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const cancelButtonStyle = {
    backgroundColor: '#a9a9a9',
    color: 'white',
    border: 'none',
    padding: '6px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const handleSaveProcedure = (savedData) => {
    setShowAddProcedure(false);
    if (!savedData) return;
    
    const newProcedure = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      code: savedData.procedureCode || '',
      site: savedData.selectedTeeth.join(',') + (savedData.selectedSurfaces.length > 0 ? ` (${savedData.selectedSurfaces.join('')})` : ''),
      treatment: savedData.procedureDescription || 'Custom Procedure',
      provider: '', // default to empty instead of 'SMI'
      writeoff: '$0.00',
      ptPortion: '$0.00',
      insPortion: `$${parseFloat(savedData.fee || 0).toFixed(2)}`,
      charge: `$${parseFloat(savedData.fee || 0).toFixed(2)}`,
      balance: `$${parseFloat(savedData.fee || 0).toFixed(2)}`,
      dbi: false,
      completed: true
    };

    setProcedures(prev => [...prev, newProcedure]);
  };

  const handleProviderChange = (procedureId, newProvider) => {
    setProcedures(prev => prev.map(p => 
      p.id === procedureId ? { ...p, provider: newProvider } : p
    ));
  };

  const handleAmountChange = (procedureId, field, value) => {
    setProcedures(prev => prev.map(p => {
      if (p.id !== procedureId) return p;

      const updated = { ...p, [field]: value };
      
      const numCharge = parseFloat((updated.charge || '').toString().replace(/[^0-9.-]+/g, "")) || 0;
      const numWriteoff = parseFloat((updated.writeoff || '').toString().replace(/[^0-9.-]+/g, "")) || 0;
      const dbiState = updated.dbi;

      if (['charge', 'writeoff', 'dbi'].includes(field)) {
        const owed = Math.max(0, numCharge - numWriteoff);
        
        if (dbiState) {
          updated.ptPortion = `$${owed.toFixed(2)}`;
          updated.insPortion = `$0.00`;
        } else {
          updated.insPortion = `$${owed.toFixed(2)}`;
          updated.ptPortion = `$0.00`;
        }
        
        updated.balance = `$${owed.toFixed(2)}`;
      } else if (['ptPortion', 'insPortion'].includes(field)) {
        updated.balance = `$${Math.max(0, numCharge - numWriteoff).toFixed(2)}`;
      }
      
      return updated;
    }));
  };

  const ProviderDropdown = ({ value, onChange }) => {
    return (
      <Select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
        variant="standard"
        disableUnderline
        renderValue={(selected) => {
          if (!selected) return 'Sel';
          return selected.substring(0, 2).toUpperCase();
        }}
        sx={{
          bgcolor: value ? '#7ba0b5' : '#a9a9a9',
          color: 'white',
          borderRadius: '4px',
          fontSize: '12px',
          '& .MuiSelect-select': {
            py: 0.5,
            px: 1,
            display: 'flex',
            alignItems: 'center'
          },
          '& .MuiSvgIcon-root': {
            color: 'white',
            fontSize: '16px'
          }
        }}
      >
        <MenuItem value="" disabled sx={{ fontSize: '12px' }}>
          <em>Select Provider</em>
        </MenuItem>
        {providersList.map((p) => {
          const firstName = p.userId?.firstName || p.firstName || '';
          const lastName  = p.userId?.lastName  || p.lastName  || '';
          const name = `${firstName} ${lastName}`.trim() || p.name || `Provider ${p._id || p.id}`;
          return (
            <MenuItem key={p._id || p.id} value={name} sx={{ fontSize: '12px' }}>
              {name}
            </MenuItem>
          );
        })}
      </Select>
    );
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Invoice #{invoiceData?.invoiceId || '3125'}</h2>
      
      <div style={bodyStyle}>
        {procedures.length === 0 ? (
          <div style={emptyMessageStyle}>
            there are no completed procedures ready to be billed
          </div>
        ) : (
          <Box sx={{ width: '100%', px: 3, pt: 2 }}>
            <Box sx={{ borderBottom: '1px solid #ff6347', pb: 1, mb: 1, textAlign: 'left' }}>
              <Typography variant="subtitle1" sx={{ color: '#ff6347', display: 'inline-block', mr: 2, fontSize: '13px' }}>
                07/15/2022
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#ff6347', display: 'inline-block', fontSize: '13px' }}>
                Invoice #{invoiceData?.invoiceId || '3125'}
              </Typography>
            </Box>
            <TableContainer component={Box} sx={{ width: '100%' }}>
              <Table size="small" sx={{ width: '100%' }}>
              <TableHead>
                <TableRow sx={{ '& th': { px: 0.5, py: 0.5, color: '#666', fontWeight: 600, fontSize: '12px', borderBottom: '1px solid #e0e0e0' } }}>
                  <TableCell padding="none" sx={{ width: '20px' }}></TableCell>
                  <TableCell>Date of Service</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Site</TableCell>
                  <TableCell>Treatment</TableCell>
                  <TableCell>Provider</TableCell>
                  <TableCell>Insurance Write-off</TableCell>
                  <TableCell>Patient Portion</TableCell>
                  <TableCell>Insurance Portion</TableCell>
                  <TableCell>Total Charge</TableCell>
                  <TableCell>Total Balance</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {procedures.map((row) => (
                  <TableRow key={row.id} sx={{ '& td': { px: 0.5, py: 0.5, borderBottom: '1px solid #f0f0f0', fontSize: '12px', color: '#333' } }}>
                    <TableCell padding="none" align="center">
                      <span style={{ color: '#ff6347', cursor: 'pointer', fontWeight: 'bold' }}>x</span>
                    </TableCell>
                    <TableCell>
                      <input 
                        type="date"
                        value={row.date}
                        onChange={(e) => handleAmountChange(row.id, 'date', e.target.value)}
                        style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', width: '105px' }}
                      />
                    </TableCell>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.site}</TableCell>
                    <TableCell sx={{ color: '#555' }}>{row.treatment}</TableCell>
                    <TableCell>
                      <ProviderDropdown 
                        value={row.provider} 
                        onChange={(newVal) => handleProviderChange(row.id, newVal)}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#666' }}>{row.writeoff}</TableCell>
                    <TableCell sx={{ color: '#666' }}>{row.ptPortion}</TableCell>
                    <TableCell sx={{ color: '#666' }}>{row.insPortion}</TableCell>
                    <TableCell>
                      <input
                        type="text"
                        value={row.charge}
                        onChange={(e) => handleAmountChange(row.id, 'charge', e.target.value)}
                        style={{ width: '60px', border: '1px solid #ccc', borderRadius: '4px', padding: '4px 8px', fontSize: '12px' }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#ff6347', fontWeight: 600 }}>{row.balance}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <FormControlLabel 
                          control={
                            <Checkbox 
                              size="small" 
                              checked={row.dbi || false} 
                              onChange={(e) => handleAmountChange(row.id, 'dbi', e.target.checked)}
                              sx={{ p: 0.5 }} 
                            />
                          } 
                          label={<Typography sx={{ fontSize: '11px', color: '#555' }}>DBI</Typography>} 
                          sx={{ m: 0 }}
                        />
                        <Box 
                          onClick={() => handleAmountChange(row.id, 'completed', row.completed === undefined ? false : !row.completed)}
                          sx={{ 
                            bgcolor: row.completed === false ? '#d32f2f' : '#8bc34a', 
                            color: 'white', 
                            borderRadius: '4px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            width: '24px', 
                            height: '24px', 
                            cursor: 'pointer' 
                          }}
                        >
                          {row.completed === false ? '✗' : '✓'}
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableContainer>
          </Box>
        )}

        <div style={controlsRowStyle}>
          <div style={leftControls}>
            <button style={addButtonStyle} onClick={() => setShowAddProcedure(true)}>+Add Procedure</button>
            <button style={addButtonStyle}>Re-estimate</button>
            <button style={linkButtonStyle}>+ Add description</button>
          </div>

          <div style={rightControls}>
            <label style={{...linkButtonStyle, display: 'flex', alignItems: 'center', gap: '5px'}}>
              <input type="checkbox" style={{ margin: 0 }} /> Add Claim
            </label>
            
            <button 
              type="button"
              style={saveButtonStyle}
              onClick={() => {
                if (onSave) onSave(procedures);
              }}
            >
              Add New Invoice
            </button>
            <button 
              type="button"
              style={cancelButtonStyle}
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {showAddProcedure && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1400
          }}
          onClick={() => setShowAddProcedure(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '600px', 
              width: '90%',
              bgcolor: 'transparent',
              borderRadius: '4px',
              overflow: 'visible',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AddNewProcedureDialog 
              onClose={() => setShowAddProcedure(false)}
              onSave={handleSaveProcedure}
            />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default InvoiceModal;
