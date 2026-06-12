import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from '../../services/patient.service';

export const allergyKeys = {
  all: ['allergies'],
  lists: () => [...allergyKeys.all, 'list'],
  byPatient: (patientId) => [...allergyKeys.lists(), { patientId }],
  details: () => [...allergyKeys.all, 'detail'],
  detail: (id) => [...allergyKeys.details(), id],
};

export const useAllergies = (patientId, isActive = true) => {
  return useQuery({
    queryKey: [...allergyKeys.byPatient(patientId), { isActive }],
    queryFn: () => patientService.getPatientAllergies(patientId, isActive),
    enabled: !!patientId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useAllergy = (patientId, allergyId) => {
  return useQuery({
    queryKey: allergyKeys.detail(allergyId),
    queryFn: () => patientService.getAllergyById(patientId, allergyId),
    enabled: !!allergyId && !!patientId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateAllergy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ patientId, ...data }) => patientService.createPatientAllergy(patientId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: allergyKeys.byPatient(variables.patientId) });
      queryClient.invalidateQueries({ queryKey: allergyKeys.lists() });
    },
  });
};

export const useUpdateAllergy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ patientId, allergyId, updates }) => 
      patientService.updatePatientAllergy(patientId, allergyId, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: allergyKeys.byPatient(variables.patientId) });
      queryClient.invalidateQueries({ queryKey: allergyKeys.detail(variables.allergyId) });
    },
  });
};

export const useDeleteAllergy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ patientId, allergyId }) => patientService.deletePatientAllergy(patientId, allergyId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: allergyKeys.byPatient(variables.patientId) });
      queryClient.invalidateQueries({ queryKey: allergyKeys.detail(variables.allergyId) });
    },
  });
};
