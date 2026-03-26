import React, { useState } from 'react';
import { 
  Box, Typography, Button, Tabs, Tab, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Menu, MenuItem, Chip, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Alert
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

const InsurancePage = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [rowMenuAnchorEl, setRowMenuAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  
  // Dialog states
  const [addCoverageDialogOpen, setAddCoverageDialogOpen] = useState(false);
  const [viewCoverageDialogOpen, setViewCoverageDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  // Form states
  const [newCoverageType, setNewCoverageType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Mock insurance data
  const [activeCoverages, setActiveCoverages] = useState([
    {
      id: 1,
      payer: 'MetLife by MetLife',
      plan: 'PRIMARY COVERAGE',
      subscriber: 'John Doe',
      eligibilityChecked: '03/04/2026',
      dentist: 'Default Dentist',
      status: 'active'
    },
    {
      id: 2,
      payer: 'Delta Dental',
      plan: 'SECONDARY COVERAGE',
      subscriber: 'Jane Doe',
      eligibilityChecked: '03/01/2026',
      dentist: 'Dr. Smith',
      status: 'active'
    },
    {
      id: 3,
      payer: 'Cigna Healthcare',
      plan: 'PRIMARY COVERAGE',
      subscriber: 'Bob Wilson',
      eligibilityChecked: '02/28/2026',
      dentist: 'Dr. Johnson',
      status: 'active'
    }
  ]);

  const [familyCoverages] = useState([
    {
      id: 4,
      payer: 'United Healthcare',
      plan: 'FAMILY PLAN',
      subscriber: 'John Doe',
      members: ['John Doe', 'Jane Doe', 'Jimmy Doe'],
      eligibilityChecked: '03/05/2026',
      status: 'active'
    }
  ]);

  const [archivedCoverages] = useState([
    {
      id: 5,
      payer: 'Aetna Dental',
      plan: 'ARCHIVED',
      subscriber: 'Old Patient',
      archivedDate: '01/15/2026',
      status: 'archived'
    }
  ]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => setSnackbar({ open: false, message: '', severity: 'success' }), 3000);
  };

  const handleOpenMenu = (event) => setMenuAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setMenuAnchorEl(null);

  const handleRowMenuOpen = (event, row) => {
    setRowMenuAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleRowMenuClose = () => {
    setRowMenuAnchorEl(null);
    setSelectedRow(null);
  };

  // Handler functions
  const handleAddCoverage = (type) => {
    setNewCoverageType(type);
    setAddCoverageDialogOpen(true);
    handleCloseMenu();
  };

  const handleViewOldDesign = () => {
    showSnackbar('Redirecting to old design...', 'info');
    // In real app: navigate('/insurance/legacy')
  };

  const handleViewCoverage = (row) => {
    setSelectedRow(row);
    setViewCoverageDialogOpen(true);
    handleRowMenuClose();
  };

  const handleDeactivate = (row) => {
    setSelectedRow(row);
    setDeactivateDialogOpen(true);
    handleRowMenuClose();
  };

  const handleConfirmDeactivate = () => {
    if (selectedRow) {
      setActiveCoverages(prev => prev.filter(cov => cov.id !== selectedRow.id));
      showSnackbar(`${selectedRow.payer} coverage deactivated`, 'success');
      setDeactivateDialogOpen(false);
      setSelectedRow(null);
    }
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setEditDialogOpen(true);
    handleRowMenuClose();
  };

  const handleArchive = (row) => {
    if (window.confirm(`Are you sure you want to archive ${row.payer}?`)) {
      setActiveCoverages(prev => prev.filter(cov => cov.id !== row.id));
      showSnackbar(`${row.payer} archived successfully`, 'success');
      handleRowMenuClose();
    }
  };

  const handleCheckEligibility = (row) => {
    showSnackbar(`Checking eligibility with ${row.dentist}...`, 'info');
    setTimeout(() => {
      showSnackbar('Eligibility verified successfully!', 'success');
    }, 1500);
  };

  const handleSaveNewCoverage = () => {
    showSnackbar('Coverage added successfully!', 'success');
    setAddCoverageDialogOpen(false);
    setNewCoverageType('');
  };

  const handleSaveEdit = () => {
    showSnackbar('Coverage updated successfully!', 'success');
    setEditDialogOpen(false);
    setSelectedRow(null);
  };

  const getTabData = () => {
    switch(tabValue) {
      case 0: return activeCoverages;
      case 1: return familyCoverages;
      case 2: return archivedCoverages;
      case 3: return [];
      default: return activeCoverages;
    }
  };

  const currentTabData = getTabData();

  return (
    <Box sx={{ p: 2, bgcolor: 'white', minHeight: '100vh' }}>
      {/* Snackbar Notification */}
      {snackbar.open && (
        <Alert severity={snackbar.severity} sx={{ mb: 2 }}>
          {snackbar.message}
        </Alert>
      )}

      {/* Top Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#333' }}>
          Insurance
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            onClick={handleOpenMenu}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ 
              bgcolor: '#2e7d32', 
              textTransform: 'none', 
              borderRadius: '20px',
              px: 3,
              '&:hover': { bgcolor: '#1b5e20' }
            }}
          >
            Add Coverage
          </Button>
          <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleCloseMenu}>
            <MenuItem onClick={() => handleAddCoverage('Insurance Coverage')}>Insurance Coverage</MenuItem>
            <MenuItem onClick={() => handleAddCoverage('Membership Plan')}>Membership Plan</MenuItem>
          </Menu>

          <Button 
            variant="outlined" 
            onClick={handleViewOldDesign}
            sx={{ 
              color: '#666', 
              borderColor: '#ccc', 
              textTransform: 'none', 
              borderRadius: '8px',
              fontSize: '0.8rem'
            }}
          >
            View In Old Design
          </Button>
        </Box>
      </Box>

      {/* Custom Tabs */}
      <Tabs 
        value={tabValue} 
        onChange={(e, v) => setTabValue(v)}
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          '& .MuiTab-root': { 
            textTransform: 'none', 
            minWidth: 120, 
            fontWeight: 600, 
            fontSize: '0.8rem',
            color: '#999' 
          },
          '& .Mui-selected': { color: '#1976d2 !important' }
        }}
      >
        <Tab label="Active Coverages" />
        <Tab label="Family Coverages" />
        <Tab label="Archived Coverages" />
        <Tab label="Archived Family Coverages" />
      </Tabs>

      {/* The Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: 'none' }}>
        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#fbfbfb', '& .MuiTableCell-head': { py: 0.75, fontSize: '0.75rem', fontWeight: 600, color: '#888', whiteSpace: 'nowrap' } }}>
              <TableCell>PAYER/CARRIER</TableCell>
              <TableCell align="center">PLAN</TableCell>
              <TableCell>SUBSCRIBER</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {currentTabData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3, fontSize: '0.78rem', color: '#999' }}>
                  No coverages found in this tab
                </TableCell>
              </TableRow>
            ) : (
              currentTabData.map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '& .MuiTableCell-body': { py: 0.75 } }}>
                  <TableCell sx={{ fontSize: '0.78rem', color: '#444' }}>
                    {row.payer}
                  </TableCell>

                  <TableCell sx={{ fontSize: '0.78rem', color: '#444', py: 0.75 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Chip
                        label={row.plan}
                        sx={{
                          bgcolor: row.status === 'active' ? '#e8f5e9' : '#fff3e0',
                          color: row.status === 'active' ? '#2e7d32' : '#f57c00',
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          height: 20,
                        }}
                      />
                      {row.dentist && (
                        <Box sx={{ textAlign: 'left' }}>
                          <Typography component="span" sx={{ fontSize: '0.78rem', color: '#2e7d32', fontWeight: 500 }}>
                            Check Eligibility with{' '}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ fontSize: '0.78rem', color: '#666', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}
                            onClick={() => handleCheckEligibility(row)}
                          >
                            {row.dentist} <KeyboardArrowDownIcon sx={{ fontSize: 14, verticalAlign: 'middle' }} />
                          </Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: '#aaa' }}>
                            Eligibility Checked on {row.eligibilityChecked}
                          </Typography>
                        </Box>
                      )}
                      {row.members && (
                        <Box sx={{ textAlign: 'left' }}>
                          <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>
                            Members: {row.members.join(', ')}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </TableCell>

                  <TableCell sx={{ fontSize: '0.78rem', color: '#444' }}>
                    {row.subscriber}
                  </TableCell>

                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.75, justifyContent: 'flex-end', alignItems: 'center' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewCoverage(row)}
                        sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 700, fontSize: '0.72rem', py: 0.25, px: 1.25, borderColor: '#1a237e', color: '#1a237e' }}
                      >
                        View
                      </Button>
                      {row.status !== 'archived' && (
                        <>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleDeactivate(row)}
                            sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 700, fontSize: '0.72rem', py: 0.25, px: 1.25, borderColor: '#ccc', color: '#888' }}
                          >
                            Deactivate
                          </Button>
                          <IconButton
                            size="small"
                            onClick={(e) => handleRowMenuOpen(e, row)}
                            sx={{ border: '1px solid #ccc', p: 0.25 }}
                          >
                            <KeyboardArrowDownIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Row Actions Menu */}
      <Menu
        anchorEl={rowMenuAnchorEl}
        open={Boolean(rowMenuAnchorEl)}
        onClose={handleRowMenuClose}
      >
        <MenuItem onClick={() => handleEdit(selectedRow)}>
          <EditIcon sx={{ mr: 1, fontSize: 18 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => handleArchive(selectedRow)}>
          <ArchiveIcon sx={{ mr: 1, fontSize: 18 }} /> Archive
        </MenuItem>
        <MenuItem onClick={() => { handleRowMenuClose(); navigate('/patients'); }}>
          <CheckCircleIcon sx={{ mr: 1, fontSize: 18 }} /> View Patient
        </MenuItem>
      </Menu>

      {/* Add Coverage Dialog */}
      <Dialog open={addCoverageDialogOpen} onClose={() => setAddCoverageDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add {newCoverageType}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Insurance Company/Payer"
              type="text"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Plan Type"
              type="text"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Subscriber Name"
              type="text"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Policy Number"
              type="text"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Group Number"
              type="text"
              fullWidth
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddCoverageDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveNewCoverage} variant="contained" sx={{ bgcolor: '#2e7d32' }}>
            Save Coverage
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Coverage Dialog */}
      <Dialog open={viewCoverageDialogOpen} onClose={() => setViewCoverageDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Coverage Details - {selectedRow?.payer}</DialogTitle>
        <DialogContent>
          {selectedRow && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Plan:</strong> {selectedRow.plan}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Subscriber:</strong> {selectedRow.subscriber}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Status:</strong> <Chip label={selectedRow.status.toUpperCase()} size="small" color={selectedRow.status === 'active' ? 'success' : 'default'} />
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Eligibility Checked:</strong> {selectedRow.eligibilityChecked}
              </Typography>
              {selectedRow.dentist && (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Dentist:</strong> {selectedRow.dentist}
                </Typography>
              )}
              {selectedRow.members && (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Members:</strong> {selectedRow.members.join(', ')}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewCoverageDialogOpen(false)}>Close</Button>
          <Button onClick={() => handleEdit(selectedRow)} variant="outlined">Edit</Button>
        </DialogActions>
      </Dialog>

      {/* Deactivate Confirmation Dialog */}
      <Dialog open={deactivateDialogOpen} onClose={() => setDeactivateDialogOpen(false)}>
        <DialogTitle>Confirm Deactivation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to deactivate coverage for <strong>{selectedRow?.payer}</strong>?
          </Typography>
          <Typography sx={{ mt: 2, color: 'text.secondary' }}>
            This will move the coverage to archived status.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeactivateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDeactivate} variant="contained" color="error">
            Deactivate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Coverage Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Coverage - {selectedRow?.payer}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Insurance Company/Payer"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={selectedRow?.payer}
            />
            <TextField
              margin="dense"
              label="Plan Type"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={selectedRow?.plan}
            />
            <TextField
              margin="dense"
              label="Subscriber Name"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={selectedRow?.subscriber}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InsurancePage;
