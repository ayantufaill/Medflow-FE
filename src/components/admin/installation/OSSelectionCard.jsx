import React from 'react';
import { Box, Typography, Radio, RadioGroup, FormControlLabel, FormControl, Button } from '@mui/material';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

const OSSelectionCard = ({ selectedOs, setSelectedOs, onSubmit }) => {
  return (
    <Box sx={{ mt: 5 }}>
      <Box sx={{
        width: { xs: '100%', md: '565px' },
        height: '169px',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
        bgcolor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <Box sx={{
          width: '100%',
          height: '40px',
          bgcolor: '#F2F6FC',
          borderBottom: '0.8px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          px: 2
        }}>
           <InsertDriveFileOutlinedIcon sx={{ color: '#2F6FED', fontSize: '1.2rem', mr: 1 }} />
           <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#11223F', fontSize: '12px' }}>
             ORYX IMAGING INSTALLATION GUIDE
           </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: '14px', color: '#6B7280', mb: 1 }}>
              On which operating system yo will be installing oryx imaging system?
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={selectedOs}
                onChange={(e) => setSelectedOs(e.target.value)}
              >
                <FormControlLabel 
                  value="Windows" 
                  control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#2F6FED' } }} />} 
                  label={<Typography sx={{ fontSize: '14px', color: '#11223F' }}>Windows</Typography>} 
                  sx={{ mr: 4 }}
                />
                <FormControlLabel 
                  value="macOs" 
                  control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#2F6FED' } }} />} 
                  label={<Typography sx={{ fontSize: '14px', color: '#11223F' }}>MacOS</Typography>} 
                />
              </RadioGroup>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={!selectedOs}
              sx={{
                bgcolor: '#2F6FED',
                color: '#fff',
                textTransform: 'none',
                width: '93.53px',
                height: '35.33px',
                borderRadius: '8px',
                fontSize: '14px',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#2558be',
                  boxShadow: 'none'
                },
                '&.Mui-disabled': {
                  bgcolor: '#e2e8f0',
                  color: '#a0aec0'
                }
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OSSelectionCard;
