import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdjustmentTypes, selectAdjustmentTypes } from '../../../store/slices/billingSlice';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../store/slices/providerSlice';
import { reportingService } from '../../../services/reporting.service';

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

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await reportingService.getFinancialReport('courtesy-credit-modifications', {
        startDate,
        endDate,
        adjustmentType,
        action,
        patients,
        flags,
        users,
        groupByAdj,
        searchText
      });
      setReportData(data || []);
    } catch (error) {
      console.error("Failed to fetch Courtesy Credit Modifications Report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePrint = () => {
    const tableEl = document.getElementById('courtesy-credit-mod-table');
    if (!tableEl) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Courtesy Credit Modifications</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('.no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2 style="font-family: sans-serif;">Courtesy Credit Modifications</h2>');
    printWindow.document.write(`<p>Date Range: ${startDate} to ${endDate}</p>`);
    printWindow.document.write(tableEl.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
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
  };

  const handleApply = () => {
    fetchData();
  };

  const handleExportCSV = () => {
    alert('Exporting CSV...');
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
    reportData, loading, adjustmentTypes, dropdownProviders,
    handlePrint, handleClear, handleApply, handleExportCSV
  };
};
