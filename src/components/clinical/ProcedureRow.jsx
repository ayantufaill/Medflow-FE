import React from 'react';
import {
  Box,
  Typography,
  Checkbox,
  Stack,
  IconButton,
  TextField,
  Chip,
  Link
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

const ProcedureRow = () => {
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
        <Checkbox size="small" />
        <IconButton size="small">
          <EditIcon sx={{ fontSize: '1rem', color: '#777' }} />
        </IconButton>
        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', mr: 2, color: '#1a2735' }}>
          #15 crown /bu
        </Typography>
        
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1 }}>
          <HistoryIcon sx={{ fontSize: '1rem', color: '#1976d2' }} />
          <Typography sx={{ fontSize: '0.75rem', color: '#1976d2' }}>
            Duration: ___ min
          </Typography>
          <ExpandIcon sx={{ fontSize: '0.9rem', color: '#1976d2' }} />
          <Typography 
            sx={{ 
              fontSize: '0.75rem', 
              color: '#1976d2', 
              ml: 1, 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            +add note
          </Typography>
        </Stack>

        <Stack direction="row" spacing={0.5} alignItems="center">
          <IconButton size="small" sx={{ color: '#1976d2' }}>
            <LabIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
          <Typography sx={{ fontSize: '0.75rem', color: '#1976d2', mr: 1 }}>+ Lab Order</Typography>
          <IconButton size="small"><PrintIcon sx={{ fontSize: '1.1rem', color: '#4a6585' }} /></IconButton>
          <IconButton size="small"><SendIcon sx={{ fontSize: '1rem', color: '#4a6585', transform: 'rotate(-45deg)' }} /></IconButton>
          <IconButton size="small"><ExpandIcon sx={{ fontSize: '1.1rem', color: '#1976d2', transform: 'rotate(180deg)' }} /></IconButton>
        </Stack>
      </Stack>

      {/* Data Grid Header */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(15, 1fr)',
        gap: 0.5,
        alignItems: 'end',
        mb: 1,
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
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>$0.00</Typography>
        </Box>
        
        <Box>
          <Typography sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 500 }}>Ins:</Typography>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>$0.00</Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ border: '1px solid #ccc', px: 0.5, fontSize: '0.6rem', display: 'inline-block', mb: 0.5, borderRadius: '2px' }}>0%</Box>
          <Typography sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 500 }}>Adj:</Typography>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>$0.00</Typography>
        </Box>

        <Box>
          <Typography sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 500 }}>Fee:</Typography>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>$0.00</Typography>
        </Box>

        <Box>
          <Typography sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 500 }}>Billed:</Typography>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>$0.00</Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Chip label="SAB" size="small" sx={{ bgcolor: '#c8e6c9', color: '#2e7d32', height: 18, fontSize: '0.65rem', mb: 0.5 }} />
          <Typography sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 500 }}>Provider</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Chip label="A" size="small" sx={{ bgcolor: '#b2dfdb', color: '#00796b', height: 18, width: 18, minWidth: 18, fontSize: '0.65rem', mb: 0.5 }} />
          <Typography sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 500 }}>Status</Typography>
        </Box>

        <Typography sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 500 }}>Date</Typography>
      </Box>

      {/* Procedure Data Row */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(15, 1fr)',
        gap: 0.5,
        alignItems: 'center',
        px: 0.5,
        py: 1,
        borderTop: '1px solid #e8ecf1'
      }}>
        <Checkbox size="small" />
        <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}></Typography>
        <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}></Typography>
        <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>D0120</Typography>
        
        <Stack direction="row" alignItems="center">
          <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>Periodic Eval</Typography>
          <ExpandIcon sx={{ fontSize: '0.9rem', color: '#999' }} />
        </Stack>

        <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}></Typography>
        <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>$0.00</Typography>
        <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>$0.00</Typography>
        
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ border: '1px solid #ccc', px: 0.5, fontSize: '0.6rem', display: 'inline-block', borderRadius: '2px' }}>0%</Box>
          <Typography sx={{ fontSize: '0.65rem', color: '#888' }}>($0.00)</Typography>
        </Box>

        <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>$0.00</Typography>
        
        <TextField 
          variant="outlined" 
          size="small" 
          value="$0.00" 
          inputProps={{ style: { padding: '2px 4px', fontSize: '0.8rem', textAlign: 'right' } }}
          sx={{ 
            maxWidth: '70px', 
            '& .MuiOutlinedInput-root': { 
              height: '24px',
              fontSize: '0.8rem'
            } 
          }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Chip label="SAB" size="small" sx={{ bgcolor: '#c8e6c9', color: '#2e7d32', height: 20, fontSize: '0.7rem', mb: 0.5 }} />
          <Typography sx={{ fontSize: '0.65rem', color: '#666', fontWeight: 500 }}>Provider</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Chip label="A" size="small" sx={{ bgcolor: '#b2dfdb', color: '#00796b', height: 20, width: 20, minWidth: 20, fontSize: '0.7rem', mb: 0.5 }} />
          <Typography sx={{ fontSize: '0.65rem', color: '#666', fontWeight: 500 }}>Status</Typography>
        </Box>

        <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>10/14/2025</Typography>
        
        <CheckCircleIcon sx={{ color: '#bdbdbd', fontSize: '1.1rem' }} />
      </Box>

      {/* Note Section */}
      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '0.75rem', color: '#777', mr: 0.5 }}>Note:</Typography>
        <IconButton size="small">
          <EditIcon sx={{ fontSize: '0.8rem', color: '#777' }} />
        </IconButton>
      </Box>

      <Link href="#" underline="none" sx={{ fontSize: '0.75rem', mt: 1, display: 'inline-block', color: '#1976d2' }}>
        +Add Procedure
      </Link>
    </Box>
  );
};

export default ProcedureRow;
