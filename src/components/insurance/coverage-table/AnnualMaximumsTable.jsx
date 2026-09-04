import React from 'react';
import { Box, Typography, Checkbox, Table, TableHead, TableBody, TableRow, TableCell, TextField, InputAdornment, FormControlLabel, Tooltip } from "@mui/material";
import { 
  InfoOutlined as InfoIcon,
  AddCircleOutline as AddIcon,
  RemoveCircleOutline as RemoveIcon
} from "@mui/icons-material";
import { InsuranceDatePicker } from '../components/DeductiblesTable';

const textInputSx = {
  bgcolor: '#f8f9fc',
  borderRadius: '6px',
  '& .MuiInputBase-root': { 
    fontFamily: "'Inter', sans-serif", 
    fontSize: '13px', 
    fontWeight: 500, 
    height: '36px', 
    color: '#1e293b' 
  },
  '& fieldset': { borderColor: '#DFE5EC' },
  '&:hover fieldset': { borderColor: '#2362EF' }
};

const cellHeaderStyle = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '11px',
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  py: 1.5,
  letterSpacing: '0.3px'
};

const AnnualMaximumsTable = ({ formData, handleCoverageChange, handleInputChange, headerStyle }) => {
  const mergedHeaderStyle = { ...cellHeaderStyle, ...headerStyle };

  return (
    <Box sx={{ px: 3, py: 2.5 }}>
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fc', borderTop: '1px solid #DFE5EC', borderBottom: '1px solid #DFE5EC' }}>
              <TableCell sx={{ ...mergedHeaderStyle, borderRight: 'none', borderBottom: 'none', py: 1.5 }}></TableCell>
              <TableCell sx={{ ...mergedHeaderStyle, borderRight: 'none', borderBottom: 'none', py: 1.5 }} align="center">UNLIMITED</TableCell>
              <TableCell sx={{ ...mergedHeaderStyle, borderRight: 'none', borderBottom: 'none', py: 1.5 }}>ANNUAL MAX</TableCell>
              <TableCell sx={{ ...mergedHeaderStyle, borderRight: 'none', borderBottom: 'none', py: 1.5 }}>USED AMOUNT</TableCell>
              <TableCell sx={{ ...mergedHeaderStyle, borderRight: 'none', borderBottom: 'none', py: 1.5, minWidth: '140px' }}>USED UP-TO DATE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Individual Row */}
            <TableRow sx={{ borderBottom: '1px solid #f0f0f0' }}>
              <TableCell sx={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, color: '#1e293b', borderBottom: 'none', py: 1.5, width: '20%' }}>Individual</TableCell>
              <TableCell align="center" sx={{ borderBottom: 'none', py: 1.5 }}>
                <Checkbox 
                  size="small" 
                  checked={formData.coverage.individual.unlimited}
                  onChange={(e) => handleCoverageChange('individual', 'unlimited', e.target.checked)}
                  sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2362EF' } }}
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <TextField 
                  fullWidth
                  size="small" 
                  disabled={formData.coverage.individual.unlimited}
                  value={formData.coverage.individual.unlimited ? '' : formData.coverage.individual.annualMax}
                  placeholder={formData.coverage.individual.unlimited ? 'Unlimited' : ''}
                  onChange={(e) => handleCoverageChange('individual', 'annualMax', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#94a3b8' }}>$</Typography></InputAdornment>,
                  }}
                  sx={textInputSx} 
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <TextField 
                  fullWidth
                  size="small" 
                  value={formData.coverage.individual.usedAmount || ''}
                  onChange={(e) => handleCoverageChange('individual', 'usedAmount', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#94a3b8' }}>$</Typography></InputAdornment>,
                  }}
                  sx={textInputSx} 
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <InsuranceDatePicker
                  value={formData.coverage.individual.usedAmountDate}
                  onChange={(formatted) => handleCoverageChange('individual', 'usedAmountDate', formatted)}
                />
              </TableCell>
            </TableRow>

            {/* Family Row */}
            <TableRow sx={{ borderBottom: '1px solid #f0f0f0' }}>
              <TableCell sx={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, color: '#1e293b', borderBottom: 'none', py: 1.5 }}>Family</TableCell>
              <TableCell align="center" sx={{ borderBottom: 'none', py: 1.5 }}>
                <Checkbox 
                  size="small" 
                  checked={formData.coverage.family.unlimited}
                  onChange={(e) => handleCoverageChange('family', 'unlimited', e.target.checked)}
                  sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2362EF' } }}
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <TextField 
                  fullWidth
                  size="small" 
                  disabled={formData.coverage.family.unlimited}
                  value={formData.coverage.family.unlimited ? '' : formData.coverage.family.annualMax}
                  placeholder={formData.coverage.family.unlimited ? 'Unlimited' : ''}
                  onChange={(e) => handleCoverageChange('family', 'annualMax', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#94a3b8' }}>$</Typography></InputAdornment>,
                  }}
                  sx={textInputSx} 
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <TextField 
                  fullWidth
                  size="small" 
                  value={formData.coverage.family.usedAmount || ''}
                  onChange={(e) => handleCoverageChange('family', 'usedAmount', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#94a3b8' }}>$</Typography></InputAdornment>,
                  }}
                  sx={textInputSx} 
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <InsuranceDatePicker
                  value={formData.coverage.family.usedAmountDate}
                  onChange={(formatted) => handleCoverageChange('family', 'usedAmountDate', formatted)}
                />
              </TableCell>
            </TableRow>

            {/* Category Rows with Add Max / Remove Max */}
            {[
              { key: 'ortho', label: 'Ortho' },
              { key: 'diagnostic', label: 'Diagnostic' },
              { key: 'preventative', label: 'Preventative' },
              { key: 'basic', label: 'Basic' },
              { key: 'major', label: 'Major' }
            ].map(({ key: catKey, label }) => {
              const catObj = formData.coverage?.[catKey] || {};
              const hasMax = catObj.hasMax !== undefined 
                ? catObj.hasMax 
                : (catKey === 'ortho'
                    ? Boolean(catObj.annualMax || catObj.usedAmount || catObj.unlimited || catObj.usedAmountDate || true)
                    : Boolean(catObj.annualMax || catObj.usedAmount || catObj.unlimited || catObj.usedAmountDate));

              const handleToggleMax = (enable) => {
                if (enable) {
                  handleCoverageChange(catKey, 'hasMax', true);
                } else {
                  handleCoverageChange(catKey, 'hasMax', false);
                  handleCoverageChange(catKey, 'annualMax', '');
                  handleCoverageChange(catKey, 'usedAmount', '');
                  handleCoverageChange(catKey, 'usedAmountDate', '');
                  handleCoverageChange(catKey, 'unlimited', false);
                }
              };

              return (
                <TableRow key={catKey} sx={{ borderBottom: '1px solid #f0f0f0' }}>
                  <TableCell sx={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, color: '#1e293b', borderBottom: 'none', py: 1.5, width: '20%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600 }}>{label}</Typography>
                      {hasMax ? (
                        <Box 
                          onClick={() => handleToggleMax(false)}
                          sx={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: 0.4, 
                            color: '#94a3b8', 
                            fontFamily: "'Inter', sans-serif", 
                            fontSize: '11px', 
                            ml: 1.5, 
                            cursor: 'pointer', 
                            fontWeight: 500,
                            textDecoration: 'underline',
                            '&:hover': { color: '#475569' } 
                          }}
                        >
                          <RemoveIcon sx={{ fontSize: 13 }} /> Remove Max
                        </Box>
                      ) : (
                        <Box 
                          onClick={() => handleToggleMax(true)}
                          sx={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: 0.4, 
                            color: '#00b09b', 
                            fontFamily: "'Inter', sans-serif", 
                            fontSize: '11px', 
                            ml: 1.5, 
                            cursor: 'pointer', 
                            fontWeight: 600,
                            '&:hover': { color: '#008e7d' } 
                          }}
                        >
                          <AddIcon sx={{ fontSize: 13 }} /> Add Max
                        </Box>
                      )}
                    </Box>
                  </TableCell>

                  {hasMax ? (
                    <>
                      <TableCell align="center" sx={{ borderBottom: 'none', py: 1.5 }}>
                        <Checkbox 
                          size="small" 
                          checked={catObj.unlimited || false}
                          onChange={(e) => handleCoverageChange(catKey, 'unlimited', e.target.checked)}
                          sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2362EF' } }}
                        />
                      </TableCell>
                      <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                        <TextField 
                          fullWidth
                          size="small" 
                          disabled={catObj.unlimited}
                          value={catObj.unlimited ? '' : catObj.annualMax || ''}
                          placeholder={catObj.unlimited ? 'Unlimited' : ''}
                          onChange={(e) => handleCoverageChange(catKey, 'annualMax', e.target.value)}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"><Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#94a3b8' }}>$</Typography></InputAdornment>,
                          }}
                          sx={textInputSx} 
                        />
                      </TableCell>
                      <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                        <TextField 
                          fullWidth
                          size="small" 
                          value={catObj.usedAmount || ''}
                          onChange={(e) => handleCoverageChange(catKey, 'usedAmount', e.target.value)}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"><Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#94a3b8' }}>$</Typography></InputAdornment>,
                          }}
                          sx={textInputSx} 
                        />
                      </TableCell>
                      <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                        <InsuranceDatePicker
                          value={catObj.usedAmountDate}
                          onChange={(formatted) => handleCoverageChange(catKey, 'usedAmountDate', formatted)}
                        />
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell align="center" sx={{ borderBottom: 'none', py: 1.5 }} />
                      <TableCell sx={{ borderBottom: 'none', py: 1.5 }} />
                      <TableCell sx={{ borderBottom: 'none', py: 1.5 }} />
                      <TableCell sx={{ borderBottom: 'none', py: 1.5, color: '#94a3b8', fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
                        —
                      </TableCell>
                    </>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5, ml: 0.5 }}>
        <FormControlLabel 
          sx={{ mr: 0 }}
          control={<Checkbox size="small" checked={formData.honorWriteOff || false} onChange={(e) => handleInputChange('honorWriteOff', e.target.checked)} sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#2362EF' } }} />} 
          label={
            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#475569' }}>Honor Write Off (When Limitation Reached for In-Network Providers Only)</Typography> 
          } 
        />
        <Tooltip
          PopperProps={{ sx: { zIndex: 999999 } }}
          title={
            <Typography sx={{ fontSize: '11.5px', color: '#1e3a8a', lineHeight: 1.45, fontWeight: 500, p: 0.5 }}>
              Limits include Delivery pattern, Waiting Period, Age Limit, Tooth Limit and Annual Max Amounts
            </Typography>
          }
          placement="top"
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: '#ffffff',
                color: '#1e3a8a',
                border: '1px solid #1e3a8a',
                boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                borderRadius: '6px',
                maxWidth: 270,
                p: 1,
                '& .MuiTooltip-arrow': {
                  color: '#ffffff',
                  '&::before': {
                    border: '1px solid #1e3a8a',
                    backgroundColor: '#ffffff',
                  },
                },
              },
            },
          }}
        >
          <InfoIcon sx={{ fontSize: 14, color: '#94a3b8', cursor: 'pointer', '&:hover': { color: '#2362EF' } }} />
        </Tooltip>
      </Box>
    </Box>
  );
};

export default AnnualMaximumsTable;
