import { useState } from "react";
import { Box, Card, Typography, Checkbox, FormControlLabel, Stack } from "@mui/material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { fontSize, fontWeight } from "../../../constants/styles";

const HeaderLabel = ({ children }) => (
  <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: '#333' }}>
    {children}
  </Typography>
);

const GeneralToothSurvey = ({ expanded, onToggle, missingTeeth = [], onMissingTeethClick }) => {
  const [noFindings, setNoFindings] = useState(false);
  return (
    <Card sx={{ mb: 1, borderRadius: 0, border: '1px solid #6b7cb4', bgcolor: 'white' }}>
      <Box sx={{ 
        bgcolor: '#6b7cb4', color: 'white', px: 1.5, py: 0.4, 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
      }}>
        <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold }}>General Tooth Survey</Typography>
        <FormControlLabel
          control={<Checkbox size="small" checked={noFindings} onChange={(e) => setNoFindings(e.target.checked)} sx={{ p: 0.25, color: 'white', '&.Mui-checked': { color: 'white' } }} />}
          label={<Typography sx={{ fontSize: fontSize.xs, fontStyle: 'italic' }}>no findings</Typography>}
          labelPlacement="start"
          sx={{ ml: 0 }}
        />
      </Box>
      
      {expanded && (
        <Box sx={{ p: 1.5, ...(noFindings && { opacity: 0.5, pointerEvents: 'none', userSelect: 'none' }) }}>
          {/* Missing Teeth Row */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack 
              direction="row" 
              spacing={0.5} 
              alignItems="center" 
              onClick={onMissingTeethClick}
              sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
            >
              <HeaderLabel>Missing Teeth</HeaderLabel>
              <ChatBubbleOutlineIcon sx={{ fontSize: 14, color: '#999' }} />
            </Stack>
            <Stack direction="row" spacing={0.5}>
              {[
                { l: 'EX', c: '#f3e5ab' }, 
                { l: 'P', c: '#e8f5e9' }, 
                { l: 'B', c: '#fce4ec' },
                { l: 'F', c: '#fffde7' }, 
                { l: 'C', c: '#e0f7fa' }, 
                { l: 'T', c: '#e0f2f1' }
              ].map((item) => (
                <Box 
                  key={item.l} 
                  onClick={item.l === 'EX' ? onMissingTeethClick : undefined}
                  sx={{ 
                    width: 22, height: 22, border: '1px solid #ccc', bgcolor: item.c,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: 10, borderRadius: '3px', cursor: item.l === 'EX' ? 'pointer' : 'default',
                    '&:hover': item.l === 'EX' ? { opacity: 0.8 } : {}
                  }}
                >
                  {item.l}
                </Box>
              ))}
            </Stack>
          </Stack>
          
          {/* Tooth Numbers */}
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" mt={1} flexWrap="wrap" gap={0.5}>
            {[...missingTeeth].sort((a, b) => a - b).map((n) => (
              <Box key={n} sx={{ px: 0.8, py: 0.3, border: '1px solid #eee', fontSize: 12, bgcolor: 'white', borderRadius: '2px' }}>
                {n}
              </Box>
            ))}
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

export default GeneralToothSurvey;
