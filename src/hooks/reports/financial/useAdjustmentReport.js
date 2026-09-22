import { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reportingService } from '../../../services/reporting.service';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../store/slices/providerSlice';
import { fetchAdjustmentTypes, selectAdjustmentTypes } from '../../../store/slices/billingSlice';
import medflowLogo from '../../../assets/medflow-logo.png';

export const useAdjustmentReport = () => {
  const dispatch = useDispatch();
  const dropdownProviders = useSelector(selectProviderDropdownList) || [];
  const adjustmentTypes = useSelector(selectAdjustmentTypes) || [];

  const [dateRange, setDateRange] = useState('daily');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [provider, setProvider] = useState('all');
  const [adjustmentType, setAdjustmentType] = useState('all');
  const [grouping, setGrouping] = useState('no-grouping');
  const [codeFilter, setCodeFilter] = useState('filter');
  const [codeText, setCodeText] = useState('');
  
  const [filterByProductionDate, setFilterByProductionDate] = useState(false);
  const [showFlags, setShowFlags] = useState(true);
  const [showDOB, setShowDOB] = useState(true);
  const [showProviderColumn, setShowProviderColumn] = useState(true);
  const [filterByDOS, setFilterByDOS] = useState(false);

  const [flagFilter, setFlagFilter] = useState('pts');
  const [sortBy, setSortBy] = useState('default');

  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: 'daily',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    provider: 'all',
    adjustmentType: 'all',
    grouping: 'no-grouping',
    codeFilter: 'filter',
    codeText: '',
    filterByProductionDate: false,
    showFlags: true,
    showDOB: true,
    showProviderColumn: true,
    filterByDOS: false,
    flagFilter: 'pts',
    sortBy: 'default'
  });

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const computeDates = (mode) => {
    const today = new Date();
    let start = new Date(today);
    let end = new Date(today);

    switch (mode) {
      case 'daily':
        break;
      case 'this_week': {
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        start = new Date(today.setDate(diff));
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      }
      case 'this_month': {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      }
      case 'last_7_days': {
        start.setDate(today.getDate() - 7);
        break;
      }
      case 'last_week': {
        const day = today.getDay();
        const diff = today.getDate() - day - 6 + (day === 0 ? -6 : 1);
        start = new Date(today.setDate(diff));
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      }
      case 'last_4_weeks': {
        start.setDate(today.getDate() - 28);
        break;
      }
      case 'last_month': {
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      }
      case 'last_3_months': {
        start = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        break;
      }
      case 'last_12_months': {
        start = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        break;
      }
      case 'month_to_date': {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      }
      case 'quarter_to_date': {
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        break;
      }
      case 'year_to_date': {
        start = new Date(today.getFullYear(), 0, 1);
        break;
      }
      case 'last_year': {
        start = new Date(today.getFullYear() - 1, 0, 1);
        end = new Date(today.getFullYear() - 1, 11, 31);
        break;
      }
      default:
        return null;
    }

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  };

  const handleFilterChange = (key, value) => {
    switch(key) {
      case 'startDate': setStartDate(value); break;
      case 'endDate': setEndDate(value); break;
      case 'provider': setProvider(value); break;
      case 'adjustmentType': setAdjustmentType(value); break;
      case 'grouping': setGrouping(value); break;
      case 'codeFilter': setCodeFilter(value); break;
      case 'codeText': setCodeText(value); break;
      case 'filterByProductionDate': setFilterByProductionDate(value); break;
      case 'showFlags': setShowFlags(value); break;
      case 'showDOB': setShowDOB(value); break;
      case 'showProviderColumn': setShowProviderColumn(value); break;
      case 'filterByDOS': setFilterByDOS(value); break;
      case 'flagFilter': setFlagFilter(value); break;
      case 'sortBy': setSortBy(value); break;
      default: break;
    }
  };

  const handleFilterModeChange = (e) => {
    const newMode = e.target.value;
    setDateRange(newMode);
    
    if (newMode !== 'range') {
      const dates = computeDates(newMode);
      if (dates) {
        setStartDate(dates.startDate);
        setEndDate(dates.endDate);
      }
    }
  };

  const lastFetchedRef = useRef(null);

  const fetchData = async (filters = appliedFilters) => {
    const paramsKey = `${filters.dateRange}_${filters.startDate}_${filters.endDate}_${filters.filterByProductionDate}_${filters.filterByDOS}`;
    if (lastFetchedRef.current === paramsKey) return;
    lastFetchedRef.current = paramsKey;

    try {
      setLoading(true);
      const rangeParam = filters.dateRange.charAt(0).toUpperCase() + filters.dateRange.slice(1);
      const res = await reportingService.getFinancialReport('adjustment', {
        date: filters.startDate,
        range: rangeParam,
        startDate: filters.startDate,
        endDate: filters.endDate,
        filterByProductionDate: filters.filterByProductionDate,
        filterByDOS: filters.filterByDOS
      });
      console.log('ADJUSTMENT REPORT DATA:', (res || []).map(d => ({ pat: d.patient, flags: d.flags })));
      setReportData(res || []);
    } catch (err) {
      console.error('Failed to fetch adjustments report:', err);
      lastFetchedRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
    dispatch(fetchAdjustmentTypes());
  }, [dispatch]);

  useEffect(() => {
    fetchData(appliedFilters);
  }, [appliedFilters.dateRange, appliedFilters.startDate, appliedFilters.endDate]);

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

  const handleClear = () => {
    setDateRange('daily');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date().toISOString().split('T')[0]);
    setProvider('all');
    setAdjustmentType('all');
    setGrouping('no-grouping');
    setCodeFilter('filter');
    setCodeText('');
    setFilterByProductionDate(false);
    setShowFlags(true);
    setShowDOB(true);
    setShowProviderColumn(true);
    setFilterByDOS(false);
    setFlagFilter('pts');
    setSortBy('default');
    
    const newApplied = {
      dateRange: 'daily',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      provider: 'all',
      adjustmentType: 'all',
      grouping: 'no-grouping',
      codeFilter: 'filter',
      codeText: '',
      filterByProductionDate: false,
      showFlags: true,
      showDOB: true,
      showProviderColumn: true,
      filterByDOS: false,
      flagFilter: 'pts',
      sortBy: 'default'
    };
    setAppliedFilters(newApplied);
    lastFetchedRef.current = null;
    fetchData(newApplied);
  };

  const handleApply = () => {
    const newApplied = {
      dateRange, startDate, endDate, provider, adjustmentType, grouping,
      codeFilter, codeText, filterByProductionDate, showFlags, showDOB,
      showProviderColumn, filterByDOS, flagFilter, sortBy
    };
    setAppliedFilters(newApplied);
    lastFetchedRef.current = null;
    fetchData(newApplied);
  };

  const filteredReportData = useMemo(() => {
    return reportData.filter(row => {
      // Provider Filter
      if (appliedFilters.provider !== 'all') {
        const rowProviderId = (row.providerId || '').toString();
        if (rowProviderId !== appliedFilters.provider.toString()) {
          // Fallback string matching if IDs don't align or aren't present
          const selectedProvObj = dropdownProviders.find(p => (p._id || p.id) === appliedFilters.provider);
          if (selectedProvObj) {
            const { firstName, lastName } = getProviderFirstAndLastName(selectedProvObj);
            const fullNameLower = `${firstName} ${lastName}`.toLowerCase().trim();
            const abbrLower = (selectedProvObj.abbr || selectedProvObj.Abbr || '').toLowerCase();
            const rowProvLower = (row.provider || '').toLowerCase();

            const matches = rowProvLower.includes(fullNameLower) || 
                            fullNameLower.includes(rowProvLower) ||
                            (abbrLower && rowProvLower.includes(abbrLower));
            if (!matches) return false;
          } else {
            return false;
          }
        }
      }

      // Adjustment Type filter
      if (appliedFilters.adjustmentType !== 'all') {
        const typeLower = (row.type || '').toLowerCase();
        const notesLower = (row.notes || '').toLowerCase();
        const filterLower = appliedFilters.adjustmentType.toLowerCase();
        
        // Match explicit type or check if the note indicates the adjustment type (which is how CreditSubtractionDialog saves it)
        if (typeLower !== filterLower && !notesLower.includes(filterLower)) {
           return false;
        }
      }

      // Code filter
      if (appliedFilters.codeText.trim()) {
        const queryLower = appliedFilters.codeText.toLowerCase().trim();
        const codeLower = (row.ada || row.code || '').toLowerCase();

        const matches = codeLower.includes(queryLower);

        if (appliedFilters.codeFilter === 'filter' && !matches) return false;
        if (appliedFilters.codeFilter === 'exclude' && matches) return false;
      }

      // Flag Filter
      if (appliedFilters.flagFilter === 'with_flags') {
        if (!row.flags || row.flags.length === 0) return false;
      } else if (appliedFilters.flagFilter === 'without_flags') {
        if (row.flags && row.flags.length > 0) return false;
      }

      return true;
    });
  }, [reportData, provider, adjustmentType, codeFilter, codeText, flagFilter, dropdownProviders]);

  const sortedReportData = useMemo(() => {
    return [...filteredReportData].sort((a, b) => {
      if (sortBy === 'date_asc') {
        return new Date(a.date || 0) - new Date(b.date || 0);
      }
      if (sortBy === 'date_desc') {
        return new Date(b.date || 0) - new Date(a.date || 0);
      }
      if (sortBy === 'amount_desc') {
        return Math.abs(b.amount || b.adj || 0) - Math.abs(a.amount || a.adj || 0);
      }
      if (sortBy === 'patient') {
        return (a.patient || '').localeCompare(b.patient || '');
      }
      return 0; // default
    });
  }, [filteredReportData, sortBy]);

  const groupedData = useMemo(() => {
    if (grouping === 'no-grouping') return null;

    const groups = {};
    sortedReportData.forEach(row => {
      let key = 'Unassigned';
      if (grouping === 'group-provider') {
        key = row.provider || 'Unassigned';
      } else if (grouping === 'group-adj') {
        const rowTypeObj = adjustmentTypes.find(t => (t.DefNum || t.id)?.toString() === row.typeId?.toString());
        key = rowTypeObj ? (rowTypeObj.type || rowTypeObj.ItemName || rowTypeObj.name) : (row.notes || 'Adjustment');
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    });
    return groups;
  }, [sortedReportData, grouping, adjustmentTypes]);

  const getRowDisplayValues = (row) => {
    const amt = typeof row.amount !== 'undefined' ? row.amount : (row.adj ?? 0);
    const formattedAmt = amt < 0 ? `-$${Math.abs(amt).toFixed(2)}` : `$${amt.toFixed(2)}`;
    
    const rowTypeObj = adjustmentTypes.find(t => (t.DefNum || t.id)?.toString() === row.typeId?.toString());
    const typeName = rowTypeObj ? (rowTypeObj.type || rowTypeObj.ItemName || rowTypeObj.name) : (row.typeId || row.notes || 'Office Adjustment');

    const providerName = (row.provider && row.provider !== 'Provider') ? row.provider : '-';
    const adaCode = (row.code && row.code.trim() !== '') ? row.code : (row.ada && row.ada !== 'D0000' ? row.ada : '-');
    const desc = (row.procedure && row.procedure !== 'Adjustment') ? row.procedure : (row.notes || row.description || '-');
    const flagsArr = row.flags && row.flags.length > 0 ? row.flags : [];

    return {
      date: row.date || '',
      flags: flagsArr,
      patient: row.patient || 'Patient',
      transaction: row.transaction || row.id || '',
      ada: adaCode,
      site: row.site || '',
      description: desc,
      rendering: row.rendering && row.rendering !== 'Provider' ? row.rendering : providerName,
      billing: row.billing && row.billing !== 'Office' && row.billing !== 'Provider' ? row.billing : providerName,
      adj: formattedAmt,
      type: typeName,
      dob: row.dob || '05/10/1988'
    };
  };

  const handleExportCSV = () => {
    const headers = [
      'Date', 'Patient', 'Transaction #', 'ADA', 'Site', 'Description',
      'Rendering Provider', 'Billing Provider', 'Adj', 'Adjustment Type'
    ];

    let rows = [];
    if (grouping !== 'no-grouping' && groupedData) {
      Object.entries(groupedData).forEach(([groupName, groupRows]) => {
        rows.push([`${grouping === 'group-provider' ? 'Provider' : 'Adjustment Type'}: ${groupName}`, ...Array(9).fill('')]);
        groupRows.forEach(row => {
          const display = getRowDisplayValues(row);
          rows.push([
            display.date, display.patient, display.transaction, display.ada,
            display.site, display.description, display.rendering, display.billing,
            display.adj, display.type
          ]);
        });
        const subtotal = groupRows.reduce((sum, r) => sum + (typeof r.amount !== 'undefined' ? r.amount : (r.adj ?? 0)), 0);
        rows.push(['Subtotal', ...Array(7).fill(''), `$${subtotal.toFixed(2)}`, '']);
        rows.push(Array(10).fill('')); // spacer
      });
    } else {
      sortedReportData.forEach(row => {
        const display = getRowDisplayValues(row);
        rows.push([
          display.date, display.patient, display.transaction, display.ada,
          display.site, display.description, display.rendering, display.billing,
          display.adj, display.type
        ]);
      });
    }

    const totalVal = sortedReportData.reduce((sum, r) => sum + (typeof r.amount !== 'undefined' ? r.amount : (r.adj ?? 0)), 0);
    rows.push(['Total', ...Array(7).fill(''), `$${totalVal.toFixed(2)}`, '']);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Adjustment_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const tableEl = document.getElementById('adjustment-report-table');
    if (!tableEl) return;
    
    const htmlContent = `
      <html>
        <head>
          <title>Adjustment Report</title>
          <style>
            body { font-family: sans-serif; font-size: 12px; background-color: #fff; color: #000; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            tfoot td, tfoot th { border: none !important; font-weight: bold; background-color: #f8f9fa; border-top: 2px solid #ddd !important; }
            .MuiCheckbox-root, input[type="checkbox"], button, .no-print, svg { display: none !important; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${window.location.origin}${medflowLogo}" style="height: 45px; object-fit: contain;" alt="Medflow Logo" onerror="this.style.display='none'" />
          </div>
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Adjustment Report</h2>
          <p style="text-align: center; margin-bottom: 20px;">Date Range: ${dateRange} (${startDate} to ${endDate})</p>
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

  const handlePrintGroup = (groupName) => {
    const tableId = `adjustment-report-table-${groupName.replace(/\s+/g, '-')}`;
    const tableEl = document.getElementById(tableId);
    if (!tableEl) return;
    
    const htmlContent = `
      <html>
        <head>
          <title>Adjustment Report - ${groupName}</title>
          <style>
            body { font-family: sans-serif; font-size: 12px; background-color: #fff; color: #000; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            tfoot td, tfoot th { border: none !important; font-weight: bold; background-color: #f8f9fa; border-top: 2px solid #ddd !important; }
            .MuiCheckbox-root, input[type="checkbox"], button, .no-print, svg { display: none !important; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${window.location.origin}${medflowLogo}" style="height: 45px; object-fit: contain;" alt="Medflow Logo" onerror="this.style.display='none'" />
          </div>
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Adjustment Report - ${groupName}</h2>
          <p style="text-align: center; margin-bottom: 20px;">Date Range: ${dateRange} (${startDate} to ${endDate})</p>
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

  const handleExportGroupCSV = (groupName, groupRows) => {
    const headers = [
      'Date', 'Patient', 'Transaction #', 'ADA', 'Site', 'Description',
      'Rendering Provider', 'Billing Provider', 'Adj', 'Adjustment Type'
    ];

    const rows = groupRows.map(row => {
      const display = getRowDisplayValues(row);
      return [
        display.date, display.patient, display.transaction, display.ada,
        display.site, display.description, display.rendering, display.billing,
        display.adj, display.type
      ];
    });

    const subtotal = groupRows.reduce((sum, r) => sum + (typeof r.amount !== 'undefined' ? r.amount : (r.adj ?? 0)), 0);
    rows.push(['Subtotal', ...Array(7).fill(''), `$${subtotal.toFixed(2)}`, '']);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Adjustment_Report_${groupName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    dateRange, startDate, endDate, provider, adjustmentType, grouping,
    codeFilter, codeText, filterByProductionDate, showFlags, showDOB,
    showProviderColumn, filterByDOS, flagFilter, sortBy,
    appliedFilters,
    loading, dropdownProviders, adjustmentTypes, reportData, sortedReportData, groupedData,
    getRowDisplayValues, getProviderLabel, handleFilterChange, handleFilterModeChange,
    handleApply, handleClear, handleExportCSV, handlePrint,
    handleExportGroupCSV, handlePrintGroup
  };
};
