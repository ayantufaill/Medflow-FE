import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Tabs, 
  Tab,
  CircularProgress
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { kpiService } from '../../../services/kpi.service';

const KpiDashboard = () => {
  const [subTab, setSubTab] = useState(0);

  const colors = {
    navy: '#1a3a6b',
    gold: '#bc9363',
    blue: '#1d4ed8',
    cyan: '#0891b2',
    greyBorder: '#cbd5e1',
    lightBg: '#f8fafc',
    textDark: '#1e293b',
    textMuted: '#64748b'
  };

  const months = [
    { label: 'May', year: '(2026)' },
    { label: 'April', year: '(2026)' },
    { label: 'March', year: '(2026)' },
    { label: 'February', year: '(2026)' },
    { label: 'January', year: '(2026)' },
    { label: 'December', year: '(2025)' },
    { label: 'November', year: '(2025)' },
    { label: 'October', year: '(2025)' },
    { label: 'September', year: '(2025)' },
    { label: 'August', year: '(2025)' },
    { label: 'July', year: '(2025)' },
    { label: 'June', year: '(2025)' }
  ];

  const [groups, setGroups] = useState([]);
  const [providerList, setProviderList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpis = async () => {
      setLoading(true);
      try {
        const [mainData, providerData] = await Promise.all([
          kpiService.getMainKpis(),
          kpiService.getProviderKpis()
        ]);
        setGroups(mainData || []);
        setProviderList(providerData || []);
      } catch (err) {
        console.error('Failed to load KPIs:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchKpis();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Create Header Row
    const monthHeaders = months.map(m => `${m.label} ${m.year}`).join(",");
    
    if (subTab === 0) {
      // Main Dashboard CSV
      csvContent += `Category,Metric,${monthHeaders}\n`;
      groups.forEach(group => {
        group.rows.forEach(row => {
          // Escape quotes in label to avoid csv breaks
          const cleanLabel = row.label.replace(/"/g, '""');
          // Wrap values in quotes to handle potential commas in numbers (e.g. "53,211.8")
          const cleanValues = row.values.map(val => `"${val}"`).join(",");
          csvContent += `"${group.title}","${cleanLabel}",${cleanValues}\n`;
        });
      });
    } else {
      // Provider Dashboard CSV
      csvContent += `Provider,Category,Metric,${monthHeaders}\n`;
      providerList.forEach(provider => {
        provider.groups.forEach(group => {
          group.rows.forEach(row => {
            const cleanLabel = row.label.replace(/"/g, '""');
            const cleanValues = row.values.map(val => `"${val}"`).join(",");
            csvContent += `"${provider.name}","${group.title}","${cleanLabel}",${cleanValues}\n`;
          });
        });
      });
    }

    // Download the file
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const fileName = subTab === 0 ? "main_kpi_dashboard.csv" : "provider_kpi_dashboard.csv";
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderTable = (activeGroupsList, providerName = null) => {
    return (
      <Box sx={{ mb: 6 }}>
        {providerName && (
          <Box sx={{ mb: 2, pl: 0.5 }}>
            <Typography 
              sx={{ 
                color: '#1d4ed8', 
                fontWeight: 600, 
                fontSize: '0.88rem', 
                cursor: 'pointer', 
                textDecoration: 'underline',
                display: 'inline-block',
                '&:hover': {
                  color: '#1a3a6b'
                }
              }}
            >
              {providerName}
            </Typography>
          </Box>
        )}

        <TableContainer 
          component={Paper} 
          sx={{ 
            boxShadow: 'none', 
            border: '1px solid #e2e8f0', 
            borderRadius: '4px', 
            width: '100%',
            overflowX: 'auto'
          }}
        >
          <Table size="small" sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#ffffff' }}>
                <TableCell sx={{ borderBottom: '1.5px solid #cbd5e1', width: 220 }} />
                {months.map((m, idx) => (
                  <TableCell 
                    key={idx} 
                    align="right" 
                    sx={{ 
                      borderBottom: '1.5px solid #cbd5e1', 
                      py: 1.5,
                      px: 1,
                      minWidth: 85
                    }}
                  >
                    <Typography sx={{ fontSize: '0.76rem', fontWeight: 700, color: colors.textDark }}>
                      {m.label}
                    </Typography>
                    <Typography sx={{ fontSize: '0.66rem', color: colors.textMuted }}>
                      {m.year}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {activeGroupsList.map((group, groupIdx) => (
                <React.Fragment key={groupIdx}>
                  {group.rows.map((row, rowIdx) => (
                    <TableRow 
                      key={rowIdx} 
                      sx={{ 
                        '&:hover': { backgroundColor: '#f8fafc' }
                      }}
                    >
                      <TableCell 
                        sx={{ 
                          borderBottom: '1px solid #e2e8f0',
                          py: 1,
                          pl: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.8
                        }}
                      >
                        <InfoOutlinedIcon sx={{ fontSize: '0.88rem', color: '#94a3b8', cursor: 'pointer' }} />
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>
                          {row.label}
                        </Typography>
                      </TableCell>
                      {row.values.map((val, valIdx) => (
                        <TableCell 
                          key={valIdx} 
                          align="right" 
                          sx={{ 
                            borderBottom: '1px solid #e2e8f0',
                            py: 1,
                            px: 1,
                            fontSize: '0.78rem',
                            color: '#475569',
                            fontWeight: 500
                          }}
                        >
                          {val}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {/* Spacer row between metric groups */}
                  {groupIdx < activeGroupsList.length - 1 && (
                    <TableRow sx={{ height: 16, backgroundColor: '#ffffff' }}>
                      <TableCell colSpan={13} sx={{ borderBottom: '1px solid #e2e8f0', py: 0.5 }} />
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Sub tabs configuration */}
      <Box sx={{ borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Tabs
          value={subTab}
          onChange={(e, v) => setSubTab(v)}
          sx={{
            minHeight: 'auto',
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          <Tab
            label="Main Dashboard"
            sx={{
              textTransform: 'none',
              fontWeight: subTab === 0 ? 600 : 500,
              fontSize: '0.85rem',
              color: subTab === 0 ? '#1a3a6b' : '#8898aa',
              backgroundColor: subTab === 0 ? '#ffffff' : 'transparent',
              borderTop: subTab === 0 ? '3px solid #1a3a6b' : '3px solid transparent',
              borderLeft: subTab === 0 ? '1px solid #e2e8f0' : 'none',
              borderRight: subTab === 0 ? '1px solid #e2e8f0' : 'none',
              borderBottom: subTab === 0 ? '1px solid #ffffff' : 'none',
              borderRadius: '4px 4px 0 0',
              minHeight: 40,
              px: 3.5,
              mr: 1,
              position: 'relative',
              top: '1px',
              zIndex: subTab === 0 ? 2 : 1,
            }}
          />
          <Tab
            label="Provider Dashboard"
            sx={{
              textTransform: 'none',
              fontWeight: subTab === 1 ? 600 : 500,
              fontSize: '0.85rem',
              color: subTab === 1 ? '#1a3a6b' : '#8898aa',
              backgroundColor: subTab === 1 ? '#ffffff' : 'transparent',
              borderTop: subTab === 1 ? '3px solid #1a3a6b' : '3px solid transparent',
              borderLeft: subTab === 1 ? '1px solid #e2e8f0' : 'none',
              borderRight: subTab === 1 ? '1px solid #e2e8f0' : 'none',
              borderBottom: subTab === 1 ? '1px solid #ffffff' : 'none',
              borderRadius: '4px 4px 0 0',
              minHeight: 40,
              px: 3.5,
              position: 'relative',
              top: '1px',
              zIndex: subTab === 1 ? 2 : 1,
            }}
          />
        </Tabs>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mb: 3 }}>
        <Button
          variant="contained"
          onClick={handlePrint}
          sx={{
            backgroundColor: '#e55353',
            color: '#fff',
            textTransform: 'none',
            fontSize: '0.82rem',
            fontWeight: 600,
            px: 3,
            py: 0.7,
            borderRadius: '4px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#d14343',
              boxShadow: 'none'
            }
          }}
        >
          Print
        </Button>
        <Button
          variant="contained"
          onClick={handleExportCSV}
          sx={{
            backgroundColor: '#4a77bc',
            color: '#fff',
            textTransform: 'none',
            fontSize: '0.82rem',
            fontWeight: 600,
            px: 3,
            py: 0.7,
            borderRadius: '4px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#3b629b',
              boxShadow: 'none'
            }
          }}
        >
          Export As CSV
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : subTab === 0 ? (
        renderTable(groups)
      ) : (
        providerList.map((provider) => (
          <React.Fragment key={provider.name}>
            {renderTable(provider.groups, provider.name)}
          </React.Fragment>
        ))
      )}

      {/* Footer info text */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', px: 2 }}>
        <Typography sx={{ fontSize: '0.74rem', color: colors.textMuted, fontWeight: 500 }}>
          Babar Magsi
        </Typography>
      </Box>
    </Box>
  );
};

export default KpiDashboard;
