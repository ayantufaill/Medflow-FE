import React, { useState } from "react";
import { Stack, Typography, Divider, Box } from "@mui/material";
import { VisibilityOutlined, ElectricBolt, MasksOutlined } from "@mui/icons-material"; 

const ExamFilterBar = ({ 
  selectedTeeth = [], 
  onToggleUnerupted,
}) => {
  // Local state for active view (Tooth First vs Condition First)
  const [activeView, setActiveView] = useState('tooth'); 

  // Determine if we should show Erupted or Unerupted based on selected teeth
  // (matching existing logic)
  const isUnerupted = selectedTeeth.length > 0;

  return (
    <Box sx={{ 
      border: '1px solid #e5e7eb', 
      borderRadius: '12px', 
      px: 0.5,
      py: 0.5, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      bgcolor: '#fff', 
      mb: 2,
      overflowX: 'auto',
      '&::-webkit-scrollbar': { height: '4px' },
      '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: '4px' }
    }}>
      
      {/* Left: Erupted | Resolve */}
      <Stack direction="row" alignItems="center">
        <Box 
          onClick={isUnerupted ? onToggleUnerupted : undefined}
          sx={{ 
            bgcolor: '#f3f4f6', 
            borderRadius: '6px', 
            px: 0.75, 
            py: 0.25,
            cursor: isUnerupted ? 'pointer' : 'default',
            border: '1px solid #e5e7eb',
            '&:hover': { bgcolor: isUnerupted ? '#e5e7eb' : '#f3f4f6' }
          }}
        >
          <Typography sx={{ fontSize: '0.65rem', color: '#374151', fontWeight: 600 }}>
            {isUnerupted ? "Unerupted" : "Erupted"}
          </Typography>
        </Box>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: '#e5e7eb' }} />
        
        <Stack direction="row" alignItems="center" spacing={0.25} sx={{ cursor: 'pointer' }}>
          <VisibilityOutlined sx={{ fontSize: 14, color: '#2563eb' }} />
          <Typography sx={{ fontSize: '0.65rem', color: '#2563eb', fontWeight: 600 }}>
             Resolve
          </Typography>
        </Stack>
      </Stack>

      {/* Right: Tooth First | Condition First */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        border: '1px solid #e5e7eb', 
        borderRadius: '8px', 
        p: 0.25,
        bgcolor: '#fff'
      }}>
        <Stack 
          direction="row" 
          alignItems="center" 
          spacing={0.25} 
          onClick={() => setActiveView('tooth')}
          sx={{ 
            bgcolor: activeView === 'tooth' ? '#eff6ff' : 'transparent', 
            borderRadius: '6px', 
            px: 0.75, 
            py: 0.25,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <MasksOutlined sx={{ fontSize: 14, color: activeView === 'tooth' ? '#2563eb' : '#6b7280' }} />
          <Typography sx={{ fontSize: '0.65rem', color: activeView === 'tooth' ? '#2563eb' : '#6b7280', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Tooth First
          </Typography>
        </Stack>
        
        <Stack 
          direction="row" 
          alignItems="center" 
          spacing={0.25} 
          onClick={() => setActiveView('condition')}
          sx={{ 
            bgcolor: activeView === 'condition' ? '#eff6ff' : 'transparent', 
            borderRadius: '6px', 
            px: 0.75, 
            py: 0.25,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <ElectricBolt sx={{ fontSize: 14, color: activeView === 'condition' ? '#2563eb' : '#6b7280' }} />
          <Typography sx={{ fontSize: '0.65rem', color: activeView === 'condition' ? '#2563eb' : '#6b7280', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Condition First
          </Typography>
        </Stack>
      </Box>

    </Box>
  );
};

export default ExamFilterBar;
