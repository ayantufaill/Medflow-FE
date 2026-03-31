import React from "react";
import { Box, Card, Typography, Checkbox, FormControlLabel, Stack } from "@mui/material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { fontSize, fontWeight } from "../../../constants/styles";
import ToothIcon from "../common/ToothIcon";

const HeaderLabel = ({ children }) => (
  <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: '#333' }}>
    {children}
  </Typography>
);

const Watch = ({ expanded, onToggle }) => {
  return (
    <Card sx={{ mb: 1, borderRadius: 0, border: '1px solid #6b7cb4', bgcolor: 'white' }}>
      <Box sx={{ 
        bgcolor: '#6b7cb4', color: 'white', px: 1.5, py: 0.4, 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
      }}>
        <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold }}>Watch</Typography>
        <FormControlLabel
          control={<Checkbox size="small" sx={{ p: 0.25, color: 'white', '&.Mui-checked': { color: 'white' } }} />}
          label={<Typography sx={{ fontSize: fontSize.xs, fontStyle: 'italic' }}>no findings</Typography>}
          labelPlacement="start"
          sx={{ ml: 0 }}
        />
      </Box>
      
      {expanded && (
        <Box sx={{ p: 1.5 }}>
          {/* Watch Row */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack direction="row" spacing={0.5} alignItems="flex-start">
              <HeaderLabel>Watch</HeaderLabel>
              <ChatBubbleOutlineIcon sx={{ fontSize: 14, color: '#999' }} />
            </Stack>
            <Stack direction="row" spacing={0.5}>
              <ToothIcon type="caries" color="#fff" />
              <ToothIcon type="caries" color="#eee" />
              <ToothIcon type="watch" color="#fff" />
              <ToothIcon label="W" color="#b39ddb" />
            </Stack>
          </Stack>
          
          {/* Tooth Number */}
          <Stack direction="row" justifyContent="flex-end" mt={1}>
            <Box sx={{ px: 1, py: 0.3, border: '1px solid #eee', fontSize: 12, bgcolor: 'white', borderRadius: '2px' }}>
              9
            </Box>
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
