import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, IconButton } from "@mui/material";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { usePatient } from '../../hooks/redux/usePatient';
import { usePatientInsurance } from '../../hooks/redux/usePatientInsurance';
import { patientService } from '../../services/patient.service';

import {
  InsuranceInformation,
  SubscriberInformation,
  RenewalSection,
  AdvancedSection,
  PlanFeeGuideSection,
  DeductiblesTable,
  CoverageTable,
  PolicyNotes,
  CoverageBookSummary,
  FeeGuideModal,
  CoverageBookModal
} from '../../components/insurance';

import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import RightPanel from '../../components/appointments/right-panel/RightPanel';
import RightPanelCollapsed from '../../components/appointments/right-panel/RightPanelCollapsed';
import AddCoverageHeader from '../../components/insurance/components/AddCoverageHeader';

import { COVERAGE_DATA } from '../../components/insurance';
import { useCoverageData } from './hooks/useCoverageData';
import { ASSIGNMENT_OF_BENEFITS_OPTIONS, COVERAGE_TYPES, STYLE_CONSTANTS } from './utils/coverageConstants';
import { MOCK_COVERAGE_TEMPLATES } from '../../components/insurance/utils/mockCoverageTemplates';

const ActionText = ({ icon: Icon, text, color = "#4db6ac" }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', ml: 1 }}>
    <Icon sx={{ fontSize: 14, color }} />
    <Typography sx={{ fontSize: '0.65rem', color, fontWeight: 600 }}>{text}</Typography>
  </Box>
);

const AddCoveragePage = () => {
  const { patientId, insuranceId } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { currentPatient: patient, fetchById: fetchPatient } = usePatient();
  const { create: createInsurance, update: updateInsurance } = usePatientInsurance(patientId);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(!insuranceId);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  const [isFeeGuideModalOpen, setIsFeeGuideModalOpen] = useState(false);
  const [isCoverageBookModalOpen, setIsCoverageBookModalOpen] = useState(false);

  const [errors, setErrors] = useState({});
  const [coverageBookData, setCoverageBookData] = useState([]);
  const [coverageCategoryData, setCoverageCategoryData] = useState(insuranceId ? {} : COVERAGE_DATA);
  const [templateToApply, setTemplateToApply] = useState(null);
  const [isTemplateConfirmOpen, setIsTemplateConfirmOpen] = useState(false);

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
      individual: { unlimited: false, annualMax: '', usedAmount: '', usedAmountDate: '' },
      family: { unlimited: false, annualMax: '', usedAmount: '', usedAmountDate: '' },
      ortho: { unlimited: false, annualMax: '', usedAmount: '', usedAmountDate: '' },
      diagnostic: { unlimited: false, annualMax: '' },
      preventative: { unlimited: false, annualMax: '' },
      basic: { unlimited: false, annualMax: '' },
      major: { unlimited: false, annualMax: '' },
      categories: ['Diagnostic', 'Preventative', 'Basic', 'Major']
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

  const {
    loading,
    feeGuides,
    allCompanies,
    coverageTemplates,
    createTemplate,
    handleCancel
  } = useCoverageData(
    patientId, 
    insuranceId, 
    patient,
    fetchPatient,
    formData, 
    setFormData, 
    setCoverageBookData, 
    setCoverageCategoryData,
    coverageBookData,
    coverageCategoryData
  );

  const seenLabels = new Set();
  const planFeeGuideOptions = feeGuides
    .filter(fg => !fg.isHidden)
    .map(fg => ({
      value: String(fg._id || fg.FeeSchedNum || fg.feeSchedNum || fg.id),
      label: fg.Description || fg.description || fg.name || 'Unknown Fee Guide'
    }))
    .filter(option => {
      if (seenLabels.has(option.label)) return false;
      seenLabels.add(option.label);
      return true;
    });

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

      if ((!formData.insuranceCompanyId && !formData.carrierName?.trim()) || !formData.payerId?.trim()) {
        newErrors.insuranceCompanyId = 'Carrier Name and Payer ID are required';
      }

      if (!formData.insurancePlan?.trim()) {
        newErrors.insurancePlan = 'Insurance Plan is required';
      }

      if (!formData.groupName?.trim()) {
        newErrors.groupName = 'Group Name is required';
      }

      if (!formData.groupNumber?.trim()) {
        newErrors.groupNumber = 'Group Number is required';
      } else if (!/^[A-Za-z0-9\s-]+$/.test(formData.groupNumber)) {
        newErrors.groupNumber = 'Group Number must be alphanumeric, and can contain spaces or hyphens';
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
      } else if (!/^[A-Za-z0-9\s-]+$/.test(formData.subscriber.subscriberId)) {
        newErrors.subscriberId = 'Subscriber ID must be alphanumeric, and can contain spaces or hyphens';
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

      const isValidDeductibleDate = (dateStr) => {
        if (!dateStr) return true;
        if (dateStr.length < 10) return false;
        const parts = dateStr.split('/');
        if (parts.length !== 3) return false;
        const month = parseInt(parts[0], 10);
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        if (isNaN(month) || isNaN(day) || isNaN(year)) return false;
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;
        if (year < 1900 || year > 2100) return false;
        const date = new Date(year, month - 1, day);
        return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
      };

      let hasInvalidDeductibleDate = false;
      formData.deductibles?.forEach((ded) => {
        if (ded.metDate && !isValidDeductibleDate(ded.metDate)) {
          hasInvalidDeductibleDate = true;
        }
      });

      if (hasInvalidDeductibleDate) {
        showSnackbar('Please enter valid dates (MM/DD/YYYY) in the deductibles table', 'error');
        return;
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        const errorFields = Object.keys(newErrors).join(', ');
        showSnackbar(`Please correct the highlighted errors: ${errorFields}`, 'error');
        console.error('Validation errors:', newErrors);
        return;
      }

      setErrors({});
      setSaving(true);

      // Map UI state to backend validator requirements
      const monthMap = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12 };
      const renewalMonthNum = monthMap[formData.renewalMonth] || 1;

      const indMaxVal = formData.coverage?.individual?.annualMax;
      const indUsedVal = formData.coverage?.individual?.usedAmount;
      const parsedIndMax = indMaxVal != null && indMaxVal !== '' ? parseFloat(String(indMaxVal).replace(/[^0-9.-]+/g, "")) : undefined;
      const parsedIndUsed = indUsedVal != null && indUsedVal !== '' ? parseFloat(String(indUsedVal).replace(/[^0-9.-]+/g, "")) : undefined;

      const payload = {
        insuranceCompanyId: String(formData.insuranceCompanyId || '1'),
        payerId: formData.payerId || undefined,
        policyNumber: formData.subscriber.subscriberId,
        groupNumber: formData.groupNumber || undefined,
        groupName: formData.groupName || undefined,
        subscriberName: formData.subscriber.name,
        subscriberDateOfBirth: new Date(formData.subscriber.dateOfBirth).toISOString(),
        relationshipToPatient: formData.subscriber.relationship.toLowerCase(),
        effectiveDate: new Date(formData.policyStarted).toISOString(),
        expirationDate: formData.policyEnds ? new Date(formData.policyEnds).toISOString() : undefined,
        deductibleAmount: parseFloat(formData.deductibles[0]?.individual?.replace(/[^0-9.-]+/g, "")) || 0,
        individualAnnualMax: !isNaN(parsedIndMax) ? parsedIndMax : undefined,
        usedAmount: !isNaN(parsedIndUsed) ? parsedIndUsed : undefined,
        
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

      if (formData.saveAsTemplate) {
        try {
          await createTemplate({
            name: formData.insurancePlan,
            description: [formData.carrierName, formData.groupName].filter(Boolean).join(' — ') || undefined,
            benefits: [{
              insurancePlan: formData.insurancePlan,
              groupName: formData.groupName,
              groupNumber: formData.groupNumber,
              phoneNumber: formData.phoneNumber,
              healthPlan: formData.healthPlan,
              assignmentOfBenefits: formData.assignmentOfBenefits
            }]
          }).unwrap();
          showSnackbar('Plan billing info saved as a reusable template', 'success');
        } catch (templateErr) {
          console.error('Failed to save coverage template', templateErr);
          showSnackbar('Coverage saved, but saving it as a template failed', 'warning');
        }
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
      setSaving(false);
    }
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
    // Mock templates carry these fields flat; real saved templates (created via
    // "Save as Template") nest them inside benefits[0] since the backend's
    // coverage-template model only stores { name, description, benefits }.
    const source = template.benefits?.[0] || template;
    setFormData(prev => ({
      ...prev,
      insurancePlan: source.insurancePlan || template.name || prev.insurancePlan,
      groupName: source.groupName || prev.groupName,
      groupNumber: source.groupNumber || prev.groupNumber,
      phoneNumber: source.phoneNumber || prev.phoneNumber,
      healthPlan: source.healthPlan ?? prev.healthPlan,
      assignmentOfBenefits: source.assignmentOfBenefits || prev.assignmentOfBenefits,
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
        newSubscriber.subscriberId = '';

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
    <Box sx={{ bgcolor: "#f5f6f8", minHeight: "100vh" }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: '8px', p: 1.5, maxWidth: '1857px', height: 'calc(100vh - 65px)', overflow: 'hidden', boxSizing: 'border-box', margin: '0 auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: 0, minHeight: 0, overflowY: 'auto' }}>
          <AddCoverageHeader
            isEditing={isEditing}
            onEditToggle={() => setIsEditing(true)}
            showEditButton={Boolean(insuranceId)}
            onSave={handleSave}
            onCancel={handleCancel}
            loading={loading || saving}
            title={insuranceId ? (isEditing ? "Edit Coverage for Insurance" : "View Coverage for Insurance") : "Add a Coverage for Insurance"}
          />

          <Box
            sx={{
              display: 'flex',
              gap: '8px',
              '& .MuiInputBase-root, & .MuiCheckbox-root, & .MuiFormControlLabel-root, & .MuiButton-root:not(.view-btn), & .MuiIconButton-root:not(.view-btn)': {
                pointerEvents: isEditing ? 'auto' : 'none',
              },
              '& .MuiInputBase-root': {
                backgroundColor: isEditing ? undefined : '#f3f4f6 !important',
                color: isEditing ? undefined : '#6b7280 !important',
                '& fieldset': {
                  borderColor: isEditing ? undefined : '#e5e7eb !important'
                }
              },
              '& .MuiCheckbox-root': {
                color: isEditing ? undefined : '#d1d5db !important'
              }
            }}
          >
            <Box sx={{ flex: '0 0 33%', width: '35%', minWidth: '350px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <InsuranceInformation
                formData={{
                  ...formData,
                  coverageTemplates: coverageTemplates?.length > 0 ? coverageTemplates : MOCK_COVERAGE_TEMPLATES,
                  handleApplyTemplate: (t) => handleApplyTemplate(t)
                }}
                handleInputChange={handleInputChange}
                insuranceCompanies={allCompanies?.companies || allCompanies || []}
                ASSIGNMENT_OF_BENEFITS_OPTIONS={ASSIGNMENT_OF_BENEFITS_OPTIONS}
                tinyText={STYLE_CONSTANTS.tinyText}
                blueHeader={STYLE_CONSTANTS.blueHeader}
                inputBg={STYLE_CONSTANTS.inputBg}
                errors={errors}
              />

              <SubscriberInformation
                formData={formData}
                handleSubscriberChange={handleSubscriberChange}
                handleSubscriberSelect={async (member) => {
                  setFormData(prev => ({
                    ...prev,
                    subscriber: {
                      ...prev.subscriber,
                      name: member.name || '',
                      dateOfBirth: member.dateOfBirth ? member.dateOfBirth.split('T')[0] : prev.subscriber.dateOfBirth,
                      ssn: member.ssn || prev.subscriber.ssn,
                      subscriberId: member.subscriberId || prev.subscriber.subscriberId
                    }
                  }));
                  setErrors(prev => ({ ...prev, subscriberName: null, dateOfBirth: null, subscriberId: null }));

                  if (member.id) {
                    try {
                      // Fetch full patient data (including SSN) and active insurances
                      const fullPatient = await patientService.getPatientById(member.id, true).catch(() => null);
                      const insurances = await patientService.getPatientInsurances(member.id, true).catch(() => null);
                      
                      setFormData(prev => {
                        let newSsn = fullPatient?.ssn || prev.subscriber.ssn;
                        let newSubscriberId = prev.subscriber.subscriberId;
                        
                        if (insurances && insurances.length > 0) {
                          const activeIns = insurances.find(ins => ins.isActive) || insurances[0];
                          if (activeIns && (activeIns.subscriberId || activeIns.policyNumber)) {
                            newSubscriberId = activeIns.subscriberId || activeIns.policyNumber;
                          }
                        }

                        return {
                          ...prev,
                          subscriber: {
                            ...prev.subscriber,
                            ssn: newSsn,
                            subscriberId: newSubscriberId
                          }
                        };
                      });
                    } catch (err) {
                      console.error("Failed to fetch full subscriber details", err);
                    }
                  }
                }}
                handleInputChange={handleInputChange}
                ASSIGNMENT_OF_BENEFITS_OPTIONS={ASSIGNMENT_OF_BENEFITS_OPTIONS}
                inputBg={STYLE_CONSTANTS.inputBg}
                errors={errors}
                patient={patient}
                onCreatePatient={() => navigate('/patients/new')}
              />

              <RenewalSection
                formData={formData}
                handleRenewalChange={handleRenewalChange}
                inputBg={STYLE_CONSTANTS.inputBg}
                errors={errors}
              />

              <AdvancedSection
                formData={formData}
                handleInputChange={handleInputChange}
                inputBg={STYLE_CONSTANTS.inputBg}
              />

              <PolicyNotes
                formData={formData}
                handleInputChange={handleInputChange}
              />
            </Box>

            <Box sx={{ flex: 1, minWidth: '620px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <PlanFeeGuideSection
                formData={formData}
                handleInputChange={handleInputChange}
                planFeeGuideOptions={planFeeGuideOptions}
                COVERAGE_TYPES={COVERAGE_TYPES}
                setIsFeeGuideModalOpen={setIsFeeGuideModalOpen}
                handleProviderFeeGuideChange={handleProviderFeeGuideChange}
                handleRemoveProviderFeeGuide={handleRemoveProviderFeeGuide}
                handleAddProviderFeeGuide={handleAddProviderFeeGuide}
              />

              <DeductiblesTable
                formData={formData}
                handleDeductibleChange={handleDeductibleChange}
                handleAddDeductibleRow={handleAddDeductibleRow}
                handleRemoveDeductibleRow={handleRemoveDeductibleRow}
                tableHeaderStyle={STYLE_CONSTANTS.tableHeaderStyle}
                blueHeader={STYLE_CONSTANTS.blueHeader}
              />

              <CoverageTable
                formData={formData}
                handleCoverageChange={handleCoverageChange}
                handleInputChange={handleInputChange}
                handleRemoveOrthoMax={handleRemoveOrthoMax}
                handleAddCategoryMax={handleAddCategoryMax}
                headerStyle={STYLE_CONSTANTS.headerStyle}
                bodyCellStyle={STYLE_CONSTANTS.bodyCellStyle}
                blueHeader={STYLE_CONSTANTS.blueHeader}
                ActionText={ActionText}
                coverageCategoryData={coverageCategoryData}
                setCoverageCategoryData={setCoverageCategoryData}
              />

              <CoverageBookSummary
                coverageData={coverageBookData}
                onCoverageDataChange={setCoverageBookData}
                onViewFullBook={handleViewFullBook}
              />
            </Box>
          </Box>
        </Box>

        {rightPanelOpen ? (
          <Box sx={{ flex: '0 0 320px', width: '320px', minWidth: '320px', maxWidth: '320px', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
              <IconButton onClick={() => setRightPanelOpen(false)} sx={{ color: 'text.secondary', p: 0, '&:hover': { color: 'primary.main' } }}>
                <KeyboardDoubleArrowRightIcon fontSize="small" />
              </IconButton>
            </Box>
            <RightPanel hideAppointmentShortlist={true} />
          </Box>
        ) : (
          <Box sx={{ height: '100%', flexShrink: 0 }}>
            <RightPanelCollapsed onExpand={() => setRightPanelOpen(true)} hideAppointmentShortlist={true} />
          </Box>
        )}
      </Box>

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
