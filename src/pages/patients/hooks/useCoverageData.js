import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { useInsuranceCatalog } from "../../../hooks/redux/useInsuranceCatalog";
import { usePatientInsurance } from "../../../hooks/redux/usePatientInsurance";
import {
  fetchFeeGuides,
  selectFeeGuides,
  selectFeeGuidesLoading,
} from "../../../store/slices/feeGuideSlice";
import { buildCoveragePayload } from "../utils/coveragePayloadBuilder";
import { COVERAGE_DATA } from "../../../components/insurance/utils/insuranceConstants";
import { monthMapReverse } from "../utils/coverageConstants";
import { useNavigate } from "react-router-dom";
import { normalizePayerId } from "../utils/payerIdValidation";
import { expandStandardSelection } from "../utils/deductibleStandardSelection";

/** Normalise any stored date (ISO or MM/DD/YYYY) to the MM-DD-YYYY display form. */
const isoToDisplayDate = (value) => {
  if (!value) return "";
  const str = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split("-");
    return `${m}-${d}-${y}`;
  }
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(str)) {
    return str.replace(/\//g, "-");
  }
  return str;
};

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
  coverageCategoryData,
) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const {
    templates: coverageTemplates,
    templatesLoading,
    fetchTemplates,
    createTemplate,
  } = useInsuranceCatalog();
  const {
    insurances,
    fetch: fetchInsurances,
    create: createInsurance,
    update: updateInsurance,
  } = usePatientInsurance(patientId);

  const feeGuides = useSelector(selectFeeGuides);
  const feeGuidesLoading = useSelector(selectFeeGuidesLoading);

  const initialFetchRef = useRef({
    templates: false,
    feeGuides: false,
  });

  useEffect(() => {
    if (patientId) {
      fetchPatient(patientId);
    }
  }, [patientId, fetchPatient]);

  useEffect(() => {
    if (
      (!coverageTemplates || coverageTemplates.length === 0) &&
      !templatesLoading &&
      !initialFetchRef.current.templates
    ) {
      initialFetchRef.current.templates = true;
      fetchTemplates();
    }
  }, [
    coverageTemplates,
    templatesLoading,
    fetchTemplates,
  ]);

  useEffect(() => {
    if (
      feeGuides.length === 0 &&
      !feeGuidesLoading &&
      !initialFetchRef.current.feeGuides
    ) {
      initialFetchRef.current.feeGuides = true;
      dispatch(fetchFeeGuides());
    }
  }, [dispatch, feeGuides, feeGuidesLoading]);

  useEffect(() => {
    if (patientId && insuranceId && insurances.length === 0) fetchInsurances();
  }, [patientId, insuranceId, insurances.length, fetchInsurances]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (
          patientId &&
          insuranceId &&
          insurances.length > 0
        ) {
          const editTarget = insurances.find(
            (ins) => (ins._id || ins.id) === insuranceId,
          );

          if (editTarget) {
            const fullCompany = editTarget.insuranceCompanyId;
            const address = fullCompany?.address;
            const cityState = [address?.city, address?.state].filter(Boolean).join(', ');
            const payerAddress = [
              [address?.street, address?.street2].filter(Boolean).join(', '),
              [cityState, address?.zipCode].filter(Boolean).join(' '),
            ].filter(Boolean).join(', ');

            setFormData((prev) => ({
              ...prev,
              insuranceCompanyId:
                editTarget.insuranceCompanyId?._id ||
                editTarget.insuranceCompanyId,
              carrierName: editTarget.insuranceCompanyId?.name || "",
              payerId: normalizePayerId(editTarget.insuranceCompanyId?.payerId),
              carrierPhone:
                fullCompany?.phone ||
                editTarget.insuranceCompanyId?.phone ||
                "",
              payerAddress,
              phoneNumber:
                fullCompany?.phone ||
                editTarget.insuranceCompanyId?.phone ||
                "",
              groupNumber: editTarget.groupNumber || "",
              groupName: editTarget.groupName || "",
              employerName: editTarget.employerName || "",
              employerId: editTarget.employerId || "",
              insurancePlan:
                editTarget.insurancePlanName ||
                editTarget.insurancePlan?.name ||
                editTarget.insurancePlan ||
                editTarget.groupName ||
                editTarget.employerName ||
                fullCompany?.name ||
                editTarget.insuranceCompanyId?.name ||
                "",
              insuranceType: editTarget.insuranceType || "primary",
              planFeeGuide: editTarget.planFeeGuide ? String(editTarget.planFeeGuide) : "",
              coverageType: editTarget.coverageType || "ppo",
              assignmentOfBenefits:
                parseInt(editTarget.assignmentOfBenefits) || 1,
              honorWriteOff: editTarget.honorWriteOff || false,
              renewalMonth:
                monthMapReverse[editTarget.renewalMonth] || "January",
              policyStarted: editTarget.effectiveDate
                ? new Date(editTarget.effectiveDate).toISOString().split("T")[0]
                : prev.policyStarted,
              policyEnds: editTarget.expirationDate
                ? new Date(editTarget.expirationDate)
                    .toISOString()
                    .split("T")[0]
                : "",
              subscriber: {
                ...prev.subscriber,
                relationship:
                  editTarget.relationshipToPatient?.charAt(0).toUpperCase() +
                    editTarget.relationshipToPatient?.slice(1) || "Self",
                name: editTarget.subscriberName || "",
                subscriberId: editTarget.policyNumber || "",
                ssn: editTarget.subscriberSsn 
                  ? (() => {
                      let nums = editTarget.subscriberSsn.replace(/\D/g, '');
                      if (nums.length > 5) return `${nums.slice(0, 3)}-${nums.slice(3, 5)}-${nums.slice(5, 9)}`;
                      if (nums.length > 3) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
                      return nums;
                    })()
                  : "",
                dateOfBirth: editTarget.subscriberDateOfBirth
                  ? new Date(editTarget.subscriberDateOfBirth)
                      .toISOString()
                      .split("T")[0]
                  : "",
              },
              deductibles: editTarget.deductiblesGrid?.length
                ? expandStandardSelection(editTarget.deductiblesGrid).map((d) => ({
                    ...d,
                    metDate: isoToDisplayDate(d.metDate),
                  }))
                : prev.deductibles,
              coverage: editTarget.coverageLimits || prev.coverage,
              providersPlanFeeGuides: editTarget.providersPlanFeeGuides || [],
              policyNotes: editTarget.policyNotes || "",
              eligibilityPolicyNotes: editTarget.eligibilityPolicyNotes || "",
              insurancePlanNotes: editTarget.insurancePlanNotes || "",
              healthPlan: editTarget.healthPlan || false,
              paymentPlan: editTarget.paymentPlan || "",
              patientsCovered: editTarget.patientsCovered || (editTarget.members ? editTarget.members.length : 1),
            }));

            if (editTarget.coverageBookData) {
              setCoverageBookData(editTarget.coverageBookData);
            }

            if (
              editTarget.coverageCategoryTable &&
              ((Array.isArray(editTarget.coverageCategoryTable) &&
                editTarget.coverageCategoryTable.length > 0) ||
                (!Array.isArray(editTarget.coverageCategoryTable) &&
                  Object.keys(editTarget.coverageCategoryTable).length > 0))
            ) {
              const covDataArray = editTarget.coverageCategoryTable;

              if (
                Array.isArray(covDataArray) &&
                covDataArray.length > 0 &&
                typeof covDataArray[0] === "object" &&
                covDataArray[0].category
              ) {
                const covData = {};
                covDataArray.forEach((group) => {
                  covData[group.category] = group.items;
                });
                setCoverageCategoryData(covData);
              } else if (covDataArray && !Array.isArray(covDataArray)) {
                setCoverageCategoryData(covDataArray);
              }
            } else {
              setCoverageCategoryData(COVERAGE_DATA);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load data", err);
        showSnackbar("Failed to load required data", "error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [patientId, insuranceId, insurances]);

  const handleSave = async () => {
    try {
      if (!formData.insuranceCompanyId && !formData.insurancePlan) {
        showSnackbar("Please select an insurance carrier", "error");
        return;
      }
      if (
        !formData.subscriber.subscriberId ||
        formData.subscriber.subscriberId.length < 5 ||
        formData.subscriber.subscriberId.length > 30
      ) {
        showSnackbar(
          "Subscriber ID (Policy Number) must be between 5 and 30 characters",
          "error",
        );
        return;
      }
      if (!formData.subscriber.dateOfBirth) {
        showSnackbar("Subscriber Date of Birth is required", "error");
        return;
      }
      if (!formData.policyStarted) {
        showSnackbar(
          "Policy Started date is required (Renewal section)",
          "error",
        );
        return;
      }

      setLoading(true);
      const payload = buildCoveragePayload(
        formData,
        coverageBookData,
        coverageCategoryData,
      );

      if (insuranceId) {
        await updateInsurance(insuranceId, payload).unwrap();
        showSnackbar("Coverage updated successfully", "success");
      } else {
        await createInsurance(payload).unwrap();
        showSnackbar("Coverage saved successfully", "success");
      }

      navigate(`/patients/details/${patientId}?tab=insurance`);
    } catch (err) {
      console.error("Failed to save coverage", err);
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        (typeof err === "string" ? err : "Failed to save coverage");
      showSnackbar(errorMessage, "error");
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
    coverageTemplates,
    createTemplate,
    handleSave,
    handleCancel,
  };
};
