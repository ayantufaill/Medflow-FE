import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Checkbox, FormControlLabel,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProvidersForDropdown } from '../../../../store/slices/providerSlice';
import {
  fetchReferralProductionReport,
  setDateFilter,
  selectReferralSummary,
  selectReferralDetail,
  selectReferralLoading,
  selectReferralDateFilter,
} from '../../../../store/slices/referralReportSlice';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector,
} from 'recharts';

const PIE_COLORS = [
  '#d8b4fe', '#7c3aed', '#3b82f6', '#1e3a5f', '#f59e0b',
  '#22c55e', '#ef4444', '#4c1d95', '#fbbf24', '#a3a33a',
  '#065f46', '#dc2626', '#06b6d4', '#f97316', '#8b5cf6', '#ec4899',
];

const filterBtnStyle = {
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.75rem',
  px: 2,
  py: 0.5,
  borderRadius: '4px',
  minWidth: 'auto',
  color: '#fff',
  bgcolor: '#c7944a',
  '&:hover': { bgcolor: '#b07e3a' },
};

const activeFilterBtnStyle = {
  ...filterBtnStyle,
  bgcolor: '#a0703a',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
};

// Active shape renderer for hover effect on pie
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="#fff"
        strokeWidth={2}
        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
      />
    </g>
  );
};

const ReferralProductionReport = () => {
  const dispatch = useDispatch();

  // Redux state
  const summaryData = useSelector(selectReferralSummary);
  const detailData = useSelector(selectReferralDetail);
  const loading = useSelector(selectReferralLoading);
  const dateFilter = useSelector(selectReferralDateFilter);

  // Local UI state
  const [showTrend, setShowTrend] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSource, setDialogSource] = useState('');
  const [dialogPatients, setDialogPatients] = useState([]);

  // Fetch data on mount and when dateFilter changes
  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchReferralProductionReport({ dateFilter }));
  }, [dispatch, dateFilter]);

  // Prepare pie chart data from Redux state
  const pieData = summaryData.map((d, i) => ({
    name: d.source,
    value: d.production,
    count: d.count,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  // Hover handlers
  const onPieEnter = useCallback((_, index) => {
    setActiveIndex(index);
  }, []);

  const onPieLeave = useCallback(() => {
    setActiveIndex(-1);
  }, []);

  // Click handler — open the patient dialog using Redux detail data
  const handleSliceClick = (sourceName) => {
    setDialogSource(sourceName);
    const patients = detailData[sourceName] || [];
    setDialogPatients(patients);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogSource('');
    setDialogPatients([]);
  };

  // Dialog CSV export
  const handleDialogExportCSV = () => {
    const headers = ['id', 'Patient Name', 'Production'];
    const rows = dialogPatients.map(p => [
      p.id,
      p.name,
      `$${p.production.toFixed(2)}`,
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${dialogSource.replace(/[^a-zA-Z0-9]/g, '_')}_Patients.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dialog Print
  const handleDialogPrint = () => {
    const tableEl = document.getElementById('referral-dialog-table');
    if (!tableEl) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>' + dialogSource + '</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: sans-serif; } table { width: 100%; border-collapse: collapse; font-size: 12px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('h2 { color: #1976d2; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>' + dialogSource + '</h2>');
    printWindow.document.write(tableEl.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Main CSV export (pie chart summary)
  const handleExportCSV = () => {
    const headers = ['Referral Source', 'Count', 'Production'];
    const rows = summaryData.map(r => [
      r.source,
      r.count,
      `$${r.production.toFixed(2)}`,
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Referral_Production_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDateFilterChange = (filter) => {
    dispatch(setDateFilter(filter));
  };

  const filterButtons = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'this_week' },
    { label: 'This Month', value: 'this_month' },
    { label: 'This Year', value: 'this_year' },
    { label: 'Range', value: 'range' },
  ];

  return (
    <Box sx={{ p: 0 }}>
      {/* Top filter row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {filterButtons.map((btn) => (
            <Button
              key={btn.value}
              size="small"
              variant="contained"
              onClick={() => handleDateFilterChange(btn.value)}
              sx={dateFilter === btn.value ? activeFilterBtnStyle : filterBtnStyle}
            >
              {btn.label}
            </Button>
          ))}
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={showTrend}
                onChange={(e) => setShowTrend(e.target.checked)}
                sx={{ py: 0 }}
              />
            }
            label={<Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>Show Trend</Typography>}
            sx={{ ml: 1 }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={handleExportCSV}
            sx={{
              textTransform: 'none', fontWeight: 600, fontSize: '0.75rem',
              px: 2, py: 0.5, bgcolor: '#4a90e2', '&:hover': { bgcolor: '#357abd' },
            }}
          >
            Export As CSV
          </Button>
          <Button
            variant="contained"
            size="small"
            disabled
            sx={{
              textTransform: 'none', fontWeight: 600, fontSize: '0.75rem',
              px: 2, py: 0.5, bgcolor: '#6b7280', color: '#fff',
              '&.Mui-disabled': { bgcolor: '#6b7280', color: '#fff' },
            }}
          >
            Create Template
          </Button>
        </Box>
      </Box>

      {/* Bar Graph / Line Graph toggle buttons */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button 
          variant="contained" 
          size="small" 
          disabled 
          sx={{ 
            ...filterBtnStyle,
            '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#9e9e9e' }
          }}
        >
          Bar Graph
        </Button>
        <Button 
          variant="contained" 
          size="small" 
          disabled 
          sx={{ 
            ...filterBtnStyle,
            '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#9e9e9e' }
          }}
        >
          Line Graph
        </Button>
      </Box>

      {/* Pie Chart Section */}
      <Box
        sx={{
          border: '2px solid #3b82f6',
          borderRadius: 1,
          p: 3,
          backgroundColor: '#fff',
          position: 'relative',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b', mb: 2 }}>
          Referral Production Piechart
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <Typography sx={{ color: 'text.secondary' }}>Loading...</Typography>
          </Box>
        ) : pieData.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <Typography sx={{ color: 'text.secondary' }}>No referral data found for the selected period.</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', height: 450, width: '100%' }}>
            {/* Pie Chart */}
            <Box sx={{ flex: '0 0 55%', height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="55%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={180}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={1}
                    activeIndex={activeIndex >= 0 ? activeIndex : undefined}
                    activeShape={renderActiveShape}
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                    onClick={(_, index) => handleSliceClick(pieData[index]?.name)}
                    style={{ cursor: 'pointer' }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        opacity={activeIndex === -1 || activeIndex === index ? 1 : 0.4}
                        style={{ transition: 'opacity 0.3s ease', cursor: 'pointer' }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => {
                      const item = pieData.find(d => d.name === name);
                      return [`$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${item?.count || 0} referrals)`, name];
                    }}
                    contentStyle={{
                      borderRadius: 8, border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontSize: '0.8rem',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Legend */}
            <Box sx={{ flex: '0 0 45%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px', pl: 2 }}>
              {pieData.map((item, index) => {
                const isHovered = activeIndex === index;
                return (
                  <div
                    key={`legend-${index}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '4px 8px', borderRadius: 4, cursor: 'pointer',
                      backgroundColor: isHovered ? 'rgba(0,0,0,0.06)' : 'transparent',
                      transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(-1)}
                    onClick={() => handleSliceClick(item.name)}
                  >
                    <div style={{
                      width: 14, height: 14, backgroundColor: item.color,
                      borderRadius: 2, flexShrink: 0,
                      boxShadow: isHovered ? '0 0 0 2px rgba(0,0,0,0.2)' : 'none',
                    }} />
                    <span style={{
                      fontSize: isHovered ? '0.8rem' : '0.75rem',
                      color: item.color,
                      fontWeight: isHovered ? 700 : 500,
                      transition: 'all 0.2s ease',
                    }}>
                      {item.name} ({item.count}) ${item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>

      {/* Patient Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 1, overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ bgcolor: '#1976d2', color: '#fff', fontWeight: 700, fontSize: '1rem', textAlign: 'center', py: 1.2 }}>
          {dialogSource}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <TableContainer id="referral-dialog-table">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', width: 100 }}></TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>id</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Patient Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Production</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dialogPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No patient records found for this referral source.
                    </TableCell>
                  </TableRow>
                ) : (
                  dialogPatients.map((patient, idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        '&:hover': { backgroundColor: '#f5f5f5' },
                        '& td': { fontSize: '0.8rem', py: 0.8, borderBottom: '1px solid #eee' },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.3 }}>
                          <IconButton size="small" sx={{ p: 0.2, color: '#4a90e2' }}><PersonIcon sx={{ fontSize: 16 }} /></IconButton>
                          <IconButton size="small" sx={{ p: 0.2, color: '#f5a623' }}><DescriptionIcon sx={{ fontSize: 16 }} /></IconButton>
                          <IconButton size="small" sx={{ p: 0.2, color: '#22c55e' }}><AttachMoneyIcon sx={{ fontSize: 16 }} /></IconButton>
                          <IconButton size="small" sx={{ p: 0.2, color: '#7c3aed' }}><ReceiptIcon sx={{ fontSize: 16 }} /></IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>{patient.id}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>${patient.production.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
          <Button
            variant="contained" size="small" onClick={handleDialogExportCSV}
            sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', bgcolor: '#22c55e', '&:hover': { bgcolor: '#16a34a' } }}
          >
            Export As CSV
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained" size="small" onClick={handleDialogClose}
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', bgcolor: '#6b7280', '&:hover': { bgcolor: '#4b5563' } }}
            >
              Close
            </Button>
            <Button
              variant="contained" size="small" onClick={handleDialogPrint}
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
            >
              Print
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReferralProductionReport;
