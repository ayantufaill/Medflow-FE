import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Divider,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  Sync as SyncIcon,
} from '@mui/icons-material';

// Sub-components
import AdjustmentTable from '../../components/admin/AdjustmentTable';

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
    <Box sx={{ p: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Link to="/admin/finance-management" style={{ textDecoration: 'none', color: '#4b71a1' }}>Finance Management</Link> &gt; Adjustment Types
        </Typography>
        <Button
          startIcon={<SyncIcon />}
          size="small"
          onClick={() => dispatch(fetchAdjustmentTypes())}
          sx={{ textTransform: 'none', color: '#4b71a1' }}
        >
          Sync
        </Button>
      </Box>

      <Grid container spacing={0} sx={{ flexWrap: 'nowrap', width: '100%' }}>
        <Grid item sx={{ width: '48%', flexBasis: '48%', flexGrow: 0, flexShrink: 0 }}>
          <AdjustmentTable
            title="Credit Adjustment (subtraction)"
            subtitle="If left blank, no default amount will apply once adj. selected on patient bill."
            data={creditAdjustments}
            section="credit"
            hasNote={true}
            onAdd={() => handleAdd('credit')}
            onInputChange={handleInputChange}
            onDelete={handleDelete}
          />
        </Grid>
        
        {/* Vertical Divider */}
        <Grid item sx={{ width: '4%', display: 'flex', justifyContent: 'center' }}>
          <Divider orientation="vertical" flexItem sx={{ height: 'auto', alignSelf: 'stretch', borderColor: '#e0e0e0' }} />
        </Grid>

        <Grid item sx={{ width: '48%', flexBasis: '48%', flexGrow: 0, flexShrink: 0 }}>
          <AdjustmentTable
            title="Debit Adjustment (addition)"
            subtitle="If left blank, no default amount will apply once adj. selected on patient bill."
            data={debitAdjustments}
            section="debit"
            hasNote={false}
            onAdd={() => handleAdd('debit')}
            onInputChange={handleInputChange}
            onDelete={handleDelete}
          />
          <AdjustmentTable
            title="Finance Charges"
            subtitle="If left blank, no default amount will apply once adj. selected on patient bill."
            data={financeCharges}
            section="finance"
            hasNote={false}
            onAdd={() => handleAdd('finance')}
            onInputChange={handleInputChange}
            onDelete={handleDelete}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdjustmentTypes;
