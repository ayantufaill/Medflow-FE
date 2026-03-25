import React, { useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Popover, Stack, Typography } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const PatientRequestModal = ({ open, onClose, anchorEl }) => {
  const [formItems, setFormItems] = useState([
    { label: "Dental History", sent: "2/27/2026", checked: false },
    { label: "Medical History", sent: "2/27/2026", checked: true },
    { label: "HIPAA", sent: "2/27/2026", checked: false },
    { label: "Confidential", sent: "2/27/2026", checked: true },
  ]);

  const [customForms, setCustomForms] = useState([
    { label: "TDS Financial Agreement", checked: true },
    { label: "HIPAA 2026", checked: false },
  ]);

  const handleToggleForm = (index) => {
    setFormItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleToggleCustomForm = (index) => {
    setCustomForms((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1.5,
          maxWidth: 320,
          minWidth: 280,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }
      }}
      sx={{
        '& .MuiPopover-paper': {
          mt: 1,
        }
      }}
    >
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#1e293b', mb: 1.5, px: 0.5 }}>
        Request Patient Updates
      </Typography>
      <Stack spacing={0}>
          {formItems.map((item, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={item.checked}
                    onChange={() => handleToggleForm(i)}
                    size="small" 
                    sx={{ 
                      color: '#94a3b8', 
                      '&.Mui-checked': { color: '#64748b' },
                      '& .MuiSvgIcon-root': { fontSize: 18 }
                    }} 
                  />
                }
                label={
                  <Typography sx={{ fontSize: 12, color: '#1e293b', fontWeight: 500 }}>
                    {item.label}
                  </Typography>
                }
              />
              <Typography sx={{ fontSize: 10, color: '#f58220', ml: 1, fontWeight: 500 }}>
                ({item.sent})
              </Typography>
            </Box>
          ))}

          <Typography sx={{ fontSize: 11, color: '#94a3b8', mt: 1, mb: 0.5, px: 0.5, fontWeight: 600 }}>
            Custom Forms
          </Typography>
          
          <FormControlLabel
            control={
              <Checkbox 
                checked={customForms[0].checked}
                onChange={() => handleToggleCustomForm(0)}
                size="small" 
                sx={{ 
                  color: '#94a3b8', 
                  '&.Mui-checked': { color: '#64748b' },
                  '& .MuiSvgIcon-root': { fontSize: 18 }
                }} 
              />
            }
            label={
              <Typography sx={{ fontSize: 12, color: '#1e293b', fontWeight: 500 }}>
                TDS Financial Agreement
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={customForms[1].checked}
                onChange={() => handleToggleCustomForm(1)}
                size="small" 
                sx={{ color: '#94a3b8', '& .MuiSvgIcon-root': { fontSize: 18 } }} 
              />
            }
            label={
              <Typography sx={{ fontSize: 12, color: '#1e293b', fontWeight: 500 }}>
                HIPAA 2026
              </Typography>
            }
          />
        </Stack>

        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ 
              bgcolor: '#f58220', 
              borderRadius: 8, 
              textTransform: 'none', 
              px: 2,
              py: 0.5,
              fontSize: 11,
              fontWeight: 600,
              '&:hover': { bgcolor: '#e37010' } 
            }}
          >
            Send Request
          </Button>
          <Button
            onClick={onClose}
            variant="contained"
            sx={{ 
              bgcolor: '#7f8c8d', 
              borderRadius: 8, 
              textTransform: 'none', 
              px: 2,
              py: 0.5,
              fontSize: 11,
              fontWeight: 600,
              '&:hover': { bgcolor: '#636e72' } 
            }}
          >
            Close
          </Button>
        </Box>
      </Popover>
  );
};

export default PatientRequestModal;
