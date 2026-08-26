import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import KpiTopCards from '../../../components/admin/reports/KpiTopCards';
import KpiActionToolbar from '../../../components/admin/reports/KpiActionToolbar';
import KpiDataTable from '../../../components/admin/reports/KpiDataTable';
import { kpiService } from '../../../services/kpi.service';
import LogoImg from '../../../assets/medflow-logo.png';
import { useBranch } from '../../../hooks/redux';

const KpiDashboard = () => {
  const [subTab, setSubTab] = useState(0);
  const [loading, setLoading] = useState(true);

  const [months, setMonths] = useState([]);
  const [groups, setGroups] = useState([]);
  const [providerList, setProviderList] = useState([]);
  const [summaryData, setSummaryData] = useState(null);

  const { currentBranchId } = useBranch();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const branchParam = currentBranchId || 'All';
      const [mainRes, providerRes, summaryRes] = await Promise.all([
        kpiService.getMainKpis({ branchId: branchParam }),
        kpiService.getProviderKpis({ branchId: branchParam }),
        kpiService.getKpiSummary({ branchId: branchParam })
      ]);
      setGroups(mainRes || []);
      setProviderList(providerRes || []);
      setSummaryData(summaryRes || null);
    } catch (error) {
      console.error('Error fetching KPI data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentBranchId]);

  useEffect(() => {
    // Generate the same 12 rolling month buckets as the backend
    const generatedMonths = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('en-US', { month: 'long' });
      const year = `(${d.getFullYear()})`;
      generatedMonths.push({ label, year });
    }
    setMonths(generatedMonths);

    fetchData();
  }, [fetchData]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    const headerRow = ["Metrics", ...months.map(m => `${m.label} ${m.year.replace(/[()]/g, '')}`)].join(",");
    csvContent += headerRow + "\n";

    if (subTab === 0) {
      groups.forEach(group => {
        csvContent += `"${group.title}"\n`;
        group.rows.forEach(row => {
          const rowData = [`"${row.label}"`, ...row.values.map(v => `"${v}"`)].join(",");
          csvContent += rowData + "\n";
        });
      });
    } else {
      providerList.forEach(provider => {
        csvContent += `"${provider.name} Dashboard"\n`;
        provider.groups.forEach(group => {
          csvContent += `"${group.title}"\n`;
          group.rows.forEach(row => {
            const rowData = [`"${row.label}"`, ...row.values.map(v => `"${v}"`)].join(",");
            csvContent += rowData + "\n";
          });
        });
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", subTab === 0 ? "kpi_main_dashboard.csv" : "kpi_provider_dashboard.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ backgroundColor: 'transparent', p: 0, minHeight: '100vh', '@media print': { p: 0, minHeight: 'auto', display: 'block', backgroundColor: '#ffffff' } }}>
      {/* Print-only Header */}
      <Box sx={{ display: 'none', '@media print': { display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4, width: '100%' } }}>
        <img src={LogoImg} alt="Medflow Logo" style={{ height: '40px', marginBottom: '8px' }} />
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 600 }}>
          {subTab === 0 ? 'Main KPI Dashboard' : 'Provider KPI Dashboard'}
        </Typography>
        <Typography sx={{ fontSize: '0.9rem', color: '#64748b' }}>Date: {new Date().toLocaleDateString()}</Typography>
      </Box>

      <Box
        sx={{
          width: '100%',
          px: 2.5,
          py: 2,
          mb: 1.5,
          bgcolor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
          boxSizing: 'border-box',
          '@media print': { display: 'none' }
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', mb: 0.5, letterSpacing: '-0.02em', fontSize: '1.75rem' }}>
          KPI Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.9rem' }}>
          Welcome back! Here's what's happening today.
        </Typography>
      </Box>

      <KpiTopCards summaryData={summaryData} loading={loading} />
      <KpiActionToolbar subTab={subTab} setSubTab={setSubTab} onPrint={handlePrint} onExportCSV={handleExportCSV} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {subTab === 0 ? (
            <KpiDataTable activeGroupsList={groups} months={months} />
          ) : (
            providerList.map((provider) => (
              <KpiDataTable key={provider.name} activeGroupsList={provider.groups} months={months} providerName={provider.name} />
            ))
          )}
        </>
      )}
    </Box>
  );
};

export default KpiDashboard;
