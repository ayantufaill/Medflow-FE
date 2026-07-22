import React from "react";
import { Box, Stack, Typography, Popover } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { fontSize, fontWeight } from "../../constants/styles";
import SelectToothDialog from "./common/SelectToothDialog";

const AdditionalTeethSection = ({ additionalTeeth = [], setAdditionalTeeth }) => {
  const [additionalTeethAnchorEl, setAdditionalTeethAnchorEl] = React.useState(null);
  const [showSelectToothDialog, setShowSelectToothDialog] = React.useState(false);

  return (
    <>
      {/* Additional Footer Controls */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 4, ml: 2 }}>
        <Stack 
          direction="row" 
          spacing={1} 
          alignItems="center" 
          onClick={(e) => setAdditionalTeethAnchorEl(e.currentTarget)}
          sx={{ cursor: 'pointer', color: '#6b7cb4', '&:hover': { opacity: 0.8 } }}
        >
          <AddCircleIcon fontSize="small" />
          <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold }}>Additional teeth</Typography>
        </Stack>
        
        {/* Badges for selected additional teeth */}
        <Stack direction="row" spacing={0.5}>
          {additionalTeeth.map(tooth => (
            <Box
              key={tooth}
              sx={{
                position: 'relative',
                '&:hover .delete-btn': {
                  display: 'flex'
                }
              }}
            >
              <Box sx={{ 
                px: 0.6, py: 0.1, border: '1px solid',
                borderColor: '#4a69bd',
                bgcolor: '#f8fafc',
                color: '#4a69bd',
                fontSize: '0.75rem', fontWeight: 'bold',
                borderRadius: '2px', minWidth: '20px', textAlign: 'center',
                userSelect: 'none'
              }}>
                {tooth}
              </Box>
              
              <Box
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setAdditionalTeeth(prev => prev.filter(t => t !== tooth));
                }}
                sx={{
                  display: 'none',
                  position: 'absolute',
                  top: -9,
                  right: -6,
                  width: 14,
                  height: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: '#e74c3c',
                  fontWeight: 'bold',
                  lineHeight: 1,
                  zIndex: 10,
                  '&:hover': {
                    color: '#c0392b'
                  }
                }}
              >
                ×
              </Box>
            </Box>
          ))}
        </Stack>
      </Stack>

      {/* Popover Menu for Additional Teeth Options */}
      <Popover
        open={Boolean(additionalTeethAnchorEl)}
        anchorEl={additionalTeethAnchorEl}
        onClose={() => setAdditionalTeethAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            width: 220,
            boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            mt: 0.5
          }
        }}
      >
        <Stack spacing={0.5} sx={{ p: 0.5 }}>
          {[
            'Supernumerary adult teeth',
            'Retained Primary teeth',
            'Supernumerary primary teeth'
          ].map(opt => (
            <Box
              key={opt}
              onClick={() => {
                setAdditionalTeethAnchorEl(null);
                setShowSelectToothDialog(true);
              }}
              sx={{
                px: 1.5,
                py: 1,
                fontSize: '0.8rem',
                color: '#334155',
                cursor: 'pointer',
                borderRadius: '2px',
                transition: 'background-color 0.15s',
                '&:hover': {
                  bgcolor: '#f1f5f9',
                  color: '#1976d2'
                }
              }}
            >
              {opt}
            </Box>
          ))}
        </Stack>
      </Popover>

      {/* Dialog for selecting additional teeth */}
      <SelectToothDialog
        open={showSelectToothDialog}
        onClose={() => setShowSelectToothDialog(false)}
        selectedTeeth={additionalTeeth}
        onSelect={(tooth) => {
          setAdditionalTeeth(prev => 
            prev.includes(tooth) ? prev.filter(t => t !== tooth) : [...prev, tooth]
          );
          setShowSelectToothDialog(false);
        }}
      />
    </>
  );
};

export default AdditionalTeethSection;
