import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import dayjs from 'dayjs';

const ReviewReport = () => {
  const [currentDate, setCurrentDate] = useState(dayjs('2026-05-08'));
  const [dateRange, setDateRange] = useState('daily');
  const [status, setStatus] = useState('none');

  const handlePrevDate = () => setCurrentDate(prev => prev.subtract(1, 'day'));
  const handleNextDate = () => setCurrentDate(prev => prev.add(1, 'day'));

  const handlePrint = () => window.print();
  const handleExport = () => alert('Exporting report as CSV...');

  return (
    <Box sx={{ p: 1, backgroundColor: '#fff', textAlign: 'left' }}>
      <Typography 
        variant="body2" 
        sx={{ color: '#337ab7', fontWeight: 500, mb: 2, textDecoration: 'underline', cursor: 'pointer' }}
      >
        Review Report:
      </Typography>

      {/* Filter Section */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 4 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Date Range:</Typography>
            <Select 
              variant="standard"
              size="small" 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              sx={{ fontSize: '0.75rem', width: 80, height: 24 }}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
            </Select>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
              <ChevronLeft 
                onClick={handlePrevDate}
                sx={{ fontSize: '1.1rem', color: '#337ab7', cursor: 'pointer', '&:hover': { opacity: 0.7 } }} 
              />
              <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7', fontWeight: 600, minWidth: 80, textAlign: 'center' }}>
                {currentDate.format('MMM DD, YYYY')}
              </Typography>
              <ChevronRight 
                onClick={handleNextDate}
                sx={{ fontSize: '1.1rem', color: '#337ab7', cursor: 'pointer', '&:hover': { opacity: 0.7 } }} 
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Date:</Typography>
            <Typography variant="caption" sx={{ fontSize: '0.75rem', borderBottom: '1px solid #ccc', width: 100, pb: 0.5 }}>
              {currentDate.format('MM/DD/YYYY')}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>Filter By Status:</Typography>
          <Select 
            variant="standard"
            size="small" 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            sx={{ fontSize: '0.75rem', width: 120, height: 24 }}
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>

          <Button 
            variant="contained" 
            size="small" 
            sx={{ ml: 'auto', textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 2, opacity: 0.3 }} />

      {/* Action Buttons & Counter */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography 
          variant="caption" 
          sx={{ color: '#337ab7', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', fontSize: '0.75rem' }}
        >
          Number of Patients: 0
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            size="small" 
            onClick={handleExport}
            sx={{ textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}
          >
            Export as CSV
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            onClick={handlePrint}
            sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}
          >
            Print
          </Button>
        </Box>
      </Box>

      {/* Empty State */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
        <Typography variant="body2" sx={{ color: '#999', fontSize: '0.85rem' }}>
          No Data Found
        </Typography>
      </Box>
    </Box>
  );
};

export default ReviewReport;
