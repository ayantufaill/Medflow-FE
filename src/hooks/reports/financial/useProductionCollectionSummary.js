import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reportingService } from '../../../services/reporting.service';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../store/slices/providerSlice';
import medflowLogo from '../../../assets/medflow-logo.png';

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
    if (filters.provider !== 'all' && row.providerId !== filters.provider) return false;
    return true;
  });

  const getProviderForRow = (row) => {
    if (row.providerId) {
      const found = dropdownProviders.find(p => (p._id || p.id) === row.providerId);
      if (found) return getProviderLabel(found);
    }
    return row.provider || row.render || row.bill || 'Unassigned';
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

  const dailyStats = [];
  if (filters.showSummaryPerDay) {
    const datesRaw = {};
    filteredReportData.forEach(row => {
      const rawDate = row.date || row.createdAt || row.dos;
      let dStr = 'Unknown Date';
      if (rawDate) {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) {
          dStr = d.toLocaleDateString();
        } else {
          dStr = String(rawDate).split('T')[0];
        }
      }
      if (!datesRaw[dStr]) datesRaw[dStr] = [];
      datesRaw[dStr].push(row);
    });

    const sortedDates = Object.keys(datesRaw).sort((a, b) => {
      if (a === 'Unknown Date') return 1;
      if (b === 'Unknown Date') return -1;
      return new Date(a) - new Date(b);
    });

    sortedDates.forEach(dateStr => {
      const dayRows = datesRaw[dateStr];
      const dayGlobal = calculateStats(dayRows);
      let dayProviders = null;

      if (filters.grouping === 'group-provider') {
        const provRaw = {};
        dayProviders = {};
        dayRows.forEach(row => {
          const provName = getProviderForRow(row);
          if (!provRaw[provName]) provRaw[provName] = [];
          provRaw[provName].push(row);
        });
        Object.entries(provRaw).forEach(([provName, groupRows]) => {
          dayProviders[provName] = calculateStats(groupRows);
        });
      }

      dailyStats.push({
        date: dateStr,
        globalStats: dayGlobal,
        providerGroupsStats: dayProviders
      });
    });
  }

  const handleExportCSV = () => {
    const headers = ['Statistic / Metric', 'Value'];
    let rows = [];

    const pushStatsToRows = (statsObj, prefix = '') => {
      rows.push(...statsObj.prodStats.map(s => [s.label, s.value]));
      rows.push(...statsObj.collStats.map(s => [s.label, s.value]));
      rows.push(['Collection Percentage', `${statsObj.percent.toFixed(1)}%`]);
      rows.push(['', '']);
    };

    if (filters.showSummaryPerDay && dailyStats.length > 0) {
      dailyStats.forEach(day => {
        rows.push([`Date: ${day.date}`, '']);
        if (filters.grouping === 'group-provider' && day.providerGroupsStats) {
          Object.entries(day.providerGroupsStats).forEach(([provName, stats]) => {
            rows.push([`Provider: ${provName}`, '']);
            pushStatsToRows(stats);
          });
          rows.push(['Total for Date', '']);
        }
        pushStatsToRows(day.globalStats);
      });
      rows.push(['GRAND TOTAL', '']);
    }

    if (filters.grouping === 'group-provider') {
      Object.entries(providerGroupsStats).forEach(([provName, stats]) => {
        rows.push([`Provider: ${provName}`, '']);
        pushStatsToRows(stats);
      });
      if (filters.showSummaryPerDay) rows.push(['Grand Total', '']);
    }

    pushStatsToRows(globalStats);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
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
    let printHTML = `
      <html>
        <head>
          <title>Production & Collection Summary</title>
          <style>
            body { font-family: sans-serif; font-size: 11px; padding: 20px; background-color: #fff; color: #000; }
            .provider-section { margin-bottom: 30px; border-bottom: 1px dashed #ccc; padding-bottom: 15px; }
            .section-title { font-size: 14px; font-weight: bold; color: #1976d2; margin-bottom: 10px; }
            .date-title { font-size: 16px; font-weight: bold; color: #0f172a; margin-top: 20px; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; }
            .stats-container { display: flex; flex-direction: row; gap: 40px; }
            .stats-column { flex: 1; }
            .stat-row { display: flex; margin-bottom: 4px; }
            .stat-label { font-weight: 500; min-width: 240px; color: #333; }
            .stat-value { font-weight: bold; color: #000; }
            .formula-label { color: #1976d2; }
            .percent-container { margin-top: 15px; text-align: center; font-size: 12px; font-weight: bold; color: #1976d2; }
            .no-print, button, svg { display: none !important; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${window.location.origin}${medflowLogo}" style="height: 45px; object-fit: contain;" alt="Medflow Logo" />
          </div>
          <h2 style="text-align: center; margin-top: 0;">Production & Collection Summary Report</h2>
          <p>Date Range: ${filters.dateRange} (${filters.startDate} to ${filters.endDate})</p>
    `;

    const renderPrintSection = (prodStats, collStats, percent, heading = '') => {
      let html = '<div class="provider-section">';
      if (heading) {
        html += `<div class="section-title">${heading}</div>`;
      }
      html += '<div class="stats-container">';
      
      html += '<div class="stats-column">';
      prodStats.forEach(s => {
        const labelClass = s.isFormula ? 'stat-label formula-label' : 'stat-label';
        html += `<div class="stat-row"><span class="${labelClass}">${s.label}</span><span class="stat-value">${s.value}</span></div>`;
      });
      html += '</div>';

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

    if (filters.showSummaryPerDay && dailyStats.length > 0) {
      dailyStats.forEach(day => {
        printHTML += `<div class="date-title">Date: ${day.date}</div>`;
        if (filters.grouping === 'group-provider' && day.providerGroupsStats) {
          Object.entries(day.providerGroupsStats).forEach(([provName, stats]) => {
            printHTML += renderPrintSection(stats.prodStats, stats.collStats, stats.percent, `Provider: ${provName}`);
          });
          printHTML += '<h3>Total for Date</h3>';
        }
        printHTML += renderPrintSection(day.globalStats.prodStats, day.globalStats.collStats, day.globalStats.percent);
      });
      printHTML += '<h2 style="margin-top: 30px;">GRAND TOTAL</h2>';
    }

    if (filters.grouping === 'group-provider') {
      Object.entries(providerGroupsStats).forEach(([provName, stats]) => {
        printHTML += renderPrintSection(stats.prodStats, stats.collStats, stats.percent, `Provider: ${provName}`);
      });
      if (filters.showSummaryPerDay || filters.grouping === 'group-provider') {
        printHTML += '<h3>Grand Total</h3>';
      }
    }

    printHTML += renderPrintSection(globalStats.prodStats, globalStats.collStats, globalStats.percent);

    printHTML += '</body></html>';

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.srcdoc = printHTML;

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

  return {
    filters,
    setFilters,
    loading,
    dropdownProviders,
    filteredReportData,
    globalStats,
    providerGroupsStats,
    dailyStats,
    handleExportCSV,
    handlePrint
  };
};
