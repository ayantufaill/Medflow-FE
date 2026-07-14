import React, { useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Controller } from 'react-hook-form';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SectionContainer from './SectionContainer';

const OfficeLogoUpload = ({ control, logoPreview, handleLogoChange, handleRemoveLogo }) => {
  const fileInputRef = useRef(null);

  return (
    <SectionContainer title="Upload your Office Logo" icon={ReceiptLongIcon}>
      <Controller
        name="logo"
        control={control}
        render={({ field: { onChange } }) => (
          <Box sx={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", width: '100%', px: { xs: 0, md: 5 } }}>
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: '2px dashed #e5e7eb',
                borderRadius: '12px',
                p: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                cursor: 'pointer',
                bgcolor: '#f8fafc',
                transition: 'border-color 0.2s',
                '&:hover': { borderColor: '#3b82f6' },
                minHeight: 180,
              }}
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  style={{
                    maxWidth: 200,
                    maxHeight: 120,
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <>
                  <CloudUploadOutlinedIcon sx={{ fontSize: 48, color: '#9ca3af' }} />
                  <Typography variant="body2" sx={{ color: '#6b7280', textAlign: 'center', mt: 1 }}>
                    Click to upload or drag and drop
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9ca3af', textAlign: 'center' }}>
                    Please make sure the image does not exceed 500x500
                  </Typography>
                </>
              )}
            </Box>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              style={{ display: 'none' }}
              onChange={(e) => handleLogoChange(e, onChange)}
            />
            {logoPreview && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Button
                  size="small"
                  variant="text"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveLogo(onChange);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                >
                  Remove logo
                </Button>
              </Box>
            )}
          </Box>
        )}
      />
    </SectionContainer>
  );
};

export default OfficeLogoUpload;
