import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Alert,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  CircularProgress,
  DialogTitle,
  InputLabel,
  Paper,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { reportingService } from '../../services/reporting.service';
import { audienceService } from '../../services/audience.service';
import { ReportFilterBar, ReportSearchInput } from '../../components/reports/ui';
import { COLORS } from '../../constants/colors';

const AdvancedReporting = () => {
  const [tabValue, setTabValue] = useState(0);
  const [fieldCatalog, setFieldCatalog] = useState([]);
  const [reportError, setReportError] = useState('');
  const [view, setView] = useState('list'); // 'list' or 'detail'
  const [selectedItem, setSelectedItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [reportName, setReportName] = useState('');
  const [reportKind, setReportKind] = useState('Kind');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMetadata, setSelectedMetadata] = useState('Metadata');
  const [selectedOperation, setSelectedOperation] = useState('Operations');
  const [filterValue, setFilterValue] = useState('');
  const [appliedFilters, setAppliedFilters] = useState([]);

  const [selectedColumns, setSelectedColumns] = useState(['Last Name', 'First Name', 'nextTreatmentAppt', 'nextRecareAppt', 'IsSubscriber(NonPatient)', 'Inactive', 'lastAppt']);
  const [showResults, setShowResults] = useState(false);

  const [reports, setReports] = useState({ Patient: [], Procedures: [] });
  const [audiences, setAudiences] = useState({ Patient: [], Procedures: [] });
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultsData, setResultsData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const resultsRef = useRef(null);
  const currentKind = selectedItem?.kind || (reportKind === 'Procedures' ? 'Procedures' : 'Patient');
  const availableFields = fieldCatalog.filter(f => f.kinds.includes(currentKind));
  const COLUMNS = availableFields.map(f => f.field);
  const METADATA_FIELDS = COLUMNS;
  const fieldOperators = availableFields.find(f => f.field === selectedMetadata)?.operators || [];
  useEffect(() => {
    reportingService.getFields().then(setFieldCatalog).catch(() => setReportError('Unable to load supported report fields.'));
  }, []);

  useEffect(() => {
    fetchSavedItems();
  }, []);

  // Auto-scroll to results when they appear
  useEffect(() => {
    if (showResults && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [showResults, resultsData]);

  const fetchSavedItems = async () => {
    try {
      setLoading(true);
      let savedReports = [];
      let savedAudiences = [];

      try {
        const [repRes, audRes] = await Promise.all([
          reportingService.getSavedReports(),
          audienceService.getAllAudiences()
        ]);
        savedReports = repRes || [];
        savedAudiences = audRes || [];
      } catch (apiErr) {
        console.error('Failed to fetch from backend APIs.', apiErr);
      }

      const groupedReports = { Patient: [], Procedures: [] };
      savedReports.forEach(r => {
        if (groupedReports[r.kind]) {
          groupedReports[r.kind].push(r);
        }
      });

      const groupedAudiences = { Patient: [], Procedures: [] };
      savedAudiences.forEach(a => {
        if (groupedAudiences[a.kind]) {
          groupedAudiences[a.kind].push(a);
        }
      });

      setReports(groupedReports);
      setAudiences(groupedAudiences);
    } catch (error) {
      console.error('Failed to process fetched items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setView('list');
  };

  const handleItemClick = (item, kind) => {
    setSelectedItem({ ...item, kind: item.kind || kind });
    setReportError('');
    if (item.columns && item.columns.length > 0) {
      setSelectedColumns(item.columns);
    }
    setAppliedFilters(item.filters || []);
    setView('detail');
    setShowResults(false);
  };

  const handleAddFilter = () => {
    if (selectedMetadata === 'Metadata' || selectedOperation === 'Operations') return;
    
    const noValueOps = ['Empty', 'Not Empty'];
    if (!noValueOps.includes(selectedOperation) && !filterValue.trim()) return;

    setAppliedFilters(prev => [
      ...prev, 
      {
        field: selectedMetadata,
        operator: selectedOperation,
        value: filterValue
      }
    ]);

    setSelectedMetadata('Metadata');
    setSelectedOperation('Operations');
    setFilterValue('');
  };

  const handleRemoveFilter = (index) => {
    setAppliedFilters(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteItem = async (e, category, id) => {
    e.stopPropagation();
    try {
      if (tabValue === 0) {
        await reportingService.deleteReport(id);
        setReports(prev => ({
          ...prev,
          [category]: prev[category].filter(item => item._id !== id)
        }));
      } else {
        await audienceService.deleteAudience(id);
        setAudiences(prev => ({
          ...prev,
          [category]: prev[category].filter(item => item._id !== id)
        }));
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleSaveNew = async () => {
    if (!saveName.trim()) return;
    try {
      setLoading(true);
      const payload = {
        name: saveName.trim(),
        kind: selectedItem?.kind || 'Patient',
        filters: appliedFilters,
        columns: selectedColumns,
      };

      if (tabValue === 0) {
        await reportingService.saveReport(payload);
      } else {
        await audienceService.saveAudience(payload);
      }
      
      setSaveDialogOpen(false);
      setSaveName('');
      await fetchSavedItems();
    } catch (error) {
      console.error('Failed to save new template:', error);
      setReportError(error.response?.data?.error?.message || error.response?.data?.message || 'Unable to save this report.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!resultsData || resultsData.length === 0) return;
    
    const headers = selectedColumns.join(',');
    const rows = resultsData.map(row => 
      selectedColumns.map(col => {
        let val = row[col] !== undefined && row[col] !== null ? String(row[col]) : '';
        if (val.includes(',') || val.includes('"') || val.includes('\n') || val.includes('\r')) {
          val = `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      }).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedItem?.name || 'report_export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  const handleRunReport = async () => {
    try {
      setLoading(true);
      setReportError('');
      const filters = appliedFilters;

      const result = await reportingService.runReport({
        kind: selectedItem?.kind || 'Patient',
        filters,
        columns: selectedColumns,
        page: 1,
        limit: 50
      });


      let rows = [];
      let total = 0;

      // Robustly extract the data array regardless of how many layers of 'data' wrapping there are
      if (Array.isArray(result)) {
        rows = result;
        total = result.length;
      } else if (result && Array.isArray(result.data)) {
        rows = result.data;
        total = result.total !== undefined ? result.total : result.data.length;
      } else if (result && result.data && Array.isArray(result.data.data)) {
        rows = result.data.data;
        total = result.data.total !== undefined ? result.data.total : rows.length;
      } else if (result && result.data && result.data.data && Array.isArray(result.data.data.data)) {
        // Just in case of extreme wrapping
        rows = result.data.data.data;
        total = result.data.data.total !== undefined ? result.data.data.total : rows.length;
      }



      setResultsData(rows);
      setTotalResults(total);
      setShowResults(true);
    } catch (error) {
      console.error('Failed to run report:', error);
      setResultsData([]);
      setTotalResults(0);
      setShowResults(false);
      setReportError(error.response?.data?.error?.message || error.response?.data?.message || 'Unable to run this report.');
    } finally {
      setLoading(false);
    }
  };

  const toggleColumn = (col) => {
    if (selectedColumns.includes(col)) {
      setSelectedColumns(selectedColumns.filter(c => c !== col));
    } else {
      setSelectedColumns([...selectedColumns, col]);
    }
  };


  return (
    <Box sx={{ display: 'flex', width: '100%', gap: '8px', p: '8px', backgroundColor: '#f8f9fa', height: 'calc(100vh - 65px)', overflow: 'hidden', boxSizing: 'border-box' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Box sx={{ position: 'relative', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#fff', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
            {reportError && <Alert severity="error" sx={{ mb: 2 }}>{reportError}</Alert>}
            {/* Page Title */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e', fontFamily: 'Inter' }}>
                Advanced Reporting
              </Typography>
            </Box>

            {/* Tabs Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, borderBottom: '1px solid #e2e8f0' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  minHeight: 'auto',
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#2362EF',
                  },
                }}
              >
                <Tab
                  label="REPORTS"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: tabValue === 0 ? '#2362EF' : '#64748b',
                    minHeight: 'auto',
                    py: 1,
                    '&.Mui-selected': { color: '#2362EF' }
                  }}
                />
                <Tab
                  label="AUDIENCE"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: tabValue === 1 ? '#2362EF' : '#64748b',
                    minHeight: 'auto',
                    py: 1,
                    '&.Mui-selected': { color: '#2362EF' }
                  }}
                />
              </Tabs>
            </Box>

            <ReportFilterBar
              topRowFilters={
                <>
                  <ReportSearchInput width="400px" placeholder={`Search ${tabValue === 0 ? 'reports' : 'audiences'}…`} value={searchQuery} onChange={setSearchQuery} />
                  <Button variant="outlined" size="small" startIcon={<RefreshIcon sx={{ fontSize: 15 }} />} onClick={fetchSavedItems}
                    sx={{ textTransform: 'none', borderColor: '#e2e8f0', color: '#64748b', bgcolor: '#f8fafc', borderRadius: '6px', px: 2, fontWeight: 600, fontSize: '0.85rem', '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f1f5f9' } }}
                  >
                    Refresh
                  </Button>
                </>
              }
              topRowActions={
                <>
                  <Button variant="contained" size="small" startIcon={<AddIcon sx={{ fontSize: 15 }} />} onClick={() => setOpenModal(true)}
                    sx={{ textTransform: 'none', bgcolor: '#2362EF', borderRadius: '8px', px: 2, boxShadow: 'none', fontWeight: 600, fontSize: '0.85rem', '&:hover': { bgcolor: '#1D53CC', boxShadow: 'none' } }}
                  >
                    {tabValue === 0 ? 'Add Report' : 'Add Audience'}
                  </Button>
                </>
              }
              middleRowFilters={null}
              onClearAll={null}
              onApplyFilters={null}
            />

            {/* Content Area */}
            <Box sx={{ mt: 3 }}>
              {Object.entries(tabValue === 0 ? reports : audiences).map(([category, items]) => {
                const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
                return (
                  <Box key={category} sx={{ mb: 3, border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
                    <Box sx={{ backgroundColor: '#f8f9fa', py: '10px', px: 2, borderBottom: '1px solid #e2e8f0' }}>
                      <Typography sx={{ fontFamily: 'Inter', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                        {category}
                      </Typography>
                    </Box>
                    {filteredItems.length > 0 ? (
                      <Box>
                        {filteredItems.map((item, index) => (
                          <Box
                            key={item._id || index}
                            onClick={() => handleItemClick(item, category)}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              px: 2,
                              py: 1.5,
                              backgroundColor: '#ffffff',
                              borderBottom: index === filteredItems.length - 1 ? 'none' : '1px solid #e2e8f0',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s ease',
                              '&:hover': { backgroundColor: '#f1f5f9' },
                            }}
                          >
                            <Typography sx={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>
                              {item.name}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={(e) => handleDeleteItem(e, category, item._id)}
                              sx={{
                                color: '#94a3b8',
                                p: 0.5,
                                '&:hover': { color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)' }
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: '1.05rem' }} />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#ffffff' }}>
                        <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                          No {tabValue === 0 ? 'reports' : 'audiences'} found.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>

            {/* Add Report / Audience Modal */}
            <Dialog
              open={openModal}
              onClose={() => setOpenModal(false)}
              maxWidth="sm"
              fullWidth
              sx={{ '& .MuiBackdrop-root': { backgroundColor: 'rgba(0, 0, 0, 0.4)' }, zIndex: 99999 }}
              PaperProps={{ sx: { borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontFamily: 'Inter, sans-serif', maxWidth: '550px' } }}
            >
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: '25px', py: '16px', bgcolor: COLORS.SURFACE_TINT, borderBottom: `1px solid ${COLORS.BORDER}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ bgcolor: '#ffffff', width: 38, height: 38, borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <AddIcon sx={{ fontSize: '1.25rem', color: '#2362EF' }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0B132B', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                      {tabValue === 0 ? 'Add new report' : 'Add new audience'}
                    </Typography>
                    <Typography sx={{ fontWeight: 400, fontSize: '0.8rem', color: '#64748B', mt: 0.25, fontFamily: 'Inter, sans-serif', lineHeight: 1.2 }}>
                      {tabValue === 0 ? 'Create a custom report to track specific clinic metrics.' : 'Create a custom audience for targeted communications.'}
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={() => setOpenModal(false)} sx={{ color: '#94a3b8', '&:hover': { color: '#0B132B', bgcolor: '#e2e8f0' }, p: 1, alignSelf: 'flex-start' }}>
                  <CloseIcon sx={{ fontSize: '1.25rem' }} />
                </IconButton>
              </DialogTitle>
              <Divider sx={{ borderColor: '#f1f5f9' }} />
              <DialogContent sx={{ p: 3, pt: 3, display: 'flex', flexDirection: 'column', gap: 3, bgcolor: '#ffffff' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', mb: 1, fontFamily: 'Inter, sans-serif' }}>
                    {tabValue === 0 ? "Report name" : "Audience name"}
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder={tabValue === 0 ? "e.g. Monthly Inactive Patients" : "e.g. Email Campaign"}
                    variant="outlined"
                    size="small"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { height: 42, fontSize: '0.875rem', borderRadius: '8px', color: '#0f172a', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#2362EF' } } }}
                  />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', mb: 1, fontFamily: 'Inter, sans-serif' }}>
                    Kind
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={reportKind}
                      onChange={(e) => setReportKind(e.target.value)}
                      displayEmpty
                      MenuProps={{ sx: { zIndex: 100000 } }}
                      sx={{ height: 42, fontSize: '0.875rem', color: reportKind === 'Kind' ? '#94a3b8' : '#0f172a', borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#2362EF' } }}
                    >
                      <MenuItem value="Kind" disabled sx={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#94a3b8' }}>Select kind</MenuItem>
                      <MenuItem value="Patient" sx={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#0f172a' }}>Patient</MenuItem>
                      <MenuItem value="Procedures" sx={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#0f172a' }}>Procedures</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </DialogContent>
              <Divider sx={{ borderColor: '#f1f5f9' }} />
              <DialogActions sx={{ px: '25px', py: '16px', justifyContent: 'flex-end', gap: 1.5, bgcolor: 'white' }}>
                <Button
                  onClick={() => setOpenModal(false)}
                  variant="outlined"
                  sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.875rem', borderRadius: '8px', borderColor: '#e2e8f0', color: '#475569', '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }, px: 3, height: 42 }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (!reportName.trim() || reportKind === 'Kind') {
                      alert('Please enter a name and select a kind.');
                      return;
                    }
                    try {
                      setLoading(true);
                      if (tabValue === 0) {
                        await reportingService.saveReport({
                          name: reportName,
                          kind: reportKind,
                          filters: [],
                          columns: reportKind === 'Procedures' ? ['ID', 'Code', 'Fee'] : ['ID', 'First Name', 'Last Name']
                        });
                      } else {
                        await audienceService.saveAudience({
                          name: reportName,
                          kind: reportKind,
                          filters: []
                        });
                      }
                      
                      await fetchSavedItems();
                      
                      setOpenModal(false);
                      setReportName('');
                      setReportKind('Kind');
                    } catch (error) {
                      setReportError(error.response?.data?.error?.message || error.response?.data?.message || 'Unable to create report.');
                    }
                  }}
                  variant="contained"
                  disabled={!reportName.trim() || reportKind === 'Kind'}
                  sx={{ bgcolor: '#2362EF', color: '#ffffff', textTransform: 'none', fontWeight: 600, fontSize: '0.875rem', borderRadius: '8px', '&:hover': { bgcolor: '#1d4ed8' }, boxShadow: 'none', px: 3, height: 42, '&.Mui-disabled': { bgcolor: '#bfdbfe', color: '#ffffff' } }}
                >
                  {tabValue === 0 ? 'Add report' : 'Add audience'}
                </Button>
              </DialogActions>
            </Dialog>
            {/* Detail Modal */}
            <Dialog
              open={view === 'detail'}
              onClose={() => { setView('list'); setShowResults(false); }}
              maxWidth="lg"
              fullWidth
              sx={{ '& .MuiBackdrop-root': { backgroundColor: 'rgba(0, 0, 0, 0.4)' }, zIndex: 99999 }}
              PaperProps={{ sx: { borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontFamily: 'Inter, sans-serif' } }}
            >
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '10px 16px', bgcolor: '#F3F8FD', borderBottom: '1px solid #e2e8f0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0B132B', fontFamily: 'Inter, sans-serif' }}>
                    {selectedItem?.name}
                  </Typography>
                  <Typography sx={{ color: '#2362EF', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' }, ml: 1 }}>
                    (edit)
                  </Typography>
                </Box>
                <IconButton onClick={() => { setView('list'); setShowResults(false); }} sx={{ color: '#94a3b8', '&:hover': { color: '#0B132B', bgcolor: '#e2e8f0' }, p: 1, alignSelf: 'flex-start' }}>
                  <CloseIcon sx={{ fontSize: '1.25rem' }} />
                </IconButton>
              </DialogTitle>
              <Divider sx={{ borderColor: '#f1f5f9' }} />
              <DialogContent sx={{ p: 3, pt: 3, bgcolor: '#ffffff', overflowY: 'auto' }}>
                <Typography sx={{ fontSize: '0.9rem', color: '#64748b', mb: 3 }}>
                  Report kind <Typography component="span" sx={{ color: '#2362EF', fontWeight: 600 }}>{selectedItem?.kind}</Typography>
                </Typography>

                <Divider sx={{ mb: 3, borderColor: '#e2e8f0' }} />

                {/* Table Columns */}
                <Box sx={{ mb: 4 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#475569', mb: 1.5 }}>
                    Table columns:
                  </Typography>
                  <Box sx={{ border: '1px solid #e2e8f0', p: 2, borderRadius: '8px', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {COLUMNS.map(col => {
                      const isSelected = selectedColumns.includes(col);
                      return (
                        <Chip
                          key={col}
                          label={col}
                          onClick={() => toggleColumn(col)}
                          sx={{
                            height: 28,
                            fontSize: '0.75rem',
                            backgroundColor: isSelected ? '#2362EF' : '#f1f5f9',
                            color: isSelected ? '#fff' : '#475569',
                            borderRadius: '14px',
                            fontWeight: isSelected ? 600 : 400,
                            '&:hover': { backgroundColor: isSelected ? '#1D53CC' : '#e2e8f0' }
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>

                {/* Filters */}
                {/* Filters */}
                <Box sx={{ mb: 4 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#2b5082', mb: 1.5 }}>
                    Filter Report by:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <Select value={selectedMetadata} onChange={(e) => { setSelectedMetadata(e.target.value); setSelectedOperation('Operations'); }} MenuProps={{ sx: { zIndex: 100000 } }} variant="standard" disableUnderline sx={{ height: 32, fontSize: '0.85rem', color: '#0f172a', borderBottom: '1px solid #cbd5e1', borderRadius: 0, '&:hover': { borderBottom: '1px solid #94a3b8' } }}>
                        <MenuItem value="Metadata">Metadata</MenuItem>
                        {METADATA_FIELDS.filter(f => f !== 'Metadata').map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select value={selectedOperation} onChange={(e) => setSelectedOperation(e.target.value)} MenuProps={{ sx: { zIndex: 100000 } }} variant="outlined" sx={{ height: 32, fontSize: '0.85rem', color: '#0f172a', borderRadius: '4px', backgroundColor: '#fff', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#2362EF' } }}>
                        <MenuItem value="Operations">Operations</MenuItem>
                        {fieldOperators.map(op => <MenuItem key={op} value={op}>{op}</MenuItem>)}
                      </Select>
                    </FormControl>
                    
                    {/* Dynamic Date/Value Input */}
                    {selectedOperation !== 'Operations' && selectedOperation !== 'Empty' && selectedOperation !== 'Not Empty' && (
                      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <TextField
                          size="small"
                          placeholder="Select date or value"
                          variant="standard"
                          type={
                            (selectedMetadata.toLowerCase().includes('date') || selectedMetadata.toLowerCase().includes('appt')) && selectedOperation !== 'In Range' 
                              ? 'date' 
                              : 'text'
                          }
                          InputProps={{ 
                            disableUnderline: true,
                            startAdornment: (
                              <CalendarIcon sx={{ color: '#94a3b8', fontSize: 16, mr: 1, ...(selectedMetadata.toLowerCase().includes('date') || selectedMetadata.toLowerCase().includes('appt') ? {} : { display: 'none' }) }} />
                            )
                          }}
                          value={filterValue}
                          onChange={(e) => setFilterValue(e.target.value)}
                          sx={{ 
                            width: 200,
                            borderBottom: '1px solid #cbd5e1',
                            '& .MuiInputBase-input': { 
                              height: 32,
                              padding: '0 8px 0 0',
                              fontSize: '0.85rem', 
                              backgroundColor: 'transparent',
                            }
                          }}
                        />
                        {filterValue && (
                          <Typography 
                            onClick={() => setFilterValue('')}
                            sx={{ position: 'absolute', right: 4, color: '#ef4444', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', '&:hover': { color: '#dc2626' } }}
                          >
                            x
                          </Typography>
                        )}
                      </Box>
                    )}
                    
                    <Button
                      variant="contained"
                      onClick={handleAddFilter}
                      sx={{ textTransform: 'none', bgcolor: '#2362EF', color: '#fff', px: 2, fontSize: '0.85rem', height: 32, borderRadius: '4px', fontWeight: 600, boxShadow: 'none', '&:hover': { bgcolor: '#1d4ed8', boxShadow: 'none' } }}
                    >
                      + Add
                    </Button>
                  </Box>

                  {/* Active Filters List */}
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    {appliedFilters.map((filter, index) => (
                      <Box key={index} sx={{ border: '1px solid #e2e8f0', bgcolor: '#ffffff', p: 0, borderRadius: '2px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#000000', fontWeight: 500, px: 1.5, py: 0.5, borderRight: '1px solid #e2e8f0' }}>{filter.field}</Typography>
                        <Typography sx={{ fontSize: '0.8rem', color: '#64748b', px: 1.5, py: 0.5, borderRight: filter.value != null && filter.value !== '' ? '1px solid #e2e8f0' : 'none' }}>{filter.operator}</Typography>
                        {filter.value != null && filter.value !== '' && (
                          <Typography sx={{ fontSize: '0.8rem', color: '#000000', fontWeight: 500, px: 1.5, py: 0.5 }}>{String(filter.value)}</Typography>
                        )}
                        <Typography onClick={() => handleRemoveFilter(index)} sx={{ color: '#ef4444', fontSize: '0.75rem', px: 1, fontWeight: 500, cursor: 'pointer', '&:hover': { color: '#dc2626' } }}>
                          x
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Actions & Count */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#000000' }}>
                    Filtered Items: {totalResults} · Displaying {resultsData.length} (up to 50 rows)
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button onClick={() => { setSaveName(selectedItem?.name || ''); setSaveDialogOpen(true); }} disabled={loading} variant="outlined">
                      Save as new report
                    </Button>
                    <Button
                      onClick={handleRunReport}
                      disabled={loading}
                      variant="contained"
                      sx={{ textTransform: 'none', bgcolor: '#2362EF', borderRadius: '8px', px: 3, boxShadow: 'none', fontWeight: 600, fontSize: '0.85rem', '&:hover': { bgcolor: '#1D53CC', boxShadow: 'none' } }}
                    >
                      {loading ? <CircularProgress size={20} color="inherit" /> : 'Run Report'}
                    </Button>
                    <Button
                      onClick={handleExportCSV}
                      disabled={!resultsData || resultsData.length === 0}
                      variant="outlined"
                      sx={{ textTransform: 'none', borderColor: '#2362EF', color: '#2362EF', borderRadius: '8px', px: 3, fontWeight: 600, fontSize: '0.85rem', '&:hover': { bgcolor: '#eff6ff', borderColor: '#1D53CC' } }}
                    >
                      Export displayed rows as CSV
                    </Button>
                  </Box>
                </Box>

                {reportError && <Alert severity="error" sx={{ mb: 2 }}>{reportError}</Alert>}
                {/* Results Section */}
                <Box ref={resultsRef}>
                  {showResults && (
                    <Box sx={{ mt: 2 }}>
                      <TableContainer component={Paper} elevation={0} sx={{
                        bgcolor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
                        overflow: 'auto',
                        maxHeight: '400px'
                      }}>
                        {Array.isArray(resultsData) && resultsData.length > 0 ? (
                          <Table size="small" stickyHeader>
                            <TableHead sx={{ backgroundColor: 'rgba(240, 244, 249, 0.6)' }}>
                              <TableRow sx={{ '& th': { fontWeight: 600, fontSize: '13px', color: '#5C646F', fontFamily: "'Inter', sans-serif", py: 1.5, backgroundColor: '#f0f4f9', whiteSpace: 'nowrap' } }}>
                                {selectedColumns.map(col => (
                                  <TableCell key={col}>{col}</TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody sx={{ '& .MuiTableRow-root:hover': { backgroundColor: '#f8fafc' }, '& .MuiTableCell-root': { fontSize: '0.85rem', verticalAlign: 'middle', borderBottom: '1px solid #e2e8f0' } }}>
                              {resultsData.map((row, i) => (
                                <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                                  {selectedColumns.map(col => (
                                    <TableCell key={col} sx={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                                      {row[col] !== undefined && row[col] !== null ? String(row[col]) : '\u2014'}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">No data available.</Typography>
                          </Box>
                        )}
                      </TableContainer>
                    </Box>
                  )}
                </Box>
              </DialogContent>
            </Dialog>
            <Dialog open={saveDialogOpen} onClose={() => !loading && setSaveDialogOpen(false)} fullWidth maxWidth="sm" sx={{ zIndex: 100001 }}>
              <DialogTitle>Save selected columns and filters</DialogTitle>
              <DialogContent>
                {reportError && <Alert severity="error" sx={{ mb: 2 }}>{reportError}</Alert>}
                <TextField autoFocus fullWidth margin="dense" label="Report name" value={saveName} onChange={e => setSaveName(e.target.value)} />
              </DialogContent>
              <DialogActions>
                <Button disabled={loading} onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
                <Button disabled={loading || !saveName.trim()} onClick={handleSaveNew} variant="contained">Save</Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdvancedReporting;
