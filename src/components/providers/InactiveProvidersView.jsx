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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '16px', lineHeight: '24px', color: '#111827' }}>
          {section.heading.replace(':', '')}
        </Typography>
        {!loading && (
          <Box sx={{
            ml: 1.5,
            px: 1.2,
            py: 0.2,
            bgcolor: '#F3F4F6',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#6B7280',
            border: '1px solid #E5E7EB',
            fontFamily: 'Inter'
          }}>
            {rows.length}
          </Box>
        )}
      </Box>
      <Paper variant="outlined" sx={{ borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}><CircularProgress sx={{ color: '#2262EF' }} /></Box>
        ) : (
          <TableContainer>
            <Table size="small" sx={{ borderCollapse: 'separate' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F1F6FC', height: '60px' }}>
                  {section.columns.map((col) => (
                    <TableCell key={col} sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#6B7280', py: 1.5, borderBottom: 'none', fontFamily: 'Inter' }}>
                      {COLUMN_HEADERS[col]}
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#6B7280', py: 1.5, borderBottom: 'none', fontFamily: 'Inter' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={section.columns.length + 1} align="center" sx={{ py: 4, borderBottom: 'none' }}>
                      <Typography sx={{ fontFamily: 'Inter', color: 'text.secondary', fontSize: '13px' }}>
                        No inactive providers found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((provider) => {
                    const id = provider._id || provider.id;
                    return (
                      <TableRow key={id} hover sx={{ height: '60px', '& .MuiTableCell-root': { fontSize: '13px', py: 0, color: '#4B5563', borderBottom: '1px solid #F3F4F6', fontFamily: 'Inter' } }}>
                        {section.columns.map((col) => (
                          <TableCell key={col}>
                            {col === 'provider' ? (
                              <Typography variant="body2" sx={{ fontFamily: 'Inter', color: '#6B7280', fontWeight: 500, fontSize: '13px' }}>
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
    <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '18px', lineHeight: '32px', color: '#111', mb: '24px' }}>
      Inactive Providers
    </Typography>
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
