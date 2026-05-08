import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Stack,
  Autocomplete,
  TextField
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const RecareSettingsDialog = ({ open, onClose }) => {
  const procedures = [
    { name: 'Prophy', interval: 6 },
    { name: 'Exam', interval: 6 },
    { name: 'Bw', interval: 12 },
    { name: 'Fluoride', interval: 6 },
    { name: 'PanoFmx', interval: 36 }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 1 }
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={<Checkbox defaultChecked size="small" sx={{ p: 0.5 }} />}
            label={
              <Typography sx={{ color: '#4a7abc', fontWeight: 600, fontSize: '0.9rem' }}>
                Recare patient
              </Typography>
            }
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, px: 0.5 }}>
          <Typography sx={{ color: '#999', fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.2 }}>
            Recare<br />Procedures
          </Typography>
          <Typography sx={{ color: '#999', fontSize: '0.75rem', fontWeight: 600, textAlign: 'right', lineHeight: 1.2 }}>
            Frequency<br />(Interval)
          </Typography>
        </Box>
        <Stack spacing={1}>
          {procedures.map((proc, index) => (
            <Box key={index} sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              px: 0.5,
              py: 0.2
            }}>
              <Typography sx={{ color: '#003380', fontWeight: 700, fontSize: '0.8rem' }}>
                {proc.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 50 }}>
                <Autocomplete
                  freeSolo
                  options={['6', '12', '18', '24', '36']}
                  defaultValue={proc.interval.toString()}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: false,
                        sx: { 
                          fontSize: '0.8rem', 
                          fontWeight: 700, 
                          textAlign: 'right',
                          '& input': { textAlign: 'right', py: 0 }
                        }
                      }}
                    />
                  )}
                  sx={{ width: 60 }}
                />
              </Box>
            </Box>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 1.5, justifyContent: 'flex-end', bgcolor: '#f5f5f5' }}>
        <Button 
          onClick={onClose}
          variant="contained"
          size="small"
          sx={{ 
            bgcolor: '#e0e0e0', 
            color: '#444', 
            textTransform: 'none',
            borderRadius: '20px',
            px: 3,
            fontSize: '0.75rem',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#d5d5d5' }
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecareSettingsDialog;
