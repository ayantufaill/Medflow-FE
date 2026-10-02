import { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, CircularProgress, Alert } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import { COLORS } from '../../../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../../../constants/styles';
import PracticeDetailsStep from './PracticeDetailsStep';
import ChooseNumberStep from './ChooseNumberStep';

const STEPS = ['Confirm Practice Details', 'Choose Number'];

const getErrorMessage = (err, fallback) =>
  err.response?.data?.error?.message || err.response?.data?.message || err?.message || fallback;

// Same visual language as PracticeOnboardingPage's WizardProgressBar.
const StepProgress = ({ activeStep }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 1, pb: 5, px: 2 }}>
    {STEPS.map((label, index) => {
      const isCompleted = index < activeStep;
      const isActive = index === activeStep;
      return (
        <Box key={label} sx={{ display: 'flex', alignItems: 'center' }}>
          {index > 0 && <Box sx={{ height: 1.5, width: { xs: 80, sm: 220 }, bgcolor: isCompleted || isActive ? '#4A7BF7' : '#D0D5DD' }} />}
          <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: isCompleted || isActive ? '#4A7BF7' : 'transparent',
                border: isCompleted || isActive ? 'none' : '2px solid #D0D5DD',
                boxShadow: isActive ? '0 0 0 4px rgba(74, 123, 247, 0.25)' : 'none',
                transition: 'all 0.3s ease',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                top: 28,
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                color: isActive ? '#1E293B' : '#6B7280',
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {label}
            </Typography>
          </Box>
        </Box>
      );
    })}
  </Box>
);

const footerButtonSx = {
  textTransform: 'none',
  borderRadius: radius.md,
  fontFamily: 'Inter',
  fontSize: fontSize.base,
  fontWeight: fontWeight.semibold,
  minWidth: 120,
};

/**
 * Two-step flow for changing the practice's messaging number:
 * 1. confirm the business details carriers register the number against,
 * 2. pick an available number by area code.
 */
const NumberSelectionWizard = ({ api, currentNumber, onClose, onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [details, setDetails] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [stepError, setStepError] = useState('');

  const [areaCode, setAreaCode] = useState(currentNumber ? currentNumber.slice(0, 3) : '');
  const [numbers, setNumbers] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [selectedNumber, setSelectedNumber] = useState('');

  useEffect(() => {
    let cancelled = false;
    api
      .getPracticeDetails()
      .then((data) => !cancelled && setDetails(data))
      .catch((err) => !cancelled && setLoadError(getErrorMessage(err, 'Failed to load practice details.')));
    return () => {
      cancelled = true;
    };
  }, [api]);

  const handleFieldChange = (name, value) => {
    setDetails((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSearch = async () => {
    try {
      setSearching(true);
      setSearchError('');
      setSelectedNumber('');
      setNumbers(await api.searchAvailableNumbers(areaCode));
    } catch (err) {
      setNumbers(null);
      setSearchError(getErrorMessage(err, 'Failed to search numbers.'));
    } finally {
      setSearching(false);
    }
  };

  const handleNext = async () => {
    try {
      setSubmitting(true);
      setStepError('');
      const saved = await api.savePracticeDetails(details);
      setDetails(saved);
      setActiveStep(1);
      if (!numbers && areaCode.length === 3) handleSearch();
    } catch (err) {
      const fields = err.response?.data?.error?.details?.fields;
      if (fields) setFieldErrors(fields);
      setStepError(getErrorMessage(err, 'Failed to save practice details.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      setStepError('');
      onComplete(await api.selectMessagingNumber(selectedNumber));
    } catch (err) {
      setStepError(getErrorMessage(err, 'Failed to select number.'));
      setSubmitting(false);
    }
  };

  const renderContent = () => {
    if (loadError) return <Alert severity="error">{loadError}</Alert>;
    if (!details) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      );
    }
    return activeStep === 0 ? (
      <PracticeDetailsStep values={details} errors={fieldErrors} onChange={handleFieldChange} disabled={submitting} />
    ) : (
      <ChooseNumberStep
        areaCode={areaCode}
        onAreaCodeChange={(value) => {
          setAreaCode(value);
          if (searchError) setSearchError('');
        }}
        onSearch={handleSearch}
        searching={searching}
        searchError={searchError}
        numbers={numbers}
        selectedNumber={selectedNumber}
        onSelect={setSelectedNumber}
        disabled={submitting}
      />
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '70vh' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 4,
          py: 2.5,
          borderBottom: '1px solid #E5E9F2',
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#1E293B' }}>Number Selection</Typography>
        <IconButton
          onClick={onClose}
          disabled={submitting}
          aria-label="Close number selection"
          sx={{ color: '#6b7280', '&:hover': { color: '#111928', backgroundColor: '#e5e7eb' } }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ flex: 1, px: 4, pt: 4, pb: 3 }}>
        <Box sx={{ maxWidth: 760, mx: 'auto' }}>
          <StepProgress activeStep={activeStep} />
          {stepError && (
            <Alert severity="error" sx={{ mb: 2.5 }}>
              {stepError}
            </Alert>
          )}
          {renderContent()}
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 1.5,
          px: 4,
          py: 2.5,
          borderTop: '1px solid #E5E9F2',
        }}
      >
        <Button
          variant="outlined"
          onClick={activeStep === 0 ? onClose : () => setActiveStep(0)}
          disabled={submitting}
          sx={{
            ...footerButtonSx,
            color: COLORS.TEXT_SECONDARY,
            borderColor: COLORS.BORDER,
            '&:hover': { borderColor: COLORS.TEXT_MUTED, backgroundColor: COLORS.SURFACE_HOVER },
          }}
        >
          {activeStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={activeStep === 0 ? handleNext : handleConfirm}
          disabled={!details || submitting || (activeStep === 1 && !selectedNumber)}
          startIcon={submitting ? <CircularProgress size={14} sx={{ color: COLORS.WHITE }} /> : null}
          sx={{
            ...footerButtonSx,
            backgroundColor: COLORS.ACCENT,
            color: COLORS.WHITE,
            '&:hover': { backgroundColor: COLORS.ACCENT_HOVER },
            '&.Mui-disabled': { backgroundColor: COLORS.BORDER, color: COLORS.TEXT_MUTED },
          }}
        >
          {activeStep === 0 ? (submitting ? 'Saving...' : 'Next') : submitting ? 'Confirming...' : 'Confirm Number'}
        </Button>
      </Box>
    </Box>
  );
};

export default NumberSelectionWizard;
