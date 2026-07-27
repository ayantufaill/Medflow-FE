import React from 'react';
import { Box, Typography, Button, IconButton, Collapse } from '@mui/material';
import {
  KeyboardArrowRight as ChevronRightIcon,
  KeyboardArrowDown as ChevronDownIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';

const CoverageGroupItem = ({ group, isExpanded, toggleGroup, categoryId, handleEditGroup, handleDeleteGroup }) => {
  return (
    <Box sx={{ mb: 0.5 }}>
      <Box
        onClick={() => toggleGroup(group.id)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: 1.5,
          px: 2.5,
          backgroundColor: '#f8fafc',
          borderRadius: 2,
          border: '1px solid #e2e8f0',
          cursor: 'pointer',
          '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f1f5f9' },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        {isExpanded ? (
          <ChevronDownIcon sx={{ mr: 2, fontSize: '1.2rem', color: '#64748b' }} />
        ) : (
          <ChevronRightIcon sx={{ mr: 2, fontSize: '1.2rem', color: '#64748b' }} />
        )}
        <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.85rem', width: '200px' }}>
          {group.name}
        </Typography>

        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
          {group.deliveryPattern && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: '#475569', fontWeight: 600, fontSize: '0.8rem' }}>
                Delivery Pattern:
              </Typography>
              <Typography sx={{ color: '#1e293b', fontSize: '0.8rem' }}>
                {group.deliveryPattern}
              </Typography>
            </Box>
          )}
          
          {group.ageLimit && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: '#475569', fontWeight: 600, fontSize: '0.8rem' }}>
                Age Limit:
              </Typography>
              <Typography sx={{ color: '#1e293b', fontSize: '0.8rem' }}>
                {group.ageLimit}
              </Typography>
            </Box>
          )}

          {group.downgrade && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: '#475569', fontWeight: 600, fontSize: '0.8rem' }}>
                Downgrade:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.9rem' }}>🦷</Typography>
                {typeof group.downgrade === 'string' && (
                  <Typography sx={{ color: '#1e293b', fontSize: '0.8rem' }}>
                    {group.downgrade}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            onClick={(e) => { e.stopPropagation(); handleEditGroup(e, categoryId, group); }}
            sx={{
              color: '#2563eb',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8rem',
              '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
            }}
          >
            Edit
          </Button>
          <IconButton 
            onClick={(e) => { e.stopPropagation(); handleDeleteGroup(e, categoryId, group.id); }} 
            size="small" 
            sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444', backgroundColor: '#fef2f2' } }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Collapsible Nested Codes List */}
      <Collapse in={isExpanded}>
        <Box sx={{ pl: 6, mt: 1, mb: 2, borderLeft: '2px dashed #e2e8f0', ml: 3.5, display: 'flex', flexDirection: 'column' }}>
          {group.codes && group.codes.map((codeItem, cIdx) => (
            <Box
              key={cIdx}
              sx={{
                display: 'flex',
                alignItems: 'center',
                py: 1,
                borderBottom: '1px solid #f1f5f9',
                gap: 2
              }}
            >
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', minWidth: 60 }}>
                {codeItem.code}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                {codeItem.desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default CoverageGroupItem;
