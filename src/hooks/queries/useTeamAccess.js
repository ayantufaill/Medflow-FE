import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { teamAccessService } from '../../services/teamAccess.service';

export const teamAccessKeys = {
  all: ['teamAccess'],
  members: (branchId) => [...teamAccessKeys.all, 'members', branchId || 'all'],
  moduleAccess: (userId) => [...teamAccessKeys.all, 'moduleAccess', userId],
};

/** Team roster — GET /users is already scoped server-side to the admin's group or branch. */
export const useTeamMembers = (branchId) =>
  useQuery({
    queryKey: teamAccessKeys.members(branchId),
    queryFn: () => teamAccessService.getTeamMembers(branchId),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useMemberModuleAccess = (userId) =>
  useQuery({
    queryKey: teamAccessKeys.moduleAccess(userId),
    queryFn: () => teamAccessService.getModuleAccess(userId),
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });

export const useUpdateMemberModuleAccess = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, moduleAccess, featureAccess }) =>
      teamAccessService.updateModuleAccess(userId, { moduleAccess, featureAccess }),
    onSuccess: (saved, { userId }) => {
      queryClient.setQueryData(teamAccessKeys.moduleAccess(userId), (prev) => (prev ? { ...prev, ...saved } : prev));
    },
  });
};
