import React, { useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import { recareCategories } from '../../../../constants/recareCategories';
import { COLORS } from '../../../../constants/colors';
import RecareList from './RecareList';

// Helper to classify a row into one of the chart categories
const getRowCategory = (row) => row.category;

const RecareCategoryDialog = ({ open, onClose, category, month }) => {
  const printFnRef = useRef(null);
  const categoryItem = recareCategories.find(
    (c) => c.name === category || c.key === category
  );

  const handlePrint = () => {
    if (printFnRef.current) {
      printFnRef.current();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      sx={{
        zIndex: 9999,
      }}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          m: 2,
          maxHeight: '90vh',
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        },
      }}
    >
      {/* Header: matched to EditProcedureDrawer (SURFACE_TINT: #f3f8fd with BORDER: #e0e5eb) */}
      <DialogTitle
        sx={{
          m: 0,
          px: '25px',
          py: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography
              sx={{
                fontSize: '15px',
                fontWeight: 600,
                color: COLORS.TEXT_PRIMARY,
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.2,
              }}
            >
              {category || 'Patients'}
            </Typography>
            {categoryItem && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.25,
                  py: 0.25,
                  borderRadius: '12px',
                  backgroundColor: `${categoryItem.color}18`,
                  border: `1px solid ${categoryItem.color}35`,
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: categoryItem.color,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: COLORS.TEXT_SECONDARY,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {categoryItem.name}
                </Typography>
              </Box>
            )}
          </Box>
          <Typography
            sx={{
              fontSize: '13px',
              color: COLORS.TEXT_SECONDARY,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Patients due for their recare{month ? ` • Month: ${month}` : ''}
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: COLORS.TEXT_SECONDARY,
            borderRadius: '8px',
            p: 0.75,
            '&:hover': {
              backgroundColor: COLORS.SURFACE_HOVER,
              color: COLORS.TEXT_PRIMARY,
            },
          }}
        >
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      {/* Body: matched to EditProcedureDrawer (pure white #ffffff body) */}
      <DialogContent
        sx={{
          p: 2.5,
          backgroundColor: '#ffffff',
          overflowX: 'auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {category && (
          <RecareList
            hideFilters={true}
            forcedCategory={category}
            forcedMonth={month}
            getRowCategory={getRowCategory}
            onPrintReady={(fn) => {
              printFnRef.current = fn;
            }}
          />
        )}
      </DialogContent>

      {/* Footer: matched to EditProcedureDrawer */}
      <DialogActions
        sx={{
          px: '25px',
          py: 2,
          borderTop: `1px solid ${COLORS.BORDER}`,
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 1.5,
          flexShrink: 0,
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            minWidth: 100,
            height: 38,
            textTransform: 'none',
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_BODY,
            fontWeight: 600,
            fontSize: '13px',
            fontFamily: "'Inter', sans-serif",
            borderRadius: '8px',
            px: 2.5,
            '&:hover': {
              backgroundColor: COLORS.SURFACE_HOVER,
              borderColor: COLORS.TEXT_MUTED,
            },
          }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          startIcon={<PrintOutlinedIcon sx={{ fontSize: 18 }} />}
          onClick={handlePrint}
          sx={{
            minWidth: 100,
            height: 38,
            textTransform: 'none',
            backgroundColor: COLORS.ACCENT,
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '13px',
            fontFamily: "'Inter', sans-serif",
            borderRadius: '8px',
            px: 2.5,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: COLORS.ACCENT_HOVER,
              boxShadow: 'none',
            },
          }}
        >
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecareCategoryDialog;
