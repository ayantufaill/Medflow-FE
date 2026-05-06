import { useQuery } from '@tanstack/react-query';
import { allergyService } from '../../services/allergy.service';

export const allergyKeys = {
  all: ['allergies'],
  lists: () => [...allergyKeys.all, 'list'],
  byPatient: (patientId) => [...allergyKeys.lists(), { patientId }],
  details: () => [...allergyKeys.all, 'detail'],
  detail: (id) => [...allergyKeys.details(), id],
};

export const useAllergies = (patientId) => {
  return useQuery({
    queryKey: allergyKeys.byPatient(patientId),
    queryFn: () => allergyService.getAllergies(patientId),
    enabled: !!patientId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useAllergy = (allergyId) => {
  return useQuery({
    queryKey: allergyKeys.detail(allergyId),
    queryFn: () => allergyService.getAllergyById(allergyId),
    enabled: !!allergyId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
