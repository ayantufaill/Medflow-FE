import React, { useState } from "react";
import { Box, Card, Typography, Checkbox, FormControlLabel, Stack, Button } from "@mui/material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { fontSize, fontWeight } from "../../../constants/styles";
import ToothIcon from "../common/ToothIcon";

const HeaderLabel = ({ children }) => (
  <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: '#333' }}>
    {children}
  </Typography>
);

const Watch = ({ 
  expanded, 
  onToggle,
  toothFindings = {},
  setToothFindings,
  selectedTeeth = [],
  setSelectedTeeth,
  activeToothNum = null,
  setActiveToothNum,
  setDetailModalTooth
}) => {
  const [noFindings, setNoFindings] = useState(false);

  const handleApplyWatch = () => {
    if (!selectedTeeth || selectedTeeth.length === 0) return;
    
    setToothFindings(prev => {
      const updated = { ...prev };
      selectedTeeth.forEach(num => {
        if (!updated[num]) {
          updated[num] = {
            findings: ['Watch'],
            surfaces: [],
            depth: 'Limited to enamel',
            notes: []
          };
        } else if (!updated[num].findings.includes('Watch')) {
          updated[num] = {
            ...updated[num],
            findings: [...updated[num].findings, 'Watch']
          };
        }
      });
      return updated;
    });
    
    setActiveToothNum(selectedTeeth[0]);
  };

  return (
    <Card sx={{ mb: 1, borderRadius: 0, border: '1px solid #6b7cb4', bgcolor: 'white' }}>
      <Box sx={{ 
        bgcolor: '#6b7cb4', color: 'white', px: 1.5, py: 0.4, 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
      }}>
        <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold }}>Watch</Typography>
        <FormControlLabel
          control={<Checkbox size="small" checked={noFindings} onChange={(e) => setNoFindings(e.target.checked)} sx={{ p: 0.25, color: 'white', '&.Mui-checked': { color: 'white' } }} />}
          label={<Typography sx={{ fontSize: fontSize.xs, fontStyle: 'italic' }}>no findings</Typography>}
          labelPlacement="start"
          sx={{ ml: 0 }}
        />
      </Box>
      
      {expanded && (
        <Box sx={{ p: 1.5, ...(noFindings && { opacity: 0.5, pointerEvents: 'none', userSelect: 'none' }) }}>
          {/* Watch Row */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack 
              direction="row" 
              spacing={0.5} 
              alignItems="center"
              onClick={handleApplyWatch}
              sx={selectedTeeth.length > 0 ? { cursor: 'pointer', '&:hover': { opacity: 0.8 } } : { opacity: 0.8 }}
            >
              <HeaderLabel>Watch</HeaderLabel>
              <ChatBubbleOutlineIcon sx={{ fontSize: 14, color: '#999' }} />
            </Stack>
            <Stack direction="row" spacing={0.5}>
              <Box onClick={handleApplyWatch}><ToothIcon type="caries" color="#fff" /></Box>
              <Box onClick={handleApplyWatch}><ToothIcon type="caries" color="#eee" /></Box>
              <Box onClick={handleApplyWatch}><ToothIcon type="watch" color="#fff" /></Box>
              <Box onClick={handleApplyWatch}><ToothIcon label="W" color="#b39ddb" /></Box>
            </Stack>
          </Stack>
          
          {/* Tooth Badges for Watched Teeth */}
          <Stack direction="row" spacing={0.8} justifyContent="flex-end" flexWrap="wrap" useFlexGap sx={{ mt: 1.5, mb: 1, pr: 0.5 }}>
            {Object.entries(toothFindings)
              .filter(([, data]) => data && data.findings && data.findings.includes('Watch'))
              .map(([toothNum]) => {
                return (
                  <Button
                    key={toothNum}
                    size="small"
                    variant="contained"
                    onClick={() => {
                      setActiveToothNum(toothNum);
                      setDetailModalTooth(toothNum);
                    }}
                    sx={{
                      fontSize: '0.75rem',
                      py: 0.15,
                      px: 1,
                      minWidth: 'auto',
                      lineHeight: 1.2,
                      textTransform: 'none',
                      color: '#fff',
                      bgcolor: '#3b82f6',
                      fontWeight: 'bold',
                      borderRadius: '4px',
                      '&:hover': {
                        bgcolor: '#2563eb'
                      }
                    }}
                  >
                    {toothNum}
                  </Button>
                );
              })}
          </Stack>

          {/* Footer Expand Icon */}
          <Box 
            sx={{ display: 'flex', justifyContent: 'center', mt: 1, cursor: 'pointer' }}
            onClick={onToggle}
          >
            <KeyboardDoubleArrowUpIcon 
              sx={{ 
                fontSize: 20, 
                color: '#666',
                transform: 'rotate(180deg)',
                transition: 'transform 0.3s'
              }} 
            />
          </Box>
        </Box>
      )}
      
      {!expanded && (
        <Box 
          sx={{ display: 'flex', justifyContent: 'center', p: 1, cursor: 'pointer', bgcolor: '#fafafa' }}
          onClick={onToggle}
        >
          <KeyboardDoubleArrowUpIcon 
            sx={{ 
              fontSize: 20, 
              color: '#666',
              transform: 'rotate(0deg)',
              transition: 'transform 0.3s'
            }} 
          />
        </Box>
      )}
    </Card>
  );
};

export default Watch;
