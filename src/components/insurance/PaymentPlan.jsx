import React from "react";
import { Box, Typography, TextField, Checkbox, FormControlLabel, Grid } from "@mui/material";

const PaymentPlan = ({ 
  formData,
  handleInputChange,
  inputBg
}) => {
  return (
    <Box sx={{ mt: 2.5 }}>
      {/* Add Payment Plan Checkbox */}
      <Grid container alignItems="center">
        <Grid item>
               <Typography sx={{ fontWeight: 700,  mb: 1.5, color: "#333", fontSize: '0.8rem' }}>Payment Plan</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.addPaymentPlan || false}
                onChange={(e) => handleInputChange('addPaymentPlan', e.target.checked)}
                size="small"
                sx={{ 
                  padding: '4px',
                  '& .MuiSvgIcon-root': { fontSize: '0.9rem' }
                }}
              />
            }
            label={
              <Typography sx={{ 
                fontSize: '0.7rem', 
                fontWeight: 600, 
                color: '#666',
                ml: 0.5
              }}>
                Add Payment Plan
              </Typography>
            }
            sx={{ 
              ml: 0,
              '& .MuiFormControlLabel-label': {
                fontSize: '0.7rem'
              }
            }}
          />
        </Grid>
      </Grid>

      {/* Payment Plan Fields - Show only when checkbox is checked */}
      {formData.addPaymentPlan && (
        <Grid container spacing={2} sx={{ mt: 1.5 }}>
          <Grid item xs={6}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#666', mb: 0.5 }}>
              Monthly Payment Amount
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.monthlyPaymentAmount || ''}
              onChange={(e) => handleInputChange('monthlyPaymentAmount', e.target.value)}
              placeholder="$0.00"
              sx={{ 
                bgcolor: inputBg || '#f9fafb',
                '& .MuiInputBase-input': { 
                  fontSize: '0.7rem', 
                  py: 0.8 
                },
                '& .MuiInputLabel-root': { fontSize: '0.65rem' }
              }}
            />
          </Grid>
          
          <Grid item xs={6}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#666', mb: 0.5 }}>
              Payment Day of Month
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="number"
              value={formData.paymentDayOfMonth || ''}
              onChange={(e) => handleInputChange('paymentDayOfMonth', e.target.value)}
              placeholder="1-31"
              inputProps={{ min: 1, max: 31 }}
              sx={{ 
                bgcolor: inputBg || '#f9fafb',
                '& .MuiInputBase-input': { 
                  fontSize: '0.7rem', 
                  py: 0.8 
                },
                '& .MuiInputLabel-root': { fontSize: '0.65rem' }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#666', mb: 0.5 }}>
              Payment Method
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={formData.paymentMethod || ''}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              SelectProps={{
                native: true,
              }}
              sx={{ 
                bgcolor: inputBg || '#f9fafb',
                '& .MuiInputBase-input': { 
                  fontSize: '0.7rem', 
                  py: 0.8 
                },
                '& .MuiInputLabel-root': { fontSize: '0.65rem' }
              }}
            >
              <option value="">Select payment method</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="bank_account">Bank Account (ACH)</option>
              <option value="check">Check</option>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#666', mb: 0.5 }}>
              Payment Notes
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={formData.paymentNotes || ''}
              onChange={(e) => handleInputChange('paymentNotes', e.target.value)}
              placeholder="Add payment plan notes..."
              sx={{ 
                bgcolor: inputBg || '#f9fafb',
                '& .MuiInputBase-root': { fontSize: '0.7rem' },
                '& textarea': {
                  overflow: 'auto',
                  maxHeight: '100px'
                }
              }}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default PaymentPlan;
