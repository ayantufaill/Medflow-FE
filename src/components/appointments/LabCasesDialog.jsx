import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Link,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Menu,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from '@mui/material';
import { 
  Close as CloseIcon, 
  ArrowDropDown as ArrowDropDownIcon,
  SwapVert as SortIcon,
  Print as PrintIcon,
  FileDownload as ExportIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';

/**
 * LabCasesDialog
 * High-fidelity implementation based on user screenshot.
 */
const LabCasesDialog = ({ open, onClose }) => {
  const [includeInactive, setIncludeInactive] = useState(false);
  const [dateRange, setDateRange] = useState('Range');
  const [startDate, setStartDate] = useState('2026-03-24');
  const [endDate, setEndDate] = useState('2026-03-24');

  // Status Multi-select state
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const statusOptions = [
    'New',
    'Printed',
    'E-Shared',
    'E-Shared Pending Enclosures',
    'Sent Out',
    'Received In Office',
    'Not Received In Office',
    'Quality Checked',
    'Completed',
    'Received In Lab',
    'Lab Ready',
  ];

  const handleStatusToggle = (option) => {
    setSelectedStatuses(prev => 
      prev.includes(option) ? prev.filter(s => s !== option) : [...prev, option]
    );
  };

  const headers = [
    { label: 'Patient', sortable: true },
    { label: 'Lab Provider', sortable: true },
    { label: 'Procedures', sortable: false },
    { label: 'Due Date', sortable: true },
    { label: 'Appointment Date', sortable: true },
    { label: 'Shared Date', sortable: true },
    { label: 'Status', sortable: true },
    { label: 'Notes', sortable: false },
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          minHeight: '80vh'
        }
      }}
    >
      {/* HEADER */}
      <DialogTitle sx={{ 
        bgcolor: '#5c7cbc', // Match the blue in image
        py: 1,
        px: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        minHeight: '40px'
      }}>
        <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: '1rem' }}>
          Lab Cases
        </Typography>
        <IconButton 
          onClick={onClose}
          size="small" 
          sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#fff' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        {/* TOP LINK */}
        <Link 
          href="#" 
          underline="always" 
          sx={{ color: '#5c7cbc', fontWeight: 600, fontSize: '0.9rem', mb: 3, display: 'inline-block' }}
        >
          Lab Case Documents:
        </Link>

        {/* FILTERS SECTION */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 4 }}>
          {/* Filter Row 1 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: '0.9rem', color: '#445164' }}>Filter By:</Typography>
            <Button
              variant="contained"
              endIcon={<ArrowDropDownIcon />}
              onClick={(e) => setStatusAnchorEl(e.currentTarget)}
              sx={{ 
                bgcolor: '#445164', 
                textTransform: 'none', 
                fontSize: '0.85rem',
                height: '32px',
                px: 2,
                '&:hover': { bgcolor: '#333e4d' }
              }}
            >
              Select Status
            </Button>
            
            <Menu
              anchorEl={statusAnchorEl}
              open={Boolean(statusAnchorEl)}
              onClose={() => setStatusAnchorEl(null)}
              PaperProps={{
                sx: {
                  bgcolor: '#eceff4', // Light blue-grey as in screenshot
                  boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
                  mt: 0.5,
                  '& .MuiMenuItem-root': {
                    py: 0.25,
                    fontSize: '0.85rem',
                    color: '#445164'
                  }
                }
              }}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option} onClick={() => handleStatusToggle(option)} dense>
                  <Checkbox 
                    size="small" 
                    checked={selectedStatuses.includes(option)} 
                    sx={{ p: 0.5, mr: 1 }}
                  />
                  <Typography sx={{ fontSize: '0.85rem' }}>{option}</Typography>
                </MenuItem>
              ))}
            </Menu>
            <FormControlLabel
              control={<Checkbox size="small" checked={includeInactive} onChange={(e) => setIncludeInactive(e.target.checked)} />}
              label={<Typography sx={{ fontSize: '0.85rem', color: '#445164' }}>Include Inactive</Typography>}
              sx={{ ml: 2 }}
            />
          </Box>

          {/* Filter Row 2 (Date Filter) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: '0.9rem', color: '#445164', fontWeight: 600 }}>Lab Due Date Filter:</Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.85rem', color: '#445164' }}>Date Range:</Typography>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                size="small"
                sx={{ height: '32px', fontSize: '0.85rem', width: '120px' }}
              >
                <MenuItem value="Range">Range</MenuItem>
                <MenuItem value="Today">Today</MenuItem>
                <MenuItem value="Week">This Week</MenuItem>
              </Select>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
              <Typography sx={{ fontSize: '0.85rem', color: '#445164' }}>Start Date:</Typography>
              <TextField
                type="text"
                value={dayjs(startDate).format('MM/DD/YYYY')}
                size="small"
                variant="standard"
                sx={{ width: '100px', '& .MuiInput-input': { fontSize: '0.85rem', pb: 0.5 } }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
              <Typography sx={{ fontSize: '0.85rem', color: '#445164' }}>End Date:</Typography>
              <TextField
                type="text"
                value={dayjs(endDate).format('MM/DD/YYYY')}
                size="small"
                variant="standard"
                sx={{ width: '100px', '& .MuiInput-input': { fontSize: '0.85rem', pb: 0.5 } }}
              />
            </Box>

            <Select
              value="Lab Due Date"
              size="small"
              sx={{ height: '32px', fontSize: '0.85rem', minWidth: '140px', ml: 1 }}
              IconComponent={ArrowDropDownIcon}
            >
              <MenuItem value="Lab Due Date">Lab Due Date</MenuItem>
            </Select>

            <Box sx={{ flexGrow: 1 }} />

            <Button
              variant="contained"
              sx={{ 
                bgcolor: '#5c7cbc', 
                textTransform: 'none', 
                fontSize: '0.85rem', 
                height: '32px',
                px: 3,
                fontWeight: 600
              }}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* ACTION ROW */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mb: 1 }}>
          <Button
            variant="contained"
            startIcon={<ExportIcon sx={{ fontSize: 18 }} />}
            sx={{ bgcolor: '#445164', textTransform: 'none', fontSize: '0.85rem', height: '32px', px: 2 }}
          >
            Export as CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon sx={{ fontSize: 18 }} />}
            sx={{ 
              bgcolor: '#d8b16b', // Tan color from image
              '&:hover': { bgcolor: '#c49c56' },
              textTransform: 'none', 
              fontSize: '0.85rem', 
              height: '32px', 
              px: 2 
            }}
          >
            Print
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Link href="#" underline="always" sx={{ color: '#5c7cbc', fontSize: '0.8rem' }}>
            Expand Notes
          </Link>
        </Box>

        {/* TABLE SECTION */}
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#fff' }}>
                {headers.map((header) => (
                  <TableCell 
                    key={header.label}
                    sx={{ 
                      py: 1.5, 
                      fontSize: '0.85rem', 
                      fontWeight: 600, 
                      color: '#445164',
                      borderBottom: '2px solid #e0e0e0'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {header.label}
                      {header.sortable && <SortIcon sx={{ fontSize: 14, color: '#999' }} />}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No results found
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 0 }}>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{ 
            bgcolor: '#9e9e9e', 
            '&:hover': { bgcolor: '#757575' },
            textTransform: 'none',
            fontSize: '0.9rem',
            px: 4,
            borderRadius: '4px'
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LabCasesDialog;
