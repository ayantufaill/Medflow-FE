import React from 'react';
import { Box, Typography, Checkbox, Table, TableHead, TableBody, TableRow, TableCell, TextField, InputAdornment, FormControlLabel } from "@mui/material";
import { InfoOutlined as InfoIcon } from "@mui/icons-material";

const AnnualMaximumsTable = ({ formData, handleCoverageChange, handleInputChange, headerStyle }) => {
  return (
    <Box sx={{ px: 3, py: 2.5 }}>
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8f9fc', borderTop: '1px solid #DFE5EC', borderBottom: '1px solid #DFE5EC' }}>
              <TableCell sx={{ ...headerStyle, borderRight: 'none', borderBottom: 'none', color: '#777', py: 1.5 }}></TableCell>
              <TableCell sx={{ ...headerStyle, borderRight: 'none', borderBottom: 'none', color: '#777', py: 1.5 }} align="center">UNLIMITED</TableCell>
              <TableCell sx={{ ...headerStyle, borderRight: 'none', borderBottom: 'none', color: '#777', py: 1.5 }}>ANNUAL MAX</TableCell>
              <TableCell sx={{ ...headerStyle, borderRight: 'none', borderBottom: 'none', color: '#777', py: 1.5 }}>USED AMOUNT</TableCell>
              <TableCell sx={{ ...headerStyle, borderRight: 'none', borderBottom: 'none', color: '#777', py: 1.5 }}>USED UP-TO DATE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Individual Row */}
            <TableRow sx={{ borderBottom: '1px solid #f0f0f0' }}>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#333', borderBottom: 'none', py: 1.5, width: '20%' }}>Individual</TableCell>
              <TableCell align="center" sx={{ borderBottom: 'none', py: 1.5 }}>
                <Checkbox 
                  size="small" 
                  checked={formData.coverage.individual.unlimited}
                  onChange={(e) => handleCoverageChange('individual', 'unlimited', e.target.checked)}
                  sx={{ p: 0.5, color: '#ccc', '&.Mui-checked': { color: '#1976d2' } }}
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
                    startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#555' }}>$</Typography></InputAdornment>,
                  }}
                  sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#555' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <TextField 
                  fullWidth
                  size="small" 
                  value={formData.coverage.individual.usedAmount}
                  disabled
                  placeholder="Auto-"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#aaa' }}>$</Typography></InputAdornment>,
                  }}
                  sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#aaa' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <TextField 
                  fullWidth
                  size="small" 
                  type="text"
                  placeholder="mm / dd / yyyy"
                  value={formData.coverage.individual.usedAmountDate || ''}
                  onChange={(e) => handleCoverageChange('individual', 'usedAmountDate', e.target.value)}
                  sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#555' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                />
              </TableCell>
            </TableRow>

            {/* Family Row */}
            <TableRow sx={{ borderBottom: '1px solid #f0f0f0' }}>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#333', borderBottom: 'none', py: 1.5 }}>Family</TableCell>
              <TableCell align="center" sx={{ borderBottom: 'none', py: 1.5 }}>
                <Checkbox 
                  size="small" 
                  checked={formData.coverage.family.unlimited}
                  onChange={(e) => handleCoverageChange('family', 'unlimited', e.target.checked)}
                  sx={{ p: 0.5, color: '#ccc', '&.Mui-checked': { color: '#1976d2' } }}
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
                    startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#555' }}>$</Typography></InputAdornment>,
                  }}
                  sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#555' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <TextField 
                  fullWidth
                  size="small" 
                  value={formData.coverage.family.usedAmount}
                  disabled
                  placeholder="Auto-"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#aaa' }}>$</Typography></InputAdornment>,
                  }}
                  sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#aaa' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <TextField 
                  fullWidth
                  size="small" 
                  type="text"
                  placeholder="mm / dd / yyyy"
                  value={formData.coverage.family.usedAmountDate || ''}
                  onChange={(e) => handleCoverageChange('family', 'usedAmountDate', e.target.value)}
                  sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#555' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                />
              </TableCell>
            </TableRow>

            {/* Ortho Row */}
            <TableRow sx={{ borderBottom: '1px solid #f0f0f0' }}>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#333', borderBottom: 'none', py: 1.5 }}>Ortho</TableCell>
              <TableCell align="center" sx={{ borderBottom: 'none', py: 1.5 }}>
                <Checkbox 
                  size="small" 
                  checked={formData.coverage.ortho?.unlimited || false}
                  onChange={(e) => handleCoverageChange('ortho', 'unlimited', e.target.checked)}
                  sx={{ p: 0.5, color: '#ccc', '&.Mui-checked': { color: '#1976d2' } }}
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <TextField 
                  fullWidth
                  size="small" 
                  disabled={formData.coverage.ortho?.unlimited}
                  value={formData.coverage.ortho?.unlimited ? '' : formData.coverage.ortho.annualMax}
                  placeholder={formData.coverage.ortho?.unlimited ? 'Unlimited' : ''}
                  onChange={(e) => handleCoverageChange('ortho', 'annualMax', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#555' }}>$</Typography></InputAdornment>,
                  }}
                  sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#555' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <TextField 
                  fullWidth
                  size="small" 
                  value={formData.coverage.ortho.usedAmount}
                  disabled
                  placeholder="Auto-"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#aaa' }}>$</Typography></InputAdornment>,
                  }}
                  sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#aaa' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                />
              </TableCell>
              <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                <TextField 
                  fullWidth
                  size="small" 
                  type="text"
                  placeholder="mm / dd / yyyy"
                  value={formData.coverage.ortho.usedAmountDate || ''}
                  onChange={(e) => handleCoverageChange('ortho', 'usedAmountDate', e.target.value)}
                  sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#555' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                />
              </TableCell>
            </TableRow>

            {/* Category Rows */}
            {['Diagnostic', 'Preventative', 'Major'].map((label) => {
              const catKey = label.toLowerCase();
              return (
                <TableRow key={label} sx={{ borderBottom: '1px solid #f0f0f0' }}>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#333', borderBottom: 'none', py: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{label}</Typography>
                      <Typography sx={{ color: '#00b09b', fontSize: '0.7rem', ml: 1, cursor: 'pointer', fontWeight: 600 }}>
                        + Add Max
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: 'none', py: 1.5 }}>
                    <Checkbox 
                      size="small" 
                      checked={formData.coverage[catKey]?.unlimited || false}
                      onChange={(e) => handleCoverageChange(catKey, 'unlimited', e.target.checked)}
                      sx={{ p: 0.5, color: '#ccc', '&.Mui-checked': { color: '#1976d2' } }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                    <TextField 
                      fullWidth
                      size="small" 
                      disabled={formData.coverage[catKey]?.unlimited}
                      value={formData.coverage[catKey]?.unlimited ? '' : formData.coverage[catKey]?.annualMax || ''}
                      onChange={(e) => handleCoverageChange(catKey, 'annualMax', e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#555' }}>$</Typography></InputAdornment>,
                      }}
                      sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#555' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
                    <TextField 
                      fullWidth
                      size="small" 
                      value=""
                      disabled
                      placeholder="Auto-"
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: '0.75rem', color: '#aaa' }}>$</Typography></InputAdornment>,
                      }}
                      sx={{ bgcolor: '#f8f9fc', borderRadius: '6px', '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px', color: '#aaa' }, '& fieldset': { borderColor: '#DFE5EC' } }} 
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: 'none', py: 1.5, color: '#999', fontSize: '0.75rem' }}>
                    —
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>

      <FormControlLabel 
        sx={{ mt: 1.5, ml: 0.5 }}
        control={<Checkbox size="small" checked={formData.honorWriteOff || false} onChange={(e) => handleInputChange('honorWriteOff', e.target.checked)} sx={{ p: 0.5, color: '#ccc', '&.Mui-checked': { color: '#1976d2' } }} />} 
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: '0.75rem', color: '#555' }}>Honor Write Off (When Limitation Reached for In-Network Providers Only)</Typography> 
            <InfoIcon sx={{ fontSize: 14, color: '#bdbdbd' }} />
          </Box>
        } 
      />
    </Box>
  );
};

export default AnnualMaximumsTable;
