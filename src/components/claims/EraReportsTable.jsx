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


export const EraReportsTable = ({ filteredEraReports }) => {
  return (
            // ERA REPORTS Table Layout (1:1 with Screenshot)
        <TableContainer component={Paper} elevation={0} sx={{ boxShadow: "none", border: "1px solid #e2e8f0", borderRadius: "8px", width: "100%", overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 1600 }}>
            <TableHead sx={{ backgroundColor: "#f8f9fa", "& .MuiTableCell-root": { py: 1, px: 1, fontSize: "0.7rem", fontWeight: 700, borderBottom: "1px solid #e2e8f0", color: "inherit", whiteSpace: "nowrap" } }}>
              <TableRow>
                <TableCell>PATIENT ID</TableCell>
                <TableCell>PATIENT NAME</TableCell>
                <TableCell>CLAIM #</TableCell>
                <TableCell>CARRIER</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell>AMOUNT SUBMITTED</TableCell>
                <TableCell>AMOUNT PAID</TableCell>
                <TableCell>PATIENT RESPONSIBILITY</TableCell>
                <TableCell>WRITE OFF</TableCell>
                <TableCell>DATE RECEIVED</TableCell>
                <TableCell>PAYMENT TYPE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ "& .MuiTableCell-root": { py: 1.5, px: 1, fontSize: "0.75rem", verticalAlign: "middle", borderBottom: "1px solid #e2e8f0", color: "#1e293b", whiteSpace: "nowrap" } }}>
              {filteredEraReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" sx={{ color: '#718096', fontStyle: 'italic' }}>
                      No ERA reports found matching the selection criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEraReports.map((era) => {
                  const isVoided = era.status === 'Voided';
                  const isDenial = era.status === 'Denial';
                  return (
                    <TableRow
                      key={era.id}
                      hover={false}
                    >
                      {/* Patient ID */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 500 }}>
                          {era.patientId}
                        </Typography>
                      </TableCell>

                      {/* Patient Name */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#3b82f6' }}>
                          {era.patientName}
                        </Typography>
                      </TableCell>

                      {/* Claim # */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 600 }}>
                          {era.claimNumber}
                        </Typography>
                      </TableCell>

                      {/* Carrier */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#1e293b' }}>
                          {era.carrier}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography
                          sx={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: isVoided ? '#e53e3e' : isDenial ? '#dd6b20' : '#319795',
                          }}
                        >
                          {era.status}
                        </Typography>
                      </TableCell>

                      {/* Amount Submitted */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 600 }}>
                          ${era.amountSubmitted.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Typography>
                      </TableCell>

                      {/* Amount Paid */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 700 }}>
                          ${era.amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Typography>
                      </TableCell>

                      {/* Patient Responsibility */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#1e293b' }}>
                          ${era.patientResponsibility.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Typography>
                      </TableCell>

                      {/* Write Off */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#718096' }}>
                          ${era.writeOff.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Typography>
                      </TableCell>

                      {/* Date Received */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#1e293b' }}>
                          {era.dateReceived}
                        </Typography>
                      </TableCell>

                      {/* Payment Type */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 500 }}>
                          {era.paymentType}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
  );
};
