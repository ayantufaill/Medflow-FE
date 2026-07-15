import React from 'react';
import { Stack, Box, Typography, Alert } from '@mui/material';

const AssignRoles = ({ roles, selectedRoleIds, toggleRole, saving }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
    {roles.length === 0 ? (
      <Alert severity="info">No roles available</Alert>
    ) : (
      <Stack direction="row" flexWrap="wrap" gap={2}>
        {roles.map((role) => {
          const id       = role._id || role.id;
          const selected = selectedRoleIds.includes(id);
          return (
            <Box
              key={id}
              onClick={() => !saving && toggleRole(id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1,
                border: `1.5px solid ${selected ? '#2262EF' : '#E5E7EB'}`,
                borderRadius: '8px',
                cursor: saving ? 'default' : 'pointer',
                backgroundColor: '#fff',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: saving ? undefined : '#2262EF'
                }
              }}
            >
              <Box sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: `2px solid ${selected ? '#2262EF' : '#D1D5DB'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {selected && <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#2262EF' }} />}
              </Box>
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px', color: '#111', textTransform: 'capitalize' }}>
                {role.name}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    )}

    <Typography sx={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', color: '#6B7280', fontSize: '12px', lineHeight: '18px' }}>
      Dentist, Hygienist, Assistant → Provider Fields<br/>
      Patient → Patient Profile Fields
    </Typography>
  </Box>
);

export default AssignRoles;
