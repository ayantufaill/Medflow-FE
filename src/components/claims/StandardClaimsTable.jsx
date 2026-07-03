import React from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Tooltip, IconButton, Checkbox, Menu, MenuItem, Collapse, Button, FormControl, Select
} from '@mui/material';
import {
  Info as InfoIcon,
  Download as DownloadIcon,
  CloudUpload as CloudUploadIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Description as DescriptionIcon,
  ArrowRight as ArrowRightIcon,
  ArrowDropDown as ArrowDropDownIcon,
  DeleteOutline as DeleteOutlineIcon,
  Delete as DeleteIcon,
  AttachFile as AttachFileIcon
,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Autorenew as AutorenewIcon,
  Sync as SyncIcon
} from '@mui/icons-material';


export const StandardClaimsTable = ({
  activeTab,
  filteredClaims,
  selectedClaims,
  handleSelectAll,
  handleSelectAllMenuOpen,
  isSelectAllMenuOpen,
  handleSelectAllMenuClose,
  handleSelectSubset,
  selectAllAnchorEl,
  handleSelectClaim,
  handleLoadMoreClaims,
  toggleProcedures,
  expandedProcedures,
  handleRowStatusChange,
  handleRevalidate,
  expandAllMessages,
  handleNoteOpen,
  handleOpenEdit,
  handleOpenAttach,
  handleOpenPreview,
  handleDeletePredetermination
}) => {
  return (
            // STANDARD CLAIMS Data Table
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e6ed', borderRadius: '6px', overflow: 'hidden' }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#fafbfe', '& .MuiTableCell-root': { py: 0.8, px: 0.5, fontSize: '0.73rem', lineHeight: 1.2 } }}>
              <TableRow>
                <TableCell sx={{ width: '40px', py: 0.8, px: 0.5, textAlign: 'center', verticalAlign: 'top' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
                    <Checkbox
                      size="small"
                      checked={filteredClaims.length > 0 && filteredClaims.every((c) => selectedClaims[c.id])}
                      indeterminate={
                        filteredClaims.some((c) => selectedClaims[c.id]) &&
                        !filteredClaims.every((c) => selectedClaims[c.id])
                      }
                      onChange={handleSelectAll}
                      sx={{ p: 0, color: '#cbd5e1', '&.Mui-checked': { color: '#1a3a6b' } }}
                    />
                    <IconButton
                      size="small"
                      onClick={handleSelectAllMenuOpen}
                      sx={{ p: 0.2, color: '#4a5568', mt: 0.2 }}
                    >
                      <ArrowDropDownIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                  <Menu
                    anchorEl={selectAllAnchorEl}
                    open={isSelectAllMenuOpen}
                    onClose={handleSelectAllMenuClose}
                    sx={{
                      '& .MuiPaper-root': {
                        boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
                        border: '1px solid #e2e8f0',
                      }
                    }}
                  >
                    <MenuItem onClick={() => handleSelectSubset('all')} sx={{ fontSize: '0.8rem', py: 0.8, px: 2 }}>
                      Select All
                    </MenuItem>
                    <MenuItem onClick={() => handleSelectSubset('ready')} sx={{ fontSize: '0.8rem', py: 0.8, px: 2 }}>
                      Select All Ready
                    </MenuItem>
                    <MenuItem onClick={() => handleSelectSubset('errored')} sx={{ fontSize: '0.8rem', py: 0.8, px: 2 }}>
                      Select All with Alerts/Errors
                    </MenuItem>
                    <MenuItem onClick={() => handleSelectSubset('none')} sx={{ fontSize: '0.8rem', py: 0.8, px: 2 }}>
                      Clear Selection
                    </MenuItem>
                  </Menu>
                </TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>Patient Name</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>
                  {activeTab === 4 ? 'Claim # (created date)' : 'Claim #'}
                </TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>Claim Type</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>
                  {activeTab === 0 ? 'Created Date' : 'Sent on'}
                </TableCell>
                {(activeTab === 2 || activeTab === 3 || activeTab === 4) && (
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>
                    Printed on
                  </TableCell>
                )}
                {activeTab === 4 && (
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>
                    Subscriber
                  </TableCell>
                )}
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>Carrier</TableCell>
                {activeTab === 4 && (
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>
                    Plan Name (#)
                  </TableCell>
                )}
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>Procedures</TableCell>
                {activeTab === 5 && (
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>Treating Provider</TableCell>
                )}
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>Status</TableCell>
                {activeTab === 0 && (
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, pl: 3 }}>Alerts</TableCell>
                )}
                {(activeTab === 2 || activeTab === 3 || activeTab === 4) && (
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>
                    ERA Status
                  </TableCell>
                )}
                {(activeTab === 1 || activeTab === 2 || activeTab === 3 || activeTab === 4 || activeTab === 5) && (
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>
                    Clearing House Status Message
                  </TableCell>
                )}
                {activeTab === 4 && (
                  <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>
                    Submitted Value
                  </TableCell>
                )}
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>Notes</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700 }}>Description</TableCell>
                <TableCell align="right" sx={{ color: '#1a3a6b', fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ '& .MuiTableCell-root': { py: 0.5, px: 0.4, fontSize: '0.73rem', lineHeight: 1.2 } }}>
              {filteredClaims.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={activeTab === 4 ? 17 : activeTab === 5 ? 13 : activeTab === 2 || activeTab === 3 ? 14 : activeTab === 1 ? 12 : activeTab === 0 ? 12 : 11}
                    align="center"
                    sx={{ py: 6 }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" sx={{ color: '#718096', fontStyle: 'italic' }}>
                        No claims found matching the selection criteria.
                      </Typography>
                      {activeTab === 2 && (
                        <Button
                          onClick={handleLoadMoreClaims}
                          startIcon={<SyncIcon sx={{ fontSize: '0.9rem' }} />}
                          sx={{
                            textTransform: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#1a3a6b',
                            borderBottom: '1px dashed #1a3a6b',
                            borderRadius: 0,
                            padding: '2px 4px',
                            minWidth: 'auto',
                            '&:hover': { background: 'none', opacity: 0.8 },
                          }}
                        >
                          Load More Claims
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredClaims.map((claim) => {
                  const isSelected = !!selectedClaims[claim.id];
                  const isExpanded = !!expandedProcedures[claim.id];
                  const isError = claim.status === 'denied' || claim.status === 'rejected' || claim.status === 'validationError';

                  // Determine attachment color badge background/icon styling
                  let attachIconColor = '#3182ce'; // Default Blue (not attached anything)
                  
                  const isSent = claim.status !== 'unsent' && claim.status !== 'readyForSubmission';
                  const hasAttachment = claim.attachmentColor === 'green' || claim.attachmentColor === 'red' || claim.redAttachment || claim.hasAttachment;

                  if (claim.attachmentColor === 'red' || claim.redAttachment) {
                    attachIconColor = '#e53e3e'; // Red: error with attachment
                  } else if (hasAttachment && !isSent) {
                    attachIconColor = '#d69e2e'; // Yellow: attached something but did not send
                  } else if (hasAttachment && isSent) {
                    attachIconColor = '#2f855a'; // Green: attached and sent
                  }

                  return (
                    <React.Fragment key={claim.id}>
                      <TableRow
                        hover
                        sx={{
                          backgroundColor: isSelected ? 'rgba(26, 58, 107, 0.03)' : 'transparent',
                          '&:hover': { backgroundColor: 'rgba(26, 58, 107, 0.05) !important' },
                          transition: 'background-color 0.2s',
                        }}
                      >
                        {/* Checkbox column */}
                        <TableCell sx={{ py: 1, verticalAlign: 'top', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
                            <Checkbox
                              size="small"
                              checked={isSelected}
                              onChange={() => handleSelectClaim(claim.id)}
                              sx={{ p: 0, color: '#cbd5e1', '&.Mui-checked': { color: '#1a3a6b' } }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => toggleProcedures(claim.id)}
                              sx={{ p: 0.2, color: '#4a5568', mt: 0.2 }}
                            >
                              {isExpanded ? (
                                <ArrowDropDownIcon sx={{ fontSize: 16, transform: 'rotate(180deg)' }} />
                              ) : (
                                <ArrowDropDownIcon sx={{ fontSize: 16 }} />
                              )}
                            </IconButton>
                          </Box>
                        </TableCell>

                        {/* Patient Name (+ Code & DOB) */}
                        <TableCell>
                          <Typography sx={{ fontWeight: 600, color: isError && activeTab === 0 ? '#d93838' : '#2d3748', fontSize: '0.74rem' }}>
                            {claim.patientName}
                          </Typography>
                          <Typography sx={{ color: '#718096', fontWeight: 400, fontSize: '0.68rem' }}>
                            {claim.patientCode}
                          </Typography>
                          {(activeTab === 4 || activeTab === 5) && claim.patientDob && (
                            <Typography sx={{ color: '#718096', mt: 0.2, fontSize: '0.68rem' }}>
                              {claim.patientDob}
                            </Typography>
                          )}
                        </TableCell>

                        {/* Claim # (+ Created Date) */}
                        <TableCell>
                          <Typography sx={{ fontWeight: 600, color: isError && activeTab === 0 ? '#d93838' : '#4a5568', fontSize: '0.72rem' }}>
                            {claim.claimNumber}
                          </Typography>
                          {activeTab === 4 && claim.createdDate && (
                            <Typography sx={{ color: '#718096', fontStyle: 'normal', fontSize: '0.68rem' }}>
                              ({claim.createdDate})
                            </Typography>
                          )}
                        </TableCell>

                        {/* Claim Type */}
                        <TableCell>
                          <Typography sx={{ color: isError && activeTab === 0 ? '#d93838' : '#718096', display: 'flex', flexDirection: 'column', fontSize: '0.7rem' }}>
                            <span style={{ fontWeight: 600 }}>{claim.claimType.split(' ')[0]}</span>
                            <span>{claim.claimType.split(' ').slice(1).join(' ')}</span>
                          </Typography>
                        </TableCell>

                        {/* Created Date / Sent Date */}
                        <TableCell>
                          <Typography sx={{ color: isError && activeTab === 0 ? '#d93838' : '#4a5568' }}>
                            {activeTab === 0 ? claim.createdDate : claim.sentDate}
                          </Typography>
                        </TableCell>

                        {/* Printed on Date */}
                        {(activeTab === 2 || activeTab === 3 || activeTab === 4) && (
                          <TableCell>
                            <Typography sx={{ color: '#4a5568' }}>
                              {claim.printedDate || '—'}
                            </Typography>
                          </TableCell>
                        )}

                        {/* Subscriber */}
                        {activeTab === 4 && (
                          <TableCell>
                            <Typography sx={{ color: '#4a5568', fontWeight: 500 }}>
                              {claim.subscriber || '—'}
                            </Typography>
                          </TableCell>
                        )}

                        {/* Carrier */}
                        <TableCell>
                          <Typography sx={{ color: isError && activeTab === 0 ? '#d93838' : '#4a5568', fontWeight: 500, fontSize: '0.72rem' }}>
                            {claim.carrier}
                          </Typography>
                        </TableCell>

                        {/* Plan Name (#) */}
                        {activeTab === 4 && (
                          <TableCell>
                            <Typography sx={{ color: '#4a5568', fontStyle: 'normal', fontSize: '0.7rem' }}>
                              {claim.planName || '—'}
                            </Typography>
                          </TableCell>
                        )}

                        {/* Procedures */}
                        <TableCell>
                          <Button
                            size="small"
                            onClick={() => toggleProcedures(claim.id)}
                            endIcon={isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            sx={{
                              textTransform: 'none',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              color: '#1a3a6b',
                              padding: '1px 6px',
                              minWidth: 'auto',
                              '& .MuiButton-endIcon': { ml: 0.5, '& > *:first-of-type': { fontSize: '1rem' } },
                              '&:hover': { backgroundColor: 'rgba(26, 58, 107, 0.08)' },
                            }}
                          >
                            {isExpanded ? 'Hide' : 'Show'}
                          </Button>
                        </TableCell>

                        {/* Treating Provider */}
                        {activeTab === 5 && (
                          <TableCell>
                            <Typography sx={{ color: '#4a5568', fontWeight: 500 }}>
                              {claim.treatingProvider || '—'}
                            </Typography>
                          </TableCell>
                        )}

                        {/* Status Dropdown */}
                        <TableCell>
                          {activeTab === 1 || activeTab === 2 || activeTab === 3 || activeTab === 4 || activeTab === 5 ? (
                            // Interactive Dropdown
                            <FormControl size="small" variant="standard" sx={{ m: 0, minWidth: 75 }}>
                              <Select
                                value={claim.status}
                                onChange={(e) => handleRowStatusChange(claim.id, e.target.value)}
                                disableUnderline
                                sx={{
                                  fontSize: '0.72rem',
                                  fontWeight: 500,
                                  color: claim.status === 'denied' || claim.status === 'rejected' ? '#d93838' : '#2d3748',
                                  '& .MuiSelect-select': { py: 0.5, pr: 2 },
                                }}
                              >
                                <MenuItem value="draft" sx={{ fontSize: '0.7rem' }}>Draft</MenuItem>
                                <MenuItem value="submitted" sx={{ fontSize: '0.7rem' }}>Submitted</MenuItem>
                                <MenuItem value="pending" sx={{ fontSize: '0.7rem' }}>Pending</MenuItem>
                                <MenuItem value="accepted" sx={{ fontSize: '0.7rem' }}>Accepted</MenuItem>
                                <MenuItem value="paid" sx={{ fontSize: '0.7rem' }}>Paid</MenuItem>
                                <MenuItem value="partial" sx={{ fontSize: '0.7rem' }}>Partial</MenuItem>
                                <MenuItem value="denied" sx={{ fontSize: '0.7rem', color: '#d93838' }}>Denied</MenuItem>
                                <MenuItem value="rejected" sx={{ fontSize: '0.7rem', color: '#d93838' }}>Rejected</MenuItem>
                                <MenuItem value="cancelled" sx={{ fontSize: '0.7rem' }}>Cancelled</MenuItem>
                              </Select>
                            </FormControl>
                          ) : (
                            // Standard Status in UNSENT tab
                            isError ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography sx={{ fontWeight: 600, color: '#d93838', fontSize: '0.72rem' }}>
                                  {claim.status}
                                </Typography>
                                <Tooltip title="Click to Revalidate / Resolve errors">
                                  <IconButton size="small" onClick={() => handleRevalidate(claim.id)} sx={{ p: 0.2, color: '#1a3a6b' }}>
                                    <SyncIcon sx={{ fontSize: 12 }} />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            ) : (
                              <Typography sx={{ fontWeight: 500, color: '#2d3748', fontSize: '0.72rem' }}>
                                {claim.status}
                              </Typography>
                            )
                          )}
                        </TableCell>

                        {/* Alerts Column right next to Status */}
                        {activeTab === 0 && (
                          <TableCell sx={{ pl: 3 }}>
                            {claim.status === 'validationError' && (
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-start' }}>
                                <Button
                                  size="small"
                                  sx={{
                                    backgroundColor: '#b92b2b',
                                    color: '#ffffff',
                                    fontSize: '0.65rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    minWidth: 'auto',
                                    py: 0.2,
                                    px: 0.8,
                                    borderRadius: '4px',
                                    lineHeight: 1.2,
                                    '&:hover': { backgroundColor: '#9a2424' }
                                  }}
                                >
                                  Show Invalid info
                                </Button>
                                <Typography
                                  sx={{
                                    color: '#3182ce',
                                    fontSize: '0.7rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    '&:hover': { textDecoration: 'underline' }
                                  }}
                                >
                                  Revalidate
                                </Typography>
                              </Box>
                            )}
                          </TableCell>
                        )}

                        {/* ERA Status */}
                        {(activeTab === 2 || activeTab === 3 || activeTab === 4) && (
                          <TableCell>
                            <Typography sx={{ color: claim.eraStatus ? '#d93838' : '#718096', fontWeight: 600, fontSize: '0.72rem' }}>
                              {claim.eraStatus || '—'}
                            </Typography>
                          </TableCell>
                        )}

                        {/* Clearing House Status Message */}
                        {(activeTab === 1 || activeTab === 2 || activeTab === 3 || activeTab === 4 || activeTab === 5) && (
                          <TableCell sx={{ maxWidth: '120px', verticalAlign: 'top' }}>
                            <Typography
                              noWrap={!isExpanded && !expandAllMessages}
                              sx={{
                                color: '#2d3748',
                                fontWeight: 500,
                                whiteSpace: (isExpanded || expandAllMessages) ? 'normal' : 'nowrap',
                                wordBreak: 'break-word',
                              }}
                            >
                              {claim.clearingHouseMessage || '—'}
                            </Typography>
                          </TableCell>
                        )}

                        {/* Submitted Value */}
                        {activeTab === 4 && (
                          <TableCell sx={{ verticalAlign: 'top' }}>
                            <Typography sx={{ color: '#1a3a6b', fontWeight: 700 }}>
                              ${(claim.submittedValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                          </TableCell>
                        )}

                        {/* Notes icon */}
                        <TableCell sx={{ verticalAlign: 'top' }}>
                          <IconButton
                            size="small"
                            onClick={(e) => handleNoteOpen(e, claim.notes)}
                            sx={{ color: '#a0aec0', '&:hover': { color: '#1a3a6b' }, p: 0.2 }}
                          >
                            <DescriptionIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </TableCell>

                        {/* Description */}
                        <TableCell sx={{ maxWidth: isExpanded ? '400px' : '110px', verticalAlign: 'top' }}>
                          {isExpanded ? (
                            (() => {
                              let shortDesc = claim.description || '';
                              let longDesc = '';
                              if (claim.description.includes(' CC ')) {
                                const idx = claim.description.indexOf(' CC ');
                                shortDesc = claim.description.substring(0, idx);
                                longDesc = claim.description.substring(idx + 1);
                              } else if (claim.description.includes(' (KS6 ')) {
                                const idx = claim.description.indexOf(' (KS6 ');
                                shortDesc = claim.description.substring(0, idx);
                                longDesc = claim.description.substring(idx + 1);
                              }
                              
                              return (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'stretch' }}>
                                  <Typography
                                    sx={{
                                      color: '#4a5568',
                                      fontStyle: 'italic',
                                      fontSize: '0.72rem',
                                    }}
                                  >
                                    {shortDesc}
                                  </Typography>
                                  {longDesc && (
                                    <Typography
                                      sx={{
                                        color: '#2d3748',
                                        whiteSpace: 'normal',
                                        wordBreak: 'break-word',
                                        lineHeight: 1.3,
                                        backgroundColor: '#f8fafc',
                                        p: 1,
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '4px',
                                        fontSize: '0.72rem',
                                      }}
                                    >
                                      {longDesc}
                                    </Typography>
                                  )}
                                </Box>
                              );
                            })()
                          ) : (
                            <Tooltip title={claim.description || ''} arrow disableInteractive>
                              <Typography
                                noWrap
                                sx={{
                                  color: '#4a5568',
                                  fontStyle: 'italic',
                                  cursor: 'pointer',
                                }}
                              >
                                {(() => {
                                  if (claim.description.includes(' CC ')) {
                                    return claim.description.split(' CC ')[0];
                                  } else if (claim.description.includes(' (KS6 ')) {
                                    return claim.description.split(' (KS6 ')[0];
                                  }
                                  return claim.description || '—';
                                })()}
                              </Typography>
                            </Tooltip>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.2 }}>
                            {activeTab === 5 ? (
                              <>
                                <Tooltip title="Edit Predetermination">
                                  <IconButton size="small" onClick={() => handleOpenEdit(claim)} sx={{ color: '#7d9cc4', p: 0.2 }}>
                                    <EditIcon sx={{ fontSize: 14 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Manage Attachments">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenAttach(claim)}
                                    sx={{
                                      color: attachIconColor,
                                      transition: 'color 0.2s',
                                      p: 0.2,
                                    }}
                                  >
                                    <AttachFileIcon sx={{ fontSize: 14 }} />
                                  </IconButton>
                                </Tooltip>
                                {claim.showEye ? (
                                  <Tooltip title="Preview ADA Form">
                                    <IconButton size="small" onClick={() => handleOpenPreview(claim)} sx={{ color: '#7d9cc4', p: 0.2 }}>
                                      <VisibilityIcon sx={{ fontSize: 14 }} />
                                    </IconButton>
                                  </Tooltip>
                                ) : (
                                  <Tooltip title="Delete Predetermination">
                                    <IconButton size="small" onClick={() => handleDeletePredetermination(claim.id)} sx={{ color: '#e53e3e', p: 0.2 }}>
                                      <DeleteIcon sx={{ fontSize: 14 }} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </>
                            ) : (
                              <>
                                <Tooltip title="Edit Claim">
                                  <IconButton size="small" onClick={() => handleOpenEdit(claim)} sx={{ color: '#7d9cc4', p: 0.2 }}>
                                    <EditIcon sx={{ fontSize: 14 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Manage Attachments">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenAttach(claim)}
                                    sx={{
                                      color: attachIconColor,
                                      transition: 'color 0.2s',
                                      p: 0.2,
                                    }}
                                  >
                                    <AttachFileIcon sx={{ fontSize: 14 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Preview Claim Form">
                                  <IconButton size="small" onClick={() => handleOpenPreview(claim)} sx={{ color: '#7d9cc4', p: 0.2 }}>
                                    <VisibilityIcon sx={{ fontSize: 14 }} />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>

                      {/* Expandable Procedure list detail */}
                      <TableRow>
                        <TableCell
                          colSpan={activeTab === 4 ? 17 : activeTab === 5 ? 13 : activeTab === 2 || activeTab === 3 ? 14 : activeTab === 1 ? 12 : 11}
                          sx={{ p: 0, border: 'none' }}
                        >
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 2.5, backgroundColor: '#fcfdfd', borderLeft: '3px solid #1a3a6b', borderBottom: '1px solid #e0e6ed' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a3a6b', mb: 1 }}>
                                Linked Procedures:
                              </Typography>
                              <Table size="small" sx={{ maxWidth: '600px', mb: 1 }}>
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', py: 0.5 }}>Code</TableCell>
                                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', py: 0.5 }}>Description</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem', py: 0.5 }}>Fee</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {claim.procedures.map((proc, index) => (
                                    <TableRow key={index}>
                                      <TableCell sx={{ fontSize: '0.75rem', py: 0.5 }}>{proc.code}</TableCell>
                                      <TableCell sx={{ fontSize: '0.75rem', py: 0.5 }}>{proc.name}</TableCell>
                                      <TableCell align="right" sx={{ fontSize: '0.75rem', py: 0.5 }}>${proc.fee.toFixed(2)}</TableCell>
                                    </TableRow>
                                  ))}
                                  <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.01)' }}>
                                    <TableCell colSpan={2} sx={{ fontWeight: 700, fontSize: '0.75rem', py: 0.5 }}>Total Charge:</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', py: 0.5 }}>
                                      ${claim.procedures.reduce((acc, curr) => acc + curr.fee, 0).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
  );
};
