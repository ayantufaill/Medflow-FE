import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRooms, deleteRoom, invalidateRooms, fetchAllRoomsForDropdown, selectRoomList, selectRoomListLoading } from '../../store/slices/roomSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { Box, Typography } from '@mui/material';

import OperatorySetupHeader from '../../components/admin/operatory-setup/OperatorySetupHeader';
import OperatoryList from '../../components/admin/operatory-setup/OperatoryList';
import OfficeFiltersSection from '../../components/admin/operatory-setup/OfficeFiltersSection';
import UserFiltersSection from '../../components/admin/operatory-setup/UserFiltersSection';
import AddOperatoryDialog from '../../components/admin/online-schedule/AddOperatoryDialog';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';

const OperatorySetup = () => {
  const operatories = useSelector(selectRoomList);
  const isLoading = useSelector(selectRoomListLoading);
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();

  const [showDeleted, setShowDeleted] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOperatoryId, setDeleteOperatoryId] = useState(null);

  useEffect(() => {
    dispatch(fetchRooms({ page: 1, limit: 100 }));
  }, [dispatch]);

  const refreshOperatories = useCallback(() => {
    dispatch(invalidateRooms());
    dispatch(fetchRooms({ page: 1, limit: 100 }));
    dispatch(fetchAllRoomsForDropdown());
  }, [dispatch]);

  const handleDelete = useCallback((id) => {
    setDeleteOperatoryId(id);
  }, []);

  const confirmDeleteOperatory = async () => {
    if (!deleteOperatoryId) return;
    try {
      await dispatch(deleteRoom(deleteOperatoryId)).unwrap();
      showSnackbar('Operatory deleted successfully', 'success');
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to delete operatory', 'error');
    } finally {
      setDeleteOperatoryId(null);
    }
  };

  const handleToggleShowDeleted = useCallback((e) => {
    setShowDeleted(e.target.checked);
  }, []);

  const handleAddOperatory = useCallback(() => {
    setAddOpen(true);
  }, []);

  const handleAddOfficeFilter = useCallback(() => {
    // TODO: open add office-filter dialog
  }, []);

  const handleAddUserFilter = useCallback(() => {
    // TODO: open add user-filter dialog
  }, []);

  const visibleOperatories = useMemo(
    () => (showDeleted ? operatories : operatories.filter((op) => op.isActive !== false)),
    [operatories, showDeleted]
  );

  return (
    <Box
      sx={{
        bgcolor: '#FBFCFE',
        border: '1px solid #e8eaf0',
        borderRadius: 2,
        p: 3,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1d22', mb: 2.5 }}>
        Operatory Setup
      </Typography>

      <Box
        sx={{
          bgcolor: '#ffffff',
          border: '1px solid #e8eaf0',
          borderRadius: 2,
          p: 2.5,
        }}
      >
        <OperatorySetupHeader
          onAddOperatory={handleAddOperatory}
          showDeleted={showDeleted}
          onToggleShowDeleted={handleToggleShowDeleted}
        />
        <OperatoryList operatories={visibleOperatories} onDeleteOperatory={handleDelete} />
      </Box>

      <OfficeFiltersSection onAddFilter={handleAddOfficeFilter} />

      <UserFiltersSection onAddFilter={handleAddUserFilter} />

      {addOpen && (
        <AddOperatoryDialog
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSuccess={refreshOperatories}
        />
      )}

      <ConfirmationDialog
        open={!!deleteOperatoryId}
        onClose={() => setDeleteOperatoryId(null)}
        onConfirm={confirmDeleteOperatory}
        title="Delete Operatory"
        message="Are you sure you want to delete this operatory?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
      />
    </Box>
  );
};

export default OperatorySetup;