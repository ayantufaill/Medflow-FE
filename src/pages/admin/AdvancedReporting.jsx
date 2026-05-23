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
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { reportingService } from '../../services/reporting.service';
import { audienceService } from '../../services/audience.service';

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

  if (view === 'detail') {
    return (
      <Box sx={{ p: 3, backgroundColor: '#fff', minHeight: '100vh' }}>
        {/* Breadcrumbs */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            onClick={() => setView('list')}
            sx={{ color: '#1a3a6b', fontSize: '0.85rem', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            {tabValue === 0 ? 'Reports' : 'Audience'}
          </Typography>
          <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem' }}>{'>'}</Typography>
          <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem' }}>Report Details:</Typography>
        </Box>

        {/* Header */}
        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>
            {selectedItem?.name}
          </Typography>
          <Typography sx={{ color: '#4a90e2', fontSize: '0.75rem', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
            (edit)
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '0.9rem', color: '#666', mb: 3 }}>
          Report kind <Typography component="span" sx={{ color: '#dcb265', fontWeight: 500 }}>{selectedItem?.kind}</Typography>
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Table Columns */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a3a6b', mb: 1.5 }}>
            Table columns:
          </Typography>
          <Box sx={{ border: '1px solid #f0f0f0', p: 2, borderRadius: '4px', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
                    backgroundColor: isSelected ? '#5c85bb' : '#e0e0e0',
                    color: isSelected ? '#fff' : '#333',
                    borderRadius: '14px',
                    '&:hover': { backgroundColor: isSelected ? '#4a74a8' : '#d0d0d0' }
                  }}
                />
              );
            })}
          </Box>
        </Box>

        {/* Filters */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a3a6b', mb: 1.5 }}>
            Filter Report by:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select defaultValue="Metadata" variant="standard" sx={{ fontSize: '0.85rem' }}>
                {METADATA_FIELDS.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select defaultValue="Operations" variant="standard" sx={{ fontSize: '0.85rem' }}>
                <MenuItem value="Operations">Operations</MenuItem>
                <MenuItem value="Equal">Equal</MenuItem>
                <MenuItem value="Not Equal">Not Equal</MenuItem>
              </Select>
            </FormControl>
            <Button
              startIcon={<AddIcon />}
              sx={{ backgroundColor: '#dcb265', color: '#fff', textTransform: 'none', px: 2, fontSize: '0.8rem', height: 32, borderRadius: '4px', '&:hover': { backgroundColor: '#c99f54' } }}
            >
              Add
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box sx={{ border: '1px solid #e0e0e0', p: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.75rem' }}>inactive</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#999' }}>Equal</Typography>
              <Typography sx={{ fontSize: '0.75rem' }}>false</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'red', cursor: 'pointer', ml: 1 }}>x</Typography>
            </Box>
            <Box sx={{ border: '1px solid #e0e0e0', p: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.75rem' }}>isSubscriber</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#999' }}>Equal</Typography>
              <Typography sx={{ fontSize: '0.75rem' }}>false</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'red', cursor: 'pointer', ml: 1 }}>x</Typography>
            </Box>
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
          <Button
            onClick={handleRunReport}
            disabled={loading}
            sx={{ backgroundColor: '#a6a6a6', color: '#fff', textTransform: 'none', px: 3, fontSize: '0.85rem', '&:hover': { backgroundColor: '#8c8c8c' } }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Run Report'}
          </Button>
          <Button
            sx={{ backgroundColor: '#5eb36d', color: '#fff', textTransform: 'none', px: 3, fontSize: '0.85rem', '&:hover': { backgroundColor: '#4e9b5a' } }}
          >
            Export As CSV
          </Button>
        </Box>

        <Typography sx={{ fontSize: '0.75rem', color: '#dcb265', mb: 2 }}>
          Filtered Items: {totalResults}
        </Typography>

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
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0, minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Page Title */}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="h5" sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '1.25rem' }}>
          Advanced Reporting
        </Typography>
      </Box>

      {/* Tabs Section - Styled as high-fidelity folder cards from screenshot */}
      <Box sx={{ borderBottom: '1px solid #e2e8f0', px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            minHeight: 'auto',
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          <Tab
            label="Reports"
            sx={{
              textTransform: 'none',
              fontWeight: tabValue === 0 ? 600 : 500,
              fontSize: '0.85rem',
              color: tabValue === 0 ? '#1a3a6b' : '#8898aa',
              backgroundColor: tabValue === 0 ? '#ffffff' : 'transparent',
              borderTop: tabValue === 0 ? '3px solid #1a3a6b' : '3px solid transparent',
              borderLeft: tabValue === 0 ? '1px solid #e2e8f0' : 'none',
              borderRight: tabValue === 0 ? '1px solid #e2e8f0' : 'none',
              borderBottom: tabValue === 0 ? '1px solid #ffffff' : 'none',
              borderRadius: '4px 4px 0 0',
              minHeight: 40,
              px: 3.5,
              mr: 1,
              position: 'relative',
              top: '1px',
              zIndex: tabValue === 0 ? 2 : 1,
            }}
          />
          <Tab
            label="Audience"
            sx={{
              textTransform: 'none',
              fontWeight: tabValue === 1 ? 600 : 500,
              fontSize: '0.85rem',
              color: tabValue === 1 ? '#1a3a6b' : '#8898aa',
              backgroundColor: tabValue === 1 ? '#ffffff' : 'transparent',
              borderTop: tabValue === 1 ? '3px solid #1a3a6b' : '3px solid transparent',
              borderLeft: tabValue === 1 ? '1px solid #e2e8f0' : 'none',
              borderRight: tabValue === 1 ? '1px solid #e2e8f0' : 'none',
              borderBottom: tabValue === 1 ? '1px solid #ffffff' : 'none',
              borderRadius: '4px 4px 0 0',
              minHeight: 40,
              px: 3.5,
              position: 'relative',
              top: '1px',
              zIndex: tabValue === 1 ? 2 : 1,
            }}
          />
        </Tabs>

        {/* Add Report Link on far right */}
        <Button
          startIcon={<AddIcon sx={{ fontSize: '0.9rem !important', position: 'relative', top: '-1px' }} />}
          onClick={() => setOpenModal(true)}
          sx={{
            textTransform: 'none',
            color: '#1a3a6b',
            fontSize: '0.85rem',
            fontWeight: 600,
            mb: 0.8,
            '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
          }}
        >
          {tabValue === 0 ? 'Add Report' : 'Add Audience'}
        </Button>
      </Box>

      {/* Content Area */}
      <Box sx={{ p: 3 }}>
        {/* List categorized by kind */}
        {Object.entries(tabValue === 0 ? reports : audiences).map(([category, items]) => (
          <Box key={category} sx={{ mb: 4 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#1a3a6b', mb: 1.2 }}>
              {category}
            </Typography>
            {items.length > 0 ? (
              <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
                {items.map((item, index) => (
                  <Box
                    key={item._id || index}
                    onClick={() => handleItemClick(item.name, category)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      px: 2,
                      py: 1.1,
                      backgroundColor: '#ffffff',
                      borderBottom: index === items.length - 1 ? 'none' : '1px solid #edf2f7',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                      '&:hover': { backgroundColor: '#f8fafc' },
                    }}
                  >
                    <Typography sx={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>
                      {item.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleDeleteItem(e, category, item._id)}
                      sx={{ 
                        color: '#ffa3a3', 
                        p: 0.5,
                        '&:hover': { color: '#ef5350', backgroundColor: 'rgba(239, 83, 80, 0.04)' } 
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: '1.05rem' }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ border: '1px dashed #cbd5e1', p: 3, borderRadius: '4px', textAlign: 'center', bgcolor: '#f8fafc' }}>
                <Typography variant="body2" sx={{ color: '#8898aa', fontStyle: 'italic' }}>
                  No active audiences saved in this category.
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Add Report / Audience Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
        sx={{ '& .MuiBackdrop-root': { backgroundColor: 'rgba(0, 0, 0, 0.2)' } }}
        PaperProps={{ sx: { borderRadius: '6px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', maxWidth: '450px' } }}
      >
        <Box sx={{ backgroundColor: '#547cb0', py: 1.5, px: 2 }}>
          <Typography sx={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, textAlign: 'center' }}>
            {tabValue === 0 ? 'Add New Report' : 'Add New Audience'}
          </Typography>
        </Box>
        <DialogContent sx={{ mt: 2, pb: 1 }}>
          <TextField
            fullWidth
            placeholder={tabValue === 0 ? "Report Name" : "Audience Name"}
            variant="outlined"
            size="small"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { fontSize: '0.85rem', borderRadius: '4px', borderColor: '#e0e0e0' } }}
          />
          <FormControl fullWidth size="small" variant="standard" sx={{ '& .MuiInput-underline:before': { borderBottomColor: '#e0e0e0' } }}>
            <Select
              value={reportKind}
              onChange={(e) => setReportKind(e.target.value)}
              displayEmpty
              sx={{ fontSize: '0.85rem', color: reportKind === 'Kind' ? '#999' : '#333' }}
            >
              <MenuItem value="Kind" disabled sx={{ fontSize: '0.85rem' }}>Kind</MenuItem>
              <MenuItem value="Patient" sx={{ fontSize: '0.85rem' }}>Patient</MenuItem>
              <MenuItem value="Procedures" sx={{ fontSize: '0.85rem' }}>Procedures</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, justifyContent: 'flex-end', gap: 1 }}>
          <Button
            onClick={async () => {
              if (!reportName.trim()) {
                alert('Please enter a name.');
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
            sx={{ 
              backgroundColor: '#dcb265', 
              color: '#fff', 
              textTransform: 'none', 
              px: 3, 
              fontSize: '0.85rem', 
              fontWeight: 600,
              boxShadow: 'none',
              borderRadius: '4px',
              minWidth: '80px',
              '&:hover': { backgroundColor: '#c99f54', boxShadow: 'none' } 
            }}
          >
            Save
          </Button>
          <Button
            onClick={() => setOpenModal(false)}
            sx={{ 
              backgroundColor: '#a6a6a6', 
              color: '#fff', 
              textTransform: 'none', 
              px: 3, 
              fontSize: '0.85rem', 
              fontWeight: 600,
              boxShadow: 'none',
              borderRadius: '4px',
              minWidth: '80px',
              '&:hover': { backgroundColor: '#8c8c8c', boxShadow: 'none' } 
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdvancedReporting;
