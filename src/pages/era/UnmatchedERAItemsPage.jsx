import { useState, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  IconButton,
  Chip,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Clear,
  FilterAltOff,
  ArrowBack as ArrowBackIcon,
  Link as LinkIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { eraService } from '../../services/era.service';
import { claimService } from '../../services/claim.service';
import { invoiceService } from '../../services/invoice.service';

const UnmatchedERAItemsPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    itemId: null,
  });
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [matching, setMatching] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [claims, setClaims] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loadingClaims, setLoadingClaims] = useState(false);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  const handleResetFilters = () => {
    setSearch('');
    setStartDate(null);
    setEndDate(null);
    setPage(0);
  };

  const hasActiveFilters = search || startDate || endDate;

  const fetchUnmatchedItems = useCallback(
    async (searchValue) => {
      try {
        setLoading(true);
        setError('');

        const params = {
          page: page + 1,
          limit: rowsPerPage,
          search: searchValue?.trim() || undefined,
          startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : undefined,
          endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : undefined,
        };

        const result = await eraService.getUnmatchedItems(params);
        setItems(result.items || result.unmatchedItems || []);
        setTotalItems(result.pagination?.total || 0);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to fetch unmatched items. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    },
    [page, rowsPerPage, startDate, endDate]
  );

  const debouncedFetch = useDebouncedCallback((searchValue) => {
    if (page === 0) {
      fetchUnmatchedItems(searchValue);
    } else {
      setPage(0);
    }
  }, 500);

  useEffect(() => {
    fetchUnmatchedItems(search);
  }, [page, rowsPerPage, startDate, endDate]);

  useEffect(() => {
    debouncedFetch(search);
  }, [search, debouncedFetch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionMenuOpen = (event, itemId) => {
    setActionMenu({ anchorEl: event.currentTarget, itemId });
  };

  const handleActionMenuClose = () => {
    setActionMenu({ anchorEl: null, itemId: null });
  };

  const handleMatchClick = async (itemId) => {
    handleActionMenuClose();
    const item = items.find((i) => (i._id || i.id) === itemId);
    if (!item) return;

    setSelectedItem(item);
    setMatchDialogOpen(true);

    // Fetch potential matches
    try {
      setLoadingClaims(true);
      setLoadingInvoices(true);
      const [claimsResult, invoicesResult] = await Promise.all([
        claimService.getAllClaims({ page: 1, limit: 50, search: item.patientName || item.claimNumber }).catch(() => ({ claims: [] })),
        invoiceService.getAllInvoices({ page: 1, limit: 50, search: item.patientName || item.invoiceNumber }).catch(() => ({ invoices: [] })),
      ]);
      setClaims(claimsResult.claims || []);
      setInvoices(invoicesResult.invoices || []);
    } catch (err) {
      console.error('Failed to fetch potential matches:', err);
    } finally {
      setLoadingClaims(false);
      setLoadingInvoices(false);
    }
  };

  const handleMatchConfirm = async () => {
    if (!selectedClaim && !selectedInvoice) {
      showSnackbar('Please select a claim or invoice to match', 'error');
      return;
    }

    try {
      setMatching(true);
      await eraService.matchERAItem(
        selectedItem._id || selectedItem.id,
        selectedClaim?._id || selectedClaim?.id,
        selectedInvoice?._id || selectedInvoice?.id
      );
      showSnackbar('Item matched successfully', 'success');
      setMatchDialogOpen(false);
      setSelectedItem(null);
      setSelectedClaim(null);
      setSelectedInvoice(null);
      fetchUnmatchedItems(search);
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || 'Failed to match item',
        'error'
      );
    } finally {
      setMatching(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return date ? dayjs(date).format('MMM DD, YYYY') : '-';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <IconButton onClick={() => navigate('/era')}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" fontWeight="bold">
              Unmatched ERA Items
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Items that could not be automatically matched to claims or invoices
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid container spacing={2} sx={{ mb: 3, alignItems: 'flex-end' }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder="Search by patient name, claim #, invoice #..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: search.length > 0 && (
                    <IconButton size="small" onClick={() => setSearch('')}>
                      <Clear />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                  setPage(0);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                  setPage(0);
                }}
                minDate={startDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                <Tooltip title="Clear Filters">
                  <span>
                    <IconButton
                      onClick={handleResetFilters}
                      disabled={loading || !hasActiveFilters}
                      color="primary"
                    >
                      <FilterAltOff />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Refresh">
                  <span>
                    <IconButton onClick={() => fetchUnmatchedItems(search)} disabled={loading} color="primary">
                      <RefreshIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>

          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Patient Name</TableCell>
                      <TableCell>Claim/Invoice #</TableCell>
                      <TableCell>Payment Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Insurance</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">No unmatched items found</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item) => (
                        <TableRow key={item._id || item.id} hover>
                          <TableCell>{item.patientName || '-'}</TableCell>
                          <TableCell>
                            {item.claimNumber || item.invoiceNumber || item.claimReference || '-'}
                          </TableCell>
                          <TableCell>{formatDate(item.paymentDate || item.date)}</TableCell>
                          <TableCell>{formatCurrency(item.amount || item.paymentAmount || 0)}</TableCell>
                          <TableCell>{item.insuranceCompanyName || item.payerName || '-'}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) => handleActionMenuOpen(e, item._id || item.id)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={totalItems}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </>
          )}
        </Paper>

        <Menu
          anchorEl={actionMenu.anchorEl}
          open={Boolean(actionMenu.anchorEl)}
          onClose={handleActionMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={() => handleMatchClick(actionMenu.eraId)}>
            <ListItemIcon>
              <LinkIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Match Manually</ListItemText>
          </MenuItem>
        </Menu>

        {/* Manual Match Dialog */}
        <Dialog
          open={matchDialogOpen}
          onClose={() => {
            setMatchDialogOpen(false);
            setSelectedItem(null);
            setSelectedClaim(null);
            setSelectedInvoice(null);
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Match ERA Item</DialogTitle>
          <DialogContent>
            {selectedItem && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Item to Match:</strong> {selectedItem.patientName || 'Unknown'} -{' '}
                    {formatCurrency(selectedItem.amount || 0)} - {formatDate(selectedItem.paymentDate)}
                  </Typography>
                </Alert>
                <Autocomplete
                  options={claims}
                  getOptionLabel={(option) =>
                    `${option.claimNumber || option.claimCode || 'Claim'} - ${
                      option.patient?.firstName || option.patientId?.firstName || ''
                    } ${option.patient?.lastName || option.patientId?.lastName || ''}`
                  }
                  loading={loadingClaims}
                  value={selectedClaim}
                  onChange={(event, newValue) => {
                    setSelectedClaim(newValue);
                    setSelectedInvoice(null); // Clear invoice if claim is selected
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Match to Claim (Optional)"
                      placeholder="Search claims..."
                    />
                  )}
                />
                <Autocomplete
                  options={invoices}
                  getOptionLabel={(option) =>
                    `${option.invoiceNumber || 'Invoice'} - ${
                      option.patient?.firstName || option.patientId?.firstName || ''
                    } ${option.patient?.lastName || option.patientId?.lastName || ''}`
                  }
                  loading={loadingInvoices}
                  value={selectedInvoice}
                  onChange={(event, newValue) => {
                    setSelectedInvoice(newValue);
                    setSelectedClaim(null); // Clear claim if invoice is selected
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Match to Invoice (Optional)"
                      placeholder="Search invoices..."
                    />
                  )}
                />
                <Alert severity="warning">
                  <Typography variant="body2">
                    Select either a claim or an invoice to match this payment item.
                  </Typography>
                </Alert>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setMatchDialogOpen(false);
                setSelectedItem(null);
                setSelectedClaim(null);
                setSelectedInvoice(null);
              }}
              disabled={matching}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleMatchConfirm}
              disabled={matching || (!selectedClaim && !selectedInvoice)}
              startIcon={matching ? <CircularProgress size={20} /> : <LinkIcon />}
            >
              {matching ? 'Matching...' : 'Match Item'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default UnmatchedERAItemsPage;
