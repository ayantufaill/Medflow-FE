import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Grid, Typography, CircularProgress, IconButton, Button, TextField, MenuItem, InputAdornment
} from "@mui/material";
import { 
  Book as BookIcon,
  ArrowBack as ArrowBackIcon,
  InfoOutlined as InfoIcon,
  DeleteOutlined as DeleteIcon,
  GppGood as GppGoodIcon,
  BookmarkBorder as BookmarkBorderIcon
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
  AdvancedSection,
  PlanFeeGuideSection,
  DeductiblesTable,
  CoverageTable,
  PolicyNotes,
  CoverageBookSummary,
  FeeGuideModal,
  CoverageBookModal,
  COVERAGE_DATA
} from '../../components/insurance';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import TaskList from '../../components/appointments/right-panel/TaskList';
import Messages from '../../components/appointments/right-panel/Messages';

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

  // Coverage book data state
  const [coverageBookData, setCoverageBookData] = useState([]);
  const [coverageCategoryData, setCoverageCategoryData] = useState(COVERAGE_DATA);

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

            if (
              Array.isArray(covDataArray) &&
              covDataArray.length > 0 &&
              typeof covDataArray[0] === 'object' &&
              covDataArray[0].category
            ) {
              const covData = {};
              covDataArray.forEach(group => {
                covData[group.category] = group.items;
              });
              setCoverageCategoryData(covData);
            } else if (covDataArray && !Array.isArray(covDataArray)) {
              setCoverageCategoryData(covDataArray);
            }
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
      if (!formData.insuranceCompanyId && !formData.insurancePlan) {
        showSnackbar('Please select an insurance carrier', 'error');
        return;
      }

      if (!formData.subscriber.subscriberId || formData.subscriber.subscriberId.length < 5 || formData.subscriber.subscriberId.length > 30) {
        showSnackbar('Subscriber ID (Policy Number) must be between 5 and 30 characters', 'error');
        return;
      }

      if (!formData.subscriber.dateOfBirth) {
        showSnackbar('Subscriber Date of Birth is required', 'error');
        return;
      }

      if (!formData.policyStarted) {
        showSnackbar('Policy Started date is required (Renewal section)', 'error');
        return;
      }

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
        insurancePlanNotes: formData.insurancePlanNotes || undefined
      };

      if (insuranceId) {
        await updateInsurance(insuranceId, payload).unwrap();
        showSnackbar('Coverage updated successfully', 'success');
      } else {
        await createInsurance(payload).unwrap();
        showSnackbar('Coverage saved successfully', 'success');
      }
      
      navigate(`/patients/details/${patientId}?tab=insurance`);
    } catch (err) {
      console.error('Failed to save coverage', err);
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
    <Box sx={{ bgcolor: "#f5f6f8", minHeight: "100vh" }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: '20px', p: 3, maxWidth: '1857px', margin: '0 auto' }}>
        
        {/* MAIN LEFT AREA */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minWidth: 0 }}>
          
          {/* TOP CARD: Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            px: '24px',
            py: '16px',
            borderRadius: '12px',
            border: '1px solid #DFE5EC',
            bgcolor: '#FFFFFF'
          }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 2, bgcolor: '#eef2ff' }}>
                <GppGoodIcon sx={{ fontSize: 22, color: '#3f51b5' }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: '0.9rem', color: '#1a1a1a' }}>
                  Add a Coverage for Insurance
                </Typography>
                <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
                  Configure carrier, subscriber, plan benefits and coverage book
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <IconButton size="small" sx={{ border: '1px solid #DFE5EC', borderRadius: 1.5, width: 36, height: 36 }}>
                <BookmarkBorderIcon sx={{ fontSize: 20, color: '#666' }} />
              </IconButton>
              <Button variant="outlined" onClick={handleCancel} sx={{ textTransform: 'none', color: '#333', borderColor: '#DFE5EC', fontWeight: 600, height: 36, px: 2, borderRadius: 1.5 }}>Cancel</Button>
              <Button variant="contained" onClick={handleSave} disabled={loading} sx={{ bgcolor: '#1976d2', textTransform: 'none', fontWeight: 600, height: 36, px: 3, boxShadow: 'none', borderRadius: 1.5 }}>Save</Button>
            </Box>
          </Box>

          {/* TWO COLUMNS: Left & Center */}
          <Box sx={{ display: 'flex', gap: '20px' }}>
            
            {/* LEFT COLUMN: Insurance & Subscriber Info */}
        <Box sx={{ width: '480px', minWidth: '480px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <InsuranceInformation 
            formData={{
              ...formData,
              coverageTemplates,
              handleApplyTemplate
            }}
            handleInputChange={handleInputChange}
            insuranceCompanies={allCompanies.companies || []}
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
          
          <AdvancedSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
            inputBg={inputBg} 
          />
          
          <PolicyNotes 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />
        </Box>

        {/* CENTER COLUMN: Fee Guides & Tables */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
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
          </Box>
        </Box>
        </Box>

        {/* RIGHT COLUMN: Right Panel */}
        <Box sx={{ width: '290px', minWidth: '290px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <TaskList />
          <Messages />
        </Box>
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