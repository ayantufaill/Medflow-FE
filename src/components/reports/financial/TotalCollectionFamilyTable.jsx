import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const TotalCollectionFamilyTable = ({ families = [] }) => {
  return (
    <Box>
      {families.map((family, idx) => (
        <Box key={idx} sx={{ mb: 5 }}>
          {/* Section Header */}
          <Typography sx={{ color: '#2262ef', fontWeight: 700, fontSize: '0.95rem', mb: 1.5 }}>
            {family.name}
          </Typography>

          {/* Members Table */}
          <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <TableContainer component={Paper} elevation={0} sx={{ overflowX: 'auto', '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}>
              <Table size="small" sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
                    <TableCell>ID</TableCell>
                    <TableCell>Patient</TableCell>
                    <TableCell>Patient Collection</TableCell>
                    <TableCell>Insurance Collection</TableCell>
                    <TableCell>Total Collection</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {family.members.map((member, mIdx) => (
                    <TableRow key={mIdx} sx={{ '& td': { fontSize: '0.75rem', py: 1.5, verticalAlign: 'middle', borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
                      <TableCell>{member.id}</TableCell>
                      <TableCell sx={{ color: '#2262ef', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                        {member.name}
                      </TableCell>
                      <TableCell sx={{ color: (member.patientCollection || '').startsWith('-') ? '#d93025' : '#1e293b' }}>
                        {member.patientCollection}
                      </TableCell>
                      <TableCell>{member.insuranceCollection}</TableCell>
                      <TableCell>{member.totalCollection}</TableCell>
                    </TableRow>
                  ))}
                  {/* Totals Summary Row */}
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell colSpan={2} sx={{ py: 1.5, fontWeight: 700, color: '#334155', borderBottom: 'none' }}>
                      Family Total
                    </TableCell>
                    <TableCell sx={{ py: 1.5, fontWeight: 700, color: (family.patientCollection || '').startsWith('-') ? '#d93025' : '#0f172a', borderBottom: 'none' }}>
                      {family.patientCollection}
                    </TableCell>
                    <TableCell sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                      {family.insuranceCollection}
                    </TableCell>
                    <TableCell sx={{ py: 1.5, fontWeight: 700, color: '#0f172a', borderBottom: 'none' }}>
                      {family.totalCollection}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default TotalCollectionFamilyTable;
