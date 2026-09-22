import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdjustmentTypes, selectAdjustmentTypes } from '../../../store/slices/billingSlice';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../store/slices/providerSlice';
import { reportingService } from '../../../services/reporting.service';
import { exportToCSV } from '../../../utils/exportUtils';
import medflowLogo from '../../../assets/medflow-logo.png';

export const useCourtesyCreditModifications = () => {
  const dispatch = useDispatch();
  const dropdownProviders = useSelector(selectProviderDropdownList) || [];
  const adjustmentTypes = useSelector(selectAdjustmentTypes) || [];

  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
    dispatch(fetchAdjustmentTypes());
  }, [dispatch]);

  const initialStartDate = new Date().toISOString().split('T')[0];
  const initialEndDate = new Date().toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [adjustmentType, setAdjustmentType] = useState('all');
  const [action, setAction] = useState('all');
  const [patients, setPatients] = useState('all');
  const [flags, setFlags] = useState('pts');
  const [users, setUsers] = useState('all');
  const [groupByAdj, setGroupByAdj] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [appliedFilters, setAppliedFilters] = useState({
    startDate: initialStartDate,
    endDate: initialEndDate,
    adjustmentType: 'all',
    action: 'all',
    patients: 'all',
    flags: 'pts',
    users: 'all',
    groupByAdj: false,
    searchText: ''
  });

  const [rawReportData, setRawReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await reportingService.getFinancialReport('courtesy-credit-modifications', {
        startDate: appliedFilters.startDate,
        endDate: appliedFilters.endDate,
      });
      setRawReportData(data || []);
    } catch (error) {
      console.error("Failed to fetch Courtesy Credit Modifications Report:", error);
      setRawReportData([]);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters.startDate, appliedFilters.endDate, fetchTrigger]);

  // Fetch on mount and whenever dates change or fetchTrigger increments
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredReportData = useMemo(() => {
    return rawReportData.filter(row => {
      // Filter by adjustment type
      if (appliedFilters.adjustmentType !== 'all') {
        const actionStr = (row.action || '').toLowerCase();
        if (!actionStr.includes(appliedFilters.adjustmentType.toLowerCase())) return false;
      }
      // Filter by action (Created/Updated/Deleted)
      if (appliedFilters.action !== 'all') {
        const rowActionType = (row.actionType || '').toLowerCase();
        if (rowActionType !== appliedFilters.action.toLowerCase()) return false;
      }
      // Filter by flags
      if (appliedFilters.flags === 'with_flags') {
        if (!row.flags || row.flags.length === 0) return false;
      } else if (appliedFilters.flags === 'without_flags') {
        if (row.flags && row.flags.length > 0) return false;
      } else if (appliedFilters.flags !== 'all' && appliedFilters.flags !== 'pts') {
        const flagTerm = appliedFilters.flags.toLowerCase();
        const hasFlag = (row.flags || []).some(f => 
          (f?.text || '').toLowerCase().includes(flagTerm) || 
          (f?.id || '').toLowerCase().includes(flagTerm)
        );
        if (!hasFlag) return false;
      }
      // Filter by user
      if (appliedFilters.users !== 'all') {
        const userStr = (row.user || '').toLowerCase();
        if (!userStr.includes(appliedFilters.users.toLowerCase())) return false;
      }
      // Filter by search text
      if (appliedFilters.searchText.trim() !== '') {
        const query = appliedFilters.searchText.toLowerCase().trim();
        const patientMatch = (row.patient || '').toLowerCase().includes(query);
        const userMatch = (row.user || '').toLowerCase().includes(query);
        const actionMatch = (row.action || '').toLowerCase().includes(query);
        if (!patientMatch && !userMatch && !actionMatch) return false;
      }
      return true;
    });
  }, [rawReportData, appliedFilters]);

  const handlePrint = () => {
    const tableEl = document.getElementById('courtesy-credit-mod-table');
    if (!tableEl) return;
    
    const htmlContent = `
      <html>
        <head>
          <title>Courtesy Credit Modifications</title>
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
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Courtesy Credit Modifications</h2>
          <p style="text-align: center; margin-bottom: 20px;">Date Range: ${appliedFilters.startDate} to ${appliedFilters.endDate}</p>
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

  const handleClear = () => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setAdjustmentType('all');
    setAction('all');
    setPatients('all');
    setFlags('pts');
    setUsers('all');
    setGroupByAdj(false);
    setSearchText('');

    setAppliedFilters({
      startDate: initialStartDate,
      endDate: initialEndDate,
      adjustmentType: 'all',
      action: 'all',
      patients: 'all',
      flags: 'pts',
      users: 'all',
      groupByAdj: false,
      searchText: ''
    });
    // Force a refetch even if dates didn't change
    setFetchTrigger(prev => prev + 1);
  };

  const handleApply = () => {
    const newFilters = {
      startDate,
      endDate,
      adjustmentType,
      action,
      patients,
      flags,
      users,
      groupByAdj,
      searchText
    };
    setAppliedFilters(newFilters);
    // Force a refetch in case dates haven't changed but other params did
    setFetchTrigger(prev => prev + 1);
  };

  const handleExportCSV = () => {
    exportToCSV(filteredReportData, [
      { header: 'Date modified', key: 'date' },
      { header: 'Modified by User', key: (row) => row.user || '' },
      { header: 'Action', key: (row) => row.actionType || row.action || '' },
      { header: 'Type', key: 'type' },
      { header: 'Patient', key: 'patient' },
      { header: 'Amount', key: (row) => (row.creditAmount || row.amount || 0).toFixed(2) },
    ], 'Courtesy_Credit_Modifications');
  };

  return {
    startDate, setStartDate,
    endDate, setEndDate,
    adjustmentType, setAdjustmentType,
    action, setAction,
    patients, setPatients,
    flags, setFlags,
    users, setUsers,
    groupByAdj, setGroupByAdj,
    searchText, setSearchText,
    reportData: filteredReportData, 
    loading, adjustmentTypes, dropdownProviders,
    handlePrint, handleClear, handleApply, handleExportCSV
  };
};
