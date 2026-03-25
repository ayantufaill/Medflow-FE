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
 * Usage:
 * const { providers, rooms, appointmentTypes, loading } = useDropdownData({
 *   providers: true,
 *   rooms: true,
 *   appointmentTypes: true,
 * });
 */
export const useDropdownData = (options = {}) => {
  const dispatch = useDispatch();
  const {
    providers: needProviders = false,
    rooms: needRooms = false,
    appointmentTypes: needAppointmentTypes = false,
  } = options;

  // Selectors
  const providers = useSelector(selectProviderDropdownList);
  const providersLoading = useSelector(selectProviderDropdownLoading);
  const rooms = useSelector(selectRoomDropdownList);
  const roomsLoading = useSelector(selectRoomDropdownLoading);
  const appointmentTypes = useSelector(selectAppointmentTypeDropdownList);
  const appointmentTypesLoading = useSelector(selectAppointmentTypeDropdownLoading);

  // Fetch only if needed and not already cached
  useEffect(() => {
    if (needProviders) dispatch(fetchAllProvidersForDropdown());
    if (needRooms) dispatch(fetchAllRoomsForDropdown());
    if (needAppointmentTypes) dispatch(fetchAllAppointmentTypesForDropdown());
  }, [dispatch, needProviders, needRooms, needAppointmentTypes]);

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
