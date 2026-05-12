import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Divider,
  Grid,
} from '@mui/material';
import {
  Sync as SyncIcon,
} from '@mui/icons-material';

// Sub-components
import AdjustmentTable from '../../components/admin/AdjustmentTable';

const AdjustmentTypes = () => {
  const [creditAdjustments, setCreditAdjustments] = useState([
    { id: 1, type: 'Insurance Write Off', amount: '', percent: '', note: 'Applied to procedure fee', deletable: false },
    { id: 2, type: 'Un-Collected', amount: '', percent: '', note: 'Applied to patient balance', deletable: false },
    { id: 3, type: 'Professional Courtesy', amount: '', percent: '', note: 'Applied to patient balance', deletable: true },
    { id: 4, type: 'Immediate Family Courtesy', amount: '', percent: '', note: 'Applied to patient balance', deletable: true },
    { id: 5, type: 'OON paid', amount: '', percent: '', note: 'Applied to patient balance under production', deletable: true },
    { id: 6, type: 'Sunbit Fee', amount: '', percent: '', note: 'Applied to patient balance under production', deletable: true },
    { id: 7, type: 'Courtesy 3% for cash pay', amount: '', percent: '', note: 'Applied to patient balance under production', deletable: true },
    { id: 8, type: 'Alle Rewards', amount: '', percent: '', note: 'Applied to patient balance under production', deletable: true },
    { id: 9, type: 'Uncollect: de-escalate situation', amount: '', percent: '', note: 'Applied to patient balance under production', deletable: true },
    { id: 10, type: 'No balance billing', amount: '', percent: '', note: 'Applied to patient balance', deletable: true },
    { id: 11, type: 'Pro bono', amount: '', percent: '', note: 'Applied to patient balance', deletable: true },
    { id: 12, type: 'Fee included in Invisalign treatment', amount: '', percent: '', note: 'Applied to patient balance', deletable: true },
    { id: 13, type: 'Downgrade', amount: '', percent: '', note: 'Applied to patient balance', deletable: true },
    { id: 14, type: 'Care Credit fee', amount: '', percent: '', note: 'Applied to patient balance', deletable: true },
    { id: 15, type: 'Employee benefit', amount: '', percent: '', note: 'Applied to patient balance', deletable: true },
    { id: 16, type: 'Cherry Fee', amount: '', percent: '', note: 'Applied to patient balance', deletable: true },
    { id: 17, type: 'HFD Fee', amount: '', percent: '', note: 'Applied to patient balance', deletable: true },
    { id: 18, type: 'May 2026 Invisalign special', amount: '', percent: '', note: 'Applied to patient balance', deletable: true },
  ]);

  const [debitAdjustments, setDebitAdjustments] = useState([
    { id: 1, type: 'Insurance charge back', amount: '', percent: '', deletable: true },
    { id: 2, type: 'Refinement fee', amount: '500', percent: '', deletable: true },
    { id: 3, type: 'Forefeit deposit', amount: '', percent: '', deletable: true },
  ]);

  const [financeCharges, setFinanceCharges] = useState([
    { id: 1, type: 'Broken appt', amount: '100', percent: '', deletable: true },
    { id: 2, type: 'Late cancellation', amount: '100', percent: '', deletable: true },
    { id: 3, type: 'Late payment 30 days', amount: '', percent: '5', deletable: true },
    { id: 4, type: 'Late payment 60 days', amount: '', percent: '10', deletable: true },
    { id: 5, type: 'Late payment 90 days', amount: '', percent: '15', deletable: true },
    { id: 6, type: 'Flat rate', amount: '15', percent: '', deletable: true },
    { id: 7, type: 'Percentage', amount: '', percent: '15', deletable: true },
  ]);

  const handleInputChange = (section, id, field, value) => {
    const updateFn = section === 'credit' ? setCreditAdjustments : section === 'debit' ? setDebitAdjustments : setFinanceCharges;
    updateFn((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleDelete = (section, id) => {
    const updateFn = section === 'credit' ? setCreditAdjustments : section === 'debit' ? setDebitAdjustments : setFinanceCharges;
    updateFn((prev) => prev.filter((row) => row.id !== id));
  };

  const handleAdd = (section) => {
    const updateFn = section === 'credit' ? setCreditAdjustments : section === 'debit' ? setDebitAdjustments : setFinanceCharges;
    const currentData = section === 'credit' ? creditAdjustments : section === 'debit' ? debitAdjustments : financeCharges;
    const newId = Math.max(...currentData.map(r => r.id), 0) + 1;
    updateFn((prev) => [...prev, { id: newId, type: 'New Adjustment', amount: '', percent: '', note: section === 'credit' ? 'Applied to patient balance' : '', deletable: true }]);
  };

  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Link to="/admin/finance-management" style={{ textDecoration: 'none', color: '#4b71a1' }}>Finance Management</Link> &gt; Adjustment Types
        </Typography>
        <Button
          startIcon={<SyncIcon />}
          size="small"
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
