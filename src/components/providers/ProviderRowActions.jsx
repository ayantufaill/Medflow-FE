import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';

import ActivateSvg from '../../assets/usermanagement icons/activate.svg';
import DeactivateSvg from '../../assets/usermanagement icons/deactivate.svg';
import EditSvg from '../../assets/practicesetupicon/editicon.svg';

const ProviderRowActions = ({ provider, handleToggleActive, setEditDialog, actionLoading, getProviderName }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
      <Tooltip title={provider.isActive ? 'Deactivate' : 'Activate'}>
        <span>
          <IconButton
            size="small"
            onClick={() => handleToggleActive(provider)}
            disabled={actionLoading}
            sx={{ p: 0.5 }}
          >
            <img src={provider.isActive ? DeactivateSvg : ActivateSvg} alt="toggle active" width="18" height="18" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Edit">
        <IconButton
          size="small"
          onClick={() => setEditDialog({ open: true, providerId: provider._id || provider.id, providerName: getProviderName(provider) })}
          sx={{ p: 0.5 }}
        >
          <img src={EditSvg} alt="edit" width="16" height="16" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ProviderRowActions;
