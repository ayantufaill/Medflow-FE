import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import BaseDialog from '../shared/BaseDialog';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';

const CLAIM_STATUS_MODIFICATIONS = [
  {
    value: 'accepted-paid',
    label: 'Accepted and Paid',
    status: 'paid',
    showRemittanceDate: true,
    requireRemittanceDate: true,
    showInsurancePaymentAmount: true,
  },
  {
    value: 'accepted-denied',
    label: 'Accept but Final Payment Denied',
    status: 'accepted',
  },
  {
    value: 'rejected',
    label: 'Rejected',
    status: 'rejected',
    showRemittanceDate: true,
    requireRemittanceDate: true,
  },
];

const ModifyClaimStatusDialog = ({ open, claim, onClose, onSave }) => {
  const [option, setOption] = useState(CLAIM_STATUS_MODIFICATIONS[0].value);
  const [remittanceDate, setRemittanceDate] = useState(null);
  const [insurancePaymentAmount, setInsurancePaymentAmount] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setOption(CLAIM_STATUS_MODIFICATIONS[0].value);
      setRemittanceDate(claim?.remittanceDate ? dayjs(claim.remittanceDate) : null);
      setInsurancePaymentAmount(
        claim?.insurancePaymentAmount != null ? String(claim.insurancePaymentAmount) : '',
      );
      setSaving(false);
    }
  }, [open, claim]);

  const selectedOption = useMemo(
    () => CLAIM_STATUS_MODIFICATIONS.find((opt) => opt.value === option) || CLAIM_STATUS_MODIFICATIONS[0],
    [option],
  );

  const hasRemittanceDate = Boolean(remittanceDate && remittanceDate.isValid && remittanceDate.isValid());
  // Save stays disabled until a remitance date exists for the options that need one.
  const canSave = !selectedOption.requireRemittanceDate || hasRemittanceDate;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await onSave?.({
        option: selectedOption.value,
        label: selectedOption.label,
        status: selectedOption.status,
        remittanceDate: selectedOption.showRemittanceDate && hasRemittanceDate
          ? remittanceDate.format('YYYY-MM-DD')
          : '',
        insurancePaymentAmount: selectedOption.showInsurancePaymentAmount
          ? insurancePaymentAmount.trim() === ''
            ? null
            : Number(String(insurancePaymentAmount).replace(/[^0-9.-]+/g, '')) || 0
          : null,
      });
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title="Modify claim status"
      loading={saving}
      maxWidth="sm"
      actions={
        <>
          <Button
            onClick={onClose}
            disabled={saving}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: COLORS.BORDER,
              color: COLORS.TEXT_PRIMARY,
              fontSize: '13px',
              fontWeight: fontWeight.medium,
              borderRadius: radius.sm,
              height: '36px',
              px: 3,
              '&:hover': { borderColor: COLORS.TEXT_SECONDARY, bgcolor: 'transparent' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!canSave || saving}
            variant="contained"
            startIcon={saving ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : null}
            sx={{
              textTransform: 'none',
              bgcolor: COLORS.ACCENT,
              color: COLORS.WHITE,
              fontSize: '13px',
              fontWeight: fontWeight.medium,
              borderRadius: radius.sm,
              height: '36px',
              px: 3,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1b4ecc', boxShadow: 'none' },
            }}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </>
      }
    >
      {claim && (
        <Typography sx={{ fontSize: '12px', color: COLORS.TEXT_SECONDARY, mb: 2 }}>
          Claim #{claim.claimNumber || claim.id || claim._id || '—'}
        </Typography>
      )}

      <RadioGroup
        row
        value={option}
        onChange={(e) => setOption(e.target.value)}
        sx={{ flexWrap: 'wrap', rowGap: 1, columnGap: 3 }}
      >
        {CLAIM_STATUS_MODIFICATIONS.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            control={<Radio size="small" sx={{ color: COLORS.BORDER, '&.Mui-checked': { color: COLORS.ACCENT } }} />}
            label={
              <Typography sx={{ fontSize: '13px', fontWeight: fontWeight.medium, color: COLORS.TEXT_PRIMARY }}>
                {opt.label}
              </Typography>
            }
          />
        ))}
      </RadioGroup>

      {selectedOption.showRemittanceDate && (
        <Box sx={{ mt: 2, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box>
            <Typography sx={{ fontSize: '12px', fontWeight: fontWeight.medium, color: COLORS.TEXT_PRIMARY, mb: 0.75 }}>
              Remittance Date <Box component="span" sx={{ color: '#d32f2f' }}>*</Box>
            </Typography>
            <DatePicker
              value={remittanceDate}
              onChange={setRemittanceDate}
              format="MM/DD/YYYY"
              slotProps={{
                popper: { sx: { zIndex: 999999 } },
                textField: {
                  size: 'small',
                  error: !hasRemittanceDate,
                  helperText: !hasRemittanceDate ? 'Remittance date is required' : ' ',
                  sx: {
                    width: 180,
                    '& .MuiInputBase-root': { height: '36px', fontSize: '13px', borderRadius: radius.sm },
                  },
                },
              }}
            />
          </Box>

          {selectedOption.showInsurancePaymentAmount && (
            <Box>
              <Typography sx={{ fontSize: '12px', fontWeight: fontWeight.medium, color: COLORS.TEXT_PRIMARY, mb: 0.75 }}>
                Insurance Payment Amount
              </Typography>
              <TextField
                size="small"
                value={insurancePaymentAmount}
                onChange={(e) => setInsurancePaymentAmount(e.target.value)}
                placeholder="0.00"
                slotProps={{ htmlInput: { inputMode: 'decimal' } }}
                sx={{
                  width: 180,
                  '& .MuiInputBase-root': { height: '36px', fontSize: '13px', borderRadius: radius.sm },
                }}
              />
            </Box>
          )}
        </Box>
      )}
    </BaseDialog>
  );
};

export default ModifyClaimStatusDialog;
