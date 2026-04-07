import React, { useMemo, useState } from 'react';
import { Box, Button, Tab, Tabs, Typography } from '@mui/material';

const columns = [
  { key: 'toothNumber', label: 'Tooth#' },
  { key: 'surface', label: 'Surf' },
  { key: 'code', label: 'Code' },
  { key: 'treatmentName', label: 'Treatment' },
  { key: 'options', label: 'Options' },
  { key: 'patientAmount', label: 'Pt:' },
  { key: 'insuranceAmount', label: 'Ins:' },
  { key: 'adjustmentAmount', label: 'Adj:' },
  { key: 'fee', label: 'Office Fee/UCR:' },
  { key: 'billedAmount', label: 'Billed Fee:' },
  { key: 'providerInitials', label: 'Provider' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date' }
];

function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '$0.00';
  if (typeof value === 'string') return value;
  return `$${Number(value).toFixed(2)}`;
}

const TreatmentPlanEndTable = ({
  completedRows = [],
  outOfOfficeRows = [],
  onReEstimateCompleted
}) => {
  const [tab, setTab] = useState('completed');

  const activeRows = tab === 'completed' ? completedRows : outOfOfficeRows;
  const counts = useMemo(
    () => ({
      completed: completedRows.length,
      outOfOffice: outOfOfficeRows.length
    }),
    [completedRows.length, outOfOfficeRows.length]
  );

  return (
    <Box sx={{ mt: 2, borderTop: '1px solid #e8ecf1', pt: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            minHeight: 32,
            '& .MuiTab-root': {
              minHeight: 32,
              textTransform: 'none',
              fontSize: '0.8rem',
              px: 1.5
            }
          }}
        >
          <Tab value="completed" label={`Completed (${counts.completed})`} />
          <Tab value="outOfOffice" label={`Existing Out of Office (${counts.outOfOffice})`} />
        </Tabs>

        <Button
          variant="outlined"
          size="small"
          onClick={onReEstimateCompleted}
          sx={{ textTransform: 'none', borderRadius: 1, fontSize: '0.8rem' }}
        >
          Re-Estimate Completed
        </Button>
      </Box>

      <Box
        sx={{
          border: '1px solid #d1d9e6',
          borderRadius: 1,
          bgcolor: '#fff'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(13, 1fr)',
            gap: 0.5,
            alignItems: 'end',
            px: 1,
            py: 1,
            bgcolor: '#f8f9fc',
            borderBottom: '1px solid #e8ecf1'
          }}
        >
          {columns.map((c) => (
            <Typography key={c.key} sx={{ fontSize: '0.7rem', color: '#666', fontWeight: 600 }}>
              {c.label}
            </Typography>
          ))}
        </Box>

        {/* Rows */}
        {activeRows.length === 0 ? (
          <Box sx={{ px: 1, py: 2 }}>
            <Typography sx={{ fontSize: '0.8rem', color: '#7a8796' }}>
              No records to show.
            </Typography>
          </Box>
        ) : (
          activeRows.map((row, idx) => (
            <Box
              key={row?.id ?? idx}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(13, 1fr)',
                gap: 0.5,
                alignItems: 'center',
                px: 1,
                py: 1,
                borderBottom: idx === activeRows.length - 1 ? 'none' : '1px solid #eef2f7'
              }}
            >
              <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>{row?.toothNumber ?? ''}</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>{row?.surface ?? ''}</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>{row?.code ?? ''}</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>{row?.treatmentName ?? ''}</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>{row?.options ?? ''}</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>
                {formatCurrency(row?.patientAmount)}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>
                {formatCurrency(row?.insuranceAmount)}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>
                {formatCurrency(row?.adjustmentAmount)}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>{formatCurrency(row?.fee)}</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>
                {formatCurrency(row?.billedAmount)}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>{row?.providerInitials ?? ''}</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>{row?.status ?? ''}</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>{row?.date ?? ''}</Typography>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default TreatmentPlanEndTable;

