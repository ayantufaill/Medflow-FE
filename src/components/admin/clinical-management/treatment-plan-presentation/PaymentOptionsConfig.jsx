import React, { useState } from 'react';
import { Box, Typography, TextField, IconButton, Divider } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const PaymentOptionsConfig = ({
  addedPaymentTypes,
  setAddedPaymentTypes,
  handleAddPaymentOption,
  handleTitleChange,
  handleBodyChange,
  handleVariableValueChange,
  handleInsertVariable
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <Box sx={{ mb: 4, p: 3, backgroundColor: '#fff', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
      <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '1.05rem', mb: 2 }}>
        Payment Options
      </Typography>

      {/* Dynamic Stack of Payment Options */}
      {addedPaymentTypes.map((option, idx) => (
        <Box key={option.id} sx={{ mb: 3.5 }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', mb: 1 }}>
            {option.typeName}
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
            {/* Left: Variables Table */}
            <Box sx={{ flex: 1, minWidth: '300px', border: '1px solid #cbd5e1', borderRadius: 2, overflow: 'hidden', backgroundColor: '#fff' }}>
              <Box sx={{ display: 'flex', backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1', p: '8px 16px' }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', flex: 1.2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Variables</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', flex: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Default Values</Typography>
              </Box>

              {option.variables.map((variable) => (
                <Box
                  key={variable.name}
                  sx={{
                    display: 'flex',
                    borderBottom: '1px solid #f1f5f9',
                    '&:last-child': { borderBottom: 'none' },
                    alignItems: 'center',
                    p: '8px 16px',
                    transition: 'background-color 0.2s',
                    '&:hover': { backgroundColor: '#f8fafc' }
                  }}
                >
                  <Typography
                    onClick={() => handleInsertVariable(option.id, variable.name)}
                    sx={{
                      fontSize: '0.75rem',
                      color: '#3b82f6',
                      fontWeight: 600,
                      flex: 1.2,
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline', color: '#2563eb' }
                    }}
                  >
                    {variable.name}
                  </Typography>

                  {variable.isAuto ? (
                    <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', flex: 1 }}>
                      Auto calculated
                    </Typography>
                  ) : (
                    <TextField
                      size="small"
                      placeholder={variable.placeholder}
                      value={variable.value}
                      onChange={(e) => handleVariableValueChange(option.id, variable.name, e.target.value)}
                      sx={{
                        flex: 1,
                        '& .MuiInputBase-input': {
                          fontSize: '0.75rem',
                          py: 0.6,
                          px: 1.5,
                          color: '#334155',
                          backgroundColor: '#fff'
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e2e8f0',
                          borderRadius: 1.5
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#cbd5e1'
                        },
                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#3b82f6',
                          borderWidth: '1px'
                        }
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>

            {/* Right: Title & Body Textarea */}
            <Box sx={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', minWidth: '40px' }}>
                  Title:
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  value={option.title}
                  onChange={(e) => handleTitleChange(option.id, e.target.value)}
                  sx={{
                    '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.8 },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0', borderRadius: 1.5 }
                  }}
                />
              </Box>

              <TextField
                fullWidth
                multiline
                rows={5}
                value={option.body}
                id={`body-textarea-${option.id}`}
                onChange={(e) => handleBodyChange(option.id, e.target.value)}
                placeholder="Enter description here... Click variables on the left to insert them."
                sx={{
                  '& .MuiInputBase-root': { backgroundColor: '#fff', borderRadius: 1.5 },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                  '& .MuiInputBase-input': { fontSize: '0.85rem', lineHeight: 1.6, color: '#334155' }
                }}
              />

              <Typography sx={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5, fontStyle: 'italic' }}>
                <span style={{ fontSize: '0.9rem' }}>💡</span> To add a variable into your body, simply put your text cursor where you would like to add it, then click on the variable on the left.
              </Typography>
            </Box>

            {/* Far Right: Delete Trash Icon */}
            <Box sx={{ pt: 1 }}>
              <IconButton
                size="small"
                onClick={() => setAddedPaymentTypes(addedPaymentTypes.filter(opt => opt.id !== option.id))}
                sx={{ color: '#ef4444', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 2, '&:hover': { color: '#dc2626', backgroundColor: '#fee2e2' } }}
              >
                <DeleteIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>
            </Box>
          </Box>

          {idx < addedPaymentTypes.length - 1 && <Divider sx={{ mt: 4, mb: 4, borderColor: '#f1f5f9' }} />}
        </Box>
      ))}

      {/* Add new payment option button */}
      <Box sx={{ position: 'relative', display: 'inline-block', mt: addedPaymentTypes.length > 0 ? 2 : 0 }}>
        <Typography
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen(!dropdownOpen);
          }}
          sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#3b82f6', cursor: 'pointer', '&:hover': { color: '#2563eb' } }}
        >
          + Add New Payment Option
        </Typography>

        {dropdownOpen && (
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              zIndex: 1000,
              mt: 1,
              minWidth: 200,
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            {/* Please choose payment kind */}
            <Box
              sx={{
                p: '10px 16px',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                cursor: 'default'
              }}
            >
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Choose Payment Kind
              </Typography>
            </Box>

            {/* Pay In Advance */}
            <Box
              onClick={() => { handleAddPaymentOption('Pay In Advance'); setDropdownOpen(false); }}
              sx={{
                p: '10px 16px',
                color: '#334155',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                '&:hover': { backgroundColor: '#f1f5f9', color: '#0f172a' }
              }}
            >
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                Pay In Advance
              </Typography>
            </Box>

            {/* Pay As You Go */}
            <Box
              onClick={() => { handleAddPaymentOption('Pay As You Go'); setDropdownOpen(false); }}
              sx={{
                p: '10px 16px',
                color: '#334155',
                cursor: 'pointer',
                borderTop: '1px solid #f1f5f9',
                transition: 'background-color 0.2s',
                '&:hover': { backgroundColor: '#f1f5f9', color: '#0f172a' }
              }}
            >
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                Pay As You Go
              </Typography>
            </Box>

            {/* Payment Plan */}
            <Box
              onClick={() => { handleAddPaymentOption('Payment Plan'); setDropdownOpen(false); }}
              sx={{
                p: '10px 16px',
                backgroundColor: '#f0f9ff',
                color: '#0369a1',
                cursor: 'pointer',
                borderTop: '1px solid #e0f2fe',
                transition: 'background-color 0.2s',
                '&:hover': { backgroundColor: '#e0f2fe' }
              }}
            >
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Payment Plan
              </Typography>
            </Box>

            {/* Financing */}
            <Box
              onClick={() => { handleAddPaymentOption('Financing'); setDropdownOpen(false); }}
              sx={{
                p: '10px 16px',
                color: '#334155',
                cursor: 'pointer',
                borderTop: '1px solid #f1f5f9',
                transition: 'background-color 0.2s',
                '&:hover': { backgroundColor: '#f1f5f9', color: '#0f172a' }
              }}
            >
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                Financing
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PaymentOptionsConfig;
