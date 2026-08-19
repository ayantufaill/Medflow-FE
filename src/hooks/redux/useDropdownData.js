import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAllProvidersForDropdown,
  selectProviderDropdownList,
  selectProviderDropdownLoading,
} from '../../store/slices/providerSlice';
import {
  fetchAllRoomsForDropdown,
  selectRoomDropdownList,
  selectRoomDropdownLoading,
} from '../../store/slices/roomSlice';
import {
  fetchAllAppointmentTypesForDropdown,
  selectAppointmentTypeDropdownList,
  selectAppointmentTypeDropdownLoading,
} from '../../store/slices/appointmentTypeSlice';

/**
 * useDropdownData - fetches and caches dropdown data for forms
 * 
 * Providers, Rooms, Appointment Types are fetched ONCE and cached.
 * Subsequent calls return cached data without API calls.
 * 
 * Pass `branchId` to scope providers/rooms to a single branch — e.g. once a
 * branch is picked in a booking form. Re-fetches automatically when branchId
 * changes (the underlying thunks cache per-branch, not just once globally).
 *
 * Usage:
 * const { providers, rooms, appointmentTypes, loading } = useDropdownData({
 *   providers: true,
 *   rooms: true,
 *   appointmentTypes: true,
 *   branchId: selectedBranchId,
 * });
 */
export const useDropdownData = (options = {}) => {
  const dispatch = useDispatch();
  const {
    providers: needProviders = false,
    rooms: needRooms = false,
    appointmentTypes: needAppointmentTypes = false,
    branchId = null,
  } = options;

  // Selectors
  const providers = useSelector(selectProviderDropdownList);
  const providersLoading = useSelector(selectProviderDropdownLoading);
  const rooms = useSelector(selectRoomDropdownList);
  const roomsLoading = useSelector(selectRoomDropdownLoading);
  const appointmentTypes = useSelector(selectAppointmentTypeDropdownList);
  const appointmentTypesLoading = useSelector(selectAppointmentTypeDropdownLoading);

  // Fetch only if needed and not already cached for this branch
  useEffect(() => {
    if (needProviders) dispatch(fetchAllProvidersForDropdown(branchId));
    if (needRooms) dispatch(fetchAllRoomsForDropdown(branchId));
    if (needAppointmentTypes) dispatch(fetchAllAppointmentTypesForDropdown());
  }, [dispatch, needProviders, needRooms, needAppointmentTypes, branchId]);

  return {
    providers,
    providersLoading,
    rooms,
    roomsLoading,
    appointmentTypes,
    appointmentTypesLoading,
    loading: providersLoading || roomsLoading || appointmentTypesLoading,
  };
};
