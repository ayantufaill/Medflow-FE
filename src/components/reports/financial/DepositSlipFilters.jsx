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
  paymentTypes,
  patientPayTypes,
  patPayAll,
  insPayTypes,
  insPayAll,
  refPayTypes,
  refPayAll,
  incDepTypes,
  incDepAll,
  handleToggleAll,
  handleToggleItem,
  showTemplateForm,
  setShowTemplateForm,
  templateName,
  setTemplateName,
  savingTemplate,
  handleSaveTemplate,
  handleCreateDepositClick,
  loading
}) => {
  const renderCheckboxList = (title, items, type, selectedList, isAllChecked) => (
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
    <Box className="no-print">
      <RadioGroup row value={filterMode} onChange={handleFilterModeChange} sx={{ mb: 2 }}>
        <FormControlLabel value="daily" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600 }}>Daily</Typography>} />
        <FormControlLabel value="weekly" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600 }}>Weekly</Typography>} />
        <FormControlLabel value="monthly" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600 }}>Monthly</Typography>} />
        <FormControlLabel value="range" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600 }}>Range</Typography>} />
      </RadioGroup>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
            start date
          </Typography>
          <DatePicker
            value={startDate}
            onChange={(v) => setStartDate(v)}
            format="MM/DD/YYYY"
            slotProps={{ 
              popper: { sx: { zIndex: 1400 } },
              textField: { 
                size: 'small', 
                sx: { 
                  width: '180px',
                  '& .MuiInputBase-root': { 
                    fontFamily: 'Inter', 
                    fontSize: '13px', 
                    borderRadius: '4px', 
                    height: '32px', 
                    backgroundColor: '#fafbfe',
                    color: '#09121f'
                  }, 
                  '& .MuiInputBase-input': { padding: '4px 10px' },
                  '& fieldset': { borderColor: '#e2e8f0' } 
                } 
              }
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
            end date
          </Typography>
          <DatePicker
            value={endDate}
            onChange={(v) => setEndDate(v)}
            format="MM/DD/YYYY"
            slotProps={{ 
              popper: { sx: { zIndex: 1400 } },
              textField: { 
                size: 'small', 
                sx: { 
                  width: '180px',
                  '& .MuiInputBase-root': { 
                    fontFamily: 'Inter', 
                    fontSize: '13px', 
                    borderRadius: '4px', 
                    height: '32px', 
                    backgroundColor: '#fafbfe',
                    color: '#09121f'
                  }, 
                  '& .MuiInputBase-input': { padding: '4px 10px' },
                  '& fieldset': { borderColor: '#e2e8f0' } 
                } 
              }
            }}
          />
        </Box>
      </Box>
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={<Checkbox size="small" />}
          label={<Typography variant="caption" sx={{ fontWeight: 600 }}>Group by provider</Typography>}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>Include payment types</Typography>
        <FormControlLabel
          control={<Checkbox size="small" defaultChecked />}
          label={<Typography variant="caption">Include Archived Payment Types</Typography>}
        />
      </Box>

      <Grid container spacing={1}>
        <Grid item xs={12} sm={4}>
          {renderCheckboxList('Patient payment types', paymentTypes, 'patient', patientPayTypes, patPayAll)}
        </Grid>
        <Grid item xs={12} sm={4}>
          {renderCheckboxList('Insurance payment types', paymentTypes, 'insurance', insPayTypes, insPayAll)}
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControlLabel
            control={
              <Checkbox 
                size="small" 
                checked={refPayAll} 
                onChange={(e) => handleToggleAll('refund', e.target.checked)} 
              />
            }
            label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Include refund payment types</Typography>}
          />
          <Box sx={{ pl: 2, display: 'flex', flexDirection: 'column' }}>
            {paymentTypes.map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox 
                    size="small" 
                    checked={refPayTypes.includes(item)} 
                    onChange={(e) => handleToggleItem('refund', item, e.target.checked)} 
                  />
                }
                label={<Typography variant="caption">{item}</Typography>}
                sx={{ my: -0.5 }}
              />
            ))}
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        {renderCheckboxList('Include Deposits', paymentTypes, 'include', incDepTypes, incDepAll)}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, pt: 3, borderTop: '1px solid #e2e8f0' }}>
        {!showTemplateForm && (
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => setShowTemplateForm(true)}
            sx={{ textTransform: 'none', borderRadius: '8px', borderColor: '#e2e8f0', color: '#1e293b', fontWeight: 600, '&:hover': { bgcolor: '#f8fafc' } }}
          >
            Create Template
          </Button>
        )}
        
        {showTemplateForm && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              size="small"
              placeholder="Enter Template Name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              sx={{ width: 200, '& .MuiInputBase-root': { height: 36, fontSize: '0.85rem', borderRadius: '8px' }, '& fieldset': { borderColor: '#e2e8f0' } }}
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

        {!showTemplateForm && (
          <Button 
            variant="contained" 
            size="small"
            onClick={handleCreateDepositClick}
            disabled={loading}
            sx={{ textTransform: 'none', bgcolor: '#2563eb', borderRadius: '8px', boxShadow: 'none', px: 3, '&:hover': { bgcolor: '#1d4ed8', boxShadow: 'none' } }}
          >
            {loading ? 'Generating...' : 'Generate Deposit Slip'}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default DepositSlipFilters;
