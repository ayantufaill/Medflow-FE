import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Grid, Typography, CircularProgress, IconButton, Button, TextField, MenuItem
} from "@mui/material";
import { 
  Book as BookIcon,
  ArrowBack as ArrowBackIcon,
  InfoOutlined as InfoIcon
} from "@mui/icons-material";
import { useSnackbar } from '../../contexts/SnackbarContext';
import { patientService } from '../../services/patient.service';
import { insuranceCompanyService } from '../../services/insurance.service';
import {
  InsuranceInformation,
  SubscriberInformation,
  RenewalSection,
  DeductiblesTable,
  CoverageTable,
  PolicyNotes,
  CoverageBookSummary
} from '../../components/insurance';

const AddCoveragePage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState(null);
  const [allCompanies, setAllCompanies] = useState({ companies: [] });
  
  // Form state
  const [formData, setFormData] = useState({
    carrierName: '',
    payerId: '',
    carrierPhone: '',
    payerAddress: '',
    planInfo: false,
    insurancePlan: '',
    groupName: '',
    groupNumber: '',
    phoneNumber: '',
    healthPlan: false,
    assignmentOfBenefits: 1,
    saveAsTemplate: false,
    planFeeGuide: 'careington',
    coverageType: 'ppo',
    deductibles: [
      { type: 'Standard', lifetime: false, standard: false, individual: '$50.00', family: '$150.00', metAmount: '$50.00', metDate: '03/03/2026' },
      { type: 'Preventative', lifetime: false, standard: false, individual: '$0.00', family: '$0.00', metAmount: '$0.00', metDate: '03/03/2026' },
      { type: 'Basic', lifetime: false, standard: true, individual: '', family: '', metAmount: '', metDate: '' },
      { type: 'Major', lifetime: false, standard: true, individual: '', family: '', metAmount: '', metDate: '' },
      { type: 'Orthodontics', lifetime: false, standard: false, individual: '$0.00', family: '$0.00', metAmount: '$0.00', metDate: '03/03/2026' }
    ],
    coverage: {
      individual: {
        unlimited: false,
        annualMax: '$1,500.00',
        usedAmount: '$158.00',
        usedAmountDate: ''
      },
      family: {
        unlimited: true,
        annualMax: '',
        usedAmount: '',
        usedAmountDate: ''
      },
      ortho: {
        annualMax: '$2,000.00',
        usedAmount: '$18.00',
        usedAmountDate: '03/03/2026'
      },
      categories: ['Diagnostic', 'Preventative', 'Major']
    },
    subscriber: {
      relationship: 'Self',
      name: '',
      subscriberId: '',
      ssn: '',
      dateOfBirth: ''
    },
    renewalMonth: 'January',
    policyStarted: '',
    policyEnds: '',
    honorWriteOff: true
  });

  // Coverage book data state
  const [coverageBookData, setCoverageBookData] = useState([
    { code: 'CNANOHA', name: 'Alternative to Fl- varnish', age: '18', maxAllowed: '', frequency1: '', frequency2: '', period: 'M', lifetimeLimit: '', hasDowngrade: false, downgrade: '', nc: false, flatPlanPortion: '' },
    { code: 'D1206', name: 'topical application of fluoride var...', age: '18', maxAllowed: '', frequency1: '', frequency2: '', period: 'M', lifetimeLimit: '', hasDowngrade: false, downgrade: '', nc: false, flatPlanPortion: '' },
    { code: 'D1208', name: 'topical application of fluoride - ex...', age: '18', maxAllowed: '', frequency1: '', frequency2: '', period: 'M', lifetimeLimit: '', hasDowngrade: false, downgrade: '', nc: false, flatPlanPortion: '' },
    { code: 'D1351', name: 'sealant - per tooth', age: '15', maxAllowed: '', frequency1: '', frequency2: '', period: 'M', lifetimeLimit: '', hasDowngrade: false, downgrade: '', nc: false, flatPlanPortion: '' },
    { code: 'D2740', name: 'crown - porcelain/ceramic substr...', age: '18', maxAllowed: '', frequency1: '', frequency2: '', period: 'M', lifetimeLimit: '', hasDowngrade: true, downgrade: 'D2790', nc: false, flatPlanPortion: '' },
    { code: 'D2750', name: 'crown - porcelain fused to high no...', age: '18', maxAllowed: '', frequency1: '', frequency2: '', period: 'M', lifetimeLimit: '', hasDowngrade: true, downgrade: 'D2790', nc: false, flatPlanPortion: '' }
  ]);

  // Static data arrays for easy API replacement
  // Static data arrays for easy API replacement
  const ASSIGNMENT_OF_BENEFITS_OPTIONS = [
    { value: 1, label: 'Pay to dentist (Assignment)' },
    { value: 2, label: 'Pay to patient (Benefit)' },
    { value: 3, label: 'Pay to both (Split)' }
  ];

  const COVERAGE_TYPES = [
    { value: 'ppo', label: 'Percentage Based Coverage (PPO)' },
    { value: 'flat', label: 'Flat Fee Coverage' },
    { value: 'ucr', label: 'UCR Based Coverage' }
  ];

  const PLAN_FEE_GUIDE_OPTIONS = [
    { value: 'careington', label: 'Careington PPO Platinum (directly in network)' },
    { value: 'metlife', label: 'MetLife PPO Plus' },
    { value: 'delta', label: 'Delta Dental PPO' }
  ];

  const ActionText = ({ icon: Icon, text, color = "#4db6ac" }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', ml: 1 }}>
      <Icon sx={{ fontSize: 14, color }} />
      <Typography sx={{ fontSize: '0.65rem', color, fontWeight: 600 }}>{text}</Typography>
    </Box>
  );

  // Style constants
  const blueHeader = "#f0f4f8";
  const sectionTitle = { fontWeight: 700, mb: 1, color: "#333", fontSize: "0.85rem" };
  const tinyText = { fontSize: '0.7rem' };
  const tableHeaderStyle = { 
    fontSize: '0.65rem', 
    fontWeight: 700, 
    color: "#555", 
    borderRight: '1px solid #e0e0e0',
    py: 0.5,
    lineHeight: 1.1,
    whiteSpace: 'normal',
    wordWrap: 'break-word'
  };
  const inputBg = "#f9fafb";
  
  const headerStyle = { 
    fontSize: '0.65rem', 
    fontWeight: 700, 
    color: "#555", 
    borderRight: '1px solid #e0e0e0',
    py: 0.5 
  };

  const bodyCellStyle = { 
    fontSize: '0.75rem', 
    borderRight: '1px solid #eee',
    py: 0.2,
    height: '35px'
  };

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const [patientData, companies] = await Promise.all([
        patientService.getPatientWorkspace(patientId),
        insuranceCompanyService.getAllInsuranceCompanies(1, 500),
      ]);
      setPatient(patientData);
      setAllCompanies(companies || { companies: [] });
    } catch (err) {
      console.error('Failed to load patient data', err);
      showSnackbar('Failed to load patient data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // await insuranceService.addCoverage(patientId, formData);
      console.log('Saving coverage data:', formData);
      showSnackbar('Coverage saved successfully', 'success');
      navigate(`/patients/details/${patientId}?tab=insurance`);
    } catch (err) {
      console.error('Failed to save coverage', err);
      showSnackbar('Failed to save coverage', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/patients/details/${patientId}?tab=insurance`);
  };

  const handleCoverageChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      coverage: {
        ...prev.coverage,
        [type]: {
          ...prev.coverage[type],
          [field]: value
        }
      }
    }));
  };

  const handleRemoveOrthoMax = () => {
    setFormData(prev => ({
      ...prev,
      coverage: {
        ...prev.coverage,
        ortho: {
          annualMax: '',
          usedAmount: '',
          usedAmountDate: ''
        }
      }
    }));
  };

  const handleAddCategoryMax = (category) => {
    console.log('Add max for category:', category);
    // TODO: Implement add category max logic
  };

  const handleSubscriberChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      subscriber: {
        ...prev.subscriber,
        [field]: value
      }
    }));
  };

  const handleRenewalChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeductibleChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      deductibles: prev.deductibles.map((deductible, i) => 
        i === index ? { ...deductible, [field]: value } : deductible
      )
    }));
  };

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      {/* Top Header Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1.5, borderBottom: '1px solid #ddd', position: 'relative' }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: '0.9rem' }}>
          Add a Coverage for {patient ? `${patient.firstName} ${patient.lastName}` : 'Patient'}
        </Typography>
        <Box sx={{ position: 'absolute', right: '1.5rem', display: 'flex', gap: 0.5 }}>
          <IconButton size="small"><BookIcon fontSize="small" /></IconButton>
          <Button variant="outlined" size="small" onClick={handleCancel} sx={{ textTransform: 'none', color: '#666', borderColor: '#ccc', fontSize: '0.75rem', px: 1.5 }}>Cancel</Button>
          <Button variant="contained" size="small" onClick={handleSave} disabled={loading} sx={{ bgcolor: '#4caf50', textTransform: 'none', fontSize: '0.75rem', px: 2 }}>Save</Button>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={1} sx={{ p: 2 }}>
        
        {/* LEFT COLUMN: Insurance & Subscriber Info */}
        <Grid item xs={12} lg={4} sx={{ borderRight: { md: '1px solid #eee' }, pr: { md: 1.5 }, mb: { xs: 1.5, md: 0 } }}>
          <InsuranceInformation 
            formData={formData}
            handleInputChange={handleInputChange}
            ASSIGNMENT_OF_BENEFITS_OPTIONS={ASSIGNMENT_OF_BENEFITS_OPTIONS}
            tinyText={tinyText}
            blueHeader={blueHeader}
            inputBg={inputBg}
          />
          
          <SubscriberInformation
            formData={formData}
            handleSubscriberChange={handleSubscriberChange}
            handleInputChange={handleInputChange}
            ASSIGNMENT_OF_BENEFITS_OPTIONS={ASSIGNMENT_OF_BENEFITS_OPTIONS}
            inputBg={inputBg}
          />
          
          <RenewalSection
            formData={formData}
            handleRenewalChange={handleRenewalChange}
            inputBg={inputBg}
          />
          
          {/* Advanced Section */}
          <Typography sx={{ ...sectionTitle, mt: 3, mb: 1.5, fontSize: '0.8rem' }}>Advanced</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={5.5}>
              <TextField 
                fullWidth 
                label="Member Identifier" 
                size="small" 
                sx={{ 
                  bgcolor: inputBg,
                  '& .MuiInputBase-input': { fontSize: '0.7rem', py: 0.8 },
                  '& .MuiInputLabel-root': { fontSize: '0.65rem' }
                }} 
              />
            </Grid>
            <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd', mt: 0.5 }} />
            
            <Grid item xs={5.5}>
              <TextField 
                fullWidth 
                label="Card Sequence" 
                size="small" 
                sx={{ 
                  bgcolor: inputBg,
                  '& .MuiInputBase-input': { fontSize: '0.7rem', py: 0.8 },
                  '& .MuiInputLabel-root': { fontSize: '0.65rem' }
                }} 
              />
              <Typography variant="caption" sx={{ fontSize: '0.55rem', color: '#999', display: 'block', mt: 0.5 }}>
                Required for Dentaide card
              </Typography>
            </Grid>
            <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd', mt: -2 }} />
          </Grid>
          
          <PolicyNotes />
        </Grid>

        {/* RIGHT COLUMN: Fee Guides & Tables */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={1.5}>
            <Grid item xs={12} md={6.5}>
              <Typography sx={sectionTitle}>Plan Fee Guide</Typography>
              <Box sx={{ display: 'flex', gap: 0.3, alignItems: 'center' }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={formData.planFeeGuide}
                  onChange={(e) => handleInputChange('planFeeGuide', e.target.value)}
                  sx={{ 
                    bgcolor: '#eef4ff', 
                    '& .MuiInputBase-root': { fontSize: '0.65rem' }, 
                    minWidth: '160px',
                    '& fieldset': { border: 'none' }
                  }}
                >
                  {PLAN_FEE_GUIDE_OPTIONS.map(option => (
                    <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.65rem' }}>{option.label}</MenuItem>
                  ))}
                </TextField>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ textTransform: 'none', fontSize: '0.6rem', height: '28px', borderColor: '#ccc', color: '#333', px: 0.5, minWidth: 'auto', whiteSpace: 'nowrap' }}
                >
                  View Fee Guide
                </Button>
              </Box>
              <Typography sx={{ color: '#000000ff', fontSize: '0.85rem', mt: 0.3, cursor: 'pointer', fontWeight: 600 }}>
                Providers Plan Fee Guides
              </Typography>
              <Typography sx={{ color: '#1976d2', fontSize: '0.65rem', mt: 0.3, cursor: 'pointer' }}>
                + Add
              </Typography>
            </Grid>

            <Grid item xs={12} md={5.5}>
              <Typography sx={sectionTitle}>
                Coverage Type <InfoIcon sx={{ fontSize: 11, verticalAlign: 'middle', ml: 0.5, color: '#999' }} />
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={formData.coverageType}
                onChange={(e) => handleInputChange('coverageType', e.target.value)}
                sx={{ 
                  bgcolor: '#eef4ff', 
                  '& .MuiInputBase-root': { fontSize: '0.65rem' },
                  '& fieldset': { border: 'none' }
                }}
              >
                {COVERAGE_TYPES.map(option => (
                  <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.65rem' }}>{option.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <DeductiblesTable
            formData={formData}
            handleDeductibleChange={handleDeductibleChange}
            tableHeaderStyle={tableHeaderStyle}
            blueHeader={blueHeader}
          />

          <CoverageTable
            formData={formData}
            handleCoverageChange={handleCoverageChange}
            handleInputChange={handleInputChange}
            handleRemoveOrthoMax={handleRemoveOrthoMax}
            handleAddCategoryMax={handleAddCategoryMax}
            headerStyle={headerStyle}
            bodyCellStyle={bodyCellStyle}
            blueHeader={blueHeader}
            ActionText={ActionText}
          />

          <CoverageBookSummary 
            headerStyle={headerStyle}
            bodyCellStyle={bodyCellStyle}
            blueHeader={blueHeader}
            coverageData={coverageBookData}
            onCoverageDataChange={setCoverageBookData}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddCoveragePage;