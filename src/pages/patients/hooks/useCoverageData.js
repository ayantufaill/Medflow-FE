import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { useInsuranceCatalog } from '../../../hooks/redux/useInsuranceCatalog';
import { usePatientInsurance } from '../../../hooks/redux/usePatientInsurance';
import { fetchFeeGuides, selectFeeGuides, selectFeeGuidesLoading } from '../../../store/slices/feeGuideSlice';
import { buildCoveragePayload } from '../utils/coveragePayloadBuilder';
import { monthMapReverse } from '../utils/coverageConstants';
import { useNavigate } from 'react-router-dom';

export const useCoverageData = (
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
) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const { companies: allCompanies, companiesLoading, templates: coverageTemplates, templatesLoading, fetchCompanies, fetchTemplates } = useInsuranceCatalog();
  const { insurances, fetch: fetchInsurances, create: createInsurance, update: updateInsurance } = usePatientInsurance(patientId);

  const feeGuides = useSelector(selectFeeGuides);
  const feeGuidesLoading = useSelector(selectFeeGuidesLoading);

  const initialFetchRef = useRef({ companies: false, templates: false });

  useEffect(() => {
    if (patientId) {
      fetchPatient(patientId);
    }
  }, [patientId, fetchPatient]);

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
    if (patientId && insuranceId && insurances.length === 0) fetchInsurances();
  }, [patientId, insuranceId, insurances.length, fetchInsurances]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (patientId && insuranceId && insurances.length > 0 && allCompanies && allCompanies.length > 0) {
          const editTarget = insurances.find(ins => (ins._id || ins.id) === insuranceId);

          if (editTarget) {
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
      const payload = buildCoveragePayload(formData, coverageBookData, coverageCategoryData);

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

  return {
    loading,
    feeGuides,
    allCompanies,
    coverageTemplates,
    handleSave,
    handleCancel
  };
};
