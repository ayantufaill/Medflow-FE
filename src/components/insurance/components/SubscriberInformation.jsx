import { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Checkbox, FormControlLabel, IconButton, Stack, InputAdornment, MenuItem, Tooltip, Divider, Autocomplete, CircularProgress
} from "@mui/material";
import { 
  CheckCircle as CheckCircleIcon, 
  CalendarToday as CalendarIcon,
  PeopleOutline as PeopleIcon,
  Edit as EditIcon,
  InfoOutlined as InfoIcon
} from "@mui/icons-material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { patientService } from '../../../services/patient.service';
import FormInput from './FormInput';

const ASSIGNMENT_TOOLTIP_TEXT = "Assignment of Benefits is an authorization of payment. It indicates that the benefits paid from the insurance company will go directly to the office if pay to dentist is selected. It will also populate the signature of subscriber field on the claim form. If this is marked as non assignment the signature field on the claim form will be blank and payment will go directly to the patient.";
const RELEASE_INFO_TOOLTIP_TEXT = "With this check box selected, the subscriber authorizes the release of information to the practice.“Signature on File” populates box 36 on insurance claims. With this check box blank, box 36 will be empty.";

const SubscriberInformation = ({ 
  formData, 
  handleSubscriberChange, 
  handleInputChange,
  relationshipOptions = ['Self', 'Spouse', 'Child', 'Parent', 'Other'],
  assignmentOptions = [],
  inputBg,
  errors = {},
  patient,
  handleSubscriberSelect,
  onCreatePatient
}) => {
  const [showSsn, setShowSsn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedPatients, setSearchedPatients] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoadingSearch(true);
      try {
        const res = await patientService.getAllPatients(1, 20, searchQuery);
        setSearchedPatients(res.data || res.patients || res || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingSearch(false);
      }
    };
    const timeoutId = setTimeout(() => {
      fetchPatients();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Use API data or default arrays
  const relationships = relationshipOptions.length > 0 ? relationshipOptions : [
    'Self', 'Spouse', 'Child', 'Other Dependent', 'Employee', 
    'Organ Donor', 'Cadaver Donor', 'Life Partner', 'Unknown'
  ];
  const benefits = assignmentOptions.length > 0 ? assignmentOptions : [
    { value: 1, label: 'Pay to dentist (Assignment)' },
    { value: 2, label: 'Pay to patient (Benefit)' },
    { value: 3, label: 'Pay to both (Split)' }
  ];

  const householdData = patient?.patientMeta?.household || patient?.household;
  const householdMembers = Array.isArray(householdData) ? householdData : [];
  const familyOptions = householdMembers.map(m => {
    const name = m.name || `${m.firstName || ''} ${m.lastName || ''}`.trim();
    return {
      id: m._id || m.id,
      name,
      dateOfBirth: m.dateOfBirth || m.dob,
      ssn: m.ssn,
      relationship: m.relationship,
      subscriberId: m.subscriberId
    };
  });
  
  const spouseInfo = patient?.patientMeta?.spouseInfo || patient?.spouseInfo;
  if (spouseInfo) {
    const spouse = spouseInfo;
    const name = spouse.name || `${spouse.firstName || ''} ${spouse.lastName || ''}`.trim();
    if (name && !familyOptions.find(o => o.name === name)) {
      familyOptions.push({
        id: spouse._id || spouse.id,
        name,
        dateOfBirth: spouse.dateOfBirth || spouse.dob,
        ssn: spouse.ssn,
        relationship: 'Spouse',
        subscriberId: spouse.subscriberId
      });
    }
  }

  return (
    <Box sx={{ 
      border: '1px solid #DFE5EC', 
      borderRadius: '12px', 
      backgroundColor: '#FFFFFF', 
      display: 'flex', 
      flexDirection: 'column',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: '#f8f9fc', p: 1.5, borderBottom: '1px solid #DFE5EC' }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#e6f0fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 }}>
             <PeopleIcon sx={{ fontSize: 16, color: '#2563eb' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "0.9rem", mb: 0.1, letterSpacing: '-0.3px' }}>
              Subscriber Information
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: '#6b7280' }}>
              Policy holder details
            </Typography>
          </Box>
        </Box>
        <Box sx={{ bgcolor: '#f3f4f6', px: 1.5, py: 0.5, borderRadius: '50px', height: 'fit-content' }}>
          <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.8px', textTransform: 'uppercase' }}>REQUIRED</Typography>
        </Box>
      </Box>
      <Box sx={{ p: 1.5 }}>
      
      <Stack spacing={1.5} sx={{ mt: 1 }}>
        {/* Relationship Dropdown */}
        <FormInput
          select
          label="Patient Relationship to Subscriber"
          required
          value={formData.subscriber?.relationship || ''}
          onChange={(e) => handleSubscriberChange('relationship', e.target.value)}
        >
          {relationships.map(rel => (
            <MenuItem key={rel} value={rel} sx={{ fontSize: '14px' }}>{rel}</MenuItem>
          ))}
        </FormInput>

        {/* Name and ID */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <FormInput
              label="Subscriber Name"
              required
              renderInput={() => {
                const familyNames = familyOptions ? familyOptions.map(f => f.name) : [];
                const combinedOptions = familyOptions ? [...familyOptions] : [];
                searchedPatients.forEach(p => {
                  const pName = p.name || p.fullName || `${p.firstName || ''} ${p.lastName || ''}`.trim();
                  if (pName && !familyNames.includes(pName)) {
                    combinedOptions.push({
                      id: p._id || p.id,
                      name: pName,
                      dateOfBirth: p.dateOfBirth || p.dob,
                      ssn: p.ssn,
                      subscriberId: p.subscriberId
                    });
                  }
                });
                
                const valueOpt = combinedOptions.find(o => o.name === formData.subscriber?.name) || { name: formData.subscriber?.name || '' };

                return (
                  <Autocomplete
                    freeSolo
                    options={combinedOptions}
                    getOptionLabel={(option) => typeof option === 'string' ? option : option.name || ''}
                    value={formData.subscriber?.name ? valueOpt : null}
                    loading={loadingSearch}
                    onInputChange={(e, newInputValue) => {
                      setSearchQuery(newInputValue);
                    }}
                    onChange={(e, newValue) => {
                      if (typeof newValue === 'string') {
                        handleSubscriberChange('name', newValue);
                      } else if (newValue && newValue.name) {
                        if (handleSubscriberSelect) {
                          handleSubscriberSelect(newValue);
                        } else {
                          handleSubscriberChange('name', newValue.name);
                        }
                      } else {
                        handleSubscriberChange('name', '');
                      }
                    }}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        size="small" 
                        error={!!errors.subscriberName} 
                        helperText={errors.subscriberName} 
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingSearch ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                        sx={{ bgcolor: '#f8f9fc', '& .MuiInputBase-root': { fontSize: '14px', minHeight: '36px' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                      />
                    )}
                  />
                );
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <FormInput
              label="Subscriber ID"
              required
              value={formData.subscriber?.subscriberId || ''}
              onChange={(e) => {
                const alphanumericValue = e.target.value.replace(/[^a-zA-Z0-9\s-]/g, '');
                handleSubscriberChange('subscriberId', alphanumericValue);
              }}
              error={!!errors.subscriberId}
              helperText={errors.subscriberId}
            />
          </Box>
        </Box>

        {/* SSN */}
        <FormInput
          label="Subscriber Social Security Number"
          type="password"
          placeholder="•••-••-••••"
          value={formData.subscriber?.ssn || ''}
          onChange={(e) => handleSubscriberChange('ssn', e.target.value)}
          sx={{ '& .MuiInputBase-root': { letterSpacing: '2px' } }}
        />

        {/* Date of Birth */}
        <FormInput
          label="Date of Birth"
          required
          renderInput={() => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="MM/DD/YYYY"
                value={formData.subscriber?.dateOfBirth ? dayjs(formData.subscriber.dateOfBirth) : null}
                onChange={(newValue) => {
                  if (newValue) {
                    handleSubscriberChange('dateOfBirth', newValue.format('YYYY-MM-DD'));
                  } else {
                    handleSubscriberChange('dateOfBirth', '');
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    error: !!errors.dateOfBirth,
                    helperText: errors.dateOfBirth,
                    sx: {
                      bgcolor: '#f8f9fc',
                      '& .MuiInputBase-root': {
                        fontSize: '14px',
                        height: '36px'
                      },
                      '& fieldset': { borderColor: '#DFE5EC' },
                    }
                  }
                }}
              />
            </LocalizationProvider>
          )}
        />
      </Stack>

      {/* Assignment and Release Info */}
      <Box sx={{ display: 'flex', gap: 2, mb: 1, mt: 3, alignItems: 'flex-end' }}>
        <Box sx={{ flex: 1 }}>
          <FormInput
            select
            label="Assignment of Benefit to"
            labelEndAdornment={
              <Tooltip
                PopperProps={{ sx: { zIndex: 999999 } }}
                title={
                  <Typography sx={{ fontSize: '11.5px', color: '#1e3a8a', lineHeight: 1.45, fontWeight: 500, p: 0.5 }}>
                    {ASSIGNMENT_TOOLTIP_TEXT}
                  </Typography>
                }
                placement="top"
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: '#ffffff',
                      color: '#1e3a8a',
                      border: '1px solid #1e3a8a',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                      borderRadius: '6px',
                      maxWidth: 290,
                      p: 1,
                      '& .MuiTooltip-arrow': {
                        color: '#ffffff',
                        '&::before': {
                          border: '1px solid #1e3a8a',
                          backgroundColor: '#ffffff',
                        },
                      },
                    },
                  },
                }}
              >
                <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd', cursor: 'pointer', '&:hover': { color: '#2563eb' } }} />
              </Tooltip>
            }
            value={formData.assignmentOfBenefits || 1}
            onChange={(e) => handleInputChange('assignmentOfBenefits', e.target.value)}
          >
            {benefits.map(option => (
              <MenuItem key={option.value} value={option.value} sx={{ fontSize: '14px' }}>{option.label}</MenuItem>
            ))}
          </FormInput>
        </Box>
        
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0.5, height: '36px' }}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={formData.releaseInfo} 
                onChange={(e) => handleInputChange('releaseInfo', e.target.checked)}
                size="small" 
                sx={{ py: 0 }}
              />
            }
            label={<Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Release info</Typography>}
            sx={{ m: 0 }}
          />
          <Tooltip
            PopperProps={{ sx: { zIndex: 999999 } }}
            title={
              <Typography sx={{ fontSize: '11.5px', color: '#1e3a8a', lineHeight: 1.45, fontWeight: 500, p: 0.5 }}>
                {RELEASE_INFO_TOOLTIP_TEXT}
              </Typography>
            }
            placement="top"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: '#ffffff',
                  color: '#1e3a8a',
                  border: '1px solid #1e3a8a',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                  borderRadius: '6px',
                  maxWidth: 270,
                  p: 1,
                  '& .MuiTooltip-arrow': {
                    color: '#ffffff',
                    '&::before': {
                      border: '1px solid #1e3a8a',
                      backgroundColor: '#ffffff',
                    },
                  },
                },
              },
            }}
          >
            <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd', cursor: 'pointer', '&:hover': { color: '#2563eb' } }} />
          </Tooltip>
        </Box>
      </Box>
      </Box>
    </Box>
  );
};

export default SubscriberInformation;