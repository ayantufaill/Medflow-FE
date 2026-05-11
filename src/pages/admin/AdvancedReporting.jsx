import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

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

const AdvancedReporting = () => {
  const [tabValue, setTabValue] = useState(0);
  const [view, setView] = useState('list'); // 'list' or 'detail'
  const [selectedItem, setSelectedItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [reportName, setReportName] = useState('');
  const [reportKind, setReportKind] = useState('Kind');
  
  const [selectedColumns, setSelectedColumns] = useState(['Last Name', 'First Name', 'nextTreatmentAppt', 'nextRecareAppt', 'IsSubscriber(NonPatient)', 'Inactive', 'lastAppt']);
  const [showResults, setShowResults] = useState(false);

  const [reports, setReports] = useState({
    Patient: [
      'Screening for inactive patients',
      'Total # of patients',
      'Credit accounts report',
      'PPO percentage',
      'Accounts Receivable by patient',
      'x',
    ],
    Procedures: [
      'Whitening pt\'s',
      'Patients with no appointment',
      'DNOA collection',
    ],
  });

  const [audiences, setAudiences] = useState({
    Patient: [
      'Email Campaign #1',
      'Spark Day',
      'Family',
      'Use it Lose it.',
      'Deactivation list 12/2023',
      'Active patient 09/24',
      'Newsletter active patients 4/22',
      'Valentines 2025',
      'TDS Membership 2025 update',
      'test',
    ],
    Procedures: [],
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setView('list');
  };

  const handleItemClick = (item, kind) => {
    setSelectedItem({ name: item, kind: kind });
    setView('detail');
    setShowResults(false);
  };

  const handleDeleteItem = (e, category, index) => {
    e.stopPropagation();
    const data = tabValue === 0 ? { ...reports } : { ...audiences };
    const updatedCategory = [...data[category]];
    updatedCategory.splice(index, 1);
    const updatedData = { ...data, [category]: updatedCategory };
    if (tabValue === 0) setReports(updatedData);
    else setAudiences(updatedData);
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
          <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem' }}>Report #10:</Typography>
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
            onClick={() => setShowResults(true)}
            sx={{ backgroundColor: '#a6a6a6', color: '#fff', textTransform: 'none', px: 3, fontSize: '0.85rem', '&:hover': { backgroundColor: '#8c8c8c' } }}
          >
            Run Report
          </Button>
          <Button
            sx={{ backgroundColor: '#5eb36d', color: '#fff', textTransform: 'none', px: 3, fontSize: '0.85rem', '&:hover': { backgroundColor: '#4e9b5a' } }}
          >
            Export As CSV
          </Button>
        </Box>

        <Typography sx={{ fontSize: '0.75rem', color: '#dcb265', mb: 2 }}>
          Filtered Items: {showResults ? '1260' : '0'}
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
                {[1, 2, 3, 4, 5].map(i => (
                  <TableRow key={i}>
                    <TableCell sx={{ fontSize: '0.8rem', py: 1.5 }}>Patient {i}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>Name {i}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>Not Completed</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>Diagnostic Imaging</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>D0274</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>Bitewing Four Xrays</TableCell>
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
    <Box sx={{ p: 0, minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Page Title */}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, fontSize: '1.1rem' }}>
          Advanced Reporting
        </Typography>
      </Box>

      {/* Tabs Section */}
      <Box sx={{ borderBottom: 1, borderColor: '#e0e0e0', px: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#1a3a6b',
              height: 3,
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.85rem',
              minWidth: 80,
              color: '#9e9e9e',
              '&.Mui-selected': {
                color: '#1a3a6b',
              },
            },
          }}
        >
          <Tab label="Reports" />
          <Tab label="Audience" />
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box sx={{ p: 3 }}>
        {/* Add Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <Button
            startIcon={<AddIcon sx={{ fontSize: '1rem !important' }} />}
            onClick={() => setOpenModal(true)}
            sx={{
              textTransform: 'none',
              color: '#1a3a6b',
              fontSize: '0.8rem',
              fontWeight: 600,
              '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
            }}
          >
            {tabValue === 0 ? 'Add Report' : 'Add Audience'}
          </Button>
        </Box>

        {/* List */}
        {Object.entries(tabValue === 0 ? reports : audiences).map(([category, items]) => (
          <Box key={category} sx={{ mb: 4 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#000', mb: 1 }}>
              {category}
            </Typography>
            <Box sx={{ border: '1px solid #f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
              {items.map((item, index) => (
                <Box
                  key={index}
                  onClick={() => handleItemClick(item, category)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 0.75,
                    backgroundColor: index % 2 === 0 ? '#fcfcfc' : '#fff',
                    borderBottom: index === items.length - 1 ? 'none' : '1px solid #f0f0f0',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f5f7fa' },
                  }}
                >
                  <Typography sx={{ fontSize: '0.85rem', color: '#333' }}>
                    {item}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleDeleteItem(e, category, index)}
                    sx={{ color: '#ffb3b3', '&:hover': { color: '#ff4d4f' } }}
                  >
                    <DeleteIcon sx={{ fontSize: '1.1rem' }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '8px', overflow: 'hidden' } }}
      >
        <Box sx={{ backgroundColor: '#5c85bb', py: 1, px: 2 }}>
          <Typography sx={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500, textAlign: 'center' }}>
            {tabValue === 0 ? 'Add New Report' : 'Add New Audience'}
          </Typography>
        </Box>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            placeholder={tabValue === 0 ? "Report Name" : "Audience Name"}
            variant="outlined"
            size="small"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { fontSize: '0.85rem' } }}
          />
          <FormControl fullWidth size="small">
            <Select
              value={reportKind}
              onChange={(e) => setReportKind(e.target.value)}
              sx={{ fontSize: '0.85rem' }}
            >
              <MenuItem value="Kind" disabled sx={{ fontSize: '0.85rem' }}>Kind</MenuItem>
              <MenuItem value="Patient" sx={{ fontSize: '0.85rem' }}>Patient</MenuItem>
              <MenuItem value="Procedures" sx={{ fontSize: '0.85rem' }}>Procedures</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center', gap: 1 }}>
          <Button
            onClick={() => {
              const data = tabValue === 0 ? reports : audiences;
              const category = reportKind === 'Patient' ? 'Patient' : 'Procedures';
              const updatedData = { ...data, [category]: [...data[category], reportName] };
              if (tabValue === 0) setReports(updatedData);
              else setAudiences(updatedData);
              setOpenModal(false);
              setReportName('');
              setReportKind('Kind');
            }}
            sx={{ backgroundColor: '#dcb265', color: '#fff', textTransform: 'none', px: 3, fontSize: '0.85rem', '&:hover': { backgroundColor: '#c99f54' } }}
          >
            Save
          </Button>
          <Button
            onClick={() => setOpenModal(false)}
            sx={{ backgroundColor: '#a6a6a6', color: '#fff', textTransform: 'none', px: 3, fontSize: '0.85rem', '&:hover': { backgroundColor: '#8c8c8c' } }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdvancedReporting;
