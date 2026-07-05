import React from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Tooltip, IconButton, Checkbox, Menu, MenuItem
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
  AttachFile as AttachFileIcon
} from '@mui/icons-material';


export const DenticalReportsTable = ({ filteredDenticalReports }) => {
  return (
            // DENTICAL REPORTS Table Layout
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e6ed', borderRadius: '6px', overflow: 'auto' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#fafbfe' }}>
              <TableRow>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>File Name</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>Report Date</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    Date Created
                    <Tooltip title="Date the Dentical report was received and imported into Medflow.">
                      <InfoIcon sx={{ fontSize: 14, color: '#a0aec0', cursor: 'pointer' }} />
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.8rem', py: 1.5 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDenticalReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" sx={{ color: '#718096', fontStyle: 'italic' }}>
                      No reports found matching the selection criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDenticalReports.map((report) => (
                  <TableRow
                    key={report.id}
                    hover
                    sx={{
                      '&:hover': { backgroundColor: 'rgba(26, 58, 107, 0.03) !important' },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    {/* File Name with PDF Icon */}
                    <TableCell sx={{ py: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <PdfIcon sx={{ color: '#e53e3e', fontSize: 20 }} />
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a3a6b', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => alert(`Opening PDF file: ${report.fileName}`)}>
                          {report.fileName}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Report Date */}
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography sx={{ fontSize: '0.8rem', color: '#4a5568' }}>
                        {report.reportDate}
                      </Typography>
                    </TableCell>

                    {/* Date Created */}
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography sx={{ fontSize: '0.8rem', color: '#4a5568' }}>
                        {report.dateCreated}
                      </Typography>
                    </TableCell>

                    {/* Report Specific Actions */}
                    <TableCell align="right" sx={{ py: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="View Report PDF">
                          <IconButton size="small" onClick={() => alert(`Opening PDF file: ${report.fileName}`)} sx={{ color: '#7d9cc4' }}>
                            <VisibilityIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Print Report">
                          <IconButton size="small" onClick={() => alert('Sending document to printer...')} sx={{ color: '#7d9cc4' }}>
                            <PrintIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download PDF File">
                          <IconButton size="small" onClick={() => alert(`Downloading ${report.fileName}`)} sx={{ color: '#7d9cc4' }}>
                            <DownloadIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
  );
};
