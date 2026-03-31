import React from "react";
import { Box, Typography, Stack, Divider, Checkbox, FormControlLabel } from "@mui/material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { fontSize, fontWeight } from "../../../constants/styles";
import RestorationToothIcon from "../common/RestorationToothIcon";
import ToothNumber from "../common/ToothNumber";

const DentalSection = ({ title, children, badge }) => (
  <Box sx={{ mb: 1, border: '1px solid #b4bedb', overflow: 'hidden', bgcolor: 'white' }}>
    <Box sx={{ 
      bgcolor: '#6b7cb4', 
      color: 'white', 
      px: 1.5, 
      py: 0.4, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold }}>{title}</Typography>
        {badge && (
          <Box sx={{ bgcolor: '#e57373', px: 0.5, borderRadius: '2px', fontSize: fontSize.xs, fontWeight: fontWeight.bold }}>
            {badge}
          </Box>
        )}
      </Stack>
      <FormControlLabel
        control={<Checkbox size="small" sx={{ p: 0.25, color: 'white', '&.Mui-checked': { color: 'white' } }} />}
        label={<Typography sx={{ fontSize: fontSize.xs, fontStyle: 'italic' }}>no findings</Typography>}
        labelPlacement="start"
        sx={{ ml: 0 }}
      />
    </Box>
    <Box sx={{ p: 1.5, bgcolor: 'white' }}>{children}</Box>
  </Box>
);

const RadicularToothStructure = ({ expanded, onToggle }) => {
  return (
    <DentalSection title="Radicular Tooth Structure" badge="DH">
      {expanded && (
        <>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
            <Stack direction="row" spacing={0.5}>
              <Typography sx={{ fontSize: fontSize.sm }}>Root Canal Treatment</Typography>
              <ChatBubbleOutlineIcon sx={{ fontSize: 13, color: '#bbb', mt: 0.3 }} />
            </Stack>
            <Stack direction="row" spacing={1}>
              <RestorationToothIcon fill="#fff" />
              <RestorationToothIcon fill="#ffebee" />
              <RestorationToothIcon fill="#f3e5ab" />
            </Stack>
          </Stack>
          
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" mb={1.5}>
            <ToothNumber label="14" />
            <ToothNumber label="19" />
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mt={1.5}>
            <Stack direction="row" spacing={0.5}>
              <Typography sx={{ fontSize: fontSize.sm }}>Posts</Typography>
              <ChatBubbleOutlineIcon sx={{ fontSize: 13, color: '#bbb', mt: 0.3 }} />
            </Stack>
            <Stack direction="row" spacing={1}>
              <RestorationToothIcon fill="#ffd700" />
              <RestorationToothIcon fill="#90a4ae" />
              <RestorationToothIcon fill="#bcaaa4" />
            </Stack>
          </Stack>

          <Divider sx={{ mt: 2 }} />
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
            <Typography sx={{ fontSize: fontSize.xs, color: '#bca67a', fontWeight: fontWeight.bold, fontStyle: 'italic' }}>
              Resorption, Canal Calcification, Root Fracture
            </Typography>
          </Stack>
          
          {/* Footer Expand Icon */}
          <Box 
            sx={{ display: 'flex', justifyContent: 'center', mt: 2, cursor: 'pointer' }}
            onClick={onToggle}
          >
            <KeyboardDoubleArrowUpIcon 
              sx={{ 
                fontSize: 18, 
                color: '#666',
                transform: 'rotate(180deg)',
                transition: 'transform 0.3s'
              }} 
            />
          </Box>
        </>
      )}
      
      {!expanded && (
        <Box 
          sx={{ display: 'flex', justifyContent: 'center', p: 1, cursor: 'pointer', bgcolor: '#fafafa' }}
          onClick={onToggle}
        >
          <KeyboardDoubleArrowUpIcon 
            sx={{ 
              fontSize: 18, 
              color: '#666',
              transform: 'rotate(0deg)',
              transition: 'transform 0.3s'
            }} 
          />
        </Box>
      )}
    </DentalSection>
  );
};

export default RadicularToothStructure;
