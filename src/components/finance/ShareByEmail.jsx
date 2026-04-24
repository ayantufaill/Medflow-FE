import React, { useState } from 'react';
import { Box, Typography, TextField, Checkbox, FormControlLabel, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const ShareByEmail = ({ onClose }) => {
  const [startDate, setStartDate] = useState(dayjs('2023-09-20'));
  const [endDate, setEndDate] = useState(dayjs('2026-04-15'));
  const [onlyOpen, setOnlyOpen] = useState(true);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box
      sx={{
        width: '400px',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#7788bb',
          color: 'white',
          padding: '8px',
          textAlign: 'center',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'normal', margin: 0 }}>
          Share Statement
        </Typography>
      </Box>

      {/* Body */}
      <Box sx={{ padding: '15px', color: '#333' }}>
        {/* Start Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <Typography component="span" sx={{ fontSize: '13px', minWidth: '100px' }}>Start Date:</Typography>
          <DatePicker
            enableAccessibleFieldDOMStructure={false}
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            slots={{
              textField: (params) => (
                <TextField
                  {...params}
                  variant="standard"
                  sx={{
                    width: '140px',
                    '& .MuiInput-root': {
                      fontSize: '13px',
                      '&:before': {
                        borderBottom: '1px solid #ddd',
                      },
                      '&:hover:not(.Mui-disabled):before': {
                        borderBottom: '1px solid #bbb',
                      },
                      '&:after': {
                        borderBottom: '1px solid #7788bb',
                      },
                    },
                    '& input': {
                      padding: '4px 0',
                      fontSize: '13px',
                    },
                  }}
                />
              ),
            }}
          />
        </Box>

        {/* End Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <Typography component="span" sx={{ fontSize: '13px', minWidth: '100px' }}>End Date:</Typography>
          <DatePicker
            enableAccessibleFieldDOMStructure={false}
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            slots={{
              textField: (params) => (
                <TextField
                  {...params}
                  variant="standard"
                  sx={{
                    width: '140px',
                    '& .MuiInput-root': {
                      fontSize: '13px',
                      '&:before': {
                        borderBottom: '1px solid #ddd',
                      },
                      '&:hover:not(.Mui-disabled):before': {
                        borderBottom: '1px solid #bbb',
                      },
                      '&:after': {
                        borderBottom: '1px solid #7788bb',
                      },
                    },
                    '& input': {
                      padding: '4px 0',
                      fontSize: '13px',
                    },
                  }}
                />
              ),
            }}
          />
        </Box>

        {/* Checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              checked={onlyOpen}
              onChange={() => setOnlyOpen(!onlyOpen)}
              sx={{
                padding: '4px',
                '& .MuiSvgIcon-root': {
                  fontSize: '16px',
                },
              }}
            />
          }
          label="Only Open Invoices"
          sx={{ 
            marginTop: '10px', 
            fontSize: '12px',
            gap: '8px',
            marginLeft: 'auto',
            '& .MuiTypography-root': {
              fontSize: '12px',
            }
          }}
        />

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '15px' }}>
          <Button
            variant="contained"
            size="small"
            sx={{
              padding: '6px 16px',
              borderRadius: '4px',
              backgroundColor: '#7788bb',
              fontSize: '13px',
              '&:hover': {
                backgroundColor: '#6677aa',
              },
            }}
          >
            Share
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={onClose}
            sx={{
              padding: '6px 16px',
              borderRadius: '4px',
              backgroundColor: '#a9a9a9',
              fontSize: '13px',
              '&:hover': {
                backgroundColor: '#999999',
              },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
    </LocalizationProvider>
  );
};

export default ShareByEmail;
