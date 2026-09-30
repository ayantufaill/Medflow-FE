import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  TextField,
  Chip,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useUpdateRole } from '../../hooks/mutations/useRoleMutations';
import { usePermissionCatalog } from '../../hooks/queries/useRoles';

const RolePermissionsGrid = ({ role }) => {
  const updateRoleMutation = useUpdateRole();
  const { data: catalog, isLoading } = usePermissionCatalog();

  const handleToggle = (key, lockDateAware, isChecked) => {
    let updatedPermissions = { ...(role?.permissions || {}) };
    
    if (isChecked) {
      if (lockDateAware) {
        updatedPermissions[key] = { allowed: true, lockDays: null };
      } else {
        updatedPermissions[key] = true;
      }
    } else {
      delete updatedPermissions[key];
    }

    updateRoleMutation.mutate({
      roleId: role?.id || role?._id,
      roleData: { permissions: updatedPermissions }
    });
  };

  const handleLockDaysChange = (key, value) => {
    let updatedPermissions = { ...(role?.permissions || {}) };
    const numValue = parseInt(value, 10);
    
    if (updatedPermissions[key] && typeof updatedPermissions[key] === 'object') {
      updatedPermissions[key] = {
        ...updatedPermissions[key],
        lockDays: isNaN(numValue) ? null : numValue
      };
    } else if (updatedPermissions[key] === true) {
      updatedPermissions[key] = {
        allowed: true,
        lockDays: isNaN(numValue) ? null : numValue
      };
    }

    updateRoleMutation.mutate({
      roleId: role?.id || role?._id,
      roleData: { permissions: updatedPermissions }
    });
  };

  if (isLoading) {
    return <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  }

  if (!catalog || catalog.length === 0) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography>No permission catalog found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 4, pb: 4, pt: 1 }}>
      {catalog.map((moduleConfig) => (
        <Accordion key={moduleConfig.module} sx={{ mb: 1, border: '1px solid #E2E8F0', boxShadow: 'none', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            <Typography sx={{ fontWeight: 600, color: '#334155' }}>{moduleConfig.module}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {moduleConfig.permissions.map((perm) => {
                const permValue = role?.permissions?.[perm.key];
                const isChecked = typeof permValue === 'object' && permValue !== null ? permValue?.allowed === true : permValue === true;
                const lockDays = typeof permValue === 'object' && permValue !== null ? permValue.lockDays : '';

                return (
                  <Box key={perm.key} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isChecked}
                            onChange={(e) => handleToggle(perm.key, perm.lockDateAware, e.target.checked)}
                            disabled={updateRoleMutation.isPending}
                          />
                        }
                        label={perm.label}
                      />
                      {perm.isSensitive && (
                        <Chip label="Sensitive" size="small" color="error" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                      )}
                    </Box>
                    {perm.lockDateAware && isChecked && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">Lock Days:</Typography>
                        <TextField
                          size="small"
                          type="number"
                          value={lockDays !== null && lockDays !== undefined ? lockDays : ''}
                          onChange={(e) => handleLockDaysChange(perm.key, e.target.value)}
                          disabled={updateRoleMutation.isPending}
                          sx={{ width: 80 }}
                          placeholder="Global"
                        />
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default RolePermissionsGrid;
