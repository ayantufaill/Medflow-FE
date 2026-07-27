import React from 'react';
import { Box, Button, Paper, Typography, IconButton } from '@mui/material';
import { DeleteOutline as DeleteIcon } from '@mui/icons-material';

const SavedFormsSidebar = ({ forms, activeFormId, handleSelectForm, handleCreateNew, handleDelete }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Button 
        onClick={handleCreateNew} 
        variant="contained" 
        sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' }, textTransform: 'none', py: 1, boxShadow: 'none' }}
      >
        Create new statement
      </Button>
      
      <Paper sx={{ border: '1px solid #E5E9F2', borderRadius: 2, overflow: 'hidden', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
        <Box sx={{ bgcolor: '#F8FAFC', color: '#1e293b', p: 1.5, textAlign: 'center', borderBottom: '1px solid #E5E9F2' }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Saved Statement Printout Form</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {forms.map(form => (
            <Box 
              key={form.id} 
              onClick={() => handleSelectForm(form)}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                p: 1.5, 
                bgcolor: activeFormId === form.id ? '#eff6ff' : 'white', 
                borderBottom: '1px solid #e2e8f0',
                cursor: 'pointer',
                '&:hover': { bgcolor: activeFormId === form.id ? '#eff6ff' : '#f8fafc' }
              }}
            >
              <Typography sx={{ fontSize: '0.85rem', fontWeight: activeFormId === form.id ? 600 : 400, color: activeFormId === form.id ? '#2563eb' : '#334155' }}>
                {form.name} 
                {form.isDefault && (
                  <Typography component="span" sx={{ fontSize: '0.85rem', color: activeFormId === form.id ? '#60a5fa' : '#94a3b8', ml: 1 }}>
                    (Default)
                  </Typography>
                )}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                  size="small" 
                  onClick={(e) => { e.stopPropagation(); handleDelete(form.id); }} 
                  sx={{ color: '#ef4444', p: 0.5 }}
                >
                  <DeleteIcon fontSize="1.2rem" />
                </IconButton>
              </Box>
            </Box>
          ))}
          {forms.length === 0 && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>
                No forms saved.
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default SavedFormsSidebar;
