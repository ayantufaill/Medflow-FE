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
        <TableContainer component={Paper} elevation={0} sx={{ boxShadow: "none", border: "1px solid #e2e8f0", borderRadius: "8px", width: "100%", overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 1200 }}>
            <TableHead sx={{ backgroundColor: "#f8f9fa", "& .MuiTableCell-root": { py: 1, px: 1, fontSize: "0.7rem", fontWeight: 700, borderBottom: "1px solid #e2e8f0", color: "inherit", whiteSpace: "nowrap" } }}>
              <TableRow>
                <TableCell >File Name</TableCell>
                <TableCell >Report Date</TableCell>
                <TableCell >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    Date Created
                    <Tooltip title="Date the Dentical report was received and imported into Medflow.">
                      <InfoIcon sx={{ fontSize: 14, color: '#a0aec0', cursor: 'pointer' }} />
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell align="right" >Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ "& .MuiTableCell-root": { py: 1.5, px: 1, fontSize: "0.75rem", verticalAlign: "middle", borderBottom: "1px solid #e2e8f0", color: "#1e293b", whiteSpace: "nowrap" } }}>
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
                    hover={false}
                  >
                    {/* File Name with PDF Icon */}
                    <TableCell sx={{ py: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <PdfIcon sx={{ color: '#e53e3e', fontSize: 20 }} />
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#3b82f6', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => alert(`Opening PDF file: ${report.fileName}`)}>
                          {report.fileName}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Report Date */}
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography sx={{ fontSize: '0.8rem', color: '#1e293b' }}>
                        {report.reportDate}
                      </Typography>
                    </TableCell>

                    {/* Date Created */}
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography sx={{ fontSize: '0.8rem', color: '#1e293b' }}>
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
