import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Chip
} from '@mui/material';
import AddNewProcedureDialog from './AddNewProcedureDialog';
import { appointmentService } from '../../services/appointment.service';
import { invoiceService } from '../../services/invoice.service';
import dayjs from 'dayjs';

const NewInvoiceDialog = ({ patient, onClose }) => {
  const [showAddProcedure, setShowAddProcedure] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedApptId, setSelectedApptId] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const patientId = patient?._id || patient?.id;

  useEffect(() => {
    const fetchPatientAppointments = async () => {
      if (!patientId) return;
      try {
        setLoading(true);
        setError('');
        
        // 1. Fetch all appointments for the patient
        const allAppts = await appointmentService.getAppointmentsByPatient(patientId);
        
        // 2. Fetch patient's existing invoices to filter out already billed appointments
        const appointmentIdsWithInvoices = new Set();
        try {
          const invoicesResult = await invoiceService.getAllInvoices({ patientId, limit: 1000 });
          const invoices = invoicesResult.invoices || [];
          
          invoices.forEach((inv) => {
            const aptId = inv.appointmentId?._id ?? inv.appointmentId ?? inv.appointment?._id ?? inv.appointment?.id;
            if (aptId) {
              appointmentIdsWithInvoices.add(String(aptId));
            }
          });
        } catch (invoiceErr) {
          console.warn('Error fetching invoices for filtering:', invoiceErr);
        }
        
        // 3. Only keep appointments that haven't been billed yet
        const appointmentsWithoutInvoices = (allAppts || []).filter((appt) => {
          const aptId = String(appt._id || appt.id);
          return !appointmentIdsWithInvoices.has(aptId);
        });
        
        setAppointments(appointmentsWithoutInvoices);
      } catch (err) {
        console.error('Error fetching patient appointments:', err);
        setError(err.response?.data?.error?.message || err.message || 'Failed to fetch appointments.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientAppointments();
  }, [patientId]);

  useEffect(() => {
    if (appointments.length > 0) {
      const selected = appointments.find(appt => appt.status === 'completed') || appointments[0];
      setSelectedApptId(selected?._id || selected?.id || '');
    }
  }, [appointments]);

  const handleCreateInvoice = async () => {
    if (!selectedApptId) return;

    try {
      setCreating(true);
      setError('');

      const newInvoice = await invoiceService.createInvoiceFromAppointment(selectedApptId, {
        dueDate: dayjs().add(30, 'day').toDate(),
      });

      const totalAmt = newInvoice.totalAmount || 0;
      const patientPortion = newInvoice.patientPortion || 0;
      const balanceDue = newInvoice.balanceDue || 0;
      const invoiceNum = newInvoice.invoiceNumber || newInvoice.id || selectedApptId;

      const event = new CustomEvent('add-ledger-item', {
        detail: {
          title: `Invoice Generated (Inv #${invoiceNum})`,
          amount: `$${Number(totalAmt).toFixed(2)}`,
          ptBal: `$${Number(patientPortion).toFixed(2)}`,
          invBal: `$${Number(balanceDue).toFixed(2)}`,
          useCheckmark: true
        }
      });
      window.dispatchEvent(event);

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Error generating invoice:', err);
      setError(err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Failed to generate invoice.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#7788bb',
          color: 'white',
          padding: '10px',
          textAlign: 'center',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'normal', fontSize: '14px', margin: 0 }}>
          {patient ? `Create New Invoice - ${patient.firstName} ${patient.lastName}` : 'Create New Invoice'}
        </Typography>
      </Box>

      {/* Body */}
      <Box sx={{ padding: '30px 20px', minHeight: '180px' }}>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4, gap: 1 }}>
            <CircularProgress size={32} sx={{ color: '#7788bb' }} />
            <Typography variant="body2" color="text.secondary">Loading appointments...</Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        ) : appointments.length === 0 ? (
          <Typography sx={{ color: '#4b5563', fontSize: '13px', letterSpacing: '0.01em', textAlign: 'center', py: 4 }}>
            There are no completed or active appointments ready to be billed for {patient ? `${patient.firstName} ${patient.lastName}` : 'this patient'}.
          </Typography>
        ) : (
          <Box>
            <Typography variant="body2" sx={{ mb: 2, color: '#4b5563', fontWeight: 500 }}>
              Select an appointment to generate a draft invoice:
            </Typography>

            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
              <InputLabel id="appt-select-label" sx={{ fontSize: '14px' }}>Select Appointment</InputLabel>
              <Select
                labelId="appt-select-label"
                value={selectedApptId}
                label="Select Appointment"
                onChange={(e) => setSelectedApptId(e.target.value)}
                sx={{ 
                  fontSize: '13px',
                  borderRadius: '4px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ccc',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#7788bb',
                  }
                }}
              >
                {appointments.map((appt) => {
                  const dateStr = appt.appointmentDate 
                    ? dayjs(appt.appointmentDate).format('MMM DD, YYYY') 
                    : 'No Date';
                  const typeStr = appt.appointmentTypeId?.name || appt.appointmentType || 'Consultation';
                  const timeStr = appt.startTime || '';
                  const statusStr = appt.status ? appt.status.toUpperCase() : 'SCHEDULED';
                  
                  return (
                    <MenuItem 
                      key={appt._id || appt.id} 
                      value={appt._id || appt.id}
                      sx={{ fontSize: '13px', py: 1 }}
                    >
                      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '13px' }}>
                          {dateStr} {timeStr && `at ${timeStr}`} - {typeStr}
                        </Typography>
                        <Chip 
                          label={statusStr} 
                          size="small" 
                          color={appt.status === 'completed' ? 'success' : 'primary'}
                          sx={{ fontSize: '10px', height: '18px', fontWeight: 'bold' }} 
                        />
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            {/* Selected Appointment Details Summary */}
            {(() => {
              const selectedAppt = appointments.find(a => (a._id || a.id) === selectedApptId);
              if (!selectedAppt) return null;
              
              const dateStr = selectedAppt.appointmentDate 
                ? dayjs(selectedAppt.appointmentDate).format('MMMM DD, YYYY') 
                : 'N/A';
              const typeStr = selectedAppt.appointmentTypeId?.name || selectedAppt.appointmentType || 'Consultation';
              const price = selectedAppt.appointmentTypeId?.defaultPrice || 0;
              const providerName = selectedAppt.providerId?.userId 
                ? `Dr. ${selectedAppt.providerId.userId.firstName} ${selectedAppt.providerId.userId.lastName}`
                : selectedAppt.providerId?.firstName 
                  ? `Dr. ${selectedAppt.providerId.firstName} ${selectedAppt.providerId.lastName}`
                  : 'N/A';

              return (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f9fafb', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Appointment Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontSize: '13px', color: '#374151' }}>
                        <strong>Date & Time:</strong> {dateStr} {selectedAppt.startTime && `at ${selectedAppt.startTime}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontSize: '13px', color: '#374151' }}>
                        <strong>Provider:</strong> {providerName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontSize: '13px', color: '#374151' }}>
                        <strong>Treatment Type:</strong> {typeStr}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ fontSize: '13px', color: '#374151' }}>
                        <strong>Estimated Fee:</strong> <Box component="span" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>${price.toFixed(2)}</Box>
                      </Typography>
                    </Grid>
                    {selectedAppt.chiefComplaint && (
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ fontSize: '13px', color: '#374151' }}>
                          <strong>Chief Complaint:</strong> {selectedAppt.chiefComplaint}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              );
            })()}
          </Box>
        )}
      </Box>

      {/* Footer / Actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 20px',
          borderTop: '1px solid #f3f4f6',
        }}
      >
        {/* Left Actions */}
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setShowAddProcedure(true)}
            sx={{
              backgroundColor: '#d2b48c',
              color: 'white',
              textTransform: 'none',
              fontSize: '13px',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#c1a37b', boxShadow: 'none' },
            }}
          >
            +Add Procedure
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: '#d2b48c',
              color: 'white',
              textTransform: 'none',
              fontSize: '13px',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#c1a37b', boxShadow: 'none' },
            }}
          >
            Re-estimate
          </Button>
          <Typography
            sx={{
              color: '#7788bb',
              fontSize: '13px',
              cursor: 'pointer',
              marginLeft: '5px',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            + Add description
          </Typography>
        </Box>

        {/* Right Actions */}
        <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <FormControlLabel
            control={<Checkbox size="small" sx={{ color: '#7788bb', '&.Mui-checked': { color: '#7788bb' } }} />}
            label="Add Claim"
            sx={{
              margin: 0,
              '& .MuiTypography-root': { fontSize: '13px', color: '#7788bb' },
            }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={handleCreateInvoice}
            disabled={creating || loading || !selectedApptId}
            sx={{
              backgroundColor: '#7788bb',
              color: 'white',
              textTransform: 'none',
              fontSize: '13px',
              padding: '6px 20px',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#6677aa', boxShadow: 'none' },
            }}
          >
            {creating ? 'Adding...' : 'Add New Invoice'}
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={onClose}
            sx={{
              backgroundColor: '#9ca3af',
              color: 'white',
              textTransform: 'none',
              fontSize: '13px',
              padding: '6px 20px',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#8b949e', boxShadow: 'none' },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>

      {/* Add New Procedure Dialog Overlay */}
      {showAddProcedure && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1400,
            p: 4
          }}
          onClick={() => setShowAddProcedure(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '800px', 
              width: '100%',
              bgcolor: '#fff',
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AddNewProcedureDialog 
              onClose={() => setShowAddProcedure(false)}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default NewInvoiceDialog;
