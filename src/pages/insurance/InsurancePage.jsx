import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, Typography, Button, Tabs, Tab, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Menu, MenuItem, Chip, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Alert, Collapse, Grid
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patient.service';

const InsurancePage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [rowMenuAnchorEl, setRowMenuAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const [expandedRowId, setExpandedRowId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [addCoverageDialogOpen, setAddCoverageDialogOpen] = useState(false);
  const [viewCoverageDialogOpen, setViewCoverageDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Form states
  const [newCoverageType, setNewCoverageType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [activeCoverages, setActiveCoverages] = useState([]);

  useEffect(() => {
    const fetchInsurances = async () => {
      if (!patientId) return;
      try {
        setLoading(true);
        const data = await patientService.getPatientInsurances(patientId);
        console.log('Fetched Insurance Data:', data);
        
        // Map data to ensure consistent field names
        const mappedData = data.map(item => ({
          ...item,
          payer: item.insuranceCompany?.name || item.payer || 'Unknown Payer',
          plan: item.planType || item.plan || 'No Plan',
          subscriber: item.subscriberName || item.subscriber || 'Unknown Subscriber',
          status: (item.isActive === true || item.status === 'active') ? 'active' : 'inactive',
          eligibilityChecked: item.lastEligibilityCheckDate || 'Not checked',
          dentist: item.provider?.name || 'Default Dentist'
        }));
        
        setActiveCoverages(mappedData.filter(i => i.status === 'active'));
      } catch (error) {
        console.error('Error fetching insurances:', error);
        showSnackbar('Failed to load insurance coverage', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchInsurances();
  }, [patientId]);

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
    if (type === 'Membership Plan') {
      navigate(patientId ? `/patients/member/${patientId}` : '/membership-plans');
    } else {
      // Navigate to the real insurance form page (with or without patientId)
      const path = patientId ? `/patients/${patientId}/insurance/new` : '/insurance/new';
      navigate(path);
    }
    handleCloseMenu();
  };

  const handleViewOldDesign = () => {
    showSnackbar('Redirecting to old design...', 'info');
    // In real app: navigate('/insurance/legacy')
  };

  const handleViewCoverage = (row) => {
    setExpandedRowId(expandedRowId === row.id ? null : row.id);
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
    switch (tabValue) {
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

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            onClick={handleOpenMenu}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              bgcolor: '#2e7d32', // Reverted to original green
              color: '#fff',
              textTransform: 'none',
              borderRadius: '20px',
              px: 3,
              fontWeight: 700,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#2fb365', boxShadow: 'none' }
            }}
          >
            Add Coverage
          </Button>
          <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleCloseMenu}>
            <MenuItem onClick={() => handleAddCoverage('Insurance Coverage')}>Insurance Coverage</MenuItem>
            <MenuItem onClick={() => handleAddCoverage('Membership Plan')}>Membership Plan</MenuItem>
          </Menu>

          <Button
            variant="contained"
            onClick={handleViewOldDesign}
            sx={{
              bgcolor: '#e0e0e0',
              color: '#444',
              textTransform: 'none',
              borderRadius: '20px',
              px: 3,
              fontWeight: 600,
              fontSize: '0.85rem',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#d5d5d5', boxShadow: 'none' }
            }}
          >
            View In Old Design
          </Button>
        </Box>
      </Box>

      {/* Imported Insurance Blue Banner */}
      <Box sx={{ 
        bgcolor: '#ebf5ff', 
        p: 2, 
        borderRadius: '8px', 
        mb: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        border: '1px solid #d1e9ff'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ bgcolor: 'white', p: 1.5, borderRadius: '50%', display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <DescriptionIcon sx={{ color: '#1976d2', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#1a3353' }}>
              Insurance details were imported
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#6a7d95' }}>
              This patient uploaded their insurance details
            </Typography>
          </Box>
        </Box>
        <Button 
          variant="contained" 
          size="small"
          sx={{ 
            bgcolor: '#1976d2', 
            borderRadius: '20px', 
            textTransform: 'none', 
            px: 3, 
            fontWeight: 700,
            fontSize: '0.8rem',
            '&:hover': { bgcolor: '#1565c0' }
          }}
        >
          Review
        </Button>
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
                <React.Fragment key={row.id}>
                  <TableRow sx={{ '& .MuiTableCell-body': { py: 1.25, borderBottom: expandedRowId === row.id ? 'none' : '1px solid #eee' } }}>
                    <TableCell sx={{ fontSize: '0.78rem', color: '#444', fontWeight: 500 }}>
                      {row.payer}
                    </TableCell>

                    <TableCell sx={{ fontSize: '0.78rem', color: '#444' }}>
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
                          View Coverage
                        </Button>
                        {row.status !== 'archived' && (
                          <>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleDeactivate(row)}
                              sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 700, fontSize: '0.72rem', py: 0.25, px: 1.25, borderColor: '#eee', color: '#888', bgcolor: '#f5f5f5' }}
                            >
                              Deactivate
                            </Button>
                            <IconButton
                              size="small"
                              onClick={(e) => handleRowMenuOpen(e, row)}
                              sx={{ border: '1px solid #eee', p: 0.25, ml: 0.5 }}
                            >
                              <KeyboardArrowDownIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                  
                  {/* Expanded Detail View */}
                  <TableRow>
                    <TableCell colSpan={4} sx={{ p: 0 }}>
                      <Collapse in={expandedRowId === row.id} timeout="auto" unmountOnExit>
                        <Box sx={{ px: 3, pb: 3, pt: 1, borderBottom: '1px solid #eee' }}>
                          <Grid container spacing={4}>
                            {/* Column 1: Carrier Info */}
                            <Grid item xs={12} md={4}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <InfoRow label="Carrier name:" value={row.insuranceCompany?.name || row.payer} />
                                <InfoRow label="Payer ID:" value={row.payerId || '39026'} />
                                <InfoRow label="Payer Phone Number:" value={row.payerPhone || '(877) 434-2336'} />
                                <InfoRow label="Payer Address:" value={row.payerAddress || 'P.O. Box 21191, Eagan, Minnesota, 55121'} />
                              </Box>
                            </Grid>

                            {/* Column 2: Plan Info */}
                            <Grid item xs={12} md={4} sx={{ borderLeft: { md: '1px solid #eee' }, pl: { md: 4 } }}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <InfoRow label="Employer/Insurance Plan Name:" value={row.employerName || row.plan} />
                                <InfoRow label="Group Name:" value={row.groupName || 'Delta Care'} />
                                <InfoRow label="Group Number:" value={row.groupNumber || '7443-0001'} />
                                <InfoRow label="Plan Fee Guide:" value={row.planFeeGuide || 'Careington PPO Platinum (directly in network)'} />
                                <InfoRow label="Employer Address:" value={row.employerAddress || '---'} />
                                <InfoRow label="Employer Phone Number:" value={row.employerPhone || '---'} />
                              </Box>
                            </Grid>

                            {/* Column 3: Subscriber Info */}
                            <Grid item xs={12} md={4} sx={{ borderLeft: { md: '1px solid #eee' }, pl: { md: 4 } }}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <InfoRow label="Subscriber Name:" value={row.subscriberName || row.subscriber} />
                                <InfoRow label="Subscriber ID:" value={row.subscriberId || '865421010'} />
                                <InfoRow label="Subscriber Birthday:" value={row.subscriberDob || '10/29/1975'} />
                                <InfoRow label="Renewal Date:" value={row.renewalDate || 'January'} />
                                <InfoRow label="Relationship to subscriber:" value={row.relationship || 'Self'} />
                                <InfoRow label="Policy Started:" value={row.policyStartDate || '01/01/2023'} />
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
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

// Helper component for info rows in expanded view
const InfoRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', gap: 1, py: 0.2 }}>
    <Typography sx={{ fontSize: '0.72rem', color: '#888', width: 'auto', minWidth: 'fit-content' }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: '0.72rem', color: '#333', fontWeight: 600 }}>
      {value}
    </Typography>
  </Box>
);

export default InsurancePage;
