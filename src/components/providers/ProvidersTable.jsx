import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress
} from '@mui/material';
import { DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import ProviderRowActions from './ProviderRowActions';

// Mapped headers corresponding to the design
const COLUMN_HEADERS = {
  provider: 'PROVIDER',
  specialty: 'SPECIALITY',
  providerType: 'PROVIDER TYPE',
  email: 'EMAIL',
  mobile: 'TELEPHONE NUMBER',
  officePhone: 'TELEPHONE NUMBER',
  taxNumber: 'FEDERAL TAX NUMBER',
  licenseNumber: 'LICENSE NUMBER',
  verified: 'VERIFIED',
};

const ProvidersTable = ({
  loading,
  displayedProviders,
  tabConfig,
  dragEnabled,
  expandedRowId,
  setExpandedRowId,
  getCellValue,
  VerifiedBadge,
  handleToggleActive,
  setEditDialog,
  actionLoading,
  getProviderName,
  ExpandedDetails,
  onDeactivateConfirm,
}) => {
  return (
    <Paper variant="outlined" sx={{ borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
      ) : (
        <TableContainer>
          <Table size="small" sx={{ borderCollapse: 'separate' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F1F6FC', height: '60px' }}>
                {dragEnabled && <TableCell sx={{ width: 40, borderBottom: 'none' }} />}
                {tabConfig.columns.map((col) => (
                  <TableCell key={col} sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#6B7280', py: 1.5, borderBottom: 'none' }}>
                    {(tabConfig.columnOverrides?.[col]?.toUpperCase()) || COLUMN_HEADERS[col]}
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#6B7280', py: 1.5, borderBottom: 'none' }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedProviders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={tabConfig.columns.length + (dragEnabled ? 2 : 1)} align="center" sx={{ py: 4, borderBottom: 'none' }}>
                    <Typography color="text.secondary">No providers found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayedProviders.map((provider) => {
                  const id = provider._id || provider.id;
                  const isExpanded = expandedRowId === id;
                  
                  return (
                    <React.Fragment key={id}>
                      <TableRow
                        hover
                        onClick={() => setExpandedRowId(isExpanded ? null : id)}
                        sx={{
                          cursor: 'pointer',
                          height: '60px',
                          '& .MuiTableCell-root': { fontSize: '13px', py: 0, color: '#4B5563', borderBottom: '1px solid #F3F4F6' },
                          ...(isExpanded && { backgroundColor: '#f0f4fa' }),
                        }}
                      >
                        {dragEnabled && (
                          <TableCell sx={{ cursor: 'grab', color: 'text.disabled' }} onClick={(e) => e.stopPropagation()}>
                            <DragIndicatorIcon fontSize="small" />
                          </TableCell>
                        )}
                        {tabConfig.columns.map((col) => (
                          <TableCell key={col}>
                            {col === 'provider' ? (
                              <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 500 }}>
                                {getCellValue(provider, col)}
                              </Typography>
                            ) : col === 'verified' ? (
                              <VerifiedBadge provider={provider} />
                            ) : (
                              getCellValue(provider, col)
                            )}
                          </TableCell>
                        ))}
                        <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                          <ProviderRowActions
                            provider={provider}
                            handleToggleActive={handleToggleActive}
                            setEditDialog={setEditDialog}
                            actionLoading={actionLoading}
                            getProviderName={getProviderName}
                          />
                        </TableCell>
                      </TableRow>
                      {isExpanded && ExpandedDetails && (
                        <TableRow>
                          <TableCell colSpan={tabConfig.columns.length + (dragEnabled ? 2 : 1)} sx={{ p: 0, borderBottom: 'none' }}>
                            <ExpandedDetails
                              provider={provider}
                              onDeactivate={() => handleToggleActive(provider)}
                              onActivate={() => handleToggleActive(provider)}
                              actionLoading={actionLoading}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default ProvidersTable;
