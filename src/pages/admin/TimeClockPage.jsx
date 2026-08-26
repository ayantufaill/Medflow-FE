import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Select,
  MenuItem,
  IconButton,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import {
  Add as AddIcon,
  Print as PrintIcon,
  ContentCopy as CopyIcon,
  AccessTime as HistoryIcon,
} from '@mui/icons-material';

import { roundedSelectMenuProps } from '../../constants/styles';
import AddTimeClockRecordModal from './AddTimeClockRecordModal';

const TimeClockPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState('This Week');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mock data for the table
  const timesheetData = []; // Empty for now to match the screenshot

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ fontFamily: 'Inter, sans-serif', color: '#111' }}>
          Time Clock
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              color: '#64748B',
              minWidth: 'auto',
              mr: 4,
              px: 0,
              '&.Mui-selected': {
                color: '#2262EF',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#2262EF',
              height: 3,
            },
          }}
        >
          <Tab label="Timesheets" />
          <Tab label="Pending Approvals" />
        </Tabs>
      </Box>

      {/* Controls & Stats (Only show for Timesheets tab) */}
      {activeTab === 0 && (
        <>
          {/* Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3, gap: 2 }}>
            <Typography
              component="span"
              sx={{ color: '#2262EF', fontWeight: 600, fontSize: '13px', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Export as CSV
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#475569' }}>
                Date Range:
              </Typography>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                size="small"
                MenuProps={roundedSelectMenuProps}
                sx={{
                  bgcolor: 'white',
                  borderRadius: '6px',
                  minWidth: 120,
                  height: 32,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' },
                  '& .MuiSelect-select': { py: 0, display: 'flex', alignItems: 'center', fontSize: '13px', color: '#334155', fontWeight: 500 }
                }}
              >
                <MenuItem value="This Week">This Week</MenuItem>
                <MenuItem value="Last Week">Last Week</MenuItem>
                <MenuItem value="This Month">This Month</MenuItem>
                <MenuItem value="Custom">Custom Range</MenuItem>
              </Select>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton size="small" sx={{ color: '#64748B' }} onClick={() => setIsAddModalOpen(true)}>
                <AddIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: '#64748B' }}>
                <PrintIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: '#64748B' }}>
                <CopyIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: '#64748B' }}>
                <HistoryIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Summary Statistics */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 8, mb: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#1E293B', mb: 0.5 }}>
                00:00
              </Typography>
              <Typography sx={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                Regular hours
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#1E293B', mb: 0.5 }}>
                0
              </Typography>
              <Typography sx={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                # Breaks
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#1E293B', mb: 0.5 }}>
                00:00
              </Typography>
              <Typography sx={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                Break Hours
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#1E293B', mb: 0.5 }}>
                00:00
              </Typography>
              <Typography sx={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                Total hours
              </Typography>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer sx={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['User Name', 'Role', 'Regular Hours', '# Breaks', 'Break Hours', 'Total Hours'].map((header) => (
                    <TableCell
                      key={header}
                      align={['Regular Hours', '# Breaks', 'Break Hours', 'Total Hours'].includes(header) ? 'center' : 'left'}
                      sx={{
                        bgcolor: '#F8FAFC',
                        color: '#475569',
                        fontWeight: 600,
                        fontSize: '13px',
                        py: 1.5,
                        borderBottom: '1px solid #E2E8F0',
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {timesheetData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography sx={{ color: '#94A3B8', fontSize: '14px' }}>
                        No timesheet records found for this period.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  timesheetData.map((row, index) => (
                    <TableRow key={index} hover>
                      {/* We will populate data here when API is integrated */}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={timesheetData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 25, 50]}
              SelectProps={{
                MenuProps: roundedSelectMenuProps,
              }}
              sx={{
                borderTop: '1px solid #E2E8F0',
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontSize: '13px',
                  color: '#64748B',
                },
              }}
            />
          </TableContainer>
        </>
      )}

      {/* Pending Approvals Tab Content */}
      {activeTab === 1 && (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography sx={{ color: '#64748B' }}>No pending approvals found.</Typography>
        </Box>
      )}

      <AddTimeClockRecordModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </Paper>
  );
};

export default TimeClockPage;
