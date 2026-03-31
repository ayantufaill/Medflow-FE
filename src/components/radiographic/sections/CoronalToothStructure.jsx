import React from "react";
import { Box, Card, Typography, Checkbox, FormControlLabel, Stack, Divider } from "@mui/material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { fontSize, fontWeight } from "../../../constants/styles";
import RestorationToothIcon from "../common/RestorationToothIcon";
import ToothNumber from "../common/ToothNumber";

const CoronalToothStructure = ({ expanded, onToggle }) => {
  return (
    <Card variant="outlined" sx={{ mb: 1, borderRadius: 0, border: '1px solid #6b7cb4' }}>
      <Box sx={{ 
        bgcolor: '#6b7cb4', color: 'white', px: 1.5, py: 0.4, 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold }}>Coronal Tooth Structure</Typography>
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
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: fontSize.xs }}>Coronal radiolucency</Typography>
              <ChatBubbleOutlineIcon sx={{ fontSize: 14, color: '#bbb' }} />
            </Stack>
            <Stack direction="row" spacing={0.5}>
              <RestorationToothIcon fill="#fff" />
              <RestorationToothIcon fill="#f3e5ab" />
              <RestorationToothIcon fill="#d7ccc8" />
            </Stack>
          </Stack>
          
          <Divider />
          
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mt={1}>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: fontSize.xs }}>Watch</Typography>
              <ChatBubbleOutlineIcon sx={{ fontSize: 14, color: '#bbb' }} />
            </Stack>
            <Stack direction="row" spacing={0.5}>
              <RestorationToothIcon fill="#fff" />
              <RestorationToothIcon fill="#b39ddb" />
            </Stack>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
            <ToothNumber label="9" />
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* Direct Row */}
          <Box sx={{ py: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium }}>Direct</Typography>
              <Stack direction="row" spacing={0.2}>
                <RestorationToothIcon fill="#fff" />
                <RestorationToothIcon fill="#666" />
                <RestorationToothIcon fill="#eee" />
                <RestorationToothIcon fill="#ffd700" />
                <RestorationToothIcon fill="#add8e6" />
              </Stack>
            </Stack>
          </Box>
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" mb={1}>
            <ToothNumber label="4 OM" disabled />
            <ToothNumber label="5 DO" disabled />
            <ToothNumber label="10 MFLD" />
            <ToothNumber label="31 O" active />
            <ToothNumber label="31" />
            <ToothNumber label="32 O" active />
            <ToothNumber label="32" />
          </Stack>

          <Divider />

          {/* Indirect Row */}
          <Box sx={{ py: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium }}>Indirect</Typography>
              <Stack direction="row" spacing={0.2}>
                <RestorationToothIcon fill="#ffd700" />
                <RestorationToothIcon fill="#fff" />
                <RestorationToothIcon fill="#444" />
                <RestorationToothIcon fill="#eee" />
                <RestorationToothIcon fill="#fff" />
                <RestorationToothIcon fill="#fff" />
                <RestorationToothIcon type="incisor" fill="#eee" />
                <RestorationToothIcon fill="#b39ddb" />
              </Stack>
            </Stack>
          </Box>
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" mb={1}>
            <ToothNumber label="14" />
            <ToothNumber label="19" active />
            <ToothNumber label="20" />
            <ToothNumber label="20" active />
          </Stack>

          <Divider />

          {/* Restoration Concerns Row */}
          <Box sx={{ py: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium }}>Restoration Concerns</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.2 }}>
                <RestorationToothIcon status="occlusal" />
                <RestorationToothIcon status="gold" />
                <RestorationToothIcon fill="#ffd700" />
                <RestorationToothIcon fill="#eee" />
                <RestorationToothIcon fill="#ffd700" />
                <RestorationToothIcon type="incisor" fill="#fff" />
                <RestorationToothIcon fill="#fff" />
                {/* Row 2 of icons */}
                <Box /> <Box /> <Box /> <Box />
                <RestorationToothIcon fill="#ffd700" />
                <RestorationToothIcon status="forbidden" fill="#999" />
                <RestorationToothIcon fill="#ffd700" />
                <RestorationToothIcon fill="#ffd700" />
              </Box>
            </Stack>
          </Box>
          
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

export default CoronalToothStructure;
