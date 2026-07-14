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
      px: 1.5,
      py: 1, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      bgcolor: '#fff', 
      mb: 2 
    }}>
      
      {/* Left: Erupted | Resolve */}
      <Stack direction="row" alignItems="center">
        <Box 
          onClick={isUnerupted ? onToggleUnerupted : undefined}
          sx={{ 
            bgcolor: '#f3f4f6', 
            borderRadius: '6px', 
            px: 1.5, 
            py: 0.5,
            cursor: isUnerupted ? 'pointer' : 'default',
            border: '1px solid #e5e7eb',
            '&:hover': { bgcolor: isUnerupted ? '#e5e7eb' : '#f3f4f6' }
          }}
        >
          <Typography sx={{ fontSize: '0.8rem', color: '#374151', fontWeight: 600 }}>
            {isUnerupted ? "Unerupted" : "Erupted"}
          </Typography>
        </Box>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: '#e5e7eb' }} />
        
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ cursor: 'pointer' }}>
          <VisibilityOutlined sx={{ fontSize: 16, color: '#2563eb' }} />
          <Typography sx={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>
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
        p: 0.5,
        bgcolor: '#fff'
      }}>
        <Stack 
          direction="row" 
          alignItems="center" 
          spacing={0.5} 
          onClick={() => setActiveView('tooth')}
          sx={{ 
            bgcolor: activeView === 'tooth' ? '#eff6ff' : 'transparent', 
            borderRadius: '6px', 
            px: 1.5, 
            py: 0.5,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <MasksOutlined sx={{ fontSize: 16, color: activeView === 'tooth' ? '#2563eb' : '#6b7280' }} />
          <Typography sx={{ fontSize: '0.75rem', color: activeView === 'tooth' ? '#2563eb' : '#6b7280', fontWeight: 600 }}>
            Tooth First
          </Typography>
        </Stack>
        
        <Stack 
          direction="row" 
          alignItems="center" 
          spacing={0.5} 
          onClick={() => setActiveView('condition')}
          sx={{ 
            bgcolor: activeView === 'condition' ? '#eff6ff' : 'transparent', 
            borderRadius: '6px', 
            px: 1.5, 
            py: 0.5,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <ElectricBolt sx={{ fontSize: 16, color: activeView === 'condition' ? '#2563eb' : '#6b7280' }} />
          <Typography sx={{ fontSize: '0.75rem', color: activeView === 'condition' ? '#2563eb' : '#6b7280', fontWeight: 600 }}>
            Condition First
          </Typography>
        </Stack>
      </Box>

    </Box>
  );
};

export default ExamFilterBar;
