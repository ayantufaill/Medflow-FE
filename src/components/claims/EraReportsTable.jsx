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
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e6ed', borderRadius: '6px', overflow: 'auto' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#fafbfe' }}>
              <TableRow>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>PATIENT ID</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>PATIENT NAME</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>CLAIM #</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>CARRIER</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>STATUS</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>AMOUNT SUBMITTED</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>AMOUNT PAID</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>PATIENT RESPONSIBILITY</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>WRITE OFF</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>DATE RECEIVED</TableCell>
                <TableCell sx={{ color: '#1a3a6b', fontWeight: 700, fontSize: '0.78rem', py: 1.5 }}>PAYMENT TYPE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
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
                      hover
                      sx={{
                        '&:hover': { backgroundColor: 'rgba(26, 58, 107, 0.03) !important' },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      {/* Patient ID */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 500 }}>
                          {era.patientId}
                        </Typography>
                      </TableCell>

                      {/* Patient Name */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a3a6b' }}>
                          {era.patientName}
                        </Typography>
                      </TableCell>

                      {/* Claim # */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 600 }}>
                          {era.claimNumber}
                        </Typography>
                      </TableCell>

                      {/* Carrier */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#4a5568' }}>
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
                        <Typography sx={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 600 }}>
                          ${era.amountSubmitted.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Typography>
                      </TableCell>

                      {/* Amount Paid */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#1a3a6b', fontWeight: 700 }}>
                          ${era.amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Typography>
                      </TableCell>

                      {/* Patient Responsibility */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#4a5568' }}>
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
                        <Typography sx={{ fontSize: '0.8rem', color: '#4a5568' }}>
                          {era.dateReceived}
                        </Typography>
                      </TableCell>

                      {/* Payment Type */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 500 }}>
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
