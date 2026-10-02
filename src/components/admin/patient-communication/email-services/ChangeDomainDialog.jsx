import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon, LanguageOutlined as DomainIcon } from '@mui/icons-material';

/**
 * Sets up the practice's first sending domain, or replaces the current one.
 * Domain validation/normalization happens server-side; `onSubmit` should
 * resolve on success and throw an Error carrying the server's message otherwise.
 */
const ChangeDomainDialog = ({ open, currentDomain, onClose, onSubmit }) => {
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isChange = Boolean(currentDomain);
  const title = isChange ? 'Change Domain' : 'Set Up Domain';

  const resetForm = () => {
    setDomain('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!domain.trim()) {
      setError('Enter a domain, e.g. yourpractice.com');
      return;
    }
    try {
      setSubmitting(true);
      await onSubmit(domain.trim());
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      sx={{ zIndex: 9999 }}
      TransitionProps={{ onExited: resetForm }}
      PaperProps={{
        sx: { borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' },
      }}
    >
      {/* The form must be a flex column so DialogContent scrolls and the action buttons stay visible on short screens. */}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: '1 1 auto' }}>
        <Box
          sx={{
            display: 'flex', alignItems: 'center', gap: '12px',
            px: '20px', py: '16px',
            borderBottom: '1px solid #e0e5eb',
            backgroundColor: '#f3f8fd',
          }}
        >
          <Box
            sx={{
              width: '36px', height: '36px', borderRadius: '8px',
              backgroundColor: '#eff6ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <DomainIcon sx={{ fontSize: '20px', color: '#2262ef' }} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
            <Typography sx={{ fontFamily: 'Inter', fontSize: '15px', fontWeight: 700, color: '#09121f' }}>
              {title}
            </Typography>
            <Typography sx={{ fontWeight: 400, color: '#5c646f', fontFamily: 'Inter', fontSize: '11px' }}>
              New DNS records will be generated for this domain.
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            disabled={submitting}
            sx={{ color: '#6b7280', '&:hover': { color: '#111928', backgroundColor: '#e5e7eb' } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ py: 3, px: 4 }}>
          <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', color: '#5c646f', mb: 2.5 }}>
            {isChange ? (
              <>
                Enter the new domain to replace <strong>{currentDomain}</strong>.
              </>
            ) : (
              'Enter the domain your practice sends email from, e.g. the part after the @ in info@yourpractice.com.'
            )}
          </Typography>
          <TextField
            autoFocus
            label={isChange ? 'New domain' : 'Domain'}
            placeholder="yourpractice.com"
            variant="outlined"
            size="small"
            fullWidth
            required
            value={domain}
            disabled={submitting}
            onChange={(e) => {
              setDomain(e.target.value);
              if (error) setError('');
            }}
            error={Boolean(error)}
            helperText={error || ' '}
            InputLabelProps={{ sx: { fontFamily: 'Inter', fontSize: '13px' } }}
            sx={{
              '& .MuiInputBase-input': { fontFamily: 'Inter', fontSize: '13px' },
              '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: '#fff' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 4, py: 3, borderTop: '1px solid #f1f5f9', gap: 1.5 }}>
          <Button
            onClick={onClose}
            disabled={submitting}
            variant="outlined"
            sx={{
              fontFamily: 'Inter', fontSize: '13px', fontWeight: 500,
              textTransform: 'none', borderRadius: '8px',
              border: '1px solid #d0d5dd', color: '#374151',
              px: '16px', py: '7px',
              '&:hover': { borderColor: '#9aa3ae', backgroundColor: '#f9fafb' },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : null}
            sx={{
              fontFamily: 'Inter', fontSize: '13px', fontWeight: 600,
              textTransform: 'none', borderRadius: '8px',
              backgroundColor: isChange ? '#ef4444' : '#2262ef', color: '#fff',
              px: '20px', py: '7px',
              boxShadow: 'none',
              '&:hover': { backgroundColor: isChange ? '#dc2626' : '#1a50cc', boxShadow: 'none' },
              '&.Mui-disabled': { color: '#fff', opacity: 0.7 },
            }}
          >
            {submitting ? 'Generating...' : title}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ChangeDomainDialog;
