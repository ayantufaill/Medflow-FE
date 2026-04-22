import React, { useState } from 'react';
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

// Sub-components
import PatientFinanceInfo from '../../components/finance/PatientFinanceInfo';
import AgingTable from '../../components/finance/AgingTable';
import FinanceActions from '../../components/finance/FinanceActions';
import LedgerList from '../../components/finance/LedgerList';
import FamilyLedgerTable from '../../components/finance/FamilyLedgerTable';
import NewPaymentPlan from '../../components/finance/NewPaymentPlan';

const FinancePage = () => {
  const [view, setView] = useState('invoices');
  const [expanded, setExpanded] = useState(false);
  const [showPaymentPlan, setShowPaymentPlan] = useState(false);

  const handleViewChange = (event) => {
    setView(event.target.value);
  };

  if (showPaymentPlan) {
    return <NewPaymentPlan onBack={() => setShowPaymentPlan(false)} />;
  }

  return (
    <Box sx={{ p: '8px 8px 8px 8px', bgcolor: '#fff', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* View Selection Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#555', mb: 0.5 }}>View</Typography>
        <RadioGroup row value={view} onChange={handleViewChange}>
          {[
            { value: 'invoices', label: 'Invoices' },
            { value: 'individual', label: 'Individual Ledger' },
            { value: 'family', label: 'Family Ledger' },
          ].map((option) => (
            <FormControlLabel 
              key={option.value}
              value={option.value} 
              control={<Radio size="small" sx={{ color: '#7cb342', '&.Mui-checked': { color: '#7cb342' } }} />} 
              label={<Typography variant="caption">{option.label}</Typography>} 
            />
          ))}
        </RadioGroup>
      </Box>

      {/* Main Dashboard Section */}
      <Box sx={{ display: 'flex', width: '100%', mt: 2, alignItems: 'center' }}>
        <PatientFinanceInfo view={view} onCalendarClick={() => setShowPaymentPlan(true)} />
        <AgingTable />
      </Box>

      {/* Action Toolbar: Filters and Buttons */}
      <FinanceActions 
        view={view} 
        expanded={expanded} 
        onExpandToggle={() => setExpanded(!expanded)} 
      />

      {/* Dynamic Ledger Section */}
      {view === 'family' ? <FamilyLedgerTable /> : <LedgerList expanded={expanded} />}
    </Box>
  );
};

export default FinancePage;