import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRooms, deleteRoom, selectRoomList, selectRoomListLoading } from '../../store/slices/roomSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { Box, Typography } from '@mui/material';

import OperatorySetupHeader from '../../components/admin/operatory-setup/OperatorySetupHeader';
import OperatoryList from '../../components/admin/operatory-setup/OperatoryList';
import OfficeFiltersSection from '../../components/admin/operatory-setup/OfficeFiltersSection';
import UserFiltersSection from '../../components/admin/operatory-setup/UserFiltersSection';

const OperatorySetup = () => {
  const operatories = useSelector(selectRoomList);
  const isLoading = useSelector(selectRoomListLoading);
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();

  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    dispatch(fetchRooms({ page: 1, limit: 100 }));
  }, [dispatch]);

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm('Are you sure you want to delete this operatory?')) return;
      try {
        await dispatch(deleteRoom(id)).unwrap();
        showSnackbar('Operatory deleted successfully', 'success');
      } catch (error) {
        console.error(error);
        showSnackbar('Failed to delete operatory', 'error');
      }
    },
    [dispatch, showSnackbar]
  );

  const handleToggleShowDeleted = useCallback((e) => {
    setShowDeleted(e.target.checked);
    // If the API supports filtering server-side, swap this for:
    // dispatch(fetchRooms({ page: 1, limit: 100, includeDeleted: e.target.checked }));
  }, []);

  const handleAddOperatory = useCallback(() => {
    // TODO: open add-operatory dialog / navigate to create form
  }, []);

  const handleAddOfficeFilter = useCallback(() => {
    // TODO: open add office-filter dialog
  }, []);

  const handleAddUserFilter = useCallback(() => {
    // TODO: open add user-filter dialog
  }, []);

  const visibleOperatories = useMemo(
    () => (showDeleted ? operatories : operatories.filter((op) => (op.status || 'Active') !== 'Deleted')),
    [operatories, showDeleted]
  );

  return (
    <Box
      sx={{
        bgcolor: '#f6f8fb',
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
    </Box>
  );
};

export default OperatorySetup;