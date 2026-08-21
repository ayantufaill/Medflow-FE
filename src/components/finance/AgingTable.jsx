import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import apiClient from '../../config/api';

const commonCellSx = { 
  py: 0, 
  px: '12px', 
  borderBottom: '1px solid #DFE5EC !important', 
  fontSize: '12px',
  whiteSpace: 'nowrap'
};

const blueCellSx = {
  ...commonCellSx,
  bgcolor: '#2362EF',
  color: '#FFFFFF',
  borderBottom: '1px solid #FFFFFF !important'
};

const totalCellSx = {
  ...commonCellSx,
  bgcolor: '#E5F8F7', 
  color: '#00BBAB',
  fontWeight: 'bold',
  borderBottom: '1px solid #DFE5EC !important',
  borderLeft: '1px solid #DFE5EC',
};

const headerSx = {
  ...commonCellSx,
  bgcolor: '#F8FAFC',
  color: '#6B778C',
  fontWeight: 600,
  fontSize: '11px',
  textTransform: 'uppercase',
  borderBottom: '1px solid #DFE5EC !important'
};

const formatCurrency = (val) => `$${Number(val || 0).toFixed(2)}`;

const AgingTable = ({ view = 'invoices', patientId, patient }) => {
  const defaultBuckets = { '0_30': 0, '31_60': 0, '61_90': 0, '90_plus': 0, total: 0 };
  const [agingData, setAgingData] = useState({
    familyOutstanding: { ...defaultBuckets },
    familyBalance: { ...defaultBuckets },
    insuranceBalance: { ...defaultBuckets },
    patientAccountCredit: 0,
    insuranceAccountCredit: 0,
  });

  const patientCredit = agingData?.patientAccountCredit || 0;
  const insuranceCredit = agingData?.insuranceAccountCredit || 0;

  const fetchAgingData = async () => {
    if (!patientId) return;
    try {
      const response = await apiClient.get(`/finance-dashboard/aging/${patientId}`);
      if (response.data?.success && response.data?.data) {
        const data = response.data.data;
        // Check if data is nested (new backend) or flat (old backend)
        if (data.familyOutstanding) {
          setAgingData(data);
        } else {
          // Fallback to old flat structure to prevent breaking while backend updates
          setAgingData({
            familyOutstanding: data,
            familyBalance: data,
            insuranceBalance: { ...defaultBuckets }
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch aging data', error);
    }
  };

  useEffect(() => {
    fetchAgingData();
    window.addEventListener('add-ledger-item', fetchAgingData);
    return () => window.removeEventListener('add-ledger-item', fetchAgingData);
  }, [patientId]);

  return (
    <Box sx={{ flex: 1, minHeight: '254px', height: '100%', position: 'relative' }}>
      <TableContainer sx={{ 
        borderRadius: '22px', 
        border: '1px solid #DFE5EC', 
        bgcolor: '#FFFFFF',
        height: '100%'
      }}>
        <Table sx={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }} size="small">
          <TableHead>
            <TableRow sx={{ height: '32px' }}>
              <TableCell sx={{ ...headerSx, width: '234px', minWidth: '234px', maxWidth: '234px', p: 0 }}></TableCell>
              <TableCell align="right" sx={headerSx}>AGING 0-30</TableCell>
              <TableCell align="right" sx={headerSx}>31-60</TableCell>
              <TableCell align="right" sx={headerSx}>61-90</TableCell>
              <TableCell align="right" sx={headerSx}>&gt;90</TableCell>
              <TableCell align="right" sx={{ ...headerSx, bgcolor: '#00BBAB', color: '#FFF', width: '80px', minWidth: '80px', maxWidth: '80px', p: 0, textAlign: 'center' }}>TOTAL</TableCell>
              <TableCell sx={{ ...headerSx, width: '40px', borderLeft: '1px solid #DFE5EC' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* White Rows */}
            <TableRow sx={{ height: '37px' }}>
              <TableCell align="right" sx={{ ...commonCellSx, color: '#6B778C' }}>Family Outstanding Bills</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.familyOutstanding['0_30'])}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.familyOutstanding['31_60'])}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.familyOutstanding['61_90'])}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.familyOutstanding['90_plus'])}</TableCell>
              <TableCell align="center" sx={{...totalCellSx, color: '#00BBAB'}}>{formatCurrency(agingData.familyOutstanding.total)}</TableCell>
              <TableCell sx={{ ...commonCellSx, borderLeft: '1px solid #DFE5EC' }}></TableCell>
            </TableRow>
            <TableRow sx={{ height: '37px' }}>
              <TableCell align="right" sx={{ ...commonCellSx, color: '#6B778C' }}>Family Balance</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.familyBalance['0_30'])}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.familyBalance['31_60'])}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.familyBalance['61_90'])}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.familyBalance['90_plus'])}</TableCell>
              <TableCell align="center" sx={{...totalCellSx, color: '#00BBAB'}}>{formatCurrency(agingData.familyBalance.total)}</TableCell>
              <TableCell sx={{ ...commonCellSx, borderLeft: '1px solid #DFE5EC' }}></TableCell>
            </TableRow>
            <TableRow sx={{ height: '37px' }}>
              <TableCell align="right" sx={{ ...commonCellSx, color: '#6B778C' }}>Insurance Balance</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.insuranceBalance['0_30'])}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.insuranceBalance['31_60'])}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.insuranceBalance['61_90'])}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.insuranceBalance['90_plus'])}</TableCell>
              <TableCell align="center" sx={{ ...totalCellSx, color: '#00BBAB' }}>{formatCurrency(agingData.insuranceBalance.total)}</TableCell>
              <TableCell sx={{ ...commonCellSx, borderLeft: '1px solid #DFE5EC' }}></TableCell>
            </TableRow>

            {/* Blue Rows */}
            <TableRow sx={{ height: '37px' }}>
              <TableCell align="right" sx={{ ...blueCellSx, fontWeight: 500 }}>Outstanding Bills</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.familyOutstanding['0_30'])}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.familyOutstanding['31_60'])}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.familyOutstanding['61_90'])}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.familyOutstanding['90_plus'])}</TableCell>
              <TableCell align="center" sx={{ ...totalCellSx, bgcolor: '#E5F8F7' }}>{formatCurrency(agingData.familyOutstanding.total)}</TableCell>
              <TableCell align="center" sx={{ ...commonCellSx, borderLeft: '1px solid #DFE5EC', color: '#6B778C', cursor: 'pointer', fontSize: '10px' }}>&gt;</TableCell>
            </TableRow>
            <TableRow sx={{ height: '37px' }}>
              <TableCell align="right" sx={{ ...blueCellSx, fontWeight: 500 }}>Balance</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.familyBalance['0_30'])}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.familyBalance['31_60'])}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.familyBalance['61_90'])}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.familyBalance['90_plus'])}</TableCell>
              <TableCell align="center" sx={{ ...totalCellSx, bgcolor: '#E5F8F7' }}>{formatCurrency(agingData.familyBalance.total)}</TableCell>
              <TableCell align="center" sx={{ ...commonCellSx, borderLeft: '1px solid #DFE5EC', color: '#2362EF', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }}>RESET</TableCell>
            </TableRow>
            <TableRow sx={{ height: '37px' }}>
              <TableCell align="right" sx={{ ...blueCellSx, fontWeight: 500 }}>Insurance Balance</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.insuranceBalance['0_30'])}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.insuranceBalance['31_60'])}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.insuranceBalance['61_90'])}</TableCell>
              <TableCell align="right" sx={commonCellSx}>{formatCurrency(agingData.insuranceBalance['90_plus'])}</TableCell>
              <TableCell align="center" sx={{ ...totalCellSx, bgcolor: '#E5F8F7' }}>{formatCurrency(agingData.insuranceBalance.total)}</TableCell>
              <TableCell align="center" sx={{ ...commonCellSx, borderLeft: '1px solid #DFE5EC', color: '#6B778C', cursor: 'pointer', fontSize: '10px' }}>&lt;</TableCell>
            </TableRow>
            {view === 'invoices' && (
              <TableRow>
                <TableCell 
                  colSpan={7} 
                  sx={{ 
                    p: 0, 
                    borderBottom: 'none'
                  }}
                >
                  <Box 
                    sx={{ 
                      bgcolor: '#315ea8', 
                      color: '#ffffff', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      px: 2, 
                      py: 0.5, 
                      fontSize: '11px', 
                      fontWeight: 'bold',
                    }}
                  >
                    <Box>
                      Insurance Account Credit: {formatCurrency(insuranceCredit)} <span style={{ fontWeight: 'normal', cursor: 'pointer' }}>(details)</span>
                    </Box>
                    <Box>
                      Patient Account Credit: {formatCurrency(patientCredit)}
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AgingTable;
