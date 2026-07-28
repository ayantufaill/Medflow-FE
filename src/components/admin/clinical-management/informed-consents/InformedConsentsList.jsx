import React from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton,
  Paper 
} from '@mui/material';
import {
  CloudDownload as DownloadIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Description as DocIcon
} from '@mui/icons-material';

const InformedConsentsList = ({
  customExpanded,
  setCustomExpanded,
  systemExpanded,
  setSystemExpanded,
  filteredCustom,
  filteredSystem,
  handleDeleteCustom,
  handleDeleteSystem,
  handleViewConsent
}) => {

  const renderTableRows = (items, isSystem) => {
    return items.map((item, idx) => (
      <TableRow 
        key={item.id || idx} 
        sx={{ 
          '&:last-child td, &:last-child th': { border: 0 },
          '&:hover': { backgroundColor: '#f8fafc' },
          transition: 'background-color 0.2s ease',
          borderBottom: '1px solid #f1f5f9'
        }}
      >
        <TableCell sx={{ py: 2, px: 3, width: '35%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ backgroundColor: '#eff6ff', p: 1, borderRadius: 1.5, display: 'flex' }}>
              <DocIcon sx={{ fontSize: '1.2rem', color: '#3b82f6' }} />
            </Box>
            <Typography sx={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
              {item.name}
            </Typography>
          </Box>
        </TableCell>
        <TableCell sx={{ py: 2, px: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {item.procedures && item.procedures.length > 0 ? (
              item.procedures.map((proc, pIdx) => (
                <Box key={pIdx} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 700, minWidth: 45, backgroundColor: '#f0f9ff', px: 1, py: 0.2, borderRadius: 1, display: 'inline-block' }}>
                    {proc.code}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                    {proc.desc}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
                No procedures mapped
              </Typography>
            )}
          </Box>
        </TableCell>
        <TableCell align="right" sx={{ py: 2, px: 3, width: '15%' }}>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <IconButton size="small" sx={{ color: '#64748b', '&:hover': { color: '#3b82f6', backgroundColor: '#eff6ff' } }}>
              <DownloadIcon sx={{ fontSize: '1.1rem' }} />
            </IconButton>
            <IconButton size="small" onClick={() => handleViewConsent(item)} sx={{ color: '#64748b', '&:hover': { color: '#3b82f6', backgroundColor: '#eff6ff' } }}>
              <ViewIcon sx={{ fontSize: '1.1rem' }} />
            </IconButton>
            <IconButton size="small" onClick={() => isSystem ? handleDeleteSystem(idx) : handleDeleteCustom(idx)} sx={{ color: '#ef4444', '&:hover': { color: '#dc2626', backgroundColor: '#fef2f2' } }}>
              <DeleteIcon sx={{ fontSize: '1.1rem' }} />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', px: 3, py: 1.5 }}>Consent Name</TableCell>
            <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', px: 3, py: 1.5 }}>Procedures</TableCell>
            <TableCell sx={{ width: 100, px: 3, py: 1.5 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Custom Informed Consents */}
          <TableRow 
            onClick={() => setCustomExpanded(!customExpanded)} 
            sx={{ backgroundColor: '#f1f5f9', cursor: 'pointer', transition: 'background-color 0.2s', '&:hover': { backgroundColor: '#e2e8f0' } }}
          >
            <TableCell colSpan={3} sx={{ py: 1.5, px: 3, borderBottom: customExpanded && filteredCustom.length > 0 ? '1px solid #e2e8f0' : 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                  Custom Informed Consents <Typography component="span" sx={{ color: '#94a3b8', ml: 1 }}>({filteredCustom.length})</Typography>
                </Typography>
                {customExpanded ? <ExpandLessIcon sx={{ fontSize: '1.2rem', color: '#64748b' }} /> : <ExpandMoreIcon sx={{ fontSize: '1.2rem', color: '#64748b' }} />}
              </Box>
            </TableCell>
          </TableRow>
          {customExpanded && (
            filteredCustom.length > 0 ? renderTableRows(filteredCustom, false) : (
              <TableRow>
                <TableCell colSpan={3} sx={{ py: 4, textAlign: 'center' }}>
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>No custom consents found.</Typography>
                </TableCell>
              </TableRow>
            )
          )}

          {/* System Default Informed Consents */}
          <TableRow 
            onClick={() => setSystemExpanded(!systemExpanded)} 
            sx={{ backgroundColor: '#f1f5f9', cursor: 'pointer', transition: 'background-color 0.2s', '&:hover': { backgroundColor: '#e2e8f0' }, borderTop: customExpanded && filteredCustom.length > 0 ? '1px solid #e2e8f0' : 'none' }}
          >
            <TableCell colSpan={3} sx={{ py: 1.5, px: 3, borderBottom: systemExpanded && filteredSystem.length > 0 ? '1px solid #e2e8f0' : 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                  System Default Informed Consents <Typography component="span" sx={{ color: '#94a3b8', ml: 1 }}>({filteredSystem.length})</Typography>
                </Typography>
                {systemExpanded ? <ExpandLessIcon sx={{ fontSize: '1.2rem', color: '#64748b' }} /> : <ExpandMoreIcon sx={{ fontSize: '1.2rem', color: '#64748b' }} />}
              </Box>
            </TableCell>
          </TableRow>
          {systemExpanded && (
            filteredSystem.length > 0 ? renderTableRows(filteredSystem, true) : (
              <TableRow>
                <TableCell colSpan={3} sx={{ py: 4, textAlign: 'center' }}>
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>No system defaults found.</Typography>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InformedConsentsList;
