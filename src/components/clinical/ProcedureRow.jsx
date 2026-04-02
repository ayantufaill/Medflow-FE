import React, { useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  Stack,
  IconButton,
  TextField,
  Chip,
  Link,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  History as HistoryIcon,
  KeyboardArrowDown as ExpandIcon,
  Science as LabIcon,
  Print as PrintIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const ProcedureRow = ({ 
  procedure,
  onToggle,
  onEdit,
  onAddNote,
  onLabOrder,
  onPrint,
  onSend,
  onExpand,
  onAmountChange
}) => {
  const [checked, setChecked] = useState(procedure?.checked || false);
  const [amount, setAmount] = useState(procedure?.amount || '$0.00');
  const [duration, setDuration] = useState(procedure?.duration || '');
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [procedureName, setProcedureName] = useState(procedure?.name || '#15 crown /bu');
  const [anchorEl, setAnchorEl] = useState(null);
  const [treatmentAnchorEl, setTreatmentAnchorEl] = useState(null);
  const durationMenuOpen = Boolean(anchorEl);
  const treatmentMenuOpen = Boolean(treatmentAnchorEl);

  const handleToggle = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    if (onToggle) onToggle(procedure?.id, newChecked);
  };

  const handleEdit = () => {
    setIsEditing(true);
    if (onEdit) onEdit(procedure);
  };

  const handleAddNote = () => {
    if (onAddNote) onAddNote(procedure);
  };

  const handleLabOrder = () => {
    if (onLabOrder) onLabOrder(procedure);
  };

  const handleSend = () => {
    if (onSend) onSend(procedure);
  };

  const handleExpand = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    if (onExpand) onExpand(procedure?.id, newExpanded);
  };

  const renderFullTable = expanded;

  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    if (onAmountChange) onAmountChange(procedure?.id, newAmount);
  };

  const handleDurationChange = (e) => {
    const newDuration = e.target.value;
    setDuration(newDuration);
    // You can add a callback here if needed
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleProcedureNameChange = (e) => {
    setProcedureName(e.target.value);
  };

  const handleProcedureNameBlur = () => {
    setIsEditing(false);
    if (onEdit) {
      onEdit({ ...procedure, name: procedureName });
    }
  };

  const handleProcedureNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (onEdit) {
        onEdit({ ...procedure, name: procedureName });
      }
    }
    if (e.key === 'Escape') {
      setProcedureName(procedure?.name || '#15 crown /bu');
      setIsEditing(false);
    }
  };

  const handleDurationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDurationClose = () => {
    setAnchorEl(null);
  };

  const handleDurationUnitSelect = (unit) => {
    // Handle duration unit selection here
    console.log('Selected unit:', unit);
    setAnchorEl(null);
  };

  const handleTreatmentClick = (event) => {
    setTreatmentAnchorEl(event.currentTarget);
  };

  const handleTreatmentClose = () => {
    setTreatmentAnchorEl(null);
  };

  const handleTreatmentSelect = (treatmentOption) => {
    console.log('Selected treatment:', treatmentOption);
    setTreatmentAnchorEl(null);
    // You can add callback here to update procedure with selected treatment
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint(procedure);
    } else {
      // Default print behavior - print procedure details
      const printContent = `
        Procedure: ${procedure?.name || '#15 crown /bu'}
        Code: ${procedure?.code || 'D0120'}
        Tooth: ${procedure?.toothNumber || ''}
        Surface: ${procedure?.surface || ''}
        Fee: ${procedure?.fee || '$0.00'}
        Patient Amount: ${procedure?.patientAmount || '$0.00'}
        Insurance Amount: ${procedure?.insuranceAmount || '$0.00'}
        Date: ${procedure?.date || ''}
      `;
      
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow.document.write('<html><head><title>Print Procedure</title>');
      printWindow.document.write('</head><body>');
      printWindow.document.write('<h2>Procedure Details</h2>');
      printWindow.document.write('<pre style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6;">');
      printWindow.document.write(printContent);
      printWindow.document.write('</pre></body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Box sx={{ 
      border: '1px solid #d1d9e6', 
      borderRadius: 1, 
      bgcolor: '#fff', 
      p: 2, 
      mt: 2,
      mx: 1
    }}>
      {/* Top Action Bar */}
      <Stack direction="row" alignItems="center" sx={{ mb: 1.5 }}>
        <Checkbox 
          size="small" 
          checked={checked}
          onChange={handleToggle}
        />
        <IconButton 
          size="small"
          onClick={handleEdit}
        >
          <EditIcon sx={{ fontSize: '1rem', color: isEditing ? '#1976d2' : '#777' }} />
        </IconButton>
        {isEditing ? (
          <TextField
            size="small"
            value={procedureName}
            onChange={handleProcedureNameChange}
            onBlur={handleProcedureNameBlur}
            onKeyDown={handleProcedureNameKeyDown}
            variant="standard"
            autoFocus
            inputProps={{ 
              style: { 
                padding: '4px 8px', 
                fontSize: '0.875rem'
              }
            }}
            sx={{ 
              minWidth: '200px',
              mr: 2,
              '& .MuiInput-underline': { 
                '&:before': {
                  borderBottom: '2px solid #1976d2'
                },
                '&:after': {
                  borderBottom: '2px solid #1976d2'
                }
              }
            }}
          />
        ) : (
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', mr: 2, color: '#1a2735' }}>
            {procedure?.toothNumber ? `#${procedure.toothNumber} ${procedure.name}` : procedure?.name || '#15 crown /bu'}
          </Typography>
        )}
        
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1 }}>
          <HistoryIcon sx={{ fontSize: '1rem', color: '#1976d2' }} />
          <Typography sx={{ fontSize: '0.75rem', color: '#1976d2', mr: 0.5 }}>
            Duration:
          </Typography>
          <TextField
            size="small"
            value={duration}
            onChange={handleDurationChange}
            variant="standard"
            inputProps={{ 
              style: { 
                padding: '4px 8px', 
                fontSize: '0.75rem',
                textAlign: 'center'
              },
              sx: {
                '&::placeholder': {
                  color: '#1976d2',
                  opacity: 1
                }
              }
            }}
            sx={{ 
              width: '50px',
              '& .MuiInput-underline': { 
                '&:before': {
                  borderBottom: '1px solid #1976d2'
                },
                '&:hover:not(.Mui-disabled):before': {
                  borderBottom: '2px solid #1976d2'
                },
                '&:after': {
                  borderBottom: '2px solid #1976d2'
                }
              },
              '& .MuiInput-root': {
                fontSize: '0.75rem',
                height: '24px'
              }
            }}
          />
          <Typography 
            sx={{ 
              fontSize: '0.75rem', 
              color: '#1976d2', 
              ml: 0.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 0.25
            }}
            onClick={handleDurationClick}
          >
            min
            <ExpandIcon sx={{ fontSize: '0.7rem' }} />
          </Typography>
          
          <Menu
            anchorEl={anchorEl}
            open={durationMenuOpen}
            onClose={handleDurationClose}
          >
            <MenuItem onClick={() => handleDurationUnitSelect('min')}>
              <Typography sx={{ fontSize: '0.875rem' }}>Minutes</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleDurationUnitSelect('hr')}>
              <Typography sx={{ fontSize: '0.875rem' }}>Hours</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleDurationUnitSelect('day')}>
              <Typography sx={{ fontSize: '0.875rem' }}>Days</Typography>
            </MenuItem>
          </Menu>
          
          <Typography 
            sx={{ 
              fontSize: '0.75rem', 
              color: '#1976d2', 
              ml: 1, 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
            onClick={handleAddNote}
          >
            +add note
          </Typography>
        </Stack>

        <Stack direction="row" spacing={0.5} alignItems="center">
          <IconButton 
            size="small" 
            sx={{ color: '#1976d2' }}
            onClick={handleLabOrder}
          >
            <LabIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
          <Typography 
            sx={{ fontSize: '0.75rem', color: '#1976d2', mr: 1, cursor: 'pointer' }}
            onClick={handleLabOrder}
          >
            + Lab Order
          </Typography>
          <IconButton 
            size="small"
            onClick={handlePrint}
          >
            <PrintIcon sx={{ fontSize: '1.1rem', color: '#4a6585' }} />
          </IconButton>
          <IconButton 
            size="small"
            onClick={handleSend}
          >
            <SendIcon sx={{ fontSize: '1rem', color: '#4a6585', transform: 'rotate(-45deg)' }} />
          </IconButton>
          <IconButton 
            size="small"
            onClick={handleExpand}
          >
            <ExpandIcon sx={{ fontSize: '1.1rem', color: '#1976d2', transform: expanded ? 'none' : 'rotate(180deg)', transition: 'transform 0.2s' }} />
          </IconButton>
        </Stack>
      </Stack>

      {/* Data Grid Header */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(15, 1fr)',
        gap: 0.5,
        alignItems: 'end',
        mb: renderFullTable ? 1 : 2,
        px: 0.5
      }}>
        <Box></Box>
        <Typography sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 500 }}>Tooth#</Typography>
        <Typography sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 500 }}>Surf</Typography>
        <Typography sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 500 }}>Code</Typography>
        <Typography sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 500 }}>Treatment</Typography>
        <Typography sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 500 }}>Options</Typography>
        
        <Box>
          <Typography sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 500 }}>Pt:</Typography>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>
            {procedure?.patientAmount || '$0.00'}
          </Typography>
        </Box>
        
        <Box>
          <Typography sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 500 }}>Ins:</Typography>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>
            {procedure?.insuranceAmount || '$0.00'}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ border: '1px solid #ccc', px: 0.5, fontSize: '0.6rem', display: 'inline-block', mb: 0.5, borderRadius: '2px' }}>
            {procedure?.adjustmentPercent || '0%'}
          </Box>
          <Typography sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 500 }}>Adj:</Typography>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>
            {procedure?.adjustmentAmount || '$0.00'}
          </Typography>
        </Box>

        <Box>
          <Typography sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 500 }}>Fee:</Typography>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>
            {procedure?.fee || '$0.00'}
          </Typography>
        </Box>

        <Box>
          <Typography sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 500 }}>Billed:</Typography>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>
            {procedure?.billedAmount || '$0.00'}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Chip 
            label={procedure?.providerInitials || 'SAB'} 
            size="small" 
            sx={{ bgcolor: '#c8e6c9', color: '#2e7d32', height: 18, fontSize: '0.65rem', mb: 0.5 }} 
          />
          <Typography sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 500 }}>Provider</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Chip 
            label={procedure?.status || 'A'} 
            size="small" 
            sx={{ bgcolor: '#b2dfdb', color: '#00796b', height: 18, width: 18, minWidth: 18, fontSize: '0.65rem', mb: 0.5 }} 
          />
          <Typography sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 500 }}>Status</Typography>
        </Box>

        <Typography sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 500 }}>Date</Typography>
      </Box>

      {/* Procedure Data Row - Conditionally Rendered */}
      {renderFullTable && (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(15, 1fr)',
          gap: 0.5,
          alignItems: 'center',
          px: 0.5,
          py: 1,
          borderTop: '1px solid #e8ecf1'
        }}>
        <Checkbox 
          size="small"
          checked={checked}
          onChange={handleToggle}
        />
        <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>
          {procedure?.toothNumber || ''}
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>
          {procedure?.surface || ''}
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>
          {procedure?.code || 'D0120'}
        </Typography>
        
        <Stack direction="row" alignItems="center">
          <Typography 
            sx={{ 
              fontSize: '0.8rem', 
              color: '#4a6585',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 0.25
            }}
            onClick={handleTreatmentClick}
          >
            {procedure?.treatmentName || 'Periodic Eval'}
          </Typography>
          <ExpandIcon sx={{ fontSize: '0.9rem', color: '#999' }} />
        </Stack>

        <Menu
          anchorEl={treatmentAnchorEl}
          open={treatmentMenuOpen}
          onClose={handleTreatmentClose}
        >
          <MenuItem onClick={() => handleTreatmentSelect('Periodic Eval')}>
            <Typography sx={{ fontSize: '0.875rem' }}>Periodic Eval</Typography>
          </MenuItem>
          <MenuItem onClick={() => handleTreatmentSelect('Limited Exam')}>
            <Typography sx={{ fontSize: '0.875rem' }}>Limited Exam</Typography>
          </MenuItem>
          <MenuItem onClick={() => handleTreatmentSelect('Comprehensive Exam')}>
            <Typography sx={{ fontSize: '0.875rem' }}>Comprehensive Exam</Typography>
          </MenuItem>
          <MenuItem onClick={() => handleTreatmentSelect('Crown')}>
            <Typography sx={{ fontSize: '0.875rem' }}>Crown</Typography>
          </MenuItem>
          <MenuItem onClick={() => handleTreatmentSelect('Filling')}>
            <Typography sx={{ fontSize: '0.875rem' }}>Filling</Typography>
          </MenuItem>
          <MenuItem onClick={() => handleTreatmentSelect('Extraction')}>
            <Typography sx={{ fontSize: '0.875rem' }}>Extraction</Typography>
          </MenuItem>
          <MenuItem onClick={() => handleTreatmentSelect('Root Canal')}>
            <Typography sx={{ fontSize: '0.875rem' }}>Root Canal</Typography>
          </MenuItem>
          <MenuItem onClick={() => handleTreatmentSelect('Cleaning')}>
            <Typography sx={{ fontSize: '0.875rem' }}>Cleaning</Typography>
          </MenuItem>
        </Menu>

        <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>
          {procedure?.options || ''}
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>
          {procedure?.patientAmount || '$0.00'}
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>
          {procedure?.insuranceAmount || '$0.00'}
        </Typography>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.65rem', color: '#888' }}>
            ({procedure?.adjustmentAmount || '$0.00'})
          </Typography>
        </Box>

        <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>
          {procedure?.fee || '$0.00'}
        </Typography>
        
        <TextField 
          variant="standard"
          value={amount}
          onChange={handleAmountChange}
          placeholder="$0.00"
          inputProps={{ 
            style: { 
              padding: '2px 4px', 
              fontSize: '0.8rem',
              textAlign: 'left'
            },
            sx: {
              '&::placeholder': {
                color: '#999',
                opacity: 1,
                textAlign: 'left'
              }
            }
          }}
          sx={{ 
            maxWidth: '70px', 
            '& .MuiInput-underline': { 
              '&:before': {
                borderBottom: '1px solid #ccc'
              },
              '&:hover:not(.Mui-disabled):before': {
                borderBottom: '2px solid #1976d2'
              },
              '&:after': {
                borderBottom: '2px solid #1976d2'
              }
            },
            '& .MuiInput-root': {
              height: '24px',
              fontSize: '0.8rem'
            }
          }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Chip 
            label={procedure?.providerInitials || 'SAB'} 
            size="small" 
            sx={{ bgcolor: '#c8e6c9', color: '#2e7d32', height: 20, fontSize: '0.7rem', mb: 0.5 }} 
          />
          <Typography sx={{ fontSize: '0.65rem', color: '#666', fontWeight: 500 }}>Provider</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Chip 
            label={procedure?.status || 'A'} 
            size="small" 
            sx={{ bgcolor: '#b2dfdb', color: '#00796b', height: 20, width: 20, minWidth: 20, fontSize: '0.7rem', mb: 0.5 }} 
          />
          <Typography sx={{ fontSize: '0.65rem', color: '#666', fontWeight: 500 }}>Status</Typography>
        </Box>

        <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>
          {procedure?.date || '10/14/2025'}
        </Typography>
        
        <CheckCircleIcon sx={{ color: '#bdbdbd', fontSize: '1.1rem' }} />
        </Box>
      )}

      {/* Note Section - Only show when expanded */}
      {renderFullTable && (
        <>
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '0.75rem', color: '#777', mr: 0.5 }}>Note:</Typography>
            <IconButton size="small">
              <EditIcon sx={{ fontSize: '0.8rem', color: '#777' }} />
            </IconButton>
          </Box>

          <Link href="#" underline="none" sx={{ fontSize: '0.75rem', mt: 1, display: 'inline-block', color: '#1976d2' }}>
            +Add Procedure
          </Link>
        </>
      )}
    </Box>
  );
};

export default ProcedureRow;
