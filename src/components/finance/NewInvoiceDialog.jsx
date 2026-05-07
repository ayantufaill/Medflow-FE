import React, { useState } from 'react';
import { Box, Typography, Button, Checkbox, FormControlLabel } from '@mui/material';
import AddNewProcedureDialog from './AddNewProcedureDialog';

const NewInvoiceDialog = ({ onClose }) => {
  const [showAddProcedure, setShowAddProcedure] = useState(false);

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#7788bb', // Color from ShareByEmail
          color: 'white',
          padding: '10px',
          textAlign: 'center',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'normal', fontSize: '14px', margin: 0 }}>
          Invoice #25135
        </Typography>
      </Box>

      {/* Body */}
      <Box sx={{ padding: '40px 20px', textAlign: 'center' }}>
        <Typography sx={{ color: '#4b5563', fontSize: '13px', letterSpacing: '0.01em' }}>
          there are no completed procedures ready to be billed
        </Typography>
      </Box>

      {/* Footer / Actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 20px',
          borderTop: '1px solid #f3f4f6',
        }}
      >
        {/* Left Actions */}
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setShowAddProcedure(true)}
            sx={{
              backgroundColor: '#d2b48c', // Tan color
              color: 'white',
              textTransform: 'none',
              fontSize: '13px',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#c1a37b', boxShadow: 'none' },
            }}
          >
            +Add Procedure
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: '#d2b48c', // Tan color
              color: 'white',
              textTransform: 'none',
              fontSize: '13px',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#c1a37b', boxShadow: 'none' },
            }}
          >
            Re-estimate
          </Button>
          <Typography
            sx={{
              color: '#7788bb',
              fontSize: '13px',
              cursor: 'pointer',
              marginLeft: '5px',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            + Add description
          </Typography>
        </Box>

        {/* Right Actions */}
        <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <FormControlLabel
            control={<Checkbox size="small" sx={{ color: '#7788bb', '&.Mui-checked': { color: '#7788bb' } }} />}
            label="Add Claim"
            sx={{
              margin: 0,
              '& .MuiTypography-root': { fontSize: '13px', color: '#7788bb' },
            }}
          />
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: '#7788bb', // Same as header
              color: 'white',
              textTransform: 'none',
              fontSize: '13px',
              padding: '6px 20px',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#6677aa', boxShadow: 'none' },
            }}
          >
            Add New Invoice
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={onClose}
            sx={{
              backgroundColor: '#9ca3af', // Gray color
              color: 'white',
              textTransform: 'none',
              fontSize: '13px',
              padding: '6px 20px',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#8b949e', boxShadow: 'none' },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>

      {/* Add New Procedure Dialog Overlay */}
      {showAddProcedure && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1400,
            p: 4
          }}
          onClick={() => setShowAddProcedure(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '800px', 
              width: '100%',
              bgcolor: '#fff',
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AddNewProcedureDialog 
              onClose={() => setShowAddProcedure(false)}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default NewInvoiceDialog;
