import React, { useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
} from '@mui/material';
import { useUpdateRole } from '../../hooks/mutations/useRoleMutations';

const RolePermissionsGrid = ({ role }) => {
  const updateRoleMutation = useUpdateRole();

  // Parse permissions robustly regardless of backend structure
  const permissionsData = useMemo(() => {
    if (!role) return [];
    
    // Check if permissions is an array of objects
    if (Array.isArray(role.permissions)) {
      return role.permissions;
    }
    
    // Check if permissions is an object mapping (e.g. { AccountCredit: { create: true, ... } })
    if (role.permissions && typeof role.permissions === 'object') {
      return Object.entries(role.permissions).map(([resource, actions]) => ({
        resource,
        ...actions
      }));
    }

    // Check if it's named 'resources' instead of 'permissions'
    if (Array.isArray(role.resources)) {
      return role.resources;
    }
    
    if (role.resources && typeof role.resources === 'object') {
      return Object.entries(role.resources).map(([resource, actions]) => ({
        resource,
        ...actions
      }));
    }

    return [];
  }, [role]);

  const handleToggle = (resourceName, actionName, currentValue) => {
    let updatedRoleData = {};
    
    if (Array.isArray(role.permissions)) {
      updatedRoleData.permissions = role.permissions.map(p => {
        const name = p.resource || p.resourceName || p.name;
        if (name === resourceName) {
          return { ...p, [actionName]: !currentValue };
        }
        return p;
      });
    } else if (role.permissions && typeof role.permissions === 'object') {
      updatedRoleData.permissions = {
        ...role.permissions,
        [resourceName]: {
          ...role.permissions[resourceName],
          [actionName]: !currentValue
        }
      };
    } else if (Array.isArray(role.resources)) {
      updatedRoleData.resources = role.resources.map(p => {
        const name = p.resource || p.resourceName || p.name;
        if (name === resourceName) {
          return { ...p, [actionName]: !currentValue };
        }
        return p;
      });
    } else if (role.resources && typeof role.resources === 'object') {
      updatedRoleData.resources = {
        ...role.resources,
        [resourceName]: {
          ...role.resources[resourceName],
          [actionName]: !currentValue
        }
      };
    } else {
      return; // Cannot update if structure is unrecognized
    }

    updateRoleMutation.mutate({
      roleId: role.id || role._id,
      roleData: updatedRoleData
    });
  };

  const getResourceName = (p) => p.resource || p.resourceName || p.name || 'Unknown Resource';

  if (permissionsData.length === 0) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography sx={{ color: '#64748B', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>
          No specific resource permissions found for this role.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 4, pb: 4, pt: 1 }}>
      <Box sx={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
              <TableCell sx={{ fontWeight: 600, color: '#334155', fontFamily: 'Inter, sans-serif', fontSize: '12px', borderBottom: '1px solid #E2E8F0', py: 1.5, px: 3 }}>
                Resource
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: '#334155', fontFamily: 'Inter, sans-serif', fontSize: '12px', borderBottom: '1px solid #E2E8F0', py: 1.5 }}>
                Create
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: '#334155', fontFamily: 'Inter, sans-serif', fontSize: '12px', borderBottom: '1px solid #E2E8F0', py: 1.5 }}>
                Read
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: '#334155', fontFamily: 'Inter, sans-serif', fontSize: '12px', borderBottom: '1px solid #E2E8F0', py: 1.5 }}>
                Update
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: '#334155', fontFamily: 'Inter, sans-serif', fontSize: '12px', borderBottom: '1px solid #E2E8F0', py: 1.5 }}>
                Delete
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {permissionsData.map((p, index) => {
              const resourceName = getResourceName(p);
              return (
                <TableRow key={index} sx={{ '&:last-child td': { borderBottom: 0 }, '&:hover': { backgroundColor: '#F8FAFC' } }}>
                  <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#475569', borderBottom: '1px solid #F1F5F9', px: 3 }}>
                    {resourceName}
                  </TableCell>
                  {['create', 'read', 'update', 'delete'].map((action) => (
                    <TableCell key={action} align="center" sx={{ borderBottom: '1px solid #F1F5F9', py: 0.5 }}>
                      <Checkbox
                        checked={Boolean(p[action])}
                        onChange={() => handleToggle(resourceName, action, p[action])}
                        size="small"
                        disabled={updateRoleMutation.isPending}
                        sx={{
                          color: '#CBD5E1',
                          '&.Mui-checked': { color: '#2262EF' },
                          p: 0.5
                        }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default RolePermissionsGrid;
