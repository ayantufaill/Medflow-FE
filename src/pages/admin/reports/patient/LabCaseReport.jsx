import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Menu,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  DeleteOutline,
  EditOutlined,
  VisibilityOutlined,
  CheckCircle,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';

const DUMMY_DATA = [
  { 
    patient: 'Stephanie Peterson', 
    provider: 'Evident', 
    procedures: '- Cd8999.1 Retainer delivery', 
    dueDate: '05/08/2026', 
    apptDate: '', 
    sharedDate: '', 
    status: 'Quality Checked',
    statusIcon: <CheckCircle sx={{ color: '#10b981', fontSize: '1rem', mr: 1 }} />
  },
];

const LabCaseReport = () => {
  const [dateRange, setDateRange] = useState('daily');
  const [currentDate, setCurrentDate] = useState(dayjs('2026-05-08'));

  const handlePrevDate = () => setCurrentDate(prev => prev.subtract(1, 'day'));
  const handleNextDate = () => setCurrentDate(prev => prev.add(1, 'day'));

  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [dueDateAnchorEl, setDueDateAnchorEl] = useState(null);

  const handleStatusClick = (event) => setStatusAnchorEl(event.currentTarget);
  const handleStatusClose = () => setStatusAnchorEl(null);

  const handleDueDateClick = (event) => setDueDateAnchorEl(event.currentTarget);
  const handleDueDateClose = () => setDueDateAnchorEl(null);

  const handlePrint = () => window.print();
  const handleExport = () => alert('Exporting report as CSV...');

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const handleSaveTemplate = (name) => alert(`Template "${name}" saved!`);

  return (
    <Box sx={{ p: 1, backgroundColor: '#fff', textAlign: 'left' }}>
      <Typography 
        variant="body2" 
        sx={{ color: '#337ab7', fontWeight: 500, mb: 2, textDecoration: 'underline', cursor: 'pointer' }}
      >
        Lab Case Documents:
      </Typography>

      {/* Filter Section */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>Filter By:</Typography>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={handleStatusClick}
            endIcon={<ChevronRight sx={{ fontSize: '0.8rem', transform: 'rotate(90deg)' }} />}
            sx={{ textTransform: 'none', color: '#4a89dc', borderColor: '#4a89dc', fontSize: '0.75rem', height: 26 }}
          >
            Select Status
          </Button>
          <Menu
            anchorEl={statusAnchorEl}
            open={Boolean(statusAnchorEl)}
            onClose={handleStatusClose}
          >
            <MenuItem onClick={handleStatusClose} sx={{ fontSize: '0.75rem' }}>All Statuses</MenuItem>
            <MenuItem onClick={handleStatusClose} sx={{ fontSize: '0.75rem' }}>Quality Checked</MenuItem>
            <MenuItem onClick={handleStatusClose} sx={{ fontSize: '0.75rem' }}>Pending</MenuItem>
            <MenuItem onClick={handleStatusClose} sx={{ fontSize: '0.75rem' }}>Sent to Lab</MenuItem>
          </Menu>

          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <Checkbox size="small" sx={{ p: 0.5 }} />
            <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Include Inactive</Typography>
          </Box>
        </Box>

        <Typography variant="caption" sx={{ color: '#337ab7', fontWeight: 600, display: 'block', mt: 1 }}>Lab Due Date Filter:</Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 4 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Date Range:</Typography>
            <Select 
              variant="standard"
              size="small" 
              value={dateRange} 
              sx={{ fontSize: '0.75rem', width: 80, height: 24 }}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
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

          <Button 
            variant="outlined" 
            size="small" 
            onClick={handleDueDateClick}
            endIcon={<ChevronRight sx={{ fontSize: '0.8rem', transform: 'rotate(90deg)' }} />}
            sx={{ textTransform: 'none', color: '#4a89dc', borderColor: '#4a89dc', fontSize: '0.75rem', height: 26, ml: 2 }}
          >
            Lab Due Date
          </Button>
          <Menu
            anchorEl={dueDateAnchorEl}
            open={Boolean(dueDateAnchorEl)}
            onClose={handleDueDateClose}
          >
            <MenuItem onClick={handleDueDateClose} sx={{ fontSize: '0.75rem' }}>Lab Due Date</MenuItem>
            <MenuItem onClick={handleDueDateClose} sx={{ fontSize: '0.75rem' }}>Appointment Date</MenuItem>
            <MenuItem onClick={handleDueDateClose} sx={{ fontSize: '0.75rem' }}>Shared Date</MenuItem>
          </Menu>

          <Button 
            variant="contained" 
            size="small" 
            onClick={() => setTemplateDialogOpen(true)}
            sx={{ ml: 'auto', textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}
          >
            Create Template
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ ml: 1, textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>

      <Box sx={{ borderBottom: '1.5px solid #337ab7', mb: 2 }} />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, mb: 1 }}>
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
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', color: '#337ab7', cursor: 'pointer', mb: 1, fontSize: '0.7rem' }}>
        Expand Notes
      </Typography>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Patient', 'Lab Provider', 'Procedures', 'Due Date', 'Appointment Date', 'Shared Date', 'Status', 'Notes'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, fontSize: '0.72rem', borderBottom: '1px solid #ddd' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {DUMMY_DATA.map((row, i) => (
              <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem' }}>{row.provider}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem' }}>{row.procedures}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem' }}>{row.dueDate}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem' }}>{row.apptDate}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem' }}>{row.sharedDate}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ backgroundColor: '#10b981', color: '#fff', borderRadius: 1, p: 0.3, mr: 1, display: 'flex' }}>
                      <CheckCircle sx={{ fontSize: '0.8rem' }} />
                    </Box>
                    <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{row.status}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: '0.7rem' }}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" sx={{ p: 0.3 }}><DeleteOutline sx={{ fontSize: '1rem', color: '#666' }} /></IconButton>
                    <IconButton size="small" sx={{ p: 0.3 }}><EditOutlined sx={{ fontSize: '1rem', color: '#666' }} /></IconButton>
                    <IconButton size="small" sx={{ p: 0.3 }}><VisibilityOutlined sx={{ fontSize: '1rem', color: '#666' }} /></IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateTemplateDialog 
        open={templateDialogOpen} 
        onClose={() => setTemplateDialogOpen(false)} 
        onSave={handleSaveTemplate} 
      />
    </Box>
  );
};

export default LabCaseReport;
