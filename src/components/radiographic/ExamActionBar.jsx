import React from "react";
import { Box, Button, Stack } from "@mui/material";
import ConfirmationDialog from "../shared/ConfirmationDialog";

import saveExamIcon from '../../assets/clinicalicons/saveexamicon.svg';
import signFinalizeIcon from '../../assets/clinicalicons/sign&finalizeicon.svg';

const ExamActionBar = ({ 
  isSigned, 
  onSave, 
  onSign, 
  onDelete,
  signDialogOpen,
  onSignDialogClose,
  onConfirmSign,
  signLoading,
  deleteDialogOpen,
  onDeleteDialogClose,
  onConfirmDelete
}) => {
  return (
    <>
      <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 4, pr: 1 }}>
        <Button
          variant="outlined"
          onClick={onSave}
          disabled={isSigned}
          startIcon={<img src={saveExamIcon} alt="Save Exam" style={{ width: 16, height: 16, opacity: isSigned ? 0.5 : 1 }} />}
          sx={{ 
            textTransform: 'none', 
            px: 2.5,
            py: 0.7,
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#374151',
            borderColor: '#d1d5db',
            borderRadius: '8px',
            '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' }
          }}
        >
          Save Exam
        </Button>
        <Button
          variant="contained"
          onClick={onSign}
          disabled={isSigned}
          startIcon={<img src={signFinalizeIcon} alt="Sign & Finalize" style={{ width: 16, height: 16, filter: 'brightness(0) invert(1)', opacity: isSigned ? 0.5 : 1 }} />}
          sx={{ 
            textTransform: 'none', 
            px: 2.5,
            py: 0.7,
            fontSize: '0.8rem',
            fontWeight: 600,
            bgcolor: '#2563eb',
            borderRadius: '8px',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#1d4ed8', boxShadow: 'none' },
            '&.Mui-disabled': { bgcolor: '#93c5fd', color: '#fff' }
          }}
        >
          Sign & Finalize
        </Button>
        <Button 
          variant="contained" 
          disabled={isSigned}
          onClick={onDelete}
          sx={{ 
            bgcolor: '#ef4444', 
            '&:hover': { bgcolor: '#dc2626' }, 
            textTransform: 'none',
            px: 2.5,
            py: 0.7,
            fontSize: '0.8rem',
            fontWeight: 600,
            borderRadius: '8px',
            boxShadow: 'none',
            '&.Mui-disabled': { bgcolor: '#fca5a5', color: '#fff' }
          }}
        >
          Delete Exam
        </Button>
      </Stack>

      <ConfirmationDialog
        open={signDialogOpen}
        onClose={onSignDialogClose}
        onConfirm={onConfirmSign}
        title="Sign & Lock Exam"
        message="Are you sure you want to sign and lock this exam? This action cannot be undone."
        confirmText="Sign & Lock"
        confirmColor="#0f766e"
        loading={signLoading}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={onDeleteDialogClose}
        onConfirm={onConfirmDelete}
        title="Delete Exam Record"
        message="Are you sure you want to delete this exam? This action cannot be undone."
        confirmText="Delete"
        confirmColor="error"
      />
    </>
  );
};

export default ExamActionBar;
