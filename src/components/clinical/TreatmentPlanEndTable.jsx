import React, { useMemo, useState } from 'react';
import { Box, Button, Tab, Tabs, Typography, Checkbox, Menu, MenuItem, Stack } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const columns = [
  { key: 'checkbox', label: '' },
  { key: 'toothNumber', label: 'Tooth#' },
  { key: 'surface', label: 'Surf' },
  { key: 'code', label: 'Code' },
  { key: 'treatmentName', label: 'Treatment' },
  { key: 'options', label: 'Options' },
  { key: 'patientAmount', label: 'Pt:' },
  { key: 'insuranceAmount', label: 'Ins:' },
  { key: 'adjustmentAmount', label: 'WO:' },
  { key: 'fee', label: 'Fee:' },
  { key: 'providerInitials', label: 'Provider' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date' },
  { key: 'phase', label: 'Phase' },
  { key: 'visit', label: 'Visit' }
];

const STATUS_OPTIONS = [
  { key: 'D', label: 'Diagnosed', color: '#94a3b8', bgColor: '#f1f5f9', textColor: '#475569' },
  { key: 'P', label: 'Presented', color: '#3b82f6', bgColor: '#eff6ff', textColor: '#1d4ed8' },
  { key: 'A', label: 'Accepted', color: '#0f766e', bgColor: '#ccfbf1', textColor: '#115e59' },
  { key: 'X', label: 'Rejected', color: '#ef4444', bgColor: '#fef2f2', textColor: '#991b1b' },
  { key: 'F', label: 'Future', color: '#f59e0b', bgColor: '#fef3c7', textColor: '#92400e' },
  { key: '!', label: 'Follow-up', color: '#eab308', bgColor: '#fef9c3', textColor: '#854d0e' },
  { key: 'EO', label: 'Existing In Office', color: '#64748b', bgColor: '#f1f5f9', textColor: '#334155' },
  { key: 'EX', label: 'Existing Out Office', color: '#475569', bgColor: '#f8fafc', textColor: '#1e293b' }
];

function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '$0.00';
  if (typeof value === 'string') return value;
  return `$${Number(value).toFixed(2)}`;
}

const TreatmentPlanEndTable = ({
  completedRows = [],
  outOfOfficeRows = [],
  followUpRows = [],
  onApplyStatus,
  onReEstimateCompleted
}) => {
  const [tab, setTab] = useState('completed');
  const [selectedIds, setSelectedIds] = useState([]);
  const [stateMenuAnchor, setStateMenuAnchor] = useState(null);

  const activeRows = useMemo(() => {
    if (tab === 'completed') return completedRows;
    if (tab === 'followUp') return followUpRows;
    return outOfOfficeRows;
  }, [tab, completedRows, followUpRows, outOfOfficeRows]);

  const counts = useMemo(
    () => ({
      completed: completedRows.length,
      followUp: followUpRows.length,
      outOfOffice: outOfOfficeRows.length
    }),
    [completedRows.length, followUpRows.length, outOfOfficeRows.length]
  );

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(activeRows.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    setSelectedIds(prev =>
      checked ? [...prev, id] : prev.filter(item => item !== id)
    );
  };

  const handleStateClick = (event) => {
    setStateMenuAnchor(event.currentTarget);
  };

  const handleStateClose = () => {
    setStateMenuAnchor(null);
  };

  const handleStateSelect = (statusKey) => {
    if (onApplyStatus && selectedIds.length > 0) {
      onApplyStatus(statusKey, selectedIds);
      setSelectedIds([]);
    }
    handleStateClose();
  };

  const isAllSelected = activeRows.length > 0 && selectedIds.length === activeRows.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < activeRows.length;

  return (
    <Box sx={{ mt: 2, borderTop: '1px solid #e8ecf1', pt: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => {
            setTab(v);
            setSelectedIds([]);
          }}
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
          <Tab value="followUp" label={`Follow-up (${counts.followUp})`} />
          <Tab value="outOfOffice" label={`Existing Out Office (${counts.outOfOffice})`} />
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

      {/* Action bar for state updates */}
      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
        <Button
          variant="contained"
          size="small"
          endIcon={<KeyboardArrowDownIcon />}
          onClick={handleStateClick}
          disabled={selectedIds.length === 0}
          sx={{
            bgcolor: '#2d4571',
            color: '#fff',
            textTransform: 'none',
            borderRadius: 1,
            '&:hover': {
              bgcolor: '#1e3050'
            }
          }}
        >
          State
        </Button>

        <Menu
          anchorEl={stateMenuAnchor}
          open={Boolean(stateMenuAnchor)}
          onClose={handleStateClose}
        >
          {STATUS_OPTIONS.map(opt => (
            <MenuItem 
              key={opt.key}
              onClick={() => handleStateSelect(opt.key)}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                fontSize: '0.8rem', 
                py: 1, 
                px: 2,
                color: '#334155',
                '&:hover': {
                  bgcolor: '#f1f5f9'
                }
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: opt.color,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}
              >
                {opt.key === 'EO' ? 'E' : opt.key === 'EX' ? 'O' : opt.key}
              </Box>
              <Typography sx={{ fontSize: '0.8rem', color: '#334155' }}>
                {opt.label}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <Box
        sx={{
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          bgcolor: '#fff',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '40px 60px 50px 70px 1.5fr 1fr 1fr 1fr 1fr 1fr 90px 70px 100px 60px 60px',
            gap: 1,
            alignItems: 'center',
            px: 2,
            py: 1,
            bgcolor: '#f8fafc',
            borderBottom: '1px solid #cbd5e1'
          }}
        >
          {columns.map((c) => {
            if (c.key === 'checkbox') {
              return (
                <Checkbox
                  key={c.key}
                  size="small"
                  checked={isAllSelected}
                  indeterminate={isSomeSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              );
            }
            return (
              <Typography key={c.key} sx={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>
                {c.label}
              </Typography>
            );
          })}
        </Box>

        {/* Rows */}
        {activeRows.length === 0 ? (
          <Box sx={{ px: 2, py: 2 }}>
            <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
              No records to show.
            </Typography>
          </Box>
        ) : (
          activeRows.map((row, idx) => {
            const statusOpt = STATUS_OPTIONS.find(opt => opt.key === row?.status) || STATUS_OPTIONS[0];
            const displayChar = row?.status === 'EO' ? 'E' : row?.status === 'EX' ? 'O' : row?.status;
            
            return (
              <Box
                key={row?.id ?? idx}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '40px 60px 50px 70px 1.5fr 1fr 1fr 1fr 1fr 1fr 90px 70px 100px 60px 60px',
                  gap: 1,
                  alignItems: 'center',
                  px: 2,
                  py: 1,
                  borderBottom: idx === activeRows.length - 1 ? 'none' : '1px solid #cbd5e1'
                }}
              >
                <Checkbox
                  size="small"
                  checked={selectedIds.includes(row.id)}
                  onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                />
                
                {/* Tooth number and optional DBI label */}
                <Stack spacing={0.2}>
                  <Typography sx={{ fontSize: '0.8rem', color: '#4a6585', fontWeight: 'bold' }}>
                    {row?.toothNumber ?? ''}
                  </Typography>
                  {row?.dbi && (
                    <Typography sx={{ fontSize: '0.65rem', color: '#1d4ed8', fontWeight: 'bold' }}>
                      DBI
                    </Typography>
                  )}
                </Stack>

                <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>{row?.surface ?? ''}</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>{row?.code ?? ''}</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#4a6585', fontWeight: 600 }}>{row?.treatmentName ?? ''}</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>{row?.options ?? ''}</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>
                  {formatCurrency(row?.patientAmount)}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>
                  {formatCurrency(row?.insuranceAmount)}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>
                  {formatCurrency(row?.adjustmentAmount)}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>{formatCurrency(row?.fee)}</Typography>
                
                {/* Provider Badge */}
                <Box sx={{ display: 'flex' }}>
                  <Box
                    sx={{
                      bgcolor: '#fee2e2',
                      color: '#b91c1c',
                      px: 1,
                      py: 0.2,
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {row?.providerInitials ?? 'BAL'}
                  </Box>
                </Box>

                {/* Status Badge */}
                <Box sx={{ display: 'flex' }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: statusOpt.color,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {displayChar}
                  </Box>
                </Box>

                <Typography sx={{ fontSize: '0.8rem', color: '#4a6585' }}>{row?.date ?? ''}</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#4a6585', fontWeight: 'bold' }}>{row?.phaseNumber ?? '1'}</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#4a6585', fontWeight: 'bold' }}>{row?.visitLabel?.replace('Visit ', '') ?? '1'}</Typography>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default TreatmentPlanEndTable;
