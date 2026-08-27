import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Dialog,
} from '@mui/material';
import { Add as AddIcon, KeyboardArrowDown as KeyboardArrowDownIcon, KeyboardArrowRight as KeyboardArrowRightIcon, Close as CloseIcon } from '@mui/icons-material';
import syncIcon from '../../assets/claimicons/refreshicon.svg';
import editIcon from '../../assets/practicesetupicon/editicon.svg';
import deleteIcon from '../../assets/practicesetupicon/deleteicon.svg';

import { useRoles } from '../../hooks/queries/useRoles';
import AddRoleModal from './AddRoleModal';
import EditRoleModal from './EditRoleModal';
import RolePermissionsGrid from './RolePermissionsGrid';
import { useDeleteRole } from '../../hooks/mutations/useRoleMutations';

const RolesManagement = () => {
  const { data: roles = [], isLoading, error } = useRoles();
  console.log("ROLES DATA:", roles);
  if (error) console.error("ROLES ERROR:", error);
  const deleteRoleMutation = useDeleteRole();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEditRole, setSelectedEditRole] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [showInactive, setShowInactive] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (roleId) => {
    setExpandedRows(prev => ({
      ...prev,
      [roleId]: !prev[roleId]
    }));
  };

  const handleDelete = (roleId) => {
    setRoleToDelete(roleId);
  };

  const confirmDelete = () => {
    if (roleToDelete) {
      deleteRoleMutation.mutate(roleToDelete, {
        onSuccess: () => setRoleToDelete(null),
      });
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
      {/* Header and Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ fontFamily: 'Inter, sans-serif', color: '#111' }}>
          Roles
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<img src={syncIcon} alt="Sync" style={{ width: 16, height: 16 }} />}
            sx={{
              textTransform: 'none',
              fontFamily: 'Inter',
              fontSize: '13px',
              color: '#64748B',
              '&:hover': { backgroundColor: 'transparent', color: '#2262EF' }
            }}
          >
            Sync
          </Button>

          <FormControlLabel
            control={
              <Checkbox 
                size="small" 
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                sx={{ 
                  color: '#CBD5E1', 
                  '&.Mui-checked': { color: '#2262EF' },
                  '& .MuiSvgIcon-root': { fontSize: 18 }
                }} 
              />
            }
            label={
              <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', color: '#475569' }}>
                Show inactive roles
              </Typography>
            }
            sx={{ margin: 0 }}
          />

          <Button
            variant="contained"
            onClick={() => setIsAddModalOpen(true)}
            sx={{
              backgroundColor: '#2262EF',
              color: '#fff',
              textTransform: 'none',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              height: '36px',
              borderRadius: '6px',
              px: '20px',
              '&:hover': { backgroundColor: '#1d4ed8' },
              boxShadow: 'none',
            }}
          >
            Add Role
          </Button>
        </Box>
      </Box>

      {/* Filter Bar (Optional if we want to put sync/checkbox here later, but kept in header for now) */}

      {/* Table */}
      <Box sx={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 600, color: '#1E293B', py: 1.5, borderBottom: '1px solid #E2E8F0' }}>Role</TableCell>
                <TableCell align="right" sx={{ py: 1.5, borderBottom: '1px solid #E2E8F0' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                    <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', color: '#64748B' }}>Loading roles...</Typography>
                  </TableCell>
                </TableRow>
              ) : roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                    <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', color: '#64748B' }}>No roles found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <React.Fragment key={role.id || role._id}>
                    <TableRow sx={{ '& > *': { borderBottom: '1px solid #E2E8F0' }, '&:hover': { backgroundColor: '#F8FAFC' } }}>
                      <TableCell sx={{ py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => toggleRow(role.id || role._id)}
                            sx={{ color: '#64748B', p: 0.5 }}
                          >
                            {expandedRows[role.id || role._id] ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowRightIcon fontSize="small" />}
                          </IconButton>
                          <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 500, color: '#334155' }}>
                            {role.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                          <Button
                            startIcon={<img src={syncIcon} alt="Sync" style={{ width: 14, height: 14 }} />}
                            size="small"
                            sx={{
                              textTransform: 'none',
                              fontFamily: 'Inter',
                              fontSize: '12px',
                              color: '#64748B',
                              minWidth: 'auto',
                              p: '4px 8px',
                              '&:hover': { backgroundColor: 'transparent', color: '#2262EF' }
                            }}
                          >
                            Sync
                          </Button>
                          <IconButton 
                            size="small" 
                            onClick={() => setSelectedEditRole(role)}
                            sx={{ color: '#3CA2E0', '&:hover': { backgroundColor: '#F0F9FF' } }}
                          >
                            <img src={editIcon} alt="Edit" style={{ width: 16, height: 16 }} />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDelete(role.id || role._id)}
                            sx={{ color: '#EF4444', '&:hover': { backgroundColor: '#FEF2F2' } }}
                          >
                            <img src={deleteIcon} alt="Delete" style={{ width: 16, height: 16 }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                    
                    {/* Collapsed Row for Permissions */}
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
                        <Collapse in={expandedRows[role.id || role._id]} timeout="auto" unmountOnExit>
                          <RolePermissionsGrid role={role} />
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modals */}
      <AddRoleModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      
      <EditRoleModal 
        open={Boolean(selectedEditRole)} 
        onClose={() => setSelectedEditRole(null)} 
        role={selectedEditRole}
      />

      {/* Delete Confirmation Modal */}
      <Dialog
        open={Boolean(roleToDelete)}
        onClose={() => setRoleToDelete(null)}
        maxWidth="xs"
        fullWidth
        sx={{ zIndex: 14000 }}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            margin: '16px',
            width: '100%',
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Box sx={{
            px: '25px', py: '18px', flexShrink: 0,
            borderBottom: `1px solid #e0e0e0`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            backgroundColor: '#F3F8FD',
          }}>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 700, color: '#111' }}>
              Delete Role
            </Typography>
            <IconButton onClick={() => setRoleToDelete(null)} size="small" sx={{ color: '#64748B' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Body */}
          <Box sx={{ px: '25px', py: '24px', overflowY: 'auto', flexGrow: 1 }}>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#334155' }}>
              Are you sure you want to delete this role? This action cannot be undone.
            </Typography>
          </Box>

          {/* Footer */}
          <Box sx={{
            px: '25px', py: '16px', flexShrink: 0,
            borderTop: `1px solid #e0e0e0`,
            display: 'flex', justifyContent: 'flex-end', gap: 2,
            backgroundColor: '#ffffff',
          }}>
            <Button
              variant="outlined"
              onClick={() => setRoleToDelete(null)}
              sx={{
                textTransform: 'none',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                borderRadius: '6px',
                color: '#475569',
                borderColor: '#CBD5E1',
                px: 3,
                '&:hover': {
                  backgroundColor: '#F1F5F9',
                  borderColor: '#94A3B8',
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={confirmDelete}
              disabled={deleteRoleMutation.isPending}
              sx={{
                textTransform: 'none',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                borderRadius: '6px',
                backgroundColor: '#EF4444',
                color: '#ffffff',
                px: 3,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#DC2626',
                  boxShadow: 'none',
                }
              }}
            >
              {deleteRoleMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Paper>
  );
};

export default RolesManagement;
