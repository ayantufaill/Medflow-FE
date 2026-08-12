import React, { useState, useEffect } from 'react';
import {
  Box,
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
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { reportingService } from '../../services/reporting.service';
import { audienceService } from '../../services/audience.service';
import { ReportFilterBar, ReportSearchInput } from '../../components/reports/ui';

const COLUMNS = [
  'ID', 'Middle Name', 'dob', 'email', 'householdHeadUUID', 'isHeadOfHousehold', 'newPatientDate', 'sex',
  'Home Phone', 'Mobile Phone', 'Preferred DDS', 'Preferred HYG', 'Preferred DDS First Name',
  'Preferred DDS Last Name', 'Preferred HYG First Name', 'Preferred HYG Last Name', 'street Address',
  'additional Address', 'city', 'state', 'zip code', 'country', 'recallDate', 'patient.PoliciesPayers',
  'payerName', 'Ins Remain', 'Has Mychart Account', 'Total Outstanding Balance', 'Patient Account Credit',
  'Flags', 'Created from mychart', 'Last Name', 'First Name', 'nextTreatmentAppt', 'nextRecareAppt',
  'IsSubscriber(NonPatient)', 'Inactive', 'lastAppt'
];

const METADATA_FIELDS = ['Metadata', 'dob', 'email', 'inactive', 'isHeadOfHousehold', 'isSubscriber(NonPatient)', 'newPatientDate', 'sex', 'Preferred DDS', 'Preferred HYG', 'zip code', 'recallDate', 'nextTreatmentAppt', 'nextRecareAppt', 'lastAppt', 'patientPoliciesPayers', 'payerName', 'Ins Remain', 'Has Mychart Account', 'Total Outstanding Balance'];

// 1:1 Static Pre-seed Data from Screenshot
const DEFAULT_REPORTS = {
  Patient: [
    { _id: 'def-rep-1', name: 'Screening for inactive patients', kind: 'Patient' },
    { _id: 'def-rep-2', name: 'Total # of patients', kind: 'Patient' },
    { _id: 'def-rep-3', name: 'Credit accounts report', kind: 'Patient' },
    { _id: 'def-rep-4', name: 'PPO percentage', kind: 'Patient' },
    { _id: 'def-rep-5', name: 'Accounts Receivable by patient', kind: 'Patient' },
    { _id: 'def-rep-6', name: 'x', kind: 'Patient' },
  ],
  Procedures: [
    { _id: 'def-rep-7', name: "Whitening pt's", kind: 'Procedures' },
    { _id: 'def-rep-8', name: 'Patients with no appointment', kind: 'Procedures' },
    { _id: 'def-rep-9', name: 'DNOA collection', kind: 'Procedures' },
  ]
};

const DEFAULT_AUDIENCES = {
  Patient: [
    { _id: 'def-aud-1', name: 'Email Campaign #1', kind: 'Patient' },
    { _id: 'def-aud-2', name: 'Spark Day', kind: 'Patient' },
    { _id: 'def-aud-3', name: 'Family', kind: 'Patient' },
    { _id: 'def-aud-4', name: 'Use it Lose it.', kind: 'Patient' },
    { _id: 'def-aud-5', name: 'Deactivation list 12/2023', kind: 'Patient' },
    { _id: 'def-aud-6', name: 'Active patient 09/24', kind: 'Patient' },
    { _id: 'def-aud-7', name: 'Newsletter active patients 4/22', kind: 'Patient' },
    { _id: 'def-aud-8', name: 'Valentines 2025', kind: 'Patient' },
    { _id: 'def-aud-9', name: 'TDS Membership 2025 update', kind: 'Patient' },
    { _id: 'def-aud-10', name: 'test', kind: 'Patient' },
  ],
  Procedures: []
};

const AdvancedReporting = () => {
  const [tabValue, setTabValue] = useState(0);
  const [view, setView] = useState('list'); // 'list' or 'detail'
  const [selectedItem, setSelectedItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [reportName, setReportName] = useState('');
  const [reportKind, setReportKind] = useState('Kind');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const [selectedColumns, setSelectedColumns] = useState(['Last Name', 'First Name', 'nextTreatmentAppt', 'nextRecareAppt', 'IsSubscriber(NonPatient)', 'Inactive', 'lastAppt']);
  const [showResults, setShowResults] = useState(false);

  const [reports, setReports] = useState(DEFAULT_REPORTS);
  const [audiences, setAudiences] = useState(DEFAULT_AUDIENCES);
  const [loading, setLoading] = useState(false);
  const [resultsData, setResultsData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    fetchSavedItems();
  }, []);

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
        console.warn('Reporting/Audience API not reachable, using seeded data.', apiErr);
      }

      // Merge backend items into static defaults (avoid duplicate names)
      const groupedReports = {
        Patient: [...DEFAULT_REPORTS.Patient],
        Procedures: [...DEFAULT_REPORTS.Procedures]
      };
      savedReports.forEach(r => {
        if (groupedReports[r.kind]) {
          const exists = groupedReports[r.kind].some(existing => existing.name.toLowerCase() === r.name.toLowerCase());
          if (!exists) {
            groupedReports[r.kind].push(r);
          }
        }
      });

      const groupedAudiences = {
        Patient: [...DEFAULT_AUDIENCES.Patient],
        Procedures: [...DEFAULT_AUDIENCES.Procedures]
      };
      savedAudiences.forEach(a => {
        if (groupedAudiences[a.kind]) {
          const exists = groupedAudiences[a.kind].some(existing => existing.name.toLowerCase() === a.name.toLowerCase());
          if (!exists) {
            groupedAudiences[a.kind].push(a);
          }
        }
      });

      setReports(groupedReports);
      setAudiences(groupedAudiences);
    } catch (error) {
      console.error('Failed to fetch saved items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setView('list');
  };

  const handleItemClick = (item, kind) => {
    setSelectedItem({ name: item, kind: kind });
    setView('detail');
    setShowResults(false);
  };

  const handleDeleteItem = async (e, category, id) => {
    e.stopPropagation();
    try {
      if (tabValue === 0) {
        if (!id.toString().startsWith('def-')) {
          await reportingService.deleteReport(id);
        }
        setReports(prev => ({
          ...prev,
          [category]: prev[category].filter(item => item._id !== id)
        }));
      } else {
        if (!id.toString().startsWith('def-')) {
          await audienceService.deleteAudience(id);
        }
        setAudiences(prev => ({
          ...prev,
          [category]: prev[category].filter(item => item._id !== id)
        }));
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleRunReport = async () => {
    try {
      setLoading(true);
      const filters = [
        { field: 'Inactive', operator: 'equals', value: 0 }
      ];

      const result = await reportingService.runReport({
        kind: selectedItem?.kind || 'Patient',
        filters,
        columns: selectedColumns,
        page: 1,
        limit: 50
      });

      setResultsData(result.data);
      setTotalResults(result.total);
      setShowResults(true);
    } catch (error) {
      console.error('Failed to run report:', error);
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
                    onClick={() => handleItemClick(item.name, category)}
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
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '10px 16px', bgcolor: '#F3F8FD', borderBottom: '1px solid #e2e8f0' }}>
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
        <DialogActions sx={{ p: 3, justifyContent: 'flex-end', gap: 1.5, bgcolor: '#ffffff' }}>
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
                const newId = `custom-${Date.now()}`;
                const newItem = { _id: newId, name: reportName, kind: reportKind };

                if (tabValue === 0) {
                  try {
                    await reportingService.saveReport({
                      name: reportName,
                      kind: reportKind,
                      filters: [],
                      columns: selectedColumns
                    });
                  } catch (apiErr) {
                    console.warn('Failed API write, saving locally only:', apiErr);
                  }
                  setReports(prev => ({
                    ...prev,
                    [reportKind]: [...prev[reportKind], newItem]
                  }));
                } else {
                  try {
                    await audienceService.saveAudience({
                      name: reportName,
                      kind: reportKind,
                      filters: []
                    });
                  } catch (apiErr) {
                    console.warn('Failed API write, saving locally only:', apiErr);
                  }
                  setAudiences(prev => ({
                    ...prev,
                    [reportKind]: [...prev[reportKind], newItem]
                  }));
                }
                setOpenModal(false);
                setReportName('');
                setReportKind('Kind');
              } catch (error) {
                console.error('Failed to save item:', error);
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
        <DialogContent sx={{ p: 3, pt: 3, display: 'flex', flexDirection: 'column', bgcolor: '#ffffff' }}>
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
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#475569', mb: 1.5 }}>
              Filter Report by:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select MenuProps={{ sx: { zIndex: 100000 } }} defaultValue="Metadata" variant="outlined" sx={{ height: 32, fontSize: '0.85rem', color: '#0f172a', borderRadius: '6px', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#2362EF' } }}>
                  {METADATA_FIELDS.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select MenuProps={{ sx: { zIndex: 100000 } }} defaultValue="Operations" variant="outlined" sx={{ height: 32, fontSize: '0.85rem', color: '#0f172a', borderRadius: '6px', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#2362EF' } }}>
                  <MenuItem value="Operations">Operations</MenuItem>
                  <MenuItem value="Equal">Equal</MenuItem>
                  <MenuItem value="Not Equal">Not Equal</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                startIcon={<AddIcon sx={{ fontSize: 16 }}/>}
                sx={{ textTransform: 'none', borderColor: '#e2e8f0', color: '#64748b', px: 2, fontSize: '0.8rem', height: 32, borderRadius: '6px', fontWeight: 600, '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' } }}
              >
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box sx={{ border: '1px solid #e2e8f0', bgcolor: '#f8fafc', p: '4px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#334155', fontWeight: 500 }}>inactive</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>Equal</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#334155', fontWeight: 500 }}>false</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#ef4444', cursor: 'pointer', ml: 1, fontWeight: 700 }}>x</Typography>
              </Box>
              <Box sx={{ border: '1px solid #e2e8f0', bgcolor: '#f8fafc', p: '4px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#334155', fontWeight: 500 }}>isSubscriber</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>Equal</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#334155', fontWeight: 500 }}>false</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#ef4444', cursor: 'pointer', ml: 1, fontWeight: 700 }}>x</Typography>
              </Box>
            </Box>
          </Box>

          {/* Actions & Count */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: '0.75rem', color: '#dcb265' }}>
              Filtered Items: {totalResults}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                onClick={handleRunReport}
                disabled={loading}
                variant="contained"
                sx={{ textTransform: 'none', bgcolor: '#2362EF', borderRadius: '8px', px: 3, boxShadow: 'none', fontWeight: 600, fontSize: '0.85rem', '&:hover': { bgcolor: '#1D53CC', boxShadow: 'none' } }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Run Report'}
              </Button>
              <Button
                variant="outlined"
                sx={{ textTransform: 'none', borderColor: '#2362EF', color: '#2362EF', borderRadius: '8px', px: 3, fontWeight: 600, fontSize: '0.85rem', '&:hover': { bgcolor: '#eff6ff', borderColor: '#1D53CC' } }}
              >
                Export As CSV
              </Button>
            </Box>
          </Box>

          {/* Results Table */}
          {showResults && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {selectedColumns.slice(0, 6).map(col => (
                      <TableCell key={col} sx={{ fontWeight: 600, fontSize: '0.8rem', borderBottom: '2px solid #e0e0e0' }}>{col}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resultsData.map((row, i) => (
                    <TableRow key={i}>
                      {selectedColumns.slice(0, 6).map(col => (
                        <TableCell key={col} sx={{ fontSize: '0.8rem', py: 1.5 }}>
                          {row[col] !== undefined ? String(row[col]) : '-'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdvancedReporting;
