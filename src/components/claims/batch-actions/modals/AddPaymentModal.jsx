import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Paper,
  FormControlLabel,
  Radio,
  TextField,
  InputAdornment,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Grid,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { ReportSelect } from '../../../reports/ui';

const AddPaymentModal = ({
  open,
  onClose,
  activeModalStep,
  setActiveModalStep,
  allocations,
  setAllocations,
  searchType,
  setSearchType,
  allocationsSearchQuery,
  setAllocationsSearchQuery,
  newPaymentRef,
  setNewPaymentRef,
  checkAmount,
  setCheckAmount,
  newPaymentCarrier,
  setNewPaymentCarrier,
  newPaymentDate,
  setNewPaymentDate,
  handleSaveBatchPayment,
  allCarriers = []
}) => {
  return (
    <Dialog open={open} onClose={() => { onClose(); setActiveModalStep(0); }} maxWidth="lg" fullWidth sx={{ zIndex: 9999 }} PaperProps={{ sx: { borderRadius: '16px', height: '600px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', fontFamily: 'Inter, sans-serif' } }}>
      <DialogTitle sx={{ boxSizing: "border-box", px: "25px", py: "16px", display: "flex", alignItems: "center", gap: "8px", borderBottom: '1px solid #e0e5eb', backgroundColor: '#f3f8fd', m: 0, flexShrink: 0 }}>
        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: '#0F172A', flex: 1, fontFamily: 'Inter, sans-serif' }}>
          Insurance New Payment <Typography component="span" sx={{ color: '#2362EF', fontWeight: 600, fontSize: '15px' }}>- Step {activeModalStep + 1} of 3</Typography>
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {activeModalStep > 0 && (
            <Button
              variant="outlined"
              onClick={() => setActiveModalStep(prev => prev - 1)}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px', borderColor: '#e2e8f0', color: '#64748b', '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' } }}
            >
              Back
            </Button>
          )}
          {activeModalStep === 0 && (
            <Button
              variant="contained"
              disabled={allocations.filter(a => a.checked).length === 0}
              onClick={() => setActiveModalStep(1)}
              sx={{ bgcolor: '#2362EF', textTransform: 'none', fontWeight: 600, borderRadius: '8px', '&:hover': { bgcolor: '#1D53CC' }, boxShadow: '0 4px 6px -1px rgba(35, 98, 239, 0.2)' }}
            >
              Next: Payment Allocation
            </Button>
          )}
          {activeModalStep === 1 && (
            <Button
              variant="contained"
              onClick={() => setActiveModalStep(2)}
              sx={{ bgcolor: '#2362EF', textTransform: 'none', fontWeight: 600, borderRadius: '8px', '&:hover': { bgcolor: '#1D53CC' }, boxShadow: '0 4px 6px -1px rgba(35, 98, 239, 0.2)' }}
            >
              Next: Payment Method
            </Button>
          )}
          {activeModalStep === 2 && (
            <Button
              variant="contained"
              onClick={handleSaveBatchPayment}
              sx={{ bgcolor: '#2362EF', textTransform: 'none', fontWeight: 600, borderRadius: '8px', '&:hover': { bgcolor: '#1D53CC' }, boxShadow: '0 4px 6px -1px rgba(35, 98, 239, 0.2)' }}
            >
              Record Batch Payment
            </Button>
          )}
          <IconButton onClick={() => { onClose(); setActiveModalStep(0); }} size="small" sx={{ color: '#64748B' }}>
            <CloseIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'row', bgcolor: '#f4f6f8' }}>
        {/* Left Sidebar (Stepper) */}
        <Box sx={{ width: '240px', borderRight: '1px solid #e0e6ed', bgcolor: '#f8fafc', pt: 4, px: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Step 1 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative' }}>
            <Box sx={{ zIndex: 1, width: 24, height: 24, borderRadius: '50%', bgcolor: activeModalStep >= 0 ? '#2362EF' : '#f8fafc', border: activeModalStep >= 0 ? 'none' : '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 1, boxShadow: activeModalStep >= 0 ? '0 0 0 4px rgba(35, 98, 239, 0.1)' : 'none', transition: 'all 0.3s ease' }}>
              {activeModalStep > 0 ? (
                <Typography sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 700 }}>✓</Typography>
              ) : (
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'white' }} />
              )}
            </Box>
            <Typography sx={{ fontWeight: activeModalStep === 0 ? 700 : 500, fontSize: '0.85rem', color: activeModalStep === 0 ? '#2362EF' : '#64748b', transition: 'color 0.3s' }}>Claims Selection</Typography>
            <Box sx={{ position: 'absolute', left: 22, top: 32, bottom: -40, width: '2px', bgcolor: activeModalStep > 0 ? '#2362EF' : '#e0e6ed', transition: 'background-color 0.3s' }} />
          </Box>
          {/* Step 2 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative' }}>
            <Box sx={{ zIndex: 1, width: 24, height: 24, borderRadius: '50%', bgcolor: activeModalStep >= 1 ? '#2362EF' : '#f8fafc', border: activeModalStep >= 1 ? 'none' : '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 1, boxShadow: activeModalStep >= 1 ? '0 0 0 4px rgba(35, 98, 239, 0.1)' : 'none', transition: 'all 0.3s ease' }}>
              {activeModalStep > 1 ? (
                <Typography sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 700 }}>✓</Typography>
              ) : activeModalStep === 1 ? (
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'white' }} />
              ) : null}
            </Box>
            <Typography sx={{ fontWeight: activeModalStep === 1 ? 700 : 500, fontSize: '0.85rem', color: activeModalStep === 1 ? '#2362EF' : '#64748b', transition: 'color 0.3s' }}>Payment Allocation</Typography>
            <Box sx={{ position: 'absolute', left: 22, top: 32, bottom: -40, width: '2px', bgcolor: activeModalStep > 1 ? '#2362EF' : '#e0e6ed', transition: 'background-color 0.3s' }} />
          </Box>
          {/* Step 3 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative' }}>
            <Box sx={{ zIndex: 1, width: 24, height: 24, borderRadius: '50%', bgcolor: activeModalStep === 2 ? '#2362EF' : '#f8fafc', border: activeModalStep === 2 ? 'none' : '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 1, boxShadow: activeModalStep === 2 ? '0 0 0 4px rgba(35, 98, 239, 0.1)' : 'none', transition: 'all 0.3s ease' }}>
              {activeModalStep === 2 && <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'white' }} />}
            </Box>
            <Typography sx={{ fontWeight: activeModalStep === 2 ? 700 : 500, fontSize: '0.85rem', color: activeModalStep === 2 ? '#2362EF' : '#64748b', transition: 'color 0.3s' }}>Payment Method</Typography>
          </Box>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ flex: 1, p: 3, display: 'flex', gap: 3, overflowY: 'auto' }}>
          {activeModalStep === 0 && (
            <>
              {/* Left Column: Search and Claims */}
              <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Search Box */}
                <Paper sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#4a5568', mb: 1 }}>Search By:</Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 1.5, ml: 0 }}>
                    <FormControlLabel
                      value="Carrier"
                      control={<Radio size="small" checked={searchType === 'Carrier'} onChange={() => setSearchType('Carrier')} sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2362EF' } }} />}
                      label={<Typography sx={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 500 }}>Carrier</Typography>}
                      sx={{ m: 0 }}
                    />
                    <FormControlLabel
                      value="Patient"
                      control={<Radio size="small" checked={searchType === 'Patient'} onChange={() => setSearchType('Patient')} sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2362EF' } }} />}
                      label={<Typography sx={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 500 }}>Patient</Typography>}
                      sx={{ m: 0 }}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    size="small"
                    value={allocationsSearchQuery}
                    onChange={(e) => setAllocationsSearchQuery(e.target.value)}
                    placeholder={searchType === 'Carrier' ? "Search for Carrier" : "Search for Patient"}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#7994c6', fontSize: 18 }} /></InputAdornment>
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px', fontSize: '0.85rem', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#2362EF' } } }}
                  />
                </Paper>

                {/* Claims Box */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#4a5568', ml: 0.5, textTransform: 'uppercase' }}>Outstanding Claims</Typography>
                  {allocations.length === 0 ? (
                    <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, borderRadius: '12px', border: '1px dashed #cbd5e1', boxShadow: 'none', bgcolor: '#f8fafc', minHeight: '150px' }}>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', mb: 0.5 }}>No Claims Found</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>There are no outstanding claims matching your filter.</Typography>
                    </Paper>
                  ) : (
                    <TableContainer component={Paper} elevation={0} sx={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', border: '1px solid #e2e8f0', borderRadius: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow sx={{ '& .MuiTableCell-head': { bgcolor: '#f8f9fa', py: '10px', fontFamily: 'Inter', fontSize: '0.8125rem', fontWeight: 600, color: '#64748B', letterSpacing: '0.4px', textTransform: 'uppercase', whiteSpace: 'nowrap', borderBottom: '1px solid #e2e8f0' } }}>
                            <TableCell padding="checkbox"></TableCell>
                            <TableCell>CLAIM #</TableCell>
                            <TableCell>PATIENT</TableCell>
                            <TableCell>CARRIER</TableCell>
                            <TableCell align="right">OPEN BAL</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {allocations.map((claim, idx) => (
                            <TableRow key={claim.claimId || idx} hover sx={{ '&:hover': { backgroundColor: '#f8fafc' }, transition: 'background-color 0.15s' }}>
                              <TableCell padding="checkbox" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                                <Checkbox
                                  size="small"
                                  sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2362EF' } }}
                                  checked={claim.checked || false}
                                  onChange={() => {
                                    setAllocations(prev => prev.map((c, i) => i === idx ? { ...c, checked: !c.checked } : c));
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{ borderBottom: '1px solid #f1f5f9', py: 1.5, fontSize: '0.875rem', fontWeight: 500, color: '#1e293b', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.4 }}>{claim.claimNumber}</TableCell>
                              <TableCell sx={{ borderBottom: '1px solid #f1f5f9', py: 1.5, fontSize: '0.875rem', color: '#4a5568' }}>{claim.patient}</TableCell>
                              <TableCell sx={{ borderBottom: '1px solid #f1f5f9', py: 1.5, fontSize: '0.875rem', color: '#4a5568', fontWeight: 500 }}>{claim.carrier}</TableCell>
                              <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9', py: 1.5, fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>${claim.openAmount?.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              </Box>

              {/* Right Column: Selected Claims */}
              <Box sx={{ flex: 1.2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#4a5568', ml: 0.5, textTransform: 'uppercase' }}>Selected Claims ({allocations.filter(a => a.checked).length})</Typography>
                  {allocations.filter(a => a.checked).length === 0 ? (
                    <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, borderRadius: '12px', border: '1px dashed #cbd5e1', boxShadow: 'none', bgcolor: '#f8fafc', minHeight: '150px' }}>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', mb: 0.5 }}>No Claims Selected Yet</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>Start by selecting claims from the list on the left</Typography>
                    </Paper>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: '380px', overflowY: 'auto', pr: 1 }}>
                      {allocations.filter(a => a.checked).map(claim => (
                        <Paper key={claim.claimId} variant="outlined" sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '10px', bgcolor: 'white', borderColor: '#e2e8f0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>{claim.claimNumber}</Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>{claim.patient}</Typography>
                          </Box>
                          <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>${claim.openAmount?.toFixed(2)}</Typography>
                        </Paper>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            </>
          )}

          {activeModalStep === 1 && (
            <>
              {/* Left Column: Allocation Inputs */}
              <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>Allocate Check Amounts to Claims</Typography>
                <TableContainer component={Paper} elevation={0} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', overflowX: 'auto', width: '100%' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ '& .MuiTableCell-head': { bgcolor: '#f8f9fa', py: '10px', fontFamily: 'Inter', fontSize: '0.8125rem', fontWeight: 600, color: '#64748B', letterSpacing: '0.4px', textTransform: 'uppercase', whiteSpace: 'nowrap', borderBottom: '1px solid #e2e8f0' } }}>
                        <TableCell>CLAIM # / PATIENT</TableCell>
                        <TableCell align="right">OPEN AMT</TableCell>
                        <TableCell sx={{ width: '120px' }}>PAID AMT</TableCell>
                        <TableCell sx={{ width: '120px' }}>WRITE OFF</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allocations.filter(a => a.checked).map((claim) => (
                        <TableRow key={claim.claimId} hover sx={{ '&:hover': { backgroundColor: '#f8fafc' }, transition: 'background-color 0.15s' }}>
                          <TableCell sx={{ borderBottom: '1px solid #f1f5f9', py: 1.5 }}>
                            <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', fontFamily: 'monospace' }}>{claim.claimNumber}</Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#64748b' }}>{claim.patient}</Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9', py: 1.5, fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>${claim.openAmount?.toFixed(2)}</TableCell>
                          <TableCell sx={{ borderBottom: '1px solid #f1f5f9', py: 1.5 }}>
                            <TextField
                              size="small"
                              type="number"
                              placeholder="0.00"
                              value={claim.allocatedPaid || ''}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setAllocations(prev => prev.map(c => c.claimId === claim.claimId ? { ...c, allocatedPaid: val } : c));
                              }}
                              sx={{ bgcolor: '#ffffff', '& .MuiOutlinedInput-root': { borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#2362EF' } } }}
                              inputProps={{ style: { fontSize: '0.875rem', padding: '8px' } }}
                            />
                          </TableCell>
                          <TableCell sx={{ borderBottom: '1px solid #f1f5f9', py: 1.5 }}>
                            <TextField
                              size="small"
                              type="number"
                              placeholder="0.00"
                              value={claim.allocatedWriteOff || ''}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setAllocations(prev => prev.map(c => c.claimId === claim.claimId ? { ...c, allocatedWriteOff: val } : c));
                              }}
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#2362EF' } } }}
                              inputProps={{ style: { fontSize: '0.85rem', padding: '8px' } }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Right Column: Allocation Summary */}
              <Box sx={{ flex: 1.2 }}>
                <Paper sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 2 }}>Allocation Summary</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#4a5568' }}>Total Claims:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{allocations.filter(a => a.checked).length}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#4a5568' }}>Total Allocated Paid:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#2362EF' }}>
                        ${allocations.filter(a => a.checked).reduce((sum, c) => sum + (c.allocatedPaid || 0), 0).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#4a5568' }}>Total Write-offs:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#b45309' }}>
                        ${allocations.filter(a => a.checked).reduce((sum, c) => sum + (c.allocatedWriteOff || 0), 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </>
          )}

          {activeModalStep === 2 && (
            <>
              {/* Left Column: Form Details */}
              <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                <Paper sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>Enter Check Details</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#4a5568', display: 'block', mb: 0.5 }}>Check/Reference Number:</Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={newPaymentRef}
                        onChange={(e) => setNewPaymentRef(e.target.value)}
                        placeholder="e.g. EFT-90284"
                        sx={{ bgcolor: '#ffffff', '& .MuiOutlinedInput-root': { borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#2362EF' } } }}
                        inputProps={{ style: { fontSize: '0.875rem' } }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#4a5568', display: 'block', mb: 0.5 }}>Total Check Amount ($):</Typography>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        value={checkAmount}
                        onChange={(e) => setCheckAmount(e.target.value)}
                        placeholder="e.g. 500.00"
                        sx={{ bgcolor: '#ffffff', '& .MuiOutlinedInput-root': { borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#2362EF' } } }}
                        inputProps={{ style: { fontSize: '0.875rem' } }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#4a5568', display: 'block', mb: 0.5 }}>Insurance Carrier:</Typography>
                      <FormControl fullWidth size="small">
                        <Select value={newPaymentCarrier} onChange={(e) => setNewPaymentCarrier(e.target.value)} sx={{ bgcolor: '#ffffff', borderRadius: '8px', fontSize: '0.875rem', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#2362EF' } }} MenuProps={{ sx: { zIndex: 10000 } }}>
                          {allCarriers.length > 0 ? (
                            allCarriers.map(carrier => (
                              <MenuItem key={carrier} value={carrier} sx={{ fontFamily: 'Inter', fontSize: '13px' }}>{carrier}</MenuItem>
                            ))
                          ) : (
                            <MenuItem value="" disabled sx={{ fontFamily: 'Inter', fontSize: '13px' }}>No carriers available</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#4a5568', display: 'block', mb: 0.5 }}>Check Date:</Typography>
                      <DatePicker
                        value={newPaymentDate ? dayjs(newPaymentDate) : null}
                        onChange={(newValue) => setNewPaymentDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
                        format="MM/DD/YYYY"
                        slotProps={{
                          popper: { sx: { zIndex: 10000 } },
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            sx: {
                              bgcolor: '#ffffff',
                              '& .MuiInputBase-root': {
                                fontFamily: 'Inter',
                                fontSize: '0.875rem',
                                borderRadius: '8px',
                              },
                              '& fieldset': { borderColor: '#e2e8f0' },
                              '&:hover fieldset': { borderColor: '#cbd5e1' },
                              '&.Mui-focused fieldset': { borderColor: '#2362EF' }
                            }
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Box>

              {/* Right Column: Check Summary */}
              <Box sx={{ flex: 1.2 }}>
                <Paper sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 2 }}>Summary Details</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#4a5568' }}>Carrier:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{newPaymentCarrier}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#4a5568' }}>Total Allocated:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#2362EF' }}>
                        ${allocations.filter(a => a.checked).reduce((sum, c) => sum + (c.allocatedPaid || 0), 0).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#4a5568' }}>Reference #:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{newPaymentRef || 'Not entered'}</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentModal;
