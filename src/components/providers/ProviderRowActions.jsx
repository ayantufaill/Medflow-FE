import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';

// Custom SVG Icons matching the mockup
const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#111" strokeWidth="1.5" />
    <path d="M7.5 12L10.5 15L16.5 9" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PencilIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 20H21" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16.5 3.5C16.8978 3.10217 17.4374 2.87868 18 2.87868C18.2786 2.87868 18.5544 2.93355 18.8118 3.04015C19.0692 3.14676 19.303 3.30301 19.5 3.5C19.697 3.69698 19.8532 3.93084 19.9598 4.18821C20.0665 4.44558 20.1213 4.72142 20.1213 5C20.1213 5.27857 20.0665 5.55442 19.9598 5.81179C19.8532 6.06915 19.697 6.30301 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProviderRowActions = ({ provider, handleToggleActive, setEditDialog, actionLoading, getProviderName }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
      <Tooltip title={provider.isActive ? 'Deactivate' : 'Activate'}>
        <span>
          <IconButton
            size="small"
            onClick={() => handleToggleActive(provider)}
            disabled={actionLoading}
            sx={{ color: provider.isActive ? '#111' : 'text.disabled' }}
          >
            <CheckCircleIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Edit">
        <IconButton
          size="small"
          onClick={() => setEditDialog({ open: true, providerId: provider._id || provider.id, providerName: getProviderName(provider) })}
          sx={{ color: '#111' }}
        >
          <PencilIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ProviderRowActions;
