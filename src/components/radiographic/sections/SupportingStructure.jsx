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

const SupportingStructure = ({ expanded, onToggle, noFindings = false, onToggleNoFindings }) => {
  return (
    <Card sx={{ mb: 2, borderRadius: 2, border: '1px solid #e5e7eb', bgcolor: 'white', boxShadow: 'none', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: '#2563eb', color: 'white', px: 2, py: 1, 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer'
      }} onClick={onToggle}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Supporting Structure</Typography>
          <Box sx={{ bgcolor: '#ef4444', px: 0.5, borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>MM</Box>
          <Box sx={{ bgcolor: '#ef4444', px: 0.5, borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>DH</Box>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography sx={{ fontSize: '0.75rem', color: '#e0e7ff', fontWeight: 500 }}>no findings</Typography>
          <Box
            onClick={(e) => { e.stopPropagation(); onToggleNoFindings?.(); }}
            sx={{
              width: 14, height: 14, borderRadius: '50%',
              border: '1.5px solid #e0e7ff',
              bgcolor: noFindings ? '#e0e7ff' : 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            {noFindings && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#fff' }} />}
          </Box>
        </Stack>
      </Box>
      
      {expanded && (
        <Box sx={{ p: 1.5, ...(noFindings && { opacity: 0.4, pointerEvents: 'none', userSelect: 'none' }) }}>
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
