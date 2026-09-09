import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Button,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const DepositSlipFilters = ({
  filterMode,
  handleFilterModeChange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  paymentTypes = [],
  patientPaymentTypesOptions,
  insurancePaymentTypesOptions,
  refundPaymentTypesOptions,
  includeDepositTypesOptions,
  patientPayTypes = [],
  patPayAll = false,
  insPayTypes = [],
  insPayAll = false,
  refPayTypes = [],
  refPayAll = false,
  incDepTypes = [],
  incDepAll = false,
  handleToggleAll,
  handleToggleItem,
  showTemplateForm,
  setShowTemplateForm,
  templateName,
  setTemplateName,
  savingTemplate,
  handleSaveTemplate,
  handleCreateDepositClick,
  loading,
  title = "Create new deposit slip:",
  buttonText = "Generate Deposit Slip",
  extraButtons = null
}) => {
  const renderCheckboxList = (title, items = [], type, selectedList = [], isAllChecked) => (
    <Box sx={{ mb: 2 }}>
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={isAllChecked}
            onChange={(e) => handleToggleAll(type, e.target.checked)}
          />
        }
        label={<Typography variant="body2" sx={{ fontWeight: 600 }}>{title}</Typography>}
      />
      <Box sx={{ pl: 2, display: 'flex', flexDirection: 'column' }}>
        {items.map((item) => (
          <FormControlLabel
            key={item}
            control={
              <Checkbox
                size="small"
                checked={selectedList.includes(item)}
                onChange={(e) => handleToggleItem(type, item, e.target.checked)}
              />
            }
            label={<Typography variant="caption">{item}</Typography>}
            sx={{ my: -0.5 }}
          />
        ))}
      </Box>
    </Box>
  );

  return (
    <Box className="no-print" sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', bgcolor: '#fff' }}>
      {/* Top Content Area */}
      <Box sx={{ p: 3 }}>
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', lineHeight: '20px', letterSpacing: '0px', color: '#2563eb', mb: 1.5 }}>
          {title}
        </Typography>
        <RadioGroup row value={filterMode} onChange={handleFilterModeChange} sx={{ mb: 3 }}>
          <FormControlLabel value="daily" control={<Radio size="small" />} label={<Typography variant="body2" sx={{ fontWeight: 400, color: '#1e293b' }}>Daily</Typography>} />
          <FormControlLabel value="range" control={<Radio size="small" />} label={<Typography variant="body2" sx={{ fontWeight: 400, color: '#1e293b' }}>Range</Typography>} />
          <FormControlLabel value="weekly" control={<Radio size="small" />} label={<Typography variant="body2" sx={{ fontWeight: 400, color: '#1e293b' }}>Weekly</Typography>} />
          <FormControlLabel value="monthly" control={<Radio size="small" />} label={<Typography variant="body2" sx={{ fontWeight: 400, color: '#1e293b' }}>Monthly</Typography>} />
        </RadioGroup>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
            Transactions done from:
          </Typography>
          <DatePicker
            value={startDate}
            onChange={(v) => setStartDate(v)}
            format="MM/DD/YYYY"
            slotProps={{
              textField: { size: 'small', sx: { width: 140, '& .MuiInputBase-root': { height: 36, fontSize: '0.85rem' } } }
            }}
          />
          <Typography variant="body2" sx={{ color: '#64748b' }}>to:</Typography>

          <DatePicker
            value={endDate}
            onChange={(v) => setEndDate(v)}
            format="MM/DD/YYYY"
            slotProps={{
              textField: { size: 'small', sx: { width: 140, '& .MuiInputBase-root': { height: 36, fontSize: '0.85rem' } } }
            }}
          />

          <Box sx={{ ml: 4 }}>
            <FormControlLabel
              control={<Radio size="small" defaultChecked />}
              label={<Typography variant="body2" sx={{ color: '#1e293b' }}>Group by provider</Typography>}
            />
          </Box>
        </Box>

        {/* Action Buttons Row */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mb: 4, pb: 3, borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
          {!showTemplateForm && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'nowrap' }}>
              {extraButtons}
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowTemplateForm(true)}
                sx={{ textTransform: 'none', borderRadius: '8px', borderColor: '#e2e8f0', color: '#1e293b', fontWeight: 600, bgcolor: '#fff', whiteSpace: 'nowrap', boxShadow: 'none', '&:hover': { bgcolor: '#f8fafc' } }}
              >
                Create Template
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleCreateDepositClick}
                disabled={loading}
                sx={{ textTransform: 'none', bgcolor: '#2362EF', borderRadius: '8px', boxShadow: 'none', px: 2, fontWeight: 600, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#1D53CC', boxShadow: 'none' } }}
              >
                {loading ? 'Generating...' : buttonText}
              </Button>
            </Box>
          )}

          {showTemplateForm && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Enter Template Name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                sx={{ width: 200, '& .MuiInputBase-root': { height: 36, fontSize: '0.85rem', borderRadius: '8px', bgcolor: '#fff' }, '& fieldset': { borderColor: '#e2e8f0' } }}
                autoFocus
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleSaveTemplate}
                disabled={savingTemplate}
                sx={{ textTransform: 'none', borderRadius: '8px', bgcolor: '#3b82f6', boxShadow: 'none', fontWeight: 600, '&:hover': { bgcolor: '#2563eb', boxShadow: 'none' } }}
              >
                {savingTemplate ? 'Saving...' : 'Save Template'}
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  setShowTemplateForm(false);
                  setTemplateName('');
                }}
                sx={{ textTransform: 'none', color: '#64748b', fontWeight: 600 }}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Include payment types</Typography>
          <FormControlLabel
            control={<Checkbox size="small" defaultChecked />}
            label={<Typography variant="caption">Include Archived Payment Types</Typography>}
          />
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={12} sm={3}>
            {renderCheckboxList('Patient payment types', patientPaymentTypesOptions || paymentTypes, 'patient', patientPayTypes, patPayAll)}
          </Grid>
          <Grid item xs={12} sm={3}>
            {renderCheckboxList('Insurance payment types', insurancePaymentTypesOptions || paymentTypes, 'insurance', insPayTypes, insPayAll)}
          </Grid>
          <Grid item xs={12} sm={3}>
            {renderCheckboxList('Include refund payment types', refundPaymentTypesOptions || paymentTypes, 'refund', refPayTypes, refPayAll)}
          </Grid>
          <Grid item xs={12} sm={3}>
            {renderCheckboxList('Include Deposits', includeDepositTypesOptions || paymentTypes, 'include', incDepTypes, incDepAll)}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DepositSlipFilters;
