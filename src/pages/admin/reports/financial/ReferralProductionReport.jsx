import React, { useState, useCallback } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Sector, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

import { ReportLayout } from '../../../../components/reports/ui';
import medflowLogo from '../../../../assets/medflow-logo.png';
import ReferralProductionFilters from '../../../../components/reports/financial/ReferralProductionFilters';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import { useReferralProduction } from '../../../../hooks/reports/financial/useReferralProduction';

const PIE_COLORS = [
  '#d8b4fe', '#7c3aed', '#3b82f6', '#1e3a5f', '#f59e0b',
  '#22c55e', '#ef4444', '#4c1d95', '#fbbf24', '#a3a33a',
  '#065f46', '#dc2626', '#06b6d4', '#f97316', '#8b5cf6', '#ec4899',
];

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
  const {
    summaryData,
    detailData,
    trendData,
    loading,
    appliedFilters,
    handleApply,
    handleClear,
    handleExportCSV,
    handlePrint
  } = useReferralProduction();

  const [activeIndex, setActiveIndex] = useState(-1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSource, setDialogSource] = useState('');
  const [dialogPatients, setDialogPatients] = useState([]);

  const pieData = summaryData.map((d, i) => ({
    name: d.source,
    value: d.production,
    count: d.count,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const onPieEnter = useCallback((_, index) => {
    setActiveIndex(index);
  }, []);

  const onPieLeave = useCallback(() => {
    setActiveIndex(-1);
  }, []);

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

  const handleDialogPrint = () => {
    const tableEl = document.getElementById('referral-dialog-table');
    if (!tableEl) return;

    const htmlContent = `
      <html>
        <head>
          <title>${dialogSource}</title>
          <style>
            body { font-family: sans-serif; font-size: 12px; background-color: #fff; color: #000; padding: 20px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .no-print, button, svg.MuiSvgIcon-root { display: none !important; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${window.location.origin}${medflowLogo}" style="height: 45px; object-fit: contain;" alt="Medflow Logo" />
          </div>
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">${dialogSource}</h2>
          <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 30px;">
            ${tableEl.outerHTML}
          </div>
        </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.srcdoc = htmlContent;

    iframe.onload = () => {
      iframe.contentWindow.onafterprint = () => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      };
      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 15000);
    };

    document.body.appendChild(iframe);
  };

  return (
    <ReportLayout title="Referral Production Report">
      <ReferralProductionFilters
        onApplyFilters={handleApply}
        onClearAll={handleClear}
      />

      <ProductionReportActions
        onExportCsv={handleExportCSV}
        onPrint={handlePrint}
        hasData={summaryData.length > 0}
      />

      {/* Chart container styling matching the new UI */}
      <Box id="referral-production-print-area" sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', mt: 2, backgroundColor: '#fff' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <Typography sx={{ color: 'text.secondary' }}>Loading...</Typography>
          </Box>
        ) : pieData.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <Typography sx={{ color: 'text.secondary' }}>No referral data found for the selected period.</Typography>
          </Box>
        ) : appliedFilters.showTrend ? (
          <Box sx={{ display: 'flex', alignItems: 'center', height: 450, width: '100%', p: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis 
                  tickFormatter={(val) => `$${val}`} 
                  tick={{ fill: '#64748b' }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <RechartsTooltip 
                  formatter={(value, name) => [`$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, name]}
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontSize: '0.8rem' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '0.8rem', paddingTop: '10px' }} />
                {summaryData.map((item, index) => (
                  <Line
                    key={item.source}
                    type="monotone"
                    dataKey={item.source}
                    stroke={PIE_COLORS[index % PIE_COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', height: 450, width: '100%', p: 2 }}>
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
                  <RechartsTooltip
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

            <Box sx={{ flex: '0 0 45%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: '6px', pl: 2, overflowY: 'auto', overflowX: 'hidden', maxHeight: '100%', py: 1 }}>
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

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
        sx={{ zIndex: 9999 }}
        PaperProps={{ sx: { borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
      >
        <Box sx={{ bgcolor: '#f3f8fd', py: 1.5, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e5eb' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon sx={{ color: '#2563eb', fontSize: '20px' }} />
            <Typography sx={{ color: '#09121f', fontWeight: 600, fontSize: '15px' }}>
              {dialogSource}
            </Typography>
          </Box>
          <IconButton
            onClick={handleDialogClose}
            size="small"
            sx={{ color: '#64748b', '&:hover': { bgcolor: '#f1f5f9' } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <DialogContent sx={{ px: 3, pb: 2, pt: 2, bgcolor: 'white' }}>
          <TableContainer id="referral-dialog-table" sx={{ border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#f8f9fa', py: 1.5, borderBottom: '1px solid #e2e8f0', color: '#4a5568', textTransform: 'uppercase' } }}>
                  <TableCell className="no-print" sx={{ width: 100 }}></TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Production</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dialogPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      No patient records found for this referral source.
                    </TableCell>
                  </TableRow>
                ) : (
                  dialogPatients.map((patient, idx) => (
                    <TableRow
                      key={idx}
                      sx={{ '& td': { fontSize: '0.8rem', py: 1.5, borderBottom: '1px solid #e2e8f0', color: '#1e293b' }, '&:last-child td': { borderBottom: 0 } }}
                    >
                      <TableCell className="no-print">
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton size="small" sx={{ p: 0.2, color: '#3b82f6' }}><PersonIcon sx={{ fontSize: 16 }} /></IconButton>
                          <IconButton size="small" sx={{ p: 0.2, color: '#f59e0b' }}><DescriptionIcon sx={{ fontSize: 16 }} /></IconButton>
                          <IconButton size="small" sx={{ p: 0.2, color: '#10b981' }}><AttachMoneyIcon sx={{ fontSize: 16 }} /></IconButton>
                          <IconButton size="small" sx={{ p: 0.2, color: '#8b5cf6' }}><ReceiptIcon sx={{ fontSize: 16 }} /></IconButton>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 3, py: 1.5, bgcolor: 'white', borderTop: '1px solid #e0e5eb' }}>
          <Button
            variant="contained" size="small" onClick={handleDialogExportCSV}
            startIcon={<FileDownloadIcon />}
            sx={{ textTransform: 'none', bgcolor: '#3CA2E0', borderRadius: '8px', px: 2, py: 0.8, boxShadow: 'none', fontWeight: 600, '&:hover': { bgcolor: '#2b8ac3', boxShadow: 'none' } }}
          >
            Export As CSV
          </Button>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined" size="small" onClick={handleDialogClose}
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', px: 3, py: 0.8, borderColor: '#e0e5eb', color: '#5c646f', '&:hover': { bgcolor: '#fafbfc', borderColor: '#e0e5eb' }, borderRadius: 2 }}
            >
              Close
            </Button>
            <Button
              variant="outlined" size="small" onClick={handleDialogPrint}
              startIcon={<PrintIcon />}
              sx={{ textTransform: 'none', borderColor: '#3b82f6', color: '#3b82f6', borderRadius: '8px', px: 2, py: 0.8, fontWeight: 600 }}
            >
              Print
            </Button>
          </Box>
        </Box>
      </Dialog>
    </ReportLayout>
  );
};

export default ReferralProductionReport;
