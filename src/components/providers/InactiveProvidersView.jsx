import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import { providerService } from '../../services/provider.service';
import ProviderRowActions from './ProviderRowActions';

const INACTIVE_SECTIONS = [
  {
    key: 'inOffice',
    heading: 'In Office Providers:',
    apiParams: { isActive: false },
    columns: ['provider', 'specialty', 'providerType', 'email', 'mobile', 'taxNumber', 'licenseNumber'],
  },
  {
    key: 'referral',
    heading: 'Referral Providers:',
    apiParams: { isActive: false, providerCategory: 'referral' },
    columns: ['provider', 'specialty', 'email', 'mobile', 'officePhone', 'verified'],
  },
  {
    key: 'careTeam',
    heading: 'Care Team Providers:',
    apiParams: { isActive: false, providerCategory: 'care_team' },
    columns: ['provider', 'specialty', 'email', 'mobile', 'officePhone'],
  },
  {
    key: 'lab',
    heading: 'LabCase Providers:',
    apiParams: { isActive: false, providerCategory: 'lab' },
    columns: ['provider', 'specialty', 'email', 'mobile', 'officePhone', 'verified'],
  },
];

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

const InactiveSectionTable = ({ section, onEdit, onActivate, actionLoading, getCellValue, VerifiedBadge, getProviderName }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const isActive = section.apiParams.isActive;
  const providerCategory = section.apiParams.providerCategory;

  useEffect(() => {
    let cancelled = false;
    providerService
      .getAllProviders(1, 50, '', isActive, '', providerCategory || '')
      .then((result) => { if (!cancelled) { setRows(result.providers || []); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [isActive, providerCategory]);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ mb: 1.5, color: '#1a6b9e', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
      >
        {section.heading}
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}><CircularProgress size={24} /></Box>
        ) : (
          <TableContainer>
            <Table size="small" sx={{ borderCollapse: 'separate' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8F9FB' }}>
                  {section.columns.map((col) => (
                    <TableCell key={col} sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#6B7280', py: 1.5, borderBottom: 'none' }}>
                      {COLUMN_HEADERS[col]}
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#6B7280', py: 1.5, borderBottom: 'none' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={section.columns.length + 1} sx={{ py: 2, color: 'text.secondary', fontSize: '0.82rem', borderBottom: 'none' }} align="center">
                      No inactive providers found
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((provider) => {
                    const id = provider._id || provider.id;
                    return (
                      <TableRow key={id} hover sx={{ '& .MuiTableCell-root': { fontSize: '0.82rem', py: 1.2, color: '#4B5563', borderBottom: '1px solid #F3F4F6' } }}>
                        {section.columns.map((col) => (
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
                        <TableCell align="center">
                          <ProviderRowActions
                            provider={provider}
                            handleToggleActive={onActivate}
                            setEditDialog={onEdit}
                            actionLoading={actionLoading}
                            getProviderName={getProviderName}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

const InactiveProvidersView = ({ onEdit, onActivate, actionLoading, getCellValue, VerifiedBadge, getProviderName }) => (
  <Box>
    {INACTIVE_SECTIONS.map((section) => (
      <InactiveSectionTable
        key={section.key}
        section={section}
        onEdit={onEdit}
        onActivate={onActivate}
        actionLoading={actionLoading}
        getCellValue={getCellValue}
        VerifiedBadge={VerifiedBadge}
        getProviderName={getProviderName}
      />
    ))}
  </Box>
);

export default InactiveProvidersView;
