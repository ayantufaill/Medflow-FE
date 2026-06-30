import { useState, useEffect } from 'react';
import { COVERAGE_DATA } from '../../../components/insurance';

export const useCoverageForm = (patient) => {
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

  const [coverageBookData, setCoverageBookData] = useState([]);
  const [coverageCategoryData, setCoverageCategoryData] = useState(COVERAGE_DATA);
  const [templateToApply, setTemplateToApply] = useState(null);
  const [isTemplateConfirmOpen, setIsTemplateConfirmOpen] = useState(false);

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
      notes: template.description || prev.notes,
    }));
  };

  const handleApplyTemplate = (template, showSnackbar) => {
    if (formData.insurancePlan || formData.groupName) {
      setTemplateToApply(template);
      setIsTemplateConfirmOpen(true);
    } else {
      applyTemplate(template);
      if (showSnackbar) showSnackbar(`Template "${template.name}" applied successfully`, 'success');
    }
  };

  const handleRemoveOrthoMax = () => {
    setFormData(prev => ({
      ...prev,
      coverage: {
        ...prev.coverage,
        ortho: { annualMax: '', usedAmount: '', usedAmountDate: '' }
      }
    }));
  };

  const handleAddCategoryMax = (category) => {
    console.log('Add max for category:', category);
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
      const newSubscriber = { ...prev.subscriber, [field]: value };
      if (field === 'relationship') {
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
      return { ...prev, subscriber: newSubscriber };
    });
  };

  const handleRenewalChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleDeductibleChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      deductibles: prev.deductibles.map((deductible, i) =>
        i === index ? { ...deductible, [field]: value } : deductible
      )
    }));
  };

  return {
    formData,
    setFormData,
    coverageBookData,
    setCoverageBookData,
    coverageCategoryData,
    setCoverageCategoryData,
    templateToApply,
    setTemplateToApply,
    isTemplateConfirmOpen,
    setIsTemplateConfirmOpen,
    applyTemplate,
    handlers: {
      handleCoverageChange,
      handleApplyTemplate,
      handleRemoveOrthoMax,
      handleAddCategoryMax,
      handleAddProviderFeeGuide,
      handleRemoveProviderFeeGuide,
      handleProviderFeeGuideChange,
      handleAddDeductibleRow,
      handleRemoveDeductibleRow,
      handleSubscriberChange,
      handleRenewalChange,
      handleInputChange,
      handleDeductibleChange
    }
  };
};
