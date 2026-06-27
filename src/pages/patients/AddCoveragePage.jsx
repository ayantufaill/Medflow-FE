import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Grid, Typography, CircularProgress, IconButton, Button, TextField, MenuItem, InputAdornment
} from "@mui/material";
import { 
  Book as BookIcon,
  ArrowBack as ArrowBackIcon,
  InfoOutlined as InfoIcon,
  DeleteOutlined as DeleteIcon
} from "@mui/icons-material";
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useInsuranceCatalog } from '../../hooks/redux/useInsuranceCatalog';
import { usePatientInsurance } from '../../hooks/redux/usePatientInsurance';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFeeGuides, selectFeeGuides, selectFeeGuidesLoading } from '../../store/slices/feeGuideSlice';
import { usePatient } from '../../hooks/redux/usePatient';
import {
  InsuranceInformation,
  SubscriberInformation,
  RenewalSection,
  DeductiblesTable,
  CoverageTable,
  PolicyNotes,
  CoverageBookSummary,
  FeeGuideModal,
  CoverageBookModal,
  COVERAGE_DATA
} from '../../components/insurance';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';

const AddCoveragePage = () => {
  const { patientId, insuranceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  
  const { companies: allCompanies, companiesLoading, templates: coverageTemplates, templatesLoading, fetchCompanies, fetchTemplates } = useInsuranceCatalog();
  const { currentPatient: patient, fetchById: fetchPatient } = usePatient();
  const { insurances, fetch: fetchInsurances, create: createInsurance, update: updateInsurance } = usePatientInsurance(patientId);

  const feeGuides = useSelector(selectFeeGuides);
  const feeGuidesLoading = useSelector(selectFeeGuidesLoading);

  const [isFeeGuideModalOpen, setIsFeeGuideModalOpen] = useState(false);
  const [isCoverageBookModalOpen, setIsCoverageBookModalOpen] = useState(false);
  const [templateToApply, setTemplateToApply] = useState(null);
  const [isTemplateConfirmOpen, setIsTemplateConfirmOpen] = useState(false);
  
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
    planFeeGuide: '',
    coverageType: 'ppo',
    providersPlanFeeGuides: [],
    deductibles: [
      { type: 'Standard', lifetime: false, standard: false, individual: '', family: '', metAmount: '', metDate: '' },
      { type: 'Preventative', lifetime: false, standard: false, individual: '', family: '', metAmount: '', metDate: '' },
      { type: 'Basic', lifetime: false, standard: false, individual: '', family: '', metAmount: '', metDate: '' },
      { type: 'Major', lifetime: false, standard: false, individual: '', family: '', metAmount: '', metDate: '' },
      { type: 'Orthodontics', lifetime: false, standard: false, individual: '', family: '', metAmount: '', metDate: '' }
    ],
    coverage: {
      individual: {
        unlimited: false,
        annualMax: '',
        usedAmount: '',
        usedAmountDate: ''
      },
      family: {
        unlimited: false,
        annualMax: '',
        usedAmount: '',
        usedAmountDate: ''
      },
      ortho: {
        unlimited: false,
        annualMax: '',
        usedAmount: '',
        usedAmountDate: ''
      },
      diagnostic: { unlimited: false, annualMax: '' },
      preventative: { unlimited: false, annualMax: '' },
      major: { unlimited: false, annualMax: '' },
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
    policyStarted: new Date().toISOString().split('T')[0],
    policyEnds: '',
    honorWriteOff: false
  });

  const [errors, setErrors] = useState({});
  const [coverageBookData, setCoverageBookData] = useState([]);
  const [coverageCategoryData, setCoverageCategoryData] = useState(insuranceId ? {} : COVERAGE_DATA);

  // Static data arrays for easy API replacement
  // Static data arrays for easy API replacement
  const ASSIGNMENT_OF_BENEFITS_OPTIONS = [
    { value: 1, label: 'Pay to dentist (Assignment)' },
    { value: 2, label: 'Pay to patient (Benefit)' },
    { value: 3, label: 'Pay to both (Split)' }
  ];

  const COVERAGE_TYPES = [
    { value: 'ppo', label: 'Percentage Based Coverage (PPO)' },
    { value: 'table', label: 'Table/Schedule of Benefits' },
    { value: 'flat', label: 'Flat Fee' }
  ];

  const planFeeGuideOptions = feeGuides.map(fg => ({
    value: fg._id || fg.FeeSchedNum || fg.feeSchedNum || fg.id,
    label: fg.Description || fg.description || fg.name || 'Unknown Fee Guide'
  }));

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
      fetchPatient(patientId);
    }
  }, [patientId, fetchPatient]);

  const initialFetchRef = useRef({ companies: false, templates: false });

  useEffect(() => {
    if ((!allCompanies || allCompanies.length === 0) && !companiesLoading && !initialFetchRef.current.companies) {
      initialFetchRef.current.companies = true;
      fetchCompanies();
    }
    if ((!coverageTemplates || coverageTemplates.length === 0) && !templatesLoading && !initialFetchRef.current.templates) {
      initialFetchRef.current.templates = true;
      fetchTemplates();
    }
  }, [allCompanies, coverageTemplates, companiesLoading, templatesLoading, fetchCompanies, fetchTemplates]);

  useEffect(() => {
    if (feeGuides.length === 0 && !feeGuidesLoading) {
      dispatch(fetchFeeGuides());
    }
  }, [dispatch, feeGuides.length, feeGuidesLoading]);

  useEffect(() => {
    // Only fetch existing insurances if we are editing an existing policy
    if (patientId && insuranceId && insurances.length === 0) fetchInsurances();
  }, [patientId, insuranceId, insurances.length, fetchInsurances]);

  useEffect(() => {
  const loadData = async () => {
    try {
      if (patientId && insuranceId && insurances.length > 0 && allCompanies && allCompanies.length > 0) {
        const editTarget = insurances.find(ins => (ins._id || ins.id) === insuranceId);

        if (editTarget) {
          const monthMapReverse = {
            1: 'January', 2: 'February', 3: 'March', 4: 'April',
            5: 'May', 6: 'June', 7: 'July', 8: 'August',
            9: 'September', 10: 'October', 11: 'November', 12: 'December'
          };

          const fullCompany = allCompanies.find(
            c => (c._id || c.id) === (editTarget.insuranceCompanyId?._id || editTarget.insuranceCompanyId)
          );

          setFormData(prev => ({
            ...prev,
            insuranceCompanyId: editTarget.insuranceCompanyId?._id || editTarget.insuranceCompanyId,
            carrierName: editTarget.insuranceCompanyId?.name || '',
            payerId: editTarget.insuranceCompanyId?.payerId || '',
            carrierPhone: fullCompany?.phone || editTarget.insuranceCompanyId?.phone || '',
            payerAddress: fullCompany?.addressLine1 || editTarget.insuranceCompanyId?.addressLine1 || fullCompany?.city || editTarget.insuranceCompanyId?.city || '',
            phoneNumber: fullCompany?.phone || editTarget.insuranceCompanyId?.phone || '',
            groupNumber: editTarget.groupNumber || '',
            groupName: editTarget.groupName || '',
            insurancePlan: editTarget.insurancePlan?.name || editTarget.insurancePlan || fullCompany?.name || editTarget.insuranceCompanyId?.name || '',
            insuranceType: editTarget.insuranceType || 'primary',
            planFeeGuide: editTarget.planFeeGuide || '',
            coverageType: editTarget.coverageType || 'ppo',
            assignmentOfBenefits: parseInt(editTarget.assignmentOfBenefits) || 1,
            honorWriteOff: editTarget.honorWriteOff || false,
            renewalMonth: monthMapReverse[editTarget.renewalMonth] || 'January',
            policyStarted: editTarget.effectiveDate
              ? new Date(editTarget.effectiveDate).toISOString().split('T')[0]
              : prev.policyStarted,
            policyEnds: editTarget.expirationDate
              ? new Date(editTarget.expirationDate).toISOString().split('T')[0]
              : '',
            subscriber: {
              ...prev.subscriber,
              relationship: editTarget.relationshipToPatient?.charAt(0).toUpperCase() +
                editTarget.relationshipToPatient?.slice(1) || 'Self',
              name: editTarget.subscriberName || '',
              subscriberId: editTarget.policyNumber || '',
              ssn: editTarget.subscriberSsn || '',
              dateOfBirth: editTarget.subscriberDateOfBirth
                ? new Date(editTarget.subscriberDateOfBirth).toISOString().split('T')[0]
                : ''
            },
            deductibles: editTarget.deductiblesGrid?.length ? editTarget.deductiblesGrid : prev.deductibles,
            coverage: editTarget.coverageLimits || prev.coverage,

            providersPlanFeeGuides: editTarget.providersPlanFeeGuides || [],
            policyNotes: editTarget.policyNotes || '',
            eligibilityPolicyNotes: editTarget.eligibilityPolicyNotes || '',
            insurancePlanNotes: editTarget.insurancePlanNotes || '',
            healthPlan: editTarget.healthPlan || false,
            paymentPlan: editTarget.paymentPlan || ''
          }));

          if (editTarget.coverageBookData) {
            setCoverageBookData(editTarget.coverageBookData);
          }

          if (editTarget.coverageCategoryTable) {
            const covDataArray = editTarget.coverageCategoryTable;
            if (Array.isArray(covDataArray) && covDataArray.length > 0) {
              if (typeof covDataArray[0] === 'object' && covDataArray[0].category) {
                const covData = {};
                covDataArray.forEach(group => {
                  covData[group.category] = group.items;
                });
                setCoverageCategoryData(covData);
              } else if (typeof covDataArray[0] === 'object' && !covDataArray[0].category) {
                setCoverageCategoryData(covDataArray);
              }
            } else if (covDataArray && !Array.isArray(covDataArray)) {
              setCoverageCategoryData(covDataArray);
            } else {
              setCoverageCategoryData({});
            }
          } else {
            setCoverageCategoryData({});
          }
        }
      }
    } catch (err) {
      console.error('Failed to load data', err);
      showSnackbar('Failed to load required data', 'error');
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [patientId, insuranceId, insurances, allCompanies]);

  useEffect(() => {
    if (patient && formData.subscriber.relationship === 'Self' && !formData.subscriber.name) {
      const { firstName, lastName, dateOfBirth, ssn } = patient;
      const fullName = `${firstName || ''} ${lastName || ''}`.trim();
      setFormData(prev => ({
        ...prev,
        subscriber: {
          ...prev.subscriber,
          name: fullName || prev.subscriber.name,
          dateOfBirth: dateOfBirth ? dateOfBirth.split('T')[0] : prev.subscriber.dateOfBirth,
          ssn: ssn || prev.subscriber.ssn
        }
      }));
    }
  }, [patient]);


  const handleSave = async () => {
    try {
      if (!patientId) {
        showSnackbar('Cannot save coverage: No patient selected. Please navigate to a specific patient\'s dashboard to add coverage.', 'error');
        return;
      }

      const newErrors = {};

      if (!formData.insuranceCompanyId || !formData.payerId) {
        newErrors.insuranceCompanyId = 'Please search and select a carrier';
      }

      if (!formData.insurancePlan?.trim()) {
        newErrors.insurancePlan = 'Insurance Plan is required';
      }

      if (!formData.groupName?.trim()) {
        newErrors.groupName = 'Group Name is required';
      }

      if (!formData.groupNumber?.trim()) {
        newErrors.groupNumber = 'Group Number is required';
      } else if (!/^[A-Za-z0-9]+$/.test(formData.groupNumber)) {
        newErrors.groupNumber = 'Group Number must be alphanumeric only';
      }

      if (!formData.subscriber.name?.trim()) {
        newErrors.subscriberName = 'Subscriber Name is required';
      } else if (!/^[A-Za-z\s'-]+$/.test(formData.subscriber.name)) {
        newErrors.subscriberName = 'Subscriber Name can only contain letters, spaces, hyphens, and apostrophes';
      }

      if (!formData.subscriber.subscriberId?.trim()) {
        newErrors.subscriberId = 'Subscriber ID is required';
      } else if (formData.subscriber.subscriberId.length < 5 || formData.subscriber.subscriberId.length > 30) {
        newErrors.subscriberId = 'Subscriber ID must be between 5 and 30 characters';
      } else if (!/^[A-Za-z0-9]+$/.test(formData.subscriber.subscriberId)) {
        newErrors.subscriberId = 'Subscriber ID must be alphanumeric only';
      }

      if (!formData.subscriber.dateOfBirth) {
        newErrors.dateOfBirth = 'Subscriber Date of Birth is required';
      } else {
        const dob = new Date(formData.subscriber.dateOfBirth);
        const today = new Date();
        if (dob > today) {
          newErrors.dateOfBirth = 'Date of birth must be in the past';
        } else {
          let age = today.getFullYear() - dob.getFullYear();
          const monthDiff = today.getMonth() - dob.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
          }
          if (age >= 120) {
            newErrors.dateOfBirth = 'Subscriber age must be less than 120 years';
          }
        }
      }

      if (!formData.policyStarted) {
        newErrors.policyStarted = 'Policy Started date is required';
      }

      if (formData.policyEnds && formData.policyStarted) {
        const effectiveDate = new Date(formData.policyStarted);
        const expirationDate = new Date(formData.policyEnds);
        if (expirationDate <= effectiveDate) {
          newErrors.policyEnds = 'Policy ends date must be after policy started date';
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        showSnackbar('Please correct the highlighted errors', 'error');
        return;
      }

      setErrors({});
      setLoading(true);
      
      // Map UI state to backend validator requirements
      const monthMap = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12 };
      const renewalMonthNum = monthMap[formData.renewalMonth] || 1;

      const payload = {
        insuranceCompanyId: String(formData.insuranceCompanyId || '1'),
        policyNumber: formData.subscriber.subscriberId,
        groupNumber: formData.groupNumber || undefined,
        groupName: formData.groupName || undefined,
        subscriberName: formData.subscriber.name,
        subscriberDateOfBirth: new Date(formData.subscriber.dateOfBirth).toISOString(),
        relationshipToPatient: formData.subscriber.relationship.toLowerCase(),
        insuranceType: 'primary', // Hardcoded as primary for initial coverage
        effectiveDate: new Date(formData.policyStarted).toISOString(),
        expirationDate: formData.policyEnds ? new Date(formData.policyEnds).toISOString() : undefined,
        deductibleAmount: parseFloat(formData.deductibles[0]?.individual?.replace(/[^0-9.-]+/g, "")) || 0,
        
        // Advanced Dentistry Fields
        deductiblesGrid: formData.deductibles,
        coverageLimits: formData.coverage,
        coverageCategoryTable: Object.entries(coverageCategoryData || {}).map(([key, items]) => ({ category: key, items })),
        coverageBookData: coverageBookData,
        planFeeGuide: formData.planFeeGuide,
        coverageType: formData.coverageType,
        subscriberSsn: formData.subscriber.ssn || undefined,
        renewalMonth: renewalMonthNum,
        assignmentOfBenefits: formData.assignmentOfBenefits.toString(),
        honorWriteOff: formData.honorWriteOff,
        
        // Notes
        policyNotes: formData.policyNotes || undefined,
        eligibilityPolicyNotes: formData.eligibilityPolicyNotes || undefined,
        insurancePlanNotes: formData.insurancePlanNotes || undefined,

        // newly supported fields
        providersPlanFeeGuides: formData.providersPlanFeeGuides,
        healthPlan: formData.healthPlan,
        paymentPlan: formData.paymentPlan
      };

      if (insuranceId) {
        await updateInsurance(insuranceId, payload).unwrap();
        showSnackbar('Coverage updated successfully', 'success');
      } else {
        await createInsurance(payload).unwrap();
        showSnackbar('Coverage saved successfully. Any unbilled procedures have been converted to unsent claims.', 'success');
      }
      
      navigate(`/patients/details/${patientId}?tab=insurance`);
    } catch (err) {
      console.error('Failed to save coverage', err);
      
      // Parse backend validation errors if any
      const backendErrors = err?.data?.error?.errors;
      if (backendErrors && typeof backendErrors === 'object') {
        const mappedErrors = {};
        if (backendErrors.policyNumber) {
          mappedErrors.subscriberId = Array.isArray(backendErrors.policyNumber) ? backendErrors.policyNumber[0] : backendErrors.policyNumber;
        }
        if (backendErrors.subscriberName) {
          mappedErrors.subscriberName = Array.isArray(backendErrors.subscriberName) ? backendErrors.subscriberName[0] : backendErrors.subscriberName;
        }
        if (backendErrors.subscriberDateOfBirth) {
          mappedErrors.dateOfBirth = Array.isArray(backendErrors.subscriberDateOfBirth) ? backendErrors.subscriberDateOfBirth[0] : backendErrors.subscriberDateOfBirth;
        }
        if (backendErrors.effectiveDate) {
          mappedErrors.policyStarted = Array.isArray(backendErrors.effectiveDate) ? backendErrors.effectiveDate[0] : backendErrors.effectiveDate;
        }
        if (backendErrors.groupNumber) {
          mappedErrors.groupNumber = Array.isArray(backendErrors.groupNumber) ? backendErrors.groupNumber[0] : backendErrors.groupNumber;
        }
        if (backendErrors.groupName) {
          mappedErrors.groupName = Array.isArray(backendErrors.groupName) ? backendErrors.groupName[0] : backendErrors.groupName;
        }
        if (backendErrors.insuranceCompanyId) {
          mappedErrors.insuranceCompanyId = Array.isArray(backendErrors.insuranceCompanyId) ? backendErrors.insuranceCompanyId[0] : backendErrors.insuranceCompanyId;
        }
        
        if (Object.keys(mappedErrors).length > 0) {
          setErrors(mappedErrors);
          showSnackbar('Please correct the highlighted errors', 'error');
          return;
        }
      }

      const errorMessage = err?.data?.message || err?.message || (typeof err === 'string' ? err : 'Failed to save coverage');
      showSnackbar(errorMessage, 'error');
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

  const applyTemplate = (template) => {
    setFormData(prev => ({
      ...prev,
      insurancePlan: template.name || prev.insurancePlan,
      groupName: template.name || prev.groupName,
      // Just a mock representation of filling data from a template
      notes: template.description || prev.notes,
    }));
  };

  const handleApplyTemplate = (template) => {
    // Check if we have existing values that would be overwritten
    if (formData.insurancePlan || formData.groupName) {
      setTemplateToApply(template);
      setIsTemplateConfirmOpen(true);
    } else {
      applyTemplate(template);
      showSnackbar(`Template "${template.name}" applied successfully`, 'success');
    }
  };

  const handleViewFullBook = () => {
    if (!formData.insurancePlan) {
      showSnackbar('Please select an insurance plan or apply a template before viewing the full book.', 'warning');
      return;
    }
    setIsCoverageBookModalOpen(true);
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

  const handleAddProviderFeeGuide = () => {
    setFormData(prev => ({
      ...prev,
      providersPlanFeeGuides: [...(prev.providersPlanFeeGuides || []), { providerId: '', feeGuide: '' }]
    }));
  };

  const handleRemoveProviderFeeGuide = (index) => {
    setFormData(prev => ({
      ...prev,
      providersPlanFeeGuides: (prev.providersPlanFeeGuides || []).filter((_, i) => i !== index)
    }));
  };

  const handleProviderFeeGuideChange = (index, field, value) => {
    setFormData(prev => {
      const newGuides = [...(prev.providersPlanFeeGuides || [])];
      newGuides[index] = { ...newGuides[index], [field]: value };
      return { ...prev, providersPlanFeeGuides: newGuides };
    });
  };

  const handleAddDeductibleRow = () => {
    setFormData(prev => ({
      ...prev,
      deductibles: [
        ...prev.deductibles,
        { type: '', isCodeRow: true, lifetime: false, standard: false, individual: '', family: '', metAmount: '', metDate: '' }
      ]
    }));
  };

  const handleRemoveDeductibleRow = (index) => {
    setFormData(prev => ({
      ...prev,
      deductibles: prev.deductibles.filter((_, i) => i !== index)
    }));
  };

  const handleSubscriberChange = (field, value) => {
    setFormData(prev => {
      const newSubscriber = {
        ...prev.subscriber,
        [field]: value
      };
      
      if (field === 'relationship') {
        // Clear previous auto-populated fields
        newSubscriber.name = '';
        newSubscriber.dateOfBirth = '';
        newSubscriber.ssn = '';

        if (value === 'Self' && patient) {
          const { firstName, lastName, dateOfBirth, ssn } = patient;
          const fullName = `${firstName || ''} ${lastName || ''}`.trim();
          if (fullName) newSubscriber.name = fullName;
          if (dateOfBirth) newSubscriber.dateOfBirth = dateOfBirth.split('T')[0];
          if (ssn) newSubscriber.ssn = ssn;
        } else if (value === 'Spouse' && patient) {
          const spouse = patient.patientMeta?.spouseInfo || patient.spouseInfo;
          if (spouse) {
            const spouseName = spouse.name || `${spouse.firstName || ''} ${spouse.lastName || ''}`.trim();
            if (spouseName) newSubscriber.name = spouseName;
            
            const dob = spouse.dateOfBirth || spouse.dob;
            if (dob) newSubscriber.dateOfBirth = dob.split('T')[0];
            
            if (spouse.ssn) newSubscriber.ssn = spouse.ssn;
          }
        }
      }

      return {
        ...prev,
        subscriber: newSubscriber
      };
    });
    
    // Clear specific subscriber errors
    const errKey = field === 'subscriberId' ? 'subscriberId' : (field === 'dateOfBirth' ? 'dateOfBirth' : (field === 'name' ? 'subscriberName' : null));
    if (errKey) {
      setErrors(prev => ({ ...prev, [errKey]: null }));
    }
  };

  const handleRenewalChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (field === 'policyStarted' || field === 'policyEnds') {
      setErrors(prev => ({ ...prev, policyStarted: null, policyEnds: null }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (field === 'insurancePlan' || field === 'insuranceCompanyId') {
      setErrors(prev => ({ ...prev, insurancePlan: null, insuranceCompanyId: null }));
    } else if (field === 'groupName') {
      setErrors(prev => ({ ...prev, groupName: null }));
    } else if (field === 'groupNumber') {
      setErrors(prev => ({ ...prev, groupNumber: null }));
    }
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
          Add a Coverage for Insurance
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
        <Grid size={{ xs: 12, md: 4 }} sx={{ borderRight: { md: '1px solid #eee' }, pr: { md: 1.5 }, mb: { xs: 1.5, md: 0 } }}>
          <InsuranceInformation 
            formData={{
              ...formData,
              coverageTemplates,
              handleApplyTemplate
            }}
            handleInputChange={handleInputChange}
            insuranceCompanies={allCompanies || []}
            ASSIGNMENT_OF_BENEFITS_OPTIONS={ASSIGNMENT_OF_BENEFITS_OPTIONS}
            tinyText={tinyText}
            blueHeader={blueHeader}
            inputBg={inputBg}
            errors={errors}
          />
          
          <SubscriberInformation
            formData={formData}
            handleSubscriberChange={handleSubscriberChange}
            handleInputChange={handleInputChange}
            ASSIGNMENT_OF_BENEFITS_OPTIONS={ASSIGNMENT_OF_BENEFITS_OPTIONS}
            inputBg={inputBg}
            errors={errors}
          />
          
          <RenewalSection
            formData={formData}
            handleRenewalChange={handleRenewalChange}
            inputBg={inputBg}
            errors={errors}
          />
          
          {/* Advanced Section */}
          <Typography sx={{ ...sectionTitle, mt: 3, mb: 1.5, fontSize: '0.8rem' }}>Advanced</Typography>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid size={{ xs: 6 }}>
              <TextField 
                fullWidth 
                label="Member Identifier" 
                size="small" 
                helperText=" "
                InputProps={{
                  endAdornment: <InputAdornment position="end"><InfoIcon sx={{ fontSize: 14, color: '#bdbdbd' }} /></InputAdornment>
                }}
                sx={{ 
                  bgcolor: inputBg,
                  '& .MuiInputBase-input': { fontSize: '0.7rem', py: 0.8 },
                  '& .MuiInputLabel-root': { fontSize: '0.65rem' },
                  '& .MuiFormHelperText-root': { fontSize: '0.55rem', mx: 0, mt: 0.5, whiteSpace: 'pre' }
                }} 
              />
            </Grid>
            
            <Grid size={{ xs: 6 }}>
              <TextField 
                fullWidth 
                label="Card Sequence" 
                size="small" 
                helperText="Required for Dentaide card"
                InputProps={{
                  endAdornment: <InputAdornment position="end"><InfoIcon sx={{ fontSize: 14, color: '#bdbdbd' }} /></InputAdornment>
                }}
                sx={{ 
                  bgcolor: inputBg,
                  '& .MuiInputBase-input': { fontSize: '0.7rem', py: 0.8 },
                  '& .MuiInputLabel-root': { fontSize: '0.65rem' },
                  '& .MuiFormHelperText-root': { fontSize: '0.55rem', mx: 0, mt: 0.5 }
                }} 
              />
            </Grid>
          </Grid>
          
          <PolicyNotes 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />
        </Grid>

        {/* RIGHT COLUMN: Fee Guides & Tables */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, md: 6.5 }}>
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
                  {planFeeGuideOptions.map(option => (
                    <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.65rem' }}>{option.label}</MenuItem>
                  ))}
                </TextField>
                <Button 
                  variant="outlined" 
                  size="small" 
                  disabled={!formData.planFeeGuide || formData.planFeeGuide === 'None'}
                  onClick={() => setIsFeeGuideModalOpen(true)}
                  sx={{ textTransform: 'none', fontSize: '0.6rem', height: '28px', borderColor: '#ccc', color: '#333', px: 0.5, minWidth: 'auto', whiteSpace: 'nowrap' }}
                >
                  View Fee Guide
                </Button>
              </Box>
              <Typography sx={{ color: '#000000ff', fontSize: '0.85rem', mt: 1, fontWeight: 600 }}>
                Providers Plan Fee Guides
              </Typography>
              {formData.providersPlanFeeGuides?.map((guide, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center' }}>
                  <TextField
                    placeholder="Provider Name/ID"
                    size="small"
                    value={guide.providerId}
                    onChange={(e) => handleProviderFeeGuideChange(index, 'providerId', e.target.value)}
                    sx={{ flex: 1, bgcolor: '#fff', '& .MuiInputBase-root': { fontSize: '0.65rem' } }}
                  />
                  <TextField
                    select
                    size="small"
                    value={guide.feeGuide}
                    onChange={(e) => handleProviderFeeGuideChange(index, 'feeGuide', e.target.value)}
                    sx={{ flex: 1, bgcolor: '#fff', '& .MuiInputBase-root': { fontSize: '0.65rem' } }}
                  >
                    <MenuItem value="" disabled sx={{ fontSize: '0.65rem', color: '#aaa' }}>
                      <em>Select Fee Guide</em>
                    </MenuItem>
                    {planFeeGuideOptions.map(option => (
                      <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.65rem' }}>{option.label}</MenuItem>
                    ))}
                  </TextField>
                  <IconButton size="small" onClick={() => handleRemoveProviderFeeGuide(index)} sx={{ color: '#d32f2f', p: 0.5 }}>
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              ))}
              <Typography 
                onClick={handleAddProviderFeeGuide}
                sx={{ color: '#1976d2', fontSize: '0.65rem', mt: 0.5, cursor: 'pointer', display: 'inline-block', fontWeight: 600 }}
              >
                + Add
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 5.5 }}>
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
            handleDeductibleChange={(index, field, value) => {
              const newDeductibles = [...formData.deductibles];
              newDeductibles[index] = { ...newDeductibles[index], [field]: value };
              setFormData({ ...formData, deductibles: newDeductibles });
            }}
            handleAddDeductibleRow={handleAddDeductibleRow}
            handleRemoveDeductibleRow={handleRemoveDeductibleRow}
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
            coverageCategoryData={coverageCategoryData}
            setCoverageCategoryData={setCoverageCategoryData}
          />

          <CoverageBookSummary 
            headerStyle={headerStyle}
            bodyCellStyle={bodyCellStyle}
            blueHeader={blueHeader}
            coverageData={coverageBookData}
            onCoverageDataChange={setCoverageBookData}
            onViewFullBook={handleViewFullBook}
          />
        </Grid>
      </Grid>

      <FeeGuideModal 
        open={isFeeGuideModalOpen} 
        onClose={() => setIsFeeGuideModalOpen(false)} 
        feeGuideId={formData.planFeeGuide}
      />

      <CoverageBookModal
        open={isCoverageBookModalOpen}
        onClose={() => setIsCoverageBookModalOpen(false)}
        coverageData={coverageBookData}
        setCoverageData={setCoverageBookData}
        feeGuideId={formData.planFeeGuide}
      />

      <ConfirmationDialog
        open={isTemplateConfirmOpen}
        onClose={() => {
          setIsTemplateConfirmOpen(false);
          setTemplateToApply(null);
        }}
        onConfirm={() => {
          if (templateToApply) {
            applyTemplate(templateToApply);
            showSnackbar(`Template "${templateToApply.name}" applied successfully`, 'success');
          }
          setIsTemplateConfirmOpen(false);
          setTemplateToApply(null);
        }}
        title="Apply Coverage Template"
        content="Are you sure you want to apply this template? This will overwrite your current plan setup."
        confirmText="Apply Template"
        confirmColor="primary"
      />
    </Box>
  );
};

export default AddCoveragePage;