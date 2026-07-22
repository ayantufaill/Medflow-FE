import React from 'react';
import {
  Box, Typography, TextField, Button, Alert, Paper
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import SectionHeader from './SectionHeader';

const AnalyticsSetupSection = () => {
  const { showSnackbar } = useSnackbar();
  const schedulingLink = 'https://mychart.myoryx.com/online-scheduling/index.html?realm=tf';

  const handleCopy = () => {
    navigator.clipboard.writeText(schedulingLink).then(() => {
      showSnackbar('Link copied to clipboard!', 'success');
    }).catch(() => {
      showSnackbar('Failed to copy link', 'error');
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}
    >
      <SectionHeader
        number={5}
        icon={BarChartIcon}
        title="Analytics Setup"
        subtitle="Track link performance and share the booking page"
      />

      <Box sx={{ px: 3, py: 2.5 }}>
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            '& .MuiAlert-icon': { color: '#d97706' },
            '& .MuiAlert-message': { fontSize: '0.85rem' },
          }}
        >
          Please add your Google Measurement ID in <strong>Admin → Practice Info</strong> to track UTM links.{' '}
          <Typography
            component="span"
            sx={{
              color: '#2563eb',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: 'inherit',
              fontWeight: 500,
            }}
          >
            Click here to add a new link
          </Typography>
        </Alert>

        <Box>
          <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>
            Online Scheduling Link
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              fullWidth
              size="small"
              value={schedulingLink}
              InputProps={{ readOnly: true }}
              sx={{
                maxWidth: 450,
                '& .MuiInputBase-input': { fontSize: '0.85rem', color: 'text.secondary' },
              }}
            />
            <Button
              variant="contained"
              startIcon={<ContentCopyIcon sx={{ fontSize: '0.9rem' }} />}
              onClick={handleCopy}
              sx={{
                backgroundColor: '#2563eb',
                textTransform: 'none',
                whiteSpace: 'nowrap',
                borderRadius: 5,
                px: 3,
                fontSize: '0.8rem',
                '&:hover': { backgroundColor: '#1d4ed8' },
              }}
            >
              Copy to Clipboard
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default AnalyticsSetupSection;
