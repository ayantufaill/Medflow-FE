# Feature Implementation Guide - 4 Partially Implemented Features

## 1. PAT-REG-08: Patient Duplicate Detection UI Integration

### Current Status:
- ✅ Backend API exists: `patientService.checkDuplicates()`
- ❌ UI integration missing in `PatientForm.jsx`

### Implementation Steps:

#### Step 1: Add duplicate check in PatientForm
**File:** `src/components/patients/PatientForm.jsx`

**Add state:**
```javascript
const [duplicateDialog, setDuplicateDialog] = useState({
  open: false,
  duplicates: [],
});
const [checkingDuplicates, setCheckingDuplicates] = useState(false);
```

**Add function to check duplicates (call when firstName, lastName, dateOfBirth changes):**
```javascript
const checkForDuplicates = useCallback(async (firstName, lastName, dateOfBirth) => {
  if (!firstName || !lastName || !dateOfBirth) {
    return;
  }

  try {
    setCheckingDuplicates(true);
    const duplicates = await patientService.checkDuplicates({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dateOfBirth: dayjs(dateOfBirth).format('YYYY-MM-DD'),
    });

    if (duplicates && duplicates.length > 0) {
      setDuplicateDialog({
        open: true,
        duplicates: duplicates,
      });
    }
  } catch (err) {
    console.error('Error checking duplicates:', err);
  } finally {
    setCheckingDuplicates(false);
  }
}, []);
```

**Add useEffect to watch form fields:**
```javascript
useEffect(() => {
  const subscription = watch((value, { name }) => {
    if (name === 'firstName' || name === 'lastName' || name === 'dateOfBirth') {
      // Debounce duplicate check
      const timer = setTimeout(() => {
        if (value.firstName && value.lastName && value.dateOfBirth) {
          checkForDuplicates(value.firstName, value.lastName, value.dateOfBirth);
        }
      }, 1000); // Wait 1 second after user stops typing

      return () => clearTimeout(timer);
    }
  });
  return () => subscription.unsubscribe();
}, [watch, checkForDuplicates]);
```

**Add Duplicate Dialog Component:**
```javascript
<Dialog
  open={duplicateDialog.open}
  onClose={() => setDuplicateDialog({ open: false, duplicates: [] })}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>
    <Alert severity="warning" sx={{ mb: 2 }}>
      Potential Duplicate Patients Found
    </Alert>
  </DialogTitle>
  <DialogContent>
    <Typography variant="body2" sx={{ mb: 2 }}>
      The following patients have similar information. Please review before creating:
    </Typography>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Date of Birth</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {duplicateDialog.duplicates.map((dup) => (
            <TableRow key={dup._id || dup.id}>
              <TableCell>
                {dup.firstName} {dup.lastName}
              </TableCell>
              <TableCell>
                {dayjs(dup.dateOfBirth).format('MM/DD/YYYY')}
              </TableCell>
              <TableCell>{dup.phonePrimary || '-'}</TableCell>
              <TableCell>{dup.email || '-'}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  onClick={() => {
                    navigate(`/patients/${dup._id || dup.id}`);
                    setDuplicateDialog({ open: false, duplicates: [] });
                  }}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDuplicateDialog({ open: false, duplicates: [] })}>
      Cancel
    </Button>
    <Button
      variant="contained"
      onClick={() => {
        setDuplicateDialog({ open: false, duplicates: [] });
        // Continue with form submission
      }}
    >
      Continue Anyway
    </Button>
  </DialogActions>
</Dialog>
```

---

## 2. APT-06: Appointment Conflicts - UI Feedback Enhancement

### Current Status:
- ✅ Conflict detection already implemented in `AppointmentForm.jsx`
- ⚠️ UI feedback could be more prominent

### Current Implementation:
The code already has `checkAppointmentConflict()` function that:
- Checks available slots
- Checks for overlapping appointments
- Checks daily max appointments limit
- Sets `conflictError` state

### Enhancement Steps:

#### Make conflict error more visible:
**File:** `src/components/appointments/AppointmentForm.jsx`

**Add Alert component to display conflicts prominently:**
```javascript
{conflictError && (
  <Alert 
    severity="error" 
    sx={{ mb: 2 }}
    icon={<ErrorIcon />}
    action={
      <IconButton
        size="small"
        onClick={() => setConflictError('')}
      >
        <CloseIcon fontSize="inherit" />
      </IconButton>
    }
  >
    <Typography variant="body2" fontWeight="bold">
      Appointment Conflict Detected
    </Typography>
    <Typography variant="body2">
      {conflictError}
    </Typography>
  </Alert>
)}
```

**Add visual indicator on time picker:**
```javascript
<TimePicker
  // ... existing props
  slotProps={{
    textField: {
      error: !!conflictError,
      helperText: conflictError || 'Select appointment time',
      InputProps: {
        endAdornment: conflictError ? (
          <InputAdornment position="end">
            <Tooltip title="Time slot has conflicts">
              <ErrorIcon color="error" />
            </Tooltip>
          </InputAdornment>
        ) : null,
      },
    },
  }}
/>
```

**Add conflict summary in form:**
```javascript
{conflictError && (
  <Paper sx={{ p: 2, bgcolor: 'error.50', border: '1px solid', borderColor: 'error.main' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <ErrorIcon color="error" />
      <Typography variant="subtitle2" color="error" fontWeight="bold">
        Cannot Book Appointment
      </Typography>
    </Box>
    <Typography variant="body2" color="error">
      {conflictError}
    </Typography>
    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
      Please select a different time slot or provider.
    </Typography>
  </Paper>
)}
```

---

## 3. APT-07: Insurance Eligibility Status Display

### Current Status:
- ⚠️ Mentioned in `Appointment Flow.md` but UI unclear

### Implementation Steps:

#### Step 1: Fetch insurance eligibility when patient selected
**File:** `src/components/appointments/AppointmentForm.jsx`

**Add state:**
```javascript
const [insuranceEligibility, setInsuranceEligibility] = useState(null);
const [loadingEligibility, setLoadingEligibility] = useState(false);
```

**Add function to check eligibility:**
```javascript
const checkInsuranceEligibility = useCallback(async (patientId) => {
  if (!patientId) {
    setInsuranceEligibility(null);
    return;
  }

  try {
    setLoadingEligibility(true);
    // Assuming backend has endpoint: GET /patients/:id/insurance/eligibility
    const response = await patientService.getInsuranceEligibility(patientId);
    setInsuranceEligibility(response);
  } catch (err) {
    console.error('Error checking insurance eligibility:', err);
    setInsuranceEligibility({ status: 'unknown', message: 'Unable to verify eligibility' });
  } finally {
    setLoadingEligibility(false);
  }
}, []);
```

**Call when patient changes:**
```javascript
useEffect(() => {
  const patientId = watch('patientId');
  if (patientId) {
    checkInsuranceEligibility(patientId);
  }
}, [watch('patientId'), checkInsuranceEligibility]);
```

**Add Eligibility Status Display:**
```javascript
{insuranceEligibility && (
  <Grid size={{ xs: 12 }}>
    <Paper sx={{ p: 2, bgcolor: getEligibilityColor(insuranceEligibility.status) }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {loadingEligibility ? (
          <CircularProgress size={20} />
        ) : (
          <Chip
            icon={getEligibilityIcon(insuranceEligibility.status)}
            label={insuranceEligibility.status?.toUpperCase() || 'UNKNOWN'}
            color={getEligibilityChipColor(insuranceEligibility.status)}
            size="small"
          />
        )}
        <Typography variant="body2">
          Insurance Eligibility: {insuranceEligibility.message || insuranceEligibility.status}
        </Typography>
      </Box>
      {insuranceEligibility.details && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {insuranceEligibility.details}
        </Typography>
      )}
    </Paper>
  </Grid>
)}

// Helper functions
const getEligibilityColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'verified':
      return 'success.50';
    case 'pending':
      return 'warning.50';
    case 'failed':
    case 'inactive':
      return 'error.50';
    default:
      return 'grey.50';
  }
};

const getEligibilityIcon = (status) => {
  switch (status?.toLowerCase()) {
    case 'verified':
      return <CheckCircleIcon />;
    case 'pending':
      return <PendingIcon />;
    case 'failed':
      return <CancelIcon />;
    default:
      return <HelpIcon />;
  }
};

const getEligibilityChipColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'verified':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'error';
    default:
      return 'default';
  }
};
```

**Add to appointment list view:**
**File:** `src/pages/appointments/AppointmentsListPage.jsx`

Add eligibility column:
```javascript
<TableCell>Insurance Status</TableCell>

// In table body:
<TableCell>
  {appointment.patientId?.insuranceEligibility ? (
    <Chip
      label={appointment.patientId.insuranceEligibility.status}
      size="small"
      color={getEligibilityChipColor(appointment.patientId.insuranceEligibility.status)}
    />
  ) : (
    '-'
  )}
</TableCell>
```

---

## 4. PAY-04: Copay Collection at Check-in

### Current Status:
- ✅ `checkInAppointment()` API exists
- ✅ `copayCollected` field exists in appointment form
- ❌ Check-in workflow doesn't collect copay

### Implementation Steps:

#### Step 1: Create Check-in Dialog with Copay Collection
**File:** `src/pages/appointments/AppointmentsListPage.jsx` or create new component

**Add state:**
```javascript
const [checkInDialog, setCheckInDialog] = useState({
  open: false,
  appointment: null,
  copayAmount: 0,
});
```

**Add Check-in Dialog:**
```javascript
<Dialog
  open={checkInDialog.open}
  onClose={() => setCheckInDialog({ open: false, appointment: null, copayAmount: 0 })}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>Check-in Patient</DialogTitle>
  <DialogContent>
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Patient: {checkInDialog.appointment?.patientId?.firstName} {checkInDialog.appointment?.patientId?.lastName}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Appointment: {checkInDialog.appointment?.appointmentTypeId?.name || 'N/A'}
      </Typography>
    </Box>

    <TextField
      fullWidth
      label="Copay Amount"
      type="number"
      value={checkInDialog.copayAmount}
      onChange={(e) => setCheckInDialog({
        ...checkInDialog,
        copayAmount: parseFloat(e.target.value) || 0,
      })}
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      }}
      inputProps={{ min: 0, step: 0.01 }}
      helperText="Enter copay amount collected from patient"
      sx={{ mt: 2 }}
    />

    {checkInDialog.appointment?.patientId?.primaryInsurance?.copayAmount && (
      <Alert severity="info" sx={{ mt: 2 }}>
        Expected Copay: ${checkInDialog.appointment.patientId.primaryInsurance.copayAmount}
      </Alert>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setCheckInDialog({ open: false, appointment: null, copayAmount: 0 })}>
      Cancel
    </Button>
    <Button
      variant="contained"
      onClick={async () => {
        try {
          // First check-in the appointment
          await appointmentService.checkInAppointment(checkInDialog.appointment._id || checkInDialog.appointment.id);
          
          // Then record copay if amount > 0
          if (checkInDialog.copayAmount > 0) {
            // Update appointment with copay
            await appointmentService.updateAppointment(
              checkInDialog.appointment._id || checkInDialog.appointment.id,
              { copayCollected: checkInDialog.copayAmount }
            );

            // Optionally create payment record
            if (checkInDialog.appointment.patientId) {
              await paymentService.createPayment({
                patientId: checkInDialog.appointment.patientId._id || checkInDialog.appointment.patientId.id,
                amount: checkInDialog.copayAmount,
                paymentMethod: 'cash', // or get from form
                paymentType: 'copay',
                appointmentId: checkInDialog.appointment._id || checkInDialog.appointment.id,
                notes: 'Copay collected at check-in',
              });
            }
          }

          showSnackbar('Patient checked in successfully', 'success');
          setCheckInDialog({ open: false, appointment: null, copayAmount: 0 });
          fetchAppointments();
        } catch (err) {
          showSnackbar(
            err.response?.data?.error?.message || 'Failed to check in patient',
            'error'
          );
        }
      }}
    >
      Check In
    </Button>
  </DialogActions>
</Dialog>
```

**Update handleCheckIn function:**
```javascript
const handleCheckIn = async (appointment) => {
  // Get patient's expected copay from insurance
  const expectedCopay = appointment.patientId?.primaryInsurance?.copayAmount || 0;
  
  setCheckInDialog({
    open: true,
    appointment: appointment,
    copayAmount: expectedCopay, // Pre-fill with expected copay
  });
};
```

**Add to ViewAppointmentPage as well:**
**File:** `src/pages/appointments/ViewAppointmentPage.jsx`

Similar implementation for check-in button on view page.

---

## Summary

### Implementation Priority:
1. **PAT-REG-08** (High) - Prevents duplicate patient creation
2. **PAY-04** (High) - Core billing workflow
3. **APT-07** (Medium) - Better user experience
4. **APT-06** (Low) - Already works, just needs better UI

### Estimated Time:
- PAT-REG-08: 2-3 hours
- PAY-04: 2-3 hours
- APT-07: 3-4 hours (if backend endpoint exists)
- APT-06: 1 hour (UI enhancement)

**Total: 8-11 hours**

---

**Note:** For APT-07, verify backend has insurance eligibility endpoint. If not, coordinate with backend team to add it.
