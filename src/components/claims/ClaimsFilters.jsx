import React from 'react';
import {
  Box, Typography, Paper, Grid, TextField, Button, Checkbox, FormControl, FormControlLabel, Select, MenuItem, Tooltip, OutlinedInput, InputAdornment, Autocomplete, IconButton
} from '@mui/material';
import { Search as SearchIcon, FileDownload as FileDownloadIcon, PostAdd as PostAddIcon, Add as AddIcon, PictureAsPdf as PictureAsPdfIcon, ArrowDropDown as ArrowDropDownIcon, Refresh as RefreshIcon, FilterList as FilterIcon, Warning as WarningIcon } from '@mui/icons-material';
import { CLAIM_TYPES, CARRIERS, CLAIM_STATUSES, DATE_RANGES, GROUP_BY_OPTIONS } from '../../pages/claims/claimsConstants';

export const ClaimsFilters = ({
  activeTab, claimType, setClaimType, carrier, setCarrier, claimAttachment, setClaimAttachment,
  claimStatus, setClaimStatus, searchPatient, setSearchPatient, searchClaimOrDate, setSearchClaimOrDate,
  groupDateRange, setGroupDateRange, groupByOption, setGroupByOption, showNonAssignment, setShowNonAssignment,
  showInactivePolicies, setShowInactivePolicies, showHidden, setShowHidden, searchReportContent, setSearchReportContent,
  activeEraTab, setActiveEraTab, searchEraContent, setSearchEraContent, sortReportBy, setSortReportBy,
  
  handleRefresh, setVisibleEraCount, validationErrorCount, filteredClaims, claims, expandAllMessages, setExpandAllMessages, hasSelection,
  handleConvertType, handleChangeStatus, handleSendClaims, handlePrintClaims, handleVoidAndRecreate, handlePrintPage, handleExportCSV,
  handleSendPredeterminations, handlePrintPredeterminations
}) => {
  return (
    <>
      {/* Conditional Filtering Panel */}
      {activeTab === 6 ? (
        <Paper sx={{ p: 2.5, mb: 3, backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: 'none', border: '1px solid #e0e6ed' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: '350px', maxWidth: '650px' }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', display: 'block', mb: 0.5 }}>
                Search by report content:                      
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by Patient Name, Clearinghouse Claim #, or DCN..."
                value={searchReportContent}
                onChange={(e) => setSearchReportContent(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    fontSize: '0.85rem',
                  },
                }}
              />
            </Box>
            <Button
              onClick={handleRefresh}
              startIcon={<RefreshIcon sx={{ fontSize: '0.9rem' }} />}
              sx={{
                textTransform: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#1a3a6b',
                padding: '4px 8px',
                mb: 0.5,
                '&:hover': { background: 'none', textDecoration: 'underline' },
              }}
            >
              Refresh
            </Button>
          </Box>
        </Paper>
      ) : activeTab === 7 ? (
        // ERA REPORTS Header Panel (1:1 with Screenshot)
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: 2.5,
            mt: 1,
          }}
        >
          {/* Active Claims vs Voided Claims Brownish-Gold sub-toggles */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={() => {
                setActiveEraTab('active');
                setVisibleEraCount(4);
              }}
              sx={{
                textTransform: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: activeEraTab === 'active' ? '#bc9363' : '#dbcaaf',
                borderRadius: '4px',
                px: 2.5,
                py: 0.6,
                '&:hover': { backgroundColor: '#a67d4e' },
              }}
            >
              Active Claims
            </Button>
            <Button
              onClick={() => {
                setActiveEraTab('voided');
                setVisibleEraCount(4);
              }}
              sx={{
                textTransform: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: activeEraTab === 'voided' ? '#bc9363' : '#dbcaaf',
                borderRadius: '4px',
                px: 2.5,
                py: 0.6,
                '&:hover': { backgroundColor: '#a67d4e' },
              }}
            >
              Voided Claims
            </Button>
          </Box>

          {/* Filter button and Search input */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1, justifyContent: 'flex-end', maxWidth: '600px' }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon sx={{ fontSize: 16 }} />}
              onClick={handleRefresh}
              sx={{
                textTransform: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#1a3a6b',
                borderColor: '#e2e8f0',
                backgroundColor: '#f7fafc',
                py: 0.7,
                px: 2,
                '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#edf2f7' },
              }}
            >
              Filter
            </Button>
            <TextField
              size="small"
              placeholder="Search by Patient, Claim number or Document ID"
              value={searchEraContent}
              onChange={(e) => setSearchEraContent(e.target.value)}
              sx={{
                width: '320px',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff',
                  fontSize: '0.82rem',
                  borderRadius: '4px',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#a0aec0', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      ) : (
        // STANDARD CLAIMS Filtering Panel
        <Paper sx={{ p: 2, mb: 3, backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: 'none', border: '1px solid #e0e6ed', overflowX: 'auto' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            
            {/* Sort dropdown */}
            {(activeTab === 2 || activeTab === 3 || activeTab === 4) && (
              <Box sx={{ minWidth: 140, flex: '1 1 auto' }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>Sort Report by:</Typography>
                <FormControl fullWidth size="small">
                  <Select value={sortReportBy} onChange={(e) => setSortReportBy(e.target.value)} sx={{ backgroundColor: '#fafbfe', borderRadius: '4px', fontSize: '0.85rem' }}>
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value="patient_name">Patient Name</MenuItem>
                    <MenuItem value="claim_number">Claim #</MenuItem>
                    <MenuItem value="sent_date">Sent Date</MenuItem>
                    <MenuItem value="printed_date">Printed Date</MenuItem>
                    <MenuItem value="carrier">Carrier</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Filter by Claim Type */}
            <Box sx={{ minWidth: 140, flex: '1 1 auto' }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>Filter by Claim Type:</Typography>
              <FormControl fullWidth size="small">
                <Select value={claimType} onChange={(e) => setClaimType(e.target.value)} sx={{ backgroundColor: '#fafbfe', borderRadius: '4px', fontSize: '0.85rem' }}>
                  {CLAIM_TYPES.map((t) => (
                    <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Filter by Carrier */}
            <Box sx={{ minWidth: 140, flex: '1 1 auto' }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>Filter by Carrier:</Typography>
              <FormControl fullWidth size="small">
                <Select value={carrier} onChange={(e) => setCarrier(e.target.value)} sx={{ backgroundColor: '#fafbfe', borderRadius: '4px', fontSize: '0.85rem' }}>
                  {CARRIERS.map((c) => (
                    <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Filter by Claim Attachment */}
            <Box sx={{ minWidth: 150, flex: '1 1 auto' }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>Filter by Claim Attachment:</Typography>
              <FormControl fullWidth size="small">
                <Select value={claimAttachment} onChange={(e) => setClaimAttachment(e.target.value)} sx={{ backgroundColor: '#fafbfe', borderRadius: '4px', fontSize: '0.85rem' }}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="with_attachments">With Attachments</MenuItem>
                  <MenuItem value="without_attachments">Without Attachments</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Filter by Claim Status */}
            {(activeTab === 3 || activeTab === 4 || activeTab === 5) && (
              <Box sx={{ minWidth: 140, flex: '1 1 auto' }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>Filter by Claim Status:</Typography>
                <FormControl fullWidth size="small">
                  <Select value={claimStatus} onChange={(e) => setClaimStatus(e.target.value)} sx={{ backgroundColor: '#fafbfe', borderRadius: '4px', fontSize: '0.85rem' }}>
                    {CLAIM_STATUSES.map((s) => (
                      <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Refresh link */}
            <Box sx={{ display: 'flex', alignItems: 'flex-end', pb: 0.5 }}>
              <Button onClick={handleRefresh} startIcon={<RefreshIcon sx={{ fontSize: '0.9rem' }} />} sx={{ textTransform: 'none', fontSize: '0.8rem', fontWeight: 600, color: '#1a3a6b', padding: 0, minWidth: 'auto', '&:hover': { background: 'none', textDecoration: 'underline' } }}>
                Refresh
              </Button>
            </Box>

            {/* Text Searches */}
            <Box sx={{ minWidth: 180, flex: '2 1 auto' }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', display: 'block', mb: 0.5 }}>Search by patient:</Typography>
              <Autocomplete
                freeSolo
                options={[...new Set((claims || []).map(c => c.patientName))].filter(Boolean).sort()}
                inputValue={searchPatient}
                onInputChange={(e, newValue) => setSearchPatient(newValue || '')}
                renderInput={(params) => (
                  <TextField {...params} fullWidth size="small" placeholder="Search by patient" sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff', fontSize: '0.85rem' } }} />
                )}
              />
            </Box>

            <Box sx={{ minWidth: 200, flex: '2 1 auto' }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', display: 'block', mb: 0.5 }}>
                {activeTab === 5 ? 'Search by claim number or sent date:' : 'Search by claim number or sent date:'}
              </Typography>
              <Autocomplete
                freeSolo
                options={[...new Set((claims || []).map(c => c.claimNumber))].filter(Boolean).sort()}
                inputValue={searchClaimOrDate}
                onInputChange={(e, newValue) => setSearchClaimOrDate(newValue || '')}
                renderInput={(params) => (
                  <TextField {...params} fullWidth size="small" placeholder={activeTab === 5 ? 'Search by claim # or sent date' : 'Search by claim # or sent date'} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff', fontSize: '0.85rem' } }} />
                )}
              />
            </Box>

            {/* Checkboxes */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', pb: 0.5 }}>
              {activeTab === 4 ? (
                <>
                  <FormControlLabel control={<Checkbox size="small" checked={showNonAssignment} onChange={(e) => setShowNonAssignment(e.target.checked)} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#1a3a6b' }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#4a5568' }}>Show Non-Assignment Claims</Typography>} />
                  <FormControlLabel control={<Checkbox size="small" checked={showInactivePolicies} onChange={(e) => setShowInactivePolicies(e.target.checked)} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#1a3a6b' }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#4a5568' }}>Show Claims for Inactive Policies</Typography>} />
                </>
              ) : activeTab === 5 ? (
                <FormControlLabel control={<Checkbox size="small" checked={showInactivePolicies} onChange={(e) => setShowInactivePolicies(e.target.checked)} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#1a3a6b' }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#4a5568' }}>Show Predeterminations for Inactive Policies</Typography>} />
              ) : (
                <FormControlLabel control={<Checkbox size="small" checked={showHidden} onChange={(e) => setShowHidden(e.target.checked)} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#1a3a6b' }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#4a5568' }}>Show Hidden Claims</Typography>} />
              )}
            </Box>

            {/* Group Date By Range Filter (Specific to OUTSTANDING CLAIMS) */}
            {activeTab === 4 && (
              <Box sx={{ minWidth: 160, flex: '1 1 auto' }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>Group Date By Range:</Typography>
                <FormControl fullWidth size="small">
                  <Select value={groupDateRange} onChange={(e) => setGroupDateRange(e.target.value)} sx={{ backgroundColor: '#fafbfe', borderRadius: '4px', fontSize: '0.85rem' }}>
                    <MenuItem value="DOS">Claim Date of Service</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Group By Filter (Specific to OUTSTANDING CLAIMS) */}
            {activeTab === 4 && (
              <Box sx={{ minWidth: 140, flex: '1 1 auto' }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}>Group By:</Typography>
                <FormControl fullWidth size="small">
                  <Select value={groupByOption} onChange={(e) => setGroupByOption(e.target.value)} sx={{ backgroundColor: '#fafbfe', borderRadius: '4px', fontSize: '0.85rem' }}>
                    {GROUP_BY_OPTIONS.map((g) => (
                      <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

          </Box>
        </Paper>
      )}
      
      {/* Main Alert Warning & Actions Block */}
      {activeTab !== 6 && activeTab !== 7 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 2,
            mb: 2,
          }}
        >
          {/* Count/Status alignment left */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {activeTab === 0 && validationErrorCount > 0 && (
              <Typography sx={{ color: '#d93838', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <WarningIcon sx={{ fontSize: 16 }} />
                {validationErrorCount} claim/s have an alert. Please fix the validation errors before sending claims.
              </Typography>
            )}
            <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem', fontWeight: 700 }}>
              ({activeTab === 4 ? 61 : activeTab === 3 ? 347 : activeTab === 5 ? 8 : filteredClaims.length} claim/s)
            </Typography>
          </Box>

          {/* Buttons and Clearing House message expand link right */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1.5 }}>
            {(activeTab === 1 || activeTab === 2 || activeTab === 3 || activeTab === 4 || activeTab === 5) && (
              <Button
                onClick={() => setExpandAllMessages(!expandAllMessages)}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#1a3a6b',
                  padding: 0,
                  mb: -0.5,
                  '&:hover': { background: 'none', textDecoration: 'underline' },
                }}
              >
                {expandAllMessages ? 'Collapse all Clearing House Message' : 'Expand all Clearing House Message'}
              </Button>
            )}

            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {activeTab === 0 ? (
                // UNSENT CLAIMS Actions
                <>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleConvertType}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(125, 156, 196, 0.4)', color: '#ffffff' },
                    }}
                  >
                    Convert Type
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleChangeStatus}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(125, 156, 196, 0.4)', color: '#ffffff' },
                    }}
                  >
                    Change Status
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleSendClaims}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#e5c59e',
                      color: '#3d3021',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#d1b089' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(229, 197, 158, 0.4)', color: 'rgba(61, 48, 33, 0.4)' },
                    }}
                  >
                    Send Claims
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handlePrintClaims}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(125, 156, 196, 0.4)', color: '#ffffff' },
                    }}
                  >
                    Print Claims
                  </Button>
                </>
              ) : activeTab === 1 ? (
                // ERRORED Actions
                <>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleChangeStatus}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(125, 156, 196, 0.4)', color: '#ffffff' },
                    }}
                  >
                    Change Status
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleVoidAndRecreate}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#e5c59e',
                      color: '#3d3021',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#d1b089' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(229, 197, 158, 0.4)', color: 'rgba(61, 48, 33, 0.4)' },
                    }}
                  >
                    Void & Recreate Claims
                  </Button>
                </>
              ) : activeTab === 2 ? (
                // REJECTED Actions
                <>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleChangeStatus}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(125, 156, 196, 0.4)', color: '#ffffff' },
                    }}
                  >
                    Change Status
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleVoidAndRecreate}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#e5c59e',
                      color: '#3d3021',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#d1b089' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(229, 197, 158, 0.4)', color: 'rgba(61, 48, 33, 0.4)' },
                    }}
                  >
                    Void & Recreate Claims
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handlePrintPage}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                    }}
                  >
                    Print Page
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleExportCSV}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#e2d3c2',
                      color: '#4e3e31',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#d4c5b4' },
                    }}
                  >
                    Export as CSV
                  </Button>
                </>
              ) : activeTab === 3 ? (
                // HISTORY Actions
                <>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleChangeStatus}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(125, 156, 196, 0.4)', color: '#ffffff' },
                    }}
                  >
                    Change Status
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleVoidAndRecreate}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#e5c59e',
                      color: '#3d3021',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#d1b089' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(229, 197, 158, 0.4)', color: 'rgba(61, 48, 33, 0.4)' },
                    }}
                  >
                    Void & Recreate Claims
                  </Button>
                </>
              ) : activeTab === 4 ? (
                // OUTSTANDING CLAIMS Actions
                <>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleVoidAndRecreate}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#e5c59e',
                      color: '#3d3021',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#d1b089' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(229, 197, 158, 0.4)', color: 'rgba(61, 48, 33, 0.4)' },
                    }}
                  >
                    Void & Recreate Claims
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handlePrintPage}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#1a3a6b',
                      color: '#ffffff',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#132c54' },
                    }}
                  >
                    Print Page
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handlePrintClaims}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(125, 156, 196, 0.4)', color: '#ffffff' },
                    }}
                  >
                    Print Claims
                  </Button>
                </>
              ) : (
                // PREDETERMINATION Actions
                <>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleConvertType}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(125, 156, 196, 0.4)', color: '#ffffff' },
                    }}
                  >
                    Convert Type
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleChangeStatus}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(125, 156, 196, 0.4)', color: '#ffffff' },
                    }}
                  >
                    Change Status
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handleSendPredeterminations}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#e5c59e',
                      color: '#3d3021',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#d1b089' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(229, 197, 158, 0.4)', color: 'rgba(61, 48, 33, 0.4)' },
                    }}
                  >
                    Send Predeterminations
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!hasSelection}
                    onClick={handlePrintPredeterminations}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#7d9cc4',
                      boxShadow: 'none',
                      borderRadius: '4px',
                      px: 2.5,
                      '&:hover': { backgroundColor: '#6281a8' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(125, 156, 196, 0.4)', color: '#ffffff' },
                    }}
                  >
                    Print Predeterminations
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Box>
      )}

    </>
  );
};
