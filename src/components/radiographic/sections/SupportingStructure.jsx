import React from "react";
import { Box, Card, Typography, Checkbox, FormControlLabel, Stack, Divider, Radio, RadioGroup } from "@mui/material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { fontSize, fontWeight } from "../../../constants/styles";

const HeaderBadge = ({ label, color }) => (
  <Box sx={{ 
    bgcolor: color, color: 'white', px: 0.5, 
    borderRadius: '2px', fontSize: fontSize.xs, fontWeight: fontWeight.bold 
  }}>
    {label}
  </Box>
);

const DataTag = ({ label }) => (
  <Box sx={{ 
    px: 0.6, py: 0.2, border: '1px solid #ddd', fontSize: fontSize.xs, 
    borderRadius: '2px', bgcolor: 'white', color: '#333', minWidth: '22px', textAlign: 'center'
  }}>
    {label}
  </Box>
);

const SupportingStructure = ({ expanded, onToggle }) => {
  return (
    <Card variant="outlined" sx={{ mb: 1, borderRadius: 0, border: '1px solid #6b7cb4' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: '#6b7cb4', color: 'white', px: 1.5, py: 0.5, 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold }}>Supporting Structure</Typography>
          <HeaderBadge label="MM" color="#ef9a9a" />
          <HeaderBadge label="DH" color="#ef9a9a" />
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
          {/* Generalized Horizontal Bone Loss */}
          <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium }}>Generalized Horizontal</Typography>
          <Typography sx={{ fontSize: fontSize.xs, mb: 1 }}>Bone Loss <Box component="span" sx={{ fontSize: fontSize.xs }}>Relative to CEJ</Box></Typography>
          
          <RadioGroup row defaultValue="2-4">
            {['Zero', '< 2 mm', '2 - 4 mm', '> 4 mm'].map((val) => (
              <FormControlLabel 
                key={val}
                value={val === '2 - 4 mm' ? '2-4' : val}
                control={<Radio size="small" sx={{ p: 0.5 }} />}
                label={<Typography sx={{ fontSize: fontSize.xs }}>{val}</Typography>}
                sx={{ mr: 1 }}
              />
            ))}
          </RadioGroup>

          <Divider sx={{ my: 1 }} />

          {/* Localized Horizontal Bone Loss */}
          <Typography sx={{ fontSize: fontSize.sm, mb: 1 }}>Localized Horizontal Bone Loss <Box component="span" sx={{ fontSize: fontSize.xs }}>Relative to CEJ</Box></Typography>
          <Box sx={{ pl: 1 }}>
            <Typography sx={{ fontSize: fontSize.sm, py: 0.5 }}>&lt;2 mm</Typography>
            <Divider />
            <Typography sx={{ fontSize: fontSize.sm, py: 0.5 }}>2-4 mm</Typography>
            <Divider />
            <Typography sx={{ fontSize: fontSize.sm, py: 0.5 }}>&gt;4 mm</Typography>
          </Box>

          <Divider sx={{ my: 1, borderBottomWidth: 2 }} />

          {/* Vertical Defect */}
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography sx={{ fontSize: fontSize.sm }}>Vertical Defect</Typography>
            <ChatBubbleOutlineIcon sx={{ fontSize: 13, color: '#bbb' }} />
          </Stack>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.5, pl: 1 }}>
            <Typography sx={{ fontSize: fontSize.sm }}>Mild</Typography>
            <Stack direction="row" spacing={0.5}>
              <DataTag label="19" />
              <DataTag label="31" />
            </Stack>
          </Stack>
          <Divider />
          <Typography sx={{ fontSize: fontSize.sm, py: 0.5, pl: 1 }}>Moderate</Typography>
          <Divider />
          <Typography sx={{ fontSize: fontSize.sm, py: 0.5, pl: 1 }}>Severe</Typography>

          <Divider sx={{ my: 1 }} />

          {/* Radiographic Findings */}
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ py: 0.5 }}>
            <Typography sx={{ fontSize: fontSize.sm }}>Periapical Radiolucency</Typography>
            <ChatBubbleOutlineIcon sx={{ fontSize: 13, color: '#bbb' }} />
          </Stack>
          <Divider />
          
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ py: 0.8 }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography sx={{ fontSize: fontSize.sm }}>Periapical Opacity</Typography>
              <ChatBubbleOutlineIcon sx={{ fontSize: 13, color: '#bbb' }} />
            </Stack>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" justifyContent="flex-end" sx={{ maxWidth: '60%' }}>
              <DataTag label="18 (4 x 4)" />
              <DataTag label="19 (- x -)" />
              <DataTag label="21 (4 x 4)" />
            </Stack>
          </Stack>

          <Divider sx={{ my: 1 }} />

          {/* Furcation Involvement */}
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ py: 0.5 }}>
            <Typography sx={{ fontSize: fontSize.sm }}>Furcation Involvement</Typography>
            <ChatBubbleOutlineIcon sx={{ fontSize: 13, color: '#bbb' }} />
          </Stack>
          <Typography sx={{ fontSize: fontSize.sm, py: 0.5, pl: 1 }}>Class II</Typography>
          <Divider />
          <Typography sx={{ fontSize: fontSize.sm, py: 0.5, pl: 1 }}>Class III</Typography>

          {/* Footer */}
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
        </Box>
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
    </Card>
  );
};

export default SupportingStructure;
