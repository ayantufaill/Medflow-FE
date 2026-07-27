import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Sync as SyncIcon,
} from '@mui/icons-material';

// Sub-components
import CreditAdjustmentSettings from '../../components/admin/finance-management/adjustment-types/CreditAdjustmentSettings';
import DebitAdjustmentSettings from '../../components/admin/finance-management/adjustment-types/DebitAdjustmentSettings';
import FinanceChargeSettings from '../../components/admin/finance-management/adjustment-types/FinanceChargeSettings';
import AdjustmentTypesSyncDialog from '../../components/admin/finance-management/adjustment-types/AdjustmentTypesSyncDialog';

// Redux
import {
  fetchAdjustmentTypes,
  createAdjustmentType,
  updateAdjustmentType,
  deleteAdjustmentType,
  selectAdjustmentTypes,
  selectAdjustmentTypesLoading
} from '../../store/slices/billingSlice';

const AdjustmentTypes = () => {
  const dispatch = useDispatch();
  const adjustmentTypes = useSelector(selectAdjustmentTypes);
  const loading = useSelector(selectAdjustmentTypesLoading);

  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAdjustmentTypes());
  }, [dispatch]);

  // Derived state from Redux
  const creditAdjustments = [];
  const debitAdjustments = [];
  const financeCharges = [];

  adjustmentTypes.forEach((adj) => {
    if (adj.isHidden) return;

    let section = 'credit';
    let note = adj.note || '';

    if (note.startsWith('[debit]')) {
      section = 'debit';
      note = note.replace('[debit]', '');
    } else if (note.startsWith('[finance]')) {
      section = 'finance';
      note = note.replace('[finance]', '');
    } else if (note.startsWith('[credit]')) {
      section = 'credit';
      note = note.replace('[credit]', '');
    }

    const mappedAdj = {
      id: adj.id,
      type: adj.type,
      amount: adj.amount || '',
      percent: adj.percent || '',
      note,
      deletable: true,
      isNew: false
    };

    if (section === 'credit') creditAdjustments.push(mappedAdj);
    else if (section === 'debit') debitAdjustments.push(mappedAdj);
    else if (section === 'finance') financeCharges.push(mappedAdj);
  });

  const handleInputChange = (section, id, field, value) => {
    // Immediate debounced save can be complex, for now we will trigger an update directly
    // Wait, the UI expects immediate input change. So we should use local state for editing,
    // OR we just dispatch an update on blur, but we don't have onBlur in AdjustmentTable.
    // Let's dispatch update directly.
    const adj = adjustmentTypes.find(a => a.id === id);
    if (!adj) return;

    const prefix = `[${section}]`;
    let newNote = adj.note || '';
    if (!newNote.startsWith('[credit]') && !newNote.startsWith('[debit]') && !newNote.startsWith('[finance]')) {
      newNote = prefix + newNote;
    }

    const updatePayload = {
      id,
      name: field === 'type' ? value : adj.type,
      type: field === 'type' ? value : adj.type,
      amount: field === 'amount' ? value : adj.amount,
      percent: field === 'percent' ? value : adj.percent,
      note: field === 'note' ? prefix + value : newNote,
    };
    dispatch(updateAdjustmentType(updatePayload));
  };

  const handleDelete = (section, id) => {
    dispatch(deleteAdjustmentType(id));
  };

  const handleAdd = (section) => {
    const newAdj = {
      name: 'New Adjustment',
      type: 'New Adjustment',
      amount: '',
      percent: '',
      note: `[${section}]`,
    };
    dispatch(createAdjustmentType(newAdj));
  };

  if (loading && adjustmentTypes.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh', pb: 5 }}>
      {/* Header Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', px: 4, pt: 4, mb: 4 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>
            Adjustment Types
          </Typography>
        </Box>
        <Button
          startIcon={<SyncIcon />}
          size="small"
          onClick={() => setIsSyncDialogOpen(true)}
          sx={{
            textTransform: 'none',
            backgroundColor: '#2563eb',
            color: '#fff',
            fontWeight: 600,
            borderRadius: 2,
            px: 2,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' }
          }}
          variant="contained"
        >
          Sync
        </Button>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ px: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <CreditAdjustmentSettings
          data={creditAdjustments}
          section="credit"
          onAdd={() => handleAdd('credit')}
          onInputChange={handleInputChange}
          onDelete={handleDelete}
        />

        <DebitAdjustmentSettings
          data={debitAdjustments}
          section="debit"
          onAdd={() => handleAdd('debit')}
          onInputChange={handleInputChange}
          onDelete={handleDelete}
        />

        <FinanceChargeSettings
          data={financeCharges}
          section="finance"
          onAdd={() => handleAdd('finance')}
          onInputChange={handleInputChange}
          onDelete={handleDelete}
        />
      </Box>

      <AdjustmentTypesSyncDialog
        open={isSyncDialogOpen}
        onClose={() => setIsSyncDialogOpen(false)}
      />
    </Box>
  );
};

export default AdjustmentTypes;
