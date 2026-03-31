import React from "react";
import { Box, Card, Typography, Checkbox, FormControlLabel, Stack, Divider } from "@mui/material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { fontSize, fontWeight } from "../../../constants/styles";
import ToothIcon from "../common/ToothIcon";

const HeaderLabel = ({ children }) => (
  <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: '#333' }}>
    {children}
  </Typography>
);

const Lesions = ({ expanded, onToggle }) => {
  return (
    <Card sx={{ mb: 1, borderRadius: 0, border: '1px solid #6b7cb4', bgcolor: 'white' }}>
      <Box sx={{ 
        bgcolor: '#6b7cb4', color: 'white', px: 1.5, py: 0.4, 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold }}>Lesions</Typography>
          <Box sx={{ bgcolor: '#e57373', px: 0.5, borderRadius: '2px', fontSize: fontSize.xs, fontWeight: fontWeight.bold }}>DH</Box>
        </Stack>
        <FormControlLabel
          control={<Checkbox size="small" sx={{ p: 0.25, color: 'white', '&.Mui-checked': { color: 'white' } }} />}
          label={<Typography sx={{ fontSize: fontSize.xs, fontStyle: 'italic' }}>no findings</Typography>}
          labelPlacement="start"
          sx={{ ml: 0 }}
        />
      </Box>
      
      {expanded && (
        <Box sx={{ p: 1.5 }}>
          {/* Coronal Cavitation Row */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack direction="row" spacing={0.5} alignItems="flex-start">
              <HeaderLabel>Coronal Cavitation (Caries)</HeaderLabel>
              <ChatBubbleOutlineIcon sx={{ fontSize: 14, color: '#999' }} />
            </Stack>
            <Stack direction="row" spacing={0.5}>
              <ToothIcon type="caries" color="#fff" />
              <ToothIcon type="caries" color="#f3e5ab" />
              <ToothIcon type="caries" color="#d7ccc8" />
            </Stack>
          </Stack>
          
          <Divider sx={{ my: 1.5 }} />
          
          {/* Radicular Cavitation Row */}
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: '#bca67a', cursor: 'pointer' }}>
            <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold }}>
              Radicular Cavitation, White Spot Lesion
            </Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
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

export default Lesions;
