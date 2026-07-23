import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reportingService } from '../../../services/reporting.service';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../store/slices/providerSlice';

export const useProductionCollectionSummary = () => {
  const dispatch = useDispatch();
  const dropdownProviders = useSelector(selectProviderDropdownList);

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'daily',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    provider: 'all',
    grouping: 'no-grouping',
    showSummaryPerDay: false,
  });

  const lastFetchedRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch]);

  const fetchData = async () => {
    const fetchKey = `${filters.dateRange}-${filters.startDate}-${filters.endDate}`;
    if (lastFetchedRef.current === fetchKey) return;
    lastFetchedRef.current = fetchKey;

    try {
      setLoading(true);
      const rangeParam = filters.dateRange.charAt(0).toUpperCase() + filters.dateRange.slice(1);
      const res = await reportingService.getFinancialReport('production-collection-summary', {
        date: filters.startDate,
        range: rangeParam,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
      setReportData(res || []);
    } catch (err) {
      console.error('Failed to fetch summary report:', err);
      lastFetchedRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.dateRange, filters.startDate, filters.endDate]);

  const getProviderFirstAndLastName = (p) => {
    if (p?.userId?.firstName || p?.userId?.lastName) {
      return {
        firstName: p.userId.firstName || '',
        lastName: p.userId.lastName || ''
      };
    }
    return {
      firstName: p?.firstName || '',
      lastName: p?.lastName || ''
    };
  };

  const getProviderLabel = (p) => {
    const { firstName, lastName } = getProviderFirstAndLastName(p);
    return `${firstName} ${lastName}`.trim() || p?.name || 'Unknown';
  };

  const selectedProvObj = dropdownProviders.find(p => (p._id || p.id) === filters.provider);
  const selectedProvAbbr = selectedProvObj ? (selectedProvObj.abbr || selectedProvObj.Abbr || '').trim() : '';
  const selectedProvInitials = selectedProvObj ? (() => {
    const { firstName, lastName } = getProviderFirstAndLastName(selectedProvObj);
    const f = firstName.trim();
    const l = lastName.trim();
    if (f && l) {
      return (f[0] + l.substring(0, 2)).toUpperCase();
    }
    return (f ? f.substring(0, 3) : '').toUpperCase();
  })() : '';

  const filteredReportData = reportData.filter(row => {
    if (filters.provider !== 'all') {
      const renderLower = (row.render || '').toLowerCase();
      const billLower = (row.bill || '').toLowerCase();
      const abbrLower = selectedProvAbbr.toLowerCase();
      const initialsLower = selectedProvInitials.toLowerCase();
      
      const match = (abbrLower && (renderLower === abbrLower || billLower === abbrLower)) ||
                    (initialsLower && (renderLower === initialsLower || billLower === initialsLower));
      if (!match) return false;
    }
    return true;
  });

  const getProviderForRow = (row) => {
    const renderVal = (row.render || '').trim().toLowerCase();
    const billVal = (row.bill || '').trim().toLowerCase();
    if (!renderVal && !billVal) return 'Unassigned';

    const found = dropdownProviders.find(p => {
      const abbr = (p.abbr || p.Abbr || '').trim().toLowerCase();
      const { firstName, lastName } = getProviderFirstAndLastName(p);
      const f = firstName.trim();
      const l = lastName.trim();
      let initials = '';
      if (f && l) {
        initials = (f[0] + l.substring(0, 2)).toLowerCase();
      } else {
        initials = (f ? f.substring(0, 3) : '').toLowerCase();
      }

      return (abbr && (renderVal === abbr || billVal === abbr)) ||
             (initials && (renderVal === initials || billVal === initials));
    });

    if (found) {
      return getProviderLabel(found);
    }
    return row.render || row.bill || 'Unassigned';
  };

  const calculateStats = (rows) => {
    const charge = rows.reduce((sum, row) => sum + (row.production || row.charge || (row.ins + (row.pt || row.collection || 0) + (row.actual || 0)) || 0), 0);
    const adj = rows.reduce((sum, row) => sum + (row.paymentType === 'Adjustment' ? (row.adj || 0) : 0), 0);
    const writeOff = rows.reduce((sum, row) => sum + (row.estWriteOff || 0), 0);
    const ins = rows.reduce((sum, row) => sum + (row.ins || 0), 0);
    const pt = rows.reduce((sum, row) => sum + (row.pt || row.collection || 0), 0);
    const actualWriteOff = rows.reduce((sum, row) => sum + (row.actual || 0), 0);
    const collAdj = rows.reduce((sum, row) => sum + (row.paymentType !== 'Adjustment' ? (row.adj || 0) : 0), 0);
    const ptRef = rows.reduce((sum, row) => sum + (row.ptRef || 0), 0);
    const insRef = rows.reduce((sum, row) => sum + (row.insRef || 0), 0);
    const payFrom = rows.reduce((sum, row) => sum + (row.payFrom || 0), 0);
    const refundTo = rows.reduce((sum, row) => sum + (row.newCredit || 0), 0);
    const overpayment = rows.reduce((sum, row) => sum + (row.overpayment || 0), 0);

    const uniquePatients = new Set(rows.map(r => r.patient).filter(Boolean)).size;
    const netProduction = charge + adj - writeOff;
    const avgProdPerPat = uniquePatients > 0 ? netProduction / uniquePatients : 0;
    const collectionPercent = netProduction !== 0 ? ((ins + pt + collAdj) / netProduction) * 100 : 0;

    const prodStats = [
      { label: 'Gross Production:', value: `$${charge.toFixed(2)}` },
      { label: 'Net est. Production:', value: `Total Charge + Adj(+/-) - Est Write Off = $${netProduction.toFixed(2)}`, isFormula: true },
      { label: 'Number of Seen Patients:', value: String(uniquePatients) },
      { label: 'Average Production Per Patient:', value: `$${avgProdPerPat.toFixed(2)}` },
    ];

    const collStats = [
      { label: 'Total Collection Incl. Pay From Credit:', value: `$${(ins + pt + payFrom).toFixed(2)}` },
      { label: 'Total Collection Excl. Pay From Credit:', value: `$${(ins + pt).toFixed(2)}` },
      { label: 'Collection From Credit:', value: `$${payFrom.toFixed(2)}` },
      { label: 'Total Prepayments:', value: `$${payFrom.toFixed(2)}` },
      { label: 'Total Prepayments Excluding Refunds:', value: `$${(payFrom - refundTo).toFixed(2)}` },
      { label: 'Actual Write-Off:', value: `$${actualWriteOff.toFixed(2)}` },
      { label: 'Total Collection Adjustments:', value: `$${collAdj.toFixed(2)}` },
      { label: 'Total Production Adjustments:', value: `$${adj.toFixed(2)}` },
      { label: 'Adjusted Collection Incl. Pay From Credit:', value: `$${(ins + pt + payFrom + collAdj).toFixed(2)}` },
      { label: 'Adjusted Collection Excl. Pay From Credit:', value: `$${(ins + pt + collAdj).toFixed(2)}` },
      { label: 'Total Patient Refund:', value: `$${ptRef.toFixed(2)}` },
      { label: 'Total Insurance Refund:', value: `$${insRef.toFixed(2)}` },
      { label: 'Total Overpayment to Credit:', value: `$${overpayment.toFixed(2)}` },
      { label: 'Total Deposit Slip:', value: `$${(ins + pt - ptRef - insRef).toFixed(2)}` },
      { label: 'Total Adjustments:', value: `$${(adj + collAdj).toFixed(2)}` },
    ];

    return {
      prodStats,
      collStats,
      percent: collectionPercent,
    };
  };

  const globalStats = calculateStats(filteredReportData);

  const providerGroupsRaw = {};
  const providerGroupsStats = {};

  if (filters.grouping === 'group-provider') {
    filteredReportData.forEach(row => {
      const provName = getProviderForRow(row);
      if (!providerGroupsRaw[provName]) {
        providerGroupsRaw[provName] = [];
      }
      providerGroupsRaw[provName].push(row);
    });

    Object.entries(providerGroupsRaw).forEach(([provName, groupRows]) => {
      providerGroupsStats[provName] = calculateStats(groupRows);
    });
  }

  const handleExportCSV = () => {
    const headers = ['Statistic / Metric', 'Value'];
    let rows = [];

    if (filters.grouping === 'group-provider') {
      Object.entries(providerGroupsStats).forEach(([provName, stats]) => {
        rows.push([`Provider: ${provName}`, '']);
        rows.push(...stats.prodStats.map(s => [s.label, s.value]));
        rows.push(...stats.collStats.map(s => [s.label, s.value]));
        rows.push(['Collection Percentage', `${stats.percent.toFixed(1)}%`]);
        rows.push(['', '']); // spacer
      });
      rows.push(['Grand Total', '']);
    }

    rows.push(...globalStats.prodStats.map(s => [s.label, s.value]));
    rows.push(...globalStats.collStats.map(s => [s.label, s.value]));
    rows.push(['Collection Percentage', `${globalStats.percent.toFixed(1)}%`]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Production_Collection_Summary_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Production & Collection Summary</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: sans-serif; font-size: 11px; padding: 20px; }');
    printWindow.document.write('.provider-section { margin-bottom: 30px; border-bottom: 1px dashed #ccc; padding-bottom: 15px; }');
    printWindow.document.write('.section-title { font-size: 14px; font-weight: bold; color: #1976d2; margin-bottom: 10px; }');
    printWindow.document.write('.stats-container { display: flex; flex-direction: row; gap: 40px; }');
    printWindow.document.write('.stats-column { flex: 1; }');
    printWindow.document.write('.stat-row { display: flex; margin-bottom: 4px; }');
    printWindow.document.write('.stat-label { font-weight: 500; min-width: 240px; color: #333; }');
    printWindow.document.write('.stat-value { font-weight: bold; color: #000; }');
    printWindow.document.write('.formula-label { color: #1976d2; }');
    printWindow.document.write('.percent-container { margin-top: 15px; text-align: center; font-size: 12px; font-weight: bold; color: #1976d2; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Production & Collection Summary Report</h2>');
    printWindow.document.write(`<p>Date Range: ${filters.dateRange} (${filters.startDate} to ${filters.endDate})</p>`);

    const renderPrintSection = (prodStats, collStats, percent, heading = '') => {
      let html = '<div class="provider-section">';
      if (heading) {
        html += `<div class="section-title">${heading}</div>`;
      }
      html += '<div class="stats-container">';
      
      // Production Column
      html += '<div class="stats-column">';
      prodStats.forEach(s => {
        const labelClass = s.isFormula ? 'stat-label formula-label' : 'stat-label';
        html += `<div class="stat-row"><span class="${labelClass}">${s.label}</span><span class="stat-value">${s.value}</span></div>`;
      });
      html += '</div>';

      // Collection Column
      html += '<div class="stats-column">';
      collStats.forEach(s => {
        html += `<div class="stat-row"><span class="stat-label formula-label">${s.label}</span><span class="stat-value" style="margin-left:10px;">${s.value}</span></div>`;
      });
      html += '</div>';
      
      html += '</div>';
      html += `<div class="percent-container">Collection Percentage: ${percent.toFixed(1)}%</div>`;
      html += '</div>';
      return html;
    };

    if (filters.grouping === 'group-provider') {
      Object.entries(providerGroupsStats).forEach(([provName, stats]) => {
        printWindow.document.write(renderPrintSection(stats.prodStats, stats.collStats, stats.percent, `Provider: ${provName}`));
      });
      printWindow.document.write('<h3>Grand Total</h3>');
    }

    printWindow.document.write(renderPrintSection(globalStats.prodStats, globalStats.collStats, globalStats.percent));

    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return {
    filters,
    setFilters,
    loading,
    dropdownProviders,
    filteredReportData,
    globalStats,
    providerGroupsStats,
    handleExportCSV,
    handlePrint
  };
};
