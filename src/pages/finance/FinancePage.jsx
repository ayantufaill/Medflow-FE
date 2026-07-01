import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';

// Sub-components
import PatientFinanceInfo from '../../components/finance/PatientFinanceInfo';
import AgingTable from '../../components/finance/AgingTable';
import FinanceActions from '../../components/finance/FinanceActions';
import LedgerList from '../../components/finance/LedgerList';
import IndividualLedgerTable from '../../components/finance/IndividualLedgerTable';
import FamilyLedgerTable from '../../components/finance/FamilyLedgerTable';
import NewPaymentPlan from '../../components/finance/NewPaymentPlan';
import AccountAdjustmentDialog from '../../components/finance/AccountAdjustmentDialog';
import CourtesyRefundDialog from '../../components/finance/CourtesyRefundDialog';
import EditPatientFlagsDialog from '../../components/finance/EditPatientFlagsDialog';
import DepositDialog from '../../components/finance/DepositDialog';
import DepositOptionsMenu from '../../components/finance/DepositOptionsMenu';
import CourtesyCreditComponent from '../../components/finance/CourtesyCreditComponent';
import ErrorBoundary from '../../components/shared/ErrorBoundary';
import { usePatient } from '../../hooks/redux/usePatient';
import apiClient from '../../config/api';
import { patientService } from '../../services/patient.service';

const FinancePage = () => {
  const { currentPatient, selectedPatientId, fetchById, setPatient } = usePatient();
  const [view, setView] = useState('invoices');
  const [expanded, setExpanded] = useState(false);
  const [showPaymentPlan, setShowPaymentPlan] = useState(false);
  const [showAccountAdjustment, setShowAccountAdjustment] = useState(false);
  const [showCourtesyRefund, setShowCourtesyRefund] = useState(false);
  const [showEditFlags, setShowEditFlags] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositMenuAnchor, setDepositMenuAnchor] = useState(null);
  const [depositType, setDepositType] = useState('patient-deposit');
  const [showCourtesyCredit, setShowCourtesyCredit] = useState(false);
  const [filters, setFilters] = useState({
    includeVoided: false,
    hideBillingTransfers: false
  });
  const patientFinanceRef = useRef(null);

  useEffect(() => {
    const loadPatientDetails = async () => {
      // If we already have currentPatient, no need to fetch
      if (currentPatient && (currentPatient._id || currentPatient.id)) {
        return;
      }
      
      // If we have selectedPatientId, fetch that patient
      if (selectedPatientId) {
        try {
          await fetchById(selectedPatientId);
        } catch (error) {
          console.error('Error fetching selected patient details:', error);
        }
        return;
      }
      
      // Fallback: If no patient is selected, fetch the first active patient in the system
      try {
        const result = await patientService.getAllPatients(1, 1, '', 'active');
        const firstPatient = result?.patients?.[0];
        if (firstPatient && (firstPatient._id || firstPatient.id)) {
          const patientId = firstPatient._id || firstPatient.id;
          const fullPatient = await patientService.getPatientById(patientId);
          setPatient(fullPatient);
        }
      } catch (error) {
        console.error('Error fetching fallback patient details:', error);
      }
    };

    loadPatientDetails();
  }, [currentPatient, selectedPatientId, fetchById, setPatient]);

  const handleViewChange = (event) => {
    setView(event.target.value);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    console.log('Filters updated:', { ...filters, ...newFilters });
    // Add logic to filter ledger data based on these filters
  };

  const handleDepositSave = async (depositData) => {
    console.log('Deposit saved:', depositData);
    try {
      const patientId = currentPatient?._id || currentPatient?.id;
      if (!patientId) {
        console.warn('No active patient selected to add deposit.');
        return;
      }

      // Map human-readable paymentMethod to backend-supported values
      // Backend expects: ['cash', 'check', 'card', 'ach', 'insurance']
      let mappedMethod = 'cash';
      const methodLower = depositData.paymentMethod?.toLowerCase() || '';
      if (methodLower.includes('check')) mappedMethod = 'check';
      else if (methodLower.includes('card') || methodLower.includes('visa') || methodLower.includes('master')) mappedMethod = 'card';
      else if (methodLower.includes('eft') || methodLower.includes('ach')) mappedMethod = 'ach';
      else if (methodLower.includes('insurance')) mappedMethod = 'insurance';

      // Map depositType: 'patient-deposit' -> 'patient', 'insurance-deposit' -> 'insurance'
      const mappedType = depositData.depositType === 'insurance-deposit' ? 'insurance' : 'patient';

      await apiClient.post('/deposits', {
        patientId: patientId.toString(),
        amount: parseFloat(depositData.depositAmount) || 0,
        paymentMethod: mappedMethod,
        depositType: mappedType,
        date: new Date().toISOString(),
        notes: `Prepayment Deposit - Method: ${depositData.paymentMethod}. Account: ${depositData.toAccount || 'None'}. Policy: ${depositData.policy || 'None'}`
      });

      // Dispatch refresh event to update the ledger UI
      window.dispatchEvent(new CustomEvent('add-ledger-item'));
    } catch (err) {
      console.error('Error saving deposit in database:', err);
    }
    setShowDeposit(false);
  };

  const handleCourtesyCreditSave = async (creditData) => {
    console.log('Courtesy credit saved:', creditData);
    try {
      const patientId = currentPatient?._id || currentPatient?.id;
      if (!patientId) {
        console.warn('No active patient selected to add courtesy credit.');
        return;
      }
      
      // Post adjustment to backend (negative amount for credit subtraction)
      const amountVal = -Math.abs(creditData.creditAmount);
      await apiClient.post('/adjustments', {
        patientId: patientId.toString(),
        amount: amountVal,
        date: new Date(),
        notes: `Courtesy Credit - Type: ${creditData.adjustmentType}`
      });

      // Dispatch refresh event to update the ledger UI
      window.dispatchEvent(new CustomEvent('add-ledger-item'));
    } catch (err) {
      console.error('Error saving courtesy credit in database:', err);
    }
    setShowCourtesyCredit(false);
  };

  const handleAccountAdjustmentSave = async (adjustmentData) => {
    console.log('Account adjustment saved:', adjustmentData);
    try {
      const patientId = currentPatient?._id || currentPatient?.id;
      if (!patientId) {
        console.warn('No active patient selected to add account adjustment.');
        return;
      }
      
      // Post adjustment to backend (negative amount for balance deduction/cash minus)
      const amountVal = -Math.abs(adjustmentData.amount);
      await apiClient.post('/adjustments', {
        patientId: patientId.toString(),
        amount: amountVal,
        date: new Date(),
        notes: `Account Adjustment - Type: ${adjustmentData.adjustmentType}${adjustmentData.description ? `. Description: ${adjustmentData.description}` : ''}`
      });

      // Dispatch refresh event to update the ledger UI
      window.dispatchEvent(new CustomEvent('add-ledger-item'));
    } catch (err) {
      console.error('Error saving account adjustment in database:', err);
    }
    setShowAccountAdjustment(false);
  };

  const handleEditFlagsSave = async (flagsData) => {
    console.log('Patient flags saved:', flagsData);
    const activeFlags = Object.keys(flagsData).filter(key => flagsData[key]);
    try {
      if (currentPatient && (currentPatient._id || currentPatient.id)) {
        const patientId = currentPatient._id || currentPatient.id;
        const updatedPatient = await patientService.updatePatientWorkspace(patientId, {
          patientFlags: activeFlags
        });
        setPatient(updatedPatient);
        console.log('Patient flags updated successfully:', updatedPatient.patientFlags);
      } else {
        console.warn('No active patient selected to update flags.');
      }
    } catch (error) {
      console.error('Error updating patient flags:', error);
    }
    setShowEditFlags(false);
  };

  const handleCreatePaymentPlan = async (planData) => {
    console.log('Creating payment plan:', planData);
    try {
      const patientId = currentPatient?._id || currentPatient?.id;
      if (!patientId) {
        console.warn('No active patient to create payment plan for.');
        return;
      }
      
      await apiClient.post('/payment-plans', {
        patientId: patientId.toString(),
        totalAmount: planData.totalAmount,
        downPayment: planData.downPayment,
        monthlyPayment: planData.monthlyPayment,
        numberOfPayments: planData.numberOfPayments,
        apr: 0,
        startDate: planData.startDate || new Date().toISOString(),
        notes: planData.notes
      });
      
      // Dispatch refresh event to update the ledger UI
      window.dispatchEvent(new CustomEvent('add-ledger-item'));
    } catch (err) {
      console.error('Error creating payment plan in backend:', err);
    }
    setShowPaymentPlan(false);
  };

  const handleDepositOptionSelect = (optionId) => {
    setDepositType(optionId);
    if (optionId === 'patient-deposit') {
      setShowDeposit(true);
    } else if (optionId === 'insurance-deposit') {
      setShowDeposit(true);
    } else if (optionId === 'courtesy-credit') {
      setShowCourtesyCredit(true);
    }
  };

  if (showPaymentPlan) {
    return <NewPaymentPlan 
      patient={currentPatient} 
      onBack={() => setShowPaymentPlan(false)} 
      onCreatePlan={handleCreatePaymentPlan}
    />;
  }

  return (
    <Box sx={{ p: '8px 8px 8px 8px', bgcolor: '#fff', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Main Dashboard Section */}
      <Box sx={{ display: 'flex', gap: 3, width: '100%', mt: 2, mb: 3 }}>
        <PatientFinanceInfo 
          ref={patientFinanceRef}
          view={view} 
          onViewChange={handleViewChange}
          flags={currentPatient?.patientFlags || []}
          patient={currentPatient}
          onCalendarClick={() => setShowPaymentPlan(true)} 
          onCashMinusClick={() => setShowAccountAdjustment(true)}
          onRefreshCoinClick={() => setShowCourtesyRefund(true)}
          onAddFlagsClick={() => setShowEditFlags(true)}
          onOpenDepositMenu={(e) => setDepositMenuAnchor(e.currentTarget)}
        />
        <AgingTable view={view} />
      </Box>

      {/* Action Toolbar: Filters and Buttons */}
      <FinanceActions 
        view={view} 
        expanded={expanded} 
        onExpandToggle={() => setExpanded(!expanded)}
        onFilterChange={handleFilterChange}
        onCalendarClick={() => setShowPaymentPlan(true)} 
        onCashMinusClick={() => setShowAccountAdjustment(true)}
        onRefreshCoinClick={() => setShowCourtesyRefund(true)}
        onOpenDepositMenu={(e) => setDepositMenuAnchor(e.currentTarget)}
        onTriggerPatientFinanceIcon={(iconId, e) => patientFinanceRef.current?.triggerIcon?.(iconId, e)}
      />

      {/* Ledger Filters */}
      <Box sx={{ display: 'flex', gap: 3, mb: 2, px: 1 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={filters.includeVoided} 
            onChange={(e) => handleFilterChange({ includeVoided: e.target.checked })} 
          />
          <Typography variant="caption">Include voided transactions</Typography>
        </label>
        {view !== 'family' && view !== 'individual' && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={filters.hideBillingTransfers} 
              onChange={(e) => handleFilterChange({ hideBillingTransfers: e.target.checked })} 
            />
            <Typography variant="caption">Hide billing transfers</Typography>
          </label>
        )}
      </Box>

      {/* Dynamic Ledger Section */}
      <ErrorBoundary>
        {view === 'family' ? <FamilyLedgerTable patient={currentPatient} /> : view === 'individual' ? <IndividualLedgerTable patient={currentPatient} /> : <LedgerList patient={currentPatient} expanded={expanded} />}
      </ErrorBoundary>

      {/* Account Adjustment Dialog */}
      {showAccountAdjustment && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1300
          }}
          onClick={() => setShowAccountAdjustment(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '100%', 
              width: '95%',
              bgcolor: '#fff',
              borderRadius: '8px',
              overflow: 'visible',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AccountAdjustmentDialog 
              patient={currentPatient}
              onClose={() => setShowAccountAdjustment(false)} 
              onSave={handleAccountAdjustmentSave}
            />
          </Box>
        </Box>
      )}

      {/* Courtesy Refund Dialog */}
      {showCourtesyRefund && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1300
          }}
          onClick={() => setShowCourtesyRefund(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '900px', 
              width: '90%',
              bgcolor: '#fff',
              borderRadius: '8px',
              overflow: 'visible',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CourtesyRefundDialog 
              patient={currentPatient}
              onClose={() => setShowCourtesyRefund(false)} 
            />
          </Box>
        </Box>
      )}

      {/* Edit Patient Flags Dialog */}
      {showEditFlags && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1300
          }}
          onClick={() => setShowEditFlags(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '750px', 
              width: '90%',
              bgcolor: '#fff',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <EditPatientFlagsDialog 
              onClose={() => setShowEditFlags(false)}
              onSave={handleEditFlagsSave}
              initialFlags={currentPatient?.patientFlags || []}
            />
          </Box>
        </Box>
      )}

      {/* Deposit Dialog */}
      {showDeposit && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1300
          }}
          onClick={() => setShowDeposit(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '900px', 
              width: '90%',
              bgcolor: '#fff',
              borderRadius: '8px',
              overflow: 'visible',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <DepositDialog 
              patient={currentPatient}
              onClose={() => setShowDeposit(false)} 
              onSave={handleDepositSave}
              depositType={depositType}
            />
          </Box>
        </Box>
      )}

      {/* Deposit Options Menu */}
      <DepositOptionsMenu
        anchorEl={depositMenuAnchor}
        onClose={() => setDepositMenuAnchor(null)}
        onSelect={handleDepositOptionSelect}
      />

      {/* Courtesy Credit Dialog */}
      {showCourtesyCredit && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1300
          }}
          onClick={() => setShowCourtesyCredit(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '600px', 
              width: '90%',
              bgcolor: '#fff',
              borderRadius: '8px',
              overflow: 'visible',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CourtesyCreditComponent 
              onClose={() => setShowCourtesyCredit(false)}
              onSave={handleCourtesyCreditSave}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FinancePage;