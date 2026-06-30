import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useSnackbar } from '../../contexts/SnackbarContext';
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
  CoverageBookModal
} from '../../components/insurance';

import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import TaskList from '../../components/appointments/right-panel/TaskList';
import Messages from '../../components/appointments/right-panel/Messages';
import AddCoverageHeader from '../../components/insurance/AddCoverageHeader';

import { useCoverageForm } from './hooks/useCoverageForm';
import { useCoverageData } from './hooks/useCoverageData';
import { ASSIGNMENT_OF_BENEFITS_OPTIONS, COVERAGE_TYPES, STYLE_CONSTANTS } from './utils/coverageConstants';

const ActionText = ({ icon: Icon, text, color = "#4db6ac" }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', ml: 1 }}>
    <Icon sx={{ fontSize: 14, color }} />
    <Typography sx={{ fontSize: '0.65rem', color, fontWeight: 600 }}>{text}</Typography>
  </Box>
);

const AddCoveragePage = () => {
  const { patientId, insuranceId } = useParams();
  const { showSnackbar } = useSnackbar();
  const { currentPatient: patient, fetchById: fetchPatient } = usePatient();

  const [isFeeGuideModalOpen, setIsFeeGuideModalOpen] = useState(false);
  const [isCoverageBookModalOpen, setIsCoverageBookModalOpen] = useState(false);

  const {
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
    handlers
  } = useCoverageForm(patient);

  const {
    loading,
    feeGuides,
    allCompanies,
    coverageTemplates,
    handleSave,
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

  const planFeeGuideOptions = feeGuides.map(fg => ({
    value: fg._id || fg.FeeSchedNum || fg.feeSchedNum || fg.id,
    label: fg.Description || fg.description || fg.name || 'Unknown Fee Guide'
  }));

  const handleViewFullBook = () => setIsCoverageBookModalOpen(true);

  return (
    <Box sx={{ bgcolor: "#f5f6f8", minHeight: "100vh" }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: '20px', p: 3, maxWidth: '1857px', margin: '0 auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minWidth: 0 }}>
          <AddCoverageHeader onSave={handleSave} onCancel={handleCancel} loading={loading} />

          <Box sx={{ display: 'flex', gap: '20px' }}>
            <Box sx={{ width: '480px', minWidth: '480px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <InsuranceInformation
                formData={{
                  ...formData,
                  coverageTemplates,
                  handleApplyTemplate: (t) => handlers.handleApplyTemplate(t, showSnackbar)
                }}
                handleInputChange={handlers.handleInputChange}
                insuranceCompanies={allCompanies?.companies || allCompanies || []}
                ASSIGNMENT_OF_BENEFITS_OPTIONS={ASSIGNMENT_OF_BENEFITS_OPTIONS}
                tinyText={STYLE_CONSTANTS.tinyText}
                blueHeader={STYLE_CONSTANTS.blueHeader}
                inputBg={STYLE_CONSTANTS.inputBg}
              />

              <SubscriberInformation
                formData={formData}
                handleSubscriberChange={handlers.handleSubscriberChange}
                handleInputChange={handlers.handleInputChange}
                ASSIGNMENT_OF_BENEFITS_OPTIONS={ASSIGNMENT_OF_BENEFITS_OPTIONS}
                inputBg={STYLE_CONSTANTS.inputBg}
              />

              <RenewalSection
                formData={formData}
                handleRenewalChange={handlers.handleRenewalChange}
                inputBg={STYLE_CONSTANTS.inputBg}
              />

              <AdvancedSection
                formData={formData}
                handleInputChange={handlers.handleInputChange}
                inputBg={STYLE_CONSTANTS.inputBg}
              />

              <PolicyNotes
                formData={formData}
                handleInputChange={handlers.handleInputChange}
              />
            </Box>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
              <PlanFeeGuideSection
                formData={formData}
                handleInputChange={handlers.handleInputChange}
                planFeeGuideOptions={planFeeGuideOptions}
                COVERAGE_TYPES={COVERAGE_TYPES}
                setIsFeeGuideModalOpen={setIsFeeGuideModalOpen}
                handleProviderFeeGuideChange={handlers.handleProviderFeeGuideChange}
                handleRemoveProviderFeeGuide={handlers.handleRemoveProviderFeeGuide}
                handleAddProviderFeeGuide={handlers.handleAddProviderFeeGuide}
              />

              <DeductiblesTable
                formData={formData}
                handleDeductibleChange={handlers.handleDeductibleChange}
                handleAddDeductibleRow={handlers.handleAddDeductibleRow}
                handleRemoveDeductibleRow={handlers.handleRemoveDeductibleRow}
                tableHeaderStyle={STYLE_CONSTANTS.tableHeaderStyle}
                blueHeader={STYLE_CONSTANTS.blueHeader}
              />

              <CoverageTable
                formData={formData}
                handleCoverageChange={handlers.handleCoverageChange}
                handleInputChange={handlers.handleInputChange}
                handleRemoveOrthoMax={handlers.handleRemoveOrthoMax}
                handleAddCategoryMax={handlers.handleAddCategoryMax}
                headerStyle={STYLE_CONSTANTS.headerStyle}
                bodyCellStyle={STYLE_CONSTANTS.bodyCellStyle}
                blueHeader={STYLE_CONSTANTS.blueHeader}
                ActionText={ActionText}
                coverageCategoryData={coverageCategoryData}
                setCoverageCategoryData={setCoverageCategoryData}
              />

              <CoverageBookSummary
                headerStyle={STYLE_CONSTANTS.headerStyle}
                bodyCellStyle={STYLE_CONSTANTS.bodyCellStyle}
                blueHeader={STYLE_CONSTANTS.blueHeader}
                coverageData={coverageBookData}
                onCoverageDataChange={setCoverageBookData}
                onViewFullBook={handleViewFullBook}
              />
            </Box>
          </Box>
        </Box>

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